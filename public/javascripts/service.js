(function(){
    'use strict';
}());
(function(){
angular.module('WPApp')

.factory('gservice',['$rootScope','$http',function($rootScope,$http){
	var googleMapService = {};
	googleMapService.clickLat  = 0;
	googleMapService.clickLong = 0;

	// Array of locations obtained from API calls
	var location = [];

	// Variables we'll use to help us pan to the right spot
	var lastMarker;
	var currentSelectedMarker;

	// User Selected Location (initialize to center of America)
	var selectedLat = 39.50;
	var selectedLong = -98.35;

	// Functions
    // --------------------------------------------------------------
    // Refresh the Map with new data. Takes three parameters (lat, long, and filtering results)
	googleMapService.refresh = function(latitude,longitude,filteredResults){
		// Clears the holding array of locations
		locations = [];
		// Set the selected lat and long equal to the ones provided on the refresh() call
		selectedLat = latitude;
		selectedLong = longitude;

		// If filtered results are provided in the refresh() call...
		if (filteredResults){
			// Then convert the filtered results into map points.
            locations = convertToMapPoints(filteredResults);
            // Then, initialize the map -- noting that a filter was used (to mark icons yellow)
            initialize(latitude, longitude, true);
		}
		else{
			$http.get('/toolgooglemapusers').success(function(response){
				locations = convertToMapPoints(response);
				initialize(latitude,longitude,false);
			}).error(function(){});

		}
		

	};

	// Convert a JSON of users into map points
	var convertToMapPoints = function(response){
		// Clear the locations holder
		var locations = [];

		// Loop through all of the JSON entries provided in the response
		for(var i=0;i<response.length;i++){
			var user = response[i];

			var contentString = 
				'<p><b>Username</b>: ' + user.username +
                '<br><b>Age</b>: ' + user.age +
                '<br><b>Gender</b>: ' + user.gender +
                '<br><b>Favorite Language</b>: ' + user.favlang +
                '</p>';

            locations.push(new Location(
            	new google.maps.LatLng(user.location[1], user.location[0]),
            	new google.maps.InfoWindow({
                        content: contentString,
                        maxWidth: 320
                }),
                user.username,
                user.gender,
                user.age,
                user.favlang
            ));
		}
		return locations;
	};

	// Constructor for generic location
    var Location = function(latlon, message, username, gender, age, favlang){
        this.latlon = latlon;
        this.message = message;
        this.username = username;
        this.gender = gender;
        this.age = age;
        this.favlang = favlang;
    };

    // Initializes the map
	var initialize = function(latitude,longitude,filter){
		
		// Uses the selected lat, long as starting point
		var myLatLng = {lat: selectedLat, lng: selectedLong};

		var map;
		 // If map has not been created already...
	    if (!map){

	        // Create a new map and place in the index.html page
	        map = new google.maps.Map(document.getElementById('map'), {
	            zoom: 3,
	            center: myLatLng
	        });
	    }

	    // If a filter was used set the icons yellow, otherwise blue
        if(filter){
            icon = "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png";
        }
        else{
            icon = "http://maps.google.com/mapfiles/ms/icons/blue-dot.png";
        }


	    // Loop through each location in the array and place a marker
	    locations.forEach(function(n, i){
        	var marker = new google.maps.Marker({
            	position: n.latlon,
            	map: map,
            	title: "Big Map",
            	icon: icon,
        	});

	    	// For each marker created, add a listener that checks for clicks
	    	google.maps.event.addListener(marker, 'click', function(e){
	        	// When clicked, open the selected marker's message
	        	currentSelectedMarker = n;
	        	n.message.open(map, marker);
	        });
	    });

	    // Set initial location as a bouncing red marker
	    var initialLocation = new google.maps.LatLng(latitude, longitude);
	    var marker = new google.maps.Marker({
	        position: initialLocation,
	        animation: google.maps.Animation.BOUNCE,
	        map: map,
	        icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
	    });
	    lastMarker = marker;

	    // Function for moving to a selected location
	    map.panTo(new google.maps.LatLng(latitude, longitude));
	    // Clicking on the Map moves the bouncing red marker
        google.maps.event.addListener(map, 'click', function(e){
            var marker = new google.maps.Marker({
                position: e.latLng,
                animation: google.maps.Animation.BOUNCE,
                map: map,
                icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
            });

            // When a new spot is selected, delete the old red bouncing marker
            if(lastMarker){
                lastMarker.setMap(null);
            }

            // Create a new red bouncing marker and move to it
            lastMarker = marker;
            map.panTo(marker.position);

            // Update Broadcasted Variable (lets the panels know to change their lat, long values)
            googleMapService.clickLat = marker.getPosition().lat();
            googleMapService.clickLong = marker.getPosition().lng();
            $rootScope.$broadcast("clicked");
        });
	};
	google.maps.event.addDomListener(window, 'load',googleMapService.refresh(selectedLat, selectedLong));
	return googleMapService;
}])
.factory('AuthToken',function($window){
	console.log('Entered AuthToken Factory');
	var tokenKey = 'user-token';
	var emailKey = 'user-email';
	var companyKey = 'user-company';
	var storage = $window.localStorage;
	var cachedToken;
	var cachedUserEmail;
	var cachedUserCompany;
	return{
		isAuthenticated: isAuthenticated,
		setToken: setToken,
		getToken: getToken,
		clearToken: clearToken,
		getcurrentUserEmail: getcurrentUserEmail,
		setcurrentUserEmail:setcurrentUserEmail,
		clearcurrentUserEmail:clearcurrentUserEmail,
		getcurrentUserCompany:getcurrentUserCompany,
		setcurrentUserCompany:setcurrentUserCompany,
		clearcurrentUserCompany:clearcurrentUserCompany
	};
	function getcurrentUserCompany(){
		if(!cachedUserCompany){
			cachedUserCompany=storage.getItem(companyKey);
		}
		return cachedUserCompany;
	}
	function setcurrentUserCompany(user){
		console.log('setcurrentUserCompany: '+user.company);
			cachedUserCompany = user.company;
			storage.setItem(companyKey,user.company);
		

	}
    function clearcurrentUserCompany(){
    	cachedUserCompany=null;
    	storage.removeItem(companyKey);
    }
	function getcurrentUserEmail(){
		if(!cachedUserEmail){
			cachedUserEmail=storage.getItem(emailKey);
		}
		return cachedUserEmail;
	}
	function setcurrentUserEmail(user){
		cachedUserEmail = user.email;
		storage.setItem(emailKey,user.email);
	}
    function clearcurrentUserEmail(){
    	cachedUserEmail=null;
    	storage.removeItem(emailKey);
    }
	function setToken(token){
		cachedToken = token;
		storage.setItem(tokenKey,token);
	}

	function getToken(){
		if(!cachedToken){
			cachedToken = storage.getItem(tokenKey);
		}
		return cachedToken;
	}	
	function clearToken(){
		cachedToken = null;
		storage.removeItem(tokenKey);
	}
	function isAuthenticated(){
		console.log('AuthToken isAuthenticated: ');
		return !!getToken();
	}

})

.factory('AuthInterceptor',function($rootScope,$q,AuthToken){
	return{
		request : function(config){
			var token = AuthToken.getToken();
			if(token){
				config.headers = config.headers || {};
				config.headers.Authorization = token;
			}
			return config;
		},
		response: function(response){
			if(response.status===401){
				console.warn('user not authenticated',response);
			}
			return response || $q.when(response);
		}
	};
})

.service('multipartForm',['$http',function($http){
	this.post=function(uploadUrl,data){
		var fd = new FormData();
		for(var key in data)
			fd.append(key,data[key]);
		$http.post(uploadUrl,fd,{
			transformRequest: angular.identity,
			headers:{'Content-Type':undefined}
		});
	};
}]);



})();