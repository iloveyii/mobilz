<?php

/**
 * This is the model base class for the table "phoneNumber".
 * DO NOT MODIFY THIS FILE! It is automatically generated by giix.
 * If any changes are necessary, you must set or override the required
 * property or method in class "PhoneNumber".
 *
 * Columns in table "phoneNumber" available as properties of the model,
 * followed by relations of table "phoneNumber" available as properties of the model.
 *
 * @property string $id
 * @property string $phoneNumber
 * @property string $locationId
 *
 * @property Location $location
 */
abstract class BasePhoneNumber extends GxActiveRecord {

	public static function model($className=__CLASS__) {
		return parent::model($className);
	}

	public function tableName() {
		return 'phoneNumber';
	}

	public static function label($n = 1) {
		return Yii::t('app', 'PhoneNumber|PhoneNumbers', $n);
	}

	public static function representingColumn() {
		return 'phoneNumber';
	}

	public function rules() {
		return array(
			array('phoneNumber, locationId', 'required'),
			array('phoneNumber', 'length', 'max'=>20),
			array('locationId', 'length', 'max'=>10),
			array('id, phoneNumber, locationId', 'safe', 'on'=>'search'),
		);
	}

	public function relations() {
		return array(
			'location' => array(self::BELONGS_TO, 'Location', 'locationId'),
		);
	}

	public function pivotModels() {
		return array(
		);
	}

	public function attributeLabels() {
		return array(
			'id' => Yii::t('app', 'ID'),
			'phoneNumber' => Yii::t('app', 'Phone Number'),
			'locationId' => null,
			'location' => null,
		);
	}

	public function search() {
		$criteria = new CDbCriteria;

		$criteria->compare('id', $this->id, true);
		$criteria->compare('phoneNumber', $this->phoneNumber, true);
		$criteria->compare('locationId', $this->locationId);

		return new CActiveDataProvider($this, array(
			'criteria' => $criteria,
		));
	}
}