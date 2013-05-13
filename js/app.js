angular.module('app', ['app.services', 'app.directives']).
  config(function ($routeProvider, $locationProvider) {
      $routeProvider.

          when('/', { name: 'home', templateUrl: 'pages/index.html', controller: HomeCtrl }).
          when('/aspects', { name: 'aspects', templateUrl: 'pages/aspects.html', controller: QuestionCtrl }).
          when('/answers', { name: 'answers', templateUrl: 'pages/answers.html', controller: AnswersCtrl }).
          when('/login', { name: 'login', templateUrl: 'pages/login.html', controller: LoginCtrl }).
          otherwise({ redirectTo: '/' });

      $locationProvider.html5Mode(false);

  });