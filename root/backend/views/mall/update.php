<?php
$this->breadcrumbs=array(
	'Malls'=>array('index'),
	$model->name=>array('view','id'=>$model->id),
	'Update',
);

$this->menu=array(
	array('label'=>'List Mall','url'=>array('index')),
	array('label'=>'Create Mall','url'=>array('create')),
	array('label'=>'View Mall','url'=>array('view','id'=>$model->id)),
	array('label'=>'Manage Mall','url'=>array('admin')),
);
?>

<h1>Update Mall <?php echo $model->id; ?></h1>

<?php echo $this->renderPartial('_form',array('model'=>$model)); ?>