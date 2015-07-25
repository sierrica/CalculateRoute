function ConvertColor(numericColor) {
    var stringColor = "00000" + numericColor.toString(16);
    return "#" + stringColor.substring(stringColor.length - 6);
}


/**
 * Use this method to set a system name (for determining the server source). It returns a non-empty string if the server system is unknown.
 *
 * @param System {var} the server system to access map data (to be provided by PTV)
 */
function MapEngine_SetServer(System) {
    throw new Error("MapEngine_SetServer is not supported");
};


/**
 * Use this method to activate a map profile which modifies its default appearance. This method can be called before or after MapEngine_Initialize(). If called there *
 *
 * @param Profile {var} the map profile (to be provided by PTV), if empty the default profile is used
 */
function MapEngine_SetMapProfile (Profile) {
    throw new Error("MapEngine_SetMapProfile is not supported");
};


/**
 * Use this method to trigger loading and showing the map. Please note that this
 * method only triggers the initialization of the map, which send the event
 * OnInitialized(reason) when finished. Most other methods must not be called
 * before this event has been sent. Initialization was successful, if reason==0,
 * it failed otherwise and an error message is displayed.
 *
 * @param Interactive {var} Tells the control to respond to user interaction or not
 */
function MapEngine_Initialize (Interactive) {
    if (window._globalMap == null) {
        var parentElem = document.getElementById("ptvmap");
        try {
            window._globalMap = new com.ptvag.webcomponent.map.Map(parentElem);
            if (window.OnInitialized != null) {
                window.OnInitialized(0);
            }
        } catch (exc) {
            qxp.dev.log.Logger.ROOT_LOGGER.error("Showing map failed", null, exc);
            if (window.OnInitialized != null) {
                window.OnInitialized(1);
            }
        }
    }
};


function MapEngine_Shutdown () {
    if (window._globalMap != null) {
        window._globalMap.dispose();
        window._globalMap = null;
    }
};


function MapEngine_SetSize (width, height) {
    var parentElem = document.getElementById("ptvmap");
    parentElem.style.width = width + "px";
    parentElem.style.height = height + "px";
    window._globalMap.startLoggingAction("vectorapi:SetSize");
    try {
        window._globalMap.updateSize();
    } finally {
        window._globalMap.endLoggingAction();
    }
}


/**
 * Use this method to set whether kilometers (default) or miles are to be used for the scale. This method must be called after initializing the plugin. Please call Refresh to activate this setting.
 *
 * @param Miles {var} If true, miles are used for the scale, otherwise kilometers
 */
function MapEngine_UseMiles (Miles) {
    window._globalMap.getLayer("scale").setUseMiles(Miles);
};


/**
 * Use this method to set the event delay of the control.
 *
 * @param EventDelay {var} The delay before an event is fired, given in milliseconds, default is 3000
 */
function MapEngine_SetEventDelay (EventDelay) {
    throw new Error("MapEngine_SetEventDelay is not supported");
};


/**
 * Use this method to set the center of the map. This method does not execute a
 * refresh automatically, call Refresh if necessary. Please note that calling
 * refresh immediately sets the new center without any animation. Please note
 * the billing notes.
 *
 * @param X {var} x-co-ordinate of the new center of the map as a geodecimal
 *        value (e.g. 840400 -> 8&deg; 24' 14.4")
 * @param Y {var} y-co-ordinate of the new center of the map as a geodecimal
 *        value (e.g. 4901400 -> 49&deg; 0' 50.4")
 */
function MapEngine_SetCenter (X, Y) {
    var geoPoint = {x:X, y:Y};
    var suPoint = com.ptvag.webcomponent.map.CoordUtil.geoDecimal2SmartUnit(geoPoint);

    // TODO: Do not refresh
    window._globalMap.startLoggingAction("vectorapi:SetCenter");
    try {
        window._globalMap.setCenter(suPoint);
    } finally {
        window._globalMap.endLoggingAction();
    }
};


/**
 * Use this method to obtain the current center of the map. It returns the
 * X-value of the center co-ordinate
 */
function MapEngine_GetCenterX () {
    var suPoint = window._globalMap.getCenter();
    var geoPoint = com.ptvag.webcomponent.map.CoordUtil.smartUnit2GeoDecimal(suPoint);

    return Math.round(geoPoint.x);
};


