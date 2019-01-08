<?php
/**
 *  Extending CLinkPager so that we can give it a custom css file for UL
 */

class LinkPager extends CLinkPager
{
    const CSS_DISABLED_PAGE='disabled';
    
    public function __construct() {
        $this->header='';
        $this->selectedPageCssClass='active';
        $this->prevPageLabel='&laquo;';
        $this->nextPageLabel='&raquo;';
//        $this->lastPageCssClass= self::CSS_DISABLED_PAGE;
//        $this->firstPageCssClass= self::CSS_DISABLED_PAGE;
        $this->hiddenPageCssClass= self::CSS_DISABLED_PAGE;
        $this->htmlOptions=array('style'=>'margin:0px', 'class'=>'pagination');
    }
    
}