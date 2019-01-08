<?php
/* @var $this SiteController */
/* @var $model ResetpasswordForm */
/* @var $form CActiveForm  */

$this->pageTitle=Yii::app()->name . ' - Reset Password';
$this->breadcrumbs=array(
	'ResetPassword',
);
?>

<?php $form=$this->beginWidget('bootstrap.widgets.TbActiveForm', array(
	'id'=>'resetpassword-form',
	'enableClientValidation'=>true,
	'clientOptions'=>array(
		'validateOnSubmit'=>true,
	),
)); ?>
    <div class="row">
        <?php if(Yii::app()->user->hasFlash('success')): ?>
        <?php 
        $this->widget('bootstrap.widgets.TbAlert', array(
            'block'=>true, // display a larger alert block?
            'fade'=>true, // use transitions?
            'closeText'=>'x', // close link text - if set to false, no close link is displayed
            'alerts'=>array( // configurations per alert type
                'success'=>array('block'=>true, 'fade'=>true, 'closeText'=>'x'), // success, info, warning, error or danger
            ),
        )); 
        ?>
        <?php endif; ?>

        <br />
    	
    	<div class="col-md-10 col-md-offset-2">
    		<?php echo $form->errorSummary($model); ?>
    		<div class="panel panel-default">
			  	<div class="panel-heading">
			    	<h3 class="panel-title">Reset Password </h3>
			 	</div>
			  	<div class="panel-body">
			    	<!-- <form accept-charset="UTF-8" role="form"> -->
                    <fieldset>
			    	  	<div class="form-group">
			    		    <?php echo $form->textField($model,'password', array('class'=>'form-control','placeholder'=>"Password")); ?>
			    		</div>
                        <div class="form-group">
			    		    <?php echo $form->textField($model,'confirm_password', array('class'=>'form-control','placeholder'=>"Password confirm")); ?>
			    		</div>
			    	    <?php echo CHtml::submitButton('Reset Password', array('class'=>'btn btn-lg btn-success btn-block')); ?>
			    	</fieldset>
			      	<!-- </form> -->
			      	
			    </div>
			</div>
		</div>
	</div>
<?php $this->endWidget(); ?>