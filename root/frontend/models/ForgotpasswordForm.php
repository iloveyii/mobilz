<?php

/**
 * ForgotpasswordForm class.
 * ForgotpasswordForm is the data structure for keeping
 * user login form data. It is used by the 'forgotpassword' action of 'SiteController'.
 */
class ForgotpasswordForm extends CFormModel
{
	public $email;
    public $forgotPassword;
    public $sendMeLink;
    public $resetPassHeader;

    /**
	 * Declares the validation rules.
	 * The rules state that username and password are required,
	 * and password needs to be authenticated.
	 */
	public function rules()
	{
		return array(
			// username and password are required
			array('email', 'required'),
			// email needs to be an email
			array('email', 'email'),
            // email need to be registered with us
            array('email', 'userRegistered'),
		);
	}

	/**
	 * Declares attribute labels.
	 */
	public function attributeLabels()
	{
		return array(
			'email'=>Yii::t('app', 'Enter Your Email'),
            'forgotPassword'=>Yii::t('app', 'Forgot Password?'),
            'sendMeLink'=>Yii::t('app', 'Send Me Link'),
            'resetPassHeader'=>Yii::t('app', 'Reset Password'),
		);
	}
    
    /**
     * check if userRegistered
     * @param type $attribute
     * @param type $params
     */
    public function userRegistered($attribute,$params)
	{
        if(!$this->hasErrors()) {
            if(!User::model()->isRegistered($this->email))
                $this->addError('email','The given email is not registered.');
        }
	}
    
    public function sendPasswordResetLink() {
        // get a hash
        $hash= Resetpassword::model()->getHash($this->email);
        $email= new SendEmail;
        $from='sunny.sweden19@gmail.com';
        $to=  $this->email;
        $subject = 'Fillup - Password reset link';
        $msg='http://mobilz.se/resetpassword/' . $hash; 
        $email->sendEmail($from, $to, $subject, $msg);
        return true;
    }


}
