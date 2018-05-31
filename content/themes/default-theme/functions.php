<?php
/**
 * Default Theme functions and definitions
 *
 * @link https://developer.wordpress.org/themes/basics/theme-functions/
 *
 * @package Default Theme
 */

if ( ! function_exists( 'default_theme_setup' ) ) :
    /**
     * Sets up theme defaults and registers support for various WordPress features.
     *
     * Note that this function is hooked into the after_setup_theme hook, which
     * runs before the init hook. The init hook is too late for some features, such
     * as indicating support for post thumbnails.
     */
    function default_theme_setup() {
        /*
         * Make theme available for translation.
         * Translations can be filed in the /languages/ directory.
         * If you're building a theme based on Default Theme, use a find and replace
         * to change 'default_theme' to the name of your theme in all the template files.
         */
        load_theme_textdomain( 'default_theme', get_template_directory() . '/languages' );

        // Add default posts and comments RSS feed links to head.
        add_theme_support( 'automatic-feed-links' );

        /*
         * Let WordPress manage the document title.
         * By adding theme support, we declare that this theme does not use a
         * hard-coded <title> tag in the document head, and expect WordPress to
         * provide it for us.
         */
        add_theme_support( 'title-tag' );

        /*
         * Enable support for Post Thumbnails on posts and pages.
         *
         * @link https://developer.wordpress.org/themes/functionality/featured-images-post-thumbnails/
         */
        add_theme_support( 'post-thumbnails' );

        // This theme uses wp_nav_menu() in one location.
        register_nav_menus( array(
            'menu-1' => esc_html__( 'Primary', 'default_theme' ),
        ) );

        /*
         * Switch default core markup for search form, comment form, and comments
         * to output valid HTML5.
         */
        add_theme_support( 'html5', array(
            'search-form',
            'comment-form',
            'comment-list',
            'gallery',
            'caption',
        ) );

        // Add theme support for selective refresh for widgets.
        add_theme_support( 'customize-selective-refresh-widgets' );

        /**
         * Add support for core custom logo.
         *
         * @link https://codex.wordpress.org/Theme_Logo
         */
        add_theme_support( 'custom-logo', array(
            'height'      => 250,
            'width'       => 250,
            'flex-width'  => true,
            'flex-height' => true,
        ) );
    }
endif;
add_action( 'after_setup_theme', 'default_theme_setup' );

/**
 * Set the content width in pixels, based on the theme's design and stylesheet.
 *
 * Priority 0 to make it available to lower priority callbacks.
 *
 * @global int $content_width
 */
function default_theme_content_width() {
    $GLOBALS['content_width'] = apply_filters( 'default_theme_content_width', 640 );
}
add_action( 'after_setup_theme', 'default_theme_content_width', 0 );

/**
 * Register widget area.
 *
 * @link https://developer.wordpress.org/themes/functionality/sidebars/#registering-a-sidebar
 */
function default_theme_widgets_init() {
    register_sidebar( array(
        'name'          => esc_html__( 'Sidebar', 'default_theme' ),
        'id'            => 'sidebar-1',
        'description'   => esc_html__( 'Add widgets here.', 'default_theme' ),
        'before_widget' => '<section id="%1$s" class="widget %2$s">',
        'after_widget'  => '</section>',
        'before_title'  => '<h2 class="widget-title">',
        'after_title'   => '</h2>',
    ) );
}

// add_action( 'widgets_init', 'default_theme_widgets_init' );

/**
 * Enqueue scripts and styles.
 */
function default_theme_scripts() {
   // wp_enqueue_style( 'default_theme-style-min', get_template_directory_uri() . '/style.min.css');

    wp_enqueue_script( 'default_theme-custom', get_template_directory_uri() . '/js/main.min.js', array(), '20151215', true );

    wp_deregister_script('jquery');
    wp_enqueue_script('jquery');


    if ( is_singular() && comments_open() && get_option( 'thread_comments' ) ) {
        wp_enqueue_script( 'comment-reply' );
    }
}
add_action( 'wp_enqueue_scripts', 'default_theme_scripts' );

add_action( 'get_header', 'css_in_head');
function css_in_head( $name ){
    $css_content = file_get_contents(get_stylesheet_directory_uri() . '/style.min.css');
    echo '<style>' . $css_content . '</style>';
}


/**
 * Clear phone
 */
function clear_phone( $phone_str ) {
    $phone_str = str_replace( array( ' ', '(', ')', '-' ), array( '', '', '', '' ), $phone_str );

    return $phone_str;
}

/**
 * Advance images size
 */
// add_image_size( 'medium-2', 400, 290 );

/**
 * Remove useless scripts and styles
 */
remove_action('wp_head', 'print_emoji_detection_script', 7);
remove_action('wp_print_styles', 'print_emoji_styles');

remove_action( 'admin_print_scripts', 'print_emoji_detection_script' );
remove_action( 'admin_print_styles', 'print_emoji_styles' );

/*  Page general setting ACF
*/
/*
if( function_exists('acf_add_options_page') ) {
    
    acf_add_options_page(array(
        'page_title'    => 'Настройки темы',
        'menu_title'    => 'Настройки темы',
        'menu_slug'     => 'theme-general-settings',
        'capability'    => 'edit_posts',
        'redirect'      => false,
        'position'      => 6
    ));

    // Sub page
    acf_add_options_sub_page(array(
        'page_title'  => 'Sub page',
        'menu_title'  => 'Sub page',
        'menu_slug'   => 'subpage',
        'parent_slug' => 'theme-general-settings',
    ));
}
*/

/*  Tiny MCE setting
*/
function my_theme_add_editor_styles() {
    add_editor_style( '/inc/custom-editor-style.css' );
}

add_action( 'init', 'my_theme_add_editor_styles' );

// Customize mce editor font sizes
if ( ! function_exists( 'wpex_mce_text_sizes' ) ) {
    function wpex_mce_text_sizes( $initArray ){
        $initArray['fontsize_formats'] = "10px 12px 14px 16px 18px 20px 21px 22px 24px 26px 28px 30px 32px 34px 36px 38px";
        return $initArray;
    }
}

add_filter( 'tiny_mce_before_init', 'wpex_mce_text_sizes' );

/**
 * Turn off [...] form the end of the post
 */
function new_excerpt_more($more) {
    return '...';
}

// add_filter('excerpt_more', 'new_excerpt_more');

/**
 * New Excerpt Length
 */
function new_excerpt_length($length) {
    return 10;
}

// add_filter('excerpt_length', 'new_excerpt_length');

/**
 * Shortcods
 */
function site_year(){
    return date('Y');
}

add_shortcode('year', 'site_year');

/**
 * Styles and scripts in admin
 */
function admin_styles_and_scripts() {
    wp_enqueue_style("style-custom-admin", get_bloginfo('stylesheet_directory') . "/inc/style-admin.css");
    wp_enqueue_script("script-custom-admin", get_bloginfo('stylesheet_directory') . "/inc/script-admin.js");
}
// add_action('admin_head', 'admin_styles_and_scripts');

/**
 * Custom template tags for this theme.
 */
require get_template_directory() . '/inc/template-tags.php';

/**
 * Functions which enhance the theme by hooking into WordPress.
 */
require get_template_directory() . '/inc/template-functions.php';

/**
 * Customizer additions.
 */
require get_template_directory() . '/inc/customizer.php';