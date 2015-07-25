/**
 * A controller that handles user input on the map and dispatches it to the
 * individual layers.
 *
 * @param targetMap {com.ptvag.webcomponent.map.Map} The map to control.
 * @param mainElement {Element} The main element of the map. Used for adding
 *        mouse and key handlers.
 * @param initEvents {boolean, true} whether to initialize event handling
 *        immediately. If <code>false</code>, you have to call
 *        {@link #initEvents()} later.
 */
qxp.OO.defineClass("com.ptvag.webcomponent.map.MapController", qxp.core.Target,
function(targetMap, mainElement, initEvents) {
    qxp.core.Target.call(this);

    var self = this;
    var map = com.ptvag.webcomponent.map;

    var DomUtils   = com.ptvag.webcomponent.util.DomUtils;
    var EventUtils = com.ptvag.webcomponent.util.EventUtils;

    var mMap = targetMap;
    var mMainElement = mainElement;

    var mLastMouseX = mMap.getWidth() / 2;
    var mLastMouseY= mMap.getHeight() / 2;
    
    var mHoverTimeout = null;
    var mHoverEvent = null;
    
    var mIgnoreNextClick;
    var mRightClickTime = null;


    /**
     * Returns the relative position of the last (not the current) mouse event.
     *
     * @return {Map} the last mouse position. A map with the properties "x" and
     *         "y", containing the mouse position in pixels relative to the
     *         top-left corner of the map.
     */
    self.getLastMousePositon = function() {
        return { x:mLastMouseX, y:mLastMouseY };
    };


    /**
     * Hover timeout callback function.
     */
    
    var onHoverTimeout = function() {
        if (mHoverTimeout == null) {
            return;     // workaround for IE bug
        }
        mHoverTimeout = null;

        try {
            // inform the layers
            fireEventToLayers(mHoverEvent, "onMouseHover");
        } catch (exc) {
            self.error("handling mouse hover failed", exc);
        }
    };
    
    
    /**
     * Cancels the hover timeout.
     */
    
    var cancelHoverTimeout = function() {
        if (mHoverTimeout != null) {
            window.clearTimeout(mHoverTimeout);
            mHoverTimeout = null;
        }
    };
    
    
    /**
     * (Re)sets the hover timeout.
     */
    
    var setHoverTimeout = function() {
        if (mHoverTimeout != null) {
            window.clearTimeout(mHoverTimeout);
        }
        mHoverTimeout = window.setTimeout(onHoverTimeout,
                                          map.MapController.HOVER_TIMEOUT);
    };
    
    
    /**
     * Makes the controller ignore the next click.
     */
    self.ignoreNextClick = function() {
        mIgnoreNextClick = true;
    };
    
    
    /**
     * Event handler. Called on mouse down over the main element.
     *
     * @param evt {Map} the mouse event.
     */
    self.onComponentMouseDown = function(evt) {
        evt = EventUtils.getEvent(evt);
        
        cancelHoverTimeout();
        mIgnoreNextClick = false;
        map.MOUSE_BUTTON = EventUtils.getMouseButton(evt);
        
        var allowSelection = false;
        
        try {
            evt.relMouseX = EventUtils.getAbsoluteMouseX(evt) - DomUtils.getAbsoluteX(mMainElement);
            evt.relMouseY = EventUtils.getAbsoluteMouseY(evt) - DomUtils.getAbsoluteY(mMainElement);

            // Inform the layers
            fireEventToLayers(evt, "onMouseDown");
            var client = qxp.sys.Client.getInstance();
            if (client.isGecko() || client.isOpera() || client.isWebkit()) {
                // allow selection if the layers want it (emulates IE
                // behaviour)
                allowSelection = fireEventToLayers(evt, "onSelectStart");
            }

            mLastMouseX = evt.relMouseX;
            mLastMouseY = evt.relMouseY;
        } catch (exc) {
            self.error("handling mouse down failed", exc);
        }

        // Prevent image dragging
        if (evt.preventDefault && !allowSelection) {
            if (mMainElement.focus) {
                mMainElement.focus();
            }
            // necessary 
            evt.preventDefault();
        }
        return allowSelection;
    }


    /**
     * Event handler. Called on mouse up over the main element.
     *
     * @param evt {Map} the mouse event.
     */
    self.onComponentMouseUp = function(evt) {
        cancelHoverTimeout();

        try {
            evt = EventUtils.getEvent(evt);
            evt.relMouseX = EventUtils.getAbsoluteMouseX(evt) - DomUtils.getAbsoluteX(mMainElement);
            evt.relMouseY = EventUtils.getAbsoluteMouseY(evt) - DomUtils.getAbsoluteY(mMainElement);

            // Inform the layers
            if (fireEventToLayers(evt, "onMouseUp")) {
                mIgnoreNextClick = true;
            }
        } catch (exc) {
            self.error("handling mouse up failed", exc);
        }
        if (map.MOUSE_BUTTON == EventUtils.MOUSE_BUTTON_LEFT) {
            onComponentMouseClick(evt);
        } else if (map.MOUSE_BUTTON == EventUtils.MOUSE_BUTTON_RIGHT) {
            onComponentMouseRightClick(evt);
        }
        mIgnoreNextClick = false;
        
        if (qxp.sys.Client.getInstance().isMobileSafari()) {
            // workaround for iPhone/iPod Touch (sometimes the mousemove
            // event is not sent when the user taps - or at least, it doesn't
            // reach the controller)
            mLastMouseX = null;
            onComponentMouseMove(evt);
        }
    };


    /**
     * Pseudo-event handler for right clicks. The click is only sent to the
     * layers when the mouseUp event preceding it was not processed by a layer.
     * 
     * @param evt {Map} the mouse event.
     */
    var onComponentMouseRightClick = function(evt) {
        cancelHoverTimeout();   // FIXME: probably not necessary
        if (mIgnoreNextClick) {
            return;
        }
        try {
            evt = EventUtils.getEvent(evt);
            evt.relMouseX = EventUtils.getAbsoluteMouseX(evt) - DomUtils.getAbsoluteX(mMainElement);
            evt.relMouseY = EventUtils.getAbsoluteMouseY(evt) - DomUtils.getAbsoluteY(mMainElement);

            // Inform the layers
            fireEventToLayers(evt, "onRightMouseClick");
        } catch (exc) {
            self.error("handling right mouse click failed", exc);
        }
        var now = (new Date()).getTime();
        if (mRightClickTime == null) {
            mRightClickTime = now;
        } else {
            var diff = now - mRightClickTime;
            if (diff <= mMap.getDoubleRightClickDelay()) {
                mRightClickTime = null;
                onComponentMouseDblRightClick(evt);
            } else {
                mRightClickTime = now;
            }
        }
    };
    
    
    /**
     * Pseudo-event handler for double right clicks.
     * 
     * @param evt {Map} the mouse event.
     */
    var onComponentMouseDblRightClick = function(evt) {
        cancelHoverTimeout();   // FIXME: probably not necessary
        try {
            evt = EventUtils.getEvent(evt);
            evt.relMouseX = EventUtils.getAbsoluteMouseX(evt) - DomUtils.getAbsoluteX(mMainElement);
            evt.relMouseY = EventUtils.getAbsoluteMouseY(evt) - DomUtils.getAbsoluteY(mMainElement);

            // Inform the layers
            fireEventToLayers(evt, "onRightMouseDblClick");
        } catch (exc) {
            self.error("handling double right click failed", exc);
        }
    };


    /**
     * Event handler. Called on mouse click over the main element. The click is
     * only sent to the layers when the mouseUp event preceding it was not
     * processed by a layer.
     *
     * @param evt {Map} the mouse event.
     */
    var onComponentMouseClick = function(evt) {
        cancelHoverTimeout();
        if (mIgnoreNextClick) {
            return;
        }
        try {
            evt = EventUtils.getEvent(evt);
            evt.relMouseX = EventUtils.getAbsoluteMouseX(evt) - DomUtils.getAbsoluteX(mMainElement);
            evt.relMouseY = EventUtils.getAbsoluteMouseY(evt) - DomUtils.getAbsoluteY(mMainElement);

            // Inform the layers
            fireEventToLayers(evt, "onMouseClick");
        } catch (exc) {
            self.error("handling mouse click failed", exc);
        }
    };


    /**
     * Event handler. Called on mouse double click on the main element.
     *
     * @param evt {Map) the mouse event.
     */
    var onComponentMouseDblClick = function(evt) {
        evt = EventUtils.getEvent(evt);

        cancelHoverTimeout();
        try {
            evt.relMouseX = EventUtils.getAbsoluteMouseX(evt) - DomUtils.getAbsoluteX(mMainElement);
            evt.relMouseY = EventUtils.getAbsoluteMouseY(evt) - DomUtils.getAbsoluteY(mMainElement);

            fireEventToLayers(evt, "onMouseDblClick");
        } catch (exc) {
            self.error("handling double click failed", exc);
        }
    };


    /**
     * Event handler. Called when the mouse leaves the main element.
     *
     * @param evt {Map} the mouse event.
     */
    var onComponentMouseOut = function(evt) {
        try {
            evt = EventUtils.getEvent(evt);
            evt.relMouseX = EventUtils.getAbsoluteMouseX(evt) - DomUtils.getAbsoluteX(mMainElement);
            evt.relMouseY = EventUtils.getAbsoluteMouseY(evt) - DomUtils.getAbsoluteY(mMainElement);
            var width  = mMap.getWidth();
            var height = mMap.getHeight();

            if (evt.relMouseX < 0 || evt.relMouseY < 0 || evt.relMouseX >= width || evt.relMouseY >= height) {
                // This is a real mouse out (no mouse out of one of the children)
                cancelHoverTimeout();

                mLastMouseX = null;
                mLastMouseY = null;

                // Inform the layers
                fireEventToLayers(evt, "onMouseOut");
            }
        } catch (exc) {
            self.error("handling mouse out failed", exc);
        }
    }


    /**
     * Event handler. Called on mouse moved over the main element.
     * <p>
     * Please note: the return value of this handler is determined by what
     * the layers return for this event. If they all return false, this handler
     * also returns false. If one of them returns true, this handler returns
     * true. This is different from other handlers in this class, but necessary
     * so that a layer can allow selection inside its elements (in IE).
     * </p>
     *
     * @param evt {Map} the mouse event.
     */
    var onComponentMouseMove = function(evt) {
        var retVal = false;
        try {
            evt = EventUtils.getEvent(evt);

            evt.relMouseX = EventUtils.getAbsoluteMouseX(evt) - DomUtils.getAbsoluteX(mMainElement);
            evt.relMouseY = EventUtils.getAbsoluteMouseY(evt) - DomUtils.getAbsoluteY(mMainElement);

            // Process the event
            if (mLastMouseX != evt.relMouseX || mLastMouseY != evt.relMouseY) {
                // Inform the layers
                retVal = fireEventToLayers(evt, "onMouseMove");

                mLastMouseX = evt.relMouseX;
                mLastMouseY = evt.relMouseY;

                if (self.getActiveLayer() == null) {
                    mHoverEvent = evt;
                    setHoverTimeout();
                } else if (map.MapController.HOVER_TIMEOUT != 0) {
                    cancelHoverTimeout();
                }
            }
        } catch (exc) {
            self.error("handling mouse move failed", exc);
        }
        return retVal;
    }


    /**
     * Event handler. Called on mouse wheel over the main element.
     *
     * @param evt {Map} the mouse event.
     */
    var onComponentMouseWheel = function(evt) {
        cancelHoverTimeout();

        var evtWasConsumed = false;
        try {
            evt = EventUtils.getEvent(evt);

            //self.info("Ticks: " + evt.wheelTicks);
            if (evt.wheelTicks == null) {
                // can happen because of a bug in EventUtils (which is already
                // fixed, but not propagated to everyone yet, so perform an
                // additional check here)
                evt.wheelTicks = 0;
            }
            // Mac Firefox: no multiples of 3, so ceil and floor are needed
            evt.wheelTicks = (evt.wheelTicks > 0 ? Math.ceil(evt.wheelTicks / 3)
                                                 : Math.floor(evt.wheelTicks / 3));

            // Inform the layers
            evtWasConsumed = fireEventToLayers(evt, "onMouseWheel");
        } catch (exc) {
            self.error("handling mouse wheel failed", exc);
        }

        // Prevent page scroll
        if (evtWasConsumed && !evt.dontPreventDefault) {
            if (evt.preventDefault) {
                evt.preventDefault();
            }
            return false;
        } else {
            return true;
        }
    };


    /**
     * Event handler. Called when a selection should start.
     * <p>
     * Please note: the return value of this handler is determined by what
     * the layers return for this event. If they all return false, this handler
     * also returns false. If one of them returns true, this handler returns
     * true. This is different from other handlers in this class, but necessary
     * so that a layer can allow selection inside its elements.
     * </p>
     * @param evt {Map} the mouse event.
     */
    var onComponentSelectStart = function(evt) {
        cancelHoverTimeout();

        try {
            evt = EventUtils.getEvent(evt);
            evt.relMouseX = EventUtils.getAbsoluteMouseX(evt) - DomUtils.getAbsoluteX(mMainElement);
            evt.relMouseY = EventUtils.getAbsoluteMouseY(evt) - DomUtils.getAbsoluteY(mMainElement);

            // Inform the layers
            if (fireEventToLayers(evt, "onSelectStart")) {
                return true;
            }
        } catch (exc) {
            self.error("handling select start failed", exc);
        }
        return false;
    };
    

    var onComponentKeyDown = function(evt) {
        var evtWasConsumed = false;
        try {
            evt = EventUtils.getEvent(evt);

            // Inform the layers
            evtWasConsumed = fireEventToLayers(evt, "onKeyDown");
        } catch (exc) {
            self.error("handling key down failed", exc);
        }

        // Prevent page scroll
        if (evtWasConsumed && !evt.dontPreventDefault) {
            if (evt.preventDefault) {
                evt.preventDefault();
            }
            return false;
        } else {
            return true;
        }
    };


    /**
     * Fires an event to the layers.
     *
     * @param evt {Map} the event to fire.
     * @param listenerMethodName {string} the name of the listener method to call.
     * 
     * @return  {boolean}           whether the event was processed by a layer.
     */
    var fireEventToLayers = function(evt, listenerMethodName) {
        var activeLayer = self.getActiveLayer();
        if (activeLayer != null) {
            return activeLayer[listenerMethodName](evt);
        } else {
            var layerArr = mMap.getLayers();
            var processed = false;
            for (var i = layerArr.length - 1; i >= 0; i--) {
                if (layerArr[i].isEnabled()) {
                    processed = layerArr[i][listenerMethodName](evt);
                    if (processed == null) {
                        throw new Error(listenerMethodName + " of class "
                            + layerArr[i].constructor.classname
                            + " returned null (not true or false)");
                    }
                    if (processed) {
                        return true;
                    }
                }
            }
        }
        return false;
    };


    // overridden
    var superDispose = self.dispose;
    self.dispose = function() {
        if (self.getDisposed()) {
            return;
        }

        cancelHoverTimeout();
        mHoverEvent = null;
        mMainElement.onmousemove = null;
        mMainElement.onmousedown = null;
        mMainElement.onmouseup = null;
        mMainElement.onmouseout = null;
        mMainElement.onclick = null;
        EventUtils.removeEventHandler(mMainElement, "onmousewheel", onComponentMouseWheel);
        mMainElement.oncontextmenu = null;
        mMainElement.onselectstart = null;
        mMainElement.onkeydown = null;

        mainElement = null;
        mMainElement = null;

        superDispose.call(self);
    };


    /**
     * Initializes event handling
     */
    self.initEvents = function() {
        mMainElement.onmousemove = onComponentMouseMove;
        mMainElement.onmousedown = self.onComponentMouseDown;
        mMainElement.onmouseup = self.onComponentMouseUp;
        mMainElement.onmouseout = onComponentMouseOut;
        //mMainElement.onclick = onComponentMouseClick;
        // commented out because this is now handled like a right click
        // (via mousedown and mouseup events)
        mMainElement.ondblclick = onComponentMouseDblClick;
        EventUtils.addEventHandler(mMainElement, "onmousewheel", onComponentMouseWheel);
        mMainElement.oncontextmenu = function (evt) { return false; };
        mMainElement.onselectstart = onComponentSelectStart;

        mMainElement.tabIndex = 0;
        mMainElement.onkeydown = onComponentKeyDown;

        // Prevent a focus outline
        mMainElement.style.outline = "none";
    };


    /**
     * Initializes the instance.
     */
    var init = function() {
        if (initEvents == null || initEvents) {
            self.initEvents();
        }
        self.setActionMode(map.MapController.DEFAULT_ACTION_MODE);
    };

    init();
});


