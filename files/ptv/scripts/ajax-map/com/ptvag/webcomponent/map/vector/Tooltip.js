/**
 * A tooltip.
 * <p>
 * Sample code: {@sample Tooltips (1)},
 *              {@sample Tooltips (2)},
 *              {@sample Client-side POIs},
 *              {@sample Server-side POIs},
 *              {@sample Server-side POIs via xpoidb},
 *              {@sample Server-side drawing},
 *              {@sample Custom client-side POIs}
 * 
 * @param   x {double,4355664}      the x coordinate of the sensitive area
 *                                  (in smart units).
 * @param   y {double,5464867}      the y coordinate of the sensitive area
 *                                  (in smart units).
 * @param   maxZoom {int,0}         the maximum zoom level on which the area is
 *                                  active (ignored - use the
 *                                  {@link VectorElement#visibleMinZoom
 *                                  visibleMinZoom} and
 *                                  {@link VectorElement#visibleMaxZoom
 *                                  visibleMaxZoom} properties instead).
 * @param   tolerance {double,7}    the maximum distance in pixels for the mouse
 *                                  to be considered over the area.
 * @param   text {string,""}    the tooltip contents (as HTML).
 * @param   alignment {int,66}  the alignment of the tooltip relative to the x
 *                              and y coordinates (see the constants in the
 *                              {@link com.ptvag.webcomponent.map.layer.VectorLayer}
 *                              class). Currently, the alignment is ignored
 *                              (and the tooltip is styled in a way that doesn't
 *                              make custom alignment sensible).
 * @param   priority {int,0}    the drawing priority.
 * @param   id {var,null}       the id of the element.
 * @param   isPositionFlexible {boolean,false} Whether the position is
 *                              flexible. Flexible elements will displace
 *                              each other when they are close to another.
 */
