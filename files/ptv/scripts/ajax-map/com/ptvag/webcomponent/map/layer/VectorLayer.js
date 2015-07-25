/**
 * A layer for drawing vector graphics and other elements (which may be
 * interactive).
 * <p>
 * Sample code: {@sample Drawing on the map},
 *              {@sample Drawing sidelines},
 *              {@sample Zoom-dependent elements},
 *              {@sample Displaying text},
 *              {@sample Tooltips (1)},
 *              {@sample Tooltips (2)},
 *              {@sample Interaction},
 *              {@sample Clickable images},
 *              {@sample Visible map section},
 *              {@sample Flexible elements (1)},
 *              {@sample Flexible elements (2)},
 *              {@sample Client-side POIs},
 *              {@sample Image sizes depending on scale},
 *              {@sample Custom vector elements},
 *              {@sample Custom flex markers},
 *              {@sample Custom client-side POIs}
 * 
 * @param   floaterLayer {com.ptvag.webcomponent.map.layer.Layer} the layer that
 *            should be used to show high priority elements. This includes
 *            clickable/selectable tooltips/info boxes. Without a high priority
 *            layer, clicks would be swallowed by higher layers.
 * @param   isSecondary {boolean,false}     whether this is a secondary vector
 *                                          layer (used to avoid duplicate
 *                                          handling of the floater layer).
 */
