<?php

/**
 * This is the model class for table "ad".
 *
 * The followings are the available columns in table 'ad':
 * @property integer $id
 * @property string $name
 * @property integer $active
 * @property string $price
 * @property integer $subcat_id
 * @property integer $city_id
 *
 * The followings are the available model relations:
 * @property City $city
 * @property Subcat $subcat
 */
class Ad extends GxActiveRecord
{
    /* For Importing data */
    const TELEFONER=5;
    const TILLBEHÖR=6;
    public $category;
    public $area;
    public $county;
    public $image_file;
    public $otherImages;
    
    /** for creating ad, these are relate to user model */
    public $email;
    public $mobile;
    public $city_id;
    public $county_id;
    public $image1;
    public $image2;
    public $image3;
    public $cityIds;
    public $cityIdsError;
    public $tagData;
    public $tagSuggestions;
    
    public $seoId = null;
    public $title;


    /**
	 * @return string the associated database table name
	 */
	public function tableName()
	{
            return 'ad';
	}

	/**
	 * @return array validation rules for model attributes.
	 */
	public function rules()
	{
            // NOTE: you should only define rules for those attributes that
            // will receive user inputs.
            return array(
                    array('active, subcat_id, edited, city_id, user_id, type_id, price_decline', 'numerical', 'integerOnly'=>true),
                    array('name', 'length', 'max'=>45),
                    array('price', 'length', 'max'=>5),
                    array('link, butik', 'length', 'max'=>115),
                    array('published', 'length', 'max'=>20),
                    array('time', 'length', 'max'=>6),
                    array('area', 'length', 'max'=>65),
                    array('product_id, company_id, county_id, city_id, hidemobile, cityIds, description, category, description_en, image1,image2,image3, contact, otherImages', 'safe'),
                    array('description', 'checkSimilarity', 'on'=>'editing'),
                    // required fields
                    array('name, product_id, company_id, city_id, rubrik, price', 'required', 'on'=>'update, insert'),
                    // custom validation
                    array('cityIds','cityIdsOk', 'on'=>'update, insert'),
                    array('image1,image2,image3', 'file', 'allowEmpty'=>true, 'types'=>'jpg,jpeg,gif,png', 'maxSize'=>900720),
                    array('hidemobile','default', 'value'=> 0, 'setOnEmpty'=>TRUE),
                    // The following rule is used by search().
                    // Please remove those attributes that should not be searched.
                    array('id,hidemobile, name, active, price, subcat_id, city_id, user_id, link, published, type_id, description, description_en, time, price_decline, butik, area', 'safe', 'on'=>'search'),
		);
	}
    
    public function cityIdsOk($cityIds, $param) {
        // echo $this->cityIds; exit;
//        $count = count(json_decode($this->cityIds, true));
//        // at most 3 items in array
//        $this->cityIdsError='';
//        if($count > 3 || empty(json_decode($this->cityIds, true))) {
//            $this->addError($cityIds, 'You can add a minimum of one and maximum of three cites.');
//            $this->cityIdsError='border: 2px solid #B94A48;';
//            return FALSE;
//        }

        return TRUE;
    }
        
    public function checkSimilarity($description, $param) {
        return TRUE;
        // get previous description from DB
        $model = Ad::model()->findByPk($this->id);
        if(!isset($model)) {
            throw new CHttpException(500, 'Something strange happened in checking Similarity !');
        }
        $descriptionOld = $model->description;
        similar_text($this->description, $descriptionOld, $percent);
        if($percent > 70) { // similarity must be less than 70
            $this->addError($description, 'You must change description at least 70% than the original, current similarity is ' . round($percent) . '%.');
            return FALSE;
        }
        $this->edited = 1;
        return TRUE;
    }
        
