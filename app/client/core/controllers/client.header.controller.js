angular.module('calculateRoute').controller('HeaderController', ['$rootScope', '$scope', '$state', '$auth',
	function($rootScope, $scope, $state, $auth) {
		console.log ("DENTRO CONTROLADOR HEADER");


		$scope.sidenav = function (event) {
			if (window.innerWidth <= 992)
				$('.button-collapse').sideNav('hide');
		};


        $( window ).resize(function() {
            console.log ($("#slide-out").css("left"));
            if (window.innerWidth > 992) {
                if ($("#slide-out").css("left") != "0px") {
                    $(".button-collapse i").text("menu");
                }
            }
        });


        $scope.collapsing = false;
		$scope.button_collapse = function () {

            if (! $scope.collapsing) {
                console.log ($("#slide-out").css("left"));
                var anchura_menu_inicial = parseFloat ($("#slide-out").css("left"));
                console.log (anchura_menu_inicial);
                $scope.collapsing = true;
                that = $scope;
                setTimeout (function() {
                    var anchura_menu_actual = parseFloat ($("#slide-out").css("left"));
                    if (anchura_menu_inicial < anchura_menu_actual)
                        $(".button-collapse i").text("arrow_back");
                    else
                        $(".button-collapse i").text("menu");
                    that.collapsing = false;
                    that.$apply();
                    //$('#sidenav-overlay').trigger('click');       // provocar cerrar el menu
                }, 350);
            }
		};




 /*

		$scope.isAuthenticated = function() {
            return $auth.isAuthenticated();
        };

		$scope.logut = function() {
            console.log ("DENTRO");
			$scope.logut = function() {
				if (!$auth.isAuthenticated()) {
                    console.log ("FALLO");
					return;
                }
				$auth.logout()
				.then(function() {
					console.log ("DESAUTENTICADO");
				});
			};
		};
 */
	}
]);
