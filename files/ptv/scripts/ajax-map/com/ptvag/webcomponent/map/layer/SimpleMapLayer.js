/**
 * A layer showing a map using a single image. When the image needs an update,
 * the new image is requested in the background and will replace the current
 * one when loading completed.
 *
 * @param requestBuilder {RequestBuilder} The RequestBuilder to use for loading
 *        the map tiles.
 */
qxp.OO.defineClass("com.ptvag.webcomponent.map.layer.SimpleMapLayer",
com.ptvag.webcomponent.map.layer.AbstractMapLayer,
function(requestBuilder) {
    com.ptvag.webcomponent.map.layer.AbstractMapLayer.call(this, requestBuilder);

    var self = this;
    var map = com.ptvag.webcomponent.map;

    var mRequestRunning = false;
    var mPendingRequest;


    /**
     * Holds all the information about the shown image.
     * <p>
     * It has the following properties:
     * <ul>
     * <li>imgElem:  The HTML element showing the image.</li>
     * <li>center:   The center of the image in smart units.</li>
     * <li>zoom:     The native zoom level of the image.</li>
     * <li>width:    The native width of the image in pixels.</li>
     * <li>height:   The native height of the image in pixels.</li>
     * <li>requestWidth: The native width of the request image in pixels
     *               (before clipping).</li>
     * <li>requestHeight: The native height of the request image in pixels
     *               (before clipping).</li>
     * <li>clipLeft: The number of pixels that had to be clipped from the left
     *               due to the map's clip rect.</li>
     * <li>clipTop:  The number of pixels that had to be clipped from the top
     *               due to the map's clip rect.</li>
     * <li>loaded:   true, when the image was loaded</li>
     * </ul>
     */
    var mImgInfo;
    var mLoadingImgInfo;
    var mLastRequestedImgInfo;

    /** The element that shows the visible map section (used by the overview). May be null. */
    var mVisibleSectionMarker;

    /** The service for getting POI information. */
    var mPOIService = null;
    
    /** The currently active async POI call (if any). */
    var mPOICall = null;
    
    
    // overridden
    var superInit = self.init;
    self.init = function() {
        superInit.apply(self, arguments);

        mPOIService = com.ptvag.webcomponent.map.SERVICE;

        mImgInfo = createImgInfo();
        mLoadingImgInfo = createImgInfo();
        mLastRequestedImgInfo = mImgInfo;

        self.getMap().getController().addEventListener("changeActiveLayer", onActiveLayerChanged);
        requestBuilder.addEventListener("poiCategoriesChanged", onPOICategoriesChanged);
        requestBuilder.addEventListener("changeHint", onHintChanged);
        self.getMap().addEventListener("newMapSession", onNewMapSession);

        var zoomDifference = self.getZoomDifference();
        if (zoomDifference != 0) {
            // Create the visible section marker
            mVisibleSectionMarker = document.createElement("div");
            mVisibleSectionMarker.style.position = "absolute";
            mVisibleSectionMarker.style.border = "1px solid #808080";
            self.getAreaElement().appendChild(mVisibleSectionMarker);
            positionVisibleSectionMarker();
            self.getAreaElement().style.backgroundColor = "silver";
        }

        updateImage({});
    };


    var createImgInfo = function() {
        var imgElem = document.createElement("img");
        imgElem.style.position = "absolute";
        imgElem.style.MozUserSelect = "none";
        imgElem.style.visibility = "hidden";
        self.getAreaElement().appendChild(imgElem);

        return { imgElem:imgElem, center:{} };
    };


    var cleanUpImgInfo = function(imgInfo) {
        imgInfo.imgElem = null;
    };


    var positionVisibleSectionMarker = function() {
        if (mVisibleSectionMarker) {
            var mapWidth  = self.getMap().getWidth();
            var mapHeight = self.getMap().getHeight();

            var zoomDifference = self.getZoomDifference();
            var zoomFactor = Math.pow(map.CoordUtil.ZOOM_LEVEL_FACTOR, zoomDifference);

            var markerWidth  = mapWidth / zoomFactor + 2;       // the marker border is outside of the
            var markerHeight = mapHeight / zoomFactor + 2;      // marked section, not a part of it

            var areaWidth  = self.getComputedAreaWidth();
            var areaHeight = self.getComputedAreaHeight();
            var areaBorderWidth = self.getAreaBorderWidth();

            if (map.MapUtil.isBorderBoxSizingActive()) {
                var elementWidth = markerWidth;
                var elementHeight = markerHeight;
            } else {
                elementWidth = markerWidth - 2;
                elementHeight = markerHeight - 2;
            }
            
            mVisibleSectionMarker.style.left = Math.round((areaWidth - markerWidth) / 2) - areaBorderWidth + "px";
            mVisibleSectionMarker.style.width = Math.round(elementWidth) + "px";
            mVisibleSectionMarker.style.top = Math.round((areaHeight - markerHeight) / 2) - areaBorderWidth + "px";
            mVisibleSectionMarker.style.height = Math.round(elementHeight) + "px";
        }
    };


    // overridden
    var superModifyComputedAreaWidth = self._modifyComputedAreaWidth;
    self._modifyComputedAreaWidth = function() {
        positionVisibleSectionMarker();
        superModifyComputedAreaWidth.apply(self, arguments);
    };


    // overridden
    var superModifyComputedAreaHeight = self._modifyComputedAreaHeight;
    self._modifyComputedAreaHeight = function() {
        positionVisibleSectionMarker();
        superModifyComputedAreaHeight.apply(self, arguments);
    };


    var onActiveLayerChanged = function(evt) {
        try {
            if (self.isNoLayerActive()) {
                updateImage({});
            }
        } catch (e) {
            self.error("Error in onActiveLayerChanged in SimpleMapLayer", e);
        }
    };


    var onPOICategoriesChanged = function(evt) {
        updateImage({}, true, "mapapi:poiCategoriesChanged");
    };


    var onHintChanged = function() {
        updateImage({}, true, "mapapi:hintChanged");
    }
    
    
    var onNewMapSession = function(evt) {
        if (requestBuilder.isTransparent()) {
            updateImage({}, true, "mapapi:session");
        }
    };
    
    
    // overridden
    var superOnViewChanged = self.onViewChanged;
    self.onViewChanged = function(evt) {
        superOnViewChanged.apply(self, arguments);

        //self.info("onViewChanged in SimpleMapLayer");
        updateImage(evt);
    };


    // overridden
    self.getShownZoom = function() {
        return self.getMap().getZoom() + self.getZoomDifference();
    };


    // overridden
    var superSetServerLayerVisible = self.setServerLayerVisible;
    self.setServerLayerVisible = function() {
        superSetServerLayerVisible.apply(self, arguments);
        updateImage({}, true, "mapapi:serverLayersChanged");
    };
    
    
    var updateImage = function(evt, forceUpdate, localLoggingInfo) {
        if (!self.isEnabled()) {
            return;
        }
        loadImage(forceUpdate || evt.clipRectChanged, localLoggingInfo);
        self.positionImage(mImgInfo);
        self.positionImage(mLoadingImgInfo, true);
            // position the loading image while it's still loading to avoid
            // ugly flicker effects in Firefox
    };


    var loadImage = function(forceUpdate, loggingInfo) {
        var theMap = self.getMap();
        centerSu = theMap.getCenter();
        zoom = self.getShownZoom();
        var rotation = theMap.getRotation();
        if (self.getAutoRotate()) {
            rotation = null;
        }
        var width = self.getComputedAreaWidth();
        var height = self.getComputedAreaHeight();
        var borderWidth = self.getBorderWidth();
        width += 2 * borderWidth;
        height += 2 * borderWidth;

        // Check whether we have to load a new image
        if (self.isNoLayerActive() && (forceUpdate
            || mLastRequestedImgInfo.zoom != zoom
            || mLastRequestedImgInfo.center.x != centerSu.x
            || mLastRequestedImgInfo.center.y != centerSu.y
            || mLastRequestedImgInfo.requestWidth != width
            || mLastRequestedImgInfo.requestHeight != height
            || mLastRequestedImgInfo.rotation != rotation))
        {
            if (loggingInfo == null) {
                loggingInfo = self.getMap().getLoggingInfo();
            }
            if (mRequestRunning) {
                mPendingRequest = [forceUpdate, loggingInfo];
                return;
            }
        } else {
            return;
        }

        mRequestRunning = true;

        mLoadingImgInfo.center = centerSu;
        mLoadingImgInfo.zoom   = zoom;
        mLoadingImgInfo.requestWidth  = width;
        mLoadingImgInfo.requestHeight = height;
        mLoadingImgInfo.rotation = rotation;
        mLoadingImgInfo.loaded = null;
        mLastRequestedImgInfo = mLoadingImgInfo;

        var centerPix = map.CoordUtil.smartUnit2Pixel(centerSu, zoom);
        var fromPix = { x:centerPix.x - width / 2, y:centerPix.y - height / 2 };
        var toPix   = { x:centerPix.x + width / 2, y:centerPix.y + height / 2 };

        var fromSu = map.CoordUtil.pixel2SmartUnit(fromPix, zoom);
        var toSu   = map.CoordUtil.pixel2SmartUnit(toPix, zoom);

        var fromMerc = map.CoordUtil.smartUnit2Mercator(fromSu);
        var toMerc   = map.CoordUtil.smartUnit2Mercator(toSu);

        var left   = Math.round(fromMerc.x);
        var bottom = Math.round(fromMerc.y);
        var right  = Math.round(toMerc.x);
        var top    = Math.round(toMerc.y);

        var imgInfo = requestBuilder.buildRequest(left, top, right, bottom, width, height, loggingInfo, null, rotation);
        if (imgInfo.completelyClipped) {
            mRequestRunning = false;
        } else {
            mLoadingImgInfo.clipLeft = imgInfo.clipLeft;
            mLoadingImgInfo.clipTop = imgInfo.clipTop;
            mLoadingImgInfo.width  = imgInfo.width;
            mLoadingImgInfo.height = imgInfo.height;
            mLoadingImgInfo.loaded = false;
            mLoadingImgInfo.imageId = imgInfo.imageId;
            mLoadingImgInfo.visibleZoom = null;    // force position update
            //self.info("Loading image");
            map.ImageLoader.loadImage(mLoadingImgInfo.imgElem, imgInfo.url, onImageLoaded, 100);
        }
    };


    var onPOIsLoaded = function(pois, exc) {
        mPOICall = null;
        if (exc != null) {
            var Rpc = qxp.io.remote.Rpc;
            if (exc.origin != Rpc.origin.local || exc.code != Rpc.localError.abort) {
                self.error("Error loading POI information", exc);
            }
        }
        var serverDrawnObjectManager = self.getMap().getServerDrawnObjectManager();
        if (serverDrawnObjectManager.getRequestBuilder() == requestBuilder) {
            serverDrawnObjectManager.setStaticPOIs(pois);
        } else {
            var layerName = self.getName();
            if (layerName == null) {
                layerName = "";     // to prevent a collision with the default POI set
            }
            serverDrawnObjectManager.setStaticPOIs(pois, layerName);
        }
    };
    
    
    var onImageLoaded = function(elem, url, exc) {
        if (exc == null) {
            // Switch the images
            var oldImgInfo = mImgInfo;
            mImgInfo = mLoadingImgInfo;
            mLoadingImgInfo = oldImgInfo;

            mImgInfo.loaded = true;
            mImgInfo.visibleZoom = null;    // force position update

            self.positionImage(mImgInfo);
            mLoadingImgInfo.imgElem.style.visibility = "hidden";
            
            mLastRequestedImgInfo = mImgInfo;
    
            // Load the POIs
            if (mPOICall != null) {
                mPOIService.abort(mPOICall);
                mPOICall = null;
            }
            if (requestBuilder.supportsServerDrawnObjects()) {
                if (mImgInfo.imageId != null && requestBuilder.hasPOICategories()) {
                    if (map.Map.STATELESS_MODE) {
                        var params = url.substring(url.indexOf("?") + 1);
                        mPOICall = mPOIService.callAsync(onPOIsLoaded, "getPOIsStateless", params);
                    } else {
                        mPOICall = mPOIService.callAsync(onPOIsLoaded, "getPOIs", mImgInfo.imageId);
                    }
                } else {
                    // IE sometimes calls the image load handler directly when
                    // setting the image source - the static POI manager may
                    // not be initialized at this point, so check first if it's
                    // available.
                    var serverDrawnObjectManager = self.getMap().getServerDrawnObjectManager();
                    if (serverDrawnObjectManager) {
                        serverDrawnObjectManager.setStaticPOIs([]);
                    }
                }
            }
        } else {
            window.setTimeout(function() {
                self.error("Could not load image", exc);
            }, 0);
        }

        // Send the pending request (if there is one)
        mRequestRunning = false;
        if (mPendingRequest) {
            loadImage.apply(null, mPendingRequest);
            self.positionImage(mLoadingImgInfo, true);
                // position the loading image while it's still loading to avoid
                // ugly flicker effects in Firefox
            mPendingRequest = null;
        }
    };


    /**
     * Positions an image loaded from the server. This method is used
     * internally by some map classes - usually, you shouldn't need
     * to call or override it.
     *
     * @param   imgInfo {Map}       information about the properties of
     *                              the loaded image.
     * @param   dontChangeVisibility {boolean,false}    whether the image
     *                              should be automatically shown (or hidden,
     *                              in case it's too big).
     */
    self.positionImage = function(imgInfo, dontChangeVisibility) {
        if (imgInfo.loaded == null) {
            return; // image is completely clipped or we never tried to load it
        }
        var theMap = self.getMap();
        var visibleZoom = theMap.getVisibleZoom() + self.getZoomDifference();
        var visibleCenter = theMap.getVisibleCenter();
        var visibleWidth = self.getComputedAreaWidth();
        var visibleHeight = self.getComputedAreaHeight();
        var visibleRotation = theMap.getVisibleRotation();
        if (imgInfo.visibleZoom == visibleZoom &&
            imgInfo.visibleCenter.x == visibleCenter.x &&
            imgInfo.visibleCenter.y == visibleCenter.y &&
            imgInfo.visibleWidth == visibleWidth &&
            imgInfo.visibleHeight == visibleHeight &&
            (imgInfo.visibleRotation != 0 ||
             imgInfo.visibleRotation == visibleRotation)) {
            return;
        }
        imgInfo.visibleZoom = visibleZoom;
        imgInfo.visibleCenter = visibleCenter;
        imgInfo.visibleWidth = visibleWidth;
        imgInfo.visibleHeight = visibleHeight;
        imgInfo.visibleRotation = visibleRotation;

        // Set width and height
        var scaleFactor = map.CoordUtil.getTileWidth(imgInfo.zoom) / map.CoordUtil.getTileWidth(visibleZoom);
        var scaledWidth  = Math.round(imgInfo.width  * scaleFactor);
        var scaledHeight = Math.round(imgInfo.height * scaleFactor);

        if (scaledWidth > map.MapUtil.MAX_IMAGE_SCALE_WIDTH || scaledHeight > map.MapUtil.MAX_IMAGE_SCALE_WIDTH || scaledWidth < map.MapUtil.MIN_IMAGE_SCALE_WIDTH || scaledHeight < map.MapUtil.MIN_IMAGE_SCALE_WIDTH) {
            // The image is too big or too small -> Hide it
            if (!dontChangeVisibility) {
                imgInfo.imgElem.style.visibility = "hidden";
            }
        } else {
            if (imgInfo.loaded && !dontChangeVisibility) {
                imgInfo.imgElem.style.visibility = "";
            }
            imgInfo.imgElem.style.width  = scaledWidth + "px";
            imgInfo.imgElem.style.height = scaledHeight + "px";

            // Set the position
            var imgCenterPix = map.CoordUtil.smartUnit2Pixel(imgInfo.center, visibleZoom);
            var mapCenterPix = map.CoordUtil.smartUnit2Pixel(visibleCenter, visibleZoom);
            var offsetX = 0;
            var offsetY = 0;
            if (self.isRelative()) {
                var relativeOffset = theMap.getRelativeOffset();
                offsetX = Math.round(relativeOffset.x);
                offsetY = Math.round(relativeOffset.y);
            }
            var areaBorderWidth = self.getAreaBorderWidth();
            offsetX -= areaBorderWidth;
            offsetY -= areaBorderWidth;
            offsetX += imgInfo.clipLeft*scaleFactor;
            offsetY += imgInfo.clipTop*scaleFactor;
            var centerOffsetX = imgCenterPix.x - mapCenterPix.x;
            var centerOffsetY = mapCenterPix.y - imgCenterPix.y;
            if (self.getAutoRotate()) {
                var rotatedOffsets = {x:centerOffsetX, y:centerOffsetY};
            } else {
                rotatedOffsets = theMap.transformPixelCoords(
                    centerOffsetX, centerOffsetY, true, false, true);
            }
            var left = offsetX + rotatedOffsets.x -
                imgInfo.requestWidth*scaleFactor/2 +
                visibleWidth/2;
            var top = offsetY + rotatedOffsets.y -
                imgInfo.requestHeight*scaleFactor/2 +
                visibleHeight/2;
            imgInfo.imgElem.style.left = Math.round(left) + "px";
            imgInfo.imgElem.style.top = Math.round(top) + "px";

            // Set the zoom opacity
            if (self.getUseZoomTransparency()) {
                var opacity = 1 - Math.max(0, (Math.abs(1 - scaleFactor) * self.getZoomTransparencyFactor()));
                map.MapUtil.setElementOpacity(imgInfo.imgElem, Math.max(self.getMinZoomOpacity(), opacity));
            }
        }
    };


    // overridden
    self.doPrintMap = function(ctx, htmlContainer, htmlBackground) {
        var left = self.getComputedAreaLeft();
        var top = self.getComputedAreaTop();
        var width = self.getComputedAreaWidth();
        var height = self.getComputedAreaHeight();
        if (mImgInfo.loaded) {
            var offsetX = 0;
            var offsetY = 0;
            if (self.isRelative()) {
                var relativeOffset = self.getMap().getRelativeOffset();
                offsetX = Math.round(relativeOffset.x);
                offsetY = Math.round(relativeOffset.y);
            }
            var areaBorderWidth = self.getAreaBorderWidth();
            offsetX -= areaBorderWidth;
            offsetY -= areaBorderWidth;
            var url = mImgInfo.imgElem.src;
            url = url.replace(new RegExp("&loggingInfo=[^&]*"), "&loggingInfo=" +
                encodeURIComponent("mapapi:printMode"));
            ctx.drawImage({src:url}, 0, 0,
                mImgInfo.width, mImgInfo.height,
                left + parseInt(mImgInfo.imgElem.style.left) - offsetX,
                top + parseInt(mImgInfo.imgElem.style.top) - offsetY,
                parseInt(mImgInfo.imgElem.style.width),
                parseInt(mImgInfo.imgElem.style.height));
        } else {
            ctx.fillStyle = "#ffffff";
            ctx.beginPath();
            ctx.rect(left, top, width, height);
            ctx.fill();
        }
        if (mVisibleSectionMarker) {
            var zoomDifference = self.getZoomDifference();
            var zoomFactor = Math.pow(map.CoordUtil.ZOOM_LEVEL_FACTOR, zoomDifference);
            var mapWidth  = self.getMap().getWidth();
            var mapHeight = self.getMap().getHeight();
            var markerWidth  = mapWidth / zoomFactor + 2;       // the marker border is outside of the
            var markerHeight = mapHeight / zoomFactor + 2;      // marked section, not a part of it
            var markerLeft = Math.round((width - markerWidth)/2);
            var markerTop = Math.round((height - markerHeight)/2);
            ctx.strokeStyle = "rgb(128, 128, 128)";
            ctx.lineWidth = 1;
            ctx.lineCap = "butt";
            ctx.lineJoin = "miter";
            ctx.beginPath();
            ctx.rect(left + markerLeft, top + markerTop, Math.round(markerWidth - 1), Math.round(markerHeight - 1));
            ctx.stroke();
        }
    };
    
    
    // overridden
    var superDispose = self.dispose;
    self.dispose = function() {
        if (self.getDisposed()) {
            return;
        }

        if (mPOICall != null) {
            mPOIService.abort(mPOICall);
            mPOICall = null;
        }

        cleanUpImgInfo(mImgInfo);
        cleanUpImgInfo(mLoadingImgInfo);

        superDispose.call(self);
    };

});


/** Whether to show the current image transparent when zooming. */
qxp.OO.addProperty({ name:"useZoomTransparency", type:qxp.constant.Type.BOOLEAN, defaultValue:true });

/**
 * The factor how fast the current image gets tranparent when zooming.
 * High values cause faster transparency.
 */
qxp.OO.addProperty({ name:"zoomTransparencyFactor", type:qxp.constant.Type.NUMBER, defaultValue:0.8 });

/** The minimal opacity the current image can get. */
qxp.OO.addProperty({ name:"minZoomOpacity", type:qxp.constant.Type.NUMBER, defaultValue:0.2 });

/**
 * The width of the border around the visible area that should be included in
 * loaded images.
 */
qxp.OO.addProperty({ name:"borderWidth", type:qxp.constant.Type.NUMBER, defaultValue:0, allowNull:false });

/**
 * The difference between the zoom level of the map and the zoom level to show.
 * May for example be used for showing an overview map.
 */
qxp.OO.addProperty({ name:"zoomDifference", type:qxp.constant.Type.NUMBER, defaultValue:0, allowNull:false });
