<?php
/**
 * YiiBooster project.
 * @license [New BSD License](http://www.opensource.org/licenses/bsd-license.php)
 */

/**
 * This class is extended version of {@link CActiveForm}, that allows you fully take advantage of bootstrap forms.
 * Basically form consists of rows with label, field, error info, hint text and other useful stuff.
 * TbActiveForm brings together all of these things to quickly build custom forms even with non-standard fields.
 *
 * Each field method has $rowOptions for customizing rendering appearance.
 * <ul>
 * <li>'label' - Custom label text</li>
 * <li>'labelOptions' - HTML options for label tag or passed to {@link CActiveForm::labelEx} call if 'label' is not set</li>
 * <li>'errorOptions' - HTML options for {@link CActiveForm::error} call</li>
 * <li>'prepend' - Custom text/HTML-code rendered before field</li>
 * <li>'prependOptions' - HTML options for prepend wrapper tag</li>
 * <li>'append' - Custom text/HTML-code rendered after field</li>
 * <li>'appendOptions' - HTML options for append wrapper tag</li>
 * <li>'hint' - Hint text rendered below the field</li>
 * <li>'hintOptions' - HTML options for hint wrapper tag</li>
 * <li>'enableAjaxValidation' - passed to {@link CActiveForm::error} call</li>
 * <li>'enableClientValidation' - passed to {@link CActiveForm::error} call</li>
 * </ul>
 *
 * Here's simple example how to build login form using this class:
 * <pre>
 * <?php $form = $this->beginWidget('bootstrap.widgets.TbActiveForm', array(
 *     'type' => 'horizontal',
 *     'htmlOptions' => array('class' => 'well'),
 * )); ?>
 *
 * <?php echo $form->errorSummary($model); ?>
 *
 * <?php echo $form->textFieldRow($model, 'username'); ?>
 * <?php echo $form->passwordFieldRow($model, 'password', array(), array(
 *     'hint' => 'Check keyboard layout'
 * )); ?>
 * <?php echo $form->checkBoxRow($model, 'rememberMe'); ?>

 * <div class="form-actions">
 *     <?php echo CHtml::submitButton('Login', array('class'=>'btn')); ?>
 * </div>
 *
 * <?php $this->endWidget(); ?>
 * </pre>
 *
 * Additionally this class provides two additional ways to render custom widget or field or even everything you want
 * with {@link TbActiveForm::widgetRow} and {@link TbActiveForm::customFieldRow}.
 * Examples are simply clear:
 * <code>
 * $form->widgetRow(
 *     'my.super.cool.widget',
 *     array('model' => $model, 'attribute' => $attribute, 'data' => $mydata),
 *     array('hint' => 'Hint text here!')
 * );
 *
 * // suppose that field is rendered via SomeClass::someMethod($model, $attribute) call.
 * $form->customFieldRow(
 *     array(array('SomeClass', 'someMethod'), array($model, $attribute)),
 *     $mode,
 *     $attribute,
 *     array(...)
 * );
 * </code>
 *
 * @see http://getbootstrap.com/2.3.2/base-css.html#forms
 * @see CActiveForm
 * @edited ali
 */

include_once( dirname(__FILE__) . "/TbActiveForm.php");

class FlatActiveForm extends TbActiveForm
{
    private $style = 'flat'; // flat or default
    private $icon = '';
    private $textField;
    private $append;


    public function init()
	{
        $this->textField = '';
        parent::init();
    }
    /**
     * Overriding the textField 
	 * Generates a text field row for a model attribute.
	 *
	 * This method is a wrapper for {@link CActiveForm::textField} and {@link customFieldRow}.
	 * Please check {@link CActiveForm::textField} for detailed information about $htmlOptions argument.
	 * About $rowOptions argument parameters see {@link TbActiveForm} documentation.
	 *
	 * @param CModel $model The data model.
	 * @param string $attribute The attribute.
	 * @param array $htmlOptions Additional HTML attributes.
	 * @param array $rowOptions Row attributes.
	 * @return string The generated text field row.
	 * @see CActiveForm::textField
	 * @see customFieldRow
	 */
	public function userField($model, $attribute, $htmlOptions = array(), $rowOptions = array())
	{
        $this->textField='';
        $this->icon = '<i class="fa fa-user"></i>';
        return $this->getTextField($model, $attribute, $htmlOptions, $rowOptions);
	}
    
