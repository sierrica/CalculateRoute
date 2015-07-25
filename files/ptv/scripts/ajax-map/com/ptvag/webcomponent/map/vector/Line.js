/**
 * A line with multiple points.
 * <p>
 * Sample code: {@sample Drawing on the map},
 *              {@sample Drawing sidelines}
 * 
 * @param   color {string,"rgba(255,0,0,0.7)"}  the color of the line.
 *                              The color can be specified as RGB hex values ("#ff0000")
 *                              or as RGB alpha values ("rgba(255,0,0,1.0)").
 * @param   pixelSize {double,10}  the width of the line in pixels.
 * @param   coordinates {var[],[]} the points of the line (may be either
 *                              an array of points or an array of alternating
 *                              x and y values or a string with space separated
 *                              alternating x and y values).
 * @param   priority {int,0}    the drawing priority.
 * @param   id {var,null}       the id of the element.
 */
qxp.OO.defineClass("com.ptvag.webcomponent.map.vector.Line",
                  com.ptvag.webcomponent.map.vector.VectorElement,
function(color, pixelSize, coordinates, priority, id) {
    com.ptvag.webcomponent.map.vector.VectorElement.call(this, priority, id);

    var self = this;
    var map = com.ptvag.webcomponent.map;
    var CoordUtil = map.CoordUtil;

    var mCoordinatesIterator = null;
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
        self.setZoomForPixelCoordinates(null);
        self.refresh();
    };


    // overridden
    self.usesCanvas = function() {
        return true;
    };


    var drawArrow = function(ctx, startX, startY, endX, endY, angle, length) {
        var x = endX - startX;
        var y = startY - endY;
        var lineAngle = Math.atan(y/x);
            // Note: Division by zero is OK in JavaScript (yields "infinity"
            // or "-infinity", and atan can deal with both). Only 0/0 yields
            // "NaN" (and this case is taken care of by the "if" above).
        if (x < 0) {
            lineAngle += Math.PI;
        }
        var halfAngleRad = angle/360*Math.PI;
        var newAngle1 = lineAngle + (Math.PI - halfAngleRad);
        var newAngle2 = lineAngle - (Math.PI - halfAngleRad);
        ctx.beginPath();
        ctx.moveTo(endX + length*Math.cos(newAngle1),
                   endY - length*Math.sin(newAngle1));
        if (angle != 180) {     // hack to make it look good in IE
            ctx.lineTo(endX, endY);
        }
        ctx.lineTo(endX + length*Math.cos(newAngle2),
                   endY - length*Math.sin(newAngle2));
        ctx.stroke();
    };


    /**
     * Draws an arrow on the line. Subclasses may override this method to draw
     * their own arrows. The fill style is already set according to
     * {link #arrowsOnLineColor} when this method is called.
     *
     * @param   ctx {object}    the 2D context of the canvas to draw in.
     * @param   x {double}      the x coordinate of the center of the arrow.
     * @param   y {double}      the y coordinate of the center of the arrow.
     * @param   dir {double}    the direction of the arrow in radians.
     */
    self.drawArrowOnLine = function(ctx, x, y, dir) {
        var halfLineWidth = self.getPixelSize()/2;
        ctx.beginPath();
        var x2 = x + halfLineWidth*1.0*Math.cos(dir);
        var y2 = y - halfLineWidth*1.0*Math.sin(dir);
        ctx.moveTo(x2, y2);
        var angleLeft = dir + Math.PI*3.0/4.0;
        x2 = x + halfLineWidth*Math.SQRT2*Math.cos(angleLeft);
        y2 = y - halfLineWidth*Math.SQRT2*Math.sin(angleLeft);
        ctx.lineTo(x2, y2);
        var angleOpposite = dir + Math.PI;
        x2 = x + halfLineWidth*0.5*Math.cos(angleOpposite);
        y2 = y - halfLineWidth*0.5*Math.sin(angleOpposite);
        ctx.lineTo(x2, y2);
        var angleRight = dir + Math.PI*5.0/4.0;
        x2 = x + halfLineWidth*Math.SQRT2*Math.cos(angleRight);
        y2 = y - halfLineWidth*Math.SQRT2*Math.sin(angleRight);
        ctx.lineTo(x2, y2);
        ctx.fill();
    };


    // overridden
    var superDraw = self.draw;
    self.draw = function(container, topLevelContainer, ctx,
                         mapLeft, mapTop, mapZoom) {
        superDraw.apply(self, arguments);
        
        mMapLeft = mapLeft;
        mMapTop = mapTop;

        var zoomFactor = self.getZoomFactor();
        var displacement = self.getDisplacement();
        
        var lineWidth = self.getPixelSize();
        if (lineWidth <= 0) {
            lineWidth = 5;
        }
        lineWidth *= zoomFactor;
        var halfLineWidth = lineWidth/2;
        var endArrowLength = self.getEndArrowLength();
        if (endArrowLength == null) {
            endArrowLength = 0;
        } else {
            endArrowLength *= zoomFactor;
        }
        var startArrowLength = self.getStartArrowLength();
        if (startArrowLength == null) {
            startArrowLength = 0;
        } else {
            startArrowLength *= zoomFactor;
        }
        var arrowLength = Math.abs(startArrowLength) +
                          Math.abs(endArrowLength);

        var width = parseInt(container.style.width);    // HACK
        var height = parseInt(container.style.height);  // HACK
        var testLeft = -halfLineWidth - arrowLength - displacement;
        var testTop = -halfLineWidth - arrowLength - displacement;
        var testRight = width + halfLineWidth + arrowLength + displacement;
        var testBottom = height + halfLineWidth + arrowLength + displacement;
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
        var realCoordinates;
        if (self.getZoomForPixelCoordinates() == mapZoom) {
            realCoordinates = self.getPixelCoordinates();
        } else {
            realCoordinates = [];
            self.setPixelCoordinates(realCoordinates);
            mMinX = null;
            mMaxX = null;
            mMinY = null;
            mMaxY = null;
            mCoordinatesIterator.reset();
            var realX = null;
            var realY = null;
            var nx = 0;
            var ny = 0;
            while (mCoordinatesIterator.iterate()) {
                var suPoint = {x:mCoordinatesIterator.x, y:mCoordinatesIterator.y};
                var pixCoords = CoordUtil.smartUnit2Pixel(suPoint, mapZoom);
                if (realX != null) {
                    var distX = pixCoords.x - realX;
                    var distY = pixCoords.y - realY;
                    var dist = distX*distX + distY*distY;
                    if (dist < 1) {
                        continue;
                    }
                    if (displacement != 0) {
                        /*if (dist < displacement*displacement && (nx != 0 || ny != 0)) {
                            var test = distX*nx + distY*ny;
                            if (test < 0 && displacement < 0 ||
                                test > 0 && displacement > 0) {
                                continue;
                            }
                        }*/
                        dist = Math.sqrt(dist);
                        var nxNext = -distY/dist;
                        var nyNext = distX/dist;
                        nx += nxNext;
                        ny += nyNext;
                        dist = Math.sqrt(nx*nx + ny*ny);
                        if (dist != 0) {
                            nx /= dist;
                            ny /= dist;
                        }
                        realX += nx*displacement;
                        realY += ny*displacement;
                        nx = nxNext;
                        ny = nyNext;
                    }
                    realCoordinates.push(realX);
                    realCoordinates.push(realY);
                }
                realX = pixCoords.x;
                realY = pixCoords.y;
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
            }
            if (realX != null) {
                realCoordinates.push(realX + nx*displacement);
                realCoordinates.push(realY + ny*displacement);
            }
            self.setZoomForPixelCoordinates(mapZoom);
        }
        if (mMinX == null || (mMaxX - mapLeft) < testLeft || (mMinX - mapLeft) > testRight ||
                             (mapTop - mMinY) < testTop || (mapTop - mMaxY) > testBottom) {
            return;
        }

        var bounds = { minX:testLeft, minY:testTop,
                       maxX:testRight, maxY:testBottom };
        
        var startPoint = { x:0, y:0 };
        var endPoint = { x:0, y:0 };
        var realArrayLength = realCoordinates.length;
        var pathStarted = false;
        ctx.strokeStyle = self.getColor();
        ctx.lineWidth = lineWidth;
        ctx.lineJoin = "round";
        ctx.lineCap = "round";
        for (var i = 0; i < realArrayLength; i+=2) {
            var prevRealX = realX;
            var prevRealY = realY;
            realX = realCoordinates[i] - mapLeft;
            realY = mapTop - realCoordinates[i+1];
            if (i > 0) {
                if (i == 2 && startArrowLength != 0 &&
                    (prevRealX != realX || prevRealY != realY)) {
                    drawArrow(ctx, realX, realY, prevRealX, prevRealY,
                              self.getStartArrowAngle(), startArrowLength);
                }
                startPoint.x = prevRealX;
                startPoint.y = prevRealY;
                endPoint.x = realX;
                endPoint.y = realY;
                var clipResult = CoordUtil.clipLine(startPoint, endPoint, bounds);
                if (clipResult < 4) {
                    if (!pathStarted) {
                        pathStarted = true;
                        ctx.beginPath();
                    }
                    if (prevClipResult >= 2) {
                        ctx.moveTo(startPoint.x, startPoint.y);
                    }
                    ctx.lineTo(endPoint.x, endPoint.y);
                }
            } else {
                clipResult = 4;
            }
            var prevClipResult = clipResult;
        }
        if (pathStarted) {
            ctx.stroke();
        }
        
        if (endArrowLength != 0 && realArrayLength > 2 &&
            (prevRealX != realX || prevRealY != realY)) {
            drawArrow(ctx, prevRealX, prevRealY, realX, realY,
                      self.getEndArrowAngle(), endArrowLength);
        }

        // draw arrows on the line
        if (self.getArrowsOnLine()) {
            ctx.fillStyle = self.getArrowsOnLineColor();
            var stride = self.getArrowsOnLineStride();
            var currentStartPix = null;
            var currentStartDistance = 0;
            var currentEndPix = null;
            var currentEndDistance = 0;
            var currentLength;
            var vx;
            var vy;
            var distance = 0;
            var i = 0;
            while (true) {
                // move forward
                var newEndNeeded = false;
                if (currentStartPix == null) {
                    if (i >= realArrayLength) {
                        break;
                    }
                    currentStartPix = {x:realCoordinates[i++],
                                       y:realCoordinates[i++]};
                    newEndNeeded = true;
                } else if (distance >= currentEndDistance) {
                    newEndNeeded = true;
                }
                if (newEndNeeded) {
                    if (currentEndPix != null) {
                        currentStartPix = currentEndPix;
                        currentStartDistance = currentEndDistance;
                    }
                    if (i >= realArrayLength) {
                        break;
                    }
                    currentEndPix = {x:realCoordinates[i++],
                                     y:realCoordinates[i++]};
                    vx = currentEndPix.x - currentStartPix.x;
                    vy = currentEndPix.y - currentStartPix.y;
                    currentLength = Math.sqrt(vx*vx + vy*vy);
                    currentEndDistance += currentLength;
                    if (distance >= currentEndDistance) {
                        continue;
                    }
                }

                // draw
                var factor = (distance - currentStartDistance)/currentLength;
                var x = currentStartPix.x + factor*vx;
                var y = currentStartPix.y + factor*vy;
                x = x - mapLeft;
                y = mapTop - y;
                if (x >= testLeft && x <= testRight &&
                    y >= testTop && y <= testBottom &&
                    (vx != 0 || vy != 0)) {
                    var baseAngle = Math.atan2(vy, vx);
                    self.drawArrowOnLine(ctx, x, y, baseAngle);
                }
                distance += stride;
            }
        }
    };


    /**
     * Used to connect a {@link SensitiveArea} to the line - returns the
     * square distance of the mouse coordinates in the specified event to the
     * line.
     * 
     * @param   evt {Map}           the event.
     * @param   tolerance {int}     the tolerance in pixels. The mouse can be
     *                              up to this distance away from the line to
     *                              be considered in range.
     * 
     * @return  {Map}   an associative array with a <code>squareDistance</code>
     *                  property (-1 if the mouse is not in range) and an
     *                  <code>extendedEventInfo</code> property. The latter
     *                  contains properties that are added to click, hover, and
     *                  similar events.
     *                  <p>
     *                  The following extented properties are available for the
     *                  the <code>Line</code> class:
     *                  </p>
     *                  <ul>
     *                      <li><strong>nearestX</strong>: The x coordinate of
     *                          the closest point on the line (in smart units).
     *                          This is a footpoint on a line segment, not a
     *                          segment end point, i.e. you can use this
     *                          information for things like adding new points
     *                          to an existing line.</li>
     *                      <li><strong>nearestY</strong>: The y coordinate of
     *                          the closest point on the line (in smart units).
     *                          This is a footpoint on a line segment, not a
     *                          segment end point, i.e. you can use this
     *                          information for things like adding new points
     *                          to an existing line.</li>
     *                      <li><strong>lineSegment</strong>: The index of the
     *                          line segment (counting from zero) which is
     *                          closest to the mouse. The footpoint passed in
     *                          the <code>nearestX</code> and
     *                          <code>nearestY</code> properties lies on this
     *                          line segment.</li>
     *                  </ul>
     *                  <p>
     *                      The <code>nearestX</code> and <code>nearestY</code>
     *                      properties are used for positioning tooltips.
     *                  </p>
     */
    self.getSquareDistance = function(evt, tolerance) {
        var retVal = {squareDistance:-1};
        var zoomForPixelCoordinates = self.getZoomForPixelCoordinates();
        if (zoomForPixelCoordinates == null) {
            // no line drawn
            return retVal;
        }
        var realCoordinates = self.getPixelCoordinates();
        var lineSegmentCount = realCoordinates.length / 2 - 1;
        if (lineSegmentCount < 1) {
            // no line drawn
            return retVal;
        }
        var coords = self.getVectorLayer().getMap().transformPixelCoords(
            evt.relMouseX, evt.relMouseY, false, true, true);
        var mouseX = coords.x + mMapLeft;
        var mouseY = mMapTop - coords.y;
        var px = realCoordinates[0];
        var py = realCoordinates[1];
        var minSquareDistance = -1;
        for (var i = 0; i < lineSegmentCount; ++i) {
            var prevPx = px;
            var prevPy = py;
            px = realCoordinates[(i+1)*2];
            py = realCoordinates[(i+1)*2 + 1];
            var bx = px - prevPx;
            var by = py - prevPy;
            var vx = mouseX - prevPx;
            var vy = mouseY - prevPy;
            var t = (vx*bx + vy*by) / (bx*bx + by*by);
            if (t <= 0) {
                var nx = prevPx;
                var ny = prevPy;
            } else if (t >= 1) {
                nx = px;
                ny = py;
            } else {
                nx = prevPx + t*bx;
                ny = prevPy + t*by;
            }
            var distX = mouseX - nx;
            var distY = mouseY - ny;
            var squareDistance = distX*distX + distY*distY;
            if (minSquareDistance == -1 || squareDistance < minSquareDistance) {
                minSquareDistance = squareDistance;
                var nearestX = nx;
                var nearestY = ny;
                var lineSegment = i;
            }
        }
        if (minSquareDistance == -1 || minSquareDistance > tolerance*tolerance) {
            return retVal;
        }
        retVal.squareDistance = minSquareDistance;
        var nearestPoint = com.ptvag.webcomponent.map.CoordUtil.pixel2SmartUnit(
            { x:nearestX, y:nearestY }, zoomForPixelCoordinates);
        retVal.extendedEventInfo = { nearestX:nearestPoint.x,
                                     nearestY:nearestPoint.y,
                                     lineSegment:lineSegment };
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
    if (pixelSize != null) {
        self.setPixelSize(pixelSize);
    }
    if (coordinates != null) {
        self.setCoordinates(coordinates);
    } else {
        // force modifier call
        self._modifyCoordinates(self.getCoordinates());
    }

    self.refreshOn("color", "pixelSize", "endArrowLength", "endArrowAngle", "startArrowLength", "startArrowAngle", "displacement");
});


