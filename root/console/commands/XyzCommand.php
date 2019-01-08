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
	class XyzCommand extends CConsoleCommand {
		/** @var WebDriver */
		protected $driver;

		/** @var string */
		public $browser = "chrome";

		public function init() {
			$desiredCapabilities = new DesiredCapabilities($this->browser);
			$this->driver = new WebDriver($desiredCapabilities);
		}

		public function actionSwedbank() {
			$problems = array();
			try {
				$d = $this->driver;

				$sourceGroup = SourceGroup::getByNameOrCreateNew('Swedbank');

				$chain = Chain::newIfNotExists('Swedbank');

				$d->get('http://www.swedbank.se/privat/kontakta-oss/hitta-ditt-bankkontor/index.htm');
				$popupA = $d->waitForElementUntilIsPresent(By::cssSelector('.ajax[title="Öppnas i lager över"]'), 60);
				$popupA->click();
				$d->waitForElementUntilIsPresent(By::cssSelector('#docplace table.table0.horisontal'));
				/** @var WebElement[] $as  */
				$as = $d->findElements(By::cssSelector('#docplace table.table0.horisontal a'));

				if (empty($as)) {
					echo PHP_EOL . 'wtf, no as?' . PHP_EOL;
				} else {
					echo PHP_EOL . 'found ' . count($as) . ' as.' . PHP_EOL;
				}
				$urls = array();

				$countAs = count($as);
				echo 'urls>';
				foreach ($as as $i => $a) {
					echo '.';

					if ($a->getText() == 'Till toppen') {
						continue;
					}
					$url = $a->getAttribute('href');
					if ($a->getAttribute('target') == '_blank') {
						//$problems[] = array('url är extern..', $url);
						continue;
					}
					if (isset($url) && !empty($url)) {
						if (!isset($urls[$a->getText()])) {
							$urls[$a->getText()] = trim($a->getAttribute('href'));
						} else {
							$problems[] = array('duplicate name', $urls[$a->getText()], $a->getText());
							$urls['*'.$a->getText()] = trim($a->getAttribute('href'));
						}
					}
					/*if (count($urls) > 10) {
						break;
					}*/
				}
				echo '<urlsdone>';

				foreach ($urls as $name => $url) {
					echo '*';
					$d->get($url);
					$introContainer = $d->waitForElementUntilIsPresent(By::cssSelector('.container.intro'), 60);

					$infoParams = array();

					$infoParams['introduction'] = null;

					try {
						/** @var WebElement $leadP  */
						$leadP = $introContainer->findElement(By::cssSelector('p.lead'));
						$lead = trim($leadP->getText());
						if (!empty($lead)) {
							$infoParams['introduction'] = $lead;
						}
					} catch (SeleniumClient\Http\SeleniumNoSuchElementException $e) {
					}

					try {
						/** @var WebElement $introTextDiv  */
						$introTextDiv = $introContainer->findElement(By::cssSelector('div.fck'));
						$introText = trim($introTextDiv->getText());
						if (!empty($introText)) {
							if (!empty($infoParams['introduction'])) {
								$infoParams['introduction'] .= "\n\n" . $introText;
							} else {
								$infoParams['introduction'] = $introText;
							}
						}
					} catch (SeleniumClient\Http\SeleniumNoSuchElementException $e) {
					}

					/** @var WebElement[] $tds  */
					$tds = $d->findElements(By::cssSelector('.col2right td[width="40%"],.col2right td[width="60%"]'));


					foreach ($tds as $i => $td) {
						if ($td->getAttribute('width') == '40%') {
							$label = trim($td->getText());
							$value = trim($tds[$i + 1]->getText());
							if ($td->getAttribute('rowspan') == 2) {
								$value = array(trim($value), trim($tds[$i + 2]->getText()));
							}
							$infoParams[$label] = $value;
						} else {
							continue;
						}
					}
					//print_r($infoParams);
					/* Array
							 (
								 [introduction] => Välkommen till oss i Angereds centrum.

							 Vi erbjuder dig ett brett utbud av finansiella tjänster. Utöver de traditionella banktjänsterna ger vi dig juridisk rådgivning och möjlighet att köpa eller sälja fastigheter via Fastighetsbyrån. Dessutom erbjuder vi försäljning och förvärv av företag via vår Företagsförmedling.
							 Vi tror på kraften i ett lokalt engagemang och därför finns vi där du finns. Swedbanks 190-åriga fokus på lokala banktjänster har gett oss unika personliga relationer med både privatpersoner och företagare. Vår ambition är att förvalta detta långsiktiga engagemang och samtidigt tillföra ny energi i våra åtaganden. Kom gärna in på kontoret och berätta vad vi kan hjälpa just dig med.

							 Välkommen!
								 [Måndag] => 10:00 - 15:00
								 [Tisdag] => 10:00 - 15:00
								 [Onsdag] => 10:00 - 15:00
								 [Torsdag] => 10:00 - 18:00
								 [Fredag] => 10:00 - 15:00
								 [Besöksadress] => Angereds centrum, Angered
								 [Postadress] => Array
									 (
										 [0] => Box 5
										 [1] => 42421 Angered
									 )

								 [Telefonnummer] => 031-739 75 20
								 [Faxnummer] => 031-331 31 92
								 [Banknummer] =>
								 [Clearingnummer] => 81059
								 [Mer information] => Ingen kontanthantering på kontoret.
							 )

				 */

					$address = null;
					$postalCity = null;
					if (!isset($infoParams['Besöksadress'])) {
						$problems[] = array('besöksadress var inte satt.', $url);
						continue;
					} elseif (!is_array($infoParams['Besöksadress'])) {
						$addressPieces = explode(',', $infoParams['Besöksadress']);

						if (count($addressPieces) < 2) {
							$problems[] = array(
								'besöksadress gick inte att dela i två delar. u:' . $url,
								$infoParams['Besöksadress']
							);
						} else {
							$postalCity = trim(array_pop($addressPieces));

							$address = join(', ', $addressPieces);

							if (empty($address)) {
								$address = null;
							}
							if (empty($postalCity)) {
								$postalCity = null;
							} else {
								$postalCity = PostalCity::findOrCreate($postalCity);
							}
						}
					} else {
						$problems[] = array('besöksadress var array. url: ' . $url, $infoParams['Besöksadress']);
					}

					if ($address === null) {
						$problems[] = array('besöksadress var inte satt.', $url);
						continue;
					}
					$dupe = false;
					if ($name[0] == '*') {
						$name = mb_substr($name, 1);
						$dupe = true;
					}
					try {
						/** @var WebElement $nameh1 */
						$nameh1 = $introContainer->findElement(By::cssSelector('h1'));
						if (trim($nameh1->getText()) == 'Swedbank i ' . $name) {
							$name = 'Swedbank i ' . $name;
						} else {
							$name = $nameh1->getText() . ', ' . $name;
						}
						if ($dupe) {
							$name .= ', ' . $address;
						}
					} catch (SeleniumClient\Http\SeleniumNoSuchElementException $e) {
						$problems[] = array('ingen h1', $url);
						$name = $name . ', ' . $address;
					}

					$phoneNumber = null;
					if (isset($infoParams['Telefonnummer']) && !empty($infoParams['Telefonnummer'])) {
						if (is_array($infoParams['Telefonnummer'])) {
							$problems[] = array('telefonnummer var array u:' . $url, $infoParams['Telefonnummer']);
						} else {
							$phoneNumber = $infoParams['Telefonnummer'];
						}
					}

					/** @var OpenHours[] $openHourses  */
					$openHourses = array();
					foreach (array('Måndag', 'Tisdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lördag', 'Söndag') as $day) {
						if (isset($infoParams[$day]) &&
							!empty($infoParams[$day]) &&
							!preg_match('#stäng#ui', $infoParams[$day]) &&
							trim($infoParams[$day]) != '-'
						) {
							if (is_array($infoParams[$day])) {
								$problems[] = array($url, $day, 'öppettider var en array', $infoParams[$day]);
								continue;
							}

							$ohPieces = explode('-', $infoParams[$day]);
							if (count($ohPieces) != 2) {
								$problems[] = array(
									'öppettider för dag: ' . $day . ' gick inte att explodera. url: ' . $url,
									$infoParams[$day]
								);
								continue;
							}
							if (isset($openAt)) {
								unset($openAt);
							}
							if (isset($closeAt)) {
								unset($closeAt);
							}
							foreach ($ohPieces as $i => $p) {
								$p = trim($p);
								if (2 !== preg_match_all('#(\d\d)#', $p, $matches)) {
									$problems[] = array('felaktigt format på öppettid', $url, $day, $infoParams[$day]);
									continue 2;
								}
								if ($i == 0) {
									$openAt = $matches[0][0] . ':' . $matches[0][1] . ':00';
								} else {
									$closeAt = $matches[0][0] . ':' . $matches[0][1] . ':00';
								}

							}
							$openHours = new OpenHours();
							$openHours->isClosed = 0;
							$openHours->name = $day;
							$openHours->openAt = $openAt;
							$openHours->closeAt = $closeAt;
							$openHourses[] = $openHours;
						} else {
							$openHours = new OpenHours();
							$openHours->isClosed = 1;
							$openHours->name = $day;
							$openHourses[] = $openHours;
						}
					}


					$openHoursInformation = null;
					if (isset($infoParams['Mer information']) && !empty($infoParams['Mer information'])) {
						if (is_array($infoParams['Mer information'])) {
							$problems[] = array($url, 'mer information var en array', $infoParams['Mer information']);
						} else {
							$openHoursInformation = trim($infoParams['Mer information']);
						}
					}

					/* now we have name and url, so we can try to find an existing source (and from there a location) and if not, we can try to find an existing location. */
					/** @var Source $source  */
					$source = Source::model()->find(
						'sourceGroupId = :sourceGroupId AND url = :url', array(
																			  'sourceGroupId' => $sourceGroup->id,
																			  'url' => $url
																		 )
					);
					/** @var Location $location  */
					$location = Location::model()->find('name = :name', array('name' => $name));
					if ($source !== null && $location !== null) {
						if ($source->locationId != $location->id) {
							$problems[] = 'source and location found but mismatching. s: ' . $source->id . ' l: ' . $location->id;
							continue;
						}
					}
					if ($location === null) {
						if ($source instanceof Source && $source->location instanceof Location) {
							$location = $source->location;
						} else {
							$location = new Location();
						}
					}
					$location->name = $name;
					$location->address = $address;
					$location->chainId = $chain->id;
					$location->introduction = $infoParams['introduction'];
					$location->openHoursInformation = $openHoursInformation;

					$location->setPostalCity($postalCity);

					if (!is_null($phoneNumber)) {
						$pn = new PhoneNumber('insert', PhoneNumber::removeNonDigits($phoneNumber));
						$location->addPhoneNumber($pn);
					}

					foreach ($openHourses as $oh) {
						$location->addOpenHours($oh);
					}

					if (!$location->save()) {
						$problems[] = array(
							'kunde inte spara location.',
							$source->id,
							$url,
							$location->getErrors()
						);
					}

					if ($source === null) {
						$source = new Source();
						$source->sourceGroupId = $sourceGroup->id;
						$source->locationId = $location->id;
						$source->url = trim($url);
						if (!$source->save()) {
							$problems[] = array(
								'kunde inte spara source',
								$url,
								$location->id,
								$source->getErrors()
							);
						}
					}

				}
				print_r($problems);
				echo 'done..';
			} catch (Exception $e) {
				print_r($problems);
				throw $e;
			}

		}

		public function actionBolagetApi() {
			$xml = file_get_contents('http://www.systembolaget.se/Assortment.aspx?butikerombud=1');
			$xml = new SimpleXMLElement($xml);


			$sourceGroup = SourceGroup::model()->find('name = \'bolagetXML\'');
			if ($sourceGroup === null) {
				$sourceGroup = new SourceGroup();
				$sourceGroup->name = 'bolagetXML';
				$sourceGroup->save();
			}

			$problems = array();
			foreach ($xml->ButikOmbud as $butikOmbud) {
				if (!isset($butikOmbud->Oppettider) || empty($butikOmbud->Oppettider)) {
					continue;
				}
				/** @var Source $source  */
				$source = Source::model()->find(
					'url = :nr AND sourceGroupId = :sourceGroupId', array(
																		 'nr' => $butikOmbud->Nr,
																		 'sourceGroupId' => $sourceGroup->id
																	)
				);
				if ($source === null) {
					$name = 'Systembolaget ' . $butikOmbud->Address4 . ', ' . $butikOmbud->Address1;
					$name2 = 'Systembolaget ' . $butikOmbud->Address4 . ', ' . $butikOmbud->Namn . ', ' . $butikOmbud->Address1;
					$name = preg_replace('#  #', ' ', $name);
					$name2 = preg_replace('#  #', ' ', $name2);

					$locations = Location::model()->findAll(
						'name = :name OR name = :name2', array(
															  'name' => $name,
															  'name2' => $name2
														 )
					);
					if (empty($locations)) {
						$problems[] = array('kunde inte hitta location', $butikOmbud);
						continue;
					} elseif (count($locations) > 1) {
						$problems[] = array('hittade för många locations.', $butikOmbud);
						continue;
					} else {
						$location = $locations[0];
					}
				} else {
					$location = $source->location;
				}

				if (isset($butikOmbud->Telefon) && !empty($butikOmbud->Telefon)) {
					$location->addPhoneNumber(new PhoneNumber('insert', PhoneNumber::removeNonDigits($butikOmbud->Telefon)));

				}
				$rowsWithdateAndOpenHours = explode('_*', $butikOmbud->Oppettider);
				foreach ($rowsWithdateAndOpenHours as $row) {
					$dateAndInfo = explode(';', $row);
					$openHours = new OpenHours();
					// for Christmas etc
					$openHours->occasion = 'NA';
					 if(isset($dateAndInfo[6]) and $dateAndInfo[6]!=trim('-')) {
						$openHours->occasion = $dateAndInfo[6];
					}
					$openHours->isClosed = $dateAndInfo[5];
					$openHours->name = $dateAndInfo[0];
					$openHours->date = $dateAndInfo[0];
					$openHours->openAt = $openHours->isClosed ? null : $dateAndInfo[1] . ':00';
					$openHours->closeAt = $openHours->isClosed ? null : $dateAndInfo[2] . ':00';
					$openHours->locationId = $location->id;
					$ret = $openHours->saveOrUpdate();
					switch ($ret) {
						case 2:
							echo 'M';
							break;
						case 1:
							echo '+';
							break;
						case 0:
							echo '-';
							break;
					}
				}
			}
			print_r($problems);
			echo PHP_EOL . count($problems) . ' problem.' . PHP_EOL;
		}

		public function actionGetAddressFromHittaOppettider() {
			$d = $this->driver;


			/** @var SourceGroup $sourceGroup  */
			$sourceGroup = SourceGroup::model()->find('name = "hitta-oppettider"');

			$sources = $sourceGroup->sources;

			foreach ($sources as $source) {
				try {
					$location = $source->location;
					$d->get($source->url);

					$streetAddressSpan = $d->waitForElementUntilIsPresent(By::cssSelector('span.street-address'), 10);
					$address = trim($streetAddressSpan->getText());
					if (!empty($location->address) && $location->address != $address) {
						echo PHP_EOL . 'location: ' . $location->id . ' new address does not match old address: ' . $location->address . ' new: ' . $address . PHP_EOL;
					} else {
						$location->address = $address;
					}

					$zipcodeSpan = $d->findElement(By::cssSelector('span.postal-code'));
					$zipcode = preg_replace('#[^\d]#', '', $zipcodeSpan->getText());
					if (!empty($location->zipcode) && $location->zipcode != $zipcode) {
						echo PHP_EOL . 'location: ' . $location->id . ' new zipcode does not match old zipcode: ' . $location->zipcode . ' new: ' . $zipcode . PHP_EOL;
					} else {
						$location->zipcode = $zipcode;
					}

					$postalCitySpan = $d->findElement(By::cssSelector('span.locality'));
					$postalCityName = trim($postalCitySpan->getText());
					$postalCity = PostalCity::findOrCreate($postalCityName);
					if (!empty($location->postalCityId) && $location->postalCityId != $postalCity->id) {
						echo PHP_EOL . 'location: ' . $location->id . ' new postalCity does not match old postalCity: ' . $location->postalCityId . ' new: ' . $postalCity->id . PHP_EOL;
					} else {
						$location->postalCityId = $postalCity->id;
					}

					$phoneNumberSpan = $d->findElement(By::cssSelector('span.tel'));
					$location->addPhoneNumber($phoneNumberSpan->getText());

					if (!$location->save()) {
						echo PHP_EOL . 'problem saving location: ' . $location->id . ' errors: ' . CVarDumper::dumpAsString($location->getErrors());
					}
					echo '.';
				} catch (CException $e) {
					echo PHP_EOL . 'caught exception when working with source-id: ' . $source->id . ' exception-message: ' . $e->getMessage() . ' traceAsString: ' . $e->getTraceAsString() . PHP_EOL;
				}
			}

		}

		public function actionCheckBolaget() {
			/** @var Location[] $locations  */
			$locations = Location::model()->findAll(array('condition' => 'chainId = 37', 'order' => 'id'));
			$noBolaget = array();
			foreach ($locations as $l) {
				$hasBolaget = false;
				foreach ($l->sources as $source) {
					/** @var Source $source */
					if ($source->sourceGroup->name == 'systembolaget') {
						$hasBolaget = true;
						continue;
					}
				}
				if (!$hasBolaget) {
					$noBolaget[] = $l->id;
				}
			}
			print_r($noBolaget);
			$this->driver->quit();
		}

		public function actionBolagetDuplicates() {
			/** @var Location[] $locations  */
			$locations = Location::model()->findAll(array('condition' => 'chainId = 37', 'order' => 'name'));

			foreach ($locations as $l) {
				if (empty($l->sources)) {
					throw new CException('empty sources?: ' . CVarDumper::dumpAsString($l));
				}

				$hasBolaget = false;
				foreach ($l->sources as $source) {
					/** @var Source $source */
					if ($source->sourceGroup->name == 'systembolaget') {
						$hasBolaget = true;
						continue;
					}
				}
				if (!$hasBolaget) {
					$toBeDeletedNamePieces = explode(',', $l->name);
					$expectedCount = 2;
					if ($l->id == 1796) {
						$expectedCount = 3;
					}
					if (count($toBeDeletedNamePieces) != $expectedCount) {
						throw new CException('count is messed up when exploding name locId: ' . $l->id);
					}
					$possibleRealLocs = Location::model()->findAll(
						'id <> :id AND name like :name', array(
															  'id' => $l->id,
															  'name' => trim($toBeDeletedNamePieces[0]) . '%' . trim(end($toBeDeletedNamePieces))
														 )
					);
					if (count($possibleRealLocs) != 1) {
						throw new CException('couldnt find the real one: ' . CVarDumper::dumpAsString($toBeDeletedNamePieces) . CVarDumper::dumpAsString($possibleRealLocs) . CVarDumper::dumpAsString($l));
					}
					$realLoc = $possibleRealLocs[0];
					foreach ($l->sources as $s) {
						/** @var Source $s */
						$s->locationId = $realLoc->id;
						if (!$s->save()) {
							throw new CException('couldnt save source: ' . CVarDumper::dumpAsString($s->getErrors()) . CVarDumper::dumpAsString($l));
						}
					}
					if (!$l->delete()) {
						throw new CException('couldnt delete' . CVarDumper::dumpAsString($l) . CVarDumper::dumpAsString($l->getErrors()));
					}
				}
			}

		}

		public function actionMoveSourcesFromLocations() {

			/** @var Location[]|null $locations  */
			$locations = Location::model()->findAll();
			$count = 0;
			foreach ($locations as $l) {
				if (!empty($l->sources)) {
					continue;
				}
				$source = new Source;
				$source->locationId = $l->id;
				$source->url = $l->sourceUrl;
				if (!$source->save()) {
					throw new CException('wtf couldnt save source: ' . CVarDumper::dumpAsString($source->getErrors()));
				}
				$count++;
			}
			echo PHP_EOL . 'moved ' . $count . ' sources!' . PHP_EOL;
		}

		public function actionBolagetLocations() {
			$d = $this->driver;

			$url = 'http://www.systembolaget.se/Butik--Ombud/?hitsoffset=0&page=1&ny=True';
			$d->get($url);

			/** @var Chain|null $chain */
			$chain = Chain::model()->find('name = "Systembolaget"');

			$clickNext = function(WebDriver $d, $url) {
				/** @var WebElement $nextBtn */
				$nextBtn = $d->waitForElementUntilIsPresent(By::cssSelector('#resultListPaginationNext a', 10));

				if ($url == trim($nextBtn->getAttribute('href'))) {
					return false;
				}

				$d->get(trim($nextBtn->getAttribute('href')));

				return true;
			};

			do {
				/** @var WebElement[] $locationAs  */
				$locationAs = $d->findElements(By::cssSelector('#vendorSearchResultsTable tbody a'));
				foreach ($locationAs as $a) {
					$location = new Location;
					$location->chainId = $chain->id;

					$fullText = trim($a->getText());
					$em = $a->findElement(By::cssSelector('em'));
					$emText = trim($em->getText());
					$fullTextMinusEm = preg_replace('#' . addslashes($emText) . '$#', '', $fullText);

					$location->name = preg_replace("#\r|\n#", '', 'Systembolaget ' . $emText . ', ' . $fullTextMinusEm);

					$location = $location->saveIfNotExists();
					$location->addSource($a->getAttribute('href'));
				}
			} while ($clickNext($d, $url));
			$d->quit();
		}

		public function actionBolagetOpenHours() {
			/** @var Source[] $sources  */
			$sources = Source::model()->with('sourceGroup')->findAll('sourceGroup.name = "systembolaget"');

			$d = $this->driver;

			foreach ($sources as $s) {

				try {

					$d->get($s->url);
					try {
						$showMoreA = $d->waitForElementUntilIsPresent(By::cssSelector('#vendorOpeningHours tfoot a'), 60);
						$showMoreA->click();
						$d->waitForElementUntilIsPresent(By::cssSelector('#vendorOpeningHours tfoot a.minus'), 60);
					} catch (WebDriverWaitTimeoutException $e) {
						echo PHP_EOL . 'caught timeout exception..retrying once..' . PHP_EOL;
						$d->quit();
						$desiredCapabilities = new DesiredCapabilities($this->browser);
						$d = new WebDriver($desiredCapabilities);
						$d->get($s->url);
						$showMoreA = $d->waitForElementUntilIsPresent(By::cssSelector('#vendorOpeningHours tfoot a'), 60);
						$showMoreA->click();
						$d->waitForElementUntilIsPresent(By::cssSelector('#vendorOpeningHours tfoot a.minus'), 60);
					}

					/** @var WebElement[] $trs  */
					$trs = $d->findElements(By::cssSelector('#vendorOpeningHours tbody tr'));
					echo PHP_EOL . 'found ' . count($trs) . ' trs' . PHP_EOL;
					$day = null;

					if (count($trs) != 22) {
						throw new CException('not 22 trs.. weird...sid: ' . $s->id);
					}
					foreach ($trs as $tr) {
						if ($tr->getAttribute('class') == 'subHeader') {
							echo PHP_EOL . 'found subheader. continuing.' . PHP_EOL;
							continue;
						}
						$tds = $tr->findElements(By::cssSelector('td'));
						$rawDayText = trim($tds[0]->getText());
						$rawOpenHoursText = trim($tds[1]->getText());
						if (mb_strtolower($rawDayText) === 'i dag') {
							$day = new DateTime();
						} elseif ($day instanceof DateTime) {
							$day->modify('tomorrow');
						} else {
							throw new CException('something weird going on..' . $rawDayText . '::' . $s->id);
						}

						$closed = 0;
						$openAt = null;
						$closeAt = null;

						if (mb_strtolower($rawOpenHoursText) === 'stängt') {
							$closed = 1;
						} else {
							$openHoursPieces = explode('-', $rawOpenHoursText);
							if (count($openHoursPieces) != 2) {
								throw new CException('failed exploding openHours..' . $rawOpenHoursText . ' s-id:' . $s->id);
							}

							foreach ($openHoursPieces as $k => $piece) {
								trim($piece);
								$minuteHourPieces = explode(':', $piece);
								if (count($minuteHourPieces) != 2) {
									throw new CException('failed exploding minutes/hours: ' . $rawOpenHoursText . ' s-id:' . $s->id);
								}

								foreach ($minuteHourPieces as &$mhPiece) {
									$mhPiece = trim($mhPiece);
									if (!is_numeric($mhPiece) || mb_strlen($mhPiece) > 2) {
										throw new CException('mhPiece is not numeric/or too long: ' . mb_strlen($mhPiece) . ' ' . is_numeric($mhPiece) . ' ' . $mhPiece . ' ' . $rawOpenHoursText . ' s-id:' . $s->id);
									}
									$mhPiece = (mb_strlen($mhPiece) == 1) ? '0' . $mhPiece : $mhPiece;
								}
								if ($k == 0) {
									$openAt = join(':', $minuteHourPieces) . ':00';
								} elseif ($k == 1) {
									$closeAt = join(':', $minuteHourPieces) . ':00';
								} else {
									throw new CException('wtf is going on ' . $rawOpenHoursText . ' s-id:' . $s->id);
								}
							}
						}

						$openHours = new OpenHours();
						$openHours->isClosed = $closed;
						$openHours->name = $day->format('Y-m-d');
						$openHours->date = $day->format('Y-m-d');
						$openHours->openAt = $openAt;
						$openHours->closeAt = $closeAt;
						$openHours->locationId = $s->locationId;
						$openHours->saveOrUpdate();
					}
				} catch (Exception $e) {
					echo PHP_EOL . 'caught exception with message: ' . $e->getMessage() . PHP_EOL;
					echo PHP_EOL . 'sourceId: ' . $s->id . PHP_EOL;
					throw $e;
				}
			}

			$d->quit();
		}

		public function actionJugge() {
			$d = $this->driver;
			$d->get('http://hitta-oppettider.se');

			/** @var Location[] $locations  */
			$locations = Location::model()->findAll('id > 0');
			$problems = array();
			foreach ($locations as $loc) {
				if (!empty($loc->openHours)) {
					continue;
				}
				$d->get($loc->sourceUrl);

				$lis = $d->findElements(By::cssSelector('ul.opening-hours li'));

				foreach ($lis as $li) {
					$o = OpenHours::newIfNotExists($loc, $li);
					if (!$o instanceof OpenHours) {
						$problems[] = $o;
					}
				}
			}

			$d->quit();
			sleep(10);
			echo PHP_EOL . PHP_EOL;
			print_r($problems);
		}

		public function actionIndex() {


			$warnings = array();
			$d = $this->driver;
			$d->get('http://hitta-oppettider.se');

			$listings = $d->findElements(By::cssSelector('ul.listing'));
			assert(count($listings) == 2);

			/** @var WebElement[] $lis  */
			$lis = $listings[0]->findElements(By::cssSelector('li'));

			$chainLocationsUrls = array();
			$chains = array();
			foreach ($lis as $li) {
				$as = $li->findElements(By::cssSelector('a'));
				$chain = Chain::newIfNotExists($as[0]->getText());
				$chainLocationsUrls[$chain->id] = $as[0]->getAttribute('href');
				$chains[$chain->id] = $chain;
				if (count($as) > 1) {
					for ($i = 1; $i < count($as); $i++) {
						$childChain = Chain::newIfNotExists($as[$i]->getText(), $chain);
						$chainLocationsUrls[$childChain->id] = $as[$i]->getAttribute('href');
						$chains[$chain->id] = $childChain;
					}
				}
			}

			/** @var WebElement[] $as  */
			$as = $listings[1]->findElements(By::cssSelector('a'));

			$malls = array();
			$mallLocationsUrls = array();
			foreach ($as as $a) {
				$mall = Mall::newIfNotExists($a->getText());
				$malls[$mall->id] = $mall;
				$mallLocationsUrls[$mall->id] = $a->getAttribute('href');
			}

			if (empty($chainLocationsUrls)) {
				throw new CException('chainLocationsUrls was empty..something wrong here..');
			}

			if (empty($chains)) {
				throw new CException('chains was empty..something wrong here..');
			}

			$locations = array();
			foreach ($chainLocationsUrls as $chainId => $url) {
				$d->get($url);
				$listings = $d->findElements(By::cssSelector('ul.listing'));
				if (count($listings) != 1) {
					$warnings[] = 'found ' . count($listings) . 'ul.listing for url: ' . $url;
					continue; /* n00bs */
				}
				$as = $listings[0]->findElements(By::cssSelector('a'));

				foreach ($as as $a) {
					$location = Location::newIfNotExists($a->getText(), $a->getAttribute('href'), $chains[$chainId]);
					$locations[$location->id] = $location;
					$chainLocationUrls[$location->id] = $a->getAttribute('href');
				}
			}

			if (empty($mallLocationsUrls)) {
				throw new CException('mallLocationsUrls was empty..something wrong here..');
			}

			if (empty($malls)) {
				throw new CException('malls was empty..something wrong here..');
			}

			foreach ($mallLocationsUrls as $mallId => $url) {
				$d->get($url);
				$listings = $d->findElements(By::cssSelector('ul.listing'));
				if (count($listings) != 1) {
					$warnings[] = 'found ' . count($listings) . ' ul.listing for url: ' . $url;
					continue;
				}
				$as = $listings[0]->findElements(By::cssSelector('a'));

				foreach ($as as $a) {
					$location = Location::newIfNotExists($a->getText(), $a->getAttribute('href'), $malls[$mallId]);
					$locations[$location->id] = $location;
					$mallLocationUrls[$location->id] = $a->getAttribute('href');
				}
			}
			$d->quit();

			if (empty($mallLocationUrls)) {
				throw new CException('mallLocationUrls was empty..something wrong here..');
			}

			if (empty($chainLocationUrls)) {
				throw new CException('chainLocationUrls was empty..something wrong here..');
			}

			if (empty($locations)) {
				throw new CException('locations was empty..something wrong here..');
			}

			$locationUrls = $mallLocationUrls + $chainLocationUrls;

			foreach ($locationUrls as $url) {
				try {
					$d->get($url);
				} catch (Exception $e) {
					echo PHP_EOL . $url . PHP_EOL;
					throw $e;
				}
			}

			sleep(5);

			print_r($warnings);
		}
	}