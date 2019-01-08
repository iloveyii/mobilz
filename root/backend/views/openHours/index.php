<?php
$this->breadcrumbs=array(
	'Open Hours',
);

$this->menu=array(
	array('label'=>'Create OpenHours','url'=>array('create')),
	array('label'=>'Manage OpenHours','url'=>array('admin')),
);
?>

<h1>Open Hours</h1>

<?php $this->widget('bootstrap.widgets.BootListView',array(
	'dataProvider'=>$dataProvider,
	'itemView'=>'_view',
)); ?>
