/**
 * A map animator that animates the map on a linear path.
 */
qxp.OO.defineClass("com.ptvag.webcomponent.map.animator.LinearAnimator", com.ptvag.webcomponent.map.animator.Animator,
function() {
    com.ptvag.webcomponent.map.animator.Animator.call(this);

    var self = this;


    // overridden
    self.doAnimation = function(animationTime) {
        var theMap = self.getMap();
        var factor = Math.min(1, animationTime / self.getDuration());

        var newCenter = self.interpolatePoint(self.getStartCenter(), theMap.getCenter(), factor);
        var newZoom = self.interpolateZoom(self.getStartZoom(), theMap.getZoom(), factor);
        var newRotation = self.interpolateRotation(self.getStartRotation(), theMap.getRotation(), factor);
        self.setVisibleMapView(newCenter, newZoom, newRotation, factor == 1);

        return factor == 1;
    };

});


/** The duration of an animation. */
qxp.OO.addProperty({ name:"duration", type:qxp.constant.Type.NUMBER, allowNull:false, defaultValue:500 });
