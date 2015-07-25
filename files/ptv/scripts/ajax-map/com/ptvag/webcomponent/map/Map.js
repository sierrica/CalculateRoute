/**
 * The main Map class. Shows a map using multiple layers arranged on top of each
 * other. By default, the following layers are available:
 * <ul>
 *   <li><strong>coursegrained</strong>: A background layer that provides a
 *     rough view of the map (at a quarter of the resolution). This layer
 *     is useful to give the user something to look at while the map in its
 *     actual resolution is still loading. However, you have to manually
 *     enable this layer (by calling <code>setEnabled(true)</code> on it)
 *     since it's disabled by default.</li>
 *   <li><strong>background</strong>: A backgroung layer made up of tiles
 *     that are cached by the browser.</li>
 *   <li><strong>sat</strong>: A layer showing satellite or aerial images
 *     (disabled by default - requires server-side support for
 *     sat images).</li>
 *   <li><strong>label</strong>: Shows the names of cities and streets and
 *     can include additional elements drawn by the server (POIs or
 *     SMOs).</li>
 *   <li><strong>vector</strong>: A layer for drawing images, circles, lines,
 *     etc. on top of the map.</li>
 *   <li><strong>overview</strong>: A zoomed-out version of the main map that
 *     is shown in a smaller rectangle (useful for giving users a rough
 *     idea where they are). This layer is disabled by default.</li>
 *   <li><strong>floater</strong>: This layer is used internally by the map
 *     to show floating elements (like tooltips) that are temporarily shown
 *     above all other map layers (but below UI layers).</li>
 *   <li><strong>compass</strong>: An image that shows a compass rose.</li>
 *   <li><strong>position</strong>: Shows the current location (as longitude
 *     and latitude) under the mouse cursor (disabled by default).</li>
 *   <li><strong>debug</strong>: Shows the current location under the mouse
 *     cursor in a variety of coordinate systems (disabled
 *     by default).</li>
 *   <li><strong>copyright</strong>: Shows a copyright text.</li>
 *   <li><strong>scale</strong>: Shows the current scale of the map.</li>
 *   <li><strong>zoomslider</strong>: Shows a slider that allows the user to
 *     adjust the zoom level.</li>
 *   <li><strong>toolbar</strong>: Contains a toolbar that offers common
 *     actions a user wants to perform on the map (e.g. zooming in or out
 *     or enabling the overview layer).</li>
 * </ul>
 * <p>
 *   Other layers can be added by calling {@link #addLayer addLayer}. A
 *   reference to each layer can be obtained by calling
 *   {@link #getLayer getLayer}. Many layers are subclasses of
 *   {@link com.ptvag.webcomponent.map.layer.AbstractStaticAreaLayer} and can
 *   be positioned and sized freely within the map area.
 * </p>
 * 
 * @event   adjustingCenterFinished {qxp.event.type.Event}   fired when there's
 *              a new center (and after animation has finished in case it's
 *              turned on).
 * @event   historyChanged {qxp.event.type.Event}    fired when a new entry is
 *              added to the history or when the user moves around in the
 *              history. The history works like a browser history, just for the
 *              map. This way, the user can easily get back to a map area
 *              viewed earlier.
 * @event   newMapSession {qxp.event.type.Event}     fired when the
 *              {@link #newMapSession newMapSession} method is called.
 *
 * @param   parentElement {Element} the HTML element to render the map control in.
 * @param   startRect {Map}     an optional JavaScript dictionary with the
 *                              initial rect for the map (in smart units) - if
 *                              <code>null</code>, a default rect of
 *                              {left:4293961, top:5679567, right:4502808,
 *                               bottom:5400533} is used.
 * @param   useVersionedRequests {boolean, true}    whether to use versioned
 *                                                  map requests.
 * @param   profileGroup {string, null}     the profile group to use for map
 *                              requests. This way, the same AjaxMaps server
 *                              can support different XMap profiles (depending
 *                              on what the client requests). If
 *                              <code>null</code>, the default profiles are
 *                              used.
 */

