/**
 * A layer showing the coordinates of the current mouse position.
 * <p>
 * Sample code: {@sample Layers}
 */
qxp.OO.defineClass("com.ptvag.webcomponent.map.layer.PositionInfoLayer",
com.ptvag.webcomponent.map.layer.TextInfoLayer,
function() {
    com.ptvag.webcomponent.map.layer.TextInfoLayer.call(this);

    var self = this;
    var CoordUtil = com.ptvag.webcomponent.map.CoordUtil;


    // overridden
    var superInit = self.init;
    self.init = function() {
        superInit.apply(self, arguments);
        self.getAreaElement().innerHTML = "&#160;";
        if (self.isEnabled()) {
            self.updateView();
        }
    };
    
    
    // overridden
    self.updateView = function() {
        var theMap = self.getMap();
        
        var pixPoint = theMap.relative2AbsolutePixel(self.getLastMousePos());
        var suPoint  = CoordUtil.pixel2SmartUnit(pixPoint, theMap.getZoom());
        var geoPoint = CoordUtil.smartUnit2GeoDecimal(suPoint);

        self.getAreaElement().firstChild.nodeValue =
            beautifyGeo(Math.abs(geoPoint.y)) + (geoPoint.y > 0 ? " N" : " S") + ", " +
            beautifyGeo(Math.abs(geoPoint.x)) + (geoPoint.x > 0 ? " E" : " W");
    };


    /**
     * Creates a beautified, human readable version of a geodecimal position
     * with degrees, minutes and seconds.
     *
     * @param geoPos {double} the geodecimal position to beautify.
     * @return {string} the beautified position.
     */
    var beautifyGeo = function(geoPos) {
        var degrees = parseInt(geoPos / 100000);
        var minutes = parseInt((geoPos / (100000 / 60)) % 60);
        var seconds = (geoPos / ((100000 / 60) / 60)) % 60;

        var roundedSecs = Math.round(seconds * 100) / 100;
        if (roundedSecs >= 60) {
            roundedSecs = 0;
            ++minutes;
            if (minutes >= 60) {
                minutes = 0;
                ++degrees;
            }
        }
        var formattedSecs = (seconds < 10 ? "0" : "") + roundedSecs;
        formattedSecs = formattedSecs.substring(0, 5);
        if (formattedSecs.length < 3) {
            formattedSecs += ".";
        }
        while (formattedSecs.length < 5) {
            formattedSecs += "0";
        }

        return degrees + "\u00b0 " + (minutes < 10 ? "0" : "") + minutes + "' "
            + formattedSecs + "\"";
    };

});
