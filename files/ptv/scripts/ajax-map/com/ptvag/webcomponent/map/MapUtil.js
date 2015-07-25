/**
 * Utility class for the map.
 */
qxp.OO.defineClass("com.ptvag.webcomponent.map.MapUtil");
// TODO: convert this to a singleton (makes it easier to call methods from
// other methods here)


/**
 * Applies a filter to an element (IE only). The filter is composed of the
 * optional <code>_matrixFilter</code> and <code>_alphaFilter</code> properties
 * of the element.
 *
 * @param   elem {Element}      the element to apply the filter to.
 */
qxp.Class.applyFilter = function(elem) {
    var matrixFilter = elem._matrixFilter;
    var filter = (matrixFilter == null ? "" : matrixFilter);
    var alphaFilter = elem._alphaFilter;
    if (alphaFilter == null && filter.length > 0) {
        //filter += " Alpha(Opacity=100)";
    } else if (alphaFilter != null) {
        if (filter.length > 0) {
            filter += " ";
        }
        filter += alphaFilter;
    }
//if (matrixFilter != null) alert(filter);
//if (filter == "" && elem.nodeName == "DIV" && elem.style.width != "360px" && elem.style.width != "380px" && elem.style.width != "400px" && elem.style.width != "2000px")
//if (filter == "")
//com.ptvag.webcomponent.map.ImageLoader.info(elem);
//filter = "Alpha(Opacity=100)";
    elem.style.filter = filter;
};


/**
 * Sets the opacity of an element.
 *
 * @param elem {Element} the element to set the opacity for.
 * @param alpha {float} the new opacity of the element. 0 = not visible,
 *        1 = opaque.
 */
qxp.Class.setElementOpacity = function(elem, alpha) {
    var clientInstance = qxp.sys.Client.getInstance();
    if (clientInstance.isGecko()) {
        elem.style.MozOpacity = (alpha == null || alpha == 1) ? "" : alpha;
        elem.style.opacity = (alpha == null || alpha == 1) ? "" : alpha;
    } else if (clientInstance.isKhtml()) {
        elem.style.KhtmlOpacity = (alpha == null || alpha == 1) ? "" : alpha;
    } else if (clientInstance.isMshtml() && clientInstance.getMajor() < 10) {
        elem._alphaFilter = (alpha == null || alpha == 1) ? null : "Alpha(Opacity=" + Math.round(alpha * 100) + ")";
        com.ptvag.webcomponent.map.MapUtil.applyFilter(elem);
    } else {
        elem.style.opacity = (alpha == null || alpha == 1) ? "" : alpha;
    }
};


/**
 * Decimal to hex translator that prepends 0s if necessary to reach the
 * specified number of digits.
 * 
 * @param   value {int}         the number to convert.
 * @param   digits {int}        the desired number of digits.
 * 
 * @return  {string}            the converted string.
 */
qxp.Class.dec2hex = function(value, digits) {
    var retVal = value.toString(16);
    var toAdd = digits - retVal.length;
    for (var i = 0; i < toAdd; ++i) {
        retVal = "0" + retVal;
    }
    return retVal;
};


/**
 * Translates a color in rgb, rgba, or hex format into a pair of hex format and
 * opacity values.
 * 
 * @param   color {string}      the color.
 * 
 * @return  {Map}               a map with the keys "color" and "opacity".
 *                              The opacity is <code>null</code> if no value
 *                              for it was included in the specified color.
 */
qxp.Class.translateColor = function(color) {
    var clazz = com.ptvag.webcomponent.map.MapUtil;

    var opacity = null;
    
    var match = clazz.RGB_REGEX.exec(color);
    if (match == null) {
        match = clazz.RGBA_REGEX.exec(color);
        if (match != null) {
            opacity = parseFloat(match[4]);
        }
    }
    if (match == null) {
        var actualColor = color;
    } else {
        actualColor = "#" + clazz.dec2hex(parseInt(match[1]), 2) +
                            clazz.dec2hex(parseInt(match[2]), 2) +
                            clazz.dec2hex(parseInt(match[3]), 2);
    }
    
    return {color:actualColor, opacity:opacity};
};


