<ul class="list-inline"> 
<?php $count = 0;  ?>
<?php foreach ($list as $slug=>$name) : ?>

    <?php $count++; if($count > $show) {break;}  ?>    
                                               
    <li class="col-md-<?= $perRow; ?>" style="padding-left: 5px;">
        <a href="<?php echo Yii::app()->createUrl("ad/url", array('product_slug'=>$product_slug, 'company_slug'=>$slug) );?>"><?= $name; ?>(<?= $companyCount[$slug]; ?>)</a>
    </li>

<?php endforeach;?>
</ul>