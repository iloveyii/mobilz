<?php
	Yii::setPathOfAlias('root', realpath('../../'));


	return array(
		'basePath' => dirname(__FILE__) . DIRECTORY_SEPARATOR . '..',

		'aliases' => array(
			'ext' => 'root.common.extensions',
		),
		'name' => 'Blackend',
        'defaultController'=>'backend',

		'preload' => array(
			'log',
			'bootstrap',
		),

		'language' => 'en',

		'import' => array(
			'root.common.models.*',
			'root.common.models._base.*',
			'root.common.components.*',
			'root.common.extensions.giix-components.*',
			'root.backend.components.*',
			'root.backend.models.*',
		),

		'modules' => array(

			'gii' => array(
				'class' => 'system.gii.GiiModule',
				'password' => 'yii',
				// If removed, Gii defaults to localhost only. Edit carefully to taste.
				// 'ipFilters' => array($_SERVER['REMOTE_ADDR']),

				'generatorPaths' => array(
					'root.common.extensions.giix-core',
					'bootstrap.gii',
				),
			),

		),

		'components' => array(
			'user'=>array(
				'loginUrl'=>array('backend/login'),
				'allowAutoLogin'=>true,
			),
            
//            'image'=>array(
//                'class'=>'root.common.extensions.image.CImageComponent',
//                // GD or ImageMagick
//                'driver'=>'GD',
//                // ImageMagick setup path
//                'params'=>array('directory'=>'/usr/local/bin'),
//            ),

			'urlManager' => array(
				'urlFormat' => 'path',
				'showScriptName'=>false,
				'rules' => array(
                    'home' => 'site/home',
                    'login'=>'backend/login',
                    'logout'=>'backend/logout',
                    
                    'product/crop/<id:\d+>/<image_id:\d+>'=>'site/cropping',
                    'product/crop/<id:\d+>'=>'site/cropping',
                    'product/edit/<id:\d+>'=>'site/editing',
                    
                    'usersedit' => 'site/usersedit',
                    'usersview' => 'site/usersview',
                    'productedit' => 'site/productedit',
                    'productview' => 'site/productview',
                    'forms' => 'site/forms',
                    'flot' => 'site/flot',
                    'seo' => 'seo/index',
					// '' => 'backend/index',
					'' => 'backend/login',
					'<controller:\w+>/<id:\d+>' => '<controller>/view',
					'<controller:\w+>/<action:\w+>/<id:\d+>' => '<controller>/<action>',
					'<controller:\w+>/<action:\w+>' => '<controller>/<action>',
				),
			),
            
            'cache'=>array(
                'class'=>'CDbCache',
            ),

			'db' => array(
                'class'=>'system.db.CDbConnection',
				'connectionString' => 'mysql:host=localhost;dbname=mobilz',
				'emulatePrepare' => true,
				'username' => 'mobilz',
				'password' => 'Hitt@Mobiles8Sv*ll@',
				'charset' => 'utf8',
                'schemaCachingDuration'=>3600,
			),

			'errorHandler' => array(
				// use 'site/error' action to display errors
				'errorAction' => 'backend/error',
			),
			'log' => array(
				'class' => 'CLogRouter',
				'routes' => array(
					array(
						'class' => 'CFileLogRoute',
						'levels' => 'error, warning',
					),
					// uncomment the following to show log messages on web pages
				/*
				 array(
					 'class'=>'CWebLogRoute',
				 ),
				 */
				),
			),

			'bootstrap'=>array(
				'class'=>'root.common.extensions.bootstrap.components.Bootstrap',
				'coreCss'=>true,
				'responsiveCss'=>true,
				'yiiCss'=>true,
				'enableJS'=>true,
			),

			'clientScript'=>array(
				'scriptMap' => array(
					'bootstrap.min.css'=>'/css/slate.min.css',
				),
			),
		),

	);