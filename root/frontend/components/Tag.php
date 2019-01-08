<?php

class Tag extends CWidget
{
    public $model; // WhiteHouse, Gray
    public $showCount=30;
    public $type;
    public $urlParams;


    private $models;

    public function init()
    {
        
        // set active menu
        if(empty($this->model) OR empty($this->urlParams)) {
            throw new CHttpException(500, 'Model name/urlParams cannot be empty in Tag widget.');
        }
        
        $criteria = new CDbCriteria;
        $criteria->limit=  $this->showCount;
        if(!empty($this->type)) {
            $criteria->condition="type={$this->type}";
        }
        
        $this->models = CActiveRecord::model($this->model)->findAll($criteria);
        if (! isset($this->models))
                return FALSE;
        
    }
 
    public function run()
    { 
        $val = reset($this->urlParams);
        $key = key($this->urlParams);
        
        $tags='';
        foreach($this->models as $model) {
            $tags .= "<a  class='label label-success' href='".Yii::app()->createUrl('ad/url',array($key=>$model->$val))."'>".strtolower($model->name)."</a> ";
        }
        echo $tags;
    }
}

