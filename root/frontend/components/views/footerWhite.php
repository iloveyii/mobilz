    <!-- Footer and Modal -->
    <div class="container">
        <div class="row">
            <div class="col-md-12">
                <hr />
                <div class="footer-middle" style="background-color: #FFF; border-top: none; padding: 0px;">
                <div class="col-md-4 no-pad">
                    <div class="tricolumn">
                        <ul class="menulist">
                          <li><a href="<?php echo Yii::app()->homeUrl;?>">Hem</a></li>
                          <li><a href="#">Alla Butik</a></li>
                          <li><a href="<?php echo Yii::app()->createUrl('ad/index');?>">Alla Produkter</a></li>
                        </ul>
                    </div>
                </div>

                <div class="col-md-4  no-pad hidden-phone">
                    <div class="tricolumn">
                        <ul class="menulist">
                          <li><a href="<?php echo Yii::app()->createUrl('ad/url', array('product_slug'=>'mobiles'));?>">Mobiler</a></li>
                          <li><a href="<?php echo Yii::app()->createUrl('ad/url', array('product_slug'=>'tablet'));?>">Tabletter</a></li>
                          <li><a href="<?php echo Yii::app()->createUrl('ad/url',array('product_slug'=>'notebook'));?>">NoteBooks</a></li>
                        </ul>
                    </div>
                </div>

                <div class="col-md-4  no-pad hidden-phone">

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
    </div>
        <br />
    </div>
    <!-- /Footer and Modal -->