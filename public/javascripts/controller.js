(function(){
    'use strict';
}());
angular.module('WPApp')

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
.controller('blogsDetailController',function($scope,$http,$stateParams){ 
    $scope.pageClass = 'page-blogs';
    var title = $stateParams.blogTitle;
    $http.get('/retrieveblogs/'+title).success(function(response){
        $scope.selectedBlog = response;
    });
})
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
    $scope.edit = function(id){
        console.log(id);
    };

    $scope.update = function(){

    };
})
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
.controller('contactController',function($scope){
	$scope.pageClass = 'page-contact';

})
.controller('loginController',function($scope,$http,$timeout,AuthToken,$window){

    $scope.badCreds = false;
    $scope.cancel = function() {
        $scope.$dismiss();
    };
    $scope.login = function(email,password) {
        $http({
            url:'authenticate',
            method:'POST',
            data:{
                email:email,
                password:password
            }
        }).then(function success(response){
            AuthToken.setToken(response.data.token);
            $scope.user = response.data.user;
            $scope.alreadyLoggedIn = true;
            showAlert('success', 'Hey there!', 'Welcome ' + $scope.user.username + '!');
        },function error(response){
            if(response.status===404){
                $scope.badCreds=true;
                showAlert('danger', 'Whoops...', 'Do I know you?');
            }else{
                showAlert('danger', 'Hmmm....', 'Problem logging in! Sorry!');
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
});