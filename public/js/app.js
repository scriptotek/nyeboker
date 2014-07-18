var bookApp = angular.module('bookApp', [
    'ui.router',
    'bookControllers',
    'bookFactories']);

bookApp.config(function($stateProvider, $urlRouterProvider) {
    // set default
    $urlRouterProvider.otherwise('/');

    $stateProvider
        .state('index', {
            url: '',
            views: {
                'addNew': {
                    templateUrl: 'partials/addNew.html',
                    controller: 'addNewCtrl'
                },
                'showDatabaseBooks': {
                    templateUrl: 'partials/showDatabaseBooks.html',
                    controller: 'showDatabaseBooksCtrl'
                }
            }
        })
        .state('showJsonData', {
            url: '/showJsonData',
            templateUrl: 'partials/showJsonData.html',
            controller: 'showJsonDataCtrl'
        })
});

// bookApp.config(function($routeProvider) {
//     $routeProvider.
//         when('/', {
//             templateUrl: 'partials/front.html'/*,
//             controller: 'mainCtrl'*/
//         }).
//         when('/showJsonData', {
//             templateUrl: 'partials/showJsonData.html',
//             controller: 'showJsonDataCtrl'
//         }).
//         otherwise({
//             redirectTo: '/'
//         });
// });

/*
 * Things to do:
 * Look into angularui-routes for nested/multiple views.
 * 
 */