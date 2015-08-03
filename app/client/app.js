angular.module('calculateRoute', [
    'ui.router',
    'ngTouch',
    'satellizer',
    'pascalprecht.translate'
])
.config(function ($urlRouterProvider, $locationProvider) {

    // Redirect to home view when route not found
    $urlRouterProvider.otherwise ('/');

    $locationProvider.html5Mode (true);
})

.config(['$translateProvider', function ($translateProvider) {


    $translateProvider.translations('en', {
        'home': 'home'
    });

    $translateProvider.translations('es', {
        'home': 'inicio'
    });

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

        $translateProvider.preferredLanguage(document.documentElement.lang);


        // $translateProvider.useLocalStorage();
        //$translateProvider.preferredLanguage(document.documentElement.lang);
        //$translateProvider.fallbackLanguage('en');

}]);

