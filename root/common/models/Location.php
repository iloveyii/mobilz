<?php

Yii::import('root.common.models._base.BaseLocation');

class Location extends BaseLocation
{
	public static function model($className=__CLASS__) {
		return parent::model($className);
	}

        public function relations() {
                return array(
                        'chain' => array(self::BELONGS_TO, 'Chain', 'chainId'),
                        'county' => array(self::BELONGS_TO, 'County', 'countyId'),
                        'postalCity' => array(self::BELONGS_TO, 'PostalCity', 'postalCityId'),
                        'seo' => array(self::BELONGS_TO, 'Seo', 'seoId'),
                        'mall' => array(self::BELONGS_TO, 'Mall', 'mallId'),
                        'openHours' => array(self::HAS_MANY, 'OpenHours', 'locationId', 'order' => 'openHours.`date`'),
                        'phoneNumbers' => array(self::HAS_MANY, 'PhoneNumber', 'locationId'),
                        'sources' => array(self::HAS_MANY, 'Source', 'locationId'),
                );
        }


	public function rules() {
		return array(
			array('name, nameSlug', 'unique', 'allowEmpty' => false),
			array('zipcode', 'numerical', 'integerOnly'=>true),
			array('zipcode', 'length', 'min' => 5, 'max' => 5),
			array('name, nameSlug', 'length', 'max'=>255),
			array('chainId', 'exist', 'className' => 'Chain', 'attributeName' => 'id'),
			array('mallId', 'exist', 'className' => 'Mall', 'attributeName' => 'id'),
			array('seoId', 'exist', 'className' => 'Seo', 'attributeName' => 'id'),
			array('countyId', 'exist', 'className' => 'County', 'attributeName' => 'id'),
			array('postalCityId', 'exist', 'className' => 'PostalCity', 'attributeName' => 'id'),
			array('address', 'length', 'min' => 5, 'max'=>200),
			array('chainId, mallId, seoId, address, zipcode, countyId, postalCityId', 'default', 'setOnEmpty' => true, 'value' => null),
			array('id, name, nameSlug, chainId, mallId, seoId, address, zipcode, countyId, postalCityId', 'safe', 'on'=>'search'),
		);
	}

	/**
	 * @static
	 *
	 * @param string $name
	 * @param Mall|Chain $obj
	 *
	 * @return CActiveRecord|Location
	 * @throws CException
	 */
	public static function newIfNotExists($name, $url, $obj) {
		assert(is_string($name));

		$chainId = null;
		$mallId = null;
		if ($obj instanceof Mall) {
			$mallId = $obj->id;
		} elseif ($obj instanceof Chain) {
			$chainId = $obj->id;
		} else {
			throw new CException('obj-parameter needs to be a Chain or a Mall');
		}

		$location = Location::model()->find('name = :name', array(':name' => $name));

		if (is_null($location)) {
			$location = new Location();
			$location->name = $name;
			$location->chainId = $chainId;
			$location->mallId = $mallId;


			if (!$location->save()) {
				throw new CException('failed saving Location: '.CVarDumper::dumpAsString($location->getErrors()));
			}
		}

		if ($location->mallId === null && $mallId !== null) {
			$location->mallId = $mallId;
			if (!$location->save()) {
				throw new CException('failed saving Location when fixing mallId: '.CVarDumper::dumpAsString($location->getErrors()));
			}
		}
		if ($location->chainId === null && $chainId !== null) {
			$location->chainId = $chainId;
			if (!$location->save()) {
				throw new CException('failed saving Location when fixing chainId: '.CVarDumper::dumpAsString($location->getErrors()));
			}
		}

		if ($location->sourceUrl === null) {
			$location->sourceUrl = $url;
			if (!$location->save()) {
				throw new CException('failed saving Location when fixing sourceUrl: '.CVarDumper::dumpAsString($location->getErrors()));
			}
		}
		return $location;
	}

	public function saveIfNotExists() {
		$exists = Location::find('name = :name', array('name' => $this->name));
		if ($exists !== null) {
			return $exists;
		}

		if (!$this->save()) {
			throw new CHttpException(500, 'gick inte att spara location: ' . CVarDumper::dumpAsString($this->getErrors()) . CVarDumper::dumpAsString($this));
		}
		return $this;
	}

	public function addSource($url) {
		foreach($this->sources as $source) {
			if ($source->url == $url) {
				return $source;
			}
		}
		$source = new Source();
		$source->url = $url;
		$source->locationId = $this->id;
		if (!$source->save()) {
			throw new CException('couldnt save source: ' . CVarDumper::dumpAsString($source->getErrors()));
		}
		$this->sources = array_merge($this->sources, array($source));
		return $source;
	}

