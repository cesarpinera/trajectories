$(document).ready(function() {

	// Raw coordinates for a single person
	$("#rawmap").width("600px").height("350px").gmap3({map:{
	    options:{
	     center:[40.008862,116.322009],
	     zoom:8,
	     navigationControl: true,
	     scrollwheel: true,
	    }
	}});
	
	// Disable the "clear" button
	$("#clearraw").attr("disabled", "disabled");
	
	// When clicked, all coordinates are loaded and the clear button is enabled
	$("#rawbutton").click(function () {
		$("#rawbutton").attr("disabled", "disabled");
		var divs = Data.read_all_sources(function(ll) {
			Data.create_pin_markers("#rawmap", ll);
			$("#clearraw").attr("disabled", null);
			$("#clearraw").click(function() {
				$('#rawmap').gmap3({clear: {}});
				$("#rawbutton").attr("disabled", null);
				$("#clearraw").attr("disabled", "disabled");
			});
		});
	});
	

	// The clusters map
	$("#map").width("600px").height("350px").gmap3({map:{
	    options:{
	     center:[40.008862,116.322009],
	     zoom:8,
	     //navigationControl: true,
	     //scrollwheel: true,
	     draggable: false
	    },
	    events:{
	      mouseover: function(marker, event, context){
	        var map = $(this).gmap3("get");
	        var infowindow = $(this).gmap3({get:{name:"infowindow"}});
	        
	        if (infowindow){
	          infowindow.open(map, marker);
	          infowindow.setContent("hello" /*context.data*/);
	        } else {
	          $(this).gmap3({
	            infowindow:{
	              anchor:marker, 
	              options:{content: "hello"/*context.data*/}
	            }
	          });
	        }
	      },
	      mouseout: function(){
	        var infowindow = $(this).gmap3({get:{name:"infowindow"}});
	        if (infowindow){
	          infowindow.close();
	        }
	      }
	    }
	}});
	
	infoWindow = new google.maps.InfoWindow();


	$("#cluster").click(function() {		
		$("#map").gmap3({clear: {}});

		Data.remove_markers();
		
		var k = $("#k").val();
		var maxcoord = $("#maxcoord").val();
		
		plot_map(k, maxcoord);
	});
	

	
});

function plot_map(k, maxcoord) {
	var divs = Data.read_all_sources(function(ll) {
		var groups = kmeans(ll, k);
		$.each(groups, function(k, v) {
			var color = Data.random_color();
			Data.create_markers("#map", v, color, maxcoord);
			Data.create_group_marker("#map", v, color);
		});
	});
}