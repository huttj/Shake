var elementNames = 'img,distance,title,neighborhood,address,tags'.split(',');
var elements;
var range;
var lastComparison = 0;
var lastGet = 0;
var threshold = 2;
var G = 9.81;
var loading = $('.loading');

function resetRange() {
    range = {
        x: { max: 0, min: 0 },
        y: { max: 0, min: 0 },
        z: { max: 0, min: 0 }
    };
};

resetRange();

document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {
    getElements();

    navigator.geolocation.getCurrentPosition(Location.updateLocation, alert, {
        enableHighAccuracy: false,
        timeout: 1000*60*10,
        maximumAge: 1000*60*5
    });

    var interval;
    setInterval(function () {
        navigator.accelerometer.clearWatch(interval);
        interval = navigator.accelerometer.getCurrentAcceleration(gotAcceleration, message);

        lastComparison += 100;

        // Every second
        if (lastComparison % 1000 === 0) {
            for (var key in range) {
                var diff = range[key].max - range[key].min;
                if (diff > threshold*G) {
                    getNext();
                    break;
                }
            }
            resetRange();
        }

    }, 100);
}

function getNext() {
    if (lastComparison - lastGet > 2000) {
        lastGet = lastComparison;
        navigator.vibrate(500);
        Directory('club', attachInfo, alert);
    }
}

function attachInfo(item) {
    elementNames.forEach(function (n) {
        if (n == 'img') {
            elements[n].src = item[n];
        } else {
            elements[n].textContent = item[n];
        }
    });
}

function gotAcceleration(e) {
    Object.keys(range).forEach(function (key) {
        var a = range[key];
        a.max = Math.max(a.max, e[key]);
        a.min = Math.min(a.max, e[key]);
    });
    //'x,y,z,timestamp'.split(',').forEach(function(n) {
    //    elements[n].textContent = e[n].toFixed(2);
    //});
}

function getElements() {
    var $ = document.querySelector.bind(document);
    //elements = {
    //    x: $('.acceleration-x'),
    //    y: $('.acceleration-y'),
    //    z: $('.acceleration-z'),
    //    timestamp: $('.timestamp'),
    //    message: $('.message'),
    //    num: $('#num')
    //};
    elements = elementNames.reduce(getElement, {});

    function getElement(l, n) {
        return l[n] = $('#' + n), l;
    }
}

function message(msg) {
    //elements.message.textContent = typeof msg === 'string' ? msg : JSON.stringify(msg);
}


function log() {
    console.log.apply(console, arguments);
}