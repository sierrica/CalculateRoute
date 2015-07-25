/**
 * A queued image loader to avoid overloading the server with requests and to
 * be able to abort loading if desired.
 */

qxp.OO.defineClass("com.ptvag.webcomponent.map.ImageLoader", qxp.core.Object,
function() {
    qxp.core.Object.call(this);

    var self = this;
    self.enableDebug = false;

    var mQueue = [];
    var mQueueLocked = false;
    var mRunningRequests = [];

    var mLastRequestTime = 0;
    var mQueueTimer = null;

    var mImageSizes = {};
    
    var mKnownFastUrls;
    var mCurrentFastUrlHash = 0;
    var mCurrentFastUrlCount = 0;

    //var queueCounter = 0;
    //var imageCounter = 0;
    
    var mErrorLog = null;
    var mCurrentErrorArray;

    var mBlankSrc = null;
    
    var mNonFastCount = 0;


    // property modifier
    self._modifyHaltLoading = function(propValue) {
        if (!propValue) {
            processQueue();
        }
    };


    /**
     * Creates a queue entry suitable for logging (without DOM references).
     */
    var createLogEntry = function(entry) {
        return {
            imageElement: (entry.imageElement ? "not null" : null),
            //history: entry.history,
            url: entry.url,
            priority: entry.priority,
            timeout: entry.timeout,
            fast: entry.fast,
            manageVisibility: entry.manageVisibility
        };
    };
    
    
    /**
     * Logs a queue entry (for debugging purposes).
     */
    var logEntry = function(entry, error) {
        if (mErrorLog == null) {
            mErrorLog = new Array(10);
            mErrorLog[0] = new Array();
            mCurrentErrorArray = 0;
        }
        var currentErrorArray = mErrorLog[mCurrentErrorArray];
        var newEntry = createLogEntry(entry);
        newEntry.error = error;
        currentErrorArray.push(newEntry);
        if (currentErrorArray.length == 10) {
            mCurrentErrorArray = (mCurrentErrorArray + 1)%10;
            mErrorLog[mCurrentErrorArray] = new Array();
        }
    };
    
    
    /**
     * Returns whether the image loader is currently idle.
     * Idle means that no image request is currently running and
     * no request is queued.
     *
     * @return  {boolean}           whether the image loader is idle.
     */
    self.isIdle = function() {
        return (mRunningRequests.length == 0 && mQueue.length == 0);
    }


    /**
     * Returns a string with all available debug information.
     */
    self.getDebugInfo = function() {
        var retVal = {};

        var errorLog = [];
        if (mErrorLog != null) {
            var startIndex = (mCurrentErrorArray + 1)%10;
            var currentIndex = startIndex;
            do {
                var array = mErrorLog[currentIndex];
                if (array != null) {
                    for (var i = 0; i < array.length; ++i) {
                        errorLog.push(array[i]);
                    }
                }
                currentIndex = (currentIndex + 1)%10;
            } while (currentIndex != startIndex);
        }
        retVal.errorLog = errorLog;

        var queue = [];
        for (var i = 0; i < mQueue.length; ++i) {
            queue.push(createLogEntry(mQueue[i]));
        }
        retVal.queue = queue;
        
        var runningRequests = [];
        for (var i = 0; i < mRunningRequests.length; ++i) {
            runningRequests.push(createLogEntry(mRunningRequests[i]));
        }
        retVal.runningRequests = runningRequests;
        
        return retVal;
    };
    
    
    /**
     * Checks if a fast URL is already known.
     * 
     * @param   url {string}        the URL to check.
     * 
     * @return  {boolean}           whether or not the URL is already known.
     */
    var fastUrlKnown = function(url) {
        var hashCount = mKnownFastUrls.length;
        for (var i = 0; i < hashCount; ++i) {
            if (url in mKnownFastUrls[i]) {
                return true;
            }
        }
        return false;
    };
    
    
    /**
     * Adds a known fast URL (if not already present in the current hash).
     * 
     * @param   url {string}        the URL to add.
     */
    var addFastUrl = function(url) {
        if (!(url in mKnownFastUrls[mCurrentFastUrlHash])) {
            mKnownFastUrls[mCurrentFastUrlHash][url] = null;
            ++mCurrentFastUrlCount;
            if (mCurrentFastUrlCount >= self.getKnownFastUrlsPerHash()) {
                mCurrentFastUrlCount = 0;
                mCurrentFastUrlHash = (mCurrentFastUrlHash + 1)%mKnownFastUrls.length;
                mKnownFastUrls[mCurrentFastUrlHash] = {};
                // TODO: also check here if the knownFastUrlHashes number has
                // changed
            }
        }
    };
    
    
    /**
     * Asynchronically determines the size of an image.
     * 
     * @param   url {string}        the url of the image.
     * @param   handlerFunction {function}  the function that should be called
     *                                      as soon as the image size is known.
     *                                      The handler function is called with
     *                                      three parameters:
     *                                      <ol>
     *                                          <li>The url of the image.</li>
     *                                          <li>The width of the image.</li>
     *                                          <li>The height of the image.</li>
     *                                      </ol>
     *                                      If the image size is already known,
     *                                      the handler function is called
     *                                      immediately (synchronously).
     *                                      If the image size cannot be
     *                                      determined (e.g. because loading the
     *                                      image times out), the handler
     *                                      function is not called at all.
     * @param   object {object,null}        the object on which the handler
     *                                      function should be called (as a
     *                                      method). If <code>null</code>, the
     *                                      function is called as a pure
     *                                      function (without a valid
     *                                      <code>this</code> reference).
     */
    self.getImageSize = function(url, handlerFunction, object) {
        var sizeData = mImageSizes[url];
        if (sizeData != null) {
            if (sizeData.width != null) {
                // We already have the image size -> Call the handler directly
                handlerFunction.call(object, url, sizeData.width, sizeData.height);
            } else {
                // We don't have the image size, but a request is running
                // -> Add the handler to the list
                sizeData.handlers.push(handlerFunction);
                sizeData.objects.push(object);
            }
        } else {
            // We have no image size and there is no request running -> Start one
            sizeData = { handlers:[ handlerFunction ], objects:[ object ] };
            mImageSizes[url] = sizeData;

            var tempImgElem = document.createElement("img");
            tempImgElem.style.position = "absolute";
            tempImgElem.style.visibility = "hidden";
            document.body.appendChild(tempImgElem);

            self.loadImage(tempImgElem, url, onSizeImageLoaded);
        }
    };


    var onSizeImageLoaded = function(imgElement, url, exc) {
        if (exc != null) {
            self.warn("Image size could not be detected for: " + url, exc);
        } else {
            var sizeData = mImageSizes[url];
    
            sizeData.width  = imgElement.offsetWidth;
            sizeData.height = imgElement.offsetHeight;
            document.body.removeChild(imgElement);
    
            // Inform the handlers
            for (var i = 0; i < sizeData.handlers.length; i++) {
            	sizeData.handlers[i].call(sizeData.objects[i], url, sizeData.width, sizeData.height);
            }
            sizeData.handlers = null;
            sizeData.objects = null;
        }
    };


    /**
     * Clean up an image element by removing all handlers.
     *
     * @param   imageElement {Element}  the image element.
     */
    
    var cleanUpImage = function(imageElement) {
        imageElement.onload = null;
        imageElement.onerror = null;
        imageElement.onabort = null;
        if (imageElement._timeout) {
            window.clearTimeout(imageElement._timeout);
            imageElement._timeout = null;
        }
        if (imageElement._removeFromParent) {
            try {
                imageElement.parentNode.removeChild(imageElement);
                //self.info("Removing image from parent succeeded");
            } catch (e) {
                //self.info("Removing image from parent failed");
            }
        }
    };
    
    
    /**
     * Removes an element from the queue. If the entry isn't found in the
     * queue, nothing happens.
     *
     * @param   queueEntry {var}    the queue entry to remove.
     *
     * @return  <code>true</code> if the element was removed from the queue,
     *          <code>false</code> if it could not be found in the queue.
     */
    
    var removeFromQueue = function(queueEntry) {
        //queueEntry.history.push("Removing from queue ...");
        if (!queueEntry.fast) {
            --mNonFastCount;
        }
        for (var i = 0; i < mQueue.length; ++i) {
            if (mQueue[i] == queueEntry) {
                mQueue.splice(i, 1);
                //queueEntry.history.push("found");
                return true;
            }
        }
        //queueEntry.history.push("not found");
        return false;
    };
    
    
    /**
     * Removes an element from the list of running requests. If the entry isn't
     * found in the list, nothing happens.
     *
     * @param   queueEntry {var}    the queue entry to remove.
     *
     * @return  <code>true</code> if the element was removed from the list,
     *          <code>false</code> if it could not be found.
     */
    
    var removeFromRunningList = function(queueEntry) {
        //queueEntry.history.push("Removing from running list ...");
        if (!queueEntry.fast) {
            --mNonFastCount;
        }
        var retVal = false;
        for (var i = 0; i < mRunningRequests.length; ++i) {
            if (mRunningRequests[i] == queueEntry) {
                mRunningRequests.splice(i, 1);
                retVal = true;
                break;
            }
        }
        if (mQueueTimer == null) {
            mQueueTimer = window.setTimeout(function() {
                mQueueTimer = null;
                processQueue();
            }, 0);
        }
        //queueEntry.history.push(retVal ? "found" : "not found");
        return retVal;
    };
    
    
    /**
     * Processes a queue entry (provided enough time has passed).
     */

    var processQueue = function() {
        if (mQueueTimer != null || mQueue.length == 0 || self.getHaltLoading() || (mRunningRequests.length >= self.getMaxRequests() && !mQueue[0].fast)) {
            return;
        }
        //self.info("{" + (++queueCounter) + "/" + imageCounter + "} Processing queue with length: " + mQueue.length +
        //    "; mQueueTimer: " + (mQueueTimer ? "true" : "false"));
        var minWaitTime = self.getMinWaitTime();
        var currentTime = (new Date()).getTime();
        var timeDiff = currentTime - mLastRequestTime;
        //self.info("timeDiff: " + timeDiff);
        var queueEntry = mQueue[0];
        if (!mQueueLocked && timeDiff >= minWaitTime) {
            mQueue.splice(0, 1);
            //self.info("Processing entry with priority " + queueEntry.priority);
            //self.info("Setting url to :" + queueEntry.url);
            //queueEntry.history.push("Processing");
            mRunningRequests.push(queueEntry);
            queueEntry.imageElement._timeout = window.setTimeout(function() {
                if (queueEntry.imageElement._timeout == null) {
                    return;     // workaround for IE bug
                }
                queueEntry.imageElement._timeout = null;
                //queueEntry.history.push("Timeout");
                if (self.enableDebug) {
                    logEntry(queueEntry, "timeout");
                }
                self.abortLoading(queueEntry);
                // if the image was no longer in the queue,
                // abortLoading() doesn't call onabort (since it's expected to
                // be called some time by the browser), so let's do it here
                if (queueEntry.imageElement.onabort) {
                    //queueEntry.history.push("Calling onabort in timeout");
                    queueEntry.imageElement.onabort(true);
                }
            }, queueEntry.timeout*1000);
            self.setImageSrc(queueEntry.imageElement,
                com.ptvag.webcomponent.map.SERVICE.fixUrl(queueEntry.url));
            if (queueEntry.fast && queueEntry.manageVisibility) {
                queueEntry.imageElement.style.visibility = "visible";
            }
            mLastRequestTime = currentTime;
            //queueEntry.history.push("Processed");
        }
        if (mQueue.length > 0 && mRunningRequests.length < self.getMaxRequests()) {
            var timeoutTime = minWaitTime;
            if (timeDiff <= timeoutTime) {
                timeoutTime -= timeDiff;
            }
            mLastRequestTime = 0;   // set it to 0 to avoid problems
                                    // in case the timeout fires just a little
                                    // bit earlier than the actual requested
                                    // time
            //self.info("Setting timeout: " + timeoutTime);
            mQueueTimer = window.setTimeout(function() {
                                                mQueueTimer = null;
                                                processQueue();
                                            },
                                            timeoutTime);
        }
    };
    
    
    var fillBlankSrc = function() {
        mBlankSrc = com.ptvag.webcomponent.map.MapUtil.rewriteURL(
            "img/com/ptvag/webcomponent/map/blank.gif", true);
    };


    var refreshSession = function() {
        if (!mQueueLocked) {
            mQueueLocked = true;
            var refreshRPC = com.ptvag.webcomponent.map.SERVICE;
            refreshRPC.refreshSession(
                function(result, exc) {
                    if (!result || exc) {
                        self.error("Session refresh would be needed but didn't succeed!", exc);
                    }
                    mQueueLocked = false;
                }
            );
        }
    };
    
    
    var retry = function(queueEntry) {
        if (queueEntry.fast) {
            var retries = self.getFastRetries();
        } else {
            retries = self.getRetries();
        }
        var count = queueEntry.retries;
        if (!count) {
            count = 1;
            queueEntry.origURL = queueEntry.url;
        } else {
            ++count;
        }
        queueEntry.retries = count;
        if (count > retries) {
            return false;
        }
        //self.info("retry: " + count);
        removeFromRunningList(queueEntry);
        var imageElement = queueEntry.imageElement;
        if (imageElement._timeout) {
            window.clearTimeout(imageElement._timeout);
            imageElement._timeout = null;
        }
        queueEntry.url = queueEntry.origURL +
            (queueEntry.origURL.indexOf("?") == -1 ?
             "/retryTime_" + (new Date()).getTime() +
             "/retry_" + count :
             "&retryTime=" + (new Date()).getTime() +
             "&retry=" + count);
        mQueue.splice(0, 0, queueEntry);
        processQueue();
        return true;
    };


    /**
     * Queues an image for loading.
     * <p>
     * The <code>onloaded</code> callback function has three parameters:
     * <ul>
     *     <li>the image element</li>
     *     <li>the image url</li>
     *     <li>an exception (<code>null</code> when there was no error)</li>
     * </ul>
     * </p>
     *
     * @param   imageElement {Element}  the element to load the image into.
     * @param   url {string}            the url of the image.
     * @param   onloaded {function}     the callback when the image was loaded.
     * @param   priority {int, 0}       an optional priority. Higher values
     *                                  mean earlier image loading.
     * @param   timeout {int, 10}       an optional timeout in seconds. After
     *                                  this time, loading the image is
     *                                  aborted. The default timeout can be
     *                                  changed globally via the
     *                                  {@link #defaultTimeout} property.
     * @param   fast {boolean, false}   if <code>true</code>, the image is
     *                                  loaded directly if it has been loaded
     *                                  in the past (disregarding the queue
     *                                  length). Use this option for images
     *                                  cached by the browser.
     * @param   manageVisibility {boolean, false}  if <code>true</code>, the
     *                                  visibility attribute is managed (i.e.
     *                                  toggled between "hidden" and "" as
     *                                  needed) according to the
     *                                  <code>fast</code> parameter (to
     *                                  optimize browser rendering and show as
     *                                  few artifacts as possible).
     *                                  Before you call <code>loadImage</code>,
     *                                  however, you should always set the
     *                                  visibility to "hidden".
     *
     * @return  queueEntry {var}        the entry in the image loading queue
     *                                  (should be treated as opaque and only
     *                                  used to abort image loading).
     */
    
    self.loadImage = function(imageElement, url, onloaded, priority, timeout,
                              fast, manageVisibility) {
        //self.info("fast: " + fast);
        //++imageCounter;
        if (timeout == null) {
            timeout = self.getDefaultTimeout();
        }
        //self.info("loadImage; mQueue.length: " + mQueue.length + "; mRunningRequests.length: " + mRunningRequests.length);
        priority = (priority == null ? 0 : priority);
        var actuallyFast = fast; //(fast ? fastUrlKnown(url) : false);
        var queueEntry = { //history: ["Created"],
                          imageElement: imageElement, url: url,
                          priority: priority, timeout: timeout,
                          fast: actuallyFast, manageVisibility: manageVisibility};
        if (!actuallyFast) {
            ++mNonFastCount;
        }
        //if (actuallyFast) {
        //    self.info("fast");
        //}
        //self.info("non fast: " + mNonFastCount);
        /*if (actuallyFast && mNonFastCount == 0) {
            imageElement.src = url;
            window.setTimeout(function() {
              onloaded(imageElement, url);
            }, 0);
            return queueEntry;
        }*/
        refreshSession();
        
        // shortcut for the common cases
        if (mQueue.length == 0) {
            mQueue.push(queueEntry);
            //self.info("Simple push (length 0)");
        } else if (mQueue[mQueue.length - 1].priority >= priority) {
            mQueue.push(queueEntry);
            //self.info("Simple push (length > 0)");
        } else {
            for (var i = 0; mQueue[i].priority > priority; ++i);
            //self.info("Priority " + priority + " insert at " + i + " (length " + mQueue.length + ")");
            mQueue.splice(i, 0, queueEntry);
        }
        cleanUpImage(imageElement);
        var actualLoadHandler = function() {
            if (imageElement.src == mBlankSrc) {
                return;     // ignore (artifact of aborting with the same imageElement before)
            }
            //queueEntry.history.push("actualLoadHandler");
            removeFromRunningList(queueEntry);
            cleanUpImage(imageElement);
            if (manageVisibility) {
                imageElement.style.visibility = "";
            }
            if (fast) {
                addFastUrl(url);
            }
            imageElement._loaded = true;
            try {
                //queueEntry.history.push("Calling onloaded in actualLoadHandler");
                if (onloaded) onloaded(imageElement, url, null);
            } catch (exc) {
                self.error("Handling image loaded failed", exc);
            }
        };
        var actualErrorHandler = function() {
            if (imageElement.src == mBlankSrc) {
                return;     // ignore (artifact of aborting with the same imageElement before)
            }
            //queueEntry.history.push("actualErrorHandler");
            if (retry(queueEntry)) {
                return;
            }
            if (self.enableDebug) {
                logEntry(queueEntry, "error");
            }
            removeFromRunningList(queueEntry);
            cleanUpImage(imageElement);
            try {
                //queueEntry.history.push("Calling onloaded in actualErrorHandler");
                if (onloaded) onloaded(imageElement, url, new Error("Error"));
            } catch (exc) {
                self.error("Handling image loading error failed", exc);
            }
        };
        var actualAbortHandler = function(explicit, dontBlankImage) {
            if (imageElement.src == mBlankSrc) {
                return;     // ignore (artifact of aborting with the same imageElement before)
            }
            //queueEntry.history.push("actualAbortHandler");
            if (!explicit) {
                if (retry(queueEntry)) {
                    return;
                }
            }
            //self.info("Aborting " + url + " ...");
            removeFromRunningList(queueEntry);
            cleanUpImage(imageElement);
            if (!dontBlankImage) {
                if (mBlankSrc == null) {
                    // This has to be done here because we can't make sure at
                    // load time that ServerUtils is loaded, so we can't
                    // initialize the member properly at load time (because
                    // #require doesn't work accross --script-input
                    // boundaries).
                    fillBlankSrc();
                }
                self.clearImageSrc(imageElement, mBlankSrc);
                    // don't take up space in Firefox's internal queue
            }
            try {
                //queueEntry.history.push("Calling onload in actualAbortHandler");
                if (onloaded) onloaded(imageElement, url, new Error("Abort"));
            } catch (exc) {
                self.error("Handling image loading abort failed", exc);
            }
        };
        imageElement.onload = actualLoadHandler;
        imageElement.onerror = actualErrorHandler;
        imageElement.onabort = actualAbortHandler;
        processQueue();
        return queueEntry;
    };
    
    
    /**
     * Aborts loading an image. If the specified queueEntry doesn't exist in the
     * queue, nothing happens. If it does, the handler passed to
     * <code>loadImage</code> is called with an abort exception.
     *
     * @param queueEntry {var} the queue entry to abort.
     * @param removeFromParent {boolean,false} whether the element should be
     *        removed from its parent. If you plan to remove the image when
     *        aborting then use this parameter and don't do it on your own,
     *        because IE needs some extra care which will be considered here.
     */
    
    self.abortLoading = function(queueEntry, removeFromParent) {
        //queueEntry.history.push("abortLoading");
        var wasQueued = removeFromQueue(queueEntry);
        if (wasQueued) {
            //queueEntry.history.push("wasQueued == true");
            if (queueEntry.imageElement.onabort) {
                //queueEntry.history.push("Calling onabort in abortLoading");
                queueEntry.imageElement.onabort(true, true);
            }
        } else {
            //queueEntry.history.push("wasQueued == false");
            if (!queueEntry.imageElement._loaded) {
                //queueEntry.history.push("_loaded == false");
                if (queueEntry.imageElement.onabort) {
                    //queueEntry.history.push("Calling onabort in abortLoading (2)");
                    queueEntry.imageElement.onabort(true);
                } else {
                    if (mBlankSrc == null) {
                        // This has to be done here because we can't make sure at load
                        // time that ServerUtils is loaded, so we can't initialize the
                        // member properly at load time (because #require doesn't work
                        // accross --script-input boundaries).
                        fillBlankSrc();
                    }
                    self.clearImageSrc(queueEntry.imageElement, mBlankSrc);
                        // don't take up space in Firefox's internal queue
                }
            }
        }
        if (removeFromParent) {
            if (qxp.sys.Client.getInstance().isMshtml() && queueEntry.imageElement.onabort) {
                var junkyard = document.getElementById("_junkyard");
                if (junkyard == null) {
                    junkyard = document.createElement("div");
                    junkyard.style.display = "none";
                    document.body.appendChild(junkyard);
                }
                queueEntry.imageElement.parentNode.removeChild(
                    queueEntry.imageElement);
                junkyard.appendChild(queueEntry.imageElement);
                queueEntry.imageElement._removeFromParent = true;
                queueEntry.imageElement.style.display = "none";
                // IE will never stop showing the image as loading
                // in the status bar if it's removed from the parent node;
                // instead, do it in the event handlers.
            } else {
                queueEntry.imageElement.parentNode.removeChild(
                    queueEntry.imageElement);
            }
        }
    };


    /**
     * Creates an image element suitable for being used by this loader.
     *
     * @return {Element} the created element.
     */

    self.createElement = function() {
        return document.createElement("img");
    };


    /**
     * Sets the <code>src</code> property of an image element. This method can
     * be overridden by subclasses that perform specialized image handling.
     *
     * @param imageElement {Element} the image element.
     * @param src {string} the new source URL.
     */

    self.setImageSrc = function(imageElement, src) {
        imageElement.src = src;
    };


    /**
     * Clears the <code>src</code> property of an image element. This method
     * can be overridden by subclasses that perform specialized image handling.
     *
     * @param imageElement {Element} the image element.
     * @param blankSrc {string} the source URL for a blank image (used by this
     *                          method to abort loading an image).
     */

    self.clearImageSrc = function(imageElement, blankSrc) {
        imageElement.src = blankSrc;
    };


    /**
     * Initializes the image loader.
     */
    
    var init = function() {
        mKnownFastUrls = [];
        var hashCount = self.getKnownFastUrlHashes();
        for (var i = 0; i < hashCount; ++i) {
            mKnownFastUrls[i] = {};
        }
    };
    
    
    // overridden
    var superDispose = self.dispose;
    self.dispose = function() {
        if (self.getDisposed()) {
            return;
        }

        for (var i = 0; i < mQueue.length; i++) {
            cleanUpImage(mQueue[i].imageElement);
            mQueue[i].imageElement = null;
        }
        mQueue = [];

        for (var i = 0; i < mRunningRequests.length; i++) {
            cleanUpImage(mRunningRequests[i].imageElement);
            mRunningRequests[i].imageElement = null;
        }
        mRunningRequests = [];

        superDispose.call(self);
    };


    init();
});


