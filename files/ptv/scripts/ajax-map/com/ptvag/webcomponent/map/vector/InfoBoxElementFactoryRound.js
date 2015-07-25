/**
 * A factory for creating info box elements (a container with a tip so you know
 * at what coordinates the anchor point is). These elements are used by the
 * {@link InfoBox} and {@link Tooltip} classes. The
 * <code>InfoBoxElementFactoryRound</code> creates boxes with round corners.
 * <p>
 * By default, {@link InfoBoxElementFactoryDefault} is used (with rectangular
 * corners). To activate the round corner version, use this code:
 * <code>com.ptvag.webcomponent.map.vector.InfoBoxElementFactory =
 * com.ptvag.webcomponent.map.vector.InfoBoxElementFactoryRound.getInstance();</code>
 * </p>
 * <p>
 * To change any properties of the active factory, use code like this:
 * <code>com.ptvag.webcomponent.map.vector.InfoBoxElementFactory.setPaddingLeft("2px");</code>
 * </p>
 */
qxp.OO.defineClass("com.ptvag.webcomponent.map.vector.InfoBoxElementFactoryRound",
                  com.ptvag.webcomponent.map.vector.InfoBoxElementFactoryDefault,
function() {
    com.ptvag.webcomponent.map.vector.InfoBoxElementFactoryDefault.call(this);
    
    var self = this;

    self.setTipMargin(6);
    

    /**
     * "Draws" a rounded corner. This method is intended to be overridden by
     * sub classes, but the signature might change in the future, so you
     * shouldn't override it yet.
     *
     * @param   lengthArray {var}   subject to change, no documentation yet.
     * @param   bgcolor {var}       subject to change, no documentation yet.
     * @param   opacities {var}     subject to change, no documentation yet.
     * @param   color {var}         subject to change, no documentation yet.
     * @param   flipH {var}         subject to change, no documentation yet.
     * @param   flipV {var}         subject to change, no documentation yet.
     */
    
    self.createRoundCorner = function(lengthArray, bgcolor,
                                      opacities, color,
                                      flipH, flipV) {
        var size = lengthArray.length;
        var count = opacities.length;
        retVal = new Array(size + count + 2);
        retVal[0] = '<div style="background-color:transparent;width:' + size +
                    'px;height:' + size + 'px;position:relative">';
        for (var i = 0; i < size; ++i) {
            var length = lengthArray[flipV ? (size - i - 1) : i];
            retVal[i + 1] = '<div style="border-top:1px solid ' + bgcolor +
                            ';position:absolute;top:' + i +
                            'px;left:' + (flipH ? 0 : (size - length)) +
                            'px;width:' + length +
                            'px;height:0px"></div>';
        }

        var clientInstance = qxp.sys.Client.getInstance();
        for (i = 0; i < count; ++i) {
            var opacity = opacities[i];
            if (opacity.o == 1) {
                var opacityCSS = "";
            } else {
                if (clientInstance.isGecko()) {
                    opacityCSS = "-moz-opacity:" + opacity.o + ";";
                } else if (clientInstance.isKhtml()) {
                    opacityCSS = "-khtml-opacity:" + opacity.o + ";";
                } else if (qxp.sys.Client.getInstance().isMshtml()) {
                    opacityCSS = "filter:alpha(opacity=" + opacity.o*100 + ");";
                } else {
                    opacityCSS = "opacity:" + opacity.o + ";";
                }
            }
            retVal[i + 1 + size] = '<div style="' + opacityCSS +
                                   'border-top:1px solid ' + color +
                                   ';position:absolute;left:' +
                                   (flipH ? (size - opacity.x - opacity.w) : opacity.x) +
                                   'px;top:' +
                                   (flipV ? (size - opacity.y - 1) : opacity.y) +
                                   'px;width:' + opacity.w +
                                   'px;height:0px"></div>';
        }
        retVal[size + count + 1] = '</div>';
        return retVal.join("");
    };


    // overridden
    self.createContentBox = function(content, bgcolor, allowWrap) {
        if (allowWrap == null) {
            allowWrap = self.getAllowWrap();
        }
        var paddingLeft = self.getPaddingLeft();
        var paddingRight = self.getPaddingRight();
        var paddingTop = self.getPaddingTop();
        var paddingBottom = self.getPaddingBottom();

        var lengthArray = [3, 5, 5, 6, 6, 6];
        var opacities = [{x:1,y:0,o:0.2,w:1}, {x:2,y:0,o:0.4,w:1},
                         {x:3,y:0,o:1.0,w:3}, {x:0,y:1,o:0.2,w:1},
                         {x:1,y:1,o:0.8,w:1}, {x:2,y:1,o:1.0,w:1},
                         {x:3,y:1,o:0.4,w:1}, {x:4,y:1,o:0.2,w:1},
                         {x:0,y:2,o:0.4,w:1}, {x:1,y:2,o:1.0,w:1},
                         {x:2,y:2,o:0.2,w:1}, {x:0,y:3,o:1.0,w:1},
                         {x:1,y:3,o:0.4,w:1}, {x:0,y:4,o:1.0,w:1},
                         {x:1,y:4,o:0.2,w:1}, {x:0,y:5,o:1.0,w:1}];
        // FIXME: make these static vars
        var borderColor = "#7f7f7f";
        var filler = '<span style="display:block;width:1px;height:1px"></span>';

        return '<td><table cellpadding="0" cellspacing="0"><tr>' +
               '<td>' + self.createRoundCorner(lengthArray, bgcolor,
                                               opacities, borderColor,
                                               false, false) + '</td>' +
               '<td bgcolor="' + bgcolor + '" style="border-top:1px solid ' +
               borderColor + ';font-size:2px">' + filler +
               '</td><td>' + self.createRoundCorner(lengthArray, bgcolor,
                                                    opacities, borderColor,
                                                    true, false) +
               '</td></tr><tr>' +
               '<td bgcolor="' + bgcolor + '" style="border-left:1px solid ' +
               borderColor + ';font-size:2px">' + filler + '</td>' +
               '<td bgcolor="' + bgcolor + '" style="' +
               'padding-left:' + paddingLeft +
               ';padding-right:' + paddingRight +
               ';padding-top:' + paddingTop +
               ';padding-bottom:' + paddingBottom +
               (allowWrap ? '' : ';white-space:nowrap') + '">' + content +
               '</td><td bgcolor="' + bgcolor + '" style="border-right:1px solid ' +
               borderColor + ';font-size:2px">' + filler +
               '</td></tr><tr>' +
               '<td>' + self.createRoundCorner(lengthArray, bgcolor,
                                               opacities, borderColor,
                                               false, true) + '</td>' +
               '<td bgcolor="' + bgcolor + '" style="border-bottom:1px solid ' +
               borderColor + ';font-size:2px">' + filler +
               '</td><td>' + self.createRoundCorner(lengthArray, bgcolor,
                                                    opacities, borderColor,
                                                    true, true) +
               '</td></tr></table></td>';
    };
    
});


/**
 * Returns the single instance of this class.
 *
 * @return  {InfoBoxElementFactoryRound}    the instance.
 */
qxp.Class.getInstance = function() {
    var vector = com.ptvag.webcomponent.map.vector;
    var myClass = vector.InfoBoxElementFactoryRound;
    if (myClass.instance == null) {
        myClass.instance =
            new vector.InfoBoxElementFactoryRound();
    }
    return myClass.instance;
}
