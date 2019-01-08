<?php


class ProductUrl extends CBaseUrlRule
{
    /**
     * Types of createUrl
     * 1: product/
     * 2: product/company/
     * 3: product/company/county/
     * 4: product/company/county/city/
     * 5: NBS: if lang param is give and is not sv then precede all above by lang/url...
     * 
     * @param type $manager
     * @param type $route
     * @param type $params
     * @param type $ampersand
     * @return boolean
     */
 
    public function createUrl($manager,$route,$params,$ampersand)
    {
        // check route for this action 
        if ($route==='ad/url') // this is just an indentifier in createUrl command
        {
            $slugs=array(
                'product_slug',
                'company_slug',
                'county_slug',
                'city_slug',
            );
            
            $return = '';
            // check which slugs are set in params
            foreach ($slugs as $slug) {
                if(isset($params[$slug])) { // then check if it exists in DB
                    // echo "This is set $slug <br>";
                    $param=$params[$slug];
                    if($this->ModelSlugExists($slug, $param)) {
                        $return .= "{$param}/";
                    }
                }
            }
            
            // check for detail view
            if(isset($params['a'])) {
               $return .= $params['a'] ;
            }
            
            // check for detail view with secondary image
            if(isset($params['image_id'])) {
               $return .= '_' . $params['image_id'];
            }
            if(isset($params['a']) || isset($params['image_id']) ) 
            $return .= '/'; // neither of the two about shud add /
            
            if(isset($params['n'])) {
               $return .= $params['n'] . '/';
            }
            
            // check pagination
            if(isset($params['p'])) {
                $return .='p/'. $params['p'];
            }
            
            return $return;
        }
        return false;  // this rule does not apply
    }
 
    public function parseUrl($manager,$request,$pathInfo,$rawPathInfo)
    {
        
        $slugs=array(
            'product_slug',
            'company_slug',
            'county_slug',
            'city_slug',
        );
        $paramFound = false;
        // let me decompose 
        $params= explode('/', $pathInfo);
        // print_r($params);
        
        foreach ($params as $key=>$param) {
            // check which params are set in url
            foreach ($slugs as $slug) {
                if($this->ModelSlugExists($slug, $param)) {
                    $_GET[$slug]=$param;
                    // echo "found $param";
                    $paramFound=TRUE;
                    // since we found it we want to remove it, so it should not
                    // be repeated for next params iteration
                    unset($params[$key]);
                    continue 2; // don't need to search in other models, once found
                }
            }
        } 
        
        // pregmatch for a1234 = ad_id 
        if(preg_match('#a(\d+)/#', $pathInfo, $matches)) {
            $a=$matches[1];
            $paramFound=TRUE;
            $_GET['a']=$a;
        }
        
        // pregmatch for a1234_1253 = ad_id _ image_id
        if(preg_match('#a(\d+)_(\d+)/#', $pathInfo, $matches)) {
            $a=$matches[1]; // a=ad_id
            $image_id=$matches[2]; // image_id
            $paramFound=TRUE;
            $_GET['a']=$a;
            $_GET['image_id']=$image_id;
        }
        
        // check for n = name of ad , eg samsung-galaxy-s4
        if(preg_match('#a\d+/([\w\-]+)#', $pathInfo, $matches)) {
            $n=$matches[1];
            $paramFound=TRUE;
            $_GET['n']=$n;
        }
        
        // @TBD check for p
        if(preg_match('#/p/(\d+)$#', $pathInfo, $matches)) {
            $p=$matches[1];
            $paramFound=TRUE;
            $_GET['p']=$p;
        }
        
        // check for savedsearch
        if(preg_match('#savedsearch$#', $pathInfo, $matches)) {
           return 'ad/savedsearch'; 
        }
        
        if($paramFound)
            return 'ad/url';
        else 
            return FALSE; 
        
    }
    
    /**
     * It loads model by slug and finds if parameter exists in it
     * 
     * @param string $slug slug type representing model, e.g. product_slug
     * @param string $param value of slug to be searched in model
     * @param boolean $exceptionOnNull whether to throw exception if the model is not found. Defaults to true.
     * @return boolean
     * @throws CHttpException
     */
    protected function ModelSlugExists($slug, $param, $exceptionOnNull = true) {
		// extract model from slug
        $slugArray= explode('_', $slug);
        $class=  ucfirst($slugArray[0]); // this is the class of the model
        
        $model = CActiveRecord::model($class)->findByAttributes(array('slug'=>$param));
        if (isset($model))
                return TRUE;
        else 
            return FALSE;
//            if ($exceptionOnNull)
//			throw new CHttpException(404, 'Unable to find the requested object in ProductUrl.');
    }
}