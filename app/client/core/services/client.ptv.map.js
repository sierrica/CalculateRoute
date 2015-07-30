
angular.module('calculateRoute').factory('PTV', function() {
        var first = true;
        var map;

        return {
            getMap: function(container, container_hide) {
                if (first) {
                    first = false;
                    com.ptvag.webcomponent.map.RequestBuilder.X_TOKEN = 204109275126088;
                    com.ptvag.webcomponent.map.Map.USE_TOOLBAR = false;
                    com.ptvag.webcomponent.map.Map.USE_ZOOM_SLIDER = false;
                    com.ptvag.webcomponent.map.MapController.DEFAULT_ACTION_MODE = com.ptvag.webcomponent.map.MapController.ACTION_MODE_MOVE;
                    $("#mapContainer").css("width", $("#mapContainer").parent().width());
                    $("#mapContainer").css("height", window.innerHeight - 50);
                    map = new com.ptvag.webcomponent.map.Map(document.getElementById("mapContainer"));
                    window.onresize = function () {
                        $("#mapContainer").css("width", $("#mapContainer").parent().width());
                        $("#mapContainer").css("height", window.innerHeight - 50);
                        map.updateSize();
                    };
                    map.setEnableKeyboardControl(true);
                    map.removeLayer("compass");
                    map.removeLayer("scale");


                    return map;
                }
                else {
                    $("#mapContainerHide").children().first().appendTo ("#mapContainer");
                    $("#mapContainer").css ("width", $("#mapContainer").parent().width());
                    $("#mapContainer").css ("height", window.innerHeight - 50);
                    map.updateSize();
                    return map;
                }
            }
        }
    }
);
