'use strict';

angular.module('CressApp')
	.controller('PatientsCtrl', function ($scope, $location, $mdMenu, $mdDialog, AuthService, PatientService, StudyService, RedirectPath) {

	    if(RedirectPath !== '/patients'){
            $location.path(RedirectPath);
        }

        // get the list of patients
        PatientService
            .getListOfPatients()
            .then(function(patients){
                if(patients !== 'No patients found'){
                    $scope.patients = patients;
                }
            })
            .catch(function(err){
                console.log(err);
            });

    	$scope.editPatient = true;
        $scope.dropDownObjects = {};
        // $scope.selectedPatient = null;

        // get the list of labels to be displayed for patient
        PatientService
            .getPatientLabels()
            .then(function(labels){
                if(labels !== 'No labels found'){
                    PatientService.currentPatientLabels = labels;
                }
            })
            .catch(function(err){
                console.log(err);
            });

        // get values of all the patient drop down fields and prepare them to be used directly in patients-info
        PatientService
            .getPatientDropdownValues()
            .then(function(result){
                if(result){
                    var patientLabelIds = result.map(function(obj){
                        return {lbl_text: obj.LabelText};
                    });
                    var uniqueLabels = removeDuplicates(patientLabelIds, "lbl_text");

                    //for each label (drop down), create separate array with values
                    uniqueLabels.forEach(function(lbl){
                        $scope.dropDownObjects[''+lbl.lbl_text] = result.filter(function(obj){
                            return obj.LabelText === lbl.lbl_text;
                        });
                    });
                    PatientService.patientDropDownObjects = $scope.dropDownObjects;
                }
            })
            .catch(function(err){
                console.log("Error fetching drop down values");
            });

        $scope.onPatientSelect = function(patient) {
            // $scope.selectedPatient = patient;
            PatientService.selectedPatientId = patient.subjectId;
            $location.path('/patient-info');
            return patient;
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