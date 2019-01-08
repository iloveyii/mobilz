<div class="view">

	<b><?php echo CHtml::encode($data->getAttributeLabel('id')); ?>:</b>
	<?php echo CHtml::link(CHtml::encode($data->id),array('view','id'=>$data->id)); ?>
	<br />

	<b><?php echo CHtml::encode($data->getAttributeLabel('url')); ?>:</b>
	<?php echo CHtml::encode($data->url); ?>
	<br />

	<b><?php echo CHtml::encode($data->getAttributeLabel('locationId')); ?>:</b>
	<?php echo CHtml::encode($data->locationId); ?>
	<br />

	<b><?php echo CHtml::encode($data->getAttributeLabel('sourceGroupId')); ?>:</b>
	<?php echo CHtml::encode($data->sourceGroupId); ?>
	<br />


</div>