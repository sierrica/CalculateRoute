/**
 * An area over the map that reacts to user input.
 * <p>
 * Sample code: {@sample Tooltips (2)},
 *              {@sample Custom client-side POIs}
 * 
 * @param   x {double,4355664}          the x coordinate of the area
 *                                      (in smart units).
 * @param   y {double,5464867}          the y coordinate of the area
 *                                      (in smart units).
 * @param   maxZoom {int,null}          the maximum zoom level on which the
 *                                      area is active (ignored - use the
 *                                      {@link VectorElement#visibleMinZoom
 *                                      visibleMinZoom} and
 *                                      {@link VectorElement#visibleMaxZoom
 *                                      visibleMaxZoom} properties instead).
 * @param   tolerance {double,7}        the maximum distance in pixels for the
 *                                      mouse to be considered over the area.
 * @param   priority {int,0}    the drawing priority.
 * @param   id {var,null}       the id of the element.
 * @param   isPositionFlexible {boolean,false} Whether the position is
 *                              flexible. Flexible elements will displace
 *                              each other when they are close to another.
 */
qxp.OO.defineClass("com.ptvag.webcomponent.map.vector.SensitiveArea",
    com.ptvag.webcomponent.map.vector.VectorElement,
function(x, y, maxZoom, tolerance, priority, id, isPositionFlexible) {
    com.ptvag.webcomponent.map.vector.VectorElement.call(this, priority, id, isPositionFlexible);

    var self = this;
    var map = com.ptvag.webcomponent.map;

    var mExtendedEventInfo;
    
    
    // overridden
    self.usesCanvas = function() {
        // usually, sensitive areas don't change the canvas
        // (override this method in a subclass if necessary)
        return false;
    };

    // overridden
    self.draw = function(container, topLevelContainer, ctx,
        mapLeft, mapTop, mapZoom) {
        
        var x = self.getX();
        if (x != null) {
            // x can be null for things like general click handlers
            // (but the left, top and zoom have to be set anyway)
            var suPoint = {x: x, y: self.getY()};
            var pixCoords = map.CoordUtil.smartUnit2Pixel(suPoint, mapZoom);
            var realX = pixCoords.x - mapLeft + self.getFlexX();
            var realY = mapTop - pixCoords.y + self.getFlexY();
            var coords = self.getVectorLayer().getMap().transformPixelCoords(
                realX, realY, false, false, true);
            self.setRealX(coords.x + self.getOffsetX());
            self.setRealY(coords.y + self.getOffsetY());
        }
        self.setMapLeft(mapLeft);
        self.setMapTop(mapTop);
        self.setMapZoom(mapZoom);
    };
    
    
    /**
     * Returns the square distance of the hover area center to the mouse
     * coordinates in the specified event.
     * 
     * @param   evt {Map}           the event.
     * 
     * @return  {int}               the square distance or -1 if the hover area
     *                              is not in range (= too far away).
     */
    self.getSquareDistance = function(evt) {
        mExtendedEventInfo = null;
        var tolerance = self.getTolerance();
        var attachedElement = self.getAttachedElement();
        if (attachedElement != null) {
            var info = attachedElement.getSquareDistance(evt, tolerance);
            mExtendedEventInfo = info.extendedEventInfo;
            return info.squareDistance;
        }
        var distanceX = evt.relMouseX - self.getRealX();
        var distanceY = evt.relMouseY - self.getRealY();
        var squareDistance = distanceX*distanceX + distanceY*distanceY;
        if (squareDistance > tolerance*tolerance) {
            return -1;  // area not in range
        }
        return squareDistance;
    };
    

    /**
     * Support method for {@link #attachedElement} (called by the vector
     * layer).
     *
     * @return  {Map}           returns additional information after
     *                          {@link #getSquareDistance()} has been called.
     */
    self.getExtendedEventInfo = function() {
        return mExtendedEventInfo;
    }


    if (x != null) {
        self.setX(x);
    }
    if (y != null) {
        self.setY(y);
    }
    if (maxZoom != null) {
        self.setMaxZoom(maxZoom);
    }
    if (tolerance != null) {
        self.setTolerance(tolerance);
    }

    self.refreshOn("x", "y", "offsetX", "offsetY");
});


/** The x coordinate of the area (in smart units). */
qxp.OO.addProperty({ name:"x", type:qxp.constant.Type.NUMBER, defaultValue:4355664 });
/** The y coordinate of the area (in smart units). */
qxp.OO.addProperty({ name:"y", type:qxp.constant.Type.NUMBER, defaultValue:5464867 });

/**
 * The number of pixels the element should move to the right. This property
 * works in screen coordinates and is applied on top of
 * {@link VectorElement#flexX}.
 */
qxp.OO.addProperty({ name:"offsetX", allowNull:false, defaultValue:0 });

/**
 * The number of pixels the element should move to the bottom. This property
 * works in screen coordinates and is applied on top of
 * {@link VectorElement#flexY}.
 */
qxp.OO.addProperty({ name:"offsetY", allowNull:false, defaultValue:0 });

/**
 * Contains the x position in pixels after the element has been "drawn" (= activated).
 */
qxp.OO.addProperty({ name:"realX", type:qxp.constant.Type.NUMBER });

/**
 * Contains the y position in pixels after the element has been "drawn" (= activated).
 */
qxp.OO.addProperty({ name:"realY", type:qxp.constant.Type.NUMBER });

/**
 * Remembers the respective parameter passed to the {@link #draw()} method
 * (used by sub classes).
 */
qxp.OO.addProperty({ name:"mapLeft", type:qxp.constant.Type.NUMBER });

/**
 * Remembers the respective parameter passed to the {@link #draw()} method
 * (used by sub classes).
 */
qxp.OO.addProperty({ name:"mapTop", type:qxp.constant.Type.NUMBER });

/**
 * Remembers the respective parameter passed to the {@link #draw()} method
 * (used by sub classes).
 */
qxp.OO.addProperty({ name:"mapZoom", type:qxp.constant.Type.NUMBER });

/**
 * The maximum zoom level at which the area is active (currently ignored).
 */
qxp.OO.addProperty({ name:"maxZoom", type:qxp.constant.Type.NUMBER, allowNull:true });

/**
 * The maximum distance in pixels for the mouse to be considered over the area.
 */
qxp.OO.addProperty({ name:"tolerance", type:qxp.constant.Type.NUMBER, allowNull:false, defaultValue:7 });

/**
 * A vector element that this area is attached to.
 * Tests whether the mouse is near the area are delgated to this object. For
 * this purpose, it must provide a method
 * <code>getSquareDistance(evt, tolerance)</code> (see the {@link Line} element
 * for an example and method documentation).
 * <p>
 * Currently, the following vector elements support attaching a sensitive area
 * to them:
 * </p>
 * <ul>
 *    <li>{@link Line}</li>
 *    <li>{@link Poly}</li>
 * </ul>
 */
qxp.OO.addProperty({ name:"attachedElement", type:qxp.constant.Type.OBJECT, allowNull:true });
