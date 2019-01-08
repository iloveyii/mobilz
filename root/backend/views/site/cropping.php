<div class="panel panel-default">
    <div class="panel-heading">
        <i class="fa fa-credit-card"></i>
        Edit Product Entry
    </div>  
    <div class="panel-body">
        <div class="row">
            <div class="col-xs-12 col-md-12">
                <div class="col-xs-12 col-md-8 no-pad">
                    <div class="thumbnail items">
                        <a href="#">
                            <img id="testImage" src="<?php echo $pImage ;?>">
                        </a>
                    </div>
                    
                    <div class="col-xs-4 col-sm-4 col-md-2">
                            x1:<input class="form-control" type="text" placehoder="x1" id="x1" id="x1" />
                    </div>
                    <div class="col-xs-4 col-sm-4 col-md-2">
                        y1:<input class="form-control" type="text" placehoder="y1" id="y1" id="y1" />
                    </div>
                    <div class="col-xs-4 col-sm-4 col-md-2">
                        x2:<input class="form-control" type="text" placehoder="x2" name="x2" id="x2" />
                    </div>
                    <div class="col-xs-4 col-sm-4 col-md-2">
                        y2:<input class="form-control" type="text" placehoder="y2" name="y2" id="y2" />
                    </div>
                    <div class="col-xs-4 col-sm-4 col-md-2">
                        width:<input class="form-control" type="text" placehoder="width" name="width" id="width" />
                    </div>
                    <div class="col-xs-4 col-sm-4 col-md-2">
                        height:<input class="form-control" type="text" placehoder="height" name="height" id="height" />
                    </div> 
                    
                    <!-- space for mob view -->
                    <div>&nbsp;</div><br />
                </div>
                
                
                <div class="col-xs-12 col-md-4">
                    <div class="col-md-4 no-pad"> <!-- control buttons -->
                        <button id="crop-image" class="btn btn-default btn-block"><i class="fa fa-crop"></i>&nbsp;Crop</button>
                        <button id="rotate-left" class="btn btn-default btn-block"><i class="fa fa-rotate-left"></i>&nbsp;Rotate</button>
                        <button id="rotate-right" class="btn btn-default btn-block"><i class="fa fa-rotate-right"></i>&nbsp;Rotate</button>
                        <br /><br />
                        <button id="save" class="btn btn-success btn-block"><i class="fa fa-save"></i>&nbsp;Save</button>
                        <button id="undo" class="btn btn-info btn-block"><i class="fa fa-undo"></i>&nbsp;Undo</button>
                        
                        <button id="skip" class="btn btn-danger btn-block"><i class="fa fa-check"></i>&nbsp;Skip</button>
                        <a id="siteNext" class="btn btn-primary btn-block" href="<?php echo $this->createUrl('site/next') ;?>"><i class="fa fa-arrow-right"></i>&nbsp;Next</a>
                        <br>
                    </div>
                    
                    <div class="col-md-8"> <!-- thumbnail -->
                        <?php foreach ($images as $image): ?>
                        <div class="no-pad">
                            <div class="thumbnail">
                                <a href="<?php echo $image->getBackendAdCropLink($model->id); ?>">
                                    <img style="height: 90px;"  src="<?php echo $image->getImage() ;?>" class="img-responsive">
                                </a>
                            </div>
                        </div>
                        <?php endforeach; ?>
                    </div>
                    
                </div>
            </div>
        </div>
        
        <div class="row">
            <div class="col-md-12">
               <div class="detail-header">
                   <h3><i class="<?php echo $model->getIcon() ;?>"></i> <?php echo ($model->name);?></h3>
               </div>

               <div class="detail-city">
               <?php if($cityBages !==FALSE): ?>
                   <?php echo $cityBages;?>
               <?php endif;?>
               <?php if($model->price != 'NA'): ?>
                   <h1 style="font-size: 35px; line-height: 40px;  color: #46B8DA;"><?php echo $model->price;?>:-</h1>
               <?php endif;?>

               </div>        
               
           </div>
        </div>
    </div>
