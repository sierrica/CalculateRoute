/**
 * A layer showing a piece of HTML.
 */
qxp.OO.defineClass("com.ptvag.webcomponent.map.layer.LabelLayer",
com.ptvag.webcomponent.map.layer.AbstractStaticAreaLayer,
function() {
    com.ptvag.webcomponent.map.layer.AbstractStaticAreaLayer.call(this);

    var self = this;


    // overridden
    var superInit = self.init;
    self.init = function() {
        superInit.apply(self, arguments);
        
        // Create the main div
        var areaElem = self.getParentElement();
        areaElem.style.border = self.getAreaBorderWidth() + "px solid gray";
        areaElem.style.backgroundColor = "white";
        areaElem.style.fontFamily = "Verdana,Arial,sans-serif";
        areaElem.style.fontSize = "10px";

        self.setAreaElement(areaElem);

        if (self.isEnabled()) {
            updateContent();
        }
    };


    // property modifier
    self._modifyText = function() {
        updateContent();
    };


    var updateContent = function() {
        var areaElem = self.getAreaElement();
        if (areaElem != null) {
            areaElem.style.width = "";
            areaElem.style.height = "";
            areaElem.innerHTML = self.getText();

            var width  = areaElem.offsetWidth;
            var height = areaElem.offsetHeight;
            self.setAreaWidth(width);
            self.setAreaHeight(height);
            self.positionArea();
        }
    };

});

// overridden
qxp.OO.changeProperty({ name:"areaOpacity", type:qxp.constant.Type.NUMBER, defaultValue:0.8 });

// overridden
qxp.OO.changeProperty({ name:"areaBorderWidth", type:qxp.constant.Type.NUMBER, defaultValue:1 });

/** The HTML to show. */
qxp.OO.addProperty({ name:"text", type:qxp.constant.Type.STRING, allowNull:false, defaultValue:"" });
