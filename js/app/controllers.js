function HomeCtrl() { 

}

function QuestionCtrl($scope, messageService, dataService, _) {

    $scope.settings = {
        scrollEvery:    3,
        scrollLength:   450
    };

    $scope.doScroll = function (id) {
        if (!((id + 1) % $scope.settings.scrollEvery)) {
            $scope.scrollTop += $scope.settings.scrollLength;
            $scope.shuffle();
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

    $scope.careerData = [
        { name:'Lorem ipsum dolor',   pos: 1, oldPos: 1}, 
        { name:'sit amet consectetur',   pos: 2, oldPos: 2}, 
        { name:'adipiscing elit', pos: 3, oldPos: 3}, 
        { name:'nec vulputate',  pos: 4, oldPos: 4}, 
        { name:'justo Vestibulum ',  pos: 5, oldPos: 5}, 
        { name:'ipsum primis in ',   pos: 6, oldPos: 6}
    ];

    $scope.shuffle = function () {

        var count = $scope.careerData.length;

        _.each($scope.careerData, function (item) {
            item.oldPos = item.pos;
            item.pos = 0;
        });

        var keepSamePos = Math.floor((Math.random() * count) + 1);
        _.each($scope.careerData, function (item) {

            if (item.oldPos == keepSamePos) {
                item.pos = keepSamePos;
                return;
            }

            var candidatePos;
            do {
                candidatePos = Math.floor((Math.random() * count) + 1);
            }
            while (_.some($scope.careerData, function (item) { return (candidatePos === keepSamePos) || (item.pos === candidatePos) }));

            item.pos = candidatePos;
        });
    }
}

function AnswersCtrl($scope, messageService, _) {
    
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

function CareersCtrl($scope, bigDataService) {

    $scope.data = [];

    $scope.getData = function () {
        bigDataService(function (data) {
            console.log(data);
            $scope.data = data;
            
        })
    }
}

function DynamicCtrl($scope) { 
    $scope.data = [
        { name:'Lorem ipsum dolor',   pos: 1, oldPos: 1}, 
        { name:'sit amet consectetur',   pos: 2, oldPos: 2}, 
        { name:'adipiscing elit Curabitur', pos: 3, oldPos: 3}, 
        { name:'nec vulputate',  pos: 4, oldPos: 4}, 
        { name:'justo Vestibulum ',  pos: 5, oldPos: 5}, 
        { name:'ipsum primis in ',   pos: 6, oldPos: 6}
    ];

    $scope.shuffle = function () {

        var count = $scope.data.length;

        _.each($scope.data, function (item) {
            item.oldPos = item.pos;
            item.pos = 0;
        });

        var keepSamePos = Math.floor((Math.random() * count) + 1);
        _.each($scope.data, function (item) {

            if (item.oldPos == keepSamePos) {
                item.pos = keepSamePos;
                return;
            }

            var candidatePos;
            do {
                candidatePos = Math.floor((Math.random() * count) + 1);
            }
            while (_.some($scope.data, function (item) { return (candidatePos === keepSamePos) || (item.pos === candidatePos) }));

            item.pos = candidatePos;
        });
    }

}