<?php $form=$this->beginWidget('bootstrap.widgets.BootActiveForm',array(
	'id'=>'chain-form',
	'enableAjaxValidation'=>false,
	'htmlOptions'=>array('enctype'=>'multipart/form-data')
)); ?>

	<p class="help-block">Fields with <span class="required">*</span> are required.</p>

	<?php echo $form->errorSummary($model); ?>

	<?php echo $form->textFieldRow($model,'name',array('class'=>'span5','maxlength'=>255)); ?>

	<?php echo $form->textFieldRow($model,'nameSlug',array('class'=>'span5','maxlength'=>255)); ?>

	<?php echo $form->textFieldRow($model,'parentId',array('class'=>'span5','maxlength'=>10)); ?>

	<?php echo $form->textFieldRow($model,'seoId',array('class'=>'span5','maxlength'=>10)); ?>

    <?php echo $form->textFieldRow($model,'hasSubchain',array('class'=>'span5')); ?>





<div >
	<?php echo $form->labelEx($model,'url'); ?>
	<?php echo $form->fileField($model,'url',array('size'=>60)); ?>
	<?php echo $form->error($model,'url'); ?>
</div>







<div style="width:470px;">
	<?php echo $form->textAreaRow($model,'textField',array('rows'=>10, 'cols'=>50,'class'=>'span5')); ?>

	<script type="text/javascript" src="/tinymce/jscripts/tiny_mce/tiny_mce.js"></script>
	<script type="text/javascript">
		tinyMCE.init({
			mode : "textareas",
			theme : "advanced",
			content_css : "/tinymce/custom_content.css",
			theme_advanced_font_sizes: "10px,12px,13px,14px,16px,18px,20px",
			font_size_style_values : "10px,12px,13px,14px,16px,18px,20px",
			width: '100%',
			height: '500'
		});
	</script>
</div>
    <?php echo $form->textFieldRow($model,'websiteField',array('class'=>'span5')); ?>

	<?php echo $form->textFieldRow($model,'epostField',array('class'=>'span5')); ?>

	<?php echo $form->textFieldRow($model,'phoneField',array('class'=>'span5')); ?>

	<?php echo $form->textFieldRow($model,'faxField',array('class'=>'span5')); ?>

	<?php echo $form->textFieldRow($model,'addressField',array('class'=>'span5')); ?>

	<?php echo $form->textFieldRow($model,'zipcodeField',array('class'=>'span5')); ?>

	<?php echo $form->textFieldRow($model,'cityField',array('class'=>'span5')); ?>



	<div class="form-actions">
		<?php $this->widget('bootstrap.widgets.BootButton', array(
			'buttonType'=>'submit',
			'type'=>'primary',
			'label'=>$model->isNewRecord ? 'Create' : 'Save',
		)); ?>
	</div>

<?php $this->endWidget(); ?>
