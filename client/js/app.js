/**
 * Angular JS Nust O'Week Application Module
 * @author Celleb Tomanga <celleb@mrcelleb.com>
 * @description text
 * @contributors:
 */
var wdays = ["M", "T", "W", "T", "F", "S", "S"];
var date = new Date();
var month = date.getMonth();
var year = date.getFullYear();
ndate = new Date(year, month, 1, 0, 0, 0, 0);
var running_day = ndate.getDay();
var app = angular.module('oweek', ['ngMaterial', 'ngRoute']);
app.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
	$locationProvider.html5Mode(true);
	$routeProvider.when("/login", {
	    templateUrl: "partials/login.html",
	}).when("/", {
	    templateUrl: "partials/index.html",
	    controller: "Calendar"
	}).when("/user", {
	    templateUrl: "partials/user.html"
	}).when("/campus",{
		templateUrl:"partials/campus.html"
	}).when("/faq",{
		templateUrl:"partials/faq.html"
	}).when("/events",{
		templateUrl:"partials/events.html"
	}).when("/council",{
		templateUrl:"partials/council.html"
		}).when("/gallery",{
		templateUrl:"partials/gallery.html"
	}).otherwise({redirectTo: '/'});
    }
]
	);

/**
 * Handles all request to the API including authentication and Session Management.
 * This is an angular service and should be injected in the controllers that need the service
 * @author Celleb Tomanga <celleb@mrcelleb.com>
 * @param {object} $http Angular JS http service object
 * @param {object} $location Angular JS location service
 */

app.service('Api', ['$http', "$location", function ($http, $location) {
	/* user object, authenticates the user and holds the user information */
	var user = {
	    authenticated: false,
	    details: {},
	    authenticate: function (studentNumber, studentPin) {
		$http.post("auth/login", {studentNumber: studentNumber, studentPin: studentPin}).then(function (data) {
		    user.details = data;
		    authenticated = true;
		}, function (data) {

		});
	    }
	};

	/* for test purposes only */
	var userTest = {
	    authenticated: false,
	    details: {},
	    authenticate: function (studentNumber, studentPin) {
		if (studentNumber === "201019593", studentPin === "34341") {
		    userTest.details = {
			name: "Field",
			surname: "Marshal",
			student_number: "201019593",
			faculty: "Faculty of Engineering",
			programme: "Beng Mechanical Engineering",
			dept: "Department of Mechanical Engineering"
		    };
		    userTest.authenticated = true;
		    cookie.setCookie("oweekSessionId", 1, 1);
		    $location.path("/user");
		} else {
		    alert("Invalid Login");
		}
	    }
	};
	this.userTest = userTest;

	/* user session functionality, reloads user information */
	var session = {
	    session_id: '',
	    checkAuth: function () {
		if (cookie.checkCookie("oweekSessionId")) {
		    userTest.authenticated = true;

		    session.session_id = cookie.getCookie("oweekSessionId");
		    //check if session still exist on the server
		    if (!1) {
			// if session expired on server bring up login page
			$location.path("/login");
		    } else {
			// populate user information
			userTest.details = {
			    name: "Field",
			    surname: "Marshal",
			    student_number: "201019593",
			    faculty: "Faculty of Engineering",
			    programme: "Beng Mechanical Engineering",
			    dept: "Department of Mechanical Engineering"
			};
		    }
		} else {
		    userTest.authenticated = false;
		}
	    }
	};
	this.checkOut = function () {
	    userTest.details = {};
	    userTest.authenticated = false;
	    cookie.removeCookie('oweekSessionId');
	    // TODO: Add Server session kill functionality
	    setTimeout(function () {
		/* force browser redirect */
		window.location = "login";
	    }, 1000);
	};
	this.session = session;
    }]);
var settings = {
    displayLogin: true
};
/**
 * Calendar Logic
 * @author Celleb Tomanga
 * @param {type} param1
 * @param {type} param2
 */
app.controller('Calendar', function () {
    this.wdays = wdays;
    this.year = year;
    this.month_name = moment(ndate).format("MMMM");
    this.days = fillDays();
    this.today = moment().format("D");
    this.next = function () {
	monthAdd(1);
	this.year = year;
	ndate = new Date(year, month, 1, 0, 0, 0, 0);
	running_day = ndate.getDay();
	if (month + year == moment().format("MYYYY")) {
	    this.today = moment().format("D");
	} else {
	    this.today = 32;
	}
	//this.today = running_day;
	this.month_name = moment(ndate).format("MMMM");
	this.days = fillDays();

    };

    this.previous = function () {
	monthAdd(-1);
	this.year = year;
	ndate = new Date(year, month, 1, 0, 0, 0, 0);
	running_day = ndate.getDay();
	if (moment(ndate).format("MYYYY") === moment().format("MYYYY")) {
	    this.today = moment().format("D");
	} else {
	    this.today = 32;
	}
	this.month_name = moment(ndate).format("MMMM");
	this.days = fillDays();

    };
});


