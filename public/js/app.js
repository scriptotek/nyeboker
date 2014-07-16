var bookApp = angular.module('bookApp', ['ngRoute']);

bookApp.config(function($routeProvider) {
    $routeProvider.
        when('/', {
            templateUrl: 'partials/front.html',
            controller: 'mainCtrl'
        }).
        when('/selectFromMultiple', {
            templateUrl: 'partials/selectFromMultiple.html',
            controller: 'selectFromMultipleCtrl'
        }).
        otherwise({
            redirectTo: '/'
        });
});

bookApp.factory('booksFactory', function($http){
    return {
        getJson: function(inputValue, callback) {
            // should instead get data from metapi using inputValue
            
            return $http.get('test.json'); // several matching books
            // return $http.get('test2.json'); // only one matching book
        },

        getFromDatabase: function() {
            return $http.get('api/books');
        },

        // save a book (pass in book data)
        save : function(bookData) {
            return $http({
                method: 'POST',
                url: 'api/books',
                headers: { 'Content-Type' : 'application/x-www-form-urlencoded' },
                data: $.param(bookData)
            });
        },

        // destroy a book
        destroy : function(id) {
            return $http.delete('api/books/' + id);
        }
    };
});

bookApp.controller('mainCtrl', function ($scope, $http, booksFactory){
    // show loading icon
    $scope.loading = true;

    // get books from database
    booksFactory.getFromDatabase()
        .success(function(data) {
            console.log('This is the data gotten from our database:');
            console.log(data);

            $scope.books = data;
            $scope.loading = false;
        })
        .error(function() {
            console.log('Unable to get books from database.')
        });

    // handle submitting new books
    $scope.lookUpBook = function () {
        // show loading icon
        $scope.loading = true;

        // will hold isbn numbers
        var isbns = [];

        // checkif we've got a isbn number
        if (isISBN($scope.inputValue)) {
            console.log('Input was ISBN. Can proceed.');
            isbns.push(stripISBN($scope.inputValue));
        } else {
            console.log('Input was not ISBN. Need to find ISBN number(s).');

        }

        console.log('array isbns looks like:')
        console.log(isbns)

        // at this point we have a list of isbn number(s)

        // get json data for input
        booksFactory.getJson($scope.inputValue)
            .success(function(data) {
                // did we find multiple results?
                var count = Object.keys(data).length;
                if (count > 1) {
                    console.log('We found several isbn numbers for this book.');

                } else {
                    console.log('We found only one isbn number matching.');
                }

                $scope.loading = false;
            })
            .error(function() {
            console.log('Unable to get json data.')
            });
    }
});

bookApp.controller('selectFromMultipleCtrl', function ($scope, $http, booksFactory){
    console.log('Here in selectFromMultipleCtrl');
});