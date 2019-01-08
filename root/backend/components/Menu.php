<?php
Yii::import('zii.widgets.CPortlet');

/**
 * Login Widget
 * Displays the modal login box
 */
class Menu extends CPortlet
{
	public $title='';
	
    public function init()
    {
        parent::init();
    }
 
    protected function renderContent()
    {
        $this->render('menu');
    }
}
?>