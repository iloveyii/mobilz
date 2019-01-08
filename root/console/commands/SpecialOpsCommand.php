<?php


	class SpecialOpsCommand extends CConsoleCommand {

		public function actionTestStrSplit() {
			print_r(str_split('åäö'));
		}

		public function actionEk2PostalCity() {
			$conn = Yii::app()->db;
			$getEmAll = $conn->createCommand("
				SELECT
					*
				FROM
					ek2_postal_city
			");
			$postalCities = $getEmAll->queryAll();

			foreach($postalCities as $pc) {
				PostalCity::findOrCreate($pc['fldPostalCity']);
			}
		}

		public function actionTestPreg() {
			$var = '12.23:';
			$c = preg_match_all('#(\d\d)#', $var, $matches);
			print_r($matches);
			var_dump($c);
		}

		public function actionFixChainSlugs() {
			echo PHP_EOL . 'fixing chainslugs';
			/** @var Chain[] $chains  */
			$chains = Chain::model()->findAll();
			foreach($chains as $chain) {
				if (!$chain->save()) {
					throw new CException('couldnt save chain: c.id: ' . $chain->id .  ' errors: ' . $chain->getErrors());
				}
				echo '.';
			}
			echo PHP_EOL . 'done' . PHP_EOL;
		}

		public function actionFixMallSlugs() {
			echo PHP_EOL . 'fixing mallslugs';
			/** @var Mall[] $malls  */
			$malls = Mall::model()->findAll();
			foreach($malls as $mall) {
				if (!$mall->save()) {
					throw new CException('couldnt save mall: c.id: ' . $mall->id .  ' errors: ' . $mall->getErrors());
				}
				echo '.';
			}
			echo PHP_EOL . 'done' . PHP_EOL;
		}

		public function actionFixLocationSlugs() {
			echo PHP_EOL . 'fixing locationslugs';
			/** @var Location[] $locations  */
			$locations = Location::model()->findAll();
			foreach($locations as $location) {
				if (!$location->save()) {
					throw new CException('couldnt save location: c.id: ' . $location->id .  ' errors: ' . $location->getErrors());
				}
				echo '.';
			}
			echo PHP_EOL . 'done' . PHP_EOL;
		}

		public function actionFixAllSlugs() {

			$this->actionFixChainSlugs();

			$this->actionFixLocationSlugs();

			$this->actionFixMallSlugs();
		}

		public function actionCreateSeoMappings() {
			foreach(SeoMapping::$pages as $page) {
				$seoMapping = new SeoMapping();
				$seoMapping->page = $page;
				if (!$seoMapping->save()) {
					throw new CException('couldnt save seo-mapping for page: ' . $page . ' errors: ' . CVarDumper::dumpAsString($seoMapping->getErrors()));
				}
			}
		}

		public function actionTestCharset($str = null) {
			var_dump(mb_internal_encoding());
			mb_internal_encoding('UTF-8');
			if ($str === null) {
				$str = 'åäö';
			}
			echo '1: ' . $str . PHP_EOL;
			echo '2: ' . mb_strlen($str) . PHP_EOL;
			echo '3: ' . strlen($str) . PHP_EOL;
			/** @var Chain $chain  */
			$chain = Chain::model()->findByPk(1);
			echo '4: ' . $chain->nameSlug . PHP_EOL;
			echo '5: ' . mb_strlen($chain->nameSlug) . PHP_EOL;
			echo '6: ' . strlen($chain->nameSlug) . PHP_EOL;

			/** @var Chain $chain  */
			$chain = Chain::model()->find('nameSlug = :str', array('str' => $str));
			echo '7: ' . $chain->nameSlug . PHP_EOL;
			echo '8: ' . mb_strlen($chain->nameSlug) . PHP_EOL;
			echo '9: ' . strlen($chain->nameSlug) . PHP_EOL;

			var_dump(preg_match_all('#[\wåäöÅÄÖéÉ]#u', $str, $matches));
			var_dump($matches);
		}

		public function actionTestExplode() {
			echo count(explode(':','7::')) . PHP_EOL;
			echo count(explode(':','7:12:12:23:23')) . PHP_EOL;
		}

		public function actionTestInArray() {
			$a = array(0 => 'CORPORATE', 1 => 'PRIVATE');
			var_dump(in_array('PRIVATE',$a));
		}

	}