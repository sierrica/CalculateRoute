/**
 * A Flash implementation of the print context.
 * 
 * @param   parentMap {com.ptvag.webcomponent.map.Map}  the map to print.
 */
qxp.OO.defineClass("com.ptvag.webcomponent.map.FlashPrintContext",
com.ptvag.webcomponent.map.PrintContext,
function(parentMap) {
    
    var map = com.ptvag.webcomponent.map;
    map.PrintContext.apply(this, arguments);
    var self = this;
    var FlashPrintContext = map.FlashPrintContext;

    var mFlashContainer;
    var mURLsToUpload = {};
    var mUploadFinished = false;
    var mEndReceived = false;
    var mFlashContainerAdded = false;

    var mWidth = parentMap.getWidth();
    var mHeight = parentMap.getHeight();


    // overridden
    var superDispose = self.dispose;
    self.dispose = function() {
        if (self.getDisposed()) {
            return;
        }
        if (mFlashContainer != null) {
            mFlashContainer.parentNode.removeChild(mFlashContainer);
            mFlashContainer = null;
        }
        superDispose.call(self);
    };


    // overridden
    var superDrawImage = self.drawImage;
    self.drawImage = function(img) {
        var url = img.src;
        if (url.indexOf(qxp.core.ServerSettings.serverPathPrefix) != 0) {
            // we have to post this URL
            //alert("foreign url: " + url);
            mURLsToUpload[url] = null;
        }
        superDrawImage.apply(self, arguments);
    };
    
    
    // overridden
    var superEnd = self.end;
    self.end = function() {
        mEndReceived = true;
        superEnd.apply(self, arguments);
    };


    // overridden
    var superProcessQueue = self.processQueue;
    self.processQueue = function() {
        if (mUploadFinished || self.getNextCommandName() != "drawImage") {
            superProcessQueue.apply(self, arguments);
            return;
        }
        if (!mEndReceived) {
            return;
        }
        // post all the URLs
        mUploadFinished = true;
        for (var url in mURLsToUpload) {
            mUploadFinished = false;
            break;
        }
        if (mUploadFinished) {
            superProcessQueue.apply(self, arguments);
            return;
        }
        if (mFlashContainerAdded) {
            return;
        }
        mFlashContainerAdded = true;
        mFlashContainer = document.createElement("div");
        mFlashContainer.style.position = "absolute";
        mFlashContainer.style.left = "-" + mWidth + "px"; //"0px";
        mFlashContainer.style.top = "-" + mHeight + "px"; //"0px";
        //mFlashContainer.style.visibility = "hidden";
        var callbackId = FlashPrintContext.flashCallBackId++;
        var flashVars = "callbackId=" + callbackId + "&urls=";
        var i = 0;
        for (url in mURLsToUpload) {
            if (i > 0) {
                flashVars += "+";
            }
            flashVars += encodeURIComponent(url);
            ++i;
        }
        var serverSettings = qxp.core.ServerSettings;
        flashVars += "&prefix=" +
            encodeURIComponent(serverSettings.serverPathPrefix);
        var suffix = serverSettings.serverPathSuffix;
        if (suffix.indexOf("?") == -1) {
            suffix += "?printId=" + self.getPrintId();
        } else {
            suffix += "&printId=" + self.getPrintId();
        }
        flashVars += "&suffix=" + encodeURIComponent(suffix);
        mFlashContainer.innerHTML =
            com.ptvag.webcomponent.util.Flash.getFlashContent(
                "src", com.ptvag.webcomponent.map.MapUtil.rewriteURL("swf/com/ptvag/webcomponent/map/PrintHelper", true),
                "width", mWidth,
                "height", mHeight,
                "quality", "high",
                "allowScriptAccess", "sameDomain",
                "type", "application/x-shockwave-flash",
                "FlashVars", flashVars,
                "id", "_ptv_map_printHelper_" + callbackId,
                //"name", "_ptv_map_printHelper_" + callbackId,
                "pluginspage", "http://www.adobe.com/go/getflashplayer");
        FlashPrintContext.flashCallBackListeners[callbackId] =
            function(id, result, exc) {
                //alert("Callback listener: " + result + "/" + exc);
                mUploadFinished = true;
                self.processQueue();
            }
        document.body.appendChild(mFlashContainer);
    };
});


/**
 * Called by the Flash application.
 * 
 * @param id {var}      the callback id.
 * @param result {var}  the result of a method call.
 * @param exc {var}     the exception during a method call (if any).
 */
qxp.Class.flashCallBack = function(id, result, exc) {
    var FlashPrintContext = com.ptvag.webcomponent.map.FlashPrintContext;
    id = parseInt(id);
    if (id > 2000000000) {
        FlashPrintContext.flashCallBackId = 0;
    }
    var listener = FlashPrintContext.flashCallBackListeners[id];
    if (listener != null) {
        delete FlashPrintContext.flashCallBackListeners[id];
        var listenersFound = false;
        for (var key in FlashPrintContext.flashCallBackListeners) {
            listenersFound = true;
            break;
        }
        if (!listenersFound) {
            FlashPrintContext.flashCallBackListeners = {};
                // re-init to prevent IE memory leak
        }
        window.setTimeout(function() {
            // do this in a timeout to prevent crashes :-(
            listener(id, result, exc);
        }, 0);
    }
};

qxp.Class.flashCallBackListeners = {};

qxp.Class.flashCallBackId = 0;
