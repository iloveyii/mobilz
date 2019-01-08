<?php

class CountyStats extends CWidget
{
    public $perRow = 4; // item, list
    public $noRows;
    public $list = array();
    public $class = array();
    public $show = 99;
    private $Counties = array();
    

    public function init()
    {
        // compute perRow for col-md-perRow
        $this->perRow = floor (12 / $this->perRow);
        // get db data
        $this->Counties = County::model()->findAll();
    }
 
    public function run()
    {
        $this->render('countystats', array(
            'perRow'=>  $this->perRow,
            'noRows'=>  $this->noRows,
            'show'=>  $this->show,
            'Counties'=> $this->Counties,
        ));
         
    }
}

