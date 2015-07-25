/**
 * A layer showing a text string.
 */
qxp.OO.defineClass("com.ptvag.webcomponent.map.layer.TextLayer",
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
            areaElem.innerHTML = '<div style="margin-left:' +
                self.getMarginLeft() + 'px;margin-right:' +
                self.getMarginRight() + 'px;margin-top:' +
                self.getMarginTop() + 'px;margin-bottom:' +
                self.getMarginBottom() + 'px;white-space:nowrap">' +
                self.getText() + '</div>';

            var width  = areaElem.offsetWidth;
            var height = areaElem.offsetHeight;
            self.setAreaWidth(width);
            self.setAreaHeight(height);
            self.positionArea();
        }
    };


    // overridden
    self.doPrintStaticArea = function(ctx, htmlContainer, htmlBackground) {
        var areaBorderWidth = self.getAreaBorderWidth();
        var left = self.getComputedAreaLeft();
        var top = self.getComputedAreaTop();
        var width = self.getComputedAreaWidth();
        var height = self.getComputedAreaHeight();
        ctx.strokeStyle = "rgb(128, 128, 128)";
        ctx.lineWidth = areaBorderWidth;
        ctx.fillStyle = "rgb(255, 255, 255)";
        ctx.beginPath();
        ctx.rect(left, top, width, height);
        ctx.fill();
        ctx.beginPath();
        ctx.rect(parseInt(left + areaBorderWidth/2), parseInt(top + areaBorderWidth/2),
                 width - areaBorderWidth, height - areaBorderWidth);
        ctx.stroke();
        ctx.strokeStyle = "rgb(0, 0, 0)";
        ctx.fontFamily = "sans-serif";
        ctx.fontStyle = "plain";
        ctx.fontSize = 10;
        ctx.textAlignment = 34;
        ctx.drawText(self.getText(),
                     Math.round(left + width/2), Math.round(top + height/2));
    };

});

// overridden
qxp.OO.changeProperty({ name:"areaOpacity", type:qxp.constant.Type.NUMBER, defaultValue:0.8 });

// overridden
qxp.OO.changeProperty({ name:"areaBorderWidth", type:qxp.constant.Type.NUMBER, defaultValue:1 });

/** The text to show. */
qxp.OO.addProperty({ name:"text", type:qxp.constant.Type.STRING, allowNull:false, defaultValue:"" });

/** The left margin. */
qxp.OO.addProperty({ name:"marginLeft", type:qxp.constant.Type.NUMBER, defaultValue:3 });

/** The right margin. */
qxp.OO.addProperty({ name:"marginRight", type:qxp.constant.Type.NUMBER, defaultValue:3 });

/** The top margin. */
qxp.OO.addProperty({ name:"marginTop", type:qxp.constant.Type.NUMBER, defaultValue:0 });

/** The bottom margin. */
qxp.OO.addProperty({ name:"marginBottom", type:qxp.constant.Type.NUMBER, defaultValue:1 });
