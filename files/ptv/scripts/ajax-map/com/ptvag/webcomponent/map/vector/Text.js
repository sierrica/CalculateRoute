/**
 * A text that should be shown at a specified position on the map.
 * <p>
 * Sample code: {@sample Displaying text}
 * 
 * @param   x {double,4355664}  the x coordinate in smart units.
 * @param   y {double,5464867}  the y coordinate in smart units.
 * @param   color {string,"#000000"}  the color of the text.
 * @param   pixelSize {int,12}  the height of the text.
 * @param   alignment {int,66}  the alignment of the text relative to the x
 *                              and y coordinates (see the constants in the
 *                              {@link com.ptvag.webcomponent.map.layer.VectorLayer}
 *                              class).
 * @param   text {string,""}    the text to show.
 * @param   priority {int,0}    the drawing priority.
 * @param   id {var,null}       the id of the element.
 * @param   isPositionFlexible {boolean,false} Whether the position is
 *                              flexible. Flexible elements will displace
 *                              each other when they are close to another.
 */
qxp.OO.defineClass("com.ptvag.webcomponent.map.vector.Text",
                  com.ptvag.webcomponent.map.vector.VectorElement,
function(x, y, color, pixelSize, alignment, text, priority, id, isPositionFlexible) {
    com.ptvag.webcomponent.map.vector.VectorElement.call(this, priority, id, isPositionFlexible);

    var self = this;
    var map = com.ptvag.webcomponent.map;
    
    var mTextElement = null;
    var mTextWidth = null;
    var mTextHeight = null;
    

    // property checker
    self._checkColor = function(propValue) {
        var translatedColor = map.MapUtil.translateColor(propValue);
        var opacity = translatedColor.opacity;
        if (opacity != null) {
            self.setOpacity(opacity);
        }
        return translatedColor.color;
    };
    
    
    /**
     * Positions the text.
     */
    var positionText = function() {
        if (mTextElement != null && mTextWidth != null && mTextHeight != null) {
            var realX = self.getRealX();
            var realY = self.getRealY();
            if (realX != null && realY != null) {
                var alignment = self.getAlignment();
                if (alignment & map.layer.VectorLayer.ALIGN_MID_HORIZ) {
                    mTextElement.style.left = Math.round(realX - (mTextWidth / 2)) + "px";
                } else if (alignment & map.layer.VectorLayer.ALIGN_RIGHT) {
                    mTextElement.style.left = Math.round(realX - mTextWidth) + "px";
                } else {
                    mTextElement.style.left = Math.round(realX) + "px";
                }
                if (alignment & map.layer.VectorLayer.ALIGN_MID_VERT) {
                    mTextElement.style.top = Math.round(realY
                        - (mTextHeight*0.8 / 2) + self.getVerticalAdjustment()) + "px";
                        // *0.8 because of base line pos
                } else if (alignment & map.layer.VectorLayer.ALIGN_BOTTOM) {
                    mTextElement.style.top = Math.round(realY - mTextHeight) + "px";
                } else {
                    mTextElement.style.top = Math.round(realY) + "px";
                }
            }
        }
    };
    
    
    // overridden
    self.usesCanvas = function(ctx) {
        return (ctx instanceof map.PrintContext ? true : false);
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
        realX = coords.x + self.getOffsetX();
        realY = coords.y + self.getOffsetY();
        self.setRealX(realX);
        self.setRealY(realY);
        if (ctx instanceof map.PrintContext) {
            if (mTextElement != null) {
                ctx.fontFamily = self.getFontFamily();
                if (self.getFontWeight() == "bold") {
                    ctx.fontStyle = "bold";
                } else {
                    ctx.fontStyle = "plain";
                }
                ctx.fontSize = self.getPixelSize();
                ctx.textAlignment = self.getAlignment() & ~112 | 16;
                    // filter out vertical alignment - don't let the server
                    // do this, let's take our own calculations in order to
                    // make it look the same
                ctx.strokeStyle = self.getColor();
                var oldGlobalAlpha = ctx.globalAlpha;
                ctx.globalAlpha *= self.getOpacity();
                ctx.save();
                ctx.setTransform(1, 0, 0, 1, 0, 0);
                ctx.drawText(self.getText(), realX, parseInt(mTextElement.style.top));
                ctx.restore();
                ctx.globalAlpha = oldGlobalAlpha;
            }
        } else {
            if (mTextElement == null) {
                mTextElement = document.createElement("div");
                mTextElement.setAttribute("_ptv_map_dontPrint", true);
                mTextElement.style.position = "absolute";
                mTextElement.style.fontFamily = self.getFontFamily();
                mTextElement.style.fontSize = self.getPixelSize() + "px";
                mTextElement.style.fontWeight = self.getFontWeight();
                mTextElement.style.color = self.getColor();
                map.MapUtil.setElementOpacity(mTextElement, self.getOpacity());
                mTextElement.style.visibility = "hidden";
                mTextElement.style.zIndex = -2000000000 + self.getPriority();
                var text = document.createTextNode(self.getText());
                mTextElement.appendChild(text);
                container.appendChild(mTextElement);
                mTextWidth = mTextElement.offsetWidth;
                mTextHeight = mTextElement.offsetHeight;
                positionText();
                mTextElement.style.visibility = "visible";
            } else {
                positionText();
            }
        }
    };
    

    // overridden
    self.clear = function(inDispose) {
        if (mTextElement != null) {
            if (!inDispose) {
                mTextElement.parentNode.removeChild(mTextElement);
            }
            mTextElement = null;
        }
    };
    
    
    if (x != null) {
        self.setX(x);
    }
    if (y != null) {
        self.setY(y);
    }
    if (color != null && color != self.getColor()) {
        self.setColor(color);
    } else {
        // force check/opacity calculation
        self.setColor(self._checkColor(self.getColor()));
    }
    if (pixelSize != null) {
        self.setPixelSize(pixelSize);
    }
    if (alignment != null) {
        self.setAlignment(alignment);
    }
    if (text != null) {
        self.setText(text);
    }

    self.refreshOn("x", "y", "offsetX", "offsetY", "color", "opacity",
                   "pixelSize", "alignment", "text", "fontFamily",
                   "fontWeight", "verticalAdjustment");
});


