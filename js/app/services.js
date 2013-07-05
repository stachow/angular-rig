angular.module('app.services', [])

.factory('_', function () {
    return window._;
})

.factory('api', function ($http) {

    return {
        doLogin: function (username, password, callback) {
            callback();
            //$http.post("/WebServices/UserService.svc/ajax/Login", { "username": username, "password": password }).success(callback);
        },
        getContact: function (callback) {
            callback({
                d: {
                    Firstname: "stef",
                    Lastname: "stachow"
                }
            });
            //$http.post("/WebServices/UserService.svc/ajax/GetUserDetails").success(callback);
        },
        getQuestions: function (callback) {
            $http.get("http://dev.cascaid.co.uk/API/api/QuestionSet/1?subSectionId=1&textTypeId=1").success(callback);
        }
    }
})

.factory('dataService', function (api) {

    return function (callback) {
        api.getQuestions(function (data) {

            var result = {
                sentenceArray: [],
                answerArray: _.sortBy(data.ResponseTypes['3'].ResponseOptions, function (opt) { return opt.Sequence })
            };
            console.log(data);
            _.each(data.Questions, function (item, i) {
                result.sentenceArray.push(
                        {
                            index: i,
                            questionId: item.Id,
                            questionText: item.Text,
                            helpText: item.HelpText,
                            answerIndex: -1,
                            answerId: -1,
                            disabled: true
                        }
                    );
            })

            result.sentenceArray.dataToSubmit = function () {
                var newData = [];
                for (var i = 0; i < this.length; i++) {
                    newData.push([this[i].questionId, this[i].answerId, this[i].answerIndex]);
                };
                return newData;
            };

            callback(result);
        });
    }
})

.factory('messageService', function ($timeout) {

    var settings = {
        publish_key: 'pub-c-34d13177-c7ef-42cb-a475-6163ef5cf173',
        subscribe_key: 'sub-c-2495c260-990f-11e2-ac20-12313f022c90',
        channel: 'c1',
        waitForChannelMs: 100
    };

    var channelOpen = false;

    var pubnub = PUBNUB.init({
        publish_key: settings.publish_key,
        subscribe_key: settings.subscribe_key
    });

    var send = function (message) {
        pubnub.publish({
            channel: settings.channel,
            message: message
        })
    };

    var listen = function (callback) {
        pubnub.subscribe({
            restore: true,
            channel: settings.channel,
            message: function (msg) { callback(msg) }
        })
    };

    var retrieveLatest = function (callback) {
        pubnub.history({
            limit: 1,
            channel: settings.channel,
            callback: function (msg) { callback(msg[0][0]) }
        });
    };

    return {
        send: send,
        listen: listen,
        retrieveLatest: retrieveLatest
    };
})

.factory('d3', function (_) {

    var pie = function () {

        var path, pie, arc;

        var containsANonZero = function (data) {
            return _.some(data, function (item) { return item > 0 })
        }

        var arcTween = function (a) {
            var i = d3.interpolate(this._current, a);
            this._current = i(0);
            return function (t) {
                return arc(i(t));
            };
        }

        var init = function (width, height, el, data) {
            var radius = Math.min(width, height) / 2,
                color = d3.scale.ordinal().range(["#e8edf2", "#e74c3c", "#f1c40f", "#3498db", "#1abc9c", "#2ecc71"]);

            pie = d3.layout.pie()
                .sort(null);

            arc = d3.svg.arc()
                .innerRadius(radius - (width / 4))
                .outerRadius(radius - (width / 20));

            var svg = d3.select(el[0]).append("svg")
                 .attr("width", width)
                 .attr("height", height)
                 .append("g")
                 .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

            !containsANonZero(data) && (data[0] = 1);

            path = svg.selectAll("path")
                .data(pie(data))
                .enter().append("path")
                .attr("fill", function (d, i) { return color(i); })
                .attr("d", arc)
                .each(function (d) { this._current = d; }); ;

        }

        var update = function (data) {

            !containsANonZero(data) && (data[0] = 1);

            path = path.data(pie(data));
            path.transition().duration(500).attrTween("d", arcTween);
        }

        return {
            init: init,
            update: update
        }
    }

    return {
        pie: pie
    }

})
