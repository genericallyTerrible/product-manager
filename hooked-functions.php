<?php
require_once "server-functions.php";

$local = 0;
$custom = 1;
$script = 2;
$style = 3;

function load_custom_admin_styles() {
	global $local, $style;
	full_enqueue( $local, $style, 'custom_icon', 'font.css' );
}

function dbm_install()
{

}

function dbm_uninstall()
{

}

function dbm_admin_menu(){
	add_menu_page(
    'Database Management Plugin',
    'Database Management',
    'manage_options',
    'dbm-options',
    'dbm_options_page'
  );
}

function dbm_options_page(){
	if( !current_user_can( 'manage_options' ))
	{
		wp_die( 'You do not have sufficient permissions to access this page.' );
	}
	generate_options_page();
}

function generate_options_page(){
	global $local, $custom, $script, $style, $wpdb;
	$db_name = get_db_name();
	full_enqueue( $custom, $script, 'jquery', "https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js" );
	full_enqueue( $local, $script, 'block-ui', 'jquery-plugins/jquery.blockUI.js');
	full_enqueue( $local,  $style,  'dbm-admin-style', 'style.css' );

	$ajaxData = [
		'ajax_url' => admin_url( 'admin-ajax.php' ),
		'wpdp_prefix' => $wpdb->prefix,
		'wpdb_name' => $db_name,
		'wpdb_tables' => get_table_names()
	];
	localizeScript( $local, 'dbm-admin-script', 'client-functions.js', 'ajax_obj', $ajaxData );
	//full_enqueue($local, $script,  'dbm-admin-script', 'client-functions.js');

	echo generate_top_menu();
	echo generate_input_area();
	echo generate_table_list_container($db_name, get_table_names());

	// echo $db_name . "<br>";
	// $table_names = get_table_names();
	// foreach($table_names as $handle)
	// {
	// 	echo '"' . $handle . '"' . "<br>";
	// }
}

function full_enqueue( $locationType, $registrationType, $handle, $location ){
	global $local, $custon, $script, $style;
	$fullLocation;

	if( $locationType == $local ){
		$fullLocation = plugin_dir_url( __FILE__ ) . $location;
	}
	else {
		$fullLocation = $location;
	}

	if( $registrationType == $script ){
		wp_deregister_script( $handle );
		wp_register_script( $handle, $fullLocation );
		wp_enqueue_script( $handle );
	}
	else if( $registrationType == $style ){
		wp_deregister_style( $handle );
		wp_register_style( $handle, $fullLocation );
		wp_enqueue_style( $handle );
	}
}

function localizeScript( $locationType, $handle, $location, $dataName, $data ){
	global $local, $custom;
	$fullLocation;

	if( $locationType == $local ){
		$fullLocation = plugin_dir_url( __FILE__ ) . $location;
	}
	else {
		$fullLocation = $location;
	}

	wp_deregister_script( $handle );
	wp_register_script( $handle, $fullLocation );
	wp_localize_script( $handle, $dataName, $data );
	wp_enqueue_script( $handle );
}

function generate_top_menu(){
	$buttonClasses = "class=\"button action\"";
	$return = "
	<div id=\"db_controls\">
		<button id=\"add_new_table\"$buttonClasses>Add Table</button>
		<span class=\"button_spacer\"></span>
		<button id=\"drop_selected_table\"$buttonClasses disabled>Drop Table</button>
	</div>";
	return $return;
}

function generate_input_area(){
	$return = "
	<div id=\"db_input_div\">
		<div id=\"replaceable\">
		</div>
	</div>
	";
	return $return;
}

function generate_table_list_container( $db_name, $table_names ){
	$return = "
	<div id=\"db_table_list_container\">
    </div>";
	return $return;
	/*
	<ul id=\"db_table_list\" class=\"db_table_list\">
	<li class=\"noMargin\"><span id=\"show_hide_wp_tables\" class=\"db_table_head\" title=\"Show/hide default wordpress tables\"> $db_name </span></li>";

$class = "";
foreach( $table_names as $table_name )
{
	$return .= "<li class=\"table_name\">$table_name</li>";
}

$return .= "</ul>
*/
}
