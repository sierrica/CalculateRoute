app.controller ('AuthenticationController', ['$rootScope', '$scope', '$http', 'SatellizerShared', '$auth', '$location', 'tmhDynamicLocale', '$translate', 'User', '$state', 'Ptv', function($rootScope, $scope, $http, shared, $auth, $location, tmhDynamicLocale, $translate, User, $state, Ptv) {

	console.log ("DENTRO AUTHENTICATION CONTROLLER");

    $scope.email = User.getUser().email;

    $scope.$on ('login', function (event) {
        $scope.email = User.getUser().email;
    });
    $scope.$on ('change_lang', function (event) {
        if ($location.url().indexOf("profile")) {
            setTimeout (function() {
                if ($location.url().indexOf('profile'))
                    $scope.lang_default();
            }, 400);
        }
    });

    $scope.lang_default = function() {
        var lang = document.documentElement.lang;
        function formatState (state) {
            if (!state.id)
                return state.text;
            return $('<span><span class="flag-icon flag-icon-' + state.element.value.toLowerCase().replace(/_/g, '-').split('-')[1] + '"></span> ' + $translate.instant(state.text) + '</span>');
        };
        $("#lang").select2 ({
            //theme: "classic",
            minimumResultsForSearch: Infinity,
            templateResult: formatState,
            templateSelection: formatState
        });
        var that = $scope;
        setTimeout (function() {
            that.lang = lang;
            that.$apply();
            $("#lang").select2 ("val", lang);
        }, 50);
    };

    $scope.checkPassword = function(form) {
        if (form == 'signupForm')
            $scope.signupForm.confirm_password.$error.dontMatch = $scope.password != $scope.confirm_password;
        else if (form == 'profileForm')
            $scope.profileForm.confirm_password.$error.dontMatch = $scope.password != $scope.confirm_password;
    };


    $scope.forgot = function() {
        $http.post ('/forgot', {email: $scope.email})
        .success (function(response) {
            Materialize.toast ('<span class="green">' + $translate.instant('En breves recibiras un email con la nueva contrasena') + '</span>', 5000);
        }).error (function(response, status) {
            console.log ("ERROR CALCULATEROUTE");
        });
    }

    $scope.updateProfile = function() {
        User.me.update ({
            email: $scope.email,
            password: $scope.password,
            lang: $scope.lang
        }, function(response) {
            $auth.setToken (response.access_token);                                     // Sobreescribo el token
            if ($scope.lang != document.documentElement.lang)
                User.change_lang ($scope.lang);
            setTimeout (function() {
                Materialize.toast ('<span class="green">' + $translate.instant('changes successfully') + '</span>', 5000);
            }, 300);
        }, function(response) {
            Materialize.toast ('<span class="red">' + $translate.instant('changes unsuccessfully') + '</span>', 5000);
        });
    };


    $scope.remember = false;
    $scope.signup = function() {
        if ($scope.remember)
            shared.setStorageType ("localStorage");
        else
            shared.setStorageType ("sessionStorage");
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
        if ($scope.remember)
            shared.setStorageType ("localStorage");
        else
            shared.setStorageType ("sessionStorage");
        $auth.login ({
            email: $scope.email,
            password: $scope.password
        }).then (function() {
            User.me.get().$promise.then(function(response) {
                var user = response.user;
                user.name = response.user.email.split("@")[0];
                User.setUser (user);

                Materialize.toast ('<span class="green">' + $translate.instant('properly entered') + '</span>', 5000);
                $rootScope.$broadcast ('login');
                if (response.user.lang != document.documentElement.lang)
                    User.change_lang (response.user.lang);
                Ptv.myoptions.get().$promise
                    .then (function(response) {
                        Ptv.setOptions (response.options);
                    //$rootScope.$emit ('myoptions');
                });

                $state.transitionTo ("home");
            });
        }).catch (function(response) {
            Materialize.toast ('<span class="red">' + $translate.instant(response.data.message) + '</span>', 5000);
        });
    };
}]);
