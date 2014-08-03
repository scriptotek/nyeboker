<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateBooksTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('books', function(Blueprint $table)
		{
			$table->increments('id');

			$table->string('isbn');
			$table->string('image');
			$table->string('title');
			$table->string('author');
			$table->string('desc');
			$table->enum('cat', array(
				'Matematikk',
				'Geografi',
				'Astronomi',
				'Biologi',
				'Fysikk',
				'Kjemi',
				'Informatikk',
				'Farmasi'));
			$table->boolean('displayed')->default(0);

			$table->timestamps();
		});
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::drop('books');
	}

}
