    <!-- Navigation bar with drop down box
    ================================================== -->
    <nav class="navbar" role="navigation" style="background: none repeat scroll 0 0 #676767;">
        <div class="container1">
            <div class="navbar-header">
                <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-ex1-collapse" style="background-color: #3373A5;">
                  <span class="sr-only">Menu</span>
                  <span class="icon-bar" style="background-color: #FFF;"></span>
                  <span class="icon-bar" style="background-color: #FFF;"></span>
                  <span class="icon-bar" style="background-color: #FFF;"></span>
                </button>
                <a class="navbar-brand" href="<?php echo Yii::app()->homeUrl;?>"><?php echo Yii::t('app','Hem') ; ?></a>
            </div>

            <!-- Collect the nav links, forms, and other content for toggling -->
            <div class="collapse navbar-collapse navbar-ex1-collapse">
                <ul class="navbar nav navbar-nav" id="main-menu">
                      <li class="dropdown">
                        <a class="dropdown-toggle" data-toggle="dropdown" href="<?php echo Yii::app()->createUrl('ad/index');?>"><?php echo Yii::t('app','Alla'); ?></a>
                            <?php echo $this->category; ?>
                      </li>
                      <li><a href="<?php echo Yii::app()->createUrl('ad/create');?>"><?php echo Yii::t('app','Lägg in Annons'); ?></a></li>
                      <?php if(Yii::app()->user->isGuest) : ?>
                        <li><a href="<?php echo Yii::app()->createUrl('user/create');?>"><?php echo Yii::t('app','Register'); ?></a></li>
                      <?php else :?>
                        <li><a href="<?php echo Yii::app()->createUrl('ad/myads');?>"><?php echo Yii::t('app','Mitt konto'); ?></a></li>
                      <?php endif;?>  
                      <?php 
                        if(Yii::app()->user->isGuest){
                            $url = Yii::app()->createUrl('site/login');
                            $text = 'Login';
                        } else {
                            $url = Yii::app()->createUrl('site/logout');
                            $text = 'Logout';
                        }  ?>
                      <li><a href="<?php echo $url; ?>"><?php echo $text; ?></a></li>
                      <li><a href="<?php echo Yii::app()->createUrl('site/contact');?>"><?php echo Yii::t('app','Kontakt'); ?></a></li>
                </ul>
                <form role="search" class="navbar-form navbar-right visible-xs">
                    <div class="input-group">
                      <input type="text" placeholder="Search" class="form-control">
                      <span class="input-group-btn">
                          <button type="submit" class="btn btn-red">Search!</button>
                      </span>
                    </div>
                </form>

              </div><!-- /.navbar-collapse -->

        </div><!-- /.container -->
    </nav>
    <!-- Navigation -->