/**
 * A layer showing debug information.
 * <p>
 * Sample code: {@sample Layers}
 */
qxp.OO.defineClass("com.ptvag.webcomponent.map.layer.DebugLayer",
com.ptvag.webcomponent.map.layer.TextInfoLayer,
function() {
    com.ptvag.webcomponent.map.layer.TextInfoLayer.call(this);

    var self = this;
    var CoordUtil = com.ptvag.webcomponent.map.CoordUtil;


    // overridden
    var superInit = self.init;
    self.init = function() {
        superInit.apply(self, arguments);
        if (self.isEnabled()) {
            self.updateView();
        }
    };


    // overridden
    self.updateView = function() {
        var theMap = self.getMap();
        var lastMousePos = self.getLastMousePos();
        var rotatedCoords = theMap.transformPixelCoords(
            lastMousePos.x - theMap.getWidth()/2,
            lastMousePos.y - theMap.getHeight()/2, true, true, true);

        var suCenter = theMap.getVisibleCenter();
        var pixCenter =
            CoordUtil.smartUnit2Pixel(suCenter, theMap.getVisibleZoom());
        var pixPoint = { x:pixCenter.x + rotatedCoords.x,
                         y:pixCenter.y - rotatedCoords.y };
        var suPoint  = CoordUtil.pixel2SmartUnit(pixPoint, theMap.getZoom());
        var geoPoint = CoordUtil.smartUnit2GeoDecimal(suPoint);
        var mercPoint = CoordUtil.smartUnit2Mercator(suPoint);

        self.getAreaElement().innerHTML
            = "mouse pos (rel): " + Math.round(lastMousePos.x) + " / " + Math.round(lastMousePos.y) + "<br/>"
            + "mouse pos (pix): " + Math.round(pixPoint.x)      + " / " + Math.round(pixPoint.y) + "<br/>"
            + "mouse pos (su): "  + Math.round(suPoint.x)       + " / " + Math.round(suPoint.y) + "<br/>"
            + "mouse pos (geo): " + Math.round(geoPoint.x)      + " / " + Math.round(geoPoint.y) + "<br/>"
            + "mouse pos (merc): " + Math.round(mercPoint.x)      + " / " + Math.round(mercPoint.y) + "<br/>"
            + "center: " + Math.round(theMap.getCenter().x) + " / " + Math.round(theMap.getCenter().y) + "<br/>"
            + "zoom: " + theMap.getZoom() + "<br/>"
            + "visible center: " + Math.round(theMap.getVisibleCenter().x) + " / " + Math.round(theMap.getVisibleCenter().y) + "<br/>"
            + "visible zoom: " + theMap.getVisibleZoom();
    };


    var init = function() {
        self.setAreaHeight(105);
    };

    init();

});
