<?php
/* @var $this SiteController */
/* @var $model LoginForm */
/* @var $form CActiveForm  */

$this->pageTitle=Yii::app()->name . ' - Login';
$this->breadcrumbs=array(
	'Login',
);
?>
<br /><br /><br />
<div class="col-md-12">
<?php $form=$this->beginWidget('bootstrap.widgets.FlatActiveForm', array(
	'id'=>'login-form',
	'enableClientValidation'=>true,
	'clientOptions'=>array(
		'validateOnSubmit'=>true,
	),
)); ?>
    	
    <div class="col-md-10 col-md-offset-2">
        <?php echo $form->errorSummary($model); ?>
        <div class="panel panel-default">
            
            <div class="panel-body">
                <fieldset>
                    <div class="form-group">
                        <h2>Logga In</h2>
                        <hr />
                    </div>
                    <div class="form-group">
                        <div class="col-md-3" style="text-align: right;">
                            <label style="margin-bottom: 15px;margin-top: 15px;"><?php echo $model->getAttributeLabel('username'); ?></label>
                        </div>
                        <div class="col-md-9">
                            <?php $placeholder= $model->getAttributeLabel('username'); ?>
                            <?php echo $form->emailField($model,'username', array('class'=>'form-control','placeholder'=>"$placeholder")); ?>
                        </div>
                    </div>
                    <div class="form-group">
                        <div class="col-md-3" style="text-align: right;">
                            <label style="margin-bottom: 15px;margin-top: 15px;"><?php echo $model->getAttributeLabel('password'); ?></label>
                        </div>
                        <div class="col-md-9">
                            <?php $placeholder= $model->getAttributeLabel('password'); ?>
                            <?php echo $form->passwordField($model,'password', array('class'=>'form-control','placeholder'=>"$placeholder",'iconClass'=>'fa fa-bars')); ?>
                        </div>
                    </div>
                    <div class="form-group">
                        <div class="col-md-3" style="text-align: right;"></div>
                        <div class="col-md-9">
                            <button class="btn btn-success" type="submit"><i class="fa fa-sign-in fa-fw"></i>Logga in</button>
                            <?php echo GxHtml::link($model->getAttributeLabel('Glömt lösenord?'),array('site/forgotpassword'), array('class'=>'pull-right')); ?>
                            <label>
                                <?php /* echo $form->checkBox($model,'rememberMe'); */ ?>
                                <?php /* echo $form->label($model,'rememberMe', array('class'=>'form-control', 'style'=>'border:none;')); */ ?>
                            </label>
                        </div>
                    </div>
                    <div class="form-group">
                        <?php echo GxHtml::link($model->getAttributeLabel('Registrera dig gratis här'),array('user/create'), array('class'=>'pull-right')); ?>
                    </div>
                </fieldset>
                <div class="clear"></div>
                <!-- </form> -->
                <div class="form-group">
                    <div style="width: 45%; display: inline-block; float: left;"><hr/></div>
                    <div style="width: 10%; display: inline-block; float: left; text-align: center;"><label class="login-or">OR</label></div>
                    <div style="width: 45%; display: inline-block; float: left;"><hr/></div>
                </div>
                
                <div class="clear33"></div>
                
                <div class="form-group">
                    <div class="col-md-3" style="padding: 0px 5px; margin-bottom: 5px;">
                        <a class="btn btn-lg btn-block btn-default login-social-button" href="?social=facebook" title="Loggin via Facebook"><i class="fa fa-facebook-square icon-fb"></i>  Facebook</a>
                    </div>
                    <div class="col-md-3" style="padding: 0px 5px;margin-bottom: 5px;">
                        <a class="btn btn-lg btn-block btn-default login-social-button" href="?social=google" title="Loggin via Google Plus"><i class="fa fa-google-plus-square icon-gp"></i>  Google</a>
                    </div>
                    <div class="col-md-3" style="padding: 0px 5px;margin-bottom: 5px;">
                        <a class="btn btn-lg btn-block btn-default login-social-button" href="?social=twitter" title="Loggin via Twitter"><i class="fa fa-twitter-square icon-tw"></i>  Twitter</a>
                    </div>
                    <div class="col-md-3" style="padding: 0px 5px;margin-bottom: 5px;">
                        <a class="btn btn-lg btn-block btn-default login-social-button" href="?social=live" title="Loggin via Live"><i class="fa fa-paper-plane-o icon-yt"></i>  Live</a>
                    </div>
                </div>
                
            </div>
            <br />
        </div>
    </div>
<?php $this->endWidget(); ?>
</div>