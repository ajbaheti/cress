'use strict';

angular.module('CressApp')
    .controller('AdminCtrl', function ($scope, $location, $mdMenu, $mdToast, $mdDialog,
            AuthService, PatientService, IsolateService, TestsService, VisitService, RedirectPath) {

        if(RedirectPath !== '/admin'){
            $location.path(RedirectPath);
        }

        $scope.selectedTab = 0;
        $scope.subjectNewRow = {};
        $scope.isolateNewRow = {};
        $scope.testNewRow = {};
        $scope.visitNewRow = {};
        $scope.userNewRow = {user_name: null, is_admin: null, password: 'fr1end'};

        $scope.onSubjectTabSelection = function() {
            PatientService
                .getPatientDropdownValues()
                .then(function(result){
                    if(result){
                        var dropDownObjects = {};
                        var patientLabelIds = result.map(function(obj){
                            return {lbl_text: obj.LabelText};
                        });
                        var uniqueLabels = removeDuplicates(patientLabelIds, "lbl_text");

                        //for each label (drop down), create separate array with values
                        uniqueLabels.forEach(function(lbl){
                            dropDownObjects[''+lbl.lbl_text] = result.filter(function(obj){
                                return obj.LabelText === lbl.lbl_text;
                            });
                        });
                        PatientService.patientDropDownObjects = dropDownObjects;
                        $scope.subjectKeys = Object.entries(PatientService.patientDropDownObjects);
                    }
                })
                .catch(function(err){
                    console.log("Error fetching drop down values");
                });
        };

        $scope.deletePatientGeneralValue = function(deleteValue) {
            PatientService
                .deletePatientDropdownValue(deleteValue.ItemId, deleteValue.ValueId)
                .then(function(result){
                    if(result === 'Row deleted successfully'){
                        showMsg("Value Deleted Successfully");
                        $scope.onSubjectTabSelection();
                    }
                    else {
                        // console.log("Error deleting row");
                        showMsg("Error deleting value");
                    }
                })
                .catch(function(err){
                    console.log("Error deleting row");
                    showMsg("Something went wrong, please try again later");
                });
        };

        $scope.addPatientRow = function(itemId, label) {
            $scope.subjectNewRow[''+label].ItemId = itemId;
            PatientService
                .addPatientDropdownValue($scope.subjectNewRow[''+label])
                .then(function(result){
                    if(result === 'Row added successfully'){
                        $scope.subjectNewRow = {};
                        showMsg("New Value Added Successfully");
                        $scope.onSubjectTabSelection();
                    }
                    else {
                        // console.log("Error adding new row");
                        showMsg("Error adding new row");
                    }
                })
                .catch(function(err){
                    console.log("Error adding new row");
                    showMsg("Something went wrong, please try again later");
                });
        };

        $scope.onUserTabSelection = function() {
            AuthService
                .getListOfUsers()
                .then(function(data){
                    if(data !== 'No users found'){
                        $scope.users = data;
                    }
                    else {
                        showMsg("No users found");
                    }
                })
                .catch(function(){
                    console.log("Error getting users");
                    showMsg("Something went wrong, please try again later");
                });
        };

        $scope.deleteUser = function(user, index) {
            console.log(user);
            console.log(index);
        };

        $scope.addNewUser = function() {
            // console.log($scope.userNewRow);
            AuthService
                .addNewUser($scope.userNewRow)
                .then(function(result){
                    if(result === 'Row added successfully'){
                        $scope.users.push($scope.userNewRow);
                        $scope.userNewRow = {user_name: null, is_admin: null, password: 'fr1end'};
                        showMsg("New User Added Successfully");
                        $scope.onUserTabSelection();
                    }
                })
                .catch(function(err){
                    console.log("Error adding new user");
                    showMsg("Something went wrong, please try again later");
                });
        };

        $scope.onIsolateTabSelection = function() {
            IsolateService
                .getIsolateDropdownValues()
                .then(function(data){
                    if(data !== 'No data found'){
                        var testLabelIds = data.map(function(obj){
                            return {lbl_text: obj.LabelText};
                        });
                        var uniqueLabels = removeDuplicates(testLabelIds, "lbl_text");

                        var isolateDropDownObjects = {};
                        //for each label (drop down), create separate array with values
                        uniqueLabels.forEach(function(lbl){
                            isolateDropDownObjects[''+lbl.lbl_text] = data.filter(function(obj){
                                return obj.LabelText === lbl.lbl_text;
                            });
                        });
                        IsolateService.isolateDropDownObjects = isolateDropDownObjects;
                        $scope.isolateKeys = Object.entries(IsolateService.isolateDropDownObjects);
                    }
                })
                .catch(function(err){
                    console.log("Error fetching drop down values");
                });
        };

        $scope.deleteIsolateValue = function(deleteValue) {
            IsolateService
                .deleteIsolateDropdownValue(deleteValue.ItemId, deleteValue.ValueId)
                .then(function(result){
                    if(result === 'Row deleted successfully'){
                        showMsg("Value Deleted Successfully");
                        $scope.onIsolateTabSelection();
                    }
                    else {
                        // console.log("Error deleting row");
                        showMsg("Error deleting value");
                    }
                })
                .catch(function(err){
                    console.log("Error deleting row");
                    showMsg("Something went wrong, please try again later");
                });
        };

        $scope.addIsolateRow = function(itemId, label) {
            $scope.isolateNewRow[''+label].ItemId = itemId;
            IsolateService
                .addIsolateDropdownValue($scope.isolateNewRow[''+label])
                .then(function(result){
                    if(result === 'Row added successfully'){
                        $scope.isolateNewRow = {};
                        showMsg("New Value Added Successfully");
                        $scope.onIsolateTabSelection();
                    }
                    else {
                        // console.log("Error adding new row");
                        showMsg("Error adding new row");
                    }
                })
                .catch(function(err){
                    console.log("Error adding new row");
                    showMsg("Something went wrong, please try again later");
                });
        };

        $scope.onTestTabSelection = function() {
            TestsService
                .getTestDropdownValues()
                .then(function(data){
                    if(data !== 'No data found'){
                        var testLabelIds = data.map(function(obj){
                            return {lbl_text: obj.LabelText};
                        });
                        var uniqueLabels = removeDuplicates(testLabelIds, "lbl_text");

                        var testDropDownObjects = {};
                        //for each label (drop down), create separate array with values
                        uniqueLabels.forEach(function(lbl){
                            testDropDownObjects[''+lbl.lbl_text] = data.filter(function(obj){
                                return obj.LabelText === lbl.lbl_text;
                            });
                        });
                        TestsService.testDropDownObjects = testDropDownObjects;
                        $scope.testKeys = Object.entries(TestsService.testDropDownObjects);
                    }
                })
                .catch(function(err){

                });
        };

        $scope.deleteTestValue = function(deleteValue) {
            TestsService
                .deleteTestDropdownValue(deleteValue.ItemId, deleteValue.ValueId)
                .then(function(result){
                    if(result === 'Row deleted successfully'){
                        showMsg("Value Deleted Successfully");
                        $scope.onTestTabSelection();
                    }
                    else {
                        // console.log("Error deleting row");
                        showMsg("Error deleting value");
                    }
                })
                .catch(function(err){
                    console.log("Error deleting row");
                    showMsg("Something went wrong, please try again later");
                });
        };

        $scope.addTestRow = function(itemId, label) {
            $scope.testNewRow[''+label].ItemId = itemId;
            TestsService
                .addTestDropdownValue($scope.testNewRow[''+label])
                .then(function(result){
                    if(result === 'Row added successfully'){
                        $scope.testNewRow = {};
                        showMsg("New Value Added Successfully");
                        $scope.onTestTabSelection();
                    }
                    else {
                        // console.log("Error adding new row");
                        showMsg("Error adding new row");
                    }
                })
                .catch(function(err){
                    console.log("Error adding new row");
                    showMsg("Something went wrong, please try again later");
                });
        };

        $scope.onVisitTabSelection = function() {
            VisitService
                .getVisitDropdownValues()
                .then(function(data){
                    if(data !== 'No data found'){
                        var visitLabelIds = data.map(function(obj){
                            return {lbl_text: obj.LabelText};
                        });
                        var uniqueLabels = removeDuplicates(visitLabelIds, "lbl_text");

                        var visitDropDownObjects = {};
                        //for each label (drop down), create separate array with values
                        uniqueLabels.forEach(function(lbl){
                            visitDropDownObjects[''+lbl.lbl_text] = data.filter(function(obj){
                                return obj.LabelText === lbl.lbl_text;
                            });
                        });
                        VisitService.visitDropDownObjects = visitDropDownObjects;
                        $scope.visitKeys = Object.entries(VisitService.visitDropDownObjects);
                    }
                })
                .catch(function(err){
                    console.log("Error fetching drop down values");
                });
        };

        $scope.deleteVisitValue = function(deleteValue) {
            VisitService
                .deleteVisitDropdownValue(deleteValue.ItemId, deleteValue.ValueId)
                .then(function(result){
                    if(result === 'Row deleted successfully'){
                        showMsg("Value Deleted Successfully");
                        $scope.onVisitTabSelection();
                    }
                    else {
                        // console.log("Error deleting row");
                        showMsg("Error deleting value");
                    }
                })
                .catch(function(err){
                    console.log("Error deleting row");
                    showMsg("Something went wrong, please try again later");
                });
        };

        $scope.addVisitRow = function(itemId, label) {
            $scope.visitNewRow[''+label].ItemId = itemId;
            VisitService
                .addVisitDropdownValue($scope.visitNewRow[''+label])
                .then(function(result){
                    if(result === 'Row added successfully'){
                        $scope.visitNewRow = {};
                        showMsg("New Value Added Successfully");
                        $scope.onVisitTabSelection();
                    }
                    else {
                        // console.log("Error adding new row");
                        showMsg("Error adding new row");
                    }
                })
                .catch(function(err){
                    console.log("Error adding new row");
                    showMsg("Something went wrong, please try again later");
                });
        };

        //TODO: when saving label order(patient), validate if order is sequence or not before saving for correctness
        function removeDuplicates(myArr, prop) {
            return myArr.filter(function(obj, pos, arr){
                return arr.map(function(mapObj){
                    return mapObj[prop];
                }).indexOf(obj[prop]) === pos;
            });
        }

        function showMsg(txt) {
            $mdToast.show(
                $mdToast.simple()
                    .textContent(txt)
                    .position('bottom right' )
                    .hideDelay(3000)
            );
        }

    });