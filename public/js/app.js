var bookApp = angular.module('bookApp', ['ngRoute']);

bookApp.config(function($routeProvider) {
    $routeProvider.
        when('/', {
            templateUrl: 'partials/front.html',
            controller: 'mainCtrl'
        }).
        when('/showJsonData', {
            templateUrl: 'partials/showJsonData.html',
            controller: 'showJsonDataCtrl'
        }).
        otherwise({
            redirectTo: '/'
        });
});

bookApp.factory('isbnToolsFactory', function() {
    return {
        /*
         * Converts a isbn10 number into a isbn13.
         * The isbn10 is a string of length 10 and must be a legal isbn10. No
         * dashes.
         * Author: http://www.devforrest.com/blog/javascript-isbn-10-to-1313-to-10-conversion-code/
         */
        ISBN10toISBN13: function(isbn10) {
             
            var sum = 38 + 3 * (parseInt(isbn10[0]) + parseInt(isbn10[2]) + parseInt(isbn10[4]) + parseInt(isbn10[6]) 
                        + parseInt(isbn10[8])) + parseInt(isbn10[1]) + parseInt(isbn10[3]) + parseInt(isbn10[5]) + parseInt(isbn10[7]);
             
            var checkDig = (10 - (sum % 10)) % 10;
             
            return "978" + isbn10.substring(0, 9) + checkDig;
        },
         
        /*
         * Converts a isbn13 into an isbn10.
         * The isbn13 is a string of length 13 and must be a legal isbn13. No
         * dashes.
         * Author: http://www.devforrest.com/blog/javascript-isbn-10-to-1313-to-10-conversion-code/
         */
        ISBN13toISBN10: function(isbn13) {
         
            var start = isbn13.substring(3, 12);
            var sum = 0;
            var mul = 10;
            var i;
             
            for(i = 0; i < 9; i++) {
                sum = sum + (mul * parseInt(start[i]));
                mul -= 1;
            }
             
            var checkDig = 11 - (sum % 11);
            if (checkDig == 10) {
                checkDig = "X";
            } else if (checkDig == 11) {
                checkDig = "0";
            }
             
            return start + checkDig;
        },

        /*
         * stripISBN
         * Removes hyphens and X from given string.
         */
        stripISBN: function(isbn) {
            // convert to uppercase, then remove hyphens and X
            return isbn.toUpperCase().replace(/[\-X]/g, '');
        },

        /*
         * isISBN
         * Removes hyphens and X from given string, then returns true if result
         * has length 10 or 13.
         */
        isISBN: function(isbn) {
            var stripped = isbn.toUpperCase().replace(/[\-X]/g, '');
            if (stripped.length == 10 || stripped.length == 13) return true;
            return false;
        }
    }
});

bookApp.factory('booksFactory', function($http){

    // I need these variables. But how do I cache the data and at the same time
    // use a success function in my controller?
    var cachedJson;
    var cachedBooks;

    return {

        getCachedJson: function() {
            return cachedJson;
        },

        getCachedbooks: function() {
            return cachedBooks;
        },

        getApiJson: function(isbns, callback) {
            // since we're getting an array of isbns here, join them separated
            // by commas since that's the format the metadata api takes
            var isbnsCommaSeparated = isbns.join(',');

            // json from api
            $http.get('http://services.biblionaut.net/metadata/nielsen.php?id=' + isbnsCommaSeparated)
            .success(function(data) {
                console.log('Success in getApiJson:');
                console.log(data);
                cachedJson = data;
                callback(data);
            })
            .error(function() {
                console.log('Error in getApiJson.');
            });
            
            // json from test file
            // $http.get('test.json')
            // .success(function(data) {
            //     console.log('Success in getApiJson:');
            //     console.log(data);
            //     cachedJson = data;
            //     callback(data);
            // })
            // .error(function(error) {
            //     console.log('Error in getApiJson.');
            // });
        },

        getDatabaseBooks: function(callback) {
            // version that caches stuff:
            $http.get({
                method: 'GET',
                url: 'api/books',
                cache: true
            })
            .success(function(data) {
                console.log('Success in getDatabaseBooks:');
                console.log(data);
                cachedBooks = data;
                callback(data);
            })
            .error(function(error) {
                console.log('Error in getDatabaseBooks.');
            });

            // $http.get('api/books')
            // .success(function(data) {
            //     console.log('Success in getDatabaseBooks:');
            //     console.log(data);
            //     cachedBooks = data;
            //     callback(data);
            // })
            // .error(function(error) {
            //     console.log('Error in getDatabaseBooks.');
            // });
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

bookApp.controller('mainCtrl',
    function ($scope, $http, $location, booksFactory, isbnToolsFactory){
        // show loading icon
        $scope.loading = true;

        // get books from database
        booksFactory.getDatabaseBooks(function(data) {
            // store results in model
            $scope.booksFromDatabase = data;

            // hide loading icon
            $scope.loading = false;
        });

        // handle submitting new books
        $scope.lookUpBook = function () {
            // for debugging, set inputValue to a valid ISBN number
            $scope.inputValue = '0-19-852663-6';

            // show loading icon
            $scope.loading = true;

            // will hold isbn numbers
            var isbns = [];

            // check if we've got an isbn number
            if (isbnToolsFactory.isISBN($scope.inputValue)) {
                console.log('Input is ISBN. Can proceed.');
                isbns.push(isbnToolsFactory.stripISBN($scope.inputValue));
            } else {
                console.log('Input is not ISBN. Need to find ISBN number(s).');
            }

            console.log('array isbns looks like:')
            console.log(isbns)

            // at this point we have a list of isbn number(s)

            // get json data for these isbn numbers
            booksFactory.getApiJson(
                isbns,
                function(data) {
                    // the data is stored in the factory, so no need to do anything
                    // with it here. we'll just inject the factory in the next view
                    
                    // move to other view
                    $location.path('/showJsonData');
                });

            // hide loading icon
            $scope.loading = false;
        }
    });

bookApp.controller('showJsonDataCtrl', function ($scope, $http, booksFactory){
    console.log('Here in showJsonDataCtrl');

    var cachedJson = booksFactory.getCachedJson();

    console.log(cachedJson);

    // did we find multiple results?
    // var count = Object.keys($scope.foundJsonData).length;
    // if (count > 1) {
    //     console.log('We found several isbn numbers for this book.');
    //     console.log('The data we found was:');
    //     console.log($scope.foundJsonData);
    // } else {
    //     console.log('We found only one isbn number matching.');
    // }
    
    console.log('end of showJsonDataCtrl');
});