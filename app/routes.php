<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the Closure to execute when that URI is requested.
|
*/

// HOME PAGE
Route::get('/', function() {
	// we don't need to use Laravel Blade. We will return a PHP file that will
	// hold all of our Angular content. See the "Where to Place Angular Files"
	// below to see ideas on how to structure your app
	return View::make('index'); // will return app/views/index.php
});

// API ROUTES
Route::group(array('prefix' => 'api'), function () {
	// since we will be using this just for CRUD, we won't need create and
	// edit. Angular will handle both of those forms. This ensures that a user
	// can't access api/create or api/edit when there's nothing there
	Route::resource('books', 'BookController',
		array('only' => array('index', 'store', 'destroy')));
});

// CATCH ALL ROUTE
// Al routes that are not home or api will be redirected to the frontend. This
// allows angular to route them.
App::missing(function($exception) {
	return View::make('index');
});