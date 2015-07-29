angular.module('calculateRoute').controller('SidenavController', ['$rootScope', '$scope', '$state', '$auth',
    function($rootScope, $scope, $state, $auth) {

        console.log ("DENTRO CONTROLADOR SIDENAV");

        $scope.close_sidenav = function (event) {
            if (window.innerWidth <= 992) {
                $('.button-collapse').sideNav('hide');
                $(".button-collapse i").text("menu");
            }
        };

        $rootScope.$on('$includeContentLoaded', function() {
            // SideNav
            $('.button-collapse').sideNav({
                menuWidth: 300,
                closeOnClick: false
            });
            $('.drag-target').css("width", "1px");


            // SideNav Dropdown
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


        $rootScope.$on('$includeContentLoaded', function() {
            $('.drag-target').on('click', function() {
                setTimeout (function() {
                    $(".button-collapse i").text("menu");
                }, 350);
            });
            $('.drag-target').on('panend', function(){
                setTimeout (function() {
                    if ($("#slide-out").css("left") == "-310px")
                        $(".button-collapse i").text("menu");
                }, 350);
            });

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
