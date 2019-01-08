<?php /** @var SeoMapping $seoMapping */ ?>
<?php /** @var integer $i */ ?>
<?php /** @var BootActiveForm $form */ ?>
<div class="col-md-6">
    <fieldset class="label-block">
        <div class="col-md-12">
            <legend><?php echo GxHtml::encode($seoMapping->page); ?></legend>
        </div>
        <div class="col-md-12">
            <?php echo $form->hiddenField($seoMapping->seo, "[{$i}]id"); ?>
            <?php echo $form->textFieldRow($seoMapping->seo, "[{$i}]title", array('class'=>'form-control')); ?>
            <?php echo $form->textAreaRow($seoMapping->seo, "[{$i}]metaDescription", array('class'=>'form-control')); ?>
            <?php echo $form->textFieldRow($seoMapping->seo, "[{$i}]metaKeyWords", array('class'=>'form-control')); ?>
        </div>    
    </fieldset>
</div>