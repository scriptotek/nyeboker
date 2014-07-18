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
		</div>

<!-- 
		LOADING ICON ===============================================
		show loading icon if the loading variable is set to true
		<p class="text-center" ng-show="loading"><span class="fa fa-meh-o fa-5x fa-spin"></span></p> -->

		<!-- load our views -->
		<div ui-view='addNew'></div>
		<div ui-view='showDatabaseBooks'></div>

    </body>
</html>