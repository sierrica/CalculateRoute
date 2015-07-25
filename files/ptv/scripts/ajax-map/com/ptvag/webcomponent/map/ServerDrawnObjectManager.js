/**
 * Handles server drawn objects like static POIs and SMOs.
 * <p>
 * Sample code: {@sample Server-side POIs},
 *              {@sample Server-side POIs via xpoidb},
 *              {@sample Server-side drawing}
 *
 * @event   staticPOIClicked {qxp.event.type.DataEvent}  fired when a static POI
 *                              was clicked. The event data contains the POI.
 * @event   staticPOIHovered {qxp.event.type.DataEvent}  fired when the mouse
 *                              hovers over a static POI. The event data
 *                              contains the POI.
 * @event   staticPOIsAvailable {qxp.event.type.DataEvent}   fired when static
 *                              POIs have been loaded from the server (or have
 *                              been reset from the client side). The event
 *                              data contains an array with the POIs (which may
 *                              be empty).
 * 
 * @param   requestBuilder {com.ptvag.webcomponent.map.RequestBuilder}
 *              the request builder responsible for server drawn objects.
 *              (It's possible to use more than one request builder to receive
 *              POI information. The request builder specified here is the
 *              main/default instance used by the map for POI handling.)
 * @param   vectorLayer {com.ptvag.webcomponent.map.layer.VectorLayer}
 *              the vector layer to use for displaying POI information.
 */
