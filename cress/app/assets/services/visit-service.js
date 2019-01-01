'use strict';

angular.module('CressApp')
    .factory('VisitService', function($http, $q){

        var service = {
            visitDropDownObjects: null,
            getListOfVisits: getListOfVisits,
            getVisitDropdownValues: getVisitDropdownValues,
            getVisitTypes: getVisitTypes,
            getDefaultVisitColumns: getDefaultVisitColumns,
            getVisitTypeGroupings: getVisitTypeGroupings,
            getGroupingDropDownValues: getGroupingDropDownValues,
            getSamplesForVisit: getSamplesForVisit,
            getSampleMetadata: getSampleMetadata,
            addVisitDropdownValue: addVisitDropdownValue,
            deleteVisitDropdownValue: deleteVisitDropdownValue
        };

        return service;

        function getListOfVisits(patientId) {
            var deferred = $q.defer();
            $http
                .get('http://localhost/cress-backend-new/Visit/getVisitsForPatient.php?id='+patientId)
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

        function getVisitDropdownValues() {
            var deferred = $q.defer();
            $http
                .get('http://localhost/cress-backend-new/Visit/getVisitDropdownValues.php')
                .then(function (response) {
                    deferred.resolve(response.data);
                })
                .catch(function (err) {
                    console.log("Error in visit-service - getVisitDropdownValues");
                    console.log(err);
                    deferred.reject("Error in visit-service - getVisitDropdownValues");
                });

            return deferred.promise;
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

        function getSamplesForVisit(visitId) {
            var deferred = $q.defer();
            $http
                .get('http://localhost/cress-backend-new/Visit/getSamplesForVisit.php?id=' + visitId)
                .then(function (response) {
                    deferred.resolve(response.data);
                })
                .catch(function (err) {
                    console.log("Error in visit-service - getSamplesForVisit");
                    console.log(err);
                    deferred.reject("Error in visit-service - getSamplesForVisit");
                });

            return deferred.promise;
        }

        function getSampleMetadata() {
            var deferred = $q.defer();
            $http
                .get('http://localhost/cress-backend-new/Visit/getSamplesMetadata.php')
                .then(function (response) {
                    deferred.resolve(response.data);
                })
                .catch(function (err) {
                    console.log("Error in visit-service - getSamplesMetadata");
                    console.log(err);
                    deferred.reject("Error in visit-service - getSamplesMetadata");
                });

            return deferred.promise;
        }

        function deleteVisitDropdownValue(itemId, valueId) {
            var deferred = $q.defer();
            $http
                .get('http://localhost/cress-backend-new/Visit/deleteVisitDropdownValue.php?item_id='+itemId+'&value_id='+valueId)
                .then(function(response){
                    deferred.resolve(response.data);
                })
                .catch(function(err){
                    console.log("Error in visit-service - deleteVisitDropdownValue");
                    console.log(err);
                    deferred.reject("Error in visit-service - deleteVisitDropdownValue");
                });

            return deferred.promise;
        }

        function addVisitDropdownValue(newRowObject) {
            var deferred = $q.defer();
            $http
                .post('http://localhost/cress-backend-new/Visit/addVisitDropdownValue.php', {newRowObject})
                .then(function(response){
                    deferred.resolve(response.data);
                })
                .catch(function(err){
                    console.log("Error in visit-service - addVisitDropdownValue");
                    console.log(err);
                    deferred.reject("Error in visit-service - addVisitDropdownValue");
                });

            return deferred.promise;
        }
    });