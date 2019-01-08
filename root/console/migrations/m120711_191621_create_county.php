<?php

class m120711_191621_create_county extends CDbMigration
{
	public function up()
	{
		$conn = Yii::app()->db;
		$createTableCommand = $conn->createCommand('
			CREATE  TABLE `oppettidr`.`county` (
			`id` INT UNSIGNED NOT NULL AUTO_INCREMENT ,
			  `name` VARCHAR(45) NOT NULL ,
			  `nameSlug` VARCHAR(45) NOT NULL ,
			  PRIMARY KEY (`id`) ,
			  UNIQUE INDEX `name_UNIQUE` (`name` ASC) ,
			  UNIQUE INDEX `nameSlug_UNIQUE` (`nameSlug` ASC) )
			ENGINE = InnoDB
			DEFAULT CHARACTER SET = utf8
			COLLATE = utf8_swedish_ci;
		');
		$createTableCommand->execute();


	}

	public function down()
	{
		echo "m120711_191621_create_county does not support migration down.\n";
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