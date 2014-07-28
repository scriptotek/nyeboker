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

        getCachedbooks: function() {
            return cachedDatabaseBooks;
        },

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

        // destroy a book
        destroy : function(id) {
            return $http.delete('api/books/' + id);
        }

    }
});

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
        // for us. The expected format is:
        /*
            {
                url: "https://www.googleapis.com/books/v1/volumes?q=9780198566762",
                isbn: "9780198566762",
                long_desc: "Sethna distills the core ideas of statistical mechanics to make room for new advances important to information theory, complexity, and modern biology. He explores everything from chaos through to life at the end of the universe.",
                short_desc: "Sethna distills the core ideas of statistical mechanics to make room for new advances important to information theory, complexity, and modern biology. He explores everything from chaos through to life at the end of the universe.",
                small_image: "http://bks5.books.google.co.uk/books?id=m_LSngEACAAJ&printsec=frontcover&img=1&zoom=5&source=gbs_api",
                medium_image: "http://bks5.books.google.co.uk/books?id=m_LSngEACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api"
            }
        */
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

        // this will be used to fetch data and have it update the view
        // automatically
        cachedJsons: cachedJson,

        resetCachedJsons: function() {
            cachedJson = {
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

    // old holdervariable for when I only used one api:
    // var cachedJson;

    return {

        getApiJson: function(isbnArray, callback) {

            // since we're getting an array of isbns here, join them separated
            // by commas since that's the format the metadata apis takes
            var isbnsCommaSeparated = isbnArray.join(',');

            // function for when requests have gotten data
            var onSuccess = function(data) {

                // go though all data and store
                angular.forEach(data, function(res) {

                    // now we have to check if we got a result. if we
                    // didn't then the object would have an error
                    // property with value 404. we make sure it doesn't
                    // have that, and that it is an object
                    if (typeof res === 'object' && res.error != '404') {

                        // console.log('success from resource: ' + url + isbnsCommaSeparated);

                        // send result to storage
                        ApiResultsFactory.addResult(res);

                    }
                });

            }

            // how long should we wait for each resource?
            var timeoutLimit = 5000;

            // a variable that counts how many resources are done, 
            // regardless of whether they succeeded or not
            var amountDone = 0;

            // start all requests
            angular.forEach(urls, function(url) {

                $http({
                    method: 'get',
                    url: url,
                    params: {
                        'id': isbnsCommaSeparated
                    },
                    timeout: timeoutLimit
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