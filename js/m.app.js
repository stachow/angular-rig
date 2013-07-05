angular.module('app', ['app.services', 'app.directives', 'ui.bootstrap', 'ajoslin.mobile-navigate']).
  config(function ($routeProvider, $locationProvider) {
      $routeProvider.

          when('/', { name: 'home', templateUrl: 'pages/m.index.html', controller: HomeCtrl }).
          when('/aspects', { name: 'aspects', templateUrl: 'pages/m.aspects.html', controller: QuestionCtrl }).
          when('/answers', { name: 'answers', templateUrl: 'pages/answers.html', controller: AnswersCtrl }).
          when('/login', { name: 'login', templateUrl: 'pages/login.html', controller: LoginCtrl }).
          otherwise({ redirectTo: '/' });

      $locationProvider.html5Mode(false);

  });