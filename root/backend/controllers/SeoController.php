<?php
	class SeoController extends BaseBackendController {
		public function actionIndex() {
            $this->layout='main';
            
			$seoMappingsForm = new SeoMappingsForm();
			if(isset($_POST['Seo']))
			{
				foreach($seoMappingsForm->seoMappings as $i=>$seo)
				{
					if(isset($_POST['Seo'][$i])) {
						$seoMappingsForm->seoMappings[$i]->seo->attributes=$_POST['Seo'][$i];
					}
					if ($seoMappingsForm->save()) {
						Yii::app()->user->setFlash('success', '<strong>Excellent</strong> saved successfully.');
					} else {
						Yii::app()->user->setFlash('error', '<strong>Failed</strong> Nothing was saved, fix all the errors and try again.');
					}
				}
			}
			$this->render('index', array('seoMappingsForm' => $seoMappingsForm));
		}
	}