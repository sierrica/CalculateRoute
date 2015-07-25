/**
 * Base class for circles.
 * 
 * @param   x {double,4355664}  the x coordinate of the circle center
 *                              (in smart units).
 * @param   y {double,5464867}  the y coordinate of the circle center
 *                              (in smart units).
 * @param   color {string,"rgba(255,0,0,0.7)"}  the color of the circle.
 *                              The color can be specified as RGB hex values ("#ff0000")
 *                              or as RGB alpha values ("rgba(255,0,0,1.0)").
 * @param   priority {int,0}    the drawing priority.
 * @param   id {var,null}       the id of the element.
 * @param   isPositionFlexible {boolean,false} Whether the position is
 *                              flexible. Flexible elements will displace
 *                              each other when they are close to another.
 */
qxp.OO.defineClass("com.ptvag.webcomponent.map.vector.AbstractCircle",
                   com.ptvag.webcomponent.map.vector.VectorElement,
function(x, y, color, priority, id, isPositionFlexible) {
    com.ptvag.webcomponent.map.vector.VectorElement.call(this, priority, id, isPositionFlexible);

    var self = this;
    var map = com.ptvag.webcomponent.map;
    
    
    /**
     * Returns the radius of the circle in pixels. This method is called every
     * time the circle is drawn. This enables sub classes to make the radius
     * dependent on the current zoom level.
     *
     * @param   mapLeft {double}                the left edge of the map in
     *                                          pixels.
     * @param   mapTop {double}                 the top edge of the map in
     *                                          pixels.
     * @param   mapZoom {double}                the current zoom level of the
     *                                          map.
     */
    self.calculatePixelRadius = function(mapLeft, mapTop, mapZoom) {
        throw new Error("calculatePixelRadius is abstract in AbstractCircle");
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
        var suPoint = {x: self.getX(), y: self.getY()};
        var pixCoords = map.CoordUtil.smartUnit2Pixel(suPoint, mapZoom);
        var realX = pixCoords.x - mapLeft + self.getFlexX();
        var realY = mapTop - pixCoords.y + self.getFlexY();
        var radius = self.calculatePixelRadius(mapLeft, mapTop, mapZoom);
        //var width = parseInt(container.style.width);    // HACK
        //var height = parseInt(container.style.height);  // HACK
        //if (realX < -radius || realY < -radius ||
        //    realX > width + radius || realY > height + radius) {
        //    //self.error("Circle cropped");
        //} else {
            ctx.fillStyle = self.getColor();
            ctx.beginPath();
            ctx.moveTo(realX, realY);
            ctx.arc(realX, realY, radius*self.getZoomFactor(), 0, 2*Math.PI, false);
            ctx.fill();
        //}
    };


    if (x != null) {
        self.setX(x);
    }
    if (y != null) {
        self.setY(y);
    }
    if (color != null) {
        self.setColor(color);
    }

    self.refreshOn("x", "y", "color");
});


/** The x coordinate of the circle. */
qxp.OO.addProperty({ name:"x", type:qxp.constant.Type.NUMBER, allowNull:false, defaultValue:4355664 });
/** The y coordinate of the circle. */
qxp.OO.addProperty({ name:"y", type:qxp.constant.Type.NUMBER, allowNull:false, defaultValue:5464867 });

/**
 * The color of the circle.
 * The color can be specified as RGB hex values ("#ff0000")
 * or as RGB alpha values ("rgba(255,0,0,1.0)").
 */
qxp.OO.addProperty({ name:"color", type:qxp.constant.Type.STRING, allowNull:false, defaultValue:"rgba(255,0,0,0.7)" });
