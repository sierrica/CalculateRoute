/**
 * A map layer showing a tiled map.
 *
 * @param   requestBuilder {com.ptvag.webcomponent.map.RequestBuilder}
 *              the RequestBuilder to use for loading the map tiles.
 */
qxp.OO.defineClass("com.ptvag.webcomponent.map.layer.TileMapLayer",
com.ptvag.webcomponent.map.layer.AbstractMapLayer,
function(requestBuilder) {
    com.ptvag.webcomponent.map.layer.AbstractMapLayer.call(this, requestBuilder);

    var self = this;
    var map = com.ptvag.webcomponent.map;

    /**
     * A map holding all information about an image layer.
     * <p>
     * It has the following properties:
     * <ul>
     * <li>imgParent: The div that contains all images of this layer.</li>
     * <li>imgArr: An array of all img elements belonging to this layer.</li>
     * <li>zoom: The (native) zoom level of the layer.</li>
     * <li>visibleZoom: The currently visible zoom level of the layer.
     *     If different to 'zoom' the images are scaled.</li>
     * <li>scaleFactor: The scale factor between the native and the visible zoom
     *     level.</li>
     * <li>tileWidthPix: The current width of the tiles in pixels.</li>
     * <li>tileWidthSu: The current width of the tiles in smart units / tile.</li>
     * <li>startTileX: The tile x coordinate of the bottom left tile.</li>
     * <li>startTileY: The tile y coordinate of the bottom left tile.</li>
     * <li>tileXCount: The number of tiles in x direction.</li>
     * <li>tileYCount: The number of tiles in y direction.</li>
     * <li>totalImageCount: The total number of tiles in this layer
     *     (does not include images that won't get an image, because it was
     *     clipped completely).</li>
     * <li>loadedImageCount: The number of loaded tiles in this layer.</li>
     * </ul>
     */
    var mImgLayer;

    var mBackgroundImgLayer;
    
    var mMapVersion = null;


    // overridden
    var superInit = self.init;
    self.init = function() {
        superInit.apply(self, arguments);

        mMapVersion = self.getMap().getMapVersion();
        mImgLayer = createImgLayer(self.getMap().getZoom());
        if (self.isEnabled()) {
            updateContent({});
        }
    };


    // overridden
    var superOnViewChanged = self.onViewChanged;
    self.onViewChanged = function(evt) {
        superOnViewChanged(evt);

        //self.info("onViewChanged in TileMapLayer");
        updateContent(evt);
    };


    var updateContent = function(evt) {
        var imageLoader = self.getImageLoader();
        if (imageLoader == null) {
            imageLoader = map.ImageLoader;
        }

        // Create a new background layer if nessesary
        var newZoom = self.getMap().getZoom();
        if (newZoom != mImgLayer.zoom || evt.clipRectChanged) {
            // We have a new zoom level -> Check whether we can use the current
            // mImgLayer as new mBackgroundImgLayer
            // (Count the already loaded images)
            // NOTE: When the user zooms fast, we better reuse the old 
            //       mBackgroundImgLayer, when it has more images
            if (getLoadedFactor(mImgLayer) < map.layer.TileMapLayer.MIN_LOADED_FACTOR) {
                // There are not enough images loaded in mImgLayer
                // -> Use the old mBackgroundImgLayer and clean mImgLayer
                cleanUpImgLayer(mImgLayer);
                if (evt.clipRectChanged) {
                    cleanUpImgLayer(mBackgroundImgLayer);
                    mBackgroundImgLayer = null;
                }
            } else {
                // There are enough images loaded in mImgLayer
                // -> Use it as new mBackgroundImgLayer

                // Clean up the old mBackgroundImgLayer
                cleanUpImgLayer(mBackgroundImgLayer);
                if (evt.clipRectChanged) {
                    cleanUpImgLayer(mImgLayer);
                    mImgLayer = null;
                }

                mBackgroundImgLayer = mImgLayer;
            }

            // Create a new mImgLayer
            mImgLayer = createImgLayer(newZoom);

            // Prepare the mBackgroundImgLayer for the new zoom factor
            if (mBackgroundImgLayer != null) {
                // Abort image loading
                for (var y = 0; y < mBackgroundImgLayer.imgArr.length; y++) {
                    var imgRow = mBackgroundImgLayer.imgArr[y];
                    for (var x = 0; x < imgRow.length; x++) {
                        var imgElem = imgRow[x];
                        if (imgElem._imgId) {
                            imageLoader.abortLoading(imgElem._imgId);
                        }
                    }
                }
            }
        }

        // Get the tiles to be shown at the target position
        var centerSuPt = self.getMap().getCenter();
        var centerPixPt = map.CoordUtil.smartUnit2Pixel(centerSuPt, newZoom);

        var tileWidth = map.CoordUtil.TILE_WIDTH;
        var borderTileCount = map.layer.TileMapLayer.BORDER_TILE_COUNT;

        var areaWidth  = self.getComputedAreaWidth();
        var areaHeight = self.getComputedAreaHeight();

        var leftPix    = centerPixPt.x - areaWidth  / 2;
        var bottomPix  = centerPixPt.y - areaHeight / 2;

        var leftTileOffset = leftPix%tileWidth;
        if (leftTileOffset < 0) {
            leftTileOffset += tileWidth;
        }
        leftTileOffset += borderTileCount*tileWidth;
        var bottomTileOffset = bottomPix%tileWidth;
        if (bottomTileOffset < 0) {
            bottomTileOffset += tileWidth;
        }
        bottomTileOffset += borderTileCount*tileWidth;

        // Get the tile coordinate of the bottom-left tile
        var oldStartTileX = mImgLayer.startTileX;
        var oldStartTileY = mImgLayer.startTileY;
        mImgLayer.startTileX = Math.floor(leftPix/tileWidth) - borderTileCount;
        mImgLayer.startTileY = Math.floor(bottomPix/tileWidth) - borderTileCount;

        // Get the number of tiles to show
        var oldTileXCount = mImgLayer.tileXCount;
        var oldTileYCount = mImgLayer.tileYCount;
        mImgLayer.tileXCount = Math.ceil((leftTileOffset   + areaWidth)  / tileWidth) + borderTileCount;
        mImgLayer.tileYCount = Math.ceil((bottomTileOffset + areaHeight) / tileWidth) + borderTileCount;
        //self.info("tileXCount: " + mImgLayer.tileXCount + "; tileYCount: " + mImgLayer.tileYCount);

        // Set position and zoom of the background images
        var visibleCenter = self.getMap().getVisibleCenter();
        var visibleZoom = self.getMap().getVisibleZoom();
        if (mBackgroundImgLayer != null) {
            setVisibleZoomForImgLayer(mBackgroundImgLayer, visibleZoom);
            setCenterForImgLayer(mBackgroundImgLayer, visibleCenter);
        }

        // Set position and zoom of the foreground images
        setVisibleZoomForImgLayer(mImgLayer, visibleZoom);
        setCenterForImgLayer(mImgLayer, visibleCenter);

        // Add or remove the img elems
        if (mImgLayer.startTileX != oldStartTileX || mImgLayer.startTileY != oldStartTileY
            || oldTileXCount != mImgLayer.tileXCount || oldTileYCount != mImgLayer.tileYCount)
        {
            // We put all image loading jobs in an array. So we can sort it by
            // priority in order to load images near the center first.
            var imgJobArr = [];

            var deltaY = oldStartTileY - mImgLayer.startTileY;
            if (deltaY < 0) {
                // Remove the rows not needed any more at the beginning
                var removeBeginRowCount = Math.min(-deltaY, mImgLayer.imgArr.length);
                for (var i = 0; i < removeBeginRowCount; i++) {
                    var imgRow = mImgLayer.imgArr.shift();
                    for (var x = 0; x < imgRow.length; x++) {
                        cleanUpImgElem(imgRow[x]);
                    }
                }
            } else {
                // Add new (empty) rows at the beginning
                var addBeginRowCount = Math.min(deltaY, mImgLayer.tileYCount);
                for (var i = 0; i < addBeginRowCount; i++) {
                    mImgLayer.imgArr.unshift([]);
                }
            }

            // Remove the rows not needed any more at the end
            var removeEndRowCount = mImgLayer.imgArr.length - mImgLayer.tileYCount;
            for (var i = 0; i < removeEndRowCount; i++) {
                var imgRow = mImgLayer.imgArr.pop();
                for (var x = 0; x < imgRow.length; x++) {
                    cleanUpImgElem(imgRow[x]);
                }
            }

            // Go through all rows and add/remove the images
            var deltaX = oldStartTileX - mImgLayer.startTileX;
            for (var y = mImgLayer.tileYCount - 1; y >= 0; y--) {
                var imgRow = mImgLayer.imgArr[y];
                if (imgRow == null) {
                    mImgLayer.imgArr[y] = imgRow = [];
                }

                if (deltaX < 0) {
                    // Remove the old images on the left
                    var removeLeftCount = Math.min(-deltaX, imgRow.length);
                    for (var i = 0; i < removeLeftCount; i++) {
                        cleanUpImgElem(imgRow.shift());
                    }
                } else {
                    // Add the missing img elems of this row at the left
                    var addLeftCount = Math.min(deltaX, mImgLayer.tileXCount);
                    for (var x = addLeftCount - 1; x >= 0; x--) {
                        imgRow.unshift(createImgElem(mImgLayer, x, y, tileWidth, imgJobArr));
                    }
                }

                // Add the missing img elems of this row at the right
                for (var x = imgRow.length; x < mImgLayer.tileXCount; x++) {
                    imgRow.push(createImgElem(mImgLayer, x, y, tileWidth, imgJobArr));
                }

                // Remove the old img elems at the right
                for (var i = imgRow.length - 1; i >= mImgLayer.tileXCount; i--) {
                    cleanUpImgElem(imgRow.pop());
                }
            }

            // Sort the image load jobs an execute them
            imgJobArr.sort(imageJobComparator);
            for (var i = 0; i < imgJobArr.length; i++) {
                var job = imgJobArr[i];
                job.imgElem._imgId = imageLoader.loadImage(job.imgElem, job.imgInfo.url, onImgLoaded, null, imageLoader.getDefaultTimeout()*2, true);
                job.imgElem._clipTop  = job.imgInfo.clipTop;
                job.imgElem._clipLeft = job.imgInfo.clipLeft;
                job.imgElem._width    = job.imgInfo.width;
                job.imgElem._height   = job.imgInfo.height;
            }

            // Update the offsets
            updateTileOffsets(mImgLayer, tileWidth);
        }
    };


    /**
     * Creates an tile image element.
     *
     * @param imgLayer {Map} the internal layer to add the image to.
     * @param x {int} the x position of the image in the internal layer in tiles.
     * @param y {int} the y position of the image in the internal layer in tiles.
     * @param tileWidth {int} the width of a tile in pixels.
     * @param imgJobArr {Map[]} the array to add image loading jobs to.
     * @return {Element} the created image element.
     */
    var createImgElem = function(imgLayer, x, y, tileWidth, imgJobArr) {
        // Create the image elem
        var imageLoader = self.getImageLoader();
        if (imageLoader == null) {
            imageLoader = map.ImageLoader;
        }
        var imgElem = imageLoader.createElement();
        imgElem.style.position = "absolute";
        imgElem.style.visibility = "hidden";
        imgElem.style.width = tileWidth + "px";
        imgElem.style.height = tileWidth + "px";
        imgElem.style.MozUserSelect = "none";
        imgElem._imgLayer = imgLayer;
        imgLayer.imgParent.appendChild(imgElem);

        if (self.showTileBoundaries()) {
            var debugElem = document.createElement("div");
            debugElem.style.position = "absolute";
            debugElem.style.width = tileWidth + "px";
            debugElem.style.height = tileWidth + "px";
            debugElem.style.MozBoxSizing = "border-box";
            debugElem.style.borderLeft = "1px dashed black";
            debugElem.style.borderTop = "1px dashed black";
            debugElem.style.zIndex = 1000;
            imgElem._debugElem = debugElem;
            imgLayer.imgParent.appendChild(debugElem);
        }
        
        // Load the image
        var tilePoint = { x:(mImgLayer.startTileX + x), y:(mImgLayer.startTileY + y) };
        var zoomLevel = self.getMap().getZoom();

        var fromSuPoint   = map.CoordUtil.tile2SmartUnit(tilePoint, zoomLevel);
        var fromMercPoint = map.CoordUtil.smartUnit2Mercator(fromSuPoint);

        var toTilePoint = { x:tilePoint.x + 1, y:tilePoint.y + 1 };
        var toSuPoint   = map.CoordUtil.tile2SmartUnit(toTilePoint, zoomLevel);
        var toMercPoint = map.CoordUtil.smartUnit2Mercator(toSuPoint);

        var left   = fromMercPoint.x;
        var bottom = fromMercPoint.y;
        var right  = toMercPoint.x;
        var top    = toMercPoint.y;

        var imgInfo = requestBuilder.buildRequest(left, top, right, bottom,
                                                  map.CoordUtil.TILE_WIDTH,
                                                  map.CoordUtil.TILE_WIDTH,
                                                  null, mMapVersion);

        // Put the image to the imgJobArr
        if (! imgInfo.completelyClipped) {
            var distX = x + 0.5 - mImgLayer.tileXCount / 2;
            var distY = y + 0.5 - mImgLayer.tileYCount / 2;
            var centerDistance = distX * distX + distY * distY;
            imgJobArr.push({ x:x, y:y, centerDistance:centerDistance, imgElem:imgElem, imgInfo:imgInfo });
            imgLayer.totalImageCount++;
        }

        return imgElem;
    };


    /**
     * Cleans up a tile image element.
     *
     * @param imgElem {Element} the img element to clean up.
     * @param inDispose {boolean} whether we're being disposed (in which case
     *                            there's no need to alter the DOM).
     */
    var cleanUpImgElem = function(imgElem, inDispose) {
        if (imgElem._imgId) {
            if (!imgElem._loaded || !inDispose) {
                var imageLoader = self.getImageLoader();
                if (imageLoader == null) {
                    imageLoader = map.ImageLoader;
                }
                imageLoader.abortLoading(imgElem._imgId, true);
            }
            imgElem._imgLayer.totalImageCount--;
            imgElem._imgId = null;
        }

        if (imgElem._loaded) {
            imgElem._imgLayer.loadedImageCount--;
        }
        imgElem._imgLayer = null;
        imgElem._debugElem = null;

        return imgElem;
    };


    /**
     * Creates an internal layer.
     *
     * @param zoom {int} the zoom level to create the internal layer for.
     * @return {Map} the created internal layer.
     */
    var createImgLayer = function(zoom) {
        var imgParent = document.createElement("div");
        imgParent.style.position = "absolute";
        self.getAreaElement().appendChild(imgParent);

        return {
            imgParent:imgParent, imgArr:[], zoom:zoom, visibleZoom:zoom,
            scaleFactor:1, tileWidthPix:map.CoordUtil.TILE_WIDTH,
            nativeTileWidthSu:map.CoordUtil.getTileWidth(zoom),
            totalImageCount:0, loadedImageCount:0
        };
    }


    /**
     * Cleans up an internal layer.
     *
     * @param imgLayer {Map} the internal layer to clean up.
     * @param inDispose {boolean} whether we're being disposed (in which case
     *                            there's no need to alter the DOM).
     */
    var cleanUpImgLayer = function(imgLayer, inDispose) {
        if (imgLayer) {
            for (var y = 0; y < imgLayer.imgArr.length; y++) {
                var imgRow = imgLayer.imgArr[y];
                for (var x = 0; x < imgRow.length; x++) {
                    cleanUpImgElem(imgRow[x], inDispose);
                }
            }
            imgLayer.imgArr = [];

            if (!inDispose) {
                self.getAreaElement().removeChild(imgLayer.imgParent);
            }

            imgLayer.totalImageCount = 0;
            imgLayer.loadedImageCount = 0;
        }
    };


    /**
     * Compares two image jobs. Jobs near the center will get lower values.
     *
     * @param job1 {Map} the first image loading job to compare.
     * @param job2 {Map} the second image loading job to compare.
     * @return {int} 1 if job1 has a greater distance to the center as job2, -1
     *         otherwise.
     */
    var imageJobComparator = function(job1, job2) {
        return (job1.centerDistance > job2.centerDistance) ? 1 : -1;
    };


    var setVisibleZoomForImgLayer = function(imgLayer, zoom) {
        if (imgLayer.visibleZoom != zoom) {
            // Calculate how many pixels the tiles have in the new zoom level
            var scaleFactor = imgLayer.nativeTileWidthSu / map.CoordUtil.getTileWidth(zoom);

            // Update the image sizes
            var scaledTileWidth = Math.round(map.CoordUtil.TILE_WIDTH * scaleFactor);
            if (scaledTileWidth > map.MapUtil.MAX_IMAGE_SCALE_WIDTH || scaledTileWidth < map.MapUtil.MIN_IMAGE_SCALE_WIDTH) {
                // The images are too big or too small -> Hide the layer
                imgLayer.imgParent.style.visibility = "hidden";
            } else {
                imgLayer.imgParent.style.visibility = "";
                updateTileOffsets(imgLayer, scaledTileWidth);
            }

            imgLayer.visibleZoom = zoom;
            imgLayer.scaleFactor = scaleFactor;
            imgLayer.tileWidthPix = scaledTileWidth;
        }
    };


    var setCenterForImgLayer = function(imgLayer, centerSuPt) {
        var tileWidthPix = imgLayer.tileWidthPix;

        // Get the absolute position of the layer in the visible zoom factor
        var layerLeftPix   = imgLayer.startTileX * tileWidthPix;
        var layerBottomPix = imgLayer.startTileY * tileWidthPix;
        var layerHeight = imgLayer.tileYCount * tileWidthPix;
        var layerTopPix = layerBottomPix + layerHeight; // +, because axis goes bottom-up

        // Get the absolute position of the center in the visible zoom factor
        var tileWidthSu = imgLayer.nativeTileWidthSu * map.CoordUtil.TILE_WIDTH / tileWidthPix;
        var centerPixPt = map.CoordUtil.smartUnit2PixelByTileWidth(centerSuPt, tileWidthSu);

        // Get the absolute position of the top-left corner of the map
        var mapLeftPix = centerPixPt.x - self.getComputedAreaWidth() / 2;
        var mapTopPix  = centerPixPt.y + self.getComputedAreaHeight() / 2;

        // Set the layer offset
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
        imgLayer.imgParent.style.left = offsetX + Math.round(layerLeftPix - mapLeftPix) + "px";
        imgLayer.imgParent.style.top  = offsetY + Math.round(-(layerTopPix - mapTopPix)) + "px";
    };


    /**
     * Updates the tile offsets of an internal layer.
     *
     * @param imgLayer {Map} the internal layer to update.
     * @param tileWidth {int} the width of a tile in pixels.
     */
    var updateTileOffsets = function(imgLayer, tileWidth) {
        var debugOffset = 0;

        var scaleFactor = tileWidth / map.CoordUtil.TILE_WIDTH;
        var rowCount = imgLayer.imgArr.length;
        for (var y = 0; y < rowCount; y++) {
            var imgRow = imgLayer.imgArr[y];
            for (var x = 0; x < imgRow.length; x++) {
                var imgElem = imgRow[x];
                if (imgElem._imgId != null) {
                    // This image is not fully clipped -> Set position

                    var left = Math.round(x * (tileWidth + debugOffset));
                    if (imgElem._clipLeft != 0) {
                        // NOTE: We use ceil, to avoid a gray line at the bottom
                        left += Math.ceil(imgElem._clipLeft * scaleFactor);
                    }
                    imgElem.style.left = left + "px";
                        
                    // NOTE: We assume that all images of one row have the same clipTop
                    var top = Math.round((rowCount - y - 1) * (tileWidth + debugOffset));
                    if (imgElem._clipTop != 0) {
                        // NOTE: We use ceil, to avoid a gray line at the right
                        top += Math.ceil(imgElem._clipTop * scaleFactor);
                    }
                    imgElem.style.top  = top + "px";

                    if (imgElem._debugElem) {
                        if (scaleFactor == 1) {
                            imgElem._debugElem.style.left = left + "px";
                            imgElem._debugElem.style.top = top + "px";
                        } else {
                            imgElem._debugElem.style.visibility = "hidden";
                        }
                    }
    
                    imgElem.style.width = Math.round(imgElem._width * scaleFactor) + "px";
                    imgElem.style.height = Math.round(imgElem._height * scaleFactor) + "px";
                }
            }
        }
    };


    /**
     * Event handler. Called when an image was loaded or when loading was aborted.
     *
     * @param imgElem {Element} the img element of which the image was loaded.
     * @param url {string} the URL of the loaded image.
     * @param exc {var} when loading failed.
     */
    var onImgLoaded = function(imgElem, url, exc) {
        if (exc == null) {
            imgElem._loaded = true;
            window.setTimeout(function() {
                if (!self.getDisposed()) {
                    imgElem.style.visibility = "";
                }
            }, 50);

            if (imgElem._imgLayer != null) {
                imgElem._imgLayer.loadedImageCount++;
            }

            if (imgElem._imgLayer == mImgLayer) {
                // Check whether the main image layer has loaded completely
                if (mImgLayer.loadedImageCount == mImgLayer.totalImageCount) {
                    // All images have been loaded -> Remove the background layer (if present)
                    if (self.getRemoveUnusedElements()) {
                        //self.info("timeout");
                        //window.setTimeout(function() {
                        cleanUpImgLayer(mBackgroundImgLayer);
                        //},0);
                        mBackgroundImgLayer = null;
                    }
                }
            }
        }
    };


    /**
     * Returns the loaded factor of an image array (= loaded images / total images).
     *
     * @param imgLayer {Map} The image layer to calculate the loaded factor for.
     * @return {double} the loaded factor.
     */
    var getLoadedFactor = function(imgLayer) {
        return (imgLayer.totalImageCount == 0) ? 0 : (imgLayer.loadedImageCount / imgLayer.totalImageCount);
    };


    /**
     * Repaint this layer.
     */
    self.repaint = function() {
        updateContent({ clipRectChanged:true });
    };
    
    
    // overridden
    self.doPrintMap = function(ctx, htmlContainer, htmlBackground) {
        if (mImgLayer) {
            var offsetX = 0;
            var offsetY = 0;
            if (self.isRelative()) {
                var relativeOffset = self.getMap().getRelativeOffset();
                offsetX = Math.round(relativeOffset.x);
                offsetY = Math.round(relativeOffset.y);
            }
            var areaBorderWidth = self.getAreaBorderWidth();
            offsetX -= parseInt(mImgLayer.imgParent.style.left) + areaBorderWidth;
            offsetY -= parseInt(mImgLayer.imgParent.style.top) + areaBorderWidth;
            var mapWidth = self.getMap().getWidth();
            var mapHeight = self.getMap().getHeight();
            var imgRowCount = mImgLayer.imgArr.length;
            for (var i = 0; i < imgRowCount; ++i) {
                var imgRow = mImgLayer.imgArr[i];
                var imgCount = imgRow.length;
                for (var j = 0; j < imgCount; ++j) {
                    var imgElem = imgRow[j];
                    if (imgElem._loaded) {
                        var left = self.getComputedAreaLeft() +
                            parseInt(imgElem.style.left) - offsetX;
                        var top = self.getComputedAreaTop() +
                            parseInt(imgElem.style.top) - offsetY;
                        var width = parseInt(imgElem.style.width);
                        var height = parseInt(imgElem.style.height);
                        var doDraw = (left < mapWidth && left + width > 0 &&
                                      top < mapHeight && top + height > 0);
                        if (doDraw || (self.getAutoRotate() &&
                            self.getMap().getVisibleRotation() != 0)) {
                            ctx.drawImage(imgElem, 0, 0,
                                imgElem._width, imgElem._height,
                                self.getComputedAreaLeft() + parseInt(imgElem.style.left) - offsetX,
                                self.getComputedAreaTop() + parseInt(imgElem.style.top) - offsetY,
                                parseInt(imgElem.style.width),
                                parseInt(imgElem.style.height));
                        }
                    }
                }
            }
        }
    };


    // overridden
    var superDispose = self.dispose;
    self.dispose = function() {
        if (self.getDisposed()) {
            return;
        }

        cleanUpImgLayer(mImgLayer, true);
        cleanUpImgLayer(mBackgroundImgLayer, true);

        superDispose.call(self);
    };

});


