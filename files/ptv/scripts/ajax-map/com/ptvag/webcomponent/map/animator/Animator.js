/**
 * A map animator. Moves the position and zoom of the map towards the target
 * position.
 */
qxp.OO.defineClass("com.ptvag.webcomponent.map.animator.Animator", qxp.core.Object,
function() {
    qxp.core.Object.call(this);
    var CoordUtil = com.ptvag.webcomponent.map.CoordUtil;

    var self = this;

    var mStartTime;
    var mStartCenter;
    var mStartZoom;
    var mStartRotation;

    var mStopAnimation;
    var mFakeLastFrame;
    var mNextStepPlanned = false;


    /**
     * Event handler. Called when the target zoom or center changed.
     */
    self.onTargetChanged = function() {
        mStartTime = new Date().getTime();
        mStopAnimation = false;
        mFakeLastFrame = true;

        var map = self.getMap();
        mStartCenter = map.getVisibleCenter();
        mStartZoom   = map.getVisibleZoom();
        mStartRotation = map.getVisibleRotation();

        if (mStartCenter == null || mStartZoom == null || mStartRotation == null) {
            // We have no old position -> The map is initializing
            // -> Show the new position immediately
            map.setVisibleCenter(map.getCenter());
            map.setVisibleZoom(map.getZoom());
            map.setVisibleRotation(map.getRotation());
        } else if (!mNextStepPlanned) {
            if (self.getHaltLoadingDuringAnimation()) {
                com.ptvag.webcomponent.map.ImageLoader.setHaltLoading(true);
            }
            nextStep();
        }
    };


    /**
     * Stops the animation and moves the map immediately to the target position.
     */
    self.stopAnimation = function() {
        com.ptvag.webcomponent.map.ImageLoader.setHaltLoading(false);
        mStopAnimation = true;

        var map = self.getMap();
        map.setVisibleCenter(map.getCenter());
        map.setVisibleZoom(map.getZoom());
        map.setVisibleRotation(map.getRotation());
    };

    /**
     * Stops the animation, but doesn't change the currently visible center and
     * zoom values. They are left at the values set by the last animation step
     * that was performed.
     */
    self.stopAnimationAndKeepMapView = function() {
        mStopAnimation = true;
    };

    /**
     * Moves the map to the next step in the animation.
     */
    var nextStep = function() {
        mNextStepPlanned = false;
        if (mStopAnimation) {
            return;
        }

        var map = self.getMap();
        var animationTime = new Date().getTime() - mStartTime;
        var duration = self.getDuration();
        if (mFakeLastFrame && animationTime >= duration) {
            mFakeLastFrame = false;
            animationTime = duration - 1;
        }
        if (animationTime >= duration) {
            com.ptvag.webcomponent.map.ImageLoader.setHaltLoading(false);
        }

        var inBulkMode = map.inBulkMode();
        if (! inBulkMode) {
            map.startBulkMode();
        }

        var isFinished = self.doAnimation(animationTime);

        if (! inBulkMode) {
            map.endBulkMode();
        }

        if (! isFinished) {
            mNextStepPlanned = true;
            window.setTimeout(nextStep, 1);
        }
    };


    /**
     * Returns the center where the current animation started.
     *
     * @return {Map} the start center as point (a map with properties "x" and "y")
     *         in smart units.
     */
    self.getStartCenter = function() {
        return mStartCenter;
    }


    /**
     * Returns the zoom level where the current animation started.
     *
     * @return {double} the start zoom level.
     */
    self.getStartZoom = function() {
        return mStartZoom;
    }


    /**
     * Returns the rotation with which the current animation started.
     *
     * @return {double} the start rotation.
     */
    self.getStartRotation = function() {
        return mStartRotation;
    };


    /**
     * Does an animation step.
     *
     * @param animationTime {int} the time that passed since the animation
     *        started (in milliseconds).
     * @return {boolean} wheather the animation is finished.
     */
    self.doAnimation = function(animationTime) {
        throw new Error("doAnimation is abstract");
    }


    /**
     * Returns the linear interpolation of a point.
     *
     * @param startPoint {Map} the start point (a map with properties "x" and "y").
     * @param endPoint {Map} the end point (a map with properties "x" and "y").
     * @param factor {double} the relative position of the wanted point between
     *        start and end (as a value between 0 and 1).
     * @return {Map} the interpolated point (a map with properties "x" and "y").
     */
    self.interpolatePoint = function(startPoint, endPoint, factor) {
        return {
            x: startPoint.x + (endPoint.x - startPoint.x) * factor,
            y: startPoint.y + (endPoint.y - startPoint.y) * factor
        };
    };


    /**
     * Returns the interpolation of a zoom level. The interpolation is linear to
     * the tile width of the zoom levels (and not to the zoom levels themselves,
     * since zoom levels have an exponential scale)
     *
     * @param startLevel {double} the start zoom level.
     * @param endLevel {double} the end zoom level.
     * @param factor {double} the relative position of the wanted zoom level
     *        between start and end (as a value between 0 and 1).
     * @return {double} the interpolated zoom level.
     */
    self.interpolateZoom = function(startLevel, endLevel, factor) {
        // account for rounding errors
        if (factor == 0 || startLevel == endLevel) {
            return startLevel;
        }
        if (factor == 1) {
            return endLevel;
        }
        
        // NOTE: We interpolate the tile width and not the zoom directly,
        //       because the zoom has an exponential scale, but we want a
        //       linear interpolation
        var startTileWidth = CoordUtil.getTileWidth(startLevel);
        var endTileWidth   = CoordUtil.getTileWidth(endLevel);
        var visibleTileWidth = startTileWidth + (endTileWidth - startTileWidth) * factor;
        return CoordUtil.getLevelForTileWidth(visibleTileWidth);
    };


    /**
     * Returns the interpolation of a rotation angle.
     *
     * @param startRotation {double} the start rotation.
     * @param endRotation {double} the end rotation.
     * @param factor {double} the relative position of the desired rotation
     *        between start and end (as a value between 0 and 1).
     * @return {double} the interpolated rotation angle.
     */
    self.interpolateRotation = function(startRotation, endRotation, factor) {
        if (endRotation > startRotation) {
            var diff = endRotation - startRotation;
            if (diff > 180) {
                startRotation += 360;
            }
        } else if (endRotation < startRotation) {
            diff = startRotation - endRotation;
            if (diff > 180) {
                endRotation += 360;
            }
        }
        return startRotation + (endRotation - startRotation)*factor;
    };


    /**
     * Changes the visible map view in an optimized way (so the animation looks
     * smoother).
     *
     * @param newCenter {Map} the new visible center.
     * @param newZoom {double} the new visible zoom.
     * @param newRotation {double} the new rotation.
     * @param forceExactCenter {boolean} whether the specified center should be
     *     applied exactly or can be adjusted slightly for smoother animation.
     */
    self.setVisibleMapView = function(newCenter, newZoom, newRotation, forceExactCenter) {
        var theMap = self.getMap();
        var oldZoom = theMap.getVisibleZoom();
        if (oldZoom == newZoom && !forceExactCenter) {
            var oldCenter = theMap.getVisibleCenter();
            if (oldCenter.x != newCenter.x || oldCenter.y != newCenter.y) {
                var oldCenterPix = CoordUtil.smartUnit2Pixel(oldCenter, oldZoom);
                var newCenterPix = CoordUtil.smartUnit2Pixel(newCenter, newZoom);
                if (oldCenter.x != newCenter.x) {
                    newCenterPix.x = Math.round(newCenterPix.x) + 0.1;
                }
                if (oldCenter.y != newCenter.y) {
                    newCenterPix.y = Math.round(newCenterPix.y) + 0.1;
                }
                var relativeOffset = theMap.getRelativeOffset();
                var diffX = newCenterPix.x - oldCenterPix.x;
                var diffY = newCenterPix.y - oldCenterPix.y;
                theMap.setRelativeOffset({
                    x: Math.round(relativeOffset.x + diffX),
                    y: Math.round(relativeOffset.y - diffY)
                });
                newCenter = CoordUtil.pixel2SmartUnit(newCenterPix, newZoom);
            }
        }
        theMap.setVisibleCenter(newCenter);
        theMap.setVisibleZoom(newZoom);
        theMap.setVisibleRotation(newRotation);
    };

});


/** The map this layer belongs to. */
qxp.OO.addProperty({ name:"map", type:qxp.constant.Type.OBJECT, allowNull:false });

/** Whether to halt loading of images during animation. */
qxp.OO.addProperty({ name:"haltLoadingDuringAnimation", type:qxp.constant.Type.BOOLEAN, allowNull:false, defaultValue:false });
