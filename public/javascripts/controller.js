'use strict';
angular.module('WPApp')

.controller('mainController',function($scope){
    $scope.myInterval = 5000;
    $scope.noWrapSlides = false;
    var slides = $scope.slides = [
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
    $http.get('/retrieveblogs').success(function(response){
        $scope.articles = response;
    });
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

});