	/**
	 * @return array relational rules.
	 */
	public function relations()
	{
		// NOTE: you may need to adjust the relation name and the related
		// class name for the relations automatically generated below.
		return array(
			'product' => array(self::BELONGS_TO, 'Product', 'product_id'),
			'subcat' => array(self::BELONGS_TO, 'Subcat', 'subcat_id'),
			'type' => array(self::BELONGS_TO, 'Type', 'type_id'),
			'user' => array(self::BELONGS_TO, 'User', 'user_id'),
			'adCities' => array(self::HAS_MANY, 'AdCity', 'ad_id'),
			'images' => array(self::HAS_MANY, 'AdImage', 'ad_id'),
            'seo' => array(self::BELONGS_TO, 'Seo', 'seoId'),
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
			'active' => 'Active',
			'price' => 'Price',
			'product_id' => 'Category',
			'company_id' => 'Company',
			'city_id' => 'City',
            'email' => 'Email',
            'mobile' => 'Mobile',
            'hidemobile' => 'Dölj Telefonnumret',
            'county_id'=> 'Län',
            'city_id' => 'Kommun',
            'rubrik' => 'Rubrik',
            'description' => 'Details',
            'price' => 'Pris',
            'image1' => 'Bilder 1',
            'image2' => 'Bilder 2',
            'image3' => 'Bilder 3',
            'cityIds' => 'Choose cities',
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
		$criteria->compare('active',$this->active);
		$criteria->compare('price',$this->price,true);
		$criteria->compare('subcat_id',$this->subcat_id);
		$criteria->compare('city_id',$this->city_id);

		return new CActiveDataProvider($this, array(
			'criteria'=>$criteria,
		));
	}

	/**
	 * Returns the static model of the specified AR class.
	 * Please note that you should have this exact method in all your CActiveRecord descendants!
	 * @param string $className active record class name.
	 * @return Ad the static model class
	 */
	public static function model($className=__CLASS__)
	{
		return parent::model($className);
	}
    
    public function getPrimaryImagePath() {
        
        $Image= $this->getPrimaryImage($this->id);
        if($Image === FALSE) {
           return Yii::app()->baseUrl.'/img/products/'. 'default.jpg'; 
        }
        
        $path = dirname(__FILE__) . '/../../frontend/www/img/products/' . $Image->image_file;
        if(!is_file($path))  {
            return Yii::app()->baseUrl.'/img/products/'. 'default.jpg';
        }
            
        return Yii::app()->baseUrl.'/img/products/'. $Image->image_file ; 
    }
    
    public function getPrimaryImage() {
        $Image= AdImage::model()->getPrimaryImage($this->id);
        return $Image ; 
    }
    
    public function getAllImages() {
        return AdImage::model()->findAllByAttributes(array('ad_id'=>  $this->id), array('order'=>'id ASC'));
    }
    
    public function getImagePath($image_id) {
        $model= AdImage::model()->findByPk($image_id);
        if(isset($model))
            $image_file=$model->image_file;
        else 
            $image_file='default.jpg';
        
        return Yii::app()->baseUrl.'/img/products/'.$image_file ; 
    }
    
    public function getCounty() {
        // TBD
        return 'stockholm';
    }
    
    /**
     * Checks 12345.htm part in the link only
     * 
     * @param string $link in format 12345.htm
     * @return int $id model id
     */
    public function linkExists($linkPart) {
        $Ad = Ad::model()->findByAttributes(array('link'=>$linkPart));
        if(isset($Ad)) {
            return $Ad->id;
        }
        return FALSE;
    }
    
    public function afterSave() {
        
        if($this->scenario=='data') {
            /**
             * we want to save all cities found in the area for this AD
             */
            $cities = explode(',', $this->area);
            // remove spaces
            foreach($cities as $key=>$value) {
                $cities[$key]=trim($value);
            }
            foreach($cities as $city) {
                // TBD refactor add addAdCityByName to its model
                $city_id = City::model()->getIDByName($city);
                echo "Searching city with name {$city} \n";
                if($city_id == FALSE) {
                    echo "Could not find id for city name {$city} \n";
                } else {
                    echo "Finds ID {$city_id} for city {$city} \n";
                }
                echo "\n*********Saving addAdCity($this->id, $city_id) \n";
                if(! AdCity::model()->exists('ad_id=:ad_id AND city_id=:city_id', array(':ad_id'=>  $this->id,':city_id'=>$city_id))){
                    // check if city_id exists
                    if( $city_id !== FALSE ) {
//                        echo "Saving addAdCity($this->id, $city_id) \n";
                        AdCity::model()->addAdCity($this->id, $city_id);
                    } else {
//                        echo PHP_EOL . "could not find city_id for $city" . PHP_EOL;
                    }
                }
            }
                 
        }
        parent::afterSave();
    }
    
    public function beforeSave() {
        
        if(parent::beforeSave()){
            /**
             * We want to add city if not exists
             * Convert description to utf8
             */
            if($this->scenario=='data') {
                // Skärholmen, Bredäng
                $cities = explode(',', $this->area);
                // dont add NA
                if($cities[0]!='NA')
                    City::model()->addCityList($cities, $this->county_id);
                // echo "Switching category for $this->category \n";
                switch ($this->category) {
                    case 'Tillbehör':
                        $this->product_id= self::TILLBEHÖR;
                        break;
                    case 'Telefoner':
                        $this->product_id= self::TELEFONER;
                        break;
                }
            }
            return true;
        }
        return false;
    }
    
    public function getIcon() {
        if($this->type_id==self::TELEFONER) {
            return 'fa fa-mobile';
        } else {
            return 'fa fa-headphones';
        }
    }
    
    public function getUrl($prevParams=array(), $image_id=FALSE) {
        $id = $this->id;
        $a="a{$id}";
        $n =  $this->makeSlug();
        if($image_id !==FALSE) {
           $adParams=array(
                'a'=>$a,
                'n'=>$n,
                'image_id'=>$image_id,
           );
        }
        else {
            $adParams=array(
                'a'=>$a,
                'n'=>$n,
            );
        }
        $url = Yii::app()->createUrl('ad/url',  array_merge($prevParams, $adParams));
        return $url;
    }
    
    protected function makeSlug() {
        $id = $this->id;
        $name = Ad::model()->findByPk($id)->name;
        $name = strtolower(mb_convert_encoding($name, 'UTF-8', mb_detect_encoding($name, 'UTF-8, ISO-8859-1', true)));
        return preg_replace(array('/å/','/ä/','/ö/','/\s+/','/[^-a-z0-9]/'), array('o','a','o','-',''), $name);
    }
    
    public function getLastID() {
        $criteria = new CDbCriteria();
        $criteria->order="id DESC";
        $model = Ad::model()->find($criteria);
        return $model->id;
    }
    
    public function showPublished() {
        $months = array(
            'maj'=>5,
            'juni'=>6, 
            'jun'=>6,
        );
        
        date_default_timezone_set('Europe/Stockholm');
        // echo CHtml::encode(date("d M Y H:i",  strtotime($this->published))); // show correct
        // echo CHtml::encode($this->published); // show correct
        if(trim($this->published) == 'Igår' || $this->published === NULL) {
            $this->published= (date("Y-m-d H:i",  time()));
            $this->save(FALSE);
        } else {
            $tmpDate= explode(' ', trim($this->published)); // 31 maj
            if(count($tmpDate) > 1) {
                if(in_array($tmpDate[1], array_keys($months))) {
                    $month = $tmpDate[1];
                    $published = "{$tmpDate[0]}-". $months[$month]. "-2014";
                    $published =  (date("Y-m-d h:i",  strtotime($published)));
                    echo $published;
                    return;
                }
            }
            // echo CHtml::encode(date("d M Y h:i",  strtotime($this->published)));
        }
        echo CHtml::encode(date('Y-m-d h:i', strtotime($this->published)-1201));
        // echo CHtml::encode(date("d M Y h:i",  strtotime($this->published) - (1*1802))); // trunc 24 hrs so make it diff
    }
    
    public function showCities() {
        echo AdCity::model()->getCityBages($this->id);
    }
    
    public function findUserID($ad_id) {
        $model = Ad::model()->findByPk($ad_id);
        if(isset($model)) {
            return $model->user_id;
        } else {
            throw new CHttpException(404, 'The given ad cannot be found');
        }
    }
    
    public function editedMark() {
        if($this->edited == 1) {
            return '<i class="fa fa-check-circle-o edited"></i>&nbsp;&nbsp;' . '<span class="edited-small">No need to edit again !</span>';
        } else {
            return '<i class="fa fa-warning notedited"></i>&nbsp;&nbsp;'. '<span class="notedited-small">You must edit it !!!</span>';
        }
    }
    
    public function findUnedited() {
        $criteria = new CDbCriteria;
        $criteria->order = 'id DESC';
        $criteria->condition='edited=3 OR edited=1 OR edited is null'; // 3 editing, 1/null unedited
        $model = Ad::model()->find($criteria);
        return $model;
    }
    
    public function getPrimaryImageTag() {
        return '<img style="width:50px;" src="' . $this->getPrimaryImagePath() . '" />';
    }
    
    public function getActive() {
        if($this->active == 1)
            return '<i class="fa fa-check-circle active-green"></i>';
            // return '<img style="width:50px;" src="' . Yii::app()->baseUrl.'/img/active.png' . '" />';
        else  
            return '<i class="fa fa-times-circle active-red"></i>';
            // return '<img style="width:50px;" src="' . Yii::app()->baseUrl.'/img/disable.png' . '" />';
    }
    
    public function getAdCount($product_id = 0, $name = FALSE, $companies = array()) {
        $companyCount = array();
        $criteria = new CDbCriteria();
        $criteria->condition = "company_id = :company_id";
        $criteria->condition = $product_id === 0 ? "company_id = :company_id" : "company_id= :company_id AND product_id= :product_id";
        if(empty($companies))
            $companies = Company::model()->findAll();
        foreach ($companies as $company) {
            $index = $name === true ? $company->name : $company->slug;
            $criteria->params = $product_id === 0 ? array(':company_id'=>$company->id) : array(':company_id'=>$company->id, ':product_id'=>$product_id);
            $companyCount[$index] = Ad::model()->count($criteria);
        }
        
        return $companyCount;
    }
    
    public function magicReplace($str) {
		$str = preg_replace('#\$name\$#u', $this->name, $str);
		$str = preg_replace('#\$slug\$#u', $this->makeSlug(), $str);
		$str = preg_replace('#\$cities\$#u', AdCity::model()->getAdCities($this->id), $str);
		if (preg_match('#\$#', $str)) {
			throw new CHttpException(500, $this->name .' ogiltig variabel hittad i company:id: ' . $this->id . ' str: ' . $str);
		}
		return $str;
	}
}