/**
 * {int} The action mode "move". If set the main action (on the left mouse button)
 * is moving the map.
 */
qxp.Class.ACTION_MODE_MOVE = 1;

/**
 * {int} The action mode "zoom". If set the main action (on the left mouse button)
 * is zooming the map.
 */
qxp.Class.ACTION_MODE_ZOOM = 2;

/**
 * {int} The default action mode (initially set to
 * {@link #ACTION_MODE_ZOOM ACTION_MODE_ZOOM}). Change it to
 * {@link #ACTION_MOVE_MOVE ACTION_MODE_MOVE} before instantiating a map
 * if you want to move the map with the left mouse button by default.
 */
qxp.Class.DEFAULT_ACTION_MODE = qxp.Class.ACTION_MODE_ZOOM;

/** {int} The timeout in milliseconds before a tooltip appears. */
qxp.Class.HOVER_TIMEOUT = 0;

/**
 * The Layer that currently controls the input events. Is null, if the mouse is
 * currently in no special mode. While an active layer is set, mouse and key
 * events will only be propagated to this layer.
 */
qxp.OO.addProperty({ name:"activeLayer", type:qxp.constant.Type.OBJECT });

/** The current main action. */
qxp.OO.addProperty({ name:"actionMode", type:qxp.constant.Type.NUMBER,
    defaultValue:qxp.Class.DEFAULT_ACTION_MODE, allowNull:false,
    possibleValues:[ qxp.Class.ACTION_MODE_MOVE, qxp.Class.ACTION_MODE_ZOOM ] });
