'use strict';

angular.module('CressApp')
    .factory('AuthService', function($http, $q){

        var service = {
            user: {
                username: null,
                isAdmin: false
            },
            credentials: {
                username: null,
                password: null,
                error: null,
                clear: function() {
                    this.username = null;
                    this.password = null;
                    this.error = null;
                }
            },

            isLoggedIn: function() {
                return service.user.username !== null;
            },

            processLogin: function() {
                var deferred = $q.defer();
                $http
                    // .get('http://localhost/cress-backend/login.php?name='+service.credentials.username+'&pass='+service.credentials.password)
                    .get('http://googleglass.cias.rit.edu/cress-backend/login.php?name='+service.credentials.username+'&pass='+service.credentials.password)
                    .then(function(response){
                        var user = {};
                        if(response.data.length === 1){
                            user = response.data[0];
                        } else {
                            user.error = "Invalid Username/Password";
                        }
                        deferred.resolve(user);
                    })
                    .catch(function(err){
                        console.log("Error in auth-service - processLogin");
                        console.log(err);
                        deferred.reject("Error in auth-service - processLogin");
                    });

                return deferred.promise;
            },

            logOut: function () {
                var deferred = $q.defer();
                $http
                    // .get('http://localhost/cress-backend/logout.php')
                    .get('http://googleglass.cias.rit.edu/cress-backend/logout.php')
                    .then(function(response){
                        if(response.data === "SUCCESS"){
                            service.credentials.clear();
                            service.user.username = null;
                            deferred.resolve(response.data);
                        }
                    })
                    .catch(function(err){
                        console.log("Error in auth-service - logOut");
                        console.log(err);
                        deferred.reject("Error in auth-service - logOut");
                    });

                return deferred.promise;
            },

            changePassword: function(pwdToSave) {
                var deferred = $q.defer();
                $http
                    // .get('http://localhost/cress-backend/changePassword.php?name='+service.user.username+'&pass='+pwdToSave)
                    .get('http://googleglass.cias.rit.edu/cress-backend/changePassword.php?name='+service.user.username+'&pass='+pwdToSave)
                    .then(function(response){
                        deferred.resolve(response.data);
                    })
                    .catch(function(err){
                        console.log("Error in auth-service - changePassword");
                        console.log(err);
                        deferred.reject("Error in auth-service - changePassword");
                    });

                return deferred.promise;
            },

            getSession: function() {
                var deferred = $q.defer();
                $http
                    // .get('http://localhost/cress-backend/getSession.php')
                    .get('http://googleglass.cias.rit.edu/cress-backend/getSession.php')
                    .then(function(response){
                        deferred.resolve(response.data);
                    })
                    .catch(function(err){
                        console.log("Error in auth-service - getSession");
                        console.log(err);
                        deferred.reject("Error in auth-service - getSession");
                    });

                return deferred.promise;
            }
        };

        return service;
    });