<?php

// app/models/Book.php

/**
 * undocumented class
 *
 * @package default
 * @author 
 **/
class Book extends Eloquent
{
	// specify correct table name
	protected $table = 'books';
	
	// let eloquent know that these attributes will be available for mass
	// assignment
	protected $fillable = array('dokid', 'objektid', 'isbn', 'title',
		'authors', 'cover');

} // END class Book