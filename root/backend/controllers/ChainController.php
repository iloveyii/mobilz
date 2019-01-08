<?php

class ChainController extends BaseBackendController
{


	/**
	 * Displays a particular model.
	 * @param integer $id the ID of the model to be displayed
	 */
	public function actionView($id)
	{
		$this->render('view',array(
			'model'=>$this->loadModel($id),
		));
	}

	/**
	 * Creates a new model.
	 * If creation is successful, the browser will be redirected to the 'view' page.
	 */
	public function actionCreate()
	{
		$model=new Chain;

		// Uncomment the following line if AJAX validation is needed
		 $this->performAjaxValidation($model);

		if(isset($_POST['Chain']))
		{
			$model->attributes=$_POST['Chain'];
			//new
			$model->url=CUploadedFile::getInstance($model,'url');
			$fecha = date('YmdHms');
			$model->url->saveAs(Yii::app()->basePath.'/img/'.$fecha.'_'.$model->url);
			$model->url = $fecha.'_'.$model->url;
			if($model->save())
			{
				$this->redirect(array('view','id'=>$model->id));
			}

			//end new

		}

		$this->render('create',array(
			'model'=>$model,
		));
	}

	/**
	 * Updates a particular model.
	 * If update is successful, the browser will be redirected to the 'view' page.
	 * @param integer $id the ID of the model to be updated
	 */
	public function actionUpdate($id)
	{
		$model=$this->loadModel($id);

		// Uncomment the following line if AJAX validation is needed
		// $this->performAjaxValidation($model);

		if(isset($_POST['Chain']))
		{
			$model->attributes=$_POST['Chain'];

			$file_image=CUploadedFile::getInstance($model,'url');
			$fecha = date('YmdHms');

			if ( (is_object($file_image) && get_class($file_image)==='CUploadedFile'))
				$model->url =$file_image;
			if($model->save())
			{
				if(is_object($file_image))
				$model->url->saveAs('/home/robert/oppettidr/root/frontend/www/img/'.$model->url);
				$model->url = $fecha.'_'.$model->url;
				$this->redirect(array('view','id'=>$model->id));
			}




		//	if($model->save())
		//
		}

		$this->render('update',array(
			'model'=>$model,
		));
	}

	/**
	 * Deletes a particular model.
	 * If deletion is successful, the browser will be redirected to the 'admin' page.
	 * @param integer $id the ID of the model to be deleted
	 */
	public function actionDelete($id)
	{
		if(Yii::app()->request->isPostRequest)
		{
			// we only allow deletion via POST request
			$this->loadModel($id)->delete();

			// if AJAX request (triggered by deletion via admin grid view), we should not redirect the browser
			if(!isset($_GET['ajax']))
				$this->redirect(isset($_POST['returnUrl']) ? $_POST['returnUrl'] : array('admin'));
		}
		else
			throw new CHttpException(400,'Invalid request. Please do not repeat this request again.');
	}

	/**
	 * Lists all models.
	 */
	public function actionIndex()
	{
		$dataProvider=new CActiveDataProvider('Chain');
		$this->render('index',array(
			'dataProvider'=>$dataProvider,
		));
	}

	/**
	 * Manages all models.
	 */
	public function actionAdmin()
	{
		$model=new Chain('search');
		$model->unsetAttributes();  // clear any default values
		if(isset($_GET['Chain']))
			$model->attributes=$_GET['Chain'];

		$this->render('admin',array(
			'model'=>$model,
		));
	}

	/**
	 * Returns the data model based on the primary key given in the GET variable.
	 * If the data model is not found, an HTTP exception will be raised.
	 * @param integer the ID of the model to be loaded
	 */
	public function loadModel($id)
	{
		$model=Chain::model()->findByPk($id);
		if($model===null)
			throw new CHttpException(404,'The requested page does not exist.');
		return $model;
	}

	/**
	 * Performs the AJAX validation.
	 * @param CModel the model to be validated
	 */
	protected function performAjaxValidation($model)
	{
		if(isset($_POST['ajax']) && $_POST['ajax']==='chain-form')
		{
			echo CActiveForm::validate($model);
			Yii::app()->end();
		}
	}
}
