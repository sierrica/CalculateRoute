/**
 * A variant of {@link ImageMarker} (see below for details).
 * <p>
 * This is a variant of the {@link ImageMarker} class that is drawn on the
 * canvas instead of using HTML. This means that the image is rotated together
 * with the map. Please note that drawing many markers can be significantly
 * slower than with {@link ImageMarker}.
 * </p>
 * <p>
 * Sample code: {@sample Drawing on the map},
 *              {@sample Client-side POIs}
 * 
 * @param   x {double,4355664}  the x coordinate in smart units.
 * @param   y {double,5464867}  the y coordinate in smart units.
 * @param   url {string,null}   the URL of the image (relative or absolute). If
 *                              it's <code>null</code>, a default image is
 *                              used.
 * @param   alignment {int,66}  the alignment of the image relative to the x
 *                              and y coordinates (see the constants in the
 *                              {@link com.ptvag.webcomponent.map.layer.VectorLayer}
 *                              class).
 * @param   priority {int,0}    the drawing priority.
 * @param   id {var,null}       the id of the element.
 * @param   isPositionFlexible {boolean,false} Whether the position is
 *                              flexible. Flexible elements will displace
 *                              each other when they are close to another.
 */
qxp.OO.defineClass("com.ptvag.webcomponent.map.vector.ImageMarker2",
                  com.ptvag.webcomponent.map.vector.VectorElement,
function(x, y, url, alignment, priority, id, isPositionFlexible) {
    com.ptvag.webcomponent.map.vector.VectorElement.call(this, priority, id, isPositionFlexible);

    var self = this;
    var map = com.ptvag.webcomponent.map;

    var mImg = null;
    var mImgWidth = null;
    var mImgHeight = null;
    var mSizeRequested = false;
    var mCleared = false;
    var mInDraw = false;
    var mCtx;


    /**
     * Positions the image.
     */
    var drawImage = function() {
        if (mImg != null && mImgWidth != null && mImgHeight != null) {
            var width = mImgWidth;
            var height = mImgHeight;
            var factor = self.getZoomFactor();
            width *= factor;
            height *= factor;
            var realX = self.getRealX();
            var realY = self.getRealY();
            if (realX != null && realY != null) {
                var offsetX = 0;
                var offsetY = 0;
                var alignment = self.getAlignment();
                if (alignment & map.layer.VectorLayer.ALIGN_MID_HORIZ) {
                    offsetX = -(width)/2;
                } else if (alignment & map.layer.VectorLayer.ALIGN_RIGHT) {
                    offsetX = -(width);
                }
                if (alignment & map.layer.VectorLayer.ALIGN_MID_VERT) {
                    offsetY = -(height)/2;
                } else if (alignment & map.layer.VectorLayer.ALIGN_BOTTOM) {
                    offsetY = -(height);
                }
                var alignedX = Math.round(realX + offsetX);
                var alignedY = Math.round(realY + offsetY);
                mCtx.globalAlpha = self.getOpacity();
                mCtx.drawImage(mImg, alignedX, alignedY, width, height);
                mCtx.globalAlpha = 1;
            }
        }
    };


    /**
     * Image loaded handler.
     */
    var onImageSizeAvailable = function(url, width, height) {
        if (!mCleared) {
            mImgWidth = width;
            mImgHeight = height;
            if (mInDraw) {
                drawImage();
            } else {
                self.refresh();
            }
        }
    };


    // overridden
    self.usesCanvas = function() {
        return true;
    };


    // overridden
    var superDraw = self.draw;
    self.draw = function(container, topLevelContainer, ctx,
                         mapLeft, mapTop, mapZoom) {
        superDraw.apply(self, arguments);
        mCtx = ctx;
        mCleared = false;
        
        var suPoint = {x: self.getX(), y: self.getY()};
        var pixCoords = map.CoordUtil.smartUnit2Pixel(suPoint, mapZoom);
        self.setRealX(pixCoords.x - mapLeft + self.getFlexX());
        self.setRealY(mapTop - pixCoords.y + self.getFlexY());

        if (!mSizeRequested) {
            mSizeRequested = true;
            var actualURL = self.getUrl();
            if (actualURL == null) {
                actualURL = "img/com/ptvag/webcomponent/map/1downarrow.png";
            }
            actualURL = map.MapUtil.resolveURL(actualURL);
            var imagePool = map.vector.ImageMarker2.IMAGE_POOL;
            mImg = imagePool[actualURL];
            if (mImg == null) {
                mImg = new Image();
                mImg.src = actualURL;
                imagePool[actualURL] = mImg;
            }
            mInDraw = true;
            map.ImageLoader.getImageSize(actualURL, onImageSizeAvailable);
            mInDraw = false;
        } else {
            drawImage();
        }
    };
    
    
    // overridden
    self.clear = function() {
        mCleared = true;
        mCtx = null;
    };


    if (x != null) {
        self.setX(x);
    }
    if (y != null) {
        self.setY(y);
    }
    if (url != null) {
        self.setUrl(url);
    }
    if (alignment != null) {
        self.setAlignment(alignment);
    }

    self.refreshOn("x", "y", "url", "alignment", "opacity");
});


/** The x coordinate of the image marker (in smart units). */
qxp.OO.addProperty({ name:"x", type:qxp.constant.Type.NUMBER, allowNull:false, defaultValue:4355664 });
/** The y coordinate of the image marker (in smart units). */
qxp.OO.addProperty({ name:"y", type:qxp.constant.Type.NUMBER, allowNull:false, defaultValue:5464867 });

/**
 * Contains the x position in pixels after the element has been drawn.
 */
qxp.OO.addProperty({ name:"realX", type:qxp.constant.Type.NUMBER, allowNull:false });

/**
 * Contains the y position in pixels after the element has been drawn.
 */
qxp.OO.addProperty({ name:"realY", type:qxp.constant.Type.NUMBER, allowNull:false });

/**
 * The URL of the image (if <code>null</code>, a default image is used).
 */
qxp.OO.addProperty({ name:"url", type:qxp.constant.Type.STRING, allowNull:true });

/**
 * The alignment of the image marker relative to the x and y coordinates (see the
 * constants in the {@link com.ptvag.webcomponent.map.layer.VectorLayer}
 * class).
 */
qxp.OO.addProperty({ name:"alignment", type:qxp.constant.Type.NUMBER, allowNull:false, defaultValue:66 });

/**
 * The opacity of the image marker. In contrast to the {@link ImageMarker}
 * class, changing the opacity of an <code>ImageMarker2</code> after it has
 * been drawn has no effect.
 */
qxp.OO.addProperty({ name:"opacity", type:qxp.constant.Type.NUMBER, defaultValue:1, allowNull:false });

/** Used internally to cache JavaScript Image objects. */
qxp.Class.IMAGE_POOL = {};
