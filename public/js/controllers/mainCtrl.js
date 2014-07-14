// public/js/controllers/mainCtrl.js
angular.module('mainCtrl', [])

	// inject the Book service into our controller
	.controller('mainController', function($scope, $http, Book) {
		// object to hold all the data for the new book form
		$scope.bookData = {};

		// loading variable to show the spinning loading icon
		$scope.loading = true;

		// get all the books first and bind it to the $scope.books object
		// use the function we created in our service
		// GET ALL BOOKS ====================================================
		Book.get()
			.success(function(data) {
				$scope.books = data;
				$scope.loading = false;
			})
			.error(function(data) {
				console.log(data);
			});

		// function to handle submitting the form
		// SAVE A BOOK ======================================================
		$scope.submitBook = function() {
			$scope.loading = true;

			console.log('testing');

			// save the book. pass in book data from the form
			// use the function we created in our service
			Book.save($scope.bookData)
				.success(function(data) {

					// if successful, we'll need to refresh the book list
					Book.get()
						.success(function(getData) {
							$scope.books = getData;
							$scope.loading = false;
						});

				})
				.error(function(data) {
					console.log(data);
				});
		};

		// function to handle deleting a book
		// DELETE A BOOK ====================================================
		$scope.deleteBook = function(id) {
			$scope.loading = true; 

			// use the function we created in our service
			Book.destroy(id)
				.success(function(data) {

					// if successful, we'll need to refresh the book list
					Book.get()
						.success(function(getData) {
							$scope.books = getData;
							$scope.loading = false;
						});

				});
		};

	});
	