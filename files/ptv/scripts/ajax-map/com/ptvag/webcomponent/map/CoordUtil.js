/**
 * Utility class for coordinate translation.
 * <p>
 * Sample code: {@sample Coordinates},
 *              {@sample Layers}
 */

qxp.OO.defineClass("com.ptvag.webcomponent.map.CoordUtil");


/**
 * Determines the bounding box in coordinates for the given image
 * size and center, according to the given zoom level (map zoom level).
 *
 * @param width {int} width of the map in pixels
 * @param height {int} height of the map in pixels
 * @param center {Map} the maps center point in smart units.
 * @param zoom {int} the desired zoom level.
 * @return {Map} the bounding box coordinates.
 */
qxp.Class.sizeCenterZoom2BBox = function(width, height, center, zoom) { 
    var supp = com.ptvag.webcomponent.map.CoordUtil.getSmartUnitsPerPixel(zoom); 
    return {left:center.x - supp*width/2, top:center.y + supp*height/2, 
            right:center.x + supp*width/2, bottom:center.y - supp*height/2}; 
};
        
/**
 * Determines the bounding box in coordinates for the given image
 * size and center, according to the given zoom level, given by smart units per pixel (SUPP).
 *
 * @param width {int} width of the map in pixels
 * @param height {int} height of the map in pixels
 * @param center {Map} the maps center point in smart units.
 * @param supp {int} the desired zoom level specified in Smart units per pixel
 * @return {Map} the bounding box coordinates.
 */
qxp.Class.sizeCenterZoomInSUPP2BBox = function(width, height, center, supp) { 
    return {left:center.x - supp*width/2, top:center.y + supp*height/2, 
            right:center.x + supp*width/2, bottom:center.y - supp*height/2}; 
};

/**
 * Returns the distance (in meters) of two points (in smart units).
 *
 * @param suPoint1 {Map} the first point in smart units.
 * @param suPoint2 {Map} the second point in smart units.
 * @return {double} the distance of the two points in meters.
 */
qxp.Class.distanceOfSmartUnitPoints = function(suPoint1, suPoint2) {
    var CoordUtil = com.ptvag.webcomponent.map.CoordUtil;

    var dx = suPoint1.x - suPoint2.x;
    var dy = suPoint1.y - suPoint2.y;
    var lon = (suPoint1.y + suPoint2.y)/2;
    var mercLon = lon * CoordUtil.SMART_UNIT - CoordUtil.SMART_OFFSET;
    var geoLonDegrees = 180 / Math.PI *
        (Math.atan(Math.exp(mercLon / 6371000)) - (Math.PI / 4)) / 0.5;
    var metersPerSmartUnit =
        CoordUtil.SMART_UNIT * Math.cos(geoLonDegrees / 180 * Math.PI);

    return Math.sqrt((dx * dx + dy * dy)) * metersPerSmartUnit;
};


/**
 * Translates a point from mercator projection to smart units.
 *
 * @param mercPoint {Map} the point in mercator projection.
 * @return {Map} the point in smart units.
 */
qxp.Class.mercator2SmartUnit = function(mercPoint) {
    // In C: Mercator2SmartUnit
    var CoordUtil = com.ptvag.webcomponent.map.CoordUtil;

    return {
        x: ((mercPoint.x + CoordUtil.SMART_OFFSET) / CoordUtil.SMART_UNIT),
        y: ((mercPoint.y + CoordUtil.SMART_OFFSET) / CoordUtil.SMART_UNIT)
    };
};


/**
 * Translates a point from smart units to mercator projection.
 *
 * @param suPoint {Map} the point in smart units.
 * @return {Map} the point in mercator projection.
 */
qxp.Class.smartUnit2Mercator = function(suPoint) {
    // In C: SmartUnit2Mercator
    var CoordUtil = com.ptvag.webcomponent.map.CoordUtil;

    return {
        x: suPoint.x * CoordUtil.SMART_UNIT - CoordUtil.SMART_OFFSET,
        y: suPoint.y * CoordUtil.SMART_UNIT - CoordUtil.SMART_OFFSET
    };
};


/**
 * Translates a point from mercator projection to geo decimals.
 *
 * @param mercPoint {Map} the point in mercator projection.
 * @return {Map} the point in geo decimals.
 */
