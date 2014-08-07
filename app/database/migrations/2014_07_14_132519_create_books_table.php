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
			 	'000 Informatikk',
			 	'101 Filosofi og psykologi',
			 	'300 Samfunnsvitenskap',
			 	'500 Generell naturvitenskap',
			 	'510 Matematikk',
			 	'520 Astronomi',
			 	'530 Fysikk',
			 	'540 Kjemi',
			 	'550 Geovitenskap',
			 	'570 Biovitenskap',
			 	'580 Planter (Botanikk)',
			 	'590 Dyr (Zoologi)',
			 	'610 Farmasi (Medisin og helse)',
			 	'620 Teknikk',
			 	'630 Landbruk',
			 	'640 Husholdning',
			 	'650 Ledelse og bedriftsøkonomi',
			 	'660 Kjemiteknikk',
			 	'680 Produksjon med bestemte bruksområder',
			 	'700 Kunst',
			 	'790 Sport, spill og underholdning',
			 	'800 Litteratur, litterær komposisjon og kritikk'));
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
