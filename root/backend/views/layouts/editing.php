<!DOCTYPE html>
<html>
    <head>
        <title>Mobilz - Backend </title>
        <meta charset="UTF-8">
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
                /* margin-left: 50px; */
                float: left;
                /* width: 5em;*/
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
        
    </body>
</html>