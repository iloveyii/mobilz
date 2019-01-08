<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8">
        <title><?php echo GxHtml::encode($this->getTitle()); ?></title>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
        <meta http-equiv="Content-Language" content="sv-SE"/>
        <meta name="description" content="<?php echo GxHtml::encode($this->getMetaDescription()); ?>"/>
        <meta name="keywords" content="<?php echo GxHtml::encode($this->getMetaKeyWords()); ?>"/>

        <meta name="viewport" content="width=device-width">
        <link type="text/css" rel="stylesheet" href="<?php echo Yii::app()->baseUrl; ?>/css/bootstrap.min.css" />
        <link type="text/css" rel="stylesheet" href="<?php echo Yii::app()->baseUrl; ?>/css/main.css" />
        <link type="text/css" rel="stylesheet" href="<?php echo Yii::app()->baseUrl; ?>/css/home.css" />
        <link type="text/css" rel="stylesheet" href="<?php echo Yii::app()->baseUrl; ?>/css/index.css" />
        <link type="text/css" rel="stylesheet" href="<?php echo Yii::app()->baseUrl; ?>/css/font-awesome.css" rel="stylesheet">
        <link type="text/css" rel="stylesheet" href="<?php echo Yii::app()->baseUrl; ?>/css/bootstrap-tags.css" rel="stylesheet">
        <link type="text/css" rel="stylesheet" href="<?php echo Yii::app()->baseUrl; ?>/css/flat.css" rel="stylesheet">
        <link type="text/css" rel="stylesheet" href="<?php echo Yii::app()->baseUrl; ?>/css/gotya.css" rel="stylesheet">
        <style>
            .carousel-control {
                padding-top:10%;
                width:5%;
              }
        </style>
        
        <script>
        
            $(document).ready(function() {
                $('#myCarousel').carousel({
                interval: 8000
                })

                $('#myCarousel').on('slid.bs.carousel', function() {
                    //alert("slid");
                });


            });


        
        
        </script>
    </head>
    <body>
        
        <!-- wrapper 
        ============= -->
        <div id="page-wrapper">
            <!-- Navigation bar with drop down box
            ================================================== -->
            <?php $this->widget('Menu', array('type'=>'WhiteHouse', 'category'=>$this->category, 'active'=>$this->active)); ?>
            <!-- Navigation -->
            
            
            <div class="container">
                
                <div class="row">
                        <div class="col-md-12">
                             <h1>Senaste Annonser</h1>
                             <?php $this->widget('AdSlider'); ?>
                        </div>
                    
                </div>
                
                
                <div class="row">
                    <div class="col-md-3">
                        
                        <div class="list-group">
                            <strong class="list-group-item active"> Main </strong>
                            <?php echo $this->secondNav ;?>
                        </div>
                        
                    </div>
                    
                    <div class="col-md-9">
                            <?php echo $content; ?>
                    </div>
                    
                </div>
            </div>
            
        </div>
        <!-- / Wrapper -->

        <!-- Footer and Modal -->
        <?php $this->widget('Footer');?>
        <!-- /Footer and Modal -->

         <script src="<?php echo Yii::app()->baseUrl; ?>/js/bootstrap-tags.js"></script>
        <script src="<?php echo Yii::app()->baseUrl; ?>/js/flexslider.js"></script>
        <script src="<?php echo Yii::app()->baseUrl; ?>/js/jquery.cslider.js"></script>
        <script src="<?php echo Yii::app()->baseUrl; ?>/js/custom.js"></script>
        
    </body>
    
</html>