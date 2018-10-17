'use strict';

angular.module('CressApp')
	.controller('HomeCtrl', function ($scope, $location, $mdMenu, $mdDialog, AuthService, StudyService) {
    	console.log('Home ctrl called');

        $scope.showMenu = AuthService.isLoggedIn();
		if(!$scope.showMenu){
			$location.path('/login');
		}
        $scope.isAdmin = AuthService.user.isAdmin;
		$scope.selectedStudy = null;

		StudyService
			.getStudies()
			.then(function(studies){
				console.log(studies);
				$scope.studies = studies;
			})
			.catch(function(){
				console.log("Error getting list of studies");
			});

        /*$scope.goTo = function(path) {
            $location.path('/'+path);
        };*/

        $scope.logOut = function() {
    		AuthService.logOut();
    		$location.path('/login');
		};

        $scope.changePassword = function(ev) {

            $mdDialog.show({
                controller: 'ChangePasswordCtrl',
                templateUrl: 'app/partials/changePassword.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: false
            })
			.then(function(answer) {
				$scope.status = 'You said the information was "' + answer + '".';
			}, function() {
				$scope.status = 'You cancelled the dialog.';
			});
        };

        $scope.openMenu = function($mdMenu, ev){
            $mdMenu.open(ev);
        };

        $scope.onStudyChange = function() {
        	console.log($scope.selectedStudy);
            StudyService.selectedStudy = $scope.selectedStudy;
		}

});