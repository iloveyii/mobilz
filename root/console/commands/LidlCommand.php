<?php
	require_once(__DIR__ . '/../../common/lib/Nearsoft-PHP-SeleniumClient-bab8290/SeleniumClient/WebDriverWait.php');
	require_once(__DIR__ . '/../../common/lib/Nearsoft-PHP-SeleniumClient-bab8290/SeleniumClient/WebDriver.php');
	require_once(__DIR__ . '/../../common/lib/Nearsoft-PHP-SeleniumClient-bab8290/SeleniumClient/Http/Exceptions.php');

	use SeleniumClient\WebDriver;
	use SeleniumClient\DesiredCapabilities;
	use SeleniumClient\By;
	use SeleniumClient\WebElement;
	use SeleniumClient\WebDriverWait;
	use SeleniumClient\WebDriverWaitTimeoutException;
	use SeleniumClient\Http\SeleniumNoSuchElementException;

	/**
	 * @property WebDriver $driver
	 */
	class LidlCommand extends CConsoleCommand {
		/** @var WebDriver */
		protected $driver;

		/** @var string */
		public $browser = "chrome";

		public function init() {
			$desiredCapabilities = new DesiredCapabilities($this->browser);
			$this->driver = new WebDriver($desiredCapabilities);
		}

		public function actionIndex() {
			$problems = array();
			try {
				$d = $this->driver;

				$chain = Chain::newIfNotExists('Lidl');

				/** @var PostalCity[] $postalCities  */
				$postalCities = PostalCity::model()->findAll(array('order' => 'name'));


				$dayMappings = array(
					'Måndag' => 'mf',
					'Tisdag' => 'mf',
					'Onsdag' => 'mf',
					'Torsdag' => 'mf',
					'Fredag' => 'mf',
					'Lördag' => 'l',
					'Söndag' => 's',
				);

				foreach($postalCities as $postalCity) {
					echo $postalCity->name;
					$d->get('http://213.144.6.110/lidl/searchAddressSe.do?SO=&STO=&SP=&BURL=http://www.lidl.se:80/cps/rde/xchg/lidl_se/hs.xsl/13033.htm%3Fdp=1&variablesback=zipcode%3Bid%3Bcity%3Bstreet%3Bvt&SEARCH=TRUE');
					$input = $d->waitForElementUntilIsPresent(By::cssSelector('[name=city]'), 60);

					$input->sendKeys($postalCity->name);

					$submitImage = $d->waitForElementUntilIsPresent(By::cssSelector('input[type=image]'));
					$submitImage->click();

					$errorSpan = null;
					try {
						$errorSpan = $d->findElement(By::cssSelector('span.error'));
						if ($errorSpan !== null && preg_match('#^Adressen kunde inte bearbetas#', $errorSpan->getText())) {
							$problems[] = array('got span.error', $postalCity->name);
							continue;
						}
					} catch (SeleniumNoSuchElementException $e) {}

					try {
						$innerTable = $d->findElement(By::cssSelector('table table table'));
					} catch (SeleniumNoSuchElementException $e) {
						$submitImage = $d->waitForElementUntilIsPresent(By::cssSelector('input[type=image]'), 60);
						$submitImage->click();
						$innerTable = $d->waitForElementUntilIsPresent(By::cssSelector('table table table'), 60);
					}

					$innerTable = $innerTable->getText();
					/**
					Hantverkaregatan 13
					734 30 Hallstahammar

					Region 2 Avstånd: 17.7 km karta
					Företag Öppettider:
					må-fr 9-20 lö 9-18 sö 10-16
					 */
					$regionCount = preg_match_all('#Region\ \d+#muU', $innerTable, $matches);
					$matchCount = preg_match_all(
						'#\ \ (?<address>.*)\n(?<zipcode>\d\d\d\ \d\d)\ (?<postalCity>.*)\n\nRegion\ \d+.*\n.*Öppettider\:\nmå-fr\ (?<mfo>\d+)-(?<mfc>\d+)\ lö\ (?<lo>\d+)-(?<lc>\d+)\ sö\ (?<so>\d+)-(?<sc>\d+)#umU',
						$innerTable, $matches, PREG_SET_ORDER
					);

					if ($regionCount != $matchCount) {
						$problems[] = array('regioncount and matchcount did not match.', $regionCount, $matchCount, $postalCity->name, $matches);
					}

					foreach($matches as $match) {
						$location = new Location();
						$location->name = "Lidl " . $match['postalCity'] . ' ' . $match['address'];
						$location->address = $match['address'];
						$location->zipcode = $match['zipcode'];
						$location->setPostalCity(PostalCity::findOrCreate($match['postalCity']));
						$location->chainId = $chain->id;

						$location->addPhoneNumber(new PhoneNumber('insert', '0855557000'));

						foreach($dayMappings as $dayName => $source) {
							$oh = new OpenHours();
							$oh->name = $dayName;
							$oh->isClosed = 0;
							$openSource = $source.'o';
							$closeSource = $source.'c';
							$oh->openAt = str_pad($match[$openSource], 2, '0', STR_PAD_LEFT) . ':00:00';

							if (strlen($match[$closeSource]) == 1) { // they fucking write 1 for 13...
								$match[$closeSource] += 12;
							}
							$oh->closeAt = $match[$closeSource] . ':00:00';
							$location->addOpenHours($oh);
						}
						$location->saveOrUpdate();
						echo 'i';
					}
					echo 'p';
				}
			} catch (Exception $e) {
				print_r($problems);
				throw $e;
			}
			print_r($problems);
		}
	}