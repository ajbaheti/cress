'use strict';

angular.module('CressApp')
    .controller('VisitCtrl', function ($scope, $location, $mdMenu, $mdDialog, $mdToast,
            AuthService, PatientService, visitId, IsolateService, VisitService) {

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

        $scope.visitId = visitId;
        $scope.patientId = PatientService.selectedPatientId;
        $scope.inputVal = null;
        $scope.groupingDropdownObjects = {};

        // get all visits types for drop down
        /*VisitService
            .getVisitTypes()
            .then(function(visitTypes){
                $scope.listOfVisitTypes = visitTypes;
            })
            .catch(function(err){
                console.log("error fetching visit types");
                console.log(err);
            });*/

        // get all the samples for visit
        VisitService
            .getSamplesForVisit($scope.visitId)
            .then(function(data){
                if(data !== 'No data found') {
                    var temp = [];
                    // console.log(data);
                    data.forEach(function (sample) {
                        var foundSampleId = temp.find(function (t) {
                            return sample.SampleId === t.SampleId;
                        });

                        if (!foundSampleId) {
                            temp.push({SampleId: sample.SampleId});
                        }
                    });

                    VisitService
                        .getSampleMetadata()
                        .then(function (cols) {
                            $scope.samples = temp;
                            $scope.sampleMetadata = cols;
                            for (var i = 0; i < temp.length; i++) {
                                cols.forEach(function (colName) {
                                    $scope.samples[i]['' + colName.LabelText] = null;
                                });
                            }
                            // fill in the values in tests array
                            $scope.samples.forEach(function (id) {
                                data.forEach(function (vis) {
                                    if (vis.SampleId === id.SampleId) {
                                        id['' + vis.LabelText] = vis.Result;
                                    }
                                });
                            });
                            // console.log($scope.samples);
                        })
                        .catch(function (err) {
                            console.log(err);
                        });
                }
                else {

                }
            })
            .catch(function(err){
                console.log(err);
            });

        /*VisitService
            .getGroupingDropDownValues()
            .then(function(result){
                if(result){
                    // get all drop down values for grouping labels
                    var GroupingLabels = result.map(function(obj){
                        return {lbl_text: obj.label_text};
                    });
                    var uniqueLabels = removeDuplicates(GroupingLabels, "lbl_text");

                    //for each label (drop down), create separate array with values
                    uniqueLabels.forEach(function(lbl){
                        $scope.groupingDropdownObjects[''+lbl.lbl_text] = result.filter(function(obj){
                            return obj.label_text === lbl.lbl_text;
                        });
                    });
                    console.log($scope.groupingDropdownObjects);
                }
            })
            .catch(function(err){
                console.log("Error fetching drop down values");
            });*/

        $scope.cancel = function() {
            $mdDialog.cancel();
        };

        $scope.goToIsolate = function(sample) {
            if(sample){
                IsolateService
                    .findSampleById(sample.SampleId)
                    .then(function(isolatesFound){
                        if(isolatesFound === 'No match found'){
                            console.log("No data found");
                            // showMsg("No data found");
                        }
                        else {
                            IsolateService.sampleId = sample.SampleId;
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
                                    $mdDialog.cancel();
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

        $scope.saveSamples = function() {
            var dataToSave = [];
            $scope.samples.forEach(function(sample){
                $scope.sampleMetadata.forEach(function(lbl){
                    dataToSave.push({
                        SampleId: sample.SampleId,
                        ItemId: lbl.ItemId,
                        Result: sample[''+lbl.LabelText],
                        Notation: null
                    });
                });
            });

            // console.log(dataToSave);
            VisitService
                .saveSamples(dataToSave)
                .then(function(data){
                    if(data === ""){
                        // $scope.originalTests = angular.copy($scope.allTests, $scope.originalTests);
                        showMsg("Samples saved successfully");
                    }
                    else {
                        showMsg("Error saving samples");
                    }
                })
                .catch(function(err){
                    showMsg("Error saving tests");
                    console.log(err);
                });
        };

        $scope.sampleValueChanged = function(sample) {
            // console.log(sample);
        };

        $scope.visitTypeChanged = function() {
            // console.log($scope.visit.selectedVisitType);
            var typeIds = "";
            if($scope.visit.selectedVisitType && $scope.visit.selectedVisitType.length > 0){
                $scope.visit.selectedVisitType.forEach(function(vt){
                    typeIds += vt.visit_type_id + ",";
                });
            }
            typeIds = typeIds.substring(0, typeIds.length-1);
            VisitService
                .getVisitTypeGroupings(typeIds)
                .then(function(data){
                    $scope.allGroupings = [];
                    // $scope.groupingFields = [];
                    if(data.length > 0){
                        var temp = data.map(function(obj){
                            //TODO - find unique column here like db_field or some other
                            return {group_title: obj.grouping_title, lbl_text: obj.grouping_label};
                        });
                        //find unique group titles
                        var uniqueGroupTitles = removeDuplicates(temp, "group_title");
                        // find unique labels from all the groups
                        var uniqueLabels = removeDuplicates(temp, "lbl_text");
                        //data manipulation for view to display
                        uniqueGroupTitles.forEach(function(title){
                            $scope.allGroupings.push({
                                group_title: title.group_title,
                                groupingFields: []
                            });
                        });
                        uniqueLabels.forEach(function(lbl){
                            //get data for the current label
                            var x = data.filter(function(obj){
                                return obj.grouping_label === lbl.lbl_text;
                            });
                            // find grouping, this label belongs to and push data to that groups fields
                            var y = findGroup($scope.allGroupings, lbl)
                            y.groupingFields.push(x[0]);
                        });
//                         console.log($scope.allGroupings);
                    }
                })
                .catch(function(err){
                    console.log(err);
                });
        };

        $scope.saveVisit = function() {
            console.log($scope.visit);
        };

        function removeDuplicates(myArr, prop) {
             return myArr.filter(function(obj, pos, arr){
                return arr.map(function(mapObj){
                    return mapObj[prop];
                }).indexOf(obj[prop]) === pos;
            });
        } 
        
        function findGroup(arr, lbl) {
        	var tempG = null;
        	arr.forEach(function(obj){
        		if(obj.group_title === lbl.group_title){
        			tempG = obj;
        		}
        	});
        	return tempG;
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