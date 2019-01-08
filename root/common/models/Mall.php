<?php

Yii::import('root.common.models._base.BaseMall');

class Mall extends BaseMall
{
	public static function model($className=__CLASS__) {
		return parent::model($className);
	}

	public function relations() {
		return array(
			'locations' => array(self::HAS_MANY, 'Location', 'mallId', 'order' => 'locations.name'),
			'seo' => array(self::BELONGS_TO, 'Seo', 'seoId'),
		);
	}

	public static function newIfNotExists($name) {
		$mall = Mall::model()->find('name = :name', array(':name' => $name));
		if (is_null($mall)) {
			$mall = new Mall();
			$mall->name = $name;
			if (!$mall->save()) {
				throw new CException('failed saving Mall: '.CVarDumper::dumpAsString($mall->getErrors()));
			}
		}

		return $mall;
	}

	public function beforeValidate() {
		if (!parent::beforeValidate()) {
			return false;
		}
		$this->nameSlug = Common::createSlug($this->name);
		return true;
	}

	public function magicReplace($str) {
		$str = preg_replace('#\$mall\$#u', $this->name, $str);
		$str = preg_replace('#\$mallslug\$#u', $this->nameSlug, $str);
		if (preg_match('#\$#', $str)) {
			throw new CHttpException(500, 'ogiltig variabel hittad i mall:id: ' . $this->id . ' str: ' . $str);
		}
		return $str;
	}
}