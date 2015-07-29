angular.module('calculateRoute').controller('SidenavController', ['$rootScope', '$scope', '$state', '$auth',
    function($rootScope, $scope, $state, $auth) {

        console.log ("DENTRO CONTROLADOR SIDENAV");

        $scope.close_sidenav = function (event) {
            if ($('.button-collapse').is(':visible'))
                $('.button-collapse').sideNav('hide');
        };

        $rootScope.$on('$includeContentLoaded', function() {
            $('.button-collapse').sideNav({
                menuWidth: 300,
                closeOnClick: false
            });


            // Materialize Dropdown
            $('.dropdown-button').dropdown({
                    activationWidth: 70,
                    inDuration: 300,
                    outDuration: 225,
                    constrain_width: true,
                    hover: true,
                    gutter: 0,
                    belowOrigin: false
                }
            );


            // Perfect Scrollbar
            Ps.initialize (document.getElementById('slide-out'));

        });

/*
        $('body').on('click', '.button-collapse', function() {
            console.log ("BODY CLICKADO");
            window.alert('too bad :(. This event will never be triggered because the sideNav is stopping propagation.');
        });
*/


        $scope.user_dropdown = function (event) {
            var e = document.getElementById("profile-dropdown");
            if (e.style.display == 'block' || e.style.display == '')
                e.style.display = 'none';
            else
                e.style.display = 'block';
        };
    }
]);
