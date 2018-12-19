'use strict';

angular.module('CressApp')
    .factory('IsolateService', function($http, $q) {

        var service = {
            sampleId: null,
            isolates: null,
            getVisitSamples: getVisitSamples,
            findSampleById: findSampleById,
            getIsolateDropdownValues: getIsolateDropdownValues,
            getIsolateMetadataColumns: getIsolateMetadataColumns,
            deleteSingleIsolate: deleteSingleIsolate,
            updateSingleIsolate: updateSingleIsolate
        };

        return service;

        function getVisitSamples(visitId) {
            var deferred = $q.defer();
            $http
                // .get('http://localhost/cress-backend/getSamples.php?id=' + visitId)
                .get('http://googleglass.cias.rit.edu/cress-backend/getSamples.php?id=' + visitId)
                .then(function (response) {
                    deferred.resolve(response.data);
                })
                .catch(function (err) {
                    console.log("Error in isolate-service - getVisitSamples");
                    console.log(err);
                    deferred.reject("Error in isolate-service - getVisitSamples");
                });

            return deferred.promise;
        }

        function findSampleById(sampleId) {
            var deferred = $q.defer();
            $http
                .get('http://localhost/cress-backend-new/Isolate/getIsolateBySampleId.php?id=' + sampleId)
                .then(function (response) {
                    deferred.resolve(response.data);
                })
                .catch(function (err) {
                    console.log("Error in isolate-service - findSampleById");
                    console.log(err);
                    deferred.reject("Error in isolate-service - findSampleById");
                });

            return deferred.promise;
        }

        function getIsolateDropdownValues() {
            var deferred = $q.defer();
            $http
                .get('http://localhost/cress-backend-new/Isolate/getIsolateDropdownValues.php')
                .then(function (response) {
                    deferred.resolve(response.data);
                })
                .catch(function (err) {
                    console.log("Error in isolate-service - getIsolateDropdownValues");
                    console.log(err);
                    deferred.reject("Error in isolate-service - getIsolateDropdownValues");
                });

            return deferred.promise;
        }

        function getIsolateMetadataColumns() {
            var deferred = $q.defer();
            $http
                .get('http://localhost/cress-backend-new/Isolate/getIsolateMetadataColumns.php')
                .then(function (response) {
                    deferred.resolve(response.data);
                })
                .catch(function (err) {
                    console.log("Error in isolate-service - getIsolateMetadataColumns");
                    console.log(err);
                    deferred.reject("Error in isolate-service - getIsolateMetadataColumns");
                });

            return deferred.promise;
        }

        function deleteSingleIsolate(sampleId, isolateId) {
            var deferred = $q.defer();
            $http
                .get('http://localhost/cress-backend-new/Isolate/deleteSingleIsolate.php?sample_id='+sampleId+'&isolate_id='+isolateId)
                .then(function (response) {
                    deferred.resolve(response.data);
                })
                .catch(function (err) {
                    console.log("Error in isolate-service - deleteSingleIsolate");
                    console.log(err);
                    deferred.reject("Error in isolate-service - deleteSingleIsolate");
                });

            return deferred.promise;
        }

        function updateSingleIsolate(isolate) {
            var deferred = $q.defer();
            $http
                .post('http://localhost/cress-backend-new/Isolate/updateSingleIsolate.php', {isolate})
                .then(function(response){
                    deferred.resolve(response.data);
                })
                .catch(function(err){
                    console.log("Error in isolate-service - updateSingleIsolate");
                    console.log(err);
                    deferred.reject("Error in isolate-service - updateSingleIsolate");
                });

            return deferred.promise;
        }
    });