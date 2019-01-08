<div class="row">
    <div class="col-md-12" id="breadcrumbs">
        <?php if(isset($this->breadcrumbs)):?>
            <?php $this->widget('bootstrap.widgets.BootBreadcrumbs', array(
                'links'=>$this->breadcrumbs,
                'separator'=>' ',
                'encodeLabel'=>FALSE,
                'notMeBreadcrumbs'=>$this->notMeBreadcrumbs,
            )); ?>
        <?php endif?>
    </div>
</div> 

<div class="row">
    <div class="items">
<!--        <div class="col-md-4" style="padding: 0px; border: 1px solid #DEDEDE; text-align: center;">
            <div class="col-md-3" style="padding: 0px;"><a href="#" style="display: inline-block;width: 100%;background-color:#DEDEDE;">-</a></div>
            <div class="col-md-6" style="padding: 0px; text-align: center;">
                <span style="margin: 0px;padding: 0px;display: block; border-left:1px solid #DEDEDE; border-right:1px solid #DEDEDE;">1</span>
            </div>
            <div class="col-md-3" style="padding: 0px;"><a href="#" style="display: inline-block;width: 100%;background-color:#DEDEDE;">+</a></div>
        </div>-->
        
        <div class="col-md-12">
            <div class="thumbnail product-detail">
                <a href="#">
                    <img id="testImage" src="<?php echo $pImage ;?>" class="product-detail-img">
                </a>
                <div class="caption">
                    <h4><?php echo $model->name ;?></h4>
                    <p>SEK: <?php echo $model->price ;?></p>
                </div>
            </div>
            <?php foreach ($images as $image): ?>
            <div class="col-xs-3 col-md-2 no-pad product-detail">
                <div class="thumbnail">
                    <a href="<?php echo $model->getUrl($prevParams, $image->id) ;/* $image->getAdLink($model->id);*/ ?>">
                        <img style="height: 90px; width: 100%;"  src="<?php echo $image->getImage() ;?>" class="img-responsive">
                    </a>
                </div>
            </div>
            <?php endforeach; ?>
        </div>
        <div class="clear33"></div> <br />
        <div class="col-md-12">
            <div class="detail-header">
                <h3><i class="<?php echo $model->getIcon() ;?>"></i> <?php echo ($model->name);?><div  class="pull-right" style="font-size:16px;line-height:30px;"><?php echo $model->showPublished();?></div></h3>
            </div>
            
            <div class="detail-city">
            <?php if($cityBages !==FALSE): ?>
                <?php echo $cityBages;?>
            <?php endif;?>
            <?php if($model->price != 'NA'): ?>
                <h1 style="font-size: 35px; line-height: 40px;  color: #46B8DA;"><?php echo $model->price;?>:-</h1>
            <?php endif;?>
            
            </div>        
                    
            <p>
                <?php echo ($model->description);?>
            </p>
            
            <?php if(!is_null($model->contact) && !empty($model->contact)): ?>
            <p>
                <strong>Contact:  </strong><?php echo $model->contact; ?>
            </p>
            <?php endif;?>
            <div class="detail-footer">
                <?php if(!is_null($model->contact) && !empty($model->contact)): ?>
                <a  href="tel:<?php echo $model->contact; ?>" class="btn btn-info btn-mini"><i class="fa fa-phone-square"></i>&nbsp;   <strong><?php echo $model->contact; ?></strong></a>
                <?php endif;?>  
                <a href="<?php echo $this->createUrl('email/announser', array('id'=>$model->id)) ;?>" class="btn btn-success"><i class="fa fa-envelope-o"></i>&nbsp; CONTACT ADVERTISER</a>
            </div>
        </div>
    </div>
    
</div>


<?php 
    $endpoint = $this->createUrl('ad/url');
//    $this->widget(
//        'ext.editable.EditableField',
//        array(
//            'type' => 'text',
//            'model' => $model,
//            'attribute' => 'name', // $model->name will be editable
//            'url' => $endpoint, //url for submit data
//        )
//    );


?>