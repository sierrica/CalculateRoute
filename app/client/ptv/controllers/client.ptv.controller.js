app.controller ('PtvController', function ($rootScope, $scope, $location, $auth, $http, User, $translate, Ptv) {

    console.log ("DENTRO PTV CONTROLLER");

    var that = $scope;




    $scope.toolTipster = function (id) {
        var id_escaped = id.replace(/(:|\.|\[|\])/g, "\\$1");
        $("#" + id_escaped).closest("div.row").find('.tooltip').tooltipster ({
            position: 'top',
            animation: 'fade',
            delay: 100,
            theme: 'tooltipster-default',
            //theme: 'tooltipster-shadow',
            touchDevices: true,
            trigger: 'hover',
            hideOnClick: false,     // Importante, sino en movil, CRASH
            contentAsHTML: true,
            maxWidth: 250,
            offsetX: 0,
            offsetY: -5
        });
        console.log ("TOLLTIP")
    }

        console.log ("OPCIONES AL COMIENZO");
        console.log (options)

        if ( ! _.isEmpty(options)) {
            $scope.dinamic_route = options.trayect.dinamic_route;
            $scope.tollroads = parseInt (options.trayect.tollroads);
            $('input[for=tollroads]').val($scope.tollroads).change();

            $scope.highways = parseInt (options.trayect.highways);
            $('input[for=highways]').val($scope.highways).change();

            $scope.height = parseInt (options.vehicle.height);
            $scope.width = parseInt (options.vehicle.width);

            $scope.manoeuvres = options.details.manoeuvres;
        }

        $rootScope.$on ('myoptions', function (event) {
            var options_update = Ptv.getOptions ();

            $scope.dinamic_route = options_update.trayect.dinamic_route;
            $scope.tollroads = parseInt (options_update.trayect.tollroads);
            $('input[for=tollroads]').val($scope.tollroads).change();
            $scope.highways = parseInt (options_update.trayect.highways);
            $('input[for=highways]').val($scope.highways).change();

            $scope.height = parseInt (options_update.vehicle.height);
            $scope.width = parseInt (options_update.vehicle.width);

            $scope.manoeuvres = options_update.details.manoeuvres;
        });



        //console.log ("scope.width: " + $scope.width)
        //console.log ("dinamic route: " + options.trayect.dinamic_route)


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
            $("#" + identifier).css ("background", "rgba(0, 255, 0, " + (value / 25 / 100) + ")");
        else
            $("#" + identifier).css ("background", "#D2D3CB");
    };

    $scope.rangeSlider = function(id) {
        var range_slider = $('input[for="' + id + '"]').rangeslider ({
            polyfill: false,            // Deactivate the feature detection
            update: true,
            onInit: function() {
                format_background (this.identifier, this.value);
                format_extremes (this.identifier, this.value);
                var slider = this;
                $('#' + id).on ('input', function(ev) {
                    var value = $(ev.currentTarget).val();
                    slider.value = value;
                    slider.update();
                    format_background (slider.identifier, slider.value);
                    format_extremes (slider.identifier, slider.value);
                });
            },
            onSlide: function (position, value) {
                format_background (this.identifier, this.value);
                format_extremes (this.identifier, this.value);
            },
            onSlideEnd: function (position, value) { }
        });
    };
});