/**
 * Use this method to obtain the current center of the map. It returns the
 * Y-value of the center co-ordinate
 */
function MapEngine_GetCenterY () {
    var suPoint = window._globalMap.getCenter();
    var geoPoint = com.ptvag.webcomponent.map.CoordUtil.smartUnit2GeoDecimal(suPoint);

    return Math.round(geoPoint.y);
};


/**
 * Use this method to set the current scale value of the map. This method does
 * not execute a refresh automatically, call Refresh if necessary. Please note
 * that calling refresh immediately sets the new scale without any animation.
 *
 * @param Scale {var} The scale value in SMArtUnits per 100 pixel
 */
function MapEngine_SetScale (Scale) {
    window._globalMap.startLoggingAction("vectorapi:SetScale");
    try {
        window._globalMap.setZoomInSmartUnitsPerPixel(Scale / 100);
    } finally {
        window._globalMap.endLoggingAction();
    }
};


/**
 * Use this method to obtain the current scale value of the map. It returns the
 * current scale of the map in SMArtUnits per 100 pixel.
 */
function MapEngine_GetScale () {
    return Math.round(window._globalMap.getZoomInSmartUnitsPerPixel() * 100);
};


/**
 * Use this method to set the current orientation angle of the map. This method does not execute a refresh automatically, call Refresh if necessary. Please note that calling refresh immediately sets the new orientation without any animation.
 *
 * @param Orientation {var} The angle in 1/100 degrees
 */
function MapEngine_SetOrientation (Orientation) {
    throw new Error("MapEngine_SetOrientation is not supported");
};


/**
 * Use this method to obtain the current orientation angle of the map.
 * 
 * @return {double} the current angle of the map.
 */
function MapEngine_GetOrientation () {
    // TODO: Where is the origin?
    return 0;
};


/**
 * Use this method to set the visible map section. This method does not execute
 * a refresh automatically, call Refresh if necessary. Please note that calling
 * refresh immediately sets the new center without any animation. Please note
 * the billing notes.
 *
 * @param left {var} x-co-ordinate of the top-left corner of the map as a
 *        geodecimal value (e.g. 840400 -> 8&deg; 24' 14.4")
 * @param top {var} y-co-ordinate of the top-left corner of the map as a
 *        geodecimal value (e.g. 4901400 -> 49&deg; 0' 50.4")
 * @param right {var} x-co-ordinate of the bottom-right corner of the map as a
 *        geodecimal value (e.g. 840400 -> 8&deg; 24' 14.4")
 * @param bottom {var} y-co-ordinate of the bottom-right corner of the map as a
 *        geodecimal value (e.g. 4901400 -> 49&deg; 0' 50.4")
 */
function MapEngine_SetMapRect (left, top, right, bottom) {
    var CoordUtil = com.ptvag.webcomponent.map.CoordUtil;

    var startSuPoint = CoordUtil.geoDecimal2SmartUnit({ x:left,  y:top });
    var endSuPoint   = CoordUtil.geoDecimal2SmartUnit({ x:right, y:bottom });

    window._globalMap.startLoggingAction("vectorapi:SetMapRect");
    try {
        window._globalMap.setRect(startSuPoint.x, startSuPoint.y, endSuPoint.x, endSuPoint.y);
    } finally {
        window._globalMap.endLoggingAction();
    }
};


/**
 * Use this method to obtain the currently visible map section.
 * 
 * @return {string} a comma-separated string with left,top,right,bottom.
 */
function MapEngine_GetMapRect () {
    var CoordUtil = com.ptvag.webcomponent.map.CoordUtil;

    var suRect = window._globalMap.getRect();

    var startGeoPoint = CoordUtil.smartUnit2GeoDecimal({x:suRect.left, y:suRect.top});
    var endGeoPoint = CoordUtil.smartUnit2GeoDecimal({x:suRect.right, y:suRect.bottom});

    return Math.round(startGeoPoint.x) + "," + Math.round(endGeoPoint.y) + ","
         + Math.round(endGeoPoint.x) + "," + Math.round(startGeoPoint.y);
};


