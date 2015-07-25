/**
 * An aggregate for handling multiple vector elements at once.
 * The priority of this element is ignored - instead, the priorities
 * of the sub-elements added to it are used. The same applies to
 * flexible positioning.
 * <p>
 * Elements must only be added to an aggregate element after it has been added
 * to a vector layer itself. If you're directly using the
 * <code>AggregateElement</code> class, this shouldn't be a problem - simply
 * add elements after adding the aggregate element to a vector layer.
 * However, it's not quite that easy in sub classes: You're not allowed to
 * add elements to the aggregate element in the constructor. Instead, override
 * the modifier of
 * {@link com.ptvag.webcomponent.map.vector.VectorElement#vectorLayer} to add
 * elements:
 * </p>
 * <p><pre>
 *     var superModifyVectorLayer = this._modifyVectorLayer;
 *     this._modifyVectorLayer = function(propValue, propOldValue, propData) {
 *         superModifyVectorLayer.apply(this, arguments);
 *         if (propValue != null) {
 *             // propValue.addElement(...);
 *         }
 *     };
 * </pre></p>
 * Sample code: {@sample Custom client-side POIs}
 * 
 * @param   id {var,null}       the id of the element.
 */
qxp.OO.defineClass("com.ptvag.webcomponent.map.vector.AggregateElement",
                   com.ptvag.webcomponent.map.vector.VectorElement,
function(id) {
    var self = this;
    var map = com.ptvag.webcomponent.map;

    var mManagedElementIds = [];
    var mVectorLayer = null;

    // hack to support old ctor syntax
    if (id != null && id instanceof map.layer.VectorLayer) {
        mVectorLayer = id;
        if (arguments.length >= 2) {
            id = arguments[1];
        } else {
            id = null;
        }
    }

    map.vector.VectorElement.call(this, null, id);


    // property modifier
    var superModifyVectorLayer = self._modifyVectorLayer;
    self._modifyVectorLayer = function(propValue) {
        mVectorLayer = propValue;
        superModifyVectorLayer.apply(self, arguments);
    };


    /**
     * Used by the vector layer - don't call it yourself.
     * This method tells the aggregate element that it's being removed.
     * As a result, the aggregate element removes all the sub-elements it
     * manages from the vector layer.
     */
    self.remove = function() {
        for (var i = 0; i < mManagedElementIds.length; i++) {
            mVectorLayer.removeElement(mManagedElementIds[i]);
        }
        mManagedElementIds = [];
    };


    /**
     * Used by the vector layer - don't call it yourself.
     * This method tells the aggregate element that it's being removed.
     * As a result, the aggregate element removes all the sub-elements it
     * manages from the vector layer.
     *
     * @deprecated  Superseded by {@link #remove()}.
     */
    self.hide = function() {
        self.remove();
    };


    /**
     * Adds a new element to this aggregate element. The aggregate element in
     * turn adds this element to the vector layer.
     * 
     * @param   element {VectorElement}     the element to add.
     * @param   deferSorting {boolean,false}  if <code>true</code>, sorting the
     *                              elements according to priority is deferred
     *                              until the next time they are drawn. This
     *                              can greatly speed up the addition of lots
     *                              of prioritized elements.
     */
    self.addElement = function(element, deferSorting) {
        var id = mVectorLayer.addElement(element, deferSorting);
        mManagedElementIds.push(id);
    };
    
    
    /**
     * Removes an element from this aggregate element (and from the vector
     * layer).
     * 
     * @param    id {var}         the id of the element to remove.
     */
    self.removeElement = function(id) {
        var managedElementCount = mManagedElementIds.length;
        for (var i = 0; i < managedElementCount; ++i) {
            if (mManagedElementIds[i] == id) {
                mManagedElementIds.splice(i, 1);
                mVectorLayer.removeElement(id);
                break;
            }
        }
    };
    
    
    /**
     * Never called for aggregate elements (returns <code>null</code>).
     */
    self.usesCanvas = function() {
        return null;
    };


    // overridden
    self.clear = function(inDispose) {
        if (!inDispose) {
            self.remove();
        }
    };

});

