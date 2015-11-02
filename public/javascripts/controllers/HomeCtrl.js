(function(){
    'use strict';
}());
angular.module('WPApp')

//controller for index.html 
.controller('mainController',function($scope,AuthToken,$state){
    console.log('Entered mainController');
    $scope.myInterval = 5000;
    $scope.noWrapSlides = false;
    $scope.currentUser=AuthToken.getcurrentUser();
    $scope.$watch(AuthToken.getcurrentUser,function(currentUser){
        $scope.currentUser = currentUser;
    });    
    $scope.logout = function(){
        AuthToken.clearToken();
        AuthToken.clearcurrentUser();
        $scope.currentUser = null;
        $state.go('home',{});
    };
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
});