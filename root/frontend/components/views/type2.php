
<?php $count = 0;  ?>
<?php foreach ($list as $slug=>$name) : ?>

    <?php $count++; if($count > $show) {break;}  ?>    
    <div class="col-md-<?= $perRow; ?> text-center">
        <div class="featurette-item">
          <a href="<?php echo Yii::app()->createUrl("ad/url", array('product_slug'=>$slug) );?>"><i class="<?php echo $class[$slug]; ?>"></i></a>
          <h4><a href="<?php echo Yii::app()->createUrl("ad/url", array('product_slug'=>$slug) );?>"><?php echo $name; ?></a></h4>
        </div>
    </div>

<?php endforeach;?>