qxp.OO.defineClass("com.ptvag.webcomponent.map.vector.Tooltip",
                  com.ptvag.webcomponent.map.vector.AbstractHoverArea,
function(x, y, maxZoom, tolerance, text, alignment, priority, id, isPositionFlexible) {
    com.ptvag.webcomponent.map.vector.AbstractHoverArea.call(this,
        x, y, maxZoom, tolerance, priority, id, isPositionFlexible);

    var self = this;
    var map = com.ptvag.webcomponent.map;
    
    var mTimer = null;
    var mTooltip = null;
    var mTooltipCreator = null;
    var mContainer = null;
    var mTooltipWidth = null;
    var mTooltipHeight = null;
    
    var mFadeTimer = null;
    var mCurrentOpacity = 0;    // in percent
    var mTargetOpacity = 0;     // in percent
    
    var mHovering = false;
    
    var mMapLeft;
    var mMapTop;
    var mMapZoom;


    var disableFilters = function() {
        if (qxp.sys.Client.getInstance().isMshtml() && mTooltip != null &&
            !mTooltip._filtersDisabled) {
            var divs = mTooltip.getElementsByTagName("div");
            var divCount = divs.length;
            for (var i = 0; i < divCount; ++i) {
                var div = divs[i];
                if (div.style.filter != null && div.style.filter != "") {
                    div._preservedFilter = div.style.filter;
                    div.style.filter = "";
                }
            }
            mTooltip._filtersDisabled = true;
        }
    };
    
    
    var enableFilters = function() {
        if (qxp.sys.Client.getInstance().isMshtml() && mTooltip != null &&
            mTooltip._filtersDisabled) {
            var divs = mTooltip.getElementsByTagName("div");
            var divCount = divs.length;
            for (var i = 0; i < divCount; ++i) {
                var div = divs[i];
                if (div._preservedFilter != null) {
                    div.style.filter = div._preservedFilter;
                    div._preservedFilter = null;
                }
            }
            mTooltip._filtersDisabled = null;
        }
    };
    
    
    /**
     * Creates the tooltip element.
     */
    var createTooltipElement = function(recreate) {
        if ((mTooltip == null || recreate) && mContainer != null) {
            mTooltipCreator = self.getInfoBoxElementFactory();
            if (mTooltipCreator == null) {
                mTooltipCreator =
                    com.ptvag.webcomponent.map.vector.InfoBoxElementFactory;
            }
            mTooltip = mTooltipCreator.createInfoBoxElement(
                self.getRealX(), self.getRealY(),
                { text:self.getText(), background:self.getBackground() },
                mContainer, true, mTooltip, self.getAllowWrap(), 0);
            mTooltip.style.zIndex = 2000000000 + self.getPriority();
        }
        return (mTooltip != null);
    };
    
    
    /**
     * Destroys the tooltip element.
     */
    var destroyTooltipElement = function() {
        if (mTooltip != null) {
            mTooltipCreator.destroyInfoBoxElement(mTooltip);
            mTooltip = null;
            mTooltipCreator = null;
        }
    };
    
    
    /**
     * Sets the current opacity on the tooltip element.
     * 
     * @return  {boolean}           <code>true</code> if the target opacity has
     *                              been reached (or if the tooltip element is
     *                              <code>null</code>).
     */
    
    var setOpacity = function() {
        if (createTooltipElement()) {
            if (mCurrentOpacity != 100) {
                // stupid IE workaround
                disableFilters();
            }
            map.MapUtil.setElementOpacity(mTooltip, mCurrentOpacity/100);
            if (mCurrentOpacity == 100) {
                enableFilters();
            }
        }
        if (mCurrentOpacity == mTargetOpacity) {
            if (mCurrentOpacity == 0) {
                destroyTooltipElement();
            }
            return true;
        }
        return (mTooltip == null);
        // if the tooltip is not there, there's nothing more to fade in/out;
        // if it's there and the target opacity has been reached, we can't get
        // here
    };
    
    
    /**
     * Sets the fade timer depending on whether the tooltip should be faded in
     * or out.
     */
    var setFadeTimer = function() {
        if (mTargetOpacity >= mCurrentOpacity) {
            mFadeTimer = window.setTimeout(fade, self.getFadeIntervalIn());
        } else {
            mFadeTimer = window.setTimeout(fade, self.getFadeIntervalOut());
        }
    };
    
    
    /**
     * Performs a single fade "step".
     */
    var fade = function() {
        if (mFadeTimer == null) {
            return;     // workaround for IE bug
        }
        mFadeTimer = null;
        var diff = mTargetOpacity - mCurrentOpacity;
        var fadeStep = self.getFadeStep();
        if (diff <= fadeStep && diff >= -fadeStep) {
            mCurrentOpacity = mTargetOpacity;
        } else {
            if (diff < 0) {
                mCurrentOpacity -= fadeStep;
            } else {
                mCurrentOpacity += fadeStep;
            }
        }
        if (!setOpacity()) {
            setFadeTimer();
        }
    };

    
    /**
     * Starts fading the tooltip to the specified target opacity.
     * 
     * @param   targetOpacity {double}  the target opacity.
     */
    var fadeTo = function(targetOpacity) {
        if (targetOpacity != mTargetOpacity) {
            if (mTimer != null) {
                window.clearTimeout(mTimer);
                mTimer = null;
            }
        }
        mTargetOpacity = targetOpacity;
        if (!setOpacity() && mFadeTimer == null) {
            setFadeTimer();
        }
    };
    

    /**
     * A timeout function for automatically hiding the tooltip after a while
     * (not used in the current implementation of this class).
     */
    var timeout = function() {
        fadeTo(0);
        mTimer = null;
    };
    

    // overridden
    var superDraw = self.draw;
    self.draw = function(container, topLevelContainer, ctx,
        mapLeft, mapTop, mapZoom) {
        
        mMapZoom = mapZoom;
        mMapLeft = mapLeft;
        mMapTop = mapTop;
        
        superDraw(container, topLevelContainer, ctx, mapLeft, mapTop, mapZoom);
        mContainer = topLevelContainer;
        // TODO: if the vector layer is changed so that tooltips don't vanish
        // when the map is moved, the tooltip has to be repositioned here
    };
    
    
    // overridden
    self.onHover = function(evt, forceChange) {
        var nearestX = evt.nearestX;
        if (nearestX != null) {
            var nearestPoint = com.ptvag.webcomponent.map.CoordUtil.smartUnit2Pixel(
                { x:nearestX, y:evt.nearestY }, mMapZoom);
            var realX = nearestPoint.x - mMapLeft;
            var realY = mMapTop - nearestPoint.y;
            var coords = self.getVectorLayer().getMap().transformPixelCoords(
                realX, realY, false, false, true);
            self.setRealX(coords.x);
            self.setRealY(coords.y);
        }
        if (mContainer != null) {
            // it shouldn't happen that the container is null here, but better
            // be safe
            mHovering = true;
            if (forceChange) {
                //destroyTooltipElement();
                createTooltipElement(true);
            }
            fadeTo(self.getTargetOpacity());
            //mTimer = window.setTimeout(timeout,
            //                           map.vector.Tooltip.SHOW_TIME);
        }
    };
    

    // overridden
    self.onUnhover = function(evt) {
        if (mHovering) {
            mHovering = false;
            fadeTo(0);
        }
    };
    
    
    // overridden
    self.clear = function() {
        mHovering = false;
        // clean up everything else even if mHovering was true before
        // (there may still be timers and stuff)
        if (mTimer != null) {
            window.clearTimeout(mTimer);
            mTimer = null;
        }
        if (mFadeTimer != null) {
            window.clearTimeout(mFadeTimer);
            mFadeTimer = null;
        }
        destroyTooltipElement();
        mCurrentOpacity = 0;
        //self.info("hiding tooltip");
    };
    
    
    // overridden
    self.testUnhover = function(evt) {
        if (mTooltip != null && mHovering) {
            return mTooltipCreator.testUnhover(
                evt, mTooltip, self.getTolerance());
        }
        return false;
    };


    // overridden
    self.refresh = function() {
        if (self.getVectorLayer()) {
            createTooltipElement(true);
            fadeTo(mTargetOpacity);
        }
    };


    /**
     * Tests whether the mouse is over a visible port of the tooltip (without
     * any tolerance and taking into account - although not pixel-perfect -
     * transparent parts of the tooltip).
     *
     * @param   evt {Map}               the mouse event containing the current
     *                                  coordinates.
     *
     * @return  {boolean}               <code>true</code> if the mouse is over
     *                                  a visible, non-transparent part of the
     *                                  tooltip, <code>false</code> otherwise.
     */
    self.hitTest = function(evt) {
        if (mTooltip != null && mHovering) {
            return mTooltipCreator.hitTest(evt, mTooltip);
        }
        return false;
    };
    

    if (text != null) {
        self.setText(text);
    }
    if (alignment != null) {
        self.setAlignment(alignment);
    }
    
    self.refreshOn("text", "alignment", "infoBoxElementFactory", "targetOpacity", "background");
});


