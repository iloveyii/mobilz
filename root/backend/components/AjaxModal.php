<?php
Yii::import('zii.widgets.CPortlet');

/**
 * Player Widget
 * Displays the matches of a player in a Modal 
 */
class AjaxModal extends CPortlet
{
	public $title='';
	
    public function init()
    {
        parent::init();
    }
 
    protected function renderContent()
    {
        $form=new LoginForm;
        if(isset($_POST['LoginForm']))
        {
            $form->attributes=$_POST['LoginForm'];
            if($form->validate() && $form->login()) {
				$this->controller->redirect(Yii::app()->user->returnUrl);
            } 
        }
        $this->render('ajaxModal',array('form'=>$form));
    }
}
?>