/**
 * Sets the source URL of an image. Used to fix the alpha transparency bug for
 * PNG images in IE.
 *
 * @param imgElem {Element} The img element to set the source URL for.
 * @param imgUrl {string} The source URL to set.
 */
qxp.Class.setImageSource = function(imgElem, imgUrl) {
    if (qxp.sys.Client.getInstance().isMshtml() && qxp.sys.Client.getInstance().getMajor() < 10 && /\.png$/i.test(imgUrl)) {
        imgElem.src = com.ptvag.webcomponent.util.ServerUtils.rewriteURL(
            "img/com/ptvag/webcomponent/map/blank.gif", true);
        imgElem.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='"
            + imgUrl + "',sizingMethod='scale')";
    } else {
        imgElem.src = imgUrl;
    }
};


/**
 * Returns whether box-sizing is in border mode. In this mode the border and
 * padding are counted to the width of an element.
 * 
 * @return {boolean} Whether box-sizing is in border mode.
 */
qxp.Class.isBorderBoxSizingActive = function() {
    var MapUtil = com.ptvag.webcomponent.map.MapUtil;
    if (MapUtil._borderBoxSizingActive == null) {
        var tempDiv = document.createElement("div");
        tempDiv.style.visibility = "hidden";
        tempDiv.style.position = "absolute";
        tempDiv.style.border = "1px solid black";
        tempDiv.style.width = "10px";
        tempDiv.style.height = "10px";
        document.body.appendChild(tempDiv);

        var width = tempDiv.offsetWidth;
        MapUtil._borderBoxSizingActive = (width == 10);

        document.body.removeChild(tempDiv);
    }

    return MapUtil._borderBoxSizingActive;
};


/**
 * Creates and initializes a canvas element (compatible with canvas-supporting
 * browsers and with IE/excanvas).
 * 
 * @param   win {var}               the window inside which the canvas should
 *                                  be created (necessary for interacting with
 *                                  Google's excanvas lib).
 * @param   parentElement {Element} the parent element of the newly created
 *                                  canvas.
 * @param   width {int}             the width of the canvas.
 * @param   height {int}            the height of the canvas.
 * 
 * @return  {Element}               the canvas element or <code>null</code> if
 *                                  canvas drawing is not supported in the
 *                                  browser we're running in.
 */
qxp.Class.createCanvas = function(win, parentElement, width, height) {
    var doc = parentElement.ownerDocument;
    var canvas = doc.createElement("canvas");
    canvas.setAttribute("width", width);
    canvas.setAttribute("height", height);
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
    parentElement.appendChild(canvas);
    if (win.G_vmlCanvasManager) {
        win.G_vmlCanvasManager.initElement(canvas);
        var canvases = parentElement.getElementsByTagName("canvas");
        canvas = canvases[canvases.length - 1];
    }
    try {
        canvas.getContext("2d");
    } catch (exc) {
        parentElement.removeChild(canvas);
        return null;
    }
    return canvas;
};


/**
 * Cleans up a canvas element (necessary for IE/excanvas to avoid memory
 * leaks).
 * 
 * @param   win {var}               the window inside which the canvas resides.
 * @param   canvasElement {Element} the canvas element.
 */
qxp.Class.cleanupCanvas = function(win, canvasElement) {
    if (win.G_vmlCanvasManager && win.G_vmlCanvasManager.cleanupElement) {
        win.G_vmlCanvasManager.cleanupElement(canvasElement);
    }
};


/**
 * Recursively processes an HTML element for printing. For example,
 * borders and background colors are changed to make sure that they
 * appear in print.
 *
 * @param   element {Element}       the HTML element to process.
 */
