<?php

/**
 * This is the model class for table "subchain".
 *
 * The followings are the available columns in table 'subchain':
 * @property string $id
 * @property integer $cId
 * @property string $name
 * @property string $nameSlug
 */
class Subchain extends CActiveRecord
{
	/**
	 * Returns the static model of the specified AR class.
	 * @param string $className active record class name.
	 * @return Subchain the static model class
	 */
	public static function model($className=__CLASS__)
	{
		return parent::model($className);
	}

	/**
	 * @return string the associated database table name
	 */
	public function tableName()
	{
		return 'subchain';
	}

	/**
	 * @return array validation rules for model attributes.
	 */
	public function rules()
	{
		// NOTE: you should only define rules for those attributes that
		// will receive user inputs.
		return array(
			array('name, nameSlug', 'required'),
			array('cId', 'numerical', 'integerOnly'=>true),
			array('name, nameSlug', 'length', 'max'=>255),
			// The following rule is used by search().
			// Please remove those attributes that should not be searched.
			array('id, cId, name, nameSlug', 'safe', 'on'=>'search'),
		);
	}

	/**
	 * @return array relational rules.
	 */
	public function relations()
	{
		// NOTE: you may need to adjust the relation name and the related
		// class name for the relations automatically generated below.
		return array(
		);
	}

	/**
	 * @return array customized attribute labels (name=>label)
	 */
	public function attributeLabels()
	{
		return array(
			'id' => 'ID',
			'cId' => 'Parent',
			'name' => 'Name',
			'nameSlug' => 'Name Slug',
		);
	}

	/**
	 * Retrieves a list of models based on the current search/filter conditions.
	 * @return CActiveDataProvider the data provider that can return the models based on the search/filter conditions.
	 */
	public function search()
	{
		// Warning: Please modify the following code to remove attributes that
		// should not be searched.

		$criteria=new CDbCriteria;

		$criteria->compare('id',$this->id,true);
		$criteria->compare('cId',$this->cId);
		$criteria->compare('name',$this->name,true);
		$criteria->compare('nameSlug',$this->nameSlug,true);

		return new CActiveDataProvider($this, array(
			'criteria'=>$criteria,
		));
	}
}