<?php

	Yii::import('root.common.models._base.BaseSeo');

	/**
	 * @property Chain $chain
	 * @property Location $location
	 * @property Mall $mall
	 * @property SeoMapping $seoMapping
	 */
	class Seo extends BaseSeo {
		public static function model($className = __CLASS__) {
			return parent::model($className);
		}

		public function relations() {
			return array(
				'chain' => array(self::HAS_ONE, 'Chain', 'seoId'),
				'location' => array(self::HAS_ONE, 'Location', 'seoId'),
				'mall' => array(self::HAS_ONE, 'Mall', 'seoId'),
				'seoMapping' => array(self::HAS_ONE, 'SeoMapping', 'seoId'),
			);
		}

		/**
		 * @param                $param
		 * @param Chain|Mall|Location $model
		 */
		public function magicReplace($param, GxActiveRecord $model) {
			if (!$model instanceof Company && !$model instanceof Ad && !$model instanceof Location) {
				throw new CHttpException(500, 'Internt fel: ' . get_class($model) . ' param: ' . $param);
			}
			$str = $this->$param;
			/** @var Chain|Mall|Location $model */
			return $model->magicReplace($str);
		}
	}