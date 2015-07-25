/**
 * A default toolbar with buttons for common tasks. If you want to use the
 * functionality behind a button programmatically, you have two choices:
 * <ol>
 *     <li>You can get an instance of the default toolbar by calling
 *         <code>map.getLayer("toolbar")</code> (where <code>map</code> is an
 *         AjaxMap instance). On this instance, you can call methods like
 *         <code>switchToMoveMode()</code>. For toggle buttons, the toolbar
 *         will reflect the new state automatically.</li>
 *     <li>You can call one of the static methods of this class. They perform
 *         the same tasks as the instance methods, but they don't change the
 *         toggle buttons. This is useful if you're replacing the default
 *         toolbar instance with a custom implementation.</li>
 * </ol>
 * <p>
 *     The following buttons and spacers are created in this class:
 * </p>
 * <ul>
 *     <li><strong>zoom-out</strong>: Zoom out</li>
 *     <li><strong>spacing-between-zoom</strong>: 2 pixel spacer</li>
 *     <li><strong>zoom-in</strong>: Zoom in</li>
 *     <li><strong>spacing-after-zoom</strong>: 7 pixel spacer</li>
 *     <li><strong>zoom-mode</strong>: Zoom mode (left button for zooming,
 *         right button for panning; zoom mode is the default mode)</li>
 *     <li><strong>spacing-between-mode</strong>: 2 pixel spacer</li>
 *     <li><strong>move-mode</strong>: Move mode (left button for panning,
 *         right button for zooming)</li>
 *     <li><strong>spacing-after-mode</strong>: 7 pixel spacer</li>
 *     <li><strong>overview</strong>: Toggle the overview map (located in
 *         the lower left corner by default)</li>
 *     <li><strong>spacing-after-overview</strong>: 7 pixel spacer</li>
 *     <li><strong>map-view</strong>: Switch to map view (simple map with
 *         no aerial view; map view is the default)</li>
 *     <li><strong>spacing-between-view-1</strong>: 2 pixel spacer</li>
 *     <li><strong>hybrid-view</strong>: Switch to hybrid view (a mode with
 *         a translucent aerial view; the standard map is still partly
 *         visible behind the photos)</li>
 *     <li><strong>spacing-between-view-2</strong>: 2 pixel spacer</li>
 *     <li><strong>aerial-view</strong>: Switch to aerial view</li>
 *     <li><strong>spacing-after-view</strong>: 7 pixel spacer</li>
 *     <li><strong>measurement</strong>: Toggle the measurement tool</li>
 *     <li><strong>spacing-after-measurement</strong>: 2 pixel spacer
 *         (only present if address lookup is enabled on the server)</li>
 *     <li><strong>address-lookup</strong>: Toggle the address lookup tool
 *         (only present if address lookup is enabled on the server)</li>
 *     <li><strong>spacing-after-address-lookup</strong>: 7 pixel spacer</li>
 *     <li><strong>reset</strong>: Reset the map to the initially visible
 *         rectangle (or to the one in the
 *         {@link com.ptvag.webcomponent.map.Map#resetRect} property if it's
 *         defined)</li>
 *     <li><strong>spacing-after-reset</strong>: 7 pixel spacer</li>
 *     <li><strong>history-back</strong>: Go back one step in the view
 *         history (before the previous change of center and/or zoom
 *         level)</li>
 *     <li><strong>spacing-between-history</strong>: 2 pixel spacer</li>
 *     <li><strong>history-forward</strong>: Go forward one step in the
 *         view history</li>
 * </ul>
 * <p>
 * Sample code: {@sample Customizing toolbar buttons},
 *              {@sample Customizing toolbar appearance}
 */
