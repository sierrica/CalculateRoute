/**
 * A layer for looking up addresses.
 * 
 * @param   floaterLayer {com.ptvag.webcomponent.map.layer.Layer}   the layer
 *              that should be used to show high priority elements. This
 *              includes clickable/selectable tooltips/info boxes. Without a
 *              high priority layer, clicks would be swallowed by higher layers.
 * @param   isSecondary {boolean,true}      whether this is a secondary vector
 *                                          layer (used to avoid duplicate
 *                                          handling of the floater layer).
 */
qxp.OO.defineClass("com.ptvag.webcomponent.map.layer.AddressLookupLayer",
com.ptvag.webcomponent.map.layer.VectorLayer,
function(floaterLayer, isSecondary) {
    com.ptvag.webcomponent.map.layer.VectorLayer.call(this, floaterLayer,
        (isSecondary == null ? true : isSecondary));

    var self = this;
    var mapPackage = com.ptvag.webcomponent.map;
    var vectorPackage = mapPackage.vector;
    var CoordUtil = mapPackage.CoordUtil;

    var mAddressBox = null;
    var mCurrentCall = null;


    var locationCallback = function(result, exc) {
        // TODO: let a (customizable) formatter handle the layout
        mCurrentCall = null;
        var html = mapPackage.layer.AddressLookupLayer.formatAddress(result);
        mAddressBox.setText(html);
        self.addElement(mAddressBox);
    };


    // overridden
    self.onMouseClick = function(evt) {
        // TODO: don't do this on right click

        if (mCurrentCall != null) {
            mapPackage.SERVICE.abort(mCurrentCall);
            mCurrentCall = null;
        }
        if (mAddressBox != null) {
            self.removeElement(mAddressBox.getId());
            // might not be added, but that's harmless
            mAddressBox.dispose();
            // might already be disposed, but that's harmless
            mAddressBox = null;
        }

        var suPoint = self.getMap().translateMouseCoords(evt);
        var mercPoint = CoordUtil.smartUnit2Mercator(suPoint);
        mAddressBox = new vectorPackage.InfoBox(suPoint.x, suPoint.y);
        mAddressBox.setId("theBox");
        mCurrentCall = mapPackage.SERVICE.callAsync(locationCallback,
            "locationToAddress", mercPoint.x, mercPoint.y);

        return true;
    };


    // overridden
    var superDispose = self.dispose;
    self.dispose = function() {
        if (self.getDisposed()) {
            return;
        }
        if (mCurrentCall != null) {
            mapPackage.SERVICE.abort(mCurrentCall);
            mCurrentCall = null;    // help GC
        }
        if (mAddressBox != null) {
            mAddressBox.dispose();
            mAddressBox = null;     // help GC
        }
        superDispose.call(self);
    };

});


/**
 * Creates HTML for an info box from an address object. By changing this
 * function, you can determine how an address should be formatted. The
 * <code>address</code> object contains the following members:
 * <ul>
 *     <li>country</li>
 *     <li>postCode</li>
 *     <li>city</li>
 *     <li>street</li>
 *     <li>houseNumber</li>
 * </ul>
 * Please note that members may be missing (e.g. the houseNumber) if they
 * cannot be determined for a location. If you want to replace the default
 * implementation of this method, you must take that into account (and you'll
 * probably find {@link com.ptvag.webcomponent.map.MapUtil#escapeHTML} helpful
 * for producing the HTML-formatted result).
 *
 * @param   address {var}   the address as an object (see detailed description
 *                          above) or <code>null</code> if no address has been
 *                          found for a location.
 *
 * @return  {string}        the HTML representation of the address. The default
 *                          implementation returns an empty string if
 *                          <code>address</code> is <code>null</code>.
 */
qxp.Class.formatAddress = function(address) {
    var MapUtil = com.ptvag.webcomponent.map.MapUtil;
    var html = "";
    if (address != null) {
        if (address.street) {
            var text = address.street;
            if (address.houseNumber) {
                text += " " + address.houseNumber;
                // TODO: I18n
            }
            html += MapUtil.escapeHTML(text);
        }
        text = "";
        if (address.postCode) {
            text += address.postCode;
        }
        if (address.city) {
            if (text.length > 0) {
                text += " ";
            }
            text += address.city;
        }
        if (text.length > 0) {
            html += "<br />";
            html += MapUtil.escapeHTML(text);
        }
    }
    if (html.length == 0) {
        html = "&#160;&#160;&#160;";
    }
    return html;
};