qxp.Class.mercator2GeoDecimal = function(mercPoint) {
    // In C: Mercator_2_GeoDecimal
    var geoPoint = {};
    /*
    var lambda = (180.0 / Math.PI) * (mercPoint.x / 6371000.0);
    var phi = (180.0 / Math.PI) * (Math.atan(Math.exp(mercPoint.y / 6371000.0)) - (Math.PI / 4.0)) / 0.5;
    geoPoint.x = lambda * 100000;
    geoPoint.y = phi * 100000;
    */
    var CoordUtil = com.ptvag.webcomponent.map.CoordUtil;

    geoPoint.x = CoordUtil.MERC_2_GEO_X_HELPER * mercPoint.x;
    geoPoint.y = (Math.atan(Math.exp(mercPoint.y / 6371000.0)) -
                  (Math.PI / 4.0)) * CoordUtil.MERC_2_GEO_Y_HELPER;

    return geoPoint;
};


/**
 * Translates a point from geo decimals to mercator projection.
 *
 * @param geoPoint {Map} the point in geo decimals.
 * @return {Map} the point in mercator projection.
 */
qxp.Class.geoDecimal2Mercator = function(geoPoint) {
    // In C: GeoDecimal_2_Mercator
    var mercPoint = {};
    /*
    var lambda = geoPoint.x / 100000;
    var phi = geoPoint.y / 100000;
    mercPoint.x = 6371000.0 * ((Math.PI / 180.0) * (lambda - 0.0));
    mercPoint.y = 6371000.0 * Math.log(Math.tan((Math.PI / 4.0) + (Math.PI / 180.0) * phi * 0.5));
    */
    var CoordUtil = com.ptvag.webcomponent.map.CoordUtil;

    mercPoint.x = CoordUtil.GEO_2_MERC_X_HELPER * geoPoint.x;
    mercPoint.y = 6371000.0 * Math.log(Math.tan((Math.PI / 4.0) + CoordUtil.GEO_2_MERC_Y_HELPER * geoPoint.y));

    return mercPoint;
};


/**
 * Translates a point from geo decimals to smart units.
 *
 * @param geoPoint {Map} the point in geo decimals.
 * @return {Map} the point in smart units.
 */
qxp.Class.geoDecimal2SmartUnit = function(geoPoint) {
    var CoordUtil = com.ptvag.webcomponent.map.CoordUtil;

    return CoordUtil.mercator2SmartUnit(
        CoordUtil.geoDecimal2Mercator(geoPoint));
};


/**
 * Translates a list of point from geo decimals to smart units.
 *
 * @param pointList {var} the point list in geo decimals. (may be either
 *        an array of points or an array of alternating x and y values or a
 *        string with space separated alternating x and y values).
 * @return {Map[]} the point list in smart units.
 */
qxp.Class.geoDecimalList2SmartUnitList = function(pointList) {
    var map = com.ptvag.webcomponent.map;
    var converter = map.CoordUtil.geoDecimal2SmartUnit;
    var newList = [];
    var iter = new map.PointListIterator(pointList);
    while (iter.iterate()) {
        newList.push(converter({ x:iter.x, y:iter.y }));
    }
    return newList;
};


/**
 * Translates a point from smart units to geo decimals.
 *
 * @param suPoint {Map} the point in smart units.
 * @return {Map} the point in geo decimals.
 */
qxp.Class.smartUnit2GeoDecimal = function(suPoint) {
    var CoordUtil = com.ptvag.webcomponent.map.CoordUtil;

    return CoordUtil.mercator2GeoDecimal(
        CoordUtil.smartUnit2Mercator(suPoint));
};


/**
 * Translates a point from smart units to tile coordinates
 *
 * @param suPoint {Map} the point in smart units.
 * @param level {int} the zoom level.
 * @return {Map} the coordinates of the tile showing the point.
 */
qxp.Class.smartUnit2Tile = function(suPoint, level) {
    var tilewidth = com.ptvag.webcomponent.map.CoordUtil.TILE_WIDTHS[level];
    if (! tilewidth) {
        throw new Error("Illegal zoom level: " + level);
    }

    return {
        x: suPoint.x / tilewidth,
        y: suPoint.y / tilewidth
    };
};