/*
 * function to generate calendar days of the month
 * @author Celleb Tomanga
 * @returns {Array|fillDays.days}
 */
function fillDays() {
    last_day = moment(ndate).endOf('month').date();
    var days = [];
    var i;
    /* fill in empty days before the first day of the month */
    for (i = 1; i < running_day; i++) {
	days.push(" ");

    }
    /* fills in numbered days from the beginning of the month */
    for (var j = 1; j <= last_day; j++) {
	days.push(j);
    }
    return days;
}

/**
 * navigating calendar by month
 * @author Celleb Tomanga
 * @param {int} add "-1 to move to next month, +1 to advance to next month
 * @returns {void}
 */
function monthAdd(add) {
    month += add;
    if (month >= 12) {
	month = 0;
	year += 1;
    } else if (month <= -1) {
	month = 11;
	year -= 1;
    }
}

/**
 * Angular JS Controller for the login partial
 * Deals with authenitication by communicating with the Api service and login form control
 * @author Celleb Tomanga
 * @contributors
 */
app.controller('loginController', ['$scope', 'Api', function ($scope, Api) {
	settings.displayLogin = false;
	$scope.user = {
	    number: '',
	    pin: ''
	};
	$scope.auth = function () {
	    Api.userTest.authenticate($scope.user.number, $scope.user.pin);
	};
    }]);
/**
 * Angular JS Controller for the homePage
 * Deals all features of the page outside other partials i.e header, footer
 * It also integrates with the Api Service
 * @author Celleb Tomanga
 * @contributors
 */
app.controller("homeController", ["$scope", 'Api', function ($scope, Api) {
	$scope.session = Api.session;
	$scope.session.checkAuth();
	$scope.api = Api.userTest;
	$scope.logout = function () {
	    Api.checkOut();
	};
    }]);

app.controller('AppCtrl', function ($scope, $timeout, $mdSidenav, $log) {
    $scope.toggleRight = buildToggler('right');
    $scope.isOpenRight = function () {
	return $mdSidenav('right').isOpen();
    };


    /**
     * Supplies a function that will continue to operate until the
     * time is up.
     */
    function debounce(func, wait, context) {
	var timer;
	return function debounced() {
	    var context = $scope,
		    args = Array.prototype.slice.call(arguments);
	    $timeout.cancel(timer);
	    timer = $timeout(function () {
		timer = undefined;
		func.apply(context, args);
	    }, wait || 10);
	};
    }
    /**
     * Build handler to open/close a SideNav; when animation finishes
     * report completion in console
     */
    function buildDelayedToggler(navID) {
	return debounce(function () {
	    $mdSidenav(navID)
		    .toggle()
		    .then(function () {
			//$log.debug("toggle " + navID + " is done");
		    });
	}, 200);
    }
    function buildToggler(navID) {
	return function () {
	    $mdSidenav(navID)
		    .toggle()
		    .then(function () {
			//$log.debug("toggle " + navID + " is done");
		    });
	};
    }
})

	.controller('RightCtrl', function ($scope, $timeout, $mdSidenav, $log) {
	    $scope.homeLinks = [{
		    name: "Events",
		    link: "events"
		}, {
		    name: "Campus",
		    link: "campus"
		}, {
		    name: "Faculties",
		    link: "faculties"
		}, {
		    name: "Gallery",
		    link: "gallery"
		}, {
		    name: "SRC's",
		    link: "council"
		}, {
		    name: "FAQs",
		    link: "faq"
		}];
	    $scope.close = function () {
		$mdSidenav('right').close()
			.then(function () {
			    $log.debug("close RIGHT is done");
			});
	    };
	});
app.controller('loginController', ['$scope', 'Api', function ($scope, Api) {
	settings.displayLogin = false;
	$scope.user = {
	    number: '',
	    pin: ''
	};
	$scope.auth = function () {
	    Api.userTest.authenticate($scope.user.number, $scope.user.pin);
	};
    }]).directive('scrollTo', function ($location, $anchorScroll) {
    return function (scope, element, attrs) {

	element.bind('click', function (event) {
	    event.stopPropagation();
	    var off = scope.$on('$locationChangeStart', function (ev) {
		off();
		ev.preventDefault();
	    });
	    var location = attrs.scrollTo;
	    $location.hash(location);
	    $anchorScroll();
	});

    };
});
