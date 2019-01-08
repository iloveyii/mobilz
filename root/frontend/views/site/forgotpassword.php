<?php
/* @var $this SiteController */
/* @var $model ForgotpasswordForm */
/* @var $form CActiveForm  */

$this->pageTitle=Yii::app()->name . ' - Forgot Password';
$this->breadcrumbs=array(
	'Login',
);
?>

<?php $form=$this->beginWidget('bootstrap.widgets.TbActiveForm', array(
	'id'=>'forgotpassword-form',
	'enableClientValidation'=>true,
	'clientOptions'=>array(
		'validateOnSubmit'=>true,
	),
)); ?>
    
    <div class="row">
        <div class="col-md-10 col-md-offset-2">
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
            <div class="jumbotron">
                <i style="font-size: 50px;color: #269abc;" class="glyphicon glyphicon-send"></i>
                <h3 style="display: inline;"><?php echo $model->getAttributeLabel('resetPassHeader') ;?></h3>
                <p><?php echo Yii::t('app', 'Enter your email in the box below and we will send you a password reset link.'); ?></p>
            </div>
        </div>
    </div>
    <div class="row">
    	<div class="col-md-10 col-md-offset-2">

    		<?php echo $form->errorSummary($model); ?>
    		<div class="panel panel-default">
			  	<div class="panel-heading">
			    	<h3 class="panel-title"><i class="glyphicon glyphicon-user space"></i><?php echo $model->getAttributeLabel('forgotPassword') ;?> </h3>
			 	</div>
			  	<div class="panel-body">
			    	<!-- <form accept-charset="UTF-8" role="form"> -->
                    <fieldset>
			    	  	<div class="form-group">
                            <?php $placeholder= $model->getAttributeLabel('email'); ?>
			    		    <?php echo $form->textField($model,'email', array('class'=>'form-control','placeholder'=>"$placeholder")); ?>
			    		</div>
			    	    <?php echo CHtml::submitButton($model->getAttributeLabel('sendMeLink'), array('class'=>'btn btn-lg btn-success btn-block')); ?>
			    	</fieldset>
			      	<!-- </form> -->
			      	
			    </div>
			</div>
		</div>
	</div>
<?php $this->endWidget(); ?>