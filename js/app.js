angular.module('app', ['app.services', 'app.directives']).
  config(['$routeProvider', function($routeProvider) {
  $routeProvider.
      
      when('/',         {templateUrl: 'pages/index.html',   controller: HomeCtrl}).  
      when('/aspects',  {templateUrl: 'pages/aspects.html',   controller: QuestionCtrl}).
      when('/answers',  {templateUrl: 'pages/answers.html',   controller: AnswersCtrl}).

      otherwise({redirectTo: '/'});
}]);