

<?php $form=$this->beginWidget('bootstrap.widgets.BootActiveForm',array(
																	   'id'=>'chain-form',
																	   'enableAjaxValidation'=>false,

																  )); ?>

	<p class="help-block">Fields with <span class="required">*</span> are required.</p>

	<?php echo $form->errorSummary($model); ?>
<div style="width:470px;">

		<?php echo $form->labelEx($model,'fldContent'); ?>
		<?php echo $form->textArea($model,'fldContent',array('rows'=>6, 'cols'=>50)); ?>
		<?php echo $form->error($model,'fldContent'); ?>
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

	<div class="form-actions">
	<?php $this->widget('bootstrap.widgets.BootButton', array(
															 'buttonType'=>'submit',
															 'type'=>'primary',
															 'label'=>$model->isNewRecord ? 'Create' : 'Save',
														)); ?>
</div>

<?php $this->endWidget(); ?>