/**
 * The color of the line.
 * The color can be specified as RGB hex values ("#ff0000")
 * or as RGB alpha values ("rgba(255,0,0,1.0)").
 */
qxp.OO.addProperty({ name:"color", type:qxp.constant.Type.STRING, allowNull:false, defaultValue:"rgba(10,10,255,0.5)" });

/** The width of the line in pixels. */
qxp.OO.addProperty({ name:"pixelSize", type:qxp.constant.Type.NUMBER, allowNull:false, defaultValue:10 });

/**
 * The points of the line (may be either an array of points or an array of
 * alternating x and y values or a string with space separated alternating
 * x and y values).
 */
qxp.OO.addProperty({ name:"coordinates", type:qxp.constant.Type.OBJECT, allowNull:false, defaultValue:[] });

/**
 * The pixel coordinates according to the current zoom level. This is useful
 * for subclasses to use in their draw method. Displacement and combination of
 * points that are close together has already been performed for these
 * coordinates. Please note that this array is filled by the {@link #draw()}
 * method, so if you don't call it in your subclass, you can't use the pixel
 * coordinates.
 * <p>
 * Don't set this property yourself except you're completely replacing the
 * {@link #draw()} method!
 * </p>
 */
qxp.OO.addProperty({ name:"pixelCoordinates", type:qxp.constant.Type.OBJECT, allowNull:true });

