
angular.module('calculateRoute').factory('Map', function() {
        com.ptvag.webcomponent.map.Map.USE_TOOLBAR = false;
        com.ptvag.webcomponent.map.Map.USE_ZOOM_SLIDER = false;
        com.ptvag.webcomponent.map.MapController.DEFAULT_ACTION_MODE = com.ptvag.webcomponent.map.MapController.ACTION_MODE_MOVE;
        var first = true;
        var map;
        var html_map;




        return {
            getMap: function(container, container_hide) {
                if (first) {
                    angular.element(document).ready(function () {
                        setTimeout(function() {
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

                            first = false;
                            return map;
                        }, 1500);
                    });
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