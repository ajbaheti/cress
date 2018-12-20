'use strict';

angular.module('CressApp')
    .controller('TestsCtrl', function ($scope, $location, $mdMenu, $mdToast, $mdDialog, AuthService, TestsService, RedirectPath) {

        if(RedirectPath !== '/tests'){
            $location.path(RedirectPath);
        }

        $scope.searchCriteria = 'SAMPLE';
        $scope.idToSearch = null;
        $scope.testDropDownObjects = {};

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

        $scope.getTestInfo = function() {
            if($scope.idToSearch){
                TestsService
                    .getTestsBySampleOrIsolateId($scope.idToSearch, $scope.searchCriteria)
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
            else {
                showMsg("Enter Id");
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

        function removeDuplicates(myArr, prop) {
            return myArr.filter(function(obj, pos, arr){
                return arr.map(function(mapObj){
                    return mapObj[prop];
                }).indexOf(obj[prop]) === pos;
            });
        }

    });