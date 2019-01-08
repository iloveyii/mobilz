<?php

class m120718_181921_create_visit_table extends CDbMigration
{
	public function up()
	{
		$conn = Yii::app()->db;
		$createTableCommand = $conn->createCommand("

			CREATE TABLE `visit` (
			  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
			  `time` datetime NOT NULL,
			  `objectType` enum('location') COLLATE utf8_swedish_ci NOT NULL DEFAULT 'location',
			  `objectId` int(10) unsigned NOT NULL,
			  `referrer` text COLLATE utf8_swedish_ci,
			  `userAgent` text COLLATE utf8_swedish_ci,
			  `host` text COLLATE utf8_swedish_ci,
			  `ip` varchar(45) COLLATE utf8_swedish_ci DEFAULT NULL,
			  PRIMARY KEY (`id`),
			  KEY `idx_visit_time` (`time`)
			) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_swedish_ci

		");
		$createTableCommand->execute();

	}

	public function down()
	{
		echo "m120718_181921_create_visit_table does not support migration down.\n";
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