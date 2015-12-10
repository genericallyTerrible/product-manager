<?php

function get_db_name() {
	global $wpdb;
	return $wpdb->dbname;
}

function get_default_prefix() {
	global $wpdb;
	return $wpdb->prefix;
}

function get_table_names() {
	global $wpdb;
	$returnArray;
	$i = 0;
	$db_name = get_db_name();
	$tables = $wpdb->get_results( "SHOW TABLES IN $db_name" );
	foreach( $tables as $table ) {
		$table = get_object_vars( $table ); //Convert stdClass to array
		$returnArray[$i++] = array_values( $table )[0]; //Get the table name from the array
	}
	return $returnArray;
}

/* Example add_table usage
$table_info = [
	"id mediumint(9) NOT NULL AUTO_INCREMENT",
	"location varchar(100) DEFAULT '' NOT NULL",
	"type varchar(3) DEFAULT '' NOT NULL"
];
$unique = "UNIQUE KEY id (id)";
add_table("asdf", $table_info, $unique);

drop_table("asdf");
*/

function add_table( $table_name, $column_info, $uniqueStatement ) {
	global $wpdb;
	if( $wpdb->get_var( "SHOW TABLES LIKE '$table_name'" ) != $table_name ) {
		//Get the collation
		$charset_collate = $wpdb->get_charset_collate();

		//Create MySQL statement for making the table
		$sql = "CREATE TABLE $table_name (\n";

		foreach( $column_info as $info ) {
			$sql .= "\t" . $info . ",\n";
		}
		$sql .= "\t" . $uniqueStatement . "
".  ") $charset_collate;";

		//Get dbDelta
		require_once( ABSPATH . 'wp-admin/includes/upgrade.php' );
		$e = dbDelta( $sql ); //Pass the sql to create the table
		return [$e, $sql];
		//echo "<br>" . str_replace("\n", "<br>", $sql) . "<br>";
		// echo "<br>Table add: ";
		// var_dump($e);
	}	else
			return false;
}

function drop_table( $table_name ) {
	global $wpdb;
	$e = $wpdb->query( "DROP TABLE IF EXISTS $table_name" );
	// echo "<br>Table drop: ";
	// var_dump($e);
	return $e;
}

function edit_table( $table_name, $sql ) {
	global $wpdb;
}

function get_table_info( $table_name ) {
	global $wpdb;
	$table_results = $wpdb->get_results( "SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE table_name = '$table_name'" );
	return $table_results;
}

function get_column_info( $table_name, $column_name ) {
	global $wpdb;
	$results = $wpdb->get_results( "SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE table_name = '$table_name' AND column_name = '$column_name'" );
	return $results;
}

function get_rows( $table_name, $limit ) {
		global $wpdb;
		if( $limit != 0 ){
			$table_results = $wpdb->get_results( "SELECT * FROM $table_name LIMIT $limit" );
		} else {
			$table_results = $wpdb->get_results( "SELECT * FROM $table_name" );
		}
		return $table_results;
}
