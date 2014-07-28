var bookControllers = angular.module('bookControllers', []);

bookControllers.controller('showDatabaseBooksCtrl',
    function ($scope, $rootScope, DatabaseFactory){

        // show loading icon
        $scope.loading = true;

        // get books from database
        DatabaseFactory.getDatabaseBooks(function(data) {
            // store results in model
            $scope.booksFromDatabase = data;

            // hide loading icon
            $scope.loading = false;
        });
    });

bookControllers.controller('lookUpCtrl', function ($scope, $state, MetaDataApiFactory, IsbnToolsFactory, ApiResultsFactory) {

    // for debugging. default input value
    $scope.inputValue = '036051NA0';

    // handle finding new books
    $scope.lookUpBook = function () {

        // remove stored results from previous search
        ApiResultsFactory.resetCachedJsons();

        $scope.loading = true;

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

        }

        // check if form is valid
        if ($scope.lookUpForm.$valid) {

            console.log('form validation passed');

            // get input value
            var inputValue = $scope.inputValue;
            
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

            if (IsbnToolsFactory.isISBN(inputValue)) {

                console.log('Input is ISBN.');
                movingOn([inputValue]);

            } else if (inputValue.length === 9) {

                console.log('Input seems to be docid/objectid. Try to find objectid from the input:');

                IsbnToolsFactory.findObjectId(inputValue, function(objektidData) {

                    // now try to find isbn numbers connected
                    IsbnToolsFactory.findISBNs(objektidData.objektid, function(isbnData) {

                        movingOn(isbnData.isbn);

                    });
                });

            } else {

                $scope.loading = false;
                console.log('Invalid input.');
                $scope.error = 'Invalid input.';

            }

        } else {

            $scope.loading = false;
            console.log('Form not valid.');
            $scope.error = 'Form not valid.';

        }
    }

});

bookControllers.controller('showJsonDataCtrl', function ($scope, ApiResultsFactory){

    $scope.cachedJson = ApiResultsFactory.cachedJsons;

});

bookControllers.controller('isbnSelectorCtrl', function($scope, ApiResultsFactory) {

    var cachedJson = ApiResultsFactory.cachedJsons;
    $scope.isbns = cachedJson.isbn;

});

bookControllers.controller('imageSelectorCtrl', function($scope, ApiResultsFactory) {

    var cachedJson = ApiResultsFactory.cachedJsons;
    $scope.allImages = [];
    $scope.allImages =
        $scope.allImages
        .concat(cachedJson.small_image)
        .concat(cachedJson.medium_image)
        .concat(cachedJson.large_image);

});

bookControllers.controller('titleSelectorCtrl', function($scope, ApiResultsFactory) {

    var cachedJson = ApiResultsFactory.cachedJsons;
    $scope.titles = cachedJson.title;

});

bookControllers.controller('descriptionSelectorCtrl', function($scope, ApiResultsFactory) {

    var cachedJson = ApiResultsFactory.cachedJsons;
    $scope.allDescriptions = [];
    $scope.allDescriptions =
        $scope.allDescriptions
        .concat(cachedJson.short_desc)
        .concat(cachedJson.long_desc);

});