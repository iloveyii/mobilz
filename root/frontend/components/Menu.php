<?php

class Menu extends CWidget
{
    public $type; // WhiteHouse, Gray
    public $category;
    public $active;
    public $menus;

    public function init()
    {
        $this->menus = array(
            'Hem'=>'',
            'Kategori'=>'',
            'Lägg in Annons'=>'',
            'Mitt konto'=>'',
            'Login'=>'',
            'Registera'=>'',
            'Kontakt'=>'',
        );
        
        // set active menu
        if(!empty($this->active)) {
            if(isset($this->menus[$this->active])) {
                $this->menus[$this->active]='active';
            }
        }
        // allowed styles for view
        $types=array(
            'whiteHouse',
            'Gray',
        );
        
        if(! in_array($this->type, $types)) {
            $this->type = $types[0];
        }
    }
 
    public function run()
    {
        switch ($this->type) {
            case 'whiteHouse':
                $this->render('menuWhiteHouse', array(
                    'category'=>  $this->category,
                    'active'=>  $this->menus,
                ));
                break;
            
            case 'Gray':
               $this->render('menuGray', array(
                ));
               break; 
                
            default:
                break;
        }
         
    }
}

