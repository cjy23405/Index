// ui-script.js

(function ($) {
    // common
    var $win = $(window);
    var $doc = $(document);

    // elFocus
    var elFocus = ($el) => {
        var setTabindex = false;

        if (!$el.attr('tabindex')) {
            $el.attr('tabindex', '0');
            setTabindex = true;
        }

        $el.focus();

        if (setTabindex) {
            $el.removeAttr('tabindex');
        }
    };

    // index
    var index = {
        dates: [],
        render: function () {
            if (!guideIndex) return;

            var $title = $('title');
            var $headerTitle = $('._guideHeader__titleLink');
            var $datas = $('#guideIndexDatas');
            var html = index.makeHtml();

            $title.text(guideIndex.title);
            $headerTitle.text(guideIndex.title);
            $datas.html(html);
        },
        makeHtml: function () {
            var head = guideIndex.head;
            var data = guideIndex.data;
            var html = '';
            var colHtml = '';
            var headHtml = '';

            colHtml += '                <col style="width: 50px" />';
            headHtml += '                    <th class="_guideIndexTable__no">No</th>';

            for (var h = 0; h < head.length; h++) {
                colHtml += '                <col style="' + (head[h].width ? 'width: ' + head[h].width : '') + '" />';
                headHtml += '                    <th class="_guideIndexTable__' + head[h].name + '">' + head[h].text + '</th>';
            }

            for (var s = 0; s < data.length; s++) {
                html += '<section class="_guideIndexSection">';
                html += '    <h2 class="_guideIndexSection__title">' + data[s].depth1 + '</h2>';
                html += '    <div class="_guideIndexTable">';
                html += '        <table>';
                html += '            <colgroup>';
                html += colHtml;
                html += '            </colgroup>';
                html += '            <thead>';
                html += '                <tr>';
                html += headHtml;
                html += '                </tr>';
                html += '            </thead>';
                html += '            <tbody>';
                html += index.makeDataHtml(data[s].data);
                html += '            </tbody>';
                html += '        </table>';
                html += '    </div>';
                html += '</section>';
            }

            return html;
        },
        makeDataHtml: function (data) {
            var head = guideIndex.head;
            var html = '';

            for (var i = 0; i < data.length; i++) {
                html += '                <tr>';
                html += '                    <td class="_guideIndexTable__no">' + (i + 1) + '</td>';

                for (var h = 0; h < head.length; h++) {
                    if (head[h].name === 'path') {
                        html += index.makePathHtml(data[i].path);
                    } else if (head[h].name === 'create') {
                        html += index.makeCreateHtml(data[i].create);
                    } else if (head[h].name === 'update') {
                        html += index.makeUpdateHtml(data[i].log);
                    } else if (head[h].name === 'log') {
                        html += index.makeLogHtml(data[i].log);
                    } else if (head[h].name.match(/id|depth/)) {
                        html += index.makeCellHtml(head[h].name, data[i], i, data);
                    } else {
                        html += '                    <td class="_guideIndexTable__' + head[h].name + '">' + data[i][head[h].name] + '</td>';
                    }
                }

                html += '                </tr>';
            }

            return html;
        },
        makeCellHtml: function (name, data, i, items) {
            var html = '';

            if (i > 0 && items[i - 1][name] === data[name]) {
                html += '                    <td class="_guideIndexTable__' + name + '"></td>';
            } else {
                html += '                    <td class="_guideIndexTable__' + name + '">' + data[name] + '</td>';
            }

            return html;
        },
        makePathHtml: function (path) {
            var root = guideIndex.pathRoot;
            var html = '';

            html += '                    <td class="_guideIndexTable__path">';
            html += '                        <a href="' + root + path + '" class="_guideIndexTable__link">' + path + '</a>';
            html += '                    </td>';

            return html;
        },
        makeCreateHtml: function (create) {
            var html = '';

            html += '                    <td class="_guideIndexTable__create" data-date="' + create + '">' + create + '</td>';

            if (index.dates.indexOf(create) === -1) {
                index.dates.push(create);
            }

            return html;
        },
        makeUpdateHtml: function (log) {
            var html = '';

            return html;
        },
        makeLogHtml: function (log) {
            var html = '';

            return html;
        },
    };

    // dom ready
    $(function () {
        var $html = $('html');
        var $body = $('body');

        index.render();
    });

    // win load, scroll, resize
    $win.on('load.guideJS', function () {
        //
    })
        .on('scroll.guideJS', function () {
            //
        })
        .on('resize.guideJS', function () {
            //
        })
        .on('orientationchange.guideJS', function () {
            //
        });
})(jQuery);
