<div class="col-md-6">
        <div class="form-group">
            hello
            	<?php 
                
                $this->widget(
                    'booster.widgets.TbSelect2',
                    array(
                    'asDropDownList' => false,
                    'name' => 'clevertech',
                    'options' => array(
                    'tags' => array('clever', 'is', 'better', 'clevertech'),
                    'placeholder' => 'type clever, or is, or just type!',
                    'width' => '40%',
                    'tokenSeparators' => array(',', ' ')
                    )
                    )
                    );
                ?>
            
           <?php $form = $this->beginWidget(
                'booster.widgets.TbActiveForm',
                array(
                'id' => 'horizontalForm',
                'type' => 'horizontal',
                )
                ); ?>
            <?php 
            $model=  new User;
            echo $form->datePickerGroup(
                $model,
                'name',
                array(
                'widgetOptions' => array(
                'options' => array(
                'language' => 'en',
                ),
                ),
                'wrapperHtmlOptions' => array(
                'class' => 'col-sm-5',
                ),
                'hint' => 'Click inside! This is a super cool date field.',
                'prepend' => '<i class="fa fa-user"></i>'
                )
                ); ?>
            
            
            
            <?php 
                echo $form->emailFieldGroup($model, 'name', array(
                    'hint' => 'Click inside! This is a super cool date field.',
                    'prepend' => '<i class="fa fa-envelope-o"></i>'
                ));
                $this->endWidget();
                unset($form); 
            ?>
        </div>
    </div>