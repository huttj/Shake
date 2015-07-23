var Shaker = (function () {

    var G = 9.81;

    var lastCheck = 0;
    var lastShaken = 0;
    var threshold = G;

    var running = false;
    var range;

    var watchId;
    var intervalId;

    resetRange();

    return {
        listen : start,
        start  : start,
        stop   : stop
    };

    function resetRange() {
        range = {
            x: { max: 0, min: 0 },
            y: { max: 0, min: 0 },
            z: { max: 0, min: 0 }
        };
    }

    function start(onShaken, onAcceleration) {

        running = true;

        // Todo(Joshua): Maybe we can use a named function and setTimeout here...
        (function loop() {

            lastCheck += 100;
            navigator.accelerometer.clearWatch(watchId);
            watchId = navigator.accelerometer.getCurrentAcceleration(gotAcceleration);

            // Check maximum and minimum acceleration over a second
            if (lastCheck % 500 === 0) {

                // Check each axis
                for (var key in range) {

                    // If the displacement is greater than the threshold, we've been shaken
                    if (pastThreshold(key)) {

                        // Ignore shakes within two seconds of each other
                        if (lastCheck - lastShaken > 2000) {
                            lastShaken = lastCheck;
                            onShaken();
                        }
                        break;
                    }
                }

                resetRange();
            }

            if (running) setTimeout(loop, 100);

        })();
    }

    function pastThreshold(key) {
        return (range[key].max > threshold && range[key].min < -1 *threshold);
    }

    function stop() {
        clearInterval(intervalId);
        running = false;
    }

    function gotAcceleration(e) {
        Object.keys(range).forEach(function (key) {
            var a = range[key];
            a.max = Math.max(a.max, e[key]);
            a.min = Math.min(a.min, e[key]);
        });
    }

    function log() {
        console.log.apply(console, arguments);
    }

})();