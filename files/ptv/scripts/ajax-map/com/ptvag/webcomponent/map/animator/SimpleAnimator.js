/**
 * A simple map animator. Sets the new position immediately (without animation).
 */
qxp.OO.defineClass("com.ptvag.webcomponent.map.animator.SimpleAnimator", com.ptvag.webcomponent.map.animator.Animator,
function() {
    com.ptvag.webcomponent.map.animator.Animator.call(this);

    var self = this;


    // overridden
    self.doAnimation = function(animationTime) {
        var map = self.getMap();
        map.setVisibleCenter(map.getCenter());
        map.setVisibleZoom(map.getZoom());
        map.setVisibleRotation(map.getRotation());

        return true;
    };

});
