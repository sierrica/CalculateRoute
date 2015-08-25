app.controller ('HeaderController', ['$scope', '$auth', 'Sidenav', function($scope, $auth, Sidenav) {
    console.log ("DENTRO CONTROLADOR HEADER");

    $scope.isAuthenticated = function() {
        return $auth.isAuthenticated();
    };

    $scope.close_sidenav = function ($event) {
        Sidenav.close_sidenav ($event)
    };

    $scope.dropdown = function ($event) {
        Sidenav.dropdown($event);
    };

    $scope.change_layer = function () {
    };


    $scope.collapsing = false;
    $scope.button_collapse = function () {
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
    };


    $scope.findDirection = function() {
       alert($scope.direction);
    };



}]);
