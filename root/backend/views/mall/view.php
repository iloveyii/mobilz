<?php
$this->breadcrumbs=array(
	'Malls'=>array('index'),
	$model->name,
);

$this->menu=array(
	array('label'=>'List Mall','url'=>array('index')),
	array('label'=>'Create Mall','url'=>array('create')),
	array('label'=>'Update Mall','url'=>array('update','id'=>$model->id)),
	array('label'=>'Delete Mall','url'=>'#','linkOptions'=>array('submit'=>array('delete','id'=>$model->id),'confirm'=>'Are you sure you want to delete this item?')),
	array('label'=>'Manage Mall','url'=>array('admin')),
);
?>

<h1>View Mall #<?php echo $model->id; ?></h1>

<?php $this->widget('bootstrap.widgets.BootDetailView',array(
	'data'=>$model,
	'attributes'=>array(
		'id',
		'name',
		'nameSlug',
		'seoId',
	),
)); ?>
