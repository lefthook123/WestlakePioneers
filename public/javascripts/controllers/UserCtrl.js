(function(){
    'use strict';
}());
angular.module('WPApp')
.controller('adminusersController',function($scope,$http){
    $scope.pageClass = 'page-contact';
    var refresh = function(){
            $http.get('/admin/retrieveusers').success(function(response){
            $scope.usrs = response;
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