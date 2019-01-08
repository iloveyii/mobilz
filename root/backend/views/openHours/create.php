<?php
$this->breadcrumbs=array(
	'Open Hours'=>array('index'),
	'Create',
);

$this->menu=array(
	array('label'=>'List OpenHours','url'=>array('index')),
	array('label'=>'Manage OpenHours','url'=>array('admin')),
);
?>

<h1>Create OpenHours</h1>

<?php echo $this->renderPartial('_form', array('model'=>$model)); ?>