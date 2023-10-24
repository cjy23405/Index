// ui-script.js

(function ($) {
  var userAgent = navigator.userAgent;
  var userAgentCheck = {
    ieMode: document.documentMode,
    isIos: Boolean(userAgent.match(/iPod|iPhone|iPad/)),
    isAndroid: Boolean(userAgent.match(/Android/)),
  };
  if (userAgent.match(/Edge|Edg/gi)) {
    userAgentCheck.ieMode = 'edge';
  }
  userAgentCheck.androidVersion = (function () {
    if (userAgentCheck.isAndroid) {
      try {
        var match = userAgent.match(/Android (\d+(?:\.\d+){0,2})/);
        return match[1];
      } catch (e) {
        console.log(e);
      }
    }
  })();
  window.userAgentCheck = userAgentCheck;

  // min 포함 max 불포함 랜덤 정수
  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  // 랜덤 문자열
  var hashCodes = [];
  function uiGetHashCode(length) {
    var string = '1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var result = '';
    var stringLength = string.length;

    length = typeof length === 'number' && length > 0 ? length : 10;

    function getCode(length) {
      var code = '';
      for (var i = 0; i < length; i++) {
        code += string[getRandomInt(0, stringLength)];
      }
      if (hashCodes.indexOf(code) > -1) {
        code = getCode(length);
      }
      return code;
    }

    result = getCode(length);
    hashCodes.push(result);

    return result;
  }

  // common
  var $win = $(window);
  var $doc = $(document);

  // simplebar
  // https://grsmto.github.io/simplebar/
  // init ex: $(element).simplebar({/* customOptions */});
  // method ex: $(element).data('simplebar').recalculate();
  $.fn.simplebar = function (customOption) {
    var defaultOption = {
      //
    };

    this.each(function () {
      var option = $.extend({}, defaultOption, customOption);
      var $this = $(this);

      if ($this.data('simplebar') || !$.isFunction(window.SimpleBar)) return;

      if (userAgentCheck.ieMode <= 10) {
        $this.css('overflow', 'auto');
        return;
      }

      var simplebar = new SimpleBar($this.get(0), option);
      $this.data('simplebar', simplebar);
    });

    return $(this);
  };

  // tempus-dominus
  // https://getdatepicker.com/
  // init ex: $(element).datetimepicker({/* customOptions */});
  // method ex: $(element).data('datetimepicker').dates.clear();
  $.fn.datetimepicker = function (customOption) {
    var defaultOption = {
      //
    };

    this.each(function () {
      var option = $.extend({}, defaultOption, customOption);
      var $this = $(this);

      if ($this.data('datetimepicker') || !(tempusDominus instanceof Object) || !$.isFunction(tempusDominus.TempusDominus)) return;

      var datetimepicker = new tempusDominus.TempusDominus($this.get(0), option);
      $this.data('datetimepicker', datetimepicker);
    });

    return $(this);
  };
  if (tempusDominus instanceof Object) {
    tempusDominus.extend(window.tempusDominus.plugins.customDateFormat);
  }

  // split
  // https://split.js.org/
  // init ex: $(element).split({/* customOptions */});
  // method ex: $(element).data('split').getSizes();
  $.fn.split = function (customOption) {
    var defaultOption = {
      cells: [],
      onDrag: function () {},
      onDragStart: function () {},
      onDragEnd: function () {},
    };

    this.each(function () {
      var option = $.extend({}, defaultOption, customOption);
      var $this = $(this);

      if ($this.data('split') || !$.isFunction(window.Split)) return;

      var onDragStart = option.onDragStart;
      option.onDragStart = function (sizes) {
        onDragStart(sizes);
        $this.trigger('dragStart', [sizes]);
      };

      var onDrag = option.onDrag;
      option.onDrag = function (sizes) {
        onDrag(sizes);
        $this.trigger('drag', [sizes]);
      };

      var onDragEnd = option.onDragEnd;
      option.onDragEnd = function (sizes) {
        onDragEnd(sizes);
        $this.trigger('dragEnd', [sizes]);
      };

      var split = new Split(option.cells, option);
      $this.data('split', split);
    });

    return $(this);
  };

  // swiperSet
  // https://github.com/nolimits4web/swiper/tree/Swiper8
  // init ex: $(element).swiperSet({/* customOptions */});
  // method ex: $(element).data('swiper').update();
  $.fn.swiperSet = function (customOption) {
    var defaultOption = {
      wrapTagName: 'div',
      containerTagName: 'div',
      customClass: null,
      appendController: null,
      pageControl: false,
      nextControl: false,
      prevControl: false,
      playControl: false,
      pauseControl: false,
      togglePlayControl: false,
      scrollbarControl: false,
      observer: true,
      observeParents: true,
      a11yHidden: false,
      a11y: {
        firstSlideMessage: '첫번째 슬라이드',
        lastSlideMessage: '마지막 슬라이드',
        nextSlideMessage: '다음 슬라이드',
        prevSlideMessage: '이전 슬라이드',
        paginationBulletMessage: '{{index}}번째 슬라이드로 이동',
      },
      on: {},
    };

    this.each(function () {
      var option = $.extend({}, defaultOption, customOption);

      if (!(typeof customOption.a11y === 'object')) {
        customOption.a11y = {};
      }

      $.extend(option.a11y, defaultOption.a11y, customOption.a11y);

      var $this = $(this);
      var isA11y = !(typeof option.a11y.enabled === 'boolean' && !option.a11y.enabled);

      if ($this.data('swiper') || !$.isFunction(window.Swiper)) return;

      var $items = $this.children();
      var length = $items.length;

      if (!$this.parent('.swiper').length) {
        $this.wrap('<' + option.wrapTagName + ' class="swiper-object"><' + option.containerTagName + ' class="swiper"></' + option.containerTagName + '></' + option.wrapTagName + '>');
      }
      $this.addClass('swiper-wrapper');

      $items.addClass('swiper-slide').each(function (i) {
        var $this = $(this);

        $this.attr('data-swiper-set-slide-index', i);

        if (isA11y && userAgentCheck.isAndroid) {
          $this.attr('title', i + 1 + '/' + length);
        }
      });

      var $container = $this.parent('.swiper');
      var $wrap = $container.parent('.swiper-object');
      var $appendController = $wrap;
      var length = $items.length;

      if (typeof option.customClass === 'string') {
        $wrap.addClass(option.customClass);
      }

      option.pagination = option.pagination || {};
      option.navigation = option.navigation || {};
      option.scrollbar = option.scrollbar || {};

      option.autoplay = length > 1 && option.autoplay ? option.autoplay : false;
      option.loop = length > 1 && option.loop ? option.loop : false;

      if (option.appendController) {
        $appendController = $(option.appendController);
      }

      if (length === 1) {
        $wrap.addClass('swiper-object-once');
      } else if (length <= 0) {
        $wrap.addClass('swiper-object-empty');
      }

      if (option.prevControl) {
        $appendController.append('<button type="button" class="swiper-button-prev"><span class="swiper-button-prev-text">이전 슬라이드</span></button>');
        option.navigation.prevEl = $appendController.find('.swiper-button-prev').get(0);
      }
      if (option.nextControl) {
        $appendController.append('<button type="button" class="swiper-button-next"><span class="swiper-button-next-text">다음 슬라이드</span></button>');
        option.navigation.nextEl = $appendController.find('.swiper-button-next').get(0);
      }
      if (option.scrollbarControl) {
        $appendController.append('<span class="swiper-scrollbar"></span>');
        option.scrollbar.el = $appendController.find('.swiper-scrollbar').get(0);
      }
      if (option.playControl) {
        $appendController.append('<button type="button" class="swiper-button-play"><span class="swiper-button-play-text">자동 슬라이드 재생</span></button>');
        option.playButton = $appendController.find('.swiper-button-play').get(0);
      }
      if (option.pauseControl) {
        $appendController.append('<button type="button" class="swiper-button-pause"><span class="swiper-button-pause-text">자동 슬라이드 정지</span></button>');
        option.pauseButton = $appendController.find('.swiper-button-pause').get(0);
      }
      if (option.togglePlayControl) {
        $appendController.append('<button type="button" class="swiper-button-toggle-play"><span class="swiper-button-toggle-play-text">자동 슬라이드 재생</span></button>');
        option.togglePlayButton = $appendController.find('.swiper-button-toggle-play').get(0);
      }
      if (option.pageControl) {
        $appendController.append('<span class="swiper-pagination"></span>');
        option.pagination.el = $appendController.find('.swiper-pagination').get(0);
      }
      if (option.autoplay && option.playControl) {
        $(option.playButton).addClass('active').attr('disabled', '').prop('disabled', true);
      } else if (!option.autoplay && option.pauseControl) {
        $(option.pauseButton).addClass('active').attr('disabled', '').prop('disabled', true);
      }
      if (option.autoplay && option.togglePlayControl) {
        $(option.togglePlayButton).addClass('is-pause').removeClass('is-play').find('.swiper-button-toggle-play-text').text('자동 슬라이드 정지');
      } else if (!option.autoplay && option.togglePlayControl) {
        $(option.togglePlayButton).removeClass('is-pause').addClass('is-play').find('.swiper-button-toggle-play-text').text('자동 슬라이드 재생');
      }

      var on = $.extend({}, option.on);
      var isInit = false;

      function callEvent(name, swiper, args1, args2, args3) {
        if (typeof on[name] === 'function') {
          on[name](swiper, args1, args2, args3);
        }
      }

      var bulletClick = false;

      if (option.a11yHidden && option.pagination.clickable) {
        $(option.pagination.el).on('click.swiperSet', '.swiper-pagination-bullet', function () {
          bulletClick = true;
        });
      }

      function setA11yHidden(swiper) {
        var $slides = $(swiper.slides);
        var $activeItem = $slides.eq(swiper.activeIndex);

        if (option.a11yHidden) {
          $activeItem.removeAttr('aria-hidden');
          $slides.not($activeItem).attr('aria-hidden', 'true');
        }
      }

      function init(swiper) {
        var $slides = $(swiper.slides);

        if (!isInit && $slides.length) {
          isInit = true;

          if (isA11y && userAgentCheck.isAndroid) {
            $slides.removeAttr('aria-label role');
          }

          if (option.a11yHidden) {
            $slides.attr('tabindex', '0');
          }

          setA11yHidden(swiper);
        }
      }

      option.on.init = function (swiper) {
        var $slides = $(swiper.slides);

        if (isA11y && userAgentCheck.isAndroid && $slides.length) {
          $slides.removeAttr('aria-label role');
        }

        init(swiper);
        callEvent('init', swiper);
      };

      option.on.observerUpdate = function (swiper) {
        init(swiper);
        callEvent('observerUpdate', swiper);
      };

      option.on.slideChange = function (swiper) {
        setA11yHidden(swiper);

        $container.scrollTop(0).scrollLeft(0);

        callEvent('slideChange', swiper);
      };

      option.on.slideChangeTransitionEnd = function (swiper) {
        var $slides = $(swiper.slides);
        var $activeItem = $slides.eq(swiper.activeIndex);

        if (option.a11yHidden && bulletClick) {
          $activeItem.focus();
        }

        bulletClick = false;

        callEvent('slideChangeTransitionEnd', swiper);
      };

      option.on.autoplayStart = function (swiper) {
        if (option.playControl) {
          $(option.playButton).addClass('active').attr('disabled', '').prop('disabled', true);
        }
        if (option.pauseControl) {
          $(option.pauseButton).removeClass('active').removeAttr('disabled', '').prop('disabled', false);
        }
        if (option.togglePlayButton) {
          $(option.togglePlayButton).addClass('is-pause').removeClass('is-play').find('.swiper-button-toggle-play-text').text('자동 슬라이드 정지');
        }

        if (isA11y) {
          $this.attr('aria-live', 'off');
        }

        callEvent('autoplayStart', swiper);
      };

      option.on.autoplayStop = function (swiper) {
        if (option.playControl) {
          $(option.playButton).removeClass('active').removeAttr('disabled', '').prop('disabled', false);
        }
        if (option.pauseControl) {
          $(option.pauseButton).addClass('active').attr('disabled', '').prop('disabled', true);
        }
        if (option.togglePlayButton) {
          $(option.togglePlayButton).removeClass('is-pause').addClass('is-play').find('.swiper-button-toggle-play-text').text('자동 슬라이드 재생');
        }

        if (isA11y) {
          $this.attr('aria-live', 'polite');
        }

        callEvent('autoplayStop', swiper);
      };

      option.on.resize = function (swiper) {
        $this.trigger('swiperResize');
        callEvent('resize', swiper);
      };

      if ($.isFunction(window.Swiper)) {
        var swiper = new Swiper($container.get(0), option);
        $this.data('swiper', swiper);

        if (option.playControl) {
          $(option.playButton).on('click.swiperSet', function () {
            swiper.autoplay.start();
          });
        }
        if (option.pauseControl) {
          $(option.pauseButton).on('click.swiperSet', function () {
            swiper.autoplay.stop();
          });
        }
        if (option.togglePlayButton) {
          $(option.togglePlayButton).on('click.swiperSet', function () {
            var $this = $(this);

            if ($this.hasClass('is-play')) {
              swiper.autoplay.start();
            } else if ($this.hasClass('is-pause')) {
              swiper.autoplay.stop();
            }
          });
        }

        var $slides = $(swiper.slides);

        if (isA11y && userAgentCheck.isAndroid) {
          $slides.removeAttr('aria-label role');
        }
      }
    });
  };

  // file-view
  function fileViewInt($root) {
    if (!$root) {
      $root = $doc;
    }
    $root.find('.file-view').each(function () {
      var $wrap = $(this);
      var $list = $wrap.find('.file-view__list');

      $list.swiperSet({
        nextControl: true,
        prevControl: true,
      });
    });
  }

  // UiDropDown
  var UiDropDown = function (target, option) {
    var _ = this;
    var $wrap = $(target).eq(0);

    _.className = {
      opened: 'js-dropdown-opened',
      top: 'js-dropdown-top',
      bottom: 'js-dropdown-bottom',
    };
    _.css = {
      hide: {
        position: 'absolute',
        top: '',
        left: '',
        bottom: '',
        marginLeft: '',
        display: 'none',
      },
      show: {
        position: 'absolute',
        top: '100%',
        left: '0',
        display: 'block',
      },
    };
    _.options = option;
    _.wrap = $wrap;
    _.closeTimer = null;
    _.init();
    _.on();
  };
  $.extend(UiDropDown.prototype, {
    init: function () {
      var _ = this;

      if (_.options.opener) {
        if (typeof _.options.opener === 'string') {
          _.opener = _.wrap.find(_.options.opener).eq(0);
        } else {
          _.opener = _.options.opener;
        }
      }

      if (_.options.layer) {
        if (typeof _.options.layer === 'string') {
          _.layer = _.wrap.find(_.options.layer).eq(0);
        } else {
          _.layer = _.options.layer;
        }
        _.layer.css(_.css.hide);
      }

      if (_.layer.length) {
        _.hashCode = uiGetHashCode();
        _.wrap.css('position', 'relative');
      }

      _.options.init();
    },
    on: function () {
      var _ = this;

      if (_.layer.length) {
        _.off();

        if (_.opener && _.opener.length && _.options.event === 'click') {
          _.opener.on('click.uiDropDown' + _.hashCode, function () {
            _.toggle();
          });
          $doc.on('click.uiDropDown' + _.hashCode, function (e) {
            var check = $(e.target).is(_.wrap) || $(e.target).closest(_.wrap).length;

            if (!check) {
              _.close();
            }
          });
          $doc.on('focusin.uiDropDown' + _.hashCode, function (e) {
            var check = $(e.target).is(_.layer) || $(e.target).closest(_.layer).length || ($(e.target).is(_.opener) && _.wrap.hasClass(_.className.opened));

            if (check) {
              _.open();
            } else {
              _.close();
            }
          });
        } else if (_.options.event === 'hover') {
          _.wrap
            .on('mouseenter.uiDropDown' + _.hashCode, function () {
              _.open();
            })
            .on('mouseleave.uiDropDown' + _.hashCode, function () {
              _.close();
            });
          $doc.on('focusin.uiDropDown' + _.hashCode, function (e) {
            var check = $(e.target).is(_.wrap) || $(e.target).closest(_.wrap).length || ($(e.target).is(_.opener) && _.wrap.hasClass(_.className.opened));

            if (check) {
              _.open();
            } else {
              _.close();
            }
          });
        }
        $win.on('resize.uiDropDown' + _.hashCode, function () {
          _.update();
        });
      }
    },
    off: function () {
      var _ = this;

      if (_.options.event === 'click') {
        _.opener.off('click.uiDropDown' + _.hashCode);
        $doc.off('click.uiDropDown' + _.hashCode);
        $doc.off('focusin.uiDropDown' + _.hashCode);
      } else if (_.options.event === 'hover') {
        _.wrap.off('mouseenter.uiDropDown' + _.hashCode).off('mouseleave.uiDropDown' + _.hashCode);
        $doc.off('focusin.uiDropDown' + _.hashCode);
      }
      $win.off('resize.uiDropDown' + _.hashCode);
    },
    update: function () {
      var _ = this;
      var docW = 0;
      var winH = 0;
      var wrapT = 0;
      var wrapH = 0;
      var scrollTop = 0;
      var layerT = 0;
      var layerL = 0;
      var layerH = 0;
      var layerW = 0;
      var $overflow = null;
      var overflowH = 0;
      var overflowT = 0;
      var overflowL = 0;
      var overflowR = 0;
      var style = {
        marginTop: _.options.marginTop,
        marginLeft: _.options.marginLeft,
      };
      var isTopAlign = _.options.defaultVertical === 'top';
      var isOverflow = false;
      var isTopOverflow = false;
      var isBottomOverflow = false;

      if (_.wrap.hasClass(_.className.opened)) {
        _.layer.css({
          top: '',
          left: '-999999px',
          right: '',
          bottom: '',
          marginLeft: '',
          marginRight: '',
        });
        _.wrap.removeClass(_.className.top + ' ' + _.className.bottom);

        docW = $doc.width();
        docH = $doc.height();
        winW = $win.width();
        winH = $win.height();
        scrollLeft = $win.scrollLeft();
        scrollTop = $win.scrollTop();

        _.layer.css(_.css.show);

        if (_.options.align === 'right') {
          style.marginLeft = 0;
          style.marginRight = _.options.marginRight;
          _.layer.css({
            left: 'auto',
            right: '0',
          });
        } else if (_.options.align === 'center') {
          _.layer.css({
            left: '50%',
          });
        }

        function setTopPosition() {
          _.wrap.addClass(_.className.top);
          _.layer.css({
            top: 'auto',
            bottom: '100%',
          });
          style.marginTop = 0;
          style.marginBottom = _.options.marginBottom;
        }
        function setBottomPosition() {
          _.wrap.removeClass(_.className.top).addClass(_.className.bottom);
          _.layer.css({
            top: '',
            bottom: '',
          });
          style.marginTop = _.options.marginTop;
          style.marginBottom = 0;
        }

        if (isTopAlign) {
          setTopPosition();
        }

        wrapT = _.wrap.offset().top;
        wrapH = _.wrap.outerHeight();
        layerT = _.layer.offset().top;
        layerL = _.layer.offset().left;
        trueLayerW = _.layer.outerWidth();
        layerH = _.layer.outerHeight() + _.options.marginTop + _.options.marginBottom;
        layerW = trueLayerW + _.options.marginLeft + _.options.marginRight;

        if (_.options.align === 'center') {
          layerL -= Math.ceil(trueLayerW / 2);
          style.marginLeft = -Math.ceil(trueLayerW / 2);
        }

        _.wrap.parents().each(function () {
          var $this = $(this);
          if ($this.css('overflow').match(/hidden|auto|scroll/) && !$this.is('html')) {
            $overflow = $this;
            return false;
          }
        });

        isOverflow = $overflow !== null && $overflow.length;

        if (isOverflow) {
          overflowH = $overflow.height();
          overflowT = $overflow.offset().top;
          overflowL = $overflow.offset().left;
          overflowR = docW - (overflowL + $overflow.width());
        }

        isTopOverflow = wrapT - layerH < (isOverflow ? overflowT : scrollTop);
        isBottomOverflow = isOverflow ? (isTopAlign ? wrapT + wrapH : layerT) + layerH > overflowT + overflowH : (isTopAlign ? wrapT + wrapH : layerT) + layerH - scrollTop > winH;

        if (isTopAlign) {
          if (isTopOverflow && !isBottomOverflow) {
            setBottomPosition();
          } else {
            _.wrap.addClass(_.className.top);
          }
        } else {
          if (isBottomOverflow && !isTopOverflow) {
            setTopPosition();
          } else {
            _.wrap.addClass(_.className.bottom);
          }
        }

        if (docW - overflowR < layerL + layerW && docW - overflowL - overflowR - layerW > 0) {
          if (_.options.align === 'right') {
            style.marginRight = Math.ceil(layerL + layerW - (docW - overflowR) - _.options.marginLeft);
          } else if (_.options.align === 'center') {
            style.marginLeft -= Math.ceil(layerL + layerW - (docW - overflowR) - _.options.marginLeft);
          } else {
            style.marginLeft = -Math.ceil(layerL + layerW - (docW - overflowR) - _.options.marginLeft);
          }
        } else if (overflowL > layerL || (_.options.align === 'center' && overflowL < layerL && layerL - overflowL < _.options.marginLeft)) {
          if (_.options.align === 'right') {
            style.marginRight = -Math.ceil(overflowL - layerL + _.options.marginLeft);
          } else if (_.options.align === 'center') {
            style.marginLeft += Math.ceil(overflowL - layerL + _.options.marginLeft);
          } else {
            style.marginLeft = Math.ceil(overflowL - layerL + _.options.marginLeft);
          }
        }

        _.layer.css(style);
      }
    },
    toggle: function () {
      var _ = this;

      if (_.wrap.hasClass(_.className.opened)) {
        _.close();
      } else {
        _.open();
      }
    },
    open: function () {
      var _ = this;

      if (!_.wrap.hasClass(_.className.opened)) {
        clearTimeout(_.closeTimer);
        _.wrap.addClass(_.className.opened).css('z-index', '1200');
        _.layer.css(_.css.show);
        _.update();
        _.layer.trigger('uiDropDownOpened');
      }
    },
    close: function () {
      var _ = this;

      if (_.wrap.hasClass(_.className.opened)) {
        clearTimeout(_.closeTimer);
        _.wrap.removeClass(_.className.opened + ' ' + _.className.top + ' ' + _.className.bottom).css('z-index', '');
        _.layer.css(_.css.hide).trigger('uiDropDownClosed');
      }
    },
    btnClose: function () {
      var _ = this;

      if (_.wrap.hasClass(_.className.opened)) {
        clearTimeout(_.closeTimer);

        if (userAgentCheck.isAndroid) {
          _.wrap.removeClass(_.className.opened + ' ' + _.className.top + ' ' + _.className.bottom).css('z-index', '');
          _.layer.css(_.css.hide);

          _.closeTimer = setTimeout(function () {
            clearTimeout(_.closeTimer);
            _.opener.focus();
            _.layer.trigger('uiDropDownClosed');
          }, 10);
        } else if (userAgentCheck.isIos) {
          _.opener.focus();

          _.closeTimer = setTimeout(function () {
            clearTimeout(_.closeTimer);
            _.wrap.removeClass(_.className.opened + ' ' + _.className.top + ' ' + _.className.bottom).css('z-index', '');
            _.layer.css(_.css.hide).trigger('uiDropDownClosed');
          }, 100);
        } else {
          _.opener.focus();
          _.wrap.removeClass(_.className.opened + ' ' + _.className.top + ' ' + _.className.bottom).css('z-index', '');
          _.layer.css(_.css.hide).trigger('uiDropDownClosed');
        }
      }
    },
  });
  $.fn.uiDropDown = function (custom) {
    var defaultOption = {
      opener: null,
      layer: null,
      event: 'click',
      marginTop: 0,
      marginBottom: 0,
      marginLeft: 0,
      marginRight: 0,
      align: 'left',
      defaultVertical: 'bottom',
      init: function () {},
    };
    var other = [];

    custom = custom || {};

    $.each(arguments, function (i) {
      if (i > 0) {
        other.push(this);
      }
    });

    this.each(function () {
      var options = {};
      var uiDropDown = this.uiDropDown;

      if (typeof custom === 'object' && !uiDropDown) {
        options = $.extend({}, defaultOption, custom);
        this.uiDropDown = new UiDropDown(this, options);
      } else if (typeof custom === 'string' && uiDropDown) {
        switch (custom) {
          case 'btnClose':
            uiDropDown.btnClose();
            break;
          case 'close':
            uiDropDown.close();
            break;
          case 'open':
            uiDropDown.open();
            break;
          case 'update':
            uiDropDown.update();
            break;
          case 'on':
            uiDropDown.on();
            break;
          case 'off':
            uiDropDown.off();
            break;
          default:
            break;
        }
      }
    });

    return this;
  };

  // UiSelectBox
  var UiSelectBox = function (target, option) {
    var _ = this;
    var $select = $(target).eq(0);

    _.className = {
      wrap: 'uiselectbox',
      box: 'uiselectbox__box',
      head: 'uiselectbox__head',
      text: 'uiselectbox__text',
      opener: 'uiselectbox__opener',
      layer: 'uiselectbox__layer',
      contents: 'uiselectbox__contents',
      list: 'uiselectbox__list',
      item: 'uiselectbox__item',
      option: 'uiselectbox__option',
      disabled: 'uiselectbox--disabled',
      selected: 'uiselectbox__option--selected',
      hover: 'uiselectbox__option--hover',
      optionDisabled: 'uiselectbox__option--disabled',
    };
    _.options = option;
    _.select = $select;
    _.value = $select.val();

    if (Boolean(window.MutationObserver)) {
      _.init();
      _.on();
    } else {
      $select.addClass('uiselectbox-none-support');
    }
  };
  $.extend(UiSelectBox.prototype, {
    init: function () {
      var _ = this;

      _.hashCode = uiGetHashCode();

      _.createInit();

      _.box.uiDropDown({
        opener: _.opener,
        layer: _.layer,
      });

      _.setAttr();
      _.setSelected();
    },
    on: function () {
      var _ = this;
      var selectEl = _.select.get(0);

      _.setOptionAttrObserver();

      _.optionObserver = new MutationObserver(function (mutations) {
        _.createItems();
        _.setOptionAttrObserver();
      });
      _.optionObserver.observe(selectEl, {
        childList: true,
      });

      _.attrObserver = new MutationObserver(function (mutations) {
        _.setAttr();
      });
      _.attrObserver.observe(selectEl, {
        attributes: true,
      });

      _.select.on('change.uiSelectBox' + _.hashCode, function () {
        _.setSelected();
      });

      _.box.on('uiDropDownOpened.uiSelectBox' + _.hashCode, function () {
        var $selected = _.select.find('option:selected');
        var i = $selected.index();

        _.hover(i);
      });
    },
    createInit: function () {
      var _ = this;

      _.select.wrap('<div class="' + _.className.wrap + ' ' + _.options.customClassName + '"></div>');
      _.wrap = _.select.parent('.' + _.className.wrap);
      _.wrap.append(
        '<div class="' +
          _.className.box +
          '" aria-hidden="true"><div class="' +
          _.className.head +
          '"><div class="' +
          _.className.text +
          '"></div><div class="' +
          _.className.opener +
          '" tabindex="-1"></div></div><div class="' +
          _.className.layer +
          '"><div class="' +
          _.className.contents +
          '"><div class="' +
          _.className.list +
          '"></div></div></div></div>'
      );
      _.box = _.wrap.find('.' + _.className.box);
      _.head = _.wrap.find('.' + _.className.head);
      _.text = _.wrap.find('.' + _.className.text);
      _.opener = _.wrap.find('.' + _.className.opener);
      _.layer = _.wrap.find('.' + _.className.layer);
      _.contents = _.wrap.find('.' + _.className.contents);
      _.list = _.wrap.find('.' + _.className.list);

      _.createItems();
    },
    createItems: function () {
      var _ = this;
      var html = '';

      if (_.options && _.options.length) {
        _.options.off('click.uiSelectBox' + _.hashCode).off('mouseenter.uiSelectBox' + _.hashCode);
      }

      _.select.find('option').each(function () {
        var $this = $(this);
        var text = $this.text();
        var isDisabled = $this.is(':disabled');

        html += '<div class="' + _.className.item + '">';
        html += '<div class="' + _.className.option + ' ' + (isDisabled ? _.className.optionDisabled : '') + '" ' + (isDisabled ? '' : 'tabindex="-1"') + '>';
        html += text;
        html += '</div>';
        html += '</div>';
      });

      _.list.html(html);

      _.items = _.list.find('.' + _.className.item);
      _.options = _.list.find('.' + _.className.option);

      _.options
        .not('.' + _.className.optionDisabled)
        .on('click.uiSelectBox' + _.hashCode, function () {
          _.change(_.options.index($(this)));
          _.box.uiDropDown('close');
          _.opener.focus();
        })
        .on('mouseenter.uiSelectBox' + _.hashCode, function () {
          _.hover(_.options.index($(this)));
        });
    },
    setOptionAttrObserver: function () {
      var _ = this;
      var $options = _.select.find('option');

      if (_.optionAttrObserver && _.optionAttrObserver.length) {
        $.each(_.optionAttrObserver, function () {
          this.disconnect();
        });
      }

      _.optionAttrObserver = [];

      $options.each(function (i) {
        _.optionAttrObserver[i] = new MutationObserver(function (mutations) {
          _.createItems();
        });
        _.optionAttrObserver[i].observe($(this).get(0), {
          attributes: true,
        });
      });
    },
    setAttr: function () {
      var _ = this;
      var title = _.select.attr('title');
      var isDisabled = _.select.is('[disabled]');

      _.box.attr('title', title);

      if (isDisabled) {
        _.wrap.addClass(_.className.disabled);
        _.opener.removeAttr('tabindex');
        _.box.uiDropDown('off');
      } else {
        _.wrap.removeClass(_.className.disabled);
        _.opener.attr('tabindex', '-1');
        _.box.uiDropDown('on');
      }
    },
    setSelected: function () {
      var _ = this;
      var $selected = _.select.find('option:selected');
      var i = $selected.index();

      _.options.removeClass(_.className.selected);
      _.options.eq(i).addClass(_.className.selected);
      _.text.text($selected.text());
    },
    change: function (i) {
      var _ = this;

      _.select.find('option').prop('selected', false).removeAttr('selected');
      _.select.find('option').eq(i).prop('selected', true).attr('selected', '');
      _.select.trigger('change');
    },
    hover: function (i) {
      var _ = this;

      _.options.removeClass(_.className.hover);
      _.options.eq(i).addClass(_.className.hover);
    },
    update: function () {
      var _ = this;

      _.createItems();
      _.setAttr();
      _.setSelected();
    },
  });
  $.fn.uiSelectBox = function (custom) {
    var defaultOption = {
      customClassName: '',
    };
    var other = [];

    custom = custom || {};

    $.each(arguments, function (i) {
      if (i > 0) {
        other.push(this);
      }
    });

    this.each(function () {
      var options = {};
      var uiSelectBox = this.uiSelectBox;

      if (typeof custom === 'object' && !uiSelectBox) {
        options = $.extend({}, defaultOption, custom);
        this.uiSelectBox = new UiSelectBox(this, options);
      } else if (typeof custom === 'string' && uiSelectBox) {
        switch (custom) {
          case 'update':
            uiSelectBox.update();
            break;
          default:
            break;
        }
      }
    });

    return this;
  };

  // UiAccordion
  var UiAccordion = function (target, option) {
    var _ = this;
    var $wrap = $(target).eq(0);

    _.className = {
      opened: 'js-accordion-opened',
      active: 'js-accordion-active',
      animated: 'js-accordion-animated',
    };
    _.options = option;
    _.wrap = $wrap;
    _.init();
    _.on();
  };
  $.extend(UiAccordion.prototype, {
    init: function () {
      var _ = this;

      _.hashCode = uiGetHashCode();
      _.getElements();

      if (_.layer.length && _.item.length && _.item.filter('[data-initial-open]').length) {
        _.item.each(function () {
          var $this = $(this);
          if ($this.attr('data-initial-open') === 'true') {
            _.open($this, 0);
          }
        });
      }

      _.options.onInit();
    },
    getElements: function () {
      var _ = this;

      if (_.options.opener) {
        if (typeof _.options.opener === 'string') {
          _.opener = _.wrap.find(_.options.opener);
        } else {
          _.opener = _.options.opener;
        }
      }

      if (_.options.layer) {
        if (typeof _.options.layer === 'string') {
          _.layer = _.wrap.find(_.options.layer);
        } else {
          _.layer = _.options.layer;
        }
      }

      if (_.options.item) {
        if (typeof _.options.item === 'string') {
          _.item = _.wrap.find(_.options.item);
        } else {
          _.item = _.options.item;
        }
      }
    },
    on: function () {
      var _ = this;

      if (_.opener.length && _.layer.length) {
        _.opener.on('click.uiAccordion' + _.hashCode, function () {
          _.toggle($(this).closest(_.item));
        });

        $doc
          .on('keydown.uiAccordion' + _.hashCode, function (e) {
            if (e.keyCode === 9 && _.blockTabKey) {
              e.preventDefault();
            }
          })
          .on('focusin.uiAccordion' + _.hashCode, function (e) {
            var $item = ($(e.target).is(_.layer) || $(e.target).closest(_.layer).length) && $(e.target).closest(_.item);

            if (_.options.focusInOpen && $item) {
              _.open($item, 0);
            }
          });
      }
    },
    off: function () {
      var _ = this;

      if (_.opener.length && _.layer.length) {
        _.opener.off('click.uiAccordion' + _.hashCode);
        $doc.off('keydown.uiAccordion' + _.hashCode).off('focusin.uiAccordion' + _.hashCode);
      }
    },
    toggle: function ($item) {
      var _ = this;

      if ($item.hasClass(_.className.opened)) {
        _.close($item);
      } else {
        _.open($item);
      }
    },
    open: function ($item, speed) {
      var _ = this;
      var $layer = null;
      var $opener = null;
      var beforeH = 0;
      var afterH = 0;
      speed = speed instanceof Number ? Number(speed) : typeof speed === 'number' ? speed : _.options.speed;

      if (!$item.hasClass(_.className.opened)) {
        $layer = $item.find(_.layer);
        $layer.stop().css('display', 'block');
        beforeH = $layer.height();
        $layer.css('height', 'auto');
        $opener = $item.find(_.opener);
        $item.addClass(_.className.opened);
        $opener.addClass(_.className.active);
        $layer.addClass(_.className.opened);
        afterH = $layer.height();
        if (beforeH === afterH) {
          speed = 0;
        }
        if (speed > 0) {
          $item.addClass(_.className.animated);
        }
        $layer
          .css('height', beforeH)
          .animate(
            {
              height: afterH,
            },
            speed,
            function () {
              $item.removeClass(_.className.animated);
              $layer
                .css({
                  height: 'auto',
                })
                .trigger('uiAccordionAfterOpened');
            }
          )
          .trigger('uiAccordionOpened', [beforeH, afterH]);

        if (_.options.once) {
          _.item.not($item).each(function () {
            _.close($(this));
          });
        }
      }
    },
    close: function ($item, speed) {
      var _ = this;
      var $layer = null;
      var $opener = null;
      var beforeH = 0;
      var itemBeforeH = 0;
      var afterH = 0;
      speed = speed instanceof Number ? Number(speed) : typeof speed === 'number' ? speed : _.options.speed;

      if ($item.hasClass(_.className.opened)) {
        _.blockTabKey = true;
        $layer = $item.find(_.layer);
        $layer.stop().css('display', 'block');
        beforeH = $layer.height();
        itemBeforeH = $item.height();
        $item.css('height', itemBeforeH);
        $layer.css('height', '');
        $opener = $item.find(_.opener);
        $item.removeClass(_.className.opened);
        $opener.removeClass(_.className.active);
        $layer.removeClass(_.className.opened);
        afterH = $layer.height();
        if (beforeH === afterH) {
          speed = 0;
        }
        if (speed > 0) {
          $item.addClass(_.className.animated);
        }
        $item.css('height', '');
        $layer
          .css('height', beforeH)
          .animate(
            {
              height: afterH,
            },
            speed,
            function () {
              $item.removeClass(_.className.animated);
              $layer
                .css({
                  display: '',
                  height: '',
                })
                .trigger('uiAccordionAfterClosed');
              _.blockTabKey = false;
            }
          )
          .trigger('uiAccordionClosed', [beforeH, afterH]);
      }
    },
    allClose: function () {
      var _ = this;

      _.item.each(function () {
        _.close($(this));
      });
    },
    update: function (newOptions) {
      var _ = this;

      _.off();
      $.extend(_.options, newOptions);
      _.getElements();
      _.on();
    },
  });
  $.fn.uiAccordion = function (custom) {
    var defaultOption = {
      item: null,
      opener: null,
      layer: null,
      once: false,
      speed: 500,
      focusInOpen: true,
      onInit: function () {},
    };
    var other = [];

    custom = custom || {};

    $.each(arguments, function (i) {
      if (i > 0) {
        other.push(this);
      }
    });

    this.each(function () {
      var options = {};
      var uiAccordion = this.uiAccordion;

      if (typeof custom === 'object' && !uiAccordion) {
        options = $.extend({}, defaultOption, custom);
        this.uiAccordion = new UiAccordion(this, options);
      } else if (typeof custom === 'string' && uiAccordion) {
        switch (custom) {
          case 'allClose':
            uiAccordion.allClose();
            break;
          case 'close':
            uiAccordion.close(other[0], other[1]);
            break;
          case 'open':
            uiAccordion.open(other[0], other[1]);
            break;
          case 'update':
            uiAccordion.update(other[0]);
            break;
          default:
            break;
        }
      }
    });

    return this;
  };

  // UiTabPanel
  var UiTabPanel = function (target, option) {
    var _ = this;
    var $wrap = $(target).eq(0);

    _.className = {
      active: 'js-tabpanel-active',
      opened: 'js-tabpanel-opened',
    };
    _.options = option;
    _.wrap = $wrap;
    _.crrTarget = '';
    _.init();
    _.on();
  };
  $.extend(UiTabPanel.prototype, {
    init: function () {
      var _ = this;
      var initialOpen = typeof _.options.initialOpen === 'string' && _.options.initialOpen;

      if (_.options.opener) {
        if (typeof _.options.opener === 'string') {
          _.opener = _.wrap.find(_.options.opener);
        } else {
          _.opener = _.options.opener;
        }
      }

      _.openerItems = _.opener;

      _.openerList = (function () {
        var $list = _.wrap;
        var eachBreak = false;

        if (_.opener && _.opener.length >= 2) {
          _.opener
            .eq(0)
            .parents()
            .each(function () {
              var $this = $(this);
              _.opener
                .eq(1)
                .parents()
                .each(function () {
                  var $secondThis = $(this);
                  var $children = $this.children();

                  if ($this.is($secondThis)) {
                    $list = $this;
                    eachBreak = true;

                    if ($children.filter(_.opener).length <= 0) {
                      _.openerItems = $this.children().filter(function () {
                        if ($(this).find(_.opener).length) {
                          return true;
                        } else {
                          return false;
                        }
                      });
                    }

                    return false;
                  }
                });

              if (eachBreak) {
                return false;
              }
            });
        }

        return $list;
      })();

      if (_.options.item) {
        if (typeof _.options.item === 'string') {
          _.item = _.wrap.find(_.options.item);
        } else {
          _.item = _.options.item;
        }
      }

      if (_.opener.length && _.item.length) {
        _.hashCode = uiGetHashCode();

        if (!initialOpen) {
          initialOpen = _.opener.eq(0).attr('data-tab-open');
        }

        if (_.options.a11y) {
          _.initA11y();
        }

        _.open(initialOpen, false);
      }
    },
    on: function () {
      var _ = this;
      var openerFocus = false;
      var $focusOpener = null;
      var itemClickCheck = false;

      if (_.opener.length && _.item.length) {
        if (!_.openerItems.is(_.opener)) {
          _.openerItems.on('click.uiTabPanel' + _.hashCode, function (e) {
            var $this = $(this);
            var $target = $(e.target);

            if ($target.is($this)) {
              itemClickCheck = true;
              $target.find(_.opener).trigger('click');
            }
          });
        }
        _.opener.on('click.uiTabPanel' + _.hashCode, function (e) {
          var $this = $(this);
          var target = $this.attr('data-tab-open');

          _.open(target);

          if ($this.is('a')) {
            e.preventDefault();
          }

          if (itemClickCheck) {
            e.stopPropagation();
            itemClickCheck = false;
          }
        });
        $doc.on('focusin.uiTabPanel' + _.hashCode, function (e) {
          var $panel = ($(e.target).is(_.item) && $(e.target)) || ($(e.target).closest(_.item).length && $(e.target).closest(_.item));

          if ($panel && !$panel.is(':hidden')) {
            _.open($panel.attr('data-tab'));
          }
        });
        _.openerItems
          .on('focus.uiTabPanel' + _.hashCode, function () {
            openerFocus = true;
            $focusOpener = $(this);
          })
          .on('blur.uiTabPanel' + _.hashCode, function () {
            openerFocus = false;
            $focusOpener = null;
          });
        $doc
          .on('keydown.uiTabPanel' + _.hashCode, function (e) {
            var keyCode = e.keyCode;
            if (_.options.a11y && openerFocus) {
              if ([13, 32, 35, 36, 37, 38, 39, 40].indexOf(keyCode) > -1) {
                e.preventDefault();
              }
            }
          })
          .on('keyup.uiTabPanel' + _.hashCode, function (e) {
            var keyCode = e.keyCode;
            var target = $focusOpener && $focusOpener.attr('data-tab-open');
            if (_.options.a11y && openerFocus) {
              switch (keyCode) {
                case 35:
                  _.goEnd();
                  break;
                case 36:
                  _.goStart();
                  break;
                case 37:
                  _.prev();
                  break;
                case 38:
                  _.prev();
                  break;
                case 39:
                  _.next();
                  break;
                case 40:
                  _.next();
                  break;
                case 13:
                  _.open(target);
                  break;
                case 32:
                  _.open(target);
                  break;
                default:
                  break;
              }
            }
          });
      }
    },
    open: function (target, focus) {
      var _ = this;
      target = String(target);
      focus = focus instanceof Boolean ? (String(focus) === 'false' ? false : null) : focus;
      var $opener = _.opener.filter('[data-tab-open="' + target + '"]');
      var $panel = _.item.filter('[data-tab="' + target + '"]');

      if (!$panel.hasClass(_.className.opened)) {
        if (_.options.a11y) {
          _.setActiveA11y(target, focus);
        }

        _.crrTarget = target;
        _.opener.not($opener).removeClass(_.className.active);
        _.item.not($panel).removeClass(_.className.opened);
        $opener.addClass(_.className.active);
        $panel.addClass(_.className.opened).trigger('uiTabPanelChange', [$opener, $panel, _.opener, _.item]);
      }
    },
    indexOpen: function (i, focus) {
      var _ = this;
      target = Number(i);
      var target = _.opener.eq(i).attr('data-tab-open');

      _.open(target, focus);
    },
    next: function () {
      var _ = this;
      var length = _.opener.length;
      var i = _.opener.index(_.opener.filter('[data-tab-open="' + _.crrTarget + '"]')) + 1;
      if (i >= length) {
        i = 0;
      }
      _.indexOpen(i);
    },
    prev: function () {
      var _ = this;
      var length = _.opener.length;
      var i = _.opener.index(_.opener.filter('[data-tab-open="' + _.crrTarget + '"]')) - 1;
      if (i < 0) {
        i = length - 1;
      }
      _.indexOpen(i);
    },
    goStart: function () {
      var _ = this;
      _.indexOpen(0);
    },
    goEnd: function () {
      var _ = this;
      _.indexOpen(_.opener.length - 1);
    },
    initA11y: function () {
      var _ = this;

      _.opener.each(function (i) {
        var $this = $(this);
        var target = $this.attr('data-tab-open');
        var $item = (function () {
          var $item = $this.closest(_.openerItems);

          if ($item.length) {
            return $item;
          } else {
            return $this;
          }
        })();
        var $replaceWith = $this;

        $item
          .attr('role', 'tab')
          .attr('id', 'tabpanel-opener-' + target + '-' + _.hashCode)
          .attr('aria-controls', 'tabpanel-' + target + '-' + _.hashCode);

        if (!$this.is($item)) {
          $replaceWith = $(
            $this
              .get(0)
              .outerHTML.replace(/^<[a-zA-Z]+/, '<span')
              .replace(/\/[a-zA-Z]+>$/, '/span>')
          );

          $this.replaceWith($replaceWith);

          _.opener[i] = $replaceWith.get(0);
        }
      });

      _.item.each(function () {
        var $this = $(this);
        var target = $this.attr('data-tab');

        $this
          .attr('role', 'tabpanel')
          .attr('id', 'tabpanel-' + target + '-' + _.hashCode)
          .attr('aria-labelledby', 'tabpanel-opener-' + target + '-' + _.hashCode);
      });

      _.openerList.attr('role', 'tablist');
    },
    setActiveA11y: function (target, focus) {
      var _ = this;

      focus = focus === false ? false : true;

      _.opener.each(function () {
        var $this = $(this);
        var crrTarget = $this.attr('data-tab-open');
        var $item = (function () {
          var $item = $this.closest(_.openerItems);

          if ($item.length) {
            return $item;
          } else {
            return $this;
          }
        })();

        if (crrTarget === target) {
          $item.attr('tabindex', '0').attr('aria-selected', 'true');
          if (focus) {
            $item.focus();
          }
        } else {
          $item.attr('tabindex', '-1').attr('aria-selected', 'false');
        }
      });

      _.item.each(function () {
        var $this = $(this);
        var crrTarget = $this.attr('data-tab');

        if (crrTarget === target) {
          $this.removeAttr('hidden');
        } else {
          $this.attr('hidden', '');
        }
      });
    },
    addA11y: function () {
      var _ = this;

      if (!_.options.a11y) {
        _.options.a11y = true;
        _.initA11y();
        _.setActiveA11y(_.crrTarget);
      }
    },
    clearA11y: function () {
      var _ = this;

      if (_.options.a11y) {
        _.options.a11y = false;
        _.opener.removeAttr('role').removeAttr('id').removeAttr('aria-controls').removeAttr('tabindex').removeAttr('aria-selected');

        _.item.removeAttr('role').removeAttr('id').removeAttr('aria-labelledby').removeAttr('hidden');

        _.wrap.removeAttr('role');
      }
    },
  });
  $.fn.uiTabPanel = function (custom) {
    var defaultOption = {
      item: null,
      opener: null,
      initialOpen: null,
      a11y: false,
    };
    var other = [];

    custom = custom || {};

    $.each(arguments, function (i) {
      if (i > 0) {
        other.push(this);
      }
    });

    this.each(function () {
      var options = {};
      var uiTabPanel = this.uiTabPanel;

      if (typeof custom === 'object' && !uiTabPanel) {
        options = $.extend({}, defaultOption, custom);
        this.uiTabPanel = new UiTabPanel(this, options);
      } else if (typeof custom === 'string' && uiTabPanel) {
        switch (custom) {
          case 'addA11y':
            uiTabPanel.addA11y();
            break;
          case 'clearA11y':
            uiTabPanel.clearA11y();
            break;
          case 'open':
            uiTabPanel.open(other[0], other[1]);
            break;
          case 'indexOpen':
            uiTabPanel.indexOpen(other[0], other[1]);
            break;
          case 'next':
            uiTabPanel.next();
            break;
          case 'prev':
            uiTabPanel.prev();
            break;
          case 'goStart':
            uiTabPanel.goStart();
            break;
          case 'goEnd':
            uiTabPanel.goEnd();
            break;
          default:
            break;
        }
      }
    });

    return this;
  };

  // scrollbars width
  var scrollbarsWidth = {
    width: 0,
    set: function () {
      var _ = scrollbarsWidth;
      var $html = $('html');
      var $body = $('body');
      $html.css('overflow', 'hidden');
      var beforeW = $body.width();
      $html.css('overflow', 'scroll');
      var afterW = $body.width();
      $html.css('overflow', '');
      _.width = beforeW - afterW;
    },
  };
  function checkScrollbars() {
    var $html = $('html');
    if (Boolean(scrollbarsWidth.width) && !$html.hasClass('is-scrollbars-width')) {
      $html.addClass('is-scrollbars-width');
    }
  }

  // scrollBlock
  var scrollBlock = {
    scrollTop: 0,
    scrollLeft: 0,
    className: {
      block: 'is-scroll-blocking',
    },
    block: function () {
      var _ = scrollBlock;
      var $html = $('html');
      var $wrap = $('#wrap');

      if (!$html.hasClass(_.className.block)) {
        scrollBlock.scrollTop = $win.scrollTop();
        scrollBlock.scrollLeft = $win.scrollLeft();

        $html.addClass(_.className.block);
        $win.scrollTop(0);
        $wrap.scrollTop(_.scrollTop);
        $win.scrollLeft(0);
        $wrap.scrollLeft(_.scrollLeft);
      }
    },
    clear: function () {
      var _ = scrollBlock;
      var $html = $('html');
      var $wrap = $('#wrap');

      if ($html.hasClass(_.className.block)) {
        $html.removeClass(_.className.block);
        $wrap.scrollTop(0);
        $win.scrollTop(_.scrollTop);
        $wrap.scrollLeft(0);
        $win.scrollLeft(_.scrollLeft);
      }
    },
  };
  window.uiJSScrollBlock = scrollBlock;

  // layer
  var uiLayer = {
    zIndex: 10000,
    open: function (target, opener, speed) {
      var _ = uiLayer;
      var $html = $('html');
      var $layer = $('[data-layer="' + target + '"]');
      var timer = null;
      var hasScrollBlock = true;
      var isFocus = true;
      var isCycleFocus = true;
      var speed = typeof speed === 'number' ? speed : 350;
      var $label = null;
      var hashCode = '';
      var labelID = '';
      var $layers = $('[data-layer]');
      var $preOpenLayers = $layers.filter('.js-layer-opened').not($layer);
      var notOhterElements = 'script, link, style, base, meta, br, [aria-hidden], [inert], .js-not-inert, .js-not-inert *, [data-ui-js], .tempus-dominus-widget, .tempus-dominus-widget *';
      var $ohterElements = $('body')
        .find('*')
        .not('[data-layer], [data-layer] *, ' + notOhterElements);
      var $preLayersElements = $preOpenLayers.find('*').not(notOhterElements);

      $layers.parents().each(function () {
        $ohterElements = $ohterElements.not($(this));
      });

      if ($layer.length && !$layer.hasClass('js-layer-opened')) {
        $label = $layer.find('h1, h2, h3, h4, h5, h6, p').eq(0);
        hashCode = (function () {
          var code = $layer.data('uiJSHashCode');
          if (!(typeof code === 'string')) {
            code = uiGetHashCode();
            $layer.data('uiJSHashCode', code);
          }
          return code;
        })();
        hasScrollBlock = (function () {
          var val = $layer.data('scroll-block');
          return typeof val === 'boolean' ? val : true;
        })();
        isFocus = (function () {
          var val = $layer.data('focus');
          return typeof val === 'boolean' ? val : true;
        })();
        isCycleFocus = (function () {
          var val = $layer.data('cycle-focus');
          return typeof val === 'boolean' ? val : true;
        })();

        _.zIndex++;
        $layer.trigger('layerBeforeOpened').attr('role', 'dialog').attr('aria-hidden', 'true').css('visibility', 'hidden').attr('hidden', '');
        if ($label.length) {
          labelID = (function () {
            var id = $label.attr('id');
            if (!(typeof id === 'string' && id.length)) {
              id = target + '-' + hashCode;
              $label.attr('id', id);
            }
            return id;
          })();
          $layer.attr('aria-labelledby', labelID);
        }
        $html.addClass('js-html-layer-opened js-html-layer-opened-' + target);

        $ohterElements.attr('aria-hidden', 'true').attr('inert', '').attr('data-ui-js', 'hidden');
        $preLayersElements.attr('aria-hidden', 'true').attr('inert', '').attr('data-ui-js', 'hidden');
        $preOpenLayers.attr('aria-hidden', 'true').attr('inert', '').removeAttr('aria-modal');

        if (isCycleFocus && !$layer.children('.js-loop-focus').length) {
          $('<div class="js-loop-focus" tabindex="0"></div>')
            .on('focusin.uiLayer', function () {
              $layer.focus();
            })
            .appendTo($layer);
        }

        $layer
          .stop()
          .removeClass('js-layer-closed')
          .css({
            display: 'block',
            zIndex: _.zIndex,
          })
          .animate(
            {
              opacity: 1,
            },
            speed,
            function () {
              if (isFocus) {
                $layer.focus();
              }
              $layer.removeClass('js-layer-animated').trigger('layerAfterOpened');
            }
          )
          .attr('tabindex', '0')
          .attr('aria-hidden', 'false')
          .attr('aria-modal', 'true')
          .css('visibility', 'visible')
          .removeAttr('hidden')
          .data('layerIndex', $('.js-layer-opened').length);

        if (hasScrollBlock) {
          scrollBlock.block();
        }

        if (Boolean(opener) && $(opener).length) {
          $layer.data('layerOpener', $(opener));
        }

        timer = setTimeout(function () {
          clearTimeout(timer);
          $layer.addClass('js-layer-opened js-layer-animated').trigger('layerOpened');
        }, 0);
      }
    },
    close: function (target, speed) {
      var $html = $('html');
      var $layer = $('[data-layer="' + target + '"]');
      var $opener = $layer.data('layerOpener');
      var $allOpener = $('[data-layer-open="' + target + '"]');
      var isScrollBlock = $html.hasClass(scrollBlock.className.block);
      var timer = null;
      var speed = typeof speed === 'number' ? speed : 350;

      if ($layer.length && $layer.hasClass('js-layer-opened')) {
        if ($allOpener && $allOpener.length) {
          $allOpener.removeClass('js-layer-opener-active');
        }

        $layer
          .trigger('layerBeforeClosed')
          .stop()
          .removeClass('js-layer-opened')
          .addClass('js-layer-closed js-layer-animated')
          .css('display', 'block')
          .data('layerIndex', null)
          .attr('aria-hidden', 'true')
          .removeAttr('aria-modal')
          .animate(
            {
              opacity: 0,
            },
            speed,
            function () {
              var $ohterElements = $('body').find('[data-ui-js="hidden"]');
              var $preOpenLayers = $('[data-layer].js-layer-opened').not($layer);
              var $preOpenLayerHasScrollBlock = $preOpenLayers.not(function () {
                var val = $(this).data('scroll-block');
                return typeof val === 'boolean' ? val : false;
              });
              var preOpenLayersHigherZIndex = (function () {
                var array = [];
                $preOpenLayers.each(function () {
                  var zIndex = $(this).css('z-index');
                  array.push(zIndex);
                });
                array.sort();
                return array[array.length - 1];
              })();
              var $preOpenLayer = $preOpenLayers.filter(function () {
                var zIndex = $(this).css('z-index');

                return zIndex === preOpenLayersHigherZIndex;
              });
              var $preOpenLayerOhterElements = $preOpenLayer.find('[data-ui-js="hidden"]');
              var $openerClosest = null;

              $(this).css('display', 'none').css('visibility', 'hidden').attr('hidden', '').removeClass('js-layer-closed');

              $html.removeClass('js-html-layer-closed-animate js-html-layer-opened-' + target);

              if ($preOpenLayer.length) {
                $preOpenLayerOhterElements.removeAttr('aria-hidden').removeAttr('inert').removeAttr('data-ui-js');
                $preOpenLayer.attr('aria-hidden', 'false').removeAttr('inert').attr('aria-modal', 'true');
              }

              if (!$preOpenLayers.length) {
                $html.removeClass('js-html-layer-opened');
                $ohterElements.removeAttr('aria-hidden').removeAttr('inert').removeAttr('data-ui-js');
              }

              if (!$preOpenLayerHasScrollBlock.length && isScrollBlock) {
                scrollBlock.clear();
              }

              if ($opener && $opener.length) {
                if ($preOpenLayers.length) {
                  $openerClosest = $opener.closest($preOpenLayers);
                  if ($openerClosest.length && $openerClosest.hasClass('js-layer-opened')) {
                    $opener.focus();
                  }
                } else {
                  $opener.focus();
                }
                $layer.data('layerOpener', null);
              } else {
                $html.attr('tabindex', '0').focus().removeAttr('tabindex');
              }

              $layer.removeClass('js-layer-animated').trigger('layerAfterClosed');
            }
          )
          .trigger('layerClosed');

        timer = setTimeout(function () {
          clearTimeout(timer);
          $html.addClass('js-html-layer-closed-animate');
        }, 0);
      }
    },
    checkFocus: function (e) {
      var $layer = $('[data-layer]')
        .not(':hidden')
        .not(function () {
          var val = $(this).data('scroll-block');
          if (typeof val === 'boolean' && !val) {
            return true;
          } else {
            return false;
          }
        });
      var $target = $(e.target);
      var $closest = $target.closest('[data-layer]');
      var lastIndex = (function () {
        var index = 0;
        $layer.each(function () {
          var crrI = $(this).data('layerIndex');
          if (crrI > index) {
            index = crrI;
          }
        });
        return index;
      })();
      var checkLayer = $layer.length && !($target.is($layer) && $target.data('layerIndex') === lastIndex) && !($closest.length && $closest.is($layer) && $closest.data('layerIndex') === lastIndex);

      if (checkLayer) {
        $layer
          .filter(function () {
            return $(this).data('layerIndex') === lastIndex;
          })
          .focus();
      }
    },
  };
  window.uiJSLayer = uiLayer;

  $doc
    .on('focusin.uiLayer', uiLayer.checkFocus)
    .on('click.uiLayer', '[data-role="layerClose"]', function () {
      var $this = $(this);
      var $layer = $this.closest('[data-layer]');
      if ($layer.length) {
        uiLayer.close($layer.attr('data-layer'));
      }
    })
    .on('click.uiLayer', '[data-layer-open]', function (e) {
      var $this = $(this);
      var layer = $this.attr('data-layer-open');
      var $layer = $('[data-layer="' + layer + '"]');
      var isToggle = (function () {
        var val = $this.data('toggle');
        return typeof val === 'boolean' ? val : false;
      })();

      if ($layer.length) {
        if (isToggle && $layer.hasClass('js-layer-opened')) {
          uiLayer.close(layer);
        } else {
          if (isToggle) {
            $this.addClass('js-layer-opener-active');
          }
          uiLayer.open(layer);
          $layer.data('layerOpener', $this);
        }
      }

      e.preventDefault();
    })
    .on('layerAfterOpened.uiLayer', '[data-layer-timer-close]', function () {
      var $this = $(this);
      var layer = $this.attr('data-layer');
      var delay = Number($this.attr('data-layer-timer-close'));
      var timer = setTimeout(function () {
        uiLayer.close(layer);
        clearTimeout(timer);
      }, delay);
      $this.data('layer-timer', timer);
    })
    .on('layerBeforeClosed.uiLayer', '[data-layer-timer-close]', function () {
      var $this = $(this);
      var timer = $this.data('layer-timer');
      clearTimeout(timer);
    });

  // file watch
  var fileWatch = {
    init: function ($root) {
      if (!$root) {
        $root = $doc;
      }
      $root.find('[data-file-watch]').each(function () {
        var $this = $(this);
        var val = $this.val();

        if (typeof val === 'string' && val.length) {
          fileWatch.update($this);
        }
      });
    },
    update: function ($input) {
      var name = $input.attr('data-file-watch');
      var $target = $('[data-file-watch-target="' + name + '"]');
      var val = $input.val();
      var match = null;

      if (typeof val === 'string' && val.length) {
        match = val.match(/[^\/\\]+$/);
        if (!(typeof match === null)) {
          val = match[0];
        }
        $input.addClass('is-inputed');
      } else {
        val = '';
        $input.removeClass('is-inputed');
      }

      $target.text(val);
    },
  };
  $doc.on('change.fileWatch', '[data-file-watch]', function () {
    fileWatch.update($(this));
  });

  // page class
  function pageClass() {
    var $html = $('html');

    function registerClass(pageClassNames, className) {
      var isPage = (function () {
        var result = false;

        for (var i = 0; i <= pageClassNames.length; i++) {
          if ($('.' + pageClassNames[i]).length) {
            result = true;
            break;
          }
        }

        return result;
      })();

      if (isPage) {
        if (!$html.hasClass(className)) {
          $html.addClass(className);
        }
      } else {
        if ($html.hasClass(className)) {
          $html.removeClass(className);
        }
      }
    }

    registerClass(['page-contents--login', 'page-contents--signup', 'page-contents--library-medical-info'], 'auto-page');
  }

  // input disabled class
  function checkDisabledClass($root) {
    if (!$root) {
      $root = $doc;
    }

    var $inputs = $root.find('.ui-input');

    $inputs.each(function () {
      var $this = $(this);
      var $parent = $this.parent('.ui-input-block');
      var disabledClassName = 'is-disabled';
      var isDisabled = $this.is(':disabled');
      var disabledHasClass = $parent.hasClass(disabledClassName);
      var readonlyClassName = 'is-readonly';
      var isReadonly = $this.is('[readonly]');
      var readonlyHasClass = $parent.hasClass(readonlyClassName);

      if (isDisabled && !disabledHasClass) {
        $parent.addClass(disabledClassName);
      } else if (!isDisabled && disabledHasClass) {
        $parent.removeClass(disabledClassName);
      }

      if (isReadonly && !readonlyHasClass) {
        $parent.addClass(readonlyClassName);
      } else if (!isReadonly && readonlyHasClass) {
        $parent.removeClass(readonlyClassName);
      }
    });
  }

  // area disabled
  var areaDisabled = {
    className: {
      disabled: 'is-area-disabled',
    },
    init: function ($root) {
      if (!$root) {
        $root = $doc;
      }
      $root.find('[data-area-disabled]').each(function () {
        var $this = $(this);
        areaDisabled.eventCall($this);
      });
    },
    eventCall: function ($this) {
      var isRadio = $this.attr('type') === 'radio';
      var name = $this.attr('name');

      if (isRadio) {
        $('[name="' + name + '"]')
          .not($this)
          .each(function () {
            areaDisabled.update($(this));
          });
      }

      areaDisabled.update($this);
    },
    update: function ($input) {
      var target = $input.attr('data-area-disabled');
      var $sameInput = $('[data-area-disabled="' + target + '"]').not($input);
      var $target = $('[data-area-disabled-target="' + target + '"]');
      var selector = 'input, select, button, textarea, fieldset, optgroup';
      var isChecked = $input.is(':checked') || $sameInput.filter(':checked').length;

      if ($input.attr('data-area-disabled-type') === 'multi') {
        isChecked = $input.is(':checked') && $sameInput.length === $sameInput.filter(':checked').length;
      }

      $target.each(function () {
        var $this = $(this);
        var isReverse = $this.attr('data-area-disabled-reverse') === 'true';
        var isDisabled = isReverse ? !isChecked : isChecked;

        if (isDisabled) {
          $this.removeClass(areaDisabled.className.disabled);
          if ($this.is(selector)) {
            $this.prop('disabled', false).removeAttr('disabled');
          }
          $this.find(selector).prop('disabled', false).removeAttr('disabled');
        } else {
          $this.addClass(areaDisabled.className.disabled);
          if ($this.is(selector)) {
            $this.prop('disabled', true).attr('disabled', '');
          }
          $this.find(selector).prop('disabled', true).attr('disabled', '');
        }
      });

      checkDisabledClass();
    },
  };
  $doc.on('change.areaDisabled', '[data-area-disabled]', function () {
    var $this = $(this);
    areaDisabled.eventCall($this);
  });

  // checkbox group
  var checkboxGroup = {
    init: function ($root) {
      if (!$root) {
        $root = $doc;
      }
      $($root.find('[data-checkbox-group-child]').get().reverse()).each(function () {
        checkboxGroup.update($(this));
      });
    },
    on: function () {
      $doc.on('change.uiJSCheckboxGroup', '[data-checkbox-group], [data-checkbox-group-child]', function (e, eventBy) {
        checkboxGroup.update($(this), eventBy);
      });
    },
    update: function ($input, eventBy) {
      var parentName = $input.attr('data-checkbox-group');
      var childName = $input.attr('data-checkbox-group-child');

      if (typeof childName === 'string' && childName.length) {
        checkboxGroup.updateChild(childName, eventBy);
      }
      if (typeof parentName === 'string' && parentName.length) {
        checkboxGroup.updateParent(parentName, eventBy);
      }
    },
    updateParent: function (name, eventBy) {
      var $parent = $('[data-checkbox-group=' + name + ']').not('[disabled]');
      var $child = $('[data-checkbox-group-child=' + name + ']').not('[disabled]');
      var checked = $parent.is(':checked');

      if (!(typeof eventBy === 'string' && eventBy === 'checkboxGroupUpdateChild')) {
        $child.each(function () {
          var $thisChild = $(this);
          var beforeChecked = $thisChild.is(':checked');

          if (checked) {
            $thisChild.prop('checked', true).attr('checked', '');
          } else {
            $thisChild.prop('checked', false).removeAttr('checked');
          }

          var afterChecked = $thisChild.is(':checked');

          if (beforeChecked !== afterChecked) {
            $thisChild.trigger('change');
          }
        });
      }
    },
    updateChild: function (name, eventBy) {
      var $parent = $('[data-checkbox-group=' + name + ']').not('[disabled]');
      var $child = $('[data-checkbox-group-child=' + name + ']').not('[disabled]');
      var length = $child.length;
      var checkedLength = $child.filter(':checked').length;

      $parent.each(function () {
        var $thisParent = $(this);
        var beforeChecked = $thisParent.is(':checked');

        if (length === checkedLength) {
          $thisParent.prop('checked', true).attr('checked', '');
        } else {
          $thisParent.prop('checked', false).removeAttr('checked');
        }

        var afterChecked = $thisParent.is(':checked');

        if (beforeChecked !== afterChecked) {
          $thisParent.trigger('change', 'checkboxGroupUpdateChild');
        }
      });
    },
  };
  checkboxGroup.on();

  // auto height textarea
  var autoHeightTextarea = {
    init: function ($root) {
      if (!$root) {
        $root = $doc;
      }
      $root
        .find('.js-auto-height-textarea')
        .each(function () {
          autoHeightTextarea.update($(this));
        })
        .off('scroll.autoHeightTextarea')
        .on('scroll.autoHeightTextarea', function () {
          autoHeightTextarea.scroll($(this));
        });
    },
    update: function ($input) {
      var beforeH = $input.height();
      $input.css({
        marginBottom: beforeH,
        height: 0,
      });
      var height = $input.get(0).scrollHeight;
      $input.css({
        marginBottom: 0,
        height: height,
      });
    },
    scroll: function ($input) {
      var maxH = $input.css('max-height');

      if (maxH === 'none') {
        autoHeightTextarea.update($input);
      }
    },
  };
  $doc.on('focus.autoHeightTextarea blur.autoHeightTextarea keydown.autoHeightTextarea keyup.autoHeightTextarea change.autoHeightTextarea', '.js-auto-height-textarea', function () {
    autoHeightTextarea.update($(this));
  });

  // chat enter
  var isPressShift = false;
  $doc
    .on('keydown.chatEnter', '.chat-form__input.js-auto-height-textarea', function (e) {
      var keyCode = e.keyCode;
      var $this = $(this);
      var $wrap = $this.closest('.chat-form');
      var $submit = $wrap.find('.chat-form__submit');

      if (keyCode === 16) {
        isPressShift = true;
      }

      if (keyCode === 13 && !isPressShift) {
        e.preventDefault();
        $submit.trigger('click');
      }
    })
    .on('keyup.chatEnter', '.chat-form__input.js-auto-height-textarea', function (e) {
      var keyCode = e.keyCode;

      if (keyCode === 16) {
        isPressShift = false;
      }
    });

  // scroll to
  var uiScrollTo = function ($scroller, scrollTo) {
    $scroller.each(function () {
      var simplebar = $(this).data('simplebar');
      var el = null;
      var x = 0;
      var y = 0;

      if (simplebar) {
        el = simplebar.getScrollElement();

        if (typeof scrollTo[0] === 'string' && scrollTo[0] === 'last') {
          x = el.scrollWidth;
        } else if (typeof scrollTo[0] === 'number') {
          x = scrollTo[0];
        } else {
          x = el.scrollLeft;
        }

        if (typeof scrollTo[1] === 'string' && scrollTo[1] === 'last') {
          y = el.scrollHeight;
        } else if (typeof scrollTo[1] === 'number') {
          y = scrollTo[1];
        } else {
          y = el.scrollTop;
        }

        simplebar.recalculate();

        el.scrollLeft = x;
        el.scrollTop = y;
      }
    });
  };
  window.uiJSScrollTo = uiScrollTo;

  // get scroll position
  var getUiScrollPosition = function ($scroller) {
    var simplebar = $scroller.data('simplebar');
    var el = null;
    var x = 0;
    var y = 0;

    if (simplebar) {
      el = simplebar.getScrollElement();

      x = el.scrollLeft;
      y = el.scrollTop;
    }

    return {
      left: x,
      top: y,
    };
  };

  // chat
  var chat = {
    init: function ($root) {
      if (!$root) {
        $root = $doc;
      }
      $root.find('.chat-form__input').each(function () {
        chat.inputedCheck($(this));
      });
    },
    inputedCheck: function ($input) {
      var $wrap = $input.closest('.chat-form');
      var $button = $wrap.find('.chat-form__submit');
      var val = $input.val();

      if (typeof val === 'string' && val.length > 0) {
        $button.prop('disabled', false).removeAttr('disabled', '');
      } else {
        $button.prop('disabled', true).attr('disabled', '');
      }
    },
  };
  $doc.on('focus.inputedCheck blur.inputedCheck keydown.inputedCheck keyup.inputedCheck change.inputedCheck', '.chat-form__input', function () {
    chat.inputedCheck($(this));
  });

  // checkbox tab
  var checkboxTab = {
    init: function ($root) {
      if (!$root) {
        $root = $doc;
      }
      $root.find('[data-checkbox-tab]:not(:checked)').each(function () {
        checkboxTab.update($(this));
      });
      $root.find('[data-checkbox-tab]:checked').each(function () {
        checkboxTab.update($(this));
      });
    },
    update: function ($input) {
      var name = $input.data('checkbox-tab');
      var $panels = $('[data-checkbox-tab-panel]');
      var $panel = $panels.filter(function () {
        var $this = $(this);
        var val = $this.attr('data-checkbox-tab-panel');
        var array = val.replace(/\s/g, '').split(',');

        return array.indexOf(name) >= 0;
      });
      var isChecked = $input.is(':checked');

      if (isChecked) {
        $panel.addClass('is-opened').show();
      } else {
        $panel.removeClass('is-opened').css('display', 'none');
      }

      $panel.trigger('checkboxTabChange');
    },
  };
  $doc.on('change.checkboxTab', '[data-checkbox-tab]', function () {
    var $this = $(this);
    var group = $this.attr('data-checkbox-tab-group');
    var $groupSiblings = $('[data-checkbox-tab-group="' + group + '"]');
    var name = $this.attr('name');
    var $siblings = $('[name="' + name + '"]').not($this);

    if (typeof group === 'string') {
      $groupSiblings.not(':checked').each(function () {
        checkboxTab.update($(this));
      });
      $groupSiblings.filter(':checked').each(function () {
        checkboxTab.update($(this));
      });
    } else {
      if ($this.is('[type="radio"]')) {
        $siblings.each(function () {
          checkboxTab.update($(this));
        });
      }
      checkboxTab.update($this);
    }
  });

  // table
  var table = {
    init: function ($root) {
      if (!$root) {
        $root = $doc;
      }
      $root.find('.ui-table__row-check, .board-table__row-check').each(function () {
        var $this = $(this);

        table.check($this);
        table.radioCheck($this);
      });
    },
    check: function ($input) {
      var $row = $input.closest('tr');

      if ($input.is(':checked')) {
        $row.addClass('is-checked');
      } else {
        $row.removeClass('is-checked');
      }
    },
    radioCheck: function ($input) {
      var type = $input.attr('type');

      if (!(type === 'radio')) return;

      var name = $input.attr('name');
      var $siblings = $('[name="' + name + '"]');

      $siblings.each(function () {
        table.check($(this));
      });
    },
    select: function ($button) {
      var $table = $button.closest('table');
      var $row = $button.closest('tr');
      var $rows = $table.children().children('tr');

      $row.addClass('is-selected');
      $rows.not($row).removeClass('is-selected');
    },
  };
  $doc
    .on('change.uiJSTable', '.ui-table__row-check, .board-table__row-check', function () {
      var $this = $(this);

      table.check($this);
      table.radioCheck($this);
    })
    .on('click.uiJSTable', '.js-table-select', function () {
      table.select($(this));
    });

  // board table
  var boardTable = {
    headScroll: function ($el) {
      var isCallback = $el.data('boardTableCallback');
      var isNative = typeof isCallback === 'boolean' ? !isCallback : true;
      var scrollLeft = 0;
      var $tbody = null;

      if (isNative) {
        $tbody = $el.siblings('.board-table__tbody').find('.board-table__tbody-scroller .simplebar-content-wrapper').eq(0);
        scrollLeft = $el.scrollLeft();

        $tbody.data('boardTableCallback', true).scrollLeft(scrollLeft);
      }

      $el.data('boardTableCallback', false);
    },
    bodyScroll: function ($el) {
      var isCallback = $el.data('boardTableCallback');
      var isNative = typeof isCallback === 'boolean' ? !isCallback : true;
      var $scroller = $el.closest('.ui-scroller');
      var scrollLeft = 0;
      var $thead = null;

      if ($scroller.hasClass('board-table__tbody-scroller') && isNative) {
        scrollLeft = $el.scrollLeft();
        $thead = $scroller.closest('.board-table__tbody').siblings('.board-table__thead');

        $thead.data('boardTableCallback', true).scrollLeft(scrollLeft);
      }

      $el.data('boardTableCallback', false);
    },
  };

  // selet tab
  var selectTab = {
    init: function ($root) {
      if (!$root) {
        $root = $doc;
      }
      $root.find('.js-select-tab').each(function () {
        selectTab.update($(this));
      });
    },
    update: function ($select) {
      var $tapOption = $select.find('[data-select-tab]');

      if (!$tapOption.length) {
        return;
      }

      $tapOption.not(':selected').each(function () {
        var $this = $(this);
        var name = $this.attr('data-select-tab');
        var $panel = $('[data-select-tab-panel="' + name + '"]');

        $panel.css('display', 'none');
      });
      $tapOption.filter(':selected').each(function () {
        var $this = $(this);
        var name = $this.attr('data-select-tab');
        var $panel = $('[data-select-tab-panel="' + name + '"]');

        $panel.css('display', 'block');
      });
    },
  };
  $doc.on('change.selectTab', '.js-select-tab', function () {
    selectTab.update($(this));
  });

  // tab nav
  var tabNav = {
    init: function ($root) {
      if (!$root) {
        $root = $doc;
      }

      $root.find('.ui-tab').each(function () {
        tabNav.scrollToActive($(this));
      });
    },
    scrollToActive: function ($wrap) {
      var $scroller = $wrap.find('.ui-tab__scroller');
      var $list = $wrap.find('.ui-tab__list');
      var $activeItem = $wrap.find('.ui-tab__link.is-active, .ui-tab__link.js-tabpanel-active');
      var listX = $list.length && $list.is('visible') ? $list.offset().left : 0;
      var activeItemX = $activeItem.length && $activeItem.is('visible') ? $activeItem.offset().left : 0;
      var scrollTo = activeItemX - listX - 40;

      uiScrollTo($scroller, [scrollTo, null]);
    },
  };

  // graph slide
  var graphSlide = {
    init: function ($root) {
      if (!$root) {
        $root = $doc;
      }
      $root.find('.graph-slide').each(function () {
        var $wrap = $(this);
        var $list = $wrap.find('.graph-slide__list');
        var swiper = $list.data('swiper');
        var $controller = $wrap.find('.graph-slide__controller');

        if (swiper) {
          swiper.update();
        } else {
          $list.swiperSet({
            appendController: $controller,
            nextControl: true,
            prevControl: true,
            allowTouchMove: false,
            a11yHidden: true,
            on: {
              init: function (swiper) {
                graphSlide.changeTitle($wrap, swiper);
              },
              update: function (swiper) {
                graphSlide.changeTitle($wrap, swiper);
              },
              slideChange: function (swiper) {
                graphSlide.changeTitle($wrap, swiper);
              },
            },
          });
        }
      });
    },
    changeTitle: function ($wrap, swiper) {
      var slides = swiper.slides;

      if (!slides.length) return;

      var $title = $wrap.find('.js-graph-slide-title');
      var $slides = $(slides);
      var activeIndex = swiper.activeIndex;
      var title = $slides.eq(activeIndex).data('title');

      $title.text(title);
    },
  };

  // agree checkbox
  var agreeCheckbox = {
    init: function ($root) {
      if (!$root) {
        $root = $doc;
      }
      $root.find('.ui-agree__block--1depth .ui-checkbox, .ui-agree__block--1depth .ui-radio').each(function () {
        agreeCheckbox.update($(this));
      });
    },
    update: function ($checkbox) {
      var $wrap = $checkbox.closest('.ui-agree__block--1depth');
      if ($checkbox.is(':checked')) {
        $wrap.addClass('is-checked');
      } else {
        $wrap.removeClass('is-checked');
      }
    },
  };
  $doc.on('change.agreeCheckbox', '.ui-agree__block--1depth .ui-checkbox, .ui-agree__block--1depth .ui-radio', function () {
    agreeCheckbox.update($(this));
  });

  // maxlength
  var maxlength = {
    init: function ($root) {
      if (!$root) {
        $root = $doc;
      }
      $root.find('[data-maxlength]').each(function () {
        var $this = $(this);
        maxlength.update($this);
      });
    },
    update: function ($input) {
      var val = $input.val();
      var length = val.length;
      var max = Number($input.data('maxlength'));

      if (length > max) {
        val = val.substring(0, max);
        $input.val(val);
      }
    },
    on: function () {
      $doc.on('keyup.uiJSMaxlength focusin.uiJSMaxlength focusout.uiJSMaxlength', '[data-maxlength]', function () {
        var $this = $(this);
        maxlength.update($this);
      });
    },
  };
  maxlength.on();

  // common js
  function uiJSCommon($root) {
    if (!$root) {
      $root = $doc;
    }

    pageClass();
    checkScrollbars();
    graphSlide.init($root);
    fileWatch.init($root);
    checkboxGroup.init($root);
    checkboxTab.init($root);
    autoHeightTextarea.init($root);
    areaDisabled.init($root);
    checkDisabledClass($root);
    chat.init($root);
    table.init($root);
    selectTab.init($root);
    agreeCheckbox.init($root);
    fileViewInt($root);

    $root.find('.tooltip__block.js-ui-dropdown').each(function () {
      var $this = $(this);
      var align = $this.data('align');

      $this.uiDropDown({
        opener: '.js-ui-dropdown__opener',
        layer: '.js-ui-dropdown__layer',
        align: typeof align === 'string' ? align : 'center',
        defaultVertical: 'top',
      });
    });
    $root.find('.tooltip__block.js-ui-dropdown-hover').each(function () {
      var $this = $(this);
      var align = $this.data('align');

      $this.uiDropDown({
        event: 'hover',
        opener: '.js-ui-dropdown-hover__opener',
        layer: '.js-ui-dropdown-hover__layer',
        align: typeof align === 'string' ? align : 'center',
        defaultVertical: 'top',
      });
    });
    $root.find('.ui-menu.js-ui-dropdown').uiDropDown({
      opener: '.js-ui-dropdown__opener',
      layer: '.js-ui-dropdown__layer',
      align: 'center',
      marginLeft: 20,
      marginRight: 20,
    });
    $root.find('.ui-menu.js-ui-dropdown-hover').uiDropDown({
      event: 'hover',
      opener: '.js-ui-dropdown-hover__opener',
      layer: '.js-ui-dropdown-hover__layer',
      align: 'center',
      marginLeft: 20,
      marginRight: 20,
    });
    $root.find('.js-ui-dropdown:not(.tooltip__block):not(.ui-menu)').uiDropDown({
      opener: '.js-ui-dropdown__opener',
      layer: '.js-ui-dropdown__layer',
    });
    $root.find('.js-ui-dropdown-hover:not(.tooltip__block):not(.ui-menu)').uiDropDown({
      event: 'hover',
      opener: '.js-ui-dropdown-hover__opener',
      layer: '.js-ui-dropdown-hover__layer',
    });

    $root.find('.ui-select').uiSelectBox({
      customClassName: 'ui-select-custom',
    });

    $root.find('.ui-dropdown__contents, .uiselectbox__contents').addClass('ui-scroller');

    $root.find('.ui-scroller').each(function () {
      var $this = $(this);
      var initX = $this.data('init-x');
      var initY = $this.data('init-y');

      $this.simplebar();

      uiScrollTo($this, [initX, initY]);
    });

    $root
      .find('.board-table__tbody-scroller .simplebar-content-wrapper')
      .off('scroll.uiJSCommon')
      .on('scroll.uiJSCommon', function () {
        boardTable.bodyScroll($(this));
      });

    $root
      .find('.board-table__thead')
      .off('scroll.uiJSCommon')
      .on('scroll.uiJSCommon', function () {
        boardTable.headScroll($(this));
      });

    $root.find('.js-ui-accordion').each(function () {
      var $this = $(this);
      var once = $this.attr('data-once') === 'true';
      var focusInOpen = !($this.attr('data-focus-open') === 'false');
      var filter = function () {
        var $thisItem = $(this);
        var $wrap = $thisItem.closest('.js-ui-accordion');

        if ($wrap.is($this)) {
          return true;
        } else {
          return false;
        }
      };
      var $items = $this.find('.js-ui-accordion__item').filter(filter);
      var $openers = $this.find('.js-ui-accordion__opener').filter(filter);
      var $layers = $this.find('.js-ui-accordion__layer').filter(filter);

      if ($this.get(0).uiAccordion) {
        $this.uiAccordion('update', {
          item: $items,
          opener: $openers,
          layer: $layers,
        });
      } else {
        $this.uiAccordion({
          item: $items,
          opener: $openers,
          layer: $layers,
          once: once,
          focusInOpen: focusInOpen,
        });
      }
    });

    $root.find('.js-datepicker').each(function () {
      var $this = $(this);

      $this.datetimepicker({
        localization: {
          format: 'yyyy.MM.dd',
          dayViewHeaderFormat: { month: 'long', year: 'numeric' },
        },
        display: {
          components: {
            decades: false,
            clock: false,
          },
          theme: 'light',
        },
      });

      var picker = $this.data('datetimepicker');

      $this.off('show.td.uiJSDatepicker').on('show.td.uiJSDatepicker', function () {
        $(picker.display.widget).addClass('ui-datetimepicker-widget');
      });
    });

    $root.find('.js-datepicker-range').each(function () {
      var $this = $(this);
      var $min = $this.find('.js-datepicker-range__min');
      var $max = $this.find('.js-datepicker-range__max');

      if ($min.data('datetimepicker')) return;

      $min.datetimepicker({
        localization: {
          format: 'yyyy.MM.dd',
          dayViewHeaderFormat: { month: 'long', year: 'numeric' },
        },
        display: {
          components: {
            decades: false,
            clock: false,
          },
          theme: 'light',
        },
      });
      $max.datetimepicker({
        localization: {
          format: 'yyyy.MM.dd',
          dayViewHeaderFormat: { month: 'long', year: 'numeric' },
        },
        display: {
          components: {
            decades: false,
            clock: false,
          },
          theme: 'light',
        },
      });

      var min = $min.data('datetimepicker');
      var max = $max.data('datetimepicker');

      if (max.dates._dates[0]) {
        min.updateOptions({
          restrictions: {
            maxDate: max.dates._dates[0],
          },
        });
        max.updateOptions({
          viewDate: max.dates._dates[0],
        });
      }
      if (min.dates._dates[0]) {
        min.updateOptions({
          viewDate: min.dates._dates[0],
        });
        max.updateOptions({
          restrictions: {
            minDate: min.dates._dates[0],
          },
        });
      }

      $min
        .off('change.td.uiJSDatepickerRange')
        .on('change.td.uiJSDatepickerRange', function (e) {
          if (e.date) {
            max.updateOptions({
              restrictions: {
                minDate: e.date,
              },
            });
          }
        })
        .off('show.td.uiJSDatepickerRange')
        .on('show.td.uiJSDatepickerRange', function () {
          $(min.display.widget).addClass('ui-datetimepicker-widget');
        });
      $max
        .off('change.td.uiJSDatepickerRange')
        .on('change.td.uiJSDatepickerRange', function (e) {
          if (e.date) {
            min.updateOptions({
              restrictions: {
                maxDate: e.date,
              },
            });
          }
        })
        .off('show.td.uiJSDatepickerRange')
        .on('show.td.uiJSDatepickerRange', function () {
          $(max.display.widget).addClass('ui-datetimepicker-widget');
        });
    });

    $root.find('.js-timepicker').each(function () {
      var $this = $(this);

      $this.datetimepicker({
        localization: {
          format: 'HH:mm',
        },
        display: {
          viewMode: 'clock',
          components: {
            decades: false,
            year: false,
            month: false,
            date: false,
            useTwentyfourHour: true,
          },
          theme: 'light',
        },
      });

      var picker = $this.data('datetimepicker');

      $this.off('show.td.uiJSTimepicker').on('show.td.uiJSTimepicker', function () {
        $(picker.display.widget).addClass('ui-datetimepicker-widget ui-datetimepicker-widget--time-only');
      });
    });

    $root.find('.inline-datepicker').each(function () {
      var $this = $(this);

      $this.datetimepicker({
        localization: {
          format: 'yyyy.MM.dd',
          dayViewHeaderFormat: { month: 'long', year: 'numeric' },
          startOfTheWeek: 1,
        },
        display: {
          inline: true,
          components: {
            year: false,
            month: false,
            clock: false,
          },
          theme: 'light',
        },
      });
    });

    $root.find('.ui-split').each(function () {
      var $this = $(this);
      var $cells = $this.children('.ui-split__cell');
      var cells = (function () {
        var arr = [];
        $cells.each(function () {
          arr.push($(this).get(0));
        });
        return arr;
      })();
      var sizes = (function () {
        var data = $this.attr('data-sizes');
        var arr = [];
        var dataArr = [];

        if (typeof data === 'string') {
          dataArr = data.replace(/\s/, '').split(',');
        }

        if (dataArr.length) {
          $.each(dataArr, function () {
            arr.push(Number(this));
          });
        } else {
          arr = null;
        }

        return arr;
      })();
      var direction = $this.attr('data-direction') === 'horizontal' ? 'horizontal' : 'vertical';

      $this.split({
        cells: cells,
        direction: direction,
        gutterSize: 1,
        minSize: 40,
        snapOffset: 0,
        sizes: sizes,
      });
    });

    $root.find('.js-ui-tab-panel').each(function () {
      var $this = $(this);
      var initial = $this.attr('data-initial');
      var filter = function () {
        var $thisItem = $(this);
        var $wrap = $thisItem.closest('.js-ui-tab-panel');

        if ($wrap.is($this)) {
          return true;
        } else {
          return false;
        }
      };
      var $items = $this.find('[data-tab]').filter(filter);
      var $openers = $this.find('[data-tab-open]').filter(filter);

      $this.uiTabPanel({
        a11y: true,
        item: $items,
        opener: $openers,
        initialOpen: initial,
      });
    });

    tabNav.init($root);
    maxlength.init($root);
  }
  window.uiJSCommon = uiJSCommon;

  // uiJSResize
  function uiJSResize() {
    //
  }
  window.uiJSResize = uiJSResize;

  // area focus
  function areaFocus(area) {
    $doc
      .on('focus.areaFocus', area, function () {
        var $this = $(this);
        var timer = $this.data('areaFocusTimer');

        clearTimeout(timer);
        $this.addClass('is-focus').trigger('areaFocusIn');
      })
      .on('blur.areaFocus', area, function () {
        var $this = $(this);
        var timer = $this.data('areaFocusTimer');

        clearTimeout(timer);
        $this.data(
          'areaFocusTimer',
          setTimeout(function () {
            $this.removeClass('is-focus').trigger('areaFocusOut');
          }, 50)
        );
      });
  }
  areaFocus('.ui-input-block');
  areaFocus('.js-ui-dropdown');
  areaFocus('.ui-dropdown__link');
  areaFocus('.ui-select-custom');
  areaFocus('.header');
  areaFocus('.chat-form');
  areaFocus('.search-bar');
  areaFocus('.search-result__item');
  areaFocus('.ui-table__input-cell');
  areaFocus('.auto-complete');

  // inputed
  function inputedCheck($input, parent) {
    var val = $input.val();
    var $wrap = $input.closest(parent);

    if ($wrap.length) {
      if (typeof val === 'string' && val.length > 0) {
        $wrap.addClass('is-inputed');
      } else {
        $wrap.removeClass('is-inputed');
      }
    }
  }
  $doc.on('focus.inputedCheck blur.inputedCheck keydown.inputedCheck keyup.inputedCheck change.inputedCheck', '.ui-input', function () {
    inputedCheck($(this), '.ui-input-block');
    inputedCheck($(this), '.search-bar');
  });

  // input delete
  $doc
    .on('focus.inputDelete', 'input.ui-input, textarea.ui-input', function () {
      var $this = $(this);
      var $wrap = $this.closest('.ui-input-block');
      var isNoDelete = $wrap.is('.ui-input-block--no-delete, .ui-input-block--date, .ui-input-block--time, .ui-input-block--cell, .ui-input-block--unit');
      var type = $this.attr('type') || '';
      var isText = Boolean(type.match(/text|password|search|email|url|number|tel|date|time/)) || $this.is('textarea');
      var $delete = $wrap.find('.ui-input-delete');
      var isDisabled = $this.is('[readonly]') || $this.is('[disabled]');

      if (isText && !isNoDelete) {
        if (!$delete.length && !isDisabled) {
          $wrap.addClass('is-use-delete').append('<button type="button" class="ui-button ui-input-delete"><span class="for-a11y">입력 내용 지우기</span></button>');
          $delete = $wrap.find('.ui-input-delete');
        }

        if (isDisabled) {
          $delete.prop('disabled', true).attr('disabled', '');
        } else {
          $delete.prop('disabled', false).removeAttr('disabled', '');
        }
      }
    })
    .on('click.inputDelete', '.ui-input-delete', function () {
      var $this = $(this);
      var $input = $this.closest('.ui-input-block').find('.ui-input');

      $input.val('').trigger('focus');
    });

  // dropdown
  $doc
    .on('click.uiJSDropdown', '.js-ui-dropdown__closer', function () {
      var $this = $(this);
      var $wrap = $this.closest('.js-ui-dropdown');

      $wrap.uiDropDown('btnClose');
    })
    .on('click.uiJSDropdown', '[data-dropdown-option]', function (e) {
      var $this = $(this);
      var $wrap = $this.closest('.js-ui-dropdown');
      var $watch = $wrap.find('.js-ui-dropdown__watch');
      var text = $this.attr('data-dropdown-option');

      $watch.text(text);

      e.preventDefault();
    })
    .on('uiDropDownOpened.uiJSDropdown', '.js-ui-dropdown, .uiselectbox__box', function () {
      var $this = $(this);
      var $scroller = $this.find('.ui-scroller');
      var timer = $this.data('uiJSPositionTimer');

      if (!Array.isArray(timer)) {
        timer = [];
      }

      if ($scroller.length) {
        clearTimeout(timer[0]);
        clearTimeout(timer[1]);
        clearTimeout(timer[2]);
        clearTimeout(timer[3]);
        timer[0] = setTimeout(function () {
          clearTimeout(timer[0]);
          $this.uiDropDown('update');
        }, 0);
        timer[1] = setTimeout(function () {
          clearTimeout(timer[1]);
          $this.uiDropDown('update');
        }, 10);
        timer[2] = setTimeout(function () {
          clearTimeout(timer[2]);
          $this.uiDropDown('update');
        }, 50);
        timer[3] = setTimeout(function () {
          clearTimeout(timer[3]);
          $this.uiDropDown('update');
        }, 100);
        $this.data('uiJSPositionTimer', timer);
      }
    })
    .on('click.uiJSDropdown', '.js-ui-dropdown__html-button', function (e) {
      var $this = $(this);
      var $wrap = $this.closest('.js-ui-dropdown');
      var $watch = $wrap.find('.js-ui-dropdown__html-watch');
      var $html = $this.siblings('.js-ui-dropdown__html');
      var html = $html.html();

      $watch.html(html);

      e.preventDefault();
    });

  // layer opened scroll to start
  function layerOpenedScrollToStart($wrap) {
    uiScrollTo($wrap.find('.ui-scroller'), [0, 0]);
  }
  $doc
    .on('layerOpened.layerOpenedScrollToStart', '.layer-wrap', function () {
      var $this = $(this);

      layerOpenedScrollToStart($this);
      tabNav.init($this);
      graphSlide.init($this);
    })
    .on('uiDropDownOpened.layerOpenedScrollToStart', '.js-ui-dropdown', function () {
      layerOpenedScrollToStart($(this));
    });

  // panel tab opened scroll to start
  $doc.on('uiTabPanelChange.panelTabOpenedScrollToStart', '.panel__body-inner[data-tab]', function () {
    var $this = $(this);
    var $scroller = $this.closest('.panel__body-scroller');

    uiScrollTo($scroller, [0, 0]);
  });

  // invalid
  $.fn.invalid = function (isInvalid, message) {
    message = typeof message === 'string' ? message : '';

    this.each(function () {
      var $this = $(this);
      var $el = (function () {
        if ($this.is('.ui-select, .ui-input, .ui-checkbox, .ui-radio')) {
          return $this.closest('.ui-select-block, .ui-input-block, .ui-checkbox-block, .ui-radio-block');
        } else {
          return $this;
        }
      })();
      var $flexBox = $el.closest('.flex-box');
      var isFlex = Boolean($flexBox.length);
      var $target = (function () {
        if (isFlex) {
          return $flexBox;
        } else {
          return $el;
        }
      })();
      var $message = $target.next('.ui-invalid-message');

      if (typeof isInvalid === 'boolean' && isInvalid) {
        if (!$message.length) {
          $message = $('<p class="ui-invalid-message" aria-role="alert" aria-live="assertive"></p>');
          $target.after($message);
        }

        if ($this.attr('tabindex')) {
          $this.focus();
        } else {
          $this.attr('tabindex', '-1').focus().removeAttr('tabindex');
        }

        $message.html(message.replace(/\n/g, '<br />'));

        $el.addClass('is-invalid');
      } else {
        if ($message.length) {
          $message.remove();
        }

        $el.removeClass('is-invalid');
      }
    });

    return $(this);
  };

  // toast alert
  function toastAlert(wrap, message) {
    var $wrap = $(wrap);
    var $inner = (function () {
      var $el = $wrap.find('.ui-toast-alert-inner');
      if (!$el.length) {
        $wrap.append('<div class="ui-toast-alert-inner"></div>');
        $el = $wrap.find('.ui-toast-alert-inner');
      }
      return $el;
    })();
    var $message = $('<p class="ui-toast-alert-text" aria-role="alert" aria-live="assertive">' + message.replace(/\n/g, '<br />') + '</p>');

    $inner.append($message);

    $message.animate({ opacity: 1 }, 500, function () {
      var timer = setTimeout(function () {
        $message.prop('translateY', 0).animate(
          {
            translateY: -100,
            opacity: 0,
          },
          {
            duration: 500,
            step: function (now, fx) {
              if (fx.prop === 'translateY') {
                $message.css('transform', 'translateY(' + now + '%)');
              }
            },
            complete: function () {
              $message.remove();
              clearTimeout(timer);
            },
          }
        );
      }, 3000);
    });
  }
  window.uiJSToastAlert = toastAlert;

  // alert
  function uiAlert(customOption) {
    var defaultOption = {
      title: '',
      message: '',
      buttons: [{}],
    };
    var defaultButtonsOption = {
      text: '확인',
      type: '', // secondary, tertiary, quaternary, quinary
      html: function (options, triggerClassName) {
        var html = '';
        var type = options.type.length ? 'ui-basic-button--' + options.type : '';

        html += '<button type="button" class="ui-button ui-basic-button ui-basic-button--regular ' + type + ' ' + triggerClassName + '">';
        html += '<span class="ui-basic-button__text">' + options.text + '</span>';
        html += '</button>';

        return html;
      },
      callback: function (closeFn) {
        closeFn();
      },
    };
    var options = $.extend({}, defaultOption, customOption);
    var hashCode = uiGetHashCode();
    var html = '';
    var triggerClassName = 'js-ui-alert-button';
    var $buttons = [];
    var $layer = null;
    var layerName = 'ui-alert-' + hashCode;
    var closeFn = function () {
      uiLayer.close(layerName);
    };
    var buttonsCallback = [];
    var $lastFocus = $(':focus');

    $.each(options, function (key, val) {
      if (key === 'buttons') {
        $.each(val, function (i, button) {
          options.buttons[i] = $.extend({}, defaultButtonsOption, button);

          var $el = $(
            '<li class="ui-buttons__item">' +
              options.buttons[i].html(
                {
                  text: options.buttons[i].text,
                  type: options.buttons[i].type,
                },
                triggerClassName
              ) +
              '</li>'
          );

          $el.find('.' + triggerClassName).on('click.uiAlert', function () {
            options.buttons[i].callback(closeFn);
          });

          buttonsCallback[i] = function () {
            options.buttons[i].callback(closeFn);
          };

          $buttons.push($el);
        });
      }
    });

    html += '<div class="layer-wrap layer-alert" data-layer="' + layerName + '">';
    html += '  <div class="layer-container">';
    html += '    <section class="ui-alert">';

    if (options.title.length) {
      html += '      <div class="ui-alert__head">';
      html += '        <h2 class="ui-alert__title">' + options.title + '</h2>';
      html += '      </div>';
    }

    if (options.message.length) {
      html += '      <div class="ui-alert__body">';
      html += '        <div class="ui-alert__body-inner">';
      html += '          <p class="ui-alert__message">' + options.message.replace(/\n/g, '<br />') + '</p>';
      html += '        </div>';
      html += '      </div>';
    }

    html += '      <div class="ui-alert__foot">';
    html += '        <div class="ui-buttons ui-buttons--regular ui-buttons--no-margin">';
    html += '          <ul class="ui-buttons__list"></ul>';
    html += '        </div>';
    html += '      </div>';
    html += '    </section>';
    html += '  </div>';
    html += '</div>';

    $layer = $(html);

    var $buttonList = $layer.find('.ui-alert__foot .ui-buttons__list');

    $.each($buttons, function (i, $el) {
      $buttonList.append($el);
    });

    $layer.on('layerAfterClosed.uiAlert', function () {
      $layer.remove();
    });

    $('body').append($layer);

    uiLayer.open(layerName, $lastFocus);

    return {
      title: options.title,
      message: options.message,
      layerName: layerName,
      $layer: $layer,
      close: closeFn,
      clear: function () {
        uiLayer.close(layerName, 0);
      },
      buttonsCallback: buttonsCallback,
    };
  }
  window.uiJSAlert = uiAlert;

  // header
  $doc
    .on('mouseleave.uiHeader', '.header', function () {
      var $this = $(this);
      $this.removeClass('is-hover');
    })
    .on('mouseenter.uiHeader', '.header', function () {
      var $this = $(this);
      $this.addClass('is-hover');
    })
    .on('focus.uiHeader', '.header__my', function () {
      var $this = $(this);
      $this.scrollLeft(0);
      $this.scrollTop(0);
    });

  // chart open
  $doc.on('click.chartOpen', '.chart-button--all-opener', function () {
    var $this = $(this);
    var $wrap = $this.closest('.panel--chart');
    var $accordion = $wrap.find('.chart-section-group.js-ui-accordion');
    var $accordionItem = $wrap.find('.chart-section.js-ui-accordion__item');

    if ($this.hasClass('is-opened')) {
      $this.removeClass('is-opened');
      $accordion.uiAccordion('allClose');
    } else {
      $this.addClass('is-opened');
      $accordionItem.each(function () {
        $accordion.uiAccordion('open', $(this));
      });
    }
  });

  // auto complete
  $doc
    .on('click.uiJSAutoComplete', '[data-auto-complete-keyword]', function (e) {
      var $this = $(this);
      var $wrap = $this.closest('.auto-complete');
      var $input = $wrap.find('.js-auto-complete-target');
      var text = $this.attr('data-auto-complete-keyword');

      $input.val(text).focus();
      $wrap.removeClass('is-focus');

      e.preventDefault();
    })
    .on('click.uiJSAutoComplete', '.js-auto-complete-close', function (e) {
      var $this = $(this);
      var $wrap = $this.closest('.auto-complete');
      var $parent = $wrap.parent();

      $wrap.removeClass('is-focus');
      if ($parent.attr('tabindex')) {
        $parent.focus();
      } else {
        $parent.attr('tabindex', '-1').focus().removeAttr('tabindex');
      }

      e.preventDefault();
    })
    .on('keydown.uiJSAutoComplete', '.auto-complete', function (e) {
      var keyCode = e.keyCode;
      var $this = $(this);
      var $links = $this.find('.auto-complete__link');
      var $input = $this.find('.ui-input');
      var $focusTarget = null;

      if ($links.length) {
        $focusTarget = (function () {
          var $focus = $links.filter(':focus');
          var focusIndex = 0;
          var $target = null;

          if ($focus.length) {
            focusIndex = $links.index($focus);

            if (keyCode === 38) {
              if (focusIndex > 0) {
                $target = $links.eq(focusIndex - 1);
              } else {
                $target = $input;
              }
            } else if (keyCode === 40) {
              $target = $links.eq(focusIndex + 1);
            }

            if ($target && $target.length) {
              return $target;
            }
          } else {
            if (keyCode === 40) {
              return $links.eq(0);
            }
          }
        })();

        if ($focusTarget && $focusTarget.length) {
          $focusTarget.focus();
        }
      }

      switch (keyCode) {
        case 38:
        case 40:
          e.preventDefault();
          break;
        default:
          break;
      }
    })
    .on('focus.uiJSSearch keydown.uiJSSearch change.uiJSSearch', '.js-auto-complete-target', function (e) {
      var $this = $(this);
      var $wrap = $this.closest('.auto-complete');

      $wrap.addClass('is-focus');
    });

  // search bar
  $doc.on('keydown.uiJSAutoComplete', '.search-bar__form, .search-result__list', function (e) {
    var keyCode = e.keyCode;
    var $this = $(this);
    var $wrap = $this.closest('.search-bar');
    var $items = $wrap.find('.search-result__item');
    var $input = $wrap.find('.search-bar__form .ui-input');
    var $focusTarget = null;

    if ($items.length) {
      $focusTarget = (function () {
        var $focus = $items.filter('.is-focus');
        var focusIndex = 0;
        var $target = null;

        if ($focus.length) {
          focusIndex = $items.index($focus);

          if (keyCode === 38) {
            if (focusIndex > 0) {
              $target = $items.eq(focusIndex - 1);
            } else {
              $target = $input;
            }
          } else if (keyCode === 40) {
            $target = $items.eq(focusIndex + 1);
          }

          if ($target && $target.length) {
            return $target;
          }
        } else {
          if (keyCode === 40) {
            return $items.eq(0);
          }
        }
      })();

      if ($focusTarget && $focusTarget.length) {
        $focusTarget.focus();
      }
    }

    switch (keyCode) {
      case 38:
      case 40:
        e.preventDefault();
        break;
      default:
        break;
    }
  });

  // replace datetime value
  $doc
    .on('keyup.replaceDatetimeValue', '.js-datepicker, .js-datepicker-range__min, .js-datepicker-range__max', function () {
      var $this = $(this);
      var val = $this.val();
      var sum = val.replace(/\D/g, '');
      var length = sum.length;
      var picker = $this.data('datetimepicker');
      var isAction = false;

      if (!picker || length < 6) return;

      if (length === 6 && !sum.match(/^20/)) {
        isAction = true;
        sum = sum.replace(/^(\d{2})(\d{2})(\d{2})/, '20$1.$2.$3');
      } else if (length > 6) {
        isAction = true;
        sum = sum.replace(/^(\d{4})(\d{2})(\d{2}).*/, '$1.$2.$3');
      }

      if (val === sum) {
        isAction = false;
      }

      if (!isAction) return;

      var min = picker.optionsStore.options.restrictions.minDate;
      var max = picker.optionsStore.options.restrictions.maxDate;
      var sumDate = picker.dates.parseInput(sum);

      if (max && max < sumDate) {
        sumDate = max;
      } else if (min && min > sumDate) {
        sumDate = min;
      }

      picker.dates.setValue(sumDate);
    })
    .on('keyup.replaceDatetimeValue', '.js-timepicker', function () {
      var $this = $(this);
      var val = $this.val();
      var sum = val.replace(/\D/g, '');
      var length = sum.length;
      var picker = $this.data('datetimepicker');
      var isAction = false;

      if (!picker || length < 4) return;

      if (length >= 4) {
        isAction = true;
        sum = sum.replace(/^(\d{2})(\d{2}).*/, '$1:$2');
      }

      if (val === sum) {
        isAction = false;
      }

      if (!isAction) return;

      var sumTime = picker.dates.parseInput(sum);

      picker.dates.setValue(sumTime);
    });

  // replace phone value
  $doc.on('keyup.replacePhoneValue', '.js-phone-input', function () {
    var $this = $(this);
    var val = $this.val();
    var sum = val.replace(/\D/g, '');

    if (val.match(/^\+/)) {
      sum = '+' + sum;
    }

    $this.val(sum);
  });

  // zooming
  var zooming = {
    in: function (name) {
      var $target = $('[data-zooming-target="' + name + '"]');
      var isIn = $target.hasClass('is-zoom-in');

      if (isIn) return;

      var $originSite = $('<div></div>');
      var $root = (function () {
        var $el = $target.closest('.ui-layer');

        if (!$el.length) {
          $el = $('body');
        }

        return $el;
      })();
      var height = $target.outerHeight(true);

      $originSite.height(height);
      $target.before($originSite).data('originSite', $originSite);

      if ($root.is('body')) {
        $root.prepend($target);
      } else {
        $root.after($target);
      }

      $target.addClass('is-zoom-in');
    },
    out: function (name) {
      var $target = $('[data-zooming-target="' + name + '"]');
      var isIn = $target.hasClass('is-zoom-in');

      if (!isIn) return;

      var $originSite = $target.data('originSite');

      $originSite.replaceWith($target);

      $target.removeClass('is-zoom-in').data('originSite', null);
    },
  };
  $doc
    .on('click.uiJSZooming', '[data-zooming-in]', function () {
      var $this = $(this);
      var name = $this.attr('data-zooming-in');

      if (typeof name === 'string') {
        zooming.in(name);
      }
    })
    .on('click.uiJSZooming', '[data-zooming-out]', function () {
      var $this = $(this);
      var name = $this.attr('data-zooming-out');

      if (typeof name === 'string') {
        zooming.out(name);
      }
    });

  // dom ready
  $(function () {
    var $html = $('html');
    var $body = $('body');

    scrollbarsWidth.set();

    // css set
    if (scrollbarsWidth.width > 0) {
      $body.prepend(
        '<style type="text/css">' +
          '.is-scroll-blocking.is-scrollbars-width #wrap {' +
          'margin-right: ' +
          scrollbarsWidth.width +
          'px;' +
          '}\n' +
          /*
          '.is-scroll-blocking.is-scrollbars-width .fix-top-wrap {' +
          'right: ' +
          scrollbarsWidth.width +
          'px;' +
          '}\n' +
          '.is-scroll-blocking.is-scrollbars-width .fix-bottom-wrap {' +
          'right: ' +
          scrollbarsWidth.width +
          'px;' +
          '}\n' +
          */
          '.zooming-contents.is-zoom-in .zooming-contents__frame::after {' +
          'padding-bottom: ' +
          (20 - scrollbarsWidth.width) +
          'px;' +
          '}' +
          '</style>'
      );
    }

    // init
    uiJSCommon();

    // resize
    uiJSResize();
  });

  // win load, scroll, resize
  $win
    .on('load.uiJS', function () {
      uiJSResize();
    })
    .on('scroll.uiJS', function () {
      //
    })
    .on('resize.uiJS', function () {
      uiJSResize();
    })
    .on('orientationchange.uiJS', function () {
      uiJSResize();
    });
})(jQuery);
