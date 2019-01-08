<?php
use SeleniumClient\WebElement;

Yii::import('root.common.models._base.BaseOpenHours');


class OpenHours extends BaseOpenHours
{
	public static function model($className=__CLASS__) {
		return parent::model($className);
	}

	public function rules() {
		return array(
			array('name', 'required'),
			array('occasion', 'length', 'max'=>170),
			array('date', 'date', 'format'=>'yyyy-MM-dd'),
			array('isClosed', 'numerical', 'integerOnly'=>true, 'min' => 0, 'max' => 1, 'allowEmpty' => false),
			array('locationId', 'exist', 'className' => 'Location', 'attributeName' => 'id', 'allowEmpty' => false),
			array('name', 'length', 'max'=>45),
			array('openAt, closeAt', 'date', 'format' => 'HH:mm:ss'),
			array('openAt, closeAt, date', 'default', 'setOnEmpty' => true, 'value' => null),
			array('id, locationId, name, isClosed, openAt, closeAt, date', 'safe', 'on'=>'search'),
		);
	}

	/**
	 * @static
	 *
	 * @param Location   $loc
	 * @param WebElement $el
	 *
	 * @return CActiveRecord|OpenHours|string
	 */
	public static function newIfNotExists(Location $loc, WebElement $el) {
		$o = new static();
		$o->locationId = $loc->id;


		$pieces = explode(':', $el->getText(), 2);

		$o->name = trim($pieces[0]);


		$openHours = trim($pieces[1]);
		$openHours = explode('–', $openHours);



		$openAt = $openHours[0] . ':00';
		$closeAt = $openHours[1] . ':00';



		$closed = false;
		foreach(array('openAt', 'closeAt') as $varName) {
			$pieces = explode(':', $$varName);
			if (count($pieces) == 2) {
				$pieces[] = '00';
			}
			foreach($pieces as &$piece) {
				if (!is_numeric($piece)) {
					$closed = true;
					break;
				}
				if (strlen($piece) == 1) {
					$piece = '0' . $piece;
				}
				if (strlen($piece) != 2) {
					$closed = true;
					break;
				}
			}
			print_r($pieces);
			$$varName = join(':', $pieces);
			print_r($$varName);
		}

		if ($closed) {
			$o->openAt = null;
			$o->closeAt = null;
			$o->isClosed = 1;
		} else {
			$o->isClosed = 0;
			$o->openAt = $openAt;
			$o->closeAt = $closeAt;
		}

		$oo = OpenHours::model()->find('locationId = :locId AND name = :name', array(':locId' => $o->locationId, ':name' => $o->name));
		if ($oo !== null) {
			return $oo;
		}
		if (!$o->save()) {
			return CVarDumper::dumpAsString($o->getErrors()) . ' locationId: ' . $loc->id;
		}
		return $o;
	}

	public function saveOrUpdate() {
		/** @var OpenHours|null $openHours  */
		$openHours = OpenHours::model()->find('locationId = :locationId AND name = :name',array('locationId' => $this->locationId, 'name' => $this->name));
		if ($openHours === null) {
			if (!$this->save()) {
				throw new CException('coudlnt save openhours.. loc-id: ' . $this->locationId . ':: errors: ' . CVarDumper::dumpAsString($this->getErrors()));
			}
			return 1;
		} else {
			$changes = array();
			foreach(array('openAt', 'closeAt', 'isClosed', 'date', 'occasion') as $attr) {
				if ($openHours->$attr != $this->$attr) {
					$changes[] = $attr;
					$openHours->$attr = $this->$attr;
				}
			}
			if (!empty($changes)) {
				if (!$openHours->save()) {
					throw new CException('failed saving openHours oh-id: ' . $openHours->id . ' loc-id: '. $openHours->locationId . ' errors: ' . CVarDumper::dumpAsString($openHours->getErrors()));
				}
				return 2;
			}
			return 0;
		}
	}

	public function __toString() {
		$ret = $this->name  . ' - ';
		if ($this->isClosed) {
			$ret .= 'stängt';
		} else {
			$ret .= mb_substr($this->openAt, 0, 5) . ' - ' . mb_substr($this->closeAt, 0, 5);
		}
		return $ret;
	}

	public function getOpenHours() {
		if ($this->isClosed) {
			$ret = 'stängt';
		} else {
			$ret = mb_substr($this->openAt, 0, 5) . ' - ' . mb_substr($this->closeAt, 0, 5);
		}
		return $ret;
	}
}