/**
 * Use this method to set the maximum visible map section. The user cannot navigate to a map section outside this maximum visible map section..
 *
 * @param left {var} x-co-ordinate of the top-left corner of the section as a geodecimal value (e.g. 840400 -> 8&deg; 24' 14.4")
 * @param top {var} y-co-ordinate of the top-left corner of the section as a geodecimal value (e.g. 4901400 -> 49&deg; 0' 50.4")
 * @param right {var} x-co-ordinate of the bottom-right corner of the section as a geodecimal value (e.g. 840400 -> 8&deg; 24' 14.4")
 * @param bottom {var} y-co-ordinate of the bottom-right corner of the section as a geodecimal value (e.g. 4901400 -> 49&deg; 0' 50.4")
 */
function MapEngine_SetTotalRect (left, top, right, bottom) {
    var CoordUtil = com.ptvag.webcomponent.map.CoordUtil;

    var startSuPoint = CoordUtil.geoDecimal2SmartUnit({ x:left,  y:top });
    var endSuPoint   = CoordUtil.geoDecimal2SmartUnit({ x:right, y:bottom });

    window._globalMap.startLoggingAction("vectorapi:SetTotalRect");
    try {
        window._globalMap.setClipRect(startSuPoint.x, startSuPoint.y, endSuPoint.x, endSuPoint.y);
    } finally {
        window._globalMap.endLoggingAction();
    }
};


/**
 * Use this method to obtain the current maximum visible map section.
 * 
 * @return {string} a comma-separated string with left,top,right,bottom.
 */
function MapEngine_GetTotalRect () {
    var suRect = window._globalMap.getClipRect();

    var startGeoPoint = CoordUtil.smartUnit2GeoDecimal({x:suRect.left, y:suRect.top});
    var endGeoPoint = CoordUtil.smartUnit2GeoDecimal({x:suRect.right, y:suRect.bottom});

    return Math.round(startGeoPoint.x) + "," + Math.round(endGeoPoint.y) + ","
         + Math.round(endGeoPoint.x) + "," + Math.round(startGeoPoint.y);
};


/**
 * Use this method to move the map.
 *
 * @param X {var} Move the map X percent of half of the map width to the
 *        right (if positive) or to the left (if negative)
 * @param Y {var} Move the map Y percent of half of the map height to the
 *        top (if positive) or to the bottom (if negative)
 */
function MapEngine_MoveMap (X, Y) {
    window._globalMap.startLoggingAction("vectorapi:MoveMap");
    try {
        window._globalMap.moveCenterInPercent(X / 200, Y / 200);
    } finally {
        window._globalMap.endLoggingAction();
    }
};


/**
 * Use this method to zoom the map.
 *
 * @param Factor {var} If positive the map is zoomed in, if negative it is
 *        zoomed out by the given factor
 */
function MapEngine_ZoomMap (Factor) {
    var zoomInSu = window._globalMap.getZoomInSmartUnitsPerPixel();
    //window._globalMap.info("zoomInSu: " + zoomInSu);

    var newZoomInSu;
    if (Factor > 0) {
        newZoomInSu = zoomInSu / Factor;
    } else {
        newZoomInSu = zoomInSu * Math.abs(Factor);
    }
    //window._globalMap.info("newZoomInSu: " + newZoomInSu);

    window._globalMap.startLoggingAction("vectorapi:ZoomMap");
    try {
        window._globalMap.setZoomInSmartUnitsPerPixel(newZoomInSu);
    } finally {
        window._globalMap.endLoggingAction();
    }
};


/**
 * Use this method to draw a circle on top of the map. It returns a non-empty string if a parameter is invalid (e.g. the priority value).
 *
 * @param ID {var} The ID of the circle. Make sure that no other circle carries the same ID, otherwise the existing one will be overwritten
 * @param X {var} x-co-ordinate of the circle as a geodecimal value (e.g. 840400 -> 8&deg; 24' 14.4")
 * @param Y {var} y-co-ordinate of the circle as a geodecimal value (e.g. 4901400 -> 49&deg; 0' 50.4")
 * @param Color {var} The color of the circle
 * @param PixelSize {var} The diameter of the circle in pixels
 * @param Priority {var} The draw priority.
 */
function MapEngine_ShowCircle (ID, X, Y, Color, PixelSize, Priority) {
    var CoordUtil = com.ptvag.webcomponent.map.CoordUtil;

    var suPoint = CoordUtil.geoDecimal2SmartUnit({x: X, y: Y});

    window._globalMap.getLayer("vector").showCircle(suPoint.x, suPoint.y, ConvertColor(Color), (PixelSize == 0 ? null : PixelSize), Priority, "vectorapiadapter_circle_" + ID);
};