/**
 * Translates a point from tile coordinates to smart units.
 *
 * @param tilePoint {Map} the coordinates of the tile.
 * @param level {int} the zoom level.
 * @return {Map} the south-west (bottom-left) point of the tile in smart units.
 */
qxp.Class.tile2SmartUnit = function(tilePoint, level) {
    var tilewidth = com.ptvag.webcomponent.map.CoordUtil.TILE_WIDTHS[level];
    if (! tilewidth) {
        throw new Error("Illegal zoom level: " + level);
    }

    return {
        x: tilePoint.x * tilewidth,
        y: tilePoint.y * tilewidth
    };
};


/**
 * Creates a tile ID.
 *
 * @param tilePoint {Map} the coordinates of the tile as point.
 * @return {int} the tile ID.
 */
qxp.Class.tile2TileId = function(tilePoint) {
    return ((tilePoint.x & 0xffff) << 16) | (tilePoint.y & 0xffff);
};


/**
 * Returns the coordinates of the tile from a tile ID.
 *
 * @param tileId {int} the tile ID.
 * @return {Map} the coordinates of the tile as point.
 */
qxp.Class.tileId2Tile = function(tileId) {
    return {
        x: tileId >> 16,    // NOTE: Do we have to use >>> ?
        y: tileId & 0xffff
    };
};


/**
 * Translates a point from smart units to pixels in a certain zoom level.
 *
 * @param       suPoint {Map}       the point in smart units.
 * @param       level {double}      the zoom level.
 *
 * @return      {Map}               the coordinates in pixels (as float values,
 *                                  not rounded or truncated).
 */

qxp.Class.smartUnit2Pixel = function(suPoint, level) {
    var CoordUtil = com.ptvag.webcomponent.map.CoordUtil;

    return CoordUtil.smartUnit2PixelByTileWidth(
        suPoint, CoordUtil.getTileWidth(level));
};


/**
 * Translates a point from pixels in a certain zoom level to smart units.
 *
 * @param       pixPoint {Map}      the point in pixels.
 * @param       level {double}      the zoom level.
 *
 * @return      {Map}               the point in smart units.
 */

qxp.Class.pixel2SmartUnit = function(pixPoint, level) {
    var CoordUtil = com.ptvag.webcomponent.map.CoordUtil;

    return CoordUtil.pixel2SmartUnitByTileWidth(
        pixPoint, CoordUtil.getTileWidth(level));
};


/**
 * Translates a point from smart units to pixels using the tilewidth of a
 * certain zoom level.
 *
 * @param suPoint {Map} the point in smart units.
 * @param tilewidth {double} the width of a tile in that zoom level
 *        (in smart units / tile).
 * 
 * @return {Map} the point in pixels.
 */
qxp.Class.smartUnit2PixelByTileWidth = function(suPoint, tilewidth) {
    var CoordUtil = com.ptvag.webcomponent.map.CoordUtil;

    return {
        x: suPoint.x / tilewidth * CoordUtil.TILE_WIDTH,
        y: suPoint.y / tilewidth * CoordUtil.TILE_WIDTH
    };
};


/**
 * Translates a point from pixels to smart units using the tilewidth of a
 * certain zoom level.
 *
 * @param pixPoint {Map} the point in pixels.
 * @param tilewidth {double} the width of a tile in that zoom level
 *        (in smart units / tile).
 * 
 * @return {Map} the point in smart units.
 */
qxp.Class.pixel2SmartUnitByTileWidth = function(pixPoint, tilewidth) {
    var CoordUtil = com.ptvag.webcomponent.map.CoordUtil;

    return {
        x: pixPoint.x * tilewidth / CoordUtil.TILE_WIDTH,
        y: pixPoint.y * tilewidth / CoordUtil.TILE_WIDTH
    };
};


/**
 * Returns the width of tile in a certain zoom level (in smart units / tile).
 *
 * @param level {double} the zoom level (May be a value between two zoom levels).
 * @return {double} the width of a tile in that zoom level.
 */
qxp.Class.getTileWidth = function(level) {
    var CoordUtil = com.ptvag.webcomponent.map.CoordUtil;
    return CoordUtil.ZOOM_BASE * Math.pow(CoordUtil.ZOOM_LEVEL_FACTOR, level);
};


