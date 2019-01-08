<?php
$this->breadcrumbs=array(
	'Source Groups'=>array('index'),
	$model->name=>array('view','id'=>$model->id),
	'Update',
);

$this->menu=array(
	array('label'=>'List SourceGroup','url'=>array('index')),
	array('label'=>'Create SourceGroup','url'=>array('create')),
	array('label'=>'View SourceGroup','url'=>array('view','id'=>$model->id)),
	array('label'=>'Manage SourceGroup','url'=>array('admin')),
);
?>

<h1>Update SourceGroup <?php echo $model->id; ?></h1>

<?php echo $this->renderPartial('_form',array('model'=>$model)); ?>