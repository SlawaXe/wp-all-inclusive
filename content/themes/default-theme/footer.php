<?php
/**
 * The template for displaying the footer
 *
 * Contains the closing of the #content div and all content after.
 *
 * @link https://developer.wordpress.org/themes/basics/template-files/#template-partials
 *
 * @package Default Theme
 */

?>

	</div><!-- #content -->
</div><!-- #page -->

<footer id="colophon" class="site-footer">
  <div class="container">
    
  </div>
</footer><!-- #colophon -->

<!-- Popup callblack -->
<!-- 
<div id="popup-callblack-2" class="white-popup mfp-hide">

  <form action="<?php echo get_template_directory_uri() ?>/processes-callblack.php" id="form-callblack-2" name="form-callblack" method="post">
    <p class="form-title text-center h4">Оставь заявку на обратный звонок и получи скидку</p>
    <br>
    <input type="text" name="name" class="form-control" placeholder="ИМЯ" autocomplete="off" required>
    <input type="text" name="phone" class="form-control" placeholder="ТЕЛЕФОН" autocomplete="off" required>
    <input type="hidden" value="<?php echo get_option('admin_email') ?>" name="to-email">
    <input type="hidden" value="<?php echo get_option('blogname ') ?>" name="site-name">
    <textarea name="comments" class="hide"></textarea>

    <button type="submit" class="btn btn-primary pull-right">ЗАКАЗАТЬ</button>
    
    <div class="clearfix"></div>

    <div class="form-success">
      <p class="form-success-title">Ваша заявка отправлена!</p>

      <p>Мы перезвоним вам в ближайшее время.</p>
    </div>
  </form>
</div>
-->
<!--/Popup callblack-->

<?php wp_footer(); ?>

</body>
</html>
