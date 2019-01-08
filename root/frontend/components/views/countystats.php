<ul class="list-inline"> 
<?php $count = 0;  ?>
<?php foreach ($Counties as $County) : ?>

    <?php $count++; if($count > $show) {break;}  ?>    
                                               
    <li class="col-md-<?= $perRow; ?>" style="padding-left: 5px;">
        <a href="<?php echo Yii::app()->createUrl("ad/url", array('county_slug'=>$County->slug) );?>"><?= $County->name; ?> (<?= $County->countAd(); ?>)</a>
    </li>

<?php endforeach;?>
</ul>