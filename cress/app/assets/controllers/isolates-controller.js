'use strict';

angular.module('CressApp')
	.controller('IsolatesCtrl', function ($scope, $location, $mdMenu, $mdToast, $mdDialog, AuthService, IsolateService, RedirectPath) {

	    if(RedirectPath !== '/isolates'){
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

        $scope.sampleId = null;

        IsolateService
            .getIsolateDropdownValues()
            .then(function(data){
                if(data !== 'No data found'){
                    var testLabelIds = data.map(function(obj){
                        return {lbl_text: obj.LabelText};
                    });
                    var uniqueLabels = removeDuplicates(testLabelIds, "lbl_text");

                    var isolateDropDownObjects = {};
                    //for each label (drop down), create separate array with values
                    uniqueLabels.forEach(function(lbl){
                        isolateDropDownObjects[''+lbl.lbl_text] = data.filter(function(obj){
                            return obj.LabelText === lbl.lbl_text;
                        });
                    });
                    IsolateService.isolateDropDownObjects = isolateDropDownObjects;
                }
            })
            .catch(function(err){

            });

        $scope.findIsolateBySample = function() {
            if($scope.sampleId){
                IsolateService
                    .findSampleById($scope.sampleId)
                    .then(function(isolatesFound){
                        if(isolatesFound === 'No match found'){
                            console.log("No data found");
                            showMsg("No data found");
                        }
                        else {
                            IsolateService.sampleId = $scope.sampleId;
                            var temp = [];
                            isolatesFound.forEach(function(isolate){
                                var foundIsolateId = temp.find(function(iso){
                                    return isolate.IsolateId === iso.IsolateId;
                                });
                                //if visit id not found, add it to the array
                                if(!foundIsolateId){
                                    temp.push({IsolateId:isolate.IsolateId, TestId: null});
                                }
                            });

                            IsolateService
                                .getIsolateMetadataColumns()
                                .then(function(cols){
                                    IsolateService.columnMetadata = cols;
                                    // create isolates object for display
                                    var isolateData = temp;
                                    for(var i=0; i<temp.length; i++){
                                        cols.forEach(function(colName){
                                            isolateData[i][''+colName.LabelText] = null;
                                        });
                                    }

                                    // fill in the values in isolates array
                                    isolateData.forEach(function(id){
                                        isolatesFound.forEach(function(vis){
                                            if(vis.IsolateId === id.IsolateId){
                                                id[''+vis.LabelText] = vis.Result;
                                                id['TestId'] = vis.TestId;
                                            }
                                        });
                                    });

                                    // console.log(isolateData);
                                    IsolateService.isolates = isolateData;
                                    $location.path('/isolate-info');
                                })
                                .catch(function(err){
                                    console.log(err);
                                });
                        }
                    })
                    .catch(function(err){
                        console.log("Error getting sample by id");
                    });
            }
        };

        $scope.goToIsolate = function(sample) {
            IsolateService.selectedIsolate = sample;
            $location.path('/isolate-info');
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