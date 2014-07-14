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
		// bruk api'et til kyrre her! og gjør noe sånt:
		// Book::create(hentDataFraKyrre(Input::get('inputValue')));
		
		// Get book data from services@biblionaut
		// $json = file_get_contents('http://services.biblionaut.net/metadata.php?id=' + Input::get('inputValue'));
		// $obj = json_decode($json);
		// dd($obj);
		
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
