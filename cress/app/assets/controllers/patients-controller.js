'use strict';

angular.module('CressApp')
	.controller('PatientsCtrl', function ($scope, $location, $mdMenu, $mdDialog,
              AuthService, PatientService, StudyService, IsolateService, TestsService, RedirectPath) {

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
});