<?php
/* @var $this AdController */
/* @var $model Ad */

$this->breadcrumbs=array(
	'Ads'=>array('index'),
	$model->name,
);

//$this->menu=array(
//	array('label'=>'List Ad', 'url'=>array('index')),
//	array('label'=>'Create Ad', 'url'=>array('create')),
//	array('label'=>'Update Ad', 'url'=>array('update', 'id'=>$model->id)),
//	array('label'=>'Delete Ad', 'url'=>'#', 'linkOptions'=>array('submit'=>array('delete','id'=>$model->id),'confirm'=>'Are you sure you want to delete this item?')),
//	array('label'=>'Manage Ad', 'url'=>array('admin')),
//);
?>

<div class="row">
    <div class="col-md-12">
        <h1>View Ad #<?php echo $model->id; ?></h1>

        <?php $this->widget('zii.widgets.CDetailView', array(
                'data'=>$model,
                'attributes'=>array(
                    'id',
                    'name',
                    'active',
                    'price',
                    'city_id',
                ),
        )); ?>
    </div>
</div>
<div class="row">
    <div class="col-md-12">
        <hr />
        <a class="btn btn-info" href="<?php echo $model->getUrl(array()); ?>" >Visa annonser</a>
    </div>
</div>
