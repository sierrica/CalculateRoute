/**
 * A circle.
 * <p>
 * Sample code: {@sample Drawing on the map},
 *              {@sample Custom vector elements}
 * 
 * @param   x {double,4355664}  the x coordinate of the circle center
 *                              (in smart units).
 * @param   y {double,5464867}  the y coordinate of the circle center
 *                              (in smart units).
 * @param   color {string,"rgba(255,0,0,0.7)"}  the color of the circle.
 *                              The color can be specified as RGB hex values ("#ff0000")
 *                              or as RGB alpha values ("rgba(255,0,0,1.0)").
 * @param   pixelSize {double,20}  the diameter of the circle in pixels.
 * @param   priority {int,0}    the drawing priority.
 * @param   id {var,null}       the id of the element.
 * @param   isPositionFlexible {boolean,false} Whether the position is
 *                              flexible. Flexible elements will displace
 *                              each other when they are close to another.
 */
qxp.OO.defineClass("com.ptvag.webcomponent.map.vector.Circle",
                   com.ptvag.webcomponent.map.vector.AbstractCircle,
function(x, y, color, pixelSize, priority, id, isPositionFlexible) {
    com.ptvag.webcomponent.map.vector.AbstractCircle.call(this, x, y, color, priority, id, isPositionFlexible);

    var self = this;
    var map = com.ptvag.webcomponent.map;
    
    
    // overridden
    self.calculatePixelRadius = function() {
        return self.getPixelSize()/2;
    };


    if (pixelSize != null) {
        self.setPixelSize(pixelSize);
    }

    self.refreshOn("pixelSize");
});


/** The diameter of the circle in pixels. */
qxp.OO.addProperty({ name:"pixelSize", type:qxp.constant.Type.NUMBER, allowNull:false, defaultValue:20 });
