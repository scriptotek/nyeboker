var bookControllers = angular.module('bookControllers', []);

bookControllers.controller('showDatabaseBooksCtrl',
    function ($scope, $rootScope, databaseFactory){

        // show loading icon
        $scope.loading = true;

        // get books from database
        databaseFactory.getDatabaseBooks(function(data) {
            // store results in model
            $scope.booksFromDatabase = data;

            // hide loading icon
            $scope.loading = false;
        });
    });

bookControllers.controller('addNewCtrl', function ($scope, $state, metaDataApiFactory, isbnToolsFactory) {

    $scope.inputValue = null;

    // handle finding new books
    $scope.lookUpBook = function (inputValue) {

        $scope.loading = true;

        console.log('test');
        console.log(inputValue.$viewValue);

        // get input value
        var inputValue = inputValue.$viewValue;
        // var inputValue;
        
        /*
         * Set testing values for input so that you don't have to type in a
         * valid isbn/objectid/knyttid every time
         */
        // inputValue = '0-19-852663-6';
        // inputValue = '036051NA0';

        /*
         * The possibilities now:
         * 
         * 1) input is valid isbn:
         *    we send it straight to metaDataApiFactory.getApiJson
         * 
         * 2) input.length == 9 and assumed to be docid/objectid
         *    we have to find isbn number(s) connected. since we're not sure
         *    what we have we use isbnToolsFactory.findObjectId to get the
         *    objectid. Then we can use isbnToolsFactory.findISBNs to find
         *    isbn numbers connected. Then we can use
         *    metaDataApiFactory.getApiJson
         * 
         *  3) invalid input. show error somewhere
        */

        if (isbnToolsFactory.isISBN(inputValue)) {

            console.log('Input is ISBN.');

            metaDataApiFactory.getApiJson([inputValue], function(data) {
                console.log('We started with an isbn number and ended in book info. YAY!');
                $state.go('showJsonData');
            });

        } else if (inputValue.length === 9) {

            console.log('Input seems to be docid/objectid. Try to find objectid from the input:');
            isbnToolsFactory.findObjectId(inputValue, function(objektidData) {
                // now try to find isbn numbers connected
                isbnToolsFactory.findISBNs(objektidData.objektid, function(isbnData) {

                    metaDataApiFactory.getApiJson(isbnData.isbn, function(data) {
                        console.log('We started with doc/obj/knytt-id and ended in book info. YAY!');
                        $state.go('showJsonData');
                    });

                });
            });

        } else {

            $scope.loading = false;
            console.log('Invalid input.');
            $scope.error = 'Invalid input.';

        }
    }

});

bookControllers.controller('showJsonDataCtrl', function ($scope, metaDataApiFactory){

    console.log('--- In showJsonDataCtrl');

    var cachedJson = metaDataApiFactory.getCachedJson();

    // console.log(cachedJson);

    // go through results
    angular.forEach(cachedJson, function(value, key) {
        if (key != 'source') {
            console.log(value);
        } else {
            console.log('found key source');
        }
    });
    
    console.log('--- end of showJsonDataCtrl');
});