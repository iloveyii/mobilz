<?php

/**
 * This is the model class for table "city".
 *
 * The followings are the available columns in table 'city':
 * @property integer $id
 * @property string $name
 * @property integer $county_id
 *
 * The followings are the available model relations:
 * @property Ad[] $ads
 * @property County $county
 */
class City extends CActiveRecord
{
	/**
	 * @return string the associated database table name
	 */
	public function tableName()
	{
		return 'city';
	}

	/**
	 * @return array validation rules for model attributes.
	 */
	public function rules()
	{
		// NOTE: you should only define rules for those attributes that
		// will receive user inputs.
		return array(
			array('county_id', 'numerical', 'integerOnly'=>true),
			array('name', 'length', 'max'=>45),
            array('name', 'unique'),
			// The following rule is used by search().
			// @todo Please remove those attributes that should not be searched.
			array('id, name, county_id', 'safe', 'on'=>'search'),
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
			'county' => array(self::BELONGS_TO, 'County', 'county_id'),
            'adCities' => array(self::HAS_MANY, 'AdCity', 'city_id'),
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
			'county_id' => 'County',
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
		$criteria->compare('county_id',$this->county_id);

		return new CActiveDataProvider($this, array(
			'criteria'=>$criteria,
		));
	}

	/**
	 * Returns the static model of the specified AR class.
	 * Please note that you should have this exact method in all your CActiveRecord descendants!
	 * @param string $className active record class name.
	 * @return City the static model class
	 */
	public static function model($className=__CLASS__)
	{
		return parent::model($className);
	}
    
    public function getCityList($county_id) {
        $cities = City::model()->findAllByAttributes(array('county_id'=>$county_id));
        return $cities;
    }
    
    public function cityIDExists($city_id) {
        $model = City::model()->findByPk($city_id);
        if(isset($model))
            return TRUE;
        else 
            return FALSE;
    }
    
    public function citySlugExists($city_slug) {
        $model = City::model()->findByAttributes(array('slug'=>$city_slug));
        if(isset($model))
            return TRUE;
        else 
            return FALSE;
    }
    
    public function getCityName($city_id) {
        $model = City::model()->findByPk($city_id);
        if(isset($model))
            return $model->name;
        else 
            return FALSE;
    }
    
    public function findIDBySlug($slug) {
        return $this->getID($slug);
    }
    
    public function getID($city_slug) {
        if($city_slug ===FALSE)            return FALSE;
        $model = City::model()->findByAttributes(array('slug'=>$city_slug));
        if(isset($model))
            return $model->id;
        else 
            return FALSE;
    }
    
    public function getIDByName($name) {
        if($name ===FALSE)            return FALSE;
        $q = new CDbCriteria();
        $q->addSearchCondition('name', $name);
        // $model = City::model()->find($q);
        $model = City::model()->findBySql("select * from city where name = '$name'");
        if(isset($model)) {
            // echo "\nI found city with name $name \n";
            return $model->id;
        }
        else {
            echo "\nI cannot find city with name $name \n";
            return FALSE; 
        
        }
    }
    
     public function getIDByNameSearchBySlug($name) {
         // $slug = $this->getSlugFromName($name);
         $slug =  strtolower(preg_replace("/[^A-Za-z0-9]/", '', $name));
         echo ("\nselect * from city where slug = '$slug'\n");
         $model = City::model()->findBySql("select * from city where slug = '$slug'");
         // $model = City::model()->findByAttributes(array('slug'=>$slug));
         // echo "Inside getIDByNameSearchBySlug($name), got slug $slug \n";
         if(isset($model)) {
//             var_dump($model);
//             exit;
             return $model->id;
         }
         echo "I Could not find model for $slug";
         return FALSE;
     }
    
    /**
     * Adds the list of cities (names) if not exists
     * 
     * @param array $cities
     * @param int county_id
     */
    public function addCityList(array $cities, $county_id) {
        // check first if county exists
        $County=County::model()->findByPk($county_id);
        if(isset($County)) {
            foreach ($cities as $city_name) {
                // now check if city already exists
                if(City::model()->exists('name=:name And county_id=:county_id', array(':name'=>$city_name, ':county_id'=>$county_id))) {
                    // do nothing
                    continue;
                } else {
                    $this->addCityCounty($city_name, $county_id);
                }   
            }
        } else { // Add county first
//            County::model()->addCounty($county);
//            $this->addCityList($cities, $county); // now again try adding citiies
            echo "The county_id {$county_id} does not exists \n";
            exit;
        }
    }
    
    public function addCityCounty($city_name, $county_id) {
        $model = new City;
        $model->name=trim($city_name);
        $model->county_id=$county_id;
        $model->save();
    }
    
    public function beforeSave() {
        
        if(parent::beforeSave()) {
            $this->slug= $this->getSlugFromName($this->name);
            return TRUE;
        }
        return FALSE;
    }
    
    public function getSlugFromName($name) {
       $str= $this->swedReplace(mb_strtolower(trim($this->name),'utf8'));
       return preg_replace("/[^A-Za-z0-9]/", '', $str);
    }
    
    public function swedReplace($string) {
        $search  = array('å', 'ä', 'ö');
        $replace = array('o', 'a', 'o');

        return str_replace($search, $replace, $string);
    }
    
}
