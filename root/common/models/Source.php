<?php

Yii::import('root.common.models._base.BaseSource');

class Source extends BaseSource
{
	public static function model($className=__CLASS__) {
		return parent::model($className);
	}
}