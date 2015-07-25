/**
 * A layer for making measurements on the map.
 * 
 * @param   floaterLayer {com.ptvag.webcomponent.map.layer.Layer}   the layer
 *              that should be used to show high priority elements. This
 *              includes clickable/selectable tooltips/info boxes. Without a
 *              high priority layer, clicks would be swallowed by higher layers.
 * @param   isSecondary {boolean,true}      whether this is a secondary vector
 *                                          layer (used to avoid duplicate
 *                                          handling of the floater layer).
 */
qxp.OO.defineClass("com.ptvag.webcomponent.map.layer.MeasurementLayer",
com.ptvag.webcomponent.map.layer.VectorLayer,
function(floaterLayer, isSecondary) {
    com.ptvag.webcomponent.map.layer.VectorLayer.call(this, floaterLayer,
        (isSecondary == null ? true : isSecondary));

    var self = this;
    var mapPackage = com.ptvag.webcomponent.map;
    var vectorPackage = mapPackage.vector;
    var CoordUtil = mapPackage.CoordUtil;

    var mMouseDown = false;
    var mMeasurementLine = null;
    var mDistanceBox = null;
    var mStartPoint;


    // overridden
    var superInit = self.init;
    self.init = function() {
        superInit.apply(self, arguments);
        self.getMap().addEventListener("changeUseMiles", fillDistanceBox);
    };


    var fillDistanceBox = function() {
        if (mDistanceBox == null) {
            return;
        }
        var distance =
            CoordUtil.distanceOfSmartUnitPoints(mStartPoint, mEndPoint);
        if (self.getMap().getUseMiles()) {
            var distanceMiles = distance / 1609.344;
            if (distanceMiles >= 1) {
                if (distanceMiles > 1000) {
                    var distanceText = "" + Math.round(distanceMiles);
                } else {
                    distanceMiles *= 10;
                    var roundedDist = Math.round(distanceMiles);
                    var fractionalPart = roundedDist%10;
                    //if (fractionalPart == 0) {
                    //    var distanceText = "" + roundedDist/10;
                    //} else {
                        distanceText = parseInt(roundedDist/10) +
                            self.getMap().getDecimalSeparator() + fractionalPart;
                    //}
                }
                distanceText += " mi";
            } else {
                distanceText = Math.round(distance/0.9144) + " yd";
            }
        } else {
            if (distance > 1000) {
                if (distance >= 1000000) {
                    distanceText = "" + Math.round(distance/1000);
                } else {
                    distance /= 100;
                    roundedDist = Math.round(distance);
                    fractionalPart = roundedDist%10;
                    //if (fractionalPart == 0) {
                    //    var distanceText = "" + roundedDist/10;
                    //} else {
                        distanceText = parseInt(roundedDist/10) +
                            self.getMap().getDecimalSeparator() + fractionalPart;
                    //}
                }
                distanceText += " km";
            } else {
                distanceText = Math.round(distance) + " m";
            }
        }
        var html = "<div _ptv_map_dontPrint='true' style='background-color:white;font-family:Verdana,Arial,sans-serif;font-size:10px;color:black;padding:2px;border:1px solid black'>" +
            distanceText +
            "</div>";

        var x = (mStartPoint.x + mEndPoint.x)/2;
        var y = (mStartPoint.y + mEndPoint.y)/2;

        mDistanceBox.updateProperties(x, y, null, html);
    };


    // overridden
    self.onMouseDown = function(evt) {
        if (!com.ptvag.webcomponent.util.EventUtils.isLeftMouseButton(evt)) {
            return false;
        }
        self.removeAllElements();
        mStartPoint = self.getMap().translateMouseCoords(evt);
        mEndPoint = mStartPoint;
        mMeasurementLine = new vectorPackage.Line("rgba(0, 0, 0, 1.0)", 2,
            [mStartPoint, mEndPoint]);
        mMeasurementLine.setId("measurementLine");
        mMeasurementLine.set({ startArrowLength:5, startArrowAngle:180,
                               endArrowLength:5, endArrowAngle:180 });
        self.addElement(mMeasurementLine);
        mDistanceBox = new vectorPackage.HTML();
        mDistanceBox.setId("distanceBox");
        mDistanceBox.setAlignment(
            mapPackage.layer.VectorLayer.ALIGN_MID_HORIZ +
            mapPackage.layer.VectorLayer.ALIGN_MID_VERT);
        fillDistanceBox();
        self.addElement(mDistanceBox);
        mMouseDown = true;
        self.getMap().getController().setActiveLayer(self);
        return true;
    };


    // overridden
    self.onMouseMove = function(evt) {
        if (mMouseDown) {
            mEndPoint = self.getMap().translateMouseCoords(evt);
            mMeasurementLine.setCoordinates([mStartPoint, mEndPoint]);
            fillDistanceBox();
        }
        return false;
    };


    // overridden
    self.onMouseUp = function() {
        if (!mMouseDown) {
            return false;
        }
        mMouseDown = false;
        self.getMap().getController().setActiveLayer(null);
        return true;
    };


    // overridden
    self.onMouseOut = function() {
        if (mMouseDown) {
            self.removeAllElements();
            mMeasurementLine = null;
            mDistanceBox = null;
            mMouseDown = false;
            self.getMap().getController().setActiveLayer(null);
        }
        return false;
    };


    // overridden
    var superDoPrint = self.doPrint;
    self.doPrint = function(ctx, htmlContainer, htmlBackground) {
        superDoPrint.apply(self, arguments);
        if (mDistanceBox != null) {
            var distanceBoxDiv = self.getParentElement().getElementsByTagName("div")[0].firstChild;     // HACK
            var left = parseInt(distanceBoxDiv.style.left);
            var top = parseInt(distanceBoxDiv.style.top);
            var width = distanceBoxDiv.offsetWidth - 1;
            var height = distanceBoxDiv.offsetHeight - 1;
            ctx.fillStyle = "rgb(255, 255, 255)";
            ctx.strokeStyle = "rgb(0, 0, 0)";
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.rect(left, top, width, height);
            ctx.fill();
            ctx.beginPath();
            ctx.rect(left, top, width, height);
            ctx.stroke();
            ctx.fontFamily = "sans-serif";
            ctx.fontStyle = "plain";
            ctx.fontSize = 10;
            ctx.textAlignment = 34;
            ctx.drawText(distanceBoxDiv.firstChild.firstChild.nodeValue,
                left + width/2, top + height/2);
        }
    };


    // overridden
    self.onKeyDown = function(evt) {
        var EventUtils = com.ptvag.webcomponent.util.EventUtils;
        if (mMouseDown) {
            self.onMouseOut();
            return true;
        }
        return false;
    };


    // overridden
    var superDispose = self.dispose;
    self.dispose = function() {
        if (self.getDisposed()) {
            return;
        }
        self.getMap().removeEventListener("changeUseMiles", fillDistanceBox);
        superDispose.call(self);
    };

});
