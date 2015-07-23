var Directory = (function () {

    var baseUrl = 'http://www.yelp.com/search?find_desc=';
    var page = 0;
    var list = [];
    var loading = false;
    var lastUrl = '';

    function search(term, address, success, failure) {
        var url = baseUrl + term;
        if (address) {
            url += '&find_loc=' + address;
        }

        if (loading) {
            failure('Loading!');
        } else if (lastUrl !== url) {
            lastUrl = url;
            directory(success, failure);
        } else if (!list.length) {
            page += 10;
            directory(success, failure);
        } else {
            success(list.shift());
        }
    }

    function directory(success, failure) {

        loading = true;

        $.ajax({
            url: encodeURI(lastUrl + '&start=' + page),
            type: 'GET',
            crossDomain: true,
            success: parseBody,
            error: failure
        });

        function parseBody(data) {
            try {

                var html = data.match(/<ol>[\W\w]+<\/ol>/)[0];

                var items = $(html);

                items = items.children('.interactive-list-item').toArray();

                list = items.reduce(function (l, n) {
                    var $n = $(n);
                    try {
                        var item = {
                            img          : $n.find('.photo-box img').attr('src'),
                            distance     : $n.find('.biz-attrs').children()[0].textContent.trim(),
                            title        : $n.find('.h-link').text().match(/\d+\.([\w\s]+)/)[1].trim(),
                            neighborhood : $n.find('.neighborhood-str-list').text().trim(),
                            address      : $n.find('address').text().trim(),
                            tags         : $n.find('.category').text().trim() //.split(',')
                        };
                        l.push(item);
                    } catch (e) {
                        console.log(e);
                    }
                    return l;
                }, []);

                success(list.shift());

            } catch (e) {
                failure(e);
            }

            loading = false;
        }
    }

    return search;

})();