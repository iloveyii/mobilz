<?php
$this->breadcrumbs=array(
	'Chains'=>array('index'),
	$model->name,
);

$this->menu=array(
	array('label'=>'List Chain','url'=>array('index')),
	array('label'=>'Create Chain','url'=>array('create')),
	array('label'=>'Update Chain','url'=>array('update','id'=>$model->id)),
	array('label'=>'Delete Chain','url'=>'#','linkOptions'=>array('submit'=>array('delete','id'=>$model->id),'confirm'=>'Are you sure you want to delete this item?')),
	array('label'=>'Manage Chain','url'=>array('admin')),
);
?>

<h1>View Chain #<?php echo $model->id; ?></h1>

<?php $this->widget('bootstrap.widgets.BootDetailView',array(
	'data'=>$model,
	'attributes'=>array(
		'id',
		'name',
		'nameSlug',
		'parentId',
		'seoId',
		'textField',
		'websiteField',
		'epostField',
		'phoneField',
		'faxField',
		'addressField',
		'zipcodeField',
		'cityField',
		'url',
		'hasSubchain'
	),
)); ?>

<div class="form-actions">
	<?php $this->widget('bootstrap.widgets.BootButton', array(
															 'url'=>array('chain/update','id'=>$model->id),
															 'type'=>'primary',
															 'label'=>'Update',

														)); ?>
</div>