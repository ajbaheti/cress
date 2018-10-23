'use strict';

angular.module('CressApp')
    .controller('PatientInfoCtrl', function ($scope, $location, $mdMenu, $mdDialog, AuthService, PatientService, StudyService) {
        console.log('Patients info ctrl called');

        $scope.infoValArray = [];
        $scope.showMenu = AuthService.isLoggedIn();
        if(!$scope.showMenu){
            $location.path('/login');
        }
        $scope.currentNavItem = 'patients';
        $scope.isAdmin = AuthService.user.isAdmin;

        console.log(PatientService.selectedPatientId);
        console.log(PatientService.currentPatientLabels);
        PatientService
            .getSinglePatientInfo(StudyService.selectedStudy.study_id, PatientService.selectedPatientId)
            .then(function(patient){
                console.log(patient);
            })
            .catch(function(err){
                console.log(err);
            });

        PatientService.currentPatientLabels.forEach(function(obj){
            var showTextField = false;
            var showDateField = false;
            var showSelectField = false;
            switch(obj.label_type){
                case 'single':
                    showTextField = true;
                    break;
                case 'multiple':
                    showSelectField = true;
                    break;
                case 'date':
                    showDateField = true;
                    break;
            }
            $scope.infoValArray.push({
                showTextField: showTextField, showDateField: showDateField, showSelectField: showSelectField,
                label: obj.label_text, isRequired: obj.is_required === 1
            });
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
    });