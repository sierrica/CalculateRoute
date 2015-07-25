/**
 * A map animator that animates the map using acceleration and deceleration.
 */
qxp.OO.defineClass("com.ptvag.webcomponent.map.animator.AcceleratingAnimator", com.ptvag.webcomponent.map.animator.Animator,
function() {
    com.ptvag.webcomponent.map.animator.Animator.call(this);

    var self = this;


    // overridden
    self.doAnimation = function(animationTime) {
        var theMap = self.getMap();

        var accelerationPart = self.getAccelerationPart();
        var decelerationPart = self.getDecelerationPart();
        var plateauPart = 1 - accelerationPart - decelerationPart;

        // NOTE: acceleration, plateau and deceleration build a trapezoid with
        //       an area of 1.

        // Get the percentage of the duration that would be needed if we would
        // move all the time at max speed
        var maxSpeedPart = 1 - accelerationPart / 2 - decelerationPart / 2;

        // Get the maximum speed (area / maxSpeedPart)
        var maxSpeed = 1 / maxSpeedPart;

        // Get the current area
        var timeFactor = Math.min(1, animationTime / self.getDuration());
        var pathFactor;
        if (timeFactor == 1) {
            pathFactor = 1;
        } else if (timeFactor < accelerationPart) {
            // We are still accelerating
            // -> Calculate the area of the truncated acceleration triangle
            var acceleration = maxSpeed / accelerationPart;
            var height = timeFactor * acceleration;
            pathFactor = (timeFactor * height) / 2;
        } else {
            // We are on the plateau or decelerating
            // -> Calculate the area of the full acceleration triangle
            pathFactor = (accelerationPart * maxSpeed) / 2;

            if (timeFactor < 1 - decelerationPart) {
                // We are on the plateau -> Add the truncated plateau rectangular
                var plateauTime = timeFactor - accelerationPart;
                pathFactor += plateauTime * maxSpeed;
            } else {
                // We are decelerating
                // -> Add the full area of the plateau plus the truncated deceleration triangle
                
                // Add the the full area of the plateau
                pathFactor += plateauPart * maxSpeed;
    
                // Add the full area of the deceleration triangle
                pathFactor += (decelerationPart * maxSpeed) / 2;
                
                // Substract the missing part of the truncated deceleration triangle
                var deceleration = maxSpeed / decelerationPart;
                var missingTime = (1 - timeFactor);
                var height = missingTime * deceleration;
                pathFactor -= (missingTime * height) / 2;
            }
        }

        // self.info("pathFactor: " + pathFactor);

        var newCenter = self.interpolatePoint(self.getStartCenter(), theMap.getCenter(), pathFactor);
        var newZoom = self.interpolateZoom(self.getStartZoom(), theMap.getZoom(), pathFactor);
        var newRotation = self.interpolateRotation(self.getStartRotation(), theMap.getRotation(), pathFactor);
        self.setVisibleMapView(newCenter, newZoom, newRotation, timeFactor == 1);

        return timeFactor == 1;
    };

});


/** The duration of an animation. */
qxp.OO.addProperty({ name:"duration", type:qxp.constant.Type.NUMBER, allowNull:false, defaultValue:500 });

/** The percentage of the duration to use for acceleration. */
qxp.OO.addProperty({ name:"accelerationPart", type:qxp.constant.Type.NUMBER, allowNull:false, defaultValue:0.3 });

/** The percentage of the duration to use for deceleration. */
qxp.OO.addProperty({ name:"decelerationPart", type:qxp.constant.Type.NUMBER, allowNull:false, defaultValue:0.7 });
