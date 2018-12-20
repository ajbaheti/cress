'use strict';

angular.module('CressApp')
    .controller('PatientInfoCtrl', function ($scope, $location, $mdMenu, $mdDialog, $mdToast, moment,
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
        // console.log($scope.patientDropDownValues);

        //get list of labels to be shown on left and right
        $scope.leftLabelList = PatientService.currentPatientLabels.leftLabels;
        $scope.rightLabelList = PatientService.currentPatientLabels.rightLabels;

        // create an empty model for each field being displayed in html
        $scope.leftLabelList.forEach(function(lbl){
            $scope.patientInfoObj[''+lbl.LabelText] = null;
        });
        $scope.rightLabelList.forEach(function(lbl){
            $scope.patientInfoObj[''+lbl.LabelText] = null;
        });

        /*// default visit columns to display
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
            });*/

        //get selected patient information
        PatientService
            .getSinglePatientInfo(PatientService.selectedPatientId)
            .then(function(patient){
                if(patient.length > 0){
                    // TODO: loop through left and right label list and find multi-select values
                    // then assign model values in array
                    patient.forEach(function(row){
                        $scope.patientInfoObj[''+row.Labeltext] = row.Result;
                    });
                } else {
                    showMsg("Patient information not found");
                }
            })
            .catch(function(err){
                console.log(err);
                showMsg("Something went wrong, please try again later");
            });

        // visit columns to display
        $scope.visitDefaultColumns = ['visitType', 'visit_date']; //visitId is shown by default

        // get visits information for patient
        VisitService
            .getListOfVisits(PatientService.selectedPatientId)
            .then(function(visitsFound){
                if(visitsFound === "No visits found"){
                    $scope.visits = [];
                } else {
                    var temp = [];
                    // find unique visit ids
                    visitsFound.forEach(function(vis){
                        var foundVisitId = temp.find(function(visit){
                            return visit.visitId === vis.VisitId;
                        });
                        //if visit id not found, add it to the array
                        if(!foundVisitId){
                            temp.push({visitId:vis.VisitId});
                        }
                    });

                    // create visits object for display
                    $scope.visits = temp;
                    for(var i=0; i<temp.length; i++){
                        $scope.visitDefaultColumns.forEach(function(colName){
                            $scope.visits[i][''+colName] = null;
                        });
                    }

                    // fill in the values in visits array
                    $scope.visits.forEach(function(id){
                        visitsFound.forEach(function(vis){
                            if(vis.VisitId === id.visitId && inDefaultColumns(vis.Labeltext)){
                                id[''+vis.Labeltext] = vis.Result;
                            }
                        });
                    });
                }
            })
            .catch(function(err){
                showMsg("Something went wrong, please try again later");
                console.log(err);
            });

        $scope.savePatient = function() {
            var allRequiredEntered = true;
            var dataToSave = [];
            $scope.leftLabelList.forEach(function(lbl){
                dataToSave.push({
                    SubjectId: PatientService.selectedPatientId,
                    ItemId: lbl.ItemId,
                    Result: $scope.patientInfoObj[''+lbl.LabelText],
                    Notation: null
                });
                if(lbl.IsRequired === '1' && !$scope.patientInfoObj[''+lbl.LabelText]) {
                    allRequiredEntered = false;
                }
            });
            $scope.rightLabelList.forEach(function(lbl){
                dataToSave.push({
                    SubjectId: PatientService.selectedPatientId,
                    ItemId: lbl.ItemId,
                    Result: $scope.patientInfoObj[''+lbl.LabelText],
                    Notation: null
                });
                if(lbl.IsRequired === '1' && !$scope.patientInfoObj[''+lbl.LabelText]) {
                    allRequiredEntered = false;
                }
            });
            if(allRequiredEntered){
                PatientService
                    .savePatient(dataToSave)
                    .then(function(data){
                        // console.log(data);
                        if(data === ""){
                            showMsg("Patient saved successfully");
                            console.log("Patient saved successfully");
                        }
                        else {
                            showMsg("Error saving patient");
                            console.log("Error saving patient");
                        }
                    })
                    .catch(function(err){
                        showMsg("Error saving patient");
                        console.log("error in saving patient");
                    });
            }
            else {
                showMsg("Something went wrong, please try again later");
                console.log("Enter all required fields");
            }
        };

        $scope.goToVisit = function(visit, ev) {
            $mdDialog.show({
                locals:{visitId: visit.visitId},
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

        function showMsg(txt) {
            $mdToast.show(
                $mdToast.simple()
                    .textContent(txt)
                    .position('bottom right' )
                    .hideDelay(3000)
            );
        }

        function inDefaultColumns(label) {
            var x = $scope.visitDefaultColumns.find(function(name){
                return name === label;
            });

            return !!x;
        }
    });