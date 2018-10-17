'use strict';

angular.module('CressApp')
    .factory('StudyService', function($http, $q){

        var service = {

            selectedStudy: null,

            getStudies: function() {
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

        };

        return service;
    });