/**
 * The zoom level corresponding to the {@link #pixelCoordinates} property.
 */
qxp.OO.addProperty({ name:"zoomForPixelCoordinates", type:qxp.constant.Type.NUMBER, allowNull:true });

/**
 * The length of the arrow at the end of the line (if <code>null</code>, no
 * arrow is drawn).
 */
qxp.OO.addProperty({ name:"endArrowLength", type:qxp.constant.Type.NUMBER, allowNull:true });

/**
 * The opening angle of the arrow at the end of the line (in degress). A value
 * of 0 means that no arrow is visible. A value of 180 means that the "arrow"
 * is visible as a continues line (perpendicular to the last line segment).
 */
qxp.OO.addProperty({ name:"endArrowAngle", type:qxp.constant.Type.NUMBER, allowNull:false, defaultValue:60 });

/**
 * The length of the arrow at the beginning of the line (if <code>null</code>,
 * no arrow is drawn).
 */
qxp.OO.addProperty({ name:"startArrowLength", type:qxp.constant.Type.NUMBER, allowNull:true });

/**
 * The opening angle of the arrow at the beginning of the line (in degress).
 * A value of 0 means that no arrow is visible. A value of 180 means that the
 * "arrow" is visible as a continues line (perpendicular to the first line
 * segment).
 */
