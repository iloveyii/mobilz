<?php
	class Common {
		public static function createSlug($str) {
			$slug = preg_replace('@[^\w\dåäöÅÄÖé]+@u', '-', $str);

			$slug = mb_strtolower($slug, Yii::app()->charset);

			$slug = trim($slug, '-');
			while(preg_match('#--#', $slug)) {
				$slug = preg_replace('#--#', '-', $slug);
			}
			return $slug;
		}

		public static function encryptPassword($str) {
			return crypt($str, '$2a$12$saltsaltsaltsaltdrugs$');
		}
	}