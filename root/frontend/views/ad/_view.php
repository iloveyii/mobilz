<div class="col-md-12"> <!-- col-md-12 minimizes space here -->
        <div class="row">
            <div class="col-md-3">
                <div class="thumbnail">
                    <a href="#">
                        <p>
                            <a href="<?php echo $data->getUrl($this->prevParams); ?>">
                            
                            <img style="height: 125px;" src="<?php echo $data->getPrimaryImagePath();?>" class="img-responsive">
                            
                            </a>
                        </p>
                        
                    </a>
                </div>
            </div>
            <div class="col-md-9">
                <p><?php echo $data->showPublished();?></p>
                <p><a href="<?php echo $data->getUrl($this->prevParams); ?>"><h4><?php echo CHtml::encode($data->name);?></h4></a></p>
                <p>SEK <?php echo $data->price ;?></p>
                <p><?php echo $data->showCities();?></p>
            </div>
        </div>
        <hr class="visible-xs visible-sm" />
    </div>