qxp.OO.defineClass("com.ptvag.webcomponent.map.layer.VectorLayer",
com.ptvag.webcomponent.map.layer.AbstractVectorLayer,
function(floaterLayer, isSecondary) {
    com.ptvag.webcomponent.map.layer.AbstractVectorLayer.call(this, floaterLayer, isSecondary);

    var self = this;
    var map = com.ptvag.webcomponent.map;

    /** Contains elements that should be shown above all other layers. */
    var mFloaterLayer = floaterLayer;

    var mElements = {};
    var mHoverAreas = {};
    var mCurrentHoverArea = null;
    var mCandidateHoverArea = null;
    var mCandidateTimer = null;
    var mCandidateEvent = null;
    var mClickAreas = {};
    var mRightClickAreas = {};
    var mFlexibleElementIds = [];
    var mElementIds = [];
    var mElementIdsSorted = true;

    /** Elements that consist of other elements. */
    var mAggregateElements = {};
    
    var mRemoveOnClick = {};
    var mInRemoveOnClick = false;

    var mInBulkMode = false;
    var mChangeInBulkMode = false;
    var mFiringBulkEvent = false;
    
    var mLastMapZoom;
    var mLastMapLeft;
    var mLastMapTop;

    var mUniqueCounter = 0;
    var INTERNAL_PREFIX = "_ptv_internal_";


    // overridden
    var superInit = self.init;
    self.init = function() {
        superInit.apply(self, arguments);

        self.getMap().getController().addEventListener("changeActiveLayer", onActiveLayerChanged);
    };


    var onActiveLayerChanged = function(evt) {
        try {
            var activeLayer = evt.getData();
            if (activeLayer != null) {
                // Hide the tooltips when panning or zooming was started
                for (var id in mHoverAreas) {
                    mHoverAreas[id].clear();
                }
                mCurrentHoverArea = null;
            }
        } catch (e) {
            self.error("Error in onActiveLayerChanged in VectorLayer", e);
        }
    };


    /**
     * Returns a unique id (used for various vector elements).
     * 
     * @return  {int}               a unique id.
     */
    var getUniqueId = function() {
        var id = INTERNAL_PREFIX + (++mUniqueCounter);
        if (id >= 2000000000) {
            mUniqueCounter = id = 1;
        }
        return id;
    };


    /**
     * Starts bulk mode (where no changes will be visible until the bulk mode
     * ends).
     */
    self.startBulkMode = function() {
        if (mInBulkMode) {
            throw new Error("Starting bulk mode failed. The vector layer is already in bulk mode.");
        }
        mInBulkMode = true;
        mChangeInBulkMode = false;
    };


    /**
     * Ends bulk mode (and makes all changes made in bulk mode visible).
     */
    self.endBulkMode = function() {
        if (! mInBulkMode) {
            throw new Error("Ending bulk mode failed. The vector layer was not in bulk mode.");
        }
        mInBulkMode = false;
        if (mChangeInBulkMode) {
            mFiringBulkEvent = true;
            self.onViewChanged();
            mFiringBulkEvent = false;
            mChangeInBulkMode = false;
        }
    };


    /**
     * Returns whether bulk mode is on.
     *
     * @return {boolean} whether bulk mode is on.
     * @see #startBulkMode()
     */
    self.inBulkMode = function() {
        return mInBulkMode;
    }


    /**
     * Comparator for element ids (using the priority).
     */

    var elementIdComparator = function(a, b) {
        var prioA = mElements[a].getPriority();
        var prioB = mElements[b].getPriority();
        if (prioA < prioB) {
            return -1;
        }
        if (prioA > prioB) {
            return 1;
        }
        return 0;
    };
    
    
    // overridden
    var superOnViewChanged = self.onViewChanged;
    self.onViewChanged = function(evt, immediately) {
        if (!self.isInitialized()) {
            return;
        }

        if (! mInBulkMode && ! mFiringBulkEvent && self.getUseAutoBulkMode() &&
            !immediately) {
            var activeLayer = self.getMap().getController().getActiveLayer();
            if (activeLayer == null || activeLayer == self) {
                self.startBulkMode();
                window.setTimeout(self.endBulkMode, 0);
            }
        }

        if (mInBulkMode) {
            mChangeInBulkMode = true;
            return;
        }
        superOnViewChanged(evt);
    };


    // overridden
    self.paintContent = function(context, container, mapZoom, mapLeft, mapTop,
                                 forPrinting) {
        //self.info("paintContent: " + mapLeft + " / " + mapTop);
        // TODO: instead of blindly clearing the tooltips, call
        // testUnhover() (but this doesn't work yet as tooltips currently don't
        // reposition themselves on draw())
        if (mLastMapZoom != mapZoom || mLastMapLeft != mapLeft ||
            mLastMapTop != mapTop) {
            // Only clear the hover areas if the map zoom or position has
            // changed. This way, a tooltip doesn't vanish from under the
            // user's mouse cursor when she selects something.
            mLastMapZoom = mapZoom;
            mLastMapLeft = mapLeft;
            mLastMapTop = mapTop;
            for (var id in mHoverAreas) {
                mHoverAreas[id].clear();
            }
            mCurrentHoverArea = null;
        }

        // TODO: Call updateFlexiblePositions only when the zoom or the flexible
        //       elements have changed
        updateFlexiblePositions();

        // draw all elements
        var dirty = false;
        var topLevelContainer = mFloaterLayer.getParentElement();
        var canvasSupported = self.isCanvasSupported();
        var elementCount = mElementIds.length;
        if (!mElementIdsSorted) {
            mElementIds.sort(elementIdComparator);
            mElementIdsSorted = true;
        }
        //var startTime = (new Date()).getTime();
        for (var choice = 0; choice < 2; ++choice) {
            for (var i = 0; i < elementCount; ++i) {
                var element = mElements[mElementIds[i]];
                if (element.getVisibleMinZoom() >= mapZoom &&
                    element.getVisibleMaxZoom() <= mapZoom) {
                    if (choice == 0 && element.usesCanvas(context)) {
                        if (!canvasSupported) {
                            if (qxp.sys.Client.getInstance().isMshtml()) {
                                throw new Error("You must include the " +
                                    "excanvas.js script in your page to draw an " +
                                    "instance of " + element.classname);
                            } else {
                                throw new Error("You must use a browser that " +
                                    "supports the canvas tag to draw an " +
                                    "instance of " + element.classname);
                            }
                        }
                        element.draw(container, topLevelContainer, context,
                                     mapLeft, mapTop, mapZoom);
                        dirty = true;
                    } else if (choice == 1 && !element.usesCanvas(context) &&
                               !forPrinting) {
                        element.draw(container, topLevelContainer, context,
                                     mapLeft, mapTop, mapZoom);
                    }
                } else {
                    element.clear();
                }
            }
        }
        //var endTime = (new Date()).getTime();
        //window.setTimeout(function() {
        //    self.error("Painting done in " + (endTime - startTime) + "ms");
        //}, 500);
        
        return dirty;
    };


    /**
     * Simple PRNG.
     */
    var createPRNG = function(seed) {
        if (seed == null) {
            seed = parseInt(new Date().getTime() / 1000);
        }
    
        return function() {
            //seed = (seed * 9301 + 49297) % 233280;
            //return seed / 233280;
            var AAA = 40692;
            var MMM = 2147483399;
            var QQQ = 52774;
            var RRR = 3791;
            var y = seed;
            var r = RRR * parseInt(y / QQQ);
            y = AAA * (y % QQQ) - r;
            if (y < 0) {
                y += MMM;
            }
            seed = y;
            return seed/MMM;
        };
    };

    
    /**
     * Helper method. Updates the positions of the flexible elements.
     */
    var updateFlexiblePositions = function() {
        var elemDataHash = {};
        var dependentHash = {};
        var actualFlexibleElementIds = [];

        // Init elemDataHash
        var prng = createPRNG(190199);
        var zoom = self.getMap().getVisibleZoom();
        for (var i = 0; i < mFlexibleElementIds.length; i++) {
            var id = mFlexibleElementIds[i];
            var element = mElements[id];

            var noiseX = 0;
            var noiseY = 0;
            if (self.getFlexAtSamePosition()) {
                noiseX = prng()/10;
                noiseY = prng()/10;
            }
            var suPoint = {x:element.getX() + noiseX,
                           y:element.getY() + noiseY};
            var pixPoint = map.CoordUtil.smartUnit2Pixel(suPoint, zoom);
            var dependsOn = element.getDependsOn();
            if (dependsOn == null) {
                elemDataHash[id] = { startX:pixPoint.x, startY:pixPoint.y,
                                     x:pixPoint.x, y:pixPoint.y,
                                     pushX:0, pushY:0 };
                actualFlexibleElementIds.push(id);
            } else {
                var dependentElements = dependentHash[dependsOn];
                if (dependentElements == null) {
                    dependentElements = [];
                    dependentHash[dependsOn] = dependentElements;
                }
                dependentElements.push(id);
            }
        }

        // Calculate the new flexes
        var maxFlex = map.layer.VectorLayer.MAX_FLEX_DISTANCE;
        var flexCount = actualFlexibleElementIds.length;
        for (var step = 0; step < 20; ++step) {
            for (var i = 0; i < flexCount; ++i) {
                var elemData = elemDataHash[actualFlexibleElementIds[i]];
                for (var j = 0; j < flexCount; ++j) {
                    if (i == j) continue;
                    var compData = elemDataHash[actualFlexibleElementIds[j]];
                    if (compData.x == elemData.x && compData.y == elemData.y) {
                        // don't separate elements at exactly the same position
                        continue;
                    }
                    var distX = elemData.x - compData.x;
                    var distY = elemData.y - compData.y;
                    var squareDist = distX*distX + distY*distY;
                    if (squareDist < 400) {
                        // stabilize things by not acting when objects are far
                        // apart
                        if (squareDist < 10) {
                            squareDist = 10;
                        }
                        var force = 1/squareDist * 10;
                        //if (force > 100) {
                        //    force = 100;
                        //}
                        elemData.pushX += force*distX;
                        elemData.pushY += force*distY;
                    }
                }
                squareDist = elemData.pushX*elemData.pushX +
                             elemData.pushY*elemData.pushY;
                var dist = Math.sqrt(squareDist);
                if (dist > maxFlex) {
                    elemData.pushX *= maxFlex/dist;
                    elemData.pushY *= maxFlex/dist;
                }
            }
            for (i = 0; i < flexCount; ++i) {
                elemData = elemDataHash[actualFlexibleElementIds[i]];
                elemData.x = elemData.startX + elemData.pushX;
                elemData.y = elemData.startY + elemData.pushY;
            }
        }

        // Set the flexes
        for (i = 0; i < actualFlexibleElementIds.length; i++) {
            id = actualFlexibleElementIds[i];
            elemData = elemDataHash[id];
            element = mElements[id];
            //self.info("#"+i+":"+(elemData.x - elemData.startX)+","+ -(elemData.y - elemData.startY));

            element.setFlexX(Math.round(elemData.x - elemData.startX));
            element.setFlexY(-Math.round(elemData.y - elemData.startY));
        }
        
        // position the dependent elements
        for (id in dependentHash) {
            var parentElement = mElements[id];
            var children = dependentHash[id];
            for (var i = 0; i < children.length; ++i) {
                var childElement = mElements[children[i]];
                childElement.setFlexX(parentElement.getFlexX());
                childElement.setFlexY(parentElement.getFlexY());
            }
        }
    };


    // overridden
    self.onMouseHover = function(evt) {
        // fast exit if the mouse is over a visible area of the currently
        // visible tooltip (we don't want to change the contents of the
        // tooltip in this case)
        if (mCurrentHoverArea != null && mCurrentHoverArea.hitTest &&
            mCurrentHoverArea.hitTest(evt)) {
            if (mCandidateTimer != null) {
                window.clearTimeout(mCandidateTimer);
                mCandidateTimer = null;
            }
            return false;
        }

        evt = {relMouseX:evt.relMouseX, relMouseY:evt.relMouseY};

        var magnetic =
            (mCurrentHoverArea != null && mCurrentHoverArea.isMagnetic());
        var keepArea = false;
        var toShow = null;
        var toShowPriority = null;
        var minDistance = -1;
        var areas = [];
        var areaContent = {};
        var mapZoom = self.getMap().getVisibleZoom();
        for (var id in mHoverAreas) {
            var hoverArea = mHoverAreas[id];
            var distance = hoverArea.getSquareDistance(evt);
            if (distance >= 0 && hoverArea.getVisibleMinZoom() >= mapZoom &&
                                 hoverArea.getVisibleMaxZoom() <= mapZoom) {
                areas.push(hoverArea);
                if (magnetic && hoverArea == mCurrentHoverArea) {
                    keepArea = true;
                }
                var priority = hoverArea.getPriority();
                if (toShowPriority != null && priority < toShowPriority) {
                    continue;
                }
                if (priority == toShowPriority && distance >= minDistance) {
                    // priority == toShowPriority can only happen if we found
                    // a candidate before (since a VectorElement's priority
                    // cannot be null)
                    continue;
                }
                minDistance = distance;
                toShow = hoverArea;
                toShowPriority = priority;
            }
        }
        if (keepArea) {
            toShow = mCurrentHoverArea;
        }
        if (mCandidateTimer != null && toShow != mCandidateHoverArea) {
            window.clearTimeout(mCandidateTimer);
            mCandidateTimer = null;
        }
        if (toShow != null) {
            var extendedEventInfo = toShow.getExtendedEventInfo();
            if (extendedEventInfo != null) {
                for (var key in extendedEventInfo) {
                    evt[key] = extendedEventInfo[key];
                }
            }
            var areaCount = areas.length;
            for (var i = 0; i < areaCount; ++i) {
                if (areas[i] == toShow) {
                    areas.splice(i, 1);
                    break;
                }
            }
            evt.otherAreas = areas;
            if (toShow == mCurrentHoverArea) {
                toShow.onHover(evt);
            } else {
                mCandidateEvent = evt;
                if (mCandidateTimer == null) {
                    mCandidateHoverArea = toShow;
                    mCandidateTimer = window.setTimeout(function() {
                        if (mCandidateTimer == null) {
                            return;     // workaround for IE bug
                        }
                        mCandidateTimer = null;
                        if (mCandidateHoverArea == null) {
                            // in case the element was removed in the meantime
                            return;
                        }
                        if (mCurrentHoverArea != null) {
                            mCurrentHoverArea.onUnhover(mCandidateEvent);
                        }
                        mCandidateHoverArea.onHover(mCandidateEvent);
                        mCurrentHoverArea = mCandidateHoverArea;
                    }, self.getHoverDelay());
                }
            }
        }
        if (toShow != mCurrentHoverArea) {
            if (mCurrentHoverArea != null && mCurrentHoverArea.testUnhover(evt)) {
                mCurrentHoverArea.onUnhover(evt);
                mCurrentHoverArea = null;
            }
        }

        return false;
    };


    // overridden
    self.onMouseDown = function(evt) {
        if (evt.shiftKey) {
            // prevent tooltips from vanishing on mouse down together with
            // the shift key
            return true;
        }
        
        var target = (evt.srcElement ? evt.srcElement : evt.target);
        var ignore = false;
        while (target) {
            ignore = target._ignoreMouseDown;
            if (ignore) {
                break;
            }
            target = target.parentNode;
        }
        return (ignore ? true : false);
    };
    
    
    // overridden
    self.onMouseDblClick = function(evt) {
        var target = (evt.srcElement ? evt.srcElement : evt.target);
        var ignore = false;
        while (target) {
            ignore = target._ignoreMouseDown;
            if (ignore) {
                break;
            }
            target = target.parentNode;
        }
        return (ignore ? true : false);
    };
    
    
    // overridden
    self.onMouseWheel = function(evt) {
        var target = (evt.srcElement ? evt.srcElement : evt.target);
        var ignore = false;
        while (target) {
            ignore = target._ignoreMouseWheel;
            if (ignore) {
                break;
            }
            target = target.parentNode;
        }
        if (ignore) {
            evt.dontPreventDefault = true;
        }
        return (ignore ? true : false);
    };
    
    
    // overridden
    self.onMouseUp = function(evt) {
        var target = (evt.srcElement ? evt.srcElement : evt.target);
        var ignore = false;
        while (target) {
            ignore = target._ignoreMouseUp;
            if (ignore) {
                break;
            }
            target = target.parentNode;
        }
        return (ignore ? true : false);
    };
    
    
    // overridden
    self.onSelectStart = function(evt) {
        var target = (evt.srcElement ? evt.srcElement : evt.target);
        var allowSelection = false;
        while (target) {
            allowSelection = target._allowSelection;
            if (allowSelection) {
                break;
            }
            target = target.parentNode;
        }
        return (allowSelection ? true : false);
    };
    
    
    var onMouseClick = function(evt, clickAreas) {
        var clicked = null;
        var clickedPriority = null;
        var minDistance = -1;
        var mapZoom = self.getMap().getVisibleZoom();
        for (var id in clickAreas) {
            var clickArea = clickAreas[id];
            var distance = clickArea.getSquareDistance(evt);
            if (distance >= 0 && clickArea.getVisibleMinZoom() >= mapZoom &&
                                 clickArea.getVisibleMaxZoom() <= mapZoom) {
                var priority = clickArea.getPriority();
                if (clickedPriority != null && priority < clickedPriority) {
                    continue;
                }
                if (priority == clickedPriority && distance >= minDistance) {
                    // priority == clickedPriority can only happen if we found
                    // a candidate before (since a VectorElement's priority
                    // cannot be null)
                    continue;
                }
                minDistance = distance;
                clicked = clickArea;
                clickedPriority = priority;
            }
        }
        if (clicked != null) {
            var extendedEventInfo = clicked.getExtendedEventInfo();
            if (extendedEventInfo != null) {
                for (var key in extendedEventInfo) {
                    evt[key] = extendedEventInfo[key];
                }
            }
            clicked.onClick(evt);
            return true;
        }
        return false;
    };
    
    
    // overridden
    self.onMouseClick = function(evt) {
        // remove the elements that are registered for remove-on-click
        mInRemoveOnClick = true;
        for (var id in mRemoveOnClick) {
            self.removeElement(id);
        }
        mRemoveOnClick = {};
        mInRemoveOnClick = false;
        
        return onMouseClick(evt, mClickAreas);
    };


    // overridden
    self.onRightMouseClick = function(evt) {
        return onMouseClick(evt, mRightClickAreas);
    };


    /**
     * Adds a vector element.
     * 
     * @param   element {com.ptvag.webcomponent.map.vector.VectorElement}   the
     *                              element.
     * @param   deferSorting {boolean,false}  if <code>true</code>, sorting the
     *                              elements according to priority is deferred
     *                              until the next time they are drawn. This
     *                              can greatly speed up the addition of lots
     *                              of prioritized elements. This parameter is
     *                              ignored for
     *                              {@link com.ptvag.webcomponent.map.vector.AggregateElement}s -
     *                              use the <code>deferSorting</code> parameter
     *                              of the aggregate element's
     *                              {@link com.ptvag.webcomponent.map.vector.AggregateElement#addElement()}
     *                              method instead.
     * 
     * @return  {var}               the id of the element (either the one the
     *                              element already had or a generated one if
     *                              the element's id was null).
     */
    self.addElement = function(element, deferSorting) {
        if (element instanceof map.vector.AggregateElement) {
            return self.addAggregateElement(element);
        }
        var id = element.getId();
        if (id == null) {
            id = getUniqueId();
            element.setId(id);
        }
        if (mElements[id] != null || mAggregateElements[id] != null) {
            self.removeElement(id);
        }
        if (deferSorting) {
            mElementIds.push(id);
            mElementIdsSorted = false;
        } else {
            var priority = element.getPriority();
            // TODO: use a binary search for the insertion point
            // shortcut for the common cases
            if (mElementIds.length == 0) {
                mElementIds.push(id);
                //self.info("Simple push (length 0)");
            } else if (mElements[mElementIds[mElementIds.length - 1]].getPriority() <= priority) {
                mElementIds.push(id);
                //self.info("Simple push (length > 0)");
            } else {
                for (var i = 0; mElements[mElementIds[i]].getPriority() <= priority; ++i);
                //self.info("Priority " + priority + " insert at " + i + " (length " + mElementIds.length + ")");
                mElementIds.splice(i, 0, id);
            }
        }
        mElements[id] = element;
        element.fixPriority();

        if (element instanceof map.vector.AbstractHoverArea) {
            mHoverAreas[id] = element;
        }

        if (element instanceof map.vector.RightClickArea) {
            mRightClickAreas[id] = element;
        } else if (element instanceof map.vector.ClickArea) {
            mClickAreas[id] = element;
        }

        if (element.isPositionFlexible()) {
            mFlexibleElementIds.push(id);
        }

        element.setVectorLayer(self);

        self.onViewChanged();

        return id;
    };
    
    
    /**
     * Removes a vector element.
     * 
     * @param   id {var}            the id of the element to remove.
     */
    var removeElement = function(id) {
        var element = mElements[id];
        if (element != null) {
            // TODO: use a binary search for the id to remove (if the element
            // ids are currently sorted)
            for (var i = 0; i < mElementIds.length; ++i) {
                if (mElementIds[i] == id) {
                    mElementIds.splice(i, 1);
                    break;
                }
            }
            delete mElements[id];
        }
    };
    
    
    /**
     * Adds an aggregate element.
     *
     * @deprecated  Use {@link addElement()} instead.
     * 
     * @param   aggregateElement {com.ptvag.webcomponent.map.vector.AggregateElement}
     *                              the aggregate element.
     */
    self.addAggregateElement = function(aggregateElement) {
        var id = aggregateElement.getId();
        if (id == null) {
            id = getUniqueId();
            aggregateElement.setId(id);
        }
        if (mAggregateElements[id] != null || mElements[id] != null) {
            self.removeElement(id);
        }
        mAggregateElements[id] = aggregateElement;
        aggregateElement.setVectorLayer(self);
        return id;
    };
    
    
    /**
     * Removes an aggregate element.
     * 
     * @param   id {var}            the id of the aggregate element.
     * 
     * @return  {boolean}           whether there actually was an element with
     *                              the specified id.
     */
    var removeAggregateElement = function(id) {
        var aggregateElement = mAggregateElements[id];
        if (aggregateElement != null) {
            aggregateElement.clear();
            delete mAggregateElements[id];
            if (aggregateElement.getAutoDispose()) {
                aggregateElement.dispose();
            }
            return true;
        }
        return false;
    };
    
    
    /**
     * Removes an element (circle, line, etc) from this layer.
     * 
     * @param   id {var}            the id of the element.
     */
    self.removeElement = function(id) {
        if (!mInRemoveOnClick) {
            delete mRemoveOnClick[id];
        }
        if (!removeAggregateElement(id)) {
            var element = mElements[id];
            if (element != null) {
                element.clear();
                removeElement(id);
                delete mHoverAreas[id];
                delete mClickAreas[id];
                delete mRightClickAreas[id];
    
                for (var i = 0; i < mFlexibleElementIds.length; i++) {
                    if (mFlexibleElementIds[i] == id) {
                        mFlexibleElementIds.splice(i, 1);
                        break;
                    }
                }
                
                if (element == mCurrentHoverArea) {
                    mCurrentHoverArea = null;
                }
    
                if (element == mCandidateHoverArea) {
                    mCandidateHoverArea = null;
                }
    
                if (element.getAutoDispose()) {
                    element.dispose();
                }

                self.onViewChanged();
            }
        }
    };
    
    
    /**
     * Removes an element (circle, line, etc) from this layer.
     *
     * @deprecated  Use {@link #removeElement()} instead.
     * 
     * @param   id {var}            the id of the element.
     */
    self.hideElement = function(id) {
        self.removeElement(id);
    };


    /**
     * Removes all vector elements from this layer.
     */
    self.removeAllElements = function() {
        var aggregateIds = [];
        for (var id in mAggregateElements) {
            aggregateIds.push(id);
        }
        var count = aggregateIds.length;
        for (var i = 0; i < count; ++i) {
            self.removeElement(aggregateIds[i]);
        }
        while (mElementIds.length > 0) {
            self.removeElement(mElementIds[0]);
        }
    };
    
    
    /**
     * Checks whether an element exists.
     * 
     * @param   id {var}            the id of the element.
     * 
     * @return  {boolean}           <code>true</code> if an element with the
     *                              specified id exists, <code>false</code>
     *                              otherwise.
     */
    self.elementExists = function(id) {
        if (id in mAggregateElements) {
            return true;
        }
        return (id in mElements);
    };


    /**
     * Removes an element as soon as a click event occurs. This is useful for
     * auto-hiding info boxes and similar tasks.
     * 
     * @param   id {var}            the id of the element.
     */
    self.removeOnClick = function(id) {
        mRemoveOnClick[id] = null;
    };
    
    
    /**
     * Returns an element for an id.
     * 
     * @param   id {var}            the id of the element.
     * 
     * @return  {com.ptvag.webcomponent.map.vector.VectorElement}   the element
     *              or <code>undefined</code> (which is == <code>null</code>)
     *              if it doesn't exist.
     */
    self.getElement = function(id) {
        var retVal = mAggregateElements[id];
        if (retVal != null) {
            return retVal;
        }
        return mElements[id];
    };


    /**
     * Draws a line.
     *
     * @deprecated  Create an instance of
     *              {@link com.ptvag.webcomponent.map.vector.Line} and use
     *              {@link #addElement()} instead.
     * 
     * @param   color {string}      the color of the line.
     *                              The color can be specified as a color name
     *                              ("red"), as RGB hex values ("#ff0000"), or
     *                              as RGB alpha values ("rgba(255,0,0,1.0)").
     * @param   pixelSize {int}     the width of the line in pixels.
     * @param   coordinates {var[]} the points of the line (may be either
     *                              an array of points or an array of alternating
     *                              x and y values).
     * @param   priority {int,0}    the drawing priority.
     * @param   id {var,null}       the id of the line.
     *                              If no id is specified,
     *                              a unique one is automatically generated.
     * 
     * @return  {var}               the id of the line (either the one passed
     *                              in or a generated one).
     */
    self.showLine = function(color, pixelSize, coordinates, priority, id) {
        return self.addElement(new map.vector.Line(color, pixelSize, coordinates, priority, id));
    };


    /**
     * Draws a circle.
     * 
     * @deprecated  Create an instance of
     *              {@link com.ptvag.webcomponent.map.vector.Circle} and use
     *              {@link #addElement()} instead.
     *
     * @param   x {double}          the x coordinate of the circle center
     *                              (in smart units).
     * @param   y {double}          the y coordinate of the circle center
     *                              (in smart units).
     * @param   color {string}      the color of the circle.
     *                              The color can be specified as a color name
     *                              ("red"), as RGB hex values ("#ff0000"), or
     *                              as RGB alpha values ("rgba(255,0,0,1.0)").
     * @param   pixelSize {double}  the diameter of the circle in pixels.
     * @param   priority {int,0}    the drawing priority.
     * @param   id {var,null}       the id of the circle.
     *                              If no id is specified,
     *                              a unique one is automatically generated.
     * @param   isPositionFlexible {boolean,false} Whether the position is
     *                              flexible. Flexible elements will displace
     *                              each other when they are close to another.
     * 
     * @return  {var}               the id of the circle (either the one passed
     *                              in or a generated one).
     */
    self.showCircle = function(x, y, color, pixelSize, priority, id, isPositionFlexible) {
        return self.addElement(new map.vector.Circle(x, y, color, pixelSize, priority, id, isPositionFlexible));
    };


    /**
     * Draws a text.
     * 
     * @deprecated  Create an instance of
     *              {@link com.ptvag.webcomponent.map.vector.Text} and use
     *              {@link #addElement()} instead.
     *
     * @param   x {double}          the x coordinate in smart units.
     * @param   y {double}          the y coordinate in smart units.
     * @param   color {string}      the color of the text (must be a valid CSS
     *                              color value).
     * @param   pixelSize {double}  the font height in pixels.
     * @param   alignment {int}     the alignment of the text relative to the x
     *                              and y coordinates (see the constants in the
     *                              {@link com.ptvag.webcomponent.map.layer.VectorLayer}
     *                              class).
     * @param   text {string}       the text to show.
     * @param   priority {int,0}    the priority of the text.
     * @param   id {var,null}       the id of the text.
     *                              If no id is specified,
     *                              a unique one is automatically generated.
     * @param   isPositionFlexible {boolean,false} Whether the position is
     *                              flexible. Flexible elements will displace
     *                              each other when they are close to another.
     * 
     * @return  {var}               the id of the text (either the one passed
     *                              in or a generated one).
     */
    self.showText = function(x, y, color, pixelSize, alignment, text, priority, id, isPositionFlexible) {
        return self.addElement(new map.vector.Text(x, y, color, pixelSize, alignment, text, priority, id, isPositionFlexible));
    };


    /**
     * Draws a polygon.
     * 
     * @deprecated  Create an instance of
     *              {@link com.ptvag.webcomponent.map.vector.Poly} and use
     *              {@link #addElement()} instead.
     *
     * @param   color {string}      the color of the polygon.
     *                              The color can be specified as a color name
     *                              ("red"), as RGB hex values ("#ff0000"), or
     *                              as RGB alpha values ("rgba(255,0,0,1.0)").
     * @param   coordinates {var[]} the points of the polygon (may be either
     *                              an array of points or an array of alternating
     *                              x and y values).
     * @param   priority {int,0}    the drawing priority.
     * @param   id {var,null}       the id of the polygon.
     *                              If no id is specified,
     *                              a unique one is automatically generated.
     * 
     * @return  {var}               the id of the polygon (either the one passed
     *                              in or a generated one).
     */
    self.showPoly = function(color, coordinates, priority, id) {
        return self.addElement(new map.vector.Poly(color, coordinates, priority, id));
    };


    /**
     * Draws an image marker.
     * 
     * @deprecated  Create an instance of
     *              {@link com.ptvag.webcomponent.map.vector.ImageMarker} and use
     *              {@link #addElement()} instead.
     *
     * @param   x {double}          the x coordinate in smart units.
     * @param   y {double}          the y coordinate in smart units.
     * @param   url {string}        the URL of the image. If it's
     *                              <code>null</code>, a default image is used. If
     *                              the URL doesn't start with a slash (and also
     *                              doesn't start with a protocol identifier like
     *                              "http://"), the URL is relative to the server's
     *                              image repository (i.e. the image is fetched
     *                              from the server jar). If the URL starts with a
     *                              slash or a protocol identifier like "http://",
     *                              it's used directly as the source of the image.
     * @param   alignment {int}     the alignment of the image relative to the x
     *                              and y coordinates (see the constants in the
     *                              {@link com.ptvag.webcomponent.map.layer.VectorLayer}
     *                              class).
     * @param   priority {int,0}    the priority of the marker.
     * @param   id {var,null}       the id of the marker.
     *                              If no id is specified,
     *                              a unique one is automatically generated.
     * @param   isPositionFlexible {boolean,false} Whether the position is
     *                              flexible. Flexible elements will displace
     *                              each other when they are close to another.
     * 
     * @return  {var}               the id of the marker (either the one passed
     *                              in or a generated one).
     */
    self.showImageMarker = function(x, y, url, alignment, priority, id, isPositionFlexible) {
        return self.addElement(new map.vector.ImageMarker(x, y, url, alignment, priority, id, isPositionFlexible));
    };


    /**
     * Draws an info box.
     * 
     * @deprecated  Create an instance of
     *              {@link com.ptvag.webcomponent.map.vector.InfoBox} and use
     *              {@link #addElement()} instead.
     *
     * @param   x {double}          the x coordinate of the info box
     *                              (in smart units).
     * @param   y {double}          the y coordinate of the info box
     *                              (in smart units).
     * @param   text {string}       the box contents (as HTML).
     * @param   alignment {int}     the alignment of the box relative to the x
     *                              and y coordinates (see the constants in the
     *                              {@link com.ptvag.webcomponent.map.layer.VectorLayer}
     *                              class). Currently, the alignment is ignored
     *                              (and the box is styled in a way that doesn't
     *                              make custom alignment sensible).
     * @param   priority {int,0}    the priority of the info box.
     * @param   id {var,null}       the id of the info box.
     *                              If no id is specified,
     *                              a unique one is automatically generated.
     * @param   isPositionFlexible {boolean,false} Whether the position is
     *                              flexible. Flexible elements will displace
     *                              each other when they are close to another.
     * 
     * @return  {var}               the id of the info box (either the one
     *                              passed in or a generated one).
     */
    self.showInfoBox = function(x, y, text, alignment, priority, id, isPositionFlexible) {
        return self.addElement(new map.vector.InfoBox(x, y, text, alignment, priority, id, isPositionFlexible));
    };


    /**
     * "Draws" a tooltip (the tooltips only becomes visible when the mouse
     * moves over the area).
     * 
     * @deprecated  Create an instance of
     *              {@link com.ptvag.webcomponent.map.vector.Tooltip} and use
     *              {@link #addElement()} instead.
     *
     * @param   x {double}          the x coordinate of the area
     *                              (in smart units).
     * @param   y {double}          the y coordinate of the area
     *                              (in smart units).
     * @param   maxZoom {var}       the maximum zoom level on which the area
     *                              is active (currently ignored).
     * @param   tolerance {double}  the maximum distance in pixels for the
     *                              mouse to be considered over the area.
     * @param   text {string}       the tooltip contents (as HTML).
     * @param   alignment {int}     the alignment of the tooltip relative to the x
     *                              and y coordinates (see the constants in the
     *                              {@link com.ptvag.webcomponent.map.layer.VectorLayer}
     *                              class). Currently, the alignment is ignored
     *                              (and the tooltip is styled in a way that doesn't
     *                              make custom alignment sensible).
     * @param   priority {int,0}    the priority of the tooltip.
     * @param   id {var,null}       the id of the tooltip. If no id is
     *                              specified, a unique one is automatically
     *                              generated.
     * @param   isPositionFlexible {boolean,false} Whether the position is
     *                              flexible. Flexible elements will displace
     *                              each other when they are close to another.
     * 
     * @return  {var}               the id of the tooltip (either the one passed
     *                              in or a generated one).
     */
    self.showTooltip = function(x, y, maxZoom, tolerance, text, alignment, priority, id, isPositionFlexible) {
        return self.addElement(new map.vector.Tooltip(x, y, maxZoom, tolerance, text, alignment, priority, id, isPositionFlexible));
    };


    /**
     * Adds an area that reacts to moving the mouse over it.
     * 
     * @deprecated  Create an instance of
     *              {@link com.ptvag.webcomponent.map.vector.HoverArea} and use
     *              {@link #addElement()} instead.
     *
     * @param   x {double}                  the x coordinate of the area
     *                                      (in smart units).
     * @param   y {double}                  the y coordinate of the area
     *                                      (in smart units).
     * @param   maxZoom {var}               the maximum zoom level on which the
     *                                      area is active (currently ignored).
     * @param   tolerance {double}          the maximum distance in pixels for the
     *                                      mouse to be considered over the area.
     * @param   hoverHandler {function}     the handler function called when the
     *                                      mouse is hovered over the area (may be
     *                                      <code>null</code>). The
     *                                      handler is called with a map containing
     *                                      the properties <code>hoverX</code>
     *                                      and <code>hoverY</code> (the actual
     *                                      mouse position in smart units),
     *                                      <code>areaX</code> and
     *                                      <code>areaY</code> (the center of the
     *                                      area in smart units), and
     *                                      <code>id</code> (the id of the hover
     *                                      area).
     * @param   unhoverHandler {function}   the handler function called when the
     *                                      mouse is no longer over the area (may
     *                                      be <code>null</code>). The
     *                                      handler is called with a map containing
     *                                      the properties <code>hoverX</code>
     *                                      and <code>hoverY</code> (the actual
     *                                      mouse position in smart units),
     *                                      <code>areaX</code> and
     *                                      <code>areaY</code> (the center of the
     *                                      area in smart units), and
     *                                      <code>id</code> (the id of the hover
     *                                      area).
     * @param   priority {int,0}            the priority of the area.
     * @param   id {var}                    the id of the area.
     *                                      If no id is specified,
     *                                      a unique one is automatically generated.
     * @param   isPositionFlexible {boolean,false} Whether the position is
     *                              flexible. Flexible elements will displace
     *                              each other when they are close to another.
     * 
     * @return  {var}               the id of the area (either the one passed
     *                              in or a generated one).
     */
    self.addHoverArea = function(x, y, maxZoom, tolerance,
                                 hoverHandler, unhoverHandler, priority, id, isPositionFlexible)
    {
        return self.addElement(new map.vector.HoverArea(x, y, maxZoom, tolerance,
                                                   hoverHandler, unhoverHandler,
                                                   priority, id, isPositionFlexible));
    };


    /**
     * Adds a handler function for clicks at a specified position.
     * The handler function gets three parameters: the x and y coordinates
     * on the map (in smart units) and the id that was specified when adding
     * the handler.
     * <p>
     * When specifying <code>null</code> for the coordinates, the handler is
     * called no matter where the click happened (but only if no other click
     * handler is registered for the specific coordinates where the click
     * happens).
     * </p>
     *
     * @deprecated  Create an instance of
     *              {@link com.ptvag.webcomponent.map.vector.ClickArea} and use
     *              {@link #addElement()} instead.
     *
     * @param   x {double}                  the x coordinate of the area
     *                                      (in smart units).
     * @param   y {double}                  the y coordinate of the area
     *                                      (in smart units).
     * @param   maxZoom {var}               the maximum zoom level on which the
     *                                      area is active (currently ignored).
     * @param   tolerance {double}          the maximum distance in pixels for the
     *                                      mouse to be considered over the area.
     * @param   handler {function}          the handler function called when the
     *                                      mouse is clicked on the area (may be
     *                                      <code>null</code>). The
     *                                      handler is called with a map containing
     *                                      the properties <code>clickX</code>
     *                                      and <code>clickY</code> (the actual
     *                                      mouse position in smart units),
     *                                      <code>areaX</code> and
     *                                      <code>areaY</code> (the center of the
     *                                      area in smart units), and
     *                                      <code>id</code> (the id of the hover
     *                                      area).
     * @param   priority {int,0}            the priority of the area.
     * @param   id {var,null}               the id of the area.
     *                                      If no id is specified,
     *                                      a unique one is automatically generated.
     * @param   isPositionFlexible {boolean,false} Whether the position is
     *                              flexible. Flexible elements will displace
     *                              each other when they are close to another.
     * 
     * @return  {var}               the id of the area (either the one passed
     *                              in or a generated one).
     */
    self.addClickArea = function(x, y, maxZoom, tolerance, handler, priority, id, isPositionFlexible) {
        return self.addElement(new map.vector.ClickArea(x, y, maxZoom, tolerance, handler, priority, id, isPositionFlexible));
    };


    /**
     * Adds a handler function for right clicks at a specified position.
     * The handler function gets three parameters: the x and y coordinates
     * on the map (in smart units) and the id that was specified when adding
     * the handler.
     * <p>
     * When specifying <code>null</code> for the coordinates, the handler is
     * called no matter where the click happened (but only if no other click
     * handler is registered for the specific coordinates where the click
     * happens).
     * </p>
     *
     * @deprecated  Create an instance of
     *              {@link com.ptvag.webcomponent.map.vector.RightClickArea} and use
     *              {@link #addElement()} instead.
     *
     * @param   x {double}                  the x coordinate of the area
     *                                      (in smart units).
     * @param   y {double}                  the y coordinate of the area
     *                                      (in smart units).
     * @param   maxZoom {var}               the maximum zoom level on which the
     *                                      area is active (currently ignored).
     * @param   tolerance {double}          the maximum distance in pixels for the
     *                                      mouse to be considered over the area.
     * @param   handler {function}          the handler function called when the
     *                                      mouse is clicked on the area (may be
     *                                      <code>null</code>). The
     *                                      handler is called with a map containing
     *                                      the properties <code>clickX</code>
     *                                      and <code>clickY</code> (the actual
     *                                      mouse position in smart units),
     *                                      <code>areaX</code> and
     *                                      <code>areaY</code> (the center of the
     *                                      area in smart units), and
     *                                      <code>id</code> (the id of the hover
     *                                      area).
     * @param   priority {int,0}            the priority of the area.
     * @param   id {var,null}               the id of the area.
     *                                      If no id is specified,
     *                                      a unique one is automatically generated.
     * @param   isPositionFlexible {boolean,false} Whether the position is
     *                              flexible. Flexible elements will displace
     *                              each other when they are close to another.
     * 
     * @return  {var}               the id of the area (either the one passed
     *                              in or a generated one).
     */
    self.addRightClickArea = function(x, y, maxZoom, tolerance, handler, priority, id, isPositionFlexible) {
        return self.addElement(new map.vector.RightClickArea(x, y, maxZoom, tolerance, handler, priority, id, isPositionFlexible));
    };


    /**
     * Draws a POI. This is a convenience method so you don't have to use
     * an image marker, tooltip, click area and info box separately.
     * 
     * @deprecated  Create an instance of
     *              {@link com.ptvag.webcomponent.map.vector.POI} and use
     *              {@link #addElement()} instead.
     *
     * @param   x {double}          the x coordinate in smart units.
     * @param   y {double}          the y coordinate in smart units.
     * @param   url {string}        the URL of the image. If it's
     *                              <code>null</code>, a default image is used. If
     *                              the URL doesn't start with a slash (and also
     *                              doesn't start with a protocol identifier like
     *                              "http://"), the URL is relative to the server's
     *                              image repository (i.e. the image is fetched
     *                              from the server jar). If the URL starts with a
     *                              slash or a protocol identifier like "http://",
     *                              it's used directly as the source of the image.
     * @param   alignment {int}     the alignment of the image relative to the x
     *                              and y coordinates (see the constants in the
     *                              {@link com.ptvag.webcomponent.map.layer.VectorLayer}
     *                              class).
     * @param   tooltipContent {string}  the HTML content for the POI tooltip.
     *                              If <code>null</code>, no tooltip is shown
     *                              for the POI.
     * @param   infoBoxContent {string}  the HTML content for the POI info box
     *                              (shown when the POI is clicked).
     *                              If <code>null</code>, no tooltip is shown
     *                              for the POI.
     * @param   priority {int,0}    the priority of the POI.
     * @param   id {var,null}       the id of the POI.
     *                              If no id is specified,
     *                              a unique one is automatically generated.
     * @param   isPositionFlexible {boolean,false} Whether the position is
     *                              flexible. Flexible elements will displace
     *                              each other when they are close to another.
     * 
     * @return  {var}               the id of the POI (either the one passed
     *                              in or a generated one).
     */
    self.showPOI = function(x, y, url, alignment, tooltipContent, infoBoxContent,
                            priority, id, isPositionFlexible) {
        return self.addElement(new map.vector.POI(x, y, url, alignment,
            tooltipContent, infoBoxContent, priority, id, isPositionFlexible));
    };


    // overridden
    var superDispose = self.dispose;
    self.dispose = function() {
        if (self.getDisposed()) {
            return;
        }
        self.getMap().getController().removeEventListener("changeActiveLayer", onActiveLayerChanged);
        for (var id in mAggregateElements) {
            var aggregateElement = mAggregateElements[id];
            if (aggregateElement.getAutoDispose()) {
                aggregateElement.dispose();
            }
        }
        for (var id in mElements) {
            var element = mElements[id];
            if (element.getAutoDispose()) {
                element.dispose();
            }
        }
        if (mCandidateTimer != null) {
            window.clearTimeout(mCandidateTimer);
            mCandidateTimer = null;
        }
        mCandidateEvent = null;
        superDispose.call(self);
    };

});