qxp.Class.printFilter = function(element) {
    var client = qxp.sys.Client.getInstance();
    if (element.getAttribute("_ptv_map_dontPrint") == "true") {
        element.style.visibility = "hidden";
    }
    var style = element.style;
    if (style) {
        if (style.visibility == "hidden" || style.display == "none") {
            return;
        }
        if (client.isGecko()) {
            var borderWidth = style.borderLeftWidth;
            if (borderWidth != null) {
                style.borderLeftWidth = borderWidth.replace("px", "pt");
            }
            borderWidth = style.borderRightWidth;
            if (borderWidth != null) {
                style.borderRightWidth = borderWidth.replace("px", "pt");
            }
            borderWidth = style.borderTopWidth;
            if (borderWidth != null) {
                style.borderTopWidth = borderWidth.replace("px", "pt");
            }
            borderWidth = style.borderBottomWidth;
            if (borderWidth != null) {
                style.borderBottomWidth = borderWidth.replace("px", "pt");
            }
        }
        if (style.filter != null) {
            style.filter = null;
        }
        if (style.MozOpacity != null) {
            style.MozOpacity = null;
        }
        if (style.opacity != null) {
            style.opacity = null;
        }
        if (client.isMshtml()) {
            if (element._ptv_map_printBackground) {
                // draw a pseudo-gradient in the background
                var backgroundElement =
                    element.ownerDocument.createElement("div");
                backgroundElement.style.position = "absolute";
                var leftOffset = element._ptv_map_printBackgroundLeft;
                if (leftOffset) {
                    backgroundElement.style.left = parseInt(style.left) +
                        parseInt(leftOffset) + "px";
                } else {
                    backgroundElement.style.left = style.left;
                }
                var topOffset = element._ptv_map_printBackgroundTop;
                if (topOffset) {
                    backgroundElement.style.top = parseInt(style.top) +
                        parseInt(topOffset) + "px";
                } else {
                    backgroundElement.style.top = style.top;
                }
                var width = element._ptv_map_printBackgroundWidth;
                if (width != null) {
                    width += "px";
                } else {
                    width = style.width;
                }
                backgroundElement.style.width = width;
                var height = element._ptv_map_printBackgroundHeight;
                if (height != null) {
                    height += "px";
                } else {
                    height = style.height;
                }
                backgroundElement.style.height = height;
                var backgroundColor = "white";
                if (style.backgroundColor != null &&
                    style.backgroundColor != "") {
                    backgroundColor = style.backgroundColor;
                }
                backgroundElement.style.filter = "progid:DXImageTransform.Microsoft.Gradient(gradientType=0,startColorStr=" +
                    backgroundColor + ",endColorStr=" + backgroundColor + ")";
                element.parentNode.insertBefore(backgroundElement, element);
            }
        }
    }
    var childNodes = element.childNodes;
    var childNodeCount = childNodes.length;
    for (var i = 0; i < childNodeCount; ++i) {
        var childNode = childNodes[i];
        if (childNode.nodeType == 1) {
            com.ptvag.webcomponent.map.MapUtil.printFilter(childNode);
        }
        var newCount = childNodes.length;
        if (newCount > childNodeCount) {
            // in case we inserted additional nodes
            i += (newCount - childNodeCount);
            childNodeCount = newCount;
        }
    }
};


/**
 * Clones an HTML node for printing. This means that the node is first
 * deep-cloned and then processed using {@link #printFilter()}.
 *
 * @param   node {Element}          the node to clone.
 * @param   targetDocument {var}    the target document into which the cloned
 *                                  node should later be inserted. This is
 *                                  important to correctly clone the node in
 *                                  Internet Explorer.
 *
 * @return  {Element}               the cloned node.
 */
qxp.Class.cloneNodeForPrinting = function(node, targetDocument) {
    if (qxp.sys.Client.getInstance().isMshtml()) {
        var tempParent = targetDocument.createElement("div");
        tempParent.innerHTML = node.outerHTML;
        var retVal = tempParent.firstChild;
        tempParent.removeChild(tempParent.firstChild);
    } else {
        retVal = node.cloneNode(true);
    }

    com.ptvag.webcomponent.map.MapUtil.printFilter(retVal);
    return retVal;
};


/**
 * Resolves a relative or absolute URL. Relative URLs pointing to internal map
 * component resources are changed to absolute URLs. All other URLs are
 * returned unchanged.
 * 
 * @param   url {string}            the original URL.
 * 
 * @return  the resolved URL.
 */
qxp.Class.resolveURL = function(url) {
    if (url.indexOf("//") == -1 &&
        url.indexOf("img/com/ptvag/webcomponent/") == 0) {
        return com.ptvag.webcomponent.util.ServerUtils.rewriteURL(url, true);
    }
    return url;
};


