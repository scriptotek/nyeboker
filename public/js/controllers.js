// To avoid polluting the global scope with our function declarations, we wrap
// everything inside an IIFE
(function() {

    // define the module that will hold all the controllers we're gonna use
    angular.module('bookControllers', []);
    

    // ------------------------------------------------------------------------


    function showDatabaseBooksCtrl(DatabaseFactory){

        var vm = this;

        // show loading icon
        vm.loading = true;

        // get books from database
        DatabaseFactory.getDatabaseBooks()
        .success(function(data) {

            // store results in this view
            vm.booksFromDatabase = data;

            // store results in our factory
            DatabaseFactory.booksFromDatabase = data;

            // hide loading icon
            vm.loading = false;

        })
        .error(function(error) {

            console.log(error);

            // hide loading icon
            vm.loading = false;

            vm.error = 'Could not retrieve books.';
            console.log(vm.error);

        });

        vm.categories = [
            'Matematikk',
            'Geografi',
            'Astronomi',
            'Biologi',
            'Fysikk',
            'Kjemi',
            'Informatikk',
            'Farmasi'];
        // set a default value for category
        vm.selectedCategory = vm.categories[0];

        // handler for delete
        vm.deleteBook = function(id) {
            // console.log('Trying to delete id ' + id);
            return DatabaseFactory.destroy(id);
        };

        // handler for toggle display
        vm.toggleDisplay = function(id) {
            return DatabaseFactory.toggleDisplay(id);
        };

        // handler for generating json for webdav->vortex
        vm.generateJson = function() {

            // holder for books to be exported
            var booksToExport = [];

            // go through each book from the database and add each which has a
            // display === 1 to the holder array
            angular.forEach(vm.booksFromDatabase, function(book) {
                if (book.displayed === 1 && book.cat === vm.selectedCategory) {
                    booksToExport.push(book);
                }
            });

            // send bookstoexport to webdav script here
            console.log(booksToExport);
        };

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
        // vm.inputValue = '0-19-852663-6';
        vm.inputValue = '036051NA0';

        // will be called after we've found isbn numbers
        vm.movingOn = function(isbns) {

            console.log('Proceeding to the metadata api with isbns: ' + isbns);
    
            MetaDataApiFactory.getApiJson(isbns, function() {
                $state.go('showJsonData.isbnSelector');
            });

        };

        // will check user input, get isbns from the input and then call
        // movingOn above
        vm.lookUpBook = function() {
            return IsbnToolsFactory.lookUpBook(vm);
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

    function informationEditorCtrl($state, InformationEditorFactory, DatabaseFactory, ApiResultsFactory) {

        var vm = this;

        vm.info = InformationEditorFactory.info;

        vm.categories = [
            'Matematikk',
            'Geografi',
            'Astronomi',
            'Biologi',
            'Fysikk',
            'Kjemi',
            'Informatikk',
            'Farmasi'];
        // set a default value for category
        vm.info.cat = vm.categories[0];

        vm.saveBook = function() {

            console.log('Sending data to laravel:');
            console.log(vm.info);

            // remove search results
            ApiResultsFactory.resetCachedJsons();

            // save and redirect to showDatabaseBooks on success
            DatabaseFactory.save(vm.info)
            .success(function() {
                $state.go('showDatabaseBooks');
            });

        };

        return vm;

    }

    // add it to our bookControllers module
    angular
        .module('bookControllers')
        .controller('informationEditorCtrl', informationEditorCtrl);

})();