qxp.OO.defineClass("com.ptvag.webcomponent.map.layer.DefaultToolbarLayer", com.ptvag.webcomponent.map.layer.ToolbarLayer,
function() {
    com.ptvag.webcomponent.map.layer.ToolbarLayer.apply(this, arguments);

    var self = this;
    var mapPackage = com.ptvag.webcomponent.map;
    var clazz = mapPackage.layer.DefaultToolbarLayer;
    var rewriteURL = mapPackage.MapUtil.rewriteURL;

    var mZoomInEnabled;
    var mZoomOutEnabled;
    var mHistoryBackEnabled;
    var mHistoryForwardEnabled;
    var mAlphaImgExt = qxp.sys.Client.getInstance().isMshtml() ? "_noalpha.gif" : ".png";


    var getImageURL = function(imageName) {
        return mapPackage.MapUtil.rewriteURL(
            "img/com/ptvag/webcomponent/map/" + imageName, true);
    };


    var addButton = function(id, imageName, tooltip, handler, enabled) {
        var buttonData = { imgUrl:getImageURL(imageName), width:17, height:17,
                           tooltip:tooltip, id:id, clickHandler:handler,
                           enabled:(enabled == null ? true : enabled) };
        self.addElement(buttonData);
    };


    var setZoomEnabledVars = function(zoom) {
        mZoomInEnabled = (zoom > 0);
        mZoomOutEnabled = (zoom < mapPackage.CoordUtil.ZOOM_LEVEL_COUNT - 1);
    };


    var setHistoryEnabledVars = function() {
        var map = self.getMap();
        mHistoryBackEnabled = map.hasHistoryBack();
        mHistoryForwardEnabled = map.hasHistoryForward();
    };


    var zoomChanged = function(evt) {
        var zoom = evt.getData();
        zoomInEnabled = mZoomInEnabled;
        zoomOutEnabled = mZoomOutEnabled;
        setZoomEnabledVars(zoom);
        if (zoomInEnabled != mZoomInEnabled && self.elementExists("zoom-in")) {
            self.setButtonEnabled("zoom-in", mZoomInEnabled);
        }
        if (zoomOutEnabled != mZoomOutEnabled && self.elementExists("zoom-out")) {
            self.setButtonEnabled("zoom-out", mZoomOutEnabled);
        }
    };


    var historyChanged = function() {
        var historyBackEnabled = mHistoryBackEnabled;
        var historyForwardEnabled = mHistoryForwardEnabled;
        setHistoryEnabledVars();
        if (historyBackEnabled != mHistoryBackEnabled && self.elementExists("history-back")) {
            self.setButtonEnabled("history-back", mHistoryBackEnabled);
        }
        if (historyForwardEnabled != mHistoryForwardEnabled && self.elementExists("history-forward")) {
            self.setButtonEnabled("history-forward", mHistoryForwardEnabled);
        }
    };


    // overridden
    var superInit = self.init;
    self.init = function() {
        superInit.apply(self, arguments);

        var map = self.getMap();
        var inverseWheelZoom = map.getInverseWheelZoom();
        var zoom = map.getZoom();
        setZoomEnabledVars(map.getZoom());
        setHistoryEnabledVars();
        addButton("zoom-out", "button_zoom_out.gif", "Zoom out",
                  self.zoomOut, mZoomOutEnabled);
        self.addElement({width:2, id:"spacing-between-zoom"});
        addButton("zoom-in", "button_zoom_in.gif", "Zoom in",
                  self.zoomIn, mZoomInEnabled);
        self.addElement({width:7, id:"spacing-after-zoom"});
        addButton("zoom-mode",
            (mapPackage.MapController.DEFAULT_ACTION_MODE ==
             mapPackage.MapController.ACTION_MODE_ZOOM ?
             "button_zoom_mode_highlight" : "button_zoom_mode") + mAlphaImgExt,
            "Switch to zoom mode", self.switchToZoomMode);
        self.addElement({width:2, id:"spacing-between-mode"});
        addButton("move-mode",
            (mapPackage.MapController.DEFAULT_ACTION_MODE ==
             mapPackage.MapController.ACTION_MODE_MOVE ?
             "button_move_mode_highlight.gif" : "button_move_mode.gif"),
            "Switch to move mode", self.switchToMoveMode);
        self.addElement({width:7, id:"spacing-after-mode"});
        var overviewLayer = map.getLayer("overview");
        addButton("overview",
            (overviewLayer && overviewLayer.isEnabled() ?
             "button_overview_highlight.gif" : "button_overview.gif"),
            "Show or hide the overview map", self.toggleOverview);
        self.addElement({width:7, id:"spacing-after-overview"});
        addButton("map-view", "button_map_view_highlight.gif",
            "Switch to standard map view", self.switchToPlainView);
        self.addElement({width:2, id:"spacing-between-view-1"});
        addButton("hybrid-view", "button_hybrid_view.gif",
            "Switch to hybrid view", self.switchToHybridView);
        self.addElement({width:2, id:"spacing-between-view-2"});
        addButton("aerial-view", "button_aerial_view.gif",
            "Switch to aerial view", self.switchToAerialView);
        self.addElement({width:7, id:"spacing-after-view"});
        var measurementLayer = map.getLayer("measurement");
        addButton("measurement",
            (measurementLayer && measurementLayer.isEnabled() ?
             "button_measurement_highlight.gif" : "button_measurement.gif"),
            "Distance measurement tool",
            self.toggleMeasurement);
        if (mapPackage.Map.ADDRESS_LOOKUP_ENABLED) {
            self.addElement({width:2, id:"spacing-after-measurement"});
            var addressLookupLayer = map.getLayer("addresslookup");
            addButton("address-lookup",
                (addressLookupLayer && addressLookupLayer.isEnabled() ?
                 "button_address_lookup_highlight.gif" : "button_address_lookup.gif"),
                "Address lookup tool",
                self.toggleAddressLookup);
        }
        self.addElement({width:7, id:"spacing-after-address-lookup"});
        addButton("reset", "button_reset.gif",
            "Reset map view", self.resetMapRect);
        self.addElement({width:7, id:"spacing-after-reset"});
        addButton("history-back", "button_history_back.gif",
            "Move one step back in history", self.historyBack,
            mHistoryBackEnabled);
        self.addElement({width:2, id:"spacing-between-history"});
        addButton("history-forward", "button_history_forward.gif",
            "Move one step forward in history", self.historyForward,
            mHistoryForwardEnabled);

        map.addEventListener("changeZoom", zoomChanged);
        map.addEventListener("historyChanged", historyChanged);
        // TODO: maybe add a listener for the overview layer (so that its
        //       visibility is reflected in the toolbar if it's changed
        //       programmatically)
    };


    // overridden
    var superDispose = self.dispose;
    self.dispose = function() {
        if (self.getDisposed()) {
            return;
        }
        var map = self.getMap();
        map.removeEventListener("changeZoom", zoomChanged);
        map.removeEventListener("historyChanged", historyChanged);
        superDispose.call(self);
    };


    /**
     * Zoom in one step.
     */
    self.zoomIn = function() {
        var map = self.getMap();
        map.startLoggingAction("user:buttonZoomIn");
        try {
            clazz.zoomIn(map);
        } finally {
            map.endLoggingAction();
        }
    };


    /**
     * Zoom out one step.
     */
    self.zoomOut = function() {
        var map = self.getMap();
        map.startLoggingAction("user:buttonZoomOut");
        try {
            clazz.zoomOut(map);
        } finally {
            map.endLoggingAction();
        }
    };


    /**
     * Switch to zoom mode (left button zooms, right button pans).
     */
    self.switchToZoomMode = function() {
        var map = self.getMap();
        if (map.getController().getActionMode() !=
            mapPackage.MapController.ACTION_MODE_ZOOM) {
            self.setButtonImage("move-mode",
                getImageURL("button_move_mode.gif"));
            self.setButtonImage("zoom-mode",
                getImageURL("button_zoom_mode_highlight" + mAlphaImgExt));
            clazz.switchToZoomMode(map);
        }
    };


    /**
     * Switch to move mode (left button pans, right button zooms).
     */
    self.switchToMoveMode = function() {
        var map = self.getMap();
        if (map.getController().getActionMode() !=
            mapPackage.MapController.ACTION_MODE_MOVE) {
            self.setButtonImage("move-mode",
                getImageURL("button_move_mode_highlight.gif"));
            self.setButtonImage("zoom-mode",
                getImageURL("button_zoom_mode" + mAlphaImgExt));
            clazz.switchToMoveMode(map);
        }
    };


    /**
     * Toggle the visibility of the overview map. If you want to find out if
     * it's currently visible, you can test the following two conditions:
     * <code>map.getLayer("overview")</code> must not return
     * <code>undefined</code>, and
     * <code>map.getLayer("overview").isEnabled()</code> must return
     * <code>true</code>.
     */
    self.toggleOverview = function() {
        var map = self.getMap();
        clazz.toggleOverview(map);
        var overviewLayer = map.getLayer("overview");
        self.setButtonImage("overview",
            getImageURL(overviewLayer && overviewLayer.isEnabled() ?
                        "button_overview_highlight.gif" :
                        "button_overview.gif"));
    };


    /**
     * Switch to standard map view (no aerial photos are visible).
     */
    self.switchToPlainView = function() {
        self.setButtonImage("map-view",
            getImageURL("button_map_view_highlight.gif"));
        self.setButtonImage("hybrid-view",
            getImageURL("button_hybrid_view.gif"));
        self.setButtonImage("aerial-view",
            getImageURL("button_aerial_view.gif"));
        clazz.switchToPlainView(self.getMap());
    };


    /**
     * Switch to hybrid view (both the standard vector graphics and aerial
     * photos are visible, combined using partial transparency).
     */
    self.switchToHybridView = function() {
        self.setButtonImage("map-view",
            getImageURL("button_map_view.gif"));
        self.setButtonImage("hybrid-view",
            getImageURL("button_hybrid_view_highlight.gif"));
        self.setButtonImage("aerial-view",
            getImageURL("button_aerial_view.gif"));
        clazz.switchToHybridView(self.getMap());
    };


    /**
     * Switch to aerial view (only aerial photos and labels, like street names,
     * are visible).
     */
    self.switchToAerialView = function() {
        self.setButtonImage("map-view",
            getImageURL("button_map_view.gif"));
        self.setButtonImage("hybrid-view",
            getImageURL("button_hybrid_view.gif"));
        self.setButtonImage("aerial-view",
            getImageURL("button_aerial_view_highlight.gif"));
        clazz.switchToAerialView(self.getMap());
    };


    /**
     * Toggle the measurement layer (for measuring distances). If you want to
     * find out if it's currently active, you can test the following two
     * conditions: <code>map.getLayer("measurement")</code> must not return
     * <code>undefined</code>, and
     * <code>map.getLayer("measurement").isEnabled()</code> must return
     * <code>true</code>.
     */
    self.toggleMeasurement = function() {
        var map = self.getMap();
        var addressLookupLayer = map.getLayer("addresslookup");
        if (addressLookupLayer && addressLookupLayer.isEnabled()) {
            self.toggleAddressLookup();
        }
        clazz.toggleMeasurement(map);
        var measurementLayer = map.getLayer("measurement");
        self.setButtonImage("measurement",
            getImageURL(measurementLayer && measurementLayer.isEnabled() ?
                        "button_measurement_highlight.gif" :
                        "button_measurement.gif"));
    };


    /**
     * Toggle the address lookup layer (which displays the postal address at
     * the mouse cursor position when clicked). If you want to find out if it's
     * currently active, you can test the following two conditions:
     * <code>map.getLayer("addresslookup")</code> must not return
     * <code>undefined</code>, and
     * <code>map.getLayer("addresslookup").isEnabled()</code> must return
     * <code>true</code>.
     */
    self.toggleAddressLookup = function() {
        var map = self.getMap();
        var measurementLayer = map.getLayer("measurement");
        if (measurementLayer && measurementLayer.isEnabled()) {
            self.toggleMeasurement();
        }
        clazz.toggleAddressLookup(map);
        var addressLookupLayer = map.getLayer("addresslookup");
        self.setButtonImage("address-lookup",
            getImageURL(addressLookupLayer && addressLookupLayer.isEnabled() ?
                        "button_address_lookup_highlight.gif" :
                        "button_address_lookup.gif"));
    };


    /**
     * Reset the visible map rect.
     */
    self.resetMapRect = function() {
        clazz.resetMapRect(self.getMap());
    };


    /**
     * Go back a step in history.
     */
    self.historyBack = function() {
        clazz.historyBack(self.getMap());
    };


    /**
     * Go forward a step in history.
     */
    self.historyForward = function() {
        clazz.historyForward(self.getMap());
    };

});