qxp.OO.defineClass("com.ptvag.webcomponent.map.ServerDrawnObjectManager", qxp.core.Target,
function(requestBuilder, vectorLayer) {
    qxp.core.Target.call(this);

    var self = this;
    var map = com.ptvag.webcomponent.map;
    var clazz = map.ServerDrawnObjectManager;

    /** The currently visible static POIs. */
    var mStaticPOIs = [];
    var mAdditionalPOIs = {};

    var LINE_PREFIX = "mapapi_staticpoi_line_";
    var CLICKAREA_PREFIX = "mapapi_staticpoi_clickarea_";
    var HOVERAREA_PREFIX = "mapapi_staticpoi_hoverarea_";
    var TOOLTIP_PREFIX = "mapapi_staticpoi_tooltip_";
    
    var CLICKAREA_PREFIX_LENGTH = CLICKAREA_PREFIX.length;
    var HOVERAREA_PREFIX_LENGTH = HOVERAREA_PREFIX.length;


    /**
     * Returns the request builder responsible for handling server-drawn objects.
     * (It's possible to use more than one request builder to receive POI
     * information. The request builder returned here is the main/default
     * instance used by the map for POI handling.)
     *
     * @return  {RequestBuilder}    the request builder.
     */
    self.getRequestBuilder = function() {
        return requestBuilder;
    }


    /**
     * A default formatter for static POI tooltips.
     * 
     * @param   poiText {string}    the original POI description.
     * 
     * @return  {string}            the HTML formatted POI description.
     */
    var defaultStaticPOIFormatter = function(poiText) {
        var delimiter = self.getStaticPOIDelimiter();
        if (delimiter == null) {
            var components = [poiText];
        } else {
            components = poiText.split(delimiter);
        }
        return "<div style='font-family:Verdana,Arial,sans-serif;font-size:11px'>" +
               "<div style='font-weight:bold;padding-bottom:4px'>" +
               (components.length > 1 ? map.MapUtil.escapeHTML(components[1]) : map.MapUtil.escapeHTML(components[0])) + "</div><div>" +
               (components.length > 2 ? map.MapUtil.escapeHTML(components[2]) : "") + "</div></div>";
    };
    
    self.setStaticPOIFormatter(defaultStaticPOIFormatter);
    
    
    /**
     * Handler for clicks on POIs.
     * 
     * @param   evt {Map}           the click event.
     */
    var clickOnPOI = function(evt) {
        var id = evt.id;
        var indexPos = id.lastIndexOf("_") + 1;
        var index = parseInt(id.substring(indexPos));
        if (indexPos != CLICKAREA_PREFIX_LENGTH) {
            id = id.substring(CLICKAREA_PREFIX_LENGTH, indexPos-1);
            var poiArray = mAdditionalPOIs[id];
        } else {
            poiArray = mStaticPOIs;
        }
        self.createDispatchDataEvent(clazz.STATIC_POI_CLICKED, poiArray[index]);
    };
    
    
    /**
     * Handler for hovering over POIs.
     * 
     * @param   evt {Map}           the hover event.
     */
    var hoverOverPOI = function(evt) {
        var id = evt.id;
        var indexPos = id.lastIndexOf("_") + 1;
        var index = parseInt(id.substring(indexPos));
        if (indexPos != HOVERAREA_PREFIX_LENGTH) {
            id = id.substring(HOVERAREA_PREFIX_LENGTH, indexPos-1);
            var poiArray = mAdditionalPOIs[id];
        } else {
            poiArray = mStaticPOIs;
        }
        self.createDispatchDataEvent(clazz.STATIC_POI_HOVERED, poiArray[index]);
    };
    
    
    /**
     * Creates "virtual" lines for line POIs (to attach handlers to).
     *
     * @param   id {string, null}   the id associated with the POIs (see
     *                              {@link #setStaticPOIs}).
     */
    var createLines = function(id) {
        var poiArray = (id == null ? mStaticPOIs : mAdditionalPOIs[id]);
        if (poiArray == null) {
            return;
        }
        var idString = (id == null ? "" : id + "_");
        for (var i = 0; i < poiArray.length; ++i) {
            var lineCoordinates = poiArray[i].lineCoordinates;
            if (lineCoordinates != null) {
                var count = lineCoordinates.length/2;
                var suCoordinates = new Array(count*2);
                for (var j = 0; j < count; ++j) {
                    var suPoint = map.CoordUtil.mercator2SmartUnit({
                        x: lineCoordinates[j*2],
                        y: lineCoordinates[j*2 + 1]});
                    suCoordinates[j*2] = suPoint.x;
                    suCoordinates[j*2 + 1] = suPoint.y;
                }
                var line = new map.vector.Line(null, null,
                    suCoordinates, null, LINE_PREFIX + idString + i);
                line.setColor("rgba(0,0,0,0)");     // until a better solution is found
                vectorLayer.addElement(line);
            }
        }
    };


    /**
     * Creates click areas for the currently visible static POIs associated
     * with the specified id. If the click areas have already been generated,
     * nothing happens.
     *
     * @param   id {string, null}   the id associated with the POIs (see
     *                              {@link #setStaticPOIs}).
     */
    var createClickAreas = function(id) {
        var poiArray = (id == null ? mStaticPOIs : mAdditionalPOIs[id]);
        if (poiArray == null) {
            return;
        }
        var idString = (id == null ? "" : id + "_");
        if (!vectorLayer.elementExists(CLICKAREA_PREFIX + idString + "0")) {
            for (var i = 0; i < poiArray.length; ++i) {
                var clickArea = new map.vector.ClickArea(
                    poiArray[i].x, poiArray[i].y,
                    null, self.getClickTolerance(),
                    clickOnPOI, null, CLICKAREA_PREFIX + idString + i);
                clickArea.setFlexX(poiArray[i].flexX);
                clickArea.setFlexY(poiArray[i].flexY);
                clickArea.setAttachedElement(vectorLayer.getElement(LINE_PREFIX + idString + i));
                vectorLayer.addElement(clickArea);
            }
        }
    };
    

    /**
     * Creates hover areas for the currently visible static POIs associated
     * with the specified id. If the hover areas have already been generated,
     * nothing happens.
     *
     * @param   id {string, null}   the id associated with the POIs (see
     *                              {@link #setStaticPOIs}).
     */
    var createHoverAreas = function(id) {
        var poiArray = (id == null ? mStaticPOIs : mAdditionalPOIs[id]);
        if (poiArray == null) {
            return;
        }
        var idString = (id == null ? "" : id + "_");
        if (!vectorLayer.elementExists(HOVERAREA_PREFIX + idString + "0")) {
            for (var i = 0; i < poiArray.length; ++i) {
                var hoverArea = new map.vector.HoverArea(
                    poiArray[i].x, poiArray[i].y,
                    null, self.getHoverTolerance(),
                    hoverOverPOI, null, null, HOVERAREA_PREFIX + idString + i);
                hoverArea.setFlexX(poiArray[i].flexX);
                hoverArea.setFlexY(poiArray[i].flexY);
                hoverArea.setAttachedElement(vectorLayer.getElement(LINE_PREFIX + idString + i));
                vectorLayer.addElement(hoverArea);
            }
        }
    };


    /**
     * Creates tooltips for the currently visible static POIs associated
     * with the specified id. If the tooltips have already been generated,
     * nothing happens.
     *
     * @param   id {string, null}   the id associated with the POIs (see
     *                              {@link #setStaticPOIs}).
     */
    var createTooltips = function(id) {
        var poiArray = (id == null ? mStaticPOIs : mAdditionalPOIs[id]);
        if (poiArray == null) {
            return;
        }
        var idString = (id == null ? "" : id + "_");
        if (!vectorLayer.elementExists(TOOLTIP_PREFIX + idString + "0")) {
            for (var i = 0; i < poiArray.length; ++i) {
                var formattedText;
                var formatter = self.getStaticPOIFormatter();
                formattedText = formatter(poiArray[i].description);
                var tooltip = new map.vector.Tooltip(
                    poiArray[i].x, poiArray[i].y, null,
                    self.getHoverTolerance(), formattedText, null, null,
                    TOOLTIP_PREFIX + idString + i);
                tooltip.setFlexX(poiArray[i].flexX);
                tooltip.setFlexY(poiArray[i].flexY);
                tooltip.setAttachedElement(vectorLayer.getElement(LINE_PREFIX + idString + i));
                vectorLayer.addElement(tooltip);
            }
        }
    };


    /**
     * Removes the vector layer elements for all currently visible static
     * POIs associated with the specified id.
     *
     * @param   prefix {string}     the prefix of the elements.
     * @param   id {string, null}   the id associated with the POIs (see
     *                              {@link #setStaticPOIs}).
     * @param   sparse {boolean, false}     whether the elements are sparse
     *                                      (meaning not all POIs have an
     *                                      associated element).
     */
    var removeElements = function(prefix, id, sparse) {
        var poiArray = (id == null ? mStaticPOIs : mAdditionalPOIs[id]);
        if (poiArray == null) {
            return;
        }
        var prefixString = (id == null ? prefix : prefix + id + "_");
        if (sparse || vectorLayer.elementExists(prefixString + "0")) {
            for (var i = 0; i < poiArray.length; ++i) {
                vectorLayer.hideElement(prefixString + i);
            }
        }
    };


    /**
     * Internally handles the arrival of new POIs. No events are dispatched
     * from here.
     * 
     * @param   pois {Map[]}        the new POIs.
     * @param   id {string, null}   the id associated with the POIs (see
     *                              {@link #setStaticPOIs}).
     */
    var handleNewPOIs = function(pois, id) {
        var alreadyInBulkMode = vectorLayer.inBulkMode();
        if (!alreadyInBulkMode) {
            vectorLayer.startBulkMode();
        }
        try {
            removeElements(LINE_PREFIX, id, true);
            removeElements(CLICKAREA_PREFIX, id);
            removeElements(HOVERAREA_PREFIX, id);
            removeElements(TOOLTIP_PREFIX, id);
            if (id == null) {
                mStaticPOIs = (pois == null ? [] : pois);
            } else {
                if (pois == null) {
                    delete mAdditionalPOIs[id];
                } else {
                    mAdditionalPOIs[id] = pois;
                }
            }
            createLines(id);
            if (self.hasEventListeners(clazz.STATIC_POI_CLICKED)) {
                createClickAreas(id);
            }
            if (self.hasEventListeners(clazz.STATIC_POI_HOVERED)) {
                createHoverAreas(id);
            }
            if (self.getDefaultStaticPOITooltips()) {
                createTooltips(id);
            }
        } finally {
            if (!alreadyInBulkMode) {
                vectorLayer.endBulkMode();
            }
        }
    };
    
    
    /**
     * Displays a number of static POIs. This method should only be called by
     * other map classes, not from the outside.
     * 
     * @param   pois {var}          the pois to show. If <code>null</code>
     *                              (and if the <code>id</code> is not
     *                              <code>null</code>), the internal array
     *                              for the specified id is removed completely
     *                              (use this to clean up old, unused ids if
     *                              you frequently generate new ones).
     * @param   id {string, null}   an optional id associated with the POIs.
     *                              This is useful to create different,
     *                              independent sets of POIs. Only the set
     *                              identified by the id will be replaced
     *                              with the new POIs, leaving other existing
     *                              POIs alone. If this parameter is
     *                              <code>null</code>, the default POI set
     *                              is used (which is the POI set that's
     *                              affected by {@link #addPOICategory} and
     *                              similar methods).
     */
    self.setStaticPOIs = function(pois, id) {
        if (pois != null) {
            for (var i = 0; i < pois.length; ++i) {
                var suPoint = map.CoordUtil.mercator2SmartUnit({x: pois[i].x, y: pois[i].y});
                pois[i].x = suPoint.x;
                pois[i].y = suPoint.y;
            }
        }
        handleNewPOIs(pois, id);
        var poiArrays = [];
        if (mStaticPOIs.length > 0) {
            poiArrays.push(mStaticPOIs);
        }
        for (var id in mAdditionalPOIs) {
            var poiArray = mAdditionalPOIs[id];
            if (poiArray.length > 0) {
                poiArrays.push(poiArray);
            }
        }
        var poiArrayCount = poiArrays.length;
        if (poiArrayCount == 0) {
            poiArray = poiArrays;
        } else if (poiArrayCount == 1) {
            poiArray = poiArrays[0];
        } else {
            poiArray = [];
            for (i = 0; i < poiArrayCount; ++i) {
                var poiArrayToCopy = poiArrays[i];
                var lengthToCopy = poiArrayToCopy.length;
                for (var j = 0; j < lengthToCopy; ++j) {
                    poiArray.push(poiArrayToCopy[j]);
                }
            }
        }
        self.createDispatchDataEvent(clazz.STATIC_POIS_AVAILABLE, poiArray);
    };
    
    
    /**
     * Adds a POI category.
     * 
     * @param   provider {string}   the POI provider.
     * @param   category {string}   the POI category.
     */
    
    self.addPOICategory = function(provider, category) {
        requestBuilder.addPOICategory(provider, category);
    };
    

    /**
     * Removes a POI category.
     * 
     * @param   provider {string}   the POI provider.
     * @param   category {string}   the POI category.
     */
    
    self.removePOICategory = function(provider, category) {
        requestBuilder.removePOICategory(provider, category);
    };


    /**
     * Adds an SMO to the list of SMOs shown on the map. The SMO must be
     * registered on the server side before adding it on the client side.
     *
     * @param   smoId {var}         the id of the SMO that should be added to
     *                              the map.
     */
    self.addSMOId = function(smoId) {
        requestBuilder.addSMOId(smoId);
    };


    /**
     * Removes an SMO from the list of SMOs shown on the map.
     *
     * @param   smoId {var}         the id of the SMO that should be removed
     *                              from the map.
     */
    self.removeSMOId = function(smoId) {
        requestBuilder.removeSMOId(smoId);
    };


    // property modifier
    self._modifyDefaultStaticPOITooltips = function(propValue) {
        if (propValue) {
            createTooltips();
            for (var id in mAdditionalPOIs) {
                createTooltips(id);
            }
        } else {
            removeElements(TOOLTIP_PREFIX);
            for (var id in mAdditionalPOIs) {
                removeElements(TOOLTIP_PREFIX, id);
            }
        }
    };

    // overridden
    var superAddEventListener = self.addEventListener;
    self.addEventListener = function(vType, vFunction, vObject) {
        superAddEventListener.call(self, vType, vFunction, vObject);
        if (self.hasEventListeners(clazz.STATIC_POI_CLICKED)) {
            createClickAreas();
            for (var id in mAdditionalPOIs) {
                createClickAreas(id);
            }
        }
        if (self.hasEventListeners(clazz.STATIC_POI_HOVERED)) {
            createHoverAreas();
            for (var id in mAdditionalPOIs) {
                createHoverAreas(id);
            }
        }
    };
    
    // overridden
    var superRemoveEventListener = self.removeEventListener;
    self.removeEventListener = function(vType, vFunction, vObject) {
        superRemoveEventListener.call(self, vType, vFunction, vObject);
        if (!self.hasEventListeners(clazz.STATIC_POI_CLICKED)) {
            removeElements(CLICKAREA_PREFIX);
            for (var id in mAdditionalPOIs) {
                removeElements(CLICKAREA_PREFIX, id);
            }
        }
        if (!self.hasEventListeners(clazz.STATIC_POI_HOVERED)) {
            removeElements(HOVERAREA_PREFIX);
            for (var id in mAdditionalPOIs) {
                removeElements(HOVERAREA_PREFIX, id);
            }
        }
    };

});


