'use strict';

angular.module('CressApp')
    .controller('TestInfoCtrl', function ($scope, $location, $mdMenu, $mdToast, $mdDialog, AuthService, TestsService, RedirectPath) {

        if(RedirectPath !== '/test-info'){
            $location.path(RedirectPath);
        }

        $scope.testDropDownValues = TestsService.testDropDownObjects;
        $scope.columnMetadata = TestsService.columnMetadata;
        $scope.allTests = TestsService.tests;

        $scope.originalTests = angular.copy($scope.allTests, $scope.originalTests);
        // console.log($scope.allTests);

        $scope.saveAllTests = function() {
            var dataToSave = [];
            $scope.allTests.forEach(function(test){
                $scope.columnMetadata.forEach(function(lbl){
                    dataToSave.push({
                        TestId: test.TestId,
                        ItemId: lbl.ItemId,
                        Result: test[''+lbl.LabelText],
                        Notation: null
                    });
                });
            });

            // console.log(dataToSave);
            TestsService
                .saveTests(dataToSave)
                .then(function(data){
                    if(data === ""){
                        $scope.originalTests = angular.copy($scope.allTests, $scope.originalTests);
                        showMsg("Tests saved successfully");
                    }
                    else {
                        showMsg("Error saving tests");
                    }
                })
                .catch(function(err){
                    showMsg("Error saving tests");
                    console.log(err);
                });
        };

        $scope.enableSave = function() {
            return angular.equals($scope.originalTests, $scope.allTests);
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