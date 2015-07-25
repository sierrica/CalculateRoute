/**
 * An area over the map that reacts to moving the mouse over it.
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
qxp.OO.defineClass("com.ptvag.webcomponent.map.vector.AbstractHoverArea",
    com.ptvag.webcomponent.map.vector.SensitiveArea,
function(x, y, maxZoom, tolerance, priority, id, isPositionFlexible) {
    com.ptvag.webcomponent.map.vector.SensitiveArea.call(this,
        x, y, maxZoom, tolerance, priority, id, isPositionFlexible);

    var self = this;
    

    /**
     * Called when the mouse is actually decided to be hovering over this area.
     * 
     * @param   evt {Map}           the mouse event.
     */
    self.onHover = function(evt) {
    };


    /**
     * Called when the mouse is no longer hovering over this area (or if it is
     * closer to another hover area).
     */
    self.onUnhover = function() {
    };
    
    
    /**
     * Called to test whether the mouse should no longer be considered hovering
     * over the area. This method also calls the <code>unhoverHandler</code>
     * when it decides that the mouse is too far away.
     * 
     * @param   evt {Map}           the mouse event.
     * 
     * @return  {boolean}           <code>true</code> if the mouse should no
     *                              longer be considered hovering over the
     *                              area.
     */
    self.testUnhover = function(evt) {
        return (self.getSquareDistance(evt) < 0);
    };
    
});


/**
 * Whether this hover area is magnetic (so that it remains hovered as long as
 * the mouse pointer is near it, even when another hover area is closer to the
 * mouse position).
 */
qxp.OO.addProperty({ name:"magnetic", type:qxp.constant.Type.BOOLEAN, allowNull:false, defaultValue:false, getAlias:"isMagnetic" });
