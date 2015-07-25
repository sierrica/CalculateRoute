/**
 * Abstract super class for layers showing a map.
 * 
 * @param   requestBuilder {com.ptvag.webcomponent.map.RequestBuilder}
 *              the RequestBuilder to use for making server requests.
 */
qxp.OO.defineClass("com.ptvag.webcomponent.map.layer.AbstractMapLayer",
com.ptvag.webcomponent.map.layer.AbstractStaticAreaLayer,
function(requestBuilder) {
    com.ptvag.webcomponent.map.layer.AbstractStaticAreaLayer.call(this);

    var self = this;
    var map = com.ptvag.webcomponent.map;

    /**
     * The element used as overlay over this layer.
     * (Used for the disabled look of the overview layer)
     */
    var mOverlayElem;

    var mStartMouseX;
    var mStartMouseY;

    var mInPanningMode = false;
    var mInZoomBoxMode = false;
    
    var mWheelTimeout = null;
    var mWheelTicks;

    var mNoAreaOpacityError = false;


    // overridden
    var superInit = self.init;
    self.init = function() {
        mNoAreaOpacityError = true;
        superInit.apply(self, arguments);
        
        var parentElement = self.getParentElement();
        
        // Create the main div
        var areaElem = document.createElement("div");
        areaElem.style.position = "absolute";
        areaElem.style.left = "0px";
        areaElem.style.top = "0px";
        if (!self.isRelative() && !self.getMap().getTileDebugMode()) {
            areaElem.style.overflow = "hidden";
        }
        var areaBorderWidth = self.getAreaBorderWidth();
        if (areaBorderWidth) {
            areaElem.style.border = areaBorderWidth + "px solid #808080";
        }
        parentElement.appendChild(areaElem);

        self._modifyOverlayOpacity(self.getOverlayOpacity());
        self._modifyLayerOpacity(self.getLayerOpacity());
            // force modifier calls, even for the default values

        self.setAreaElement(areaElem);
        mNoAreaOpacityError = false;
    };


    // overridden
    var superModifyAreaOpacity = self._modifyAreaOpacity;
    self._modifyAreaOpacity = function() {
        if (!mNoAreaOpacityError) {
            throw new Error("Don't set the areaOpacity for map layers - use layerOpacity instead");
        }
        var needsOpacityHack = self.needsOpacityHack();
        if (needsOpacityHack) {
            self.setNeedsOpacityHack(false);
        }
        superModifyAreaOpacity.call(self, 1);
        if (needsOpacityHack) {
            self.setNeedsOpacityHack(needsOpacityHack);
        }
    };


    // property modifier
    self._modifyLayerOpacity = function(propValue) {
        var parentElement = self.getParentElement();
        if (parentElement != null) {
            map.MapUtil.setElementOpacity(parentElement, propValue);
        }
    };
    
    
    // property modifier
    self._modifyOverlayOpacity = function(propValue) {
        if (propValue == 0) {
            if (mOverlayElem != null) {
                mOverlayElem.parentNode.removeChild(mOverlayElem);
                mOverlayElem = null;
            }
        } else {
            if (mOverlayElem == null) {
                parentElement = self.getParentElement();
                if (parentElement != null) {
                    mOverlayElem = document.createElement("div");
                    mOverlayElem.style.position = "absolute";
                    if (self.isRelative() && !self.needsOpacityHack() &&
                        (!qxp.sys.Client.getInstance().isMshtml() ||
                         !com.ptvag.webcomponent.map.Map.IE_FAST_OPACITY)) {
                        var opacityHackSize =
                            com.ptvag.webcomponent.map.Map.OPACITY_HACK_SIZE;
                        mOverlayElem.style.left = -opacityHackSize/2 + "px";
                        mOverlayElem.style.top = -opacityHackSize/2 + "px";
                        mOverlayElem.style.width = opacityHackSize + "px";
                        mOverlayElem.style.height = opacityHackSize + "px";
                    } else {
                        mOverlayElem.style.left = "0px";
                        mOverlayElem.style.top = "0px";
                        mOverlayElem.style.width = "100%";
                        mOverlayElem.style.height = "100%";
                    }
                    mOverlayElem.style.zIndex = 1;
                    mOverlayElem.style.backgroundColor = self.getOverlayColor();
                    map.MapUtil.setElementOpacity(mOverlayElem, propValue);
                    parentElement.appendChild(mOverlayElem);
                }
            } else {
                map.MapUtil.setElementOpacity(mOverlayElem, propValue);
            }
        }
    };
    
    
    // property modifier
    self._modifyOverlayColor = function() {
        if (mOverlayElem != null) {
            mOverlayElem.style.backgroundColor = self.getOverlayColor();
        }
    };
    
    
    /**
     * Returns the zoom level shown by this map layer.
     *
     * @return {double} the zoom level shown by this map layer.
     */
    self.getShownZoom = function() {
        return self.getMap().getZoom();
    };


    /**
     * Returns the request builder used for this layer.
     * 
     * @return  {com.ptvag.webcomponent.map.RequestBuilder}     the request
     *                                                          builder.
     */
    
    self.getRequestBuilder = function() {
        return requestBuilder;
    };
    
    
    // overridden
    self.onMouseDown = function(evt) {
        var EventUtils = com.ptvag.webcomponent.util.EventUtils;
        if (evt.shiftKey || evt.altKey || evt.metaKey ||
            (evt.ctrlKey && !qxp.sys.Client.getInstance().runsOnMacintosh())) {
            return false;   // don't react if there's a modifier
        }

        if (self.isPositionInArea(evt.relMouseX, evt.relMouseY)) {
            // Cancel the last action (if not already done)
            cancelMouseAction();
    
            var actionMode = self.getMap().getController().getActionMode();
            var actionModeMove = (actionMode == map.MapController.ACTION_MODE_MOVE);
            if (actionModeMove ? EventUtils.isLeftMouseButton(evt) : EventUtils.isRightMouseButton(evt)) {
                mInPanningMode = true;
                self.getMap().setCenterIsAdjusting(true);
                self.getMap().setConfigurableCursor("move");
            } else if (actionModeMove ? EventUtils.isRightMouseButton(evt) : EventUtils.isLeftMouseButton(evt)) {
                mInZoomBoxMode = true;
                self.getMap().setConfigurableCursor("zoom");
            }

            self.getMap().getController().setActiveLayer(self);
            mStartMouseX = evt.relMouseX;
            mStartMouseY = evt.relMouseY;
    
            return true;
        }

        return false;
    };


    // overridden
    self.onMouseUp = function(evt) {
        var retVal = false;
        if (mInPanningMode || mInZoomBoxMode) {
            retVal = true;  // for now, assume we handled the event
            var theMap = self.getMap();
            var distanceX = mStartMouseX - evt.relMouseX;
            var distanceY = mStartMouseY - evt.relMouseY;
            var distanceSquared = distanceX*distanceX + distanceY*distanceY;
            if (distanceSquared <= map.layer.AbstractMapLayer.MAX_CLICK_TOLERANCE_SQUARED) {
                retVal = false;     // not enough movement => let other layers
                                    // handle clicks if they want
            }
            self.getMap().startLoggingAction(mInPanningMode ? "user:move" : "user:rectZoom");
            try {
                if (mInZoomBoxMode) {
                    cancelMouseAction();
                    
                    var areaLeft   = self.getComputedAreaLeft();
                    var areaTop    = self.getComputedAreaTop();
                    var areaWidth  = self.getComputedAreaWidth();
                    var areaHeight = self.getComputedAreaHeight();
                    var boxEndX = Math.max(areaLeft, Math.min(areaLeft + areaWidth, evt.relMouseX));
                    var boxEndY = Math.max(areaTop,  Math.min(areaTop + areaHeight, evt.relMouseY));

                    var startRelPix = getPositionFromCenter({x:mStartMouseX, y:mStartMouseY});
                    var endRelPix   = getPositionFromCenter({x:boxEndX, y:boxEndY});

                    var boxWidthPix  = Math.abs(startRelPix.x - endRelPix.x);
                    var boxHeightPix = Math.abs(startRelPix.y - endRelPix.y);
                    var minBoxSize = map.layer.AbstractMapLayer.MIN_ZOOM_BOX_SIZE;
                    if (boxWidthPix > minBoxSize && boxHeightPix > minBoxSize) {
                        var shownZoom = self.getShownZoom();
                        var mapZoom = self.getMap().getZoom();
                        var zoomFactor = Math.pow(map.CoordUtil.ZOOM_LEVEL_FACTOR, shownZoom - mapZoom);

                        // Get the new center
                        var mapCenterSu = self.getMap().getCenter();
                        var mapCenterAbsPix = map.CoordUtil.smartUnit2Pixel(mapCenterSu, shownZoom);
                        var boxCenterAbsPix = theMap.transformPixelCoords(
                            (startRelPix.x + endRelPix.x) / 2,
                            (startRelPix.y + endRelPix.y) / 2,
                            true, true, true);
                        boxCenterAbsPix.x =
                            mapCenterAbsPix.x + boxCenterAbsPix.x;
                        boxCenterAbsPix.y =
                            mapCenterAbsPix.y - boxCenterAbsPix.y;
                        var boxCenterSu = map.CoordUtil.pixel2SmartUnit(boxCenterAbsPix, shownZoom);

                        // Get the size of the zoom box in smart units
                        var suPerPixel = map.CoordUtil.getSmartUnitsPerPixel(shownZoom);

                        var boxWidthSu  = boxWidthPix  * suPerPixel;
                        var boxHeightSu = boxHeightPix * suPerPixel;

                        // Get the new zoom factor
                        var newSuPerPixel;
                        if (self.getApplyZoomRectToMainMap()) {
                            var mapWidthPix  = self.getMap().getWidth();
                            var mapHeightPix = self.getMap().getHeight();

                            newSuPerPixel = Math.max(boxWidthSu / mapWidthPix, boxHeightSu / mapHeightPix);
                        } else {
                            // Get the size of the zoom box in the map's zoom factor
                            var scaledAreaWidthPix  = areaWidth * zoomFactor;
                            var scaledAreaHeightPix = areaWidth * zoomFactor;

                            newSuPerPixel = Math.max(boxWidthSu / scaledAreaWidthPix, boxHeightSu / scaledAreaHeightPix);
                        }

                        // Set the new center and zoom
                        var alreadyInBulkMode = self.getMap().inBulkMode();
                        if (! alreadyInBulkMode) {
                            self.getMap().startBulkMode();
                        }

                        self.getMap().setZoomInSmartUnitsPerPixel(newSuPerPixel);
                        self.getMap().setCenter(boxCenterSu);

                        if (! alreadyInBulkMode) {
                            self.getMap().endBulkMode();
                        }
                    }
                } else {
                    cancelMouseAction();
                }
            } finally {
                self.getMap().endLoggingAction();
            }
        }

        return retVal;
    };


    // overridden
    self.onMouseOut = function(evt) {
        if (mInPanningMode) {
            self.getMap().startLoggingAction("user:move");
            try {
                cancelMouseAction();
            } finally {
                self.getMap().endLoggingAction();
            }
        } else {
            cancelMouseAction();
        }

        return false;
    };


    // overridden
    self.onMouseMove = function(evt) {
        var mapInstance = self.getMap();
        var lastMousePos = mapInstance.getController().getLastMousePositon();
        if (mInPanningMode && lastMousePos.x && lastMousePos.y) {
            var shownZoom = self.getShownZoom();
            var centerSu = mapInstance.getCenter();
            var centerPix = map.CoordUtil.smartUnit2Pixel(centerSu, shownZoom);
            var offsetX = lastMousePos.x - evt.relMouseX;
            var offsetY = lastMousePos.y - evt.relMouseY;
            var rotatedCoords = mapInstance.transformPixelCoords(
                offsetX, offsetY, true, true, true);
            offsetX = rotatedCoords.x;
            offsetY = rotatedCoords.y;
            var newCenterPix = { x:centerPix.x + offsetX,
                                 y:centerPix.y - offsetY };

            var animate = mapInstance.getAnimate();
            if (animate) {
                mapInstance.setAnimate(false);
            }
            var autoBulkMode = mapInstance.getUseAutoBulkMode();
            if (autoBulkMode) {
                mapInstance.setUseAutoBulkMode(false);
            }

            var mapZoom = mapInstance.getZoom();
            if (shownZoom != mapZoom) {
                var shownTileWidth = map.CoordUtil.getTileWidth(shownZoom);
                var mapTileWidth = map.CoordUtil.getTileWidth(mapZoom);
                var factor = shownTileWidth/mapTileWidth;
                offsetX *= factor;
                offsetY *= factor;
            }
            var relativeOffset = mapInstance.getRelativeOffset();
            mapInstance.setRelativeOffset({ x:relativeOffset.x + offsetX,
                                            y:relativeOffset.y + offsetY });
            //self.info("offset: " + (relativeOffset.x + offsetX) + " / " + (relativeOffset.y + offsetY));
            mapInstance.setCenter(map.CoordUtil.pixel2SmartUnit(newCenterPix, shownZoom));

            if (animate) {
                mapInstance.setAnimate(true);
            }
            if (autoBulkMode) {
                mapInstance.setUseAutoBulkMode(true);
            }
        } else if (mInZoomBoxMode) {
            var areaLeft   = self.getComputedAreaLeft();
            var areaTop    = self.getComputedAreaTop();
            var areaWidth  = self.getComputedAreaWidth();
            var areaHeight = self.getComputedAreaHeight();
            var boxEndX = Math.max(areaLeft, Math.min(areaLeft + areaWidth, evt.relMouseX));
            var boxEndY = Math.max(areaTop,  Math.min(areaTop + areaHeight, evt.relMouseY));

            mapInstance.showZoomBox(mStartMouseX, mStartMouseY, boxEndX, boxEndY);
        }

        return false;
    };


    // overridden
    self.onMouseWheel = function(evt) {
        // NOTE: We have to use lastMousePos, because the mouse position is
        //       broken in wheel events on Firefox (IE not tested)
        var theMap = self.getMap();
        var mapController = theMap.getController();
        var lastMousePos = mapController.getLastMousePositon();
        if (theMap.getAllowMouseWheelZoom() &&
            self.isPositionInArea(lastMousePos.x, lastMousePos.y))
        {
            if (mapController.getActiveLayer() == null) {
                var wheelTicks = evt.wheelTicks;
                if (theMap.getInverseWheelZoom()) {
                    wheelTicks = -wheelTicks;
                }
                if (mWheelTimeout != null) {
                    window.clearTimeout(mWheelTimeout);
                    mWheelTicks += wheelTicks;
                } else {
                    mWheelTicks = wheelTicks;
                }
    
                mWheelTimeout = window.setTimeout(function() {
                    if (mWheelTimeout == null) {
                        return;     // workaround for IE bug
                    }
                    mWheelTimeout = null;
                    var centerPos = getPositionFromCenter(
                        { x:lastMousePos.x, y:lastMousePos.y });
                    theMap.zoomToPixelCoords(
                        centerPos.x, centerPos.y, true, mWheelTicks,
                        self.getShownZoom() - theMap.getZoom(), true);
                }, 150);
            }

            return true;
        }

        return false;
    };


    // overridden
    self.onMouseDblClick = function(evt) {
        var theMap = self.getMap();
        var mapController = theMap.getController();
        var lastMousePos = mapController.getLastMousePositon();
        if (theMap.getAllowDoubleClickZoom() &&
            self.isPositionInArea(lastMousePos.x, lastMousePos.y)) {
            if (mapController.getActiveLayer() == null) {
                var centerPos = getPositionFromCenter(
                    { x:lastMousePos.x, y:lastMousePos.y });
                theMap.zoomToPixelCoords(centerPos.x, centerPos.y, true,
                    -2, self.getShownZoom() - theMap.getZoom(), true);
            }
            return true;
        }
        return false;
    };


    // overridden
    self.onRightMouseDblClick = function(evt) {
        var theMap = self.getMap();
        var mapController = theMap.getController();
        var lastMousePos = mapController.getLastMousePositon();
        if (theMap.getAllowDoubleRightClickZoom() &&
            self.isPositionInArea(lastMousePos.x, lastMousePos.y)) {
            if (mapController.getActiveLayer() == null) {
                var centerPos = getPositionFromCenter(
                    { x:lastMousePos.x, y:lastMousePos.y });
                theMap.zoomToPixelCoords(centerPos.x, centerPos.y, true,
                    2, self.getShownZoom() - theMap.getZoom(), true);
            }
            return true;
        }
        return false;
    };


    // overridden
    self.onKeyDown = function(evt) {
        var EventUtils = com.ptvag.webcomponent.util.EventUtils;
        //self.info("onKeyDown: " + evt.keyCode);
        var theMap = self.getMap();
        if (mInZoomBoxMode && evt.keyCode == EventUtils.KEY_CODE_ESC) {
            cancelMouseAction();
            theMap.getController().ignoreNextClick();
            return true;
        }
        if (!theMap.enableKeyboardControl()) {
            return false;
        }
        var consumed = false;
        if (evt.keyCode == EventUtils.KEY_CODE_LEFT) {
            theMap.moveCenterInPercent(-0.5, 0, true);
            consumed = true;
        } else if (evt.keyCode == EventUtils.KEY_CODE_RIGHT) {
            theMap.moveCenterInPercent(0.5, 0, true);
            consumed = true;
        } else if (evt.keyCode == EventUtils.KEY_CODE_UP) {
            theMap.moveCenterInPercent(0, 0.5, true);
            consumed = true;
        } else if (evt.keyCode == EventUtils.KEY_CODE_DOWN) {
            theMap.moveCenterInPercent(0, -0.5, true);
            consumed = true;
        } else if (evt.keyCode == EventUtils.KEY_CODE_PLUS ||
                   evt.keyCode == EventUtils.KEY_CODE_KEYPAD_PLUS) {
            theMap.setZoom(Math.ceil(theMap.getVisibleZoom() - 1));
            consumed = true;
        } else if (evt.keyCode == EventUtils.KEY_CODE_MINUS ||
                   evt.keyCode == EventUtils.KEY_CODE_KEYPAD_MINUS) {
            theMap.setZoom(Math.floor(theMap.getVisibleZoom() + 1));
            consumed = true;
        } else if (evt.keyCode == 88 && theMap.enableKeyboardRotation()) {
            theMap.setRotation(
                (Math.floor(theMap.getVisibleRotation()/15) + 1)*15);
           consumed = true;
        } else if (evt.keyCode == 86 && theMap.enableKeyboardRotation()) {
            theMap.setRotation(
                (Math.ceil(theMap.getVisibleRotation()/15) - 1)*15);
           consumed = true;
        }
        return consumed;
    };


    /**
     * Returns the distance from the area's center in pixels.
     */
    var getPositionFromCenter = function(relPixPoint) {
        return {
            x:relPixPoint.x - self.getComputedAreaLeft() - self.getComputedAreaWidth() / 2,
            y:relPixPoint.y - self.getComputedAreaTop()  - self.getComputedAreaHeight() / 2
        };
    };


    /**
     * Cancels the current mouse action and returns to mouse mode "none".
     */
    var cancelMouseAction = function() {
        if (mInZoomBoxMode) {
            self.getMap().hideZoomBox();
        }

        self.getMap().setConfigurableCursor("default");
        self.getMap().setCenterIsAdjusting(false);
        self.getMap().getController().setActiveLayer(null);
        mInPanningMode = false;
        mInZoomBoxMode = false;
    };


    /**
     * Returns whether this layer is currently in zoom box mode (meaning the
     * user is in the process of drawing a zoom box on the layer).
     *
     * @return  {boolean}           whether the layer is in zoom box mode.
     */
    self.isInZoomBoxMode = function() {
        return mInZoomBoxMode;
    }
    
    
    /**
     * Sets the visibility of the specified server map layer for this
     * client-side map layer.
     * 
     * @param   layer {string}      the name of the server map layer
     *                              (e.g. "Street").
     * @param   visible {boolean}   whether the layer should be visible in
     *                              requested map images.
     */
    self.setServerLayerVisible = function(layer, visible) {
        requestBuilder.setVisible(layer, visible);
    };
    
    
    // overridden
    //var superPrint = self.print;
    //self.print = function(ctx, htmlContainer, htmlBackground) {
    //    var parentNode;
    //    if (mOverlayElem != null) {
    //        parentNode = mOverlayElem.parentNode;
    //        parentNode.removeChild(mOverlayElem);
    //    }
    //    superPrint.call(self, ctx, htmlContainer, htmlBackground);
    //    if (mOverlayElem != null) {
    //        parentNode.appendChild(mOverlayElem);
    //    }
    //};


    // overridden
    self.doPrintStaticArea = function(ctx, htmlContainer, htmlBackground) {
        // TODO: ask for the computed values only once
        ctx.globalAlpha = self.getLayerOpacity();
        self.doPrintMap(ctx, htmlContainer, htmlBackground);
        var areaBorderWidth = self.getAreaBorderWidth();
        if (areaBorderWidth) {
            ctx.strokeStyle = "rgb(128, 128, 128)";
            ctx.lineWidth = areaBorderWidth;
            ctx.lineCap = "butt";
            ctx.lineJoin = "miter";
            ctx.beginPath();
            //self.info(self.getComputedAreaLeft() + "/" + self.getComputedAreaWidth());
            ctx.rect(parseInt(self.getComputedAreaLeft() + areaBorderWidth/2),
                     parseInt(self.getComputedAreaTop() + areaBorderWidth/2),
                     self.getComputedAreaWidth() - areaBorderWidth,
                     self.getComputedAreaHeight() - areaBorderWidth);
            ctx.stroke();
        }
        var overlayOpacity = self.getOverlayOpacity();
        if (overlayOpacity != 0) {
            ctx.globalAlpha = overlayOpacity;
            ctx.fillStyle = self.getOverlayColor();
            ctx.beginPath();
            ctx.rect(self.getComputedAreaLeft(), self.getComputedAreaTop(),
                     self.getComputedAreaWidth(), self.getComputedAreaHeight());
            ctx.fill();
        }
        ctx.globalAlpha = 1;
    };


    /**
     * Prints the contents of the layer. The default implementation is empty.
     *
     * @param   ctx {var}           the canvas 2d context to draw vector
     *                              elements in.
     * @param   htmlContainer {Element}     a container for HTML elements
     *                                      (rendered in front of the canvas).
     * @param   htmlBackground {Element}    a container for HTML elements
     *                                      behind the canvas. This doesn't
     *                                      work in most browsers, and this
     *                                      parameter is always
     *                                      <code>null</code> for now.
     */
    self.doPrintMap = function(ctx, htmlContainer, htmlBackground) {
        // nothing to see here, move along
    };


    // overridden
    var superDispose = self.dispose;
    self.dispose = function() {
        if (self.getDisposed()) {
            return;
        }

        mOverlayElem = null;

        superDispose.call(self);
    };

});

