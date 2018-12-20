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
        $scope.isolateColumnMetadata = IsolateService.columnMetadata;
        $scope.isolateDropDownObjects = IsolateService.isolateDropDownObjects;
        $scope.isolates = IsolateService.isolates;

        $scope.countForColspan = $scope.isolateColumnMetadata.length + 2;

        $scope.originalIsolates = angular.copy($scope.isolates, $scope.originalIsolates);

        TestsService
            .getTestDropdownValues()
            .then(function(data){
                if(data !== 'No data found'){
                    var testLabelIds = data.map(function(obj){
                        return {lbl_text: obj.LabelText};
                    });
                    var uniqueLabels = removeDuplicates(testLabelIds, "lbl_text");

                    //for each label (drop down), create separate array with values
                    uniqueLabels.forEach(function(lbl){
                        $scope.testDropDownObjects[''+lbl.lbl_text] = data.filter(function(obj){
                            return obj.LabelText === lbl.lbl_text;
                        });
                    });
                    TestsService.testDropDownObjects = $scope.testDropDownObjects;
                }
            })
            .catch(function(err){

            });

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
                    .getTestsBySampleOrIsolateId(testId, 'ISOLATE')
                    .then(function(data){
                        if(data !== 'No data found'){
                            var temp = [];
                            data.forEach(function(test){
                                var foundTestId = temp.find(function(t){
                                    return test.TestId === t.TestId;
                                });
                                //if test id not found, add it to the array
                                if(!foundTestId){
                                    temp.push({TestId:test.TestId});
                                }
                            });

                            TestsService
                                .getTestMetadata()
                                .then(function(cols){
                                    TestsService.columnMetadata = cols;
                                    // create test object for display
                                    $scope.tests = temp;
                                    for(var i=0; i<temp.length; i++){
                                        cols.forEach(function(colName){
                                            $scope.tests[i][''+colName.LabelText] = null;
                                        });
                                    }
                                    // fill in the values in tests array
                                    $scope.tests.forEach(function(id){
                                        data.forEach(function(vis){
                                            if(vis.TestId === id.TestId){
                                                id[''+vis.LabelText] = vis.Result;
                                            }
                                        });
                                    });

                                    TestsService.tests = $scope.tests;
                                    $location.path('/test-info');
                                })
                                .catch(function(err){
                                    console.log(err);
                                    showMsg("Something went wrong, please try again later.");
                                });
                        } else {
                            console.log(data);
                            showMsg("No data found");
                        }
                    })
                    .catch(function(err){
                        console.log("error getting test information by id");
                        showMsg("Something went wrong, please try again later.");
                    });
            }
        };

        $scope.saveIsolate = function(sampleObj) {
            var dataToSave = [];

            $scope.isolateColumnMetadata.forEach(function(metadata){
                dataToSave.push({
                    IsolateId: sampleObj.IsolateId,
                    ItemId: metadata.ItemId,
                    Result: sampleObj[''+metadata.LabelText],
                    Notation: null
                });
            });

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
            IsolateService
                .deleteSingleIsolate($scope.sampleId, sampleObj.IsolateId)
                .then(function(data){
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
            if($scope.newRow){
                var dataToSave = [];
                $scope.isolateColumnMetadata.forEach(function(metadata){
                    dataToSave.push({
                        IsolateId: 0, //$scope.newRow.IsolateId, //Unknown
                        ItemId: metadata.ItemId,
                        Result: $scope.newRow[''+metadata.LabelText] ? $scope.newRow[''+metadata.LabelText] : null,
                        Notation: null
                    });
                });
                $scope.showAddButton = false;
                $scope.showAddIsolate = false;
                console.log(dataToSave);
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