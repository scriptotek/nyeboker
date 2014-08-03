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
	protected $fillable = array(
		'isbn',
		'image',
		'title',
		'author',
		'desc',
		'cat');

} // END class Book