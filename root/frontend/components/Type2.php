<?php

class Type2 extends CWidget
{
    public $perRow; // item, list
    public $noRows;
    public $list;
    public $class;
    public $show;

    public function init()
    {
        // compute perRow for col-md-perRow
        $this->perRow = floor (12 / $this->perRow);
        // init here
        $this->list = CHtml::listData(Product::model()->findAllByAttributes(array('type'=>2)), 'slug', 'name');
        $this->class = CHtml::listData(Product::model()->findAllByAttributes(array('type'=>2)), 'slug', 'class');
    }
 
    public function run()
    {
        $this->render('type2', array(
            'perRow'=>  $this->perRow,
            'noRows'=>  $this->noRows,
            'list'=>  $this->list,
            'class'=>  $this->class,
            'show'=>  $this->show,
        ));
         
    }
}

