var app = angular.module('AccelApp',["ui.router",'ngAnimate']);
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
            name : '',
            imgPath: ''
        },
        {
            name:'',
            imgPath:''
        },
        {
            name:'',
            imgPath:''
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
app.controller('teamController',function($scope){
	$scope.pageClass = 'page-team';
    $scope.toddimgPath='images/todd.jpg';
    $scope.murphyimgPath='images/murphy.jpg';

    $scope.managers= [
       
        {name:'Jane Murphy',
        alt:'Jane Murphy',
        path:'images/murphy.jpg',
        title:'Founder',
        description:'Jane has been selling financial services since the 1980\'s and focused on the retirement plan business since the early 1990\'s. Working for Fidelity Investments, she built a sales organization from 3 employees to well over 100. She also built a lead generation team from scratch to over 60 associates. Jane is well known for highly innovative sales approaches and processes. Her team produced over $3 billion in assets under management per year while selling no plan with greater than $5 million in assets. Jane\'s lead generation team produced over 3,000 leads a year in all sizes of the retirement plan market including the tax exempt market. Jane is a sought after leader well known for turning lead generation associates into salespeople.'}
        ,
        {name:'Todd Jenkins',
        alt:'Todd Jenkins',
        path:'images/todd.jpg',
        title:'Vice President, New Business Development ',
        description:'Todd Jenkins has extensive financial services experience working with insurance and retirement plan sales.  In his second year at Fidelity Investments, Todd was able to generate over $70M in new retirement plan assets while working in the less than $5M market. He used the same techniques that Acceleration Retirement provides to Advisors. His deep understanding of Advisors and sales make him an ideal strategic partner for progressive Advisors.'}
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
	$scope.message = 'Contact us! JK. This is just a demo.';
	$scope.pageClass = 'page-contact';
});