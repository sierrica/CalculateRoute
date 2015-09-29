app.factory ('Sidenav', function($rootScope) {
    // Comprobar si el menu esta abierto y se redimensiona la pantalla > 992 -> Se cierra el menu pero es necesario colocar el icono
    $(window).resize(function() {
        if (window.innerWidth > 992   &&  $("#slide-out").css("left") == "0px") {
            $(".button-collapse i").text("menu");
            $('.drag-target').css ("width", "10px");
            $("#search").parent().css ("z-index", "0").css ("opacity", "1");
        }
    });

    return {
        init: function() {                                                           // Inicializar Sidenav <- Document.Ready

            $('.button-collapse').sideNav({                                         // SideNav Materialize
                menuWidth: 300,
                closeOnClick: false
            });

            $('.dropdown-button').dropdown({ belowOrigin: true });                  // SideNav Dropdown Materialize
            Ps.initialize (document.getElementById('slide-out'));                   // Perfect Scrollbar
            // Eventos para cambiar el icono al cerrar el menu sin pulsar en el boton
               $('.drag-target').on('click', function() {
                if (window.innerWidth <= 992) {
                    setTimeout (function() {
                        $(".button-collapse i").text("menu");
                        $('.drag-target').css ("width", "10px");
                        $("#search").parent().css ("z-index", "0").css ("opacity", "1");
                    }, 350);
                }
                else {
                    // Error por el que pretas en la izquierda del todo y se cierra
                    $('.button-collapse').sideNav ('show');
                    $('#sidenav-overlay').remove();
                    $('.drag-target').css('left', '0px').css('touch-action', 'pan-y').css('-webkit-user-drag', 'none').css('-webkit-tap-highlight-color', 'rgba(0, 0, 0, 0)');
                }
            });
            $('.drag-target').on('panend', function(){
                setTimeout (function() {
                    if ($("#slide-out").css("left") == "-310px") {
                        $(".button-collapse i").text("menu");
                        $('.drag-target').css ("width", "10px");
                        $("#search").parent().css ("z-index", "0").css ("opacity", "1");
                    }
                    else {
                        $(".button-collapse i").text("arrow_back");
                        $('.drag-target').css ("width", "calc(100% - 300px)");
                        $("#search").parent().css ("z-index", "-1").css ("opacity", "0");
                    }
                }, 350);
            });

        },
        close_sidenav: function($event) {                                       // Cerrar el menu si estamos en ventana Desktop
            setTimeout (function() {
                if (window.innerWidth <= 992) {
                    $('.button-collapse').sideNav ('hide');
                    $(".button-collapse i").text ("menu");
                    $('.drag-target').css ("width", "10px");
                    $("#search").parent().css ("z-index", "0").css ("opacity", "0");
                }
                else
                    $event.stopPropagation();
            }, 400);
        },
        dropdown: function($event) {                                                // Permitir cerrar el dropdown con click
            var origin = "#" + $($event.currentTarget).attr("data-activates");
            if ($(origin).hasClass("active")) {
                setTimeout (function() {
                    $(".side-nav").trigger("click");
                }, 25);
            }
        }
    }
});
