<?php
/* @var $this UserController */
/* @var $model User */
/* @var $form CActiveForm */
?>

<div class="form">

<?php $form=$this->beginWidget('bootstrap.widgets.FlatActiveForm', array(
	'id'=>'user-form',
	'enableClientValidation'=>true,
	'clientOptions'=>array(
		'validateOnSubmit'=>true,
	),
)); ?>
<div class="col-md-12">
    <div class="row">
        <div class="col-md-8">
            <p class="alert alert-info"><i class="fa fa-info-circle">&nbsp;&nbsp;</i>Fields with <span class="required">*</span> are required.</p>
        </div>
        <div class="col-md-12">
            <?php echo $form->errorSummary($model); ?>
        </div>
    </div>

	
    <fieldset>
        <div class="row">
            <div class="col-md-12"><h2>Namn</h2></div>
            <div class="col-md-8">
                <div class="form-group">
                    <?php echo $form->labelEx($model,'name'); ?>
                    <?php $placeholder= $model->getAttributeLabel('name'); ?>
                    <?php echo $form->userField($model,'name', array('class'=>'form-control','placeholder'=>"$placeholder")); ?>
                </div>
            </div>
        </div>
    
        <div class="row">
            <div class="col-md-8">
                <div class="form-group">
                    <?php echo $form->labelEx($model,'password'); ?>
                    <?php $placeholder= $model->getAttributeLabel('password'); ?>
                    <?php echo $form->passwordField($model,'password', array('class'=>'form-control','placeholder'=>"$placeholder", 'iconClass'=>'fa fa-bars')); ?>
                </div>
            </div>
        </div>
        
        <div class="row">
            <div class="col-md-8">
                <div class="form-group">
                    <?php echo $form->labelEx($model,'confirm_password'); ?>
                    <?php $placeholder= $model->getAttributeLabel('confirm_password'); ?>
                    <?php echo $form->passwordField($model,'confirm_password', array('class'=>'form-control','placeholder'=>"$placeholder", 'iconClass'=>'fa fa-bars')); ?>
                </div>
            </div>
            <div class="col-md-4">
                <div class="bs-callout bs-callout-warning" style="padding-left: 5px;">
                    <div style="width:15%;float: left;">
                        <i class="fa fa-warning"></i>
                    </div>
                    <div style="width:85%;float:right;">
                        <h4>Note !</h4>
                        <p>Must match Password above.</p>
                    </div>
                    <div class="clear33"></div>
                </div>
            </div>
        </div>
            
        <div class="row">
            <div class="col-md-12"><h2>Kontakt</h2></div>
            <div class="col-md-8">
                <div class="form-group">
                    <?php echo $form->labelEx($model,'email'); ?>
                    <?php $placeholder= $model->getAttributeLabel('email'); ?>
                    <?php echo $form->emailField($model,'email', array('class'=>'form-control','placeholder'=>"$placeholder")); ?>
                </div>
            </div>
            <div class="col-md-4">
                <div class="bs-callout bs-callout-info" style="padding-left: 5px;">
                    <div style="width:15%;float: left;">
                        <i class="fa fa-envelope-o"></i>
                    </div>
                    <div style="width:85%;float:right;">
                        <h4>Email:</h4>
                        <p>This is the email that you will receive our customers alerts in.</p>
                    </div>
                    <div class="clear33"></div>
                </div>
            </div>
        </div>
            
        <div class="row">
            <div class="col-md-8">
                <div class="form-group">
                    <div class="col-md-6 no-pad">
                        <?php echo $form->labelEx($model,'mobile'); ?>
                        <?php $placeholder= $model->getAttributeLabel('mobile'); ?>
                        <?php echo $form->telField($model,'mobile', array('class'=>'form-control','placeholder'=>"$placeholder", 'type'=>'mobile')); ?>
                    </div>
                    <div class="col-md-6 no-pad">
                        <?php echo $form->labelEx($model,'phone'); ?>
                        <?php $placeholder= $model->getAttributeLabel('phone'); ?>
                        <?php echo $form->telField($model,'phone', array('class'=>'form-control','placeholder'=>"$placeholder", 'type'=>'phone')); ?>
                    </div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="bs-callout bs-callout-info" style="padding-left: 5px;">
                    <div style="width:15%;float: left;">
                        <i class="fa fa-info-circle"></i>
                    </div>
                    <div style="width:85%;float:right;">
                        <h4>Mobile & Phone:</h4>
                        <p>These numbers will be used by customers to call you, you can hide it later also.</p>
                    </div>
                    <div class="clear33"></div>
                </div>
            </div>
        </div>
            
        <div class="row">
            <div class="col-md-12"><h2>Adres</h2></div>
            <div class="col-md-8">
                <div class="form-group">
                    <?php echo $form->labelEx($model,'address'); ?>
                    <?php $placeholder= $model->getAttributeLabel('address'); ?>
                    <?php echo $form->textField($model,'address', array('class'=>'form-control','placeholder'=>"$placeholder", 'iconClass'=>'fa fa-bars')); ?>
                </div>
            </div>
            <div class="col-md-4 hidden-phone">
                <div class="bs-callout bs-callout-danger" style="padding-left: 5px;">
                    <div style="width:15%;float: left;color: green;">
                        <i class="fa fa-leaf"></i>
                    </div>
                    <div style="width:85%;float:right;">
                        <h4>Adres:</h4>
                        <p>Please provide some approximate address.</p>
                    </div>
                    <div class="clear33"></div>
                </div>
            </div>
            
        </div>    
            
        
        <div class="row">
            <div class="col-md-6">
                <div class="form-group">
                    <?php echo $form->labelEx($model,'postnr'); ?>
                    <?php $placeholder= $model->getAttributeLabel('postnr'); ?>
                    <?php echo $form->textField($model,'postnr', array('class'=>'form-control','placeholder'=>"$placeholder", 'iconClass'=>'fa fa-bars')); ?>
                </div>
            </div>
        </div>
            
        <div class="row">
            <div class="col-md-6">
                <div class="form-group">
                    <?php echo $form->labelEx($model,'county_id'); ?>
                    <?php $placeholder= $model->getAttributeLabel('county_id'); ?>
                    <?php echo $form->textField($model,'county_id', array('class'=>'form-control','placeholder'=>"$placeholder", 'iconClass'=>'fa fa-bars')); ?>
                </div>
            </div>
        </div>
        
        <div class="row">
            <div class="col-md-6">
                <div class="form-group">
                    <?php echo $form->labelEx($model,'city_id'); ?>
                    <?php $placeholder= $model->getAttributeLabel('city_id'); ?>
                    <?php echo $form->textField($model,'city_id', array('class'=>'form-control','placeholder'=>"$placeholder", 'iconClass'=>'fa fa-bars')); ?>
                </div>
            </div>
        </div>
            
        <div class="row">
            <div class="col-md-12">
                <div class="form-group">
                    <hr />
                    <?php if($model->isNewRecord): ?>
                        <?php echo CHtml::submitButton('Register', array('class'=>'btn btn-lg btn-success')); ?>
                    <?php else:?>
                        <?php echo CHtml::submitButton('Update', array('class'=>'btn btn-lg btn-primary')); ?>
                    <?php endif;?>
                </div>
            </div>
        </div>
    </fieldset>
</div>
<?php $this->endWidget(); ?>

</div><!-- form -->