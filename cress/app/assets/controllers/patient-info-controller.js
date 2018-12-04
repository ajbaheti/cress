'use strict';

angular.module('CressApp')
    .controller('PatientInfoCtrl', function ($scope, $location, $mdMenu, $mdDialog, moment,
                 StudyService, AuthService, PatientService, VisitService, RedirectPath) {

        if(RedirectPath !== '/patient-info'){
            $location.path(RedirectPath);
        }

        // create an empty object for model (2-way binding)
        $scope.patientInfoObj = {};
        // default visit columns to display
        $scope.visitColumns = [];
        // empty visits array
        $scope.visits = [];

        //Assign drop down values object to the variable in scope
        $scope.patientDropDownValues = PatientService.patientDropDownObjects;
        // console.log("drop down values");
        // console.log($scope.patientDropDownValues);

        //get list of labels to be shown on left and right
        $scope.leftLabelList = PatientService.currentPatientLabels.leftLabels;
        $scope.rightLabelList = PatientService.currentPatientLabels.rightLabels;

        // create an empty model for each field being displayed in html
        $scope.leftLabelList.forEach(function(lbl){
            $scope.patientInfoObj[''+lbl.db_field] = null;
        });
        $scope.rightLabelList.forEach(function(lbl){
            $scope.patientInfoObj[''+lbl.db_field] = null;
        });

        // default visit columns to display
        VisitService
            .getDefaultVisitColumns()
            .then(function(cols){
                // console.log(cols);
                if(cols !== 'Error finding visit columns'){
                    $scope.visitColumns = cols;
                } else {
                    console.log("Error getting visit columns");
                }
            })
            .catch(function(err){
                console.log(err);
                console.log("Error getting visit default columns");
            });

        //get selected patient information
        PatientService
            .getSinglePatientInfo(StudyService.selectedStudy.study_id, PatientService.selectedPatientId)
            .then(function(patient){
                // console.log(patient);
                if(patient.length > 0){
                    // TODO: loop through left and right label list and find multi-select values
                    // then assign model values in array
                    $scope.patientInfoObj = patient[0];
                } else {
                    console.log("Patient information not found");
                }
            })
            .catch(function(err){
                console.log(err);
            });

        // get visits information for patient
        VisitService
            .getListOfVisits(PatientService.selectedPatientId)
            .then(function(visits){
                // console.log(visits);
                if(visits === "No visits found"){
                    $scope.visits = [];
                } else {
                    $scope.visits = visits;
                }
            })
            .catch(function(err){
                console.log(err);
            });

        $scope.savePatient = function() {
            // console.log($scope.patientInfoObj);
            var allRequiredEntered = true;
            $scope.leftLabelList.forEach(function(lbl){
                if(lbl.is_required === '1' && !$scope.patientInfoObj[''+lbl.db_field]) {
                    allRequiredEntered = false;
                }
            });
            $scope.rightLabelList.forEach(function(lbl){
                if(lbl.is_required === '1' && !$scope.patientInfoObj[''+lbl.db_field]) {
                    allRequiredEntered = false;
                }
            });
            if(allRequiredEntered){
                console.log("saving the patient");
                PatientService
                    .savePatient($scope.patientInfoObj)
                    .then(function(data){
                        console.log(data);
                    })
                    .catch(function(err){
                        console.log("error in saving patient");
                    });
            }
            else {
                console.log("Enter all required fields");
            }
        };

        $scope.goToVisit = function(visit, ev) {
            $mdDialog.show({
                locals:{visitObject: visit},
                templateUrl: 'app/partials/visit.html',
                controller: 'VisitCtrl',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: false
            })
            .then(function(answer) {
                if(answer === "SUCCESS"){
                    console.log(answer);
                }
            }, function() {});
        };

        //TODO - add activate things in function, so that it can be called on successful patient save
    });