/**
 * Returns the zoom level for a tile width.
 *
 * @param tileWidth {double} the width of a tile (in smart units).
 * @return {double} the zoom level that uses this tile width.
 */
qxp.Class.getLevelForTileWidth = function(tileWidth) {
    var CoordUtil = com.ptvag.webcomponent.map.CoordUtil;
    return Math.log(tileWidth / CoordUtil.ZOOM_BASE) / CoordUtil.ZOOM_LOG_LEVEL_FACTOR;
};


/**
 * Returns the width of one pixel in a certain zoom level (in smart units / pixel).
 *
 * @param level {double} the zoom level (May be a value between two zoom levels).
 * @return {double} the width of a pixel in that zoom level.
 */
qxp.Class.getSmartUnitsPerPixel = function(level) {
    var CoordUtil = com.ptvag.webcomponent.map.CoordUtil;
    return CoordUtil.getTileWidth(level) / CoordUtil.TILE_WIDTH
};


/**
 * Returns the zoom level having a certain pixel width (in smart units / pixel).
 *
 * @param suPerPixel {double} the number of smart units one pixel has.
 * @return {double} the zoom level having this pixel width.
 */
qxp.Class.getLevelForSmartUnitsPerPixel = function(suPerPixel) {
    var CoordUtil = com.ptvag.webcomponent.map.CoordUtil;
    return CoordUtil.getLevelForTileWidth(
        suPerPixel * CoordUtil.TILE_WIDTH);
};


/**
 * Helper function for Liang-Barsky.
 *
 * @param t {double} temporary value.
 * @param p {double} temporary value.
 * @param q {double} temporary value.
 *
 * @return {boolean} <code>true</code> if the line is completely clipped.
 */
qxp.Class.clipHelper = function(t, p, q) {
    if (p == 0) {
        if (q < 0) {
            return true;
        }
    } else {
        r = q/p;
        if (p < 0) {
            if (r > t[1]) {
                return true;
            }
            if (r > t[0]) {
                t[0] = r;
            }
        } else {
            if (r < t[0]) {
                return true;
            }
            if (r < t[1]) {
                t[1] = r;
            }
        }
    }
    return false;
};


/**
 * Clips a line using the Liang-Barsky algorithm.
 * 
 * @param startPoint {Map} the start point of the line (with x and y properties).
 * @param endPoint {Map} the end point of the line (with x and y properties).
 * @param bounds {Map} the bounds for clipping (with minX, maxX, minY, and maxY properties).
 * @param edgeInfo {Object,null} on return, this (optional) object is filled with
 *                      information about the edges at which the line was clipped:
 *                      <ul>
 *                          <li><strong>clipEdgeStart</strong> - <code>null</code>
 *                              if the start point hasn't been changed,
 *                              0 if it has been clipped by the
 *                              maxY edge, 1 if it has been clipped by the
 *                              maxX edge, 2 if it has been clipped by the
 *                              minY edge, and 3 if it has been clipped by
 *                              the minX edge.</li>
 *                          <li><strong>clipEdgeEnd</strong> - same as
 *                              <code>startClip</code>, but for the
 *                              end point.</li>
 *                      </ul>
 *
 * @return {int}    0: no clipping performed (line is completely inside),
 *                  1: startPoint changed,
 *                  2: endPoint changed,
 *                  3: startPoint and endPoint changed,
 *                  4: line is completely outside.
 */