/**
 * Use this method to delete a circle from the map.
 *
 * @param ID {var} The ID of the circle to delete
 */
function MapEngine_HideCircle (ID) {
    window._globalMap.getLayer("vector").hideElement("vectorapiadapter_circle_" + ID);
};


/**
 * Use this method to draw a text on top of the map. It returns a non-empty string if a parameter is invalid (e.g. the priority value).
 * <p>
 * The possible alignment values are:
 * <ul>
 *     <li><strong>1</strong> left</li>
 *     <li><strong>2</strong> mid</li>
 *     <li><strong>4</strong> right</li>
 *     <li><strong>16</strong> top</li>
 *     <li><strong>32</strong> mid</li>
 *     <li><strong>64</strong> bottom</li>
 * </ul>
 * </p>
 *
 * @param ID {var} The ID of the text. Make sure that no other text carries the same ID, otherwise the existing one will be overwritten
 * @param X {var} x-co-ordinate of the text as a geodecimal value (e.g. 840400 -> 8&deg; 24' 14.4")
 * @param Y {var} y-co-ordinate of the text as a geodecimal value (e.g. 4901400 -> 49&deg; 0' 50.4")
 * @param Color {var} The color of the text
 * @param PixelSize {var} The size of the text in pixels
 * @param Alignment {var} A value of the enumeration above which specifies which point of the drawn text will lie on the co-ordinate given
 * @param Text {var} The text to be drawn
 * @param Priority {var} The draw priority.
 */
function MapEngine_ShowText (ID, X, Y, Color, PixelSize, Alignment, Text, Priority) {
    var CoordUtil = com.ptvag.webcomponent.map.CoordUtil;

    var suPoint = CoordUtil.geoDecimal2SmartUnit({x: X, y: Y});

    window._globalMap.getLayer("vector").showText(suPoint.x, suPoint.y,
                                                  ConvertColor(Color),
                                                  (PixelSize == 0 ? null : PixelSize),
                                                  Alignment,Text, Priority,
                                                  "vectorapiadapter_text_" + ID);
};


/**
 * Use this method to delete a text from the map.
 *
 * @param ID {var} The ID of the text to delete
 */
function MapEngine_HideText (ID) {
    window._globalMap.getLayer("vector").hideElement("vectorapiadapter_text_" + ID);
};


/**
 * Use this method to draw a line, i.e. a route or a trace. It returns a non-empty string if a parameter is invalid (e.g. the priority value, or the line string does not consist of an even number of co-ordinate values).
 *
 * @param ID {var} The ID of the line. Make sure that no other line carries the same ID, otherwise the existing one will be overwritten. If ID >= 0 the line is treated as a route and covered by streets.
 * @param Color {var} The color of the line
 * @param PixelSize {var} The width of the line in pixels, if negative the corresponding positive value is added to the width of a motorway. If ID >= 0 and PixelSize == 0, PixelSide defaults to -8.
 * @param Coordinates {var} A string carrying a comma separated list of x- and y-co-ordinates as geodecimal values
 * @param Priority {var} The draw priority. If ID >= 0, Priority defaults to 100 (route)
 */
function MapEngine_ShowLine (ID, Color, PixelSize, Coordinates, Priority) {
    var CoordUtil = com.ptvag.webcomponent.map.CoordUtil;

    var newCoordinates = Coordinates.split(",");
    var suPoint;

    for (var i = 0; i < newCoordinates.length; i += 2) {
        suPoint = CoordUtil.geoDecimal2SmartUnit({x: parseFloat(newCoordinates[i]),
                                                  y: parseFloat(newCoordinates[i+1])});
        newCoordinates[i] = suPoint.x;
        newCoordinates[i+1] = suPoint.y;
    }

    window._globalMap.getLayer("vector").showLine(ConvertColor(Color),
                                                  (PixelSize == 0 ? null : (PixelSize < 0 ? -PixelSize : PixelSize)),
                                                  newCoordinates, Priority,
                                                  "vectorapiadapter_line_" + ID);
};


/**
 * Use this method to delete a line from the map.
 *
 * @param ID {var} The ID of the line to delete
 */
function MapEngine_HideLine (ID) {
    window._globalMap.getLayer("vector").hideElement("vectorapiadapter_line_" + ID);
};


