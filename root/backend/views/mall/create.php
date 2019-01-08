<?php
$this->breadcrumbs=array(
	'Malls'=>array('index'),
	'Create',
);

$this->menu=array(
	array('label'=>'List Mall','url'=>array('index')),
	array('label'=>'Manage Mall','url'=>array('admin')),
);
?>

<h1>Create Mall</h1>

<?php echo $this->renderPartial('_form', array('model'=>$model)); ?>