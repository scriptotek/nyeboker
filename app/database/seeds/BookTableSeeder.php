<?php

// app/database/seeds/BookTableSeeder.php

/**
 * undocumented class
 *
 * @package default
 * @author 
 **/
class BookTableSeeder extends Seeder
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
		DB::table('books')->delete();

		Book::create(array(
			'dokid' => 'dokid1',
			'title' => 'Bok 1.',
			'authors' => 'stian, john smith, jane smith'
		));

		Book::create(array(
			'dokid' => 'dokid2',
			'title' => 'Bok 2.',
			'authors' => 'stian, john smith, jane smith'
		));

		Book::create(array(
			'dokid' => 'dokid3',
			'title' => 'Bok 3.',
			'authors' => 'stian, john smith, jane smith'
		));
	}

} // END class BookTableSeeder