'use strict';

angular.module('CressApp')
	.controller('IsolatesCtrl', function ($scope, $location, $mdMenu, $mdDialog, AuthService, IsolateService, RedirectPath) {

	    if(RedirectPath !== '/isolates'){
            $location.path(RedirectPath);
        }

        $scope.isolateId = null;

        $scope.findSample = function() {
            if($scope.isolateId){
                IsolateService
                    .findSampleById($scope.isolateId)
                    .then(function(sample){
                        if(sample === 'No match found'){
                            console.log("No data found");
                        }
                        else {
                            IsolateService.selectedIsolate = sample[0];
                            $location.path('/isolate-info');
                        }
                    })
                    .catch(function(err){
                        console.log("Error getting sample by id");
                    });
            }
        };
});