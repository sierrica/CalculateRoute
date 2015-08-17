app.factory ('User', function($resource, $rootScope, tmhDynamicLocale, $translate) {
    return {
        me: $resource ('me', {}, {
            update: {
                method: 'PUT'
            }
        }),
        change_lang: function(lang) {
            document.documentElement.lang = $rootScope.user.lang;
            tmhDynamicLocale.set ($rootScope.user.lang.toLowerCase());
            $translate.use ($rootScope.user.lang);
        }
    }
});

