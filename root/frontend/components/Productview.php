<?php

class Productview extends CWidget
{
    public $style; // item, list
    public $models;
    public $prevParams;


    public function init()
    {
        // allowed styles for view
        $styles=array(
            'item',
            'list',
        );
        
        if(isset(Yii::app()->session['view'])) {
            $this->style=Yii::app()->session['view'];
        }
        
        if(! in_array($this->style, $styles)) {
            echo 'The valid styles are ';
            print_r($styles);
            return;;
        }
    }
 
    public function run()
    {
        switch ($this->style) {
            case 'item':
                $this->render('productitem', array(
                    'style'=>  $this->style,
                    'models'=>  $this->models,
                    'prevParams'=>  $this->prevParams,
                ));
                break;
            
            case 'list':
               $this->render('productlist', array(
                    'style'=>  $this->style,
                    'models'=>  $this->models,
                    'prevParams'=>  $this->prevParams,
                ));
               break; 
                
            default:
                break;
        }
         
    }
}

