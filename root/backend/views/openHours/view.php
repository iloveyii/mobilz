<?php
$this->breadcrumbs=array(
	'Open Hours'=>array('index'),
	$model->name,
);

$this->menu=array(
	array('label'=>'List OpenHours','url'=>array('index')),
	array('label'=>'Create OpenHours','url'=>array('create')),
	array('label'=>'Update OpenHours','url'=>array('update','id'=>$model->id)),
	array('label'=>'Delete OpenHours','url'=>'#','linkOptions'=>array('submit'=>array('delete','id'=>$model->id),'confirm'=>'Are you sure you want to delete this item?')),
	array('label'=>'Manage OpenHours','url'=>array('admin')),
);
?>

<h1>View OpenHours #<?php echo $model->id; ?></h1>

<?php $this->widget('bootstrap.widgets.BootDetailView',array(
	'data'=>$model,
	'attributes'=>array(
		'id',
		'locationId',
		'name',
		'isClosed',
		'openAt',
		'closeAt',
		'date',
	),
)); ?>
