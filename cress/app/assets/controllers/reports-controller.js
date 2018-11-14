'use strict';

angular.module('CressApp')
    .controller('ReportsCtrl', function ($scope, $location, $mdMenu, $mdDialog, AuthService, RedirectPath) {

        if(RedirectPath !== '/reports'){
            $location.path(RedirectPath);
        }

        console.log("reports controller called");

    });