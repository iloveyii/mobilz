<?php $form=$this->beginWidget('bootstrap.widgets.BootActiveForm',array(
	'id'=>'location-form',
	'type'=>'horizontal',
	'enableAjaxValidation'=>false,
	'htmlOptions'=>array('class' => '', 'enctype' =>'multipart/form-data'),
)); ?>

	<p class="help-block">Fields with <span class="required">*</span> are required.</p>

	<?php echo $form->errorSummary($model); ?>

	<?php echo $form->textFieldRow($model,'name',array('class'=>'span5','maxlength'=>255)); ?>

	<?php echo $form->textFieldRow($model,'nameSlug',array('class'=>'span5','maxlength'=>255)); ?>

	<?php /* echo $form->textFieldRow($model,'chainId',array('class'=>'span5','maxlength'=>10)); */ ?>
	
	<?php  $select= $form->dropDownListRow(
			$model, 
			'chainId',
			CHtml::listData(Chain::model()->findAll(),'id', 'name'),
			array('prompt' =>'-','class'=>'chzn-select', 'selected' => 'Coop')
			);  
		 echo $select = str_replace('="'.$model->chainId.'"','="'.$model->chainId.'" selected ' , $select);
	?>

	<?php echo $form->textFieldRow($model,'mallId',array('class'=>'span5','maxlength'=>10)); ?>

	<?php echo $form->textFieldRow($model,'seoId',array('class'=>'span5','maxlength'=>10)); ?>
	
	<?php echo $form->textFieldRow($model,'address',array('class'=>'span5','maxlength'=>90)); ?>
	
	<div class="form-actions">
		<?php $this->widget('bootstrap.widgets.BootButton', array(
			'buttonType'=>'submit',
			'type'=>'primary',
			'label'=>$model->isNewRecord ? 'Create' : 'Save',
		)); ?>
	</div>

<?php $this->endWidget(); ?>

<!-- Oppettidr form -->
<?php	 $locId = $model->id; 
		 $url=$this->createUrl('location/update_oppettidr');
		 /*
		 $criteria = new CDbCriteria;
		 $criteria->condition = 'locationId ='.$locId; */
		 
		//  $model=OpenHours::model()->findAll($criteria);
?>
<?php /* $form=$this->beginWidget('bootstrap.widgets.BootActiveForm',array(
	'id'=>'oppettidr-form',
	'enableAjaxValidation'=>false,
	'action'=>$url,
)); */ ?>

	<?php /* echo $form->textFieldRow($model,'mallId',array('class'=>'span5','maxlength'=>10)); */ ?>

	<!-- <div class="form-actions"> -->
		<?php /* $this->widget('bootstrap.widgets.BootButton', array(
			'buttonType'=>'submit',
			'type'=>'primary',
			'label'=>$model->isNewRecord ? 'Create' : 'Save',
		)); */ ?>
	<!-- </div>  -->
	
	
<?php /* $this->endWidget(); */ ?>