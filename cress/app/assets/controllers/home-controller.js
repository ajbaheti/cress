'use strict';

angular.module('CressApp')
	.controller('HomeCtrl', function ($scope, $location, $mdMenu, $mdDialog, AuthService, StudyService, PatientService) {
		$scope.selectedStudy = null;

		StudyService
			.getStudies()
			.then(function(studies){
				$scope.studies = studies;
			})
			.catch(function(){
				console.log("Error getting list of studies");
			});

        $scope.onStudyChange = function() {
            StudyService.selectedStudy = $scope.selectedStudy;

            StudyService
				.getPatientsForStudy(StudyService.selectedStudy.study_id)
				.then(function(patients){
					PatientService.patientList = patients;
					$location.path('/patients');
				})
				.catch(function(err){
					console.log(err);
				})
		}

});