/**
 * Iterates through a list of points.
 * In the beginning, the iterator is positioned before the beginning of the list (so that
 * a call to {@link #iterate()} makes it go to the first point).
 * 
 * @param pointList {var} the points that should be iterated (may be either
 *        an array of points or an array of alternating x and y values or a
 *        string with space separated alternating x and y values).
 */
qxp.OO.defineClass("com.ptvag.webcomponent.map.PointListIterator", qxp.core.Object,
function(pointList) {
    qxp.core.Object.call(this);

    if (typeof pointList == "string") {
        // We got a space separated list of values (E.g. "840237 4900563 840237 4900561")
        // -> Convert it in an array of floating points
        pointList = pointList.split(" ");
        for (var i = 0; i < pointList.length; i++) {
        	pointList[i] = parseFloat(pointList[i]);
        }
    }

    this._list = pointList;
    this._currentIndex = -1;

    if (pointList.length > 0) {
        var firstItem = pointList[0];
        if (isNaN(firstItem)) {
            this._isListOfPoints      = (firstItem.x != null);
            this._isListOfVectorElems = (firstItem.getX != null);
        }
    }
});


/**
 * Resets the iterator to a position before the beginning of the list (so that
 * a call to {@link #iterate()} makes it go to the first point).
 */
qxp.Proto.reset = function() {
    this._currentIndex = -1;
};


/**
 * Iterates to the next point in the list.
 *
 * @return  {boolean}           <code>true</code> if the iterator is positioned
 *                              on a valid point, <code>false</code> if it points
 *                              beyond the end of the list.
 */
qxp.Proto.iterate = function() {
    this._currentIndex++;

    if (this._currentIndex >= this._list.length) {
        return false;
    } else {
        if (this._isListOfPoints || this._isListOfVectorElems) {
            var item = this._list[this._currentIndex];
            if (this._isListOfPoints) {
                this.x = item.x;
                this.y = item.y;
            } else {
                this.x = item.getX();
                this.y = item.getY();
            }

            if (isNaN(this.x)) {
                throw new Error("Iterating point list failed: x value of point at index " + this._currentIndex + " is NaN: " + this.x);
            }
            if (isNaN(this.y)) {
                throw new Error("Iterating point list failed: y value of point at index " + this._currentIndex + " is NaN: " + this.y);
            }
        } else {
            this.x = this._list[this._currentIndex];
            this.y = this._list[this._currentIndex + 1];
            if (isNaN(this.x)) {
                throw new Error("Iterating point list failed: x value at index " + this._currentIndex + " is NaN: " + this.x);
            }
            if (isNaN(this.y)) {
                throw new Error("Iterating point list failed: y value at index " + (this._currentIndex + 1) + " is NaN: " + this.y);
            }
            this._currentIndex++;
        }
        return true;
    }
};


/**
 * Returns the x coordinate of the current point.
 *
 * @return  {double}            the x coordinate.
 */
qxp.Proto.getX = function() {
    return this.x;
};


/**
 * Returns the y coordinate of the current point.
 *
 * @return  {double}            the y coordinate.
 */
qxp.Proto.getY = function() {
    return this.y;
};
