angular.module('calculateRoute').factory('Sidenav', function() {
    var component_button = false, component_menu = false;
    var loaded = false;


    return {
        loaded: function(component) {
            if (! loaded) {
                if (component == 'button')
                    component_button = true;
                else if (component == 'menu')
                    component_menu = true;
                if (component_button  &&  component_menu) {
                    $('.button-collapse').sideNav({
                        menuWidth: 300
                    });
                    loaded = true;
                }
            }
        }
    }

});