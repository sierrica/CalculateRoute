/**
 * An abstract super class for layers painting vector graphics. Encapsulates the
 * basics for supporting vector graphics in a browser.
 * 
 * @param   floaterLayer {com.ptvag.webcomponent.map.layer.Layer} the layer that
 *            should be used to show high priority elements. This includes
 *            clickable/selectable tooltips/info boxes. Without a high priority
 *            layer, clicks would be swallowed by higher layers.
 * @param   isSecondary {boolean,false}     whether this is a secondary vector
 *                                          layer (used to avoid duplicate
 *                                          handling of the floater layer).
 */
qxp.OO.defineClass("com.ptvag.webcomponent.map.layer.AbstractVectorLayer",
com.ptvag.webcomponent.map.layer.Layer,
function(floaterLayer, isSecondary) {
    com.ptvag.webcomponent.map.layer.Layer.call(this);

    var self = this;
    var map = com.ptvag.webcomponent.map;

    /** The canvas used for painting the vector graphics. */
    var mCanvas = null;
    
    /** Another canvas used for double-buffering. */
    var mBackgroundCanvas = null;
    
    /** {Element} Contains elements that can't be painted in the canvas (like text). */
    var mContainer = null;
    
    var mFloaterLayer = floaterLayer;

    var mCurrentCenterPix = null;
    //var mPreviousOffsetX = 0;
    //var mPreviousOffsetY = 0;

    var mCanvasSupported = true;
    var mCanvasDirty = false;
    var mBackgroundCanvasDirty = false;

    var mActiveLayer = null;
    

    // overridden
    var superInit = self.init;
    self.init = function() {
        superInit.apply(self, arguments);
        
        self.getMap().getController().addEventListener("changeActiveLayer", onActiveLayerChanged);

        if (self.isEnabled()) {
            updateImage();
        }
    };


    /**
     * Whether the browser supports the <code>&lt;canvas&gt;</code> tag
     * (either directly or through emulation). Canvas support is necessary
     * for displaying vector graphics.
     *
     * @return  {boolean}           whether <code>&lt;canvas&gt;</code> is
     *                              supported.
     */
    self.isCanvasSupported = function() {
        return mCanvasSupported;
    }
    
    
    var onActiveLayerChanged = function(evt) {
        try {
            var previousActiveLayer = mActiveLayer;
            mActiveLayer = evt.getData();
            if (mActiveLayer == null && previousActiveLayer != self) {
                if (previousActiveLayer == null ||
                    !previousActiveLayer.isInZoomBoxMode ||
                    !previousActiveLayer.isInZoomBoxMode())
                // Repaint the canvas when panning is finished (but not when
                // leaving the zoom box mode because this changes the center
                // and/or zoom so we get a seperate event anyway)
                updateImage();
            }
        } catch (e) {
            self.error("Error in onActiveLayerChanged in AbstractVectorLayer", e);
        }
    };


    // overridden
    self.onViewChanged = function(evt) {
        updateImage(evt);
    };


    var updateImage = function(evt) {
        var offsetX = 0;
        var offsetY = 0;
        var theMap = self.getMap();
        var activeLayer = theMap.getController().getActiveLayer();
        var width  = theMap.getWidth();
        var height = theMap.getHeight();
        var mapZoom = theMap.getVisibleZoom();
        var mapCenterSu  = theMap.getVisibleCenter();

        if (self.isRelative()) {
            var relativeOffset = theMap.getRelativeOffset();
            offsetX = relativeOffset.x;
            offsetY = relativeOffset.y;
            if ((offsetX != 0 || offsetY != 0) && evt != null) {
                if (activeLayer != null && activeLayer != self) {
                    return;
                }
                var targetZoom = theMap.getZoom();
                if (mapZoom == targetZoom) {
                    var targetCenter = theMap.getCenter();
                    if (targetCenter.x != mapCenterSu.x ||
                        targetCenter.y != mapCenterSu.y) {
                        return;
                    }
                }
            }
            /*if (activeLayer != null && activeLayer != self &&
                (offsetX != 0 || offsetY != 0)) {
                //console.log("shortcut 1: " + offsetX + " / " + offsetY);
                return;
            }*/
        }
        offsetX = Math.round(offsetX);
        offsetY = Math.round(offsetY);
        //console.log("Painting vector layer");

        var mapCenterPix = map.CoordUtil.smartUnit2Pixel(mapCenterSu, mapZoom);

        var floaterElement = null;
        if (mFloaterLayer != null && !isSecondary) {
            floaterElement = mFloaterLayer.getParentElement();
        }

        if (activeLayer != null && activeLayer != self &&
            mCurrentCenterPix != null) {
            offsetX += mCurrentCenterPix.x - mapCenterPix.x;
            offsetY += mapCenterPix.y - mCurrentCenterPix.y;
            var rotatedOffsets = theMap.transformPixelCoords(offsetX, offsetY,
                true, false, true);
            var styleLeft = Math.round(rotatedOffsets.x) + "px";
            var styleTop = Math.round(rotatedOffsets.y) + "px";
            if (mCanvas != null) {
                mCanvas.style.left = styleLeft;
                mCanvas.style.top = styleTop;
            }
            if (mContainer != null) {
                mContainer.style.left = styleLeft;
                mContainer.style.top = styleTop;
            }
            if (floaterElement != null) {
                floaterElement.style.left = styleLeft;
                floaterElement.style.top = styleTop;
            }
            //mPreviousOffsetX = offsetX;
            //mPreviousOffsetY = offsetY;
//console.log("shortcut 2: " + styleLeft + " / " + styleTop);
            return;
        }

        var mapTop  = mapCenterPix.y + height / 2 + 0.001;
            // 0.001 is an UGLY HACK to prevent rounding problems (caused by
            // elements centered at the mouse position and hovering around .5
            // as the fractional part, which would make them jump around while
            // panning)
        var mapLeft = mapCenterPix.x - width / 2 - 0.001;

        var styleLeft = offsetX + "px";
//console.log("styleLeft: " + styleLeft);
        var styleTop = offsetY + "px";
        //mPreviousOffsetX = 0;
        //mPreviousOffsetY = 0;
        var styleWidth = width + "px";
        var styleHeight = height + "px";
        if (mCanvas == null && mCanvasSupported) {
            mCanvas = map.MapUtil.createCanvas(window, self.getParentElement(),
                                               width, height);
            if (mCanvas == null) {
                mCanvasSupported = false;
            } else {
                mBackgroundCanvas = map.MapUtil.createCanvas(window,
                    self.getParentElement(), width, height);
                mCanvas.style.position = "absolute";
                mCanvas.style.left = styleLeft;
                mCanvas.style.top = styleTop;
                mCanvas.style.zIndex = -2000000001;
                mBackgroundCanvas.style.position = "absolute";
                mBackgroundCanvas.style.left = styleLeft;
                mBackgroundCanvas.style.top = styleTop;
                mBackgroundCanvas.style.zIndex = -2000000001;
                mBackgroundCanvas.style.visibility = "hidden";
            }
        } else if (mCanvas != null) {
            var Client = qxp.sys.Client.getInstance();
            if (!Client.isGecko() && !Client.isMshtml()) {
                // In Opera and Safari, we have to recreate the canvas with
                // a different size - else the coordinates and sizes of things
                // become wrong (and Opera begins to show strange artifacts).
                if (mBackgroundCanvas.style.width != styleWidth ||
                    mBackgroundCanvas.style.height != styleHeight) {
                    self.getParentElement().removeChild(mBackgroundCanvas);
                    mBackgroundCanvas = document.createElement("canvas");
                    mBackgroundCanvas.setAttribute("width", width);
                    mBackgroundCanvas.setAttribute("height", height);
                    mBackgroundCanvas.style.position = "absolute";
                    mBackgroundCanvas.style.left = styleLeft;
                    mBackgroundCanvas.style.top = styleTop;
                    mBackgroundCanvas.style.width = styleWidth;
                    mBackgroundCanvas.style.height = styleHeight;
                    mBackgroundCanvas.style.zIndex = -2000000001;
                    self.getParentElement().appendChild(mBackgroundCanvas);
                } else {
                    mBackgroundCanvas.style.left = styleLeft;
                    mBackgroundCanvas.style.top = styleTop;
                }
            } else {
                mBackgroundCanvas.style.left = styleLeft;
                mBackgroundCanvas.style.top = styleTop;
                if (mBackgroundCanvas.style.width != styleWidth ||
                    mBackgroundCanvas.style.height != styleHeight) {
                    mBackgroundCanvas.setAttribute("width", width);
                    mBackgroundCanvas.setAttribute("height", height);
                    mBackgroundCanvas.style.width = styleWidth;
                    mBackgroundCanvas.style.height = styleHeight;
                }
            }
        }
        if (mContainer == null) {
            mContainer = document.createElement("div");
            mContainer.style.position = "absolute";
            mContainer.style.width = styleWidth;
            mContainer.style.height = styleHeight;
            mContainer.style.zIndex = 0;    // necessary for the new
                                            // (low-z-index) image markers
                                            // to work in Opera and
                                            // Safari
            self.getParentElement().appendChild(mContainer);
        } else {
            if (mContainer.style.width != styleWidth ||
                mContainer.style.height != styleHeight) {
                mContainer.style.width = styleWidth;
                mContainer.style.height = styleHeight;
            }
        }

        // Clear canvas
        var context = null;
        if (mBackgroundCanvas != null) {
            context = mBackgroundCanvas.getContext("2d");
            if (mBackgroundCanvasDirty) {
                context.clearRect(0, 0, width, height);
            }
        }

        // Clear container
        //while (mContainer.firstChild) {
        //    mContainer.removeChild(mContainer.firstChild);
        //}

        // Repaint the content
        mCurrentCenterPix = mapCenterPix;
        //if (mContainer.style.left != styleLeft || mContainer.style.top != styleTop) {
        //    mContainer.style.display = "none";
        //    if (floaterElement != null) {
        //        floaterElement.style.display = "none";
        //    }
        //}
        var rotationAngle = self.getMap().getVisibleRotation();
        context.save();
        context.translate(width/2, height/2);
        context.rotate(-rotationAngle/180.0*Math.PI);
        context.translate(-width/2, -height/2);
        mBackgroundCanvasDirty =
            self.paintContent(context, mContainer, mapZoom, mapLeft, mapTop);
        context.restore();
        mContainer.style.left = styleLeft;
        mContainer.style.top = styleTop;
        //mContainer.style.display = "";
        if (floaterElement != null) {
            floaterElement.style.left = styleLeft;
            floaterElement.style.top = styleTop;
            //floaterElement.style.display = "";
        }

        // swap the canvas elements
        if (mCanvas != null) {
            var temp = mCanvas;
            mCanvas = mBackgroundCanvas;
            mBackgroundCanvas = temp;
            temp = mCanvasDirty;
            mCanvasDirty = mBackgroundCanvasDirty;
            mBackgroundCanvasDirty = temp;
            mCanvas.style.visibility = "";
            mBackgroundCanvas.style.visibility = "hidden";
        }
    };


    /**
     * Paints the content of the layer.
     *
     * @param context {object} the painting context of the vector canvas.
     * @param container {Element} the DOM element to use for "painting" stuff
     *        that's easier done using HTML.
     * @param mapZoom {double} the current zoom level.
     * @param mapLeft {double} the current left edge of the map.
     * @param mapTop {double} the current top edge of the map.
     * @param forPrinting {boolean} whether this method is called to create a
     *        printable version. In this case, no HTML elements should be
     *        created in the container!
     * 
     * @return {boolean} whether or not the canvas has been used (so it can be
     *                   flagged dirty for future repaints).
     */
    self.paintContent = function(context, container, mapZoom, mapLeft, mapTop,
                                 forPrinting) {
        throw new Error("paintContent is abstract");
    };


    /**
     * Marks the canvas as dirty.
     */
    self.setCanvasDirty = function() {
        mCanvasDirty = true;
    };


    // overridden
    self.doPrint = function(ctx, htmlContainer, htmlBackground) {
        var theMap = self.getMap();
        var mapZoom = theMap.getVisibleZoom();
        var mapCenterSu  = theMap.getVisibleCenter();
        var mapCenterPix =
            map.CoordUtil.smartUnit2Pixel(mapCenterSu, mapZoom);
        var mapTop  = mapCenterPix.y + theMap.getHeight() / 2 + 0.001;
            // 0.001 is an UGLY HACK to prevent rounding problems (caused by
            // elements centered at the mouse position and hovering around .5
            // as the fractional part, which would make them jump around while
            // panning)
        var mapLeft = mapCenterPix.x - theMap.getWidth() / 2 - 0.001;
        var rotationAngle = self.getMap().getVisibleRotation();
        var matrix = map.MapUtil.createRotationMatrix(rotationAngle,
            theMap.getWidth()/2, theMap.getHeight()/2);
        ctx.save();
        ctx.setTransform(matrix.a, matrix.b, matrix.c, matrix.d,
            matrix.tx, matrix.ty);
        self.paintContent(ctx, htmlContainer, mapZoom, mapLeft, mapTop,
                          true);
        ctx.restore();

        var htmlContent = map.MapUtil.cloneNodeForPrinting(mContainer,
            htmlContainer.ownerDocument);
        htmlContent.style.left = "0px";
        htmlContent.style.top = "0px";
        htmlContainer.appendChild(htmlContent);

        if (mFloaterLayer != null && !isSecondary) {
            htmlContent = map.MapUtil.cloneNodeForPrinting(
                mFloaterLayer.getParentElement(), htmlContainer.ownerDocument);
            htmlContent.style.left = "0px";
            htmlContent.style.top = "0px";
            htmlContainer.appendChild(htmlContent);
        }
    };
    

    // overridden
    var superDispose = self.dispose;
    self.dispose = function() {
        if (self.getDisposed()) {
            return;
        }
        self.getMap().getController().removeEventListener("changeActiveLayer", onActiveLayerChanged);
        mContainer = null;              // help GC
        if (mCanvas != null) {
            map.MapUtil.cleanupCanvas(window, mCanvas);
            mCanvas = null;             // help GC
        }
        if (mBackgroundCanvas != null) {
            map.MapUtil.cleanupCanvas(window, mBackgroundCanvas);
            mBackgroundCanvas = null;   // help GC
        }
        superDispose.call(self);
    };

});
