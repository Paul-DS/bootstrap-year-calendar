<?php
	
	$events = array();
	
	// put this to yours foreach for example from MySQL, etc.
	
	$date_from = Date('D M d Y 0:0:0 O'); // it has to contain zero time 0:0:0
	$date_to = Date('D M 11 Y 0:0:0 O'); // it has to contain zero time 0:0:0
	
	$this_event = array(
		"id"=>1,
		"name"=>"Hello world",
		"location"=>"Prague, Czech Republic",
		"startDate"=>$date_from,
		"endDate"=>$date_to,
		"color"=>"red"
	);
	
	array_push($events, $this_event);
	// end foreach
	
	
	echo json_encode($events);


// 	you can initialize calendar in HTML script like this
/*
$(document).ready(function(){
	$.getJSON( "./ajax.php", function( response ) {
	                var data = [];
	                for (var i = 0; i < response.length; i++) {
		                alert(new Date(response[i].startDate));
	                    data.push({
	                        id: response[i].id,
	                        name: response[i].name,
	                        location: response[i].location,
	                        startDate: new Date(response[i].startDate),
	                        endDate: new Date(response[i].endDate),
	                        color: response[i].color
	                    });
	                }
	                $("#calendar").data('calendar').setDataSource(data);
	});
});
*/
