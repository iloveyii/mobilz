<?php

class AdController extends BaseFrontendController
{
    public $defaultAction = 'home';
    public $prevParams;
    
    // data for dropdownlist in the form view
    public $countiesList;
    public $productsList;
    public $companiesList;
    public $citiesList;

    private $county_id; // value , for findModelBySlug

    /**
	 * @var string the default layout for the views. Defaults to '//layouts/column2', meaning
	 * using two-column layout. See 'protected/views/layouts/column2.php'.
	 */
	public $layout='//layouts/main';

	/**
	 * @return array action filters
	 */
	public function filters()
	{
		return array(
			'accessControl', // perform access control for CRUD operations
			'postOnly + delete', // we only allow deletion via POST request
		);
	}

	/**
	 * Specifies the access control rules.
	 * This method is used by the 'accessControl' filter.
	 * @return array access control rules
	 */
	public function accessRules()
	{
            return array(
                array('allow',  // allow all users to perform 'index' and 'view' actions
                        'actions'=>array('index','view', 'detail', 'url', 'home','showview'),
                        'users'=>array('*'),
                ),
                array('allow', // allow authenticated user to perform 'create' and 'update' actions
                        'actions'=>array('create','update','myads', 'delete', 'mysearch', 'mysearchlist','savedsearch'),
                        'users'=>array('@'),
                ),
                array('allow', // allow admin user to perform 'admin' and 'delete' actions
                        'actions'=>array('admin','delete'),
                        'users'=>array('admin'),
                ),
                array('deny',  // deny all users
                        'users'=>array('*'),
                ),
            );
	}

	/**
	 * Displays a particular model.
	 * @param integer $id the ID of the model to be displayed
	 */
	public function actionView($id)
	{
            if( ! $this->ifMyAdd($id)) {
                throw new CHttpException(403, 'You cannot access this page');
            }
        
            $this->render('view',array(
                    'model'=>$this->loadModel($id, 'Ad'),
            ));
	}
    
    /**
     * Find out if this is the ad of the current logged in user
     * @param int $ad_id
     * @return boolean returns true if this is user's ad
     */
    protected function ifMyAdd($ad_id) {
        if(isset(Yii::app()->user->id)) {
            // check Ad's user_id against current logged in user
            if($this->loadModel($ad_id, 'Ad')->user_id == Yii::app()->user->id) {
                return TRUE;
            }
        }
        return FALSE;
    }
    
	/**
	 * Creates a new model.
	 * If creation is successful, the browser will be redirected to the 'view' page.
	 */
	public function actionCreate()
	{
            $model=new Ad;
            $this->layout='main';
            $this->active = 'Lägg in Annons';
            $this->setMenus('user');
            $this->setMenus('mobile');
            
            // Uncomment the following line if AJAX validation is needed
            // $this->performAjaxValidation($model);

            if(isset($_POST['Ad']))
            {
                if($this->saveModel($model))
                    $this->redirect(array('ad/view','id'=>$model->id));
                
            } else {
                $model->cityIds = '{}'; // required braces in JS
            }
        
            // for tagSuggestions
            // $model->tagSuggestions= "'" . implode("','", array_values($citiesList)) . "'";
            
            // get dropdownlist data
            if(empty($model->county_id))
                $county_id = 1;
            else 
                $county_id = $model->county_id;
            
            $this->getDropDownListData($county_id);
            
            $this->render('create',array(
                'model' => $model,
                'countiesList' => $this->countiesList,
                'productsList' => $this->productsList,
                'companiesList' => $this->companiesList,
                'citiesList' => $this->citiesList,
            ));
	}
        
