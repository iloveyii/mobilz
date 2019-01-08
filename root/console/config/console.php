<?php
	Yii::setPathOfAlias('root', realpath('../'));

// This is the configuration for yiic console application.
// Any writable CConsoleApplication properties can be configured here.
return array(
	'basePath' => dirname(__FILE__) . DIRECTORY_SEPARATOR . '..',
	'name' => 'Mobilz',

	'aliases' => array(
		'application' => 'root.console',
	),
	'import' => array(
		'root.common.models.*',
		'root.common.models._base.*',
		'root.common.components.*',
		'root.common.extensions.giix-components.*',
		'root.backend.models.*',
		'root.backend.models._base.*',
	),

	'components'=>array(

		'db'=>array(
			'connectionString' => 'mysql:host=localhost;dbname=mobilz',
			'emulatePrepare' => true,
			'username' => 'mobilz',
			'password' => 'Hitt@Mobiles8Sv*ll@',
			'charset' => 'utf8',
		),

		'cache'=>array(
			'class'=>'system.caching.CDbCache',
			'connectionID' => 'db',
		),
	),
	'commandMap'=>array(
		'migrate'=>array(
			'class'=>'system.cli.commands.MigrateCommand',
			'migrationPath'=>'application.migrations',
			'migrationTable'=>'tbl_migration',
			'connectionID'=>'db',
		),
    ),
//    'onException' => function($event) {
//       if ($event->exception instanceof CDbException)
//       {
//          // true means, mark the event as handled so that no other handler will
//          // process the event (the Yii exception handler included).
//          $event->handled = true;
//       }
//    },
);