<?php
$this->breadcrumbs=array(
	'Chains',
);

$this->menu=array(
	array('label'=>'Create Chain','url'=>array('create')),
	array('label'=>'Manage Chain','url'=>array('admin')),
);
?>

<h1>Chains</h1>

<?php $this->widget('bootstrap.widgets.BootListView',array(
	'dataProvider'=>$dataProvider,
	'itemView'=>'_view',
)); ?>
