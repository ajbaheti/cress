'use strict';

angular.module('CressApp')
    .factory('PatientService', function($http, $q){

        var service = {
            patientList: null,
            selectedPatientId: null,
            currentPatientLabels: null,
            getStudyLabels: getStudyLabels,
            getSinglePatientInfo: getSinglePatientInfo
        };

        return service;

        function getStudyLabels(id) {
            var deferred = $q.defer();
            $http
                .get('http://localhost/cress-backend/getStudyPatientLabels.php?id='+id)
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
                .get('http://localhost/cress-backend/getPatientInfo.php?study_id='+studyId+'&patient_id='+patientId)
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

    });