/**
 * A layer showing a scale.
 */
qxp.OO.defineClass("com.ptvag.webcomponent.map.layer.ScaleLayer",
com.ptvag.webcomponent.map.layer.AbstractStaticAreaLayer,
function() {
    com.ptvag.webcomponent.map.layer.AbstractStaticAreaLayer.call(this);

    var self = this;
    var map = com.ptvag.webcomponent.map;

    var mScaleImgElem;
    var mScaleLabelElem;
    var mUpdateTimer = null;


    // overridden
    var superInit = self.init;
    self.init = function() {
        superInit.apply(self, arguments);
        
        // Create the main div
        var areaElem = document.createElement("div");
        areaElem.style.position = "absolute";
        areaElem.style.left = "0px";
        areaElem.style.top = "0px";
        areaElem.style.border = self.getAreaBorderWidth() + "px solid #808080";
        areaElem.style.backgroundColor = "white";
        areaElem._ptv_map_printBackground = true;
        self.getParentElement().appendChild(areaElem);

        mScaleImgElem = document.createElement("img");
        mScaleImgElem.style.position = "absolute";
        areaElem.appendChild(mScaleImgElem);

        mScaleLabelElem = document.createElement("div");
        mScaleLabelElem.style.position = "absolute";
        mScaleLabelElem.style.fontFamily = "Verdana,Arial,sans-serif";
        mScaleLabelElem.style.fontSize = "10px";
        mScaleLabelElem.style.whiteSpace = "nowrap";
        mScaleLabelElem.innerHTML = "&#160;";
        areaElem.appendChild(mScaleLabelElem);

        self.setAreaElement(areaElem);

        if (self.isEnabled()) {
            updateScale();
        }

        var map = self.getMap();
        map.addEventListener("changeUseMiles", self._modifyScale);
        map.addEventListener("changeVisibleZoom", self._modifyScale);
        map.addEventListener("changeVisibleCenter", self._modifyScale);
        map.addEventListener("changeCenterIsAdjusting", self._modifyScale);
    };


    // property modifier
    self._modifyScale = function() {
        if (mScaleImgElem && !self.getMap().getCenterIsAdjusting() &&
            !mUpdateTimer) {
            // We are already initialized -> update the scale
            mUpdateTimer = window.setTimeout(updateScale, 0);
        }
    };


    // property modifier
    self._modifyUseMiles = function(propValue) {
        self.getMap().setUseMiles(propValue);
    };


    var updateScale = function() {
        mUpdateTimer = null;

        var useSimpleScale = self.getUseSimpleScale();

        var spacing = self.getSpacing();
        var areaBorderWidth = self.getAreaBorderWidth();
        var scaleBorderWidth = self.getScaleBorderWidth();
        var scaleHeight = self.getScaleHeight();
        var scaleMaxWidth = self.getScaleMaxWidth();

        // get the scaleMaxWidth in meters
        var zoom = self.getMap().getVisibleZoom();
        var scaleMaxWidthSu = scaleMaxWidth * map.CoordUtil.getSmartUnitsPerPixel(zoom);
        var suPoint1 = self.getMap().getVisibleCenter();
        var suPoint2 = { x:suPoint1.x + scaleMaxWidthSu, y:suPoint1.y };
        var scaleMaxWidthMeter = map.CoordUtil.distanceOfSmartUnitPoints(suPoint1, suPoint2);

        // Translate the max width in the unit to be shown
        if (self.getMap().getUseMiles()) {
            // Transform to miles
            var scaleMaxWidthUnit = scaleMaxWidthMeter / 1609.344;
            var unitName = "mi";
            if (scaleMaxWidthUnit < 1) {
                scaleMaxWidthUnit = scaleMaxWidthMeter / 0.9144;
                unitName = "yd";
            }
        } else {
            if (scaleMaxWidthMeter >= 1000) {
                scaleMaxWidthUnit = scaleMaxWidthMeter / 1000;
                unitName = "km";
            } else {
                scaleMaxWidthUnit = scaleMaxWidthMeter;
                unitName = "m";
            }
        }

        // Get a scaleWidth that has a human friendly width (e.g. 2km or 500m)
        var exp = Math.floor(Math.log(scaleMaxWidthUnit) / Math.LN10);
        var factor = Math.pow(10, exp);
        var mantisse = scaleMaxWidthUnit / factor;
        if (mantisse >= 5) {
            var base = 5;
        } else if (mantisse >= 2) {
            base = 2;
        } else {
            base = 1;
        }
        // NOTE: Normally "base * factor" should already be an integer, but to
        //       avoid problems with rounding, we have to round it.
        var scaleWidthUnit = Math.round(base * factor);

        // Update the UI
        var scaleWidth = Math.round(scaleMaxWidth * (scaleWidthUnit / scaleMaxWidthUnit));
        var borderStyle = scaleBorderWidth + "px solid #808080";
        mScaleImgElem.style.borderLeft   = borderStyle;
        mScaleImgElem.style.borderRight  = borderStyle;
        if (useSimpleScale) {
            var imgUrl = map.MapUtil.rewriteURL("img/com/ptvag/webcomponent/map/scale_simple.gif", true);
            mScaleImgElem.style.borderTop    = "";
            mScaleImgElem.style.borderBottom = "";
            mScaleImgElem.style.height = (scaleHeight + 2 * scaleBorderWidth) + "px";
        } else {
            imgUrl = map.MapUtil.rewriteURL("img/com/ptvag/webcomponent/map/scale_base_" + base + ".gif", true);
            mScaleImgElem.style.borderTop    = borderStyle;
            mScaleImgElem.style.borderBottom = borderStyle;
            mScaleImgElem.style.height = scaleHeight + "px";
        }

        // NOTE: Box sizing has not to be considered, because it's allways off for img elements
        mScaleImgElem.style.width  = scaleWidth  + "px";
        mScaleImgElem.style.top  = spacing + "px";
        mScaleImgElem.style.left = spacing + "px";
        map.MapUtil.setImageSource(mScaleImgElem, imgUrl);

        mScaleLabelElem.style.top  = parseInt((2 * (spacing + scaleBorderWidth) + scaleHeight - 10)/2) - 2 + "px";
        mScaleLabelElem.style.left = 2 * spacing + scaleWidth + "px";
        
        var areaElement = self.getAreaElement();
        var oldWidth = areaElement.style.width;
        areaElement.style.width = "100%";
        // The above is necessary for Opera to correctly update the offsetWidth
        // of the label (which is not done when it's outside the horizontal
        // bounds of its parent element).
        mScaleLabelElem.firstChild.nodeValue = "\xa0" + scaleWidthUnit + " " + unitName;

        self.setAreaWidth(2 * areaBorderWidth + 3 * spacing + scaleWidth + mScaleLabelElem.offsetWidth);
        if (areaElement.style.width == "100%") {
            // there has been no update because the property value didn't change
            areaElement.style.width = oldWidth;
        }
        self.setAreaHeight(2 * areaBorderWidth + 2 * scaleBorderWidth + 2 * spacing + scaleHeight);
        self.positionArea();
    };


    // overridden
    self.doPrintStaticArea = function(ctx, htmlContainer, htmlBackground) {
        var areaBorderWidth = self.getAreaBorderWidth();
        var scaleBorderWidth = self.getScaleBorderWidth();
        var scaleHeight = self.getScaleHeight();
        var left = self.getComputedAreaLeft();
        var top = self.getComputedAreaTop();
        var width = self.getComputedAreaWidth();
        var height = self.getComputedAreaHeight();
        var spacing = self.getSpacing();
        var scaleWidth = parseInt(mScaleImgElem.style.width);
        var imgWidth = 8;
        var imgHeight = 8;
        var topBottomBorders = false;
        if (mScaleImgElem.src.indexOf("/scale_base_") != -1) {
            topBottomBorders = true;
            imgWidth = 50;
            imgHeight = 1;
            if (mScaleImgElem.src.indexOf("/scale_base_2.gif") != -1) {
                imgWidth = 40;
            }
        }
        ctx.strokeStyle = "rgb(128, 128, 128)";
        ctx.lineWidth = areaBorderWidth;
        ctx.fillStyle = "rgb(255, 255, 255)";
        ctx.beginPath();
        ctx.rect(left, top, width, height);
        ctx.fill();
        ctx.beginPath();
        ctx.rect(parseInt(left + areaBorderWidth/2), parseInt(top + areaBorderWidth/2),
                 width - areaBorderWidth, height - areaBorderWidth);
        ctx.stroke();
        ctx.lineWidth = scaleBorderWidth;
        ctx.lineCap = "butt";
        ctx.lineJoin = "miter";
        var lineTop = top + areaBorderWidth + spacing;
        var lineBottom = lineTop + scaleBorderWidth*2 + scaleHeight;
        var lineLeft = left + areaBorderWidth + spacing + scaleBorderWidth/2;
        ctx.drawImage(mScaleImgElem, 0, 0, imgWidth, imgHeight,
            lineLeft + scaleBorderWidth/2, lineTop + scaleBorderWidth,
            scaleWidth, scaleHeight);
        ctx.moveTo(parseInt(lineLeft), lineTop);
        ctx.lineTo(parseInt(lineLeft), lineBottom);
        var lineLeft2 = lineLeft + scaleBorderWidth + scaleWidth;
        ctx.moveTo(parseInt(lineLeft2), lineTop);
        ctx.lineTo(parseInt(lineLeft2), lineBottom);
        if (topBottomBorders) {
            ctx.moveTo(lineLeft + scaleBorderWidth/2, parseInt(lineTop + scaleBorderWidth/2));
            ctx.lineTo(lineLeft2 - scaleBorderWidth/2, parseInt(lineTop + scaleBorderWidth/2));
            ctx.moveTo(lineLeft + scaleBorderWidth/2, parseInt(lineBottom - scaleBorderWidth/2));
            ctx.lineTo(lineLeft2 - scaleBorderWidth/2, parseInt(lineBottom - scaleBorderWidth/2));
        }
        ctx.stroke();
        ctx.strokeStyle = "rgb(0, 0, 0)";
        ctx.fontFamily = "sans-serif";
        ctx.fontStyle = "plain";
        ctx.fontSize = 10;
        ctx.textAlignment = 17;
        ctx.drawText(" " + mScaleLabelElem.firstChild.nodeValue.substring(1),
            left + areaBorderWidth + 2*(spacing + scaleBorderWidth) + scaleWidth,
            top + areaBorderWidth + parseInt((2 * (spacing + scaleBorderWidth) + scaleHeight - 10)/2) - 1);
    };


    // overridden
    var superDispose = self.dispose;
    self.dispose = function() {
        if (self.getDisposed()) {
            return;
        }

        if (mUpdateTimer != null) {
            window.clearTimeout(mUpdateTimer);
            mUpdateTimer = null;
        }

        var map = self.getMap();
        map.removeEventListener("changeUseMiles", self._modifyScale);
        map.removeEventListener("changeVisibleZoom", self._modifyScale);
        map.removeEventListener("changeVisibleCenter", self._modifyScale);
        map.removeEventListener("changeCenterIsAdjusting", self._modifyScale);

        mScaleImgElem = null;
        mScaleLabelElem = null;

        superDispose.call(self);
    };

});

