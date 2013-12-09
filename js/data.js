var Data = {
	circles: new Array(),

	read_datafile: function(filename, cb) {
		$.ajax({url:filename,
				success: function(result) {
					// Turn the received file into lines and remove the first 6 lines that work as headers
					var lines = result.split('\n');
					lines.splice(0, 6);
					lines.pop();
					var visits = $.map(lines, function(line, index) {
									var values = line.split(',');
									var point = {
										lat: Number(values[0]),
										lng: Number(values[1])
									};
									if (isNaN(point.lat) ||
										isNaN(point.lng)) {
											console.log("NaN");
										}
									return point;
					});
					cb(visits);
				}});
	},
	
	read_all_sources: function(cb) {
		var points = new Array();
		$.each(Sources, $.proxy(function(k,v){
			this.read_datafile(v, $.proxy(function(visits){
				points = points.concat(visits);
				if (k == Sources.length - 1){
					cb(points);
				}
			}, this));
		}, this));
	},
	
	// Create the markers on a map
	create_markers: function(m, ll, color, maxcoord) {		
		$.each(ll, $.proxy(function(k, v) {
			if (k <= maxcoord) {
				var options = {
					strokeColor: color,
					strokeOpacity: 0.35,
					strokeWeight: 2,
					fillColor: color,
					fillOpacity: 0.35,
					map: $('#map').gmap3('get'),
					center: new google.maps.LatLng(v.lat, v.lng),
					radius: 50
				};
			    // Add the circle for this city to the map.
			    circle = new google.maps.Circle(options);
			    this.circles.push(circle);
			};
		}, this));
	},
	
	// Add a group marker 
	create_group_marker: function(m, p, color) {
		var map = $('#map').gmap3('get');
		var c = centroid(p);
		var poi = "No POI found";
	    var styleIconClass = new StyledIcon(StyledIconTypes.CLASS,{color:color});

   		var geocoder = new google.maps.Geocoder();
		geocoder.geocode({location: new google.maps.LatLng(c.lat, c.lng)}, $.proxy(function(results, status) {
			if(status == google.maps.GeocoderStatus.OK) {
				poi = results[0].formatted_address;
			}
			var styleMarker = new StyledMarker({styleIcon:new StyledIcon(StyledIconTypes.MARKER,{},styleIconClass),
									 		    position:new google.maps.LatLng(c.lat, c.lng),
									 		    content:color,
									 		    map:map});
			this.circles.push(styleMarker);
			google.maps.event.addListener(styleMarker, 'click', function () {
				console.log("click");
		        infoWindow.setOptions({
		            content: poi
		        });
		        infoWindow.open(map, styleMarker);
		    }); 
        }, this));
	},
	
	// Create the markers on a map using a pin, not a circle
	create_pin_markers: function(m, ll, color) {		
		$.each(ll, $.proxy(function(k, v) {
			$(m).gmap3({marker:{latLng:[v.lat, v.lng],
						options: {icon: new google.maps.MarkerImage("img/measle_blue.png",
																	new google.maps.Size(7, 7, "px", "px"))}}});
		}, this));
	},
		
	remove_markers: function() {
		$.each(this.circles, $.proxy(function(k, v){
			v.setMap(null);
		}, this));
	},
	
	random_color: function() {
		// Select one color at random
		var color = '#'+Math.floor(Math.random()*16777215).toString(16);
		return color;
	},
};