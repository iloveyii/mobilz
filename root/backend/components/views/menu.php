<!-- Navigation bar with drop down box
================================================== -->
<nav style="margin-bottom: 0" role="navigation" class="navbar navbar-default navbar-static-top">
    <div class="navbar-header">
        <button data-target=".sidebar-collapse" data-toggle="collapse" class="navbar-toggle" type="button">
            <span class="sr-only">Toggle navigation</span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
        </button>
        <a href="index.html" class="navbar-brand">Admin Panel</a>
    </div>
    <!-- /.navbar-header -->

        <ul class="nav navbar-top-links navbar-right">
        <li class="dropdown">
            <a href="#" data-toggle="dropdown" class="dropdown-toggle">
                <i class="fa fa-tasks fa-fw"></i>  <i class="fa fa-caret-down"></i>
            </a>
            <ul class="dropdown-menu dropdown-alerts">
                <li>
                    <a href="<?php echo Yii::app()->createUrl('site/next') ;?>">
                        <div>
                            <i class="fa fa-crop fa-fw"></i> Crop Images
                            <span class="pull-right text-muted small">4 minutes ago</span>
                        </div>
                    </a>
                </li>
                <li class="divider"></li>
                <li>
                    <a href="<?php echo Yii::app()->createUrl('site/nextEdit') ;?>">
                        <div>
                            <i class="fa fa-credit-card fa-fw"></i> Edit Product
                            <span class="pull-right text-muted small">12 minutes ago</span>
                        </div>
                    </a>
                </li>
                <li class="divider"></li>
                <li><a href="<?php echo Yii::app()->createUrl('seo/index');?>"><i class="fa fa-globe fa-fw"></i> SEO Settings</a>

            </ul>
            <!-- /.dropdown-alerts -->
        </li>
        <!-- /.dropdown -->
        <li class="dropdown">
            <a href="#" data-toggle="dropdown" class="dropdown-toggle">
                <i class="fa fa-user fa-fw"></i>  <i class="fa fa-caret-down"></i>
            </a>
            <ul class="dropdown-menu dropdown-user">
                <li><a href="#"><i class="fa fa-user fa-fw"></i> User Profile</a>
                </li>
                <li><a href="#"><i class="fa fa-gear fa-fw"></i> Settings</a>
                </li>
                <li class="divider"></li>
                <?php if(Yii::app()->user->isGuest) {
                    $href= Yii::app()->createUrl('backend/login');
                    $label= 'Login';
                } else {
                    $href= Yii::app()->createUrl('backend/logout');
                    $label= 'Logout';
                }
                
                ?>
                <li><a href="<?php echo $href;?>"><i class="fa fa-sign-out fa-fw"></i> <?php echo $label;?></a>
                </li>
                
            </ul>
            <!-- /.dropdown-user -->
        </li>
        <!-- /.dropdown -->
    </ul>
    <!-- /.navbar-top-links -->

</nav>
<!-- Navigation -->