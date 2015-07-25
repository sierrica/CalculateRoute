/**
 * A factory for creating info box elements (a container with a tip so you know
 * at what coordinates the anchor point is). These elements are used by the
 * {@link InfoBox} and {@link Tooltip} classes.
 * <p>
 * This class is used as the default factory. To change it to something else,
 * use a piece of code like this:
 * <code>com.ptvag.webcomponent.map.vector.InfoBoxElementFactory =
 * com.ptvag.webcomponent.map.vector.InfoBoxElementFactoryRound.getInstance();</code>
 * </p>
 * <p>
 * To change any properties of the active factory, use code like this:
 * <code>com.ptvag.webcomponent.map.vector.InfoBoxElementFactory.setPaddingLeft("2px");</code>
 * </p>
 */
qxp.OO.defineClass("com.ptvag.webcomponent.map.vector.InfoBoxElementFactoryDefault",
                  qxp.core.Object,
function() {
    qxp.core.Object.call(this);
    
    var self = this;

    
    /**
     * Creates the content portion of an info box (the one directly around the
     * content). This method is intended solely to be overridden by sub
     * classes - don't call it directly.
     * <p>
     * Currently, the returned HTML string <strong>must</strong> contain a
     * <code>&lt;td&gt;</code> tag as the top level element. When creating the
     * HTML string, the padding properties must be taken into account (most
     * naturally by creating CSS paddings). The same is true for the
     * {@link #allowWrap} property.
     * </p>
     *
     * @param   content {string}    the actual content to be displayed.
     * @param   bgcolor {string}    the background color that should be used
     *                              (CSS syntax).
     * @param   allowWrap {boolean, null}   when not <code>null</code>, this
     *                                  parameter is used to determine whether
     *                                  the content of the created box is
     *                                  allowed to wrap. Otherwise, the value
     *                                  of {@link #allowWrap} is used.
     *
     * @return  {string}            the HTML for the content portion of the box.
     */
    self.createContentBox = function(content, bgcolor, allowWrap) {
        if (allowWrap == null) {
            allowWrap = self.getAllowWrap();
        }
        var paddingLeft = self.getPaddingLeft();
        var paddingRight = self.getPaddingRight();
        var paddingTop = self.getPaddingTop();
        var paddingBottom = self.getPaddingBottom();
        return '<td bgcolor="' + bgcolor + '" style="' +
               'padding-left:' + paddingLeft +
               ';padding-right:' + paddingRight +
               ';padding-top:' + paddingTop +
               ';padding-bottom:' + paddingBottom +
               ';border:1px #7f7f7f solid' +
               (allowWrap ? '' : ';white-space:nowrap') + '">' + content +
               '</td>';
    };
    
    
    /**
     * Creates an info box element.
     * 
     * @param   x {double}              the x coordinate of the box anchor.
     * @param   y {double}              the y coordinate of the box anchor.
     * @param   content {string}        the HTML content of the box.
     * @param   container {Element}     the DOM container to put the box into
     *                                  (it must be put into the DOM by this
     *                                  method - instead of outside - because
     *                                  the width and height need to be
     *                                  determined here).
     * @param   visible {boolean}       the initial visibility of the box
     *                                  (realized via the "visibility"
     *                                  attribute).
     * @param   reuseElement {Element,null}     an existing element that should
     *                                  be reused to create the info box
     *                                  element.
     * @param   allowWrap {boolean, null}   when not <code>null</code>, this
     *                                  parameter is used to determine whether
     *                                  the content of the created box is
     *                                  allowed to wrap. Otherwise, the value
     *                                  of {@link #allowWrap} is used.
     * @param   initialOpacity {double, 100}    when not <code>null</code>,
     *                                  this parameter is used to set the
     *                                  initial opacity of the element.
     * 
     * @return  {Element}               the newly created DOM element.
     */
    self.createInfoBoxElement = function(x, y, content, container,
        visible, reuseElement, allowWrap, initialOpacity) {
        
        var paddingLeft = self.getPaddingLeft();
        var paddingRight = self.getPaddingRight();
        var paddingTop = self.getPaddingTop();
        var paddingBottom = self.getPaddingBottom();
        
        // support old-style string for content
        if (content.text == null) {
            content = { text:content, background:"#ffffff" };
        }
        
        var initialWidth = null;
        
        var infoBoxElement = reuseElement;
        if (infoBoxElement == null) {
            infoBoxElement = document.createElement("div");
            //infoBoxElement.className = "webcomponent_tooltip";
            infoBoxElement.style.position = "absolute";
        } else {
            initialWidth = infoBoxElement.childNodes[0].style.width;
            if (initialWidth != null) {
                initialWidth = parseInt(initialWidth);
            }
        }
        var MapUtil = com.ptvag.webcomponent.map.MapUtil;
        
        var top = 0;
        var infoBoxHTML = '';
        // TODO: use and array + join (faster than +=)

        infoBoxHTML +=
            '<table cellpadding="0" cellspacing="0" border="0"' +
               ' style="position:absolute;left:0px;top:' + top + 'px' +
               (initialWidth != null ? ';width:' + initialWidth + 'px' : '') +
               '">' +
                   '<tr>' +
                       '<td></td>' +
                       '<td align="left" style="font-size:1px">' +
                           '<div style="width:11px;height:19px"></div>' +
                       '</td>' +
                       '<td></td>' +
                   '</tr>' +
        	   '<tr>' +
        	       '<td style="font-size:1px">' +
        	           '<div style="width:19px;height:11px"></div>' +
        	       '</td>' +
        	       self.createContentBox(content.text, content.background, allowWrap) +
        	       '<td style="font-size:1px">' +
        	           '<div style="width:19px;height:11px"></div>' +
        	       '</td>' +
        	   '</tr>' +
        	   '<tr>' +
                   '<td></td>' +
        	       '<td align="left" style="font-size:1px">' +
                       '<div style="width:11px;height:19px"></div>' +
        	       '</td>' +
                   '<td></td>' +
        	   '</tr>' +
        	'</table>';

        // create images
        infoBoxHTML += '<img src="' +
            MapUtil.rewriteURL("img/com/ptvag/webcomponent/map/line2left.gif", true) +
            '" height="11" width="20" style="left:0px;top:19px;position:absolute;display:none"/>';
        infoBoxHTML += '<img src="' +
            MapUtil.rewriteURL("img/com/ptvag/webcomponent/map/line2right.gif", true) +
            '" height="11" width="20" style="right:0px;top:19px;position:absolute;display:none"/>';
        infoBoxHTML += '<img src="' +
            MapUtil.rewriteURL("img/com/ptvag/webcomponent/map/line2up.gif", true) +
            '" height="20" width="11" style="' +
            (initialWidth != null ? ';left:' + Math.round((initialWidth - 11)/2) + 'px' : '') +
            ';position:absolute;top:0px;display:none"/>';
        infoBoxHTML += '<img src="' +
            MapUtil.rewriteURL("img/com/ptvag/webcomponent/map/line2.gif", true) +
            '" height="20" width="11" style="' +
            (initialWidth != null ? ';left:' + Math.round((initialWidth - 11)/2) + 'px' : '') +
            ';position:absolute;bottom:0px"/>';
        // There is a problem here in IE6 and IE7 in quirks mode (fixed in
        // IE8):
        // http://www.brunildo.org/test/ap_contbox1odd.html
        // It's not easy to fix without a lot of code, so leave it for now
        // (workaround: use standards mode).
        infoBoxHTML +=
	    '<img src="' + 
	    MapUtil.rewriteURL("img/com/ptvag/webcomponent/map/closebox.gif", true) +
	    '" width="7" height="7" style="position:absolute;top:19px;right:19px;display:none"/>';

        infoBoxElement.innerHTML = infoBoxHTML;
        if (initialOpacity != null) {
            MapUtil.setElementOpacity(infoBoxElement, initialOpacity/100);
        }
        if (!reuseElement) {
            infoBoxElement.style.visibility = "hidden";
            container.appendChild(infoBoxElement);
        }

        var table = infoBoxElement.childNodes[0];
        var width = table.offsetWidth;
        var height = table.offsetHeight;
        mouseHandlerElement =
            table.getElementsByTagName("tr")[1].childNodes[1];
        mouseHandlerElement._ignoreMouseDown = true;
        mouseHandlerElement._ignoreMouseUp = true;
        mouseHandlerElement._allowSelection = true;
        mouseHandlerElement._ignoreMouseWheel = self.getAllowMouseWheel();

        table.style.width = width + "px";
        infoBoxElement.style.width = width + "px";
        infoBoxElement.style.height = height + "px";
        infoBoxElement._ptv_map_printBackground = true;
        infoBoxElement._ptv_map_printBackgroundHeight = height - 40;
        infoBoxElement._ptv_map_printBackgroundWidth = width - 40;
        infoBoxElement._ptv_map_printBackgroundLeft = 20;
        infoBoxElement._ptv_map_printBackgroundTop = 20;
        
        var imgElements = infoBoxElement.getElementsByTagName("img");
        var imgElementCount = imgElements.length;
        var imgElement1 = imgElements[imgElementCount - 2];
        imgElement1._ignoreMouseDown = true;
        var imgElement2 = imgElements[imgElementCount - 3];
        imgElement2._ignoreMouseDown = true;
        imgElement2 = imgElements[imgElementCount - 4];
        imgElement2._ignoreMouseDown = true;
        imgElement2 = imgElements[imgElementCount - 5];
        imgElement2._ignoreMouseDown = true;
        var closeboxElement = imgElements[imgElementCount - 1];
        closeboxElement._ignoreMouseDown = true;
        closeboxElement._ignoreMouseUp = true;
        closeboxElement._ignoreMouseWheel = self.getAllowMouseWheel();
        // note: mouse up is not ignored (because then click events wouldn't
        // get through which would make selecting something that has a tooltip
        // very awkward)
        infoBoxElement._width = width;      // shortcut, so offsetWidth and
        infoBoxElement._height = height;    // offsetHeight don't have to be
                                            // used in positionInfoBoxElement()
        infoBoxElement._containerWidth = container.offsetWidth;
        infoBoxElement._containerHeight = container.offsetHeight;
        self.positionInfoBoxElement(infoBoxElement, x, y);
        if (visible) {
            infoBoxElement.style.visibility = "visible";
        }
        return infoBoxElement;
    };
    
    
    /**
     * Sets the position of an info box element.
     * 
     * @param   infoBoxElement {Element}    the info box element.
     * @param   x {double}          the x position.
     * @param   y {double}          the y position.
     */
    self.positionInfoBoxElement = function(infoBoxElement, x, y) {
        var imgElements = infoBoxElement.getElementsByTagName("img");
        var imgElementCount = imgElements.length;
        var leftImgElement = imgElements[imgElementCount - 5];
        var rightImgElement = imgElements[imgElementCount - 4];
        var topImgElement = imgElements[imgElementCount - 3];
        var bottomImgElement = imgElements[imgElementCount - 2];

        var clearLeft = self.getClearLeft();
        var clearRight = self.getClearRight();
        var clearTop = self.getClearTop();
        var clearBottom = self.getClearBottom();

        // determine where to show the box
        var freeSpaceTop = y - infoBoxElement._height + 19 - clearTop;
        var freeSpaceBottom = infoBoxElement._containerHeight - clearBottom -
                              (y + infoBoxElement._height - 19);
        var freeSpaceLeft = x - infoBoxElement._width + 19 - clearLeft;
        var freeSpaceRight = infoBoxElement._containerWidth - clearRight -
                             (x + infoBoxElement._width - 19);
        infoBoxElement._borderLeft = 19;
        infoBoxElement._borderRight = 19;
        infoBoxElement._borderTop = 19;
        infoBoxElement._borderBottom = 19;
        if (freeSpaceTop >= 0 ||
            freeSpaceBottom < 0 && freeSpaceLeft < 0 && freeSpaceRight < 0) {
            // always prefer the imgElement at the bottom
            var tipToShow = bottomImgElement;
            infoBoxElement._borderBottom = 0;
        } else if (freeSpaceBottom >= 0) {
            tipToShow = topImgElement;
            infoBoxElement._borderTop = 0;
        } else if (freeSpaceLeft >= 0) {
            tipToShow = rightImgElement;
            infoBoxElement._borderRight = 0;
        } else {
            tipToShow = leftImgElement;
            infoBoxElement._borderLeft = 0;
        }
        
        for (var i = imgElementCount - 5; i <= imgElementCount - 2; ++i) {
            var imgElement = imgElements[i];
            if (imgElement == tipToShow) {
                imgElement.style.display = "";
            } else {
                imgElement.style.display = "none";
            }
        }
        var tipWidth = self.getTipWidth();
        var tipMargin = self.getTipMargin();
        if (tipToShow == bottomImgElement || tipToShow == topImgElement) {
            var left = x - infoBoxElement._width/2;
            var width = infoBoxElement._width;
            var containerWidth = infoBoxElement._containerWidth - clearRight;
            if (left + width - 19 > containerWidth) {
                left = containerWidth - width + 19;
            }
            if (left < -19 + clearLeft) {
                left = -19 + clearLeft;
            }
            var imgMargin = x - left - tipWidth/2;
            if (imgMargin - 19 < tipMargin) {
                left += imgMargin - tipMargin - 19;
                imgMargin = tipMargin + 19;
            } else if (imgMargin > width - 19 - tipWidth - tipMargin) {
                left += imgMargin - (width - 19 - tipWidth - tipMargin);
                imgMargin = width - 19 - tipWidth - tipMargin;
            }
            var top = y - infoBoxElement._height;
            if (tipToShow == topImgElement) {
                top = y;
                topImgElement.style.left = Math.round(imgMargin) + "px";
            } else {
                bottomImgElement.style.left = Math.round(imgMargin) + "px";
            }
            infoBoxElement.style.left = Math.round(left) + "px";
            infoBoxElement.style.top = Math.round(top) + "px";
        } else {
            var top = y - infoBoxElement._height/2;
            var height = infoBoxElement._height;
            var containerHeight = infoBoxElement._containerHeight - clearBottom;
            if (top + height - 19 > containerHeight) {
                top = containerHeight - height + 19;
            }
            if (top < -19 + clearTop) {
                top = -19 + clearTop;
            }
            var imgMargin = y - top - tipWidth/2;
            if (imgMargin - 19 < tipMargin) {
                top += imgMargin - tipMargin - 19;
                imgMargin = tipMargin + 19;
            } else if (imgMargin > height - 19 - tipWidth - tipMargin) {
                top += imgMargin - (height - 19 - tipWidth - tipMargin);
                imgMargin = height - 19 - tipWidth - tipMargin;
            }
            var left = x - infoBoxElement._width;
            if (tipToShow == leftImgElement) {
                left = x;
                leftImgElement.style.top = Math.round(imgMargin) + "px";
            } else {
                rightImgElement.style.top = Math.round(imgMargin) + "px";
            }
            infoBoxElement.style.top = Math.round(top) + "px";
            infoBoxElement.style.left = Math.round(left) + "px";
        }
    };
    
    
    /**
     * Destroys an info box element and removes it from its parent node.
     * Always use this method to prevent memory leaks.
     * 
     * @param   infoBoxElement {Element}    the info box element to destroy.
     */
    self.destroyInfoBoxElement = function(infoBoxElement) {
        infoBoxElement.parentNode.removeChild(infoBoxElement);
        var imgElements = infoBoxElement.getElementsByTagName("img");
        var closeboxElement = imgElements[imgElements.length - 1];
        closeboxElement.onclick = null;
    };


    /**
     * Activates the close widget of the info box (inactive by default).
     *
     * @param   infoBoxElement {Element}    the info box element to activate
     *                                      the close widget of.
     * @param   handler {function}          the handler function to be called
     *                                      when the close widget is clicked.
     */
    self.activateCloseWidget = function(infoBoxElement, handler) {
        var imgElements = infoBoxElement.getElementsByTagName("img");
        var closeboxElement = imgElements[imgElements.length - 1];
        closeboxElement.style.display = "";
        closeboxElement.onclick = handler;
    };
    

    /**
     * Tests whether the coordinates in the specified event are inside of (or
     * near) the specified tooltip element.
     *
     * @param   evt {Map}                   the event.
     * @param   element {Element}           the tooltip element.
     * @param   tolerance {int}             the tolerance around the element
     *                                      for the coordinates to still be
     *                                      considered "near".
     *
     * @return  {boolean}                   <code>true</code> if the mouse
     *                                      coordinates are outside (and too
     *                                      far from) the element,
     *                                      <code>false</code> otherwise.
     */
    self.testUnhover = function(evt, element, tolerance) {
        var minX = parseInt(element.style.left);
        var maxX = minX + element._width;
        var minY = parseInt(element.style.top);
        var maxY = minY + element._height;
        minX += element._borderLeft - tolerance;
        maxX -= element._borderRight - tolerance;
        minY += element._borderTop - tolerance;
        maxY -= element._borderBottom - tolerance;
        if (evt.relMouseX >= minX && evt.relMouseX < maxX &&
            evt.relMouseY >= minY && evt.relMouseY < maxY) {
            return false;
        }
        return true;
    };


    /**
     * Tests whether the coordinates in the specified event are inside of the
     * specified tooltip element.
     *
     * @param   evt {Map}                   the event.
     * @param   element {Element}           the tooltip element.
     *
     * @return  {boolean}                   <code>true</code> if the mouse
     *                                      coordinates are inside,
     *                                      <code>false</code> otherwise.
     */
    self.hitTest = function(evt, element) {
        var minX = parseInt(element.style.left) + 19;
        var maxX = minX + element._width - 38;
        var minY = parseInt(element.style.top) + 19;
        var maxY = minY + element._height - 38;
        if (evt.relMouseX >= minX && evt.relMouseX < maxX &&
            evt.relMouseY >= minY && evt.relMouseY < maxY) {
            return true;
        }
        if (evt.relMouseY >= minY && evt.relMouseY < maxY) {
            if (element._borderLeft == 0 &&
                evt.relMouseX < minX && evt.relMouseX >= minX - 19) {
                var imgElements = element.getElementsByTagName("img");
                var imgElementCount = imgElements.length;
                var leftImgElement = imgElements[imgElementCount - 5];
                var imgTop = parseInt(element.style.top) +
                             parseInt(leftImgElement.style.top);
                if (evt.relMouseY >= imgTop && evt.relMouseY < imgTop + 11) {
                    return true;
                }
            }
            if (element._borderRight == 0 &&
                evt.relMouseX >= maxX && evt.relMouseX < maxX + 19) {
                imgElements = element.getElementsByTagName("img");
                imgElementCount = imgElements.length;
                var rightImgElement = imgElements[imgElementCount - 4];
                imgTop = parseInt(element.style.top) +
                         parseInt(rightImgElement.style.top);
                if (evt.relMouseY >= imgTop && evt.relMouseY < imgTop + 11) {
                    return true;
                }
            }
        }
        if (evt.relMouseX >= minX && evt.relMouseX < maxX) {
            if (element._borderTop == 0 &&
                evt.relMouseY < minY && evt.relMouseY >= minY - 19) {
                imgElements = element.getElementsByTagName("img");
                imgElementCount = imgElements.length;
                var topImgElement = imgElements[imgElementCount - 3];
                var imgLeft = parseInt(element.style.left) +
                              parseInt(topImgElement.style.left);
                if (evt.relMouseX >= imgLeft && evt.relMouseX < imgLeft + 11) {
                    return true;
                }
            }
            if (element._borderBottom == 0 &&
                evt.relMouseY >= maxY && evt.relMouseY < maxY + 19) {
                imgElements = element.getElementsByTagName("img");
                imgElementCount = imgElements.length;
                var bottomImgElement = imgElements[imgElementCount - 2];
                imgLeft = parseInt(element.style.left) +
                          parseInt(bottomImgElement.style.left);
                if (evt.relMouseX >= imgLeft && evt.relMouseX < imgLeft + 11) {
                    return true;
                }
            }
        }
        return false;
    };

});


