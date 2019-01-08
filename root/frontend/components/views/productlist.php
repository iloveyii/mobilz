    <div class="col-md-12"> <!-- col-md-12 minimizes space here -->
        <?php foreach ($models as $model): ;?>
        <div class="row">
            <div class="col-md-3 product-list">
                <div class="thumbnail" >
                    <a href="<?php echo $model->getUrl($prevParams); ?>">
                        <img style="height: 125px; width: 100%" src="<?php echo $model->getPrimaryImagePath();?>">
                    </a>
                    
                </div>
            </div>
            <div class="col-md-9">
                <p><?php echo $model->showPublished();?></p>
                <p><a href="<?php echo $model->getUrl($prevParams); ?>"><h4><?php echo CHtml::encode($model->name);?></h4></a></p>
                <p>SEK <?php echo $model->price ;?></p>
                <p><?php echo $model->showCities();?></p>
            </div>
        </div>
        <hr class="visible-xs visible-sm" />
        <?php endforeach;?>
    </div>