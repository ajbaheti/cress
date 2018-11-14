'use strict';

angular.module('CressApp')
    .factory('TestsService', function($http, $q) {

        var service = {
            selectedTestInfo: null,
            getTestsById: getTestsById
        };

        return service;

        function getTestsById(testId) {
            var deferred = $q.defer();
            $http
                .get('http://localhost/cress-backend/getTestsUnderMainTest.php?id=' + testId)
                .then(function (response) {
                    deferred.resolve(response.data);
                })
                .catch(function (err) {
                    console.log("Error in tests-service - getVisitSamples");
                    console.log(err);
                    deferred.reject("Error in tests-service - getVisitSamples");
                });

            return deferred.promise;
        }

    });