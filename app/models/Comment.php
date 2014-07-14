<?php

// app/models/Comment.php

/**
 * undocumented class
 *
 * @package default
 * @author 
 **/
class Comment extends Eloquent
{
	
	// let eloquent know that these attributes will be available for mass
	// assignment
	protected $fillable = array('author', 'text');

} // END class Comment