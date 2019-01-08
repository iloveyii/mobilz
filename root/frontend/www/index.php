<?php
//error_reporting(E_ALL);
//ini_set('display_errors', 'on');
defined('BACKEND') or define('BACKEND',false);
defined('LOCAL_DOMAIN') or define('LOCAL_DOMAIN','mobilz.adv2');
define('CURRENT_ACTIVE_DOMAIN', $_SERVER['HTTP_HOST']);
defined('APP_DEPLOYED') or define('APP_DEPLOYED',!(CURRENT_ACTIVE_DOMAIN == LOCAL_DOMAIN));
define(DS, DIRECTORY_SEPARATOR);
mb_internal_encoding('UTF-8');
ini_set('zlib.output_compression', true);

// change the following paths if necessary
// $yii=dirname(__FILE__).'/../../common/lib/yii/yii-1.1.10.r3566/framework/yii.php';
$yii=dirname(__FILE__).'/../../common/lib/yii/yii/framework/yii.php';
$config=dirname(__FILE__).'/../config/main.php';

// remove the following lines when in production mode
// defined('YII_DEBUG') or define('YII_DEBUG',true);
// specify how many levels of call stack should be shown in each log message
// defined('YII_TRACE_LEVEL') or define('YII_TRACE_LEVEL',3);
define('MOBILE', false);

$shortcuts=dirname(__FILE__).DS.'..'.DS .'helpers'.DS .'shortcuts.php';
$utils=dirname(__FILE__).DS.'..'.DS .'helpers'.DS .'utils.php';
require($shortcuts);
require($utils);

require_once($yii);
Yii::createWebApplication($config)->run();
