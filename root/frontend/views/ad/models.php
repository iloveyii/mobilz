<?php if(isset($this->breadcrumbs)):?>
    <?php $this->widget('bootstrap.widgets.BootBreadcrumbs', array(
        'links'=>$this->breadcrumbs,
        'separator'=>'',
        'encodeLabel'=>FALSE,
        'notMeBreadcrumbs'=>$this->notMeBreadcrumbs,
    )); ?>
<?php endif?>

<div class="col-md-12"> <!-- col-md-12 minimizes space here -->
        <?php foreach ($models as $model): ;?>
        <div class="row">
            <div class="col-md-3">
                <div class="thumbnail">
                    <a href="#">
                        <p>
                            <a href="<?php echo $model->getUrl($prevParams); ?>">
                            
                            <img style="height: 125px;" src="<?php echo $model->getPrimaryImagePath();?>" class="img-responsive">
                            
                            </a>
                        </p>
                        
                    </a>
                </div>
            </div>
            <div class="col-md-9">
                <p><?php echo $model->showPublished();?></p>
                <p><a href="<?php echo $model->getUrl($prevParams); ?>"><h4><?php echo CHtml::encode($model->name);?></h4></a></p>
                <p>SEK <?php echo $model->price ;?></p>
                <p><?php echo $model->showCities();?></p>
                <p><?php echo $model->id;?></p>
            </div>
        </div>
        <hr class="visible-xs visible-sm" />
        <?php endforeach;?>
    </div>

// display pagination
<?php $this->widget('CLinkPager', array(
    'pages' => $pages,
)) ?>

