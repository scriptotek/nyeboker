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
		add validatino bro. first learn to spell
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
	 * NOTE: This should be updated with validation and so that it can edit
	 * everything about the book.
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
