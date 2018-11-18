'use strict';

angular.module('CressApp')
	.controller('PatientsCtrl', function ($scope, $location, $mdMenu, $mdDialog, AuthService, PatientService, StudyService, RedirectPath) {

	    if(RedirectPath !== '/patients'){
            $location.path(RedirectPath);
        }

        $scope.patients = PatientService.patientList;
    	$scope.editPatient = true;
        $scope.dropDownObjects = {};
        $scope.selectedPatient = null;

        // get the list of labels to be displayed for patient
        PatientService
            .getStudyLabels(StudyService.selectedStudy.study_id)
            .then(function(labels){
                if(labels){
                    PatientService.currentPatientLabels = labels;
                    // console.log(labels);
                }
            })
            .catch(function(err){
                console.log(err);
            });

        // get values of all the patient drop down fields and prepare them to be used directly in patients-info
        PatientService
            .getDropDownValues(StudyService.selectedStudy.study_id)
            .then(function(result){
                if(result){
                    // get all drop down values for current study and find all unique labels
                    var studyLabelIds = result.map(function(obj){
                        return {id: obj.study_label_id, lbl_text: obj.label_text};
                    });
                    var uniqueLabelIds = removeDuplicates(studyLabelIds, "id");

                    //for each label (drop down), create separate array with values
                    uniqueLabelIds.forEach(function(lbl){
                        $scope.dropDownObjects[''+lbl.lbl_text] = result.filter(function(obj){
                            return obj.study_label_id === lbl.id;
                        });
                    });
                    PatientService.patientDropDownObjects = $scope.dropDownObjects;
                }
            })
            .catch(function(err){
                console.log("Error fetching drop down values");
            });

        $scope.onPatientSelect = function(patient) {
            $scope.selectedPatient = patient;
            PatientService.selectedPatientId = $scope.selectedPatient.patient_id;
            $location.path('/patient-info');
            return $scope.selectedPatient;
        };

        function removeDuplicates(myArr, prop) {
             return myArr.filter(function(obj, pos, arr){
                return arr.map(function(mapObj){
                    return mapObj[prop];
                }).indexOf(obj[prop]) === pos;
            });
        } 

        //TODO Admin page drop down edits
        //TODO Sort drop down values by sort_order
        //TODO is_required fields on top..basically sort
});