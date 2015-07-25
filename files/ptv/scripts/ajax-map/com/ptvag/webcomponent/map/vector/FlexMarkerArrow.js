/**
 * An element that visualizes the connection between a flexible element and its
 * original position. This class draws an arrow (a triangle with a small base,
 * to be exact) to show the connection.
 * <p>
 * Sample code: {@sample Flexible elements (1)},
 *              {@sample Flexible elements (2)}
 * 
 * @param   flexElementId {var} the id of the flexible element.
 * @param   priority {int,0}    the drawing priority.
 * @param   id {var,null}       the id of the flex marker element.
 */
qxp.OO.defineClass("com.ptvag.webcomponent.map.vector.FlexMarkerArrow",
                  com.ptvag.webcomponent.map.vector.FlexMarker,
function(flexElementId, priority, id) {
    com.ptvag.webcomponent.map.vector.FlexMarker.call(this, flexElementId, priority, id);

    var self = this;
    var CoordUtil = com.ptvag.webcomponent.map.CoordUtil;


    // overridden
    self.usesCanvas = function() {
        return true;
    };


    // overridden
    var superDraw = self.draw;
    self.draw = function(container, topLevelContainer, ctx,
                         mapLeft, mapTop, mapZoom) {
        superDraw.apply(self, arguments);
        
        var flexElement = self.getVectorLayer().getElement(
            self.getFlexElementId());
        var origPosition = { x:flexElement.getX(), y:flexElement.getY() };
        var origPositionPix = CoordUtil.smartUnit2Pixel(origPosition, mapZoom);
        origPositionPix.x -= mapLeft;
        origPositionPix.y = mapTop - origPositionPix.y;
        var vecX = -flexElement.getFlexY();
        var vecY = flexElement.getFlexX();
        var newPositionPix = { x:origPositionPix.x + vecY,
                               y:origPositionPix.y - vecX };
        var vecLength = vecX*vecX + vecY*vecY;
        if (vecLength > 0) {
            vecLength = Math.sqrt(vecLength);
            if (vecLength > 0) {
                vecX *= 2/vecLength;
                vecY *= 2/vecLength;
                ctx.strokeStyle = '#000000';
                ctx.fillStyle = '#ffffff';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(origPositionPix.x, origPositionPix.y);
                ctx.lineTo(newPositionPix.x - vecX, newPositionPix.y - vecY);
                ctx.lineTo(newPositionPix.x + vecX, newPositionPix.y + vecY);
                ctx.lineTo(origPositionPix.x, origPositionPix.y);
                ctx.fill();
                ctx.beginPath();
                ctx.moveTo(origPositionPix.x, origPositionPix.y);
                ctx.lineTo(newPositionPix.x - vecX, newPositionPix.y - vecY);
                ctx.lineTo(newPositionPix.x + vecX, newPositionPix.y + vecY);
                ctx.lineTo(origPositionPix.x, origPositionPix.y);
                ctx.stroke();
            }
        }
        
    };
    
});
