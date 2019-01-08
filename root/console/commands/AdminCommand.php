<?php


	class AdminCommand extends CConsoleCommand {
		public function actionAddAdminUser($username, $password) {
			$user = new AdminUser();
			$user->username = $username;
			$user->password = Common::encryptPassword($password);
			if (!$user->save()) {
				throw new CException(CVarDumper::dumpAsString($user->getErrors()));
			}
		}

		public function actionCrypt($str) {
			echo Common::encryptPassword($str);
		}

		public function actionChangePassword($username, $password) {
			$user = AdminUser::model()->find('username = :username', array('username' => $username));
			$user->password = Common::encryptPassword($password);
			if (!$user->save()) {
				throw new CException(CVarDumper::dumpAsString($user->getErrors()));
			}
		}

		public function actionSitemapXML($filename = 'sitemap.xml') {
			foreach(array('www','mobil') as $prefix) {

				if ($prefix == 'www') {
					$sitemap = new SimpleXMLElement('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>');
				} elseif ($prefix == 'mobil') {
					$sitemap = new SimpleXMLElement('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0"></urlset>');
					$sitemap->registerXPathNamespace('mobile', "http://www.google.com/schemas/sitemap-mobile/1.0");
				} else {
					throw new CException('wth is you doin?');
				}

				$urls = array();
				$urls[] = 'http://'.$prefix.'.oppettidr.se';
				$urls[] = 'http://'.$prefix.'.oppettidr.se/kedjor';
				$urls[] = 'http://'.$prefix.'.oppettidr.se/' . rawurlencode('köpcentrum');

				/** @var Mall[] $malls  */
				$malls = Mall::model()->findAll();
				foreach($malls as $mall) {
					$urls[] = 'http://'.$prefix.'.oppettidr.se/' . rawurlencode('köpcentrum'). '/' . rawurlencode($mall->nameSlug);
				}

				/** @var Chain[] $chains  */
				$chains = Chain::model()->findAll();
				foreach($chains as $chain) {
					$urls[] = 'http://'.$prefix.'.oppettidr.se/' . rawurlencode('kedja'). '/' . rawurlencode($chain->nameSlug);
				}

				/** @var Location[] $locations  */
				$locations = Location::model()->findAll();
				foreach($locations as $location) {
					$urls[] = 'http://'.$prefix.'.oppettidr.se/' . rawurlencode('butik') . '/' . rawurlencode($location->nameSlug);
				}

				foreach($urls as $loc) {
					$url = $sitemap->addChild('url');
					$url->addChild('loc', $loc);
					if ($prefix == 'mobil') {
						$url->addChild('mobile', null, "http://www.google.com/schemas/sitemap-mobile/1.0");
					}
					echo PHP_EOL . 'added: ' . $loc;
				}

				$sitemap->saveXML($prefix.'.'.$filename);
				echo PHP_EOL . 'complete! added ' . count($urls) . ' urls.' . PHP_EOL;
			}
		}

		public function actionSitemapSwedbankNordeaXML($filename = 'sitemap-swedbank-nordea.xml') {
			$sitemap = new SimpleXMLElement('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>');

			$urls = array();

			/** @var Location[] $locations  */
			$locations = Location::model()->findAll('chainId = 42 OR chainId = 43');
			foreach($locations as $location) {
				$urls[] = 'http://www.oppettidr.se/' . rawurlencode('butik') . '/' . rawurlencode($location->nameSlug);
			}

			foreach($urls as $loc) {
				$url = $sitemap->addChild('url');
				$url->addChild('loc', $loc);
				echo PHP_EOL . 'added: ' . $loc;
			}

			$sitemap->saveXML($filename);
			echo PHP_EOL . 'complete! added ' . count($urls) . ' urls.' . PHP_EOL;
		}

		public function actionSitemapNordeaXML($filename = 'sitemap-nordea.xml') {
			$sitemap = new SimpleXMLElement('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>');

			$urls = array();

			/** @var Location[] $locations  */
			$locations = Location::model()->findAll('chainId = 42');
			foreach($locations as $location) {
				$urls[] = 'http://www.oppettidr.se/' . rawurlencode('butik') . '/' . rawurlencode($location->nameSlug);
			}

			foreach($urls as $loc) {
				$url = $sitemap->addChild('url');
				$url->addChild('loc', $loc);
				echo PHP_EOL . 'added: ' . $loc;
			}

			$sitemap->saveXML($filename);
			echo PHP_EOL . 'complete! added ' . count($urls) . ' urls.' . PHP_EOL;
		}

		public function actionDeleteChain($chain) {
			$chain = Chain::model()->find('name = :name', array('name' => $chain));
			$chain->delete();
		}
	}