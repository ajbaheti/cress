'use strict';

angular.module('CressApp')
    .factory('IsolateService', function($http, $q) {

        var service = {
            selectedIsolate: null,
            getVisitSamples: getVisitSamples,
            findSampleById: findSampleById,
            getTestsForIsolate: getTestsForIsolate
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
                // .get('http://localhost/cress-backend/getIsolateById.php?id=' + sampleId)
                .get('http://googleglass.cias.rit.edu/cress-backend/getIsolateById.php?id=' + sampleId)
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

        function getTestsForIsolate(id) {
            var deferred = $q.defer();
            $http
                // .get('http://localhost/cress-backend/getTestsForIsolate.php?id=' + id)
                .get('http://googleglass.cias.rit.edu/cress-backend/getTestsForIsolate.php?id=' + id)
                .then(function (response) {
                    deferred.resolve(response.data);
                })
                .catch(function (err) {
                    console.log("Error in isolate-service - getTestsForIsolate");
                    console.log(err);
                    deferred.reject("Error in isolate-service - getTestsForIsolate");
                });

            return deferred.promise;
        }
    });