qxp.Class.clipLine = function(startPoint, endPoint, bounds, edgeInfo) {
    var CoordUtil = com.ptvag.webcomponent.map.CoordUtil;
    
    var t = [0, 1];
    var tPrev = [0, 1];
    var clipEdgeStart = null;
    var clipEdgeEnd = null;
    if (edgeInfo != null) {
        // in case we return early
        edgeInfo.clipEdgeStart = clipEdgeStart;
        edgeInfo.clipEdgeEnd = clipEdgeEnd;
    }

    var deltaX = endPoint.x - startPoint.x;
    var deltaY = endPoint.y - startPoint.y;

    var p = -deltaX;
    var q = -(bounds.minX - startPoint.x);
    if (CoordUtil.clipHelper(t, p, q)) {
        return 4;
    }
    if (t[0] != tPrev[0]) {
        clipEdgeStart = 3;
        tPrev[0] = t[0];
    }
    if (t[1] != tPrev[1]) {
        clipEdgeEnd = 3;
        tPrev[1] = t[1];
    }
    
    p = deltaX;
    q = bounds.maxX - startPoint.x;
    if (CoordUtil.clipHelper(t, p, q)) {
        return 4;
    }
    if (t[0] != tPrev[0]) {
        clipEdgeStart = 1;
        tPrev[0] = t[0];
    }
    if (t[1] != tPrev[1]) {
        clipEdgeEnd = 1;
        tPrev[1] = t[1];
    }
    
    p = -deltaY;
    q = -(bounds.minY - startPoint.y);
    if (CoordUtil.clipHelper(t, p, q)) {
        return 4;
    }
    if (t[0] != tPrev[0]) {
        clipEdgeStart = 2;
        tPrev[0] = t[0];
    }
    if (t[1] != tPrev[1]) {
        clipEdgeEnd = 2;
        tPrev[1] = t[1];
    }
    
    p = deltaY;
    q = bounds.maxY - startPoint.y;
    if (CoordUtil.clipHelper(t, p, q)) {
        return 4;
    }
    if (t[0] != tPrev[0]) {
        clipEdgeStart = 0;
        tPrev[0] = t[0];
    }
    if (t[1] != tPrev[1]) {
        clipEdgeEnd = 0;
        tPrev[1] = t[1];
    }
    
    if (edgeInfo != null) {
        edgeInfo.clipEdgeStart = clipEdgeStart;
        edgeInfo.clipEdgeEnd = clipEdgeEnd;
    }

    if (t[0] == 0 && t[1] == 1) {
        return 0;
    }
    
    endPoint.x = startPoint.x + t[1] * deltaX;
    endPoint.y = startPoint.y + t[1] * deltaY;
    startPoint.x += t[0] * deltaX;
    startPoint.y += t[0] * deltaY;

    return (t[0] == 0 ? 0 : 1) + (t[1] == 1 ? 0 : 2);
};


/**
 * Tests whether a point is inside a polygon.
 *
 * @param   pointX {double}     the x coordinate of the point.
 * @param   pointY {double}     the y coordinate of the point.
 * @param   polyCoords {double[]}   the polygon coordinates as alternating
 *                                  x and y values.
 */
qxp.Class.isPointInPoly = function(pointX, pointY, polyCoords) {
    var vertexCount = polyCoords.length / 2;
    var j = vertexCount - 1;
    var odd = false;
    for (var i = 0; i < vertexCount; ++i) {
        var polyXi = polyCoords[i*2];
        var polyYi = polyCoords[i*2 + 1];
        var polyXj = polyCoords[j*2];
        var polyYj = polyCoords[j*2 + 1];
        if (polyYi < pointY && polyYj >= pointY ||
            polyYj < pointY && polyYi >= pointY) {
            if (polyXi + (pointY - polyYi)/(polyYj - polyYi)*(polyXj - polyXi) < pointX) {
                odd = !odd;
            }
        }
        j = i;
    }
    return odd;
};


/**
 * Orders the coordinates of a polygon in clockwise fashion (assuming an
 * up-pointing y axis).
 *
 * @param   coordinates {double[]}  the coordinates as alternating x and y
 *                                  values.
 *
 * @return  {double[]}          the coordinates in clockwise fashion (identical
 *                              to the <code>coordinates</code> parameter if
 *                              the points were already ordered clockwise).
 */
qxp.Class.makeClockwisePoly = function(coordinates) {
    var vertexCount = coordinates.length/2;
    var sum = 0;
    for (var i = 0; i < vertexCount; ++i) {
        var nextIndex = i + 1;
        if (nextIndex == vertexCount) {
            nextIndex = 0;
        }
        sum += coordinates[i*2]*coordinates[nextIndex*2 + 1] -
               coordinates[nextIndex*2]*coordinates[i*2 + 1];
    }
    if (sum < 0) {
        return coordinates;
    }
    var retVal = new Array(vertexCount*2);
    for (i = 0; i < vertexCount; ++i) {
        nextIndex = vertexCount - i - 1;
        retVal[i*2] = coordinates[nextIndex*2];
        retVal[i*2 + 1] = coordinates[nextIndex*2 + 1];
    }
    return retVal;
};


