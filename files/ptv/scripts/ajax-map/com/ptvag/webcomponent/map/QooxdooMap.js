qxpOriginalPackage = qxp;
if (window.qx) {
    qxp = qx;
    if (!qx.OO) {
        qx.OO = {};
        qx.OO.defineClass = function(className, superClass, ctor) {
            qx.Class.define(className,
                {
                    extend: superClass,
                    construct: ctor
                }
            );
        };
    }
}

/**
 * A qooxdoo wrapper widget for the map. It allows using the map as a qooxdoo
 * widget. If you want to use it with an official qooxdoo version (in the
 * "qx" namespace instead of "qxp"), just include the qooxdoo script before
 * the Ajax Map script. At present, this works for qooxdoo versions 0.6.x and
 * 0.7.x.
 *
 * @param initMap {function,null} Callback function for initializing the map.
 *        Gets the map as first parameter. May be null.
 * @param startRect {Map,null}  an optional JavaScript dictionary with the
 *                              initial rect for the map (in smart units) - if
 *                              <code>null</code>, a default rect of
 *                              {left:4293961, top:5679567, right:4502808,
 *                               bottom:5400533} is used.
 */
qxp.OO.defineClass("com.ptvag.webcomponent.map.QooxdooMap",
qxp.ui.basic.Terminator,
function(initMap, startRect) {
    var self = this;
    
    var _qxp = (window.qx ? window.qx : qxp);
    _qxp.ui.basic.Terminator.call(this);

    var _initialized = false;
    var _map = null;
    
    /**
     * Returns the map.
     *
     * @return {com.ptvag.webcomponent.map.Map} the map.
     */
    self.getMap = function() {
        return _map;
    };
    
    // overridden
    var superAfterAppear = self._afterAppear;
    self._afterAppear = function() {
        superAfterAppear.apply(self, arguments);
        if (!_initialized) {
            _initialized = true;
            try {
                var rootElement = this.getElement();
                
                _map = new com.ptvag.webcomponent.map.Map(rootElement, startRect);
                if (initMap != null) {
                    initMap(_map);
                }
            } catch (exc) {
                this.error("Initializing map failed", exc);
            }
        }
    };

    // overridden
    var superChangeInnerWidth = self._changeInnerWidth;
    self._changeInnerWidth = function(newValue) {
        // The width has changed -> Update the map
        if (_map) {
            _map.setWidth(newValue);
        }
        return superChangeInnerWidth.apply(self, arguments);
    };

    // overridden
    var superChangeInnerHeight = self._changeInnerHeight;
    self._changeInnerHeight = function(newValue) {
        // The height has changed -> Update the map
        if (_map) {
            _map.setHeight(newValue);
        }
        return superChangeInnerHeight.apply(self, arguments);
    };

    // overridden
    var superDispose = self.dispose;
    self.dispose = function() {
        if (self.getDisposed()) {
            return;
        }
        if (_map) {
            _map.dispose();
            _map = null;
        }
        superDispose.call(self);
    };
});

qxp = qxpOriginalPackage;
