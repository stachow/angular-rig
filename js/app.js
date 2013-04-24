angular.module('app', ['app.services', 'app.directives', 'app.animations']).
  config(function ($routeProvider, $locationProvider) {
      $routeProvider.

          when('/', { name: 'home', templateUrl: 'pages/index.html', controller: HomeCtrl }).
          when('/aspects', { name: 'aspects', templateUrl: 'pages/aspects.html', controller: QuestionCtrl }).
          when('/answers', { name: 'answers', templateUrl: 'pages/answers.html', controller: AnswersCtrl }).
          when('/career-list', { name: 'career-list', templateUrl: 'pages/career-list.html', controller: CareersCtrl }).
          when('/dynamic-list', { name: 'dynamic-list', templateUrl: 'pages/dynamic-list.html', controller: DynamicCtrl }).
          otherwise({ redirectTo: '/' });

      $locationProvider.html5Mode(false);

  });