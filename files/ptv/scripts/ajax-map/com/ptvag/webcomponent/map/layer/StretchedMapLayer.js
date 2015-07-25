/**
 * A layer showing a stretched map using a single image. When the image needs an update,
 * the new image is requested in the background and will replace the current
 * one when loading completed.
 *
 * @param requestBuilder {RequestBuilder} The RequestBuilder to use for loading
 *        map images.
 */
qxp.OO.defineClass("com.ptvag.webcomponent.map.layer.StretchedMapLayer",
com.ptvag.webcomponent.map.layer.SimpleMapLayer,
function(requestBuilder) {
    com.ptvag.webcomponent.map.layer.SimpleMapLayer.call(this, requestBuilder);

    var self = this;

    var superPositionImage = self.positionImage;
    self.positionImage = function(imgInfo, dontChangeVisibility) {
        if (imgInfo.loaded != null) {
            // only update width and height if we have a loaded image or
            // a valid running request
            var areaWidth  = self.getComputedAreaWidth();
            var areaHeight = self.getComputedAreaHeight();
    
            imgInfo.width = areaWidth;
            imgInfo.height = areaHeight;
        }
        superPositionImage.call(self, imgInfo, dontChangeVisibility);
    };

});