/**
 * Zoom in one step.
 *
 * @param   map {com.ptvag.webcomponent.map.Map}    the map instance to work
 *                                                  on.
 */
qxp.Class.zoomIn = function(map) {
    map.setZoom(map.getZoom() - 1);
};


/**
 * Zoom out one step.
 *
 * @param   map {com.ptvag.webcomponent.map.Map}    the map instance to work
 *                                                  on.
 */
qxp.Class.zoomOut = function(map) {
    map.setZoom(map.getZoom() + 1);
};


/**
 * Switch to zoom mode (left button zooms, right button pans).
 *
 * @param   map {com.ptvag.webcomponent.map.Map}    the map instance to work
 *                                                  on.
 */
qxp.Class.switchToZoomMode = function(map) {
    map.getController().setActionMode(
        com.ptvag.webcomponent.map.MapController.ACTION_MODE_ZOOM);
};


/**
 * Switch to move mode (left button pans, right button zooms).
 *
 * @param   map {com.ptvag.webcomponent.map.Map}    the map instance to work
 *                                                  on.
 */
qxp.Class.switchToMoveMode = function(map) {
    map.getController().setActionMode(
        com.ptvag.webcomponent.map.MapController.ACTION_MODE_MOVE);
};


/**
 * Toggle the visibility of the overview map. If you want to find out if it's
 * currently visible, you can test the following two conditions:
 * <code>map.getLayer("overview")</code> must not return
 * <code>undefined</code>, and
 * <code>map.getLayer("overview").isEnabled()</code> must return
 * <code>true</code>.
 *
 * @param   map {com.ptvag.webcomponent.map.Map}    the map instance to work
 *                                                  on.
 */
