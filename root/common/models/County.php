<?php

/**
 * This is the model class for table "county".
 *
 * The followings are the available columns in table 'county':
 * @property integer $id
 * @property string $name
 *
 * The followings are the available model relations:
 * @property City[] $cities
 */
class County extends CActiveRecord
{
	/**
	 * @return string the associated database table name
	 */
	public function tableName()
	{
		return 'county';
	}

	/**
	 * @return array validation rules for model attributes.
	 */
	public function rules()
	{
		// NOTE: you should only define rules for those attributes that
		// will receive user inputs.
		return array(
			array('name', 'length', 'max'=>45),
			// The following rule is used by search().
			// @todo Please remove those attributes that should not be searched.
			array('id, name', 'safe', 'on'=>'search'),
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
			'cities' => array(self::HAS_MANY, 'City', 'county_id'),
		);
	}

	/**
	 * @return array customized attribute labels (name=>label)
	 */
	public function attributeLabels()
	{
		return array(
			'id' => 'ID',
			'name' => 'Name',
		);
	}

	/**
	 * Retrieves a list of models based on the current search/filter conditions.
	 *
	 * Typical usecase:
	 * - Initialize the model fields with values from filter form.
	 * - Execute this method to get CActiveDataProvider instance which will filter
	 * models according to data in model fields.
	 * - Pass data provider to CGridView, CListView or any similar widget.
	 *
	 * @return CActiveDataProvider the data provider that can return the models
	 * based on the search/filter conditions.
	 */
	public function search()
	{
		// @todo Please modify the following code to remove attributes that should not be searched.

		$criteria=new CDbCriteria;

		$criteria->compare('id',$this->id);
		$criteria->compare('name',$this->name,true);

		return new CActiveDataProvider($this, array(
			'criteria'=>$criteria,
		));
	}

	/**
	 * Returns the static model of the specified AR class.
	 * Please note that you should have this exact method in all your CActiveRecord descendants!
	 * @param string $className active record class name.
	 * @return County the static model class
	 */
	public static function model($className=__CLASS__)
	{
		return parent::model($className);
	}
    
    public function getCountyList() {
        $counties = County::model()->findAll();
        
        $str = '';
        foreach ($counties as $county) {
            $str .= '<a class="list-group-item" href="'. Yii::app()->createUrl('county/countycities/', array('slug'=>$county->slug)) . '">'. $county->name . '</a>';
        }
        return $str;
    }
    
    /**
     * Gets All cities in a county in list group format
     * 
     * @param string $county is the slug 
     * @return string
     * @throws CHttpException
     */
    public function getCountyCityList($slug) {
        
        $county_id = $this->getCountyID($slug);
        if(!isset($county_id))
            throw new CHttpException(400, 'This county does not exist');
        
        $county_name = $this->getCountyName($slug);
        $str = '<a class="list-group-item" href="'. Yii::app()->createUrl('county/countycities', array('slug'=>$slug)) . '"><strong>'. $county_name . '</strong></a>';
        
        $cities = City::model()->getCityList($county_id);
        foreach ($cities as $city) {
            $str .= '<a class="list-group-item" href="'. Yii::app()->createUrl('county/cities', array('slug'=>$slug,'city_slug'=>$city->slug)) . '">'. $city->name . '</a>';
        }
        return $str;
    }
    
    public function slugExists($slug) {
        $model = County::model()->findByAttributes(array('slug'=>$slug));
        if(isset($model))
            return true;
        else 
            return false;
    }
    
    /**
     * Finds county ID by slug
     * 
     * @param string $slug
     * @return boolean
     */
    public function getCountyID($slug) {
        $model=  County::model()->findByAttributes(array('slug'=>$slug));
        if(isset($model))
            return $model->id;
        else 
            return FALSE;
    }
    
    /**
     * Finds county name by slug
     * 
     * @param string $slug
     * @return boolean
     */
    public function getCountyName($slug) {
        $model=  County::model()->findByAttributes(array('slug'=>$slug));
        if(isset($model))
            return $model->name;
        else 
            return FALSE;
    }
    
     public function findIDBySlug($slug) {
         return $this->getCountyID($slug);
    }
    
    public function countAd() {
//        SELECT count(*) FROM mobilz.ad_city
//        INNER JOIN city ON ad_city.city_id = city.id
//        WHERE city.county_id = 11;
        
        $criteria = new CDbCriteria;
        $criteria->join='INNER JOIN city ON t.city_id = city.id';
        $criteria->condition='city.county_id =' . $this->id;
        return AdCity::model()->count($criteria);
    }
}
