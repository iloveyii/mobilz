<?php

Yii::import('root.common.models._base.BasePostalCity');

class PostalCity extends BasePostalCity
{
	public static function model($className=__CLASS__) {
		return parent::model($className);
	}

	public static function findOrCreate($name) {
		$name = trim($name);
		$postalCity = PostalCity::model()->find('name = :name OR nameSlug = :nameSlug', array('name' => $name, 'nameSlug' => Common::createSlug($name)));

		if (!is_null($postalCity)) {
			return $postalCity;
		}

		$postalCity = new PostalCity();
		$postalCity->name = $name;
		if (!$postalCity->save()) {
			throw new CException('could not save postal city, name: ' . $name . ' errors: ' . CVarDumper::dumpAsString($postalCity->getErrors()));
		}
		return $postalCity;
	}

	public function beforeValidate() {
		if (!parent::beforeValidate()) {
			return false;
		}
		$this->nameSlug = Common::createSlug($this->name);
		return true;
	}
}