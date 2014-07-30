// To avoid polluting the global scope with our function declarations, we wrap
// everything inside an IIFE
(function() {

    // define the module that will hold all the controllers we're gonna use
    angular.module('bookControllers', []);
    

    // ------------------------------------------------------------------------


    function showDatabaseBooksCtrl($scope, $rootScope, DatabaseFactory){

        var vm = this;

        // show loading icon
        vm.loading = true;

        // get books from database
        DatabaseFactory.getDatabaseBooks(function(data) {

            // store results
            vm.booksFromDatabase = data;

            // hide loading icon
            vm.loading = false;

        });

        return vm;

    }

    // add it to our bookControllers module
    angular
        .module('bookControllers')
        .controller('showDatabaseBooksCtrl', showDatabaseBooksCtrl);
    

    // ------------------------------------------------------------------------


    function lookUpCtrl($state, MetaDataApiFactory, IsbnToolsFactory, ApiResultsFactory) {

        var vm = this;

        vm.loading = false;
        vm.error = false;

        // for debugging. default input value
        vm.inputValue = '036051NA0';

        // handle finding new books
        vm.lookUpBook = function () {

            // remove stored results from previous search
            ApiResultsFactory.resetCachedJsons();

            vm.loading = true;

            // will be used when we're ready to fetch results. is it's own function
            // to avoid duplicate code
            var movingOn = function(isbns) {

                // this will call all APIs set in the variable urls in
                // MetaDataApiFactory:
                // MetaDataApiFactory.getApiJson(isbns);
                MetaDataApiFactory.getApiJson(isbns, function() {
                    $state.go('showJsonData.isbnSelector');
                });

                // the calls to the APIs are not done yet, but we will
                // move to the results page and add results to the view
                // as they come
                // $state.go('showJsonData');

            };
            
            /*
             * Set testing values for input so that you don't have to type in a
             * valid isbn/objectid/knyttid every time
             */
            // vm.inputValue = '0-19-852663-6';
            // vm.inputValue = '036051NA0';

            /*
             * The possibilities now:
             * 
             * 1) input is valid isbn:
             *    we send it straight to movingOn with the isbn number
             * 
             * 2) input.length == 9 and assumed to be docid/objectid
             *    we have to find isbn number(s) connected. since we're not
             *    sure whether we have objectid or docid at this point, we'll
             *    use IsbnToolsFactory.findObjectId to get the objectid. Then
             *    we can use IsbnToolsFactory.findISBNs to find isbn numbers
             *    connected. Then we can use movingOn with the isbn numbers
             *    we found
             * 
             *  3) invalid input. show error somewhere
            */

            if (IsbnToolsFactory.isISBN(vm.inputValue)) {

                console.log('Input is ISBN.');
                movingOn([vm.inputValue]);

            } else if (vm.inputValue.length === 9) {

                console.log('Input seems to be docid/objectid. Try to find objectid from the input:');

                IsbnToolsFactory.findObjectId(vm.inputValue, function(objektidData) {

                    // did we find an objektid?
                    if (objektidData.objektid) {

                        // now try to find isbn numbers connected
                        IsbnToolsFactory.findISBNs(objektidData.objektid, function(isbnData) {

                            movingOn(isbnData.isbn);

                        });

                    } else {

                        vm.loading = false;
                        console.log('Invalid input.');
                        vm.error = 'Invalid input.';

                    }

                });

            } else {

                vm.loading = false;
                console.log('Invalid input.');
                vm.error = 'Invalid input.';

            }

        };

        return vm;

    }

    // add it to our bookControllers module
    angular
        .module('bookControllers')
        .controller('lookUpCtrl', lookUpCtrl);
    

    // ------------------------------------------------------------------------


    function showJsonDataCtrl(ApiResultsFactory){

        var vm = this;

        vm.error = false;

        vm.cachedJson = ApiResultsFactory.cachedJson;

        // show error message if we haven't made a search
        if (vm.cachedJson.isbn.length === 0) {

            vm.error = 'You have to make a search before seeing anything here. Click "Look Up New Book" in the menu above.';

        }

        return vm;

    }

    // add it to our bookControllers module
    angular
        .module('bookControllers')
        .controller('showJsonDataCtrl', showJsonDataCtrl);
    

    // ------------------------------------------------------------------------


    function isbnSelectorCtrl(ApiResultsFactory, InformationEditorFactory) {

        var vm = this;

        // reference to search results
        var cachedJson = ApiResultsFactory.cachedJson;
        vm.isbns = cachedJson.isbn;

        // get the isbn already selected
        vm.selectedIsbn = InformationEditorFactory.info.isbn;

        // if the user wants to move on with this piece of data
        vm.selectThis = function(index) {
            InformationEditorFactory.setInfo('isbn', vm.isbns[index]);
            vm.selectedIsbn = vm.isbns[index];
        };

        return vm;

    }

    // add it to our bookControllers module
    angular
        .module('bookControllers')
        .controller('isbnSelectorCtrl', isbnSelectorCtrl);
    

    // ------------------------------------------------------------------------


    function imageSelectorCtrl(ApiResultsFactory, InformationEditorFactory) {

        var vm = this;

        var cachedJson = ApiResultsFactory.cachedJson;
        vm.allImages = [];
        vm.allImages =
            vm.allImages
            .concat(cachedJson.small_image)
            .concat(cachedJson.medium_image)
            .concat(cachedJson.large_image);

        // get the isbn already selected
        vm.selectedImg = InformationEditorFactory.info.image;

        // if the user wants to move on with this piece of data
        vm.selectThis = function(index) {
            InformationEditorFactory.setInfo('image', vm.allImages[index]);
            vm.selectedImg = vm.allImages[index];
        };

        return vm;

    }

    // add it to our bookControllers module
    angular
        .module('bookControllers')
        .controller('imageSelectorCtrl', imageSelectorCtrl);
    

    // ------------------------------------------------------------------------


    function titleSelectorCtrl(ApiResultsFactory, InformationEditorFactory) {

        var vm = this;

        var cachedJson = ApiResultsFactory.cachedJson;
        vm.titles = cachedJson.title;

        // get the title already selected
        vm.selectedTitle = InformationEditorFactory.info.title;

        // if the user wants to move on with this piece of data
        vm.selectThis = function(index) {
            InformationEditorFactory.setInfo('title', vm.titles[index]);
            vm.selectedTitle = vm.titles[index];
        };

        return vm;

    }

    // add it to our bookControllers module
    angular
        .module('bookControllers')
        .controller('titleSelectorCtrl', titleSelectorCtrl);
    

    // ------------------------------------------------------------------------

    function authorSelectorCtrl(ApiResultsFactory, InformationEditorFactory) {

        var vm = this;

        var cachedJson = ApiResultsFactory.cachedJson;
        vm.authors = cachedJson.authors;

        // get the author already selected
        vm.selectedAuthor = InformationEditorFactory.info.author;

        // if the user wants to move on with this piece of data
        vm.selectThis = function(index) {
            InformationEditorFactory.setInfo('author', vm.authors[index]);
            vm.selectedAuthor = vm.authors[index];
        };

        return vm;

    }

    // add it to our bookControllers module
    angular
        .module('bookControllers')
        .controller('authorSelectorCtrl', authorSelectorCtrl);
    

    // ------------------------------------------------------------------------


    function descriptionSelectorCtrl(ApiResultsFactory, InformationEditorFactory) {

        var vm = this;

        var cachedJson = ApiResultsFactory.cachedJson;
        vm.allDescriptions = [];
        vm.allDescriptions =
            vm.allDescriptions
            .concat(cachedJson.short_desc)
            .concat(cachedJson.long_desc);

        // get the description already selected
        vm.selectedDesc = InformationEditorFactory.info.desc;

        // if the user wants to move on with this piece of data
        vm.selectThis = function(index) {
            InformationEditorFactory.setInfo('desc', vm.allDescriptions[index]);
            vm.selectedDesc = vm.allDescriptions[index];
        };

        return vm;

    }

    // add it to our bookControllers module
    angular
        .module('bookControllers')
        .controller('descriptionSelectorCtrl', descriptionSelectorCtrl);
    

    // ------------------------------------------------------------------------


    function informationEditorCtrl(InformationEditorFactory) {

        var vm = this;

        vm.info = InformationEditorFactory.info;

        return vm;

    }

    // add it to our bookControllers module
    angular
        .module('bookControllers')
        .controller('informationEditorCtrl', informationEditorCtrl);

})();