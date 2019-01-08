<?php
	class LoginForm extends CFormModel {
		public $username;
		public $password;

		public function rules() {
			return array(
				array('username,password', 'required'),
			);
		}

		public function attemptLogin() {
			$identity=new UserIdentity($this->username,$this->password);
			if($identity->authenticate()) {
				Yii::app()->user->login($identity);
				return true;
			}
			$this->addError('username','Denied..kolla capslock..');
			return false;
		}
	}