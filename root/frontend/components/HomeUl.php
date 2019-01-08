<?php

class HomeUl extends CWidget
{
    public $perRow = 4; // item, list
    public $noRows;
    public $list = array();
    public $class = array();
    public $show = 99;
    public $product_id = 0;
    public $product_slug = 'mobiles';
    private $companyCount = array();
    

    public function init()
    {
        // compute perRow for col-md-perRow
        $this->perRow = floor (12 / $this->perRow);
        // get db data
        $companies = Company::model()->findAll();
        $this->list = CHtml::listData($companies, 'slug', 'name');
        $this->class = CHtml::listData($companies, 'slug', 'class');
        // find the no of ADs for each company
        $this->companyCount = Ad::model()->getAdCount($this->product_id, FALSE, $companies);
    }
 
    public function run()
    {
        $this->render('homeul', array(
            'perRow'=>  $this->perRow,
            'noRows'=>  $this->noRows,
            'list'=>  $this->list,
            'class'=>  $this->class,
            'show'=>  $this->show,
            'companyCount'=> $this->companyCount,
            'product_slug'=> $this->product_slug,
        ));
         
    }
}