        private function saveModel($model) {
            
            $model->attributes=$_POST['Ad'];
            $model->cityIds = $_POST['cityIds']; 
            if(count(json_decode($model->cityIds, true)) > 0)
                $model->tagData = str_replace(array('[',']'), '', json_encode(array_keys(json_decode($model->cityIds, true)))); // geting only names

            if($model->validate()) {
                // save model
                if(isset(Yii::app()->user->id)) {
                    $model->user_id=Yii::app()->user->id;
                } else {
                    $this->redirect(array('site/login'));
                }

                if($model->save(FALSE)){ // now save ad_city
                    if(isset($_POST['cityIds'])) {
                        $cityIds= array_values(json_decode($_POST['cityIds'], true));
                        // remove duplicate ids if any, when update model ;)
                        $cityIds = array_flip($cityIds);
                        $cityIds = array_flip($cityIds);
                        $ad_id=$model->id;
                        foreach($cityIds as $cityId) {
                            $checkDuplicateAdCity = AdCity::model()->findByAttributes(array('ad_id'=>$ad_id, 'city_id'=>$cityId));
                            if(isset($checkDuplicateAdCity)) continue;
                            $adCity= new AdCity();
                            $adCity->ad_id = $ad_id;
                            $adCity->city_id = $cityId;
                            $adCity->save();
                        }
                    }
                    // now save images
                    $image_path = Yii::getPathOfAlias('webroot') . '/img/products';
                    $adImage= new AdImage();
                    $adImage->uploadFile($model, 'image1', $image_path);
                    $adImage->uploadFile($model, 'image2', $image_path);
                    $adImage->uploadFile($model, 'image3', $image_path);

                    // $this->redirect(array('ad/view','id'=>$model->id));
                    return TRUE;
                }
            } // validate
            
            return FALSE;
        }


        private function getDropDownListData($county_id) {
            $counties = County::model()->findAll();
            $this->countiesList = CHtml::listData($counties, 'id', 'name');
            
            $products = Product::model()->findAll();
            $this->productsList = CHtml::listData($products, 'id', 'name');
            
            $companies = Company::model()->findAll();
            $this->companiesList = CHtml::listData($companies, 'id', 'name');
            
            $cities = City::model()->findAllByAttributes(array('county_id'=>$county_id));
            $this->citiesList = CHtml::listData($cities, 'id', 'name');
        }

        /**
	 * Updates a particular model.
	 * If update is successful, the browser will be redirected to the 'view' page.
	 * @param integer $id the ID of the model to be updated
	 */
	public function actionUpdate($id)
	{
            $model=$this->loadModel($id, 'Ad');
            $this->layout='main';
            $this->active = 'Lägg in Annons';
            $this->setMenus('user');
            $this->setMenus('mobile');
            
            // find all cities
            $adCites = AdCity::model()->findAllByAttributes(array('ad_id'=>$id));
            foreach ($adCites as $adCity) {
                $arCities[$adCity->city->name]=$adCity->city_id;
            }
            $model->cityIds = CJSON::encode($arCities);
            
            if(count(json_decode($model->cityIds, true)) > 0)
                $model->tagData = str_replace(array('[',']'), '', json_encode(array_keys(json_decode($model->cityIds, true)))); // geting only names

            
            // Uncomment the following line if AJAX validation is needed
            // $this->performAjaxValidation($model);

            if(isset($_POST['Ad']))
            {
                if($this->saveModel($model))
                    $this->redirect(array('view','id'=>$model->id));
            }

            // get dropdownlist data
            if(empty($model->county_id))
                $county_id = 1;
            else 
                $county_id = $model->county_id;
            
            $this->getDropDownListData($county_id);
            
            $this->render('update',array(
                'model' => $model,
                'countiesList' => $this->countiesList,
                'productsList' => $this->productsList,
                'companiesList' => $this->companiesList,
                'citiesList' => $this->citiesList,
            ));
	}

	/**
	 * Deletes a particular model.
	 * If deletion is successful, the browser will be redirected to the 'admin' page.
	 * @param integer $id the ID of the model to be deleted
	 */
	public function actionDelete($id)
	{
            if($this->ifMyAdd($id)) {
		// $this->loadModel($id, 'Ad')->delete();
                $model = $this->loadModel($id, 'Ad');
                $model->active = $model->active == 1 ? 0 : 1; 
                $model->save(FALSE);
            } else {
                throw new CHttpException(401, 'You are not authorised');
            }
            // if AJAX request (triggered by deletion via admin grid view), we should not redirect the browser
            if(!isset($_GET['ajax']))
                    $this->redirect(isset($_POST['returnUrl']) ? $_POST['returnUrl'] : array('admin'));
	}
    
