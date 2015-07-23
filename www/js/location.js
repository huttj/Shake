var Location = (function (){

    var baseUrl = 'http://nominatim.openstreetmap.org/reverse?format=json&lat={latitude}&lon={longitude}';
    var lastAddress;

    return {
        updateLocation: updateLocation,
        address: address
    };

    function getAddress(coords, cb) {
        coords = coords.coords || coords;
        $.get(compile(baseUrl, coords)).then(function(address) {
            lastAddress = address.display_name;
            if (cb) cb(address);
        });
    }

    function address() {
        return lastAddress;
    }

    function updateLocation(cb) {
        var opts = {
            enableHighAccuracy: false,
            timeout: 1000*60*10,
            maximumAge: 1000*60*5
        };
        navigator.geolocation.getCurrentPosition(function (position) {
            getAddress(position, cb);
        }, alert, opts);
    }

})();