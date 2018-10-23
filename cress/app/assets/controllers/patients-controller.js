'use strict';

angular.module('CressApp')
	.controller('PatientsCtrl', function ($scope, $location, $mdMenu, $mdDialog, AuthService, PatientService, StudyService) {
    	console.log('Patients ctrl called');

        $scope.patients = PatientService.patientList;
    	$scope.editPatient = true;
        $scope.showMenu = AuthService.isLoggedIn();
        if(!$scope.showMenu){
            $location.path('/login');
        }
        $scope.currentNavItem = 'patients';
        $scope.isAdmin = AuthService.user.isAdmin;
        $scope.selectedPatient = $scope.patients[0];

        PatientService
            .getStudyLabels(StudyService.selectedStudy.study_id)
            .then(function(labels){
                console.log(labels);
                PatientService.currentPatientLabels = labels;
            })
            .catch(function(err){
                console.log(err);
            });

        $scope.goTo = function(path) {
            $location.path('/'+path);
        };

        $scope.goToHome = function() {
            $location.path('/');
        };

        $scope.logOut = function() {
            AuthService.logOut();
            $location.path('/login');
        };

        $scope.changePassword = function(ev) {

            $mdDialog.show({
                controller: 'ChangePasswordCtrl',
                templateUrl: 'app/partials/changePassword.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: false
            })
            .then(function(answer) {
                $scope.status = 'You said the information was "' + answer + '".';
            }, function() {
                $scope.status = 'You cancelled the dialog.';
            });
        };

        $scope.openMenu = function($mdMenu, ev){
            $mdMenu.open(ev);
        };

        $scope.onPatientSelect = function() {
            console.log("value changed to");
            console.log($scope.selectedPatient);
            PatientService.selectedPatientId = $scope.selectedPatient.patient_id;
            $location.path('/patient-info');
        }
});