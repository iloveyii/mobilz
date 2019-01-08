<?php

class m120721_125916_add_text_cols_to_location extends CDbMigration
{
	public function up()
	{
		$conn = Yii::app()->db;
		$createTableCommand = $conn->createCommand("

			ALTER TABLE `oppettidr`.`location` ADD COLUMN `introduction` TEXT NULL DEFAULT NULL  AFTER `postalCityId` , ADD COLUMN `openHoursInformation` TEXT NULL DEFAULT NULL  AFTER `introduction` ;

		");
		$createTableCommand->execute();
	}


	public function down()
	{
		echo "m120721_125916_add_text_cols_to_location does not support migration down.\n";
		return false;
	}

	/*
	// Use safeUp/safeDown to do migration with transaction
	public function safeUp()
	{
	}

	public function safeDown()
	{
	}
	*/
}