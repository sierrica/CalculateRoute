/**
 * An area on the map that reacts to mouse clicks. If you set the area's x
 * coordinate to <code>null</code> (either in the constructor or later on),
 * the area reacts to clicks anywhere on the map.
 * <p>
 * Sample code: {@sample Interaction},
 *              {@sample Clickable images},
 *              {@sample Client-side POIs},
 *              {@sample Custom client-side POIs}
 * 
 * @param   x {double,null}             the x coordinate of the area
 *                                      (in smart units). If <code>null</code>,
 *                                      the area reacts to clicks anywhere on
 *                                      the map.
 * @param   y {double,null}             the y coordinate of the area
 *                                      (in smart units). If <code>x</code> is
 *                                      <code>null</code>, this parameter is
 *                                      ignored.
 * @param   maxZoom {int,null}          the maximum zoom level at which the
 *                                      area is active (ignored - use the
 *                                      {@link VectorElement#visibleMinZoom
 *                                      visibleMinZoom} and
 *                                      {@link VectorElement#visibleMaxZoom
 *                                      visibleMaxZoom} properties instead).
 * @param   tolerance {double,7}        the maximum distance in pixels for the
 *                                      mouse to be considered over the area.
 * @param   handler {function,null}     the handler function called when the
 *                                      mouse is clicked on the area (may be
 *                                      <code>null</code>). The handler is
 *                                      called with an object containing
 *                                      the properties <code>clickX</code>
 *                                      and <code>clickY</code> (the actual
 *                                      mouse position in smart units),
 *                                      <code>areaX</code> and
 *                                      <code>areaY</code> (the center of the
 *                                      area in smart units), and
 *                                      <code>id</code> (the id of the click
 *                                      area).
 * @param   priority {int,0}    the drawing priority.
 * @param   id {var,null}       the id of the element.
 * @param   isPositionFlexible {boolean,false} Whether the position is
 *                              flexible. Flexible elements will displace
 *                              each other when they are close to another.
 */
qxp.OO.defineClass("com.ptvag.webcomponent.map.vector.ClickArea",
                  com.ptvag.webcomponent.map.vector.SensitiveArea,
function(x, y, maxZoom, tolerance, handler, priority, id, isPositionFlexible) {
    com.ptvag.webcomponent.map.vector.SensitiveArea.call(this,
        x, y, maxZoom, tolerance, priority, id, isPositionFlexible);

    var self = this;
    var map = com.ptvag.webcomponent.map;
    

    // overridden
    var superDraw = self.draw;
    self.draw = function(container, topLevelContainer, ctx,
                         mapLeft, mapTop, mapZoom) {
        superDraw(container, topLevelContainer, ctx,
                  mapLeft, mapTop, mapZoom);
    };
    
    // overridden
    var superGetSquareDistance = self.getSquareDistance;
    self.getSquareDistance = function(evt) {
        if (self.getX() == null && self.getAttachedElement() == null) {
            return 10000*10000;     // give us a low priority when looking for
                                    // looking for the nearest click handler
        }
        return superGetSquareDistance(evt);
    };
    
    
    /**
     * Called when the mouse is clicked on the area.
     * 
     * @param   evt {Map}           the mouse event.
     */
    self.onClick = function(evt) {
        var suCoords =
            self.getVectorLayer().getMap().translateMouseCoords(evt);
        var handler = self.getHandler();
        if (handler != null) {
            evt.clickX = suCoords.x;
            evt.clickY = suCoords.y;
            evt.areaX = self.getX();
            evt.areaY = self.getY();
            evt.id = self.getId();
            handler(evt);
        }
    };
    

    self.setX(x);   // override the default (null is allowed here)
    self.setY(y);   // override the default (null is allowed here)
    self.setHandler(handler);
});


/**
 * The handler function called when the mouse is clicked on the area (may be
 * <code>null</code>). The handler is called with an object containing the
 * properties <code>clickX</code> and <code>clickY</code> (the actual mouse
 * position in smart units), <code>areaX</code> and <code>areaY</code> (the
 * center of the area in smart units), and <code>id</code> (the id of the hover
 * area).
 */
qxp.OO.addProperty({ name:"handler", type:qxp.constant.Type.FUNCTION, allowNull:true, defaultValue:null });
