    <!-- Footer and Modal -->
    <div class="container">
        <!-- Footer Top 
        =================================== -->
        <?php if($showFooterTop): ?>
        <div class="row">
            <div class="col-md-12">
                <div class="footer-top">
                    <div class="pull-left">
                        <a class="btn btn-success btn-sm" id="login-modal" data-toggle="modal"  href="#terms">Login</a>
                    </div>
                    <div class="pull-right">
                        Sign up today free <a class="btn btn-info btn-sm" href="<?php echo Yii::app()->createUrl('user/create');?>"><?php echo Yii::t('app','sign up'); ?></a>
                    </div>

                </div>
            </div>
        </div>
        <?php endif;?>
        
        <!-- Footer Middle 
        =================================== -->
        <div class="row">
            <div class="col-md-12">
                <div class="footer-middle">
                    <div class="col-md-4">
                        <div class="tricolumn">
                            <ul class="menulist">
                              <li><a href="<?php echo Yii::app()->homeUrl;?>">Hem</a></li>
                              <li><a href="#">Alla Butik</a></li>
                              <li><a href="<?php echo Yii::app()->createUrl('ad/index');?>">Alla Produkter</a></li>
                            </ul>
                        </div>
                    </div>

                    <div class="col-md-4  hidden-xs">
                        <div class="tricolumn">
                            <ul class="menulist">
                              <li><a href="<?php echo Yii::app()->createUrl('ad/url', array('product_slug'=>'mobiles'));?>">Mobiler</a></li>
                              <li><a href="<?php echo Yii::app()->createUrl('ad/url', array('product_slug'=>'tablet'));?>">Tabletter</a></li>
                              <li><a href="<?php echo Yii::app()->createUrl('ad/url',array('product_slug'=>'notebook'));?>">NoteBooks</a></li>
                            </ul>
                        </div>

                    </div>

                    <div class="col-md-4  hidden-xs">

                        <div class="tricolumn">
                            <ul class="menulist">
                               <li><a href="<?php echo Yii::app()->createUrl('user/create');?>">Registera</a></li>
                               <li><a href="#">Terms of use</a></li>
                               <li><a href="#">Support &amp; Contact Info</a></li>
                             </ul>
                       </div>
                    </div>
                </div>
            </div>
            <!-- Footer Bottom 
            =================================== -->
            <div class="col-md-12">
                <div class="footer-bot">
                    <p>Copyright &COPY; Mobilz Ab.
                        <a href="<?php echo Yii::app()->homeUrl;?>">Mobilz.se</a>
                    </p>
                    <!-- Modal -->
                    <?php $this->widget('Modallogin'); ?>
                    <!-- Modal -->
                </div>
           </div>

        </div>
    </div>
    <!-- /Footer and Modal -->