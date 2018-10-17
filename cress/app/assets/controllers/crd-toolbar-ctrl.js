'use strict';

angular.module('CressApp')
    .directive('crdToolbar', [function () {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'app/partials/crd-toolbar.html',
            scope: {},
            controller: 'crdToolbarController'
        }
    }])
    .controller('crdToolbarController', function($scope) {
        console.log("crdToolbarController activated");
    });