/**
 * Whether wrapping should be allowed. If set to <code>true</code>, you should
 * always specify a width in the box content - otherwise, the box will have
 * only a minimum width!
 */
qxp.OO.addProperty({ name:"allowWrap", type:qxp.constant.Type.BOOLEAN, allowNull:false, defaultValue:false });


/** The left padding between the box content and the box edge. */
qxp.OO.addProperty({ name:"paddingLeft", type:qxp.constant.Type.STRING, allowNull:false, defaultValue:"8px" });
/** The right padding between the box content and the box edge. */
qxp.OO.addProperty({ name:"paddingRight", type:qxp.constant.Type.STRING, allowNull:false, defaultValue:"8px" });
/** The top padding between the box content and the box edge. */
qxp.OO.addProperty({ name:"paddingTop", type:qxp.constant.Type.STRING, allowNull:false, defaultValue:"4px" });
/** The bottom padding between the box content and the box edge. */
qxp.OO.addProperty({ name:"paddingBottom", type:qxp.constant.Type.STRING, allowNull:false, defaultValue:"4px" });


/**
 * Whether or not the mouse wheel can be used to scroll the content of
 * info boxes. Please note: If <code>allowMouseWheel</code> is
 * <code>true</code>, no map zooming is performed when using the
 * mouse wheel while the mouse pointer is over an info box (even if the box
 * content doesn't have a scrollbar).
 */
