<?php

Yii::import('root.common.models._base.BaseChain');

class Chain extends BaseChain
{
	public static function model($className=__CLASS__) {
		return parent::model($className);
	}

	public function relations() {
		return array(
			'seo' => array(self::BELONGS_TO, 'Seo', 'seoId'),
			'locations' => array(self::HAS_MANY, 'Location', 'chainId', 'order' => 'locations.name'),

		);
	}

	public static function newIfNotExists($name, Chain $parent = null) {
		$chain = Chain::model()->find('name = :name', array(':name' => $name));
		if (is_null($chain)) {
			$chain = new Chain();
			$chain->name = $name;
			if ($parent !== null) {
				$chain->parentId = $parent->id;
			}
			if (!$chain->save()) {
				throw new CException('failed saving Chain: '.CVarDumper::dumpAsString($chain->getErrors()));
			}
		}

		return $chain;
	}

	public function beforeValidate() {
		if (!parent::beforeValidate()) {
			return false;
		}
		$this->nameSlug = Common::createSlug($this->name);
		return true;
	}

	public function magicReplace($str) {
		$str = preg_replace('#\$chain\$#u', $this->name, $str);
		$str = preg_replace('#\$chainslug\$#u', $this->nameSlug, $str);
		if (preg_match('#\$#', $str)) {
			throw new CHttpException(500, 'ogiltig variabel hittad i chain:id: ' . $this->id . ' str: ' . $str);
		}
		return $str;
	}

	public function beforeDelete() {
		if (!parent::beforeDelete()) {
			return false;
		}
		foreach($this->locations as $location) {
			if (!$location->delete()) {
				return false;
			}
		}
		return true;
	}
}