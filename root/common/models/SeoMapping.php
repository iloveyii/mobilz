<?php

Yii::import('root.common.models._base.BaseSeoMapping');

class SeoMapping extends BaseSeoMapping
{
	public static $pages = array(
        'default', 
        'home', 'chains', 'malls', 'chain', 'mall', 'location',
        // 'apple','sony','samsung','htc','lg', // company
        'mobiles', // product
    );

	public static function model($className=__CLASS__) {
		return parent::model($className);
	}

	public function rules() {
		return array(
			array('page', 'required'),
			array('page', 'in', 'range' => self::$pages),
			array('page', 'unique'),
			array('seoId', 'exist', 'className' => 'Seo', 'attributeName' => 'id'),
			array('id, page, seoId', 'safe', 'on'=>'search'),
		);
	}

	public function beforeSave() {
		if (!parent::beforeSave()) {
			return false;
		}
		if ($this->seo !== null) {
			if (!$this->seo->save()) {
				$this->addErrors($this->seo->getErrors());
			} else {
				$this->seoId = $this->seo->id;
			}
		}
		return !$this->hasErrors();
	}
}