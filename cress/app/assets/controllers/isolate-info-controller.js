'use strict';

angular.module('CressApp')
    .controller('IsolateInfoCtrl', function ($scope, $location, $mdMenu, $mdToast, $mdDialog, RedirectPath,
                     AuthService, IsolateService, TestsService) {

        if(RedirectPath !== '/isolate-info'){
            $location.path(RedirectPath);
        }

        $scope.newRow = {};
        $scope.showAddIsolate = false;
        $scope.showAddButton = true;

        $scope.sampleId = IsolateService.sampleId;
        $scope.dropdowns = IsolateService.dropDownValues;
        $scope.isolates = IsolateService.isolates;
        console.log($scope.isolates);
        console.log($scope.dropdowns);
        $scope.originalIsolates = angular.copy($scope.isolates, $scope.originalIsolates);

        $scope.changeInIsolateRow = function(isolate){
            var temp = $scope.originalIsolates.filter(function(islt){
                return islt.TestId === isolate.TestId;
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
            var dataToSave = [];
            dataToSave.push({
                IsolateId: sampleObj.IsolateId,
                ItemId: 0,
                Result: sampleObj.bacteriaType,
                Notation: null
            });
            dataToSave.push({
                IsolateId: sampleObj.IsolateId,
                ItemId: 1,
                Result: sampleObj.isolateLocation,
                Notation: null
            });
            dataToSave.push({
                IsolateId: sampleObj.IsolateId,
                ItemId: 2,
                Result: sampleObj.isolateNotation,
                Notation: null
            });

            console.log(dataToSave);
            IsolateService
                .updateSingleIsolate(dataToSave)
                .then(function(data){
                    console.log(data);
                    if(data === ""){
                        sampleObj.showSave = false;
                        showMsg("Isolate saved successfully");
                        console.log("Isolate saved successfully");
                    }
                    else {
                        showMsg("Error saving Isolate");
                        console.log("Error saving Isolate");
                    }
                })
                .catch(function(err){
                    console.log(err);
                });
        };

        $scope.deleteIsolate = function(sampleObj) {
            console.log(sampleObj);
            IsolateService
                .deleteSingleIsolate($scope.sampleId, sampleObj.IsolateId)
                .then(function(data){
                    console.log(data);
                    if(data === 'Data deleted successfully'){
                        $scope.isolates = $scope.isolates.filter(function(iso){
                            return iso.TestId !== sampleObj.TestId;
                        });
                        showMsg("Isolate deleted successfully");
                    }
                    else {
                        showMsg("Error deleting Isolate");
                    }
                })
                .catch(function(err){
                    console.log(err);
                });
        };

        $scope.addIsolateClick = function() {
            $scope.showAddIsolate = true;
        };

        $scope.saveNewRow = function() {
            console.log($scope.newRow);

            if($scope.newRow){
                var dataToSave = [];
                if($scope.newRow.bacteriaType){
                    dataToSave.push({
                    });
                }
                $scope.showAddButton = false;
                $scope.showAddIsolate = false;
            }
        };

        function showMsg(txt) {
            $mdToast.show(
                $mdToast.simple()
                    .textContent(txt)
                    .position('bottom right')
                    .hideDelay(3000)
            );
        }

    });