/** Currently unused. */
qxp.Class.SHOW_TIME = 4000;

/** The contents of the tooltip (as HTML). */
qxp.OO.addProperty({ name:"text", type:qxp.constant.Type.STRING, allowNull:false, defaultValue:"" });

/**
 * The alignment of the tooltip relative to the x and y coordinates (see the
 * constants in the {@link com.ptvag.webcomponent.map.layer.VectorLayer}
 * class). Currently, the alignment is ignored (and the tooltip is styled in a
 * way that doesn't make custom alignment sensible).
 */
qxp.OO.addProperty({ name:"alignment", type:qxp.constant.Type.NUMBER, allowNull:false, defaultValue:66 });

/**
 * The factory that should be used to create the DOM element for the tooltip.
 * If <code>null</code>, the system wide default will be used (which can be set
 * by changing com.ptvag.webcomponent.map.vector.InfoBoxElementFactory).
 */
qxp.OO.addProperty({ name:"infoBoxElementFactory",
                    type:qxp.constant.Type.OBJECT,
                    allowNull:true,
                    defaultValue:null });

/**
 * The granularity for changing the tooltip opacity when fading it in or out
 * (in percentage points). For example, a value of 20 means the tooltip will
 * fade in our out in 5 opacity steps.
 */
qxp.OO.addProperty({ name:"fadeStep", type:qxp.constant.Type.NUMBER, allowNull:false, defaultValue:20 });

/**
 * The opacity of the tooltip (in percentage points). By changing this
 * value, you can create semi-transparent tooltips.
 */
qxp.OO.addProperty({ name:"targetOpacity", type:qxp.constant.Type.NUMBER, allowNull:false, defaultValue:100 });

/**
 * The interval (in milliseconds) between two fade steps when fading the
 * tooltip out. For example, setting this value to 40 while {@link #fadeStep}
 * is 20 means that the tooltip is completely invisible after 400 milliseconds
 * (plus a little bit of overhead that can usually be neglected).
 */
qxp.OO.addProperty({ name:"fadeIntervalOut", type:qxp.constant.Type.NUMBER, allowNull:false, defaultValue:40 });

/**
 * The interval (in milliseconds) between two fade steps when fading the
 * tooltip in. See {@link #fadeIntervalOut} for more details.
 */
qxp.OO.addProperty({ name:"fadeIntervalIn", type:qxp.constant.Type.NUMBER, allowNull:false, defaultValue:5 });

/**
 * The desired background color of the tooltip (as a valid CSS color value).
 * This color is visible in the padding area around the actual content. The
 * amount of padding can be specified by calling
 * <code>InfoBoxElementFactory.setPaddingLeft(newValue)</code> (similarly for
 * right, top, and bottom padding).
 */
qxp.OO.addProperty({ name:"background", type:qxp.constant.Type.STRING, allowNull:false, defaultValue:"#ffffff" });

/**
 * Whether the tooltips content should be allowed to wrap. If
 * <code>null</code>, this is determined by the global
 * {@link InfoBoxElementFactoryDefault#allowWrap allowWrap} property.
 */
qxp.OO.addProperty({ name:"allowWrap", type:qxp.constant.Type.BOOLEAN });
