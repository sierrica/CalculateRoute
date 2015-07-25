/**
 * A layer of the map.
 * <p>
 * Sample code: {@sample Custom UI layers}
 */
qxp.OO.defineClass("com.ptvag.webcomponent.map.layer.Layer", qxp.core.Target,
function() {
    qxp.core.Target.call(this);

    var self = this;
    var map = com.ptvag.webcomponent.map;
    
    var mInitialized = false;
    
    
    // property checker
    self._checkNeedsOpacityHack = function(propValue) {
        if (propValue && qxp.sys.Client.getInstance().isMshtml() &&
            !com.ptvag.webcomponent.map.Map.IE_FAST_OPACITY) {
            return true;
        }
        return false;
    };


    // property modifier
    self._modifyEnabled = function(propValue) {
        var parentElem = self.getParentElement();
        if (parentElem) {
            // NOTE: parentElem is null if enabled is changed before the layer
            //       was added.
            parentElem.style.display = propValue ? "" : "none";
        }

        if (propValue && self.isInitialized()) {
            self.onViewChanged({ zoomChanged:true, centerChanged:true, widthChanged:true, heightChanged:true }, true);
        }
    };


    // property modifier
    self._modifyParentElement = function(propValue) {
        if (propValue && !self.isEnabled()) {
            propValue.style.display = "none";
        }
    };


    /**
     * Initializes the layer. Called when all properties have been set.
     */
    self.init = function() {
        mInitialized = true;
    };


    /**
     * Returns whether the layer has been initialized.
     */
    self.isInitialized = function() {
        return mInitialized;
    };
    
    
    /**
     * Event handler. Will be called when zoom, center, width or height of the
     * map have changed.
     *
     * @param evt {Map} the event. Includes the properties zoomChanged,
     *      centerChanged, rotationChanged, widthChanged, heightChanged or
     *      clipRectChanged (true if the corresponding value changed, null
     *      otherwise).
     * @param immediately {boolean,false} whether updates should be performed
     *      immediately instead of queueing them (can be ignored by most
     *      layers).
     */
    self.onViewChanged = function(evt, immediately) {
    };


    /**
     * Event handler. Called on mouse down over the map.
     * <p>
     * The mouse event is enriched with the properties "relMouseX" and "relMouseY",
     * which hold the mouse position relative to the top-left corner of the map.
     *
     * @param evt {Map} The enriched mouse event.
     * @return {boolean} whether the propagation of this event should be stopped.
     *         If true is returned the event will not be fired to layers located
     *         under this layer.
     */
    self.onMouseDown = function(evt) {
        return false;
    };


    /**
     * Event handler. Called on mouse up over the map.
     * <p>
     * The mouse event is enriched with the properties "relMouseX" and "relMouseY",
     * which hold the mouse position relative to the top-left corner of the map.
     *
     * @param evt {Map} The enriched mouse event.
     * @return {boolean} whether the propagation of this event should be stopped.
     *         If true is returned the event will not be fired to layers located
     *         under this layer.
     */
    self.onMouseUp = function(evt) {
        return false;
    };


    /**
     * Event handler. Called on mouse click over the map.
     * <p>
     * The mouse event is enriched with the properties "relMouseX" and "relMouseY",
     * which hold the mouse position relative to the top-left corner of the map.
     *
     * @param evt {Map} The enriched mouse event.
     * @return {boolean} whether the propagation of this event should be stopped.
     *         If true is returned the event will not be fired to layers located
     *         under this layer.
     */
    self.onMouseClick = function(evt) {
        return self.getSwallowClickEvents();
    };


    /**
     * Event handler. Called on right mouse click over the map.
     * <p>
     * The mouse event is enriched with the properties "relMouseX" and "relMouseY",
     * which hold the mouse position relative to the top-left corner of the map.
     *
     * @param evt {Map} The enriched mouse event.
     * @return {boolean} whether the propagation of this event should be stopped.
     *         If true is returned the event will not be fired to layers located
     *         under this layer.
     */
    self.onRightMouseClick = function(evt) {
        return self.getSwallowClickEvents();
    };


    /**
     * Event handler. Called on double click over the map.
     * <p>
     * The mouse event is enriched with the properties "relMouseX" and "relMouseY",
     * which hold the mouse position relative to the top-left corner of the map.
     *
     * @param evt {Map} The enriched mouse event.
     * @return {boolean} whether the propagation of this event should be stopped.
     *         If true is returned the event will not be fired to layers located
     *         under this layer.
     */
    self.onMouseDblClick = function(evt) {
        return false;
    };


    /**
     * Event handler. Called on double right click over the map.
     * <p>
     * The mouse event is enriched with the properties "relMouseX" and
     * "relMouseY" which contain the mouse position relative to the top-left
     * corner of the map.
     * </p>
     *
     * @param evt {Map} The enriched mouse event.
     * @return {boolean} whether the propagation of this event should be
     *                   stopped. If true is returned the event will not be
     *                   fired to layers located under this layer.
     */
    self.onRightMouseDblClick = function(evt) {
        return false;
    };


    /**
     * Event handler. Called when the mouse was moved over the map.
     * <p>
     * The mouse event is enriched with the properties "relMouseX" and "relMouseY",
     * which hold the mouse position relative to the top-left corner of the map.
     *
     * @param evt {Map} The enriched mouse event.
     * @return {boolean} whether the propagation of this event should be stopped.
     *         If true is returned the event will not be fired to layers located
     *         under this layer.
     */
    self.onMouseMove = function(evt) {
        return false;
    };


    /**
     * Event handler. Called when the mouse moved outside the map.
     * <p>
     * The mouse event is enriched with the properties "relMouseX" and "relMouseY",
     * which hold the mouse position relative to the top-left corner of the map.
     *
     * @param evt {Map} The enriched mouse event.
     * @return {boolean} whether the propagation of this event should be stopped.
     *         If true is returned the event will not be fired to layers located
     *         under this layer.
     */
    self.onMouseOut = function(evt) {
        return false;
    };


    /**
     * Event handler. Called when the mouse wheel was used.
     * <p>
     * The mouse event is enriched with the property "wheelTicks", which holds
     * the number of wheel ticks the user did.
     *
     * @param evt {Map} The enriched mouse event.
     * @return {boolean} whether the propagation of this event should be stopped.
     *         If true is returned the event will not be fired to layers located
     *         under this layer.
     */
    self.onMouseWheel = function(evt) {
        return false;
    };


    /**
     * Event handler. Called when the mouse is hovered (= kept in the same
     * place) over the map for some time.
     * <p>
     * The mouse event is enriched with the properties "relMouseX" and "relMouseY",
     * which hold the mouse position relative to the top-left corner of the map.
     * </p>
     *
     * @param evt {Map} the enriched mouse event.
     * @return {boolean} whether the propagation of this event should be stopped.
     *         If true is returned the event will not be fired to layers located
     *         under this layer.
     */
    self.onMouseHover = function(evt) {
        return self.getSwallowHoverEvents();
    };


    /**
     * Event handler. Called when key was pressed.
     *
     * @param evt {Map} the key event.
     * @return {boolean} whether the propagation of this event should be stopped.
     *         If true is returned the event will not be fired to layers located
     *         under this layer.
     */
    self.onKeyDown = function(evt) {
        return false;
    };


    /**
     * Event handler. Called when a selection should start (IE only).
     * <p>
     * The mouse event is enriched with the properties "relMouseX" and "relMouseY",
     * which hold the mouse position relative to the top-left corner of the map.
     * </p>
     *
     * @param evt {Map} The enriched mouse event.
     * @return {boolean} whether selection should be allowed.
     *         If true is returned, selection is allowed and the event will not
     *         be fired to layers located beneath this layer.
     */
    self.onSelectStart = function(evt) {
        return false;
    };


    /**
     * Returns whether there is no active layer
     * (whether the map is currently in no special mouse mode).
     *
     * @return whether there is no active layer.
     * @see MapController#activeLayer
     */
    self.isNoLayerActive = function() {
        return self.getMap().getController().getActiveLayer() == null;
    };
    
    
    /**
     * Creates a print version of this layer.
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
    self.print = function(ctx, htmlContainer, htmlBackground) {
        if (self.getIncludeInPrint() && self.isEnabled() && self.isInitialized()) {
            //map.MapUtil.printLayer(self, ctx, htmlContainer, htmlBackground);
            self.doPrint(ctx, htmlContainer, htmlBackground);
        }
    };


    /**
     * Called when the layer should really be printed. At this point, it has
     * been checked that the layer should be included in the print version,
     * that it's enabled, and that it's initialized. This method is intended to
     * be overridden in sub classes and should not be called from outside! The
     * default implementation does nothing.
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
    self.doPrint = function(ctx, htmlContainer, htmlBackground) {
        // do nothing by default
    };
});


/** The name of this layer. */
qxp.OO.addProperty({ name:"name", type:qxp.constant.Type.STRING, allowNull:true });

/** The map this layer belongs to. */
qxp.OO.addProperty({ name:"map", type:qxp.constant.Type.OBJECT, allowNull:false });

/** The parent element this layer should render itself in. */
qxp.OO.addProperty({ name:"parentElement", type:qxp.constant.Type.OBJECT, allowNull:false });

/** Whether the layer is enabled */
qxp.OO.addProperty({ name:"enabled", type:qxp.constant.Type.BOOLEAN, allowNull:false, defaultValue:true, getAlias:"isEnabled" });

/**
 * Whether hover events should be swallowed (to prevent them from getting to
 * lower layers).
 */
qxp.OO.addProperty({ name:"swallowHoverEvents", type:qxp.constant.Type.BOOLEAN, defaultValue:false });

/**
 * Whether click events should be swallowed (to prevent them from getting to
 * lower layers).
 */
qxp.OO.addProperty({ name:"swallowClickEvents", type:qxp.constant.Type.BOOLEAN, defaultValue:false });

/** Used internally for grouping layers (to avoid flicker effects). */
qxp.OO.addProperty({ name:"isRelative", type:qxp.constant.Type.BOOLEAN, defaultValue:false, getAlias:"isRelative" });

/**
 * Whether this layers needs a special hack to make it semi-transparent in IE.
 * Usually, you shouldn't need to change this value.
 */
qxp.OO.addProperty({ name:"needsOpacityHack", type:qxp.constant.Type.BOOLEAN, defaultValue:false, getAlias:"needsOpacityHack" });

/** Whether this layer should show up when the map is printed. */
qxp.OO.addProperty({ name:"includeInPrint", type:qxp.constant.Type.BOOLEAN, allowNull:false, defaultValue:false });
