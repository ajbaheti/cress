'use strict';

angular.module('CressApp')
    .controller('ChangePasswordCtrl', function ($scope, $mdDialog, $mdToast, AuthService) {

        $scope.password = null;
        $scope.confirmPassword = null;
        $scope.error = null;

        $scope.changePwd = function() {
            if($scope.password !== $scope.confirmPassword){
                $scope.error = "Passwords don't match";
            } else {
                $scope.error = null;
                AuthService
                    .changePassword($scope.password)
                    .then(function(result){
                        if(result.toString().includes('success')){
                            showToast("Password Updated successfully");
                            $mdDialog.cancel();
                        } else {
                            showToast("Something went Wrong, please try again later");
                            $mdDialog.cancel();
                        }
                    })
                    .catch(function(err){
                        console.log("Error changing password");
                        console.log(err);
                    });
            }
        };

        $scope.cancel = function() {
            $mdDialog.cancel();
        };

        function showToast(msg) {
            $mdToast.show(
                $mdToast.simple()
                    .textContent(msg)
                    .position('bottom right')
                    .hideDelay(5000)
            );
        }

    });