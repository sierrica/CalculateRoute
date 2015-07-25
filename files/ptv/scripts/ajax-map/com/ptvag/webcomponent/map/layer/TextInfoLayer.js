/**
 * A base class for layers displaying floating textual information.
 */
qxp.OO.defineClass("com.ptvag.webcomponent.map.layer.TextInfoLayer",
com.ptvag.webcomponent.map.layer.AbstractStaticAreaLayer,
function() {
    com.ptvag.webcomponent.map.layer.AbstractStaticAreaLayer.call(this);

    var self = this;


    // overridden
    var superInit = self.init;
    self.init = function() {
        superInit.apply(self, arguments);
        
        // initialize the mouse coordinates (relative to the upper-left map
        // corner)
        self.setLastMousePos({x:0, y:0});
        
        // create the main div
        var areaElem = document.createElement("div");
        areaElem.style.position = "absolute";
        areaElem.style.left = "0px";
        areaElem.style.top = "0px";
        areaElem.style.fontName = "Arial";
        areaElem.style.fontSize = "10px";
        areaElem.style.color = "black";
        self.getParentElement().appendChild(areaElem);
        self.setAreaElement(areaElem);
    };


    // overridden
    var superOnMouseMove = self.onMouseMove;
    self.onMouseMove = function(evt) {
        superOnMouseMove(evt);

        if (self.getAreaElement() != null) {
            self.setLastMousePos({x:evt.relMouseX, y:evt.relMouseY});
            self.updateView();
        }
        return false;
    };


    // overridden
    self.onViewChanged = function(evt) {
        if (self.getAreaElement() != null) {
            self.updateView();
        }
    };


    /**
     * To be overridden by sub classes to show their information (usually by
     * calling <code>getAreaElement()</code> and appending DOM elements to it).
     */
    self.updateView = function() {
        throw new Error("updateView is abstract");
    };

});

// overridden
qxp.OO.changeProperty({ name:"areaOpacity", type:qxp.constant.Type.NUMBER, defaultValue:1 });

/** Contains the last known mouse position. */
qxp.OO.addProperty({ name:"lastMousePos" });
