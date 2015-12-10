//jquery code here
jQuery( document ).ready( function( $ ) {

	var ajax_url = ajax_obj.ajax_url;
	var wpdb_prefix = ajax_obj.wpdp_prefix;
	var wpdb_name = ajax_obj.wpdb_name;
	var wpdb_tables = ajax_obj.wpdb_tables;
	var show = false;

	var default_wpdb_tables = [
		wpdb_prefix + "commentmeta",
		wpdb_prefix + "comments",
		wpdb_prefix + "links",
		wpdb_prefix + "options",
		wpdb_prefix + "postmeta",
		wpdb_prefix + "posts",
		wpdb_prefix + "termmeta",
		wpdb_prefix + "terms",
		wpdb_prefix + "term_relationships",
		wpdb_prefix + "term_taxonomy",
		wpdb_prefix + "usermeta",
		wpdb_prefix + "users"
	];

	$( window ).load( function() {
		generate_table_list();
		hide_wp_tables();
	});

	//$("#db_table_list_container").width($("#db_table_list").outerWidth(true) + 5);
	$( "div#db_table_list_container" ).on( "click", "#show_hide_wp_tables", function() {
		var selected = $( ".selected" );
		if( !show ) {
			show_wp_tables();
			toggle_selected( selected );
		} else {
			hide_wp_tables();
			if( selected.css( "opacity", 1 )) {
				toggle_selected( selected );
			}
		}
	});

	//Toggle if a table is selected
	$( "div#db_table_list_container" ).on( "click", ".table_name", function() {
		toggle_selected( $( this ));
	});

	//Add a new table
	$( "#add_new_table" ).click( function() {
		ajax_add_table( "New_Table", ["id mediumint(9) NOT NULL AUTO_INCREMENT"], "UNIQUE KEY id (id)" );
	});

	//Drop selected table
	$( "#drop_selected_table" ).click( function() {
		var table_name = $(".selected").text();
		if( confirm( "Are you sure you want to drop " + table_name + "?" )) {
			ajax_drop_table( table_name );``
		}
	});

	//Toggle if a table is selected
	function toggle_selected( table ) {
		//if table exists and isn't selected
		if ( table.length && !table.is( ".selected" )) {
			//enable the drop table button
			$( "#drop_selected_table" ).prop( "disabled", false);
			//deselect the previous table (if it exists)
			$( ".selected" ).toggleClass( "selected" );
			//Get the information about the new table
			// ajax_table_info( table.text());
		} else {
			//The table is being de-selected
			$( "#drop_selected_table" ).prop( "disabled", true);
		}
		//Toggle the state of the clicked table
		table.toggleClass( "selected" );
	}

	//Set even or odd classes for all the table names
	function classify_li() {
		var results = $( ".table_name" );
		var odd = true;
		for( var i = 0; i < results.length; i++ ) {
			if ( odd )
				$( results[i] ).attr( "class", "table_name odd" );
			else
				$( results[i] ).attr( "class", "table_name even" );
			odd = !odd;
		}
	}

	//Shows all tables in the WP database
	function show_wp_tables() {
		show = true;
		toggle_default_tables();
		classify_li();
	}

	//Hides default WP database tables so only
	//client created tables are shown
	function hide_wp_tables() {
		show = false;
		toggle_default_tables();
		var results = $( ".table_name" );
		var odd = true;
		for( var i = 0; i < results.length; i++ ) {
			if ( $.inArray( results[i].textContent, default_wpdb_tables ) == -1 ) {
				if (odd)
					$(results[i]).attr( "class", "table_name odd" );
				else
					$(results[i]).attr( "class", "table_name even" )

				odd = !odd;
			}
		}
	}

	//Toggles the visibility of default WP tables
	function toggle_default_tables() {
		var results = $( ".table_name" );
		for( var i = 0; i < results.length; i++ ) {
			if ( $.inArray( results[i].textContent, default_wpdb_tables ) != -1 ) {
				$( results[i] ).toggle( 500 );
			}
		}
	}

	//Changes an html items class after a predetermined delay(ms)
	function change_class_on_delay( htmlObject, newClass, delay ) {
		setTimeout( function() {
			$( htmlObject ).attr( "class", newClass );
		}, delay );
	}

	//Dump information about an object into the console
	function dump( obj ) {
		var out = "";
		for( var i in obj ) {
			out += i + ": " + obj[i] + "\n";
		}
		console.log( out );
	}

	//AJAX Functions
	function ajax_add_table( table_name, column_info, unique_key ) {
		$.blockUI();
		var response = $.ajax({
			type: "post",
			url: ajax_url,
			data: {
				action: "add_table",
				table_name: table_name,
				column_info: column_info,
				unique_key: unique_key
			}
		});

		response.done( function( response ) {
			var results = $.parseJSON( response );
			// $.each( results, function( key, value ) {
			// 	console.log(value);
			// });
			if( !$.isEmptyObject( results[0] )) //Changes were made
				ajax_get_tables();
		});

		response.always( function() {
			$.unblockUI();
		});
	}

	function ajax_drop_table( table_name ) {
		$.blockUI();
		var request = $.ajax({
			type: "post",
			url: ajax_url,
			data: {
				action: "drop_table",
				table_name: table_name
			}
		});

		request.done( function( response ) {
			var results = $.parseJSON( response );
			// console.log(results);
			ajax_get_tables();
		});

		request.always( function( response ) {
			$.unblockUI();
		});
	}

	function ajax_table_info( table_name ) {
		var request = $.ajax({
			type: "post",
			url: ajax_url,
			data: {
				action: "table_info",
				table_name: table_name
			}
		});

		request.done( function( response ) {
			var results = $.parseJSON( response );
			//console.log( results ); //Major debugging help.
			var table_names = "";
			if( results != null ) {
				$.each( results, function( column, column_info ) {
					table_names += column_info["COLUMN_NAME"] + ", "
					//console.log( column_info["COLUMN_NAME"] );
					ajax_column_info( table_name, column_info["COLUMN_NAME"] );
				});
				table_names = table_names.substring( 0, table_names.length - 2 );
				console.log( table_names );
			} else {
				console.log( "Table has no structure." )
			}
		});

	}

	function ajax_column_info( table_name, column_name ) {
		var request = $.ajax({
			type: "post",
			url: ajax_url,
			data: {
				action: "column_info",
				table_name: table_name,
				column_name: column_name
			}
		});

		request.done( function ( response ) {
			var results = $.parseJSON( response );
			console.log( results[0] );
			if( results[0] != null ) {
				$.each( results[0], function( key, value ) {
					if( key == "COLUMN_NAME" )    console.log( "COLUMN_NAME: "    + value );
					if( key == "COLUMN_TYPE" )    console.log( "COLUMN_TYPE: "    + value );
					if( key == "EXTRA" )          console.log( "EXTRA: "          + value );
					if( key == "IS_NULLABLE" )    console.log( "IS_NULLABLE: "    + value );
					if( key == "COLUMN_DEFAULT" ) console.log( "COLUMN_DEFAULT: " + value );
					if( key == "COLUMN_COMMENT" ) console.log( "COLUMN_COMMENT: " + value );
				});
			}
		});

	}

	function ajax_get_tables() {
		var request = $.ajax({
			type: "post",
			url: ajax_url,
			data: {
				action: "get_tables",
			}
		});

		request.done( function( response ) {
			var results = $.parseJSON( response );
			var table_names = [];
			var tb_key = 0;
			$.each( results, function( key, value ) {
				table_names[tb_key++] = value;
			});
			wpdb_tables = table_names;
			// console.log(wpdb_tables);
			generate_table_list();
			if( !show ) {
				hide_wp_tables();
			}
		});

	}

	//End of AJAX functions

	//HTML Generation
	function generate_table_list() {
		var prev_selected = $( ".selected" ).text();
		$( "#db_table_list_container" ).empty();

		var ret = "<ul id=\"db_table_list\" class=\"db_table_list\">"
			+ "<li class=\"noMargin\">"
		  + "<span id=\"show_hide_wp_tables\" class=\"db_table_head\" title=\"Show/hide default wordpress tables\"> "
		  + wpdb_name
		  + " </span></li>";

		for( var i = 0; i < wpdb_tables.length; i++ ) {
			ret += "<li class=\"table_name\">" + wpdb_tables[i] + "</li>";
		}

		ret += "</ul>"

		$( "#db_table_list_container" ).append(ret);
		classify_li();
		if( prev_selected != "" ) { //If there was a previously selected table
			prev_selected = $( ".table_name:contains('" + prev_selected + "')" ); //Select the table
			if( prev_selected.length ) { //If the previously selected exists currently
				toggle_selected( prev_selected );``
			}
		}
	}

	//Credit: Pimp Trizkit @ http://stackoverflow.com/questions/5560248/programmatically-lighten-or-darken-a-hex-color-or-rgb-and-blend-colors
	function shadeRGBColor(color, percent) {
    var f=color.split(","),t=percent<0?0:255,p=percent<0?percent*-1:percent,R=parseInt(f[0].slice(4)),G=parseInt(f[1]),B=parseInt(f[2]);
    return "rgb("+(Math.round((t-R)*p)+R)+","+(Math.round((t-G)*p)+G)+","+(Math.round((t-B)*p)+B)+")";
	}

	function blendRGBColors(c0, c1, p) {
    var f=c0.split(","),t=c1.split(","),R=parseInt(f[0].slice(4)),G=parseInt(f[1]),B=parseInt(f[2]);
    return "rgb("+(Math.round((parseInt(t[0].slice(4))-R)*p)+R)+","+(Math.round((parseInt(t[1])-G)*p)+G)+","+(Math.round((parseInt(t[2])-B)*p)+B)+")";
	}

	//End credit
	//End of jQuery

});
