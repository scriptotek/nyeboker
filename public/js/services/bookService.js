// public/js/services/bookService.js
angular.module('bookService', [])

	.factory('Book', function($http) {

		return {
			// get all the books
			get : function() {
				return $http.get('api/books');
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