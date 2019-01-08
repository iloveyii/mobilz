<?php
	class UserIdentity extends CUserIdentity {
		/** @var AdminUser */
		protected $_adminUser;

		public function authenticate() {
			$record = AdminUser::model()->findByAttributes(array('username' => $this->username, 'password' => ($this->password)));
			if ($record === null) {
				$this->errorCode = self::ERROR_USERNAME_INVALID;
			} else {
				$this->_adminUser = $record;
				$this->errorCode = self::ERROR_NONE;
			}
			return !$this->errorCode;
		}

		/**
		 * @return integer
		 */
		public function getId() {
			return $this->_adminUser->id;
		}

		/**
		 * @return AdminUser
		 */
		public function getUser() {
			return $this->_adminUser;
		}
	}