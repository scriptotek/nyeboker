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
			body {
				padding-top:30px;
			}
			
			form {
				padding-bottom:20px;
			}
			
			.book {
				padding-bottom:20px;
			}

			.imgSize {
				max-width: 100px;
			}

			.buttonSizer {
				margin-bottom: 10px;
				white-space: normal;
			}

			.buttonSelected {
				background-color: green;
			}
		</style>

		<!-- JS -->
		<script src="http://ajax.googleapis.com/ajax/libs/jquery/2.0.3/jquery.min.js"></script>
		<script src="http://ajax.googleapis.com/ajax/libs/angularjs/1.2.8/angular.min.js"></script> <!-- load angular -->
		<script src="http://cdn.jsdelivr.net/angular.ui-router/0.2.10/angular-ui-router.min.js"></script> <!-- load angular-ui-route -->

		<!-- ANGULAR -->
		<script src="js/app.js"></script> <!-- load our application -->
		<script src="js/controllers.js"></script> <!-- load our controllers -->
		<script src="js/factories.js"></script> <!-- load our factories -->

    </head>

    <!-- declare our angular app and controller -->
	<body class="container" ng-app="bookApp">
    	
		<div class="page-header">
			<h2>Laravel and Angular</h2>
			<h4>Book Registration System</h4>
			<a ui-sref="index">Home</a> - 
			<a ui-sref="lookUp">Look Up New Book</a> - 
			<a ui-sref="showJsonData.isbnSelector">Show search results</a> - 
			<a ui-sref="showDatabaseBooks">Show stored books</a>
		</div>

		<!-- load our views -->
		<div ui-view></div>

    </body>
</html>