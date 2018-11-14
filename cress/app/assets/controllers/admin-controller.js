'use strict';

angular.module('CressApp')
    .controller('AdminCtrl', function ($scope, $location, $mdMenu, $mdDialog, AuthService, PatientService, RedirectPath) {
        if(RedirectPath !== '/admin'){
            $location.path(RedirectPath);
        }

        console.log(PatientService.patientDropDownObjects);
        $scope.keys = Object.entries(PatientService.patientDropDownObjects);
        console.log($scope.keys);


        //TODO: when saving label order(patient), validate if order is sequence or not before saving for correctness

    });