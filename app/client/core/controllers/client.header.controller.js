app.controller ('HeaderController', function($rootScope, $scope, $http, $translate, $auth, Sidenav, Map) {

    $scope.isAuthenticated = function() {
        return $auth.isAuthenticated();
    };

    $scope.close_sidenav = function ($event) {
        Sidenav.close_sidenav ($event)
    };

    $scope.dropdown = function ($event) {
        Sidenav.dropdown($event);
    };

    $scope.collapsing = false;
    $scope.button_collapse = function () {
         var anchura_menu_inicial = parseFloat ($("#slide-out").css("left"));
         setTimeout (function() {
             var anchura_menu_actual = parseFloat ($("#slide-out").css("left"));
             if (anchura_menu_inicial < anchura_menu_actual) {
                 $(".button-collapse i").text ("arrow_back");
                 $("#search").parent().css ("z-index", "-1");
                 $("#search").parent().css ("opacity", "0");
             }
             else {
                 $(".button-collapse i").text ("menu");
                 $("#search").parent().css ("z-index", "0");
                 $("#search").parent().css ("opacity", "1");
                 while($("#sidenav-overlay")[0] )
                     $("#sidenav-overlay").remove();

             }
        }, 350);
/*
        if (! $scope.collapsing) {
            $scope.collapsing = true;
            var anchura_menu_inicial = parseFloat ($("#slide-out").css("left"));
            that = $scope;
            setTimeout (function() {
                var anchura_menu_actual = parseFloat ($("#slide-out").css("left"));
                if (anchura_menu_inicial < anchura_menu_actual) {
                    $(".button-collapse i").text ("arrow_back");
                    $('.drag-target').css ("width", "calc(100% - 300px)");
                    $("#search").parent().css ("z-index", "-1");
                    $("#search").parent().css ("opacity", "0");
                }
                else {
                    $(".button-collapse i").text ("menu");
                    $('.drag-target').css ("width", "10px");
                    $("#search").parent().css ("z-index", "0");
                    $("#search").parent().css ("opacity", "1");
                }
                that.collapsing = false;
                that.$apply();
            }, 350);
        }
        */
    };




    $scope.directions = [{ text: "ningun resultado" }];
    $scope.findDirection = function() {
        var that = $scope;
        $http.post ('/ptv/findaddress', { address: $scope.direction })
        .success (function(response) {
            var direcciones = [];
            for (i=0; i<response.result.length; i++)
                direcciones.push ({
                    direction: response.result[i],
                    text: Map.formatDirPopup(response.result[i])
                });
            that.directions = direcciones;
        })
        .error (function(response, status) {
            console.log ("ERROR");
        });
    };

    $scope.blurDirection = function () {
        $('#search').val('').parent().css('z-index', '0');
        $('#search_table').fadeOut (800);
    };
    $scope.focusDirection = function () {
        $('#search').val($scope.direction).parent().css('z-index', '999').css('opacity', '1');
        $('#search_table').fadeIn (800);
    };

    $scope.selectDirection = function (index) {
        var latlng = {
            lng: $scope.directions[index].direction.coord_x_response,
            lat: $scope.directions[index].direction.coord_y_response
        }
        if ($scope.circulo_direction)
            Map.getMap().removeLayer($scope.circulo_direction);
        var that = $scope;
        $scope.circulo_direction = L.circle (latlng, 3, {
            stroke: true,
            color: 'blue',
            weight: 25,
            opacity: 0.5,
            fill: true,
            fillColor: 'blue',
            fillOpacity: 1,
            fillRule: 'evenodd',
            dashArray: null,
            lineCap: null,
            lineJoin: null,
            clickable: true,
            pointerEvents: null,
            className: '',                 // custom class
        }).on ('click', function(ev) {
            Map.getMap().removeLayer(that.circulo_direction);
        }).addTo (Map.getMap().setView(latlng), 15);
    };
});
