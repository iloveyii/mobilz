<?php

class Footer extends CWidget
{
    public $type; // black, white
    public $showFooterTop=true;

    public function init()
    {
        
        // set active menu
        if(empty($this->type)) {
            $this->type='black';
        }
        // allowed styles for view
        $types=array(
            'black',
            'white',
        );
        
        if(! in_array($this->type, $types)) {
            $this->type = $types[0];
        }
    }
 
    public function run()
    {
        switch ($this->type) {
            case 'black':
                $this->render('footerBlack', array(
                    'showFooterTop'=> $this->showFooterTop,
                ));
                break;
            
            case 'white':
               $this->render('footerWhite', array(
                ));
               break; 
                
            default:
                break;
        }
         
    }
}

