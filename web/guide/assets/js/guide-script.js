// guide-script.js

(function ($) {
  // common
  var $win = $(window);
  var $doc = $(document);

  // index
  var guideIndex = window.guideIndex || null;
  var index = {
    timer: null,
    dates: [],
    count: {
      total: 0,
    },
    resize: function () {
      var $nav = $('#guideIndexNav');

      if (!$nav.length) return;

      var $navBlock = $nav.find('._guideIndexNav__block');

      $nav.height($navBlock.outerHeight());
    },
    scroll: function () {
      var $nav = $('#guideIndexNav');

      if (!$nav.length) return;

      var $navBlock = $nav.find('._guideIndexNav__block');
      var scrollLeft = $win.scrollLeft();

      $navBlock.css('margin-left', -scrollLeft + 'px');
    },
    render: function () {
      guideIndex = window.guideIndex || null;

      if (!guideIndex) return;

      var $title = $('title');
      var $headerTitle = $('._guideHeader__titleLink');
      var $datas = $('#guideIndexDatas');
      var $complete = $('#guideIndexCompleteRate');
      var $total = $('#guideIndexTotalCount');
      var $counts = $('[data-index-count]');
      var $nav = $('#guideIndexNav');
      var $navList = $nav.find('._guideIndexNav__list');
      var html = index.makeHtml();

      $title.text(guideIndex.title);
      $headerTitle.text(guideIndex.title);
      $datas.html(html.data);
      $navList.html(html.nav);

      if (index.dates.length) {
        index.dates.sort();

        $datas.find('[data-date="' + index.dates[index.dates.length - 1] + '"]').each(function () {
          var $this = $(this);
          var $row = $this.closest('tr');

          $this.addClass('isEmphasis');
          $row.addClass('isEmphasis');
        });
      }

      $complete.text(((100 / index.count.total) * index.count.end).toFixed(2) + ' %');
      $total.text(index.count.total);

      $counts.each(function () {
        var $this = $(this);
        var name = $this.attr('data-index-count');

        if (index.count[name]) {
          $this.text(index.count[name]);
        }
      });
    },
    makeHtml: function () {
      var head = guideIndex.head;
      var data = guideIndex.data;
      var html = '';
      var colHtml = '';
      var headHtml = '';
      var navHtml = '';

      colHtml += '                <col style="width: 50px" />';
      headHtml += '                    <th class="_guideIndexTable__no">No</th>';

      for (var h = 0; h < head.length; h++) {
        colHtml += '                <col style="' + (head[h].width ? 'width: ' + head[h].width : '') + '" />';
        headHtml += '                    <th class="_guideIndexTable__' + head[h].name + '">' + head[h].text + '</th>';
      }

      for (var s = 0; s < data.length; s++) {
        html += '<section class="_guideIndexSection" id="guideIndexSection' + s + '">';
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

        navHtml += '<li class="_guideIndexNav__item">';
        navHtml += '    <a href="#guideIndexSection' + s + '" class="_guideIndexNav__link">' + data[s].depth1 + '</a>';
        navHtml += '</li>';
      }

      return { data: html, nav: navHtml };
    },
    makeDataHtml: function (data) {
      var head = guideIndex.head;
      var html = '';

      for (var i = 0; i < data.length; i++) {
        html += '                <tr class="' + (data[i].status === 'delete' ? 'isDelete' : '') + '">';
        html += '                    <td class="_guideIndexTable__no">' + (i + 1) + '</td>';

        for (var h = 0; h < head.length; h++) {
          if (head[h].name === 'path') {
            html += index.makePathHtml(data[i].path);
          } else if (head[h].name === 'status') {
            html += index.makeStatusHtml(data[i].status);
          } else if (head[h].name === 'create') {
            html += index.makeCreateHtml(data[i].create);
          } else if (head[h].name === 'update') {
            html += index.makeUpdateHtml(data[i].log);
          } else if (head[h].name === 'log') {
            html += index.makeLogHtml(data[i].log);
          } else if (head[h].name.match(/id|depth/)) {
            html += index.makeCellHtml(head[h].name, data[i], i, data);
          } else {
            html += '                    <td class="_guideIndexTable__' + head[h].name + '">' + data[i][head[h].name].replace(/\n/g, '<br />') + '</td>';
          }
        }

        html += '                </tr>';

        if (index.count[data[i].status]) {
          index.count[data[i].status]++;
        } else {
          index.count[data[i].status] = 1;
        }

        if (!(data[i].status === 'delete')) {
          index.count.total++;
        }
      }

      return html;
    },
    makeCellHtml: function (name, data, i, items) {
      var html = '';

      if (i > 0 && items[i - 1][name] === data[name]) {
        html += '                    <td class="_guideIndexTable__' + name + '"></td>';
      } else {
        html += '                    <td class="_guideIndexTable__' + name + '">' + data[name].replace(/\n/g, '<br />') + '</td>';
      }

      return html;
    },
    makePathHtml: function (path) {
      var root = guideIndex.pathRoot;
      var html = '';

      html += '                    <td class="_guideIndexTable__path">';
      html += '                        <a href="' + root + path + '" class="_guideIndexTable__link" target="_blank">' + path + '</a>';
      html += '                    </td>';

      return html;
    },
    makeStatusHtml: function (status) {
      var statusObj = guideIndex.status;
      var html = '';

      if (status.length) {
        html += '                    <td class="_guideIndexTable__status">';
        html += '                        <span class="_guideStatus _guideStatus--' + status + '">' + statusObj[status] + '</span>';
        html += '                    </td>';
      } else {
        html += '                    <td class="_guideIndexTable__status"></td>';
      }

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
      var last = null;
      var html = '';

      log.sort(function (a, b) {
        if (a.date > b.date) {
          return 1;
        }
        if (a.date < b.date) {
          return -1;
        }
        return 0;
      });

      if (log.length) {
        last = log[log.length - 1];

        html += '                    <td class="_guideIndexTable__update" data-date="' + last.date + '">' + last.date + '</td>';

        if (index.dates.indexOf(last.date) === -1) {
          index.dates.push(last.date);
        }
      } else {
        html += '                    <td class="_guideIndexTable__update"></td>';
      }

      return html;
    },
    makeLogHtml: function (log) {
      var html = '';

      log.sort(function (a, b) {
        if (a.date > b.date) {
          return 1;
        }
        if (a.date < b.date) {
          return -1;
        }
        return 0;
      });

      html += '                    <td class="_guideIndexTable__log">';

      if (log.length) {
        html += '                        <ul class="_guideIndexLog">';
      }

      for (var i = 0; i < log.length; i++) {
        html += '                            <li class="_guideIndexLog__item" data-date="' + log[i].date + '">';
        html += '                                <span class="_guideIndexLog__date">' + log[i].date + '</span>';
        html += '                                <span class="_guideIndexLog__text">' + log[i].text.replace(/\n/g, '<br />') + '</span>';
        html += '                            </li>';
      }

      if (log.length) {
        html += '                        </ul>';
      }

      html += '                    </td>';

      return html;
    },
  };
  $doc.on('click.guideJS', '._guideIndexNav__link', function () {
    var $this = $(this);
    var href = $this.attr('href');
    var $section = $(href);
    var $sections = $('._guideIndexSection');

    $sections.removeClass('isClicked');

    clearTimeout(index.timer);

    index.timer = setTimeout(function () {
      clearTimeout(index.timer);
      $section.addClass('isClicked');
    });
  });

  // dom ready
  $(function () {
    var $html = $('html');
    var $body = $('body');

    index.render();
    index.resize();
    index.scroll();
  });

  // win load, scroll, resize
  $win
    .on('load.guideJS', function () {
      index.resize();
      index.scroll();
    })
    .on('scroll.guideJS', function () {
      index.scroll();
    })
    .on('resize.guideJS', function () {
      index.resize();
      index.scroll();
    })
    .on('orientationchange.guideJS', function () {
      index.resize();
      index.scroll();
    });
})(jQuery);
