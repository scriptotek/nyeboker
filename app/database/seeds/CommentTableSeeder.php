<?php

// app/database/seeds/CommentTableSeeder.php

/**
 * undocumented class
 *
 * @package default
 * @author 
 **/
class CommentTableSeeder extends Seeder
{

	/**
	 * undocumented function
	 *
	 * @return void
	 * @author 
	 **/
	public function run()
	{
		// empty first
		DB::table('comments')->delete();

		Comment::create(array(
			'author' => 'Chris Sevilleja',
			'text' => 'Look I am a test comment.'
		));

		Comment::create(array(
			'author' => 'Nick Cerminara',
			'text' => 'This is going to be super crazy.'
		));

		Comment::create(array(
			'author' => 'Holly Lloyd',
			'text' => 'I am a master of Laravel and Angular.'
		));
	}

} // END class CommentTableSeeder