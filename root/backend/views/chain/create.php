<?php
$this->breadcrumbs=array(
	'Chains'=>array('index'),
	'Create',
);

$this->menu=array(
	array('label'=>'List Chain','url'=>array('index')),
	array('label'=>'Manage Chain','url'=>array('admin')),
);
?>

<h1>Create Chain</h1>

<?php echo $this->renderPartial('_form', array('model'=>$model)); ?>