	public function dropDownList($model,$attribute,$data,$htmlOptions=array())
	{
        if(!isset($htmlOptions['class']))
            $htmlOptions['class']='form-control';
        
        $this->icon = '<i class="fa fa-bars"></i>';
        $this->textField = parent::dropDownList($model, $attribute, $data, $htmlOptions);
        
        return $this->getTextField($model, $attribute, $htmlOptions);
	}
    
	public function autoComplete($model,$attribute,$source,$htmlOptions=array())
	{
        if(!isset($htmlOptions['class']))
            $htmlOptions['class']='form-control';
        if(isset($htmlOptions['append']))
            $this->append=$htmlOptions['append'];
        
        if(isset($htmlOptions['iconClass'])) { // set it
            $this->icon ='<i class="'.$htmlOptions['iconClass'].'"></i>';
        } else { // default
            $this->icon = '<i class="fa fa-bars"></i>';
        }
        
        $this->textField = $this->widget('zii.widgets.jui.CJuiAutoComplete', array(
                'name'=>$attribute,
                'attribute'=>$attribute,
                'model'=>$model,
                'source'=>$source,
                'options'=>array(
                        'showAnim'=>'fold',
                ),
                'htmlOptions'=>$htmlOptions
            ),
            TRUE
        );
        
        return $this->getTextField($model, $attribute, $htmlOptions);
	}
    
	public function dateField($model=null,$name=false, $attribute=false,$options=array(),$htmlOptions=array())
	{
        if(!isset($htmlOptions['class']))
            $htmlOptions['class']='form-control';
        
        if(isset($htmlOptions['iconClass'])) { // set it
            $this->icon ='<i class="'.$htmlOptions['iconClass'].'"></i>';
        } else { // default
            $this->icon = '<i class="fa fa-calendar"></i>';
        }
        if($name===FALSE && $attribute===FALSE)
            throw new CHttpException(501, 'You must provide either name or attribute propery for dateField');
        
        if($name === false) { // with model
            $settings = array(
                'options'=>$options,
                'attribute' => 'date',
                'model'=>$model,
                'htmlOptions'=>$htmlOptions,
            );
        } else { // without model
            $settings = array(
                'name'=>$name,
                'options'=>$options,
                'htmlOptions'=>$htmlOptions,
            );
        }
        $this->textField = $this->widget('bootstrap.widgets.TbDatePicker',
                $settings,
                TRUE
            ); 
        
        return $this->getTextField($model, $attribute, $htmlOptions);
	}
    
	public function textField($model, $attribute, $htmlOptions = array(), $rowOptions = array())
	{
        if(!isset($htmlOptions['class']))
            $htmlOptions['class']='form-control';
        
        $this->textField='';
        
        if(isset($htmlOptions['iconClass'])) { // you need flat
            $this->icon ='<i class="'.$htmlOptions['iconClass'].'"></i>'; 
            return $this->getTextField($model, $attribute, $htmlOptions, $rowOptions);
        } else { // else normal
            return parent::textField($model, $attribute, $htmlOptions, $rowOptions);
        }
	}
    
	public function passwordField($model, $attribute, $htmlOptions = array(), $rowOptions = array())
	{
        if(!isset($htmlOptions['class']))
            $htmlOptions['class']='form-control';
        
        $this->textField='';
        
        if(isset($htmlOptions['iconClass'])) { // you need flat
            $this->icon ='<i class="'.$htmlOptions['iconClass'].'"></i>'; 
            $this->textField = parent::passwordField($model, $attribute, $htmlOptions, $rowOptions);
            return $this->getTextField($model, $attribute, $htmlOptions, $rowOptions);
        } else { // else normal
            return parent::passwordField($model, $attribute, $htmlOptions, $rowOptions);
        }
	}
    
    public function emailField($model, $attribute, $htmlOptions = array(), $rowOptions = array())
	{
        $this->icon = '<i class="fa fa-envelope-o"></i>';
        $this->textField= parent::emailField($model, $attribute, $htmlOptions, $rowOptions);
        
        return $this->getTextField($model, $attribute, $htmlOptions, $rowOptions);
	}
    
    public function urlField($model, $attribute, $htmlOptions = array(), $rowOptions = array())
	{
        $this->icon = '<i class="fa fa-globe"></i>';
        $this->textField= parent::urlField($model, $attribute, $htmlOptions, $rowOptions);
        
        return $this->getTextField($model, $attribute, $htmlOptions, $rowOptions);
	}
    
