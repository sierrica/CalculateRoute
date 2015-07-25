/**
 * A map layer showing a toolbar.
 * <p>
 *     By default, the map creates an instance of {@link DefaultToolbarLayer}
 *     that already contains buttons for common functionality. If this doesn't
 *     suffice for your application, you can either remove the default toolbar
 *     and add a different one, or you can keep the default toolbar and
 *     add/remove buttons as needed (see {@link addElement} and
 *     {@link removeElement}).
 * </p>
 * <p>
 * Sample code: {@sample Customizing toolbar buttons},
 *              {@sample Customizing toolbar appearance}
 */
qxp.OO.defineClass("com.ptvag.webcomponent.map.layer.ToolbarLayer", com.ptvag.webcomponent.map.layer.AbstractStaticAreaLayer,
function() {
    com.ptvag.webcomponent.map.layer.AbstractStaticAreaLayer.call(this);

    var self = this;

    var map = com.ptvag.webcomponent.map;

    var mButtonDiv;
    var mBgPadding = 3;

    var mLastButtonOverId;

    var mElements = [];
    var mElementHash = {};
    var mNextId = 1;

    var mUpdateTimer;


    // overridden
    var superInit = self.init;
    self.init = function() {
        superInit.apply(self, arguments);

        self.getParentElement().style.cursor = "default";
        
        var areaDiv = document.createElement("div");
        areaDiv.style.position = "absolute";
        areaDiv.style.left = "0px";
        areaDiv.style.top = "0px";
        areaDiv.style.border = self.getAreaBorderWidth() + "px solid gray";
        areaDiv.style.backgroundColor = "white";
        self.getParentElement().appendChild(areaDiv);

        mButtonDiv = document.createElement("div");
        mButtonDiv.style.position = "absolute";
        mButtonDiv.style.left = mBgPadding + "px";
        mButtonDiv.style.top  = mBgPadding + "px";
        self.getParentElement().appendChild(mButtonDiv);

        self.setAreaElement(areaDiv);
        areaDiv.style.visibility = "hidden";
        update();
    };


    /**
     * Internal method (called by the update method).
     */
    
    var recalculate = function() {
        mUpdateTimer = null;
        
        if (mButtonDiv == null) {
            // we may already have been disposed
            return;
        }

        // remove all buttons that are no longer present
        var alreadyPresentButtons = {};
        var children = mButtonDiv.childNodes;
        var childCount = children.length;
        for (var i = 0; i < childCount; ++i) {
            var child = children[i];
            var id = child._id;
            if (mElementHash[id] == null || mElementHash[id].divElem != child) {
                child._clickHandler = null;
                child.parentNode.removeChild(child);
                --i;
                --childCount;
            } else {
                alreadyPresentButtons[id] = id;
            }
        }

        // add new buttons and recalculate all positions
        var offset = 0;
        var maxHeight = 0;
        var elementCount = mElements.length;
        for (i = 0; i < elementCount; ++i) {
            var element = mElements[i];
            if (element.imgUrl) {
                // we have a button
                element.divElem.style.left = offset + "px";
                if (element.height > maxHeight) {
                    maxHeight = element.height;
                }
                if (alreadyPresentButtons[element.id] == null) {
                    mButtonDiv.appendChild(element.divElem);
                }
            }
            offset += element.width;
        }
        self.setAreaWidth(offset + 2 * mBgPadding);
        self.setAreaHeight(maxHeight + 2 * mBgPadding);
        self.getAreaElement().style.visibility = "";
        self.positionArea();
    };
    
    
    /**
     * Recalculates all the positions and dimensions.
     */
    
    var update = function() {
        if (mUpdateTimer == null) {
            mUpdateTimer = window.setTimeout(recalculate, 0);
        }
    };
    
    
    /**
     * Adds an element (a button or spacing) to the toolbar.
     *
     * @param   elementData {Map}   the properties of the element:
     *     <ul>
     *         <li><strong>imgUrl</strong>: the URL of the button image. If
     *             this is <code>null</code>, a spacing with the specified
     *             <code>width</code> is added and the other properties (except
     *             for the <code>id</code>) are ignored.</li>
     *         <li><strong>width</strong>: the width of the button in
     *             pixels.</li>
     *         <li><strong>height</strong>: the height of the button in
     *             pixels.</li>
     *         <li><strong>clickHandler</strong>: the event handler to call
     *             when the button is clicked</li>
     *         <li><strong>enabled</strong>: whether the button should be
     *             enabled. If <code>null</code> or <code>true</code>, the
     *             button is enabled.</li>
     *         <li><strong>tooltip</strong>: the tooltip text for the button
     *             (no HTML, only plain text!). If <code>null</code>, no
     *             tooltip is shown.</li>
     *         <li><strong>id</strong>: the id of the button or spacing. If
     *             <code>null</code>, a new id is automatically assigned.
     *     </ul>
     * @param   insertBefore {string}   the id of the element before which the
     *                                  new element should be inserted. If
     *                                  <code>null</code>, the new element is
     *                                  appended at the end.
     * 
     * @return  {string}            the element's id (either the one specified
     *                              or an automatically generated one).
     */
    self.addElement = function(elementData, insertBefore) {
        
        // id handling
        var id = elementData.id;
        if (id == null) {
            do {
                id = "element-" + mNextId;
                mNextId++;
            } while (mElementHash[id] != null);
            elementData.id = id;
        }
        if (mElementHash[id] != null) {
            throw new Error("Adding toolbar element failed. Id '" + id
                + "' is already in use.");
        }

        // insert the element
        mElementHash[id] = elementData;
        var elementAdded = false;
        if (insertBefore != null) {
            var elementCount = mElements.length;
            for (var i = 0; i < elementCount; ++i) {
                if (mElements[i].id == insertBefore) {
                    mElements.splice(i, 0, elementData);
                    elementAdded = true;
                    break;
                }
            }
        }
        if (!elementAdded) {
            mElements.push(elementData);
        }

        if (elementData.imgUrl == null) {
            // spacing
            if (elementData.width == null) {
                elementData.width = map.ToolbarLayer.SPACING_WIDTH;
            }
        } else {
            // button
            var imgElem = document.createElement("img");
            imgElem.style.width  = elementData.width + "px";
            imgElem.style.height = elementData.height + "px";
    
            var imgDivElem = document.createElement("div");
            imgDivElem.style.position = "absolute";
            imgDivElem.style.width  = elementData.width + "px";
            imgDivElem.style.height = elementData.height + "px";
            imgDivElem.style.top = "0px";
            imgDivElem._clickHandler = elementData.clickHandler;
            imgDivElem._id = id;
            imgDivElem.appendChild(imgElem);
            elementData.divElem = imgDivElem;
    
            self.setButtonEnabled(id, (elementData.enabled == null ||
                                       elementData.enabled != false));
            self.setButtonImage(id, elementData.imgUrl);
            self.setButtonTooltip(id, elementData.tooltip);
        }

        update();

        return id;
    };


    /**
     * Removes an element and returns the removed element (so it can be
     * re-inserted if needed).
     * 
     * @param   id {string}         the id of the element to remove.
     * 
     * @return  {Map}               the removed element or <code>null</code> if
     *                              no element with the specified id could be
     *                              found.
     */
    self.removeElement = function(id) {
        var elementData = mElementHash[id];
        if (elementData != null) {
            elementData.divElem = null;
            delete mElementHash[id];
            var elementCount = mElements.length;
            for (var i = 0; i < elementCount; ++i) {
                if (mElements[i] == elementData) {
                    mElements.splice(i, 1);
                    break;
                }
            }
            update();
        }
        return elementData;
    };
    
    
    /**
     * Returns the ids of all toolbar elements (buttons and spacing) in the
     * order in which they are displayed.
     * 
     * @return  {string[]}          the ids.
     */
    self.getElementIds = function() {
        var elementCount = mElements.length;
        var retVal = new Array(elementCount);
        for (var i = 0; i < elementCount; ++i) {
            retVal[i] = mElements[i].id;
        }
        return retVal;
    };
    
    
    /**
     * Checks whether an element with the specified id exists.
     *
     * @param   elementId {string}  the id of the element.
     *
     * @return  whether the element exists.
     */
    self.elementExists = function(elementId) {
        return mElementHash[elementId] != null;
    }


    /**
     * Sets (replaces) the image of a button.
     *
     * @param buttonId {string} the ID of the button.
     * @param imgUrl {string} the URL of the image.
     */
    self.setButtonImage = function(buttonId, imgUrl) {
        var buttonData = mElementHash[buttonId];
        var imgElem = buttonData.divElem.firstChild;
        map.MapUtil.setImageSource(imgElem, imgUrl);
        buttonData.imgUrl = imgUrl;
    };


    /**
     * Sets the tooltip of a button.
     * <p>
     * This only works, when the toolbar layer is the most top layer.
     *
     * @param buttonId {string} the ID of the button.
     * @param tooltip {string} the tooltip.
     */
    self.setButtonTooltip = function(buttonId, tooltip) {
        var buttonData = mElementHash[buttonId];
        var imgElem = buttonData.divElem.firstChild;
        if (tooltip == null) {
            imgElem.removeAttribute("title");
        } else {
            imgElem.setAttribute("title", tooltip);
        }
        buttonData.tooltip = tooltip;
    };


    /**
     * Enables or disables a button.
     *
     * @param buttonId {string} the ID of the button.
     * @param enabled {boolean} whether the button should be enabled.
     */
    self.setButtonEnabled = function(buttonId, enabled) {
        var buttonData = mElementHash[buttonId];
        if (enabled) {
            if (mLastButtonOverId == buttonId) {
                map.MapUtil.setElementOpacity(buttonData.divElem, self.getButtonOpacityOver());
            } else {
                map.MapUtil.setElementOpacity(buttonData.divElem, self.getButtonOpacityOut());
            }
        } else {
            map.MapUtil.setElementOpacity(buttonData.divElem, self.getButtonOpacityDisabled());
        }
        buttonData.enabled = enabled;
    };


    // overridden
    self.onMouseDown = function(evt) {
        return getButtonAt(evt.relMouseX, evt.relMouseY) != null;
    };


    // overridden
    var superOnMouseUp = self.onMouseUp;
    self.onMouseUp = function(evt) {
        superOnMouseUp(evt);

        if (self.isNoLayerActive()) {
            var buttonId = getButtonAt(evt.relMouseX, evt.relMouseY);
            if (buttonId != null) {
                var buttonData = mElementHash[buttonId];
                if (buttonData.enabled) {
                    buttonData.divElem._clickHandler();
                    return true;
                }
            }
        }

        return false;
    };


    // overridden
    var superOnMouseMove = self.onMouseMove;
    self.onMouseMove = function(evt) {
        superOnMouseMove(evt);

        if (self.isNoLayerActive()) {
            setButtonOver(getButtonAt(evt.relMouseX, evt.relMouseY));
        }

        return false;
    };


    // overridden
    var superOnMouseOut = self.onMouseOut;
    self.onMouseOut = function(evt) {
        superOnMouseOut(evt);
        setButtonOver(null);

        return false;
    }


    /**
     * Returns the button ID of the button at a certain mouse position.
     *
     * @param x {int} the x-position of the mouse relative to the left side of
     *        the map (in pixels).
     * @param y {int} the x-position of the mouse relative to the top of
     *        the map (in pixels).
     * @return {int} the ID of the button the mouse is over or null if the mouse
     *         isn't over any button.
     */
    var getButtonAt = function(x, y) {
        var areaLeft = self.getComputedAreaLeft();
        var areaTop  = self.getComputedAreaTop();
        if (x >= areaLeft && x < areaLeft + self.getComputedAreaWidth()
            && y >= areaTop && y < areaTop + self.getComputedAreaHeight())
        {
            // The mouse is over the button area
            var relX = x - areaLeft - mBgPadding;
            var buttonArr = mButtonDiv.childNodes;
            for (var i = 0; i < buttonArr.length; i++) {
                var btLeft = buttonArr[i].offsetLeft;
                var btWidth = buttonArr[i].offsetWidth;
                if (relX >= btLeft && relX < btLeft + btWidth) {
                    return buttonArr[i]._id;
                }
            }
        }

        return null;
    }


    /**
     * Sets the button the mouse is over. Used for updating the button opacity.
     *
     * @param buttonId {int} the ID of the button the mouse is over or null if
     *        the mouse isn't over any button.
     */
    var setButtonOver = function(buttonId) {
        if (buttonId != mLastButtonOverId) {
            if (mLastButtonOverId != null) {
                var lastButtonData = mElementHash[mLastButtonOverId];
                if (lastButtonData.enabled) {
                    map.MapUtil.setElementOpacity(lastButtonData.divElem, self.getButtonOpacityOut());
                }
            }

            if (buttonId != null) {
                var newButtonData = mElementHash[buttonId];
                if (newButtonData.enabled) {
                    map.MapUtil.setElementOpacity(newButtonData.divElem, self.getButtonOpacityOver());
                }
            }

            mLastButtonOverId = buttonId;
        }
    };


    // overridden
    var superDispose = self.dispose;
    self.dispose = function() {
        if (self.getDisposed()) {
            return;
        }

        var children = mButtonDiv.childNodes;
        var childCount = children.length;
        for (var i = 0; i < childCount; ++i) {
            children[i]._clickHandler = null;
        }
        var elementCount = mElements.length;
        var element;
        for (i = 0; i < elementCount; ++i) {
            element = mElements[i];
            if (element.divElem) {
                element.divElem._clickHandler = null;
                element.divElem = null;
            }
        }
        mButtonDiv = null;

        superDispose.call(self);
    };


    /**
     * Initializes the instance.
     */
    var init = function() {
        self.setAreaWidth(2 * mBgPadding);
        self.setAreaHeight(2 * mBgPadding);
        self.setAreaBorderWidth(1);
    };


    init();

});


/**
 * {int} The width of a spacing in pixels.
 *
 * @see #addSpacing()
 */
qxp.Class.SPACING_WIDTH = 10;


// overridden
qxp.OO.changeProperty({ name:"useBlending", type:qxp.constant.Type.BOOLEAN, defaultValue:true });

// overridden
qxp.OO.changeProperty({ name:"areaBorderWidth", type:qxp.constant.Type.NUMBER, defaultValue:1 });

/** The opacity of a button when the mouse is over. */
qxp.OO.addProperty({ name:"buttonOpacityOver", type:qxp.constant.Type.NUMBER, defaultValue:0.6 });

/** The opacity of a button when the mouse is out. */
qxp.OO.addProperty({ name:"buttonOpacityOut", type:qxp.constant.Type.NUMBER, defaultValue:0.35 });

/** The opacity of a button when the button is disabled. */
qxp.OO.addProperty({ name:"buttonOpacityDisabled", type:qxp.constant.Type.NUMBER, defaultValue:0.15 });
