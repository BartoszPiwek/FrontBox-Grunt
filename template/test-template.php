<?php
// VAR

// dafault posts
$args = array(
  'posts_per_page' => 12,
  'cat' => '-83',
);
$the_query = new WP_Query( $args );
$counter = 0;

// featured posts
$args = array(
    'posts_per_page' => 0,
    'meta_key' => 'meta-checkbox',
    'meta_value' => 'yes',
    'cat' => '-83',
);
$the_query_featured = new WP_Query($args);

// popular posts
$args = array(
  'posts_per_page' => 3,
  'cat' => '-83',
  'meta_key'=> 'popular_posts',
  'orderby'=> 'meta_value_num',
  'order'=> 'DESC',
);
$the_query_popular = new WP_Query( $args );

//===== CAROUSEL
if (have_posts()) : while (have_posts()) : the_post(); ?>
<div class="carousel-wrap">
  <div id="carousel-homepage" class="carousel slide" data-ride="carousel">

    <!-- home page content -->
    <?php the_content(); ?>

    <!-- Control -->
    <a class="left carousel-control svg" href="#carousel-homepage" role="button" data-slide="prev">
      <span aria-hidden="true"><?php add_svg('arrow-left'); ?></span>
      <span class="sr-only">Previous</span>
    </a>
    <a class="right carousel-control svg" href="#carousel-homepage" role="button" data-slide="next">
      <span aria-hidden="true"><?php add_svg('arrow-right'); ?></span>
      <span class="sr-only">Next</span>
    </a>

  </div>
</div>
<?php endwhile; endif; ?>
<!-- END CAROUSEL -->


<!-- CATEGORY NEW -->
<div class="posts">
  <div class="posts-label">
    <p class="block">
      najnowsze
    </p>
  </div>

  <div class="row row--gap-25 row-flex">

  <?php
    while ($counter < 2 && $the_query -> have_posts()) : $the_query -> the_post();
      show_post_column("col md_col-6 post post--expand");
      $counter++;
    endwhile;
    wp_reset_postdata();
  ?>
  </div>
</div>
<!-- END CATEGORY NEW -->

<!-- CATEGORY POPULAR -->
<div class="posts posts--medium">
  <div class="posts-label">
    <div class="block">
      popularne
    </div>
  </div>
  <div class="row row--gap-25 row-flex">

    <?php
      while ( $the_query_popular->have_posts() ) : $the_query_popular->the_post();
        show_post_column('col md_col-6 lg_col-4 post post--expand');
      endwhile;
      wp_reset_postdata();
    ?>

  </div>
</div>
<!-- END CATEGORY POPULAR -->


<!-- CATEGORY ARTICLE -->
<div class="posts posts--medium posts--small-gap">
  <div class="posts-label">
    <div class="block">
      artykuły
    </div>
  </div>

<!-- TOP -->
<div class="row row--gap-17">
  <?php
    while ($counter < 6) : $the_query -> the_post();
      show_post_column('col md_col-6 lg_col-3 post', false);
      $counter++;
    endwhile;
  ?>
</div>

<!-- CENTER -->
<div class="row row--gap-17 row--gap-ignore">
  <!-- CENTER LEFT -->
  <div class="col  lg_col-3 post post--responsive-no-gap">
    <div class="row row--gap-17 row--gap-ignore_lg">
      <?php
      while ($counter < 8) : $the_query -> the_post();
        show_post_column('post post--side md_col-6 lg_col-12', false);
        $counter++;
      endwhile;
      ?>
    </div>
  </div>

<!-- CENTER CENTER -->
  <div class="col  lg_col-6 post post--responsive-no-gap">
    <div class="row">
      <?php
      if ($the_query_featured->have_posts()): $the_query_featured->the_post();
        show_post_column("post post--no-gap");
      endif;
      ?>
      <div class="row row--gap-17">
      <?php
      while ($counter < 10) : $the_query -> the_post();
        show_post_column('post md_col-6 lg_col-6', false);
        $counter++;
      endwhile;
      ?>
    </div>
    </div>
</div>

<!-- CENTER RIGHT -->
<div class="col lg_col-3 post post--responsive-no-gap">
  <div class="row row--gap-17 row--gap-ignore_lg ml-420 sm_dupa lg_dupsko lg_dupa">
  <?php
    while ($counter < 12) : $the_query -> the_post();
      show_post_column('post md_col-6 lg_col-12 post--side', false);
      $counter++;
    endwhile;
    wp_reset_postdata();
  ?>
  </div>
</div>

</div>
</div>
<!-- BOTTOM -->
</div>
<!-- END CATEGORY ARTICLE -->
