/**
 * A map layer showing a zoom slider.
 */
qxp.OO.defineClass("com.ptvag.webcomponent.map.layer.ZoomSliderLayer",
com.ptvag.webcomponent.map.layer.AbstractStaticAreaLayer,
function() {
    com.ptvag.webcomponent.map.layer.AbstractStaticAreaLayer.call(this);

    var self = this;

    var map = com.ptvag.webcomponent.map;

    var mGrooveElem;
    var mKnobElem;
    var mPlusElem = null;
    var mMinusElem = null;

    var mGrooveWidth = 11;

    var mKnobWidth = 19;
    var mKnobHeight = 11;
    var mKnobPosition;
    var mTopOffset;
    var mGrooveHeight;
    var mButtonSize = 13;
    
    var mMouseOverPlus = false;
    var mMouseOverMinus = false;
    var mPlusPressed = false;
    var mMinusPressed = false;
    var mPlusImage;
    var mPlusOverImage;
    var mMinusImage;
    var mMinusOverImage;
    var mCurrentPlusImage = null;
    var mCurrentMinusImage = null;
    var mCurrentPlusOpacity = null;
    var mCurrentMinusOpacity = null;

    var mInKnobMoveMode;
    var mKnobMoveOffset = parseInt(mKnobHeight/2);


    // overridden
    var superInit = self.init;
    self.init = function() {
        superInit.apply(self, arguments);

        self.getParentElement().style.cursor = "default";
        
        // Create the main div
        var areaElem = document.createElement("div");
        areaElem.style.position = "absolute";
        areaElem.style.left = "0px";
        areaElem.style.top = "0px";
        areaElem.style.width = self.getAreaWidth() + "px";
        areaElem.style.zIndex = self.getParentElement().style.zIndex;
        self.getParentElement().appendChild(areaElem);

        // Create the groove
        mGrooveElem = document.createElement("div");
        mGrooveElem.style.position = "absolute";
        mGrooveElem.style.left = ((mKnobWidth - mGrooveWidth) / 2) + "px";
        if (map.MapUtil.isBorderBoxSizingActive()) {
            mGrooveElem.style.width = mGrooveWidth + "px";
        } else {
            mGrooveElem.style.width = (mGrooveWidth - 2) + "px";
        }
        mGrooveElem.style.border = "1px solid gray";
        mGrooveElem.style.backgroundColor = "white";
        areaElem.appendChild(mGrooveElem);

        // Create the knob
        mKnobElem = document.createElement("img");
        mKnobElem.style.position = "absolute";
        mKnobElem.style.left = "0px";
        mKnobElem.style.width = mKnobWidth + "px";
        mKnobElem.style.height = mKnobHeight + "px";
        map.MapUtil.setImageSource(mKnobElem, map.MapUtil.rewriteURL("img/com/ptvag/webcomponent/map/zoom_slider_knob.png", true));
        areaElem.appendChild(mKnobElem);

        // Create the zoom buttons
        // (but don't add them to the area element yet)
        mPlusImage = new Image();
        mPlusImage.src = map.MapUtil.rewriteURL("img/com/ptvag/webcomponent/map/zoom_slider_plus.gif", true);
        mPlusOverImage = new Image();
        mPlusOverImage.src = map.MapUtil.rewriteURL("img/com/ptvag/webcomponent/map/zoom_slider_plus_over.gif", true);
        mMinusImage = new Image();
        mMinusImage.src = map.MapUtil.rewriteURL("img/com/ptvag/webcomponent/map/zoom_slider_minus.gif", true);
        mMinusOverImage = new Image();
        mMinusOverImage.src = map.MapUtil.rewriteURL("img/com/ptvag/webcomponent/map/zoom_slider_minus_over.gif", true);
        
        var buttonOffset = parseInt((mKnobWidth - mButtonSize)/2);
        mPlusElem = document.createElement("img");
        mPlusElem.style.position = "absolute";
        mPlusElem.style.left = buttonOffset + "px";
        mPlusElem.style.width = mButtonSize + "px";
        mPlusElem.style.height = mButtonSize + "px";
        mMinusElem = document.createElement("img");
        mMinusElem.style.position = "absolute";
        mMinusElem.style.left = buttonOffset + "px";
        mMinusElem.style.width = mButtonSize + "px";
        mMinusElem.style.height = mButtonSize + "px";
        
        self.getMap().addEventListener("changeInverseWheelZoom", redraw);
        self.setAreaElement(areaElem);
    };


    var superModifyAreaOpacity = self._modifyAreaOpacity;
    self._modifyAreaOpacity = function() {
        setButtonOpacity();
    };
    
    
    /**
     * Set the button opacity.
     */
    
    var setButtonOpacity = function() {
        var areaOpacity = self.getAreaOpacity();
        superModifyAreaOpacity.call(self, areaOpacity);
        var blendingOpacityOut = self.getBlendingOpacityOut();
        var zoom = self.getMap().getVisibleZoom();
        var maxZoom = map.CoordUtil.TILE_WIDTHS.length - 1;
        var img = mPlusImage;
        if (zoom == 0) {
            var opacity = blendingOpacityOut;
        } else {
            opacity = areaOpacity;
            if (mMouseOverPlus) {
                img = mPlusOverImage;
            }
        }
        if (mCurrentPlusImage != img) {
            map.MapUtil.setImageSource(mPlusElem, img.src);
            mCurrentPlusImage = img;
        }
        if (mCurrentPlusOpacity != opacity) {
            map.MapUtil.setElementOpacity(mPlusElem, opacity);
            mCurrentPlusOpacity = opacity;
        }
        img = mMinusImage;
        if (zoom == maxZoom) {
            opacity = blendingOpacityOut;
        } else {
            opacity = areaOpacity;
            if (mMouseOverMinus) {
                img = mMinusOverImage;
            }
        }
        if (mCurrentMinusImage != img) {
            map.MapUtil.setImageSource(mMinusElem, img.src);
            mCurrentMinusImage = img;
        }
        if (mCurrentMinusOpacity != opacity) {
            map.MapUtil.setElementOpacity(mMinusElem, opacity);
            mCurrentMinusOpacity = opacity;
        }
    };
    
    
    /**
     * React to changes in height or the showZoomSteps property.
     */
    
    var redraw = function() {
        var areaHeight = self.getComputedAreaHeight();
        var parentElement = self.getParentElement();
        if (self.getShowZoomButtons()) {
            var inverseZoom = self.getMap().getInverseWheelZoom();
            var topElem = (inverseZoom ? mMinusElem : mPlusElem);
            var bottomElem = (inverseZoom ? mPlusElem : mMinusElem);
            
            topElem.style.top = "0px";
            bottomElem.style.top = (areaHeight - mButtonSize) + "px";
            var areaElement = self.getAreaElement();
            if (!mPlusElem.parentNode) {
                parentElement.appendChild(topElem);
                parentElement.appendChild(bottomElem);
            }
            mTopOffset = mButtonSize + mKnobMoveOffset;
        } else {
            if (mPlusElem.parentNode) {
                parentElement.removeChild(mPlusElem);
                parentElement.removeChild(mMinusElem);
            }
            mTopOffset = 0;
        }
        var height = areaHeight - mKnobHeight - mTopOffset*2;
        mGrooveHeight = height;
        positionKnob();
        if (!map.MapUtil.isBorderBoxSizingActive()) {
            height -= 2;
        }
        mGrooveElem.style.top = mKnobMoveOffset + mTopOffset + "px";
        mGrooveElem.style.height = (height + 1) + "px";
            // +1 to make the bottom border positioned exactly like the
            // top border with regard to the knob

        while (mGrooveElem.firstChild) {
            mGrooveElem.removeChild(mGrooveElem.firstChild);
        }
        if (self.getShowZoomSteps()) {
            var maxZoom = map.CoordUtil.TILE_WIDTHS.length - 1;
            for (var i = 1; i < maxZoom; ++i) {
                var step = document.createElement("div");
                step.style.position = "absolute";
                step.style.width = "100%";
                step.style.height = "1px";
                step.style.borderTop = "1px solid gray";
                step.style.left = "0px";
                step.style.top = Math.round(mGrooveHeight*i/maxZoom - 1) + "px";
                mGrooveElem.appendChild(step);
            }
        }
    }
    
    
    // overridden
    var superModifyComputedAreaHeight = self._modifyComputedAreaHeight;
    self._modifyComputedAreaHeight = function() {
        redraw();
        superModifyComputedAreaHeight.apply(self, arguments);
    };


    // property modifier
    self._modifyShowZoomSteps = function() {
        redraw();
    }
    
    
    // property modifier
    self._modifyShowZoomButtons = function() {
        mMouseOverPlus = false;
        mMouseOverMinus = false;
        mPlusPressed = false;
        mMinusPressed = false;
        redraw();
    }
    
    
    // overridden
    var superOnViewChanged = self.onViewChanged;
    self.onViewChanged = function(evt) {
        superOnViewChanged(evt);

        if (evt.zoomChanged || evt.heightChanged) {
            positionKnob();
        }
    }


    /**
     * Positions the knob according to the current zoom level of the map.
     */
    var positionKnob = function() {
        var zoom = self.getMap().getVisibleZoom();
        var maxZoom = map.CoordUtil.TILE_WIDTHS.length - 1;

        var pseudoZoom = zoom;
        if (self.getMap().getInverseWheelZoom()) {
            pseudoZoom = maxZoom - zoom;
        }
        mKnobPosition = Math.round(mGrooveHeight * pseudoZoom / maxZoom);
        mKnobElem.style.top = mKnobPosition + mTopOffset + "px";
        setButtonOpacity();
    };


    /**
     * Sets the know to the mouse coordinates of the specified event.
     *
     * @param   evt {Map}           the event.
     */
    
    var setKnobToMouse = function(evt) {
        var newPos = evt.relMouseY - self.getComputedAreaTop() - mKnobMoveOffset;
        newPos -= mTopOffset;
        mKnobPosition = Math.max(0, Math.min(mGrooveHeight, newPos));
        mKnobElem.style.top = mKnobPosition + mTopOffset + "px";
        setButtonOpacity();
    };
    
    
    // overridden
    var superOnMouseMove = self.onMouseMove;
    self.onMouseMove = function(evt) {
        if (mInKnobMoveMode) {
            setKnobToMouse(evt);
            return false;
        } else if (self.getShowZoomButtons()) {
            var left   = self.getComputedAreaLeft();
            var top    = self.getComputedAreaTop();
            var width  = self.getComputedAreaWidth();
            var height = self.getComputedAreaHeight();
            var buttonOffset = (mKnobWidth - mButtonSize)/2;
            var inverseWheelZoom = self.getMap().getInverseWheelZoom();
    
            mMouseOverPlus = false;
            mMouseOverMinus = false;
            if (evt.relMouseX >= left + buttonOffset &&
                evt.relMouseX < left + buttonOffset + mButtonSize) {
                // we may have to highlight a button
                if (evt.relMouseY >= top && evt.relMouseY < top + mButtonSize) {
                    if (inverseWheelZoom) {
                        if (!mPlusPressed) {
                            mMouseOverMinus = true;
                        }
                    } else {
                        if (!mMinusPressed) {
                            mMouseOverPlus = true;
                        }
                    }
                } else if (evt.relMouseY >= top + height - mButtonSize &&
                           evt.relMouseY < top + height) {
                    if (inverseWheelZoom) {
                        if (!mMinusPressed) {
                            mMouseOverPlus = true;
                        }
                    } else {
                        if (!mPlusPressed) {
                            mMouseOverMinus = true;
                        }
                    }
                }
            }
            setButtonOpacity();
        }
        return superOnMouseMove(evt);
    };


    // overridden
    var superOnMouseOut = self.onMouseOut;
    self.onMouseOut = function(evt) {
        superOnMouseOut(evt);

        if (mInKnobMoveMode) {
            mInKnobMoveMode = false;
            positionKnob();
        }
        mMouseOverPlus = false;
        mMouseOverMinus = false;
        mPlusPressed = false;
        mMinusPressed = false;
        setButtonOpacity();

        return false;
    };


    // overridden
    self.onMouseDown = function(evt) {
        self.onMouseMove(evt);
        var left   = self.getComputedAreaLeft();
        var top    = self.getComputedAreaTop();
        var width  = self.getComputedAreaWidth();
        var height = self.getComputedAreaHeight();

        if (evt.relMouseX >= left && evt.relMouseX < left + width
            && evt.relMouseY >= top + mTopOffset
            && evt.relMouseY <= top + mTopOffset + mGrooveHeight + mKnobHeight)
        {
            // The mouse is over the slider
            setKnobToMouse(evt);
            mInKnobMoveMode = true;

            return true;
        } else if (mMouseOverPlus) {
            mPlusPressed = true;
            return true;
        } else if (mMouseOverMinus) {
            mMinusPressed = true;
            return true;
        }
        return false;
    };


    // overridden
    self.onMouseUp = function(evt) {
        self.onMouseMove(evt);
        var plusPressed = mPlusPressed;
        mPlusPressed = false;
        var minusPressed = mMinusPressed;
        mMinusPressed = false;
        var theMap = self.getMap();
        if (mInKnobMoveMode) {
            mInKnobMoveMode = false;

            var maxZoom = map.CoordUtil.TILE_WIDTHS.length - 1;

            var newZoom = Math.round(maxZoom * mKnobPosition / mGrooveHeight);
            if (theMap.getInverseWheelZoom()) {
                newZoom = maxZoom - newZoom;
            }
            if (newZoom == theMap.getZoom()) {
                // The zoom has not changed -> Position the knob
                positionKnob();
            } else {
                // The zoom has changed -> Set the new zoom
                // (The knob will be positioned by _modifyZoom)
                theMap.startLoggingAction("user:zoomSlider");
                try {
                    theMap.setZoom(newZoom);
                } finally {
                    theMap.endLoggingAction();
                }
            }
            return true;
        }
        if (mMouseOverPlus && plusPressed) {
            theMap.setZoom(theMap.getZoom() - 1);
            return true;
        }
        if (mMouseOverMinus && minusPressed) {
            theMap.setZoom(theMap.getZoom() + 1);
            return true;
        }

        return false;
    };


    // overridden
    var superDispose = self.dispose;
    self.dispose = function() {
        if (self.getDisposed()) {
            return;
        }

        self.getMap().removeEventListener("changeInverseWheelZoom", redraw);
        mGrooveElem = null;
        mKnobElem = null;
        mPlusElem = null;
        mMinusElem = null;
        mPlusImage = null;
        mPlusOverImage = null;
        mMinusImage = null;
        mMinusOverImage = null;
        mCurrentPlusImage = null;
        mCurrentMinusImage = null;

        superDispose.call(self);
    };


    /**
     * Initializes the instance.
     */
    var init = function() {
        self.setAreaWidth(mKnobWidth);
    };


    init();

});


// overridden
qxp.OO.changeProperty({ name:"useBlending", type:qxp.constant.Type.BOOLEAN, defaultValue:true });

/** Whether to show "+" and "-" buttons above and below the zoom slider. */
qxp.OO.addProperty({ name:"showZoomButtons", type:qxp.constant.Type.BOOLEAN, allowNull:false, defaultValue:true });

/**
 * Whether to show lines for the individual zoom levels (so that the slider
 * appears with a raster). Please note that this only affects the appearance of
 * the zoom slider - even when no zoom steps are shown, there are still
 * discrete zoom levels (i.e. you can't put the slider "between" two of the
 * pre-defined zoom levels).
 */
qxp.OO.addProperty({ name:"showZoomSteps", type:qxp.constant.Type.BOOLEAN, allowNull:false, defaultValue:true });
