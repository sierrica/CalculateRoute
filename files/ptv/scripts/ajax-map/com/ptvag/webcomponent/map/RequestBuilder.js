/**
 * Builds requests for loading map images.
 *
 * @event   poiCategoriesChanged {qxp.event.type.Event}  fired when the visible
 *                              POI categories have changed (and also when an
 *                              SMO is added or removed). This is mainly used
 *                              internally inside the map to initiate a redraw.
 * 
 * @param parentMap {com.ptvag.webcomponent.map.Map} the map to create the
 *        requests for. (Used for getting the current clip rect)
 * @param defaultVisible {boolean} whether all map layers should be visible by
 *        default.
 */
qxp.OO.defineClass("com.ptvag.webcomponent.map.RequestBuilder", qxp.core.Target,
function(parentMap, defaultVisible) {
    qxp.core.Object.call(this);

    var self = this;
    var map = com.ptvag.webcomponent.map;

    var mMap = parentMap;

    var FIND_ALL_QUESTIONMARKS = new RegExp('\\?', 'g');
    var FIND_ALL_AMPERSANDS = new RegExp('&', 'g');
    var FIND_ALL_EQUAL_SIGNS = new RegExp('=', 'g');
    
    var mVisibleLayers = { Town: defaultVisible,
                           Street: defaultVisible,
                           Border: defaultVisible,
                           Height: defaultVisible,
                           Other: defaultVisible,
                           Rail: defaultVisible,
                           Sea: defaultVisible,
                           Water: defaultVisible,
                           Woodland: defaultVisible,
                           Land: defaultVisible,
                           Bridge: defaultVisible,
                           Tunnel: defaultVisible,
                           Background: defaultVisible };
    var mLayerNames = [];
    
    var mPOICategories = {};
    var mNeedEncodedPOICategories = false;
    var mSMOIds = {};
    var mBulkModeTimer = null;


    /**
     * Sets whether a certain map layer should be visible.
     *
     * @param layer {string} the name of the map layer (e.g. "Town" or "Street")
     * @param visible {boolean} whether the layer should be visible in requested
     *        map images.
     */
    self.setVisible = function(layer, visible) {
        mVisibleLayers[layer] = visible;
    };


    /**
     * Adds a POI category.
     * 
     * @param   provider {string}   the POI provider.
     * @param   category {string}   the POI category.
     */
    
    self.addPOICategory = function(provider, category) {
        if (!self.supportsServerDrawnObjects()) {
            throw new Error("addPOICategory() called on a request builder that doesn't support static POIs");
        }
        if (provider.indexOf(",") >= 0 || provider.indexOf("$") >= 0 ||
            category.indexOf(",") >= 0 || category.indexOf("$") >= 0) {
            mNeedEncodedPOICategories = true;
        }
        var providerHash = mPOICategories[provider];
        if (providerHash == null) {
            providerHash = {};
            mPOICategories[provider] = providerHash;
        }
        providerHash[category] = 42;

        firePOICategoriesChanged();
    };
    

    /**
     * Removes a POI category.
     * 
     * @param   provider {string}   the POI provider.
     * @param   category {string}   the POI category.
     */
    
    self.removePOICategory = function(provider, category) {
        if (!self.supportsServerDrawnObjects()) {
            throw new Error("removePOICategory() called on a request builder that doesn't support static POIs");
        }
        var providerHash = mPOICategories[provider];
        if (providerHash != null) {
            delete providerHash[category];
            var providerEmpty = true;
            for (var category in providerHash) {
                providerEmpty = false;
                break;
            }
            if (providerEmpty) {
                delete mPOICategories[provider];
            }
        }

        firePOICategoriesChanged();
    };


    /**
     * Registers a hint.
     * 
     * @param   hintId {string}     the id of the hint (can be any string).
     * @param   hintData {string}   the contents of the hint.
     * @param   callback {function} a callback function that is executed when
     *                              the hint has been registered. The function
     *                              is called with the hintId as the first
     *                              parameter id and an error object as the
     *                              second. If hint registration has succeeded,
     *                              the second parameter is null. Do not use
     *                              the hint id until this callback function
     *                              has been invoked!
     */
    
    self.registerHint = function(hintId, hintData, callback) {
        com.ptvag.webcomponent.map.SERVICE.callAsync(callback, "registerHint",
            hintId, hintData);
    };
    
    
    /**
     * Adds a SMO ID.
     * 
     * @param smoId {string} the ID that was used when registering the SMO at
     *        the map servlet.
     */
    self.addSMOId = function(smoId) {
        // TODO: Handle SMOs and static POIs in a common way
        if (!self.supportsServerDrawnObjects()) {
            throw new Error("addSMOId() called on a request builder that doesn't support SMO IDs");
        }

        mSMOIds[smoId] = 42;

        firePOICategoriesChanged();
    }


    /**
     * Removes a SMO ID.
     * 
     * @param smoId {string} the ID that was used when registering the SMO at
     *        the map servlet.
     */
    self.removeSMOId = function(smoId) {
        // TODO: Handle SMOs and static POIs in a common way
        if (!self.supportsServerDrawnObjects()) {
            throw new Error("removeSMOId() called on a request builder that doesn't support SMO IDs");
        }

        delete mSMOIds[smoId];

        firePOICategoriesChanged();
    };


    /**
     * Fires the "poiCategoriesChanged" event to all registered listeners.
     */
    var doFirePOICategoriesChanged = function() {
        mBulkModeTimer = null;
        if (self.getDisposed()) {
            return;
        }
        if (self.hasEventListeners("poiCategoriesChanged")) {
            self.dispatchEvent(new qxp.event.type.Event("poiCategoriesChanged"));
        }
    };


    var firePOICategoriesChanged = function() {
        if (mBulkModeTimer != null) {
            return;
        }
        if (self.hasEventListeners("poiCategoriesChanged")) {
            mBulkModeTimer = window.setTimeout(doFirePOICategoriesChanged, 0);
        }
    };


    /**
     * Returns whether there are any active POI categories.
     * 
     * @return  {boolean}           whether there are active POI categories.
     */
    self.hasPOICategories = function() {
        for (var provider in mPOICategories) {
            return true;
        }
        return false;
    };


    /**
     * Returns whether there are any active SMOs.
     * 
     * @return {boolean} whether there are active SMOs.
     */
    self.hasSMOs = function() {
        for (var provider in mSMOIds) {
            return true;
        }
        return false;
    };


    /**
     * Returns whether there are any active server drawn objects
     * (like static POIs or SMOs).
     * 
     * @return {boolean} whether there are active server drawn objects
     */
    self.hasServerDrawnObjects = function() {
        return self.hasPOICategories() || self.hasSMOs();
    };


    /**
     * Encodes all added POI categories into a string.
     * 
     * @return  {string}            the categories (may be an empty string if
     *                              there are no categories).
     */
    var encodePOICategories = function() {
        var retVal = "";
        for (var provider in mPOICategories) {
            for (var category in mPOICategories[provider]) {
                if (retVal != "") {
                    retVal += ",";
                }
                if (mNeedEncodedPOICategories) {
                    retVal += encodeURIComponent(provider) + "$" +
                              encodeURIComponent(category);
                } else {
                    retVal += provider + "$" + category;
                }
            }
        }
        return encodeURIComponent(retVal);
    };


    /**
     * Returns all SMO IDs as comma separated list.
     *
     * @return {string} the SMO IDs as comma separated list.
     */
    var encodeSMOIds = function() {
        var retVal = "";
        for (var smoId in mSMOIds) {
            if (retVal != "") {
                retVal += ",";
            }
            retVal += smoId;
        }
        return encodeURIComponent(retVal);
    };


    /**
     * Returns whether this request builder supports server drawn objects
     * (like static POIs or SMOs).
     * 
     * @return {boolean} <code>true</code> if this request builder supports
     *         server drawn objects, <code>false</code> otherwise.
     */
    self.supportsServerDrawnObjects = function() {
        var serverDrawnObjectManager = mMap.getServerDrawnObjectManager();
        return (serverDrawnObjectManager != null) &&
               (serverDrawnObjectManager.getRequestBuilder() == self);
    };


    /**
     * Builds a request for loading a map image.
     * 
     * @param left {double} The left border of the map in PTV mercator units.
     * @param top {double} The top border of the map in PTV mercator units.
     * @param right {double} The right border of the map in PTV mercator units.
     * @param bottom {double} The bottom border of the map in PTV mercator units.
     * @param width {int} The width of the map in pixels.
     * @param height {int} The height of the map in pixels.
     * @param loggingInfo {string} The logging info to send to the server.
     * @param mapVersion {string, null} the version to request from the server.
     * @param angle {int, 0} the rotation angle of the map.
     * @return {Map} The request.
     *         <p>
     *         If the requested image violates the map's clip rect, it will be
     *         clipped. If the image gets too small (the xMap server won't
     *         deliver small images), a negative clipping will be done on the
     *         opposite side (in this case the <code>clip*</code> properties may
     *         be negative). If the opposite side was clipped too, the image
     *         will be clipped completely.
     *         <p>
     *         The return value has the following properties:
     *         <ul>
     *         <li>completelyClipped: true when the image is completely in
     *         the clipping zone or when it was clipped from two sides and got
     *         too small.</li>
     *         <li>url: The URL that gets the wanted map image.</li>
     *         <li>width: The (clipped) width of the map in pixels.</li>
     *         <li>height: The (clipped) height of the map in pixels.</li>
     *         <li>clipLeft: The number of pixels that had to be clipped from
     *             the left in order to obey the clip rect.</li>
     *         <li>clipRight: The number of pixels that had to be clipped from
     *             the right in order to obey the clip rect.</li>
     *         <li>clipTop: The number of pixels that had to be clipped from
     *             the top in order to obey the clip rect.</li>
     *         <li>clipBottom: The number of pixels that had to be clipped from
     *             the bottom in order to obey the clip rect.</li>
     *         </ul>
     */
    self.buildRequest = function(left, top, right, bottom, width, height,
                                 loggingInfo, mapVersion, angle)
    {
        if (angle == null) {
            angle = 0;
        }
    
        var grainSize = self.getGrainSize();
        if (grainSize > 1) {
            width = Math.round(width / grainSize);
            height = Math.round(height / grainSize);
        }
    
        // Check the map's clip rect
        var clipRect = mMap.getClipRectInMercator();

        if ((clipRect.right  != null && left   >= clipRect.right)  ||
            (clipRect.left   != null && right  <= clipRect.left)   ||
            (clipRect.bottom != null && top    <= clipRect.bottom) ||
            (clipRect.top    != null && bottom >= clipRect.top))
        {
            // This image is fully clipped
            return { completelyClipped:true };
        }

        var clipLeftMerc   = (clipRect.left   != null && clipRect.left   > left)   ? clipRect.left   : left;
        var clipRightMerc  = (clipRect.right  != null && clipRect.right  < right)  ? clipRect.right  : right;
        var clipTopMerc    = (clipRect.top    != null && clipRect.top    < top)    ? clipRect.top    : top;
        var clipBottomMerc = (clipRect.bottom != null && clipRect.bottom > bottom) ? clipRect.bottom : bottom;

        var clipLeftPix = 0;
        var clipRightPix = 0;
        var clipTopPix = 0;
        var clipBottomPix = 0;
        var clipWidthPix = width;
        var clipHeightPix = height;
        if (clipLeftMerc != left || clipRightMerc != right) {
            var origWidthMerc = right - left;
            var newWidthMerc = clipRightMerc - clipLeftMerc;
            clipWidthPix = Math.round(width * newWidthMerc / origWidthMerc);
            clipLeftPix  = Math.round(width * (clipLeftMerc - left)   / origWidthMerc);
            clipRightPix = width - clipWidthPix - clipLeftPix;

            // Check whether the image got too small
            if (clipWidthPix < map.RequestBuilder.MIN_IMAGE_SIZE) {
                var missingPix = map.RequestBuilder.MIN_IMAGE_SIZE - clipWidthPix;
                var missingMerc = missingPix * (right - left) / width;
                // The image is too small
                // -> Try to add some pixels on the opposite side
                if (clipLeftPix != 0) {
                    if (clipRightPix != 0) {
                        // The image was clipped from both sides
                        // -> clip it completely
                        return { completelyClipped:true };
                    }
                    // The image was clipped from the left
                    clipRightPix = -missingPix;
                    clipRightMerc += missingMerc;
                } else {
                    // The image was clipped from the right
                    clipLeftPix = -missingPix;
                    clipLeftMerc -= missingMerc;
                }
                clipWidthPix = map.RequestBuilder.MIN_IMAGE_SIZE;
            }
        }
        if (clipTopMerc != top || clipBottomMerc != bottom) {
            var origHeightMerc = top - bottom;
            var newHeightMerc = clipTopMerc - clipBottomMerc;
            clipHeightPix = Math.round(height * newHeightMerc / origHeightMerc);
            clipBottomPix = Math.round(height * (clipBottomMerc - bottom) / origHeightMerc);
            clipTopPix    = height - clipHeightPix - clipBottomPix;

            // Check whether the image got too small
            if (clipHeightPix < map.RequestBuilder.MIN_IMAGE_SIZE) {
                var missingPix = map.RequestBuilder.MIN_IMAGE_SIZE - clipHeightPix;
                var missingMerc = missingPix * (top - bottom) / height;
                // The image is too small
                // -> Try to add some pixels on the opposite side
                if (clipBottomPix != 0) {
                    if (clipTopPix != 0) {
                        // The image was clipped from both sides
                        // -> clip it completely
                        return { completelyClipped:true };
                    }
                    // The image was clipped from the bottom
                    clipTopPix = -missingPix;
                    clipTopMerc += missingMerc;
                } else {
                    // The image was clipped from the top
                    clipBottomPix = -missingPix;
                    clipBottomMerc -= missingMerc;
                }
                clipHeightPix = map.RequestBuilder.MIN_IMAGE_SIZE;
            }
        }

        var requestWidth = clipWidthPix;
        var requestHeight = clipHeightPix;
        var scaleFactor = map.RequestBuilder.RESOLUTION_SCALE_FACTOR;
        if (scaleFactor != 1) {
            requestWidth = Math.round(requestWidth*scaleFactor);
            requestHeight = Math.round(requestHeight*scaleFactor);
        }
        var urlParams =
            "?left=" + Math.round(clipLeftMerc + self.getDebugOffsetLeft()) +
            "&right=" + Math.round(clipRightMerc + self.getDebugOffsetRight()) +
            "&top=" + Math.round(clipTopMerc + self.getDebugOffsetTop()) +
            "&bottom=" + Math.round(clipBottomMerc + self.getDebugOffsetBottom()) +
            "&width=" + requestWidth + "&height=" + requestHeight;
        if (angle != 0) {
            urlParams += "&angle=" + angle;
        }
        if (mapVersion != null) {
            urlParams += "&version=" + encodeURIComponent(mapVersion);
        }
        var hint = self.getHint();
        if (hint != null) {
            urlParams += "&hint=" + encodeURIComponent(hint);
        }
        var visibleLayers = "";
        var hiddenLayers = "";
        var townVisible = false;
        for (var i = 0; i < mLayerNames.length; ++i) {
            var layer = mLayerNames[i];
            if (mVisibleLayers[layer]) {
                if (visibleLayers != "") {
                    visibleLayers += ",";
                }
                visibleLayers += layer;
                if (layer == "Town") {
                    townVisible = true;
                }
            } else {
                if (hiddenLayers != "") {
                    hiddenLayers += ",";
                }
                hiddenLayers += layer;
            }
        }
        if (hiddenLayers.length > visibleLayers.length && visibleLayers.length != 0) {
            hiddenLayers = "";
        } else {
            visibleLayers = "";
        }
        if (visibleLayers != "") {
            urlParams += "&visibleLayers=" + visibleLayers;
        }
        if (hiddenLayers != "") {
            urlParams += "&hiddenLayers=" + hiddenLayers;
        }
        if (self.getSat()) {
            urlParams += "&sat=true";
        }
        if (self.isTransparent()) {
            urlParams += "&transparent=true";
            if (townVisible) {
                // append the logging info
                urlParams += "&loggingInfo=" + encodeURIComponent(loggingInfo);
            }
        }
        if (self.supportsServerDrawnObjects()) {
            // append the static POI categories
            var poiCategories = encodePOICategories();
            if (poiCategories != "") {
                if (mNeedEncodedPOICategories) {
                    urlParams += "&poiCategoriesEnc=" + poiCategories;
                } else {
                    urlParams += "&poiCategories=" + poiCategories;
                }
            }

            // append the SMO IDs
            var smoIds = encodeSMOIds();
            if (smoIds != "") {
                urlParams += "&smoIds=" + smoIds;
            }
        }

        var imageId = null;
        if (townVisible || !map.Map.ENABLE_CACHING) {
            // Images with the town layer visible are never cached and use
            // conventional URL parameters. They also have a session id in the
            // request.

            // prevent caching
            imageId = (new Date()).getTime();
            if (imageId <= map.RequestBuilder.LAST_IMAGE_ID) {
                imageId = map.RequestBuilder.LAST_IMAGE_ID + 1;
            }
            map.RequestBuilder.LAST_IMAGE_ID = imageId;
            imageId = "" + imageId;
            urlParams += "&imageId=" + imageId;
        }
        var profileGroup = mMap.getProfileGroup();
        if (profileGroup != null) {
            urlParams += "&profileGroup=" + encodeURIComponent(profileGroup);
        }
        var backendServer = self.getBackendServer();
        if (backendServer == null) {
            backendServer = mMap.getBackendServer();
        }
        if (backendServer != null) {
            urlParams += "&backendServer=" + encodeURIComponent(backendServer);
        }
        if (self.getHideLabelsAndStreets()) {
            urlParams += "&hideLabelsAndStreets=true";
        }
        if (townVisible) {
            // append the custom parameters
            if (map.RequestBuilder.CUSTOM_PARAMETER != null) {
                urlParams += "&customParams=" + encodeURIComponent(map.RequestBuilder.CUSTOM_PARAMETER);
            }
            urlParams += "&" + map.RequestBuilder.getTokenName() + "=" + encodeURIComponent(map.RequestBuilder.getTokenValue());

            var url = map.MapUtil.rewriteURL("/MapServlet" + urlParams, false, "");
        } else {
            // Images without a visible town layer are cached and use path
            // parameters (for easy proxy caching configuration). They don't
            // contain a session id (so that they are cached across sessions).
            var numX = Math.round(right / (right - left));
            var numY = Math.round(top / (top - bottom));
            var index = (numX + numY) % 3;
            if (index == 0) {
                var serverPathPrefix = map.RequestBuilder.SERVER1;
            } else if (index == 1) {
                serverPathPrefix = map.RequestBuilder.SERVER2;
            } else {
                serverPathPrefix = map.RequestBuilder.SERVER3;
            }
            if (serverPathPrefix == null) {
                serverPathPrefix = map.Map.STATIC_SERVER;
            }
            if (serverPathPrefix == null) {
                serverPathPrefix = qxp.core.ServerSettings.serverPathPrefix;
            }
            url = serverPathPrefix + "/MapServlet" +
                urlParams.replace(FIND_ALL_QUESTIONMARKS, '/')
                         .replace(FIND_ALL_AMPERSANDS, '/')
                         .replace(FIND_ALL_EQUAL_SIGNS, '_');
        }
        
        return { url:url, width:clipWidthPix, height:clipHeightPix,
            clipLeft:clipLeftPix, clipRight:clipRightPix,
            clipTop:clipTopPix, clipBottom:clipBottomPix,
            imageId: imageId};
    };


    // overridden
    var superDispose = self.dispose;
    self.dispose = function() {
        if (self.getDisposed()) {
            return;
        }
        if (mBulkModeTimer != null) {
            window.clearTimeout(mBulkModeTimer);
        }
        superDispose.apply(self, arguments);
    };


    var init = function() {
        for (var layerName in mVisibleLayers) {
            mLayerNames.push(layerName);
        }
        mLayerNames.sort();
    };
    init();
});


