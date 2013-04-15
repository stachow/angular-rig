angular.module('app.services', [])

.factory('_', function () {
    return window._;
})

.factory('dataService', function () {

    var words = "Lorem ipsum dolor sit amet consectetur adipiscing elit Curabitur nec vulputate justo Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae Phasellus ullamcorper sapien a ante aliquam ut fringilla libero adipiscing Fusce quis lectus lectus et cursus risus Maecenas ullamcorper erat eu tortor iaculis eget ultricies enim imperdiet Cras rutrum sagittis dignissim Class aptent taciti sociosqu ad litora torquent per conubia nostra per inceptos himenaeos Donec hendrerit tortor commodo malesuada adipiscing lacus massa rhoncus mauris lacinia bibendum lacus odio quis libero Mauris sollicitudin est eu dui dapibus commodo Donec convallis tincidunt augue quis fringilla neque malesuada ut Nunc faucibus lorem vitae risus vulputate ut ullamcorper sapien egestas Ut malesuada metus et ante blandit vel dapibus nisl tincidunt Nunc eu turpis magna vitae vulputate risus Nam in turpis ante Vestibulum elementum vulputate arcu mattis fermentum Aenean tincidunt ultricies mi a rhoncus ante iaculis ac Fusce ligula tellus suscipit nec ultricies ut pellentesque in eros Curabitur eleifend lorem ut arcu scelerisque blandit Suspendisse nunc lorem fringilla eu lobortis sit amet convallis in tellus Phasellus urna metus vestibulum et sodales et luctus a libero Class aptent taciti sociosqu ad litora torquent per conubia nostra per inceptos himenaeos Nulla in dui eget libero imperdiet dignissim Integer vel varius leo Fusce nec tortor at augue facilisis porta Etiam nec commodo quam Curabitur sit amet orci in lectus volutpat sagittis Proin non mollis nunc Ut nulla elit bibendum a consequat non vestibulum sed purus Mauris sit amet enim tellus Curabitur sed nunc eget felis adipiscing posuere Ut semper ultrices venenatis Mauris semper euismod diam eu feugiat nisi bibendum ut Donec cursus placerat tincidunt Donec porttitor diam a dictum porta enim mi tempus nisl gravida egestas ligula felis ac magna Nulla et quam mattis ante ornare porta et ac augue Ut imperdiet venenatis";
    var wordsArray = words.split(" ");

    var sentenceArray = [];
    for (var i = 0; i < 50; i++) {
        var question = wordsArray.slice(i * 6, (i * 6 + 5)).join(" ");
        sentenceArray.push(
            {
                id: i,
                question: question,
                answer: -1,
                disabled: true
            }
        );
    }

    sentenceArray.dataToSubmit = function () {
        var newData = [];
        for (var i = 0; i < this.length; i++) {
            newData.push(
                [this[i].id, this[i].answer]
            );
        };
        return newData;
    };

    return sentenceArray;
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
          return function(t) {
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
                .each(function(d) { this._current = d; });;

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

.factory('bigDataService', function ($http) {

    return function (callback) { 
        return $http.get('/angular-rig/resource/data.json.txt').success(callback)
    }

})
