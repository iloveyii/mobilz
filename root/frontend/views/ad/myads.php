<?php
/* @var $this AdController */
/* @var $dataProvider Ad */

?>
<div class="row">
    <div class="col-lg-12">
        <ol class="breadcrumb">
            <li><a href="/">Home</a></li>
            <li class="active"><a href="">Contact</a></li>
        </ol>
    </div>
</div>
<h1>Mitt Annonser</h1>


<?php $this->widget('bootstrap.widgets.BootGridView', array(
	'id'=>'ad-grid',
	'dataProvider'=>$dataProvider,
        'type'=>'striped bordered',
	'columns'=>array(
		array(
            'header'=>'Bild',
            'value'=>'$data->getPrimaryImageTag()',
            'type'=>'raw',
            ),
            'name',
            'price',
            'published',
            array(
                'header'=>'active',
                'name'=>'active',
                'value'=>'$data->getActive()',
                'type'=>'raw',
            ),
		
		array(
            'class'=>'CButtonColumn',
            'htmlOptions'=>array('style'=>'white-space:nowrap;'),
            'viewButtonUrl' => '$data->getUrl(array())',
		),
//                array(
//                    'header' => Yii::t('ses', 'Remove'),
//                    'class' => 'bootstrap.widgets.BootButtonColumn',
//                    'deleteButtonUrl' => 'Yii::app()->createUrl("cart/delete/", array("id"=>$data->id))',
//                    "template"=>"{delete}",
//                ),
	),
)); ?>