    public function actionUrl() {
        
        // check if user want to save it
        if(strpos(Yii::app()->request->requestUri, 'save.php') !== FALSE) {
            $this->actionSavesearch ();
            return;
        }
        // set layout
        $this->layout="main"; 
        // set flag for carousel
        $this->showCarousel=true;
        // check whether to show index page or details page
        if(isset($_GET['a'])) {
            if(isset($_GET['image_id'])) {
                $this->actDetail($_GET['a'], $_GET['image_id']);
                return;
            }
            $this->actDetail($_GET['a']);
            return;
        }
        
        $this->slugs=array(
            'product_slug'=>FALSE,
            'company_slug'=>FALSE,
            'county_slug'=>FALSE,
            'city_slug'=>FALSE,
        );
        
        $criteria=new CDbCriteria;
        $join='';
        $criteria->select="`t`.`id`, `t`.`name`, `t`.`active`, `t`.`price`,
                            `t`.`published`, `t`.`butik`, `t`.`contact`, 
                            `t`.`product_id`,`t`.`company_id`, `t`.`rubrik`";
        // 'company_slug',
        if(isset($_GET['company_slug'])) {
            // $company_id= Company::model()->findIDBySlug($_GET['company_slug']);
            $company_id = 0;
            $model = Company::model()->findByAttributes(array('slug'=>$_GET['company_slug']));
            if(isset($model))
                $company_id = $model->id;
            // $join1="INNER JOIN product ON t.product_id=product.id";
            $criteria->addCondition("t.company_id=$company_id");
            $this->slugs['company_slug']=TRUE;
            $this->showCarousel=false;
            $this->setSeo('company', $model);
        }
        
        
        // 'product_slug',
        if(isset($_GET['product_slug'])) {
            $product_id=  Product::model()->findIDBySlug($_GET['product_slug']);
            // if(!isset($_GET['company_slug']))
                // $join1 .="INNER JOIN product ON t.product_id=product.id ";
            $criteria->addCondition("t.product_id=$product_id");
            $this->slugs['product_slug']=TRUE;
            $this->showCarousel=false;
        }
        
        // 'county_slug',
        if(isset($_GET['county_slug'])) {
            // this model is not directly related, so we go via city
            $county_id=  County::model()->findIDBySlug($_GET['county_slug']);
            $join .="INNER JOIN ad_city ON t.id=ad_city.ad_id 
                   INNER JOIN city on ad_city.city_id=city.id
                   INNER JOIN county on city.county_id=county.id 
            ";
            $criteria->distinct=TRUE;
            $criteria->addCondition("county.id=$county_id");
            $this->slugs['county_slug']=TRUE;
            $this->showCarousel=false;
            $this->county_id = $county_id;
        }
        
        // 'city_slug', we can do only one join at a time, city has both in county and city
        if(isset($_GET['city_slug'])) {
            $city_id=  City::model()->findIDBySlug($_GET['city_slug']);
            if(! isset($_GET['county_slug'])) 
                $join .="INNER JOIN ad_city ON t.id=ad_city.ad_id ";
            $criteria->addCondition("ad_city.city_id=$city_id");
            $this->slugs['city_slug']=TRUE;
            $this->showCarousel=false;
        }
        
        // set secondNav
        if($this->setSecondNav()===FALSE) { // which means user reached end of path
             // lets display the first 
             /* $this->slugs=array(
                'product_slug'=>TRUE,
                'company_slug'=>FALSE,
                'county_slug'=>FALSE,
                'city_slug'=>FALSE,
             ); */
             // lets display the last
             // but we dont know which one is last so lets foreach
             foreach($this->slugs as $slug_id=>$enabled) {
                if(! $enabled){
                    break; 
                }
             }
             $this->slugs[$slug_id]=FALSE; // if all 4 slugs are true make last false
             $this->setSecondNav($slug_id);
        }
        
        // set bc, returns enabled getParams of slug
        $prevParams=$this->makeBreadcrumbs();
        
        $criteria->join=$join;
        $criteria->order = 'published DESC';
        
        // add pagination
        $count = Ad::model()->count($criteria);
        $pages = new CPagination($count);
        $pages->pageVar='p';
        if(isset($_GET['p']))
            $pages->currentPage=$_GET['p'] - 1;
        // results per page 
        $pages->pageSize=12;
        $pages->applyLimit($criteria);
        
        $models = Ad::model()->findAll($criteria);
        $this->setMenus('mobile');
        $this->active='Kategori';
        $this->render('index',array(
            'models'=>$models,
            'prevParams'=>$prevParams, // prefixed with a link tags
            'pages'=>$pages,
        ));
    }
    
    public function actionHome() {
        // $this->actionUrl();        return;
        $this->setMenus('mobile');
        $this->layout='home';
        $this->active='Hem';
        
        $this->render('home',array(
        ));
    }
    
