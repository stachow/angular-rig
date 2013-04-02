function HomeCtrl() { 

}

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

    $scope.reset = function () {
        $scope.data = dataService;
        _.each($scope.data, function (question) { 
            question.disabled = true; 
            question.answer = -1; 
        });
        $scope.data[0].disabled = false;
        $scope.scrollTop = 0;
        messageService.send($scope.data.dataToSubmit());
    }

    $scope.reset();

}

function AnswersCtrl($scope, messageService) {
    
    $scope.buttonClasses = ['btn-danger', 'btn-warning', 'btn-info', 'btn-primary', 'btn-success'];
    $scope.data = [];
    $scope.answeredData = [];

    $scope.receiveData = function (msg) {
        if (msg) {
            $scope.$apply(function () {
                $scope.data = msg;
                $scope.answeredData = _.filter($scope.data, function (item) { return item[1] >= 0 });
            })
        };
    };
        
    messageService.listen($scope.receiveData);
    messageService.retrieveLatest($scope.receiveData)
}