    public function numberField($model, $attribute, $htmlOptions = array(), $rowOptions = array())
	{
        $this->icon = '<i class="fa fa-keyboard-o"></i>';
        $this->textField= parent::numberField($model, $attribute, $htmlOptions, $rowOptions);
        
        return $this->getTextField($model, $attribute, $htmlOptions, $rowOptions);
	}
    
    public function dateField2($model, $attribute, $htmlOptions = array(), $rowOptions = array())
	{
        $this->icon = '<i class="fa fa-calendar"></i>';
        $this->textField= parent::dateField($model, $attribute, $htmlOptions, $rowOptions);
        
        return $this->getTextField($model, $attribute, $htmlOptions, $rowOptions);
	}
    
    public function timeField($model, $attribute, $htmlOptions = array(), $rowOptions = array())
	{
        $this->icon = '<i class="fa fa-clock-o"></i>';
        $this->textField= parent::dateField($model, $attribute, $htmlOptions, $rowOptions);
        
        return $this->getTextField($model, $attribute, $htmlOptions, $rowOptions);
	}
    
    public function fileField($model, $attribute, $htmlOptions = array(), $rowOptions = array())
	{
        if(!isset($htmlOptions['class']))
            $htmlOptions['class']='form-control';
        $this->textField = '';
        $this->icon = '<i class="fa fa-paperclip"></i>';
        $htmlOptions['style']='
            width:20%; float:right;float: right;
            opacity: 0;position: absolute;
            width: 20%;z-index: 999;
            filter: alpha(opacity = 0);-ms-filter: "alpha(opacity=0)";
            cursor: pointer; _cursor: hand;line-height: 0;
            ';
        
        $tmpId = ucfirst($model->tableName()).'_'.$attribute.'_tmp';
        $tmpName = $tmpId;
        $fileControlId = ucfirst($model->tableName()).'_'.$attribute;
        
        
        Yii::app()->clientScript->registerScript("$fileControlId"," 
            $('#{$fileControlId}').change(function(){
                $('#{$tmpId}').val($('#{$fileControlId}').val());
            });
        ");
        $this->textField .= CHtml::textField($tmpName, '', array('id'=>$tmpId, 'style'=>'width:70%','class'=>'form-control'), $rowOptions);
        // $this->textField .= CHtml::fileField($fileControlName, '', $htmlOptions);
        $this->textField .= parent::fileField($model, $attribute , $htmlOptions);
        $this->textField .= CHtml::button($model->isNewRecord ? 'Upload' : 'Update',array('class'=>'btn btn-success btn-sm','style'=>'display:inline-block; width:20%;',));
        return $this->getTextField($model, $attribute, $htmlOptions, $rowOptions);
	}
    
    public function dataListField($model, $attribute, $htmlOptions = array(), $rowOptions = array())
	{
        $this->textField = '';
        $this->icon = '<i class="fa fa-list-alt"></i>';
        if(isset($htmlOptions['list'])) {
            $dataListId = $htmlOptions['list'];
        }
        $dataList = '';
        if(isset($rowOptions['dataList'])) {
            $dataList = "<datalist id='{$dataListId}'>";
            foreach ($rowOptions['dataList'] as $value) {
                $dataList .= "<option value='{$value}' />";
            }
            $dataList .= "</datalist>";
        }
            
        $this->textField = parent::textField($model, $attribute, $htmlOptions, $rowOptions);
        $this->textField .= $dataList;
        
        return $this->getTextField($model, $attribute, $htmlOptions, $rowOptions);
	}
    
    public function telField($model, $attribute, $htmlOptions = array(), $rowOptions = array())
	{
        $this->icon = '<i class="fa fa-mobile"></i>';
        if(isset($htmlOptions['type']))
        $this->icon = $htmlOptions['type'] == 'mobile' ? '<i class="fa fa-mobile"></i>':'<i class="fa fa-phone"></i>';
        
        $this->textField= parent::telField($model, $attribute, $htmlOptions, $rowOptions);
        
        return $this->getTextField($model, $attribute, $htmlOptions, $rowOptions);
	}
    
    private function getTextField($model, $attribute, $htmlOptions = array(), $rowOptions = array())
	{
        if(!isset($htmlOptions['class']))
            $htmlOptions['class']='form-control';
        
        if(empty($this->textField))
            $this->textField= parent::textField($model, $attribute, $htmlOptions, $rowOptions);
        
        $style = '';
        if(! empty($this->append))
            $style='style="width:80%;float:left;"';
        return 
        "<div {$style} class='control-group flat-group'>"
            .$this->icon
            .$this->textField
            .'<div class="flat-container"></div>'.
        '</div>'
        .$this->append;
	}
}
