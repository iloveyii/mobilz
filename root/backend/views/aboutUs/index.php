<?php
$this->breadcrumbs=array(
	'About Uses',
);

$this->menu=array(
	array('label'=>'Create AboutUs', 'url'=>array('create')),
	array('label'=>'Manage AboutUs', 'url'=>array('admin')),
);
?>

<h1>About Uses</h1>

<?php $this->widget('zii.widgets.CListView', array(
	'dataProvider'=>$dataProvider,
	'itemView'=>'_view',
)); ?>
