(function () {

    'use strict';

    angular.module('CressApp')
        .directive('crdToolbar', [function () {
            return {
                restrict: 'E',
                replace: true,
                templateUrl: 'app/partials/crd-toolbar.html',
                scope: {
                    currentNavItem: '@',
                    showTabs: '@'
                },
                controller: 'crdToolbarCtrl'
            }
        }])
        .controller('crdToolbarCtrl', function($scope, $location, $mdDialog, $mdMenu, AuthService) {
            $scope.showMenu = AuthService.isLoggedIn();

            if(!$scope.showMenu){
                $location.path('/login');
            }

            $scope.isAdmin = AuthService.user.isAdmin;

            $scope.goTo = function(path) {
                $location.path('/'+path);
            };

            $scope.goToHome = function() {
                $location.path('/');
            };

            $scope.logOut = function() {
                AuthService.logOut()
                    .then(function(){
                        $location.path('/login');
                    });
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

        });
})();