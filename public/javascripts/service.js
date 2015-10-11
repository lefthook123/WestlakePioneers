(function(){
    'use strict';
}());
(function(){
angular.module('WPApp')
.factory('AuthToken',function($window){
	var tokenKey = 'user-token';
	var storage = $window.localStorage;
	var cachedToken;
	return{
		isAuthenticated: isAuthenticated,
		setToken: setToken,
		getToken: getToken,
		clearToken: clearToken
	};
	function setToken(token){
		cachedToken = token;
		storage.setItem(tokenKey,token);
	}
	function getToken(){
		if(!cachedToken){
			cachedToken = storage.getItem(tokenKey);
		}
		return cachedToken;
	}	
	function clearToken(){
		cachedToken = null;
		storage.removeItem(tokenKey);
	}
	function isAuthenticated(){
		return !!getToken();
	}

})

.factory('AuthInterceptor',function($rootScope,$q,AuthToken){
	return{
		request : function(config){
			var token = AuthToken.getToken();
			if(token){
				config.headers = config.headers || {};
				config.headers.Authorization = 'Bearer '+token;
			}
			return config;
		},
		response: function(response){
			if(response.status===401){
				console.warn('user not authenticated',response);
			}
			return response || $q.when(response);
		}
	};
})

.service('multipartForm',['$http',function($http){
	this.post=function(uploadUrl,data){
		var fd = new FormData();
		for(var key in data)
			fd.append(key,data[key]);
		$http.post(uploadUrl,fd,{
			transformRequest: angular.identity,
			headers:{'Content-Type':undefined}
		});
	};
}]);

})();