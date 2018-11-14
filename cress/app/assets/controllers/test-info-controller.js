'use strict';

angular.module('CressApp')
    .controller('TestInfoCtrl', function ($scope, $location, $mdMenu, $mdDialog, AuthService, TestsService, RedirectPath) {

        if(RedirectPath !== '/test-info'){
            $location.path(RedirectPath);
        }

        $scope.allTests = TestsService.selectedTestInfo;
        console.log($scope.allTests);

        $scope.saveAllTests = function() {
            console.log($scope.allTests);
        }

    });