qxp.OO.addProperty({ name:"startArrowAngle", type:qxp.constant.Type.NUMBER, allowNull:false, defaultValue:60 });

/**
 * The amount in pixels that the line is displaced (orthogonally to the
 * original coordinates). This can be used to create "sidelines" (with a
 * non-zero displacement) that run along a line with zero displacement. One
 * use case would be to display traffic flow information beside a route. Using
 * positive or negative displacement values, sideline can be placed on either
 * side of the route.
 */
qxp.OO.addProperty({ name:"displacement", type:qxp.constant.Type.NUMBER, allowNull:false, defaultValue:0 });

/**
 * Whether to draw arrows along the line.
 */
qxp.OO.addProperty({ name:"arrowsOnLine", type:qxp.constant.Type.BOOLEAN, allowNull:false, defaultValue:false });

/**
 * The color of arrows along the line.
 * The color can be specified as RGB hex values ("#ff0000")
 * or as RGB alpha values ("rgba(255,0,0,1.0)").
 */
qxp.OO.addProperty({ name:"arrowsOnLineColor", type:qxp.constant.Type.STRING, allowNull:false, defaultValue:"rgba(255,255,255,1.0)" });

/**
 * The distance between arrows along the line (in pixels).
 */
qxp.OO.addProperty({ name:"arrowsOnLineStride", type:qxp.constant.Type.NUMBER, allowNull:false, defaultValue:20 });