/**
 * Turns an array into a cyclic linked list.
 *
 * @param   list {Object[]}         the array.
 */
qxp.Class.makeLinkedList = function(list) {
    var nodeCount = list.length;
    for (var i = 0; i < nodeCount; ++i) {
        var index = i + 1;
        if (index == nodeCount) {
            index = 0;
        }
        list[i].next = list[index];
    }
};


/**
 * Clips a polygon using the Weiler-Atherton algorithm.
 *
 * @param   coordinates {double[]}  the coordinates as alternating x and y
 *                                  values.
 * @param   bounds {Map}            the bounds for clipping (with minX, maxX,
 *                                  minY, and maxY properties).
 *
 * @return  {double[][]}            an array of arrays with the coordinates of
 *                                  the resulting polygons. The inner arrays
 *                                  contain the points with alternating x and y
 *                                  coordinates. The outer array may have a
 *                                  length of 0 (if the polygon is completely
 *                                  outside the bounds), 1 (the polygon is not
 *                                  separated by clipping), or more than 1 (the
 *                                  polygon is separated into several pieces).
 */
qxp.Class.clipPoly = function(coordinates, bounds) {
    var CoordUtil = com.ptvag.webcomponent.map.CoordUtil;

    var clockwiseCoordinates = CoordUtil.makeClockwisePoly(coordinates);
    var vertexCount = clockwiseCoordinates.length / 2;
    
    // build the subject and clip lists
    var subjectList = new Array(vertexCount);
    for (var i = 0; i < vertexCount; ++i) {
        subjectList[i] = { x: clockwiseCoordinates[i*2], y: clockwiseCoordinates[i*2 + 1] };
    }
    CoordUtil.makeLinkedList(subjectList);
    var clipList = [ { x: bounds.minX, y: bounds.maxY },
                     { x: bounds.maxX, y: bounds.maxY },
                     { x: bounds.maxX, y: bounds.minY },
                     { x: bounds.minX, y: bounds.minY } ];
    CoordUtil.makeLinkedList(clipList);

    // compute intersections
    var enteringList = [];
    var intersectionPointClip;
    var edgeInfo = new Object();
    var lineInside = false;
    for (i = 0; i < vertexCount; ++i) {
        var endIndex = i + 1;
        if (endIndex == vertexCount) {
            endIndex = 0;
        }
        var startPoint = { x: subjectList[i].x, y: subjectList[i].y };
        var endPoint = { x: subjectList[endIndex].x, y: subjectList[endIndex].y };
        if (CoordUtil.clipLine(startPoint, endPoint, bounds, edgeInfo) == 0) {
            lineInside = true;
        }
        for (var j = 0; j < 2; ++j) {
            var intersectionPointSubject = null;
            if (edgeInfo.clipEdgeStart != null && j == 0) {
                // startPoint changed
                enteringList.push(startPoint);
                intersectionPointSubject = startPoint;
                var edgeIndex = edgeInfo.clipEdgeStart;
            } else if (edgeInfo.clipEdgeEnd != null && j == 1) {
                // endPoint changed
                intersectionPointSubject = endPoint;
                edgeIndex = edgeInfo.clipEdgeEnd;
            }
            if (intersectionPointSubject != null) {
                var distX = intersectionPointSubject.x - subjectList[i].x;
                var distY = intersectionPointSubject.y - subjectList[i].y;
                var squareDist = distX*distX + distY*distY;
                intersectionPointSubject.squareDist = squareDist;

                // insert the intersection point into the subject list
                var insertAfter = subjectList[i];
                var insertBefore = insertAfter.next;
                while (insertBefore.squareDist != null) {
                    if (insertBefore.squareDist >= squareDist) {
                        break;
                    }
                    insertAfter = insertBefore;
                    insertBefore = insertAfter.next;
                }
                insertAfter.next = intersectionPointSubject;
                intersectionPointSubject.next = insertBefore;

                // insert the intersection point into the clip list
                intersectionPointClip = { x: intersectionPointSubject.x,
                                          y: intersectionPointSubject.y };
                distX = intersectionPointClip.x - clipList[edgeIndex].x;
                distY = intersectionPointClip.y - clipList[edgeIndex].y;
                squareDist = distX*distX + distY*distY;
                intersectionPointClip.squareDist = squareDist;
                intersectionPointSubject.link = intersectionPointClip;
                intersectionPointClip.link = intersectionPointSubject;
                insertAfter = clipList[edgeIndex];
                insertBefore = insertAfter.next;
                while (insertBefore.squareDist != null) {
                    if (insertBefore.squareDist >= squareDist) {
                        break;
                    }
                    insertAfter = insertBefore;
                    insertBefore = insertAfter.next;
                }
                insertAfter.next = intersectionPointClip;
                intersectionPointClip.next = insertBefore;
            }
        }
    }

    // generate the polygon(s)
    var retVal = [];
    var enteringCount = enteringList.length;
    if (enteringCount == 0) {
        if (lineInside) {
            // case 1: the polygon is completely inside
            retVal.push(clockwiseCoordinates);
        } else {
            // check whether the polygon completely encompasses the clip bounds
            var checkX = (bounds.minX + bounds.maxX)/2;
            var checkY = (bounds.minY + bounds.maxY)/2;
            if (CoordUtil.isPointInPoly(checkX, checkY, clockwiseCoordinates)) {
                retVal.push( [ bounds.minX, bounds.maxY, bounds.maxX, bounds.maxY,
                               bounds.maxX, bounds.minY, bounds.minX, bounds.minY ] );
            }
        }
    } else {
        // case 4: the polygon is partially inside
        while (true) {
            for (var index = 0; index < enteringCount; ++index) {
                if (!enteringList[index].deleted) {
                    break;
                }
            }
            if (index == enteringCount) {
                break;
            }
            var poly = [];
            startPoint = enteringList[index];
            poly.push(startPoint.x);
            poly.push(startPoint.y);
            startPoint.deleted = true;
            var point = startPoint.next;
            while (point != startPoint && point.link != startPoint) {
                poly.push(point.x);
                poly.push(point.y);
                if (point.squareDist != null) {
                    point.deleted = true;
                    point.link.deleted = true;
                    point = point.link;
                }
                point = point.next;
            }
            retVal.push(poly);
        }
    }

    return retVal;
};


