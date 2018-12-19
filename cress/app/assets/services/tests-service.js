'use strict';

angular.module('CressApp')
    .factory('TestsService', function($http, $q) {

        var service = {
            tests: null,
            columnMetadata: null,
            testDropDownObjects: null,
            getTestsBySampleOrIsolateId: getTestsBySampleOrIsolateId,
            getTestMetadata: getTestMetadata,
            getTestDropdownValues: getTestDropdownValues,
            saveTests: saveTests
        };

        return service;

        function getTestsBySampleOrIsolateId(id, criteria) {
            var deferred = $q.defer();
            $http
                .get('http://localhost/cress-backend-new/Test/getTestsBySampleOrIsolateId.php?id='+id+'&criteria='+criteria)
                .then(function (response) {
                    deferred.resolve(response.data);
                })
                .catch(function (err) {
                    console.log("Error in tests-service - getTestsBySampleOrIsolateId");
                    console.log(err);
                    deferred.reject("Error in tests-service - getTestsBySampleOrIsolateId");
                });

            return deferred.promise;
        }

        function getTestMetadata() {
            var deferred = $q.defer();
            $http
                .get('http://localhost/cress-backend-new/Test/getTestMetadata.php')
                .then(function (response) {
                    deferred.resolve(response.data);
                })
                .catch(function (err) {
                    console.log("Error in tests-service - getTestMetadata");
                    console.log(err);
                    deferred.reject("Error in tests-service - getTestMetadata");
                });

            return deferred.promise;
        }

        function getTestDropdownValues() {
            var deferred = $q.defer();
            $http
                .get('http://localhost/cress-backend-new/Test/getTestDropdownValues.php')
                .then(function (response) {
                    deferred.resolve(response.data);
                })
                .catch(function (err) {
                    console.log("Error in tests-service - getTestDropdownValues");
                    console.log(err);
                    deferred.reject("Error in tests-service - getTestDropdownValues");
                });

            return deferred.promise;
        }

        function saveTests(testsObj) {
            var deferred = $q.defer();
            $http
                .post('http://localhost/cress-backend-new/Test/saveTests.php', {testsObj})
                .then(function(response){
                    deferred.resolve(response.data);
                })
                .catch(function(err){
                    console.log("Error in tests-service - saveTests");
                    console.log(err);
                    deferred.reject("Error in tests-service - saveTests");
                });

            return deferred.promise;
        }

    });