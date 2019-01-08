<!doctype html>
<html>
<head>
	<title><?php echo GxHtml::encode($this->pageTitle); ?></title>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
	<meta http-equiv="Content-Language" content="sv-SE"/>
	<meta name="description" content=""/>
	<meta name="keywords" content=""/>

	<!--[if lt IE 9]>
	<script type="text/javascript" src="http://html5shim.googlecode.com/svn/trunk/html5.js"></script>
	<![endif]-->
</head>
<body>
	<?php
		$this->widget(
			'bootstrap.widgets.BootNavbar',
			array(
				'fixed'=>false,
				'brand'=>'Öppettidr blackend',
				'brandUrl'=>'/',
				'collapse'=>true, // requires bootstrap-responsive.css
				'items' => array(
					array(
						'class'=>'bootstrap.widgets.BootMenu',
						'items' => array(
							array('label'=>'SEO', 'url'=>array('seo/index'), 'active'=>!Yii::app()->user->isGuest),
						),
					),
					array(
						'class'=>'bootstrap.widgets.BootMenu',
						'items' => array(
							array('label'=>'Kedjor', 'url'=>array('chain/admin'), 'active'=>!Yii::app()->user->isGuest),
						),
					),
					array(
						'class'=>'bootstrap.widgets.BootMenu',
						'items' => array(
							array('label'=>'Köpcentrum', 'url'=>array('mall/admin'), 'active'=>!Yii::app()->user->isGuest),
						),
					),
					array(
						'class'=>'bootstrap.widgets.BootMenu',
						'items' => array(
							array('label'=>'Butiker', 'url'=>array('location/admin'), 'active'=>!Yii::app()->user->isGuest),
						),
					),
					array(
						'class'=>'bootstrap.widgets.BootMenu',
						'items' => array(
							array('label'=>'Om Oss', 'url'=>array('aboutUs/admin'), 'active'=>!Yii::app()->user->isGuest),
						),
					),
					array(
						'class'=>'bootstrap.widgets.BootMenu',
						'items' => array(
							array('label'=>'Öppettider', 'url'=>array('openHours/admin'), 'active'=>!Yii::app()->user->isGuest),
						),
					),
					array(
						'class'=>'bootstrap.widgets.BootMenu',
						'items' => array(
							array('label'=>'Logga ut', 'url'=>array('backend/logout'), 'active'=>!Yii::app()->user->isGuest),
						),
					)
				),

			)
		);
	?>
	<div class="container-fluid">
		<?php
			$this->widget(
				'bootstrap.widgets.BootBreadcrumbs',
				array(
					 'homeLink' => GxHtml::link('Öppettidr', '/'),
					 'links'=>$this->breadcrumbs,
				)
			);
		?>
		<?php /** @var $content string */ ?>
		<?php echo $content; ?>
	</div>
</body>
</html>
