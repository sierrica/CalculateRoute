app.controller ('PtvController', function ($rootScope, $scope, $location, $auth, $http, User, $translate) {

    console.log ("DENTRO PTV CONTROLLER");

    var that = $scope;




    $("span[contenteditable='true']").keydown (function(e) {
        if(e.keyCode == 13){
            e.preventDefault();
        }
    });


    $scope.changeSlider = function(id) {
        console.log ($('#' + id).val());
        $('input[for="' + id + '"]').val ($scope.tollroads);
        $('#js-rangeslider-0').value = $scope.tollroads;
        //$('#js-rangeslider-0').update();
    };


    $scope.trayect = {
        tollroads: parseInt (trayect.tollroads),
        highways: parseInt (trayect.highways)
    };


    var format_extremes = function (identifier, value) {
        if (value == -99)
            $("#" + identifier + ' .rangeslider__handle').css ("background-image", "url('images/prohibited.png')");
        else if (value == 2501)
            $("#" + identifier + ' .rangeslider__handle').css ("background-image", "url('images/obligation.png')");
        else
            $("#" + identifier + ' .rangeslider__handle').css ("background-image", "url('data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4gPHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJncmFkIiBncmFkaWVudFVuaXRzPSJvYmplY3RCb3VuZGluZ0JveCIgeDE9IjAuNSIgeTE9IjAuMCIgeDI9IjAuNSIgeTI9IjEuMCI+PHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iIzAwMDAwMCIgc3RvcC1vcGFjaXR5PSIwLjEzIi8+PHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjZmZmZmZmIiBzdG9wLW9wYWNpdHk9IjAuMCIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxyZWN0IHg9IjAiIHk9IjAiIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JhZCkiIC8+PC9zdmc+IA==')");

    };

    var format_background = function (identifier, value) {
        if (value < 0)
            $("#" + identifier).css ("background", "rgba(255, 0, 0, " + Math.abs(value) / 100 + ")");
        else if (value > 0)
            $("#" + identifier).css ("background", "rgba(0, 255, 0, " + Math.abs(value) / 25 / 100 + ")");
        else
            $("#" + identifier).css ("background", "#D2D3CB");
    };

    $scope.rangeSlider = function(id) {
        console.log ($scope);
        var id_escaped = id.replace(/(:|\.|\[|\])/g, "\\$1");
        var type_option = id.split(".")[0];
        var option = id.split(".")[1];
        var scope_type_option = $scope[type_option];
        var scope_option_value = scope_type_option[option];
        $('input[for="' + id_escaped + '"]').val (scope_option_value);                    // Como no se acceder a nested
        console.log ("SCOPE ID: " + $scope[id])
        var range_slider = $('input[for="' + id_escaped + '"]').rangeslider ({
            polyfill: false,            // Deactivate the feature detection
            update: true,

            onInit: function() {
                this.update();
                console.log (this)
                format_background (this.identifier, this.value);
                format_extremes (this.identifier, this.value);
                var slider = this;


                $('#' + id_escaped).on ('input', function(ev) {
                    console.log ("DENTRO EVENTO")
                    var value = $(ev.currentTarget).val();
                    slider.value = value;
                    slider.update();
                    format_background (slider.identifier, slider.value);
                    format_extremes (slider.identifier, slider.value);
                });
                /*setTimeout(function(){
                    $('#' + id_escaped).trigger('input');
                }, 50);*/
            },
            onSlide: function (position, value) {
                format_background (this.identifier, this.value);
                format_extremes (this.identifier, this.value);
            },
            onSlideEnd: function (position, value) { }
        });
    };

});
