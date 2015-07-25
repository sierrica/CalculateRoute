/**
 * A layer that contains an area that stays at a static position. For example,
 * the scale layer stays in the bottom-right corner of the map, even when the
 * visible size of the map changes.
 * <p>
 * The location of the area is defined by the properties {@link #areaWidth},
 * {@link #areaHeight}, {@link #areaLeft}, {@link #areaRight}, {@link #areaTop},
 * {@link #areaBottom}. Not all of these properties have to be set. One of
 * left, right and width and one of top, bottom and height may remain unset.
 * <p>
 * Sample code: {@sample Custom UI layers}
 */
qxp.OO.defineClass("com.ptvag.webcomponent.map.layer.AbstractStaticAreaLayer", com.ptvag.webcomponent.map.layer.Layer,
function() {
    com.ptvag.webcomponent.map.layer.Layer.call(this);

    var self = this;

    var map = com.ptvag.webcomponent.map;

    var mAppliedRotationAngle = 0;


    // property modifier
    self._modifyAreaElement = function() {
        updateView({}, true);
        self._modifyAreaOpacity(self.getAreaOpacity());
    };


    // property modifier
    self._modifyComputedAreaLeft = function(propValue) {
        if (self.needsOpacityHack()) {
            self.getAreaElement().style.left = propValue + map.Map.OPACITY_HACK_SIZE/2 + "px";
        } else {
            self.getParentElement().style.left = propValue + "px";
        }
    };


    // property modifier
    self._modifyComputedAreaTop = function(propValue) {
        if (self.needsOpacityHack()) {
            self.getAreaElement().style.top = propValue + map.Map.OPACITY_HACK_SIZE/2 + "px";
        } else {
            self.getParentElement().style.top = propValue + "px";
        }
    };


    // property modifier
    self._modifyComputedAreaWidth = function(propValue) {
        var width = map.MapUtil.isBorderBoxSizingActive() ? propValue : propValue - 2 * self.getAreaBorderWidth();
        if (self.getParentElement() != self.getAreaElement() && !self.needsOpacityHack()) {
            self.getParentElement().style.width = propValue + "px";
        }
        self.getAreaElement().style.width = width + "px";
    };


    // property modifier
    self._modifyComputedAreaHeight = function(propValue) {
        var height = map.MapUtil.isBorderBoxSizingActive() ? propValue : propValue - 2 * self.getAreaBorderWidth();
        if (self.getParentElement() != self.getAreaElement() && !self.needsOpacityHack()) {
            self.getParentElement().style.height = propValue + "px";
        }
        self.getAreaElement().style.height = height + "px";
    };


    // property modifier
    self._modifyAreaOpacity = function(propValue) {
        if (self.needsOpacityHack()) {
            var parentElement = self.getParentElement();
            if (parentElement) {
                map.MapUtil.setElementOpacity(parentElement, propValue);
            }
        } else {
            var areaElement = self.getAreaElement();
            if (areaElement) {
                map.MapUtil.setElementOpacity(areaElement, propValue);
            }
        }
    };


    var updateView = function(evt, forcePositionUpdate) {
        var areaElement = self.getAreaElement();
        if (areaElement == null) {
            return;
        }
        var oldRotationAngle = mAppliedRotationAngle;
        mAppliedRotationAngle =
            (self.getAutoRotate() ? self.getMap().getVisibleRotation() : 0);
        var needRotationResize = (oldRotationAngle != mAppliedRotationAngle &&
            (oldRotationAngle == 0 || mAppliedRotationAngle == 0));
        var newPosition = false;
        if ((evt.widthChanged || evt.heightChanged) &&
            (self.getAreaRight() != null || self.getAreaBottom() != null ||
             self.getAreaWidthIsRelative() ||
             self.getAreaHeightIsRelative()) ||
            needRotationResize || forcePositionUpdate) {
            self.positionArea();
            newPosition = true;
        }
        if (newPosition || oldRotationAngle != mAppliedRotationAngle) {
            if (oldRotationAngle != mAppliedRotationAngle &&
                mAppliedRotationAngle == 0) {
                map.MapUtil.resetAffineTransform(areaElement);
            } else if (mAppliedRotationAngle != 0) {
                var matrix =
                    map.MapUtil.createRotationMatrix(mAppliedRotationAngle,
                        self.getComputedAreaWidth()/2,
                        self.getComputedAreaHeight()/2);
                map.MapUtil.setAffineTransform(areaElement, matrix);
            }
        }
    };


    // overridden
    var superOnViewChanged = self.onViewChanged;
    self.onViewChanged = function(evt) {
        superOnViewChanged.apply(self, arguments);
        updateView(evt);
    };


    // property modifiers
    var areaModifier = function() { updateView({}, true); };
    self._modifyAreaLeft = areaModifier;
    self._modifyAreaRight = areaModifier;
    self._modifyAreaTop = areaModifier;
    self._modifyAreaBottom = areaModifier;
    self._modifyAreaWidth = areaModifier;
    self._modifyAreaHeight = areaModifier;
    
    
    // property modifier
    self._modifyAutoRotate = function() {
        if (self.getAreaElement() != null) {
            self.onViewChanged({rotationChanged:true});
        }
    };


    /**
     * (Re)positions the area. Normally you don't have to call this method. It
     * will be called automatically when the map is resized of when the area
     * was moved.
     */
    self.positionArea = function() {
        if (self.getAreaElement() == null) {
            return; // nothing to do
        }
        var mapWidth  = self.getMap().getWidth();
        var mapHeight = self.getMap().getHeight();

        var areaElem   = self.getAreaElement();
        var areaLeft   = self.getAreaLeft();
        var areaRight  = self.getAreaRight();
        var areaTop    = self.getAreaTop();
        var areaBottom = self.getAreaBottom();

        var areaWidth  = (areaLeft != null && areaRight != null)
            ? (mapWidth  - areaLeft - areaRight)
            : (self.getAreaWidthIsRelative() ? parseInt(self.getAreaWidth() * mapWidth) : self.getAreaWidth());
        var areaHeight = (areaTop != null && areaBottom != null)
            ? (mapHeight - areaTop - areaBottom)
            : (self.getAreaHeightIsRelative() ? parseInt(self.getAreaHeight() * mapHeight) : self.getAreaHeight());

        if (areaLeft == null) {
            areaLeft = mapWidth - areaWidth - areaRight;
        }
        if (areaTop == null) {
            areaTop = mapHeight - areaHeight - areaBottom;
        }

        if (mAppliedRotationAngle != 0) {
            var max = Math.max(areaWidth, areaHeight);
            var min = Math.min(areaWidth, areaHeight);
            var sizeNeeded = (max*max + min*min)/max;
            var paddingX = Math.ceil((sizeNeeded - areaWidth)/2);
            var paddingY = Math.ceil((sizeNeeded - areaHeight)/2);
            areaLeft -= paddingX;
            areaTop -= paddingY;
            areaWidth += paddingX*2;
            areaHeight += paddingY*2;
        }

        self.setComputedAreaLeft(areaLeft);
        self.setComputedAreaTop(areaTop);
        self.setComputedAreaWidth(areaWidth);
        self.setComputedAreaHeight(areaHeight);
    };


    /**
     * Returns whether a relativ position is in the area.
     *
     * @param x {int} the x position in pixels relative to the left border of
     *        the map.
     * @param y {int} the y position in pixels relative to the top border of
     *        the map.
     * @return {boolean} whether the position is over the area.
     */
    self.isPositionInArea = function(x, y) {
        var left = self.getComputedAreaLeft();
        var top  = self.getComputedAreaTop();
        return (x >= left && y >= top && x < left + self.getComputedAreaWidth() &&
            y < top + self.getComputedAreaHeight());
    };


    // overridden
    self.onMouseMove = function(evt) {
        if (self.getUseBlending()) {
            var left   = self.getComputedAreaLeft();
            var top    = self.getComputedAreaTop();
            var width  = self.getComputedAreaWidth();
            var height = self.getComputedAreaHeight();
            var blendingWidth = self.getBlendingWidth();
    
            if (self.isNoLayerActive() && evt.relMouseX >= left - blendingWidth
                && evt.relMouseX <= left + width + blendingWidth
                && evt.relMouseY >= top - blendingWidth
                && evt.relMouseY <= top + height + blendingWidth)
            {
                var mapWidth  = self.getMap().getWidth();
                var mapHeight = self.getMap().getHeight();

                // Calculate the x blend factor
                var blendFactorX = 1;
                if (evt.relMouseX < left) {
                    // The mouse is left of the toolbar
                    blendFactorX = 1 - (left - evt.relMouseX) / Math.min(left, blendingWidth);
                } else if (evt.relMouseX > left + width) {
                    // The mouse is right of the toolbar
                    var right  = mapWidth - left - width;
                    blendFactorX = 1 - (evt.relMouseX - left - width) / Math.min(right, blendingWidth);
                }

                // Calculate the y blend factor
                var blendFactorY = 1;
                if (evt.relMouseY < top) {
                    // The mouse is over the toolbar
                    blendFactorY = 1 - (top - evt.relMouseY) / Math.min(top, blendingWidth);
                } else if (evt.relMouseY > top + height) {
                    // The mouse is below the toolbar
                    var bottom = mapHeight - top - height;
                    blendFactorY = 1 - (evt.relMouseY - top - height) / Math.min(bottom, blendingWidth);
                }

                var blendFactor = Math.min(blendFactorX, blendFactorY);
                var transOut  = self.getBlendingOpacityOut();
                var transOver = self.getBlendingOpacityOver();
                self.setAreaOpacity(transOut + (transOver - transOut) * blendFactor);
            } else {
                self.setAreaOpacity(self.getBlendingOpacityOut());
            }
        }

        return false;
    };


    // overridden
    self.onMouseOut = function(evt) {
        if (self.getUseBlending()) {
            self.setAreaOpacity(self.getBlendingOpacityOut());
        }

        return false;
    }


    // overridden
    self.onMouseHover = function(evt) {
        // Only swallow if the mouse is over the area
        return self.getSwallowHoverEvents() && self.isPositionInArea(evt.relMouseX, evt.relMouseY);
    };


    // overridden
    self.onMouseClick = function(evt) {
        // Only swallow if the mouse is over the area
        return self.getSwallowClickEvents() && self.isPositionInArea(evt.relMouseX, evt.relMouseY);
    };


    // overridden
    self.onRightMouseClick = function(evt) {
        // Only swallow if the mouse is over the area
        return self.getSwallowClickEvents() && self.isPositionInArea(evt.relMouseX, evt.relMouseY);
    };


    // overridden
    self.onMouseDblClick = function(evt) {
        // Note: Always swallow by default (for easy and consistent UI layer
        // handling).
        return self.isPositionInArea(evt.relMouseX, evt.relMouseY);
    };


    // overridden
    self.doPrint = function(ctx, htmlContainer, htmlBackground) {
        ctx.setClipRect(self.getComputedAreaLeft(), self.getComputedAreaTop(),
            self.getComputedAreaWidth(), self.getComputedAreaHeight());
        ctx.globalAlpha = self.getAreaOpacity();
        if (self.getAutoRotate()) {
            var rotationAngle = self.getMap().getVisibleRotation();
            var matrix = map.MapUtil.createRotationMatrix(rotationAngle,
                self.getComputedAreaWidth()/2 + self.getComputedAreaLeft(),
                self.getComputedAreaHeight()/2 + self.getComputedAreaTop());
            ctx.save();
            ctx.setTransform(matrix.a, matrix.b, matrix.c, matrix.d,
                             matrix.tx, matrix.ty);
        }
        self.doPrintStaticArea(ctx, htmlContainer, htmlBackground);
        if (self.getAutoRotate()) {
            ctx.restore();
        }
        ctx.globalAlpha = 1;
        ctx.clearClipRect();
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
    self.doPrintStaticArea = function(ctx, htmlContainer, htmlBackground) {
        // nothing to see here, move along
    };


    // overridden
    var superDispose = self.dispose;
    self.dispose = function() {
        if (self.getDisposed()) {
            return;
        }

        self.forceAreaElement(null);

        superDispose.call(self);
    };

});


/** The main element of the area. */
qxp.OO.addProperty({ name:"areaElement", type:qxp.constant.Type.OBJECT });

/** The width of the areaElement's border. */
qxp.OO.addProperty({ name:"areaBorderWidth", type:qxp.constant.Type.NUMBER, defaultValue:0 });

/**
 * The width of the area in pixels or percent, depending on
 * {@link #areaWidthIsRelative}. If not set the area is positioned between left
 * and right.
 */
qxp.OO.addProperty({ name:"areaWidth", type:qxp.constant.Type.NUMBER });

/** Whether {@link #areaWidth} is relative to the width of the map. */
qxp.OO.addProperty({ name:"areaWidthIsRelative", type:qxp.constant.Type.BOOLEAN, defaultValue:false, allowNull:false });

/**
 * The height of the area in pixels or percent, depending on
 * {@link #areaHeightIsRelative}. If not set the area is positioned between top
 * and bottom.
 */
qxp.OO.addProperty({ name:"areaHeight", type:qxp.constant.Type.NUMBER });

/** Whether {@link #areaHeight} is relative to the height of the map. */
qxp.OO.addProperty({ name:"areaHeightIsRelative", type:qxp.constant.Type.BOOLEAN, defaultValue:false, allowNull:false });

/**
 * The area's distance from the left side of the map in pixels.
 * If not set the area is positioned relative to the right side.
 */
qxp.OO.addProperty({ name:"areaLeft", type:qxp.constant.Type.NUMBER });

/**
 * The area's distance from the right side of the map in pixels.
 * If not set the area is positioned relative to the left side.
 */
qxp.OO.addProperty({ name:"areaRight", type:qxp.constant.Type.NUMBER });

/**
 * The area's distance from the top of the map in pixels.
 * If not set the area is positioned relative to the bottom.
 */
qxp.OO.addProperty({ name:"areaTop", type:qxp.constant.Type.NUMBER });

/**
 * The area's distance from the bottom of the map in pixels.
 * If not set the area is positioned relative to the top.
 */
qxp.OO.addProperty({ name:"areaBottom", type:qxp.constant.Type.NUMBER });

/** The computed distance of the area to the left side in pixels. */
qxp.OO.addProperty({ name:"computedAreaLeft", type:qxp.constant.Type.NUMBER });

/** The computed distance of the area to the top in pixels. */
qxp.OO.addProperty({ name:"computedAreaTop", type:qxp.constant.Type.NUMBER });

/** The computed width of the area in pixels. */
qxp.OO.addProperty({ name:"computedAreaWidth", type:qxp.constant.Type.NUMBER });

/** The computed height of the area in pixels. */
qxp.OO.addProperty({ name:"computedAreaHeight", type:qxp.constant.Type.NUMBER });

/** Specifies whether blending should be used when the mouse get near to the area. */
qxp.OO.addProperty({ name:"useBlending", type:qxp.constant.Type.BOOLEAN, defaultValue:false });

/**
 * The width of the blending area around the area. Within the blending area the
 * area get more opaque when the mouse gets nearer.
 */
qxp.OO.addProperty({ name:"blendingWidth", type:qxp.constant.Type.NUMBER, defaultValue:25 });

/** The area's opacity when the mouse is over the area. */
qxp.OO.addProperty({ name:"blendingOpacityOver", type:qxp.constant.Type.NUMBER, defaultValue:0.8 });

/** The area's opacity when the mouse is outside the blending area. */
qxp.OO.addProperty({ name:"blendingOpacityOut", type:qxp.constant.Type.NUMBER, defaultValue:0.3 });

/** The current opacity of the area. */
qxp.OO.addProperty({ name:"areaOpacity", type:qxp.constant.Type.NUMBER, defaultValue:0.3 });

/**
 * Whether this layer should automatically be rotated when the map rotation
 * changes.
 */
qxp.OO.addProperty({ name:"autoRotate", type:qxp.constant.Type.BOOLEAN, allowNull:false, defaultValue:false });