qxp.Class.toggleOverview = function(map) {
    var overviewLayer = map.getLayer("overview");
    overviewLayer.setEnabled(!overviewLayer.isEnabled());
};


/**
 * Switch to standard map view (no aerial photos are visible).
 *
 * @param   map {com.ptvag.webcomponent.map.Map}    the map instance to work
 *                                                  on.
 */
qxp.Class.switchToPlainView = function(map) {
    map.getLayer("sat").setEnabled(false);
    map.getLayer("label").setLayerOpacity(1);
};


/**
 * Switch to hybrid view (both the standard vector graphics and aerial photos
 * are visible, combined using partial transparency).
 *
 * @param   map {com.ptvag.webcomponent.map.Map}    the map instance to work
 *                                                  on.
 */
qxp.Class.switchToHybridView = function(map) {
    var satLayer = map.getLayer("sat");
    satLayer.setEnabled(true);
    satLayer.setLayerOpacity(0.8);
    map.getLayer("label").setLayerOpacity(0.65);
};


/**
 * Switch to aerial view (only aerial photos and labels, like street names, are
 * visible).
 *
 * @param   map {com.ptvag.webcomponent.map.Map}    the map instance to work
 *                                                  on.
 */
qxp.Class.switchToAerialView = function(map) {
    var satLayer = map.getLayer("sat");
    satLayer.setEnabled(true);
    satLayer.setLayerOpacity(1);
    map.getLayer("label").setLayerOpacity(0.65);
};


