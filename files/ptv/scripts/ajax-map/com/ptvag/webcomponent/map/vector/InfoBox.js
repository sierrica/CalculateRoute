/**
 * An info box.
 * <p>
 * Sample code: {@sample Displaying text},
 *              {@sample Client-side POIs}
 * 
 * @param   x {double,4355664}  the x coordinate of the box (in smart units).
 * @param   y {double,5464867}  the y coordinate of the box (in smart units).
 * @param   text {string,""}    the box contents (as HTML).
 * @param   alignment {int,66}  the alignment of the box relative to the x
 *                              and y coordinates (see the constants in the
 *                              {@link com.ptvag.webcomponent.map.layer.VectorLayer}
 *                              class). Currently, the alignment is ignored
 *                              (and the box is styled in a way that doesn't
 *                              make custom alignment sensible).
 * @param   priority {int,0}    the drawing priority.
 * @param   id {var,null}       the id of the element.
 * @param   isPositionFlexible {boolean,false} Whether the position is
 *                              flexible. Flexible elements will displace
 *                              each other when they are close to another.
 */
qxp.OO.defineClass("com.ptvag.webcomponent.map.vector.InfoBox",
                  com.ptvag.webcomponent.map.vector.VectorElement,
function(x, y, text, alignment, priority, id, isPositionFlexible) {
    com.ptvag.webcomponent.map.vector.VectorElement.call(this, priority, id, isPositionFlexible);

    var self = this;
    var map = com.ptvag.webcomponent.map;
    
    var mInfoBoxElement = null;
    var mInfoBoxElementCreator = null;


    /**
     * The handler function for the close widget.
     */
    var closeWidgetHandler = function() {
        var customHandler = self.getCloseWidgetHandler();
        if (customHandler == null) {
            self.getVectorLayer().removeElement(self.getId());
        } else {
            customHandler(self);
        }
    };


    /**
     * Positions the box.
     */
    var positionBox = function() {
        if (mInfoBoxElement != null) {
            mInfoBoxElementCreator.positionInfoBoxElement(mInfoBoxElement,
                self.getRealX(), self.getRealY());
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
        realX = coords.x + self.getOffsetX();
        realY = coords.y + self.getOffsetY();
        self.setRealX(realX);
        self.setRealY(realY);
        if (mInfoBoxElement == null) {
            mInfoBoxElementCreator = self.getInfoBoxElementFactory();
            if (mInfoBoxElementCreator == null) {
                mInfoBoxElementCreator =
                    com.ptvag.webcomponent.map.vector.InfoBoxElementFactory;
            }
            mInfoBoxElement = mInfoBoxElementCreator.createInfoBoxElement(
                realX, realY,
                { text:self.getText(), background:self.getBackground() },
                topLevelContainer, true, null, self.getAllowWrap());
            if (self.getShowCloseWidget()) {
                mInfoBoxElementCreator.activateCloseWidget(mInfoBoxElement, closeWidgetHandler);
            }
            mInfoBoxElement.style.zIndex = 2000000000 + self.getPriority();
        } else {
            positionBox();
        }
    };


    // overridden
    self.clear = function() {
        if (mInfoBoxElement != null) {
            mInfoBoxElementCreator.destroyInfoBoxElement(mInfoBoxElement);
            mInfoBoxElement = null;
            mInfoBoxElementCreator = null;
        }
    };
    

    if (x != null) {
        self.setX(x);
    }
    if (y != null) {
        self.setY(y);
    }
    if (text != null) {
        self.setText(text);
    }
    if (alignment != null) {
        self.setAlignment(alignment);
    }
    
    self.refreshOn("x", "y", "offsetX", "offsetY", "text", "alignment",
                   "showCloseWidget", "infoBoxElementFactory", "background");
});


/** The x coordinate of the box (in smart units). */
qxp.OO.addProperty({ name:"x", type:qxp.constant.Type.NUMBER, allowNull:false, defaultValue:4355664 });
/** The y coordinate of the box (in smart units). */
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
 * Contains the x position in pixels after the box has been drawn.
 */
qxp.OO.addProperty({ name:"realX", type:qxp.constant.Type.NUMBER, allowNull:false });

/**
 * Contains the y position in pixels after the box has been drawn.
 */
qxp.OO.addProperty({ name:"realY", type:qxp.constant.Type.NUMBER, allowNull:false });

/** The contents of the info box (as HTML). */
qxp.OO.addProperty({ name:"text", type:qxp.constant.Type.STRING, allowNull:false, defaultValue:"" });

/**
 * The alignment of the box relative to the x and y coordinates (see the
 * constants in the {@link com.ptvag.webcomponent.map.layer.VectorLayer}
 * class). Currently, the alignment is ignored (and the box is styled in a way
 * that doesn't make custom alignment sensible).
 */
qxp.OO.addProperty({ name:"alignment", type:qxp.constant.Type.NUMBER, allowNull:false, defaultValue:66 });

/** Whether to show the close widget of the info box. */
qxp.OO.addProperty({ name:"showCloseWidget", type:qxp.constant.Type.BOOLEAN, allowNull:false, defaultValue:false });

/**
 * Allows you to specify your own handler that is called when the user clicks
 * the close widget. If <code>null</code>, a default handler is used that
 * removes the info box from the vector layer. Please note that the default
 * handler is not automatically called when you specifiy your own handler! In
 * this case, you have to remove the info box from the vector layer yourself.
 * <p>
 * The handler is called with the info box instance as its only parameter.
 * </p>
 */
qxp.OO.addProperty({ name:"closeWidgetHandler", type:qxp.constant.Type.FUNCTION, allowNull:true, defaultValue:null });

/**
 * The factory that should be used to create the DOM element for the info box.
 * If <code>null</code>, the system wide default will be used (which can set
 * by changing com.ptvag.webcomponent.map.vector.InfoBoxElementFactory).
 */
qxp.OO.addProperty({ name:"infoBoxElementFactory",
                    type:qxp.constant.Type.OBJECT,
                    allowNull:true,
                    defaultValue:null });

/**
 * The desired background color of the box (as a valid CSS color value).
 * This color is visible in the padding area around the actual content. The
 * amount of padding can be specified by calling
 * <code>InfoBoxElementFactory.setPaddingLeft(newValue)</code> (similarly for
 * right, top, and bottom padding).
 */
qxp.OO.addProperty({ name:"background", type:qxp.constant.Type.STRING, allowNull:false, defaultValue:"#ffffff" });

/**
 * Whether the tooltips content should be allowed to wrap. If
 * <code>null</code>, this is determined by the global
 * {@link InfoBoxElementFactoryDefault#allowWrap allowWrap} property.
 */
qxp.OO.addProperty({ name:"allowWrap", type:qxp.constant.Type.BOOLEAN });
