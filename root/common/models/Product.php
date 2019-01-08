<?php

/**
 * This is the model class for table "product".
 *
 * The followings are the available columns in table 'product':
 * @property integer $id
 * @property string $name
 * @property string $published
 * @property string $image_file
 * @property string $slug
 *
 * The followings are the available model relations:
 * @property Ad[] $ads
 * @property Cart[] $carts
 * @property CompanyProduct[] $companyProducts
 */
class Product extends CActiveRecord
{
	/**
	 * Returns the static model of the specified AR class.
	 * @param string $className active record class name.
	 * @return Product the static model class
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
		return 'product';
	}

	/**
	 * @return array validation rules for model attributes.
	 */
	public function rules()
	{
		// NOTE: you should only define rules for those attributes that
		// will receive user inputs.
		return array(
			array('name, image_file, slug', 'length', 'max'=>45),
			array('published', 'length', 'max'=>3),
			// The following rule is used by search().
			// Please remove those attributes that should not be searched.
			array('id, name, published, image_file, slug', 'safe', 'on'=>'search'),
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
			'ads' => array(self::HAS_MANY, 'Ad', 'product_id'),
			'carts' => array(self::HAS_MANY, 'Cart', 'product_id'),
			'companyProducts' => array(self::HAS_MANY, 'CompanyProduct', 'product_id'),
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
			'published' => 'Published',
			'image_file' => 'Image File',
			'slug' => 'Slug',
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
		$criteria->compare('published',$this->published,true);
		$criteria->compare('image_file',$this->image_file,true);
		$criteria->compare('slug',$this->slug,true);

		return new CActiveDataProvider($this, array(
			'criteria'=>$criteria,
		));
	}
    
    public function slugExists($slug) {
        $model = Product::model()->findByAttributes(array('slug'=>$slug));
        if(isset($model))
            return true;
        else 
            return false;
    }
    
    public function findIDBySlug($slug) {
        $model = Product::model()->findByAttributes(array('slug'=>$slug));
        if(isset($model))
            return $model->id;
        else
            return FALSE;
    }
}