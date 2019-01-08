<?php

class m120711_192105_add_address_for_location extends CDbMigration
{
	public function up()
	{
		$conn = Yii::app()->db;
		$createTableCommand = $conn->createCommand('
			ALTER TABLE `oppettidr`.`location` ADD COLUMN `address` VARCHAR(200) NULL DEFAULT NULL  AFTER `seoId` , ADD COLUMN `zipcode` MEDIUMINT UNSIGNED NULL DEFAULT NULL  AFTER `address` , ADD COLUMN `countyId` INT UNSIGNED NULL DEFAULT NULL  AFTER `zipcode` , ADD COLUMN `postalCityId` INT UNSIGNED NULL DEFAULT NULL  AFTER `countyId` ,
			  ADD CONSTRAINT `fk_location_county`
			  FOREIGN KEY (`countyId` )
			  REFERENCES `oppettidr`.`county` (`id` )
			  ON DELETE RESTRICT
			  ON UPDATE RESTRICT,
			  ADD CONSTRAINT `fk_location_postalCity`
			  FOREIGN KEY (`postalCityId` )
			  REFERENCES `oppettidr`.`postalCity` (`id` )
			  ON DELETE RESTRICT
			  ON UPDATE RESTRICT
			, ADD INDEX `fk_location_county` (`countyId` ASC)
			, ADD INDEX `fk_location_postalCity` (`postalCityId` ASC) ;
		');
		$createTableCommand->execute();
	}

	public function down()
	{
		echo "m120711_192105_add_address_for_location does not support migration down.\n";
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