<?php
/* @var $this SiteController */
/* @var $model LoginForm */
/* @var $form CActiveForm  */

$this->pageTitle=Yii::app()->name . ' - Login';
$this->breadcrumbs=array(
	'Login',
);
?>

<!-- wrapper 
============= -->

<div id="wrap" style="margin-top: 120px;">

    <div class="container">
        <div id="content">
            <?php $form=$this->beginWidget('CActiveForm', array(
                    'id'=>'login-form',
                    'enableClientValidation'=>true,
                    'clientOptions'=>array(
                            'validateOnSubmit'=>true,
                    ),
            )); ?>    

                <div class="container">
                    <div class="row">
                    <div class="col-md-4 col-md-offset-4">
                        <div style="display:none" id="login-form_es_" class="alert alert-block alert-error"><p>Please fix the following input errors:</p>

                            <ul><li>dummy</li></ul>
                        </div>    		
                        <div class="panel panel-default">
                            <div class="panel-heading">
                                <h4 class="panel-title icon-xs"><i class="fa fa-unlock icon-sm"></i>Login</h4>
                            </div>
                            <div class="panel-body">
                                <fieldset>

                                    <div class="form-group">
                                            <?php echo $form->labelEx($model,'username'); ?>
                                            <?php echo $form->textField($model,'username', array('class'=>'form-control','size'=>45,'maxlength'=>45, 'placeholder'=>'Enter un:admin, pw:admin')); ?>
                                            <?php echo $form->error($model,'username'); ?>
                                    </div>


                                    <div class="form-group">
                                        <?php echo $form->labelEx($model,'password'); ?>
                                        <?php echo $form->passwordField($model,'password', array('class'=>'form-control','size'=>45,'maxlength'=>45,)); ?>
                                        <?php echo $form->error($model,'password'); ?>
                                    </div>    


                                    <div class="form-group">
                                        <a href="/site/forgotpassword" class="pull-right">Forgot Password?</a>                            
                                        <br>
                                    </div>
                                    <input type="submit" value="Login" name="yt0" class="btn btn-lg btn-success btn-block">			    		

                                </fieldset>
                            </div>
                        </div>
                    </div>
                    </div>
                </div>
            <?php $this->endWidget(); ?>	
        </div><!-- content -->


    </div><!-- /.container -->

</div> 

<!-- / Wrapper -->