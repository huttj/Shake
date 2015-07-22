var elementNames = 'img,distance,title,neighborhood,address,tags'.split(',');
var elements;
var maxX = 0;
var minX = 0;
var lastComparison = 0;
var lastGet = 0;
var threshold = 3;
var G = 9.81;
var loading = $('.loading');

document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {
    getElements();

    //elements.num.value = 3;

    //elements.num.addEventListener('change', function() {
    //    threshold = Number(elements.num.value) || 3;
    //});

    var interval;
    setInterval(function () {
        navigator.accelerometer.clearWatch(interval);
        interval = navigator.accelerometer.getCurrentAcceleration(gotAcceleration, message);

        lastComparison += 100;

        // Every 2 seconds
        if (lastComparison % 1000 === 0) {
            var diff = maxX - minX;
            console.log('maxX:', maxX, 'minX:', minX);
            if (diff > threshold*G) {
                //message('SHAKEN!!! ' + diff + ' > ' + (threshold*G));
                getNext();
            } else {
                //message('Not shaken; displacement: ' + diff + ' < ' + (threshold*G));
            }
            maxX = minX = 0;
        }

    }, 100);
}

function getNext() {
    if (lastComparison - lastGet > 2000) {
        lastGet = lastComparison;
        navigator.vibrate(500);
        directory('club', attachInfo, alert);
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
    maxX = Math.max(maxX, e.x);
    minX = Math.min(minX, e.x);
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