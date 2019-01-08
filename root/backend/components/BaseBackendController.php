<?php

	class BaseBackendController extends GxController {
		/** @var array */
		public $breadcrumbs;

		/** @var string */
		public $layout = '//layouts/main';

		public function filters() {
			return array(
				'accessControl',
			);
		}

		public function accessRules() {
			return array(
				array(
					'allow',
					'users' => array('@'),
				),
				array(
					'allow',
					'actions' => array('login','index','detail','crop', 'alias'),
					'users' => array('*'),
				),
				array(
					'deny',
					'users' => array('*'),
				),
			);
		}
	}