<?php
	class CronCommand extends CConsoleCommand {
		public function actionDeleteOldOpenHours() {
			$deleted = OpenHours::model()->deleteAll('`date` IS NOT NULL AND `date` < DATE(NOW())');
			echo PHP_EOL . 'deleted ' . $deleted . ' records.' . PHP_EOL;
 		}
	}
