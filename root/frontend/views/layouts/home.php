<!DOCTYPE html>
<html>
    <head>
        <title>Hitta och Köpa Mobil Telefone, Tablet, iPad, iPod, NoteBook | Mobilz.se - ladda upp din mobil, laptop annons gratis</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width">
        <meta content="Hitta Mobil Telefone tableter in Stockholm, Götenburg, Malmö, alla Sverige  | Mobilz" name="description">
        <meta content="Hitta Mobil, Tabletter, NoteBook, iPhone, Galaxy, Sony i Stockholm, Göteborg, Malmö samt resten av Sverige" name="keywords">
        <link type="text/css" rel="stylesheet" href="<?php echo Yii::app()->baseUrl; ?>/css/bootstrap.css" />
        <link type="text/css" rel="stylesheet" href="<?php echo Yii::app()->baseUrl; ?>/css/home.css" />
        <link type="text/css" rel="stylesheet" href="<?php echo Yii::app()->baseUrl; ?>/css/font-awesome.css" rel="stylesheet">
        <link type="text/css" rel="stylesheet" href="<?php echo Yii::app()->baseUrl; ?>/css/blog.css" rel="stylesheet">
        <link type="text/css" rel="stylesheet" href="<?php echo Yii::app()->baseUrl; ?>/css/main.css" rel="stylesheet">
        <link type="text/css" rel="stylesheet" href="<?php echo Yii::app()->baseUrl; ?>/css/index.css" rel="stylesheet">
    </head>
    <body>
        <!-- Fixed Navigation bar with drop down box
        ================================================== -->
        <?php $this->widget('Menu', array('type'=>'WhiteHouse', 'category'=>$this->category, 'active'=>$this->active)); ?>
        <!-- Navigation -->
        
        <!-- Wrapper
        ================================================= -->
        <div id="wrap" style="padding-top:0px;margin: 0px;"> 
        
            <!-- Carousel 
            ============================================= -->
            <?php  echo Carousel::model()->getCarousel();?>
            <!-- /Carousel -->
        
            <div class="green strip jumbotron">
                <div class="shine">
                    <div class="container1">
                        <div class="row">
                            <div class="col-md-7">
                                <blockquote>Providing you the best services ever</blockquote>
                            </div>
                            <div class="col-md-5 overflow_hidden">
                                <a id="demoLink2" href="<?php echo $this->createUrl('user/create');?>" class="btn btn-home btn-large cboxElement" title="registrera dig gratis nu">Registrera gratis</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Grid
            ========================================== -->
        
            <div class="container">
                <div class="row">
                    <div class="col-md-12">
                        <h1>Välkommen - Shope eller sälja mobiler, tablet och bärbara datorer</h1>
                        <br />
                    </div>
                    
                    <div class="col-sm-10 col-md-6">
                        <div style="height: 155px; display: table">
                            <h3><a href="http://www.mobilz.se/">Köp Mobiltelefoner, tabletter och bärbara datorer</a></h3>
                            Du kan registrera på denna webbplats för att hitta den mobil, tablet, iPad eller bärbara dator som du vill. Välj den produkt du vill ha och sedan den plats som är nära dig ..
                            <p><small class="text-muted"><a class="text-muted" href="#">Read more</a></small></p>
                        </div>
                        <?php $this->widget('Tag', array('model'=>'Product', 'urlParams'=>array('product_slug'=>'slug'), 'type'=>1));?>
                    </div>
                    
                    <div class="col-sm-10 col-md-6">
                        <div style="height: 155px; display: table">
                            <h3><a href="#">Sale Mobiltelefoner, tabletter och bärbara datorer</a></h3>
                            Du kan också öppna din webbshop på denna webbplats och ladda upp de produkter som du skulle vilja sälja ..
                            <p><small class="text-muted"><a class="text-muted" href="#">Read more</a></small></p>
                        </div>
                        <?php $this->widget('Tag', array('model'=>'Product', 'urlParams'=>array('product_slug'=>'slug'), 'type'=>1));?>
                    </div>
                    
                </div>
                
                <div class="row">
                    <div class="col-sm-12">
                        <div class="page-header text-muted divider">
                          Hitta efter område
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-12">
                        <div class="jumbotron" style="background-color: #F1F8E0; /* #80B2FF */">
                            <h1><a href="<?php echo Yii::app()->createUrl("ad/index");?>">Alla Sverige</a></h1>

                            <div class="box-product box-subcat">
                                <?php $this->widget('CountyStats', array('perRow'=>4)); ?>
                            </div>

                            <div class="clear33"></div>
                            <br />
                            <p><a href="<?php echo Yii::app()->createUrl("ad/index");?>" class="btn btn-success btn-lg" role="button" style="border:1px solid green"><?php echo Yii::t('app','Läs mer'); ?></a></p>
                        </div>
                    </div>
                </div>
                
                <div class="row">
                    <div class="col-sm-12">
                        <div class="page-header text-muted divider">
                          Mobiltelefoner
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-12">
                        <div class="jumbotron" style="background-color: #D1EFFD; /* #80B2FF */">
                            <h1><a href="<?php echo Yii::app()->createUrl("ad/url", array('product_slug'=>'mobiles') );?>">Mobiltelefoner</a></h1>

                            <div class="box-product box-subcat">
                                <?php $this->widget('HomeUl', array('perRow'=>4, 'product_id'=>1, 'product_slug'=>'mobiles')); ?>
                            </div>

                            <div class="clear33"></div>
                            <br />
                            <p><a href="<?php echo Yii::app()->createUrl("ad/url", array('product_slug'=>'mobiles') );?>" class="btn btn-success btn-lg" role="button" style="border:1px solid green"><?php echo Yii::t('app','Läs mer'); ?></a></p>
                        </div>
                    </div>
                </div>
                
                <div class="row">
                    <div class="col-sm-12">
                        <div class="page-header text-muted divider">
                          Tablets och NoteBooks
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-6">
                        <div class="panel panel-success">
                            <div class="panel-heading">
                                <h2 class="panel-title"><a href="<?php echo Yii::app()->createUrl("ad/url", array('product_slug'=>'tablet',) );?>">Tablets</a></h2>
                            </div>
                            <div class="panel-body" style="height: 120px;">
                                <?php $this->widget('HomeUl', array('perRow'=>4, 'product_id'=>7, 'product_slug'=>'tablet')); ?>
                            </div>
                            <div class="panel-footer" style="background-color: #FFF; border: none;">
                                <a role="button" href="" class="btn btn-success">
                                    <i class="fa fa-tablet"></i>&nbsp;&nbsp;&nbsp;<?php echo Yii::t('app','Läs mer'); ?>
                                </a>
                            </div>
                        </div>
                    </div>
                    
                    <div class="col-md-6">
                        <div class="panel panel-danger">
                            <div class="panel-heading">
                                <h2 class="panel-title"><a href="<?php echo Yii::app()->createUrl("ad/url", array('product_slug'=>'notebook',) );?>">NoteBooks</a></h2>
                            </div>
                            <div class="panel-body" style="height: 120px;">
                                <?php $this->widget('HomeUl', array('perRow'=>4, 'product_id'=>8, 'product_slug'=>'notebook')); ?>
                            </div>
                            <div class="panel-footer" style="background-color: #FFF; border: none;">
                                <a role="button" href="" class="btn btn-success">
                                    <i class="fa fa-tablet"></i>&nbsp;&nbsp;&nbsp;<?php echo Yii::t('app','Läs mer'); ?>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
                
                
                <div class="row">
                    <div class="col-sm-12">
                        <div class="page-header text-muted divider">
                          Tillbehör
                        </div>
                    </div>
                </div>
            
                <div class="row">
                    <div class="col-sm-12">
                        <?php $this->widget('Type2', array('perRow'=>4, 'show'=>4)); ?>
                    </div>
                </div>
                
                
                <div class="row">    
                    <div class="col-sm-10">
                      <h3><a href="#">Produkter och tillbehör från Apple, Samsung, Sony, HTC</a></h3>
                      Köp mobiler, surfplattor, bärbara datorer och alla tillbehör till Apple, Samsung, Sony, HTC, etc.
                      <p><small class="text-muted"><a class="text-muted" href="#">View Code</a></small></p>
                      <br><br>
                      <?php $this->widget('Tag', array('model'=>'Company', 'urlParams'=>array('company_slug'=>'slug')));?>
                    </div>
                </div>
                
                
                
            </div>
            <br><br><br><br>
        </div> <!-- Wrapper -->
        
        <!-- Footer and Modal -->
       <?php $this->widget('Footer', array('type'=>'white'));?>
        <!-- /Footer and Modal -->
    </body>
</html>
