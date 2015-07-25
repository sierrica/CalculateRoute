/**
 * A piece of HTML that should be shown at a specified position on the map.
 * <p>
 * Sample code: {@sample Clickable images}
 * 
 * @param   x {double,4355664}  the x coordinate in smart units.
 * @param   y {double,5464867}  the y coordinate in smart units.
 * @param   alignment {int,66}  the alignment of the HTML relative to the x
 *                              and y coordinates (see the constants in the
 *                              {@link com.ptvag.webcomponent.map.layer.VectorLayer}
 *                              class).
 * @param   html {string,""}    the HTML to show.
 * @param   priority {int,0}    the drawing priority.
 * @param   id {var,null}       the id of the element.
 * @param   isPositionFlexible {boolean,false} Whether the position is
 *                              flexible. Flexible elements will displace
 *                              each other when they are close to another.
 */
qxp.OO.defineClass("com.ptvag.webcomponent.map.vector.HTML",
                  com.ptvag.webcomponent.map.vector.VectorElement,
function(x, y, alignment, html, priority, id, isPositionFlexible) {
    com.ptvag.webcomponent.map.vector.VectorElement.call(this, priority, id, isPositionFlexible);

    var self = this;
    var map = com.ptvag.webcomponent.map;
    
    var mElement = null;
    var mWidth = null;
    var mHeight = null;
    var mNoRefresh = false;
    var mNoClearOnRefresh = false;
    


    /**
     * Updates some properties of the element all at once. This can be used for
     * flicker-free updates. Simply pass <code>null</code> for the properties
     * that you don't want to change.
     *
     * @param   x {double,null}     the x coordinate in smart units.
     * @param   y {double,null}     the y coordinate in smart units.
     * @param   alignment {int,null}    the alignment of the HTML relative to
     *                                  the x and y coordinates (see the
     *                                  constants in the
     *                                  {@link com.ptvag.webcomponent.map.layer.VectorLayer}
     *                                  class).
     * @param   html {string,null}  the HTML to show.
     */
    self.updateProperties = function(x, y, alignment, html) {
        mNoRefresh = true;
        if (x != null) {
            self.setX(x);
        }
        if (y != null) {
            self.setY(y);
        }
        if (alignment != null) {
            self.setAlignment(alignment);
        }
        if (html != null) {
            self.setHtml(html);
        }
        mNoRefresh = false;
        if (mElement != null) {
            mElement.innerHTML = self.getHtml();
            mWidth = mElement.offsetWidth;
            mHeight = mElement.offsetHeight;
            mNoClearOnRefresh = true;
            self.refresh();
            mNoClearOnRefresh = false;
        }
    };


    /**
     * Positions the element.
     */
    var positionElement = function() {
        if (mElement != null && mWidth != null && mHeight != null) {
            var realX = self.getRealX();
            var realY = self.getRealY();
            if (realX != null && realY != null) {
                var alignment = self.getAlignment();
                if (alignment & map.layer.VectorLayer.ALIGN_MID_HORIZ) {
                    mElement.style.left = Math.round(realX - (mWidth / 2)) + "px";
                } else if (alignment & map.layer.VectorLayer.ALIGN_RIGHT) {
                    mElement.style.left = Math.round(realX - mWidth) + "px";
                } else {
                    mElement.style.left = Math.round(realX) + "px";
                }
                if (alignment & map.layer.VectorLayer.ALIGN_MID_VERT) {
                    mElement.style.top = Math.round(realY - (mHeight / 2)) + "px";
                } else if (alignment & map.layer.VectorLayer.ALIGN_BOTTOM) {
                    mElement.style.top = Math.round(realY - mHeight) + "px";
                } else {
                    mElement.style.top = Math.round(realY) + "px";
                }
            }
        }
    };
    
    
    // overridden
    self.usesCanvas = function() {
        return false;
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
        if (mElement == null) {
            mElement = document.createElement("div");
            mElement.style.position = "absolute";
            mElement.style.visibility = "hidden";
            mElement.innerHTML = self.getHtml();
            if (self.getTopLevel()) {
                mElement._ignoreMouseDown = true;
                mElement._ignoreMouseUp = true;
                mElement._allowSelection = true;
                mElement._ignoreMouseWheel = self.getAllowMouseWheel();
                mElement.style.zIndex = 2000000000 + self.getPriority();
                topLevelContainer.appendChild(mElement);
            } else {
                mElement.style.zIndex = -2000000000 + self.getPriority();
                container.appendChild(mElement);
            }
            mWidth = mElement.offsetWidth;
            mHeight = mElement.offsetHeight;
            positionElement();
            mElement.style.visibility = "visible";
        } else {
            positionElement();
        }
    };
    

    // overridden
    self.clear = function(inDispose) {
        if (mElement != null) {
            if (!inDispose) {
                mElement.parentNode.removeChild(mElement);
            }
            mElement = null;
        }
    };
    

    // overridden
    self.refresh = function() {
        if (mNoRefresh) {
            return;
        }
        var vectorLayer = self.getVectorLayer();
        if (vectorLayer) {
            if (!mNoClearOnRefresh) {
                self.clear();
            }
            vectorLayer.onViewChanged();
        }
    };


    self.updateProperties(x, y, alignment, html);
    
    self.refreshOn("x", "y", "offsetX", "offsetY", "alignment", "html",
                   "topLevel", "allowMouseWheel");
});


/** The x coordinate of the HTML element (in smart units). */
qxp.OO.addProperty({ name:"x", type:qxp.constant.Type.NUMBER, allowNull:false, defaultValue:4355664 });
/** The y coordinate of the HTML element (in smart units). */
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
 * The alignment of the HTML relative to the x and y coordinates (see the
 * constants in the {@link com.ptvag.webcomponent.map.layer.VectorLayer}
 * class).
 */
qxp.OO.addProperty({ name:"alignment", type:qxp.constant.Type.NUMBER, allowNull:false, defaultValue:66 });

/** The HTML to display. */
qxp.OO.addProperty({ name:"html", type:qxp.constant.Type.STRING, allowNull:false, defaultValue:"" });

/**
 * Whether the HTML should be visible at the top level (which is necessary to
 * make links work).
 */
qxp.OO.addProperty({ name:"topLevel", type:qxp.constant.Type.BOOLEAN, allowNull:false, defaultValue:false });

/**
 * Whether the mouse wheel should scroll inside the HTML instead of changing
 * the map zoom. This property is only relevant if {@link #topLevel} is
 * <code>true</code> (otherwise, the mouse wheel is always used for zooming the
 * map).
 */
qxp.OO.addProperty({ name:"allowMouseWheel", type:qxp.constant.Type.BOOLEAN, allowNull:false, defaultValue:false });