/**
 * {int} The minimum size (in pixels) the zoom box must have before a zoom is
 * executed. Used to prevent zooming by accident.
 */
qxp.Class.MIN_ZOOM_BOX_SIZE = 10;

/**
 * {int} The minimum movement when panning so that a click is still recognized
 * as a click.
 */
qxp.Class.MAX_CLICK_TOLERANCE = 5;
/** {int} Helper constant. The square of {@link #MAX_CLICK_TOLERANCE}. */
qxp.Class.MAX_CLICK_TOLERANCE_SQUARED = qxp.Class.MAX_CLICK_TOLERANCE*qxp.Class.MAX_CLICK_TOLERANCE;

qxp.OO.changeProperty({ name:"areaLeft",   type:qxp.constant.Type.NUMBER, defaultValue:0 });
qxp.OO.changeProperty({ name:"areaRight",  type:qxp.constant.Type.NUMBER, defaultValue:0 });
qxp.OO.changeProperty({ name:"areaTop",    type:qxp.constant.Type.NUMBER, defaultValue:0 });
qxp.OO.changeProperty({ name:"areaBottom", type:qxp.constant.Type.NUMBER, defaultValue:0 });
qxp.OO.changeProperty({ name:"areaOpacity", type:qxp.constant.Type.NUMBER, defaultValue:1 });

/** The color of the overlay to show above this layer. */
qxp.OO.addProperty({ name:"overlayColor", type:qxp.constant.Type.STRING, defaultValue:"#000000" });

/** The opacity of the overlay to show above this layer. If 0, no overlay will be used. */
qxp.OO.addProperty({ name:"overlayOpacity", type:qxp.constant.Type.NUMBER, defaultValue:0 });

/** The opecity of the layer itself. */
qxp.OO.addProperty({ name:"layerOpacity", type:qxp.constant.Type.NUMBER, defaultValue:1 });

/**
 * Whether the zoom rect should be applied to the main map
 * (and not to the possibly scaled map shown by this layer).
 * <p>
 * Example: If you do a rect-zoom in the overview map, the area in the rect is
 * zoomed into the main map and not into the overview map.
 */
qxp.OO.addProperty({ name:"applyZoomRectToMainMap", type:qxp.constant.Type.BOOLEAN, allowNull:false, defaultValue:true });

/**
 * Whether this layer should automatically be rotated when the map rotation
 * changes. If you want to perform custom rotation handling, set this property
 * to <code>false</code>.
 */
qxp.OO.changeProperty({ name:"autoRotate", type:qxp.constant.Type.BOOLEAN, allowNull:false, defaultValue:true });
