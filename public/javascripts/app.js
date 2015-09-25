var app = angular.module('WPApp',["ui.router",'ngAnimate']);
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


app.controller('mainController',function($scope){
	$scope.message = 'Everyone come and see how good I look!';
	$scope.dogs = ['Bernese', 'Husky', 'Goldendoodle'];
	$scope.pageClass = 'page-home';
    $scope.carousels = [
        {
            name : '1',
            Path: 'images/carousel1.png'
        },
        {
            name:'2',
            Path:'images/carousel2.jpeg'
        },
        {
            name:'3',
            Path:'images/carousel3.jpeg'
        },
        {
            name:'4',
            Path:'images/carousel4.jpeg'
        }
    ];

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
app.controller('blogsController',function($scope,$http){	
    $scope.pageClass = 'page-blogs';
    $http.get('/retrieveblogs').success(function(response){
        $scope.articles = response;
    });
});
app.controller('teamController',function($scope){
    $scope.pageClass = 'page-team';
    $scope.managers= [       
        {name:'Jack Wang',
        alt:'Jack Wang',
        path:'images/JackWang2.JPG',
        title:'Founder',
        description:'Technology evangelist on \'Salesforce CRM\', \'Web Development\''}     
    ];
});
app.controller('aboutController',function($scope){
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
});

app.controller('contactController',function($scope){
	$scope.pageClass = 'page-contact';

});