// overridden
qxp.OO.changeProperty({ name:"areaOpacity", type:qxp.constant.Type.NUMBER, defaultValue:0.8 });

// overridden
qxp.OO.changeProperty({ name:"areaBorderWidth", type:qxp.constant.Type.NUMBER, defaultValue:1 });

/** The width of the border drawn around the scale. */
qxp.OO.addProperty({ name:"scaleBorderWidth", impl:"scale", type:qxp.constant.Type.NUMBER, allowNull:false, defaultValue:1 });

/** The desired height of the scale. */
qxp.OO.addProperty({ name:"scaleHeight", impl:"scale", type:qxp.constant.Type.NUMBER, allowNull:false, defaultValue:6 });

/**
 * The maximum width of the scale. The actual width depends on the current
 * zoom level and the unit that is currently used (which also depends on
 * the zoom level).
 */
qxp.OO.addProperty({ name:"scaleMaxWidth", impl:"scale", type:qxp.constant.Type.NUMBER, allowNull:false, defaultValue:100 });

/** The spacing between the scale (and unit) and the border drawn around it. */
qxp.OO.addProperty({ name:"spacing", impl:"scale", type:qxp.constant.Type.NUMBER, allowNull:false, defaultValue:2 });

/**
 * Whether to display the scale in miles instead of kilometers.
 *
 * @deprecated  Use the {@link com.ptvag.webcomponent.map.Map#useMiles}
 *              property in the Map class instead.
 */
qxp.OO.addProperty({ name:"useMiles", type:qxp.constant.Type.BOOLEAN, allowNull:false, defaultValue:false });

/**
 * Whether to use a simply scale (just using lines) or a more sophisticated one
 * (with a one-line checkerboard pattern).
 */
qxp.OO.addProperty({ name:"useSimpleScale", impl:"scale", type:qxp.constant.Type.BOOLEAN, allowNull:false, defaultValue:true });
