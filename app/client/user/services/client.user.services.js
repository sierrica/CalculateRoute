app.factory ('User', function($resource, $rootScope, tmhDynamicLocale, $translate) {

    var user = {};
    return {
        me: $resource ('me', {}, {
            'update': { method: 'PUT' }
        }),
        change_lang: function(lang) {
            document.documentElement.lang = lang;
            tmhDynamicLocale.set (lang.toLowerCase());
            $translate.use (lang);
        },
        getUser: function() {
            return user;
        },
        setUser: function (new_user) {
            user = angular.extend (user, new_user);
        },
        removeUser: function () {
            user = {};
        }
    }
});