/**
 * Whether or not to remove background image elements that are no longer
 * needed. Usually, you should keep the default value (false) because it makes
 * zooming in and out faster. However, on devices with significant resource
 * constraints (e.g. iPhone), removing background elements can make panning
 * much faster.
 */
qxp.OO.addProperty({ name:"removeUnusedElements",
    type:qxp.constant.Type.BOOLEAN, allowNull:false, defaultValue:false });


/** Show tile boundaries (only shows boundaries at the correct coordinates in Firefox!). */
qxp.OO.addProperty({ name:"showTileBoundaries", type:qxp.constant.Type.BOOLEAN,
    allowNull:false, defaultValue:false, getAlias:"showTileBoundaries" });


/**
 * The image loader instance to use. If <code>null</code>, the map's default
 * load will be used. */
qxp.OO.addProperty({ name:"imageLoader", type:qxp.constant.Type.OBJECT,
    defaultValue:null });


/** {int} the border width around the visible tiles to load. */
qxp.Class.BORDER_TILE_COUNT = 1;

/**
 * {float} the minimum factor of loaded tiles to total tiles an internal layer
 * must have to be used as background layer when zooming. If the foreground
 * layer of the last zoom level has a smaller factor, the old background layer
 * will be reused.
 */
qxp.Class.MIN_LOADED_FACTOR = 0.4;
