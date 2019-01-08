<?php

/**
 * This is the model class for table "savedsearch".
 *
 * The followings are the available columns in table 'savedsearch':
 * @property integer $id
 * @property integer $search_id
 * @property string $key
 * @property integer $val
 * @property integer $user_id
 */
class Savedsearch extends CActiveRecord
{
    public $maxSearchID;
    /**
	 * Returns the static model of the specified AR class.
	 * @param string $className active record class name.
	 * @return Savedsearch the static model class
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
		return 'savedsearch';
	}

	/**
	 * @return array validation rules for model attributes.
	 */
	public function rules()
	{
		// NOTE: you should only define rules for those attributes that
		// will receive user inputs.
		return array(
			array('search_id, val, user_id', 'numerical', 'integerOnly'=>true),
			array('key', 'length', 'max'=>15),
			// The following rule is used by search().
			// Please remove those attributes that should not be searched.
			array('id, search_id, key, val, user_id', 'safe', 'on'=>'search'),
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
			'search_id' => 'Search',
			'key' => 'Key',
			'val' => 'Val',
			'user_id' => 'User',
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
		$criteria->compare('search_id',$this->search_id);
		$criteria->compare('key',$this->key,true);
		$criteria->compare('val',$this->val);
		$criteria->compare('user_id',$this->user_id);

		return new CActiveDataProvider($this, array(
			'criteria'=>$criteria,
		));
	}
        
        /**
         * Returns array of table_slug=>slug
         * for $_GET[product_slug]=>slug
         * 
         * @param int $search_id
         */
        public function getSlugs($search_id) {
            $models = Savedsearch::model()->findAllByAttributes(array('search_id'=>$search_id));
            if(count($models) > 0) {
                foreach($models as $model) {
                    // this resembles table => table.id, to match in $_GET
                    $arrSlug[$model->key . '_slug']= $this->findSlugForTable($model->key, $model->val);
                }
                
                return $arrSlug;
            }
            
            return FALSE;
        }
        
        private function findSlugForTable($table, $id) {
            $class = ucfirst($table);
            $model = new $class;
            $slug = $model->findByPk($id)->slug;
            return $slug;
        }
        
        private function findIDForTable($table, $slug) {
            $class = ucfirst($table);
            $model = new $class;
            $slug = $model->findByAttributes(array('slug'=>$slug));
            if(isset($slug))
                return $slug->id;
            
            return FALSE;
        }
        
        public function saveUserSearch($user_id , $arrSearch) {
            // find max search id
            $maxSearchID = 1;
            $criteria=new CDbCriteria;
            $criteria->select='max(search_id) AS maxSearchID';
            $model = Savedsearch::model()->find($criteria);
            if(isset($model))
                $maxSearchID = $model->maxSearchID + 1;
            
            foreach ($arrSearch as $table_slug => $slug) {
                $table = explode('_', $table_slug);
                $key = reset($table);
                $val = $this->findIDForTable($key, $slug);
                $model = new Savedsearch();
                $model->search_id = $maxSearchID;
                $model->key = $key;
                $model->val = $val;
                $model->save(FALSE);
            }
            
            $UserSavedSearch = new UserSavedsearch;
            $UserSavedSearch->user_id  = $user_id;
            $UserSavedSearch->search_id=$maxSearchID;
            $UserSavedSearch->name = 'tmp' . date('Y-m-d H:i:s');
            $UserSavedSearch->save(FALSE);
            
        }
        
}