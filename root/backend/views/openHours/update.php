<?php
$this->breadcrumbs=array(
	'Open Hours'=>array('index'),
	$model->name=>array('view','id'=>$model->id),
	'Update',
);

$this->menu=array(
	array('label'=>'List OpenHours','url'=>array('index')),
	array('label'=>'Create OpenHours','url'=>array('create')),
	array('label'=>'View OpenHours','url'=>array('view','id'=>$model->id)),
	array('label'=>'Manage OpenHours','url'=>array('admin')),
);
?>

<h1>Update OpenHours <?php echo $model->id; ?></h1>

<?php echo $this->renderPartial('_form',array('model'=>$model)); ?>