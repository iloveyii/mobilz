<?php
/* @var $this UserController */
/* @var $model User */

$this->breadcrumbs=array(
	'Users'=>array('index'),
	'Create',
);

$this->menu=array(
	array('label'=>'List User', 'url'=>array('index')),
	array('label'=>'Manage User', 'url'=>array('admin')),
);
?>

<div class="col-md-10 col-md-offset-1 form-flat">
    <h1>Skapa Konto</h1>
    <div class="col-md-12"><h3>Dina bevakningar och annonser på ett ställe är gratis!</h3></div>
    <?php $this->renderPartial('_form', array('model'=>$model)); ?>
</div>