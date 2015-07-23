var compile = (function () {

    var re = /\{([^}]+)\}/g;

    return compile;

    function compile(str, map) {
        return str.replace(re, replacer(map));
    }

    function replacer(map) {
        return function (match, p1, offset, string) {
            return map[p1] || match;
        }
    }

})();