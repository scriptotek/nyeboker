// To avoid polluting the global scope with our function declarations, we wrap
// everything inside an IIFE
(function() {

    // define the module that will hold all the factories we're gonna use
    angular.module('bookFactories', []);


    // ------------------------------------------------------------------------

    function CategoryHolderFactory() {

        CategoryHolderFactory.localCategories = {
            '00': '000 Informatikk',
            '10': '101 Filosofi og psykologi',
            '30': '300 Samfunnsvitenskap',
            '50': '500 Generell naturvitenskap',
            '51': '510 Matematikk',
            '52': '520 Astronomi',
            '53': '530 Fysikk',
            '54': '540 Kjemi',
            '55': '550 Geovitenskap',
            '57': '570 Biovitenskap',
            '58': '580 Planter (Botanikk)',
            '59': '590 Dyr (Zoologi)',
            '61': '610 Farmasi (Medisin og helse)',
            '62': '620 Teknikk',
            '63': '630 Landbruk',
            '64': '640 Husholdning',
            '65': '650 Ledelse og bedriftsøkonomi',
            '66': '660 Kjemiteknikk',
            '68': '680 Produksjon med bestemte bruksområder',
            '70': '700 Kunst',
            '79': '790 Sport, spill og underholdning',
            '80': '800 Litteratur, litterær komposisjon og kritikk'
        };

        CategoryHolderFactory.localCategoryNames = [
            '000 Informatikk',
            '101 Filosofi og psykologi',
            '300 Samfunnsvitenskap',
            '500 Generell naturvitenskap',
            '510 Matematikk',
            '520 Astronomi',
            '530 Fysikk',
            '540 Kjemi',
            '550 Geovitenskap',
            '570 Biovitenskap',
            '580 Planter (Botanikk)',
            '590 Dyr (Zoologi)',
            '610 Farmasi (Medisin og helse)',
            '620 Teknikk',
            '630 Landbruk',
            '640 Husholdning',
            '650 Ledelse og bedriftsøkonomi',
            '660 Kjemiteknikk',
            '680 Produksjon med bestemte bruksområder',
            '700 Kunst',
            '790 Sport, spill og underholdning',
            '800 Litteratur, litterær komposisjon og kritikk'
        ];

        return CategoryHolderFactory;

    }

    // add it to our bookFactories module
    angular
        .module('bookFactories')
        .factory('CategoryHolderFactory', CategoryHolderFactory);

    // ------------------------------------------------------------------------


    // IsbnToolsFactory will handle isbn/dokid/objektid lookups and isbn stuff
    function IsbnToolsFactory($http, ApiResultsFactory, InformationEditorFactory, CategoryHolderFactory) {

        /*
         * Checks user input, gets isbns from the input and then calls
         * movingOn which is defined in lookUpCtrl
         */
        IsbnToolsFactory.lookUpBook = function (vm) {

            // remove stored results from previous search
            ApiResultsFactory.resetCachedJsons();

            // show loaading icon
            vm.loading = true;

            // retrieve data for this vm.inputValue
            IsbnToolsFactory.findISBNs(vm.inputValue, function(data) {

                // did we get a result?

                if (data.numberOfRecords === 0) {
                    console.log("id could not be found");
                } else {
                    console.log("got result");

                    // as a search for an id should only give one result, we only take the first result
                    data = data.documents[0];

                    console.log(data)

                    // save the title
                    ApiResultsFactory.cachedJson.title.push(data.bibliographic.title);

                    // save authors
                    angular.forEach(data.bibliographic.creators, function(author) {
                        ApiResultsFactory.cachedJson.authors.push(author.name);
                    });

                    // save category
                    // this is a bit tricky. in data.classifications we might have several results. we want the result with assigner = "NoOU", because that's us. therefore we'll check all results and see if we find such an assigner. if we don't, then we'll just select the category in the first result. holder variable for the category:
                    var catHolder;
                    // get the values from our assigning_agency
                    var NoOUs = data.classifications.filter(function(el, idx, arr) {
                        return (el.assigner === 'NoOU' && el.system === 'ddc');
                    });
                    // did we get anything?
                    if (NoOUs.length>0) {
                        // if so, get the first two digits of the number
                        catHolder = NoOUs[0].number.substring(0,2);
                    } else {
                        // Something's not quite right, let's tell the user
                        vm.loading = false;
                        vm.error = 'Det ser ikke ut som boka har blitt klassifisert (fant ingen DDC-numre fra UBO). Hvis du nettopp har klassifisert boka kan det hende du må lage deg en kopp te mens du venter på at dataene propagerer. Heldigvis tar det sjelden mange minuttene.';
                        return;
                    }
                    // now we are ready to check these two numbers against the
                    // category names we use locally
                    InformationEditorFactory.info.cat =
                        CategoryHolderFactory.localCategories[catHolder];

                    console.log(data.bibliographic.isbns);                    

                    // move on with the isbn if we found a matching category
                    if (InformationEditorFactory.info.cat) {
                        vm.movingOn(data.bibliographic.isbns);
                    } else {
                        vm.loading = false;
                        vm.error = 'There\'s something wrong with the category found. Please try again.';
                    }

                }

            });

        };

//Old version, using the old katapi
//         /*
//          * Checks user input, gets isbns from the input and then calls
//          * movingOn which is defined in lookUpCtrl
//          */
//         IsbnToolsFactory.lookUpBook = function (vm) {

//             // remove stored results from previous search
//             ApiResultsFactory.resetCachedJsons();

//             // show loaading icon
//             vm.loading = true;

//             IsbnToolsFactory.findISBNs(vm.inputValue, function(data) {

//                 // we get some data from katapi (see findISBNS). lets save
//                 // the data we can use before we move on

//                 // save the title
//                 ApiResultsFactory.cachedJson.title.push(data.title);

//                 // save authors
//                 angular.forEach(data.authors, function(author) {
//                     ApiResultsFactory.cachedJson.authors.push(author.name);
//                 });

//                 // save category
//                 // this is a bit tricky. in data.classes we might have this:
//                 /*
// classes: [
//     {
//         system: "ddc",
//         number: "539.7215",
//         edition: "23",
//         assigning_agency: "NoOU",
//         uri: "http://katapi.biblionaut.net/classes/DDC/539.7215"
//     }
// ]
//                 */
//                 // and we might have several results. we want the result with
//                 // assigning_agency = "8", because that's us. therefore
//                 // we'll check all results and see if we find such a result. if
//                 // we don't, then we'll just select the category in the first
//                 // result. holder variable for the category:
//                 var catHolder;
//                 // get the values from our assigning_agency
//                 var NoOUs = data.classes.filter(function(el, idx, arr) {
//                     return (el.assigning_agency === 'NoOU' && el.system === 'ddc');
//                 });
//                 // did we get anything?
//                 if (NoOUs.length>0) {
//                     // if so, get the first two digits of the number
//                     catHolder = NoOUs[0].number.substring(0,2);
//                 } else {
//                     // Something's not quite right, let's tell the user
//                     vm.loading = false;
//                     vm.error = 'Det ser ikke ut som boka har blitt klassifisert (fant ingen DDC-numre fra UBO). Hvis du nettopp har klassifisert boka kan det hende du må lage deg en kopp te mens du venter på at dataene propagerer. Heldigvis tar det sjelden mange minuttene.';
//                     return;
//                 }
//                 // now we are ready to check these two numbers against the
//                 // category names we use locally
//                 InformationEditorFactory.info.cat =
//                     CategoryHolderFactory.localCategories[catHolder];
                
//                 // move on with the isbn if we found a matching category
//                 if (InformationEditorFactory.info.cat) {
//                     vm.movingOn(data.isbns);
//                 } else {
//                     vm.loading = false;
//                     vm.error = 'There\'s something wrong with the category found. Please try again.';
//                 }

//             });

//         };

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
         * Will use an id (docid, objektic, knyttid) to find isbn numbers.
         */
        IsbnToolsFactory.findISBNs = function(inputValue, callback) {
            return $http.get('http://katapi.biblionaut.net/documents.json?q=id:' + inputValue)
            .success(function(data) {
                // console.log('Got data from findISBNs:');
                // console.log(data);
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
            // console.log('in DatabaseFactory.destroy');
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
    function InformationEditorFactory(ApiResultsFactory) {

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

        // set default values (first results) from ApiResultsFactory
        InformationEditorFactory.setDefaults = function() {
            InformationEditorFactory.info.isbn =
                ApiResultsFactory.cachedJson.isbn[0];
            InformationEditorFactory.info.image =
                ApiResultsFactory.cachedJson.medium_image.concat(ApiResultsFactory.cachedJson.small_image).concat(ApiResultsFactory.cachedJson.large_image)[0];
            InformationEditorFactory.info.title =
                ApiResultsFactory.cachedJson.title[0];
            InformationEditorFactory.info.author =
                ApiResultsFactory.cachedJson.authors[0];
            InformationEditorFactory.info.desc =
                ApiResultsFactory.cachedJson.short_desc.concat(ApiResultsFactory.cachedJson.long_desc)[0];
        }

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
            subtitle: []
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
                    // haven't already got it
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