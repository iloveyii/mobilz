<?php
	require_once __DIR__.'/../../common/lib/sphinxapi.php';
	class SearchForm extends CFormModel {
		/** @var string $q the search term or phrase */
		public $q;

		public function rules() {
			return array(
				array('q', 'length', 'min' => 1, 'allowEmpty' => false),
			);
		}

		/**
		 * @return bool|Location[]|null
		 */
		public function search() {
			$cl = new SphinxClient();

			$cl->SetServer('127.0.0.1', 9999);

			$cl->SetMatchMode(SPH_MATCH_EXTENDED2);
			$cl->SetRankingMode(SPH_RANK_SPH04);
			$cl->SetSortMode(SPH_SORT_EXTENDED, '@relevance DESC');
			$cl->SetLimits(0, 10000);
			$results = $cl->Query($this->q);

			if ($results === false || !isset($results['matches'])) {
				$this->addError('q', $cl->GetLastError());
				$this->addError('q', $cl->GetLastWarning());
				return array();
			}

			$ids = array_keys($results['matches']);

			$criteria = new CDbCriteria();
			$criteria->addInCondition('id', $ids);

			/** @var Location[] $locations */
			$locations = Location::model()->findAll($criteria);
			return $locations;
		}

		public function attributeLabels() {
			return array(
				'q' => 'Sök',
			);
		}
	}