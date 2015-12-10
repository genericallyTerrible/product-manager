<?php
//Make sure the much necessary server side function_exists
//are already loaded.
require_once 'server-functions.php';

function ajax_add_table(){
	$table_name  = $_POST['table_name'];
	$column_info = $_POST['column_info'];
	$unique_key  = $_POST['unique_key'];
	return_and_finish( add_table( $table_name, $column_info, $unique_key ));
}

function ajax_drop_table(){
	return_and_finish( drop_table( $_POST['table_name'] ));
}

function ajax_table_info(){
	global $wpdb;
	$table_name = $_POST['table_name'];
	$results = get_table_info( $table_name );
	return_and_finish( $results );
}

function ajax_column_info(){
	return_and_finish( get_column_info( $_POST['table_name'], $_POST['column_name'] ));
}

function ajax_get_tables(){
	return_and_finish( get_table_names());
}

function return_and_finish( $results ){
	ob_clean(); //Clears anything lingering in the output buffer
	echo json_encode( $results );
	wp_die();
}
