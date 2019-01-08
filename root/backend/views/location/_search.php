<?php $form=$this->beginWidget('bootstrap.widgets.BootActiveForm',array(
	'action'=>Yii::app()->createUrl($this->route),
	'method'=>'get',
)); ?>

	<?php echo $form->textFieldRow($model,'id',array('class'=>'span5','maxlength'=>10)); ?>

	<?php echo $form->textFieldRow($model,'name',array('class'=>'span5','maxlength'=>255)); ?>

	<?php echo $form->textFieldRow($model,'nameSlug',array('class'=>'span5','maxlength'=>255)); ?>

	<?php echo $form->textFieldRow($model,'chainId',array('class'=>'span5','maxlength'=>10)); ?>

	<?php echo $form->textFieldRow($model,'mallId',array('class'=>'span5','maxlength'=>10)); ?>

	<?php echo $form->textFieldRow($model,'seoId',array('class'=>'span5','maxlength'=>10)); ?>

	<div class="form-actions">
		<?php $this->widget('bootstrap.widgets.BootButton', array(
			'type'=>'primary',
			'label'=>'Search',
		)); ?>
	</div>

<?php $this->endWidget(); ?>
