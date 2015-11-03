(function(){
    'use strict';
}());
angular.module('WPApp')
//controller for partial-contact.html
.controller('contactController',function($scope,$http){
	$scope.pageClass = 'page-contact';
    $scope.sendEmail = function(){
        $http.post('/contact',$scope.form).success(function(response){
            $scope.form=null;
            $scope.message = response;
        });
       
    };
});