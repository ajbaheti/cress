'use strict';

angular.module('CressApp')
    .factory('VisitService', function($http, $q){

        var service = {
            getListOfVisits: getListOfVisits,
            getVisitTypes: getVisitTypes,
            getDefaultVisitColumns: getDefaultVisitColumns,
            getVisitTypeGroupings: getVisitTypeGroupings,
            getGroupingDropDownValues: getGroupingDropDownValues
        };

        return service;

        function getListOfVisits(patientId) {
            var deferred = $q.defer();
            $http
                // .get('http://googleglass.cias.rit.edu/cress-backend/getVisitsForPatient.php?id='+patientId)
                // .get('http://localhost/cress-backend/getVisitsForPatient.php?id='+patientId)
                .get('http://localhost/cress-backend-new/getVisitsForPatient.php?id='+patientId)
                .then(function(response){
                    deferred.resolve(response.data);
                })
                .catch(function(err){
                    console.log("Error in visit-service - getListOfVisits");
                    console.log(err);
                    deferred.reject("Error in visit-service - getListOfVisits");
                });

            return deferred.promise
        }

        function getVisitTypes() {
            var deferred = $q.defer();
            $http
                // .get('http://localhost/cress-backend/getVisitTypes.php')
                .get('http://googleglass.cias.rit.edu/cress-backend/getVisitTypes.php')
                .then(function(response){
                    deferred.resolve(response.data);
                })
                .catch(function(err){
                    console.log("Error in visit-service - getVisitTypes");
                    console.log(err);
                    deferred.reject("Error in visit-service - getVisitTypes");
                });

            return deferred.promise
        }

        function getDefaultVisitColumns() {
            var deferred = $q.defer();
            $http
                // .get('http://localhost/cress-backend/getVisitDefaultColumns.php')
                .get('http://googleglass.cias.rit.edu/cress-backend/getVisitDefaultColumns.php')
                .then(function(response){
                    deferred.resolve(response.data);
                })
                .catch(function(err){
                    console.log("Error in visit-service - getDefaultVisitColumns");
                    console.log(err);
                    deferred.reject("Error in visit-service - getDefaultVisitColumns");
                });

            return deferred.promise;
        }

        function getGroupingDropDownValues() {
            var deferred = $q.defer();
            $http
                // .get('http://localhost/cress-backend/getGroupingDropdownValues.php')
                .get('http://googleglass.cias.rit.edu/cress-backend/getGroupingDropdownValues.php')
                .then(function(response){
                    deferred.resolve(response.data);
                })
                .catch(function(err){
                    console.log("Error in visit-service - getGroupingDropDownValues");
                    console.log(err);
                    deferred.reject("Error in visit-service - getGroupingDropDownValues");
                });

            return deferred.promise;
        }

        function getVisitTypeGroupings(visitTypes) {
            var deferred = $q.defer();
            $http
                // .get('http://localhost/cress-backend/getVisitTypeGroupings.php?idList='+visitTypes)
                .get('http://googleglass.cias.rit.edu/cress-backend/getVisitTypeGroupings.php?idList='+visitTypes)
                .then(function(response){
                    deferred.resolve(response.data);
                })
                .catch(function(err){
                    console.log("Error in visit-service - getVisitTypeGroupings");
                    console.log(err);
                    deferred.reject("Error in visit-service - getVisitTypeGroupings");
                });

            return deferred.promise
        }
    });