'use strict';

angular.module('CressApp')
	.controller('IsolatesCtrl', function ($scope, $location, $mdMenu, $mdToast, $mdDialog, AuthService, IsolateService, RedirectPath) {

	    if(RedirectPath !== '/isolates'){
            $location.path(RedirectPath);
        }

        $scope.sampleId = null;
        $scope.Isolates = [];
        $scope.dropdowns = [];

        $scope.findSample = function() {
            if($scope.sampleId){
                IsolateService
                    .findSampleById($scope.sampleId)
                    .then(function(isolatesFound){
                        if(isolatesFound === 'No match found'){
                            console.log("No data found");
                            showMsg("No data found");
                        }
                        else {
                            IsolateService.sampleId = $scope.sampleId;
                            console.log(isolatesFound);
                            var temp = [];
                            isolatesFound.forEach(function(isolate){
                                var foundIsolateId = temp.find(function(iso){
                                    return isolate.IsolateId === iso.IsolateId;
                                });
                                //if visit id not found, add it to the array
                                if(!foundIsolateId){
                                    temp.push({IsolateId:isolate.IsolateId, TestId: null});
                                }
                            });

                            IsolateService
                                .getIsolateMetadataColumns()
                                .then(function(cols){
                                    console.log(cols);
                                    // create isolates object for display
                                    $scope.Isolates = temp;
                                    for(var i=0; i<temp.length; i++){
                                        cols.forEach(function(colName){
                                            $scope.Isolates[i][''+colName.LabelText] = null;
                                        });
                                    }

                                    // fill in the values in isolates array
                                    $scope.Isolates.forEach(function(id){
                                        isolatesFound.forEach(function(vis){
                                            if(vis.IsolateId === id.IsolateId){
                                                id[''+vis.LabelText] = vis.Result;
                                                id['TestId'] = vis.TestId;
                                            }
                                        });
                                    });

                                    // console.log($scope.Isolates);
                                    IsolateService.isolates = $scope.Isolates;
                                    $location.path('/isolate-info');
                                })
                                .catch(function(err){
                                    console.log(err);
                                });
                        }
                    })
                    .catch(function(err){
                        console.log("Error getting sample by id");
                    });
            }
        };

        //NOTE - THIS CAN BE PART OF isolate-info controller
        IsolateService
            .getIsolateDropdownValues()
            .then(function(data){
                var temp = [];
                data.forEach(function(row){
                    var foundLabel = temp.find(function(iso){
                        return row.LabelText === iso.LabelText;
                    });
                    //if visit id not found, add it to the array
                    if(!foundLabel){
                        temp.push({LabelText: row.LabelText});
                        $scope.dropdowns[''+row.LabelText] = [];
                    }
                });

                temp.forEach(function(label){
                    data.forEach(function(row){
                        if(label.LabelText === row.LabelText){
                            $scope.dropdowns[''+row.LabelText].push(row.Value);
                        }
                    });
                });

                IsolateService.dropDownValues = $scope.dropdowns;
            })
            .catch(function(err){
                console.log(err);
            });

        $scope.goToIsolate = function(sample) {
            IsolateService.selectedIsolate = sample;
            $location.path('/isolate-info');
        };

        function showMsg(txt) {
            $mdToast.show(
                $mdToast.simple()
                    .textContent(txt)
                    .position('bottom right')
                    .hideDelay(3000)
            );
        }
});