/**
 * Converts a "pseudo-array" (as passed in the arguments variable) to a real
 * array.
 * 
 * @param   input {var}             the pseudo-array to convert.
 * 
 * @return  the resulting array.
 */
qxp.Class.convertArray = function(input) {
    var length = input.length;
    var output = new Array(length);
    for (var i = 0; i < length; ++i) {
        output[i] = input[i];
    }
    return output;
};


/**
 * Rewrites a URL while taking into account the server for static resources
 * configured on the server side.
 *
 * @param url {string} the URL to rewrite.
 * @param cacheable {boolean, false} indicates whether the resource is
 *                                   cacheable (and should be requested from
 *                                   the server for static resources).
 * @param basePath {string, null} an optional alternative base resource path
 *                                (useful for custom-made URLs that don't
 *                                access the usual resource location).
 */
qxp.Class.rewriteURL = function(url, cacheable, basePath) {
    var oldPrefix = qxp.core.ServerSettings.serverPathPrefix;
    var staticServer = com.ptvag.webcomponent.map.Map.STATIC_SERVER;
    if (cacheable && staticServer != null) {
        qxp.core.ServerSettings.serverPathPrefix = staticServer;
    }
    var ServerUtils = com.ptvag.webcomponent.util.ServerUtils;
    var oldBasePath = ServerUtils.basePath;
    if (basePath != null) {
        ServerUtils.basePath = basePath;
    }
    var retVal = com.ptvag.webcomponent.util.ServerUtils.rewriteURL(url, cacheable);
    qxp.core.ServerSettings.serverPathPrefix = oldPrefix;
    ServerUtils.basePath = oldBasePath;
    return retVal;
};


/**
 * Escape &lt;, &gt;, and &amp; in a string.
 *
 * @param   str {string}    the source string.
 *
 * @return  the string with the escaped characters.
 */
qxp.Class.escapeHTML = function(str) {
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
};


/**
 * Returns whether the browser supports affine transforms of elements. Please
 * note that this check isn't reliable with respect to future browser versions.
 * If in doubt, <code>false</code> is returned.
 *
 * @return  <code>true</code> if the browse supports CSS transforms,
 *          <code>false</code> otherwise.
 */
qxp.Class.areAffineTransformsSupported = function() {
    var client = qxp.sys.Client.getInstance();
    var versionMajor = client.getMajor();
    var versionMinor = client.getMinor();
    var versionRevision = client.getRevision();
    if (client.isMshtml() && (versionMajor >= 6 || versionMajor == 5 && versionMinor >= 5) ||
        client.isGecko() && (versionMajor >= 2 || versionMajor == 1 && (versionMinor >= 10 || versionMinor == 9 && versionRevision >= 1)) ||
        client.isWebkit() && versionMajor >= 525 ||
        client.isOpera() && (versionMajor >= 11 || versionMajor == 10 && versionMinor >= 5)) {
        return true;
    }
    return false;
};


/**
 * Creates a rotation matrix.
 *
 * @param   angle {double}      the rotation angle in degrees
 *                              (counter-clockwise).
 * @param   originX {double}    the x coordinate of the origin.
 * @param   originY {double}    the y coordinate of the origin.
 *
 * @return  {var}               the rotation matrix with a, b, c, d, tx, and ty
 *                              properties.
 */
qxp.Class.createRotationMatrix = function(angle, originX, originY) {
    var rad = angle/180.0*Math.PI;
    var a = Math.cos(rad);
    var b = -Math.sin(rad);
    var c = -b;
    var d = a;
    var tx = -a*originX + b*originY + originX;
    var ty =  c*originX - d*originY + originY;
    return {a:a, b:b, c:c, d:d, tx:tx, ty:ty};
};


/**
 * Sets the augmented affine transform matrix for an element. The origin is set
 * to (0/0) because that's what IE uses (and it's configurable in every browser
 * except IE).
 *
 * @param   elem {Element}      the element to set the transform for.
 * @param   matrix {Map}        a map with numerical <code>a</code>,
 *                              <code>b</code>, <code>c</code>, <code>d</code>,
 *                              <code>tx</code>, and <code>ty</code>
 *                              properties.
 */
