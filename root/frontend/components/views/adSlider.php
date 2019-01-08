<div class="well">
    <div id="myCarousel" class="carousel slide">

        <!-- Carousel items -->
        <div class="carousel-inner">
            <?php 
                $active = 'active';
                foreach ($tableModels as $models) {
                    echo '<div class="item '.$active.'">'; $active='';
                        echo '<div class="row">';
                        $hiddenXs='';
                        foreach($models as $model) {
                            echo '<div class="col-sm-12 col-md-3 '.$hiddenXs.'"><a class="thumbnail" href="'.$model->getUrl().'"><img style="height:240px" src="'.$model->getPrimaryImagePath().'" alt="Image" class="img-responsive">'
                                    . '<div class="container shade-bg">
                                            <div class="carousel-caption shade-bg">
                                                <p>'.$model->name.'</p>
                                            </div>
                                        </div>'
                                    . '</a></div>';
                            $hiddenXs='hidden-xs';
                        }
                        echo '</div>'; //  <!--/row-->
                    echo '</div>'; //  <!--/item-->
                }
            ?>

        </div>
        <!--/carousel-inner--> <a class="left carousel-control" href="#myCarousel" data-slide="prev">‹</a>

        <a class="right carousel-control" href="#myCarousel" data-slide="next">›</a>
    </div>
    <!--/myCarousel-->
</div>
<!--/well-->

