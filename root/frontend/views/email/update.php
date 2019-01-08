<?php
$this->breadcrumbs=array(
	'Emails'=>array('index'),
	$model->name=>array('view','id'=>$model->id),
	'Update',
);

$this->menu=array(
	array('label'=>'List Email', 'url'=>array('index')),
	array('label'=>'Create Email', 'url'=>array('create')),
	array('label'=>'View Email', 'url'=>array('view', 'id'=>$model->id)),
	array('label'=>'Manage Email', 'url'=>array('admin')),
);
?>

<h1>Update Email <?php echo $model->id; ?></h1>

<?php echo $this->renderPartial('_form', array('model'=>$model)); ?>