<?php 
// print_r($_GET); 
// echo Yii::app()->request->url;
?>
<div class="clear33"></div>
<div class="row">
    
    
    <div>
        <?php
        Yii::app()->clientScript->registerScript('cropItem', "
            function onEndCrop( coords, dimensions ) {
                document.getElementById('x1').value = coords.x1;
                document.getElementById('y1').value = coords.y1;
                document.getElementById('x2').value = coords.x2;
                document.getElementById('y2').value = coords.y2;

                document.getElementById('width').value = dimensions.width;
                document.getElementById('height').value = dimensions.height;
            }
            
            Event.observe( 
                window, 
                'load', 
                function() { 
                    new Cropper.Img( 
                        'testImage',
                        {
                            onEndCrop: onEndCrop 
                        }
                    );
                }
            );
            
        ");

        ?>

        <?php 
         $url = Yii::app()->createUrl('site/crop');
         $doUnDoUrl = Yii::app()->createUrl('site/doundo');
         
         Yii::app()->clientScript->registerScript('cropImage', "
            $('#crop-image').click(function(){
                var x1= $('#x1').val();
                var y1= $('#y1').val();
                var x2= $('#x2').val();
                var y2= $('#y2').val();
                var w= $('#width').val();
                var h= $('#height').val();
                
                $.ajax({
                    type: 'POST',
                    url: '$url',
                    dataType: 'json',
                    data: {'x1':x1, 'y1':y1, 'x2':x2, 'y2':y2, 'w':w, 'h':h,'img':'$imageName','img_id':$image_id},
                    timeout:19200,
                    error: function(request, error) {
                        if(error=='timeout') {
                            alert('The request timed out, please resubmit');
                        }
                        // $('#login-modal').click();

                    },
                    success: function(response) {
                        // alert(response['status']); 
                        if(response['status']=='success')
                            location.reload();
                        // $('#shopping_cart').html(response['grid']);
                        // $(but).replaceWith(response['link']); 
                        $('#testImage').attr('src', response['link']);
                    }
                });
                return false;
            });

            ");
            
            
            Yii::app()->clientScript->registerScript('rotateImage', "
                $('#rotate-left').click(function(){
                  rotate(-90);
                });
                
                $('#rotate-right').click(function(){
                  rotate(90);
                });
                
                $('#undo').click(function(){
                  doUndo('undo');
                });
                
                $('#save').click(function(){
                  doUndo('save');
                });
                
                $('#skip').click(function(){
                  doUndo('skip');
                });
                
//                $('document').ready(function() {
//                    // $('#skip').tooltip({container: 'body'});
//                    
//                    $('body').tooltip({
//                        selector: '[rel=tooltip]:not(.disabled)',
//                        live: true,
//                        container: 'body'
//                    });
//                });

                function doUndo(doundo){
                    $.ajax({
                        type: 'POST',
                        url: '$doUnDoUrl',
                        dataType: 'json',
                        data: {'doundo':doundo, 'img_id':$image_id},
                        timeout:19200,
                        error: function(request, error) {
                            if(error=='timeout') {
                                alert('The request timed out, please resubmit');
                            }
                        },
                        success: function(response) {
                        alert(1);
                            if(response['status']=='success'){
                            alert(2);
                                $('#next').click();
                            }
                        }
                    });
                    return false;
                };


                function rotate(degrees){
                    var deg= degrees;
                    $.ajax({
                        type: 'POST',
                        url: '$url',
                        dataType: 'json',
                        data: {'deg':deg, 'img':'$imageName','img_id':$image_id},
                        timeout:19200,
                        error: function(request, error) {
                            if(error=='timeout') {
                                alert('The request timed out, please resubmit');
                            }
                            // $('#login-modal').click();

                        },
                        success: function(response) {
                            // alert(response['status']); 
                            if(response['status']=='success')
                                location.reload();
                            // $('#shopping_cart').html(response['grid']);
                            // $(but).replaceWith(response['link']); 
                            $('#testImage').attr('src', response['link']);
                        }
                    });
                    return false;
                };

            ");


        ?>
    </div>
    
</div>

</div> <!-- /.panel -->