var cressApp = angular.module('CressApp', ['ngMaterial', 'ngMessages', 'ngRoute']);

cressApp.config(function($routeProvider) {

	var CURRENT_USER_RESOLVER = ['AuthService', function(AuthService) {
		if(AuthService.isLoggedIn()){
            return true;
        }
        throw 'no-user-exception';
    }];

    $routeProvider
	    .when('/', {
	        templateUrl : 'app/partials/home.html',
	        controller: 'HomeCtrl',
			resolve: {
	        	User: CURRENT_USER_RESOLVER
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
                User: CURRENT_USER_RESOLVER
            }
	    })

	    .when('/isolates', {
	    	templateUrl : 'app/partials/isolates.html',
	        controller: 'IsolatesCtrl',
            resolve: {
                User: CURRENT_USER_RESOLVER
            }
	    })

        .when('/reports', {
            templateUrl : 'app/partials/reports.html',
            controller: 'ReportsCtrl',
            resolve: {
                User: CURRENT_USER_RESOLVER
            }
        })

        .when('/tests', {
            templateUrl : 'app/partials/tests.html',
            controller: 'TestsCtrl',
            resolve: {
                User: CURRENT_USER_RESOLVER
            }
        })

        .when('/admin', {
            templateUrl : 'app/partials/admin.html',
            controller: 'AdminCtrl',
            resolve: {
                User: CURRENT_USER_RESOLVER
            }
        })

		.otherwise('/login');
});