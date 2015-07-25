/**
 * A layer showing an image.
 *
 * @param imgUrl {string} the URL of the image.
 */
qxp.OO.defineClass("com.ptvag.webcomponent.map.layer.ImageLayer", com.ptvag.webcomponent.map.layer.AbstractStaticAreaLayer,
function(imgUrl) {
    com.ptvag.webcomponent.map.layer.AbstractStaticAreaLayer.call(this);

    var self = this;

    var map = com.ptvag.webcomponent.map;
    
    var mImgElem;


    var positionImage = function() {
        if (mImgElem == null) {
            return;
        }
        if (self.getAutoRotate()) {
            if (mImgElem.style.visibility != "hidden") {
                var areaWidth = self.getAreaWidth();
                var areaHeight = self.getAreaHeight();
                var computedAreaWidth = self.getComputedAreaWidth();
                var computedAreaHeight = self.getComputedAreaHeight();
                mImgElem.style.left = (computedAreaWidth - areaWidth)/2 + "px";
                mImgElem.style.top =
                    (computedAreaHeight - areaHeight)/2 + "px";
            }
        } else {
            mImgElem.style.left = "0px";
            mImgElem.style.top = "0px";
        }
    };


    // overridden
    var superInit = self.init;
    self.init = function() {
        superInit.apply(self, arguments);
        
        // Create the main div
        var areaElem = self.getParentElement();
        areaElem.style.fontSize = "1px";
        self.setAreaElement(areaElem);

        mImgElem = document.createElement("img");
        mImgElem.style.visibility = "hidden";
        mImgElem.style.position = "absolute";
        mImgElem.style.left = "0px";
        mImgElem.style.top = "0px";
        areaElem.appendChild(mImgElem);

        map.ImageLoader.loadImage(mImgElem, imgUrl, function(elem, url, exc) {
            if (exc == null && !self.getDisposed()) {
                var width = mImgElem.offsetWidth;
                var height = mImgElem.offsetHeight;
                self.setAreaWidth(width);
                self.setAreaHeight(height);
                self.positionArea();
                mImgElem.style.visibility = "";
                positionImage();
            }
        }, 1000);
    };


    // overridden
    var superPositionArea = self.positionArea;
    self.positionArea = function(evt) {
        superPositionArea.apply(self, arguments);
        positionImage();
    };


    // overridden
    self.doPrintStaticArea = function(ctx, htmlContainer, htmlBackground) {
        if (mImgElem.style.visibility != "hidden") {
            var width = self.getAreaWidth();
            var height = self.getAreaHeight();
            ctx.drawImage(mImgElem, 0, 0, width, height,
                self.getComputedAreaLeft() + parseInt(mImgElem.style.left),
                self.getComputedAreaTop() + parseInt(mImgElem.style.top),
                width, height);
        }
    };
    
    
    // overridden
    var superDispose = self.dispose;
    self.dispose = function() {
        if (self.getDisposed()) {
            return;
        }
        mImgElem = null;
        superDispose.call(self);
    };

});

// overridden
qxp.OO.changeProperty({ name:"areaOpacity", type:qxp.constant.Type.NUMBER, defaultValue:0.5 });
