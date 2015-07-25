/**
 * An aggregate element representing a POI.
 * <p>
 * Sample code: {@sample Client-side POIs},
 *              {@sample Custom client-side POIs}
 * 
 * @param   x {double,4355664}  the x coordinate of the POI (in smart units).
 * @param   y {double,5464867}  the y coordinate of the POI (in smart units).
 * @param   url {string,null}   the URL of the image. If it's
 *                              <code>null</code>, a default image is used.
 * @param   alignment {int,66}  the alignment of the image relative to the x
 *                              and y coordinates (see the constants in the
 *                              {@link com.ptvag.webcomponent.map.layer.VectorLayer}
 *                              class).
 * @param   tooltipContent {string,null}  the HTML content for the POI's tooltip.
 *                              If <code>null</code>, no tooltip is shown
 *                              for the POI.
 * @param   infoBoxContent {string,null}  the HTML content for the POI's info box
 *                              (shown when the POI is clicked).
 *                              If <code>null</code>, no info box is shown
 *                              for the POI.
 * @param   priority {int,0}    the priority of the POI.
 * @param   id {var,null}       the id of the POI.
 *                              If no id is specified,
 *                              a unique one is automatically generated.
 * @param   isPositionFlexible {boolean,false} Whether the position is
 *                              flexible. Flexible elements will displace
 *                              each other when they are close to another.
 */
qxp.OO.defineClass("com.ptvag.webcomponent.map.vector.POI",
com.ptvag.webcomponent.map.vector.AggregateElement,
function(x, y, url, alignment, tooltipContent, infoBoxContent,
         priority, id, isPositionFlexible) {
    var self = this;
    var map = com.ptvag.webcomponent.map;

    // hack to support old ctor syntax
    if (x != null && x instanceof map.layer.VectorLayer) {
        if (arguments.length >= 2) {
            x = arguments[1];
        } else {
            x = null;
        }
        if (arguments.length >= 3) {
            y = arguments[2];
        } else {
            y = null;
        }
        if (arguments.length >= 4) {
            url = arguments[3];
        } else {
            url = null;
        }
        if (arguments.length >= 5) {
            alignment = arguments[4];
        } else {
            alignment = null;
        }
        if (arguments.length >= 6) {
            tooltipContent = arguments[5];
        } else {
            tooltipContent = null;
        }
        if (arguments.length >= 7) {
            infoBoxContent = arguments[6];
        } else {
            infoBoxContent = null;
        }
        if (arguments.length >= 8) {
            priority = arguments[7];
        } else {
            priority = null;
        }
        if (arguments.length >= 9) {
            id = arguments[8];
        } else {
            id = null;
        }
        if (arguments.length >= 10) {
            isPositionFlexible = arguments[9];
        } else {
            isPositionFlexible = null;
        }
    }

    map.vector.AggregateElement.call(this, id);

    // create the elements that are part of the POI
    var createElements = function(vectorLayer) {
        var visibleMinZoom = self.getVisibleMinZoom();
        var visibleMaxZoom = self.getVisibleMaxZoom();
        var id = self.getId();
        var imageMarker = self.createVisibleElement();
        var markerId = imageMarker.getId();
        if (markerId == null) {
            markerId = id + "_POI_internal_ImageMarker";
            imageMarker.setId(markerId);
        }
        imageMarker.setVisibleMinZoom(visibleMinZoom);
        imageMarker.setVisibleMaxZoom(visibleMaxZoom);
        imageMarker.setMinFactor(self.getMinFactor());
        imageMarker.setMaxFactor(self.getMaxFactor());
        imageMarker.setMinZoom(self.getMinZoom());
        imageMarker.setMaxZoom(self.getMaxZoom());
        self.addElement(imageMarker);
        if (self.getTooltipContent() != null) {
            var tooltip = self.createTooltip();
            tooltip.setVisibleMinZoom(visibleMinZoom);
            tooltip.setVisibleMaxZoom(visibleMaxZoom);
            tooltip.setDependsOn(markerId);
            self.addElement(tooltip);
        }
        if (self.isPositionFlexible()) {
            var flexMarker = self.createFlexMarker(markerId);
            if (flexMarker != null) {
                flexMarker.setVisibleMinZoom(visibleMinZoom);
                flexMarker.setVisibleMaxZoom(visibleMaxZoom);
                self.addElement(flexMarker);
            }
        }
        if (self.getInfoBoxContent() != null) {
            var clickHandler = function() {
                var infoBox = self.createInfoBox();
                var infoBoxId = infoBox.getId();
                if (infoBoxId == null) {
                    infoBoxId = id + "_POI_internal";
                        // use the same id every time in order not to generate
                        // many elements for many clicks
                    infoBox.setId(infoBoxId);
                }
                infoBox.setVisibleMinZoom(visibleMinZoom);
                infoBox.setVisibleMaxZoom(visibleMaxZoom);
                infoBox.setDependsOn(markerId);
                self.addElement(infoBox);
                vectorLayer.removeOnClick(infoBoxId);
            };
            var clickArea = self.createClickArea(clickHandler);
            clickArea.setVisibleMinZoom(visibleMinZoom);
            clickArea.setVisibleMaxZoom(visibleMaxZoom);
            clickArea.setDependsOn(markerId);
            self.addElement(clickArea);
        }
    };
    

    // overridden
    var superModifyVectorLayer = self._modifyVectorLayer;
    self._modifyVectorLayer = function(propValue) {
        superModifyVectorLayer.apply(self, arguments);
        if (propValue != null) {
            createElements(propValue);
        }
    };


    // overridden
    self.refresh = function() {
        var vectorLayer = self.getVectorLayer();
        if (vectorLayer) {
            self.clear();
            createElements(vectorLayer);
        }
    };


    /**
     * Creates the visible representation of the POI. The default
     * implementation creates an instance of
     * {@link com.ptvag.webcomponent.map.vector.ImageMarker2}.
     *
     * @return  {com.ptvag.webcomponent.map.vector.VectorElement}
     *              the newly created element.
     */
    self.createVisibleElement = function() {
        return new map.vector.ImageMarker2(self.getX(), self.getY(),
            self.getUrl(), self.getAlignment(), self.getPriority(), null,
            self.isPositionFlexible());
    };


    /**
     * Creates the tooltip for the POI. This method is only called if the
     * {@link #tooltipContent tooltipContent} property is not
     * <code>null</code>. The default implementation creates an instance of
     * {@link com.ptvag.webcomponent.map.vector.Tooltip}.
     *
     * @return  {com.ptvag.webcomponent.map.vector.VectorElement}
     *              the newly created element.
     */
    self.createTooltip = function() {
        return new map.vector.Tooltip(self.getX(), self.getY(), null,
            self.getTolerance(), self.getTooltipContent(), self.getAlignment(),
            self.getPriority(), null, self.isPositionFlexible());
    };


    /**
     * Creates the click area for the POI. This method is only called if the
     * {@link #infoBoxContent infoBoxContent} property is not
     * <code>null</code>. The default implementation creates an instance of
     * {@link com.ptvag.webcomponent.map.vector.ClickArea}.
     *
     * @param   clickHandler {function}     the click handler for the click
     *                                      area.
     *
     * @return  {com.ptvag.webcomponent.map.vector.VectorElement}
     *              the newly created element.
     */
    self.createClickArea = function(clickHandler) {
        return new map.vector.ClickArea(self.getX(), self.getY(), null,
            self.getTolerance(), clickHandler, self.getPriority(), null,
            self.isPositionFlexible());
    };


    /**
     * Creates the info box that is shown when the POI is clicked. This method
     * is only called if the {@link #infoBoxContent infoBoxContent} property is
     * not <code>null</code>. The default implementation creates an instance of
     * {@link com.ptvag.webcomponent.map.vector.InfoBox}.
     *
     * @return  {com.ptvag.webcomponent.map.vector.VectorElement}
     *              the newly created element.
     */
    self.createInfoBox = function() {
        return new map.vector.InfoBox(self.getX(), self.getY(),
            self.getInfoBoxContent(), self.getAlignment(), self.getPriority(),
            null, self.isPositionFlexible());
    };


    /**
     * Creates a marker from the visible POI element to the original POI
     * location (in case the visible element has been moved away because of a
     * collision). The flex marker should have a lower priority than the
     * visible element (e.g. <code>this.getPriority() - 1</code>). The default
     * implementation creates an instance of
     * {@link com.ptvag.webcomponent.map.vector.FlexMarkerArrow}.
     *
     * @param   visibleElementId {var}  the id of the visible element for the
     *                                  POI (needs to be passed to the flex
     *                                  marker constructor).
     *
     * @return  {com.ptvag.webcomponent.map.vector.VectorElement}
     *              the newly created element or <code>null</code> if not flex
     *              marker should be shown.
     */
    self.createFlexMarker = function(visibleElementId) {
        return new map.vector.FlexMarkerArrow(
            visibleElementId, self.getPriority() - 1);
    };


    if (x != null) {
        self.setX(x);
    }
    if (y != null) {
        self.setY(y);
    }
    if (url != null) {
        self.setUrl(url);
    }
    if (alignment != null) {
        self.setAlignment(alignment);
    }
    if (tooltipContent != null) {
        self.setTooltipContent(tooltipContent);
    }
    if (infoBoxContent != null) {
        self.setInfoBoxContent(infoBoxContent);
    }
    if (priority != null) {
        self.setPriority(priority);
    }
    if (isPositionFlexible != null) {
        self.setPositionFlexible(isPositionFlexible);
    }

    self.refreshOn("x", "y", "url", "alignment", "tooltipContent", "infoBoxContent", "tolerance");
});


