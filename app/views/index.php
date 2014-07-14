<!-- app/views/index.php -->

<!doctype html>
<html>
    <head>

        <meta charset="utf-8">
        <title>Book Registration</title>

		<!-- CSS -->
		<link rel="stylesheet" href="http://netdna.bootstrapcdn.com/bootstrap/3.1.0/css/bootstrap.min.css"> <!-- load bootstrap via cdn -->
		<link rel="stylesheet" href="http://netdna.bootstrapcdn.com/font-awesome/4.0.3/css/font-awesome.min.css"> <!-- load fontawesome -->
		<style>
			body 		{ padding-top:30px; }
			form 		{ padding-bottom:20px; }
			.book 	{ padding-bottom:20px; }
		</style>

		<!-- JS -->
		<script src="http://ajax.googleapis.com/ajax/libs/jquery/2.0.3/jquery.min.js"></script>
		<script src="http://ajax.googleapis.com/ajax/libs/angularjs/1.2.8/angular.min.js"></script> <!-- load angular -->

		<!-- ANGULAR -->
		<!-- all angular resources will be loaded from the /public folder -->
		<script src="js/controllers/mainCtrl.js"></script> <!-- load our controller -->
		<script src="js/services/bookService.js"></script> <!-- load our service -->
		<script src="js/app.js"></script> <!-- load our application -->

    </head>

    <!-- declare our angular app and controller -->
	<body class="container" ng-app="bookApp" ng-controller="mainController">
    	
		<div class="page-header">
			<h2>Laravel and Angular</h2>
			<h4>Book Registration System</h4>
		</div>

		<form ng-submit="submitBook()">
			<!-- -BOOK ID -->
			<div class="form-group">
				<input type="text"class="form-control input-lg" name="inputValue" ng-model="bookData.inputValue" placeholder="Write dokid/objectid here">
			</div>

			<!-- SUBMIT BUTTON -->
			<div class="form-group text-right">
				<button type="submit" class="btn btn-primary btn-lg">Submit</button>
			</div>
		</form>

		<!-- LOADING ICON =============================================== -->
		<!-- show loading icon if the loading variable is set to true -->
		<p class="text-center" ng-show="loading"><span class="fa fa-meh-o fa-5x fa-spin"></span></p>

		<!-- bøkene =============================================== -->
		<!-- hide books if the loading variable is set to true -->
		<div class="book" ng-hide="loading" ng-repeat="book in books">
			<h3>Book #{{ book.id }} <small>av {{ book.authors }}</h3>
			<p>{{ book.dokid }}</p>

			<p><a href="#" ng-click="deleteBook(book.id)" class="text-muted">Delete</a></p>
		</div>

    </body>
</html>