<?php
/* @var $this AdController */
/* @var $dataProvider Ad */

?>

<h1>Mina sparade sökningar</h1>

<?php $this->widget('bootstrap.widgets.BootGridView', array(
	'id'=>'ad-grid',
	'dataProvider'=>$dataProvider,
        'type'=>'striped bordered',
	'columns'=>array(
        'id',
        'search_id',
        'name',

        array(
            'class'=>'CButtonColumn',
            'htmlOptions'=>array('style'=>'white-space:nowrap;'),
            'viewButtonUrl' => '$data->getViewUrl()',
            'deleteButtonUrl' => 'Yii::app()->createUrl("savedsearch/delete", array("id"=>1))',
            'template'=>'{view} {delete}',
        ),
	),
)); ?>

