<?php
$this->breadcrumbs=array(
	'About Uses'=>array('index'),
	$model->fldID=>array('view','id'=>$model->fldID),
	'Update',
);

$this->menu=array(
	array('label'=>'List AboutUs', 'url'=>array('index')),
	array('label'=>'Create AboutUs', 'url'=>array('create')),
	array('label'=>'View AboutUs', 'url'=>array('view', 'id'=>$model->fldID)),
	array('label'=>'Manage AboutUs', 'url'=>array('admin')),
);
?>

<h1>Update AboutUs <?php echo $model->fldID; ?></h1>

<?php echo $this->renderPartial('_form', array('model'=>$model)); ?>