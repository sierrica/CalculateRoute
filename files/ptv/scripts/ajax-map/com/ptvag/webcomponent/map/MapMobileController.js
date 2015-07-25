/**
 * A subclass of the map controller for mobile touch screen devices.
 *
 * @param targetMap {com.ptvag.webcomponent.map.Map} The map to control.
 * @param mainElement {Element} The main element of the map. Used for adding
 *        touch event handlers.
 */
qxp.OO.defineClass("com.ptvag.webcomponent.map.MapMobileController",
com.ptvag.webcomponent.map.MapController,
function(targetMap, mainElement) {

    var self = this;
    var map = com.ptvag.webcomponent.map;
    var CoordUtil = map.CoordUtil;
    var DomUtils = com.ptvag.webcomponent.util.DomUtils;

    map.MapController.call(self, targetMap, mainElement, false);

    var mMaxZoom = CoordUtil.TILE_WIDTHS.length - 1;
    var mMap = targetMap;
    var mMainElement = mainElement;
    var mTapCount = 0;
    var mTapTime = 0;
    var mTapData;
    var mFakeActiveLayer = false;

    var mGestureStartData = null;
    var mGestureStartCenter;
    var mGestureStartZoom;
    var mMinimumMovement;
    var mMinimumZoomChange;
    var mTouchData;
    var mBaseOffsetX;
    var mBaseOffsetY;

    var extractTouchData = function(evt) {
        var allTouches = evt.touches;
        if (allTouches == null) {
            return null;
        }
        var touchCount = allTouches.length;
        if (touchCount == 0) {
            return null;
        }
        var elementX = DomUtils.getAbsoluteX(mMainElement);
        var elementY = DomUtils.getAbsoluteY(mMainElement);
        var centerX = 0;
        var centerY = 0;
        var distance = 0;
        for (var i = 0; i < touchCount; ++i) {
            var touch = allTouches[i];
            var x = touch.pageX - elementX;
            var y = touch.pageY - elementY;
            centerX += x;
            centerY += y;
        }
        if (touchCount > 1) {
            centerX /= touchCount;
            centerY /= touchCount;
            for (var i = 0; i < touchCount; ++i) {
                var x = touch.pageX - elementX;
                var y = touch.pageY - elementY;
                var distX = x - centerX;
                var distY = y - centerY;
                distance += Math.sqrt(distX*distX + distY*distY);
            }
            distance /= touchCount;
        }
        return {centerX:Math.round(centerX), centerY:Math.round(centerY),
                distance:distance, touchCount:touchCount};
    };

    var minimumMovement = function(touchData1, touchData2) {
        var distX = touchData1.centerX - touchData2.centerX;
        var distY = touchData1.centerY - touchData2.centerY;
        var squareDist = distX*distX + distY*distY;
        if (squareDist >= 400) {
            return true;
        }
        return false;
    };

    var minimumZoomChange = function(touchData1, touchData2) {
        var diff = touchData1.distance - touchData2.distance;
        if (Math.abs(diff)*touchData1.touchCount >= 20) {
            return true;
        }
        return false;
    };
        
    var startGesture = function(evt) {
        mGestureStartData = extractTouchData(evt);
        if (mGestureStartData == null) {
            return;
        }
        mMap.getAnimator().stopAnimationAndKeepMapView();
        mGestureStartCenter = mMap.getVisibleCenter();
        mGestureStartZoom = mMap.getVisibleZoom();
        mMinimumMovement = (mMap.getZoom() != mGestureStartZoom);
        mGestureStartZoom = CoordUtil.getSmartUnitsPerPixel(mGestureStartZoom);
        mMinimumZoomChange = false;
        mBaseOffsetX = 0;
        mBaseOffsetY = 0;
        var now = (new Date()).getTime();
        if (now - mTapTime > 400) {
            mTapCount = 0;
        }
        mTapTime = now;
    };

    var endGesture = function() {
        if (mMinimumMovement) {
            mTapCount = 0;
            updateMap(true);
        } else {
            var now = (new Date()).getTime();
            if (now - mTapTime > 400) {
                mTapCount = 0;
            } else {
                if (mTapCount > 0) {
                    if (mTapData.touchCount != mGestureStartData.touchCount ||
                        minimumZoomChange(mTapData, mGestureStartData) ||
                        minimumMovement(mTapData, mGestureStartData)) {
                        mTapCount = 0;
                        mTapData = mGestureStartData;
                    }
                } else {
                    mTapData = mGestureStartData;
                }
                ++mTapCount;
            }
        }
        if (mTapCount > 0) {
            var tapX = mTapData.centerX;
            var tapY = mTapData.centerY;
            var tapCount = mTapCount;
            var tapTouchCount = mTapData.touchCount;
            window.setTimeout(function() {
                handleTap(tapX, tapY, tapCount, tapTouchCount);
            }, 0);
        }
        mGestureStartData = null;
    };

    var handleTap = function(tapX, tapY, tapCount, tapTouchCount) {
        if (self.getDisposed()) {
            return;
        }
        if (tapTouchCount == 1) {
            var clientX = tapX + DomUtils.getAbsoluteX(mMainElement) -
                DomUtils.getScrollX(window);
            var clientY = tapY + DomUtils.getAbsoluteY(mMainElement) -
                DomUtils.getScrollY(window);
            var evt = {clientX:clientX, clientY:clientY, which:1};
            for (var i = 0; i < tapCount; ++i) {
                self.onComponentMouseDown(evt);
                self.onComponentMouseUp(evt);
            }
            if (tapCount == 2) {
                mMap.zoomToPixelCoords(tapX, tapY, false, -2, 0, true);
            }
        } else if (tapTouchCount == 2) {
            mMap.zoomToPixelCoords(tapX, tapY, false, 2, 0, true);
        }
    };

    var updateMap = function(finalize) {
        if (!mMinimumZoomChange && !finalize) {
            //mFakeActiveLayer = true;
                // commented out - leads to display failures on iOS (most
                // likely due to a browser bug) and doesn't work while
                // zooming anyway
        }
        var alreadyInBulkMode = mMap.inBulkMode();
        if (!alreadyInBulkMode) {
            mMap.startBulkMode();
        }
        var zoomFactor = 1;
        if (mMinimumZoomChange) {
            var startDistance = mGestureStartData.distance;
            if (startDistance < 1) {
                startDistance = 1;
            }
            var touchDistance = mTouchData.distance;
            if (touchDistance < 1) {
                touchDistance = 1;
            }
            zoomFactor = startDistance/touchDistance;
        }
        var newZoom = zoomFactor*mGestureStartZoom;
        var zoomLevel = CoordUtil.getLevelForSmartUnitsPerPixel(newZoom);
        var newZoomLevel = zoomLevel;
        if (finalize) {
            if (!minimumZoomChange(mTouchData, mGestureStartData)) {
                newZoomLevel = Math.round(newZoomLevel);
            } else if (zoomFactor > 1) {
                newZoomLevel = Math.ceil(newZoomLevel);
            } else {
                newZoomLevel = Math.floor(newZoomLevel);
            }
        }
        if (newZoomLevel < 0) {
            newZoomLevel = 0;
        } else if (newZoomLevel > mMaxZoom) {
            newZoomLevel = mMaxZoom;
        }
        if (newZoomLevel != zoomLevel) {
            newZoom = CoordUtil.getSmartUnitsPerPixel(newZoomLevel);
        }
        if (finalize) {
            mMap.setZoom(newZoomLevel);
        } else if (mMinimumZoomChange) {
            mMap.setVisibleZoom(newZoomLevel);
        }
        var touchX = mTouchData.centerX;
        var touchY = mTouchData.centerY;
        var movementX = mTouchData.centerX - mGestureStartData.centerX;
        var movementY = mTouchData.centerY - mGestureStartData.centerY;
        var movement = mMap.transformPixelCoords(
            movementX, movementY, true, true, true);
        /*if (!mMinimumZoomChange) {
            var relativeOffset = mMap.getRelativeOffset();
            mMap.setRelativeOffset(
                {x:relativeOffset.x - movement.x + mBaseOffsetX,
                 y:relativeOffset.y - movement.y + mBaseOffsetY});
            mBaseOffsetX = movement.x;
            mBaseOffsetY = movement.y;
        }*/
            // commented out - see start of function
        var centerCorrectionX = touchX - mMap.getWidth()/2;
        var centerCorrectionY = touchY - mMap.getHeight()/2;
        var centerCorrection = mMap.transformPixelCoords(
            centerCorrectionX, centerCorrectionY, true, true, true);
        var newCenterX = mGestureStartCenter.x +
            centerCorrection.x*mGestureStartZoom -
            centerCorrection.x*newZoom -
            movement.x*mGestureStartZoom;
        var newCenterY = mGestureStartCenter.y -
            centerCorrection.y*mGestureStartZoom +
            centerCorrection.y*newZoom +
            movement.y*mGestureStartZoom;
        if (finalize) {
            if (mMap.getVisibleZoom() == newZoomLevel) {
                var oldAnimate = mMap.getAnimate();
                mMap.setAnimate(false);
                mMap.setCenter({x:newCenterX + 0.001, y:newCenterY});
                mMap.setAnimate(oldAnimate);
            } else {
                mMap.setCenter({x:newCenterX + 0.001, y:newCenterY});
            }
        } else {
            mMap.setVisibleCenter({x:newCenterX, y:newCenterY});
        }
        if (!alreadyInBulkMode) {
            mMap.endBulkMode();
        }
        mFakeActiveLayer = false;
    };

    var onTouchStart = function(evt) {
        var touches = evt.touches;
        if (touches != null && touches.length == 1) {
            var element = touches[0].target;
            while (element && element.nodeType == 1) {
                var zIndex = element.style.zIndex;
                if (zIndex != null && zIndex > 2) {
                    mGestureStartData = null;
                    return;
                }
                element = element.parentNode;
            }
        }
        evt.preventDefault();
        startGesture(evt);
    };

    var onTouchMove = function(evt) {
        if (mGestureStartData == null) {
            return;
        }
        evt.preventDefault();
        var touchData = extractTouchData(evt);
        if (touchData == null) {
            return;
        }
        if (touchData.touchCount != mGestureStartData.touchCount) {
            return;
        }
        if (!mMinimumZoomChange) {
            mMinimumZoomChange =
                minimumZoomChange(touchData, mGestureStartData);
            if (mMinimumZoomChange) {
                mMinimumMovement = true;
            }
        }
        if (!mMinimumMovement) {
            mMinimumMovement = minimumMovement(touchData, mGestureStartData);
        }
        if (mMinimumMovement) {
            mTouchData = touchData;
            updateMap(false);
        }
    };

    var onTouchEnd = function(evt) {
        if (mGestureStartData == null) {
            return;
        }
//console.log("onTouchEnd");
        evt.preventDefault();
        endGesture();
    };

    var onTouchCancel = function(evt) {
        if (mGestureStartData == null) {
            return;
        }
//console.log("onTouchEnd");
        evt.preventDefault();
        endGesture();
    };

    var onSelectStart = function(evt) {
        evt.preventDefault();
    };

    var onGestureStart = function(evt) {
        evt.preventDefault();
    };

    var onGestureChange = function(evt) {
        evt.preventDefault();
    };

    var onGestureEnd = function(evt) {
        evt.preventDefault();
    };

    // overridden
    var superGetActiveLayer = self.getActiveLayer;
    /** Overridden property getter. */
    self.getActiveLayer = function() {
        if (mFakeActiveLayer) {
            return self;
        }
        return superGetActiveLayer.apply(self, arguments);
    };

    // overridden
    self.initEvents = function() {
        // mMainElement.ontouchstart = onTouchStart;
        mMainElement.style.webkitUserSelect = "none";
        mMainElement.addEventListener("touchstart", onTouchStart, false);
        mMainElement.addEventListener("touchmove", onTouchMove, false);
        mMainElement.addEventListener("touchend", onTouchEnd, false);
        mMainElement.addEventListener("touchcancel", onTouchCancel, false);
        //mMainElement.addEventListener("selectstart", onSelectStart, false);
        mMainElement.addEventListener("gesturestart", onGestureStart, false);
        mMainElement.addEventListener("gesturechange", onGestureChange, false);
        mMainElement.addEventListener("gestureend", onGestureEnd, false);
    };

    self.initEvents();
});
