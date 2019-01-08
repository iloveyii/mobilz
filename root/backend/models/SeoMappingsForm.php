<?php
	class SeoMappingsForm extends CFormModel {
		/** @var SeoMapping[] */
		public $seoMappings = array();

		public function init() {
			$this->seoMappings = SeoMapping::model()->findAll(array('index' => 'id'));
			foreach($this->seoMappings as $seoMapping) {
				if ($seoMapping->seo === null) {
					$seoMapping->seo = new Seo;
				}
			}
		}

		public function save() {
			foreach($this->seoMappings as $seoMapping) {
				if (!$seoMapping->save()) {
					$this->addErrors($seoMapping->getErrors());
				}
			}
			return !$this->hasErrors();
		}
	}