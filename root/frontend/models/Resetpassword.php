<?php

/**
 * This is the model class for table "resetpassword".
 *
 * The followings are the available columns in table 'resetpassword':
 * @property integer $id
 * @property string $hash
 * @property string $date
 * @property integer $user_id
 *
 * The followings are the available model relations:
 * @property User $user
 */
class Resetpassword extends CActiveRecord
{
    public $email;
    public $password;
    public $confirm_password;


    /**
	 * @return string the associated database table name
	 */
	public function tableName()
	{
		return 'resetpassword';
	}

	/**
	 * @return array validation rules for model attributes.
	 */
	public function rules()
	{
		// NOTE: you should only define rules for those attributes that
		// will receive user inputs.
		return array(
			array('user_id', 'numerical', 'integerOnly'=>true),
			array('hash, date', 'length', 'max'=>45),
            array('password, confirm_password', 'length', 'min'=>8, 'max'=>25),
            array('password', 'required', 'on'=>'resetpassword'),
            array('confirm_password', 'compare','compareAttribute'=>'password', 'on'=>'resetpassword'),
            array('password, confirm_password', 'safe', 'on'=>'resetpassword'),
			// The following rule is used by search().
			// @todo Please remove those attributes that should not be searched.
			array('hash, date, user_id', 'unsafe'),
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
			'user' => array(self::BELONGS_TO, 'User', 'user_id'),
		);
	}

	/**
	 * @return array customized attribute labels (name=>label)
	 */
	public function attributeLabels()
	{
		return array(
			'id' => 'ID',
			'hash' => 'Hash',
			'date' => 'Date',
			'user_id' => 'User',
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

		$criteria->compare('date',$this->date,true);
		$criteria->compare('user_id',$this->user_id);

		return new CActiveDataProvider($this, array(
			'criteria'=>$criteria,
		));
	}

	/**
	 * Returns the static model of the specified AR class.
	 * Please note that you should have this exact method in all your CActiveRecord descendants!
	 * @param string $className active record class name.
	 * @return Resetpassword the static model class
	 */
	public static function model($className=__CLASS__)
	{
		return parent::model($className);
	}
    
    public function getHash($email) {
        $this->email = $email;
        $user = User::model()->findByAttributes(array('email'=>$email));
        if(isset($user)) {
            return $this->saveHash($user->id);
        } else {
            throw new CHttpException(500, "Cannot find user by email $email");
        }
    }
    
    private function saveHash($user_id) {
        $model = new Resetpassword;
        $model->user_id=$user_id;
        $model->hash= MD5(microtime(). $this->email . rand(200, 5000));
        $model->valid=true;
        $model->save(FALSE);
        return $model->hash;
    }
    
    
    public function resetPass($hash) {
        $this->validHash($hash);
        $model= Resetpassword::model()->findByAttributes(array('hash'=>$hash));
        if(isset($model)) {
            $user_id= $model->user_id;
            $model->scenario='resetpassword';
            $model->valid=FALSE;
            $model->save(FALSE);
            return User::model()->savePassword($user_id, $this->password);
        } else {
            throw new CHttpException(402, 'Cannot find hash while reseting.');
        }
    }
    
    public function validHash($hash) {
        if ($this->findHash($hash)) { // hash exits in db
            if($this->findHash($hash, TRUE)) { // hash exists and valid
                return TRUE;
            }  else {
                return 'The link is no more valid, please reset your password again.';
            }
        }  else {
            return "Error: Cannot find hash: $hash.";
        }
    }
    
    private function findHash($hash, $checkValid=FALSE) {
        if($checkValid) {
            return Resetpassword::model()->exists('hash=:hash AND valid=:valid',array(':hash'=>$hash, ':valid'=>1));
        }
        
        return Resetpassword::model()->exists('hash=:hash',array(':hash'=>$hash));
    }
    
    public function beforeSave() {
        if(parent::beforeSave()){
            $this->date=date("Y-m-d H:i:s");
            return TRUE;
        } else {
            return false;
        }
    }
}
