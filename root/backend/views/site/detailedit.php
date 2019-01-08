<div class="panel panel-default">
    <div class="panel-heading">
        <i class="fa fa-credit-card"></i>
        Edit Product Entry
    </div>  
    <div class="panel-body">
         
        <div class="col-md-7">
            <div class="col-md-12">
               <?php $form=$this->beginWidget('bootstrap.widgets.BootActiveForm', array(
                    'id'=>'ad-form',
                    'enableClientValidation'=>FALSE,
                    'htmlOptions'=>array('enctype'=>'multipart/form-data', 'class'=>'well'),
                    'type' => 'vertical',
                    'clientOptions'=>array(
                        'validateOnSubmit'=>true,
                    ),
                )); ?>
                <p>
                    <?php echo $model->editedMark(); ;?>
                </p>
                 <?php echo $form->errorSummary($model); ?>
                
                <div class="row">
                    <div class="col-md-4">
                        <?php echo $form->labelEx($model,'name'); ?>
                        <?php echo $form->textField($model,'name', array('class'=>'form-control')); ?>
                    </div> 
                    <div class="col-md-4">
                        <?php echo $form->labelEx($model,'product_id'); ?>
                        <?php echo $form->dropDownList($model, 'product_id', $productsList,array(
                                'class'=>'form-control',
                                'empty'=>'Select...',
                                'required'=>'yes'
                            )
                         ); ?>
                    </div>
                    <div class="col-md-4">
                        <?php echo $form->labelEx($model,'company_id'); ?>
                        <?php echo $form->dropDownList($model, 'company_id', $companyList,array(
                                'class'=>'form-control',
                                'empty'=>'Select...',
                                'required'=>'yes'
                            )
                         ); ?>
                    </div>
                </div>
                <br />
                
                <div class="row">
                    <div class="col-md-12">
                        <?php echo $form->labelEx($model,'rubrik'); ?>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-12">
                        <?php echo $form->textField($model, 'rubrik', array('class'=>'form-control', 'hint'=>'Skriva ett online-beskrivning.')); ?>
                    </div>    
                </div>
                <br />
                
               <div class="row">
                   <div class="col-md-12">
                     <?php echo $form->labelEx($model,'description'); ?>
                   </div>
               </div>
               <div class="row">
                   <div class="col-md-12">
                        <?php  echo $form->textArea($model, 'description', array('class'=>'form-control summernote','hint'=>'Nämn i annonstexten om du endast kan kontaktas via telefon.')); ?>
                        <div class="form-group">
                            <?php /* $form=$this->widget('bootstrap.widgets.TbCKEditor', array(
                                'model'=>$model,
                                'attribute'=>'description'
                            )); */  ?>
                        </div>
                    </div>
               </div>
               
               <div class="row buttons"><br /></div>
               <div class="row">
                   <div class="col-md-12">
                       <div class="pull-left">
                           <button type="submit"  class="btn btn-default autoCompany"><i class="fa fa-check-circle-o"></i>&nbsp; Auto set Company</button>
                           <button type="submit"  class="btn btn-default autoProduct"><i class="fa fa-check-circle-o"></i>&nbsp; Auto set Product</button>
                       </div>
                       
                        <div class="pull-right">
                            <a href="<?php echo $this->createUrl('site/nextEdit') ;?>" class="btn btn-primary btn-large mbot"><i class="fa fa-arrow-right"></i>&nbsp;Next</a>
                            <button type="submit"  class="btn btn-default mbot"><i class="fa fa-floppy-o"></i>&nbsp; Save All</button>
                            <a href="<?php echo $this->createUrl('site/skippEditing', array('id'=>$model->id)) ;?>" class="btn btn-danger mbot"><i class="fa fa-envelope-o"></i>&nbsp; Skip</a>
                        </div>
                   </div>
               </div>
               <?php $this->endWidget(); ?>
           </div>
        </div>
        
        <div class="col-md-5">
            <div class="col-md-7">
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
            
            <div class="col-md-5">
                <div class="thumbnail items">
                    <a href="#">
                        <img style="height: 200px;" id="testImage" src="<?php echo $pImage ;?>">
                    </a>
                </div>
            </div>
            
            <?php if(!is_null($model->contact) && !empty($model->contact)): ?>
                <div class="col-md-12">
                   <div class="alert alert-info"><strong>Contact:  </strong><?php echo $model->contact; ?></div>
                </div>
            <?php endif;?>
        </div>       
        
    </div>
<?php 
// print_r($_GET); 
// echo Yii::app()->request->url;
?>
<div class="clear33"></div>
<?php 
         $url = Yii::app()->createUrl('site/autoCompany');
         
         Yii::app()->clientScript->registerScript('autoCompany', "
            $('.autoCompany').click(function(){
                doAction('autocompany');
                
            });
            
            $('.autoProduct').click(function(){
                doAction('autoproduct');
                
            });
            
            function doAction(action){
                $.ajax({
                    type: 'POST',
                    url: '$url',
                    dataType: 'json',
                    data: {'action':action},
                    timeout:19200,
                    error: function(request, error) {
                        if(error=='timeout') {
                            alert('The request timed out, please resubmit');
                        }
                    },
                    success: function(response) {
                        if(response['status']=='success'){
                        }
                    }
                });
                return false;
            };





         ");
         
         ?>

</div> <!-- /.panel -->