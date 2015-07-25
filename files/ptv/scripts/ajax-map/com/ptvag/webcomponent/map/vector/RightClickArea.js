/**
 * An area on the map that reacts to right mouse clicks. If you set the
 * area's x coordinate to <code>null</code> (either in the constructor or later
 * on), the area reacts to clicks anywhere on the map.
 * <p>
 * Sample code: {@sample Interaction},
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
 *                                      <code>id</code> (the id of the hover
 *                                      area).
 * @param   priority {int,0}    the drawing priority.
 * @param   id {var,null}       the id of the element.
 * @param   isPositionFlexible {boolean,false} Whether the position is
 *                              flexible. Flexible elements will displace
 *                              each other when they are close to another.
 */
qxp.OO.defineClass("com.ptvag.webcomponent.map.vector.RightClickArea",
                  com.ptvag.webcomponent.map.vector.ClickArea,
function(x, y, maxZoom, tolerance, handler, priority, id, isPositionFlexible) {
    com.ptvag.webcomponent.map.vector.ClickArea.call(this,
        x, y, maxZoom, tolerance, handler, priority, id, isPositionFlexible);
});
