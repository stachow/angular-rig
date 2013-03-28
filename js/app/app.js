function QuestionCtrl($scope) {
    $scope.settings = {
        scrollEvery:    3,
        scrollLength:   450
    };
    $scope.scrollTop = 0;
    $scope.data = data;
    $scope.data[0].disabled = false;

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
    };

}

angular.module('app', [])
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
                    scope["s" + (i + 1)] =  (thisAnswerTypeCount * 2) + "%";
                });
            }, true);
        }
    }
})
.directive('ccQuestionButtons', function () {
    return {
        restrict: 'E',
        replace: true,
        scope: { id: "=ccQuestionId", submit: "=ccSubmitAnswerFn", disabled: "=ccDisabled" },
        templateUrl: 'templates/questionButtons.html',
        link: function (scope, element, attrs) {
            var $btns = $(element).find('a');

            $btns.on('click', function () {
                if (scope.disabled) {
                    return;
                };
                var thisAnswer = $(this).data("answer");
                scope.$apply(function () { scope.submit(scope.id, thisAnswer) });
                $btns.off('click');
                $btns.not('[data-answer="' + thisAnswer + '"]').removeClass('btn-danger btn-warning btn-info btn-primary btn-success');
            });
        }
    }
});