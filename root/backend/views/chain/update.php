<?php
$this->breadcrumbs=array(
	'Chains'=>array('index'),
	$model->name=>array('view','id'=>$model->id),
	'Update',
);

$this->menu=array(
	array('label'=>'List Chain','url'=>array('index')),
	array('label'=>'Create Chain','url'=>array('create')),
	array('label'=>'View Chain','url'=>array('view','id'=>$model->id)),
	array('label'=>'Manage Chain','url'=>array('admin')),
);
?>

<h1>Update Chain <?php echo $model->id; ?></h1>

<?php echo $this->renderPartial('_form',array('model'=>$model)); ?>