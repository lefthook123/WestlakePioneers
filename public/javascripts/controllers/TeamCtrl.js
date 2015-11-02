(function(){
    'use strict';
}());
angular.module('WPApp')

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
});