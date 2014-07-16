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
		</style>

		<!-- JS -->
		<script src="http://ajax.googleapis.com/ajax/libs/jquery/2.0.3/jquery.min.js"></script>
		<script src="http://ajax.googleapis.com/ajax/libs/angularjs/1.2.8/angular.min.js"></script> <!-- load angular -->
		<script src="http://ajax.googleapis.com/ajax/libs/angularjs/1.2.8/angular-route.min.js"></script> <!-- load angular-route -->
		<script src="js/isbn_tools.js"></script> <!-- load isbn_tools -->

		<!-- ANGULAR -->
		<script src="js/app.js"></script> <!-- load our application -->

    </head>

    <!-- declare our angular app and controller -->
	<body class="container" ng-app="bookApp">
    	
		<div class="page-header">
			<h2>Laravel and Angular</h2>
			<h4>Book Registration System</h4>
		</div>

		<!-- the different views will be loaded in this div -->
		<div ng-view></div>

    </body>
</html>