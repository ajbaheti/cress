'use strict';

angular.module('CressApp')
    .factory('PatientService', function($http, $q){

        var service = {
            patientList: null,
            selectedPatientId: null,
            currentPatientLabels: null,
            patientDropDownObjects: null,
            getStudyLabels: getStudyLabels,
            getSinglePatientInfo: getSinglePatientInfo,
            getDropDownValues: getDropDownValues,
            savePatient: savePatient
        };

        return service;

        function getStudyLabels(id) {
            var deferred = $q.defer();
            $http
                // .get('http://localhost/cress-backend/getStudyPatientLabels.php?id='+id)
                .get('http://googleglass.cias.rit.edu/cress-backend/getStudyPatientLabels.php?id='+id)
                .then(function(response){
                    deferred.resolve(response.data);
                })
                .catch(function(err){
                    console.log("Error in patient-service - getStudyLabels");
                    console.log(err);
                    deferred.reject("Error in patient-service - getStudyLabels");
                });

            return deferred.promise
        }

        function getSinglePatientInfo(studyId, patientId) {
            var deferred = $q.defer();
            $http
                // .get('http://localhost/cress-backend/getPatientInfo.php?study_id='+studyId+'&patient_id='+patientId)
                .get('http://googleglass.cias.rit.edu/cress-backend/getPatientInfo.php?study_id='+studyId+'&patient_id='+patientId)
                .then(function(response){
                    deferred.resolve(response.data);
                })
                .catch(function(err){
                    console.log("Error in patient-service - getStudyLabels");
                    console.log(err);
                    deferred.reject("Error in patient-service - getStudyLabels");
                });

            return deferred.promise
        }

        function getDropDownValues(studyId) {
            var deferred = $q.defer();
            $http
                // .get('http://localhost/cress-backend/getStudyDropdownValues.php?id='+studyId)
                .get('http://googleglass.cias.rit.edu/cress-backend/getStudyDropdownValues.php?id='+studyId)
                .then(function(response){
                    deferred.resolve(response.data);
                })
                .catch(function(err){
                    console.log("Error in patient-service - getDropDownValues");
                    console.log(err);
                    deferred.reject("Error in patient-service - getDropDownValues");
                });

            return deferred.promise
        }

        function savePatient(patient) {
            var deferred = $q.defer();
            $http
                // .post('http://localhost/cress-backend/savePatient.php', {patientObj: patient})
                .post('http://googleglass.cias.rit.edu/cress-backend/savePatient.php', {patientObj: patient})
                .then(function(response){
                    deferred.resolve(response.data);
                })
                .catch(function(err){
                    console.log("Error in patient-service - savePatient");
                    console.log(err);
                    deferred.reject("Error in patient-service - savePatient");
                });

            return deferred.promise
        }

    });