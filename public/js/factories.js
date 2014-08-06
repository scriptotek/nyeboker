// To avoid polluting the global scope with our function declarations, we wrap
// everything inside an IIFE
(function() {

    // define the module that will hold all the factories we're gonna use
    angular.module('bookFactories', []);
    

    // ------------------------------------------------------------------------


    // IsbnToolsFactory will handle isbn/dokid/objektid lookups and isbn stuff
    function IsbnToolsFactory($http, ApiResultsFactory) {

        /*
         * Checks user input, gets isbns from the input and then calls
         * movingOn which is defined in lookUpCtrl
         */
        IsbnToolsFactory.lookUpBook = function (vm) {

            // remove stored results from previous search
            ApiResultsFactory.resetCachedJsons();

            vm.loading = true;

            IsbnToolsFactory.findISBNs2(vm.inputValue, function(data) {

                // we get some data from katapi (see findISBNSs2). lets save
                // the data we can use before we move on

                // save the title
                ApiResultsFactory.cachedJson.title.push(data.title);

                // save authors
                angular.forEach(data.authors, function(author) {
                    ApiResultsFactory.cachedJson.authors.push(author.name);
                });
                
                // move on with the isbn
                vm.movingOn(data.isbns);

            });

        };

        /*
         * Converts a isbn10 number into a isbn13.
         * The isbn10 is a string of length 10 and must be a legal isbn10. No
         * dashes.
         * Author: http://www.devforrest.com/blog/javascript-isbn-10-to-1313-to-10-conversion-code/
         */
        IsbnToolsFactory.ISBN10toISBN13 = function(isbn10) {
            var sum =
                38 +
                3 * (parseInt(isbn10[0], 10) +
                     parseInt(isbn10[2], 10) +
                     parseInt(isbn10[4], 10) +
                     parseInt(isbn10[6], 10) +
                     parseInt(isbn10[8], 10)) +
                parseInt(isbn10[1], 10) +
                parseInt(isbn10[3], 10) +
                parseInt(isbn10[5], 10) +
                parseInt(isbn10[7], 10);
             
            var checkDig = (10 - (sum % 10)) % 10;
             
            return "978" + isbn10.substring(0, 9) + checkDig;
        };

        /*
         * Converts a isbn13 into an isbn10.
         * The isbn13 is a string of length 13 and must be a legal isbn13. No
         * dashes.
         * Author: http://www.devforrest.com/blog/javascript-isbn-10-to-1313-to-10-conversion-code/
         */
        IsbnToolsFactory.ISBN13toISBN10 = function(isbn13) {
         
            var start = isbn13.substring(3, 12);
            var sum = 0;
            var mul = 10;
            var i;
             
            for(i = 0; i < 9; i++) {
                sum = sum + (mul * parseInt(start[i], 10));
                mul -= 1;
            }
             
            var checkDig = 11 - (sum % 11);
            if (checkDig == 10) {
                checkDig = "X";
            } else if (checkDig == 11) {
                checkDig = "0";
            }
             
            return start + checkDig;
        };

        /*
         * stripISBN
         * Removes hyphens and X from given string.
         */
        IsbnToolsFactory.stripISBN = function(isbn) {
            // convert to uppercase, then remove hyphens and X
            return isbn.toUpperCase().replace(/[\-X]/g, '');
        };

        /*
         * isISBN
         * Removes hyphens and X from given string, then returns true if result
         * has length 10 or 13.
         */
        IsbnToolsFactory.isISBN = function(isbn) {
            var stripped = isbn.toUpperCase().replace(/[\-X]/g, '');
            if (stripped.length == 10 || stripped.length == 13) return true;
            return false;
        };

        /*
         * If you're not sure whether the input you've gotten is objectid or
         * docid, this function will return objectid if either objectid/docid
         * is the input.
         */
        IsbnToolsFactory.findObjectId = function(inputValue, callback) {
            return $http.get('http://services.biblionaut.net/getids.php?id=' + inputValue)
            .success(function(data) {
                callback(data);
            })
            .error(function(error) {
                console.log('Error in IsbnToolsFactory.findObjectId');
            });
        };

        /*
         * Will use an objectid to find isbn numbers.
         */
        IsbnToolsFactory.findISBNs = function(inputValue, callback) {
            return $http.get('http://services.biblionaut.net/sru_iteminfo.php?id=' + inputValue)
            .success(function(data) {
                console.log(data);
                callback(data);
            })
            .error(function(error) {
                console.log('Error in IsbnToolsFactory.findISBNs');
            });
        };

        /*
         * 
         */
        IsbnToolsFactory.findISBNs2 = function(inputValue, callback) {
            return $http.get('http://katapi.biblionaut.net/documents/show/' + inputValue + '?format=json')
            .success(function(data) {
                console.log(data);
                callback(data);
            })
            .error(function(err) {
                console.log('Error in IsbnToolsFactory.findISBNs');
            });
        };

        return IsbnToolsFactory;

    }

    // add it to our bookFactories module
    angular
        .module('bookFactories')
        .factory('IsbnToolsFactory', IsbnToolsFactory);


    // ------------------------------------------------------------------------


    // DatabaseFactory will handle communication with our database
    function DatabaseFactory($http) {
        
        DatabaseFactory.booksFromDatabase = {};
        
        // retrieves books from the database, and calls callback function
        // if successful
        DatabaseFactory.getDatabaseBooks = function(callback) {
            return $http.get('api/books');
        };

        // save a book (pass in book data)
        DatabaseFactory.save = function(bookData) {
            return $http({
                method: 'POST',
                url: 'api/books',
                headers: { 'Content-Type' : 'application/x-www-form-urlencoded' },
                data: $.param(bookData)
            });
        };

        // remove a book from the database
        DatabaseFactory.destroy = function(id) {
            console.log('in DatabaseFactory.destroy');
            return $http.delete('api/books/' + id);
        };

        // update info about a book
        DatabaseFactory.update = function(id, data) {
            return $http.put('api/books/' + id, data);
        };

        // choose to display/not display a book
        DatabaseFactory.toggleDisplay = function(id) {

            /*
            we want to do two things here:
            1) update the displayed value of this book in vm.booksFromDatabase
               (this should happen automatically by binding when we edit it in
               DatabaseFactory.booksFromDatabase here)
            2) update the displayed value of this book in the database itself
            */

            // 1)
            // go through all books and update the displayed value
            angular.forEach(DatabaseFactory.booksFromDatabase, function(book) {

                if (book.id === id) {

                    if (book.displayed === 0) book.displayed = 1;
                    else book.displayed = 0;

                    // 2)
                    var data = {
                        displayed: book.displayed
                    };
                    return DatabaseFactory.update(id, data)
                    .then(function(data) {
                        // console.log('result from trying to toggle: ');
                        // console.log(data.data);
                        console.log('Display toggled for book id: ' + id);
                    });

                }
                
            });

        };

        return DatabaseFactory;
    }

    // add it to our bookFactories module
    angular
        .module('bookFactories')
        .factory('DatabaseFactory', DatabaseFactory);


    // ------------------------------------------------------------------------


    // InformationEditorFactory will handle the information the user want to
    // move on with after a search
    function InformationEditorFactory() {

        InformationEditorFactory.info = {
            isbn: '',
            image: '',
            title: '',
            author: '',
            desc: '',
            cat: ''
        };

        // simple setter
        InformationEditorFactory.setInfo = function(key, value) {
            InformationEditorFactory.info[key] = value;
        };

        return InformationEditorFactory;

    }

    // add it to our bookFactories module
    angular
        .module('bookFactories')
        .factory('InformationEditorFactory', InformationEditorFactory);


    // ------------------------------------------------------------------------


    // ApiResultsFactory will handle storing data we've found from a search
    function ApiResultsFactory() {

        // here'll we'll add data as we fetch it
        ApiResultsFactory.cachedJson = {
            isbn: [],
            short_desc: [],
            long_desc: [],
            small_image: [],
            medium_image: [],
            large_image: [],
            url: [],
            authors: [],
            title: [],
            subtitle: [],
            categories: [
                'Matematikk',
                'Geografi',
                'Astronomi',
                'Biologi',
                'Fysikk',
                'Kjemi',
                'Informatikk',
                'Farmasi']
        };

        // this will receive data from the different APIs and store the data
        // for us. the function goes through the keys of the received object
        // and adds the values for each key in our cachedJson array (assuming
        // that the keys exist in the array) if not already there.
        ApiResultsFactory.addResult = function(object) {

            // get keys
            var keys = Object.keys(object);

            // add results to our storage
            angular.forEach(keys, function(key) {
                if (typeof ApiResultsFactory.cachedJson[key] === 'undefined') {

                    // if the API had started returning a resource we don't
                    // know about, log the resource name
                    console.log('found unknown key:' + key);

                } else {

                    // otherwise we want to store this piece of data if we
                    // haven't already go it
                    if (object[key] && ApiResultsFactory.cachedJson[key].indexOf(object[key]) === -1) {
                        ApiResultsFactory.cachedJson[key].push(object[key]);
                    }

                }
            });

        };

        // remove data in the array (without creating a new array, because
        // that messes up the data bindings)
        ApiResultsFactory.resetCachedJsons = function() {
            ApiResultsFactory.cachedJson.isbn.length = 0;
            ApiResultsFactory.cachedJson.short_desc.length = 0;
            ApiResultsFactory.cachedJson.long_desc.length = 0;
            ApiResultsFactory.cachedJson.small_image.length = 0;
            ApiResultsFactory.cachedJson.medium_image.length = 0;
            ApiResultsFactory.cachedJson.large_image.length = 0;
            ApiResultsFactory.cachedJson.url.length = 0;
            ApiResultsFactory.cachedJson.authors.length = 0;
            ApiResultsFactory.cachedJson.title.length = 0;
            ApiResultsFactory.cachedJson.subtitle.length = 0;
        };

        return ApiResultsFactory;

    }

    // add it to our bookFactories module
    angular
        .module('bookFactories')
        .factory('ApiResultsFactory', ApiResultsFactory);


    // ------------------------------------------------------------------------


    // MetaDataApiFactory will handle getting data from the metadata api
    function MetaDataApiFactory($http, $q, ApiResultsFactory) {

        // apis to fetch data from
        MetaDataApiFactory.urls = [
            'http://services.biblionaut.net/metadata/bibsys.php',
            'http://services.biblionaut.net/metadata/nielsen.php',
            'http://services.biblionaut.net/metadata/google.php',
            'http://services.biblionaut.net/metadata/openlibrary.php',
            'http://services.biblionaut.net/metadata/isbndb.php',
            'http://services.biblionaut.net/metadata/librarything.php',
            'http://services.biblionaut.net/metadata/springer.php'
        ];

        MetaDataApiFactory.getApiJson = function(isbnArray, callback) {

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

            };

            // how long should we wait for each resource? the ajax request is
            // cancelled after this many seconds
            var timeoutLimit = 5;

            // a variable that counts how many resources are done, 
            // regardless of whether they succeeded or not. this is used so
            // that we know when we can redirect to the view that displays the
            // results (the callback function does this). an interesting "bug"
            // in the metadata api is that it seems as if they'll give
            // something back no matter what our search query (inputValue) is.
            // therefore we don't do any validation on the data we get back. 
            var amountDone = 0;

            // start all requests
            angular.forEach(MetaDataApiFactory.urls, function(url) {

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
                    if (amountDone === MetaDataApiFactory.urls.length) {
                        callback();
                    }

                })

                // if it didn't return anything or it timed out:
                .error(function() {
                
                    amountDone++;
                    // if we're done with all resources, call callback function
                    if (amountDone === MetaDataApiFactory.urls.length) {
                        callback();
                    }
                
                });
            });

        };

        return MetaDataApiFactory;

    }

    // add it to our bookFactories module
    angular
        .module('bookFactories')
        .factory('MetaDataApiFactory', MetaDataApiFactory);

})();