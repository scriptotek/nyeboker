var bookApp = angular.module('bookApp', [
    'ngRoute',
    'bookControllers',
    'bookFactories']);

bookApp.config(function($routeProvider) {
    $routeProvider.
        when('/', {
            templateUrl: 'partials/front.html'/*,
            controller: 'mainCtrl'*/
        }).
        when('/showJsonData', {
            templateUrl: 'partials/showJsonData.html',
            controller: 'showJsonDataCtrl'
        }).
        otherwise({
            redirectTo: '/'
        });
});

/*
 * Things to do:
 * Look into angularui-routes for nested/multiple views.
 * 
 */