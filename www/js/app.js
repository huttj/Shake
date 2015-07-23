var elementNames = 'img,distance,title,neighborhood,address,tags'.split(',');
var elements;
var $loading  = $('.loading');
var $app      = $('.app');
var $term     = $('#term');
var $location = $('.location');
var term      = '';

document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {
    term = $term.val();
    Location.updateLocation(setLocation);
    getElements();
    Shaker.listen(onShaken);
    $term.on('change', function() {
        term = $term.val();
    });
}

function setLocation(res) {
    try {
        $location.text(res.address.city + ', ' + res.address.state);
    } catch (e) {
        console.log(e);
        $location.text('Unknown');
    }
}

function onAcceleration(a) {
    var coords = {
        x: Math.round(a.x *  -5) * 2,
        y: Math.round(a.y *   5) * 2,
        z: Math.round(a.z * 500) * 2
    };
    $app.css({
        transform: compile('translate3d({x}px,{y}px,{z}px)', coords)
    });
}

function onShaken() {
    $loading.removeClass('.hidden');
    navigator.vibrate(500);
    Directory(term, Location.address(), attachInfo, failure);
}

function attachInfo(item) {
    elementNames.forEach(function (n) {
        if (n == 'img') {
            elements[n].src = item[n];
        } else {
            elements[n].textContent = item[n];
        }
    });
    $loading.addClass('hidden');
}

function failure(e) {
    if (e === 'Loading!') {
        $loading.removeClass('hidden');
    }
}

function getElements() {
    var $ = document.querySelector.bind(document);
    elements = elementNames.reduce(getElement, {});
    function getElement(l, n) {
        return l[n] = $('#' + n), l;
    }
}

function log() {
    console.log.apply(console, arguments);
}