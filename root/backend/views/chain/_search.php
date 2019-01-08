<?php $form=$this->beginWidget('bootstrap.widgets.BootActiveForm',array(
	'action'=>Yii::app()->createUrl($this->route),
	'method'=>'get',
)); ?>

	<?php echo $form->textFieldRow($model,'id',array('class'=>'span5','maxlength'=>10)); ?>

	<?php echo $form->textFieldRow($model,'name',array('class'=>'span5','maxlength'=>255)); ?>

	<?php echo $form->textFieldRow($model,'nameSlug',array('class'=>'span5','maxlength'=>255)); ?>

	<?php echo $form->textFieldRow($model,'parentId',array('class'=>'span5','maxlength'=>10)); ?>

	<?php echo $form->textFieldRow($model,'seoId',array('class'=>'span5','maxlength'=>10)); ?>

	<?php echo $form->textFieldRow($model,'textField',array('class'=>'span5')); ?>

	<?php echo $form->textFieldRow($model,'websiteField',array('class'=>'span5')); ?>

	<?php echo $form->textFieldRow($model,'epostField',array('class'=>'span5')); ?>

	<?php echo $form->textFieldRow($model,'phoneField',array('class'=>'span5')); ?>

	<?php echo $form->textFieldRow($model,'faxField',array('class'=>'span5')); ?>

	<?php echo $form->textFieldRow($model,'addressField',array('class'=>'span5')); ?>

	<?php echo $form->textFieldRow($model,'zipcodeField',array('class'=>'span5')); ?>

	<?php echo $form->textFieldRow($model,'cityField',array('class'=>'span5')); ?>

	<div class="form-actions">
		<?php $this->widget('bootstrap.widgets.BootButton', array(
			'type'=>'primary',
			'label'=>'Search',
		)); ?>
	</div>

<?php $this->endWidget(); ?>
