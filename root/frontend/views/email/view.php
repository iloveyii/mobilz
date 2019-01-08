<?php
$this->breadcrumbs=array(
	'Emails'=>array('index'),
	$model->name,
);

$this->menu=array(
	array('label'=>'List Email', 'url'=>array('index')),
	array('label'=>'Create Email', 'url'=>array('create')),
	array('label'=>'Update Email', 'url'=>array('update', 'id'=>$model->id)),
	array('label'=>'Delete Email', 'url'=>'#', 'linkOptions'=>array('submit'=>array('delete','id'=>$model->id),'confirm'=>'Are you sure you want to delete this item?')),
	array('label'=>'Manage Email', 'url'=>array('admin')),
);
?>
<br />
<span class="alert alert-success"><i class="fa fa-info-circle">&nbsp;&nbsp;</i>Your email has been sent successfully.</span><hr />

<?php $this->widget('zii.widgets.CDetailView', array(
	'data'=>$model,
	'attributes'=>array(
		'name',
		'mobile',
		'message',
	),
)); ?>
