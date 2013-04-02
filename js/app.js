angular.module('app', ['app.services', 'app.directives']).
  config(['$routeProvider', function($routeProvider) {
  $routeProvider.
      
      when('/',         {name: 'home',      templateUrl: 'pages/index.html',     controller: HomeCtrl}).  
      when('/aspects',  {name: 'aspects',   templateUrl: 'pages/aspects.html',   controller: QuestionCtrl}).
      when('/answers',  {name: 'answers',   templateUrl: 'pages/answers.html',   controller: AnswersCtrl}).

      otherwise({redirectTo: '/'});
}]);