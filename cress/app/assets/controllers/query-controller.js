'use strict';

angular.module('CressApp')
    .controller('QueryCtrl', function ($scope, $location, $mdMenu, $mdDialog, RedirectPath, AuthService,
                IsolateService, TestsService, QueryService) {

        if(RedirectPath !== '/query'){
            $location.path(RedirectPath);
        }

        $scope.savedAllFields = [];
        $scope.queryFields = [];
        $scope.allFields = [];
        $scope.conditionTypes = ['=', '<', '<=', '>', '>=', "not"];
        $scope.queryConditions = ['AND', 'OR'];
        $scope.rows = [{showCondition: false, disableFilter: false}];

        QueryService
            .getQueryFields()
            .then(function(fields){
                $scope.allFields = fields;
                $scope.savedAllFields = angular.copy(fields, $scope.savedAllFields);
            })
            .catch(function(err){
                console.log("Error getting query fields");
            });

        $scope.addToQueryFields = function(fieldObj) {
            $scope.allFields.splice($scope.allFields.findIndex(function(obj){
                return obj.field_name === fieldObj.field_name;
            }), 1);
            $scope.queryFields.push(fieldObj);
        };

        $scope.removeFromQueryFields = function(fieldObj) {
            $scope.allFields.push(fieldObj);
        };

        $scope.filterValueSelected = function(row) {
            row.showCondition = true;
            row.disableFilter = true;
        };

        $scope.removeCurrentRow = function(row, index) {
            $scope.rows.splice(index, 1);
            if($scope.rows.length === 0){
                $scope.rows = [{showCondition: false, disableFilter: false}];
            }
        };

        $scope.addNewRow = function() {
            $scope.rows.push({showCondition: false, disableFilter: false});
        };

        $scope.search = function() {
            console.log($scope.rows);
        };

        $scope.reset = function() {
            $scope.rows = [{showCondition: false, disableFilter: false}];
            $scope.allFields = $scope.savedAllFields;
            $scope.queryFields = [];
        };

    });