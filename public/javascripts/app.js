(function(){
    'use strict';
}());
var app = angular.module('WPApp',["ui.router",'ngAnimate','ui.bootstrap','ngCookies','ngTouch','ngResource']);
app.config(function($stateProvider, $urlRouterProvider,$locationProvider){
	$urlRouterProvider.otherwise('/home');
	$stateProvider        
        // HOME STATES AND NESTED VIEWS ========================================
        .state('home', {
            url: '/home',
            templateUrl: 'template/partial-home.html',
            controller:'mainController'
        })        
        .state('home.list', {
            url: '/list',
            templateUrl: 'template/partial-home-list.html'
        })
        .state('home.paragraph', {
        	url: '/paragraph',
        	template: 'I could sure use a drink right now.'
    	})
        .state('blogs', {
            url: '/blogs',
            templateUrl: 'template/partial-blogs.html',
            controller:'blogsController'
        })
    	.state('team', {
            url: '/team',
            templateUrl: 'template/partial-team.html',
            controller:'teamController'
        })
        .state('login', {
            url: '/login',
            onEnter:['$stateParams','$state','$modal','$resource',function($stateParams,$state, $modal, $resource){
                $modal.open({
                    animation: true,
                    size:'',
                    templateUrl: 'login/login.html',
                    controller:'loginController'
                }).result.finally(function(){
                    $state.go('home',{});
                });
            }]                        
        })
        // ABOUT PAGE AND MULTIPLE NAMED VIEWS =================================
        .state('about', {
            url: '/about',
            views:{

            	'': {templateUrl: 'template/partial-about.html',controller:'aboutController' },
            	'columnOne@about' :{template:'Look I am a column!'},
            	'columnTwo@about' :{
            		templateUrl:'template/table-data.html'
            		}      
            },                  
        })
        .state('contact', {
            url: '/contact',
            templateUrl: 'template/partial-contact.html',
            controller:'contactController'       
        });
        $locationProvider.html5Mode(true);
});