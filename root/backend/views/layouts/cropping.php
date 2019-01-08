<!DOCTYPE html>
<html>
    <head>
        <title>Mobilz - Backend </title>
        <meta charset="UTF-8">
        <meta http-equiv="cache-control" content="max-age=0" />
        <meta http-equiv="cache-control" content="no-cache" />
        <meta http-equiv="expires" content="0" />
        <meta http-equiv="expires" content="Tue, 01 Jan 1980 1:00:00 GMT" />
        <meta http-equiv="pragma" content="no-cache" />
        
        <meta name="viewport" content="width=device-width">
        <link type="text/css" rel="stylesheet" href="<?php echo Yii::app()->baseUrl; ?>/css/bootstrap.css" />
        <link type="text/css" rel="stylesheet" href="<?php echo Yii::app()->baseUrl; ?>/css/main.css" />
        <link type="text/css" rel="stylesheet" href="<?php echo Yii::app()->baseUrl; ?>/css/sb-admin.css" />
        <link type="text/css" rel="stylesheet" href="<?php echo Yii::app()->baseUrl; ?>/css/font-awesome.css" rel="stylesheet">

        <link type="text/css" rel="stylesheet" href="<?php echo Yii::app()->baseUrl; ?>/css/index.css" />
        <link type="text/css" rel="stylesheet" href="<?php echo Yii::app()->baseUrl; ?>/css/cropper.css" rel="stylesheet">
   

        <!-- Crop -->
        <style type="text/css">
            label { 
                clear: left;
                margin-left: 50px;
                float: left;
                width: 5em;
            }

            html, body { 
                margin: 0;
            }

            #testWrap {
                margin: 20px 0 0 50px; /* Just while testing, to make sure we return the correct positions for the image & not the window */
            }
        </style>
    </head>
    <body>
        <!-- Navigation bar with drop down box
        ================================================== -->
        <?php $this->widget('Menu');?>
        <!-- Navigation -->
        
        <!-- wrapper 
        ============= -->
        <div id="page-wrapper">
            <div class="row">
                <br />
                <div class="col-lg-12">
                      
                        <?php echo $content; ?>
                        
                </div><!-- /.col-lg-12 -->
            </div><!-- /.row -->
        </div>
        
        <!-- Footer and Modal -->
        <div class="container">
            <div class="row">
                <div class="col-md-12">
                    <br />
                    <p>Copyright &COPY; SoftHem Tuts.
                        <a data-toggle="modal"  href="#terms">Terms & Conditions</a>
                    </p>
                    <!-- Modal -->
                    <div class="modal fade" id="terms" role="dialog" aria-hidden="true" tabindex="-1">
                        <div class="modal-dialog">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h3>Terms and Conditions</h3>
                                </div>
                                <div class="modal-body">
                                    <p>The text for terms goes here...</p>
                                </div>
                                <div class="modal-footer">
                                    <button type="button" class="btn btn-primary" data-dismiss="modal">Close</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <script src="<?php echo Yii::app()->baseUrl; ?>/js/jquery.js"></script>
        <script src="<?php echo Yii::app()->baseUrl; ?>/js/bootstrap.js"></script>
        
        <!-- Draw -->
        <script src="https://ajax.googleapis.com/ajax/libs/prototype/1.7.0.0/prototype.js" type="text/javascript"></script>
        <script src="https://ajax.googleapis.com/ajax/libs/scriptaculous/1.9.0/scriptaculous.js" type="text/javascript"></script>
        <script src="<?php echo Yii::app()->baseUrl; ?>/js/cropper.js"></script>
        <script src="<?php echo Yii::app()->baseUrl; ?>/js/mousetrap.min.js"></script>
        
        <script>
           Mousetrap.bind('c', function() { 
               document.getElementById('crop-image').click();
           }, 'keyup');
           Mousetrap.bind('s', function() { 
               document.getElementById('save').click();
           }, 'keyup');
           Mousetrap.bind('u', function() { 
               document.getElementById('undo').click();
           }, 'keyup');
           Mousetrap.bind('k', function() { 
               document.getElementById('skip').click();
           }, 'keyup');
           Mousetrap.bind('n', function() { 
            document.getElementById('siteNext').click();
           },'keyup');
        </script>
        
    </body>
</html>