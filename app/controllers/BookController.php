<?php
// app/controllers/BookController.php

class BookController extends \BaseController {

	/**
	 * Display a listing of the resource.
	 *
	 * @return Response
	 */
	public function index()
	{
		return Response::json(Book::get());
	}


	/**
	 * Store a newly created resource in storage.
	 *
	 * @return Response
	 */
	public function store()
	{
		/*
		After submitting a book for saving in the frontend we get the json data
		here. Lets check if all fields contains values, then save it. If some
		fields are missing, give a fitting error message.
		*/

		Book::create(array(
			'dokid' => Input::get('inputValue'),
			'objektid' => Input::get('inputValue'),
			'isbn' => Input::get('inputValue'),
			'title' => Input::get('inputValue'),
			'authors' => Input::get('inputValue'),
			'cover' => Input::get('inputValue'),
		));

		return Response::json(array('success' => true));
	}


	/**
	 * Remove the specified resource from storage.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function destroy($id)
	{
		Book::destroy($id);

		return Response::json(array('success' => true));
	}


}
