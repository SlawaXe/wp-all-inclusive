<?php
/**
 * The template for displaying 404 pages (not found)
 *
 * @link https://codex.wordpress.org/Creating_an_Error_404_Page
 *
 * @package Default Theme
 */

get_header(); ?>

	<div id="primary" class="content-area">
		<main id="main" class="site-main">

			<section class="error-404 not-found">

				<div class="page-content">
					<br>
					<br>
					<div class="container text-center">
						<p class="h1">ОШИБКА 404</p>

						<p class="h4">Запрашиваемая страница не найдена</p>
						<br>

						<a href="/" class="btn btn-primary btn-lg">На главную &nbsp;<i class="fa fa-reply"></i></a>
					</div>

				</div><!-- .page-content -->
			</section><!-- .error-404 -->

		</main><!-- #main -->
	</div><!-- #primary -->

<?php
get_footer();
