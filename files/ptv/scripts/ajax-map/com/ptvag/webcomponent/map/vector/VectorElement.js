/**
 * An element that can be drawn on the vector layer.
 * <p>
 * The properties {@link #minFactor}, {@link #maxFactor}, {@link #minZoom}, and
 * {@link #maxZoom} can be used to automatically resize the element depending
 * on the current zoom level. If the zoom level is between (including)
 * <code>minZoom</code> and <code>maxZoom</code>, the element is resized by a
 * factor between <code>minFactor</code> (at zoom level <code>minZoom</code>)
 * and <code>maxFactor</code> (at zoom level <code>maxZoom</code>). However,
 * only the following elements currently support automatic resizing:
 * </p>
 * <ul>
 *     <li>{@link Circle}</li>
 *     <li>{@link Line} (the line width is resized)</li>
 *     <li>{@link ImageMarker2}</li>
 * </ul>
 * <p>
 * Sample code: {@sample Drawing on the map},
 *              {@sample Zoom-dependent elements},
 *              {@sample Flexible elements (1)},
 *              {@sample Flexible elements (2)},
 *              {@sample Custom vector elements},
 *              {@sample Custom flex markers}
 * 
 * @param   priority {int,0}    the drawing priority.
 * @param   id {var,null}       the id of the element.
 * @param   isPositionFlexible {boolean,false} Whether the position is
 *                              flexible. Flexible elements will displace
 *                              each other when they are close to another.
 */
qxp.OO.defineClass("com.ptvag.webcomponent.map.vector.VectorElement", qxp.core.Object,
function(priority, id, isPositionFlexible) {
    qxp.core.Object.call(this);

    var self = this;

    var mMapZoom;
    var mPriorityFixed = false;
    var mInDispose = false;
    
    
    // property modifier
    self._modifyPriority = function() {
        if (mPriorityFixed) {
            throw new Error("The element priority can't be changed after " +
                            "it's been added to the vector layer");
        }
    };
    
    
    // property modifier
    self._modifyPositionFlexible = function(propValue) {
        if (propValue && (self.getX == null || self.getY == null)) {
            throw new Error("This element doesn't support flexible positioning");
        }
        self.refresh();
    };


    // property modifier
    self._modifyVectorLayer = function(propValue, propOldValue) {
        if (propOldValue != null && !mInDispose) {
            throw new Error("Changing the vector layer is not allowed once " +
                            "it's been set");
        }
    };


    /**
     * Used by sub classes to determine the factor for automatic resizing (see
     * class documentation above for more details). This method can be
     * overridden to implement different resizing strategies.
     *
     * @return  {double}            the resizing factor.
     */
    self.getZoomFactor = function() {
        var minFactor = self.getMinFactor();
        var maxFactor = self.getMaxFactor();
        var minZoom = self.getMinZoom();
        var maxZoom = self.getMaxZoom();
        if (mMapZoom <= maxZoom) {    // no typo!
            var factor = maxFactor;
        } else if (mMapZoom >= minZoom) {
            factor = minFactor;
        } else {
            factor = minFactor + (maxFactor - minFactor)*(minZoom - mMapZoom)/(minZoom - maxZoom);
        }
        return factor;
    };
    
    
    /**
     * Returns whether the element draws itself on the canvas (and doesn't
     * generate HTML elements).
     *
     * @param   ctx {var}           the drawing context of the canvas. This
     *                              can be an extended version, so the element
     *                              can decide whether to use the canvas based
     *                              on the presence of certain extensions.
     * 
     * @return  {boolean}           <code>true</code> if the element uses the
     *                              canvas.
     */
    self.usesCanvas = function(ctx) {
        throw new Error("usesCanvas is abstract in VectorElement");
    };
    
    
    /**
     * Draws the element. This method may be called multiple times and should
     * (in the case of HTML elements) only update the element, not create it
     * from scratch. The original method must be called by sub classes that
     * override it (at least if they want to support automatic resizing - see
     * class documentation above).
     * 
     * @param   container {Element}             a container where the element
     *                                          can put HTML elements.
     * @param   topLevelContainer {Element}     a container for HTML elements
     *                                          that have to appear at the top
     *                                          level (necessary for clickable
     *                                          elements).
     * @param   ctx {var}                       the drawing context of the
     *                                          canvas.
     * @param   mapLeft {double}                the left edge of the map in
     *                                          pixels.
     * @param   mapTop {double}                 the top edge of the map in
     *                                          pixels.
     * @param   mapZoom {double}                the current zoom level of the
     *                                          map.
     */
    self.draw = function(container, topLevelContainer, ctx,
                         mapLeft, mapTop, mapZoom) {
        mMapZoom = mapZoom;
    };
    
    
    /**
     * Clears the element. Vector elements that only use the canvas don't have
     * to do anything here as the canvas is cleared from outside.
     *
     * @param   inDispose {boolean}            whether this method is called
     *                                         because the object is disposed.
     *                                         If <code>true</code>, sub
     *                                         classes should only perform
     *                                         cleanup actions here (and not
     *                                         do any expensive work or send
     *                                         events - the latter would likely
     *                                         cause errors on page unload).
     */
    self.clear = function(inDispose) {
        // empty default implementation
    };
    
    
    /**
     * Fixes the element's priority (so it's not modifyable anymore). The
     * vector layer uses this when the element has been added to its queue
     * (modifying the priority wouldn't work correctly after that).
     */
    self.fixPriority = function() {
        mPriorityFixed = true;
    };
    

    /**
     * Refreshes (= redraws) the element. The default implementation simply
     * clears the vector element and refreshes the whole vector layer. Since
     * the layer's auto bulk mode prevents excessive redrawing by default, you
     * can call this method many times in a row without causing undue delays.
     */
    self.refresh = function() {
        var vectorLayer = self.getVectorLayer();
        if (vectorLayer) {
            self.clear();
            vectorLayer.onViewChanged();
        }
    };


    /**
     * Refreshes the vector layer if one of the specified properties changes.
     * Existing modifiers for these properties are overwritten!
     * <p>
     * This method receives the property names as individual arguments.
     * </p>
     */
    self.refreshOn = function() {
        var length = arguments.length;
        for (var i = 0; i < length; ++i) {
            self["_modify" + qxp.lang.String.toFirstUp(arguments[i])] =
                self.refresh;
        }
    };


    // overridden
    var superDispose = self.dispose;
    self.dispose = function() {
        if (self.getDisposed()) {
            return;
        }

        mInDispose = true;
        self.clear(true);
        self.setVectorLayer(null);
        superDispose.call(self);
    };


    if (priority != null) {
        self.setPriority(priority);
    }
    if (id != null) {
        self.setId(id);
    }
    if (isPositionFlexible != null) {
        self.setPositionFlexible(isPositionFlexible);
    }

    self.refreshOn("minFactor", "maxFactor", "minZoom", "maxZoom",
                   "visibleMinZoom", "visibleMaxZoom");
});


