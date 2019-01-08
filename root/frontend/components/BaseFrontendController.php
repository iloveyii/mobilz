<?php
	/**
	 *
	 */
	class BaseFrontendController extends GxController {
		/** @var array */
		public $breadcrumbs;
        public $notMeBreadcrumbs;
        public $county;
        public $active;


        /** @var string */
		public $layout='//layouts/frontend-layout';

		public $title;
		public $metaDescription;
		public $metaKeyWords;
        
        /** @var Slugs which slugs are enabled in Ad controller ad/url action */
        public $slugs;
        /** @var SecondNav for displaying second nav on the left */
        public $secondNav;
        
        /** for top nav */
        public $category;
        
        /** for showing minor products */
        public $type2;
        
        /** @var SearchForm */
		public $searchForm;
        
        /**  @var boolean show/hide carousel in getCarousel()  */
        public $showCarousel;

		public function init() {
			// $this->searchForm = new SearchForm;
		}


		public function setSeo($page, GxActiveRecord $model = null) {
			foreach(array('title', 'metaDescription', 'metaKeyWords') as $param) {
				$this->setSeoParam($param, $page, $model);
			}
		}

		private function setSeoParam($param, $page, GxActiveRecord $model = null) {
			$this->$param = $this->findSeoParam($param, $page, $model);
		}

		/**
		 * @param                $param
		 * @param                $page
		 * @param GxActiveRecord|Chain|Location|Mall $model
		 *
		 * @return mixed
		 * @throws CHttpException
		 */
		private function findSeoParam($param, $page, GxActiveRecord $model = null) {
//			if (!in_array($page, SeoMapping::$pages)) {
//				throw new CHttpException(500, 'Internt fel');
//			}

			$returnValue = Yii::app()->params['seo'.ucfirst($param)];


			if ($model !== null) {
				/** @var Chain|Mall|Location $model */
				if (($page == 'company' && !$model instanceof Company) || ($page == 'mall' && !$model instanceof Mall) || ($page == 'location' && !$model instanceof Location)) {
					throw new CHttpException(500, 'internt fel page: ' . $page . ' model: ' . get_class($model));
				}

				if ($model->seo !== null && $model->seo->$param !== null) {
					return $model->seo->magicReplace($param, $model);
				}
			}

			/** @var SeoMapping $seoMapping  */
			$seoMapping = SeoMapping::model()->find('page = :page', array('page' => $page));
			if ($seoMapping !== null && $seoMapping->seo !== null && $seoMapping->seo->$param !== null) {
				if ($model !== null) {
					return $seoMapping->seo->magicReplace($param, $model);
				}

				return $seoMapping->seo->$param;
			} else {
				$defaultMapping = null;
				if ($page != 'default') {
					/** @var SeoMapping $defaultMapping  */
					$defaultMapping = SeoMapping::model()->find('page = \'default\'');
				}
				if ($defaultMapping !== null && $defaultMapping->seo !== null && $defaultMapping->seo->$param !== null) {
					return $defaultMapping->seo->$param;
				}
			}

			return $returnValue;
		}

		public function getTitle() {
			return $this->getSeoParam('title');
		}

		public function getMetaDescription() {
			return $this->getSeoParam('metaDescription');
		}

		public function getMetaKeyWords() {
			return $this->getSeoParam('metaKeyWords');
		}

		private function getSeoParam($param) {
			if ($this->$param === null) {
				return $this->findSeoParam($param, 'default');
			}
			return $this->$param;
		}
        
        public function createMultilanguageReturnUrl($lang='en'){
        if (count($_GET)>0){
            $arr = $_GET;
            $arr['language']= $lang;
        }
        else 
            $arr = array('language'=>$lang);
        return $this->createUrl('', $arr);
    }

        public function createMulti($route, $param=array()){
            $param['language'] = Yii::app()->language;
            return Yii::app()->createUrl(trim($route,'/'),$param,'&');
        }

        public function getURI($no) {
            $array = explode('/', Yii::app()->request->requestUri);
            return $array[$no];
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
       
       /*
        * Displays carousel 
        */
       public function getCarousel() {
        if($this->showCarousel) {
            echo Carousel::model()->getCarousel();
        }
      }
      
      public function setMenus($menuName, $user_id = FALSE) {
          $str = '';
          switch ($menuName) {
              case 'user':
                if(! isset(Yii::app()->user->id))
                    $this->redirect ('site/login');
                $user_id = Yii::app()->user->id;
                // make a.list-group-item 
                $str .= '<a class="list-group-item" href="'. Yii::app()->createUrl("user/update", array('id'=>$user_id)) . '">';
                $str .= "<i class='fa fa-user' > </i> &nbsp;";
                $str .= 'Mitt profil</a>';

                $str .= '<a class="list-group-item" href="'. Yii::app()->createUrl("ad/myads") . '">';
                $str .= "<i class='fa fa-check-square-o' > </i> &nbsp;";
                $str .= 'Mitt Annonser</a>';
                
                $str .= '<a class="list-group-item" href="'. Yii::app()->createUrl("ad/create") . '">';
                $str .= "<i class='fa fa-plus-square-o' > </i> &nbsp;";
                $str .= 'Lägg in Annons</a>';
                
                $str .= '<a class="list-group-item" href="'. Yii::app()->createUrl("ad/mysearchlist") . '">';
                $str .= "<i class='fa fa-search' > </i> &nbsp;";
                $str .= 'Mitt Sök</a>';
                
                
                $this->secondNav=$str;
                break;

               case 'mobile':
                    // format models as $key=>$value with listData
                    $list = CHtml::listData(Product::model()->findAll(),'slug', 'name');
                    $class = CHtml::listData(Product::model()->findAll(),'slug', 'class');
                    $str .= '<ul class="dropdown-menu">';
                    foreach($list as $slug=>$name) {
                        $str .= '<li><a href="'. Yii::app()->createUrl("ad/url", array('product_slug'=>$slug) ) . '">';
                        $str .= "<i class='{$class[$slug]}' > </i> &nbsp;";
                        $str .= $name . '</a></li>';
                    } 
                     $str .= '</ul>';
                    
                    $this->category=$str;
                  break;
                  
              case 'type2':
                  
                  break;
              default:       
                  break;
          }
          
      }
      
      public function beforeAction($action) {
          $this->setMenus('mobile');
          return TRUE;
      }
      
    }