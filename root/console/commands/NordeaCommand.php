<?php
	require_once(__DIR__ . '/../../common/lib/Nearsoft-PHP-SeleniumClient-bab8290/SeleniumClient/WebDriverWait.php');
	require_once(__DIR__ . '/../../common/lib/Nearsoft-PHP-SeleniumClient-bab8290/SeleniumClient/WebDriver.php');

	use SeleniumClient\WebDriver;
	use SeleniumClient\DesiredCapabilities;
	use SeleniumClient\By;
	use SeleniumClient\WebElement;
	use SeleniumClient\WebDriverWait;
	use SeleniumClient\WebDriverWaitTimeoutException;

	/**
	 * @property WebDriver $driver
	 */
	class NordeaCommand extends CConsoleCommand {
		/** @var WebDriver */
		protected $driver;

		/** @var string */
		public $browser = "chrome";

		public function init() {
			$desiredCapabilities = new DesiredCapabilities($this->browser);
			$this->driver = new WebDriver($desiredCapabilities);
		}

		public function actionIndex($test = '0') {
			$problems = array();
			try {
				$d = $this->driver;

				$chain = Chain::newIfNotExists('Nordea');

				$letters = array(
					'a', 'b', 'c', 'd', 'e',
					'f', 'g', 'h', 'i', 'j',
					'k', 'l', 'm', 'n', 'o',
					'p', 'q', 'r', 's', 't',
					'u', 'v', 'w', 'x', 'y',
					'z', 'å', 'ä', 'ö',
				);

				$dayNumbers = array(
					2 => 'Måndag',
					3 => 'Tisdag',
					4 => 'Onsdag',
					5 => 'Torsdag',
					6 => 'Fredag',
					7 => 'Lördag',
					8 => 'Söndag',
				);

				$searchStrings=Yii::app()->cache->get('nordeaSearchStrings');

				if($searchStrings===false) {
					$searchStrings = array();
					foreach ($letters as $letter) {
						echo 'l';
						$d->get('http://service.nordea.com/nordea-openpages-ext2/branchlocator/autocomplete.action?country=se&language=sv&term=' . rawurlencode($letter) . '&maxRows=1000');

						$body = $d->waitForElementUntilIsPresent(By::cssSelector('body'), 60);

						$response = json_decode($body->getText(), true);
						foreach ($response['result']['items'] as $item) {
							$searchStrings[] = trim($item);
						}
					}
					Yii::app()->cache->set('nordeaSearchStrings', $searchStrings, 60*60*24);
				}

				$items=Yii::app()->cache->get('nordeaItems');
				if ($items===false) {
					$items = array();
					foreach ($searchStrings as $searchString) {
						echo 's';
						$d->get('http://service.nordea.com/nordea-openpages-ext2/branchlocator/geosearch.action?country=se&language=sv&term=' . rawurlencode($searchString) . '&type=all&exact=false');
						$body = $d->waitForElementUntilIsPresent(By::cssSelector('body'), 60);

						$response = json_decode($body->getText(), true);

						foreach ($response['result']['items'] as $item) {
							if ($test) {
								print_r($item['type']);
							}
							if (in_array('PERSONAL', $item['type'])) {
								$items[] = $item;
							} elseif (in_array('CORPORATE', $item['type'])) {
								$items[] = $item;
							}
						}
						if ($test && count($items) > 5) {
							break;
						}
					}
					Yii::app()->cache->set('nordeaItems', $items, 60*60*24);
				}

				foreach ($items as $item) {
					echo 'I';
					$name = 'Nordea';
					if (in_array('PERSONAL', $item['type']) && in_array('CORPORATE', $item['type'])) {
						$name .= ' Privat/Företag';
					} elseif (in_array('PERSONAL', $item['type'])) {
						$name .= ' Privat';
					} elseif (in_array('CORPORATE', $item['type'])) {
						$name .= ' Företag';
					} else {
						$problems[] = array('oväntad type', $item['type'], $item);
					}
					if (!empty($item['org']['name'])) {
						$name .= ', ' . $item['org']['name'];
					}
					$name .= ', ' . $item['adr']['region'] . ', ' . $item['adr']['street_address'];

					$address = $item['adr']['street_address'];
					$zipcode = $item['adr']['postal_code'];

					$postalCity = PostalCity::findOrCreate($item['adr']['region']);

					$phoneNumbers = array();
					foreach ($item['tel'] as $tel) {
						$pn = PhoneNumber::removeNonDigits($tel['value']);
						if (!empty($pn)) {
							$phoneNumbers[] = new PhoneNumber('insert', $pn);
						} else {
							//$problems[] = array('pn was empty', $item['tel'], $name, $item);
						}
					}

					if (count($item['opening_hours']) != 1) {
						throw new CException('opening hours count is not 1: ' . CVarDumper::dumpAsString($item['opening_hours']));
					}

					$openHourses = array();
					$days = explode(',', $item['opening_hours']['regular']);
					foreach ($days as $day) {
						$pieces = explode(':', $day);
						$oh = new OpenHours();
						$oh->name = $dayNumbers[$pieces[0]];
						if (count($pieces) == 3) {
							$oh->isClosed = 1;
						} elseif (count($pieces) == 5) {
							$oh->isClosed = 0;
							$oh->openAt = $pieces[1] . ':' . $pieces[2] . ':00';
							$oh->closeAt = $pieces[3] . ':' . $pieces[4] . ':00';
						} else {
							$problems[] = array('antal pieces var varken 5 eller 3', $day, $name);
							continue;
						}
						$openHourses[] = $oh;
					}
					$location = new Location();
					$location->name = $name;
					$location->address = $address;
					$location->zipcode = $zipcode;
					$location->setPostalCity($postalCity);
					$location->chainId = $chain->id;
					foreach ($phoneNumbers as $pn) {
						$location->addPhoneNumber($pn);
					}
					foreach ($openHourses as $oh) {
						$location->addOpenHours($oh);
					}

					$location->saveOrUpdate();
				}
				print_r($problems);
			} catch (Exception $e) {
				print_r($problems);
				throw $e;
			}
		}
	}