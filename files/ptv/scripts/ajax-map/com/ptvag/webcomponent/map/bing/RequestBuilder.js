/**
 * A request builder for Bing tiles.
 * 
 * @param parentMap {com.ptvag.webcomponent.map.Map} the map instance to create
 *     the request builder for.
 * @param apiKey {string} the Bing API key.
 */
qxp.OO.defineClass("com.ptvag.webcomponent.map.bing.RequestBuilder", com.ptvag.webcomponent.map.RequestBuilder,
function(parentMap, apiKey) {
    com.ptvag.webcomponent.map.RequestBuilder.call(this, parentMap, false);
    
    var self = this;
    var CoordUtil = com.ptvag.webcomponent.map.CoordUtil;
    var MetaData = com.ptvag.webcomponent.map.bing.MetaData;
    
    var mMercEdge = CoordUtil.GEO_2_MERC_X_HELPER*180*100000;
    
    var mMetaData = null;
    var mSubdomain = 0;

    // overridden
    self.buildRequest = function(left, top, right, bottom) {
        var mercWidth = right - left;
        var zoomLevel = 1 + Math.round(Math.log(mMercEdge/mercWidth)/Math.log(2));
        var x = Math.round((left + mMercEdge)/mercWidth);
        var y = Math.round((mMercEdge - top)/mercWidth);
        var digits = [];
        for (var i = zoomLevel - 1; i >= 0; --i) {
            digits.push(((x >> i) & 1) + (((y >> i) & 1) << 1));
        }
        var quadKey = digits.join("");
        if (mMetaData == null) {
            mMetaData = MetaData.getMetaData(apiKey);
        }
        var resources = mMetaData.resourceSets[0].resources[0];
        var subdomains = resources.imageUrlSubdomains;
        var subdomain = subdomains[mSubdomain];
        mSubdomain = (mSubdomain + 1) % subdomains.length;
        var url = resources.imageUrl.replace("{quadkey}", quadKey).
                                     replace("{subdomain}", subdomain) +
                  "&key=" + apiKey;
        return {url:url,
                width:256, height:256,
                clipLeft:0, clipTop:0, clipRight:0, clipBottom:0};
    };
});

