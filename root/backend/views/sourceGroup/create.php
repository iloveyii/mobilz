<?php
$this->breadcrumbs=array(
	'Source Groups'=>array('index'),
	'Create',
);

$this->menu=array(
	array('label'=>'List SourceGroup','url'=>array('index')),
	array('label'=>'Manage SourceGroup','url'=>array('admin')),
);
?>

<h1>Create SourceGroup</h1>

<?php echo $this->renderPartial('_form', array('model'=>$model)); ?>