/** The x coordinate of the text (in smart units). */
qxp.OO.addProperty({ name:"x", type:qxp.constant.Type.NUMBER, allowNull:false, defaultValue:4355664 });
/** The y coordinate of the text (in smart units). */
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
 * The color of the text.
 * The color can be specified as RGB hex values ("#ff0000")
 * or as RGB alpha values ("rgba(255,0,0,1.0)").
 * If the RGB alpha syntax is used, the {@link #opacity} attribute is set
 * accordingly. If the hex value syntax is used, the opacity is left at its
 * current value.
 */
qxp.OO.addProperty({ name:"color", type:qxp.constant.Type.STRING, allowNull:false, defaultValue:"#000000" });

/**
 * The opacity of the text. This property can also be set by using the
 * RGB alpha syntax for the {@link #color} property.
 */
qxp.OO.addProperty({ name:"opacity", type:qxp.constant.Type.NUMBER, allowNull:false, defaultValue:1 });

/** The font height in pixels. */
qxp.OO.addProperty({ name:"pixelSize", type:qxp.constant.Type.NUMBER, allowNull:false, defaultValue:12 });

/**
 * The alignment of the text relative to the x and y coordinates (see the
 * constants in the {@link com.ptvag.webcomponent.map.layer.VectorLayer}
 * class).
 */
qxp.OO.addProperty({ name:"alignment", type:qxp.constant.Type.NUMBER, allowNull:false, defaultValue:66 });

/** The text to display. */
qxp.OO.addProperty({ name:"text", type:qxp.constant.Type.STRING, allowNull:false, defaultValue:"" });

/** The font family to use for the text (CSS syntax). */
qxp.OO.addProperty({ name:"fontFamily", type:qxp.constant.Type.STRING,
                    allowNull:false, defaultValue:"Verdana,Arial,sans-serif" });

/** The font weight to use for the text (CSS syntax). */
qxp.OO.addProperty({ name:"fontWeight", type:qxp.constant.Type.STRING,
                    allowNull:false, defaultValue:"bold" });

/** An adjustment in pixels that is added when centering text vertically. */
qxp.OO.addProperty({ name:"verticalAdjustment", type:qxp.constant.Type.NUMBER,
                    allowNull:false, defaultValue:-1 });
