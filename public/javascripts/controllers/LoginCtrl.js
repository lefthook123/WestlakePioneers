(function(){
    'use strict';
}());
angular.module('WPApp')
//controller for login.html
.controller('loginController',function($scope,$http,$timeout,AuthToken,$window){
    console.log('Entered loginController');
    $scope.badCreds = false;
    $scope.cancel = function() {
        $scope.$close('canceled');  
    };
    $scope.login = function() {
        console.log($scope.credential);
        $http.post('/authenticate',$scope.credential).then(function success(response){
            console.log(response.data.token);
            AuthToken.setToken(response.data.token);
            AuthToken.setcurrentUserEmail(response.data.user);
            $scope.currentuser = response.data.user;
            $scope.alreadyLoggedIn = true;            
            $scope.$close('loggedin');          
        },function error(response){
            $scope.message='Problem logging in! Sorry!';          
        });
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