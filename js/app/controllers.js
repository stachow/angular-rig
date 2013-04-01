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
