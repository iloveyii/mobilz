<?php

Yii::import('root.common.models._base.BaseSourceGroup');

class SourceGroup extends BaseSourceGroup
{
	public static function model($className=__CLASS__) {
		return parent::model($className);
	}

	/**
	 * @static
	 *
	 * @param string $name
	 *
	 * @return SourceGroup
	 */
	public static function getByNameOrCreateNew($name) {
		$sourceGroup = SourceGroup::model()->find('name = :name', array('name' => $name));
		if ($sourceGroup === null) {
			$sourceGroup = new SourceGroup();
			$sourceGroup->name = $name;
			$sourceGroup->save();
		}
		return $sourceGroup;
	}
}