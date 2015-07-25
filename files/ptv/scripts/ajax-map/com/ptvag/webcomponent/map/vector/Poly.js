/**
 * A polygon.
 * <p>
 * Sample code: {@sample Tooltips (2)}
 * 
 * @param   color {string,"rgba(255,0,0,0.7)"}  the color of the polygon.
 *                              The color can be specified as RGB hex values ("#ff0000")
 *                              or as RGB alpha values ("rgba(255,0,0,1.0)").
 * @param   coordinates {var[],[]} the points of the polygon (may be either
 *                              an array of points or an array of alternating
 *                              x and y values or a string with space separated
 *                              alternating x and y values).
 * @param   priority {int,0}    the drawing priority.
 * @param   id {var,null}       the id of the element.
 */
qxp.OO.defineClass("com.ptvag.webcomponent.map.vector.Poly",
    com.ptvag.webcomponent.map.vector.VectorElement,
function(color, coordinates, priority, id) {
    com.ptvag.webcomponent.map.vector.VectorElement.call(this, priority, id);

    var self = this;
    var map = com.ptvag.webcomponent.map;
    var CoordUtil = map.CoordUtil;
    
    var mCoordinatesIterator;
    var mRealCoordinates = null;
    var mZoomForRealCoordinates = null;
    var mMapLeft;
    var mMapTop;
    var mMinX;
    var mMaxX;
    var mMinY;
    var mMaxY;


    // property modifier
    self._modifyCoordinates = function(propValue) {
        if (mCoordinatesIterator != null) {
            mCoordinatesIterator.dispose();
        }
        mCoordinatesIterator = new map.PointListIterator(propValue);
        mZoomForRealCoordinates = null;
        self.refresh();
    };


    // overridden
    self.usesCanvas = function() {
        return true;
    };


    // overridden
    var superDraw = self.draw;
    self.draw = function(container, topLevelContainer, ctx,
                         mapLeft, mapTop, mapZoom) {
        superDraw.apply(self, arguments);

        mMapLeft = mapLeft;
        mMapTop = mapTop;

        var width = parseInt(container.style.width);    // HACK
        var height = parseInt(container.style.height);  // HACK
        var testLeft = 0;
        var testTop = 0;
        var testRight = width;
        var testBottom = height;
        var rotation = self.getVectorLayer().getMap().getVisibleRotation();
        if (rotation != 0) {
            var max = Math.max(width, height);
            var min = Math.min(width, height);
            var sizeNeeded = (max*max + min*min)/max;
            var paddingX = Math.ceil((sizeNeeded - width)/2);
            var paddingY = Math.ceil((sizeNeeded - height)/2);
            testLeft -= paddingX;
            testRight += paddingX;
            testTop -= paddingY;
            testBottom += paddingY;
        }
        if (mZoomForRealCoordinates != mapZoom) {
            mRealCoordinates = [];
            mMinX = null;
            mMaxX = null;
            mMinY = null;
            mMaxY = null;
            mCoordinatesIterator.reset();
            while (mCoordinatesIterator.iterate()) {
                var suPoint = {x:mCoordinatesIterator.x, y:mCoordinatesIterator.y};
                var pixCoords = CoordUtil.smartUnit2Pixel(suPoint, mapZoom);
                var realX = pixCoords.x;
                var realY = pixCoords.y;
                if (mMinX == null || realX < mMinX) {
                    mMinX = realX;
                }
                if (mMaxX == null || realX > mMaxX) {
                    mMaxX = realX;
                }
                if (mMinY == null || realY < mMinY) {
                    mMinY = realY;
                }
                if (mMaxY == null || realY > mMaxY) {
                    mMaxY = realY;
                }
                mRealCoordinates.push(realX);
                mRealCoordinates.push(realY);
            }
            mZoomForRealCoordinates = mapZoom;
        }
        if (mMinX == null || (mMaxX - mapLeft) < testLeft || (mMinX - mapLeft) > testRight ||
                             (mapTop - mMinY) < testTop || (mapTop - mMaxY) > testBottom) {
            return;
        }

        ctx.fillStyle = self.getColor();

        var bounds = { minX:testLeft+mapLeft, minY:mapTop-testBottom,
                       maxX:testRight+mapLeft, maxY:mapTop-testTop };
        // TODO: as soon as an outline is supported for polygons,
        // take the line width into account
        var clippedPolys = CoordUtil.clipPoly(mRealCoordinates, bounds);

        for (var i = 0; i < clippedPolys.length; ++i) {
            ctx.beginPath();
            var poly = clippedPolys[i];
            var vertexCount = poly.length / 2;
            for (var j = 0; j < vertexCount; ++j) {
                if (j == 0) {
                    ctx.moveTo(poly[j*2]-mapLeft, mapTop-poly[j*2 + 1]);
                } else {
                    ctx.lineTo(poly[j*2]-mapLeft, mapTop-poly[j*2 + 1]);
                }
            }
            //ctx.closePath();
            ctx.fill();
            //ctx.stroke();
        }
    };
    
    
    /**
     * Used to connect a {@link SensitiveArea} to the polygon - returns whether
     * the mouse is inside the polygon.
     * 
     * @param   evt {Map}           the event.
     * @param   tolerance {int}     the tolerance in pixels - currently ignored
     *                              for polygons.
     * 
     * @return  {Map}   an associative array with a <code>squareDistance</code>
     *                  property (-1 if the mouse is outside the polygon,
     *                  0 otherwise) and an <code>extendedEventInfo</code>
     *                  property. The latter contains properties that are added
     *                  to click, hover, and similar events.
     *                  <p>
     *                  The following extented properties are available for the
     *                  the <code>Polygon</code> class:
     *                  </p>
     *                  <ul>
     *                      <li><strong>nearestX</strong>: The same as the
     *                          x coordinate of the mouse (in smart units).</li>
     *                      <li><strong>nearestY</strong>: The same as the
     *                          y coordinate of the mouse (in smart units).</li>
     *                  </ul>
     *                  <p>
     *                      The <code>nearestX</code> and <code>nearestY</code>
     *                      properties are used for positioning tooltips.
     *                  </p>
     */
    self.getSquareDistance = function(evt, tolerance) {
        var retVal = {squareDistance:-1};
        if (mZoomForRealCoordinates == null) {
            // no polygon drawn
            return retVal;
        }
        var lineSegmentCount = mRealCoordinates.length / 2 - 1;
        if (lineSegmentCount < 1) {
            // no polygon drawn
            return retVal;
        }
        var coords = self.getVectorLayer().getMap().transformPixelCoords(
            evt.relMouseX, evt.relMouseY, false, true, true);
        var mouseX = coords.x + mMapLeft;
        var mouseY = mMapTop - coords.y;
        if (!CoordUtil.isPointInPoly(mouseX, mouseY, mRealCoordinates)) {
            return retVal;
        }
        retVal.squareDistance = 0;
        var nearestPoint = com.ptvag.webcomponent.map.CoordUtil.pixel2SmartUnit(
            { x:mouseX, y:mouseY }, mZoomForRealCoordinates);
        retVal.extendedEventInfo = { nearestX:nearestPoint.x,
                                     nearestY:nearestPoint.y };
        return retVal;
    };


    // overridden
    var superDispose = self.dispose;
    self.dispose = function() {
        if (self.getDisposed()) {
            return;
        }
        mCoordinatesIterator.dispose();
        superDispose.call(self); 
    };


    if (color != null) {
        self.setColor(color);
    }
    if (coordinates != null) {
        self.setCoordinates(coordinates);
    } else {
        // force modifier call
        self._modifyCoordinates(self.getCoordinates());
    }

    self.refreshOn("color");
});


/**
 * The color of the line.
 * The color can be specified as RGB hex values ("#ff0000")
 * or as RGB alpha values ("rgba(255,0,0,1.0)").
 */
qxp.OO.addProperty({ name:"color", type:qxp.constant.Type.STRING, allowNull:false, defaultValue:"rgba(127,255,0,0.7)" });

/**
 * The points of the polygon (may be either an array of points or an array of
 * alternating x and y values or a string with space separated alternating
 * x and y values).
 */
qxp.OO.addProperty({ name:"coordinates", type:qxp.constant.Type.OBJECT, allowNull:false, defaultValue:[] });
