<div class="view">

	<b><?php echo CHtml::encode($data->getAttributeLabel('id')); ?>:</b>
	<?php echo CHtml::link(CHtml::encode($data->id),array('view','id'=>$data->id)); ?>
	<br />

	<b><?php echo CHtml::encode($data->getAttributeLabel('locationId')); ?>:</b>
	<?php echo CHtml::encode($data->locationId); ?>
	<br />

	<b><?php echo CHtml::encode($data->getAttributeLabel('name')); ?>:</b>
	<?php echo CHtml::encode($data->name); ?>
	<br />

	<b><?php echo CHtml::encode($data->getAttributeLabel('isClosed')); ?>:</b>
	<?php echo CHtml::encode($data->isClosed); ?>
	<br />

	<b><?php echo CHtml::encode($data->getAttributeLabel('openAt')); ?>:</b>
	<?php echo CHtml::encode($data->openAt); ?>
	<br />

	<b><?php echo CHtml::encode($data->getAttributeLabel('closeAt')); ?>:</b>
	<?php echo CHtml::encode($data->closeAt); ?>
	<br />

	<b><?php echo CHtml::encode($data->getAttributeLabel('date')); ?>:</b>
	<?php echo CHtml::encode($data->date); ?>
	<br />


</div>