/**
 * Toggle the measurement layer (for measuring distances). If you want to find
 * out if it's currently active, you can test the following two conditions:
 * <code>map.getLayer("measurement")</code> must not return
 * <code>undefined</code>, and
 * <code>map.getLayer("measurement").isEnabled()</code> must return
 * <code>true</code>.
 *
 * @param   map {com.ptvag.webcomponent.map.Map}    the map instance to work
 *                                                  on.
 */
qxp.Class.toggleMeasurement = function(map) {
    var measurementLayer = map.getLayer("measurement");
    if (measurementLayer) {
        if (measurementLayer.isEnabled()) {
            map.removeLayer("measurement");
        }
        // if the layer is not enabled, someone has disabled it from outside
        // => do nothing
    } else {
        var floaterLayer = map.getLayer("floater");
        measurementLayer =
            new com.ptvag.webcomponent.map.layer.MeasurementLayer(
                floaterLayer);
        measurementLayer.setIncludeInPrint(true);
        measurementLayer.setIsRelative(true);
        map.addLayer(measurementLayer, "measurement", null, floaterLayer);
    }
};


/**
 * Toggle the address lookup layer (which displays the postal address at the
 * mouse cursor position when clicked). If you want to find out if it's
 * currently active, you can test the following two conditions:
 * <code>map.getLayer("addresslookup")</code> must not return
 * <code>undefined</code>, and
 * <code>map.getLayer("addresslookup").isEnabled()</code> must return
 * <code>true</code>.
 *
 * @param   map {com.ptvag.webcomponent.map.Map}    the map instance to work
 *                                                  on.
 */
qxp.Class.toggleAddressLookup = function(map) {
    var addressLookupLayer = map.getLayer("addresslookup");
    if (addressLookupLayer) {
        if (addressLookupLayer.isEnabled()) {
            map.removeLayer("addresslookup");
        }
        // if the layer is not enabled, someone has disabled it from outside
        // => do nothing
    } else {
        var floaterLayer = map.getLayer("floater");
        addressLookupLayer =
            new com.ptvag.webcomponent.map.layer.AddressLookupLayer(
                floaterLayer);
        addressLookupLayer.setIncludeInPrint(true);
        addressLookupLayer.setIsRelative(true);
        map.addLayer(addressLookupLayer, "addresslookup", null, floaterLayer);
    }
};


/**
 * Reset the visible map rect.
 *
 * @param   map {com.ptvag.webcomponent.map.Map}    the map instance to work
 *                                                  on.
 */
qxp.Class.resetMapRect = function(map) {
    var resetRect = map.getResetRect();
    map.setRect(resetRect.left, resetRect.top,
                resetRect.right, resetRect.bottom,
                true);
};


/**
 * Go back a step in history.
 *
 * @param   map {com.ptvag.webcomponent.map.Map}    the map instance to work
 *                                                  on.
 */
qxp.Class.historyBack = function(map) {
    map.historyBack();
};


/**
 * Go forward a step in history.
 *
 * @param   map {com.ptvag.webcomponent.map.Map}    the map instance to work
 *                                                  on.
 */
qxp.Class.historyForward = function(map) {
    map.historyForward();
};
