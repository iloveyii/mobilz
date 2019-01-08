<?php

/**
 * This is the model class for table "company".
 *
 * The followings are the available columns in table 'company':
 * @property integer $id
 * @property string $name
 * @property string $slug
 *
 * The followings are the available model relations:
 * @property CompanyProduct[] $companyProducts
 */
class Company extends GxActiveRecord
{
    /**
	 * Returns the static model of the specified AR class.
	 * @param string $className active record class name.
	 * @return Company the static model class
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
		return 'company';
	}

	/**
	 * @return array validation rules for model attributes.
	 */
	public function rules()
	{
		// NOTE: you should only define rules for those attributes that
		// will receive user inputs.
		return array(
			array('name, slug', 'length', 'max'=>45),
            array('seoId', 'numeric'),
			// The following rule is used by search().
			// Please remove those attributes that should not be searched.
			array('id, name, slug', 'safe', 'on'=>'search'),
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
			'companyProducts' => array(self::HAS_MANY, 'CompanyProduct', 'company_id'),
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
			'slug' => 'Slug',
            'seoId'=>null,
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
		$criteria->compare('name',$this->name,true);
		$criteria->compare('slug',$this->slug,true);

		return new CActiveDataProvider($this, array(
			'criteria'=>$criteria,
		));
	}
    
    public function findIDBySlug($slug) {
        $model = Company::model()->findByAttributes(array('slug'=>$slug));
        if(isset($model))
            return $model->id;
        else
            return FALSE;
    }
    
    public function magicReplace($str) {
		$str = preg_replace('#\$name\$#u', $this->name, $str);
		$str = preg_replace('#\$slug\$#u', $this->slug, $str);
		if (preg_match('#\$#', $str)) {
			throw new CHttpException(500, $this->name .' ogiltig variabel hittad i company:id: ' . $this->id . ' str: ' . $str);
		}
		return $str;
	}
}