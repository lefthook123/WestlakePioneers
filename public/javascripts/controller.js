(function(){
    'use strict';
}());
angular.module('WPApp')

//controller for index.html 
.controller('mainController',function($scope){
    $scope.myInterval = 5000;
    $scope.noWrapSlides = false;
    var slides = $scope.slides = [
        {
            image: 'images/home-carousel5.png',
            text: ''
        },
        {
            image: 'images/home-carousel1.png',
            text: ''
        },
        {
            image: 'images/home-carousel2.png',
            text: ''
        },
        {
            image: 'images/home-carousel3.jpeg',
            text: ''
        },
        {
            image: 'images/home-carousel4.jpeg',
            text: ''
        }
    ];
	$scope.pageClass = 'page-home';

    $scope.services= [
        {name:'GROWTH CONSULTING',
        alt:'consulting-growth',
        path:'images/consulting-growth.jpg',
        description:['Sales & Marketing Optimization','Sales Training']},
        {name:'OUTBOUND MARKETING',
        alt:'outbound-marketing',
        path:'images/outbound-marketing.png',
        description:['Lead Generation','Seminar/Webinar Event Attendance Calling']},
        {name:'DATABASE DEVELOPMENT / CRM CONSULTING',
        alt:'crm',
        path:'images/crm.jpg',
        description:['Targeted List Development','Predictive Modeling','CRM Development / Customization']},
    ];
})
//controller for partial-blogs.html
.controller('blogsController',function($scope,$http){	
    $scope.pageClass = 'page-blogs';
    $scope.articles=[];
    var refresh = function(){
            $http.get('/retrieveblogs').success(function(response){
            $scope.articles = response;
            $scope.blog=null;
        });
    };
    refresh();
    $scope.currentPage = 0;
    $scope.pageSize = 10;
    $scope.numberOfPages=function(){
        return Math.ceil($scope.articles.length/$scope.pageSize);
    };
})
//controller for partial-blog-detail.html
.controller('blogsDetailController',function($scope,$http,$stateParams){ 
    $scope.pageClass = 'page-blogs';
    var title = $stateParams.blogTitle;
    $http.get('/retrieveblogs/'+title).success(function(response){
        $scope.selectedBlog = response;
    });
    $scope.replying=false;
    $scope.reply=function(){
        $scope.replying=true;
    };
    $scope.cancel=function(){
        $scope.replying=false;
    };
    $scope.postReply=function(){
    };
})
//controller for admin-blogs.html
.controller('adminblogsController',function($scope,$http){    
    var refresh = function(){
            $http.get('/retrieveblogs').success(function(response){
            $scope.articles = response;
            $scope.blog=null;
        });
    };
    $scope.currentPage = 0;
    $scope.pageSize = 10;
    $scope.numberOfPages=function(){
        return Math.ceil($scope.articles.length/$scope.pageSize);
    };
    refresh();
    $scope.pageClass = 'page-blogs';    
    $scope.remove = function(id){
        $http.delete('/admin/deleteblog/'+id).success(function(response){
            refresh();
        });
    };
    $scope.addBlog=function(){
        $scope.blog.pictures = [];
        $scope.blog.pictures.push({'path': $scope.picturePaths});
        $http.post('/admin/postblog',$scope.blog).success(function(response){
            refresh();

        });
    };
    $scope.editing=false;
    $scope.edit = function(){
        $scope.editing=true;
    };
    $scope.cancel = function(){
        $scope.editing=false;
    };
    $scope.update = function(article){
        $scope.editing=false;
        $http.put('/admin/updateblog/'+article._id,article).success(function(response){
            refresh();
        });
    };
})
//controller for partial-team.html
.controller('teamController',function($scope){
    $scope.pageClass = 'page-team';
    $scope.managers= [       
        {name:'Jack Wang',
        alt:'Jack Wang',
        path:'images/JackWang2.JPG',
        title:'Founder',
        description:'Technology evangelist on \'Salesforce CRM\', \'Web Development\''}     
    ];
})
//controller for partial-about.html
.controller('aboutController',function($scope){
	$scope.message = 'Look! I am an about page.';
	$scope.scotches = [
        {
            name: 'Macallan 12',
            price: 50
        },
        {
            name: 'Chivas Regal Royal Salute',
            price: 10000
        },
        {
            name: 'Glenfiddich 1937',
            price: 20000
        }
    ];
    $scope.pageClass = 'page-about';
})
//controller for partial-contact.html
.controller('contactController',function($scope,$http){
	$scope.pageClass = 'page-contact';

    $scope.sendEmail = function(){
        $http.post('/contact',$scope.form).success(function(response){
            $scope.form=null;
            $scope.message = response;
        });
       
    };
})
//controller for login.html
.controller('loginController',function($scope,$http,$timeout,AuthToken,$window){

    $scope.badCreds = false;
    $scope.cancel = function() {
        $scope.$dismiss();
    };
    $scope.login = function() {
        console.log($scope.credential);
        $http.post('/authenticate',$scope.credential).then(function success(response){
            console.log(response.data.token);
            AuthToken.setToken(response.data.token);
            $scope.user = response.data.user;
            $scope.alreadyLoggedIn = true;
            console.log('success', 'Hey there!', 'Welcome ' + $scope.user.email + '!');
        },function error(response){
            if(response.status===404){
                $scope.badCreds=true;
                console.log('danger', 'Whoops...', 'Do I know you?');
            }else{
                console.log('danger', 'Hmmm....', 'Problem logging in! Sorry!');
            }
        });
    };

    $scope.logout = function(){
        AuthToken.clearToken();
        $scope.user = null;
        showAlert('info','Goodbye!','Have a great day!');
    };

    var alertTimeout;
    function showAlert(type,title,message,timeout){
        $scope.alert = {
            hasBeenShown: true,
            show: true,
            type: type,
            message: message,
            title:title
        };
        $timeout.cancel(alertTimeout);
        alertTimeout = $timeout(function(){
            $scope.alert.show = false;
        },timeout || 1500);
    }
})
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
.controller('adminusersController',function($scope,$http){
    $scope.pageClass = 'page-contact';
    var refresh = function(){
            $http.get('/admin/retrieveusers').success(function(response){

            $scope.usrs = response;
            //console.log('USERS:');
            //console.log($scope.usrs);
            $scope.newuser=null;
        });
    };
    refresh();
    $scope.pageClass = 'page-adminuser';    
    $scope.remove = function(id){
        $http.delete('/admin/deleteuser/'+id).success(function(response){
            refresh();
        });
    };
    $scope.addUser=function(){
        $http.post('/admin/postuser',$scope.newuser).success(function(response){
            refresh();
        });
    };
    $scope.editing=false;
    $scope.edit = function(){
        $scope.editing=true;
    };
    $scope.cancel = function(){
        $scope.editing=false;
    };
    $scope.update = function(user){
        $scope.editing=false;
        $http.put('/admin/updateuser/'+usr._id,usr).success(function(response){
            refresh();
        });
    };
    
});