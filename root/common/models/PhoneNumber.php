<?php

Yii::import('root.common.models._base.BasePhoneNumber');

class PhoneNumber extends BasePhoneNumber
{
	/**
	 * @param string $scenario
	 * @param string $phoneNumber
	 */
	public function __construct($scenario = 'insert', $phoneNumber = null) {
		parent::__construct($scenario);
		if (!is_null($phoneNumber)) {
			$this->phoneNumber = $phoneNumber;
		}

	}
	public static function model($className=__CLASS__) {
		return parent::model($className);
	}

	public function rules() {
		return array(
			array('phoneNumber, locationId', 'required'),
			array('phoneNumber', 'numerical', 'integerOnly' => true, 'allowEmpty' => false),
			array('locationId', 'exist', 'className' => 'Location', 'attributeName' => 'id', 'allowEmpty' => false),
			array('phoneNumber', 'length', 'min' => 8, 'max'=>20, 'allowEmpty' => false),
			array('id, phoneNumber, locationId', 'safe', 'on'=>'search'),
		);
	}

	public function beforeValidate() {
		if (!parent::beforeValidate()) {
			return false;
		}
		$this->phoneNumber = self::removeNonDigits($this->phoneNumber);
		return true;
	}

	public static function removeNonDigits($nr) {
		return preg_replace('#[^\d]#u', '', $nr);
	}

	public function saveOrUpdate() {
		$pn = PhoneNumber::model()->find(
			'phoneNumber = :pn AND locationId = :lId',
			array(
				 'pn' => PhoneNumber::removeNonDigits($this->phoneNumber),
				 'lId' => $this->locationId,
			)
		);
		if (!is_null($pn)) {
			return $pn;
		}

		if (!$this->save()) {
			throw new CException('could not save phonenumber for locId: ' . $this->locationId . ' errors: ' . CVarDumper::dumpAsString($this->getErrors()));
		}
		return $pn;
	}
}