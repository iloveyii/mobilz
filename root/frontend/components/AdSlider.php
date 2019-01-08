<?php

class AdSlider extends CWidget
{
    private $tableModels;
    
    public $rows=99;
    public $perRow=4;
    public function init()
    {
        $criteria = new CDbCriteria;
        $criteria->limit=40;
        $criteria->order="published DESC";
        $models = Ad::model()->findAll($criteria);
        $totalModels=count($models);
        // distribute to table
        for($offset=0; $offset < $totalModels; $offset+=$this->perRow) {
            $this->tableModels[]=  array_slice($models, $offset, $this->perRow);
        }
        
    }
 
    public function run()
    {
        $this->render('adSlider', array(
            'tableModels'=>  $this->tableModels,
        ));

    }
}

