<?php

/**
 * This is the model class for table "aboutUs".
 *
 * The followings are the available columns in table 'aboutUs':
 * @property string $fldID
 * @property string $fldContent
 */
class AboutUs extends CActiveRecord
{
	/**
	 * Returns the static model of the specified AR class.
	 * @param string $className active record class name.
	 * @return AboutUs the static model class
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
		return 'aboutUs';
	}

	/**
	 * @return array validation rules for model attributes.
	 */
	public function rules()
	{
		// NOTE: you should only define rules for those attributes that
		// will receive user inputs.
		return array(
			array('fldContent', 'safe'),
			// The following rule is used by search().
			// Please remove those attributes that should not be searched.
			array('fldID, fldContent', 'safe', 'on'=>'search'),
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
			'fldID' => 'Fld',
			'fldContent' => 'Fld Content',
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

		$criteria->compare('fldID',$this->fldID,true);
		$criteria->compare('fldContent',$this->fldContent,true);

		return new CActiveDataProvider($this, array(
			'criteria'=>$criteria,
		));
	}
}