/**
 * Switch to PTV zoom levels - must be called before the map is instantiated!
 * <code>maxLevel</code> must be higher than or equal to <code>minLevel</code>.
 *
 * @param   minLevel {int, 0}   the minimum zoom level (0-23). Use a value
 *                              higher than 0 to restrict zooming in.
 * @param   maxLevel {int, 23}  the maximum zoom level (0-23). Use a value
 *                              lower than 23 to restrict zooming out.
 */
qxp.Class.usePTVZoomLevels = function(minLevel, maxLevel) {
    var CoordUtil = com.ptvag.webcomponent.map.CoordUtil;

    if (minLevel == null) {
        minLevel = 0;
    }
    if (maxLevel == null) {
        maxLevel = 23;
    }
    CoordUtil.ZOOM_LEVEL_COUNT = maxLevel - minLevel + 1;
    CoordUtil.ZOOM_LEVEL_FACTOR = 1.5874;
    CoordUtil.ZOOM_LOG_LEVEL_FACTOR = Math.log(CoordUtil.ZOOM_LEVEL_FACTOR);
    CoordUtil.ZOOM_MAX_TILE_WIDTH = 1040384 /
        Math.pow(CoordUtil.ZOOM_LEVEL_FACTOR, 23 - maxLevel);
    CoordUtil.ZOOM_BASE = CoordUtil.ZOOM_MAX_TILE_WIDTH /
        Math.pow(CoordUtil.ZOOM_LEVEL_FACTOR, CoordUtil.ZOOM_LEVEL_COUNT - 1);
    CoordUtil.TILE_WIDTHS = [];
    for (var i = 0; i < CoordUtil.ZOOM_LEVEL_COUNT; i++) {
        CoordUtil.TILE_WIDTHS.push(CoordUtil.getTileWidth(i));
    }
};


/**
 * Switch to Google zoom levels - must be called before the map is
 * instantiated! <code>maxLevel</code> must be higher than or equal to
 * <code>minLevel</code>.
 *
 * @param   minLevel {int, 0}   the minimum zoom level (0-19). Use a value
 *                              higher than 0 to restrict zooming in.
 * @param   maxLevel {int, 19}  the maximum zoom level (0-19). Use a value
 *                              lower than 19 to restrict zooming out.
 */
