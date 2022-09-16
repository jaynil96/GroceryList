var app = angular.module('main', ['ngRoute']);

app.config(function($routeProvider, $locationProvider) {
	$routeProvider.when('/', {
		templateUrl: './components/home.html',
		controller: 'homeCtrl'
	}).when('/logout', {
		resolve: {
			deadResolve: function($location, user) {
				user.clearData();
				$location.path('/');
			}
		}
	}).when('/login', {
		templateUrl: './components/login.html',
		controller: 'loginCtrl'
	}).when('/register', {
		templateUrl: './components/register.html',
		controller: 'registerCtrl'
	}).when('/dashboard', {
		resolve: {
			check: function($location, user) {
				if(!user.isUserLoggedIn()) {
					$location.path('/login');
				}
			},
		},
		templateUrl: './components/dashboard.html',
		controller: 'dashboardCtrl'
	}).when('/resetpass', {
		resolve: {
			check: function($location, user) {
				if(!user.isUserLoggedIn()) {
					$location.path('/login');
				}
			},
		},
		templateUrl: './components/resetpass.html',
		controller: 'resetpassCtrl'
	})
	.otherwise({
		template: '404'
	});

	$locationProvider.html5Mode(true);
});

app.service('user', function() {
	var username;
	var loggedin = false;
	var id;

	this.getName = function() {
		return username;
	};

	this.setID = function(userID) {
		id = userID;
	};
	this.getID = function() {
		return id;
	};

	this.isUserLoggedIn = function() {
		if(!!localStorage.getItem('login')) {
			loggedin = true;
			var data = JSON.parse(localStorage.getItem('login'));
			username = data.username;
			id = data.id;
		}
		return loggedin;
	};

	this.saveData = function(data) {
		username = data.user;
		id = data.id;
		loggedin = true;
		localStorage.setItem('login', JSON.stringify({
			username: username,
			id: id
		}));
	};

	this.clearData = function() {
		localStorage.removeItem('login');
		username = "";
		id = "";
		loggedin = false;
	}
})

app.controller('homeCtrl', function($scope, $location) {
	$scope.goToLogin = function() {
		$location.path('/login');
	};
	$scope.register = function() {
		$location.path('/register');
	}
});

app.controller('loginCtrl', function($scope, $http, $location, user) {
	$scope.login = function() {
		var username = $scope.username;
		var password = $scope.password;
		$http({
			url: 'http://localhost/angularjs-mysql/server.php',
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			data: 'username='+username+'&password='+password
		}).then(function(response) {
			if(response.data.status == 'loggedin') {
				console.log(response);
				user.saveData(response.data);
				$location.path('/dashboard');
			} else {
				alert('invalid login');
			}
		})
	}
});

app.controller('dashboardCtrl', function($scope, user, $http, $location) {
	$scope.user = user.getName();
	$scope.newPass = function() {
	//	$location.path('/resetpass')
		var password = $scope.newpassword;
		$http({
			url: 'http://localhost/angularjs-mysql/updatePass.php',
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			data: 'newPass='+password+'&currentuser='+user.getName()
		}).then(function(response) {
			if(response.data.status == 'done') {
				alert('Password updated');
			} else {
				console.log(response);
				alert('CSRF maybe?');
			}
		}).catch(function(err) {
			console.log(err);
		})
	};

	$scope.logout = function() {
		$location.path('/logout')
	}
});

app.controller('registerCtrl', function($scope, user, $http, $location) {
	$scope.regiser = function() {
		var username = $scope.newusername;
		var password = $scope.newpassword;
		$http({
			url: 'http://localhost/angularjs-mysql/registerUser.php',
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			data: 'username='+username+'&password='+password
		}).then(function(response) {
			if(response.data.status == 'registered') {
				$location.path('/');
			} else {
				alert('Error Occured while adding User');
			}
		})
	}
});

app.controller('resetpassCtrl', function($scope, user, $http, $location) {
	$scope.resetPass = function() {
		var password = $scope.newpassword;
		$http({
			url: 'http://localhost/angularjs-mysql/updatePass.php',
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			data: 'newPass='+password+'&id='+user.getID()
		}).then(function(response) {
			if(response.data.status == 'done') {
				alert('Password updated');
			} else {
				alert('CSRF maybe?');
			}
		})
	}
})

app.controller('groceryCtrl', function($scope, user, $http) {
	$scope.groceries = [];
	$http({
		url: 'http://localhost/angularjs-mysql/getItems.php',
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		data: 'username='+user.getName()
	}).then(function(response) {
		if(response.data.status == 'done') {
			 $scope.groceries = response.data
		} else {
			alert('Could not find any entries for user');
			console.log(response)
		}
	}).catch(function(err) {
		console.log(err);
	})

})
