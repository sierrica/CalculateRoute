/**
 * An area over the map that reacts to moving the mouse over it.
 * <p>
 * Sample code: {@sample Interaction}
 * 
 * @param   x {double,4355664}  the x coordinate of the area (in smart units).
 * @param   y {double,5464867}  the y coordinate of the area (in smart units).
 * @param   maxZoom {int,null}  the maximum zoom level at which the area is
 *                              active (ignored - use the
 *                              {@link VectorElement#visibleMinZoom
 *                              visibleMinZoom} and
 *                              {@link VectorElement#visibleMaxZoom
 *                              visibleMaxZoom} properties instead).
 * @param   tolerance {double,7}    the maximum distance in pixels for the
 *                              mouse to be considered over the area.
 * @param   hoverHandler {function,null}    the handler function called when
 *                              the mouse is hovered over the area (may be
 *                              <code>null</code>). The handler
 *                              is called with an object containing
 *                              the properties <code>hoverX</code>
 *                              and <code>hoverY</code> (the actual
 *                              mouse position in smart units),
 *                              <code>areaX</code> and
 *                              <code>areaY</code> (the center of the
 *                              area in smart units), and
 *                              <code>id</code> (the id of the hover
 *                              area).
 * @param   unhoverHandler {function,null}  the handler function called when the
 *                              mouse is no longer over the area (may
 *                              be <code>null</code>). The handler
 *                              is called with an object containing
 *                              the properties <code>hoverX</code>
 *                              and <code>hoverY</code> (the actual
 *                              mouse position in smart units),
 *                              <code>areaX</code> and
 *                              <code>areaY</code> (the center of the
 *                              area in smart units), and
 *                              <code>id</code> (the id of the hover
 *                              area).
 * @param   priority {int,0}    the drawing priority.
 * @param   id {var,null}       the id of the element.
 * @param   isPositionFlexible {boolean,false} Whether the position is
 *                              flexible. Flexible elements will displace
 *                              each other when they are close to another.
 */
qxp.OO.defineClass("com.ptvag.webcomponent.map.vector.HoverArea",
                  com.ptvag.webcomponent.map.vector.AbstractHoverArea,
function(x, y, maxZoom, tolerance, hoverHandler, unhoverHandler, priority, id, isPositionFlexible) {
    com.ptvag.webcomponent.map.vector.AbstractHoverArea.call(this,
        x, y, maxZoom, tolerance, priority, id, isPositionFlexible);

    var self = this;
    var map = com.ptvag.webcomponent.map;
    
    var mHovering = false;
    
    
    // overridden
    self.onHover = function(evt) {
        mHovering = true;
        var hoverHandler = self.getHoverHandler();
        if (hoverHandler != null) {
            var suCoords =
                self.getVectorLayer().getMap().translateMouseCoords(evt);
            hoverHandler({hoverX: suCoords.x, hoverY: suCoords.y,
                          areaX: self.getX(), areaY: self.getY(),
                          id: self.getId()});
        }
    };


    // overridden
    self.onUnhover = function(evt) {
        if (mHovering) {
            mHovering = false;
            var unhoverHandler = self.getUnhoverHandler();
            if (unhoverHandler != null) {
                if (evt != null) {
                    var suCoords =
                        self.getVectorLayer().getMap().translateMouseCoords(
                            evt);
                } else {
                    suCoords = {x: null, y: null};
                }
                unhoverHandler({unhoverX: suCoords.x, unhoverY: suCoords.y,
                                areaX: self.getX(), areaY: self.getY(),
                                id: self.getId()});
            }
        }
    };
    
    
    // overridden
    self.clear = function(inDispose) {
        if (!inDispose) {
            self.onUnhover();
        }
    };
    

    self.setHoverHandler(hoverHandler);
    self.setUnhoverHandler(unhoverHandler);
});


/**
 * The handler function called when the mouse is hovered over the area.
 * The handler is called with an object containing the properties
 * <code>hoverX</code> and <code>hoverY</code> (the actual mouse position in
 * smart units), <code>areaX</code> and <code>areaY</code> (the center of the
 * area in smart units), and <code>id</code> (the id of the hover area).
 */
qxp.OO.addProperty({ name:"hoverHandler", type:qxp.constant.Type.FUNCTION, allowNull:true });

/**
 * The handler function called when the mouse is no longer over the area.
 * The handler is called with an object containing the properties
 * <code>hoverX</code> and <code>hoverY</code> (the actual mouse position in
 * smart units), <code>areaX</code> and <code>areaY</code> (the center of the
 * area in smart units), and <code>id</code> (the id of the hover area).
 */
qxp.OO.addProperty({ name:"unhoverHandler", type:qxp.constant.Type.FUNCTION, allowNull:true });
