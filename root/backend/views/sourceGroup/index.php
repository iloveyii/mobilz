<?php
$this->breadcrumbs=array(
	'Source Groups',
);

$this->menu=array(
	array('label'=>'Create SourceGroup','url'=>array('create')),
	array('label'=>'Manage SourceGroup','url'=>array('admin')),
);
?>

<h1>Source Groups</h1>

<?php $this->widget('bootstrap.widgets.BootListView',array(
	'dataProvider'=>$dataProvider,
	'itemView'=>'_view',
)); ?>
