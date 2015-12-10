<?php
/*
Plugin Name: Database Manager
Plugin URI:  http://pemerkel.onucs.org
Description: Gives you the ability to create and manage tables within your wordpress database for a single site setup.
Version:     0.01
Author:      John Merkel
Author URI:  http://pemerkel.onucs.org
License:     GPL2
License URI: https://www.gnu.org/licenses/gpl-2.0.html
Domain Path: /languages
Text Domain: db-manager
*/

if( is_admin() ){
	require "hooked-functions.php";
	require "ajax-handler.php";

	//Hook in the admin menu
	add_action( 'admin_menu', 'dbm_admin_menu' );

	//Hook for custom icon
	add_action( 'admin_enqueue_scripts', 'load_custom_admin_styles' );

	//Hook the specific ajax requests
	add_action( 'wp_ajax_add_table',   'ajax_add_table' );
	add_action( 'wp_ajax_drop_table',  'ajax_drop_table' );
	add_action( 'wp_ajax_table_info',  'ajax_table_info' );
	add_action( 'wp_ajax_column_info', 'ajax_column_info' );
	add_action( 'wp_ajax_get_tables', 'ajax_get_tables' );
}
