/**
 * An image that should be shown at a specified position on the map.
 * <p>
 * The image is drawn using HTML. It's placed correctly when the map is
 * rotated, but the image itself stays upright. If you need the image to rotate
 * too, use an {@link ImageMarker2}.
 * </p>
 * <p>
 * Sample code: {@sample Drawing on the map},
 *              {@sample Clickable images},
 *              {@sample Flexible elements (1)},
 *              {@sample Flexible elements (2)},
 *              {@sample Client-side POIs},
 *              {@sample Custom client-side POIs}
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
qxp.OO.defineClass("com.ptvag.webcomponent.map.vector.ImageMarker",
                  com.ptvag.webcomponent.map.vector.VectorElement,
function(x, y, url, alignment, priority, id, isPositionFlexible) {
    com.ptvag.webcomponent.map.vector.VectorElement.call(this, priority, id, isPositionFlexible);

    var self = this;
    var map = com.ptvag.webcomponent.map;

    var mImgElement = null;
    var mImgWidth = null;
    var mImgHeight = null;


    // property modifier
    self._modifyOpacity = function(propValue) {
        if (mImgElement != null) {
            map.MapUtil.setElementOpacity(mImgElement, propValue);
        }
    };
    
    
    // property modifier
    self._modifyUrl = function(propValue) {
        if (mImgElement != null) {
            var actualURL = resolveURL(propValue);
            mImgElement.src = actualURL;
            map.ImageLoader.getImageSize(actualURL, onImageSizeAvailable);
        }
    };


    /**
     * Positions the image.
     */
    var positionImage = function() {
        if (mImgElement != null && mImgWidth != null && mImgHeight != null) {
            var realX = self.getRealX();
            var realY = self.getRealY();
            if (realX != null && realY != null) {
                var offsetX = 0;
                var offsetY = 0;
                var alignment = self.getAlignment();
                if (alignment & map.layer.VectorLayer.ALIGN_MID_HORIZ) {
                    offsetX = -(mImgWidth)/2;
                } else if (alignment & map.layer.VectorLayer.ALIGN_RIGHT) {
                    offsetX = -(mImgWidth);
                }
                if (alignment & map.layer.VectorLayer.ALIGN_MID_VERT) {
                    offsetY = -(mImgHeight)/2;
                } else if (alignment & map.layer.VectorLayer.ALIGN_BOTTOM) {
                    offsetY = -(mImgHeight);
                }
                mImgElement.style.left = Math.round(realX + offsetX) + "px";
                mImgElement.style.top = Math.round(realY + offsetY) + "px";
            }
        }
    };


    /**
     * Image loaded handler.
     */
    var onImageSizeAvailable = function(url, width, height) {
        mImgWidth = width;
        mImgHeight = height;
        positionImage();
        if (mImgElement != null) {
            mImgElement.style.visibility = "visible";
        }
    };


    // overridden
    self.usesCanvas = function(ctx) {
        return (ctx instanceof map.PrintContext ? true : false);
    };


    // resolve the image url
    var resolveURL = function(url) {
        if (url == null) {
            url = "img/com/ptvag/webcomponent/map/1downarrow.gif";
        }
        return map.MapUtil.resolveURL(url);
    };


    // overridden
    self.draw = function(container, topLevelContainer, ctx,
                         mapLeft, mapTop, mapZoom) {
        var suPoint = {x: self.getX(), y: self.getY()};
        var pixCoords = map.CoordUtil.smartUnit2Pixel(suPoint, mapZoom);
        var realX = pixCoords.x - mapLeft + self.getFlexX();
        var realY = mapTop - pixCoords.y + self.getFlexY();
        var coords = self.getVectorLayer().getMap().transformPixelCoords(
            realX, realY, false, false, true);
        self.setRealX(coords.x + self.getOffsetX());
        self.setRealY(coords.y + self.getOffsetY());
        if (ctx instanceof map.PrintContext) {
            if (mImgElement != null && mImgWidth != null && mImgHeight != null) {
                ctx.save();
                ctx.setTransform(1, 0, 0, 1, 0, 0);
                ctx.drawImage(mImgElement, 0, 0, mImgWidth, mImgHeight,
                              parseInt(mImgElement.style.left), parseInt(mImgElement.style.top),
                              mImgWidth, mImgHeight);
                ctx.restore();
            }
        } else {
            if (mImgElement == null) {
                var actualURL = resolveURL(self.getUrl());
                mImgElement = document.createElement("img");
                mImgElement.setAttribute("_ptv_map_dontPrint", true);
                mImgElement.src = actualURL;
                mImgElement.style.position = "absolute";
                mImgElement.style.visibility = "hidden";
                mImgElement.style.zIndex = -2000000000 + self.getPriority();
                self._modifyOpacity(self.getOpacity());
                container.appendChild(mImgElement);
                map.ImageLoader.getImageSize(actualURL, onImageSizeAvailable);
            } else {
                positionImage();
            }
        }
    };


    // overridden
    self.clear = function(inDispose) {
        if (mImgElement != null) {
            if (!inDispose) {
                mImgElement.parentNode.removeChild(mImgElement);
            }
            mImgElement = null;
        }
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

    self.refreshOn("x", "y", "offsetX", "offsetY", "alignment");
});


/** The x coordinate of the image marker (in smart units). */
qxp.OO.addProperty({ name:"x", type:qxp.constant.Type.NUMBER, allowNull:false, defaultValue:4355664 });
/** The y coordinate of the image marker (in smart units). */
qxp.OO.addProperty({ name:"y", type:qxp.constant.Type.NUMBER, allowNull:false, defaultValue:5464867 });

/**
 * The number of pixels the element should move to the right. This property
 * works in screen coordinates and is applied on top of
 * {@link VectorElement#flexX}.
 */
qxp.OO.addProperty({ name:"offsetX", allowNull:false, defaultValue:0 });

/**
 * The number of pixels the element should move to the bottom. This property
 * works in screen coordinates and is applied on top of
 * {@link VectorElement#flexY}.
 */
qxp.OO.addProperty({ name:"offsetY", allowNull:false, defaultValue:0 });

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
 * The opacity of the image marker. This value can also be changed after the
 * marker has been drawn.
 */
qxp.OO.addProperty({ name:"opacity", type:qxp.constant.Type.NUMBER, defaultValue:1, allowNull:false });