/** The drawing priority. */
qxp.OO.addProperty({ name:"priority", type:qxp.constant.Type.NUMBER, allowNull:false, defaultValue:0 });

/** The id of the element. */
qxp.OO.addProperty({ name:"id", allowNull:false, writeOnce:true });

/**
 * Whether the position is flexible. Flexible elements will displace each other
 * when they are close to another.
 */
qxp.OO.addProperty({ name:"positionFlexible", getAlias:"isPositionFlexible", allowNull:false, defaultValue:false });

/**
 * The number of pixels the element should move to the right (automatically set
 * for flexible elements). This property works in map coordinates (which may be
 * rotated relative to screen coordinates).
 */
qxp.OO.addProperty({ name:"flexX", allowNull:false, defaultValue:0 });

/**
 * The number of pixels the element should move to the bottom (automatically
 * set for flexible elements). This property works in map coordinates (which
 * may be rotated relative to screen coordinates).
 */
qxp.OO.addProperty({ name:"flexY", allowNull:false, defaultValue:0 });

/**
 * The id of the element that this element depends on (for grouping elements
 * for flex positioning).
 */
qxp.OO.addProperty({ name:"dependsOn", allowNull:true, defaultValue:null });

/** Minimum resize factor. See class documentation above for more details. */
qxp.OO.addProperty({ name:"minFactor", type:qxp.constant.Type.NUMBER, defaultValue:1.0, allowNull:false });

/** Maximum resize factor. See class documentation above for more details. */
qxp.OO.addProperty({ name:"maxFactor", type:qxp.constant.Type.NUMBER, defaultValue:1.0, allowNull:false });

/** Minimum zoom for resizing. See class documentation above for more details. */
qxp.OO.addProperty({ name:"minZoom", type:qxp.constant.Type.NUMBER, defaultValue:23, allowNull:false });

/** Maximum zoom for resizing. See class documentation above for more details. */
qxp.OO.addProperty({ name:"maxZoom", type:qxp.constant.Type.NUMBER, defaultValue:0, allowNull:false });

/** Minimum zoom at which the element is visible. */
qxp.OO.addProperty({ name:"visibleMinZoom", type:qxp.constant.Type.NUMBER, defaultValue:1000, allowNull:false });

/** Maximum zoom at which the element is visible. */
qxp.OO.addProperty({ name:"visibleMaxZoom", type:qxp.constant.Type.NUMBER, defaultValue:0, allowNull:false });

/** Whether to automatically dispose this element when it's removed from the map. */
qxp.OO.addProperty({ name:"autoDispose", allowNull:false, defaultValue:true });

/** Holds the vector layer this element belongs to. */
qxp.OO.addProperty({ name:"vectorLayer", allowNull:true, defaultValue:null });

