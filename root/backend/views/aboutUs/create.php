<?php
$this->breadcrumbs=array(
	'About Uses'=>array('index'),
	'Create',
);

$this->menu=array(
	array('label'=>'List AboutUs', 'url'=>array('index')),
	array('label'=>'Manage AboutUs', 'url'=>array('admin')),
);
?>

<h1>Create AboutUs</h1>

<?php echo $this->renderPartial('_form', array('model'=>$model)); ?>