var bookFactories = angular.module('bookFactories', []);

// collection of functions that operate on isbn numbers
bookFactories.factory('IsbnToolsFactory', function($http) {
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
        },

        /*
         * If you're not sure whether the input you've gotten is objectid or
         * docid, this function will return objectid if either objectid/docid
         * is the input.
         */
        findObjectId: function(inputValue, callback) {
            return $http.get('http://services.biblionaut.net/getids.php?id=' + inputValue)
            .success(function(data) {
                console.log('Got result from isbnToolsFactory.findObjectId:');
                console.log(data);
                callback(data);
            })
            .error(function(error) {
                console.log('Error in isbnToolsFactory.findObjectId');
            });
        },

        /*
         * Will use an objectid to find isbn numbers.
         */
        findISBNs: function(inputValue, callback) {
            return $http.get('http://services.biblionaut.net/sru_iteminfo.php?id=' + inputValue)
            .success(function(data) {
                console.log('Got result from isbnToolsFactory.findISBNs:');
                console.log(data);
                callback(data);
            })
            .error(function(error) {
                console.log('Error in isbnToolsFactory.findISBNs');
            });
        }
    }
});

// functions that deal with our local database
bookFactories.factory('DatabaseFactory', function($http, $timeout) {
    
    var cachedDatabaseBooks;
    
    return {

        getCachedbooks: function() {
            return cachedDatabaseBooks;
        },

        getDatabaseBooks: function(callback) {
            $http.get('api/books')
            .success(function(data) {
                console.log('Success in getDatabaseBooks:');
                console.log(data);
                cachedDatabaseBooks = data;
                callback(data);
            })
            .error(function(error) {
                console.log('Error in getDatabaseBooks.');
            });
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

    }
});

// functions that deal with the metadata api
bookFactories.factory('MetaDataApiFactory', function($http) {
    
    var cachedJson;

    return {

        lookUpBook: function(inputValue, callback) {
            console.log('--- in lookUpBook in metaDataApiFactory');
        },

        getCachedJson: function() {
            return cachedJson;
        },

        getApiJson: function(isbnArray, callback) {
            // since we're getting an array of isbns here, join them separated
            // by commas since that's the format the metadata api takes
            var isbnsCommaSeparated = isbnArray.join(',');

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
        }

    };
});