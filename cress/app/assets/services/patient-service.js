'use strict';

angular.module('CressApp')
    .factory('PatientService', function($http, $q){

        var service = {
            patientList: null,
            selectedPatientId: null,
            currentPatientLabels: null,
            patientDropDownObjects: null,
            getListOfPatients: getListOfPatients,
            getPatientLabels: getPatientLabels,
            getSinglePatientInfo: getSinglePatientInfo,
            getPatientDropdownValues: getPatientDropdownValues,
            savePatient: savePatient,
            deletePatientDropdownValue: deletePatientDropdownValue,
            addPatientDropdownValue: addPatientDropdownValue
        };

        return service;

        function getListOfPatients() {
            var deferred = $q.defer();
            $http
                .get('/cress-backend-new/Subject/getPatientList.php')
                .then(function(response){
                    deferred.resolve(response.data);
                })
                .catch(function(err){
                    console.log("Error in patient-service - getListOfPatients");
                    console.log(err);
                    deferred.reject("Error in patient-service - getListOfPatients");
                });

            return deferred.promise;
        }

        function getPatientLabels() {
            var deferred = $q.defer();
            $http
                .get('/cress-backend-new/Subject/getPatientLabels.php')
                .then(function(response){
                    deferred.resolve(response.data);
                })
                .catch(function(err){
                    console.log("Error in patient-service - getPatientLabels");
                    console.log(err);
                    deferred.reject("Error in patient-service - getPatientLabels");
                });

            return deferred.promise;
        }

        function getSinglePatientInfo(patientId) {
            var deferred = $q.defer();
            $http
                .get('/cress-backend-new/Subject/getSinglePatientInfo.php?patient_id='+patientId)
                .then(function(response){
                    deferred.resolve(response.data);
                })
                .catch(function(err){
                    console.log("Error in patient-service - getSinglePatientInfo");
                    console.log(err);
                    deferred.reject("Error in patient-service - getSinglePatientInfo");
                });

            return deferred.promise;
        }

        function getPatientDropdownValues() {
            var deferred = $q.defer();
            $http
                .get('/cress-backend-new/Subject/getPatientDropdownValues.php')
                .then(function(response){
                    deferred.resolve(response.data);
                })
                .catch(function(err){
                    console.log("Error in patient-service - getPatientDropdownValues");
                    console.log(err);
                    deferred.reject("Error in patient-service - getPatientDropdownValues");
                });

            return deferred.promise;
        }

        function savePatient(patient) {
            var deferred = $q.defer();
            $http
                .post('/cress-backend-new/Subject/savePatient.php', {patient:patient})
                .then(function(response){
                    deferred.resolve(response.data);
                })
                .catch(function(err){
                    console.log("Error in patient-service - savePatient");
                    console.log(err);
                    deferred.reject("Error in patient-service - savePatient");
                });

            return deferred.promise;
        }

        function deletePatientDropdownValue(itemId, valueId) {
            var deferred = $q.defer();
            $http
                .get('/cress-backend-new/Subject/deletePatientDropdownValue.php?item_id='+itemId+'&value_id='+valueId)
                .then(function(response){
                    deferred.resolve(response.data);
                })
                .catch(function(err){
                    console.log("Error in patient-service - deletePatientDropdownValue");
                    console.log(err);
                    deferred.reject("Error in patient-service - deletePatientDropdownValue");
                });

            return deferred.promise;
        }

        function addPatientDropdownValue(newRowObject) {
            var deferred = $q.defer();
            $http
                .post('/cress-backend-new/Subject/addPatientDropdownValue.php', {newRowObject:newRowObject})
                .then(function(response){
                    deferred.resolve(response.data);
                })
                .catch(function(err){
                    console.log("Error in patient-service - addPatientDropdownValue");
                    console.log(err);
                    deferred.reject("Error in patient-service - addPatientDropdownValue");
                });

            return deferred.promise;
        }

    });