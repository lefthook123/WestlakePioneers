(function(){
    'use strict';
}());
angular.module('WPApp')

.controller('toolsGoogleMapController',function($scope,$http,$rootScope,geolocation,gservice){
    
    $scope.pageClass = 'page-tools';
    // Initializes Variables
    // ----------------------------------------------------------------------------
    $scope.formData = {};
    var coords = {};
    var lat = 0;
    var long = 0;
    // Set initial coordinates to the center of the US
    $scope.formData.latitude = 39.500;
    $scope.formData.longitude = -98.350;

    // Get User's actual coordinates based on HTML5 at window load
    geolocation.getLocation().then(function(data){

        // Set the latitude and longitude equal to the HTML5 coordinates
        coords = {lat:data.coords.latitude, long:data.coords.longitude};

        // Display coordinates in location textboxes rounded to three decimal points
        $scope.formData.longitude = parseFloat(coords.long);
        $scope.formData.latitude = parseFloat(coords.lat);

        // Display message confirming that the coordinates verified.
        $scope.formData.htmlverified = "Yep (Thanks for giving us real data!)";

        gservice.refresh($scope.formData.latitude, $scope.formData.longitude);

    });
    // Functions
    $rootScope.$on("clicked", function(){

        // Run the gservice functions associated with identifying coordinates
        $scope.$apply(function(){
            $scope.formData.latitude = parseFloat(gservice.clickLat).toFixed(3);
            $scope.formData.longitude = parseFloat(gservice.clickLong).toFixed(3);
            $scope.formData.htmlverified = "Nope (Thanks for spamming my map...)";
        });
    });
    // Function for refreshing the HTML5 verified location (used by refresh button)
    $scope.refreshLoc = function(){
        geolocation.getLocation().then(function(data){
            coords = {lat:data.coords.latitude, long:data.coords.longitude};

            $scope.formData.longitude = parseFloat(coords.long).toFixed(3);
            $scope.formData.latitude = parseFloat(coords.lat).toFixed(3);
            $scope.formData.htmlverified = "Yep (Thanks for giving us real data!)";
            gservice.refresh(coords.lat, coords.long);
        });
    };
    // ----------------------------------------------------------------------------
    // Creates a new user based on the form fields
    $scope.createUser = function(){
        var userData = {
            username: $scope.formData.username,
            gender: $scope.formData.gender,
            age: $scope.formData.age,
            favlang: $scope.formData.favlang,
            location: [$scope.formData.longitude,$scope.formData.latitude],
            htmlverified: $scope.formData.htmlverified
        };
        $http.post('/toolgooglemapusers',userData)
            .success(function(data){
                $scope.formData.username="";
                $scope.formData.gender = "";
                $scope.formData.age="";
                $scope.formData.favlang="";

                gservice.refresh($scope.formData.latitude, $scope.formData.longitude);
            })
            .error(function(data){
                console.log('Error: '+data);
            });
            
    };
  
})