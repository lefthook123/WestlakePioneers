(function(){
    'use strict';
}());
var app = angular.module('WPApp',[
    'geolocation',
    'ui.router',
    'ngAnimate',
    'ui.bootstrap',
    'ngCookies',
    'ngTouch',
    'ngSanitize',
    'ngResource']);
app.config(function($stateProvider, $urlRouterProvider,$locationProvider,$httpProvider,$urlMatcherFactoryProvider){
    /*var blogTitleType = {
        encode: function(str){return str&&str.replace(/ /g,"-");},
        decode: function(str){return str&&str.replace(/-/g," ");},
        is: angular.isString,
        pattern:/[^/]+/
    }; */
	$urlRouterProvider.otherwise('/home');
    $httpProvider.interceptors.push('AuthInterceptor');
    //$urlMatcherFactoryProvider.type('blogTitle', blogTitleType);
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
        .state('project-googlemaps', {
            url: '/projects/googlemaps',
            templateUrl: 'template/projects-googlemaps.html',
            controller:'toolsGoogleMapController'
        })
        .state('project-markdownviewer', {
            url: '/projects/markdownviewer',
            templateUrl: 'template/projects-markdownviewer.html',
            controller:'toolsMarkdownViewerController'
        })
        .state('blogdetail', {
            url: '/blogs/:blogTitle',
            templateUrl: 'template/partial-blog-detail.html',
            controller:'blogsDetailController'
        })
    	.state('team', {
            url: '/team',
            templateUrl: 'template/partial-team.html',
            controller:'teamController'
        })
        .state('login', {
            url: '/login',
            onEnter:['$stateParams','$state','$modal','$resource','$rootScope',function($stateParams,$state, $modal, $resource,$rootScope){
                $modal.open({
                    animation: true,
                    size:'',
                    templateUrl: 'login/login.html',
                    controller:'loginController'
                }).result.then(function(result){
                    if(result==='loggedin'){
                        if(typeof $rootScope.returnToState != 'undefined'&&$rootScope.returnToState!==null){
                            $state.go($rootScope.returnToState,{});
                            $rootScope.returnToState=null;
                        }
                        else{
                            console.log('ELSE:'+ $rootScope.returnToState);
                            $state.go('admin-dashboard',{});

                        }
                        
                    }
                    else if(result==='canceled'){
                        $state.go('home',{});
                    }
                    
                },function(){
                    console.log('promise rejected fail');
                }).finally(function(){
                    console.log('promise finally');
                    //$state.go('home',{});
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
        })
        .state('admin-blogs', {
            url: '/admin/blogs',
            templateUrl: 'template/admin-blogs.html',
            controller:'adminblogsController',
            authenticate:true        
        })
        .state('admin-users', {
            url: '/admin/users',
            templateUrl: 'template/admin-users.html',
            controller:'adminusersController',
            authenticate:true        
        })
        .state('projects', {
            url: '/projects',
            templateUrl: 'template/partial-projects.html',
            authenticate:false       
        })
        .state('admin-dashboard', {
            url: '/admin/dashboard',
            templateUrl: 'template/admin-dashboard.html',
            authenticate:true       
        });
        //$rootScope.currentuser=null;
        $locationProvider.html5Mode(true);
        $locationProvider.hashPrefix('!');
})


.run(function($rootScope,$location,AuthToken,$state){
    $rootScope.$on('$stateChangeStart',function(event,toState,toParams,fromState,fromParams){
        if(toState.authenticate&&!AuthToken.isAuthenticated()){
            $rootScope.returnToState = toState.name;
            event.preventDefault();
            $state.go('login');
        }
    });
});
