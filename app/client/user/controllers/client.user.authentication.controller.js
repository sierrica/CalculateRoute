app.controller ('AuthenticationController', ['$rootScope', '$scope', 'SatellizerShared', '$auth', '$location', 'tmhDynamicLocale', '$translate', 'User', '$state', function($rootScope, $scope, shared, $auth, $location, tmhDynamicLocale, $translate, User, $state) {

	console.log ("DENTRO AUTHENTICATION CONTROLLER");


    $scope.lang_default = function() {
        var lang = document.documentElement.lang;
        $scope.lang = lang;
        $("#lang").select2 ("val", lang);
    };

    $scope.checkPassword = function() {
        $scope.signupForm.confirm_password.$error.dontMatch = $scope.password != $scope.confirm_password;
    };


    $scope.remember = false;

    $scope.signup = function() {
        if (! $scope.remember)
            shared.setStorageType ("sessionStorage");
        else
            shared.setStorageType ("localStorage");
        $auth.signup ({
            email: $scope.email,
            password: $scope.password,
            lang: $scope.lang
        }).then (function() {
            console.log ("REGISTRADO CORRECTAMENTE");
            Materialize.toast ('<span class="green">' + $translate.instant('properly registered') + '</span>', 5000);
            $scope.login();
        }).catch (function(response) {
            Materialize.toast ('<span class="red">' + $translate.instant(response.data.message) + '</span>', 5000);
    });
    };

    $scope.login = function() {
        //alert ("Hello! I am an alert box!!");
        if (! $scope.remember)
            shared.setStorageType ("sessionStorage");
        else
            shared.setStorageType ("localStorage");
        $auth.login ({
            email: $scope.email,
            password: $scope.password
        }).then (function() {
            console.log ("LOGUEADO CORRECTAMENTE");
            User.me.get().$promise.then(function(response) {
                $rootScope.user = response.user;
                $rootScope.user.name = $rootScope.user.email.split("@")[0];
                if ($rootScope.user.lang != document.documentElement.lang)
                    User.change_lang ($rootScope.user.lang);
                $state.transitionTo ("home");
                Materialize.toast ('<span class="green">' + $translate.instant('properly entered') + '</span>', 5000);
            });
        }).catch (function(response) {
            Materialize.toast ('<span class="red">' + $translate.instant(response.data.message) + '</span>', 5000);
        });
    };
}]);
