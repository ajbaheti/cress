'use strict';

angular.module('CressApp')
    .factory('IsolateService', function($http, $q) {

        var service = {
            sampleId: null,
            isolates: null,
            columnMetadata: null,
            isolateDropDownObjects: null,
            findSampleById: findSampleById,
            getIsolateDropdownValues: getIsolateDropdownValues,
            getIsolateMetadataColumns: getIsolateMetadataColumns,
            deleteSingleIsolate: deleteSingleIsolate,
            updateSingleIsolate: updateSingleIsolate,
            deleteIsolateDropdownValue: deleteIsolateDropdownValue,
            addIsolateDropdownValue: addIsolateDropdownValue
        };

        return service;

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

        function deleteIsolateDropdownValue(itemId, valueId) {
            var deferred = $q.defer();
            $http
                .get('http://localhost/cress-backend-new/Isolate/deleteIsolateDropdownValue.php?item_id='+itemId+'&value_id='+valueId)
                .then(function(response){
                    deferred.resolve(response.data);
                })
                .catch(function(err){
                    console.log("Error in isolate-service - deleteIsolateDropdownValue");
                    console.log(err);
                    deferred.reject("Error in isolate-service - deleteIsolateDropdownValue");
                });

            return deferred.promise;
        }

        function addIsolateDropdownValue(newRowObject) {
            var deferred = $q.defer();
            $http
                .post('http://localhost/cress-backend-new/Isolate/addIsolateDropdownValue.php', {newRowObject})
                .then(function(response){
                    deferred.resolve(response.data);
                })
                .catch(function(err){
                    console.log("Error in isolate-service - addIsolateDropdownValue");
                    console.log(err);
                    deferred.reject("Error in isolate-service - addIsolateDropdownValue");
                });

            return deferred.promise;
        }

    });