qxp.Class.setAffineTransform = function(elem, matrix) {
    var a = String(matrix.a);
    if (a.indexOf("e") != -1) {
        a = "0";
    }
    var b = String(matrix.b);
    if (b.indexOf("e") != -1) {
        b = "0";
    }
    var c = String(matrix.c);
    if (c.indexOf("e") != -1) {
        c = "0";
    }
    var d = String(matrix.d);
    if (d.indexOf("e") != -1) {
        d = "0";
    }
    var tx = String(matrix.tx);
    if (tx.indexOf("e") != -1) {
        tx = "0";
    }
    var ty = String(matrix.ty);
    if (ty.indexOf("e") != -1) {
        ty = "0";
    }
    var clientInstance = qxp.sys.Client.getInstance();
    if (clientInstance.isMshtml() && clientInstance.getMajor() < 10) {
        elem._matrixFilter = "progid:DXImageTransform.Microsoft.Matrix(" +
            "M11=" + a + ",M21=" + b + ",M12=" + c + ",M22=" + d +
            ",Dx=" + tx + ",Dy=" + ty + ")";
        com.ptvag.webcomponent.map.MapUtil.applyFilter(elem);
    } else if (clientInstance.isGecko()) {
        elem.style.MozTransformOrigin = "0 0";
        elem.style.MozTransform =
            "matrix(" + a + "," + b + "," + c + "," + d + "," +
            tx + "px," + ty + "px)";
    } else if (clientInstance.isWebkit()) {
        elem.style.WebkitTransformOrigin = "0 0";
        elem.style.WebkitTransform =
            "matrix(" + a + "," + b + "," + c + "," + d + "," +
            tx + "," + ty + ")";
    } else if (clientInstance.isOpera()) {
        elem.style.OTransformOrigin = "0 0";
        elem.style.OTransform =
            "matrix(" + a + "," + b + "," + c + "," + d + "," +
            tx + "," + ty + ")";
    } else {
        elem.style.transformOrigin = "0 0";
        elem.style.transform =
            "matrix(" + a + "," + b + "," + c + "," + d + "," +
            tx + "," + ty + ")";
    }
};


/**
 * Resets the augmented affine transform matrix for an element.
 *
 * @param   elem {Element}      the element to reset the transform for.
 */
qxp.Class.resetAffineTransform = function(elem) {
    var clientInstance = qxp.sys.Client.getInstance();
    if (clientInstance.isMshtml() && clientInstance.getMajor() < 10) {
        elem._matrixFilter = null;
        com.ptvag.webcomponent.map.MapUtil.applyFilter(elem);
    } else if (clientInstance.isGecko()) {
        elem.style.MozTransformOrigin = "";
        elem.style.MozTransform = "";
    } else if (clientInstance.isWebkit()) {
        elem.style.WebkitTransformOrigin = "";
        elem.style.WebkitTransform = "";
    } else if (clientInstance.isOpera()) {
        elem.style.OTransformOrigin = "";
        elem.style.OTransform = "";
    } else {
        elem.style.transformOrigin = "";
        elem.style.transform = "";
    }
};


/** {int} The maximum width a scaled image should have (in pixels). */
// NOTE: We need a much smaller max in IE, because IE doesn't do a virtual
//       scaling. (Yes, it's unbelievable but they create an offscreen image
//       having the full size of the image. At least the memory consumption
//       lets us assume this.)
qxp.Class.MAX_IMAGE_SCALE_WIDTH = (qxp.sys.Client.getInstance().isMshtml() && qxp.sys.Client.getInstance().getMajor() < 9 ? 2000 : 20000);

/** {int} The minim width a scaled image should have (in pixels). */
// NOTE: In IE 8, _downscaling_ images has become really slow (for whatever
//       weird reason). So use a minimum width of 32 pixels for IE and 1 pixel
//       for sane browsers.
qxp.Class.MIN_IMAGE_SCALE_WIDTH = (qxp.sys.Client.getInstance().isMshtml() && qxp.sys.Client.getInstance().getMajor() >= 8 ? 32 : 1);

/** Used internally by {@link #translateColor()}. */
qxp.Class.RGB_REGEX = /^\s*rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)\s*$/i;

/** Used internally by {@link #translateColor()}. */
qxp.Class.RGBA_REGEX = /^\s*rgba\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\,\s*([0-9.]+)\s*\)\s*$/i;