/** The minimum wait time between loading images (in milliseconds). */
qxp.OO.addProperty({ name:"minWaitTime", type:qxp.constant.Type.NUMBER, defaultValue:0 });

/** The maximum number of concurrent requests. */
qxp.OO.addProperty({ name:"maxRequests", type:qxp.constant.Type.NUMBER, defaultValue:3 });

/** The number of hashes for caching known URLs. */
qxp.OO.addProperty({ name:"knownFastUrlHashes", type:qxp.constant.Type.NUMBER, defaultValue:10 });

/** The number of known URLs per hash. */
qxp.OO.addProperty({ name:"knownFastUrlsPerHash", type:qxp.constant.Type.NUMBER, defaultValue:100 });

/** The default timeout for loading images. */
qxp.OO.addProperty({ name:"defaultTimeout", type:qxp.constant.Type.NUMBER, defaultValue:10 });

/** The number of retries for standard images. */
qxp.OO.addProperty({ name:"retries", type:qxp.constant.Type.NUMBER, defaultValue:3 });

/** The number of retries for fast images (cached by the browser). */
qxp.OO.addProperty({ name:"fastRetries", type:qxp.constant.Type.NUMBER, defaultValue:3 });

/** Whether to suspend loading of new images. */
qxp.OO.addProperty({ name:"haltLoading", type:qxp.constant.Type.BOOLEAN, defaultValue:false });

// singleton
com.ptvag.webcomponent.map.ImageLoader = new com.ptvag.webcomponent.map.ImageLoader();
