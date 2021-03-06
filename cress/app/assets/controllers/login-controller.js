
angular.module('CressApp')
	.controller('LoginCtrl', function ($scope, $location, AuthService) {

		$scope.username = null;
		$scope.password = null;
		$scope.error = null;

		$scope.login = function() {
            AuthService.credentials.username = $scope.username;
            AuthService.credentials.password = $scope.password;

            return AuthService
				.processLogin()
				.then(function(user){
					if(user.error){
						$scope.error = user.error;
					} else {
                        $scope.error = null;
                        AuthService.user.username = user.user_name;
                        AuthService.user.isAdmin = user.is_admin === "1";
						$location.path('/');
					}
				})
				.catch(function(){
					console.log("Error in login ctrl - process login");
				});
		}

});