/**
 * Use this method to add a bitmap to the bitmap list. No refresh is executed, call ShosPOIs(TRUE). It returns a non-empty string if a parameter is invalid (e.g. the priority value).
 *
 * @param ID {var} The ID of the bitmap. Make sure that no other bitmap carries the same ID, otherwise the existing one will be overwritten
 * @param X {var} x-co-ordinate of the bitmap as a geodecimal value (e.g. 840400 -> 8&deg; 24' 14.4")
 * @param Y {var} y-co-ordinate of the bitmap as a geodecimal value (e.g. 4901400 -> 49&deg; 0' 50.4")
 * @param Source {var} The bitmap in the bmp (24 bit color depth) format base64 encoded
 * @param SourceType {var} 0 if Source is base64 encoded, 1 if it is an absolute path
 * @param Alignment {var} A value of the enumeration below which specifies which point of the bitmap will lie on the co-ordinate given
 * @param Transparency {var} The color value which is not to be drawn. -1 if no transparent color, -2 if the upper left corner of the opm image is to be the transparent color
 * @param Priority {var} The draw priority.
 */
function MapEngine_SetPOI (ID, X, Y, Source, SourceType, Alignment, Transparency, Priority) {
    // SourceType is ignored, and Source is always expected to be a URL
    // (or null for a default image)
    var CoordUtil = com.ptvag.webcomponent.map.CoordUtil;

    var suPoint = CoordUtil.geoDecimal2SmartUnit({x: X, y: Y});

    window._globalMap.getLayer("vector").showImageMarker(suPoint.x, suPoint.y,
                                                         Source, Alignment,
                                                         Priority,
                                                         "vectorapiadapter_poi_" + ID);
};


/**
 * Use this method to delete a bitmaps from the bitmap list. No refresh is executed, call ShosPOIs(TRUE).
 *
 * @param ID {var} The ID of the bitmap to delete
 */
function MapEngine_DelPOI (ID) {
    window._globalMap.getLayer("vector").hideElement("vectorapiadapter_poi_" + ID);
};


/**
 * Use this method to hide or show the bitmaps on top of the map. Refreshing the map is not necessary.
 *
 * @param bShow {var} Shows the bitmaps if TRUE, hides them otherwise
 */
function MapEngine_ShowPOIs (bShow) {
    //throw new Error("MapEngine_ShowPOIs is not supported");
    // do nothing for now (since all POIs are shown immediately)
};


/**
 * Use this method to display a hint. It returns the id of the hint, use this ID to delete the hint
 *
 * @param X {var} x-co-ordinate of the hint as a geodecimal value (e.g. 840400 -> 8&deg; 24' 14.4")
 * @param Y {var} y-co-ordinate of the hint as a geodecimal value (e.g. 4901400 -> 49&deg; 0' 50.4")
 * @param MaxScale {var} The maximum scale value up to which the hint is to be displayed (default is 100)
 * @param Tolerance {var} The maximum square distance to the given co-ordinate within which the hint is to be displayed (default is 15)
 * @param Text {var} The text to be displayed
 */
function MapEngine_ShowHint (X, Y, MaxScale, Tolerance, Text) {
    var CoordUtil = com.ptvag.webcomponent.map.CoordUtil;

    var suPoint = CoordUtil.geoDecimal2SmartUnit({x: X, y: Y});

    return window._globalMap.getLayer("vector").showTooltip(suPoint.x, suPoint.y,
                                                            MaxScale, Tolerance,
                                                            Text, null, null);
};


/**
 * Use this method to disable a hint.
 *
 * @param ID {var} The ID of the hint to delete
 */
function MapEngine_HideHint (ID) {
    window._globalMap.getLayer("vector").hideElement(ID);
};


/**
 * Use this method to disable all hints.
 */
function MapEngine_HideAllHints () {
    throw new Error("MapEngine_HideAllHints is not supported");
};


/**
 * Use this method to execute a helicopter flight.
 */
function MapEngine_Helicopter () {
    throw new Error("MapEngine_Helicopter is not supported");
};


/**
 * Use this method to execute a refresh. Please note the billing notes.
 */
function MapEngine_Refresh () {
    // We don't need a refresh, all operation work instantly
    // TODO: Add a bulk mode
};


