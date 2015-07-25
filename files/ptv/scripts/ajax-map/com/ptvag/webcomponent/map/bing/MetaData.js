/**
 * A class that performs requests for meta data (like image URLs) to Bing
 * servers.
 */
qxp.OO.defineClass("com.ptvag.webcomponent.map.bing.MetaData", qxp.core.Object,
function() {
    qxp.core.Object.call(this);
    
    var self = this;
    
    var mMetaData = {};
    var mRunningRequests = {};
    var mRequestCount = 0;
    var mLocationProtocol = false;
    
    /**
     * When requesting AjaxMaps via https, http tile requests may
     * cause browser warnings. To avoid this, applyLocationProtocol
     * replaces the protocol of "weak http" meta data urls with the
     * specified protocol.
     * 
     * @param metaDataObject {object} the meta data object to modify
     * @param protocol {string} the new protocol (without trailing colon)
     */
    applyLocationProtocol = function(metaDataObject, protocol) {
        for (var k in metaDataObject) {
            var v = metaDataObject[k];
            if (typeof v === "object") {
                applyLocationProtocol(v, protocol);
            } else if (typeof v === "string" && v.indexOf("http://") == 0) {
                metaDataObject[k] = protocol + v.substr(v.indexOf("://"));
            }
	}
    }
    
    /**
     * Requests meta data for the specified API key. The callback function is
     * executed asynchronously when meta data is available. The only parameter
     * passed to the callback is a boolean value indicating success
     * (<code>true</code>) or failure (<code>false</code>), e.g. because the
     * API key is invalid. After the callback has been executed, you can call
     * {@link #getMetaData getMetaData} to retrieve the meta data.
     * 
     * @param key {string} the API key.
     * @param callback {function} the callback function.
     */
    self.setAPIKey = function(key, callback) {
        if (mMetaData[key]) {
            window.setTimeout(function() {
                callback(true);
            }, 0);
            return;
        }
        var runningRequest = mRunningRequests[key];
        if (runningRequest != null) {
            runningRequest.push(callback);
            return;
        }
        var ajaxMapsPrefix = qxp.core.ServerSettings.serverPathPrefix;
        var protocol = ajaxMapsPrefix.substring(0, ajaxMapsPrefix.indexOf(":"));
        var callbackName = "callback" + mRequestCount;
        ++mRequestCount;
        mRunningRequests[key] = [callback];
        self[callbackName] = function(result) {
            var callbacks = mRunningRequests[key];
            delete self[callbackName];
            delete mRunningRequests[key];
            var success = false;
            if (result != null && result.resourceSets != null &&
                result.resourceSets.length == 1) {
                if (mLocationProtocol) {
                    applyLocationProtocol(result, protocol);
                }
                mMetaData[key] = result;
                success = true;
            }
            var callbackCount = callbacks.length;
            for (var i = 0; i < callbackCount; ++i) {
                callbacks[i](success);
            }
        }
        var url = (mLocationProtocol ? protocol : "http") +
                  "://dev.virtualearth.net/REST/V1/Imagery/Metadata/" +
                  "Aerial?o=json&jsonp=" +
                  "com.ptvag.webcomponent.map.bing.MetaData." + callbackName +
                  "&key=" + key;
        var scriptElement = document.createElement("script");
        scriptElement.charset = "utf-8";
        scriptElement.src = url;
        document.body.appendChild(scriptElement);
    };
    
    /**
     * Returns the meta data for an API key.
     *
     * @param key {string} the API key.
     *
     * @return {Map} the meta data as returned by the Bing servers.
     */
    self.getMetaData = function(key) {
        return mMetaData[key];
    };
    
    /**
     * Determines whether the protocol of the embedding page's URL is to be 
     * used to overwrite the protocols of the meta data URLs returned by the 
     * Bing servers. Replacing the protocols avoids browser warnings, that 
     * may otherwise occur when requesting AjaxMaps via https.
     *
     * @param use {boolean,true} determines whether to overwrite the protocol
     */
    self.useLocationProtocol = function(use) {
        if (use !== undefined) {
            mLocationProtocol = use;
        } else {
            mLocationProtocol = true;
        }
    }
});

// singleton
com.ptvag.webcomponent.map.bing.MetaData =
    new com.ptvag.webcomponent.map.bing.MetaData();

