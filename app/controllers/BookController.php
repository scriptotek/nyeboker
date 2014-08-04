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
			'isbn' => Input::get('isbn'),
			'image' => Input::get('image'),
			'title' => Input::get('title'),
			'author' => Input::get('author'),
			'desc' => Input::get('desc'),
			'cat' => Input::get('cat'),
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


	/**
	 * Edit a book. Well not really. Just update value of displayed.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function update($id)
	{
		$book = Book::find($id);
		$book->displayed = Input::get('displayed');

		if ($book->save()) {
			return Response::json(array('success' => true, 'newDisplayedValue' => Input::get('displayed')));
		}

		// if we haven't already returned, something went wrong
		return Response::json(array(
			'code' => 404,
			'message' => 'Something wen\'t wrong in BookController.update'
			), 404);
	}


}
