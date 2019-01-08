<?php
$this->breadcrumbs=array(
	'Malls',
);

$this->menu=array(
	array('label'=>'Create Mall','url'=>array('create')),
	array('label'=>'Manage Mall','url'=>array('admin')),
);
?>

<h1>Malls</h1>

<?php $this->widget('bootstrap.widgets.BootListView',array(
	'dataProvider'=>$dataProvider,
	'itemView'=>'_view',
)); ?>