/** Whether the automatic bulk mode should be used. */
qxp.OO.addProperty({ name:"useAutoBulkMode", type:qxp.constant.Type.BOOLEAN, allowNull:false, defaultValue:true });

/**
 * Whether multiple flexible elements at the exact same position should be
 * pushed apart or not.
 */
qxp.OO.addProperty({ name:"flexAtSamePosition", type:qxp.constant.Type.BOOLEAN, allowNull:false, defaultValue:false });

/**
 * The delay in milliseconds before a hover area gets triggered (this includes
 * tooltips).
 */
qxp.OO.addProperty({ name:"hoverDelay", type:qxp.constant.Type.NUMBER, allowNull:false, defaultValue:0 });


/** Left-align an element (value: 1). */
qxp.Class.ALIGN_LEFT = 1;

/** Horizontally center an element (value: 2). */
qxp.Class.ALIGN_MID_HORIZ = 2;

/** Right-align an element (value: 4). */
qxp.Class.ALIGN_RIGHT = 4;

/** Top-align an element (value: 16). */
qxp.Class.ALIGN_TOP = 16;

/** Vertically center an element (value: 32). */
qxp.Class.ALIGN_MID_VERT = 32;

/** Bottom-align an element (value: 64). */
qxp.Class.ALIGN_BOTTOM = 64;


/** The maximum pixel distance that a flex element may be "pushed away". */
qxp.Class.MAX_FLEX_DISTANCE = 50;
