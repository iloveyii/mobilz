<?php /** @var SeoMappingsForm $seoMappingsForm */ ?>
<?php
	$form = $this->beginWidget(
		'bootstrap.widgets.BootActiveForm',
		array(
			'id'=>'seoMappingsForm',
			'htmlOptions'=>array('class'=>'well'),
		)
	);
?>
	<?php foreach($seoMappingsForm->seoMappings as $i => $seoMapping): ?>
		<?php $this->renderPartial('_seoMappingForm', array('form' => $form, 'i' => $i, 'seoMapping' => $seoMapping)); ?>
	<?php endforeach; ?>

    <div class="clear33"></div>
    <hr />
    <div class="col-md-12">
        <button type="submit"  class="btn btn-success"><i class="fa fa-floppy-o"></i>&nbsp; Save All</button>
    </div>
    
    
    <div class="clear33"></div>
<?php $this->endWidget(); ?>