/** The x coordinate of the POI (in smart units). */
qxp.OO.addProperty({ name:"x", type:qxp.constant.Type.NUMBER, allowNull:false, defaultValue:4355664 });
/** The y coordinate of the POI (in smart units). */
qxp.OO.addProperty({ name:"y", type:qxp.constant.Type.NUMBER, allowNull:false, defaultValue:5464867 });

/**
 * The URL of the image (if <code>null</code>, a default image is used).
 */
qxp.OO.addProperty({ name:"url", type:qxp.constant.Type.STRING, allowNull:true });

/**
 * The alignment of the image relative to the x and y coordinates (see the
 * constants in the {@link com.ptvag.webcomponent.map.layer.VectorLayer}
 * class).
 */
qxp.OO.addProperty({ name:"alignment", type:qxp.constant.Type.NUMBER, allowNull:false, defaultValue:66 });

/**
 * The HTML content for the POI's tooltip. If <code>null</code>, no tooltip is
 * shown for the POI.
 */
qxp.OO.addProperty({ name:"tooltipContent", type:qxp.constant.Type.STRING, allowNull:true });

/**
 * The HTML content for the POI's info box. If <code>null</code>, no info box is
 * shown for the POI.
 */
qxp.OO.addProperty({ name:"infoBoxContent", type:qxp.constant.Type.STRING, allowNull:true });

/**
 * The tolerance for the tooltip and the click area.
 */
qxp.OO.addProperty({ name:"tolerance", type:qxp.constant.Type.NUMBER, allowNull:false, defaultValue:7 });