    /**
     * checks which params are passed in the url
     * and sets them true in array $this->slugs 
     * 
     * @return array slugsParams the array of setted params in url based on $this->slugs 
     */
    private function findSetParams() {
        $this->slugs=array(
            'product_slug'=>FALSE,
            'company_slug'=>FALSE,
            'county_slug'=>FALSE,
            'city_slug'=>FALSE,
        );
        
        /** @var array of set params only in url based on $this->slugs */
        $slugsParams = array();
        
        foreach ($this->slugs as $slug_id=>$enabled) {
            if(isset($_GET[$slug_id])) {
                $this->slugs[$slug_id]=TRUE;
                $slugsParams[$slug_id]=$_GET[$slug_id];
            }
        }
        return $slugsParams;
    }
    
    
    /**
     * set breadcrumbs array based on get params of $this->slugs
     * 
     * @return array $getParams get parameters
     */
    protected function makeBreadcrumbs() {
        $slugsParams = $this->findSetParams();
//        if(empty($slugsParams)) {
//            $slugsParams['Home']=array('ad/index');
//        }
        $breadcrumbs=array();
        // $breadcrumbs['home']=  $this->createUrl('ad/home');
        $prevParams=array();
        // loop through $slugsParams
        foreach ($slugsParams as $paramName=>$paramValue) {
               $prevParams[$paramName] = $paramValue; // maintain prev slug_id setted before current
               $breadcrumbs[$paramValue] = $this->createUrl('ad/url', $prevParams); 
        }
        $notMePrevParams = $prevParams;
        // check n parameter in get
        if(isset($_GET['n'])) {
            // but first a
            $a=$_GET['a'];
            $breadcrumbs[$_GET['n']]=$this->createUrl('ad/url', array_merge($prevParams, array('n'=>$_GET['n'], 'a'=>"a{$a}"))); 
            
            $notMePrevParams['n']=$_GET['n'];
            $notMePrevParams['a']="a{$a}";
        }
        
        
        
        // remov the link from the last element of the breadcrumbs
//        if(!empty($breadcrumbs)) {
//            end($breadcrumbs);
//            $key=key($breadcrumbs); // find key of last element
//            unset($breadcrumbs[$key]); // remove last element
//            array_push($breadcrumbs, $key); // push key as last element
//        }
        
        // prepare notMeBreadcrumbs
        foreach ($notMePrevParams as $key=>$value) {
            $tmp = $notMePrevParams;
            unset($tmp[$key]); // remove self
            if($key=='n') {
                if(isset($tmp['a']))
                    unset($tmp['a']);
            }
            $notMeBreadcrumbs[$value] = $this->createUrl('ad/url', $tmp); 
        }
        
        $notMeBreadcrumbs[0] = '#';
        $notMeBreadcrumbs['/'] = '/';
        $notMeBreadcrumbs['home'] = '/';
        $this->breadcrumbs=$breadcrumbs;
        $this->notMeBreadcrumbs=$notMeBreadcrumbs;
        
        return $prevParams;
    }

    private function setSecondNav3($showProduct=FALSE) {
        $str='';
        $slugsParams = $this->findSetParams();
        if(!empty($slugsParams)) {
           $slug_id = end($slugsParams);
        } else {
            $slug_id= $showProduct==FALSE ? 'product_id': $showProduct ;
        }
         
        $models= $this->findModelsBySlug($slug_id);
        if($models!==FALSE) {
           // format models as $key=>$value with listData
           $list = CHtml::listData($models,'slug', 'name');
           // print_r($list);
           // make a.list-group-item 
           foreach($list as $slug=>$name) {
               $str .= '<a class="list-group-item" href="'. Yii::app()->createUrl("ad/url", array_merge($slugsParams, array($slug_id=>$slug)) ) . '">'. $name . '</a>';
           }
        }
         
        $this->secondNav=$str;
        return $str;
    }
    
