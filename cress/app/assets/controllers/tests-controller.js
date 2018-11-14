'use strict';

angular.module('CressApp')
    .controller('TestsCtrl', function ($scope, $location, $mdMenu, $mdDialog, AuthService, TestsService, RedirectPath) {

        if(RedirectPath !== '/tests'){
            $location.path(RedirectPath);
        }

        $scope.testId = null;

        $scope.getTestInfo = function() {
            console.log($scope.testId);
            if($scope.testId){
                TestsService
                    .getTestsById($scope.testId)
                    .then(function(data){
                        if(data !== 'No tests found'){
                            // console.log(data);
                            TestsService.selectedTestInfo = data;
                            $location.path('/test-info');
                        } else {
                            console.log(data);
                        }
                    })
                    .catch(function(err){
                        console.log("error getting test information by id");
                    });
            }
        }

    });