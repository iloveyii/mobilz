<?php
$this->pageTitle = Yii::app()->name . ' - Contact Us';
$this->breadcrumbs = array(
    'Contact',
);
?>
    <div class="row">
        <div class="col-lg-12">
            <ol class="breadcrumb">
                <li><a href="/">Hem</a></li>
                <li class="active"><a href="">Kontakt</a></li>
            </ol>
        </div>
    </div>
    <?php if (Yii::app()->user->hasFlash('success')): ?>
        <div class="alert alert-info  alert-dismissable">
            <a class="close" data-dismiss="alert" href="#" aria-hidden="true">&times;</a>
            <strong><?php echo Yii::app()->user->getFlash('success'); ?></strong>
        </div>
    <?php endif; ?>
        <div class="page-header">
            <h1>Kontakt </h1>
        </div>
        <div class="horizontal-form">

            <?php // $form = $this->beginWidget('CActiveForm', array(
             $form=$this->beginWidget('bootstrap.widgets.FlatActiveForm', array(
                'enableClientValidation' => true,
                //'enableAjaxValidation'=>true,
                // 'errorMessageCssClass'=>'has-error',

                'htmlOptions' => array('class' => 'form-horizontal',
                    'role' => 'form',
                    'id' => 'contact-form',
                    'type'=>'horizontal'
                ),
                'clientOptions' => array(
                    'validateOnSubmit' => true,
                    'errorCssClass' => 'has-error',
                    'successCssClass' => 'has-success',
                    'inputContainer' => '.form-group',
                    'validateOnChange' => true
                ),
            )); ?>
            <div class="form-group">
                <div class="col-lg-3 control-label">
                    <div>
                        <p class="note">Fields with <span class="required">*</span> are required.</p>
                    </div>
                </div>

                <div class="col-lg-5  has-error">
                    <div class="help-block ">
                        <?php echo $form->errorSummary($model); ?>
                    </div>
                </div>
            </div>


            <div class="form-group">
                <?php echo $form->labelEx($model, 'name', array('class' => 'col-lg-3 control-label')); ?>
                <div class="col-lg-5">
                    <?php echo $form->userField($model, 'name', array('class' => 'form-control', 'placeholder' => 'Name')); ?>
                    <div class="help-block">
                        <?php echo $form->error($model, 'name'); ?>
                    </div>
                </div>
            </div>

            <div class="form-group">
                <?php echo $form->labelEx($model, 'email', array('class' => 'col-lg-3 control-label')); ?>
                <div class="col-lg-5">
                    <?php echo $form->emailField($model, 'email', array('class' => 'form-control', 'placeholder' => 'Email')); ?>
                    <span class="help-block help-inline ">
                <?php echo $form->error($model, 'email'); ?>
                    </span>
                </div>
            </div>

            <div class="form-group">
                <?php echo $form->labelEx($model, 'subject', array('class' => 'col-lg-3 control-label')); ?>
                <div class="col-lg-5">
                    <?php echo $form->textField($model, 'subject', array('class' => 'form-control', 'placeholder' => 'Subject','iconClass'=>'fa fa-bars')); ?>
                    <div class="help-block">
                        <?php echo $form->error($model, 'subject'); ?>
                    </div>
                </div>
            </div>

            <div class="form-group">
                <?php echo $form->labelEx($model, 'body', array('class' => 'col-lg-3 control-label')); ?>
                <div class="col-lg-5">
                    <?php echo $form->textArea($model, 'body', array('class' => 'form-control', 'placeholder' => 'Write here', 'rows' => 6, 'cols' => 50)); ?>
                    <div class="help-block">
                        <?php echo $form->error($model, 'body'); ?>
                    </div>
                </div>
            </div>


            <div class="form-group">
                <div class="col-lg-offset-3 col-lg-10">
                    <?php if ($model->getRequireCaptcha()) : ?>
                        <?php $this->widget('application.extensions.recaptcha.EReCaptcha',
                            array('model' => $model, 'attribute' => 'verify_code',
                                'theme' => 'red', 'language' => 'en',
                                'publicKey' => Yii::app()->params['recaptcha_public_key']));?>
                        <?php echo CHtml::error($model, 'verify_code'); ?>
                    <?php endif; ?>
                </div>
            </div>


            <div class="form-group">
                <div class="col-lg-offset-3 col-lg-10">
                    <button type="submit" class='btn btn-primary btn-lg'><i class="fa fa-envelope-o"> </i> Skicka</button>
                </div>
            </div>
            <?php $this->endWidget(); ?>
        </div><!-- form -->











