<?php
/**
 * SiteController class
 *
 * @author Antonio Ramirez <amigo.cobos@gmail.com>
 * @link http://www.ramirezcobos.com/
 * @link http://www.2amigos.us/
 * @copyright 2013 2amigOS! Consultation Group LLC
 * @license http://www.opensource.org/licenses/bsd-license.php New BSD License
 */
class SiteController extends BaseBackendController
{
    /**
	 * Renders index
	 */
	public function actionIndex()
	{
		$this->render('index');
	}
    
    /**
	 * Renders index
	 */
	public function actionHome()
	{
		$this->render('home');
	}
    
	public function actionUsersview()
	{
		$this->render('usersview');
	}
    
	public function actionUsersedit()
	{
		$this->render('usersedit');
	}
    
	public function actionProductedit($id)
	{
		$this->render('productedit');
	}
    
	public function actionProductview()
	{
		$this->render('productview');
	}
    
    public function actionForms()
	{
		$this->render('forms');
	}
    
    public function actionSeo()
	{
		$this->render('seo');
	}
    
    public function actionFlot()
	{
		$this->render('flot');
	}
    
	/**
	 * This is the action to handle external exceptions.
	 */
	public function actionError()
	{
		if($error=Yii::app()->errorHandler->error)
		{
			if(Yii::app()->request->isAjaxRequest)
				echo $error['message'];
			else
				$this->render('error', $error);
		}
	}
    
