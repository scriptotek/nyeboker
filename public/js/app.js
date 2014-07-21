var bookApp = angular.module('bookApp', [
    'ui.router',
    'bookControllers',
    'bookFactories']);

bookApp.config(function($stateProvider, $urlRouterProvider) {
    // set default
    $urlRouterProvider.otherwise('/index');

    $stateProvider
        .state('index', {
            url: '/index',
            templateUrl: 'partials/index.html'
        })
        .state('addNew', {
            url: '/addNew',
            templateUrl: 'partials/addNew.html',
            controller: 'addNewCtrl'
        })
        .state('showJsonData', {
            url: '/showJsonData',
            templateUrl: 'partials/showJsonData.html',
            controller: 'showJsonDataCtrl'
        })
        .state('showDatabaseBooks', {
            url: '/showDatabaseBooks',
            templateUrl: 'partials/showDatabaseBooks.html',
            controller: 'showDatabaseBooksCtrl'
        })
});

bookApp.directive("loadingspinner", function() {
    return {
        restrict: 'E',
        template: '<p class="text-center" ng-show="loading"><span class="fa fa-meh-o fa-5x fa-spin"></span></p>'
    }
});

bookApp.directive("errormessage", function() {
    return {
        restrict: 'E',
        template: '<div class="alert alert-danger" ng-show="error">{{error}}</div>'
    }
});

/*
STUFF TO DO:

-----
Figure out how to do forms and form validation in angularjs so that you can
move lookupbook() to the factory.
-----
WHAT TO DO WITH INPUT:

if s_isbn?
    finn flere isbn
        https://ask.bibsys.no/ask2/json/result.jsp?cql=bs.isbn=????
else
    send til getids.php (dit sender jeg knyttid/objektid) for å få objektid.
    skriv om funksjonen til js

    så bruker du objektid her:
    https://ask.bibsys.no/ask2/json/result.jsp?cql=bs.objektid=????
    for å finne isbn-nummerne

finn info fra alle isbn
-----
rewrite functions so that dependencies work when minified
-----


*/