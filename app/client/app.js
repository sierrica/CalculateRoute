var app = angular.module('calculateRoute', [
    'ui.router',
    'ngTouch',
    'satellizer',
    'pascalprecht.translate',
    'tmh.dynamicLocale'
])
.config(function ($urlRouterProvider, $locationProvider) {

    // Redirect to home view when route not found
    $urlRouterProvider.otherwise ('/');

    $locationProvider.html5Mode (true);
})

.config(['$translateProvider', function ($translateProvider) {


        //tmhDynamicLocaleProvider.localeLocationPattern('lib/angular-i18n/angular-locale_{{locale}}.js');


/*
    $translateProvider.translations('en', {
        'home': 'home'
    });

    $translateProvider.translations('es', {
        'home': 'inicio'
    });
*/
    //$translateProvider.preferredLanguage('en');
       /* console.log (navigator);
        console.log (navigator.languages[0]);                 // ERROR EN IE y no muestra nada
        console.log (navigator.language);
        console.log (navigator.browserLanguage);
        console.log (navigator.systemLanguage);
        console.log (navigator.userLanguage);
*/



        //$translateProvider.determinePreferredLanguage();
        //$translateProvider.uniformLanguageTag('bcp47').determinePreferredLanguage();

        $translateProvider.useMissingTranslationHandlerLog();
        $translateProvider.useSanitizeValueStrategy('escaped');




        $translateProvider.useStaticFilesLoader({
            prefix: 'i18n/',
            suffix: '.json'
        });

        $translateProvider.preferredLanguage(document.documentElement.lang);



}])
.config(function (tmhDynamicLocaleProvider) {
    tmhDynamicLocaleProvider.localeLocationPattern('lib/angular-i18n/angular-locale_{{locale}}.js');
})
.run(function (tmhDynamicLocale) {
    tmhDynamicLocale.set(document.documentElement.lang);
});