qxp.OO.defineClass("com.ptvag.webcomponent.map.Map", qxp.core.Target,
function(parentElement, startRect, useVersionedRequests, profileGroup) {
    qxp.core.Target.call(this);

    var self = this;
    var map = com.ptvag.webcomponent.map;
    var CoordUtil = map.CoordUtil;
    var rewriteURL = map.MapUtil.rewriteURL;

    /** The main div where the layers are rendered in. */
    var mComponentElement;
    
    var mRelativeLayersElement;

    var mLayerArr = [];
    var mLayerDict = {};

    var mTileDebugMode = false;

    var mController;
    var mServerDrawnObjectManager;

    var mZoomBoxElem;

    var mInBulkMode = false;
    var mBulkEvent;
    var mFiringBulkEvent = false;
    var mAppliedRotationAngle = 0;

    var mHistory = [];
    var mHistoryPosition = -1;
    var mInternalHistoryChange = false;
    var mBulkHistoryItem;

    /** {string[]} The current stack of logging actions. */
    var mCurrentLoggingStack = [];

    /**
     * {string[]} The top elements of the logging stacks belonging to the
     * current bulk mode.
     */
    var mBulkLoggingArr = [];

    var mClipRectSu = {};
    var mClipRectMerc;

    /** Holds the center as it was, when centerIsAdjusting was set to true. */
    var mCenterBeforeAdjusting;
    
    var mCurrentPrintDiv;
    var mCurrentPrintContext;
    
    var mDeferredInitTimer = null;
    var mDeferredInitLayers = [];
    var mDeferredInitLoggingActions = [];
    
    var mMapVersion = null;

    var mConfigurableCursor;


    // property modifier
    self._modifyProfileGroup = function() {
        self.startLoggingAction("mapapi:setProfileGroup");
        try {
            fireOnViewChanged({ clipRectChanged:true });
                // clipRectChanged: hack to force a reload
        } finally {
            self.endLoggingAction();
        }
    };


    // property modifier
    self._modifyBackendServer = function(propValue) {
        self.setCopyright(propValue);
    };


    // property checker
    self._checkCenter = function(propValue) {
        // first of all, check whether we have a valid center point; if not,
        // throw an exception
        if (typeof (propValue.x) != "number" || typeof (propValue.y) != "number" ||
            isNaN(propValue.x) || isNaN(propValue.y)) {
            throw new Error("Illegal center: " + propValue.x + "/" + propValue.y);
        }
        
        if (mClipRectSu.left == null && mClipRectSu.top == null &&
            mClipRectSu.right == null && mClipRectSu.bottom == null)
        {
            // We have no clip rect
            return propValue;
        }

        // Don't allow the map the get beyond the clip rect
        var zoom = self.getZoom();
        var newCenterPix = CoordUtil.smartUnit2Pixel(propValue, zoom);
        var clipStartPix = CoordUtil.smartUnit2Pixel({x:mClipRectSu.left,  y:mClipRectSu.top},    zoom);
        var clipEndPix   = CoordUtil.smartUnit2Pixel({x:mClipRectSu.right, y:mClipRectSu.bottom}, zoom);
        var mapWidth  = self.getWidth();
        var mapHeight = self.getHeight();
        var clipMoveBorder = self.getClipMoveBorder();

        // Move the new center, if nessesary
        var origNewCenterX = newCenterPix.x;
        var origNewCenterY = newCenterPix.y;
        if (mClipRectSu.left != null) {
            var minX = clipStartPix.x + clipMoveBorder - mapWidth / 2;
            if (newCenterPix.x < minX) {
                newCenterPix.x = minX;
            }
        }
        if (mClipRectSu.top != null) {
            var maxY = clipStartPix.y - clipMoveBorder + mapHeight / 2;
            if (newCenterPix.y > maxY) {
                newCenterPix.y = maxY;
            }
        }
        if (mClipRectSu.right != null) {
            var maxX = clipEndPix.x - clipMoveBorder + mapWidth / 2;
            if (newCenterPix.x > maxX) {
                newCenterPix.x = maxX;
            }
        }
        if (mClipRectSu.bottom != null) {
            var minY = clipEndPix.y + clipMoveBorder - mapHeight / 2;
            if (newCenterPix.y < minY) {
                newCenterPix.y = minY;
            }
        }

        // Translate to smart unit when moving was nessesary
        if (newCenterPix.x != origNewCenterX || newCenterPix.y != origNewCenterY) {
            return CoordUtil.pixel2SmartUnit(newCenterPix, zoom);
        } else {
            return propValue;
        }
    };


    // property modifier
    self._modifyCenter = function(propValue, propOldValue) {
        // Check whether the center was really changed
        // (the modifier is also called when a new point was set having the same coordinates)
        if ((propOldValue == null) || (propValue.x != propOldValue.x) || (propValue.y != propOldValue.y)) {
            self.startLoggingAction("mapapi:setCenter");
            try {
                if (self.getAnimate()) {
                    self.getAnimator().onTargetChanged();
                } else {
                    self.getAnimator().stopAnimation();
                    self.setVisibleCenter(propValue);
                }

                if (! self.getCenterIsAdjusting()) {
                    onAdjustingCenterFinished();
                }
            } finally {
                self.endLoggingAction();
            }
        }
    };


    // property modifier
    self._modifyCenterIsAdjusting = function(propValue) {
        if (propValue) {
            mCenterBeforeAdjusting = self.getCenter();
        } else {
            var center = self.getCenter();
            if (center.x != mCenterBeforeAdjusting.x || center.y != mCenterBeforeAdjusting.y) {
                onAdjustingCenterFinished();
            }
        }
    };


    /**
     * Event handler. Called when adjusting the center is finished.
     */
    var onAdjustingCenterFinished = function() {
        addToHistory(self.getCenter(), null);

        self.createDispatchEvent("adjustingCenterFinished");
    };


    // property checker
    self._checkZoom = function(propValue) {
        var maxZoom = CoordUtil.TILE_WIDTHS.length - 1;

        if (propValue < 0) {
            return 0;
        } else if (propValue > maxZoom) {
            return maxZoom;
        } else {
            return Math.round(propValue);
        }
    };


    // property modifier
    self._modifyZoom = function(propValue) {
        addToHistory(null, propValue);

        self.startLoggingAction("mapapi:setZoom");
        try {
            if (self.getAnimate()) {
                self.getAnimator().onTargetChanged();
            } else {
                self.getAnimator().stopAnimation();
                self.setVisibleZoom(propValue);
            }
        } finally {
            self.endLoggingAction();
        }
    };


    // property checker
    self._checkRotation = function(propValue) {
        if (angle != 0 && !map.MapUtil.areAffineTransformsSupported()) {
            return 0;
        }
        var angle = propValue%360;
        if (angle < 0) {
            angle += 360;
        }
        return angle;
    };


    // property checker
    self._checkVisibleRotation = function(propValue) {
        if (angle != 0 && !map.MapUtil.areAffineTransformsSupported()) {
            return 0;
        }
        var angle = propValue%360;
        if (angle < 0) {
            angle += 360;
        }
        return angle;
    };


    // property modifier
    self._modifyRotation = function(propValue) {
        self.startLoggingAction("mapapi:setRotation");
        try {
            if (self.getAnimate()) {
                self.getAnimator().onTargetChanged();
            } else {
                self.getAnimator().stopAnimation();
                self.setVisibleRotation(propValue);
            }
        } finally {
            self.endLoggingAction();
        }
    };


    // property modifier
    self._modifyWidth = function() {
        fireOnViewChanged({ widthChanged:true });
    };


    // property modifier
    self._modifyHeight = function() {
        fireOnViewChanged({ heightChanged:true });
    };


    // property modifier
    self._modifyAnimator = function(propValue) {
        propValue.setMap(self);
    };


    /*self._checkVisibleCenter = function(propValue) {
        var smartWrap = CoordUtil.SMART_WRAP;
        var x = propValue.x;
        var y = propValue.y;
        if (x <= smartWrap/2 && x >= -smartWrap/2 &&
            y <= smartWrap/2 && y >= -smartWrap/2) {
            return propValue;
        }
        x = x%smartWrap;
        if (x < 0) {
            x += smartWrap;
        }
        if (x > smartWrap/2) {
            x -= smartWrap;
        }
        y = y%smartWrap;
        if (y < 0) {
            y += smartWrap;
        }
        if (y > smartWrap/2) {
            y -= smartWrap;
        }
        return {x:x, y:y};
    };*/


    // property modifier
    self._modifyVisibleCenter = function(propValue, propOldValue) {
        // Check whether the center was really changed
        // (the modifier is also called when a new point was set having the same coordinates)
        if ((propOldValue == null) || (propValue.x != propOldValue.x) || (propValue.y != propOldValue.y)) {
            fireOnViewChanged({ centerChanged:true });
        }
    };


    // property modifier
    self._modifyVisibleZoom = function() {
        fireOnViewChanged({ zoomChanged:true });
    };


    // property modifier
    self._modifyVisibleRotation = function() {
        fireOnViewChanged({ rotationChanged:true });
    };


    // property checker
    self._checkRelativeOffset = function(propValue) {
        if (!map.Map.MOBILE_TOUCH) {
            var maxValue = map.Map.OPACITY_HACK_SIZE/2 - 10000;
            if (mAppliedRotationAngle == 0 &&
                Math.abs(propValue.x) < maxValue &&
                Math.abs(propValue.y) < maxValue) {
                return {x:propValue.x, y:propValue.y};
            }
        }
        return {x:0, y:0};
    };
    
    
    // property modifier
    self._modifyRelativeOffset = function(propValue) {
        mRelativeLayersElement.style.left = (-Math.round(propValue.x)) + "px";
        mRelativeLayersElement.style.top = (-Math.round(propValue.y)) + "px";
    };
    
    
    /**
     * Correct the relative offset (used by animation in order for
     * the vector layer not to stay behind that much).
     *
     * @param   newCenter {Map}     the next visible map center value.
     */

    self.correctRelativeOffset = function(newCenter) {
        if (mAppliedRotationAngle != 0) {
            return;
        }
        var centerPixOld = CoordUtil.smartUnit2Pixel(self.getVisibleCenter(), self.getVisibleZoom());
        var centerPixNew = CoordUtil.smartUnit2Pixel(newCenter, self.getVisibleZoom());
        var relativeOffset = self.getRelativeOffset();
        self.setRelativeOffset( { x: relativeOffset.x - (centerPixOld.x - centerPixNew.x),
                                  y: relativeOffset.y + (centerPixOld.y - centerPixNew.y) } );
    };


    /**
     * Sets the mouse cursor.
     *
     * @param cursor {string} the CSS name of the cursor to set.
     */
    self.setCursor = function(cursor) {
        if (!qxp.sys.Client.getInstance().isOpera()) {
            // Changing the cursor often only works after moving the mouse in
            // Opera, leading to very ugly effects. Better not change the cursor
            // at all.
            if (cursor == null) {
                cursor = "";
            }
            if (cursor == "") {
                mComponentElement.style.cursor = "";
                return;
            }
            var cursors = cursor.split(",");
            var count = cursors.length;
            for (var i = 0; i < count; ++i) {
                cursor = cursors[i];
                mComponentElement.style.cursor = cursor;
                if (mComponentElement.style.cursor == cursor) {
                    // workaround for firefox cursor handling
                    return;
                }
            }
        }
    };


    var applyConfigurableCursor = function() {
        if (mConfigurableCursor == "default") {
            if (mController.getActionMode() == map.MapController.ACTION_MODE_MOVE) {
                self.setCursor(self.getMoveCursor());
            } else if (mController.getActionMode() == map.MapController.ACTION_MODE_ZOOM) {
                self.setCursor(self.getZoomCursor());
            } else {
                self.setCursor("");
            }
        } else if (mConfigurableCursor == "move") {
            self.setCursor(self.getMoveCursorActive());
        } else if (mConfigurableCursor == "zoom") {
            self.setCursor(self.getZoomCursorActive());
        } else {
            self.setCursor("");
        }
    };


    /**
     * Sets the mouse cursor to one of the consigurable values.
     *
     * @param cursor {string} the desired cursor ("default" for the standard
     *                        mode-dependent cursor, "move" for the active move
     *                        cursor, and "zoom" for the active zoom cursor).
     */
    self.setConfigurableCursor = function(cursor) {
        if (mConfigurableCursor != cursor) {
            mConfigurableCursor = cursor;
            applyConfigurableCursor();
        }
    };


    // property modifiers
    self._modifyMoveCursor = applyConfigurableCursor;
    self._modifyMoveCursorActive = applyConfigurableCursor;
    self._modifyZoomCursor = applyConfigurableCursor;
    self._modifyZoomCursorActive = applyConfigurableCursor;


    /**
     * Returns whether tile debug mode is active.
     * 
     * @return  the tile debug mode flag.
     */
    self.getTileDebugMode = function() {
        return mTileDebugMode;
    };
    
    
    /**
     * Returns the center of the current view in pixels in the current zoom level.
     *
     * @return {Map} the center in smart units as point
     *         (a map with properties "x" and "y").
     */
    self.getCenterInPixel = function() {
        return CoordUtil.smartUnit2Pixel(self.getCenter(), self.getZoom());
    };


    /**
     * Sets the center of the view in pixels in the current zoom level.
     *
     * @param pixPoint {Map} the new center to set as point
     *        (a map with properties "x" and "y")
     */
    self.setCenterInPixel = function(pixPoint) {
        var suPoint = CoordUtil.pixel2SmartUnit(pixPoint, self.getZoom());
        self.setCenter(suPoint);
    };


    /**
     * Moves the center of the view.
     *
     * @param deltaFactorX {double} The percentage of the width to move to the
     *        right (if positive). (0.5 moves half the map to the right)
     * @param deltaFactorY {double} The percentage of the height to move to the
     *        top (if positive). (0.5 moves half the map to the top)
     * @param   useVisibleValues {boolean,false}
     *              whether to use the visible transform values (in contrast to
     *              the target values during an animation).
     */
    self.moveCenterInPercent = function(deltaFactorX, deltaFactorY,
                                        useVisibleValues) {
        if (useVisibleValues) {
            var center = CoordUtil.smartUnit2Pixel(self.getVisibleCenter(),
                                                   //self.getVisibleZoom());
                                                   self.getZoom());
        } else {
            center = CoordUtil.smartUnit2Pixel(self.getCenter(),
                                               self.getZoom());
        }
        var delta = self.transformPixelCoords(deltaFactorX*self.getWidth(),
                                              deltaFactorY*self.getHeight(),
                                              true, false, useVisibleValues);
        self.setCenterInPixel({ x:center.x + delta.x, y:center.y + delta.y });
    };


    /**
     * Sets the visible rectangle in pixels in the current zoom level.
     *
     * @param left {double} The left border of the rectangle.
     * @param top {double} The top border of the rectangle.
     * @param right {double} The right border of the rectangle.
     * @param bottom {double} The bottom border of the rectangle.
     */
    self.setRectInPixel = function(left, top, right, bottom) {
        var zoom = self.getZoom();
        var startSuPoint = CoordUtil.pixel2SmartUnit({x:left, y:top}, zoom);
        var endSuPoint   = CoordUtil.pixel2SmartUnit({x:right, y:bottom}, zoom);

        self.setRect(startSuPoint.x, startSuPoint.y, endSuPoint.x, endSuPoint.y);
    };


    /**
     * Sets the visible rectangle in smart units. If <code>round</code> is
     * <code>false</code>, a zoom level is chosen that is guaranteed to show
     * the whole specified rect. If it is <code>true</code>, the zoom level is
     * rounded instead, and some parts of the specified rect may appear outside
     * of the visible map area.
     *
     * @param left {double} The left border of the rectangle.
     * @param top {double} The top border of the rectangle.
     * @param right {double} The right border of the rectangle.
     * @param bottom {double} The bottom border of the rectangle.
     * @param round {boolean,false} whether to use rounding for the zoom level
     *                              (see method comment).
     */
    self.setRect = function(left, top, right, bottom, round) {
        // Get the new center
        var centerSuPt = { x:(left + right) / 2,
                           y:(top + bottom) / 2 };

        // Get the tile width that is able to show this rect
        var suWidth  = Math.abs(left - right);
        var suHeight = Math.abs(top - bottom);

        var mapWidth  = self.getWidth();
        var mapHeight = self.getHeight();

        var suPerPixel = Math.max(suWidth / mapWidth, suHeight / mapHeight);

        // Set the new zoom and center
        self.startLoggingAction("mapapi:setRect");
        try {
            var alreadyInBulkMode = mInBulkMode;
            if (! alreadyInBulkMode) {
                self.startBulkMode();
            }
    
            self.setZoomInSmartUnitsPerPixel(suPerPixel, round);
            self.setCenter(centerSuPt);
    
            if (! alreadyInBulkMode) {
                self.endBulkMode();
            }
        } finally {
            self.endLoggingAction();
        }
    }


    /**
     * Returns the visible rect in pixels in the current zoom level.
     *
     * @return {Map} A map with properties "left", "top", "right" and "bottom".
     *         Each of these is a double in pixels in the current zoom level.
     */
    self.getRectInPixel = function() {
        var mapWidth  = self.getWidth();
        var mapHeight = self.getHeight();
        var centerPixPoint = self.getCenterInPixel();

        return {
            left:  centerPixPoint.x - mapWidth  / 2,
            top:   centerPixPoint.y - mapHeight / 2,
            right: centerPixPoint.x + mapWidth  / 2,
            bottom:centerPixPoint.y + mapHeight / 2
        };
    };


    /**
     * Returns the visible rect in smart units.
     *
     * @return {Map} A map with properties "left", "top", "right" and "bottom".
     *         Each of these is a double in smart units.
     */
    self.getRect = function() {
        var pixRect = self.getRectInPixel();
        var zoom = self.getZoom();

        var startSuPoint = CoordUtil.pixel2SmartUnit({x:pixRect.left,  y:pixRect.top},    zoom);
        var endSuPoint   = CoordUtil.pixel2SmartUnit({x:pixRect.right, y:pixRect.bottom}, zoom);

        return {
            left:   startSuPoint.x,
            right:  endSuPoint.x,
            top:    endSuPoint.y,
            bottom: startSuPoint.y
        };
    };


    /**
     * Sets the zoom level in smart units per pixel. Since the zoom levels are
     * fixed, the next higher matching zoom level will be taken. Thus the
     * resulting smart units per pixel may be higher. Alternatively, you can
     * specify <code>true</code> for the <code>round</code> parameter to round
     * to the best matching zoom level (but then there's no guarantee the whole
     * rect is shown).
     *
     * @param suPerPixel {double} the number of smart units to show per pixel.
     * @param round {boolean,false} whether to use rounding for the zoom level
     *                              (see method comment).
     */
    self.setZoomInSmartUnitsPerPixel = function(suPerPixel, round) {
        var level = CoordUtil.getLevelForSmartUnitsPerPixel(suPerPixel);
        if (round) {
            level = Math.round(level);
        } else {
            level = Math.ceil(level);
        }
        self.setZoom(level);
    };


    /**
     * Returns the zoom level in smart units per pixel.
     *
     * @return {double} the zoom level.
     */
    self.getZoomInSmartUnitsPerPixel = function() {
        var suTileWidth = CoordUtil.TILE_WIDTHS[self.getZoom()];
        return suTileWidth / CoordUtil.TILE_WIDTH;
    }


    /**
     * Changes the center and zoom of the map in such a way that all points are
     * visible.
     *
     * @param pointList {var} the points that should be visible (may be either
     *        an array of points or an array of alternating x and y values or a
     *        string with space separated alternating x and y values).
     * @param dontMoveIfVisible {boolean,false} whether the center and zoom
     *        should not be changed if the points are already visible.
     *        If dontMoveIfVisible and keepZoom are both true and the view is
     *        not fully visible then the map is moved as little as possible.
     * @param keepZoom {boolean,false} whether the zoom level should left unchanged.
     */
    self.setViewToPoints = function(pointList, dontMoveIfVisible, keepZoom) {
        // Get the rect around the points
        var left   = Infinity;
        var right  = -Infinity;
        var top    = -Infinity;
        var bottom = Infinity;
        var iter = new map.PointListIterator(pointList);
        while (iter.iterate()) {
            left   = Math.min(left,   iter.x);
            right  = Math.max(right,  iter.x);
            top    = Math.max(top,    iter.y);
            bottom = Math.min(bottom, iter.y);
        }

        // Check whether the points are already visible
        var border    = self.getViewToPointsBorder();
        if (dontMoveIfVisible) {
            var rect = self.getRectInPixel();
            var oldZoom = self.getZoom();
            var oldTopLeftPix     = CoordUtil.smartUnit2Pixel({ x:left,  y:top    }, oldZoom);
            var oldBottomRightPix = CoordUtil.smartUnit2Pixel({ x:right, y:bottom }, oldZoom);

            if (oldTopLeftPix.x     >= rect.left   + border &&
                oldBottomRightPix.x <= rect.right  - border &&
                oldBottomRightPix.y >= rect.top    + border &&
                oldTopLeftPix.y     <= rect.bottom - border)
            {
                // The points are already visible -> return
                return;
            }
        }

        // Calculate the new zoom and center
        var widthPix  = self.getWidth()  - 2 * border;
        var heightPix = self.getHeight() - 2 * border;

        var oldZoom = self.getZoom();
        var widthSu   = right - left;
        var heightSu  = top - bottom;

        var suPerPixel = Math.max(widthSu / widthPix,
                                  heightSu / heightPix);
        var wantedZoom = Math.ceil(CoordUtil.getLevelForSmartUnitsPerPixel(suPerPixel));

        var minZoom = self.getViewToPointsMinZoomLevel();
        var newZoom = Math.max(wantedZoom, minZoom);
        if (keepZoom && newZoom < oldZoom) {
            newZoom = oldZoom;
        }

        var newCenter = { x:(left + right) / 2,
                          y:(top+bottom) / 2 };
        if (dontMoveIfVisible && keepZoom && oldZoom == newZoom) {
            // The user wanted to move the map as little as possible (dontMoveIfVisible)
            // and the map size is not adjusted to the view that should be shown (keepZoom)
            // -> Check whether the wanted view fits into the map
            var viewTopLeftPix     = CoordUtil.smartUnit2Pixel({ x:left,  y:top    }, newZoom);
            var viewBottomRightPix = CoordUtil.smartUnit2Pixel({ x:right, y:bottom }, newZoom);
            var viewWidthPix  = Math.abs(viewBottomRightPix.x - viewTopLeftPix.x);
            var viewHeightPix = Math.abs(viewBottomRightPix.y - viewTopLeftPix.y);
            if (viewWidthPix < widthPix && viewHeightPix < heightPix) {
                // It fits -> Move the view as little as possible
                var oldCenterSu = self.getCenter();
                var viewCenterSu = newCenter;

                // Get the vector with the direction where the view should be moved.
                // (which is the direction from the old center to the view's center)
                // NOTE: The vector is in smart units. In order to get a vector
                //       that works in a pixel coordinate system, we just flip
                //       the y direction. This works, since we only need a
                //       direction, the vector's length is not important.
                var vectorX = viewCenterSu.x - oldCenterSu.x;
                var vectorY = oldCenterSu.y - viewCenterSu.y;

                // Get the number of pixel, the map's center should be moved
                // from the view's center in order to set the map nearer to its
                // old center while still showing the whole view.
                var moveX = null;
                var moveY = null;

                if (vectorX != 0) {
                    // The vector has a x direction
                    // -> Check the most right (resp. most left) possible position.
                    moveX = (vectorX > 0 ? -1 : 1) * ((widthPix - viewWidthPix) / 2);
                    moveY = moveX * (vectorY / vectorX);
                }
                if (vectorY != 0) {
                    // The vector has a y direction
                    // -> Check the most bottom (resp. most top) possible position.
                    var possibleMoveY = (vectorY > 0 ? -1 : 1) * ((heightPix - viewHeightPix) / 2);
                    var possibleMoveX = possibleMoveY * (vectorX / vectorY);

                    // Take the point that is nearer to [0|0]
                    if (moveX == null
                        || Math.abs(possibleMoveX) < Math.abs(moveX)
                        || Math.abs(possibleMoveY) < Math.abs(moveY))
                    {
                        // The move from the y direction method is smaller
                        // -> Use this one
                        moveX = possibleMoveX;
                        moveY = possibleMoveY;
                    }
                }

                // Calculate the new map center
                if (moveX != null && moveY != null) {
                    var viewCenterPixX = (viewBottomRightPix.x + viewTopLeftPix.x) / 2;
                    var viewCenterPixY = (viewBottomRightPix.y + viewTopLeftPix.y) / 2;
                    var newCenterPix = { x:viewCenterPixX + moveX, y:viewCenterPixY - moveY };
                    newCenter = CoordUtil.pixel2SmartUnit(newCenterPix, newZoom);
                }
            }
        }

        // Set the new zoom and center
        self.startLoggingAction("mapapi:setViewToPoints");
        try {
            var alreadyInBulkMode = mInBulkMode;
            if (! alreadyInBulkMode) {
                self.startBulkMode();
            }

            self.setZoom(newZoom);
            self.setCenter(newCenter);
            self.setRotation(0);    // for now, simply reset the rotation to
                                    // ensure every point is visible

            if (! alreadyInBulkMode) {
                self.endBulkMode();
            }
        } finally {
            self.endLoggingAction();
        }
    };


    /**
     * Sets the maximum rect shown by the map in smart units.
     *
     * @param clipLeft {double} The left border of the map. May be null.
     * @param clipTop {double} The top border of the map. May be null.
     * @param clipRight {double} The right border of the map. May be null.
     * @param clipBottom {double} The bottom border of the map. May be null.
     */
    self.setClipRect = function(clipLeft, clipTop, clipRight, clipBottom) {
        mClipRectSu = { left:clipLeft, top:clipTop, right:clipRight, bottom:clipBottom };
        mClipRectMerc = null;

        self.startLoggingAction("mapapi:setClipRect");
        try {
            fireOnViewChanged({ clipRectChanged:true });
        } finally {
            self.endLoggingAction();
        }

        return true;
    };


    /**
     * Returns the maximum rect shown by the map in smart units.
     *
     * @return {Map} The clip rect. A map width the properties "left", "top",
     *         "right" and "bottom". The values are doubles in smart units and
     *         may be null.
     */
    self.getClipRect = function() {
        return mClipRectSu;
    };


    /**
     * Returns the maximum rect shown by the map in mercator transformation.
     *
     * @return {Map} The clip rect. A map width the properties "left", "top",
     *         "right" and "bottom". The values are doubles in mercator
     *         transformation and may be null.
     */
    self.getClipRectInMercator = function() {
        if (mClipRectMerc == null) {
            var startMerc = CoordUtil.smartUnit2Mercator({x:mClipRectSu.left,  y:mClipRectSu.top});
            var endMerc   = CoordUtil.smartUnit2Mercator({x:mClipRectSu.right, y:mClipRectSu.bottom});
    
            mClipRectMerc = { left:  (mClipRectSu.left   != null ? startMerc.x : null),
                              top:   (mClipRectSu.top    != null ? startMerc.y : null),
                              right: (mClipRectSu.right  != null ? endMerc.x   : null),
                              bottom:(mClipRectSu.bottom != null ? endMerc.y   : null) };
        }

        return mClipRectMerc;
    };


    /**
     * Returns the map controller that processes the user input.
     *
     * @return {MapController} the map controller.
     */
    self.getController = function() {
        return mController;
    };


    /**
     * Returns the manager for server drawn objects (like static POIs or SMOs).
     * 
     * @return  {ServerDrawnObjectManager}  the manager.
     */
    self.getServerDrawnObjectManager = function() {
        return mServerDrawnObjectManager;
    };


    /**
     * Updates the size of the map to fit in its parent element. This method
     * should be called, when the parent element has been resized.
     */
    self.updateSize = function() {
        var width = mComponentElement.offsetWidth;
        var height = mComponentElement.offsetHeight;
        if (width <= 0 || height <= 0) {
            throw new Error("Width or height of the map container element is 0!");
        }

        var alreadyInBulkMode = mInBulkMode;
        if (! alreadyInBulkMode) {
            self.startBulkMode();
        }

        self.startLoggingAction("mapapi:updateSize");
        try {
            self.setWidth(width);
            self.setHeight(height);
    
            if (! alreadyInBulkMode) {
                self.endBulkMode();
            }
        } finally {
            self.endLoggingAction();
        }
    };


    var deferredInit = function() {
        for (var i = 0; i < mDeferredInitLayers.length; ++i) {
            self.startLoggingAction(mDeferredInitLoggingActions[i]);
            try {
                mDeferredInitLayers[i].init();
            } catch (e) {
                self.error(e);
            } finally {
                self.endLoggingAction();
            }
        }
        mDeferredInitLayers = [];
        mDeferredInitLoggingActions = [];
        mDeferredInitTimer = null;
    };
    
    
    /**
     * Adds a layer to the map. If you add a visible map layer, you should make
     * sure that it's positioned unter the overview layer (by using code like
     * <code>map.getLayer("overview")</code> for the <code>insertBefore</code>
     * parameter).
     *
     * @param layer {com.ptvag.webcomponent.map.layer.Layer} the layer to add.
     * @param layerName {string,null} the name of the new layer.
     * @param zIndex {int,0} the zIndex of the new layer. This is only used for
     *                       display purposes! If you need to control the layer
     *                       priority for event handling, position the layer at
     *                       the correct point using the
     *                       <code>insertBefore</code> parameter.
     * @param insertBefore {com.ptvag.webcomponent.map.layer.Layer,null}
     *                                  the layer to insert this layer before.
     *                                  If <code>null</code>, the new layer is
     *                                  appended at the end. Visually,
     *                                  inserting before another layer means
     *                                  displaying it under this other layer.
     * @param deferInit {boolean,true}  if <code>true</code>, the layer is
     *                                  initialized in a timeout. This is
     *                                  useful in order to set some properties
     *                                  of the map after the layer is added,
     *                                  but before it is initialized, thus
     *                                  avoiding unnecessary server requests
     *                                  (e.g. when the center is changed after
     *                                  the layer has been added).
     */
    self.addLayer = function(layer, layerName, zIndex, insertBefore, deferInit) {
        if (deferInit == null) {
            deferInit = true;
        }
        var relative = layer.isRelative();
        var needsOpacityHack = layer.needsOpacityHack();
        var layerParent = document.createElement("div");
        if (! mTileDebugMode && !relative) {
            layerParent.style.overflow = "hidden";
        }
        layerParent.style.position = "absolute";
        if (needsOpacityHack) {
            var size = map.Map.OPACITY_HACK_SIZE;
            layerParent.style.left = -(size/2) + "px";
            layerParent.style.top = -(size/2) + "px";
            layerParent.style.width = size + "px";
            layerParent.style.height = size + "px";
        } else {
            layerParent.style.left = "0px";
            layerParent.style.top = "0px";
            layerParent.style.width = "100%";
            layerParent.style.height = "100%";
        }
        layerParent.style.zIndex = (zIndex == null ? 0 : zIndex);

        var layerInserted = false;
        if (insertBefore == null) {
            mLayerArr.push(layer);
        } else {
            var layerCount = mLayerArr.length;
            for (var i = 0; i < layerCount; ++i) {
                if (mLayerArr[i] == insertBefore) {
                    mLayerArr.splice(i, 0, layer);
                    layerInserted = true;
                    break;
                }
            }
            if (!layerInserted) {
                mLayerArr.push(layer);
            }
        }
        if (layerName != null) {
            mLayerDict[layerName] = layer;
        }

        var container = (relative ? mRelativeLayersElement : mComponentElement);
        if (layerInserted &&
            insertBefore.getParentElement().parentNode == container) {
            container.insertBefore(layerParent, insertBefore.getParentElement());
        } else {
            container.appendChild(layerParent);
        }
        layer.setMap(self);
        layer.setParentElement(layerParent);
        layer.setName(layerName);
        if (deferInit) {
            // hack to make the foreground layer(s) initialize earlier
            if (layer instanceof map.layer.SimpleMapLayer) {
                mDeferredInitLayers.splice(0, 0, layer);
            } else {
                mDeferredInitLayers.push(layer);
            }
            mDeferredInitLoggingActions.push(self.getLoggingInfo());
            if (mDeferredInitTimer == null) {
                mDeferredInitTimer = window.setTimeout(deferredInit, 0);
            }
        } else {
            layer.init();
        }
    };


    /**
     * Removes a layer.
     * 
     * @param   layerName {string}  the name of the layer.
     */
    self.removeLayer = function(layerName) {
        var layer = mLayerDict[layerName];
        if (layer == null) {
            return;
        }
        delete mLayerDict[layerName];
        var layerCount = mLayerArr.length;
        for (var i = 0; i < layerCount; ++i) {
            if (mLayerArr[i] == layer) {
                mLayerArr.splice(i, 1);
                break;
            }
        }
        layerCount = mDeferredInitLayers.length;
        for (i = 0; i < layerCount; ++i) {
            if (mDeferredInitLayers[i] == layer) {
                mDeferredInitLayers.splice(i, 1);
                mDeferredInitLoggingActions.splice(i, 1);
                break;
            }
        }
        var parentElement = layer.getParentElement();
        //layer.setParentElement(null);
            // don't do this for now (might break existing layers, and there
            // shouldn't be any leaks)
        parentElement.parentNode.removeChild(parentElement);
        layer.dispose();
    };


    /**
     * Returns a layer.
     *
     * @param layerName {string} the name of the layer.
     * @return {Layer} the layer or null if there is no such layer.
     */
    self.getLayer = function(layerName) {
        return mLayerDict[layerName];
    };


    /**
     * Returns the layers in the map. The most bottom layer has index 0.
     *
     * @return {Layer[]} the layers.
     */
    self.getLayers = function() {
        return mLayerArr;
    };


    /**
     * Adds a bing aerial layer to the map and wires it up with the toolbar
     * buttons for switching views. You have to use Google/OSM/Bing zoom
     * levels on the map (via
     * {@link com.ptvag.webcomponent.map.CoordUtil#useGoogleZoomLevels useGoogleZoomLevels})
     * for this to work. Otherwise, an exception is thrown.
     *
     * @param apiKey {string} your Bing API key.
     * @param callback {function, null} an optional callback function that
     *     is executed asynchronously with a single boolean parameter
     *     indicating success or failure (for example when the API key is
     *     invalid).
     */
    self.addBingAerialLayer = function(apiKey, callback) {
        if (CoordUtil.ZOOM_LEVEL_FACTOR != 2) {
            throw new Error("Bing maps require a call to com.ptvag.webcomponent.map.CoordUtil.useGoogleZoomLevels()");
        }
        var toolbarLayer = self.getLayer("toolbar");
        toolbarLayer.setButtonEnabled("hybrid-view", false);
        toolbarLayer.setButtonEnabled("aerial-view", false);
        var DefaultToolbarLayer = map.layer.DefaultToolbarLayer;
        DefaultToolbarLayer.switchToPlainView = function(map) {
            map.getLayer("bingLogo").setAreaOpacity(0);
            map.getLayer("bingAerial").setEnabled(false);
            map.getLayer("label").setLayerOpacity(1);
        };
        DefaultToolbarLayer.switchToHybridView = function(map) {
            map.getLayer("bingLogo").setAreaOpacity(1);
            var bingLayer = map.getLayer("bingAerial");
            bingLayer.setEnabled(true);
            bingLayer.setLayerOpacity(0.8);
            map.getLayer("label").setLayerOpacity(0.65);
        };
        DefaultToolbarLayer.switchToAerialView = function(map) {
            map.getLayer("bingLogo").setAreaOpacity(1);
            var bingLayer = map.getLayer("bingAerial");
            bingLayer.setEnabled(true);
            bingLayer.setLayerOpacity(1);
            map.getLayer("label").setLayerOpacity(0.65);
        };
        map.bing.MetaData.setAPIKey(apiKey, function(success) {
            if (success) {
                var requestBuilder = new map.bing.RequestBuilder(self, apiKey);
                var bingLayer = new map.layer.TileMapLayer(requestBuilder);
                bingLayer.setIsRelative(true);
                bingLayer.setNeedsOpacityHack(true);
                bingLayer.setIncludeInPrint(true);
                bingLayer.setEnabled(false);
                self.addLayer(bingLayer, "bingAerial", 0, self.getLayer("label"));
                var bingLogoLayer = new map.layer.ImageLayer(
                    map.bing.MetaData.getMetaData(apiKey).brandLogoUri);
                bingLogoLayer.setAreaLeft(100);
                bingLogoLayer.setAreaRight(100);
                bingLogoLayer.setAreaBottom(0);
                bingLogoLayer.setAreaOpacity(0);
                var origPositionArea = bingLogoLayer.positionArea;
                bingLogoLayer.positionArea = function() {
                    var width = bingLogoLayer.getAreaWidth();
                    var mapWidth = self.getWidth();
                    bingLogoLayer.setAreaLeft(parseInt((mapWidth - width)/2));
                    origPositionArea.apply(bingLogoLayer, arguments);
                };
                bingLogoLayer.setIncludeInPrint(true);
                self.addLayer(bingLogoLayer, "bingLogo", 1, self.getLayer("scale"), false);
                toolbarLayer.setButtonEnabled("hybrid-view", true);
                toolbarLayer.setButtonEnabled("aerial-view", true);
            }
            if (callback) {
                callback(success);
            }
        });
    };
    
    /**
     * Adds an aerial layer to the map and wires it up with the toolbar buttons for 
     * switching views. You have to use Google/OSM/Bing zoom levels on the map (via 
     * {@link com.ptvag.webcomponent.map.CoordUtil#useGoogleZoomLevels useGoogleZoomLevels})
     * for this to work. Otherwise, an exception is thrown.
     *
     * @param name {string} name of the layer.
     * @param urltemplate {string} the url  to be used for requesting tiles. You may
     *     use these placeholders:<br><ul>
     *         <li><code>{subdomain}</code>: Subdomain, replaced with values provided
     *             by the subdomains parameter</li>
     *         <li><code>{x},{y},{z}</code>: tile coordinate</li>
     *         <li><code>{quadkey}</code>: tile coordinate in quadkey representation</li>
     *     </ul>
     * @param subdomains {string[], null} list of subdomains to be used to replace the 
     *     {subdomain} placeholder in the url template. Required if a <code>{subdomain}</code>
     *     placeholder is used in the url template.
     * 
     * @return {@link com.ptvag.webcomponent.map.layer.TileMapLayer 
     *     com.ptvag.webcomponent.map.layer.TileMapLayer} created by this function
     */
    self.addTiledAerialLayer = function(name, urltemplate, subdomains) {
     
      // shortcuts
      var RequestBuilder = com.ptvag.webcomponent.map.RequestBuilder;
      var CoordUtil = com.ptvag.webcomponent.map.CoordUtil;
      var DefaultToolbarLayer = com.ptvag.webcomponent.map.layer.DefaultToolbarLayer;
      var TileMapLayer = com.ptvag.webcomponent.map.layer.TileMapLayer;
      
      // requires com.ptvag.webcomponent.map.CoordUtil.useGoogleZoomLevels
      if (CoordUtil.ZOOM_LEVEL_FACTOR !== 2) { 
         throw new Error('addTiledAerialLayer() requires a call to ' + 
            'com.ptvag.webcomponent.map.CoordUtil.useGoogleZoomLevels()');
      };
      
      // request builder for tile requests. TODO: make public.
      var TileRequestBuilder = function(map, urlTemplate, subdomains) {
      
         // requires com.ptvag.webcomponent.map.CoordUtil.useGoogleZoomLevels
         if (CoordUtil.ZOOM_LEVEL_FACTOR !== 2) { 
            throw new Error('TileRequestBuilder requires a call to ' + 
               'com.ptvag.webcomponent.map.CoordUtil.useGoogleZoomLevels()');
         };
      
         // call base c'tor
         RequestBuilder.call(this, map, true);
         
         var halfCirc = Math.PI * 6371000;
         var base = { buildRequest : this.buildRequest };
         var pixel = 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==';
            
         // given a tile rectangle in PTV Mercator, calculates the tile's x, y and z coordinate
         var tileFromRect = function(left, top, right, bottom) {
            var s = right - left;
            var z = Math.round(Math.log(2 * halfCirc / s) / Math.log(2));
            var n = (1 << z);
            var tile = {
               x : Math.round((left + halfCirc) / s),
               y : n - Math.round((bottom + halfCirc) / s) - 1,
               z : z
            };
            if (tile.x >= 0 && tile.x < n && tile.y >= 0 && tile.y < n) {
               return tile;
            }
         }
         
         // turns a tile coordinates into a quadkey
         var quadKeyFromTile = function(tile) {
            var digits = [];
            for (var i = tile.z - 1; i >= 0; --i) {
               digits.push(((tile.x >> i) & 1) + (((tile.y >> i) & 1) << 1));
            }
            return digits.join("");
         }
         
         // determines the subdomain for a tile
         var subDomainFromTile = function(tile) {
            if (subdomains && subdomains.length) { 
               var index = (tile.x + tile.y) % subdomains.length;
               return subdomains[index];
            }
         }
         
         // replaces the placeholders in urlTemplate and returns the url
         var instantiateUrl = function(left, top, right, bottom) {
            var tile = tileFromRect(left, top, right, bottom);
            return !tile ? pixel : urltemplate
               .replace('{subdomain}', subDomainFromTile(tile))
               .replace('{x}', tile.x).replace('{y}', tile.y).replace('{z}', tile.z)
               .replace('{quadkey}', quadKeyFromTile(tile));
         }
         
         // finally overwrite com.ptvag.webcomponent.map.RequestBuilder.buildRequest to instantiate tile urls
         this.buildRequest = function(left, top, right, bottom, width, height, loggingInfo, mapVersion, angle) {
            var req = base.buildRequest.apply(this, arguments);
            req.url = instantiateUrl(left, top, right, bottom);
            return req;
         }
      };

      // derive TileRequestBuilder from RequestBuilder
      TileRequestBuilder.prototype = new RequestBuilder();
      TileRequestBuilder.prototype.constructor  = TileRequestBuilder;
      
      DefaultToolbarLayer.switchToPlainView = function(map) { 
         map.getLayer(name).setEnabled(false);
         map.getLayer("label").setLayerOpacity(1);
      };

      DefaultToolbarLayer.switchToHybridView = function(map) {
         var layer = map.getLayer(name);
         layer.setEnabled(true);
         layer.setLayerOpacity(0.8);
         map.getLayer("label").setLayerOpacity(0.65);
      };
      
      DefaultToolbarLayer.switchToAerialView = function(map) { 
         var layer = map.getLayer(name);
         layer.setEnabled(true);
         layer.setLayerOpacity(1);
         map.getLayer("label").setLayerOpacity(0.65);
      };
      
      var layer = new TileMapLayer(
         new TileRequestBuilder(this, urltemplate, subdomains)
      );
         
      layer.setIsRelative(true);
      layer.setNeedsOpacityHack(true);
      layer.setIncludeInPrint(true);
      layer.setEnabled(false);
      
      this.addLayer(layer, name, 0, this.getLayer("label"));

      var toolbarLayer = this.getLayer("toolbar");

      toolbarLayer.setButtonEnabled("hybrid-view", true);
      toolbarLayer.setButtonEnabled("aerial-view", true);
      
      return layer;
    };     
    


    /**
     * Shows the zoom box.
     *
     * @param fromX {int} The x coordinate of the start point in pixels
     *        relative to the left side of the map.
     * @param fromY {int} The y coordinate of the start point in pixels
     *        relative to the top side of the map.
     * @param toX {int} The x coordinate of the end point in pixels
     *        relative to the left side of the map.
     * @param toY {int} The y coordinate of the end point in pixels
     *        relative to the top side of the map.
     */
    self.showZoomBox = function(fromX, fromY, toX, toY) {
        if (mZoomBoxElem == null) {
            mZoomBoxElem = document.createElement("div");
            mZoomBoxElem.style.position = "absolute";
            mZoomBoxElem.style.backgroundColor = self.getZoomBoxColor();
            map.MapUtil.setElementOpacity(mZoomBoxElem,
                self.getZoomBoxOpacity());
            mZoomBoxElem.style.borderColor = self.getZoomBoxBorderColor();
            mZoomBoxElem.style.borderStyle = "solid";
            mZoomBoxElem.style.fontSize = "1px";
            mZoomBoxElem.style.zIndex = 2;

            mComponentElement.appendChild(mZoomBoxElem);
        }

        var width = Math.abs(toX - fromX) - 1;
            // -1: because the box must be positioned and sized in a way that
            // any mouse up event occurs outside the box (otherwise, clicks
            // must be performed exactly, without moving the mouse even a tiny
            // little bit
        var height = Math.abs(toY - fromY) - 1;
        if (width < 0) {
            width = 0;
        }
        if (height < 0) {
            height = 0;
        }
        var borderBoxSizingActive = map.MapUtil.isBorderBoxSizingActive();
        var zoomBoxBorderWidth = self.getZoomBoxBorderWidth();
        var zoomBoxBorderHeight = zoomBoxBorderWidth;
        var maxZoomBoxBorderWidth = parseInt(width/2);
        var maxZoomBoxBorderHeight = parseInt(height/2);
        if (zoomBoxBorderWidth > maxZoomBoxBorderWidth) {
            zoomBoxBorderWidth = maxZoomBoxBorderWidth;
        }
        if (zoomBoxBorderHeight > maxZoomBoxBorderHeight) {
            zoomBoxBorderHeight = maxZoomBoxBorderHeight;
        }
        mZoomBoxElem.style.left = Math.min(fromX, toX) + 1 + "px";
            // +1: see comment about -1 above
        mZoomBoxElem.style.top  = Math.min(fromY, toY) + 1 + "px";
        width -= (borderBoxSizingActive ? 0 : zoomBoxBorderWidth*2);
        height -= (borderBoxSizingActive ? 0 : zoomBoxBorderHeight*2);
        mZoomBoxElem.style.borderLeftWidth = zoomBoxBorderWidth + "px";
        mZoomBoxElem.style.borderRightWidth = zoomBoxBorderWidth + "px";
        mZoomBoxElem.style.borderTopWidth = zoomBoxBorderHeight + "px";
        mZoomBoxElem.style.borderBottomWidth = zoomBoxBorderHeight + "px";

        mZoomBoxElem.style.width = width + "px";
        mZoomBoxElem.style.height = height + "px";
        mZoomBoxElem.style.visibility = "";
    };


    /**
     * Hides the zoom box.
     */
    self.hideZoomBox = function() {
        if (mZoomBoxElem) {
            mZoomBoxElem.style.visibility = "hidden";
        }
    };


    /**
     * Translates a point from pixels relative to the top left corner of the map
     * to absolute pixels in the current zoom level.
     * <p>
     * Note: The y axis goes for relative coordinates from top to bottom, but
     * for absolute coordinates from bottom to top.
     *
     * @param relPixPt {Map} the point to translate (in relative pixels)
     * @return {Map} the translated point in absolute pixels.
     */
    self.relative2AbsolutePixel = function(relPixPt) {
        var centerPixPt = self.getCenterInPixel();
        return { x:centerPixPt.x - self.getWidth()  / 2 + relPixPt.x,
                 y:centerPixPt.y + self.getHeight() / 2 - relPixPt.y };
    };


    /**
     * Transforms pixel coordinates according to the current visible
     * map transform.
     *
     * @param   x {double}          the x coordinate (relative and with the
     *                              y axis pointing downwards).
     * @param   y {double}          the y coordinate (relative and with the
     *                              y axis pointing downwards).
     * @param   relativeToCenter {boolean}  whether the coordinates are
     *                                      relative to the map's center or to
     *                                      the top left corner.
     * @param   reverse {boolean}   whether to apply the transform in reverse.
     *                              Set this to <code>true</code> if you want
     *                              to transform mouse coordinates to map
     *                              coordinates.
     * @param   useVisibleValues {boolean}
     *              whether to use the visible transform values (in contrast to
     *              the target values during an animation).
     *
     * @return  {Map}               an object with the transformed coordinates
     *                              (as floating point <code>x</code> and
     *                              <code>y</code> properties).
     */
    self.transformPixelCoords = function(x, y, relativeToCenter, reverse,
            useVisibleValues) {
        var angle = (useVisibleValues ? self.getVisibleRotation() :
                                        self.getRotation());
        if (angle == 0) {
            // shortcut, especially for mouse move events
            return {x:x, y:y};
        }
        if (!relativeToCenter) {
            var halfWidth = self.getWidth()/2;
            var halfHeight = self.getHeight()/2;
            x -= halfWidth;
            y -= halfHeight;
        }
        var rad = angle/180.0*Math.PI;
        if (reverse) {
            rad = -rad;
        }
        var cos = Math.cos(rad);
        var sin = Math.sin(rad);
        var newX = cos*x + sin*y;
        var newY = -sin*x + cos*y;
        if (!relativeToCenter) {
            newX += halfWidth;
            newY += halfHeight;
        }
        return {x:newX, y:newY};
    };


    /**
     * Zooms in or out of a map around the specified pixel coordinates.
     *
     * @param   x {double}          the x coordinate (relative and with the
     *                              y axis pointing downwards).
     * @param   y {double}          the y coordinate (relative and with the
     *                              y axis pointing downwards).
     * @param   relativeToCenter {boolean}  whether the coordinates are
     *                                      relative to the map's center or to
     *                                      the top left corner.
     * @param   zoomDelta {int}     the desired zoom change (negative to zoom
     *                              in, positive to zoom out).
     * @param   zoomDifference {int, 0} an optional difference between the map
     *              zoom and the zoom level that correlates to the pixel
     *              coordinates (useful for layers that show a zoomed out or
     *              zoomed in view).
     * @param   useVisibleValues {boolean}
     *              whether to use the visible transform values (in contrast to
     *              the target values during an animation).
     */
    self.zoomToPixelCoords = function(x, y, relativeToCenter, zoomDelta,
            zoomDifference, useVisibleValues) {
        if (zoomDifference == null) {
            zoomDifference = 0;
        }
        if (!relativeToCenter) {
            x -= self.getWidth()/2;
            y -= self.getHeight()/2;
        }
        var CoordUtil = com.ptvag.webcomponent.map.CoordUtil;
        var oldZoom = (useVisibleValues ? self.getVisibleZoom() :
                                          self.getZoom());
        var newZoom = self._checkZoom(oldZoom + zoomDelta);
        if (oldZoom != newZoom) {
            var coords = self.transformPixelCoords(x, y, true,
                                                   true, useVisibleValues);
            var zoomFactor =
                Math.pow(CoordUtil.ZOOM_LEVEL_FACTOR, zoomDifference);

            var oldCenterSu = (useVisibleValues ? self.getVisibleCenter() :
                               self.getCenter());
            var oldCenterPix = CoordUtil.smartUnit2Pixel(oldCenterSu, oldZoom);
            var oldAimingPix = {
                x:oldCenterPix.x + coords.x * zoomFactor,
                y:oldCenterPix.y - coords.y * zoomFactor };

            var aimingSuPt = CoordUtil.pixel2SmartUnit(oldAimingPix, oldZoom);

            self.startLoggingAction("user:mousewheelZoom");
                // for now, log everything as mousewheelZoom
            try {
                var alreadyInBulkMode = self.inBulkMode();
                if (! alreadyInBulkMode) {
                    self.startBulkMode();
                }
                self.setZoom(newZoom);

                var newAimingPix = CoordUtil.smartUnit2Pixel(aimingSuPt, newZoom);
                var newCenterPix = {
                    x:newAimingPix.x - coords.x * zoomFactor,
                    y:newAimingPix.y + coords.y * zoomFactor };
                self.setCenterInPixel(newCenterPix);
                if (! alreadyInBulkMode) {
                    self.endBulkMode();
                }
            } finally {
                self.endLoggingAction();
            }
        }
    };


    /**
     * Translates mouse coordinates in an event to smart units. The event must
     * have come from the map, not directly from the DOM! The translation is
     * done with respect to the visible center, zoom, and rotation (which may
     * be different from the final values during an animation).
     * 
     * @param   evt {Map}               the event.
     * @return  {Map}                   the translated coordinates or
     *                                  <code>null</code> if they were outside
     *                                  of the map.
     */
    self.translateMouseCoords = function(evt) {
        var mapWidth = self.getWidth();
        var mapHeight = self.getHeight();

        var relMouseX = evt.relMouseX;
        var relMouseY = evt.relMouseY;

        if (relMouseX < 0 || relMouseX >= mapWidth ||
            relMouseY < 0 || relMouseY >= mapHeight) {
            return null;   // event is beyond the map boundary
        }
        
        var coords = self.transformPixelCoords(relMouseX - mapWidth/2,
                                               relMouseY - mapHeight/2,
                                               true, true, true);
        var mapCenterSu = self.getVisibleCenter();
        var mapZoom = self.getVisibleZoom();
        var mapCenterPix = CoordUtil.smartUnit2Pixel(mapCenterSu, mapZoom);
        
        var pixCoords = {x: mapCenterPix.x + coords.x,
                         y: mapCenterPix.y - coords.y};
        return CoordUtil.pixel2SmartUnit(pixCoords, mapZoom);
    };
    
    
    /**
     * Starts a logging action.
     *
     * @param   description {string}    the description of the action.
     */
    
    self.startLoggingAction = function(description) {
        mCurrentLoggingStack.push(description);
    };


    /**
     * Ends a logging action.
     */
    
    self.endLoggingAction = function() {
        if (mCurrentLoggingStack.length == 1 && mBulkEvent) {
            // We are about to finish a stack and there is a bulk event that
            // wants to be fired
            // -> This logging action is relevant for this event -> Remember it
            mBulkLoggingArr.push(mCurrentLoggingStack[0]);
        }
        mCurrentLoggingStack.pop();
    };


    /**
     * Returns the current action description.
     *
     * @return  {string}            the current action description.
     */
    
    self.getLoggingInfo = function() {
        if (mFiringBulkEvent && mBulkLoggingArr.length != 0) {
            if (mBulkLoggingArr.length == 1) {
                return mBulkLoggingArr[0];
            } else {
                var bulkDesc = "bulk:[";
                for (var i = 0; i < mBulkLoggingArr.length; i++) {
                    if (i != 0) {
                        bulkDesc += ",";
                    }
                    bulkDesc += mBulkLoggingArr[i];
                }
                bulkDesc += "]";
                return bulkDesc;
            }
        } else if (mCurrentLoggingStack.length != 0) {
            return mCurrentLoggingStack[0];
        } else {
            return null;
        }
    };


    /**
     * Starts the bulk mode. In bulk mode the onViewChanged event will not be
     * fired. This way the map is only refreshed once, when the bulk mode ends.
     *
     * @see #endBulkMode()
     */
    self.startBulkMode = function() {
        if (mInBulkMode) {
            throw new Error("Starting bulk mode failed. The map is already in bulk mode.");
        }
        mInBulkMode = true;
    };


    /**
     * Ends a bulk mode. If the view has to be updated, the onViewChanged event
     * will be fired, including all changes.
     *
     * @see #startBulkMode()
     */
    self.endBulkMode = function() {
        if (! mInBulkMode) {
            throw new Error("Ending bulk mode failed. The map was not in bulk mode.");
        }

        mInBulkMode = false;

        if (mBulkEvent) {
            mFiringBulkEvent = true;
            fireOnViewChanged(mBulkEvent);
            mFiringBulkEvent = false;
            mBulkEvent = null;
            mBulkLoggingArr = [];
        }

        if (mBulkHistoryItem) {
            addToHistory(mBulkHistoryItem.center, mBulkHistoryItem.zoom);
            mBulkHistoryItem = null;
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
     * Adds a map position to the history.
     * <p>
     * If the map is in bulk mode the postion will be added when the bulk mode
     * ends. When the position changes several times during the bulk mode, only
     * the last position will be stored.
     *
     * @param center {Map} the center point to store in the history. May be null.
     * @param zoom {double} the zoom factors to store in the history. May be null.
     */
    var addToHistory = function(center, zoom) {
        if (mInternalHistoryChange) {
          return;
        }

        if (mInBulkMode) {
            if (mBulkHistoryItem == null) {
                mBulkHistoryItem = {};
            }

            if (center != null) {
                mBulkHistoryItem.center = center;
            }
            if (zoom != null) {
                mBulkHistoryItem.zoom = zoom;
            }
        } else {
            var item = { center:(center == null) ? self.getCenter() : center,
                         zoom:  (zoom   == null) ? self.getZoom()   : zoom };

            mHistoryPosition++;

            // Add the item to the history and remove everything after the mHistoryPosition
            mHistory.splice(mHistoryPosition, mHistory.length - mHistoryPosition, item);

            var itemsToRemove = mHistory.length - self.getMaxHistorySize();
            if (itemsToRemove > 0) {
                mHistory.splice(0, itemsToRemove);
                mHistoryPosition -= itemsToRemove;
            }

            fireHistoryChanged();
        }
    };


    /**
     * Sets the map one position back in history.
     */
    self.historyBack = function() {
        historyMove(-1);
    };


    /**
     * Returns whether it is currently possible to move back in history.
     */
    self.hasHistoryBack = function() {
        return mHistoryPosition > 0;
    };


    /**
     * Sets the map one position forward in history.
     */
    self.historyForward = function() {
        historyMove(1);
    };


    /**
     * Returns whether it is currently possible to move forward in history.
     */
    self.hasHistoryForward = function() {
        return mHistoryPosition < mHistory.length - 1;
    };


    /**
     * Moves in the position history.
     *
     * @param delta {int} the number of steps to move
     */
    var historyMove = function(delta) {
        var newHistoryPosition = mHistoryPosition + delta;
        if (newHistoryPosition >= 0 && newHistoryPosition < mHistory.length) {
            mHistoryPosition = newHistoryPosition;
            var item = mHistory[mHistoryPosition];

            var alreadyInBulkMode = mInBulkMode;
            if (! alreadyInBulkMode) {
                self.startBulkMode();
            }

            self.startLoggingAction((delta > 0) ? "mapapi:historyForward" : "mapapi:historyBack");
            mInternalHistoryChange = true;
            try {
                if (item.center != null) {
                    self.setCenter(item.center);
                }
                if (item.zoom != null) {
                    self.setZoom(item.zoom);
                }

                if (! alreadyInBulkMode) {
                    self.endBulkMode();
                }

                fireHistoryChanged();
            } finally {
                self.endLoggingAction();
                mInternalHistoryChange = false;
            }
        }
    };


    /**
     * Fires the historyChanged event.
     */
    var fireHistoryChanged = function() {
        if (self.hasEventListeners("historyChanged")) {
            self.dispatchEvent(new qxp.event.type.Event("historyChanged"));
        };
    };


    /**
     * Fires the onViewChanged event or remembers the change in bulk mode.
     *
     * @param evt The event to fire.
     */
    var fireOnViewChanged = function(evt) {
        if (! mInBulkMode && ! mFiringBulkEvent && self.getUseAutoBulkMode()) {
            self.startBulkMode();
            window.setTimeout(function() {
                self.endBulkMode();
            }, 0)
        }

        if (mInBulkMode) {
            if (mBulkEvent) {
                for (key in evt) {
                    mBulkEvent[key] = evt[key];
                }
            } else {
                mBulkEvent = evt;
            }
        } else {
            // set the logging info
            var loggingInfo = "";
            for (var key in evt) {
                if (loggingInfo.length != 0) {
                    loggingInfo += ",";
                }
                loggingInfo += key;
            }
            var rotationAngle = self.getVisibleRotation();
            if (rotationAngle != mAppliedRotationAngle) {
                if (mAppliedRotationAngle == 0) {
                    self.setRelativeOffset({x:0, y:0});
                }
                mAppliedRotationAngle = rotationAngle;
            }
            self.startLoggingAction("event:" + loggingInfo);
            try {
                // NOTE: We count backwards in order to update top layers first
                for (var i = mLayerArr.length - 1; i >= 0; i--) {
                    if (mLayerArr[i].isEnabled() && mLayerArr[i].isInitialized()) {
                        mLayerArr[i].onViewChanged(evt, true);
                    }
                }
            } finally {
                self.endLoggingAction();
            }
        }
    };


    /**
     * Fires the "newMapSession" event to all registered listeners.
     */
    self.newMapSession = function() {
        if (self.hasEventListeners("newMapSession")) {
            self.dispatchEvent(new qxp.event.type.Event("newMapSession"));
        };
    };


    /**
     * Sets the copyright text (as a key in the server configuration).
     * 
     * @param   key {string}        the key (mapped to a text on the server).
     */
    self.setCopyright = function(key) {
        com.ptvag.webcomponent.map.SERVICE.callAsync(function(result, exc, id) {
            self.removeLayer("copyright");
            var copyrightLayer = new map.layer.TextLayer();
            copyrightLayer.set({ areaLeft:0, areaBottom:0, areaOpacity:0.8 });
            copyrightLayer.setIncludeInPrint(true);
            var copyrightText;
            if (exc != null || result == null || result == "") {
                copyrightText = "Please configure copyright";
            } else {
                copyrightText = result;
            }
            copyrightLayer.setText(copyrightText);
            self.addLayer(copyrightLayer, "copyright", 1, null, false);
        }, "getCopyrightMessage", key);
    };
    
    
    // overridden
    var superDispose = self.dispose;
    self.dispose = function() {
        if (self.getDisposed()) {
            return;
        }

        for (var i = 0; i < mLayerArr.length; i++) {
            mLayerArr[i].dispose();
        }

        mController.dispose();

        mComponentElement = null;
        mZoomBoxElem = null;

        if (mCurrentPrintDiv != null) {
            mCurrentPrintDiv.onclick = null;
            mCurrentPrintDiv = null;
        }
        if (mCurrentPrintContext != null) {
            mCurrentPrintContext.dispose();
        }
        
        superDispose.call(self);
    };

    
    /**
     * Sets the map to print mode.
     * 
     * @param   printParentWindow {var, null} the target window for printing
     *                                      (ignored when
     *                                      <code>printParentDiv</code> is
     *                                      <code>null</code>).
     * @param   printParentDiv {Element, null} an element to put the print-mode
     *                                      map into. If <code>null</code>, the
     *                                      print-mode map is rendered in-place
     *                                      (over the normal map) and can be
     *                                      removed by clicking on it.
     * @param   callback {function, null}   an optional callback function that
     *                                      is called when the map is ready for
     *                                      printing (either in-place or in the
     *                                      specified
     *                                      <code>printParentDiv</code>).
     */
    self.printMode = function(printParentWindow, printParentDiv, callback) {
        self.getAnimator().stopAnimation();
        if (mCurrentPrintDiv != null) {
            if (printParentDiv == null) {
                return;
            }
            mCurrentPrintDiv.onclick();
        }
        var doc = document;
        if (printParentDiv != null) {
            doc = printParentDiv.ownerDocument;
        }
        var win = window;
        if (printParentWindow != null) {
            win = printParentWindow;
        }
        var printWidth = self.getWidth();
        var printHeight = self.getHeight();
        var printWidthPx = printWidth + "px";
        var printHeightPx = printHeight + "px";
        var printDiv = doc.createElement("div");
        printDiv.style.position = "relative";
        printDiv.style.left = "0px";
        printDiv.style.top =
            (printParentDiv != null ? "0px" : "-" + printHeightPx);
        printDiv.style.overflow = "hidden";
        printDiv.style.backgroundColor = "white";
        printDiv.style.width = printWidthPx;
        printDiv.style.height = printHeightPx;
        
        var printHtmlBackground = null;
        //if (qxp.sys.Client.getInstance().isMshtml()) {
        //    printHtmlBackground = doc.createElement("div");
        //    printHtmlBackground.style.position = "absolute";
        //    printHtmlBackground.style.overflow = "hidden";
        //    printHtmlBackground.style.left = "0px";
        //    printHtmlBackground.style.top = "0px";
        //    printHtmlBackground.style.width = printWidthPx;
        //    printHtmlBackground.style.height = printHeightPx;
        //    printHtmlBackground.style.zIndex = -1;
        //    printDiv.appendChild(printHtmlBackground);
        //}
        
        var printImg = doc.createElement("img");
        printImg.style.zIndex = 0;
        printImg.style.visibility = "hidden";
        printImg.style.position = "absolute";
        printImg.style.left = "0px";
        printImg.style.top = "0px";
        printImg.style.width = printWidthPx;
        printImg.style.height = printHeightPx;
        printDiv.appendChild(printImg);

        var printHtmlContainer = doc.createElement("div");
        printHtmlContainer.style.position = "absolute";
        printHtmlContainer.style.overflow = "hidden";
        printHtmlContainer.style.left = "0px";
        printHtmlContainer.style.top = "0px";
        printHtmlContainer.style.width = printWidthPx;
        printHtmlContainer.style.height = printHeightPx;
        printHtmlContainer.style.display = "none";
        printDiv.appendChild(printHtmlContainer);

        var loadingIndicator = doc.createElement("img");
        loadingIndicator.style.position = "absolute";
        loadingIndicator.style.left = Math.round((printWidth - 31)/2) + "px";
        loadingIndicator.style.top = Math.round((printHeight - 31)/2) + "px";
        loadingIndicator.style.width = "31px";
        loadingIndicator.style.height = "31px";
        loadingIndicator.src = rewriteURL("img/com/ptvag/webcomponent/map/ajax-loader.gif");
        printDiv.appendChild(loadingIndicator);
        
        if (printParentDiv == null) {
            mComponentElement.style.visibility = "hidden";
            mComponentElement.parentNode.appendChild(printDiv);
            printDiv.onclick = function() {
                ctx.dispose();
                mComponentElement.style.visibility = "";
                printDiv.parentNode.removeChild(printDiv);
                printDiv.onclick = null;
                mCurrentPrintDiv = null;
            };
            mCurrentPrintDiv = printDiv;
        } else {
            printParentDiv.style.width = printWidthPx;
            printParentDiv.style.height = printHeightPx;
            //printParentDiv.style.backgroundColor = "gray";
            while (printParentDiv.firstChild) {
                printParentDiv.removeChild(printParentDiv.firstChild);
            }
            printParentDiv.appendChild(printDiv);
        }
        
        if (mCurrentPrintContext != null) {
            mCurrentPrintContext.dispose();
        }
        if (self.getPrintSystem() == "flash") {
            mCurrentPrintContext = new com.ptvag.webcomponent.map.FlashPrintContext(self);
        } else {
            mCurrentPrintContext = new com.ptvag.webcomponent.map.PrintContext(self);
        }
        var ctx = mCurrentPrintContext;
        
        var layerCount = mLayerArr.length;
        if (layerCount > 0) {
            ctx._ptv_map_currentLayer = 0;
            //mLayerArr[ctx._ptv_map_currentLayer].print(
            //    ctx, printHtmlContainer, printHtmlBackground);
            //++ctx._ptv_map_currentLayer;
            // don't print a layer immediately to give vector elements a chance
            // to render (and be included in print correctly)
            var interval = window.setInterval(function() {
                if (!map.ImageLoader.isIdle()) {
                    //self.info("Not idle");
                    return;
                }
                if (self.getDisposed() || ctx.getDisposed()) {
                    window.clearInterval(interval);
                    return;
                }
                while (ctx._ptv_map_currentLayer < layerCount) {
                    var layerToPrint = mLayerArr[ctx._ptv_map_currentLayer++];
                    if (layerToPrint && !layerToPrint.getDisposed()) {
                        layerToPrint.print(
                            ctx, printHtmlContainer, printHtmlBackground);
                    }
                    //self.info(ctx._ptv_map_currentLayer + "/" + layerCount);
                    if (ctx._ptv_map_currentLayer >= layerCount) {
                        //self.info("end");
                        ctx.end();
                    } else {
                        //self.info("test: " + ctx._ptv_map_currentLayer);
                    }
                }
                if (ctx._ptv_map_currentLayer >= layerCount &&
                    ctx.isIdle()) {
                    window.clearInterval(interval);
                    loadingIndicator.parentNode.removeChild(loadingIndicator);
                    if (ctx.getDisposed()) {
                        if (callback != null) {
                            callback(printParentWindow, new Error("Generation of print version interrupted"));
                        }
                    } else {
                        var exc = ctx.getError();
                        if (exc == null) {
                            printImgURL = ctx.getPrintImageURL();
                        } else {
                            var printImgURL = rewriteURL("img/com/ptvag/webcomponent/map/error.png", true);
                        }
                        ctx.dispose();
                        mCurrentPrintContext = null;
                        map.ImageLoader.loadImage(printImg, printImgURL, function() {
                            printImg.style.visibility = "";
                            printHtmlContainer.style.display = "";
                            if (callback != null) {
                                callback(printParentWindow, exc);
                            }
                        });
                    }
                }
            }, 100);
        }
        
    };
    
    
    /**
     * Returns whether printing via Flash is possible (which depends on the
     * installed Flash version - in the current implementation, Flash 9 is
     * required).
     * 
     * @return {boolean}    whether printing via Flash is possible.
     */
    self.isFlashPrintingPossible = function() {
        return com.ptvag.webcomponent.util.Flash.detectFlashVer(9, 0, 0);
    };
    
    
    /**
     * Returns the map version to use for image requests.
     * 
     * @return  {string}    the map version (which may be <code>null</code>)
     *                      or <code>undefined</code> if the version has not
     *                      yet been returned from the server. In this case,
     *                      you should register a listener for the
     *                      <code>mapVersion</code> event to be notified when
     *                      the version is known.
     */
    self.getMapVersion = function() {
        return mMapVersion;
    };
    
    
    /**
     * Initializes the component.
     */
    var init = function() {
        var actualStartRect = startRect;
        if (actualStartRect == null) {
            actualStartRect = {left:4293961, top:5679567,
                               right:4502808, bottom:5400533};
        }
        var smartWrap = CoordUtil.SMART_OFFSET/CoordUtil.SMART_UNIT*2;
        self.setClipRect(0, smartWrap, smartWrap, smartWrap/4);

        // store the map version to use in requests
        if (!map.Map.SETTINGS_OK) {
            alert("Server-side settings not applied! Please check the scripts.");
        }
        if (useVersionedRequests == null || useVersionedRequests == true) {
            mMapVersion = map.Map.MAP_VERSION;
        }

        //self.info("server URL:" + qxp.io.remote.Rpc.makeServerURL());
        var mapService = new map.Rpc(self, qxp.io.remote.Rpc.makeServerURL(),
            "com.ptvag.webcomponent.map.MapService");
        if (window.location.href.indexOf(qxp.core.ServerSettings.serverPathPrefix) != 0) {
            mapService.setCrossDomain(true);
        }
        map.SERVICE = mapService;

        self.startLoggingAction(map.Map.MARK_FIRST_SESSION ? "mapapi:session" :
                                                             "mapapi:init");

        try {
            parentElement.innerHTML =
                '<div style="width:100%; height:100%; position:relative; overflow:hidden">' +
                '<div style="width:100%; height:100%; position:absolute; left:0px; top:0px"></div>' +
                '</div>';
            mComponentElement = parentElement.getElementsByTagName("div")[0];
            mRelativeLayersElement = mComponentElement.getElementsByTagName("div")[0];
    
            if (mTileDebugMode) {
                mComponentElement.innerHTML = '<div style="position:absolute; left:100px; top:100px; width:200px; height:200px ">'
                  + '<div style="position:relative; width:100%; height:100%">'
                  + '<div style="position:absolute; left:0px; top:0px; width:100%; height:100%; border:1px solid black; z-index:10000"></div>'
                  + '</div></div>';
    
                mComponentElement = mComponentElement.firstChild.firstChild;
    
                CoordUtil.TILE_WIDTH = 45;
            }
    
            self.setAnimator(new map.animator.AcceleratingAnimator());
            self.updateSize();
            self.setProfileGroup(profileGroup == null ? null : profileGroup);
                // the above expression is not redundant
                // (converts undefined to null because undefined == null)
    
            if (map.Map.MOBILE_TOUCH) {
                mController = new map.MapMobileController(self, mComponentElement);
            } else {
                mController = new map.MapController(self, mComponentElement);
                mController.addEventListener("changeActionMode", applyConfigurableCursor);
            }
    
            self.setRect(actualStartRect.left, actualStartRect.top,
                         actualStartRect.right, actualStartRect.bottom);
            self.setResetRect(self.getRect());
                // may be different from the start rect because of rounding
                // issues, so read it again (we set it using rounding with the
                // reset button, so it's important to get the exact values)

            var alphaImgExt = qxp.sys.Client.getInstance().isMshtml() ? "_noalpha.gif" : ".png";

            var coursegrainedBuilder = new map.RequestBuilder(self, true);
            coursegrainedBuilder.setGrainSize(4);
            coursegrainedBuilder.setVisible("Town", false);
            var coursegrainedLayer = new map.layer.StretchedMapLayer(coursegrainedBuilder);
            if (!mTileDebugMode) {
                coursegrainedLayer.set({ isRelative:true, needsOpacityHack:true });
            }
            coursegrainedLayer.setEnabled(false);
            self.addLayer(coursegrainedLayer, "coursegrained");
            
            var backgroundBuilder = new map.RequestBuilder(self, true);
            backgroundBuilder.setVisible("Town", false);
            var backgroundLayer = new map.layer.TileMapLayer(backgroundBuilder);
            if (!mTileDebugMode) {
                backgroundLayer.set({ isRelative:true, needsOpacityHack:true });
            }
            backgroundLayer.setIncludeInPrint(true);
            self.addLayer(backgroundLayer, "background");
            
            var satBuilder = new map.RequestBuilder(self, true);
            satBuilder.setSat(true);
            satBuilder.setVisible("Town", false);
            var satLayer = new map.layer.TileMapLayer(satBuilder);
            if (!mTileDebugMode) {
                satLayer.set({ isRelative:true, needsOpacityHack:true });
            }
            satLayer.setEnabled(false);
            self.addLayer(satLayer, "sat");
            satLayer.addEventListener('changeEnabled', function(evt) {
               coursegrainedBuilder.setSat(evt.getData());
            });

            var labelBuilder = new map.RequestBuilder(self, false);
            labelBuilder.setVisible("Town", true);
            labelBuilder.setTransparent(true);
            var labelLayer = new map.layer.SimpleMapLayer(labelBuilder);
            if (!mTileDebugMode) {
                labelLayer.set({ isRelative:true, needsOpacityHack:true });
            }
            labelLayer.setIncludeInPrint(true);
            labelLayer.setAutoRotate(false);
            self.addLayer(labelLayer, "label");

            var floaterLayer = new map.layer.Layer();
            if (!mTileDebugMode) {
                floaterLayer.set({ isRelative:true });
            }
            var vectorLayer = new map.layer.VectorLayer(floaterLayer);
            if (!mTileDebugMode) {
                vectorLayer.set({ isRelative:true });
            }
            vectorLayer.setIncludeInPrint(true);
            self.addLayer(vectorLayer, "vector");
            mServerDrawnObjectManager = new map.ServerDrawnObjectManager(labelBuilder, vectorLayer);

            //var overviewLayer = new map.layer.TileMapLayer("bg", backgroundBuilder);
            var overviewBuilder = new map.RequestBuilder(self, true);
            overviewBuilder.setVisible("Town", true); // avoid caching and provide custom params
            var overviewLayer = new map.layer.SimpleMapLayer(overviewBuilder);
            overviewLayer.set({ enabled:false, areaLeft:10, areaBottom:20,
                                areaWidth:0.4, areaWidthIsRelative:true,
                                areaHeight:0.375, areaHeightIsRelative:true,
                                areaTop:null, areaRight:null,
                                areaBorderWidth:1, overlayOpacity:0.2,
                                borderWidth:21, zoomDifference:5,
                                useZoomTransparency:false,
                                swallowHoverEvents:true,
                                swallowClickEvents:true });
            overviewLayer.setIncludeInPrint(true);
            overviewLayer.setAutoRotate(false);
            self.addLayer(overviewLayer, "overview", 1);

            self.addLayer(floaterLayer, "floater");

            var imgPrefix = "img/com/ptvag/webcomponent/map/";

            var imgLayer = new map.layer.ImageLayer(rewriteURL(imgPrefix + "compass_rose_2" + alphaImgExt, true));
            imgLayer.set({ areaRight:10, areaTop:10 });
            imgLayer.setAutoRotate(true);
            self.addLayer(imgLayer, "compass", 1, null, false);

            var posLayer = new map.layer.PositionInfoLayer();
            posLayer.set({ enabled:false, areaLeft:10, areaRight:10, areaTop:40, areaHeight:10 });
            self.addLayer(posLayer, "position", 1);

            if (map.Map.USE_DEBUG_LAYER) {
                var debugLayer = new map.layer.DebugLayer();
                debugLayer.set({ enabled:false, areaLeft:10, areaRight:30, areaBottom:35 });
                self.addLayer(debugLayer, "debug", 1);
            }

            /*
            var copyrightLayer = new map.layer.LabelLayer();
            copyrightLayer.set({ areaLeft:0, areaBottom:0 });
            self.addLayer(copyrightLayer, "copyright", 1);
            com.ptvag.webcomponent.map.SERVICE.callAsync(function(result, exc, id) {
                if (exc != null) {
                    self.error("Getting copyright message failed", exc);
                } else {
                    copyrightLayer.setText('<div style="margin-left:4px;margin-right:4px;margin-top:1px;margin-bottom:1px">' +
                        result + '</div>');
                }
            }, "getCopyrightMessage");
            */

            self.setCopyright(null);

            var scaleLayer = new map.layer.ScaleLayer;
            scaleLayer.set({ areaRight:0, areaBottom:0 });
            scaleLayer.setIncludeInPrint(true);
            self.addLayer(scaleLayer, "scale", 1, null, false);

            if (map.Map.USE_ZOOM_SLIDER) {
                var sliderLayer = new map.layer.ZoomSliderLayer;
                //sliderLayer.set({ areaRight:7, areaTop:60, areaHeight:100 });
                sliderLayer.set({ areaRight:7, areaTop:60, areaBottom:10 + scaleLayer.getComputedAreaHeight() });
                self.addLayer(sliderLayer, "zoomslider", 1, null, false);
            }

            if (map.Map.USE_TOOLBAR) {
                var toolbarLayer = new map.layer.DefaultToolbarLayer;
                toolbarLayer.set({ areaLeft:10, areaTop:10 });
                self.addLayer(toolbarLayer, "toolbar", 1, null, false);
            }
            
            self.setConfigurableCursor("default");

            // for backwards compatibility: send the mapVersion event
            self.createDispatchDataEvent("mapVersion", mMapVersion);
        } finally {
            self.endLoggingAction();
        }
    }

    init();
});


/** Used internally. */
qxp.Class.OPACITY_HACK_SIZE = (qxp.sys.Client.getInstance().isMshtml() && qxp.sys.Client.getInstance().getMajor() < 9 ? 2000 : 1000000);

/** Used internally. */
qxp.Class.MARK_FIRST_SESSION = true;

/**
 * Can be used to globally disable image caching.
 * You should only change this value for debugging or benchmarking purposes.
 */
qxp.Class.ENABLE_CACHING = true;

/** The server for static (= cachable) resources. */
qxp.Class.STATIC_SERVER = null;
    // This value is automatically set using server-side configuration.
    // DO NOT set it to anything other than null in this source file!
    // (But you can change the value in JavaScript code that runs after
    // the map scripts have been loaded.)

/** The map version (appended to map requests). */
qxp.Class.MAP_VERSION = null;
    // This value is automatically set using server-side configuration.
    // DO NOT set it to anything other than null in this source file!
    // (But you can change the value in JavaScript code that runs after
    // the map scripts have been loaded.)

/**
 * Whether to create a debug layer by default. Even if this layer is
 * <em>created</em>, it's not <em>enabled</em> by default.
 */
qxp.Class.USE_DEBUG_LAYER = true;

/** Whether to create and enable a toolbar layer by default. */
qxp.Class.USE_TOOLBAR = true;

/** Whether to create and enable a zoom slider layer by default. */
qxp.Class.USE_ZOOM_SLIDER = true;

/**
 * Whether (multi-)touch event for mobile browsers should be used. By default,
 * this is enabled in Mobile Safari and Android browsers.
 */
qxp.Class.MOBILE_TOUCH = /Apple.*Mobile/.test(navigator.userAgent) ||
                         /Android/.test(navigator.userAgent);


/** Whether mouse wheel zoom is allowed. */
qxp.OO.addProperty({ name:"allowMouseWheelZoom", type:qxp.constant.Type.BOOLEAN, allowNull:false, defaultValue:true });

/** Whether double click zoom is allowed. */
qxp.OO.addProperty({ name:"allowDoubleClickZoom", type:qxp.constant.Type.BOOLEAN, allowNull:false, defaultValue:true });

/** Whether double right click zoom is allowed (for zooming out). */
qxp.OO.addProperty({ name:"allowDoubleRightClickZoom", type:qxp.constant.Type.BOOLEAN, allowNull:false, defaultValue:true });

/**
 * Maximum delay in milliseconds between clicks for detecting a double right
 * click.
 */
qxp.OO.addProperty({ name:"doubleRightClickDelay", type:qxp.constant.Type.NUMBER, allowNull:false, defaultValue:400 });

/** Whether the automatic bulk mode should be used. */
qxp.OO.addProperty({ name:"useAutoBulkMode", type:qxp.constant.Type.BOOLEAN, allowNull:false, defaultValue:true });

/**
 * The width of the map in pixels.
 *
 * @see #updateSize()
 */
qxp.OO.addProperty({ name:"width", type:qxp.constant.Type.NUMBER, allowNull:false });

/**
 * The height of the map in pixels.
 *
 * @see #updateSize()
 */
qxp.OO.addProperty({ name:"height", type:qxp.constant.Type.NUMBER, allowNull:false });

/**
 * The target center of the map as point (a map with properties "x" and "y")
 * in smart units.
 */
qxp.OO.addProperty({ name:"center", type:qxp.constant.Type.OBJECT });

/**
 * Specifies whether the center is currently adjusting and therefore changed a
 * lot (e.g. during panning).
 * <p>
 * If set to true, the "adjustingCenterFinished" event is not fired when center
 * is changed (as usual), but it is fired when "centerIsAdjusting" is set back
 * to false.
 * <p>
 * Everyone who sets this property to true must set it back to false, when he's
 * done adjusting the center.
 */
qxp.OO.addProperty({ name:"centerIsAdjusting", type:qxp.constant.Type.BOOLEAN, allowNull:false, defaultValue:false });

/** The target zoom level. */
qxp.OO.addProperty({ name:"zoom", type:qxp.constant.Type.NUMBER, allowNull:false });

/**
 * The target rotation angle of the map (in degrees). If the browser doesn't
 * support affine transforms (which you can check using
 * {@link com.ptvag.webcomponent.map.MapUtil#areAffineTransformsSupported}),
 * setting this property has no effect.
 */
qxp.OO.addProperty({ name:"rotation", type:qxp.constant.Type.NUMBER, allowNull:false, defaultValue:0 });

/**
 * The currently visible center of the map as point (a map with properties "x" and "y")
 * in pixels in the current zoom level (differs from {@link #center} during animation).
 */
qxp.OO.addProperty({ name:"visibleCenter", type:qxp.constant.Type.OBJECT });

/** The currently visible zoom level (differs from {@link #zoom} during animation). */
qxp.OO.addProperty({ name:"visibleZoom", type:qxp.constant.Type.NUMBER, allowNull:false });

/**
 * The visible rotation angle of the map (in degrees). If the browser doesn't
 * support affine transforms (which you can check using
 * {@link com.ptvag.webcomponent.map.MapUtil#areAffineTransformsSupported}),
 * setting this property has no effect.
 */
qxp.OO.addProperty({ name:"visibleRotation", type:qxp.constant.Type.NUMBER, allowNull:false, defaultValue:0 });

/**
 * Whether the wheel zoom should be inverted. If true, the map is coming nearer
 * when scrolling down (zoom-in), rather than the user is moving away from the
 * map (zoom-out).
 */
qxp.OO.addProperty({ name:"inverseWheelZoom", type:qxp.constant.Type.BOOLEAN, allowNull:false, defaultValue:false });

/** The {@link com.ptvag.webcomponent.map.animator.Animator Animator} to use for animations.  */
qxp.OO.addProperty({ name:"animator", type:qxp.constant.Type.OBJECT, allowNull:false });

/** Whether changes of center or zoom should be animated. */
qxp.OO.addProperty({ name:"animate", type:qxp.constant.Type.BOOLEAN, allowNull:false, defaultValue:true });

/** The color of the filling of the box shown when the user does a rect zoom. */
qxp.OO.addProperty({ name:"zoomBoxColor", type:qxp.constant.Type.STRING, allowNull:false, defaultValue:"#dddddd" });

/** The opacity of the box shown when the user does a rect zoom. */
qxp.OO.addProperty({ name:"zoomBoxOpacity", type:qxp.constant.Type.NUMBER, allowNull:false, defaultValue:0.5 });

/** The color of the border of the box shown when the user does a rect zoom. */
qxp.OO.addProperty({ name:"zoomBoxBorderColor", type:qxp.constant.Type.STRING, allowNull:false, defaultValue:"blue" });

/** The width of the border of the box shown when the user does a rect zoom (in pixels). */
qxp.OO.addProperty({ name:"zoomBoxBorderWidth", type:qxp.constant.Type.NUMBER, allowNull: false, defaultValue: 2 });

/**
 * The number of pixels that have to stay visible when a clip rect is set.
 * The movement will be blocked, when less pixels would be visible.
 */
qxp.OO.addProperty({ name:"clipMoveBorder", type:qxp.constant.Type.NUMBER, defaultValue:40 });

/**
 * The border {@link #setViewToPoints} should keep between the shown points and
 * the map border (in pixels).
 */
qxp.OO.addProperty({ name:"viewToPointsBorder", type:qxp.constant.Type.NUMBER, allowNull:false, defaultValue:40 });

/** The minimum zoom level {@link #setViewToPoints} should use. */
qxp.OO.addProperty({ name:"viewToPointsMinZoomLevel", type:qxp.constant.Type.NUMBER, allowNull:false, defaultValue:3 });

/** The maximum size of the history. */
qxp.OO.addProperty({ name:"maxHistorySize", type:qxp.constant.Type.NUMBER, allowNull:false, defaultValue:50 });

/**
 * The rectangle to which the reset button resets the map (defaults to the
 * initial map rect). This value must be a JavaScript object with left, right,
 * top, and bottom properties (in smart units).
 */
qxp.OO.addProperty({ name:"resetRect", type:qxp.constant.Type.OBJECT });

/** Used internally. */
qxp.OO.addProperty({ name:"relativeOffset", type:qxp.constant.Type.OBJECT, defaultValue:{x:0, y:0} });

/**
 * The profile group to use for map requests. This way, the same
 * AjaxMaps server can support different xMap profiles (depending
 * on what the client requests). If <code>null</code>, the default
 * profiles are used.
 */
qxp.OO.addProperty({ name:"profileGroup", type:qxp.constant.Type.STRING, defaultValue: null });

/**
 * The xMap backend server to use for map requests. This way, the same
 * AjaxMaps server can support different xMap servers (depending
 * on what the client requests). If <code>null</code>, the default
 * server is used.
 * <p>
 * Please note that this is not a URL! This is merely a symbolic name
 * that is evaluated on the AjaxMaps server and must be mapped to an
 * actual xMap server URL there.
 * </p>
 */
qxp.OO.addProperty({ name:"backendServer", type:qxp.constant.Type.STRING, defaultValue: null });

/**
 * Controls the print mechanism that should be used. Currently, there are two
 * options:
 * <ol>
 *     <li><strong>server</strong> - generates map images suitable for printing
 *     via the AjaxMaps server. Pro: Requires no browser plugin. Cons: Can be
 *     slow (depending on the network connection); cannot print ImageMarkers
 *     if the images come from domains other than the AjaxMaps server (there
 *     are exceptions if both the AjaxMaps server and the server hosting the
 *     images are on the same network - please refer to the server-side
 *     documentation for more details).</li>
 *     <li><strong>flash</strong> - generates map images suitable for printing
 *     via a small Flash application. Pros: Can be faster than the server-side
 *     generation; can print ImageMarkers from arbitrary domains (provided a
 *     suitable crossdomain.xml is present - please refer to Adobe Flash/Flex
 *     documentation for more details). Con: Requires an installed Flash
 *     plugin.</li>
 * </ol>
 * Before using the Flash option, you should call
 * {@link #isFlashPrintingPossible isFlashPrintingPossible} to find out if a
 * suitable Flash plugin version is available in the browser.
 */
qxp.OO.addProperty({ name:"printSystem", type:qxp.constant.Type.STRING,
    possibleValues:["server", "flash"], defaultValue:"server", allowNull:false });


/** The decimal separator to use when formatting numbers. */
qxp.OO.addProperty({ name:"decimalSeparator", type:qxp.constant.Type.STRING,
    defaultValue:".", allowNull:false });

/** Whether to use miles for labeling distances. */
qxp.OO.addProperty({ name:"useMiles", type:qxp.constant.Type.BOOLEAN, allowNull:false, defaultValue:false });

/** The cursor for move mode (mouse button not pressed). */
qxp.OO.addProperty({ name:"moveCursor", type:qxp.constant.Type.STRING, allowNull:false, defaultValue:"" });

/** The cursor for move mode (mouse button pressed). */
qxp.OO.addProperty({ name:"moveCursorActive", type:qxp.constant.Type.STRING, allowNull:false, defaultValue:"move" });

/** The cursor for zoom mode (mouse button not pressed). */
qxp.OO.addProperty({ name:"zoomCursor", type:qxp.constant.Type.STRING, allowNull:false, defaultValue:"" });

/** The cursor for zoom mode (mouse button pressed). */
qxp.OO.addProperty({ name:"zoomCursorActive", type:qxp.constant.Type.STRING, allowNull:false, defaultValue:"crosshair" });

/** Whether keyboard controls for the map should be active. */
qxp.OO.addProperty({ name:"enableKeyboardControl", getAlias:"enableKeyboardControl", type:qxp.constant.Type.BOOLEAN, allowNull:false, defaultValue:false });

/**
 * Whether to enable map rotation via keyboard (only relevant if
 * {@link #enableKeyboardControl enabledKeyboardControl} is set to
 * <code>true</code>).
 */
qxp.OO.addProperty({ name:"enableKeyboardRotation", getAlias:"enableKeyboardRotation", type:qxp.constant.Type.BOOLEAN, allowNull:false, defaultValue:false });


// Turn logging off, by default
qxp.dev.log.Logger.ROOT_LOGGER.setMinLevel(qxp.dev.log.Logger.LEVEL_OFF);
