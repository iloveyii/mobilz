<?php
	require_once(__DIR__ . '/../../common/lib/simple_dom/simple_html_dom.php');
    mb_internal_encoding('utf-8');
	
    /**
	 * @property WebDriver $driver
	 */
	class DataCommand extends CConsoleCommand {
        
        /** @var html dom */
		protected $html;
        protected $htmlDesc;
        protected $mob;
        private $debug;
        private $count;
        private $ad;
        private $countPages=10;
        private $countAdsLimit=10;
        private $countAds=0;
        private $countSkippedAds=0;
        private $flagContinue = true;

        private $county_id;
        /** @var string */
		public $browser = "chrome";

        /**
         * Performs data extraction
         * 
         * @param string $ad down : download all, newad: download only new
         * @param string $county_id all : download all counties, numeric: download only given
         */
		public function actionIndex($ad='newad', $county_id=11) {
            $this->debug=0;
            $this->ad=$ad;
            $this->count = 0;
            $this->countPages=2;
            $this->countAdsLimit=10;
            $this->countSkippedAds=10; // if it is reached no more scraping, continue with new county
            
            
            $countiesLink = array(
                '1'=>'http://www.blocket.se/kiruna?q=&cg=5060&w=1&st=s&c=0&ca=1_8&is=1&l=0&md=th',
                '2'=>'http://www.blocket.se/vasterbotten?q=&cg=5060&w=1&st=s&c=0&ca=2&is=1&l=0&md=th',
                '3'=>'http://www.blocket.se/jamtland?q=&cg=5060&w=1&st=s&c=0&ca=3&is=1&l=0&md=th',
                '4'=>'http://www.blocket.se/vasternorrland?q=&cg=5060&w=1&st=s&c=0&ca=4&is=1&l=0&md=th',
                '5'=>'http://www.blocket.se/gavleborg?q=&cg=5060&w=1&st=s&c=0&ca=5&is=1&l=0&md=th',
                '6'=>'http://www.blocket.se/dalarna?q=&cg=5060&w=1&st=s&c=0&ca=6&is=1&l=0&md=th',
                '7'=>'http://www.blocket.se/varmland?q=&cg=5060&w=1&st=s&c=0&ca=7&is=1&l=0&md=th',
                '8'=>'http://www.blocket.se/orebro?q=&cg=5060&w=1&st=s&c=0&ca=8&is=1&l=0&md=th',
                '9'=>'http://www.blocket.se/vastmanland?q=&cg=5060&w=1&st=s&c=0&ca=9&is=1&l=0&md=th',
                '10'=>'http://www.blocket.se/uppsala?q=&cg=5060&w=1&st=s&c=0&ca=10&is=1&l=0&md=th',
                '11'=>'http://www.blocket.se/stockholm?q=&cg=5060&w=1&st=s&c=0&ca=11&is=1&l=0&md=th',
                '12'=>'http://www.blocket.se/sodermanland?q=&cg=5060&w=1&st=s&c=0&ca=12&is=1&l=0&md=th',
                '13'=>'http://www.blocket.se/skaraborg?q=&cg=5060&w=1&st=s&c=0&ca=13&is=1&l=0&md=th',
                '14'=>'http://www.blocket.se/ostergotland?q=&cg=5060&w=1&st=s&c=0&ca=14&is=1&l=0&md=th',
                '15'=>'http://www.blocket.se/goteborg?q=&cg=5060&w=1&st=s&c=0&ca=15&is=1&l=0&md=th',
                '16'=>'http://www.blocket.se/alvsborg?q=&cg=5060&w=1&st=s&c=0&ca=16&is=1&l=0&md=th',
                '17'=>'http://www.blocket.se/jonkoping?q=&cg=5060&w=1&st=s&c=0&ca=17&is=1&l=0&md=th',
                '18'=>'http://www.blocket.se/kalmar?q=&cg=5060&w=1&st=s&c=0&ca=18&is=1&l=0&md=th',
                '19'=>'http://www.blocket.se/gotland?q=&cg=5060&w=1&st=s&c=&ca=19&is=1&l=0&md=th',
                '20'=>'http://www.blocket.se/halland?q=&cg=5060&w=1&st=s&c=0&ca=20&is=1&l=0&md=th',
                '21'=>'http://www.blocket.se/kronoberg?q=&cg=5060&w=1&st=s&c=0&ca=21&is=1&l=0&md=th',
                '22'=>'http://www.blocket.se/blekinge?q=&cg=5060&w=1&st=s&c=0&ca=22&is=1&l=0&md=th',
                '23'=>'http://www.blocket.se/malmo?q=&cg=5060&w=1&place=260&place=274&place=282&place=285&st=s&c=0&ca=23_11&is=1&l=0&md=th',
                'all'=>'',
            );
            
            if( ! in_array($county_id, array_keys($countiesLink))) {
                echo "The county_id  {$county_id} is not valid \n";
                return FALSE;
            }
            
            if($this->debug==1) {
                $this->mob=__DIR__ . '/../html/mob.html';
                $this->getAll();
            } 
            
            if($this->debug !=1) {
                $this->county_id=$county_id;
                // check if numeric then download only one page else iterate through all
                if(is_numeric($this->county_id)) {
                    echo "########################### Getting one county: $county_id ########################### \n";
                    // first page
                    $this->mob=$countiesLink[$this->county_id];
                    $this->getAll();
                } else { // iterate
                    echo "########################### Getting ALL counties ########################### \n";
                    sleep(2); $tmp = $this->countSkippedAds;
                    foreach ($countiesLink as $county_id=>$link) {
                        if(empty($link))
                            exit(0); // all=>''
                        // reset counter
                        $this->countAds=0;
                        
                        $this->countSkippedAds=$tmp;
                        $this->flagContinue=TRUE;
                        
                        $this->county_id=$county_id;
                        $this->mob=$countiesLink[$this->county_id];
                        $this->getAll();
                    }
                }
                
            }
            
            
		}

        private function getAll() {
            $this->domPage();
            $this->scrapPage();
            $count = 0;
            while ($this->flagContinue && $this->nextPage()) {
                $this->domPage();
                $this->scrapPage();
                echo "Counting Pages, This is page no $count \n";
                if($count > $this->countPages) {
                    echo "Count of pages reached $count and hence exiting \n";
                    return true;
                }
                $count++;
                // this is manager check if page processed already
            }
            return FALSE;
        }
        
        private function domPage() {
            echo PHP_EOL;
            echo  "Getting Company data from : " ;
            echo $this->mob . PHP_EOL;
            $html = file_get_html($this->mob);
            if(isset($html)) {
                $this->html=$html;
            } else {
                echo 'Cannot get: ' . $this->mob . PHP_EOL;
                exit;
            }
        }
        
		private function scrapPage() {
			// $html = file_get_html('http://www.blocket.se/stockholm?q=&cg=5060&w=1&st=s&c=0&ca=11&is=1&l=0&md=th');
			$this->count++;
            if($this->debug==1) {
                if($this->count > 3)
                    return;
            }
            
                
            $item_list = $this->html->find('div#center_bar > div#item_list', 0); // find the new files style
            if (isset($item_list)) {
                foreach ($item_list->find('div.item_row') as $item_row) {
                    
                    // counting Ads    
                    if($this->countAds > $this->countAdsLimit || $this->countSkippedAds < 1) {
                        echo "We reached Ads count limit {$this->countAds}\n";
                        $this->flagContinue=false;
                        return;
                    }

                    $desc=$item_row->find('div.desc',0);
                    if(!isset($desc))                        continue;
                    /* find date $date */
                    $list_date = $desc->find('div.list_date',0);
                    $date = $this->preg_matched('/(.*)\s<span/', $list_date->innertext);
                              
                    /* find time $time */
                    $list_time = $list_date->find('span.list_time',0);
                    $time = $list_time->innertext;
                    
                    /* name and details link $name $link */
                    $a = $desc->find('a.item_link', 0);
                    $link = $a->href;
                    
                    if($this->ad=='newad') {
                        if(preg_match('/(\d+)\.htm/', $link, $matches)) {
                            $linkPart= $matches[1];
                            $id = Ad::model()->linkExists($linkPart);
                            if($id !== FALSE) {
                                echo "This is old $linkPart \n";
                                $this->countSkippedAds--;
                                continue; // get next ad
                            } else {
                                echo "This $linkPart is new AD, so downloading ... \n";
                            }
                            sleep(3);
                        }
                    }
                    $name = trim($a->innertext);
                    
                    /* find price $price */
                    $p = $desc->find('p.list_price', 0);
                    if(isset($p))
                        $price = $this->preg_matched ('/([0-9\s]+)/', trim($p->innertext));
                   
                    /* find price reduction $priceDecline */
                    $priceDeclineImg = $p->find('img',0);
                    if(isset($priceDeclineImg))
                        $priceDecline=TRUE;
                    else 
                        $priceDecline=FALSE;
                    
                    /* find category $category */
                    $cat = $desc->find('div.cat_geo', 0);
                    $category = 'NA';
                    if(isset($cat)) {
                        foreach ($cat->find('a') as $a) {
                            $str = trim($a->innertext);
                            // $str = mb_convert_encoding($str, 'UTF-8', mb_detect_encoding($str, 'UTF-8, ISO-8859-1', true));
    
                            switch ($str) {
                                case 'Tillbehör':
                                    $category='Tillbehör';
                                    break 2;
                                case 'Telefoner':
                                    $category='Telefoner';
                                    break 2;
                            }
                        }
                    }
                    else 
                        $category = 'NA';
                    
                    /* find if its butik or private $butik */
                    $butikA=$cat->find('a.list_company_icon',0);
                    if(isset($butikA))
                        $butik=$butikA->href;
                    else 
                        $butik=FALSE;
                    
                    /* find list_area $area */
                    $spanA=$cat->find('span.list_area > a',0);
                    if(isset($spanA)) {
                        $area=trim($spanA->innertext);
                        $area=  str_replace('&hellip;', 'd', $area);
                        // $area =preg_replace("#[^A-Za-z0-9åäöÅÄÖ, ]#", '', $area);
                    }
                    else 
                        $area='NA';
                   
                    // get first page data only, check db if already exist
                    $description = $this->getDescription($link, $this->countAds);
                    $mob=$this->getPhone($link); // need htmlDesc
                    $data = array(
                       'name'=>$name,
                       'published'=>$date,
                       'time'=>$time,
                       'link'=>$link,
                       'price'=>$price,
                       'priceDecline'=>$priceDecline,
                       'category'=>$category,
                       'butik'=>$butik,
                       'area'=>$area,
                       'description'=> $description,
                       'contact'=> $mob,
                    );
                    
                    $ad_id = $this->saveToDb($data);
                    // check if images=down
                    if($this->ad=='down' || $this->ad=='newad') {
                        // download main image
                        $mainImage = $this->downloadImages($ad_id);
                        AdImage::model()->addImage($ad_id, $mainImage);
                        if($mainImage !== FALSE) echo "\nMain Image $mainImage \n";
                        $otherImages= $this->downloadOtherImages($ad_id); // need htmlDesc
                        print_r($otherImages);
                        // add images from here not from after save 
                        /** Save other images if exists */
                        if(is_array($otherImages)) {
                            foreach($otherImages as $otherImage) {
                                AdImage::model()->addImage($ad_id, $otherImage);
                            }
                            // print_r($this->otherImages);
                        }
                    }
                    
                    // counting Ads    
                    $this->countAds++;
                }
            }
            
		}
        
        private function preg_matched($pattern, $subject) {
            if(preg_match($pattern, $subject, $matches)) {
                return trim($matches[1]);
            } else {
                return 'NA';
            }
        }
        
        private function removeNonPrintable(array $data) {
            foreach ($data as $key=>$value) {
                if($key=='link')
                    continue;
                $data[$key]= preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x80-\x9F]/u', '', $value);;
            }
            return $data;
        }
        
        private function saveToDb(array $data) {
            $months = array(
                'januari',	'februari',	'mars',	'april',	'maj',	'juni',	'juli',	'augusti',	'september',	'oktober',	'november',	'december',
            );
            $data=$this->removeNonPrintable($data);
            // print_r($data); // return ;
            // $subject = 'http://www.blocket.se/stockholm/Sony_Xperia_s__flappy_bird__52780112.htm?ca=11&w=1';
            $subject = $data['link'];
            // format date
            if($data['published']=='Idag') {
                $data['published'] = date("Y-m-d ") . $data['time'];
            }
            
            if($data['published']=='Igår') {
                $data['published'] = date("Y-m-d ", strtotime("-1 days")) . $data['time'];
            }
            $split = explode(' ', $data['published']);
            
            if(in_array($split[1], $months)) {
                $data['published'] = date("Y-m-d ", strtotime($data['published'] . ' ' . date("Y"))) . $data['time'];
                $data['published'];
            }
            
            if(preg_match('/(\d+)\.htm/', $subject, $matches)) {
                $linkPart= $matches[1];
                $id = Ad::model()->linkExists($linkPart);
                $data['link']=$linkPart;
                if($id !==FALSE) {
                    $Ad = Ad::model()->findByPk($id);
                    $msg = "Updated successfully";
                } else {
                     $Ad = new Ad;
                     $msg = "Saved successfully";
                }
                
            }
            
            $Ad->scenario='data';
            $Ad->county_id = $this->county_id;
            
            $Ad->setAttributes($data);
            if($Ad->save(FALSE)) {
                echo $msg;
                return $Ad->id;
            } else {
                echo 'error in save';
                print_r($data);
                exit;
            }
            
        }
        
        protected function nextPage() {
            $pageA = $this->html->find('div#list_footer > div#pagination > div#all_pages > a', -1);
            if(isset($pageA)) {
                echo "\nNEXT PAGE: $pageA\n";
                $this->mob=$pageA->href;
                return TRUE;
            }
            echo $this->html;
            echo "All pages finished \n";
            return FALSE;
        }

        private function getDescription($link, $count) {
            
            echo PHP_EOL;
            echo  "{$count}:####### Getting description data from : " ;
            echo $link . PHP_EOL;
            $html = file_get_html($link);
            $this->htmlDesc=$html;
            
            if(! isset($html)) {
                echo 'Cannot get description: ' . $link . PHP_EOL;
                return 'NA';
            } 
            $body = $html->find('div#view_primary_content > div.view_container > div.span8 > div.body', 0);
            
            if(isset($body)) {
                // $this->downloadImages($html, $link);
                return preg_replace('!\s+!', ' ', trim($body->innertext));
            }
            
            
        }
        
        public function downloadImages($ad_id) {
            // echo "\n************* inside downloadImages() \n";
            $imgDir=__DIR__ . '/../../frontend/www/img/products/';
           
            $mainImg = $this->htmlDesc->find('img#main_image',0);
            if(isset($mainImg)) {
                $imgSrc= $mainImg->src;
                // echo "********** src = $imgSrc \n";
                if(isset($imgSrc)) {
                    $imgName= $ad_id .'_'. substr( strrchr( $imgSrc, '/' ), 1 );
                    echo "**********will save to $imgName Getting contents from $imgSrc \n";
                    file_put_contents($imgDir.'/'.$imgName, file_get_contents($imgSrc));
                    return $imgName;
                }
            } else {
                 echo "**********mainImg not set!! \n";
                 return FALSE;
            }
        }
        
        public function downloadOtherImages($ad_id) {
           // echo "\n************* inside downloadOtherImages() \n";
           $imgDir=__DIR__ . '/../../frontend/www/img/products/';
           $otherImages = array();
           
           $thumbs = $this->htmlDesc->find('ul#thumbs',0);
           
           if(isset($thumbs)) {
               // echo "\nthumbs present????\n";
               foreach ($thumbs->find('li.thumb_element') as $thumb_element) {
                   $a= $thumb_element->find('a.thumb_link',0);
                   if(isset($a)) {
                       $imgSrc=$a->href;
                       $imgName= $ad_id .'_'. substr( strrchr( $imgSrc, '/' ), 1 );
                       // download only images, avoid videos
                       if(substr( strrchr( $imgName, '.' ), 1 )=='jpg') {
                            file_put_contents($imgDir.'/'.$imgName, file_get_contents($imgSrc));
                            $otherImages[]=$imgName;
                       } else {
                           // echo '(((((((((((((((((((( unsuported image found' .PHP_EOL;
                       }
                   } else {
                       // echo '}}}}}}}}}}}} A not exists in download others ' . PHP_EOL;
                   }
               }
               
           } else {
               // echo $this->htmlDesc;
               echo "\nnot set :thumbs \n";
           }
           
           if(count($otherImages) > 0) {
               print_r($otherImages);
               return $otherImages;
           }
           // echo '}}}}}}}}}}}} returning false download others ' . PHP_EOL;
           
           return FALSE;
        }
         
        private function getPhone($descLink) {
            $imgDir=__DIR__ . '/../../frontend/www/img/';
            
            if(preg_match('#(\d+)\.htm#', $descLink, $matches)) {
                $list_id = $matches[1];
            }
            
            $spanHtml= $this->htmlDesc->find('div#view_secondary_content > ul#action_buttons > span#phonenumber_link',0);
            if(isset($spanHtml)) {
                $hash= $this->findHash($spanHtml);
//                echo "\n*************Hash found $hash \n";
                $url="http://www.blocket.se/vi/adreply_phonenumber_ajax.html?list_id={$list_id}&h={$hash}";
//                echo "\n>>>>>>>>> The URL is $url\n";
                $html= file_get_html($url);
                if(isset($html)) {
//                  echo ">>>>>>>>>>>>>>>>>>> checking html \n";
                    $img= $html->find('div.display_phonenumber_box > img',0);
                    if(isset($img)) {
//                      echo ">>>>>>>>>>>>>>>>>>> checking img \n";
                        $imgSrc=$img->src;
                        file_put_contents($imgDir.'ph'.$list_id.'.gif', file_get_contents($imgSrc));
                        $mob=$this->imageToText($imgDir.'ph'.$list_id);
                        return $mob;
                    }
                }
            }
            return FALSE;
        }
        
        private function findHash($spanHtml) {
            if(preg_match('#data-phonehash="([a-z0-9]+)"#', $spanHtml, $matches)) {
                return $matches[1];
            }
            // <span data-href="http://www.blocket.se/vi/adreply_phonenumber_ajax.html?list_id=52142816&amp;category=5061&amp;type=s&amp;no_salesmen=1" data-phonehash="6c0326624528e69c631762df6c4df6dfdf844711" onclick="xt_med('C', '', 'Visa_telefonnummer', 'A')" class="action_button" id="phonenumber_link"><span class="action_button_icon sprite_view_item_actions_phone"></span><span class="action_button_text">+33 - visa numret</span></span>
        }
        
        private function imageToText($id) {
            shell_exec("convert {$id}.gif {$id}.pbm");
            $output = shell_exec("ocrad {$id}.pbm");
            // remove both files
            shell_exec("rm {$id}.gif {$id}.pbm");
            return $output;
        }
	}