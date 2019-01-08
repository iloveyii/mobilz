<?php
/* @var $this AdController */
/* @var $model Ad */

$this->breadcrumbs=array(
	'Ads'=>array('index'),
	'Create',
);

$this->menu=array(
	array('label'=>'List Ad', 'url'=>array('index')),
	array('label'=>'Manage Ad', 'url'=>array('admin')),
);
?>
<div class="row">
    <div class="col-lg-12">
        <ol class="breadcrumb">
            <li><a href="/">Home</a></li>
            <li class="active"><a href="">Contact</a></li>
        </ol>
    </div>
</div>
<h1>Lägg in Annons</h1>
̈́
<?php $this->renderPartial('_form', array(
        'model'=>$model, 
        'countiesList'=>$countiesList,
        'productsList'=>$productsList,
        'companiesList'=>$companiesList,
        'citiesList' => $citiesList,
    )
); 
?>
