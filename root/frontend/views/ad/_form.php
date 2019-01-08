<?php
/* @var $this AdController */
/* @var $model Ad */
/* @var $form CActiveForm */
?>


<?php $form=$this->beginWidget('bootstrap.widgets.FlatActiveForm', array(
	'id'=>'ad-form',
	'enableClientValidation'=>FALSE,
    'htmlOptions'=>array('enctype'=>'multipart/form-data', 'class'=>'well'),
    // 'type' => 'inline',
	'clientOptions'=>array(
		'validateOnSubmit'=>true,
	),
)); ?>
    <div class="col-md-12">
        <p class="note">Fields with <span class="required">*</span> are required.</p>
        <?php echo $form->errorSummary($model); ?>
    </div>
    
    <div class="col-md-6">
        <fieldset>
            <div class="form-group col-md-6 no-pad">
                <?php echo $form->labelEx($model,'product_id'); ?>
                <?php echo $form->dropDownList($model, 'product_id', $productsList, array('class'=>'form-control', 'style'=>'display:inline-block')) ;?>
            </div>
            <div class="form-group col-md-6 no-pad">
                <?php echo $form->labelEx($model,'company_id'); ?>
                <?php echo $form->dropDownList($model, 'company_id', $companiesList, array('class'=>'form-control', 'style'=>'display:inline-block')) ;?>
            </div>
            
            <div class="form-group col-md-10 no-pad">
                <?php echo $form->labelEx($model,'name'); ?>
                <?php $placeholder= $model->getAttributeLabel('name'); ?>
                <?php echo $form->userField($model,'name', array('class'=>'form-control','placeholder'=>"$placeholder")); ?>
            </div>
            
            <div class="form-group col-md-6 no-pad">
                <?php echo $form->telField($model,'mobile', array('class'=>'form-control inline','placeholder'=>"mobil")); ?>
            </div>
            <div class="form-group col-md-6 no-pad">
                <br />
                <?php echo $form->checkBoxRow($model,'hidemobile', array('class'=>'checkbox-inline', 'checked'=>'checked')); ?>
            </div>
            <div class="clear33"></div>
            <div class="form-group col-md-6 no-pad">
                <?php echo $form->labelEx($model,'county_id'); ?>
                <?php 
                echo $form->dropDownList($model, 'county_id', $countiesList,
                    array(
                        'ajax' => array(
                            'type'=>'POST', //request type
                            'url'=>$this->createUrl('site/getcities'), //url to call.
                            //Style: CController::createUrl('currentController/methodToCall')
                            'update'=>'#Ad_city_id', //selector to update
                            // 'data'=>'js: getTagData()' 
                            //leave out the data key to pass all form values through
                        ),
                        'class'=>'form-control', 'style'=>'display:inline-block',
                    )
                ); 
                ?>
            </div>
            <div class="form-group col-md-6 no-pad">
                <?php echo $form->labelEx($model,'city_id'); ?>
                <?php echo $form->dropDownList($model, 'city_id', $citiesList, array('class'=>'form-control', 'style'=>'display:inline-block')) ;?>
            </div>
            <div class="clear33"></div>
            <div class="form-group col-md-12 no-pad">
                <label>Selected Kommun</label>
                <div id="large" style="<?php echo $model->cityIdsError ;?>"></div>
                <input name="cityIds" id="cityIds" type="hidden" value='<?php echo $model->cityIds; ?>' />
                <?php 
                Yii::app()->clientScript->registerScript('tagsScriptt', "
                    var ids = $model->cityIds;
                    var tags;
                    $('#Ad_city_id').change(function(){
                        var id = $('#Ad_city_id').val();
                        var name = $('#Ad_city_id option:selected').text(); 
                        // getTagData(name, id);
                        tags.addTag(name);
                        addTo(name, id);
                        
                    });
                    
                    $(function() {
                        tags=$('#large').tags({
                          tagSize: 'lg',
                          suggestions: [],
                          tagData: [$model->tagData],
                          tagClass: 'btn-success',
                          // beforeAddingTag: function(){},
                          // afterAddingTag: function() {},
                          afterDeletingTag: function(tag) {removeTo(tag);},
                        });
                     });
                    
                    function addTo(name, id) {
                        ids[name]=id;
                        // alert(JSON.stringify(ids));
                        // $('#Ad_name').val(JSON.stringify(ids));
                        // $('#Ad_name').val(ids.join(','));
                        arrToText();
                    }
                    function removeTo(name) {
                        // tags.removeTag(name);
                        delete ids[name];
                        // $('#Ad_name').val(JSON.stringify(ids));
                        arrToText();
                        
                    }
                    
                    function arrToText() {
                        $('#cityIds').val(JSON.stringify(ids));
                    }
                ");
                
                ?>
            </div>
            
            <div class="clear33"></div>
            <div class="form-group">
                <div class="col-md-6 no-pad">
                    <?php echo $form->numberFieldRow($model, 'price', array('class'=>'form-control')); ?>
                </div>
            </div>
            
        </fieldset>
        
    </div><!-- col-md-6 -->
    <div class="col-md-6">
        <div class="form-group">
            <?php echo $form->labelEx($model,'rubrik'); ?>
            <?php echo $form->userField($model, 'rubrik', array('class'=>'form-control','placeholder'=>"$placeholder", 'hint'=>'Skriva ett online-beskrivning.')); ?>
        </div>

        <div class="form-group">
            <?php echo $form->fileFieldRow($model, 'image1', array('class'=>'form-control')); ?>
            <?php echo $form->fileFieldRow($model, 'image2', array('class'=>'form-control')); ?>
            <?php echo $form->fileFieldRow($model, 'image3', array('class'=>'form-control')); ?>
        </div>
    </div>
    
	<div class="row buttons">
	</div>
    <div class="col-md-12">
        <div class="form-group">
            <?php $this->widget('bootstrap.widgets.TbCKEditor', array(
                'model'=>$model,
                'attribute'=>'description',
                 'editorOptions'=>array(
                    'fullpage'=>'js:true', 
                    'width'=>'100%', 
                    'height'=>'200',
                    'toolbar'=>'js:[
                      ["DocProps","-","PasteText","PasteFromWord"],
                      ["Undo","Redo","-","RemoveFormat"],
                      ["Bold","Italic","Underline","Strike","Subscript","Superscript"],
                      ["NumberedList","BulletedList","-","Outdent","Indent"],
                      ["JustifyLeft","JustifyCenter","JustifyRight","JustifyBlock"],
                      ["Link","Unlink"],
                      ["Table","HorizontalRule","SpecialChar"],
                      ["Format","Font","FontSize","Styles"],
                      ["TextColor","BGColor"],
                      ["Maximize","ShowBlocks"],
                      ["BidiLtr", "BidiRtl"],
                    ],'
                
                )
                
            )); ?>
        </div>
    </div>
    <div class="col-md-12">
        <hr />
        <button type="submit" class="btn btn-primary btn-lg"> Spara </button>
        <button type="reset" class="btn btn-default btn-lg"> Reset </button>
    </div>
    <div class="clear33"></div>
<?php $this->endWidget(); ?>
   