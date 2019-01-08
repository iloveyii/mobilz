<?php

	Yii::import('root.backend.models._base.BaseAdminUser');

	/**
	 * @property integer $id
	 */
	class AdminUser extends BaseAdminUser {
		public static function model($className = __CLASS__) {
			return parent::model($className);
		}
	}