    private function setSecondNav($showProduct=FALSE) {
        $this->secondNav=''; // clear
        $str = FALSE;
        $mainSlugArray=array();
        $mainSlug='';
        $uriNo=1;
        // find the first disabled
        foreach($this->slugs as $slug_id=>$enabled) {
            if($enabled){
                // which main slugs were in url
                $mainSlug=  $this->getURI($uriNo); $uriNo++;
                $mainSlugArray[$slug_id]=$mainSlug;
                continue;
            }
            else {
                if($showProduct !== FALSE) $slug_id=$showProduct;
                // find all models of this slug_id eg product_slug
                $models= $this->findModelsBySlug($slug_id);
                if($models!==FALSE) {
                    // format models as $key=>$value with listData
                    $list = CHtml::listData($models,'slug', 'name');
                    $class = CHtml::listData($models,'slug', 'class');
                    // print_r($list);
                    // make a.list-group-item 
                    foreach($list as $slug=>$name) {
                        $str .= '<a class="list-group-item" href="'. Yii::app()->createUrl("ad/url", array_merge($mainSlugArray, array($slug_id=>$slug)) ) . '">';
                        $str .= "<i class='{$class[$slug]}' > </i> &nbsp;";
                        $str .= $name . '</a>';
                    }
                }
                // we found secondNave so exit
                break;
            }
        }
        $this->secondNav=$str;
        return $str;
    }
    
    /**
     * It loads model by slug and finds if parameter exists in it
     * 
     * @param string $slug slug type representing model, e.g. product_slug
     * @param array $criteria search criteria in key, value format 
     * @return boolean or models
     */
    protected function findModelsBySlug($slug, $criteria=array(), $county_id=0) {
		// extract model from slug
        $slugArray= explode('_', $slug);
        $class=  ucfirst($slugArray[0]); // this is the class of the model
        if($slug == 'city_slug') { // then pass criteria to findModelBySlug to find cities in county
            $criteria = new CDbCriteria;
            if(empty($this->county_id))
                $this->county_id=11;
            $criteria->condition="county_id={$this->county_id}";
        }
        $models = CActiveRecord::model($class)->findAll($criteria);
		if(empty($models))
			return FALSE;
		else 
            return $models;
    }
    
	/**
	 * Lists all models.
	 */
	public function actionIndex($p=FALSE)
	{
        // TBD
        $this->actionUrl();        return;
        $city_id = City::model()->getID($city_slug);
        $criteria=new CDbCriteria;
        $this->layout="main"; 
        $this->active='Kategori';
        if(isset($_GET['slug'])) {
            
            $this->county=$_GET['slug']; // for main view
            
            $model = County::model()->findByAttributes(array('slug'=>$slug));
            if(isset($model)) {
                $this->layout="county";
                $county_id = $model->id;
                $criteria->join="INNER JOIN city ON t.city_id=city.id";
                $criteria->condition="city.county_id=$county_id";
            } else {
                throw new CHttpException(402, 'This county does not exist');
            }
            
        }
        
//        if($city_id !== FALSE) {
//            // if county_id is false then create join
//            if(!($slug > 0)) {
//                $criteria->join="INNER JOIN city ON t.city_id=city.id";
//            }
//            $criteria->addCondition("city.id=$city_id");
//            // $this->layout="county";
//        }    
        
        $criteria->order = 'published DESC, time DESC';
        
        $this->setMenus('mobile');
        
		$dataProvider=new CActiveDataProvider('Ad', array(
            'criteria'=>$criteria,
            'pagination'=>array(
                'pageSize'=>60,
            ),
        ));
        
		$this->render('index',array(
			'dataProvider'=>$dataProvider,
		));
	}

	/**
	 * Manages all models.
	 */
	public function actionAdmin()
	{
		$model=new Ad('search');
		$model->unsetAttributes();  // clear any default values
		if(isset($_GET['Ad']))
			$model->attributes=$_GET['Ad'];

		$this->render('admin',array(
			'model'=>$model,
		));
	}

	/**
	 * Performs the AJAX validation.
	 * @param Ad $model the model to be validated
	 */
	protected function performAjaxValidation1($model)
	{
		if(isset($_POST['ajax']) && $_POST['ajax']==='ad-form')
		{
			echo CActiveForm::validate($model);
			Yii::app()->end();
		}
	}
    
    /**
	 * Returns the data model based on the primary key given in the GET variable.
	 * If the data model is not found, an HTTP exception will be raised.
	 * @param integer $id the ID of the model to be loaded
	 * @return Cart the loaded model
	 * @throws CHttpException
	 */
	public function loadModel1($id, $class=FALSE)
	{
		$model=Ad::model()->findByPk($id);
		if($model===null)
			throw new CHttpException(404,'The requested page does not exist.');
		return $model;
	}
    
