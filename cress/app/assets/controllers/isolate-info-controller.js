'use strict';

angular.module('CressApp')
    .controller('IsolateInfoCtrl', function ($scope, $location, $mdMenu, $mdToast, $mdDialog, RedirectPath,
                     AuthService, IsolateService, TestsService) {

        if(RedirectPath !== '/isolate-info'){
            $location.path(RedirectPath);
        }

        if (!Array.prototype.find) {
            Object.defineProperty(Array.prototype, 'find', {
                value: function(predicate) {
                    // 1. Let O be ? ToObject(this value).
                    if (this == null) {
                        throw new TypeError('"this" is null or not defined');
                    }

                    var o = Object(this);

                    // 2. Let len be ? ToLength(? Get(O, "length")).
                    var len = o.length >>> 0;

                    // 3. If IsCallable(predicate) is false, throw a TypeError exception.
                    if (typeof predicate !== 'function') {
                        throw new TypeError('predicate must be a function');
                    }

                    // 4. If thisArg was supplied, let T be thisArg; else let T be undefined.
                    var thisArg = arguments[1];

                    // 5. Let k be 0.
                    var k = 0;

                    // 6. Repeat, while k < len
                    while (k < len) {
                        // a. Let Pk be ! ToString(k).
                        // b. Let kValue be ? Get(O, Pk).
                        // c. Let testResult be ToBoolean(? Call(predicate, T, « kValue, k, O »)).
                        // d. If testResult is true, return kValue.
                        var kValue = o[k];
                        if (predicate.call(thisArg, kValue, k, o)) {
                            return kValue;
                        }
                        // e. Increase k by 1.
                        k++;
                    }

                    // 7. Return undefined.
                    return undefined;
                },
                configurable: true,
                writable: true
            });
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

                    var testDropDownObjects = {};
                    //for each label (drop down), create separate array with values
                    uniqueLabels.forEach(function(lbl){
                        testDropDownObjects[''+lbl.lbl_text] = data.filter(function(obj){
                            return obj.LabelText === lbl.lbl_text;
                        });
                    });
                    TestsService.testDropDownObjects = testDropDownObjects;
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

        function removeDuplicates(myArr, prop) {
            return myArr.filter(function(obj, pos, arr){
                return arr.map(function(mapObj){
                    return mapObj[prop];
                }).indexOf(obj[prop]) === pos;
            });
        }

        function showMsg(txt) {
            $mdToast.show(
                $mdToast.simple()
                    .textContent(txt)
                    .position('bottom right')
                    .hideDelay(3000)
            );
        }

    });