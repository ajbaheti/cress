'use strict';

angular.module('CressApp')
    .controller('VisitCtrl', function ($scope, $location, $mdMenu, $mdDialog,
            AuthService, PatientService, visitObject, IsolateService, VisitService) {

        $scope.patientId = PatientService.selectedPatientId;
        $scope.visit = visitObject;
        $scope.visit.selectedVisitType = null;
        $scope.inputVal = null;
        $scope.groupingDropdownObjects = {};

        // get all visits types for drop down
        VisitService
            .getVisitTypes()
            .then(function(visitTypes){
                $scope.listOfVisitTypes = visitTypes;
            })
            .catch(function(err){
                console.log("error fetching visit types");
                console.log(err);
            });

        // get all the samples for visit
        IsolateService
            .getVisitSamples($scope.visit.visit_id)
            .then(function(samples){
                // console.log(samples);
                if(samples === "No samples found"){
                    $scope.samples = [];
                } else {
                    samples.forEach(function(sampl){
                        sampl.isChecked = true;
                    });
                    $scope.samples = samples;
                }
            })
            .catch(function(err){
                console.log("error fetching samples");
                console.log(err);
            });

        VisitService
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
            });

        $scope.cancel = function() {
            $mdDialog.cancel();
        };

        $scope.goToSample = function(sample) {
            IsolateService.selectedIsolate = sample;
            $location.path('/isolate-info');
            $mdDialog.cancel();
        };

        $scope.saveSamples = function() {
            console.log($scope.samples);
        };

        $scope.sampleValueChanged = function(sample) {
            console.log(sample);
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
    });