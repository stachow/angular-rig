function QuestionCtrl($scope, messageService, dataService) {

    $scope.settings = {
        scrollEvery:    3,
        scrollLength:   450
    };

    $scope.doScroll = function (id) {
        if (!((id+1) % $scope.settings.scrollEvery)) {
            $scope.scrollTop += $scope.settings.scrollLength;
        };
    };

    $scope.handleDisabled = function (idBeingSubmitted) {
        $scope.data[idBeingSubmitted].disabled = true;
        if (idBeingSubmitted < $scope.data.length - 1) { 
            $scope.data[idBeingSubmitted + 1].disabled = false;
        }
    };

    $scope.submitAnswer = function (id, answer) {
        $scope.data[id].answer = answer;
        $scope.handleDisabled(id);
        $scope.doScroll(id);
        messageService.send($scope.data.dataToSubmit());
    };

    $scope.recieveMessage = function (msg) {
        //console.log(msg);
    };

    // init
    $scope.scrollTop = 0;
    $scope.data = dataService;
    $scope.data[0].disabled = false;
    messageService.listen($scope.recieveMessage);
}

angular.module('app', [])

.factory('dataService', dataService)

.factory('messageService', messageService)

.directive('ccScroll', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            scope.$watch(attrs.ccScroll, function (newval, oldval) {
                $(element).animate({ scrollTop: newval }, 600);
            }, true);
        }
    }
})

.directive('ccProgress', function () {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'templates/progress.html',
        link: function (scope, element, attrs) {
            scope.$watch(attrs.ccProgressData, function (newval, oldval) {
                _.each(_.range(5), function (i) {
                    var thisAnswerTypeCount = _.filter(newval, function (question) { return question.answer === (i + 1) }).length;
                    scope["s" + (i + 1)] = (thisAnswerTypeCount * 2) + "%";
                });
            }, true);
        }
    }
})

.directive('ccQuestionButtons', function () {
    return {
        restrict: 'E',
        replace: true,
        scope: { question: "=ccQuestion", submit: "=ccSubmitAnswerFn" },
        templateUrl: 'templates/questionButtons.html',
        link: function (scope, element, attrs) {
            var $btns = $(element).find('a');

            scope.options = [
                {text: 'Dislike very much', class: 'danger'}, 
                {text: 'Dislike', class: 'warning'}, 
                {text: 'Does not matter', class: 'info'}, 
                {text: 'Like', class: 'primary'}, 
                {text: 'Like very much', class: 'success'}
            ];

            $btns.on('click', function () {
                if (scope.question.disabled) {
                    return;
                };
                var thisAnswer = $(this).data("answer");
                scope.$apply(function () { scope.submit(scope.question.id, thisAnswer) });
                $btns.off('click');
            });
        }
    }
});