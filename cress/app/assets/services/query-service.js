'use strict';

angular.module('CressApp')
    .factory('QueryService', function($http, $q){

        var service = {
            getQueryFields: getQueryFields
        };

        return service;

        function getQueryFields() {
            var deferred = $q.defer();
            $http
                // .get('/cress-backend/getQueryFields.php')
                .get('/cress-backend-new/getQueryFields.php')
                .then(function(response){
                    deferred.resolve(response.data);
                })
                .catch(function(err){
                    console.log("Error in query-service - getQueryFields");
                    console.log(err);
                    deferred.reject("Error in query-service - getQueryFields");
                });

            return deferred.promise;
        }

    });