<?php

Yii::import('root.common.models._base.BaseVisit');

class Visit extends BaseVisit
{
	public static function model($className=__CLASS__) {
		return parent::model($className);
	}

	public static function location(Location $l) {
		$v = new self;
		$v->time = new CDbExpression('NOW()');
		$v->objectType = 'location';
		$v->objectId = $l->id;
		$v->referrer = Yii::app()->request->urlReferrer;
		$v->userAgent = Yii::app()->request->userAgent;
		$v->host = Yii::app()->request->userHost;
		$v->ip = Yii::app()->request->userHostAddress;
		if (!$v->save()) {
			throw new CHttpException('failed saving visit for loc-id: ' . $l . ' errors: ' . CVarDumper::dumpAsString($v->getErrors()));
		}
		return $v;
	}

	public static function topLocations($when) {
		$conn = Yii::app()->db;
		$getLocationIds = $conn->createCommand("
			SELECT
				v.objectId as locationId
			FROM
				oppettidr.visit as v
			INNER JOIN
				location AS l ON l.id = v.objectId
			WHERE
				v.objectType = 'location' AND v.time between :from AND NOW()
			group by
				v.objectId
			order by
				count(v.id) DESC
			limit
				4
		");

		if ($when == 'today') {
			$from = new DateTime('midnight');
		} elseif ($when == 'week') {
			$from = new DateTime('midnight -1 week');
		} else {
			throw new CHttpException(500, 'invalid argument: ' . $when);
		}
		$locationIds = $getLocationIds->queryAll(true, array('from' => $from->format('Y-m-d H:i:s')));

		$ids = array();
		foreach($locationIds as $locationId) {
			$ids[$locationId['locationId']] = $locationId['locationId'];
		}


		$criteria = new CDbCriteria();
		if (!empty($ids)) {
			$criteria->addInCondition('id', array_values($ids));
		}
		$criteria->index = 'id';
		$locations = Location::model()->findAll($criteria);

		$orderedLocations = array();
		foreach($ids as $id) {
			$orderedLocations[] = $locations[$id];
		}
		return $orderedLocations;
	}
}
