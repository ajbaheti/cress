'use strict';

angular.module('CressApp')
    .controller('IsolateInfoCtrl', function ($scope, $location, $mdMenu, $mdDialog, RedirectPath,
                     AuthService, IsolateService, TestsService) {

        if(RedirectPath !== '/isolate-info'){
            $location.path(RedirectPath);
        }

        $scope.newRow = {};
        $scope.isolates = null;
        $scope.showAddIsolate = false;
        $scope.showAddButton = true;
        $scope.sample = IsolateService.selectedIsolate;

        $scope.types = ['catarahllis', 'streptococcus', 'aureus', 'Bacteria', 'none', 'influenzae'];
        $scope.locations = ['inventory', 'repository'];

        IsolateService
            .getTestsForIsolate($scope.sample.sample_id)
            .then(function(data){
                console.log(data);
                if(data !== 'No match found'){
                    $scope.isolates = data;
                } else {
                    $scope.isolates = [];
                }
            })
            .catch(function(err){
                console.log("Error getting tests for sample");
            });

        /*$scope.$watch(function(){
            return $scope.isolates;
        }, function(oldVal, newVal){
            console.log(oldVal);
            console.log(newVal);
        });*/

        $scope.goToTestInfo = function(testId) {
            if(testId){
                TestsService
                    .getTestsById(testId)
                    .then(function(data){
                        if(data !== 'No tests found'){
                            TestsService.selectedTestInfo = data;
                            $location.path('/test-info');
                        } else {
                            $location.path('/tests');
                        }
                    })
                    .catch(function(err){
                        console.log("error getting test information by id");
                    });
            }
        };

        $scope.saveIsolate = function(sampleObj) {
            console.log(sampleObj);
        };

        $scope.deleteIsolate = function(sampleObj) {
            console.log(sampleObj);
        };

        $scope.addIsolateClick = function() {
            $scope.showAddIsolate = true;
        };

        $scope.saveNewRow = function() {
            console.log($scope.newRow);
            $scope.showAddButton = false;
            $scope.showAddIsolate = false;
        };

    });