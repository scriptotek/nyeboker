var bookControllers = angular.module('bookControllers', []);

bookControllers.controller('showDatabaseBooksCtrl',
    function ($scope, databaseFactory){

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

bookControllers.controller('addNewCtrl', function ($scope, $location, metaDataApiFactory, isbnToolsFactory) {
    console.log('--- In addNewCtrl');

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
        metaDataApiFactory.getApiJson(
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

    console.log('--- end of addNewCtrl');
});

bookControllers.controller('showJsonDataCtrl', function ($scope, $http, metaDataApiFactory){
    console.log('--- In showJsonDataCtrl');

    var cachedJson = metaDataApiFactory.getCachedJson();

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
    
    console.log('--- end of showJsonDataCtrl');
});