/**
 * A wrapper for the server-side print service. This class is used by the map's
 * printing system and is not intended for use by application developers!
 * 
 * @param   parentMap {com.ptvag.webcomponent.map.Map}  the map to print.
 */
qxp.OO.defineClass("com.ptvag.webcomponent.map.PrintContext", qxp.core.Target,
function(parentMap) {
    
    qxp.core.Target.apply(this, arguments);
    var self = this;
    var map = com.ptvag.webcomponent.map;
    var MapUtil = map.MapUtil;

    var mPrintService = null;
    var mPrintId = map.PrintContext.createPrintId();
    map.PrintContext.LAST_PRINT_ID = mPrintId;

    var mCommandQueue = [ "refreshSession",
                         { method:"begin", params:[parentMap.getWidth(),
                                                   parentMap.getHeight()] }];
    var mCurrentCall;
    var mExc = null;

    var mStrokeStyle = "rgb(0, 0, 0)";
    var mFillStyle = "rgb(0, 0, 0)";
    var mLineWidth = 1;
    var mLineCap = "butt";
    var mLineJoin = "miter";
    var mFontFamily = "serif";
    var mFontStyle = "plain";
    var mFontSize = 10;
    var mTextAlignment = 34;
    var mGlobalAlpha = 1;
    
    self.strokeStyle = mStrokeStyle;
    self.fillStyle = mFillStyle;
    self.lineWidth = mLineWidth;
    self.lineCap = mLineCap;
    self.lineJoin = mLineJoin;
    self.fontFamily = mFontFamily;
    self.fontStyle = mFontStyle;
    self.fontSize = mFontSize;
    self.textAlignment = mTextAlignment;
    self.globalAlpha = mGlobalAlpha;

    var createMethod = function(name) {
        self[name] = function() {
            if (mStrokeStyle != self.strokeStyle) {
                mStrokeStyle = self.strokeStyle;
                var translatedColor = translateColor(mStrokeStyle);
                mCommandQueue.push({ method:"setStrokeStyle",
                    params:[translatedColor.r, translatedColor.g, translatedColor.b, translatedColor.a] });
            }
            if (mFillStyle != self.fillStyle) {
                mFillStyle = self.fillStyle;
                var translatedColor = translateColor(mFillStyle);
                mCommandQueue.push({ method:"setFillStyle",
                    params:[translatedColor.r, translatedColor.g, translatedColor.b, translatedColor.a] });
            }
            if (mLineWidth != self.lineWidth) {
                mLineWidth = self.lineWidth;
                mCommandQueue.push({ method:"setLineWidth", params:[mLineWidth] });
            }
            if (mLineCap != self.lineCap) {
                mLineCap = self.lineCap;
                mCommandQueue.push({ method:"setLineCap", params:[mLineCap] });
            }
            if (mLineJoin != self.lineJoin) {
                mLineJoin = self.lineJoin;
                mCommandQueue.push({ method:"setLineJoin", params:[mLineJoin] });
            }
            if (name == "drawText") {
                if (mFontFamily != self.fontFamily) {
                    mFontFamily = self.fontFamily;
                    mCommandQueue.push({ method:"setFontFamily", params:[mFontFamily] });
                }
                if (mFontStyle != self.fontStyle) {
                    mFontStyle = self.fontStyle;
                    mCommandQueue.push({ method:"setFontStyle", params:[mFontStyle] });
                }
                if (mFontSize != self.fontSize) {
                    mFontSize = self.fontSize;
                    mCommandQueue.push({ method:"setFontSize", params:[mFontSize] });
                }
                if (mTextAlignment != self.textAlignment) {
                    mTextAlignment = self.textAlignment;
                    mCommandQueue.push({ method:"setTextAlignment", params:[mTextAlignment] });
                }
            }
            if (mGlobalAlpha != self.globalAlpha) {
                mGlobalAlpha = self.globalAlpha;
                mCommandQueue.push({ method:"setGlobalAlpha", params:[mGlobalAlpha] });
            }
            mCommandQueue.push({ method:name, params:arguments });
            self.processQueue();
        };
    };


    /**
     * Translates a color in rgb, rgba, or hex format into separate
     * r, g, b, and a values (integers in the range 0-255).
     * 
     * @param   color {string}      the color.
     * 
     * @return  {Map}               a map with the keys r, g, b, and a.
     *                              The opacity is 255 if no value for it
     *                              was included in the specified color.
     */
    var translateColor = function(color) {
        var retVal = { a:255 };
        var match = MapUtil.RGB_REGEX.exec(color);
        if (match == null) {
            match = MapUtil.RGBA_REGEX.exec(color);
            if (match != null) {
                retVal.a = Math.round(parseFloat(match[4])*255);
            }
        }
        if (match == null) {
            var colorAsInt = parseInt(color.substring(1), 16);
            retVal.r = parseInt(colorAsInt/65536);
            colorAsInt -= retVal.r*65536;
            retVal.g = parseInt(colorAsInt/256);
            retVal.b = colorAsInt - retVal.g*256;
        } else {
            retVal.r = parseInt(match[1]);
            retVal.g = parseInt(match[2]);
            retVal.b = parseInt(match[3]);
        }
        return retVal;
    };

    createMethod("beginPath");
    createMethod("moveTo");
    createMethod("lineTo");
    createMethod("rect");
    createMethod("arc");
    createMethod("stroke");
    createMethod("fill");
    createMethod("drawText");
    createMethod("setClipRect");
    createMethod("clearClipRect");
    createMethod("setTransform");
    createMethod("save");
    createMethod("restore");

    /*var getHost = function(url) {
        var startOfHost = url.indexOf("://") + 3;
        var index = startOfHost;
        if (url.charAt(index) == "[") {
            // IPv6
            index = url.indexOf("]", index);
        }
        var index2 = url.indexOf(":", index);
        var index3 = url.indexOf("/", index);
        if (index2 == -1) {
            index2 = index3;
        } else if (index3 != -1 && index3 < index2) {
            index2 = index3;
        }
        if (index2 == -1) {
            index2 = url.length;
        }
        return url.substring(startOfHost, index2);
    };
    
    var isLocal = function(url) {
        var host = getHost(url);
        if (host == "localhost" || host == "127.0.0.1" || host == "[::1]") {
            return true;
        }
        return false;
    };*/
    
    
    /**
     * Draws an image.
     * 
     * @param   img {var}           the image.
     * @param   sx {double}         source x coordinate.
     * @param   sy {double}         source y coordinate.
     * @param   swidth {double}     source width.
     * @param   sheight {double}    source height.
     * @param   dx {double}         destination x coordinate.
     * @param   dy {double}         destination y coordinate.
     * @param   dwidth {double}     destination width.
     * @param   dheight {double}    destination height.
     */
    self.drawImage = function(img, sx, sy, swidth, sheight, dx, dy, dwidth, dheight) {
        if (dx == null) {
            // 5 parameter version
            dx = sx;
            dy = sy;
            dwidth = swidth;
            dheight = sheight;
            sx = 0;
            sy = 0;
            swidth = -1;    // to be determined on the server
            sheight = -1;
        }
        //if (dx + dwidth > 0 && dy + dheight > 0 && dx < width && dy < height) {
            // the if clause above is flawed (doesn't take into account rotation)
            if (mGlobalAlpha != self.globalAlpha) {
                mGlobalAlpha = self.globalAlpha;
                mCommandQueue.push({ method:"setGlobalAlpha", params:[mGlobalAlpha] });
            }
            var url = img.src;
            if (url.indexOf(qxp.core.ServerSettings.serverPathPrefix) == 0) {
                url = self.getPrintService().fixUrl(url);
            }
            mCommandQueue.push({ method:"drawImage",
                params:[url, sx, sy, swidth, sheight, dx, dy, dwidth, dheight] });
            self.processQueue();
        //}
    };

    /**
     * Processes the command queue (may be overridden by sub-classes).
     */
    self.processQueue = function() {
        if (mCommandQueue.length == 0 || mCurrentCall != null || self.getDisposed()) {
            return;
        }
        var command = mCommandQueue[0];
        mCommandQueue.splice(0, 1);
        if (command != "refreshSession" && command.method != "drawImage") {
            for (var i = 0; i < self.getAggregateCommandCount() - 1; ++i) {
                if (mCommandQueue.length == 0) {
                    break;
                }
                var nextCommand = mCommandQueue[0];
                if (nextCommand.method == "drawImage") {
                    break;
                }
                mCommandQueue.splice(0, 1);
                command.method += "," + nextCommand.method;
                if (i == 0) {
                    command.params = [MapUtil.convertArray(command.params)];
                }
                command.params.push(MapUtil.convertArray(nextCommand.params));
            }
        }
        if (mExc != null) {
            window.setTimeout(self.processQueue, 0);
            return;
        }
        if (command == "refreshSession") {
            self._ptv_map_waitCounter += 1;
            mCurrentCall = "refreshSession";
            self.getPrintService().refreshSession(function(result, exc) {
                self._ptv_map_waitCounter -= 1;
                mCurrentCall = null;
                if (!result) {
                    exc = new Error("Error refreshing session");
                }
                mExc = exc;
                if (mExc != null && !self.getDisposed()) {
                    self.error(mExc);
                }
                self.processQueue();
            });
        } else {
            var commandParams = command.params;
            var commandParamCount = commandParams.length;
            var rpcArgs = new Array(commandParamCount + 2);
            rpcArgs[0] = function(result, exc) {
                //self.info("result: " + command.method);
                self._ptv_map_waitCounter -= 1;
                mCurrentCall = null;
                mExc = exc;
                if (mExc != null && !self.getDisposed()) {
                    self.error(mExc);
                }
                self.processQueue();
            };
            rpcArgs[1] = command.method;
            for (var i = 0; i < commandParamCount; ++i) {
                rpcArgs[i + 2] = commandParams[i];
            }
            self._ptv_map_waitCounter += 1;
            //self.info("call: " + command.method);
            var printService = self.getPrintService();
            mCurrentCall = printService.callAsync.apply(printService, rpcArgs);
        }
    };

    /**
     * Ends the current chain of commands.
     */
    self.end = function() {
        mCommandQueue.push({ method:"end", params:arguments });
        self.processQueue();
    };

    /**
     * Returns an error that occurred while painting on the context.
     * 
     * @return  {var}           the error or <code>null</code> if no error
     *                          occurred.
     */
    self.getError = function() {
        return mExc;
    };


    /**
     * Returns whether the command queue is empty and no async calls are still
     * running.
     *
     * @return  {boolean}       <code>true</code> if the command queue is
     *                          empty and there are no running async calls,
     *                          <code>false</code> otherwise.
     */
    self.isIdle = function() {
        if (self._ptv_map_waitCounter == 0 && mCommandQueue.length == 0) {
            return true;
        }
        return false;
    };


    /**
     * Returns the URL for retrieving the finished print image.
     * 
     * @return  {string}        the URL.
     */
    self.getPrintImageURL = function() {
        return map.MapUtil.rewriteURL(
            "/MapServlet?special=printimg&printId=" + mPrintId + 
            "&" + map.RequestBuilder.getTokenName() + "=" + encodeURIComponent(map.RequestBuilder.getTokenValue()),
            false, "");
    };
    
    
    /**
     * Intended to be overridden by sub-classes.
     */
    self.getAggregateCommandCount = function() {
        return 8;
    };


    /**
     * Intended to be overridden by sub-classes.
     */
    self.getPrintService = function() {
        if (mPrintService == null) {
            mPrintService = new map.Rpc(parentMap,
                qxp.io.remote.Rpc.makeServerURL("" + mPrintId),
                "com.ptvag.webcomponent.map.printing.PrintService");
            mPrintService.setTimeout(20000);
            if (map.SERVICE.getCrossDomain()) {
                mPrintService.setCrossDomain(true);
            }
        }
        return mPrintService;
    };


    /**
     * Returns the id used by this print context.
     *
     * @return  {var}           the id.
     */
    self.getPrintId = function() {
        return mPrintId;
    };


    /**
     * Returns the name of the first command that is currently in the queue.
     *
     * @return  {string}        the command name or <code>null</code> if no
     *                          command is currently queued.
     */
    self.getNextCommandName = function() {
        if (mCommandQueue.length == 0) {
            return null;
        }
        var command = mCommandQueue[0];
        if (command == "refreshSession") {
            return command;
        }
        return command.method;
    };


    var superDispose = self.dispose;
    self.dispose = function() {
        if (self.getDisposed()) {
            return;
        }
        if (mPrintService != null) {
            mPrintService.dispose();
        }
        superDispose.apply(self, arguments);
    };


    self._ptv_map_waitCounter = 0;
    window.setTimeout(self.processQueue, 0);
});

/** Used internally. */
qxp.Class.LAST_PRINT_ID = null;

/**
 * Creates an id for print image generation. You can assign your own function to
 * <code>createPrintId</code> if you need to reference the server-generated print
 * images from outside the browser environment.
 *
 * @return  {var}           the id (anything with a reasonable string representation).
 */
qxp.Class.createPrintId = function() {
    var printId = (new Date()).getTime();
    if (com.ptvag.webcomponent.map.PrintContext.LAST_PRINT_ID == printId) {
        printId += 1;
    }
    return printId;
};
