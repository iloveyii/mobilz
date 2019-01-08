<div class="form">

<?php $form=$this->beginWidget('bootstrap.widgets.BootActiveForm', array(
	'id'=>'ad-form',
	'enableClientValidation'=>FALSE,
    'htmlOptions'=>array('enctype'=>'multipart/form-data', 'class'=>'well'),
    // 'type' => 'inline',
	'clientOptions'=>array(
		'validateOnSubmit'=>true,
	),
)); ?>
    <div class="col-md-12">
        <p class="note">Fields with <span class="required">*</span> are required.</p>
        <?php echo $form->errorSummary($model); ?>
    </div>
    
    <div class="col-md-8">
        <fieldset>
            <div class="row">
                <div class="form-group col-md-10">
                    <?php $placeholder= $model->getAttributeLabel('name'); ?>
                    <?php echo $form->textFieldRow($model,'name', array('class'=>'form-control','placeholder'=>"$placeholder")); ?>
                </div>
            </div>
            
            <div class="row">
                <div class="form-group col-md-6">
                    <?php $placeholder= $model->getAttributeLabel('mobile'); ?>
                    <?php echo $form->textFieldRow($model,'mobile', array('class'=>'form-control','placeholder'=>"$placeholder")); ?>
                </div>
            </div>
            
            <div class="row">
                <div class="form-group col-md-10">
                    <?php $placeholder= $model->getAttributeLabel('message'); ?>
                    <?php echo $form->textAreaRow($model,'message', array('class'=>'form-control','placeholder'=>"$placeholder",'rows'=>6, 'cols'=>50)); ?>
                </div>
            </div>
            
        </fieldset>
    </div>
    <div class="row buttons">
	</div>
    <div class="col-md-12">
        <hr />
        <button type="submit" class="btn btn-primary btn-lg"> <i class="fa fa-envelope-o"></i> Skicka </button>
        <button type="reset" class="btn btn-default btn-lg"> <i class="fa fa-minus"></i> Reset </button>
    </div>

<?php $this->endWidget(); ?>

</div><!-- form -->