/**
 * Returns the host part of a URL.
 *
 * @param   urlStr {string}         the URL.
 *
 * @return  {string}                the host part of the URL.
 */
qxp.Class.getHost = function(urlStr) {
    if (urlStr == null)
        return null;
    var tmpStr = "" + urlStr;
    tmpStr = tmpStr.replace(/^.*\/\//,"");
    tmpStr = tmpStr.replace(/:.*$/,"");
    tmpStr = tmpStr.replace(/\/.*$/,"");
    return tmpStr;
};


/**
 * Returns the current token (used by the map internally).
 *
 * @return  {string}                the current suffix.
 */
qxp.Class.getToken = function() {
    var self = com.ptvag.webcomponent.map.RequestBuilder;
    return self.SECURITY_TOKEN + "$" + self.getHost(window.document.referrer) +
           "$" + self.getHost(window.document.URL);
};


/**
 * Returns the parameter name for passing the token to the server (used by the
 * map internally).
 *
 * @return  {string}                the parameter name.
 */
qxp.Class.getTokenName = function() {
    var self = com.ptvag.webcomponent.map.RequestBuilder;
    if (self.X_TOKEN != null) {
        return "xtok";
    }
    return "tok";
};


/**
 * Returns the parameter value for passing the token to the server (used by the
 * map internally).
 *
 * @return  {string}                the parameter value.
 */
qxp.Class.getTokenValue = function() {
    var self = com.ptvag.webcomponent.map.RequestBuilder;
    if (self.X_TOKEN != null) {
        return self.X_TOKEN;
    } else {
        return self.getToken();
    }
};


/** Whether the map images should have transparency. */
qxp.OO.addProperty({ name:"transparent", type:qxp.constant.Type.BOOLEAN,
                    defaultValue:false, getAlias:"isTransparent" });

/** Whether satellite images should be used for the background. */
qxp.OO.addProperty({ name:"sat", type:qxp.constant.Type.BOOLEAN,
                    defaultValue:false });

/** Determines the grain size (needed for course grained images). */
qxp.OO.addProperty({ name:"grainSize", type:qxp.constant.Type.NUMBER,
                    defaultValue:1 });

/**
 * Additional information to send with each request. This can also be an id of
 * a hint that has been registered via {@link #registerHint}.
 */
qxp.OO.addProperty({ name:"hint", type:qxp.constant.Type.STRING,
                    defaultValue:null });

/**
 * The backend server to use for map requests. This way, the same
 * AjaxMaps server can support different xMap servers (depending
 * on what the client requests). If <code>null</code>, the value
 * of {@link com.ptvag.webcomponent.map.Map#backendServer}
 * is used.
 * <p>
 * Please note that this is not a URL! This is merely a symbolic name
 * that is evaluated on the AjaxMaps server and must be mapped to an
 * actual server URL there.
 * </p>
 */
qxp.OO.addProperty({ name:"backendServer", type:qxp.constant.Type.STRING, defaultValue:null });

/**
 * Whether to hide labels and streets. This is useful for foreground
 * request builders when the background tiles already include labels
 * and streets.
 */
qxp.OO.addProperty({ name:"hideLabelsAndStreets", type:qxp.constant.Type.BOOLEAN, allowNull:false, defaultValue:false });

/** Debugging aid (not intended to be used from outside). */
qxp.OO.addProperty({ name:"debugOffsetLeft", type:qxp.constant.Type.NUMBER,
    allowNull:false, defaultValue:0 });
/** Debugging aid (not intended to be used from outside). */
qxp.OO.addProperty({ name:"debugOffsetRight", type:qxp.constant.Type.NUMBER,
    allowNull:false, defaultValue:0 });
/** Debugging aid (not intended to be used from outside). */
qxp.OO.addProperty({ name:"debugOffsetTop", type:qxp.constant.Type.NUMBER,
    allowNull:false, defaultValue:0 });
/** Debugging aid (not intended to be used from outside). */
qxp.OO.addProperty({ name:"debugOffsetBottom", type:qxp.constant.Type.NUMBER,
    allowNull:false, defaultValue:0 });


/** {int} A scale factor to apply to the requested images (used for supporting high
          resolution screens). The default value of 1 means that standard-resolution
          images are loaded. A value of 2 requests images with four times as many
          pixels (two times in each direction). If you want to use high resolution maps
          in your application, this is a summary of the steps to take:
          <ol>
              <li>Determine the scale factor from CSS pixels to device pixels (see
                  <a target="_blank" href="http://www.quirksmode.org/blog/archives/2012/06/devicepixelrati.html">here</a>).</li>
              <li>Assign this ratio to <code>RESOLUTION_SCALE_FACTOR</code>. Do this
                  before creating a map instance.</li>
              <li>Add a suitable high resolution map profile to the xMap server.
                  Without a special profile, labels and everything else will look
                  really tiny when you set <code>RESOLUTION_SCALE_FACTOR</code> to >= 2
                  on a high resolution display!</li>
              <li>After creating a map instance, use the
                  {@link com.ptvag.webcomponent.map.Map#profileGroup profileGroup}
                  property to set the correct xMap profile (depending on the scale
                  factor you determined in step 1). Usually, it's enough to have two
                  profiles - a standard resolution one for a scale factor between 1 and
                  2, and a high resolution one for scale factor 2 and up.</li>
          </ol>*/
qxp.Class.RESOLUTION_SCALE_FACTOR = 1;

/** {int} The minimum size a map image must have (before applying the
          {@link #RESOLUTION_SCALE_FACTOR RESOLUTION_SCALE_FACTOR}). */
qxp.Class.MIN_IMAGE_SIZE = 32;

/** {string} One of the possible three servers to be used for bg-images. */
qxp.Class.SERVER1=null;
    // This value is automatically set using server-side configuration.
    // DO NOT set it to anything other than null in this source file!
    // (But you can change the value in JavaScript code that runs after
    // the map scripts have been loaded.)

/** {string} One of the possible three servers to be used for bg-images. */
qxp.Class.SERVER2=null;
    // This value is automatically set using server-side configuration.
    // DO NOT set it to anything other than null in this source file!
    // (But you can change the value in JavaScript code that runs after
    // the map scripts have been loaded.)

/** {string} One of the possible three servers to be used for bg-images. */
qxp.Class.SERVER3=null;
    // This value is automatically set using server-side configuration.
    // DO NOT set it to anything other than null in this source file!
    // (But you can change the value in JavaScript code that runs after
    // the map scripts have been loaded.)

/** {string} Custom parameter string to be passed to the server for every forground-image. */
qxp.Class.CUSTOM_PARAMETER=null;

/** {string} Security token that will be passed to all the foreground requests in combination with referrer and host names. */
qxp.Class.SECURITY_TOKEN=null;

/**
 * {string} An xServer token sent with all foreground requests. If this is not
 * <code>null</code>, it's sent instead of the usual {@link #SECURITY_TOKEN}.
 */
qxp.Class.X_TOKEN=null;

/** {int} Static helper variable - used to guarantee that image ids are unique. */
qxp.Class.LAST_IMAGE_ID = 0;