/** The event type when new static POIs arrive. */
qxp.Class.STATIC_POIS_AVAILABLE = "staticPOIsAvailable";

/** The event type when a POI was clicked. */
qxp.Class.STATIC_POI_CLICKED = "staticPOIClicked";

/** The event type when the mouse is over a POI. */
qxp.Class.STATIC_POI_HOVERED = "staticPOIHovered";


/** Whether tooltips for static POIs should be shown. */
qxp.OO.addProperty({ name:"defaultStaticPOITooltips", type:qxp.constant.Type.BOOLEAN, defaultValue: true });

/**
 * A formatter for static POI tooltip texts. It receives the POI description as
 * its single parameter and must return the HTML formatted description.
 */
qxp.OO.addProperty({ name:"staticPOIFormatter", type:qxp.constant.Type.FUNCTION, allowNull:false });

/**
 * The delimiter for multi-part POI information. This delimiter is used by the
 * default {@link #staticPOIFormatter} to create line breaks for tooltips.
 */
qxp.OO.addProperty({ name:"staticPOIDelimiter", type:qxp.constant.Type.STRING, allowNull:true, defaultValue:"$\u00a7$" });

/** The pixel radius for recognizing a click. */
qxp.OO.addProperty({ name:"clickTolerance", type:qxp.constant.Type.NUMBER, allowNull:false, defaultValue: 7 });

/** The pixel radius for recognizing that the mouse is over a POI. */
qxp.OO.addProperty({ name:"hoverTolerance", type:qxp.constant.Type.NUMBER, allowNull:false, defaultValue: 7 });
