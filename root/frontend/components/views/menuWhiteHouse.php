<div class="container" style="margin-bottom: 85px;">
    <!-- Fixed Navigation bar with drop down box
    ================================================== -->
    <div class="navbar navbar-default navbar-fixed-top" role="navigation">
        <div class="navbar-inner">
            <div class="container" style="height: 80px;">
            <div class="navbar-header"> <!-- header -->
                <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                </button>
                <a class="navbar-brand" href="<?php echo Yii::app()->homeUrl;?>"><?php echo CHtml::image(Yii::app()->baseUrl.'/img/logo.png', 'Mobilz'); ?></a>
            </div>   
            <div class="navbar-collapse collapse"> <!-- body -->
                <ul class="navbar nav navbar-nav navbar-right" style="border: none; background-color:#FFF">
                    <li><a class="<?php echo $active['Hem'];?>" href="<?php echo Yii::app()->homeUrl;?>"><?php echo Yii::t('app','Hem'); ?></a></li>
                    <li class="dropdown">
                        <a class="<?php echo $active['Kategori'];?>"  class="dropdown-toggle" data-hover="dropdown" data-toggle="dropdown" href="<?php echo Yii::app()->createUrl('ad/index');?>"><?php echo Yii::t('app','Kategori'); ?></a>
                        <?php echo $category; ?>
                    </li>
                    <li><a class="<?php echo $active['Lägg in Annons'];?>" href="<?php echo Yii::app()->createUrl('ad/create');?>"><?php echo Yii::t('app','Lägg in Annons'); ?></a></li>
                    <?php if(Yii::app()->user->isGuest) : ?>
                        <li><a class="<?php echo $active['Registera'];?>" href="<?php echo Yii::app()->createUrl('user/create');?>"><?php echo Yii::t('app','Registera'); ?></a></li>
                    <?php else :?>
                        <li><a class="<?php echo $active['Mitt konto'];?>" href="<?php echo Yii::app()->createUrl('ad/myads');?>"><?php echo Yii::t('app','Mitt konto'); ?></a></li>
                    <?php endif;?> 

                    <?php 
                        if(Yii::app()->user->isGuest){
                            $url = Yii::app()->createUrl('site/login');
                            $text = 'Logga in';
                        } else {
                            $url = Yii::app()->createUrl('site/logout');
                            $text = 'Logga ut';
                        }  
                    ?>
                    <li><a class="<?php echo $active['Login'];?>" href="<?php echo $url; ?>"><?php echo $text; ?></a></li>
                    <li><a class="<?php echo $active['Kontakt'];?>" href="<?php echo Yii::app()->createUrl('site/contact');?>"><?php echo Yii::t('app','Kontakt'); ?></a></li>
                </ul>
            </div>

        </div>
        </div>
    </div> <!-- Navigation -->
</div>