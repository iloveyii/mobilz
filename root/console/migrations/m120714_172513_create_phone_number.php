<?php

class m120714_172513_create_phone_number extends CDbMigration
{
	public function up()
	{
		$conn = Yii::app()->db;
		$createTableCommand = $conn->createCommand('

			CREATE TABLE `phoneNumber` (
			  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
			  `phoneNumber` varchar(20) COLLATE utf8_swedish_ci NOT NULL,
			  `locationId` int(10) unsigned NOT NULL,
			  PRIMARY KEY (`id`),
			  UNIQUE KEY `unique_location_pn` (`phoneNumber`,`locationId`),
			  KEY `fk_pn_location` (`locationId`),
			  CONSTRAINT `fk_pn_location` FOREIGN KEY (`locationId`) REFERENCES `location` (`id`)
			) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_swedish_ci



		');
		$createTableCommand->execute();
	}

	public function down()
	{
		echo "m120714_172513_create_phone_number does not support migration down.\n";
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