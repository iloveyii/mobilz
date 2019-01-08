<!DOCTYPE html>
<html>
    <head>

        <title>Mobilz alla Sverige- Login, Registera, Kontakt </title>
        <meta charset="UTF-8">
        
        <meta http-equiv="cache-control" content="max-age=0" />
        <meta http-equiv="cache-control" content="no-cache" />
        <meta http-equiv="expires" content="0" />
        <meta http-equiv="expires" content="Tue, 01 Jan 1980 1:00:00 GMT" />
        <meta http-equiv="pragma" content="no-cache" />

        <meta name="viewport" content="width=device-width">
        <link type="text/css" rel="stylesheet" href="<?php echo Yii::app()->baseUrl; ?>/css/bootstrap.css" />
        <link type="text/css" rel="stylesheet" href="<?php echo Yii::app()->baseUrl; ?>/css/main.css" />
        <link type="text/css" rel="stylesheet" href="<?php echo Yii::app()->baseUrl; ?>/css/home.css" />
        <link type="text/css" rel="stylesheet" href="<?php echo Yii::app()->baseUrl; ?>/css/index.css" />
        <link type="text/css" rel="stylesheet" href="<?php echo Yii::app()->baseUrl; ?>/css/font-awesome.css" rel="stylesheet">
        <link type="text/css" rel="stylesheet" href="<?php echo Yii::app()->baseUrl; ?>/css/flat.css" rel="stylesheet">
        
    </head>
    <body>
        
        <!-- wrapper 
        ============= -->
        <div id="page-wrapper">
            <!-- Navigation bar with drop down box
             ================================================== -->
             <?php $this->widget('Menu', array('type'=>'WhiteHouse','category'=>$this->category, 'active'=>$this->active)); ?>
             <!-- Navigation -->
            
            <div class="container">
                <div class="row">
                    <!-- column1 -->
                    <div class="col-md-2">
                    </div> <!-- column1 -->
                    
                    <!-- column2 -->
                    <div class="col-md-7">
                        <div class="row">
                            <div class="col-md-12">
                                <!-- Carousel 
                                ============================================= -->
                                <?php $this->getCarousel() ;?>
                                <!-- Carousel -->
                            </div>
                        </div>
                        
                        <div class="row">
                            <?php echo $content; ?>
                        </div>
                    </div> <!-- column2 -->
                    
                    <!-- column3 -->
                    <div class="col-md-3">
                        
                    </div>
                    <!-- column3 -->
                </div>
            </div>
            
        </div>
        <!-- / Wrapper -->
        
        <!-- Footer and Modal -->
        <?php $this->widget('Footer');?>
        <!-- /Footer and Modal -->
         
    </body>
    
</html>