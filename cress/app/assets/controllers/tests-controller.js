'use strict';

angular.module('CressApp')
    .controller('TestsCtrl', function ($scope, $location, $mdMenu, $mdToast, $mdDialog, AuthService, TestsService, RedirectPath) {

        if(RedirectPath !== '/tests'){
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