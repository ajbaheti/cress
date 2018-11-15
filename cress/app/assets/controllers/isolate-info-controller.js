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
                if(data !== 'No match found'){
                    $scope.isolates = data;
                    $scope.originalIsolates = angular.copy($scope.isolates, $scope.originalIsolates);
                } else {
                    $scope.isolates = [];
                }
            })
            .catch(function(err){
                console.log("Error getting tests for sample");
            });

        $scope.changeInIsolateRow = function(isolate){
            var temp = $scope.originalIsolates.filter(function(islt){
                return islt.test_id === isolate.test_id;
            });
            var sampleKeys = Object.keys(temp[0]);
            var noChange = true;
            sampleKeys.forEach(function(key){
                if(temp[0][''+key] !== isolate[''+key]){
                    noChange = false;
                }
            });
            isolate.showSave = !noChange;
        };

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