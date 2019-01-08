<h1>Here be dragons</h1>



<?php $form=$this->beginWidget('bootstrap.widgets.BootActiveForm', array(
	'id'=>'login-form',
	'enableClientValidation'=>true,
	'clientOptions'=>array(
		'validateOnSubmit'=>true,
	),
)); ?>


		<?php echo $form->textFieldRow($model,'username'); ?>
		<?php echo $form->passwordFieldRow($model,'password'); ?>
		<br/>
		<?php $this->widget('bootstrap.widgets.BootButton', array('buttonType'=>'submit', 'icon'=>'ok', 'label'=>'Logga in')); ?>

<?php $this->endWidget(); ?>

