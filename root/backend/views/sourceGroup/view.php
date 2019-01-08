<?php
$this->breadcrumbs=array(
	'Source Groups'=>array('index'),
	$model->name,
);

$this->menu=array(
	array('label'=>'List SourceGroup','url'=>array('index')),
	array('label'=>'Create SourceGroup','url'=>array('create')),
	array('label'=>'Update SourceGroup','url'=>array('update','id'=>$model->id)),
	array('label'=>'Delete SourceGroup','url'=>'#','linkOptions'=>array('submit'=>array('delete','id'=>$model->id),'confirm'=>'Are you sure you want to delete this item?')),
	array('label'=>'Manage SourceGroup','url'=>array('admin')),
);
?>

<h1>View SourceGroup #<?php echo $model->id; ?></h1>

<?php $this->widget('bootstrap.widgets.BootDetailView',array(
	'data'=>$model,
	'attributes'=>array(
		'id',
		'name',
	),
)); ?>
