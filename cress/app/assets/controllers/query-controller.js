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
        $scope.searchClicked = false;
        $scope.searchResult = [];
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
            var index = null;
            $scope.allFields.forEach(function(obj, i){
            	if(obj.FieldName === fieldObj.FieldName){
            		index = i;
            	}
            });
            $scope.allFields.splice(index, 1);
            $scope.queryFields.push(fieldObj);
            $scope.searchClicked = false;
        };

        $scope.removeFromQueryFields = function(fieldObj) {
            $scope.allFields.push(fieldObj);
            $scope.searchClicked = false;
        };

        $scope.filterValueSelected = function(row) {
            $scope.searchClicked = false;
            row.showCondition = true;
            row.disableFilter = true;
        };

        $scope.removeCurrentRow = function(row, index) {
            $scope.searchClicked = false;
            $scope.rows.splice(index, 1);
            if($scope.rows.length === 0){
                $scope.rows = [{showCondition: false, disableFilter: false}];
            }
        };

        $scope.addNewRow = function() {
            $scope.searchClicked = false;
            $scope.rows.push({showCondition: false, disableFilter: false});
        };

        $scope.search = function() {
            // console.log($scope.rows);
            $scope.searchClicked = true;
        };

        $scope.reset = function() {
            $scope.rows = [{showCondition: false, disableFilter: false}];
            $scope.allFields = $scope.savedAllFields;
            $scope.queryFields = [];
            $scope.searchClicked = false;
        };

    });