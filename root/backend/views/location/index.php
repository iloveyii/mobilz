<?php
$this->breadcrumbs=array(
	'Locations',
);

$this->menu=array(
	array('label'=>'Create Location','url'=>array('create')),
	array('label'=>'Manage Location','url'=>array('admin')),
);
?>

<h1>Locations</h1>

<?php $this->widget('bootstrap.widgets.BootListView',array(
	'dataProvider'=>$dataProvider,
	'itemView'=>'_view',
)); ?>
