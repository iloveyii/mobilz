<?php
$this->breadcrumbs=array(
	'About Uses'=>array('index'),
	$model->fldID,
);

$this->menu=array(
	array('label'=>'List AboutUs', 'url'=>array('index')),
	array('label'=>'Create AboutUs', 'url'=>array('create')),
	array('label'=>'Update AboutUs', 'url'=>array('update', 'id'=>$model->fldID)),
	array('label'=>'Delete AboutUs', 'url'=>'#', 'linkOptions'=>array('submit'=>array('delete','id'=>$model->fldID),'confirm'=>'Are you sure you want to delete this item?')),
	array('label'=>'Manage AboutUs', 'url'=>array('admin')),
);
?>

<h1>View AboutUs #<?php echo $model->fldID; ?></h1>

<?php $this->widget('bootstrap.widgets.BootDetailView', array(
	'data'=>$model,
	'attributes'=>array(
		'fldID',
		'fldContent',
	),
)); ?>