    public function beforeAction($action) {
        
        // register CSS and js files here for specific actions
        
        if(parent::beforeAction($action)) {
            switch ($action->getId()) {
                case 'usersview':
                case 'seo':
                    Yii::app()->clientScript->registerCssFile(Yii::app()->baseUrl.'/css/icons.css');
                    Yii::app()->clientScript->registerCssFile(Yii::app()->baseUrl.'/css/index.css');
                    Yii::app()->clientScript->registerCssFile(Yii::app()->baseUrl.'/css/dataTables.bootstrap.css');
                    break;
                case 'home' :
                    Yii::app()->clientScript->registerCssFile(Yii::app()->baseUrl.'/css/timeline.css');
                    break;
                case 'productUpdate' :
                     Yii::app()->clientScript->registerCssFile(Yii::app()->baseUrl.'/css/morris-0.4.3.min.css');
                     break;
                case 'editing' :
                    Yii::app()->clientScript->registerScriptFile(Yii::app()->baseUrl.'/tinymce/jscripts/tiny_mce/tiny_mce.js');
                    Yii::app()->clientScript->registerScript('showView', '
                        tinyMCE.init({
                            mode : "textareas",
                            theme : "advanced",
                            content_css : "/tinymce/custom_content.css",
                            theme_advanced_font_sizes: "10px,12px,13px,14px,16px,18px,20px",
                            font_size_style_values : "10px,12px,13px,14px,16px,18px,20px",
                            width: "100%",
                            height: "280"
                        });

                    ');
                    break;
            }
            return true;
        }
        
        return FALSE;
    }
    
    public function actionEditing($id) {
        
        $this->layout="editing";
        $model = Ad::model()->findByPk($id);
        
        if(isset($_POST['Ad'])) {
            // change scenario since we have special validation for description similarity
            $model->scenario='editing';
            
			$model->name=$_POST['Ad']['name'];
			$model->rubrik=$_POST['Ad']['rubrik'];
			$model->description=$_POST['Ad']['description'];
			$model->product_id=$_POST['Ad']['product_id'];
			$model->company_id=$_POST['Ad']['company_id'];
            
            if($model->save()){
                // display flash to user
                // remove sessioncrop
                $this->sessionCropping('unsetEditing');
                // Change status to EIDTED
                $this->setAdStatus($id, self::EDITED);
                $this->actionNextEdit();
                return;
            }
        } 
        
        $cityBages =  AdCity::model()->getCityBages($id);
        $productsList = CHtml::listData(Product::model()->findAll(), 'id', 'name');
        $companyList = CHtml::listData(Company::model()->findAll(), 'id', 'name');
        
        $pImage= $model->getPrimaryImagePath();
        
        $this->render('detailedit',array(
			'model'=>$model,
            'cityBages'=>$cityBages,
            'productsList'=>$productsList,
            'companyList'=>$companyList,
            'pImage'=>$pImage, // primary image
		));
    }
    
    public function actionCropping($id, $image_id=FALSE) {
        
        $this->layout="cropping";
        $model = Ad::model()->findByPk($id);
        // check im primary img url or pri and sec both
        if($image_id === FALSE) {
            $Image = $model->getPrimaryImage();
            $pImage= Yii::app()->baseUrl.'/img/products/'. $Image->image_file;
            $image_id=$Image->id;
        } else {
            $pImage=$model->getImagePath($image_id);
        }
        
        $imageName=$imgName= substr( strrchr( $pImage, '/' ), 1 );
        // check if image file exist on drive
        $filePath = dirname(__FILE__) . "/../www/img/products/{$imageName}";
        if ( ! is_file($filePath)) {
           AdImage::model()->setCropped($image_id, self::CROPNOTEXIST);
           // $this->actionNext();
        }
        
        $cityBages=  AdCity::model()->getCityBages($id);
        
        // 610*310
        // normalize size
        $this->normalizeSize($imageName);
        
        $this->render('cropping',array(
			'model'=>$model,
            'pImage'=>$pImage, // primary image
            'images'=>$model->getAllImages(),
            'cityBages'=>$cityBages,
            'imageName'=>$imageName,
            'image_id'=>$image_id,
		));
        
    }
    
    protected function normalizeSize($imageName) {
        $filePath = dirname(__FILE__) . "/../www/img/products/{$imageName}";
        
        if ( ! is_file($filePath)) {
           return FALSE;
        }
        
        $this->includeImgLib();
        
        // check if size > 600*310
        $image = new Image($filePath);
        if($image->width > 610) { // then resize
            $width=$image->width;
            $height=$image->height;
            // find factor for making width as 600
            $factor = $width / 610;
            // now compute new width and height
            $newWidth=610; // should be always $width/$factor;
            $newHeight=round($height/$factor);
            $image->resize($newWidth, $newHeight);
            $image->save(FALSE, FALSE);
        }
        return TRUE;
    }
    
    public function actionAlias() {
        // echo Yii::getPathOfAlias('root.common.extensions.image.Image');
        Yii::import('root.common.extensions.image.Image');  
        $image_file= '5179985067.jpg'; // '5185121101.jpg';
        $filePath = dirname(__FILE__) . "/../www/img/products/{$image_file}";
         if ( is_file($filePath)) {
           echo '<br>file exist';
           $image = new Image($filePath);
        } else {
            echo '<br>file does not exist';
        }
    }
    
    private function includeImgLib() {
        Yii::import('root.common.helpers.CArray');
        Yii::import('root.common.extensions.image.Image');
    }
    
    public function actionCrop() {
        $this->includeImgLib();
                
        $image_file= $_POST['img']; // '5185121101.jpg';
        $filePath = dirname(__FILE__) . "/../www/img/products/{$image_file}";
        $image = new Image($filePath);
        $image_id=$_POST['img_id'];
        
        if(isset($_POST['deg'])) { // rotate
            $image->rotate($_POST['deg']);
        } else { // crop
            $left=$_POST['x1'];
            $top=$_POST['y1'];
            $width=$_POST['w'];
            $height=$_POST['h'];
            $image->crop($width, $height, $top, $left);
            AdImage::model()->setCropped($image_id, self::CROPPED);
            
        }
        
        // remove sessioncrop
        $this->sessionCropping('unsetCropping');
        // save file on disk
        $image->save(FALSE, FALSE);
        
        $link= Yii::app()->baseUrl.'/img/products/'.$image_file ;
        $resp=array('link'=>$link, 'status'=>'success');
        echo json_encode($resp);;
    }
    
    public function actionDoundo() {
        $image_id=$_POST['img_id'];
        $doundo=$_POST['doundo'];
        
        if($doundo=='undo') $doundo=self::CROPUNDONE;
        if($doundo=='save') $doundo=self::CROPPED;
        if($doundo=='skip') $doundo=self::CROPSKIPPED;
        
        $this->sessionCropping('unsetCropping');
        
        if(AdImage::model()->setCropped($image_id, $doundo)) {
            echo 'success';
        } else {
            echo 'failed';
        }
    }
    
    private function sessionCropping($action, $values=array()) {
        switch ($action) {
            case 'setCropping':
                Yii::app()->session['image_id'] = $values['image_id'];
                Yii::app()->session['ad_id'] = $values['ad_id'];
                break;
            case 'setEditing':
                Yii::app()->session['editing_id'] = $values['editing_id'];
                break;

            case 'getCropping':
                $values=array(
                    'image_id'=>Yii::app()->session['image_id'],
                    'ad_id'=>Yii::app()->session['ad_id'],
                );
                return $values;
                break;
            case 'getEditing':
                $values=array(
                    'editing_id'=>Yii::app()->session['editing_id'],
                );
                return $values;
                break;
            
            case 'unsetCropping':
                unset(Yii::app()->session['ad_id']);
                unset(Yii::app()->session['image_id']);
                break;
            case 'unsetEditing':
                unset(Yii::app()->session['editing_id']);
                break;
            
            case 'printCropping':
                if(isset(Yii::app()->session['image_id']))  {
                    echo '<hr>';
                    echo 'image_id:' . Yii::app()->session['image_id'] . '<br/>';
                    echo 'ad_id:' . Yii::app()->session['ad_id'] . '<br/>';
                    echo '<hr>';
                }
                break;
        } 
    }
    
    public function actionNext() {
        // check if the user is already cropping an image 
        if(isset(Yii::app()->session['image_id'])) {
            $values = $this->sessionCropping('getCropping');
            $cropping_image_id = $values['image_id'];
            $cropping_ad_id = $values['ad_id'];
            
            $this->redirect(array(
                'site/cropping', 
                'id'=>$cropping_ad_id, 
                'image_id'=>$cropping_image_id,
            ));
        } 
        
        // find AdImage with status == 1 order by id desc
        $Image= AdImage::model()->findUncropped();
        if(!isset($Image)) {
            echo 'All images cropped';
            exit;
        }
        // set it to cropping so other users should not crop it
        $Image->cropped=  self::CROPPING;
        $Image->save(FALSE);
        // maintain this image_id and ad_id in session, so user shud crop this first
        $values= array(
           'image_id' =>$Image->id,
           'ad_id' => $Image->ad_id,
        ); 
        
        $this->sessionCropping('setCropping', $values);
        
        $this->redirect(array(
            'site/cropping', 
            'id'=>$Image->ad_id, 
            'image_id'=>$Image->id
        ));
    }
    
    
    public function actionNextEdit() {
        // check if the user is already editing an image 
        if(isset(Yii::app()->session['editing_id'])) {
            $values = $this->sessionCropping('getEditing');
            $editing_id = $values['editing_id'];
            
            $this->redirect(array(
                'site/editing', 
                'id'=>$editing_id, 
            ));
        } 
        
        // find AdI with edited == 0 order by id desc
        $Ad= Ad::model()->findUnedited();
        if(!isset($Ad)) {
            echo 'All Ads are edited.';
            exit;
        }
        // set it to cropping so other users should not crop it
        $Ad->edited=  self::EDITING;
        $Ad->save(FALSE);
        $values= array(
           'editing_id' =>$Ad->id,
        ); 
        
        $this->sessionCropping('setEditing', $values);
        
        $this->redirect(array(
            'site/editing', 
            'id'=>$Ad->id, 
        ));
        
    }
    
    public function actionSkippEditing($id) {
        $this->setAdStatus($id, self::EDITSKIPPED);
        $this->sessionCropping('unsetEditing');
        $this->actionNextEdit();
    }
    
    private function setAdStatus($id, $status) {
       $Ad= Ad::model()->findByPk($id); 
       if(!isset($Ad)) {
           throw new CHttpException(404, 'This product cannot be found');
       }
       $Ad->edited= $status;
       return $Ad->save(FALSE); 
    }
    
    public function actionAutoCompany() {
        $action = $_POST['action'];
        $result = array('status'=>'fail');
        if($action=='autocompany') {
            // apple, iphone
            Yii::app()->db
                ->createCommand("UPDATE ad SET company_id = 1 , edited = 5 WHERE id > 0 AND (edited=1 OR edited=3 OR edited is null) AND (name like '%apple%' OR name like '%iphone%' OR name like '%ipod%' OR name like '%ipad%' OR name like '%Iphon%' OR name like '%I phon%' OR name like '%4s%' OR name like '%5s%')")
                ->execute();
            
            // galaxy, samsung
            Yii::app()->db
                ->createCommand("UPDATE ad SET company_id = 2 , edited = 5 WHERE id > 0 AND (edited=1 OR edited=3 OR edited is null) AND (name like '%samsung%' OR name like '%galax%' OR name like '%s4%')")
                ->execute();
            
            // sony
            Yii::app()->db
                ->createCommand("UPDATE ad SET company_id = 3 , edited = 5 WHERE id > 0 AND (edited=1 OR edited=3 OR edited is null) AND (name like '%sony%' OR name like '%SonyEricsson%' OR name like '%ericsson%' OR name like '%xperia%')")
                ->execute();
            
            // huawei, Huawei Ascend P6
            Yii::app()->db
                ->createCommand("UPDATE ad SET company_id = 4 , edited = 5 WHERE id > 0 AND (edited=1 OR edited=3 OR edited is null) AND (name like '%Huawei%' OR name like '%Ascend%' OR name like '%P6%')")
                ->execute();
            
            // nokia, lumia
            Yii::app()->db
                ->createCommand("UPDATE ad SET company_id = 5 , edited = 5 WHERE id > 0 AND (edited=1 OR edited=3 OR edited is null) AND (name like '%nokia%' OR name like '%lumia%')")
                ->execute();
            
            // blackbery
            Yii::app()->db
                ->createCommand("UPDATE ad SET company_id = 6 , edited = 5 WHERE id > 0 AND (edited=1 OR edited=3 OR edited is null) AND (name like '%blackber%' OR name like '%black ber%')")
                ->execute();
            
            // lg
            Yii::app()->db
                ->createCommand("UPDATE ad SET company_id = 8 , edited = 5 WHERE id > 0 AND (edited=1 OR edited=3 OR edited is null) AND (name like '%lg%' OR name like '%LG%')")
                ->execute();
            
            // htc
            Yii::app()->db
                ->createCommand("UPDATE ad SET company_id = 9 , edited = 5 WHERE id > 0 AND (edited=1 OR edited=3 OR edited is null) AND (name like '%htc%')")
                ->execute();
            
            // google
            Yii::app()->db
                ->createCommand("UPDATE ad SET company_id = 11 , edited = 5 WHERE id > 0 AND (edited=1 OR edited=3 OR edited is null) AND (name like '%google%' OR name like '%nexus%')")
                ->execute();
            
            // doro
            Yii::app()->db
                ->createCommand("UPDATE ad SET company_id = 13 , edited = 5 WHERE id > 0 AND (edited=1 OR edited=3 OR edited is null) AND (name like '%doro%' OR name like '%DORO%')")
                ->execute();
            
            // zte
            Yii::app()->db
                ->createCommand("UPDATE ad SET company_id = 14 , edited = 5 WHERE id > 0 AND (edited=1 OR edited=3 OR edited is null) AND (name like '%zte%' OR name like '%ZTE%')")
                ->execute();

            $result = array('status'=>'success', 'msg'=>'set company id');
        }
        
        if($action=='autoproduct') {
            Yii::app()->db
                ->createCommand("UPDATE ad SET product_id = 1 WHERE id > 0 AND (edited=1 OR edited=3 OR edited is null OR edited=5)")
                ->execute();
            
            Yii::app()->db
                ->createCommand("UPDATE ad SET product_id = 18 WHERE id > 0 AND (edited=1 OR edited=3 OR edited is null OR edited=5) AND name like '%Telefon%'")
                ->execute();
            $result = array('status'=>'success', 'msg'=>'set product id');
        }
        
        echo CJSON::encode($result);
    }
}