	public function beforeValidate() {
		if (!parent::beforeValidate()) {
			return false;
		}
		$this->nameSlug = Common::createSlug($this->name);

		$this->zipcode = preg_replace('#[^\d]#', '', $this->zipcode);
		return true;
	}

	public function magicReplace($str) {
		$str = preg_replace('#\$location\$#u', $this->name, $str);
		$str = preg_replace('#\$locationslug\$#u', $this->nameSlug, $str);

		if ($this->chain !== null) {
			$str = $this->chain->magicReplace($str);
		} else {
			$str = preg_replace('#\$chain\$#u', $this->name, $str);
			$str = preg_replace('#\$chainslug\$#u', $this->nameSlug, $str);
		}

		if (preg_match('#\$#', $str)) {
			throw new CHttpException(500, 'ogiltig variabel hittad i location:id: ' . $this->id . ' str: ' . $str);
		}
		return $str;
	}

	public function addPhoneNumber(PhoneNumber $phoneNumber) {
		if ($this->isNewRecord) {
			$existingPhoneNumbers = $this->phoneNumbers;
			$existingPhoneNumbers[] = $phoneNumber;
			$this->phoneNumbers = $existingPhoneNumbers;
		} else {
			$phoneNumber->locationId = $this->id;
			$phoneNumber->saveOrUpdate();
		}


	}

	public function addOpenHours(OpenHours $openHours) {
		if ($this->isNewRecord) {
			$existingOpenHours = $this->openHours;
			$existingOpenHours[] = $openHours;
			$this->openHours = $existingOpenHours;
		} else {
			$openHours->locationId = $this->id;
			$openHours->saveOrUpdate();
		}
	}
	/**
	 * @param PostalCity $postalCity
	 */
	public function setPostalCity(PostalCity $postalCity = null) {
		if (is_null($postalCity)) {
			$this->postalCityId = null;
		} else {
			if ($postalCity->isNewRecord) {
				if (!$postalCity->save()) {
					throw new CException('could not save postal city' . CVarDumper::dumpAsString($postalCity->getErrors()));
				}
			}
			$this->postalCityId = $postalCity->id;
		}
	}

	public function saveOrUpdate() {
		if (!$this->isNewRecord) {
			throw new CException('cannot call this one for existing records yet.');
		} else {
			/** @var Location $location  */
			$location = Location::model()->find('name = :name', array('name' => $this->name));

			if ($location instanceof Location) {
				$location->zipcode = $this->zipcode;
				$location->address = $this->address;
				$location->chainId = $this->chainId;
				$location->postalCityId = $this->postalCityId;
				$location->countyId = $this->countyId;
				$location->introduction = $this->introduction;
				$location->openHoursInformation = $this->openHoursInformation;
				$location->mallId = $this->mallId;
				foreach($this->phoneNumbers as $phoneNumber) {
					$location->addPhoneNumber($phoneNumber);
				}
				foreach($this->openHours as $openHours) {
					$location->addOpenHours($openHours);
				}
				if(!$location->save()) {
					throw new CException('failed saving location l-id: ' . $location->id . ' errors: ' . CVarDumper::dumpAsString($location->getErrors()));
				}
			} else {
				if (!$this->save()) {
					throw new CException('kunde inte spara loc name: ' . $this->name . ' errors: '. CVarDumper::dumpAsString($this->errors));
				}
			}
		}
	}

	public function afterSave() {
		parent::afterSave();
		foreach($this->phoneNumbers as $pn) {
			$pn->locationId = $this->id;
			$pn->saveOrUpdate();
		}
		foreach($this->openHours as $oh) {
			$oh->locationId = $this->id;
			$oh->saveOrUpdate();
		}
	}

	public function beforeDelete() {
		if (!parent::beforeDelete()) {
			return false;
		}
		foreach($this->openHours as $oh) {
			if (!$oh->delete()) {
				return false;
			}
		}
		foreach($this->phoneNumbers as $pn) {
			if (!$pn->delete()) {
				return false;
			}
		}
		foreach($this->sources as $source) {
			if (!$source->delete()) {
				return false;
			}
		}
		return true;
	}

	public function getAddressLine() {
		$parts = array();
		if ($this->address) {
			$parts[] = $this->address;
		}
		if ($this->zipcode) {
			$parts[] = $this->zipcode;
		}
		if ($this->postalCity) {
			$parts[] = $this->postalCity->name;
		}
		if (empty($parts)) {
			return '';
		}
		return join(' ', $parts);
		
	}
	
}

