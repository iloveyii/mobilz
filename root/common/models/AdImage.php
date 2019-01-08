<?php

/**
 * This is the model class for table "image".
 *
 * The followings are the available columns in table 'image':
 * @property integer $id
 * @property integer $ad_id
 * @property string $image_file
 *
 * The followings are the available model relations:
 * @property Ad $ad
 */
class AdImage extends CActiveRecord
{
	/**
	 * @return string the associated database table name
	 */
	public function tableName()
	{
		return 'image';
	}

	/**
	 * @return array validation rules for model attributes.
	 */
	public function rules()
	{
		// NOTE: you should only define rules for those attributes that
		// will receive user inputs.
		return array(
			array('id', 'required'),
			array('id, ad_id, cropped', 'numerical', 'integerOnly'=>true),
			array('image_file', 'length', 'max'=>45),
			// The following rule is used by search().
			// @todo Please remove those attributes that should not be searched.
			array('id, ad_id, image_file', 'safe'),
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
			'image_file' => 'Image File',
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
		$criteria->compare('ad_id',$this->ad_id);
		$criteria->compare('image_file',$this->image_file,true);

		return new CActiveDataProvider($this, array(
			'criteria'=>$criteria,
		));
	}

	/**
	 * Returns the static model of the specified AR class.
	 * Please note that you should have this exact method in all your CActiveRecord descendants!
	 * @param string $className active record class name.
	 * @return Image the static model class
	 */
	public static function model($className=__CLASS__)
	{
		return parent::model($className);
	}
    
    public function getPrimaryImage($ad_id) {
        $images = AdImage::model()->findAllByAttributes(array('ad_id'=>$ad_id));
        if(count($images) > 0) {
            foreach ($images as $image) {
                // return $image->image_file;
                return $image;
            }
        }
        return FALSE;
    }
    
    public function getImage() {
        return Yii::app()->baseUrl.'/img/products/'.  $this->image_file ;
    }
    
    public function getAdLink($ad_id) {
        $link = Yii::app()->createUrl('ad/detail', array('id'=>$ad_id, 'image_id'=>$this->id));
        return $link;
    }
    
    public function getBackendAdCropLink($ad_id) {
        $link = Yii::app()->createUrl('site/cropping', array('id'=>$ad_id, 'image_id'=>$this->id));
        return $link;
    }
    
    public function addImage($ad_id, $image_file) {
        if($image_file===FALSE)            return; // not a valid image file name
        if(!AdImage::model()->exists('ad_id=:ad_id AND image_file=:image_file', array(':ad_id'=>$ad_id,':image_file'=>$image_file))) {
            $model = new AdImage;
            $model->ad_id=$ad_id;
            $model->image_file=$image_file;
            $model->save(FALSE);
        }
    }
    
    public function setCropped($image_id, $cropped) {
        $model = AdImage::model()->findByPk($image_id);
        if(isset($model)) {
            $model->cropped=$cropped;
            return $model->save(FALSE);
        }
        
        return FALSE;
    }
    
    public function findUncropped() {
        $criteria = new CDbCriteria;
        $criteria->order = 'ad_id DESC, id ASC';
        $criteria->condition='cropped=1 OR cropped=4';
        $model = AdImage::model()->find($criteria);
        return $model;
    }
    
    public function uploadFile($model, $imageAttribute, $image_path) {
        // echo "inside upload file uploadFile(, $imageAttribute, $image_path)";
		$uploadedFile=CUploadedFile::getInstance($model,$imageAttribute);
		if (isset($uploadedFile)) {
            // echo 'uploadedFile is set';
			$model->$imageAttribute=strtolower($uploadedFile->name);
			if(TRUE) {
				$image_path_full = $image_path . '/'.$model->id.'_'. strtolower($uploadedFile->name);
				$uploadedFile->saveAs($image_path_full);
				Yii::app()->imageResizer
				  ->load($image_path_full)
				  ->resize(320,150)
				  ->save($image_path_full);
				  
				  Yii::app()->imageResizer
				  ->load($image_path_full)
				  ->resize(60,41)
				  ->save($image_path .'/thumb_' .$model->id.'_' . strtolower($uploadedFile->name));
                  
                  // now save to AdImage
                  $AdImage = new AdImage();
                  $AdImage->ad_id = $model->id;
                  $AdImage->image_file = $model->id.'_'. strtolower($uploadedFile->name);
                  $AdImage->save(FALSE);
				return true; // image saved
			}
		} else {
			if ($model->isNewRecord)
				$model->$imageAttribute = 'default.jpg'; // set default img
		}
		return false; // image could not save, bcz img was not set
	}
}
