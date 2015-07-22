var Location = (function (){

    var re = /\{([^}]+)\}/g;
    var baseUrl = 'http://nominatim.openstreetmap.org/reverse?format=json&lat={latitude}&lon={longitude}';
    var lastAddress;

    function compile(str, map) {
        return str.replace(re, replacer(map));
    }

    function replacer(map) {
        return function (match, p1, offset, string) {
            console.log(match, p1, offset, string);
            return map[p1] || match;
        }
    }

    function updateLocation(coords) {
        coords = coords.coords || coords;
        return $.get(compile(baseUrl, coords)).then(function(address) {
            lastAddress = address.display_name;
            return address;
        });
    }

    function getLastAddress() {
        return lastAddress;
    }

    return {
        updateLocation: updateLocation,
        getLastAddress: getLastAddress
    };

})();