qxp.OO.addProperty({ name:"allowMouseWheel", type:qxp.constant.Type.BOOLEAN, allowNull:false, defaultValue:false });


/**
 * The width of the tip that shows the anchor point of info boxes - changing
 * the default value doesn't work yet and leads to a wrong tip position!
 */
qxp.OO.addProperty({ name:"tipWidth", type:qxp.constant.Type.NUMBER, allowNull:false, defaultValue:11 });

/**
 * The height of the tip that shows the anchor point of info boxes - changing
 * the default value doesn't work yet and leads to a wrong tip position!
 */
qxp.OO.addProperty({ name:"tipHeight", type:qxp.constant.Type.NUMBER, allowNull:false, defaultValue:20 });

/**
 * The margin around the tip. This margin limits shifting of info boxes that
 * is performed to obey {@link #clearLeft} and {@link #clearRight}.
 */
qxp.OO.addProperty({ name:"tipMargin", type:qxp.constant.Type.NUMBER, allowNull:false, defaultValue:0 });

/**
 * The number of pixels at the left map edge that should not be covered by
 * info boxes (if possible).
 */
qxp.OO.addProperty({ name:"clearLeft", type:qxp.constant.Type.NUMBER, allowNull:false, defaultValue:0 });

/**
 * The number of pixels at the right map edge that should not be covered by
 * info boxes (if possible).
 */
qxp.OO.addProperty({ name:"clearRight", type:qxp.constant.Type.NUMBER, allowNull:false, defaultValue:30 });

/**
 * The number of pixels at the top map edge that should not be covered by
 * info boxes (if possible).
 */
qxp.OO.addProperty({ name:"clearTop", type:qxp.constant.Type.NUMBER, allowNull:false, defaultValue:35 });

/**
 * The number of pixels at the bottom map edge that should not be covered by
 * info boxes (if possible).
 */
qxp.OO.addProperty({ name:"clearBottom", type:qxp.constant.Type.NUMBER, allowNull:false, defaultValue:0 });


/**
 * Returns the single instance of this class.
 *
 * @return  {InfoBoxElementFactoryDefault}  the instance.
 */
qxp.Class.getInstance = function() {
    var vector = com.ptvag.webcomponent.map.vector;
    var myClass = vector.InfoBoxElementFactoryDefault;
    if (myClass.instance == null) {
        myClass.instance =
            new vector.InfoBoxElementFactoryDefault();
    }
    return myClass.instance;
}


// default factory
com.ptvag.webcomponent.map.vector.InfoBoxElementFactory =
    com.ptvag.webcomponent.map.vector.InfoBoxElementFactoryDefault.getInstance();
