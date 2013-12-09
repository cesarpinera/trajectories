// Distance between two points
// p1 and p2 are expected to be objects with lat and lng
// Adapted from http://www.movable-type.co.uk/scripts/latlong.html
function haversine(p1, p2) {
	var R = 6371; // km
	var dLat = rad(p2.lat-p1.lat);
	var dLon = rad(p2.lng-p1.lng);
	var lat1 = rad(p1.lat);
	var lat2 = rad(p2.lat);
	
	var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
	        Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
	var d = R * c;	
	return d;
}

// Converts numeric degrees to radians
function rad(number) {
	return number * Math.PI / 180;
}

// Finds a centroid
function centroid(px) {
	var lat = 0, lng = 0;
	for(i = 0; i < px.length; i++) {
		if (isNaN(px[i].lat) ||
			isNaN(px[i].lng)) {
			console.log('NaN');
		}
		lat += px[i].lat;
		lng += px[i].lng;
	} 
	return {lat: lat / px.length,
		    lng: lng / px.length};
}

// Adapted from http://www.mymessedupmind.co.uk/index.php/javascript-k-mean-algorithm
function kmeans(arrayToProcess, k)
{
	var groups = new Array();
	var centroids = new Array();
	var oldCentroids = new Array();
	var changed = false;
	
	// order the input array
	// arrayToProcess.sort(function(a,b) {return a - b}) ;
	
	// initialise group arrays
	for(initGroups = 0; initGroups < k; initGroups++ ) {
		groups[initGroups] = new Array();
	}  
  
	// pick initial centroids
	initialCentroids = Math.round(arrayToProcess.length / (k + 1));  
	for(i = 0; i < k; i++) {
	    centroids[i] = arrayToProcess[(initialCentroids * (i + 1))];
	}
  
  do {
	for(j = 0; j < k; j++ ) {
		groups[j] = [];
	}
  
    var changed = false;
	var newGroup = 0;
	
	for(i = 0; i < arrayToProcess.length; i++) {
		var distance = -1;
		var oldDistance =-1;
		
		for(j = 0; j < k; j++) {
		  	// TODO : do we need ABS?
			distance = haversine(centroids[j], arrayToProcess[i]);
			
			if (oldDistance == -1) {
			   oldDistance = distance;
			   newGroup = j;
			}
			else if (distance <= oldDistance) {
			    newGroup = j;
				oldDistance = distance;
			}
		}	
		groups[newGroup].push(arrayToProcess[i]);
	}
  
    oldCentroids = centroids;
  
	// Find the new centroids
    for (j = 0; j < k; j++) {
		var lat = 0, lng = 0;
		var newCentroid = 0;

		// TODO: is this += going to work?
		for(i = 0; i < groups[j].length; i++) {
			lat += groups[j][i].lat;
			lng += groups[j][i].lng;
		} 
		
		newCentroid = {lat: lat / groups[newGroup].length,
				       lng: lng / groups[newGroup].length};
	  
		centroids[j] = newCentroid;
	}
  
    for(j = 0; j < k; j++) {
	  if (centroids[j] != oldCentroids[j]) {
	    changed=true;
	  }
	}
  } while(changed == true);
  
  return groups;
}