    private function actDetail($id, $image_id=FALSE) {
        // set bc, returns enabled getParams of slug
        $getParams=$this->makeBreadcrumbs();
        $this->showCarousel=true;
        // $this->layout="county";
        $this->layout="main";
        $model = $this->loadModel($id, 'Ad');
        
        if($image_id ===FALSE) {
            $pImage=$model->getPrimaryImagePath();
        } else {
            $pImage=$model->getImagePath($image_id);
        }
        
        $this->county=$model->getCounty();
        $cityBages=  AdCity::model()->getCityBages($id);
        
        if($this->setSecondNav()===FALSE) {
            $this->setSecondNav('product_slug');
        }
        $this->setSeo('ad', $model);
        
        $this->render('detail',array(
			'model'=>$model,
            'pImage'=>$pImage, // primary image
            'images'=>$model->getAllImages(),
            'cityBages'=>$cityBages,
            'prevParams'=>$getParams,
		));
    }
    
    /**
     * changes array key maintaining its position
     * 
     * @param array $array in which u want change key
     * @param string $old_key the old key
     * @param string $new_key the new key
     * @return array
     */
    private function change_key( $array, $old_key, $new_key) {

        if( ! array_key_exists( $old_key, $array ) )
            return $array;

        $keys = array_keys( $array );
        $keys[ array_search( $old_key, $keys ) ] = $new_key;

        return array_combine( $keys, $array );
    }
    
    public function actionShowview() {
        
        Yii::app()->session['view'] = $_POST['style'];
        
        $return = array(
            'status'=>'success',
            'view'=>Yii::app()->session['view'],
        );
        
        echo json_encode($return);
        exit;
    }
    
    
    public function actionMyads() {
        $this->layout='main';
        $this->showCarousel=false;
        $this->active='Mitt konto';
        
        if(! isset(Yii::app()->user->id))
            $this->redirect ('site/login');
        
        $user_id = Yii::app()->user->id;
        
        $this->setMenus('user', $user_id);
        
        $criteria = new CDbCriteria();
        $criteria->condition = "user_id= $user_id";
        
        $dataProvider=new CActiveDataProvider('Ad', array(
            'criteria'=>$criteria,
            'pagination'=>array(
                'pageSize'=>5,
            ),
        ));
        
        
        $this->render('myads',array(
            'dataProvider'=>$dataProvider,
            'prevParams'=>array(), // prefixed with a link tags
        ));
    }
    
    public function actionMysearch($search_id) {
        // suppose
        $arrSearch = array(
            'product_slug'=>'mobiles',
            'company_slug'=>'apple',
            // 'county_slug'=>'norrbotten',
            'city_slug'=>'jarfalla',
        );
        // $_GET = array();
        // lets do it
        // $_GET['product_slug']='mobiles';
        
//        print_r($_GET);
        
        $arrSearch = Savedsearch::model()->getSlugs($search_id);
        // $_GET=$arrSearch;
//         print_r($arrSearch);
        // $this->actionUrl();
        $this->redirect($this->createUrl('ad/url', $arrSearch));
    }
    
    private function getLoggedUserID() {
        if(! isset(Yii::app()->user->id))
            $this->redirect ('site/login');
        
        $user_id = Yii::app()->user->id;
        return $user_id;
    }
    
    public function actionMysearchlist() {
        
        $user_id = $this->getLoggedUserID();
        $this->layout='main';
        $this->showCarousel=false;
        $this->setMenus('user', $user_id);
        
        $criteria = new CDbCriteria();
        $criteria->condition = "user_id= $user_id";
        
        $dataProvider=new CActiveDataProvider('UserSavedsearch', array(
            'criteria'=>$criteria,
            'pagination'=>array(
                'pageSize'=>10,
            ),
        ));
        
        
        $this->render('mysearchlist',array(
            'dataProvider'=>$dataProvider,
        ));
    }
    
    public function actionSavedsearch() {
       $user_id = $this->getLoggedUserID(); 
       
        $slugs=array(
            'product_slug'=>FALSE,
            'company_slug'=>FALSE,
            'county_slug'=>FALSE,
            'city_slug'=>FALSE,
        );
       // find valid keys only
       $arrSearch = array_intersect_key($_GET, $slugs);
       
       if(count($arrSearch) > 0) {
           Savedsearch::model()->saveUserSearch($user_id, $arrSearch);
       }
       
       print_r($arrSearch);
       $this->redirect(str_replace('savedsearch', '', Yii::app()->request->requestUri));
    }
}