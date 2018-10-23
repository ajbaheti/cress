'use strict';

angular.module('CressApp')
    .factory('StudyService', function($http, $q){

        var service = {
            selectedStudy: null,
            getStudies: getStudies,
            getPatientsForStudy: getPatientsForStudy
        };

        return service;

        function getStudies() {
            var deferred = $q.defer();
            $http
                .get('http://localhost/cress-backend/getStudies.php')
                .then(function(response){
                    deferred.resolve(response.data);
                })
                .catch(function(err){
                    console.log("Error in study-service - getStudies");
                    console.log(err);
                    deferred.reject("Error in study-service - getStudies");
                });

            return deferred.promise
        }

        function getPatientsForStudy(id) {
            var deferred = $q.defer();
            $http
                .get('http://localhost/cress-backend/getPatientList.php?id='+id)
                .then(function(response){
                    deferred.resolve(response.data);
                })
                .catch(function(err){
                    console.log("Error in study-service - getPatientsForStudy");
                    console.log(err);
                    deferred.reject("Error in study-service - getPatientsForStudy");
                });

            return deferred.promise
        }

    });