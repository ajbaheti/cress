var cressApp = angular.module('CressApp', ['ngMaterial', 'ngMessages', 'ngRoute', 'angularMoment', 'md.data.table']);

cressApp.config(function($routeProvider) {

	var CURRENT_PATH_RESOLVER = ['$route', 'AuthService', 'PatientService', 'IsolateService', 'TestsService',
            function($route, AuthService, PatientService, IsolateService, TestsService) {
		if(AuthService.isLoggedIn()){
            switch($route.current.$$route.originalPath){
                case '/':
                    // PatientService.patientList = null;
                    return '/';
                case '/patients':
                    if(PatientService.patientList){
                        // PatientService.currentPatientLabels = null;
                        // PatientService.patientDropDownObjects = null;
                        return '/patients';
                    }
                    return '/';
                case '/patient-info':
                    if(PatientService.selectedPatientId){
                        return '/patient-info';
                    }
                    return '/patients';
                case '/isolates':
                    return '/isolates';
                case '/isolate-info':
                    if(IsolateService.selectedIsolate){
                        return '/isolate-info';
                    }
                    return '/isolates';
                case '/tests':
                    return '/tests';
                case '/test-info':
                    if(TestsService.selectedTestInfo){
                        return '/test-info';
                    }
                    return '/tests';
                case '/reports':
                    return '/reports';
                case '/query':
                    return '/query';
                case '/admin':
                    return '/admin';
                default:
                    // PatientService.patientList = null;
                    return '/';
            }
        }
        else {
            return '/login';
        }
    }];

    $routeProvider
	    .when('/', {
	        templateUrl : 'app/partials/home.html',
	        controller: 'HomeCtrl',
			resolve: {
	        	RedirectPath: CURRENT_PATH_RESOLVER
			}
	    })

	    .when('/login', {
	        templateUrl : 'app/partials/login.html',
	        controller: 'LoginCtrl'
	    })

	    .when('/patients', {
	    	templateUrl : 'app/partials/patients.html',
	        controller: 'PatientsCtrl',
            resolve: {
                RedirectPath: CURRENT_PATH_RESOLVER
            }
	    })

        .when('/patient-info', {
            templateUrl: 'app/partials/patient-info.html',
            controller: 'PatientInfoCtrl',
            resolve: {
                RedirectPath: CURRENT_PATH_RESOLVER
            }
        })

	    .when('/isolates', {
	    	templateUrl : 'app/partials/isolates.html',
	        controller: 'IsolatesCtrl',
            resolve: {
                RedirectPath: CURRENT_PATH_RESOLVER
            }
	    })

        .when('/isolate-info', {
            templateUrl : 'app/partials/isolate-info.html',
            controller: 'IsolateInfoCtrl',
            resolve: {
                RedirectPath: CURRENT_PATH_RESOLVER
            }
        })

        .when('/reports', {
            templateUrl : 'app/partials/reports.html',
            controller: 'ReportsCtrl',
            resolve: {
                RedirectPath: CURRENT_PATH_RESOLVER
            }
        })

        .when('/tests', {
            templateUrl : 'app/partials/tests.html',
            controller: 'TestsCtrl',
            resolve: {
                RedirectPath: CURRENT_PATH_RESOLVER
            }
        })

        .when('/test-info', {
            templateUrl : 'app/partials/test-info.html',
            controller: 'TestInfoCtrl',
            resolve: {
                RedirectPath: CURRENT_PATH_RESOLVER
            }
        })

        .when('/query', {
            templateUrl : 'app/partials/query.html',
            controller: 'QueryCtrl',
            resolve: {
                RedirectPath: CURRENT_PATH_RESOLVER
            }
        })

        .when('/admin', {
            templateUrl : 'app/partials/admin.html',
            controller: 'AdminCtrl',
            resolve: {
                RedirectPath: CURRENT_PATH_RESOLVER
            }
        })

		.otherwise('/login');
});