/**
 * A dynamic tooltip. The content is not fixed - instead, a callback function
 * provides it at runtime (possibly taking into account nearby hover areas or
 * other information).
 * <p>
 * Beware: The callback function will be called very often, even if only the
 * hover coordinates changed (and not the nearby areas or anything else). If
 * there's any significant processing in your callback function, please make
 * sure it's only performed when absolutely necessary!
 * </p>
 * 
 * @param   x {double,4355664}  the x coordinate of the sensitive area
 *                              (in smart units).
 * @param   y {double,5464867}  the y coordinate of the sensitive area
 *                              (in smart units).
 * @param   maxZoom {int,null}  the maximum zoom level on which the area is
 *                              active (ignored - use the
 *                              {@link VectorElement#visibleMinZoom
 *                              visibleMinZoom} and
 *                              {@link VectorElement#visibleMaxZoom
 *                              visibleMaxZoom} properties instead).
 * @param   tolerance {double,7}    the maximum distance in pixels for the
 *                              mouse to be considered over the area.
 * @param   contentProvider {function,null}     the callback function which
 *                              provides the tooltip's content (as HTML). It's
 *                              called with the tooltip instance as the first
 *                              and with the hover event as the second
 *                              parameter. The hover event's <code>otherAreas</code>
 *                              property contains all nearby hover areas (excluding
 *                              the dynamic tooltip passed as the callback
 *                              function's first parameter).
 * @param   alignment {int,66}  the alignment of the tooltip relative to the x
 *                              and y coordinates (see the constants in the
 *                              {@link com.ptvag.webcomponent.map.layer.VectorLayer}
 *                              class). Currently, the alignment is ignored
 *                              (and the tooltip is styled in a way that doesn't
 *                              make custom alignment sensible).
 * @param   priority {int,0}    the drawing priority.
 * @param   id {var,null}       the id of the element.
 * @param   isPositionFlexible {boolean,false}  whether the position is
 *                              flexible. Flexible elements will displace
 *                              each other when they are close to another.
 */
qxp.OO.defineClass("com.ptvag.webcomponent.map.vector.DynamicTooltip",
                  com.ptvag.webcomponent.map.vector.Tooltip,
function(x, y, maxZoom, tolerance, contentProvider, alignment, priority, id, isPositionFlexible) {
    com.ptvag.webcomponent.map.vector.Tooltip.call(this,
        x, y, maxZoom, tolerance, "", alignment, priority, id, isPositionFlexible);

    var self = this;
    var map = com.ptvag.webcomponent.map;

    
    // overridden
    var superOnHover = self.onHover;
    self.onHover = function(evt) {
        var contentProvider = self.getContentProvider();
        var forceChange = false;
        if (contentProvider) {
            var newText = contentProvider(self, evt);
            if (newText != self.getText()) {
                self.setText(newText);
            }
        }
        superOnHover.call(this, evt);
    };
    
    
    self.setContentProvider(contentProvider);
});


/**
 * The callback function which provides the tooltip's content (as HTML). It's
 * called with the tooltip instance as the first and with the hover event as
 * the second parameter. The hover event's <code>otherAreas</code> property
 * contains all nearby hover areas (excluding the dynamic tooltip passed as the
 * callback function's first parameter).
 */
qxp.OO.addProperty({ name:"contentProvider", type:qxp.constant.Type.FUNCTION, allowNull:true, defaultValue:null });
