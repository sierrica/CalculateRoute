app.controller ('AuthenticationController', ['$rootScope', '$scope', 'SatellizerShared', '$auth', '$location', 'tmhDynamicLocale', '$translate', 'User', '$state', function($rootScope, $scope, shared, $auth, $location, tmhDynamicLocale, $translate, User, $state) {

	console.log ("DENTRO AUTHENTICATION CONTROLLER");

    $scope.user = User.getUser();
    $scope.confirm_password = "";
    $scope.password = "";
    $scope.lang = '';
    $scope.$on('login', function (event) {
        var user = User.getUser();
        $scope.email = user.email;
        $scope.lang = user.lang;
        $scope.password = "";
        $scope.confirm_password = "";
    });

    console.log ($scope.user)
    //$scope.email = $rootScope.user.email;
    //$scope.password = $rootScope.user.password;

    $scope.lang_default = function() {
        var lang = document.documentElement.lang;
        $scope.lang = lang;
        $("#lang").select2 ("val", lang);
    };

    $scope.checkPassword = function(form) {
        if (form == 'signupForm')
            $scope.signupForm.confirm_password.$error.dontMatch = $scope.password != $scope.confirm_password;
        else if (form == 'profileForm')
            $scope.profileForm.confirm_password.$error.dontMatch = $scope.password != $scope.confirm_password;
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
            Materialize.toast ('<span class="green">' + $translate.instant('properly registered') + '</span>', 5000);
            $scope.login();
        }).catch (function(response) {
            Materialize.toast ('<span class="red">' + $translate.instant(response.data.message) + '</span>', 5000);
        });
    };

    $scope.login = function() {
        if (! $scope.remember)
            shared.setStorageType ("sessionStorage");
        else
            shared.setStorageType ("localStorage");
        $auth.login ({
            email: $scope.email,
            password: $scope.password
        }).then (function() {
            User.me.get().$promise.then(function(response) {
                var user = response.user;
                user.name = response.user.email.split("@")[0];
                User.setUser (user);
                if (response.user.lang != document.documentElement.lang)
                    User.change_lang (response.user.lang);
                $state.transitionTo ("home");
                Materialize.toast ('<span class="green">' + $translate.instant('properly entered') + '</span>', 5000);
                $rootScope.$emit ('login');
            });
        }).catch (function(response) {
            Materialize.toast ('<span class="red">' + $translate.instant(response.data.message) + '</span>', 5000);
        });
    };
}]);
