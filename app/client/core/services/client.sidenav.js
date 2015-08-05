angular.module('calculateRoute').factory('Sidenav', ['$rootScope', function($rootScope) {

    //console.log ("FACTORRIA SIDENAV");

    // Comprobar si el menu esta abierto y se redimensiona la pantalla > 992 -> Se cierra el menu pero es necesario colocar el icono
    $(window).resize(function() {
        if (window.innerWidth > 992) {
            if ($("#slide-out").css("left") != "0px")
                $(".button-collapse i").text("menu");
        }
    });



    return {
        // Inicializar Sidenav <- Document.Ready
        init: function() {
            // SideNav
            $('.button-collapse').sideNav({
                menuWidth: 300,
                closeOnClick: false
            });
            $('.drag-target').css("width", "1px");

            // SideNav Dropdown
            $('.dropdown-button').dropdown({
                belowOrigin: true
            });

            // Perfect Scrollbar
            Ps.initialize (document.getElementById('slide-out'));


            // Eventos para cambiar el icono al cerrar el menu sin pulsar en el boton
            $('.drag-target').on('click', function() {
                setTimeout (function() {
                    $(".button-collapse i").text("menu");
                }, 350);
            });
            $('.drag-target').on('panend', function(){
                setTimeout (function() {
                    if ($("#slide-out").css("left") == "-310px")
                        $(".button-collapse i").text("menu");
                    else
                        $(".button-collapse i").text("arrow_back");
                }, 350);
            });
        },
        // Cerrar el menu si estamos en ventana Desktop
        close_sidenav: function($event) {
            setTimeout (function() {
                if (window.innerWidth <= 992) {
                    $('.button-collapse').sideNav ('hide');
                    $(".button-collapse i").text ("menu");
                }
                else
                    $event.stopPropagation();
            }, 400);
        },

        // Permitir cerrar el dropdown con click
        dropdown: function($event) {
            var origin = "#" + $($event.currentTarget).attr("data-activates");
            if ($(origin).hasClass("active")) {
                setTimeout (function() {
                    $(".side-nav").trigger("click");
                }, 25);
            }
        }
    }

}]);
