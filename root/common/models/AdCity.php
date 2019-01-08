<?php

/**
 * This is the model class for table "ad_city".
 *
 * The followings are the available columns in table 'ad_city':
 * @property integer $id
 * @property integer $ad_id
 * @property integer $city_id
 *
 * The followings are the available model relations:
 * @property Ad $ad
 * @property City $city
 */
class AdCity extends CActiveRecord
{
	/**
	 * Returns the static model of the specified AR class.
	 * @param string $className active record class name.
	 * @return AdCity the static model class
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
		return 'ad_city';
	}

	/**
	 * @return array validation rules for model attributes.
	 */
	public function rules()
	{
		// NOTE: you should only define rules for those attributes that
		// will receive user inputs.
		return array(
			array('ad_id, city_id', 'numerical', 'integerOnly'=>true),
			// The following rule is used by search().
			// Please remove those attributes that should not be searched.
			array('id, ad_id, city_id', 'safe', 'on'=>'search'),
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
			'ad' => array(self::BELONGS_TO, 'Ad', 'ad_id'),
			'city' => array(self::BELONGS_TO, 'City', 'city_id'),
		);
	}

	/**
	 * @return array customized attribute labels (name=>label)
	 */
	public function attributeLabels()
	{
		return array(
			'id' => 'ID',
			'ad_id' => 'Ad',
			'city_id' => 'City',
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

		$criteria->compare('id',$this->id);
		$criteria->compare('ad_id',$this->ad_id);
		$criteria->compare('city_id',$this->city_id);

		return new CActiveDataProvider($this, array(
			'criteria'=>$criteria,
		));
	}
    
    /**
     * adds Ad id and City id to model
     * 
     * @param int $ad_id
     * @param int $city_id
     */
    public function addAdCity($ad_id, $city_id) {
        if(!AdCity::model()->exists('ad_id=:ad_id AND city_id=:city_id', array(':ad_id'=>$ad_id,':city_id'=>$city_id))) {
            $model = new AdCity;
            $model->ad_id=$ad_id;
            $model->city_id=$city_id;
            $model->save(FALSE);
        }
    }
    
    /**
     * Return cities of an add in BS3 bage format
     * @param int $ad_id
     */
    public function getCityBages($ad_id) {
        $adCites = AdCity::model()->findAllByAttributes(array('ad_id'=>$ad_id));
        $bages = '';
        if(isset($adCites)) {
            foreach ($adCites as $adCity) {
                $bages .= "<span class='label-info badge'>{$adCity->city->name}</span>&nbsp;";
            }
            
            return $bages;
        }
        
        return FALSE;
    }
    
    /**
     * Return cities of an add in csv format
     * @param int $ad_id
     */
    public function getAdCities($ad_id, $separator=',') {
        $adCites = AdCity::model()->findAllByAttributes(array('ad_id'=>$ad_id));
        $cities = '';
        if(isset($adCites)) {
            foreach ($adCites as $adCity) {
                $cities .= "{$adCity->city->name}{$separator} ";
            }
            
            $cities = rtrim($cities, $separator);
            return $cities;
        }
        
        return FALSE;
    }
}