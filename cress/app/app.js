var cressApp = angular.module('CressApp', ['ngMaterial', 'ngMessages', 'ngRoute', 'angularMoment', 'md.data.table']);

cressApp.config(function($routeProvider) {

	var CURRENT_PATH_RESOLVER = ['$route', 'AuthService', 'PatientService', 'IsolateService', 'TestsService',
            function($route, AuthService, PatientService, IsolateService, TestsService) {

        return AuthService.getSession()
            .then(function(sessionObj){
                if(sessionObj.sessionExists){
                    AuthService.user.username = sessionObj.user;
                    AuthService.user.isAdmin = sessionObj.admin === "1";
                    switch($route.current.$$route.originalPath){
                        /*case '/':
                            return '/';*/
                        case '/patients':
                            return '/patients';
                        case '/patient-info':
                            if(PatientService.selectedPatientId){
                                return '/patient-info';
                            }
                            return '/patients';
                        case '/isolates':
                            return '/isolates';
                        case '/isolate-info':
                            if(IsolateService.sampleId){
                                return '/isolate-info';
                            }
                            return '/isolates';
                        case '/tests':
                            return '/tests';
                        case '/test-info':
                            if(TestsService.tests){
                                return '/test-info';
                            }
                            return '/tests';
                        /*case '/reports':
                            return '/reports';*/
                        case '/query':
                            return '/query';
                        case '/admin':
                            return '/admin';
                        default:
                            return '/patients';
                    }
                }
                else {
                    return '/login';
                }
            })
            .catch(function(){
                console.log("error getting session object");
            });
    }];

    $routeProvider
	    /*.when('/', {
	        templateUrl : 'app/partials/home.html',
	        controller: 'HomeCtrl',
			resolve: {
	        	RedirectPath: CURRENT_PATH_RESOLVER
			}
	    })*/

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

        /*.when('/reports', {
            templateUrl : 'app/partials/reports.html',
            controller: 'ReportsCtrl',
            resolve: {
                RedirectPath: CURRENT_PATH_RESOLVER
            }
        })*/

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