/**
 * Use this method to have PTV xVector Map Plugin set the current map section centered to one or more previously set POIs. Please note the billing notes.
 *
 * @param PoiList {var} Whitespace separated list of POI IDs (currently only circles)
 * @param PoiType {var} Must be 0
 * @param CenterIfVisible {var} If 'false' no zoom or scroll operation is executed if all selected POIs are already visible
 * @param KeepScale {var} If 'true' no zoom operation is executed. If the current scale does not allow displaying all selected POIs this parameter is ignored
 * @param Animate {var} Selects whether the zoom and/or scroll operation is to be animated or not
 */
function MapEngine_CenterMap (PoiList, PoiType, CenterIfVisible, KeepScale, Animate) {
    if (PoiType != 0) {
        throw new Error("PoiType must be zero");
    }

    var vectorLayer = window._globalMap.getLayer("vector");
    var poiIdArr = PoiList.split(/\s+/);
    var poiArr = [];
    for (var i = 0; i < poiIdArr.length; i++) {
        var circle = vectorLayer.getElement("vectorapiadapter_circle_" + poiIdArr[i]);
        if (circle == null) {
            throw new Error("There is no circle width ID '" + poiIdArr[i]
                + "' (alias 'vectorapiadapter_circle_" + poiIdArr[i] + "')");
        }
    	poiArr.push(circle);
    }

    // TODO: Animate is not supported
    window._globalMap.setViewToPoints(poiArr, !CenterIfVisible, KeepScale);
};


/**
 * Use this method to set whether map interactions are to be animated or not. This applies to methods MoveMap, ZoomMap, SetVisibleMapSection, and any mouse interaction with the control, but not to Helicopter.
 *
 * @param Animate {boolean} Switch on/off animation
 */
function MapEngine_AnimateMapInteractions (Animate) {
    window._globalMap.setAnimate(Animate);
};


/**
 * Use this method to set whether overview map is to be shown.
 *
 * @param Show {var} Switch on/off overview map
 */
function MapEngine_OverviewMap (Show) {
    window._globalMap.getLayer("overview").setEnabled(Show);
};


/**
 * Use this method to set a new visible section of the map.
 *
 * @param X {var} x-co-ordinate of the new center of the map as a geodecimal
 *        value (e.g. 840400 -> 8&deg; 24' 14.4"), 999999999 keeps the current center
 * @param Y {var} y-co-ordinate of the new center of the map as a geodecimal
 *        value (e.g. 4901400 -> 49&deg; 0' 50.4")
 * @param Scale {var} The scale value in SMArtUnits per 100 pixel. -1 keeps the current scale
 * @param Orientation {var} The angle in 1/100 degrees. -1 keeps the current angle
 */
function MapEngine_SetVisibleMapSection (X, Y, Scale, Orientation) {
    window._globalMap.startLoggingAction("vectorapi:SetVisibleMapSection");
    try {
        MapEngine_SetScale(Scale);
        MapEngine_SetCenter(X, Y);
        // Not supported: Orientation
    } finally {
        window._globalMap.endLoggingAction();
    }
};


/**
 * Use this method to activate/deactivate user interactors.
 *
 * @param Element {var} The user interface element
 * @param Show {var} Switch on/off the element
 */
function MapEngine_ShowUserInterfaceElement (Element, Show) {
    throw new Error("MapEngine_ShowUserInterfaceElement is not supported");
};


/**
 * Use this method to activate/deactivate user interactors.
 *
 * @param Element {var} The user interface element (only valid for buttons)
 * @param Bitmap {var} The bitmap in the bmp (24 bit color depth) format base64 encoded
 */
function MapEngine_SetToolbarBitmap (Element, Bitmap) {
    throw new Error("MapEngine_SetToolbarBitmap is not supported");
};


/**
 * Use this method add a "Scalabe Map Objects" provider. If ProviderType == 0, it returns a non-empty string if the ProviderUrl cannot be retrieved. All other runtime errors are ignored, i.e. error retrieving a url dynamically or error displaying an icon.
 *
 * @param Name {var} The name of the Provider
 * @param ProviderType {var} Type of the provider: 0 - static 1 - dynamic
 * @param ProviderUrl {var} The URL of the provider
 * @param IconUrl {var} The URL for the bitmap Icons
 * @param ExtendedParams {var} Extended configuration parameters
 */
function MapEngine_SetSMOProvider (Name, ProviderType, ProviderUrl, IconUrl, ExtendedParams) {
    throw new Error("MapEngine_SetSMOProvider is not supported");
};
