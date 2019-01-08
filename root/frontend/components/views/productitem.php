    <div class="items"> <!-- col-md-12 minimizes space here -->
        <?php foreach ($models as $model): ;?>
            <div class="col-md-3">
                <div class="thumbnail product-item">
                    <a href="#">
                        <img style="height: 125px; width: 100%;" src="<?php echo $model->getPrimaryImagePath();?>">
                    </a>
                    <div class="caption">
                        <h4><?php echo substr($model->name,0,15);?></h4>
                        <p>SEK <?php echo $model->price ;?></p>
                        <p>
                            <a class="btn btn-default" href="<?php echo $model->getUrl($prevParams); ?>">Visa mer</a>
                        </p>
                    </div>
                </div>
            </div>
        <?php endforeach;?>
    </div>