qxp.Class.useGoogleZoomLevels = function(minLevel, maxLevel) {
    var CoordUtil = com.ptvag.webcomponent.map.CoordUtil;

    if (minLevel == null) {
        minLevel = 0;
    }
    if (maxLevel == null) {
        maxLevel = 19;
    }
    var geo1 = {x:0, y:0};
    var geo2 = {x:4500000, y:0};
    var su1 = CoordUtil.mercator2SmartUnit(CoordUtil.geoDecimal2Mercator(geo1));
    var su2 = CoordUtil.mercator2SmartUnit(CoordUtil.geoDecimal2Mercator(geo2));
    var suPerDegree = (su2.x - su1.x)/45;

    CoordUtil.ZOOM_LEVEL_COUNT = maxLevel - minLevel + 1;
    CoordUtil.ZOOM_LEVEL_FACTOR = 2;
    CoordUtil.ZOOM_LOG_LEVEL_FACTOR = Math.log(CoordUtil.ZOOM_LEVEL_FACTOR);
    var tileFactor = CoordUtil.TILE_WIDTH/256.0;
    CoordUtil.ZOOM_MAX_TILE_WIDTH = 360.0*suPerDegree*tileFactor/
        Math.pow(CoordUtil.ZOOM_LEVEL_FACTOR, 19 - maxLevel);
    CoordUtil.ZOOM_BASE = CoordUtil.ZOOM_MAX_TILE_WIDTH /
        Math.pow(CoordUtil.ZOOM_LEVEL_FACTOR, CoordUtil.ZOOM_LEVEL_COUNT - 1);
    CoordUtil.TILE_WIDTHS = [];
    for (var i = 0; i < CoordUtil.ZOOM_LEVEL_COUNT; ++i) {
        CoordUtil.TILE_WIDTHS.push(CoordUtil.getTileWidth(i));
    }
};


/** {int} The number of zoom levels. */
qxp.Class.ZOOM_LEVEL_COUNT = null;

/** {double} The tile width of the highest zoom level (in smart units / tile). */
qxp.Class.ZOOM_MAX_TILE_WIDTH = null;

/**
 * {double} The factor between two zoom levels
 * (tileWidth[level n+1] = tileWidth[level n] * factor).
 */
qxp.Class.ZOOM_LEVEL_FACTOR = null;

/** The natural logarithm (base E) of {@link #ZOOM_LEVEL_FACTOR}. */
qxp.Class.ZOOM_LOG_LEVEL_FACTOR = null;

/**
 * {double} The tile width of zoom level 0 (in smart units / tile). Used as the
 * base for calculating the tile widths of the other zoom levels.
 */
qxp.Class.ZOOM_BASE = null;

/** {Map} Translates levels to tile widths (in smart units / tile). */
qxp.Class.TILE_WIDTHS = null;

/** Factor for smart unit/mercator transformation. */
qxp.Class.SMART_UNIT = 4.809543;
// (In C: cSMART_UNIT = SMARTFACTOR; SMARTFACTOR = 4.809543)

/** Offset for smart unit/mercator transformation. */
qxp.Class.SMART_OFFSET = 20015087; // 1/2 Earth-circumference(PI*MERCATOR_RADIUS);
// (In C: cSMART_OFFSET)

/** The width of a tile (in pixels). */
qxp.Class.TILE_WIDTH = 256;

/** {double} Helper constant for {@link #mercator2GeoDecimal()}. */
qxp.Class.MERC_2_GEO_X_HELPER = 18000 / (6371 * Math.PI);
/** {double} Helper constant for {@link #mercator2GeoDecimal()}. */
qxp.Class.MERC_2_GEO_Y_HELPER = 36000000 / Math.PI;

/** {double} Helper constant for {@link #geoDecimal2Mercator()}. */
qxp.Class.GEO_2_MERC_X_HELPER = 63.71 * (Math.PI / 180);
/** {double} Helper constant for {@link #geoDecimal2Mercator()}. */
qxp.Class.GEO_2_MERC_Y_HELPER = Math.PI * (0.5 / 18000000);

qxp.Class.usePTVZoomLevels();
