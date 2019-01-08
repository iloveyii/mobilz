<?php
$this->breadcrumbs=array(
	'Sources'=>array('index'),
	$model->id,
);

$this->menu=array(
	array('label'=>'List Source','url'=>array('index')),
	array('label'=>'Create Source','url'=>array('create')),
	array('label'=>'Update Source','url'=>array('update','id'=>$model->id)),
	array('label'=>'Delete Source','url'=>'#','linkOptions'=>array('submit'=>array('delete','id'=>$model->id),'confirm'=>'Are you sure you want to delete this item?')),
	array('label'=>'Manage Source','url'=>array('admin')),
);
?>

<h1>View Source #<?php echo $model->id; ?></h1>

<?php $this->widget('bootstrap.widgets.BootDetailView',array(
	'data'=>$model,
	'attributes'=>array(
		'id',
		'url',
		'locationId',
		'sourceGroupId',
	),
)); ?>
