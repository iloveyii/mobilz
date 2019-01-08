<?php
	Yii::setPathOfAlias('root', realpath('../../'));


	return array(
		'basePath' => dirname(__FILE__) . DIRECTORY_SEPARATOR . '..',
		'name' => 'Mobilz',

		'defaultController' => 'ad',

		'aliases' => array(
			'ext' => 'root.common.extensions',
		),

		'preload' => array(
			'log',
			'bootstrap',
            // 'booster'
		),

		'language' => 'en',
		'charset' => 'UTF-8',

		'import' => array(
                    'root.common.models.*',
                    'root.common.models._base.*',
                    'root.common.components.*',
                    'root.common.extensions.giix-components.*',
                    'root.frontend.components.*',
                    'root.frontend.models.*',
                    'root.frontend.helpers.*',
                    'root.common.helpers.*',
                    'ext.editable.*',
		),
        
		'modules' => array(
                    'gii' => array(
                        'class' => 'system.gii.GiiModule',
                        'password' => 'yii',

                        'ipFilters' => array($_SERVER['REMOTE_ADDR']),

                        'generatorPaths' => array(
                                'root.common.extensions.giix-core',
                                'bootstrap.gii',
                        ),
                    ),

		),
 
		'components' => array(
                    'user' => array(
                            // enable cookie-based authentication
                            'allowAutoLogin' => true,
                    ),
            //email
            'mailer' => array(
                'class' => 'root.frontend.extensions.mailer.EMailer',
            ),
            'image'=>array(
                'class'=>'root.common.extensions.image.CImageComponent',
                // GD or ImageMagick
                'driver'=>'GD',
                // ImageMagick setup path
                'params'=>array('directory'=>'/opt/local/bin'),
            ),
            
			// for resing card images to 320*150
            'imageResizer'=>array(
                'class'=>'ImageResizer'
            ),
            'hybridAuth'=>array(
                'class'=>'root.frontend.extensions.widgets.hybridAuth.CHybridAuth',
                'enabled'=>true, // enable or disable this component
                'config'=>array(
                    "base_url" => "http://mobilz.se/login/endpoint/", 
                    "providers" => array(
                        // the redirect uri on api settings on google page must be:
                        // http://mobilz.se/login/endpoint/?hauth.done=Google 
                          "Google" => array(
                               "enabled" =>true,
                               "keys" => array("id" => "392458857084-17h7ursoue1aoa0mnenv85lld5entafl.apps.googleusercontent.com", "secret" => "5RExX191v9SOAcWpa3-uA53d"),
                           ),
                          "Facebook" => array(
                               "enabled" => true,
                               "keys" => array("id" => "613894645345803", "secret" => "ea23e2d093e9d3d9c3d30a48031e300e"),
                           ),
                          "Twitter" => array(
                               "enabled" => true,
                               "keys" => array("key" => "LxI8MPg9BedbYrXZjpIJHkvS2", "secret" => "LvB4uPAuM83fBVmuQfkSELEGtxycRzuy25v7TyMXBP3Bd8nYKb")
                          ),
                          "Live" => array(
                               "enabled" => true,
                               "keys" => array("id" => "0000000048122CE9", "secret" => "DVzJK54A5S6DcSS-nUfrxrkMEL770cjo")
                          ),
                       ),
                       "debug_mode" => false,
                       "debug_file" => "oauth.txt",
                   ),
            ),//end hybridAuth
            
            'urlManager' => array(
                // uncomment the following if you have enabled Apache's Rewrite module.
                'urlFormat' => 'path',
                'showScriptName' => false,

                'rules' => array(
                    // send email to advertiser
                    'email/announser/<id:\d+>'=>'email/create',
                    // default rules
                    'home'=>'ad/home',
                    'p/<p:\d+>' => 'ad/index',
                    'myadd/<id:\d+>' => 'ad/view',
                    // '' => 'ad/index',
                    'login'=>'site/login',
                    'resetpassword/<hash:\w+>'=>'site/resetpassword',
                    'login/endpoint'=>'site/endpoint',
                    'index' => 'ad/index',
                    'product' => 'site/product',
                    'contact' => 'site/contact', 
                    'konto/registera'=> 'user/create',
                    'profil/<id:\d+>'=>'user/update',
                    'update/<id:\d+>'=>'ad/update',
                    'mysearch/<search_id:\d+>'=>'ad/mysearch',
                    'registera/success'=> 'user/success',
                    '.*/?savedsearch'=>  array(
                                            'class' => 'application.components.ProductUrl',
                                         ),

                    'ad/<id:\d+>/<image_id:\d+>' => 'ad/detail',
                    'ad/<id:\d+>' => 'ad/detail',
                    // <language:(sv|en)>/
                    'county' => 'county/admin', // <language:(sv|en)>/
                    // 'countycities/<id:\d+>' => 'county/countycities', 
                    // 'county/<id:\d+>' => 'county/county', 
                    
                    /* Main Controller */
                    // this suplements ProductUrl on index page
                    // '<a:a\d+>' => 'ad/url',
                    // look for only /product
                    array(
                       'class' => 'application.components.ProductUrl',
                    ),
                    
                    
                    array(
                       'class' => 'application.components.CountyUrl',
                    ),
                    /* County cities */
                    array(
                       'class' => 'application.components.CountyCitiesUrl',
                    ),
                    '<controller:\w+>/<id:\d+>' => '<controller>/view',
                    '<controller:\w+>/<action:\w+>/<id:\d+>' => '<controller>/<action>',
                    '<controller:\w+>/<action:\w+>' => '<controller>/<action>',
                    
                ),
            ),
            
//            'cache'=>array(
//                'class'=>'CDbCache',
//            ),

			'db' => array(
                'class'=>'system.db.CDbConnection',
				'connectionString' => 'mysql:host=localhost;dbname=mobilz;charset=utf8',
				'emulatePrepare' => true,
				'username' => 'root',
				'password' => 'root',
				'charset' => 'utf8',
				'initSQLs' => array('SET NAMES utf8'),
                'schemaCachingDuration'=>3600,
			),

			'errorHandler' => array(
				// use 'site/error' action to display errors
				'errorAction' => 'site/error',
			),
            
			'log' => array(
				'class' => 'CLogRouter',
				'routes' => array(
					array(
						'class' => 'CFileLogRoute',
						'levels' => 'error, warning',
					),
					array(
						'class' => 'CEmailLogRoute',
						'levels' => 'error, warning',
						'emails' => 'admin@site.se',
					),
                    /*
                    array(
                        'class'=>'CWebLogRoute',
                    ),*/
				),
			),


			'bootstrap' => array(
				'class' => 'root.common.extensions.bootstrap.components.Bootstrap',
				'coreCss' => true,
				'responsiveCss' => true,
				'yiiCss' => true,
				'enableJS' => true,
			),
            
//            'booster' => array(
//                'class' => 'root.common.extensions.booster.components.Booster',
//            ),

			'clientScript' => array(
				'scriptMap' => array(
					'bootstrap.min.css' => false,
				),
			),
		),
        
        // application-level parameters that can be accessed
        // using Yii::app()->params['paramName']
        'params' => array(
            'seoTitle' => 'Mobilz',
			'seoMetaDescription' => 'Mobilz',
			'seoMetaKeyWords' => 'Mobilz',
            'languages'=>array('sv'=>'Swedish', 'en'=>'English',),
            'fromEmail' => 'yiideveloper14@gmail.com',
            'replyEmail' => 'yiideveloper14@gmail.com',
            'myEmail' => 'yiideveloper14@gmail.com',
            'gmail_password' => 'cichlkcexldfgnsc',
            'recaptcha_private_key' => ' 	6LdGRvcSAAAAAJY5KyUL-mso94oqQZczkFT9oShs', // captcha will not work without these keys!
            'recaptcha_public_key' => '6LdGRvcSAAAAAA4hqSPNKCG3WOs7mH24hiQ-cHHq', //http://www.google.com/recaptcha
            'contactRequireCaptcha' => TRUE,

            //Choose Bootswatch skin.'none' means default bootstrap theme.See http://bootswatch.com/
            //Options for Bootstrap2:(make sure you have 'theme'=>'bootstrap2' in this file.)
            //none,amelia,cerulean,cosmo,cyborg,flatly,journal,readable,simplex,slate,spacelab,spruce,superhero,united
            'bootswatch2_skin' => 'slate',

            //Options for Bootstrap3:(no theme specified,default view files from protected/views are used)
            //none,amelia,cerulean,cosmo,cyborg,flatly,journal,readable,simplex,slate,spacelab,united
            'bootswatch3_skin' => 'slate',

            //render a form to try out layouts and skins.
            'render_switch_form' => false
        ),
	);
