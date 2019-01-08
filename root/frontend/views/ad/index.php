<?php
/* @var $this AdController */
/* @var $dataProvider CActiveDataProvider */

//$this->breadcrumbs=array(
//	'Ads',
//);

//$this->menu=array(
//	array('label'=>'Create Ad', 'url'=>array('create')),
//	array('label'=>'Manage Ad', 'url'=>array('admin')),
//);
?>
<?php if(false && $this->showCarousel) : ?>
<div class="row">
    <div class="col-md-12">
        <div class="col-md-8 hidden-phone" style="padding-left: 0px;">
            <!-- Carousel 
            ============================================= -->
            <?php $this->getCarousel() ;?>
            <!-- Carousel --> 
        </div>
        <div class="col-md-4 hidden-phone" style="padding-right: 0px;">
            <div class="list-group">
                <strong class="list-group-item" style="border-top-right-radius: 2px; border-top-left-radius: 2px;" > HOT PRODUCTS </strong>
                <div class="list-group-item hot-body">
                    <?php $this->getCarousel() ;?>
                </div>
                <a href="" class="list-group-item" style="border-bottom-right-radius: 2px;border-bottom-left-radius: 2px;">
                    <span class="glyphicon glyphicon-chevron-left" style="float: left;"></span>
                    <span class="glyphicon glyphicon-chevron-right" style="float: right;"></span>
                    &nbsp;
                </a>
            </div>
        </div>
    </div>
</div> <!-- row -->
<?php endif;?>

<div class="row">
    <div class="col-md-12" id="breadcrumbs">
            <?php if(isset($this->breadcrumbs)):?>
                <div>
                <?php $this->widget('bootstrap.widgets.BootBreadcrumbs', array(
                    'links'=>$this->breadcrumbs,
                    'separator'=>'',
                    'encodeLabel'=>FALSE,
                    'notMeBreadcrumbs'=>$this->notMeBreadcrumbs,
                )); ?>
                </div>
            <?php endif?>
            <div class="col-md-4 no-pad" style="margin-bottom: 10px">
                <div class="btn-group">
                    <button id="items-view" type="button" class="btn btn-default"><i class="fa fa-th-large"></i></button>
                    <button id="list-view" type="button" class="btn btn-default"><i class="fa fa-th-list"></i></button>
                </div>
                <div class="btn-group">
                    <a href="savedsearch" id="items-view" type="button" class="btn btn-default"><i class="fa fa-save"></i>  Spara sökning</a>
                </div>
            </div>
            <div class="col-md-8 no-pad">
                <div class="pull-right hidden-phone" style="margin: 0px">
                    <?php $this->widget('LinkPager', array(
                        'pages' => $pages,
                        'maxButtonCount'=>5,
                    )) ?>
                </div>
            </div>
        <div class="clear33"></div>
        <hr>
    </div>
    
</div>
<br />

<div class="row">
    
    <?php $this->widget('Productview', array(
        'style'=>  'list',
        'models'=>  $models,
        'prevParams'=>  $prevParams,
    ));?>
    
</div>

<?php $this->widget('LinkPager', array(
    'pages' => $pages,
    'maxButtonCount'=>5,
)) ?>

<?php 
    $url = Yii::app()->createUrl('ad/showview');

    Yii::app()->clientScript->registerScript('showView', "
       $('#items-view').click(function(){
          showView('item');
       });
       
       $('#list-view').click(function(){
          showView('list');
       });
       
       function showView(style){
        $.ajax({
            type: 'POST',
            url: '$url',
            dataType: 'json',
            data: {'style':style},
            timeout:19200,
            error: function(request, error) {
                if(error=='timeout') {
                    alert('The request timed out, please resubmit');
                }
            },
            success: function(response) {
                if(response['status']=='success'){
                   location.reload();
                }
            }
        });
        return false;
    };

    ");
?>