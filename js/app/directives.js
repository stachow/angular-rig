angular.module('app.directives', [])

.directive('ccScroll', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            scope.$watch(attrs.ccScroll, function (value) {
                $(element).animate({ scrollTop: value }, 400);
            }, true);
        }
    }
})

.directive('ccHrefName', function ($route) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var routeName = attrs.ccHrefName.toLowerCase();
            var href = '';
            for (var path in $route.routes) {
                if ($route.routes.hasOwnProperty(path)) {
                    if ($route.routes[path].name && $route.routes[path].name.toLowerCase() === routeName) {
                        $(element).attr('href', "#" + path);
                    }
                }
            }
        }
    }
})

.directive('ccProgress', function (_) {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'templates/progress.html',
        link: function (scope, element, attrs) {
            scope.vals = [];
            scope.$watch(attrs.ccData, function (data) {
                _.each(_.range(5), function (i) {
                    var thisAnswerTypeCount = _.filter(data, function (question) { return question[2] === i }).length;
                    scope.vals[i] = (thisAnswerTypeCount * 2) + "%";
                });
            }, true);
        }
    }
})

.directive('ccQuestionButtons', function () {
    return {
        restrict: 'E',
        replace: true,
        scope: { question: "=ccQuestion", submit: "=ccSubmitAnswerFn", answers: "=ccAnswers" },
        templateUrl: 'templates/questionButtons.html',
        link: function (scope, element, attrs) {

            var colors = ['danger', 'warning', 'info', 'primary', 'success'];

            scope.buttons = [];
            _.each(colors, function(color, index) { 
                scope.buttons.push({
                    text: scope.answers[index].Text, 
                    class: color,
                    id: scope.answers[index].Id,
                    index: index
                    }) 
                })

            scope.localClick = function (id, index) {
                !scope.question.disabled && scope.submit(scope.question.index, id, index);
            };
        }
    }
})

.directive('ccPie', function (d3) {
    return {
        restrict: 'E',
        replace: true,
        template: '<div></div>',
        link: function (scope, element, attrs) {
            var pieRef = d3.pie();
            pieRef.init(150, 150, element, [0, 0, 0, 0, 0, 0]);
            scope.$watch(attrs.ccData, function (data) {
                var vals = [];
                _.each(_.range(6), function (i) {
                    var thisCount = _.filter(data, function (question) { return question[2] === i - 1 }).length
                    vals.push(thisCount);
                });
                pieRef.update(vals);
            }, true);

        }
    }
})

.directive('ccShuffleItem', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            scope.$watch(attrs.ccShuffleItem, function (value) {
                if (value.pos == 0) {
                    return;
                } else if (value.pos == -1) {
                    $el.animate({ opacity: 0 }, 600);
                } else {
                    var $el = $(element[0]);
                    $el.css("z-index", -1 * value.pos);
                    $el.css("opacity", 0.6);
                    $el.animate({ top: (value.pos - 1) * 35 }, 600, function () {
                        $el.css("opacity", 1);

                    });
                }

                $el.find('span').removeClass("icon-arrow-left");
                $el.find('span').removeClass("icon-arrow-up");
                $el.find('span').removeClass("icon-arrow-down");
                if (value.pos === value.oldPos) {
                    $el.find('span').addClass("icon-arrow-left");
                } else if (value.pos >= value.oldPos) {
                    $el.find('span').addClass("icon-arrow-down");
                } else {
                    $el.find('span').addClass("icon-arrow-up");
                };
            }, true);

        }
    }
})