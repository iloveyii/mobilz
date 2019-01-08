<div class="view">

	<b><?php echo CHtml::encode($data->getAttributeLabel('fldID')); ?>:</b>
	<?php echo CHtml::link(CHtml::encode($data->fldID), array('view', 'id'=>$data->fldID)); ?>
	<br />

	<b><?php echo CHtml::encode($data->getAttributeLabel('fldContent')); ?>:</b>
	<?php echo CHtml::encode($data->fldContent); ?>
	<br />


</div>