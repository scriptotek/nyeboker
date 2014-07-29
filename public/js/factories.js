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
                callback(data);
            })
            .error(function(error) {
                console.log('Error in isbnToolsFactory.findISBNs');
            });
        }

    }

});

// functions that deal with our local database
bookFactories.factory('DatabaseFactory', function($http) {
    
    var cachedDatabaseBooks;
    
    return {

        // retrieves books from the database, and calls callback function
        // if successful
        getDatabaseBooks: function(callback) {
            $http.get('api/books')
            .success(function(data) {
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

        // remove a book from the database
        destroy : function(id) {
            return $http.delete('api/books/' + id);
        }

    }
});

// factory to store the information the user has selected about a book
// before storing it in our database
bookFactories.factory('InformationEditorFactory', function() {

    var info = {
        isbn: '',
        image: '',
        title: '',
        author: '',
        desc: ''
    };

    return {

        // function to get a referense to info
        getInfo: function() {
            return info;
        },

        // simple setter
        setInfo: function(key, value) {
            info[key] = value;
        }

    }

})

// factory to store search results
bookFactories.factory('ApiResultsFactory', function() {

    // here'll we'll add data as we fetch it
    var cachedJson = {
        isbn: [],
        short_desc: [],
        long_desc: [],
        small_image: [],
        medium_image: [],
        large_image: [],
        url: [],
        authors: [],
        title: [],
        subtitle: []
    };

    return {

        // this will receive data from the different APIs and store the data
        // for us. the function goes through the keys of the received object
        // and adds the values for each key in our cachedJson array (assuming
        // that the keys exist in the array) if not already there.
        addResult: function(object) {

            // get keys
            var keys = Object.keys(object);

            // add results to our storage
            angular.forEach(keys, function(key) {
                if (typeof cachedJson[key] === 'undefined') {

                    // if the API had started returning a resource we don't
                    // know about, log the resource name
                    console.log('found unknown key:' + key);

                } else {

                    // otherwise we want to store this piece of data if we
                    // haven't already go it
                    if (object[key] && cachedJson[key].indexOf(object[key]) === -1) {
                        cachedJson[key].push(object[key]);
                    }

                }
            });

            // console.log(cachedJson);

        },

        // get a reference to our array
        cachedJsons: cachedJson,

        // remove data in the array (without creating a new array, because
        // that messes up the data bindings)
        resetCachedJsons: function() {
            cachedJson.isbn.length = 0;
            cachedJson.short_desc.length = 0;
            cachedJson.long_desc.length = 0;
            cachedJson.small_image.length = 0;
            cachedJson.medium_image.length = 0;
            cachedJson.large_image.length = 0;
            cachedJson.url.length = 0;
            cachedJson.authors.length = 0;
            cachedJson.title.length = 0;
            cachedJson.subtitle.length = 0;
        }

    }

});

// functions that deal with the metadata api
bookFactories.factory('MetaDataApiFactory', function($http, $q, ApiResultsFactory) {

    // apis to fetch data from
    var urls = [
        'http://services.biblionaut.net/metadata/bibsys.php',
        'http://services.biblionaut.net/metadata/nielsen.php',
        'http://services.biblionaut.net/metadata/google.php',
        'http://services.biblionaut.net/metadata/openlibrary.php',
        'http://services.biblionaut.net/metadata/isbndb.php',
        'http://services.biblionaut.net/metadata/librarything.php',
        'http://services.biblionaut.net/metadata/springer.php'
    ];

    return {

        getApiJson: function(isbnArray, callback) {

            // since we're getting an array of isbns here, join them separated
            // by commas since that's the format the metadata apis takes
            var isbnsCommaSeparated = isbnArray.join(',');

            // function for when requests have gotten data
            var onSuccess = function(data) {

                // since we might have multiple results for each resource,
                // iterate through them
                angular.forEach(data, function(res) {

                    // here we have to check if we actually got a result. if we
                    // didn't, then the object would have an error property
                    // with value 404. we make sure it doesn't nd that it is
                    // an object
                    if (typeof res === 'object' && res.error != '404') {

                        // send result to storage
                        ApiResultsFactory.addResult(res);

                    }
                });

            }

            // how long should we wait for each resource? the ajax request is
            // cancelled after this many seconds
            var timeoutLimit = 5;

            // a variable that counts how many resources are done, 
            // regardless of whether they succeeded or not. this is used so
            // that we know when we can redirect to the view that displays the
            // results (the callback function does this)
            var amountDone = 0;

            // start all requests
            angular.forEach(urls, function(url) {

                $http({
                    method: 'get',
                    url: url,
                    params: {
                        'id': isbnsCommaSeparated
                    },
                    timeout: timeoutLimit*1000
                })

                // if the http call returns results for us:
                .success(function(data) {

                    // go on to check and store results:
                    onSuccess(data);

                    amountDone++;
                    // if we're done with all resources, call callback function
                    if (amountDone === urls.length) callback();

                })

                // if it didn't return anything or it timed out:
                .error(function() {
                
                    amountDone++;
                    // if we're done with all resources, call callback function
                    if (amountDone === urls.length) callback();
                
                });
            });

        }

    };
});