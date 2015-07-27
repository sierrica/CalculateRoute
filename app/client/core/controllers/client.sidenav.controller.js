angular.module('calculateRoute').controller('SidenavController', ['$rootScope', '$scope', '$state', '$auth',
    function($rootScope, $scope, $state, $auth) {

        $scope.close_sidenav = function (event) {
            if ($('.button-collapse').is(':visible'))
                $('.button-collapse').sideNav('hide');
        };

        $rootScope.$on('$includeContentLoaded', function() {
            $('.button-collapse').sideNav({
                menuWidth: 300
            });
            // Materialize Dropdown
            $('.dropdown-button').dropdown({
                inDuration: 500,
                outDuration: 400,
                constrain_width: true,                  // Does not change width of dropdown to that of the activator
                hover: false,                           // Activate on click
                alignment: 'left',                      // Aligns dropdown to left or right edge (works with constrain_width)
                gutter: 0,                              // Spacing from edge
                belowOrigin: false                       // Displays dropdown below the button
            });


            // Perfect Scrollbar
            Ps.initialize (document.getElementById('slide-out'));




        });


        console.log ("DENTRO CONTROLADOR SIDENAV");
    }
]);
