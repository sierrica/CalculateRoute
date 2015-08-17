app.controller ('PtvController', function ($rootScope, $scope, $location, $auth, $http, User, $translate) {

    console.log ("DENTRO PTV CONTROLLER");

    var that = $scope;


    $scope.tollroads = 0;

    $scope.rangeSlider = function(id) {
        $('#' + id).val ($scope.tollroads);
        var range_slider = $('#' + id).rangeslider ({
            polyfill: false,            // Deactivate the feature detection
            update: true,

            onInit: function() {
                console.log (this);
                this.value = that.tollroads;
                if (this.value < 0)
                    $("#" + this.identifier).css ("background", "red");
                else if (this.value > 0)
                    $("#" + this.identifier).css ("background", "#00ff00");
                else {
                    console.log ("DENTRO ELSE")
                    $("#" + this.identifier).css ("background", "#D2D3CB");
                }
            },

            onSlide: function(position, value) {
                //console.log('onSlide');
                console.log (this);
                console.log (this.$fill[0]);
                if (value < 0)
                    $("#" + this.identifier).css ("background", "red");
                else if (value > 0)
                    $("#" + this.identifier).css ("background", "#00ff00");
                else
                    $("#" + this.identifier).css ("background", "#D2D3CB");

                //console.log ("ID: " + this.$element[0].id);
                //console.log (that.tollroads);
                console.log('position: ' + position, 'value: ' + value);
            },

            onSlideEnd: function(position, value) {
                //console.log('onSlideEnd');
                //console.log('position: ' + position, 'value: ' + value);
            }
        });
    };

});
