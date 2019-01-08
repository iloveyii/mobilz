<?php
$this->breadcrumbs=array(
	'Emails'=>array('index'),
	'Create',
);

$this->menu=array(
	array('label'=>'List Email', 'url'=>array('index')),
	array('label'=>'Manage Email', 'url'=>array('admin')),
);
?>

<div class="row">
    <div class="items">
        <div class="col-md-5">
            <div class="thumbnail">
                <a href="#">
                    <img id="testImage" style="height: 225px;" src="<?php echo $Ad->getPrimaryImagePath() ;?>" class="img-responsive">
                </a>
<!--                <div class="caption">
                    <h4><?php echo $Ad->name ;?></h4>
                    <p>SEK: <?php echo $Ad->price ;?></p>
                </div>-->
            </div>
        </div>
        <div class="clear33 hidden-desktop"></div>
        <div class="col-md-7">
            <div class="detail-header">
                <h3><i class="<?php echo $Ad->getIcon() ;?>"></i> <?php echo ($Ad->name);?></h3>
            </div>
            
            <div class="detail-city">
            <?php if($cityBages !==FALSE): ?>
                <?php echo $cityBages;?>
            <?php endif;?>
            <?php if($Ad->price != 'NA'): ?>
                <h1 style="font-size: 35px; line-height: 40px;  color: #46B8DA;"><?php echo $Ad->price;?>:-</h1>
            <?php endif;?>
            
            </div>  
            <p>
                <?php echo ($Ad->rubrik);?>
            </p>
        </div>
    </div>
    
</div>



<h1>Mejla Annonsören</h1>

<?php echo $this->renderPartial('_form', array('model'=>$model)); ?>


