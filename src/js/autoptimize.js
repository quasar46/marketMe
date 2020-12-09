;
/*! Swipebox v1.3.0.2 | Constantin Saguin csag.co | MIT License | github.com/brutaldesign/swipebox */
(function (window, document, $, undefined) {
  $.swipebox = function (elem, options) {
    var ui, defaults = { useCSS: true, useSVG: true, initialIndexOnArray: 0, removeBarsOnMobile: true, hideCloseButtonOnMobile: false, hideBarsDelay: 0, videoMaxWidth: 1140, vimeoColor: 'cccccc', beforeOpen: null, afterOpen: null, afterClose: null, loopAtEnd: false, autoplayVideos: false, queryStringData: {}, toggleClassOnLoad: '' }, plugin = this, elements = [], $elem, selector = elem.selector, $selector = $(selector), isMobile = navigator.userAgent.match(/(iPad)|(iPhone)|(iPod)|(Android)|(PlayBook)|(BB10)|(BlackBerry)|(Opera Mini)|(IEMobile)|(webOS)|(MeeGo)/i), isTouch = isMobile !== null || document.createTouch !== undefined || ('ontouchstart' in window) || ('onmsgesturechange' in window) || navigator.msMaxTouchPoints, supportSVG = !!document.createElementNS && !!document.createElementNS('http://www.w3.org/2000/svg', 'svg').createSVGRect, winWidth = window.innerWidth ? window.innerWidth : $(window).width(), winHeight = window.innerHeight ? window.innerHeight : $(window).height(), currentX = 0, html = '<div id="swipebox-overlay">\
     <div id="swipebox-container">\
      <div id="swipebox-slider"></div>\
      <div id="swipebox-top-bar">\
       <div id="swipebox-title"></div>\
      </div>\
      <div id="swipebox-bottom-bar">\
       <div id="swipebox-arrows">\
        <a id="swipebox-prev"></a>\
        <a id="swipebox-next"></a>\
       </div>\
      </div>\
      <a id="swipebox-close"></a>\
     </div>\
   </div>'; plugin.settings = {}; $.swipebox.close = function () { ui.closeSlide(); }; $.swipebox.extend = function () { return ui; }; plugin.init = function () {
      plugin.settings = $.extend({}, defaults, options); if ($.isArray(elem)) { elements = elem; ui.target = $(window); ui.init(plugin.settings.initialIndexOnArray); } else {
        $(document).on('click', selector, function (event) {
          if (event.target.parentNode.className === 'slide current') { return false; }
          if (!$.isArray(elem)) { ui.destroy(); $elem = $(selector); ui.actions(); }
          elements = []; var index, relType, relVal; if (!relVal) { relType = 'data-rel'; relVal = $(this).attr(relType); }
          if (!relVal) { relType = 'rel'; relVal = $(this).attr(relType); }
          if (relVal && relVal !== '' && relVal !== 'nofollow') { $elem = $selector.filter('[' + relType + '="' + relVal + '"]'); } else { $elem = $(selector); }
          $elem.each(function () {
            var title = null, href = null; if ($(this).attr('title')) { title = $(this).attr('title'); }
            if ($(this).attr('href')) { href = $(this).attr('href'); }
            elements.push({ href: href, title: title });
          }); index = $elem.index($(this)); event.preventDefault(); event.stopPropagation(); ui.target = $(event.target); ui.init(index);
        });
      }
    }; ui = {
      init: function (index) {
        if (plugin.settings.beforeOpen) { plugin.settings.beforeOpen(); }
        this.target.trigger('swipebox-start'); $.swipebox.isOpen = true; this.build(); this.openSlide(index); this.openMedia(index); this.preloadMedia(index + 1); this.preloadMedia(index - 1); if (plugin.settings.afterOpen) { plugin.settings.afterOpen(); }
      }, build: function () {
        var $this = this, bg; $('body').append(html); if (supportSVG && plugin.settings.useSVG === true) { bg = $('#swipebox-close').css('background-image'); bg = bg.replace('png', 'svg'); $('#swipebox-prev, #swipebox-next, #swipebox-close').css({ 'background-image': bg }); }
        if (isMobile && plugin.settings.removeBarsOnMobile) { $('#swipebox-bottom-bar, #swipebox-top-bar').remove(); }
        $.each(elements, function () { $('#swipebox-slider').append('<div class="slide"></div>'); }); $this.setDim(); $this.actions(); if (isTouch) { $this.gesture(); }
        $this.keyboard(); $this.animBars(); $this.resize();
      }, setDim: function () {
        var width, height, sliderCss = {}; if ('onorientationchange' in window) { window.addEventListener('orientationchange', function () { if (window.orientation === 0) { width = winWidth; height = winHeight; } else if (window.orientation === 90 || window.orientation === -90) { width = winHeight; height = winWidth; } }, false); } else { width = window.innerWidth ? window.innerWidth : $(window).width(); height = window.innerHeight ? window.innerHeight : $(window).height(); }
        sliderCss = { width: width, height: height }; $('#swipebox-overlay').css(sliderCss);
      }, resize: function () { var $this = this; $(window).resize(function () { $this.setDim(); }).resize(); }, supportTransition: function () {
        var prefixes = 'transition WebkitTransition MozTransition OTransition msTransition KhtmlTransition'.split(' '), i; for (i = 0; i < prefixes.length; i++) { if (document.createElement('div').style[prefixes[i]] !== undefined) { return prefixes[i]; } }
        return false;
      }, doCssTrans: function () { if (plugin.settings.useCSS && this.supportTransition()) { return true; } }, gesture: function () {
        var $this = this, index, hDistance, vDistance, hDistanceLast, vDistanceLast, hDistancePercent, vSwipe = false, hSwipe = false, hSwipMinDistance = 10, vSwipMinDistance = 50, startCoords = {}, endCoords = {}, bars = $('#swipebox-top-bar, #swipebox-bottom-bar'), slider = $('#swipebox-slider'); bars.addClass('visible-bars'); $this.setTimeout(); $('body').bind('touchstart', function (event) {
          $(this).addClass('touching'); index = $('#swipebox-slider .slide').index($('#swipebox-slider .slide.current')); endCoords = event.originalEvent.targetTouches[0]; startCoords.pageX = event.originalEvent.targetTouches[0].pageX; startCoords.pageY = event.originalEvent.targetTouches[0].pageY; $('#swipebox-slider').css({ '-webkit-transform': 'translate3d(' + currentX + '%, 0, 0)', 'transform': 'translate3d(' + currentX + '%, 0, 0)' }); $('.touching').bind('touchmove', function (event) {
            event.preventDefault(); event.stopPropagation(); endCoords = event.originalEvent.targetTouches[0]; if (!hSwipe) { vDistanceLast = vDistance; vDistance = endCoords.pageY - startCoords.pageY; if (Math.abs(vDistance) >= vSwipMinDistance || vSwipe) { var opacity = 0.75 - Math.abs(vDistance) / slider.height(); slider.css({ 'top': vDistance + 'px' }); slider.css({ 'opacity': opacity }); vSwipe = true; } }
            hDistanceLast = hDistance; hDistance = endCoords.pageX - startCoords.pageX; hDistancePercent = hDistance * 100 / winWidth; if (!hSwipe && !vSwipe && Math.abs(hDistance) >= hSwipMinDistance) { $('#swipebox-slider').css({ '-webkit-transition': '', 'transition': '' }); hSwipe = true; }
            if (hSwipe) { if (0 < hDistance) { if (0 === index) { $('#swipebox-overlay').addClass('leftSpringTouch'); } else { $('#swipebox-overlay').removeClass('leftSpringTouch').removeClass('rightSpringTouch'); $('#swipebox-slider').css({ '-webkit-transform': 'translate3d(' + (currentX + hDistancePercent) + '%, 0, 0)', 'transform': 'translate3d(' + (currentX + hDistancePercent) + '%, 0, 0)' }); } } else if (0 > hDistance) { if (elements.length === index + 1) { $('#swipebox-overlay').addClass('rightSpringTouch'); } else { $('#swipebox-overlay').removeClass('leftSpringTouch').removeClass('rightSpringTouch'); $('#swipebox-slider').css({ '-webkit-transform': 'translate3d(' + (currentX + hDistancePercent) + '%, 0, 0)', 'transform': 'translate3d(' + (currentX + hDistancePercent) + '%, 0, 0)' }); } } }
          }); return false;
        }).bind('touchend', function (event) {
          event.preventDefault(); event.stopPropagation(); $('#swipebox-slider').css({ '-webkit-transition': '-webkit-transform 0.4s ease', 'transition': 'transform 0.4s ease' }); vDistance = endCoords.pageY - startCoords.pageY; hDistance = endCoords.pageX - startCoords.pageX; hDistancePercent = hDistance * 100 / winWidth; if (vSwipe) { vSwipe = false; if (Math.abs(vDistance) >= 2 * vSwipMinDistance && Math.abs(vDistance) > Math.abs(vDistanceLast)) { var vOffset = vDistance > 0 ? slider.height() : -slider.height(); slider.animate({ top: vOffset + 'px', 'opacity': 0 }, 300, function () { $this.closeSlide(); }); } else { slider.animate({ top: 0, 'opacity': 1 }, 300); } } else if (hSwipe) { hSwipe = false; if (hDistance >= hSwipMinDistance && hDistance >= hDistanceLast) { $this.getPrev(); } else if (hDistance <= -hSwipMinDistance && hDistance <= hDistanceLast) { $this.getNext(); } } else { if (!bars.hasClass('visible-bars')) { $this.showBars(); $this.setTimeout(); } else { $this.clearTimeout(); $this.hideBars(); } }
          $('#swipebox-slider').css({ '-webkit-transform': 'translate3d(' + currentX + '%, 0, 0)', 'transform': 'translate3d(' + currentX + '%, 0, 0)' }); $('#swipebox-overlay').removeClass('leftSpringTouch').removeClass('rightSpringTouch'); $('.touching').off('touchmove').removeClass('touching');
        });
      }, setTimeout: function () { if (plugin.settings.hideBarsDelay > 0) { var $this = this; $this.clearTimeout(); $this.timeout = window.setTimeout(function () { $this.hideBars(); }, plugin.settings.hideBarsDelay); } }, clearTimeout: function () { window.clearTimeout(this.timeout); this.timeout = null; }, showBars: function () { var bars = $('#swipebox-top-bar, #swipebox-bottom-bar'); if (this.doCssTrans()) { bars.addClass('visible-bars'); } else { $('#swipebox-top-bar').animate({ top: 0 }, 500); $('#swipebox-bottom-bar').animate({ bottom: 0 }, 500); setTimeout(function () { bars.addClass('visible-bars'); }, 1000); } }, hideBars: function () { var bars = $('#swipebox-top-bar, #swipebox-bottom-bar'); if (this.doCssTrans()) { bars.removeClass('visible-bars'); } else { $('#swipebox-top-bar').animate({ top: '-50px' }, 500); $('#swipebox-bottom-bar').animate({ bottom: '-50px' }, 500); setTimeout(function () { bars.removeClass('visible-bars'); }, 1000); } }, animBars: function () { var $this = this, bars = $('#swipebox-top-bar, #swipebox-bottom-bar'); bars.addClass('visible-bars'); $this.setTimeout(); $('#swipebox-slider').click(function () { if (!bars.hasClass('visible-bars')) { $this.showBars(); $this.setTimeout(); } }); $('#swipebox-bottom-bar').hover(function () { $this.showBars(); bars.addClass('visible-bars'); $this.clearTimeout(); }, function () { if (plugin.settings.hideBarsDelay > 0) { bars.removeClass('visible-bars'); $this.setTimeout(); } }); }, keyboard: function () { var $this = this; $(window).bind('keyup', function (event) { event.preventDefault(); event.stopPropagation(); if (event.keyCode === 37) { $this.getPrev(); } else if (event.keyCode === 39) { $this.getNext(); } else if (event.keyCode === 27) { $this.closeSlide(); } }); }, actions: function () {
        var $this = this, action = 'touchend click'; if (elements.length < 2) { $('#swipebox-bottom-bar').hide(); if (undefined === elements[1]) { $('#swipebox-top-bar').hide(); } } else { $('#swipebox-prev').bind(action, function (event) { event.preventDefault(); event.stopPropagation(); $this.getPrev(); $this.setTimeout(); }); $('#swipebox-next').bind(action, function (event) { event.preventDefault(); event.stopPropagation(); $this.getNext(); $this.setTimeout(); }); }
        $('#swipebox-close').bind(action, function () { $this.closeSlide(); });
      }, setSlide: function (index, isFirst) {
        isFirst = isFirst || false; var slider = $('#swipebox-slider'); currentX = -index * 100; if (this.doCssTrans()) { slider.css({ '-webkit-transform': 'translate3d(' + (-index * 100) + '%, 0, 0)', 'transform': 'translate3d(' + (-index * 100) + '%, 0, 0)' }); } else { slider.animate({ left: (-index * 100) + '%' }); }
        $('#swipebox-slider .slide').removeClass('current'); $('#swipebox-slider .slide').eq(index).addClass('current'); this.setTitle(index); if (isFirst) { slider.fadeIn(); }
        $('#swipebox-prev, #swipebox-next').removeClass('disabled'); if (index === 0) { $('#swipebox-prev').addClass('disabled'); } else if (index === elements.length - 1 && plugin.settings.loopAtEnd !== true) { $('#swipebox-next').addClass('disabled'); }
      }, openSlide: function (index) {
        $('html').addClass('swipebox-html'); if (isTouch) { $('html').addClass('swipebox-touch'); if (plugin.settings.hideCloseButtonOnMobile) { $('html').addClass('swipebox-no-close-button'); } } else { $('html').addClass('swipebox-no-touch'); }
        $(window).trigger('resize'); this.setSlide(index, true);
      }, preloadMedia: function (index) {
        var $this = this, src = null; if (elements[index] !== undefined) { src = elements[index].href; }
        if (!$this.isVideo(src)) { setTimeout(function () { $this.openMedia(index); }, 1000); } else { $this.openMedia(index); }
      }, openMedia: function (index) {
        var $this = this, src, slide; if (elements[index] !== undefined) { src = elements[index].href; }
        if (index < 0 || index >= elements.length) { return false; }
        slide = $('#swipebox-slider .slide').eq(index); if (!$this.isVideo(src)) { slide.addClass('slide-loading'); $this.loadMedia(src, function () { slide.removeClass('slide-loading'); slide.html(this); }); } else { slide.html($this.getVideo(src)); }
      }, setTitle: function (index) {
        var title = null; $('#swipebox-title').empty(); if (elements[index] !== undefined) { title = elements[index].title; }
        if (title) { $('#swipebox-top-bar').show(); $('#swipebox-title').append(title); } else { $('#swipebox-top-bar').hide(); }
      }, isVideo: function (src) {
        if (src) {
          if (src.match(/(youtube\.com|youtube-nocookie\.com)\/watch\?v=([a-zA-Z0-9\-_]+)/) || src.match(/vimeo\.com\/([0-9]*)/) || src.match(/youtu\.be\/([a-zA-Z0-9\-_]+)/)) { return true; }
          if (src.toLowerCase().indexOf('swipeboxvideo=1') >= 0) { return true; }
        }
      }, parseUri: function (uri, customData) {
        var a = document.createElement('a'), qs = {}; a.href = decodeURIComponent(uri); qs = JSON.parse('{"' + a.search.toLowerCase().replace('?', '').replace(/&/g, '","').replace(/=/g, '":"') + '"}'); if ($.isPlainObject(customData)) { qs = $.extend(qs, customData, plugin.settings.queryStringData); }
        return $.map(qs, function (val, key) { if (val && val > '') { return encodeURIComponent(key) + '=' + encodeURIComponent(val); } }).join('&');
      }, getVideo: function (url) {
        var iframe = '', youtubeUrl = url.match(/((?:www\.)?youtube\.com|(?:www\.)?youtube-nocookie\.com)\/watch\?v=([a-zA-Z0-9\-_]+)/), youtubeShortUrl = url.match(/(?:www\.)?youtu\.be\/([a-zA-Z0-9\-_]+)/), vimeoUrl = url.match(/(?:www\.)?vimeo\.com\/([0-9]*)/), qs = ''; if (youtubeUrl || youtubeShortUrl) {
          if (youtubeShortUrl) { youtubeUrl = youtubeShortUrl; }
          qs = ui.parseUri(url, { 'autoplay': (plugin.settings.autoplayVideos ? '1' : '0'), 'v': '' }); iframe = '<iframe width="560" height="315" src="//' + youtubeUrl[1] + '/embed/' + youtubeUrl[2] + '?' + qs + '" frameborder="0" allowfullscreen></iframe>';
        } else if (vimeoUrl) { qs = ui.parseUri(url, { 'autoplay': (plugin.settings.autoplayVideos ? '1' : '0'), 'byline': '0', 'portrait': '0', 'color': plugin.settings.vimeoColor }); iframe = '<iframe width="560" height="315"  src="//player.vimeo.com/video/' + vimeoUrl[1] + '?' + qs + '" frameborder="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>'; } else { iframe = '<iframe width="560" height="315" src="' + url + '" frameborder="0" allowfullscreen></iframe>'; }
        return '<div class="swipebox-video-container" style="max-width:' + plugin.settings.videoMaxWidth + 'px"><div class="swipebox-video">' + iframe + '</div></div>';
      }, loadMedia: function (src, callback) {
        if (src.trim().indexOf('#') === 0) { callback.call($('<div>', { 'class': 'swipebox-inline-container' }).append($(src).clone().toggleClass(plugin.settings.toggleClassOnLoad))); }
        else { if (!this.isVideo(src)) { var img = $('<img>').on('load', function () { callback.call(img); }); img.attr('src', src); } }
      }, getNext: function () { var $this = this, src, index = $('#swipebox-slider .slide').index($('#swipebox-slider .slide.current')); if (index + 1 < elements.length) { src = $('#swipebox-slider .slide').eq(index).contents().find('iframe').attr('src'); $('#swipebox-slider .slide').eq(index).contents().find('iframe').attr('src', src); index++; $this.setSlide(index); $this.preloadMedia(index + 1); } else { if (plugin.settings.loopAtEnd === true) { src = $('#swipebox-slider .slide').eq(index).contents().find('iframe').attr('src'); $('#swipebox-slider .slide').eq(index).contents().find('iframe').attr('src', src); index = 0; $this.preloadMedia(index); $this.setSlide(index); $this.preloadMedia(index + 1); } else { $('#swipebox-overlay').addClass('rightSpring'); setTimeout(function () { $('#swipebox-overlay').removeClass('rightSpring'); }, 500); } } }, getPrev: function () { var index = $('#swipebox-slider .slide').index($('#swipebox-slider .slide.current')), src; if (index > 0) { src = $('#swipebox-slider .slide').eq(index).contents().find('iframe').attr('src'); $('#swipebox-slider .slide').eq(index).contents().find('iframe').attr('src', src); index--; this.setSlide(index); this.preloadMedia(index - 1); } else { $('#swipebox-overlay').addClass('leftSpring'); setTimeout(function () { $('#swipebox-overlay').removeClass('leftSpring'); }, 500); } }, closeSlide: function () { $('html').removeClass('swipebox-html'); $('html').removeClass('swipebox-touch'); $(window).trigger('resize'); this.destroy(); }, destroy: function () {
        $(window).unbind('keyup'); $('body').unbind('touchstart'); $('body').unbind('touchmove'); $('body').unbind('touchend'); $('#swipebox-slider').unbind(); $('#swipebox-overlay').remove(); if (!$.isArray(elem)) { elem.removeData('_swipebox'); }
        if (this.target) { this.target.trigger('swipebox-destroy'); }
        $.swipebox.isOpen = false; if (plugin.settings.afterClose) { plugin.settings.afterClose(); }
      }
    }; plugin.init();
  }; $.fn.swipebox = function (options) {
    if (!$.data(this, '_swipebox')) { var swipebox = new $.swipebox(this, options); this.data('_swipebox', swipebox); }
    return this.data('_swipebox');
  };
}(window, document, jQuery));

var $jscomp = $jscomp || {}; $jscomp.scope = {}; $jscomp.findInternal = function (a, n, f) { a instanceof String && (a = String(a)); for (var p = a.length, k = 0; k < p; k++) { var b = a[k]; if (n.call(f, b, k, a)) return { i: k, v: b } } return { i: -1, v: void 0 } }; $jscomp.ASSUME_ES5 = !1; $jscomp.ASSUME_NO_NATIVE_MAP = !1; $jscomp.ASSUME_NO_NATIVE_SET = !1; $jscomp.SIMPLE_FROUND_POLYFILL = !1;
$jscomp.defineProperty = $jscomp.ASSUME_ES5 || "function" == typeof Object.defineProperties ? Object.defineProperty : function (a, n, f) { a != Array.prototype && a != Object.prototype && (a[n] = f.value) }; $jscomp.getGlobal = function (a) { return "undefined" != typeof window && window === a ? a : "undefined" != typeof global && null != global ? global : a }; $jscomp.global = $jscomp.getGlobal(this);
$jscomp.polyfill = function (a, n, f, p) { if (n) { f = $jscomp.global; a = a.split("."); for (p = 0; p < a.length - 1; p++) { var k = a[p]; k in f || (f[k] = {}); f = f[k] } a = a[a.length - 1]; p = f[a]; n = n(p); n != p && null != n && $jscomp.defineProperty(f, a, { configurable: !0, writable: !0, value: n }) } }; $jscomp.polyfill("Array.prototype.find", function (a) { return a ? a : function (a, f) { return $jscomp.findInternal(this, a, f).v } }, "es6", "es3");
(function (a, n, f) { "function" === typeof define && define.amd ? define(["jquery"], a) : "object" === typeof exports && "undefined" === typeof Meteor ? module.exports = a(require("jquery")) : a(n || f) })(function (a) {
  var n = function (b, d, e) {
    var c = {
      invalid: [], getCaret: function () { try { var a = 0, r = b.get(0), h = document.selection, d = r.selectionStart; if (h && -1 === navigator.appVersion.indexOf("MSIE 10")) { var e = h.createRange(); e.moveStart("character", -c.val().length); a = e.text.length } else if (d || "0" === d) a = d; return a } catch (C) { } }, setCaret: function (a) {
        try {
          if (b.is(":focus")) {
            var c =
              b.get(0); if (c.setSelectionRange) c.setSelectionRange(a, a); else { var g = c.createTextRange(); g.collapse(!0); g.moveEnd("character", a); g.moveStart("character", a); g.select() }
          }
        } catch (B) { }
      }, events: function () {
        b.on("keydown.mask", function (a) { b.data("mask-keycode", a.keyCode || a.which); b.data("mask-previus-value", b.val()); b.data("mask-previus-caret-pos", c.getCaret()); c.maskDigitPosMapOld = c.maskDigitPosMap }).on(a.jMaskGlobals.useInput ? "input.mask" : "keyup.mask", c.behaviour).on("paste.mask drop.mask", function () {
          setTimeout(function () { b.keydown().keyup() },
            100)
        }).on("change.mask", function () { b.data("changed", !0) }).on("blur.mask", function () { f === c.val() || b.data("changed") || b.trigger("change"); b.data("changed", !1) }).on("blur.mask", function () { f = c.val() }).on("focus.mask", function (b) { !0 === e.selectOnFocus && a(b.target).select() }).on("focusout.mask", function () { e.clearIfNotMatch && !k.test(c.val()) && c.val("") })
      }, getRegexMask: function () {
        for (var a = [], b, c, e, t, f = 0; f < d.length; f++)(b = l.translation[d.charAt(f)]) ? (c = b.pattern.toString().replace(/.{1}$|^.{1}/g, ""), e = b.optional,
          (b = b.recursive) ? (a.push(d.charAt(f)), t = { digit: d.charAt(f), pattern: c }) : a.push(e || b ? c + "?" : c)) : a.push(d.charAt(f).replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&")); a = a.join(""); t && (a = a.replace(new RegExp("(" + t.digit + "(.*" + t.digit + ")?)"), "($1)?").replace(new RegExp(t.digit, "g"), t.pattern)); return new RegExp(a)
      }, destroyEvents: function () { b.off("input keydown keyup paste drop blur focusout ".split(" ").join(".mask ")) }, val: function (a) {
        var c = b.is("input") ? "val" : "text"; if (0 < arguments.length) {
          if (b[c]() !== a) b[c](a);
          c = b
        } else c = b[c](); return c
      }, calculateCaretPosition: function (a) { var d = c.getMasked(), h = c.getCaret(); if (a !== d) { var e = b.data("mask-previus-caret-pos") || 0; d = d.length; var g = a.length, f = a = 0, l = 0, k = 0, m; for (m = h; m < d && c.maskDigitPosMap[m]; m++)f++; for (m = h - 1; 0 <= m && c.maskDigitPosMap[m]; m--)a++; for (m = h - 1; 0 <= m; m--)c.maskDigitPosMap[m] && l++; for (m = e - 1; 0 <= m; m--)c.maskDigitPosMapOld[m] && k++; h > g ? h = 10 * d : e >= h && e !== g ? c.maskDigitPosMapOld[h] || (e = h, h = h - (k - l) - a, c.maskDigitPosMap[h] && (h = e)) : h > e && (h = h + (l - k) + f) } return h }, behaviour: function (d) {
        d =
          d || window.event; c.invalid = []; var e = b.data("mask-keycode"); if (-1 === a.inArray(e, l.byPassKeys)) { e = c.getMasked(); var h = c.getCaret(), g = b.data("mask-previus-value") || ""; setTimeout(function () { c.setCaret(c.calculateCaretPosition(g)) }, a.jMaskGlobals.keyStrokeCompensation); c.val(e); c.setCaret(h); return c.callbacks(d) }
      }, getMasked: function (a, b) {
        var h = [], f = void 0 === b ? c.val() : b + "", g = 0, k = d.length, n = 0, p = f.length, m = 1, r = "push", u = -1, w = 0; b = []; if (e.reverse) {
          r = "unshift"; m = -1; var x = 0; g = k - 1; n = p - 1; var A = function () {
            return -1 <
              g && -1 < n
          }
        } else x = k - 1, A = function () { return g < k && n < p }; for (var z; A();) { var y = d.charAt(g), v = f.charAt(n), q = l.translation[y]; if (q) v.match(q.pattern) ? (h[r](v), q.recursive && (-1 === u ? u = g : g === x && g !== u && (g = u - m), x === u && (g -= m)), g += m) : v === z ? (w--, z = void 0) : q.optional ? (g += m, n -= m) : q.fallback ? (h[r](q.fallback), g += m, n -= m) : c.invalid.push({ p: n, v: v, e: q.pattern }), n += m; else { if (!a) h[r](y); v === y ? (b.push(n), n += m) : (z = y, b.push(n + w), w++); g += m } } a = d.charAt(x); k !== p + 1 || l.translation[a] || h.push(a); h = h.join(""); c.mapMaskdigitPositions(h,
          b, p); return h
      }, mapMaskdigitPositions: function (a, b, d) { a = e.reverse ? a.length - d : 0; c.maskDigitPosMap = {}; for (d = 0; d < b.length; d++)c.maskDigitPosMap[b[d] + a] = 1 }, callbacks: function (a) { var g = c.val(), h = g !== f, k = [g, a, b, e], l = function (a, b, c) { "function" === typeof e[a] && b && e[a].apply(this, c) }; l("onChange", !0 === h, k); l("onKeyPress", !0 === h, k); l("onComplete", g.length === d.length, k); l("onInvalid", 0 < c.invalid.length, [g, a, b, c.invalid, e]) }
    }; b = a(b); var l = this, f = c.val(), k; d = "function" === typeof d ? d(c.val(), void 0, b, e) : d; l.mask =
      d; l.options = e; l.remove = function () { var a = c.getCaret(); l.options.placeholder && b.removeAttr("placeholder"); b.data("mask-maxlength") && b.removeAttr("maxlength"); c.destroyEvents(); c.val(l.getCleanVal()); c.setCaret(a); return b }; l.getCleanVal = function () { return c.getMasked(!0) }; l.getMaskedVal = function (a) { return c.getMasked(!1, a) }; l.init = function (g) {
        g = g || !1; e = e || {}; l.clearIfNotMatch = a.jMaskGlobals.clearIfNotMatch; l.byPassKeys = a.jMaskGlobals.byPassKeys; l.translation = a.extend({}, a.jMaskGlobals.translation, e.translation);
        l = a.extend(!0, {}, l, e); k = c.getRegexMask(); if (g) c.events(), c.val(c.getMasked()); else { e.placeholder && b.attr("placeholder", e.placeholder); b.data("mask") && b.attr("autocomplete", "off"); g = 0; for (var f = !0; g < d.length; g++) { var h = l.translation[d.charAt(g)]; if (h && h.recursive) { f = !1; break } } f && b.attr("maxlength", d.length).data("mask-maxlength", !0); c.destroyEvents(); c.events(); g = c.getCaret(); c.val(c.getMasked()); c.setCaret(g) }
      }; l.init(!b.is("input"))
  }; a.maskWatchers = {}; var f = function () {
    var b = a(this), d = {}, e = b.attr("data-mask");
    b.attr("data-mask-reverse") && (d.reverse = !0); b.attr("data-mask-clearifnotmatch") && (d.clearIfNotMatch = !0); "true" === b.attr("data-mask-selectonfocus") && (d.selectOnFocus = !0); if (p(b, e, d)) return b.data("mask", new n(this, e, d))
  }, p = function (b, d, e) { e = e || {}; var c = a(b).data("mask"), f = JSON.stringify; b = a(b).val() || a(b).text(); try { return "function" === typeof d && (d = d(b)), "object" !== typeof c || f(c.options) !== f(e) || c.mask !== d } catch (w) { } }, k = function (a) {
    var b = document.createElement("div"); a = "on" + a; var e = a in b; e || (b.setAttribute(a,
      "return;"), e = "function" === typeof b[a]); return e
  }; a.fn.mask = function (b, d) { d = d || {}; var e = this.selector, c = a.jMaskGlobals, f = c.watchInterval; c = d.watchInputs || c.watchInputs; var k = function () { if (p(this, b, d)) return a(this).data("mask", new n(this, b, d)) }; a(this).each(k); e && "" !== e && c && (clearInterval(a.maskWatchers[e]), a.maskWatchers[e] = setInterval(function () { a(document).find(e).each(k) }, f)); return this }; a.fn.masked = function (a) { return this.data("mask").getMaskedVal(a) }; a.fn.unmask = function () {
    clearInterval(a.maskWatchers[this.selector]);
    delete a.maskWatchers[this.selector]; return this.each(function () { var b = a(this).data("mask"); b && b.remove().removeData("mask") })
  }; a.fn.cleanVal = function () { return this.data("mask").getCleanVal() }; a.applyDataMask = function (b) { b = b || a.jMaskGlobals.maskElements; (b instanceof a ? b : a(b)).filter(a.jMaskGlobals.dataMaskAttr).each(f) }; k = {
    maskElements: "input,td,span,div", dataMaskAttr: "*[data-mask]", dataMask: !0, watchInterval: 300, watchInputs: !0, keyStrokeCompensation: 10, useInput: !/Chrome\/[2-4][0-9]|SamsungBrowser/.test(window.navigator.userAgent) &&
      k("input"), watchDataMask: !1, byPassKeys: [9, 16, 17, 18, 36, 37, 38, 39, 40, 91], translation: { 0: { pattern: /\d/ }, 9: { pattern: /\d/, optional: !0 }, "#": { pattern: /\d/, recursive: !0 }, A: { pattern: /[a-zA-Z0-9]/ }, S: { pattern: /[a-zA-Z]/ } }
  }; a.jMaskGlobals = a.jMaskGlobals || {}; k = a.jMaskGlobals = a.extend(!0, {}, k, a.jMaskGlobals); k.dataMask && a.applyDataMask(); setInterval(function () { a.jMaskGlobals.watchDataMask && a.applyDataMask() }, k.watchInterval)
}, window.jQuery, window.Zepto);
;
/*! Magnific Popup - v1.1.0 - 2016-02-20
* http://dimsemenov.com/plugins/magnific-popup/
* Copyright (c) 2016 Dmitry Semenov; */
(function (factory) { if (typeof define === 'function' && define.amd) { define(['jquery'], factory); } else if (typeof exports === 'object') { factory(require('jquery')); } else { factory(window.jQuery || window.Zepto); } }(function ($) {
  var CLOSE_EVENT = 'Close', BEFORE_CLOSE_EVENT = 'BeforeClose', AFTER_CLOSE_EVENT = 'AfterClose', BEFORE_APPEND_EVENT = 'BeforeAppend', MARKUP_PARSE_EVENT = 'MarkupParse', OPEN_EVENT = 'Open', CHANGE_EVENT = 'Change', NS = 'mfp', EVENT_NS = '.' + NS, READY_CLASS = 'mfp-ready', REMOVING_CLASS = 'mfp-removing', PREVENT_CLOSE_CLASS = 'mfp-prevent-close'; var mfp, MagnificPopup = function () { }, _isJQ = !!(window.jQuery), _prevStatus, _window = $(window), _document, _prevContentType, _wrapClasses, _currPopupType; var _mfpOn = function (name, f) { mfp.ev.on(NS + name + EVENT_NS, f); }, _getEl = function (className, appendTo, html, raw) {
    var el = document.createElement('div'); el.className = 'mfp-' + className; if (html) { el.innerHTML = html; }
    if (!raw) { el = $(el); if (appendTo) { el.appendTo(appendTo); } } else if (appendTo) { appendTo.appendChild(el); }
    return el;
  }, _mfpTrigger = function (e, data) { mfp.ev.triggerHandler(NS + e, data); if (mfp.st.callbacks) { e = e.charAt(0).toLowerCase() + e.slice(1); if (mfp.st.callbacks[e]) { mfp.st.callbacks[e].apply(mfp, $.isArray(data) ? data : [data]); } } }, _getCloseBtn = function (type) {
    if (type !== _currPopupType || !mfp.currTemplate.closeBtn) { mfp.currTemplate.closeBtn = $(mfp.st.closeMarkup.replace('%title%', mfp.st.tClose)); _currPopupType = type; }
    return mfp.currTemplate.closeBtn;
  }, _checkInstance = function () { if (!$.magnificPopup.instance) { mfp = new MagnificPopup(); mfp.init(); $.magnificPopup.instance = mfp; } }, supportsTransitions = function () {
    var s = document.createElement('p').style, v = ['ms', 'O', 'Moz', 'Webkit']; if (s['transition'] !== undefined) { return true; }
    while (v.length) { if (v.pop() + 'Transition' in s) { return true; } }
    return false;
  }; MagnificPopup.prototype = {
    constructor: MagnificPopup, init: function () { var appVersion = navigator.appVersion; mfp.isLowIE = mfp.isIE8 = document.all && !document.addEventListener; mfp.isAndroid = (/android/gi).test(appVersion); mfp.isIOS = (/iphone|ipad|ipod/gi).test(appVersion); mfp.supportsTransition = supportsTransitions(); mfp.probablyMobile = (mfp.isAndroid || mfp.isIOS || /(Opera Mini)|Kindle|webOS|BlackBerry|(Opera Mobi)|(Windows Phone)|IEMobile/i.test(navigator.userAgent)); _document = $(document); mfp.popupsCache = {}; }, open: function (data) {
      var i; if (data.isObj === false) {
        mfp.items = data.items.toArray(); mfp.index = 0; var items = data.items, item; for (i = 0; i < items.length; i++) {
          item = items[i]; if (item.parsed) { item = item.el[0]; }
          if (item === data.el[0]) { mfp.index = i; break; }
        }
      } else { mfp.items = $.isArray(data.items) ? data.items : [data.items]; mfp.index = data.index || 0; }
      if (mfp.isOpen) { mfp.updateItemHTML(); return; }
      mfp.types = []; _wrapClasses = ''; if (data.mainEl && data.mainEl.length) { mfp.ev = data.mainEl.eq(0); } else { mfp.ev = _document; }
      if (data.key) {
        if (!mfp.popupsCache[data.key]) { mfp.popupsCache[data.key] = {}; }
        mfp.currTemplate = mfp.popupsCache[data.key];
      } else { mfp.currTemplate = {}; }
      mfp.st = $.extend(true, {}, $.magnificPopup.defaults, data); mfp.fixedContentPos = mfp.st.fixedContentPos === 'auto' ? !mfp.probablyMobile : mfp.st.fixedContentPos; if (mfp.st.modal) { mfp.st.closeOnContentClick = false; mfp.st.closeOnBgClick = false; mfp.st.showCloseBtn = false; mfp.st.enableEscapeKey = false; }
      if (!mfp.bgOverlay) { mfp.bgOverlay = _getEl('bg').on('click' + EVENT_NS, function () { mfp.close(); }); mfp.wrap = _getEl('wrap').attr('tabindex', -1).on('click' + EVENT_NS, function (e) { if (mfp._checkIfClose(e.target)) { mfp.close(); } }); mfp.container = _getEl('container', mfp.wrap); }
      mfp.contentContainer = _getEl('content'); if (mfp.st.preloader) { mfp.preloader = _getEl('preloader', mfp.container, mfp.st.tLoading); }
      var modules = $.magnificPopup.modules; for (i = 0; i < modules.length; i++) { var n = modules[i]; n = n.charAt(0).toUpperCase() + n.slice(1); mfp['init' + n].call(mfp); }
      _mfpTrigger('BeforeOpen'); if (mfp.st.showCloseBtn) { if (!mfp.st.closeBtnInside) { mfp.wrap.append(_getCloseBtn()); } else { _mfpOn(MARKUP_PARSE_EVENT, function (e, template, values, item) { values.close_replaceWith = _getCloseBtn(item.type); }); _wrapClasses += ' mfp-close-btn-in'; } }
      if (mfp.st.alignTop) { _wrapClasses += ' mfp-align-top'; }
      if (mfp.fixedContentPos) { mfp.wrap.css({ overflow: mfp.st.overflowY, overflowX: 'hidden', overflowY: mfp.st.overflowY }); } else { mfp.wrap.css({ top: _window.scrollTop(), position: 'absolute' }); }
      if (mfp.st.fixedBgPos === false || (mfp.st.fixedBgPos === 'auto' && !mfp.fixedContentPos)) { mfp.bgOverlay.css({ height: _document.height(), position: 'absolute' }); }
      if (mfp.st.enableEscapeKey) { _document.on('keyup' + EVENT_NS, function (e) { if (e.keyCode === 27) { mfp.close(); } }); }
      _window.on('resize' + EVENT_NS, function () { mfp.updateSize(); }); if (!mfp.st.closeOnContentClick) { _wrapClasses += ' mfp-auto-cursor'; }
      if (_wrapClasses)
        mfp.wrap.addClass(_wrapClasses); var windowHeight = mfp.wH = _window.height(); var windowStyles = {}; if (mfp.fixedContentPos) { if (mfp._hasScrollBar(windowHeight)) { var s = mfp._getScrollbarSize(); if (s) { windowStyles.marginRight = s; } } }
      if (mfp.fixedContentPos) { if (!mfp.isIE7) { windowStyles.overflow = 'hidden'; } else { $('body, html').css('overflow', 'hidden'); } }
      var classesToadd = mfp.st.mainClass; if (mfp.isIE7) { classesToadd += ' mfp-ie7'; }
      if (classesToadd) { mfp._addClassToMFP(classesToadd); }
      mfp.updateItemHTML(); _mfpTrigger('BuildControls'); $('html').css(windowStyles); mfp.bgOverlay.add(mfp.wrap).prependTo(mfp.st.prependTo || $(document.body)); mfp._lastFocusedEl = document.activeElement; setTimeout(function () {
        if (mfp.content) { mfp._addClassToMFP(READY_CLASS); mfp._setFocus(); } else { mfp.bgOverlay.addClass(READY_CLASS); }
        _document.on('focusin' + EVENT_NS, mfp._onFocusIn);
      }, 16); mfp.isOpen = true; mfp.updateSize(windowHeight); _mfpTrigger(OPEN_EVENT); return data;
    }, close: function () { if (!mfp.isOpen) return; _mfpTrigger(BEFORE_CLOSE_EVENT); mfp.isOpen = false; if (mfp.st.removalDelay && !mfp.isLowIE && mfp.supportsTransition) { mfp._addClassToMFP(REMOVING_CLASS); setTimeout(function () { mfp._close(); }, mfp.st.removalDelay); } else { mfp._close(); } }, _close: function () {
      _mfpTrigger(CLOSE_EVENT); var classesToRemove = REMOVING_CLASS + ' ' + READY_CLASS + ' '; mfp.bgOverlay.detach(); mfp.wrap.detach(); mfp.container.empty(); if (mfp.st.mainClass) { classesToRemove += mfp.st.mainClass + ' '; }
      mfp._removeClassFromMFP(classesToRemove); if (mfp.fixedContentPos) {
        var windowStyles = { marginRight: '' }; if (mfp.isIE7) { $('body, html').css('overflow', ''); } else { windowStyles.overflow = ''; }
        $('html').css(windowStyles);
      }
      _document.off('keyup' + EVENT_NS + ' focusin' + EVENT_NS); mfp.ev.off(EVENT_NS); mfp.wrap.attr('class', 'mfp-wrap').removeAttr('style'); mfp.bgOverlay.attr('class', 'mfp-bg'); mfp.container.attr('class', 'mfp-container'); if (mfp.st.showCloseBtn && (!mfp.st.closeBtnInside || mfp.currTemplate[mfp.currItem.type] === true)) {
        if (mfp.currTemplate.closeBtn)
          mfp.currTemplate.closeBtn.detach();
      }
      if (mfp.st.autoFocusLast && mfp._lastFocusedEl) { $(mfp._lastFocusedEl).focus(); }
      mfp.currItem = null; mfp.content = null; mfp.currTemplate = null; mfp.prevHeight = 0; _mfpTrigger(AFTER_CLOSE_EVENT);
    }, updateSize: function (winHeight) {
      if (mfp.isIOS) { var zoomLevel = document.documentElement.clientWidth / window.innerWidth; var height = window.innerHeight * zoomLevel; mfp.wrap.css('height', height); mfp.wH = height; } else { mfp.wH = winHeight || _window.height(); }
      if (!mfp.fixedContentPos) { mfp.wrap.css('height', mfp.wH); }
      _mfpTrigger('Resize');
    }, updateItemHTML: function () {
      var item = mfp.items[mfp.index]; mfp.contentContainer.detach(); if (mfp.content)
        mfp.content.detach(); if (!item.parsed) { item = mfp.parseEl(mfp.index); }
      var type = item.type; _mfpTrigger('BeforeChange', [mfp.currItem ? mfp.currItem.type : '', type]); mfp.currItem = item; if (!mfp.currTemplate[type]) { var markup = mfp.st[type] ? mfp.st[type].markup : false; _mfpTrigger('FirstMarkupParse', markup); if (markup) { mfp.currTemplate[type] = $(markup); } else { mfp.currTemplate[type] = true; } }
      if (_prevContentType && _prevContentType !== item.type) { mfp.container.removeClass('mfp-' + _prevContentType + '-holder'); }
      var newContent = mfp['get' + type.charAt(0).toUpperCase() + type.slice(1)](item, mfp.currTemplate[type]); mfp.appendContent(newContent, type); item.preloaded = true; _mfpTrigger(CHANGE_EVENT, item); _prevContentType = item.type; mfp.container.prepend(mfp.contentContainer); _mfpTrigger('AfterChange');
    }, appendContent: function (newContent, type) {
      mfp.content = newContent; if (newContent) { if (mfp.st.showCloseBtn && mfp.st.closeBtnInside && mfp.currTemplate[type] === true) { if (!mfp.content.find('.mfp-close').length) { mfp.content.append(_getCloseBtn()); } } else { mfp.content = newContent; } } else { mfp.content = ''; }
      _mfpTrigger(BEFORE_APPEND_EVENT); mfp.container.addClass('mfp-' + type + '-holder'); mfp.contentContainer.append(mfp.content);
    }, parseEl: function (index) {
      var item = mfp.items[index], type; if (item.tagName) { item = { el: $(item) }; } else { type = item.type; item = { data: item, src: item.src }; }
      if (item.el) {
        var types = mfp.types; for (var i = 0; i < types.length; i++) { if (item.el.hasClass('mfp-' + types[i])) { type = types[i]; break; } }
        item.src = item.el.attr('data-mfp-src'); if (!item.src) { item.src = item.el.attr('href'); }
      }
      item.type = type || mfp.st.type || 'inline'; item.index = index; item.parsed = true; mfp.items[index] = item; _mfpTrigger('ElementParse', item); return mfp.items[index];
    }, addGroup: function (el, options) {
      var eHandler = function (e) { e.mfpEl = this; mfp._openClick(e, el, options); }; if (!options) { options = {}; }
      var eName = 'click.magnificPopup'; options.mainEl = el; if (options.items) { options.isObj = true; el.off(eName).on(eName, eHandler); } else { options.isObj = false; if (options.delegate) { el.off(eName).on(eName, options.delegate, eHandler); } else { options.items = el; el.off(eName).on(eName, eHandler); } }
    }, _openClick: function (e, el, options) {
      var midClick = options.midClick !== undefined ? options.midClick : $.magnificPopup.defaults.midClick; if (!midClick && (e.which === 2 || e.ctrlKey || e.metaKey || e.altKey || e.shiftKey)) { return; }
      var disableOn = options.disableOn !== undefined ? options.disableOn : $.magnificPopup.defaults.disableOn; if (disableOn) { if ($.isFunction(disableOn)) { if (!disableOn.call(mfp)) { return true; } } else { if (_window.width() < disableOn) { return true; } } }
      if (e.type) { e.preventDefault(); if (mfp.isOpen) { e.stopPropagation(); } }
      options.el = $(e.mfpEl); if (options.delegate) { options.items = el.find(options.delegate); }
      mfp.open(options);
    }, updateStatus: function (status, text) {
      if (mfp.preloader) {
        if (_prevStatus !== status) { mfp.container.removeClass('mfp-s-' + _prevStatus); }
        if (!text && status === 'loading') { text = mfp.st.tLoading; }
        var data = { status: status, text: text }; _mfpTrigger('UpdateStatus', data); status = data.status; text = data.text; mfp.preloader.html(text); mfp.preloader.find('a').on('click', function (e) { e.stopImmediatePropagation(); }); mfp.container.addClass('mfp-s-' + status); _prevStatus = status;
      }
    }, _checkIfClose: function (target) {
      if ($(target).hasClass(PREVENT_CLOSE_CLASS)) { return; }
      var closeOnContent = mfp.st.closeOnContentClick; var closeOnBg = mfp.st.closeOnBgClick; if (closeOnContent && closeOnBg) { return true; } else {
        if (!mfp.content || $(target).hasClass('mfp-close') || (mfp.preloader && target === mfp.preloader[0])) { return true; }
        if ((target !== mfp.content[0] && !$.contains(mfp.content[0], target))) { if (closeOnBg) { if ($.contains(document, target)) { return true; } } } else if (closeOnContent) { return true; }
      }
      return false;
    }, _addClassToMFP: function (cName) { mfp.bgOverlay.addClass(cName); mfp.wrap.addClass(cName); }, _removeClassFromMFP: function (cName) { this.bgOverlay.removeClass(cName); mfp.wrap.removeClass(cName); }, _hasScrollBar: function (winHeight) { return ((mfp.isIE7 ? _document.height() : document.body.scrollHeight) > (winHeight || _window.height())); }, _setFocus: function () { (mfp.st.focus ? mfp.content.find(mfp.st.focus).eq(0) : mfp.wrap).focus(); }, _onFocusIn: function (e) { if (e.target !== mfp.wrap[0] && !$.contains(mfp.wrap[0], e.target)) { mfp._setFocus(); return false; } }, _parseMarkup: function (template, values, item) {
      var arr; if (item.data) { values = $.extend(item.data, values); }
      _mfpTrigger(MARKUP_PARSE_EVENT, [template, values, item]); $.each(values, function (key, value) {
        if (value === undefined || value === false) { return true; }
        arr = key.split('_'); if (arr.length > 1) { var el = template.find(EVENT_NS + '-' + arr[0]); if (el.length > 0) { var attr = arr[1]; if (attr === 'replaceWith') { if (el[0] !== value[0]) { el.replaceWith(value); } } else if (attr === 'img') { if (el.is('img')) { el.attr('src', value); } else { el.replaceWith($('<img>').attr('src', value).attr('class', el.attr('class'))); } } else { el.attr(arr[1], value); } } } else { template.find(EVENT_NS + '-' + key).html(value); }
      });
    }, _getScrollbarSize: function () {
      if (mfp.scrollbarSize === undefined) { var scrollDiv = document.createElement("div"); scrollDiv.style.cssText = 'width: 99px; height: 99px; overflow: scroll; position: absolute; top: -9999px;'; document.body.appendChild(scrollDiv); mfp.scrollbarSize = scrollDiv.offsetWidth - scrollDiv.clientWidth; document.body.removeChild(scrollDiv); }
      return mfp.scrollbarSize;
    }
  }; $.magnificPopup = {
    instance: null, proto: MagnificPopup.prototype, modules: [], open: function (options, index) {
      _checkInstance(); if (!options) { options = {}; } else { options = $.extend(true, {}, options); }
      options.isObj = true; options.index = index || 0; return this.instance.open(options);
    }, close: function () { return $.magnificPopup.instance && $.magnificPopup.instance.close(); }, registerModule: function (name, module) {
      if (module.options) { $.magnificPopup.defaults[name] = module.options; }
      $.extend(this.proto, module.proto); this.modules.push(name);
    }, defaults: { disableOn: 0, key: null, midClick: false, mainClass: '', preloader: true, focus: '', closeOnContentClick: false, closeOnBgClick: true, closeBtnInside: true, showCloseBtn: true, enableEscapeKey: true, modal: false, alignTop: false, removalDelay: 0, prependTo: null, fixedContentPos: 'auto', fixedBgPos: 'auto', overflowY: 'auto', closeMarkup: '<button title="%title%" type="button" class="mfp-close">&#215;</button>', tClose: 'Close (Esc)', tLoading: 'Loading...', autoFocusLast: true }
  }; $.fn.magnificPopup = function (options) {
    _checkInstance(); var jqEl = $(this); if (typeof options === "string") {
      if (options === 'open') {
        var items, itemOpts = _isJQ ? jqEl.data('magnificPopup') : jqEl[0].magnificPopup, index = parseInt(arguments[1], 10) || 0; if (itemOpts.items) { items = itemOpts.items[index]; } else {
          items = jqEl; if (itemOpts.delegate) { items = items.find(itemOpts.delegate); }
          items = items.eq(index);
        }
        mfp._openClick({ mfpEl: items }, jqEl, itemOpts);
      } else {
        if (mfp.isOpen)
          mfp[options].apply(mfp, Array.prototype.slice.call(arguments, 1));
      }
    } else {
      options = $.extend(true, {}, options); if (_isJQ) { jqEl.data('magnificPopup', options); } else { jqEl[0].magnificPopup = options; }
      mfp.addGroup(jqEl, options);
    }
    return jqEl;
  }; var INLINE_NS = 'inline', _hiddenClass, _inlinePlaceholder, _lastInlineElement, _putInlineElementsBack = function () { if (_lastInlineElement) { _inlinePlaceholder.after(_lastInlineElement.addClass(_hiddenClass)).detach(); _lastInlineElement = null; } }; $.magnificPopup.registerModule(INLINE_NS, {
    options: { hiddenClass: 'hide', markup: '', tNotFound: 'Content not found' }, proto: {
      initInline: function () { mfp.types.push(INLINE_NS); _mfpOn(CLOSE_EVENT + '.' + INLINE_NS, function () { _putInlineElementsBack(); }); }, getInline: function (item, template) {
        _putInlineElementsBack(); if (item.src) {
          var inlineSt = mfp.st.inline, el = $(item.src); if (el.length) {
            var parent = el[0].parentNode; if (parent && parent.tagName) {
              if (!_inlinePlaceholder) { _hiddenClass = inlineSt.hiddenClass; _inlinePlaceholder = _getEl(_hiddenClass); _hiddenClass = 'mfp-' + _hiddenClass; }
              _lastInlineElement = el.after(_inlinePlaceholder).detach().removeClass(_hiddenClass);
            }
            mfp.updateStatus('ready');
          } else { mfp.updateStatus('error', inlineSt.tNotFound); el = $('<div>'); }
          item.inlineElement = el; return el;
        }
        mfp.updateStatus('ready'); mfp._parseMarkup(template, {}, item); return template;
      }
    }
  }); var AJAX_NS = 'ajax', _ajaxCur, _removeAjaxCursor = function () { if (_ajaxCur) { $(document.body).removeClass(_ajaxCur); } }, _destroyAjaxRequest = function () { _removeAjaxCursor(); if (mfp.req) { mfp.req.abort(); } }; $.magnificPopup.registerModule(AJAX_NS, {
    options: { settings: null, cursor: 'mfp-ajax-cur', tError: '<a href="%url%">The content</a> could not be loaded.' }, proto: {
      initAjax: function () { mfp.types.push(AJAX_NS); _ajaxCur = mfp.st.ajax.cursor; _mfpOn(CLOSE_EVENT + '.' + AJAX_NS, _destroyAjaxRequest); _mfpOn('BeforeChange.' + AJAX_NS, _destroyAjaxRequest); }, getAjax: function (item) {
        if (_ajaxCur) { $(document.body).addClass(_ajaxCur); }
        mfp.updateStatus('loading'); var opts = $.extend({ url: item.src, success: function (data, textStatus, jqXHR) { var temp = { data: data, xhr: jqXHR }; _mfpTrigger('ParseAjax', temp); mfp.appendContent($(temp.data), AJAX_NS); item.finished = true; _removeAjaxCursor(); mfp._setFocus(); setTimeout(function () { mfp.wrap.addClass(READY_CLASS); }, 16); mfp.updateStatus('ready'); _mfpTrigger('AjaxContentAdded'); }, error: function () { _removeAjaxCursor(); item.finished = item.loadError = true; mfp.updateStatus('error', mfp.st.ajax.tError.replace('%url%', item.src)); } }, mfp.st.ajax.settings); mfp.req = $.ajax(opts); return '';
      }
    }
  }); var _imgInterval, _getTitle = function (item) {
    if (item.data && item.data.title !== undefined)
      return item.data.title; var src = mfp.st.image.titleSrc; if (src) { if ($.isFunction(src)) { return src.call(mfp, item); } else if (item.el) { return item.el.attr(src) || ''; } }
    return '';
  }; $.magnificPopup.registerModule('image', {
    options: { markup: '<div class="mfp-figure">' + '<div class="mfp-close"></div>' + '<figure>' + '<div class="mfp-img"></div>' + '<figcaption>' + '<div class="mfp-bottom-bar">' + '<div class="mfp-title"></div>' + '<div class="mfp-counter"></div>' + '</div>' + '</figcaption>' + '</figure>' + '</div>', cursor: 'mfp-zoom-out-cur', titleSrc: 'title', verticalFit: true, tError: '<a href="%url%">The image</a> could not be loaded.' }, proto: {
      initImage: function () {
        var imgSt = mfp.st.image, ns = '.image'; mfp.types.push('image'); _mfpOn(OPEN_EVENT + ns, function () { if (mfp.currItem.type === 'image' && imgSt.cursor) { $(document.body).addClass(imgSt.cursor); } }); _mfpOn(CLOSE_EVENT + ns, function () {
          if (imgSt.cursor) { $(document.body).removeClass(imgSt.cursor); }
          _window.off('resize' + EVENT_NS);
        }); _mfpOn('Resize' + ns, mfp.resizeImage); if (mfp.isLowIE) { _mfpOn('AfterChange', mfp.resizeImage); }
      }, resizeImage: function () {
        var item = mfp.currItem; if (!item || !item.img) return; if (mfp.st.image.verticalFit) {
          var decr = 0; if (mfp.isLowIE) { decr = parseInt(item.img.css('padding-top'), 10) + parseInt(item.img.css('padding-bottom'), 10); }
          item.img.css('max-height', mfp.wH - decr);
        }
      }, _onImageHasSize: function (item) {
        if (item.img) {
          item.hasSize = true; if (_imgInterval) { clearInterval(_imgInterval); }
          item.isCheckingImgSize = false; _mfpTrigger('ImageHasSize', item); if (item.imgHidden) {
            if (mfp.content)
              mfp.content.removeClass('mfp-loading'); item.imgHidden = false;
          }
        }
      }, findImageSize: function (item) {
        var counter = 0, img = item.img[0], mfpSetInterval = function (delay) {
          if (_imgInterval) { clearInterval(_imgInterval); }
          _imgInterval = setInterval(function () {
            if (img.naturalWidth > 0) { mfp._onImageHasSize(item); return; }
            if (counter > 200) { clearInterval(_imgInterval); }
            counter++; if (counter === 3) { mfpSetInterval(10); } else if (counter === 40) { mfpSetInterval(50); } else if (counter === 100) { mfpSetInterval(500); }
          }, delay);
        }; mfpSetInterval(1);
      }, getImage: function (item, template) {
        var guard = 0, onLoadComplete = function () {
          if (item) {
            if (item.img[0].complete) {
              item.img.off('.mfploader'); if (item === mfp.currItem) { mfp._onImageHasSize(item); mfp.updateStatus('ready'); }
              item.hasSize = true; item.loaded = true; _mfpTrigger('ImageLoadComplete');
            }
            else { guard++; if (guard < 200) { setTimeout(onLoadComplete, 100); } else { onLoadError(); } }
          }
        }, onLoadError = function () {
          if (item) {
            item.img.off('.mfploader'); if (item === mfp.currItem) { mfp._onImageHasSize(item); mfp.updateStatus('error', imgSt.tError.replace('%url%', item.src)); }
            item.hasSize = true; item.loaded = true; item.loadError = true;
          }
        }, imgSt = mfp.st.image; var el = template.find('.mfp-img'); if (el.length) {
          var img = document.createElement('img'); img.className = 'mfp-img'; if (item.el && item.el.find('img').length) { img.alt = item.el.find('img').attr('alt'); }
          item.img = $(img).on('load.mfploader', onLoadComplete).on('error.mfploader', onLoadError); img.src = item.src; if (el.is('img')) { item.img = item.img.clone(); }
          img = item.img[0]; if (img.naturalWidth > 0) { item.hasSize = true; } else if (!img.width) { item.hasSize = false; }
        }
        mfp._parseMarkup(template, { title: _getTitle(item), img_replaceWith: item.img }, item); mfp.resizeImage(); if (item.hasSize) {
          if (_imgInterval) clearInterval(_imgInterval); if (item.loadError) { template.addClass('mfp-loading'); mfp.updateStatus('error', imgSt.tError.replace('%url%', item.src)); } else { template.removeClass('mfp-loading'); mfp.updateStatus('ready'); }
          return template;
        }
        mfp.updateStatus('loading'); item.loading = true; if (!item.hasSize) { item.imgHidden = true; template.addClass('mfp-loading'); mfp.findImageSize(item); }
        return template;
      }
    }
  }); var hasMozTransform, getHasMozTransform = function () {
    if (hasMozTransform === undefined) { hasMozTransform = document.createElement('p').style.MozTransform !== undefined; }
    return hasMozTransform;
  }; $.magnificPopup.registerModule('zoom', {
    options: { enabled: false, easing: 'ease-in-out', duration: 300, opener: function (element) { return element.is('img') ? element : element.find('img'); } }, proto: {
      initZoom: function () {
        var zoomSt = mfp.st.zoom, ns = '.zoom', image; if (!zoomSt.enabled || !mfp.supportsTransition) { return; }
        var duration = zoomSt.duration, getElToAnimate = function (image) { var newImg = image.clone().removeAttr('style').removeAttr('class').addClass('mfp-animated-image'), transition = 'all ' + (zoomSt.duration / 1000) + 's ' + zoomSt.easing, cssObj = { position: 'fixed', zIndex: 9999, left: 0, top: 0, '-webkit-backface-visibility': 'hidden' }, t = 'transition'; cssObj['-webkit-' + t] = cssObj['-moz-' + t] = cssObj['-o-' + t] = cssObj[t] = transition; newImg.css(cssObj); return newImg; }, showMainContent = function () { mfp.content.css('visibility', 'visible'); }, openTimeout, animatedImg; _mfpOn('BuildControls' + ns, function () {
          if (mfp._allowZoom()) {
            clearTimeout(openTimeout); mfp.content.css('visibility', 'hidden'); image = mfp._getItemToZoom(); if (!image) { showMainContent(); return; }
            animatedImg = getElToAnimate(image); animatedImg.css(mfp._getOffset()); mfp.wrap.append(animatedImg); openTimeout = setTimeout(function () { animatedImg.css(mfp._getOffset(true)); openTimeout = setTimeout(function () { showMainContent(); setTimeout(function () { animatedImg.remove(); image = animatedImg = null; _mfpTrigger('ZoomAnimationEnded'); }, 16); }, duration); }, 16);
          }
        }); _mfpOn(BEFORE_CLOSE_EVENT + ns, function () {
          if (mfp._allowZoom()) {
            clearTimeout(openTimeout); mfp.st.removalDelay = duration; if (!image) {
              image = mfp._getItemToZoom(); if (!image) { return; }
              animatedImg = getElToAnimate(image);
            }
            animatedImg.css(mfp._getOffset(true)); mfp.wrap.append(animatedImg); mfp.content.css('visibility', 'hidden'); setTimeout(function () { animatedImg.css(mfp._getOffset()); }, 16);
          }
        }); _mfpOn(CLOSE_EVENT + ns, function () {
          if (mfp._allowZoom()) {
            showMainContent(); if (animatedImg) { animatedImg.remove(); }
            image = null;
          }
        });
      }, _allowZoom: function () { return mfp.currItem.type === 'image'; }, _getItemToZoom: function () { if (mfp.currItem.hasSize) { return mfp.currItem.img; } else { return false; } }, _getOffset: function (isLarge) {
        var el; if (isLarge) { el = mfp.currItem.img; } else { el = mfp.st.zoom.opener(mfp.currItem.el || mfp.currItem); }
        var offset = el.offset(); var paddingTop = parseInt(el.css('padding-top'), 10); var paddingBottom = parseInt(el.css('padding-bottom'), 10); offset.top -= ($(window).scrollTop() - paddingTop); var obj = { width: el.width(), height: (_isJQ ? el.innerHeight() : el[0].offsetHeight) - paddingBottom - paddingTop }; if (getHasMozTransform()) { obj['-moz-transform'] = obj['transform'] = 'translate(' + offset.left + 'px,' + offset.top + 'px)'; } else { obj.left = offset.left; obj.top = offset.top; }
        return obj;
      }
    }
  }); var IFRAME_NS = 'iframe', _emptyPage = '//about:blank', _fixIframeBugs = function (isShowing) {
    if (mfp.currTemplate[IFRAME_NS]) {
      var el = mfp.currTemplate[IFRAME_NS].find('iframe'); if (el.length) {
        if (!isShowing) { el[0].src = _emptyPage; }
        if (mfp.isIE8) { el.css('display', isShowing ? 'block' : 'none'); }
      }
    }
  }; $.magnificPopup.registerModule(IFRAME_NS, {
    options: { markup: '<div class="mfp-iframe-scaler">' + '<div class="mfp-close"></div>' + '<iframe class="mfp-iframe" src="//about:blank" frameborder="0" allowfullscreen></iframe>' + '</div>', srcAction: 'iframe_src', patterns: { youtube: { index: 'youtube.com', id: 'v=', src: '//www.youtube.com/embed/%id%?autoplay=1' }, vimeo: { index: 'vimeo.com/', id: '/', src: '//player.vimeo.com/video/%id%?autoplay=1' }, gmaps: { index: '//maps.google.', src: '%id%&output=embed' } } }, proto: {
      initIframe: function () { mfp.types.push(IFRAME_NS); _mfpOn('BeforeChange', function (e, prevType, newType) { if (prevType !== newType) { if (prevType === IFRAME_NS) { _fixIframeBugs(); } else if (newType === IFRAME_NS) { _fixIframeBugs(true); } } }); _mfpOn(CLOSE_EVENT + '.' + IFRAME_NS, function () { _fixIframeBugs(); }); }, getIframe: function (item, template) {
        var embedSrc = item.src; var iframeSt = mfp.st.iframe; $.each(iframeSt.patterns, function () {
          if (embedSrc.indexOf(this.index) > -1) {
            if (this.id) { if (typeof this.id === 'string') { embedSrc = embedSrc.substr(embedSrc.lastIndexOf(this.id) + this.id.length, embedSrc.length); } else { embedSrc = this.id.call(this, embedSrc); } }
            embedSrc = this.src.replace('%id%', embedSrc); return false;
          }
        }); var dataObj = {}; if (iframeSt.srcAction) { dataObj[iframeSt.srcAction] = embedSrc; }
        mfp._parseMarkup(template, dataObj, item); mfp.updateStatus('ready'); return template;
      }
    }
  }); var _getLoopedId = function (index) {
    var numSlides = mfp.items.length; if (index > numSlides - 1) { return index - numSlides; } else if (index < 0) { return numSlides + index; }
    return index;
  }, _replaceCurrTotal = function (text, curr, total) { return text.replace(/%curr%/gi, curr + 1).replace(/%total%/gi, total); }; $.magnificPopup.registerModule('gallery', {
    options: { enabled: false, arrowMarkup: '<button title="%title%" type="button" class="mfp-arrow mfp-arrow-%dir%"></button>', preload: [0, 2], navigateByImgClick: true, arrows: true, tPrev: 'Previous (Left arrow key)', tNext: 'Next (Right arrow key)', tCounter: '%curr% of %total%' }, proto: {
      initGallery: function () {
        var gSt = mfp.st.gallery, ns = '.mfp-gallery'; mfp.direction = true; if (!gSt || !gSt.enabled) return false; _wrapClasses += ' mfp-gallery'; _mfpOn(OPEN_EVENT + ns, function () {
          if (gSt.navigateByImgClick) { mfp.wrap.on('click' + ns, '.mfp-img', function () { if (mfp.items.length > 1) { mfp.next(); return false; } }); }
          _document.on('keydown' + ns, function (e) { if (e.keyCode === 37) { mfp.prev(); } else if (e.keyCode === 39) { mfp.next(); } });
        }); _mfpOn('UpdateStatus' + ns, function (e, data) { if (data.text) { data.text = _replaceCurrTotal(data.text, mfp.currItem.index, mfp.items.length); } }); _mfpOn(MARKUP_PARSE_EVENT + ns, function (e, element, values, item) { var l = mfp.items.length; values.counter = l > 1 ? _replaceCurrTotal(gSt.tCounter, item.index, l) : ''; }); _mfpOn('BuildControls' + ns, function () { if (mfp.items.length > 1 && gSt.arrows && !mfp.arrowLeft) { var markup = gSt.arrowMarkup, arrowLeft = mfp.arrowLeft = $(markup.replace(/%title%/gi, gSt.tPrev).replace(/%dir%/gi, 'left')).addClass(PREVENT_CLOSE_CLASS), arrowRight = mfp.arrowRight = $(markup.replace(/%title%/gi, gSt.tNext).replace(/%dir%/gi, 'right')).addClass(PREVENT_CLOSE_CLASS); arrowLeft.click(function () { mfp.prev(); }); arrowRight.click(function () { mfp.next(); }); mfp.container.append(arrowLeft.add(arrowRight)); } }); _mfpOn(CHANGE_EVENT + ns, function () { if (mfp._preloadTimeout) clearTimeout(mfp._preloadTimeout); mfp._preloadTimeout = setTimeout(function () { mfp.preloadNearbyImages(); mfp._preloadTimeout = null; }, 16); }); _mfpOn(CLOSE_EVENT + ns, function () { _document.off(ns); mfp.wrap.off('click' + ns); mfp.arrowRight = mfp.arrowLeft = null; });
      }, next: function () { mfp.direction = true; mfp.index = _getLoopedId(mfp.index + 1); mfp.updateItemHTML(); }, prev: function () { mfp.direction = false; mfp.index = _getLoopedId(mfp.index - 1); mfp.updateItemHTML(); }, goTo: function (newIndex) { mfp.direction = (newIndex >= mfp.index); mfp.index = newIndex; mfp.updateItemHTML(); }, preloadNearbyImages: function () {
        var p = mfp.st.gallery.preload, preloadBefore = Math.min(p[0], mfp.items.length), preloadAfter = Math.min(p[1], mfp.items.length), i; for (i = 1; i <= (mfp.direction ? preloadAfter : preloadBefore); i++) { mfp._preloadItem(mfp.index + i); }
        for (i = 1; i <= (mfp.direction ? preloadBefore : preloadAfter); i++) { mfp._preloadItem(mfp.index - i); }
      }, _preloadItem: function (index) {
        index = _getLoopedId(index); if (mfp.items[index].preloaded) { return; }
        var item = mfp.items[index]; if (!item.parsed) { item = mfp.parseEl(index); }
        _mfpTrigger('LazyLoad', item); if (item.type === 'image') { item.img = $('<img class="mfp-img" />').on('load.mfploader', function () { item.hasSize = true; }).on('error.mfploader', function () { item.hasSize = true; item.loadError = true; _mfpTrigger('LazyLoadError', item); }).attr('src', item.src); }
        item.preloaded = true;
      }
    }
  }); var RETINA_NS = 'retina'; $.magnificPopup.registerModule(RETINA_NS, { options: { replaceSrc: function (item) { return item.src.replace(/\.\w+$/, function (m) { return '@2x' + m; }); }, ratio: 1 }, proto: { initRetina: function () { if (window.devicePixelRatio > 1) { var st = mfp.st.retina, ratio = st.ratio; ratio = !isNaN(ratio) ? ratio : ratio(); if (ratio > 1) { _mfpOn('ImageHasSize' + '.' + RETINA_NS, function (e, item) { item.img.css({ 'max-width': item.img[0].naturalWidth / ratio, 'width': '100%' }); }); _mfpOn('ElementParse' + '.' + RETINA_NS, function (e, item) { item.src = st.replaceSrc(item, ratio); }); } } } } }); _checkInstance();
}));
; (function ($, window, document, undefined) {
  function Owl(element, options) { this.settings = null; this.options = $.extend({}, Owl.Defaults, options); this.$element = $(element); this._handlers = {}; this._plugins = {}; this._supress = {}; this._current = null; this._speed = null; this._coordinates = []; this._breakpoint = null; this._width = null; this._items = []; this._clones = []; this._mergers = []; this._widths = []; this._invalidated = {}; this._pipe = []; this._drag = { time: null, target: null, pointer: null, stage: { start: null, current: null }, direction: null }; this._states = { current: {}, tags: { 'initializing': ['busy'], 'animating': ['busy'], 'dragging': ['interacting'] } }; $.each(['onResize', 'onThrottledResize'], $.proxy(function (i, handler) { this._handlers[handler] = $.proxy(this[handler], this); }, this)); $.each(Owl.Plugins, $.proxy(function (key, plugin) { this._plugins[key.charAt(0).toLowerCase() + key.slice(1)] = new plugin(this); }, this)); $.each(Owl.Workers, $.proxy(function (priority, worker) { this._pipe.push({ 'filter': worker.filter, 'run': $.proxy(worker.run, this) }); }, this)); this.setup(); this.initialize(); }
  Owl.Defaults = { items: 3, loop: false, center: false, rewind: false, mouseDrag: true, touchDrag: true, pullDrag: true, freeDrag: false, margin: 0, stagePadding: 0, merge: false, mergeFit: true, autoWidth: false, startPosition: 0, rtl: false, smartSpeed: 250, fluidSpeed: false, dragEndSpeed: false, responsive: {}, responsiveRefreshRate: 200, responsiveBaseElement: window, fallbackEasing: 'swing', info: false, nestedItemSelector: false, itemElement: 'div', stageElement: 'div', refreshClass: 'owl-refresh', loadedClass: 'owl-loaded', loadingClass: 'owl-loading', rtlClass: 'owl-rtl', responsiveClass: 'owl-responsive', dragClass: 'owl-drag', itemClass: 'owl-item', stageClass: 'owl-stage', stageOuterClass: 'owl-stage-outer', grabClass: 'owl-grab' }; Owl.Width = { Default: 'default', Inner: 'inner', Outer: 'outer' }; Owl.Type = { Event: 'event', State: 'state' }; Owl.Plugins = {}; Owl.Workers = [{ filter: ['width', 'settings'], run: function () { this._width = this.$element.width(); } }, { filter: ['width', 'items', 'settings'], run: function (cache) { cache.current = this._items && this._items[this.relative(this._current)]; } }, { filter: ['items', 'settings'], run: function () { this.$stage.children('.cloned').remove(); } }, { filter: ['width', 'items', 'settings'], run: function (cache) { var margin = this.settings.margin || '', grid = !this.settings.autoWidth, rtl = this.settings.rtl, css = { 'width': 'auto', 'margin-left': rtl ? margin : '', 'margin-right': rtl ? '' : margin }; !grid && this.$stage.children().css(css); cache.css = css; } }, {
    filter: ['width', 'items', 'settings'], run: function (cache) {
      var width = (this.width() / this.settings.items).toFixed(3) - this.settings.margin, merge = null, iterator = this._items.length, grid = !this.settings.autoWidth, widths = []; cache.items = { merge: false, width: width }; while (iterator--) { merge = this._mergers[iterator]; merge = this.settings.mergeFit && Math.min(merge, this.settings.items) || merge; cache.items.merge = merge > 1 || cache.items.merge; widths[iterator] = !grid ? this._items[iterator].width() : width * merge; }
      this._widths = widths;
    }
  }, {
    filter: ['items', 'settings'], run: function () {
      var clones = [], items = this._items, settings = this.settings, view = Math.max(settings.items * 2, 4), size = Math.ceil(items.length / 2) * 2, repeat = settings.loop && items.length ? settings.rewind ? view : Math.max(view, size) : 0, append = '', prepend = ''; repeat /= 2; while (repeat--) { clones.push(this.normalize(clones.length / 2, true)); append = append + items[clones[clones.length - 1]][0].outerHTML; clones.push(this.normalize(items.length - 1 - (clones.length - 1) / 2, true)); prepend = items[clones[clones.length - 1]][0].outerHTML + prepend; }
      this._clones = clones; $(append).addClass('cloned').appendTo(this.$stage); $(prepend).addClass('cloned').prependTo(this.$stage);
    }
  }, {
    filter: ['width', 'items', 'settings'], run: function () {
      var rtl = this.settings.rtl ? 1 : -1, size = this._clones.length + this._items.length, iterator = -1, previous = 0, current = 0, coordinates = []; while (++iterator < size) { previous = coordinates[iterator - 1] || 0; current = this._widths[this.relative(iterator)] + this.settings.margin; coordinates.push(previous + current * rtl); }
      this._coordinates = coordinates;
    }
  }, { filter: ['width', 'items', 'settings'], run: function () { var padding = this.settings.stagePadding, coordinates = this._coordinates, css = { 'width': Math.ceil(Math.abs(coordinates[coordinates.length - 1])) + padding * 2, 'padding-left': padding || '', 'padding-right': padding || '' }; this.$stage.css(css); } }, { filter: ['width', 'items', 'settings'], run: function (cache) { var iterator = this._coordinates.length, grid = !this.settings.autoWidth, items = this.$stage.children(); if (grid && cache.items.merge) { while (iterator--) { cache.css.width = this._widths[this.relative(iterator)]; items.eq(iterator).css(cache.css); } } else if (grid) { cache.css.width = cache.items.width; items.css(cache.css); } } }, { filter: ['items'], run: function () { this._coordinates.length < 1 && this.$stage.removeAttr('style'); } }, { filter: ['width', 'items', 'settings'], run: function (cache) { cache.current = cache.current ? this.$stage.children().index(cache.current) : 0; cache.current = Math.max(this.minimum(), Math.min(this.maximum(), cache.current)); this.reset(cache.current); } }, { filter: ['position'], run: function () { this.animate(this.coordinates(this._current)); } }, {
    filter: ['width', 'position', 'items', 'settings'], run: function () {
      var rtl = this.settings.rtl ? 1 : -1, padding = this.settings.stagePadding * 2, begin = this.coordinates(this.current()) + padding, end = begin + this.width() * rtl, inner, outer, matches = [], i, n; for (i = 0, n = this._coordinates.length; i < n; i++) { inner = this._coordinates[i - 1] || 0; outer = Math.abs(this._coordinates[i]) + padding * rtl; if ((this.op(inner, '<=', begin) && (this.op(inner, '>', end))) || (this.op(outer, '<', begin) && this.op(outer, '>', end))) { matches.push(i); } }
      this.$stage.children('.active').removeClass('active'); this.$stage.children(':eq(' + matches.join('), :eq(') + ')').addClass('active'); if (this.settings.center) { this.$stage.children('.center').removeClass('center'); this.$stage.children().eq(this.current()).addClass('center'); }
    }
  }]; Owl.prototype.initialize = function () {
    this.enter('initializing'); this.trigger('initialize'); this.$element.toggleClass(this.settings.rtlClass, this.settings.rtl); if (this.settings.autoWidth && !this.is('pre-loading')) { var imgs, nestedSelector, width; imgs = this.$element.find('img'); nestedSelector = this.settings.nestedItemSelector ? '.' + this.settings.nestedItemSelector : undefined; width = this.$element.children(nestedSelector).width(); if (imgs.length && width <= 0) { this.preloadAutoWidthImages(imgs); } }
    this.$element.addClass(this.options.loadingClass); this.$stage = $('<' + this.settings.stageElement + ' class="' + this.settings.stageClass + '"/>').wrap('<div class="' + this.settings.stageOuterClass + '"/>'); this.$element.append(this.$stage.parent()); this.replace(this.$element.children().not(this.$stage.parent())); if (this.$element.is(':visible')) { this.refresh(); } else { this.invalidate('width'); }
    this.$element.removeClass(this.options.loadingClass).addClass(this.options.loadedClass); this.registerEventHandlers(); this.leave('initializing'); this.trigger('initialized');
  }; Owl.prototype.setup = function () {
    var viewport = this.viewport(), overwrites = this.options.responsive, match = -1, settings = null; if (!overwrites) { settings = $.extend({}, this.options); } else {
      $.each(overwrites, function (breakpoint) { if (breakpoint <= viewport && breakpoint > match) { match = Number(breakpoint); } }); settings = $.extend({}, this.options, overwrites[match]); if (typeof settings.stagePadding === 'function') { settings.stagePadding = settings.stagePadding(); }
      delete settings.responsive; if (settings.responsiveClass) { this.$element.attr('class', this.$element.attr('class').replace(new RegExp('(' + this.options.responsiveClass + '-)\\S+\\s', 'g'), '$1' + match)); }
    }
    this.trigger('change', { property: { name: 'settings', value: settings } }); this._breakpoint = match; this.settings = settings; this.invalidate('settings'); this.trigger('changed', { property: { name: 'settings', value: this.settings } });
  }; Owl.prototype.optionsLogic = function () { if (this.settings.autoWidth) { this.settings.stagePadding = false; this.settings.merge = false; } }; Owl.prototype.prepare = function (item) {
    var event = this.trigger('prepare', { content: item }); if (!event.data) { event.data = $('<' + this.settings.itemElement + '/>').addClass(this.options.itemClass).append(item) }
    this.trigger('prepared', { content: event.data }); return event.data;
  }; Owl.prototype.update = function () {
    var i = 0, n = this._pipe.length, filter = $.proxy(function (p) { return this[p] }, this._invalidated), cache = {}; while (i < n) {
      if (this._invalidated.all || $.grep(this._pipe[i].filter, filter).length > 0) { this._pipe[i].run(cache); }
      i++;
    }
    this._invalidated = {}; !this.is('valid') && this.enter('valid');
  }; Owl.prototype.width = function (dimension) { dimension = dimension || Owl.Width.Default; switch (dimension) { case Owl.Width.Inner: case Owl.Width.Outer: return this._width; default: return this._width - this.settings.stagePadding * 2 + this.settings.margin; } }; Owl.prototype.refresh = function () { this.enter('refreshing'); this.trigger('refresh'); this.setup(); this.optionsLogic(); this.$element.addClass(this.options.refreshClass); this.update(); this.$element.removeClass(this.options.refreshClass); this.leave('refreshing'); this.trigger('refreshed'); }; Owl.prototype.onThrottledResize = function () { window.clearTimeout(this.resizeTimer); this.resizeTimer = window.setTimeout(this._handlers.onResize, this.settings.responsiveRefreshRate); }; Owl.prototype.onResize = function () {
    if (!this._items.length) { return false; }
    if (this._width === this.$element.width()) { return false; }
    if (!this.$element.is(':visible')) { return false; }
    this.enter('resizing'); if (this.trigger('resize').isDefaultPrevented()) { this.leave('resizing'); return false; }
    this.invalidate('width'); this.refresh(); this.leave('resizing'); this.trigger('resized');
  }; Owl.prototype.registerEventHandlers = function () {
    if ($.support.transition) { this.$stage.on($.support.transition.end + '.owl.core', $.proxy(this.onTransitionEnd, this)); }
    if (this.settings.responsive !== false) { this.on(window, 'resize', this._handlers.onThrottledResize); }
    if (this.settings.mouseDrag) { this.$element.addClass(this.options.dragClass); this.$stage.on('mousedown.owl.core', $.proxy(this.onDragStart, this)); this.$stage.on('dragstart.owl.core selectstart.owl.core', function () { return false }); }
    if (this.settings.touchDrag) { this.$stage.on('touchstart.owl.core', $.proxy(this.onDragStart, this)); this.$stage.on('touchcancel.owl.core', $.proxy(this.onDragEnd, this)); }
  }; Owl.prototype.onDragStart = function (event) {
    var stage = null; if (event.which === 3) { return; }
    if ($.support.transform) { stage = this.$stage.css('transform').replace(/.*\(|\)| /g, '').split(','); stage = { x: stage[stage.length === 16 ? 12 : 4], y: stage[stage.length === 16 ? 13 : 5] }; } else { stage = this.$stage.position(); stage = { x: this.settings.rtl ? stage.left + this.$stage.width() - this.width() + this.settings.margin : stage.left, y: stage.top }; }
    if (this.is('animating')) {
      $.support.transform ? this.animate(stage.x) : this.$stage.stop()
      this.invalidate('position');
    }
    this.$element.toggleClass(this.options.grabClass, event.type === 'mousedown'); this.speed(0); this._drag.time = new Date().getTime(); this._drag.target = $(event.target); this._drag.stage.start = stage; this._drag.stage.current = stage; this._drag.pointer = this.pointer(event); $(document).on('mouseup.owl.core touchend.owl.core', $.proxy(this.onDragEnd, this)); $(document).one('mousemove.owl.core touchmove.owl.core', $.proxy(function (event) {
      var delta = this.difference(this._drag.pointer, this.pointer(event)); $(document).on('mousemove.owl.core touchmove.owl.core', $.proxy(this.onDragMove, this)); if (Math.abs(delta.x) < Math.abs(delta.y) && this.is('valid')) { return; }
      event.preventDefault(); this.enter('dragging'); this.trigger('drag');
    }, this));
  }; Owl.prototype.onDragMove = function (event) {
    var minimum = null, maximum = null, pull = null, delta = this.difference(this._drag.pointer, this.pointer(event)), stage = this.difference(this._drag.stage.start, delta); if (!this.is('dragging')) { return; }
    event.preventDefault(); if (this.settings.loop) { minimum = this.coordinates(this.minimum()); maximum = this.coordinates(this.maximum() + 1) - minimum; stage.x = (((stage.x - minimum) % maximum + maximum) % maximum) + minimum; } else { minimum = this.settings.rtl ? this.coordinates(this.maximum()) : this.coordinates(this.minimum()); maximum = this.settings.rtl ? this.coordinates(this.minimum()) : this.coordinates(this.maximum()); pull = this.settings.pullDrag ? -1 * delta.x / 5 : 0; stage.x = Math.max(Math.min(stage.x, minimum + pull), maximum + pull); }
    this._drag.stage.current = stage; this.animate(stage.x);
  }; Owl.prototype.onDragEnd = function (event) {
    var delta = this.difference(this._drag.pointer, this.pointer(event)), stage = this._drag.stage.current, direction = delta.x > 0 ^ this.settings.rtl ? 'left' : 'right'; $(document).off('.owl.core'); this.$element.removeClass(this.options.grabClass); if (delta.x !== 0 && this.is('dragging') || !this.is('valid')) { this.speed(this.settings.dragEndSpeed || this.settings.smartSpeed); this.current(this.closest(stage.x, delta.x !== 0 ? direction : this._drag.direction)); this.invalidate('position'); this.update(); this._drag.direction = direction; if (Math.abs(delta.x) > 3 || new Date().getTime() - this._drag.time > 300) { this._drag.target.one('click.owl.core', function () { return false; }); } }
    if (!this.is('dragging')) { return; }
    this.leave('dragging'); this.trigger('dragged');
  }; Owl.prototype.closest = function (coordinate, direction) {
    var position = -1, pull = 30, width = this.width(), coordinates = this.coordinates(); if (!this.settings.freeDrag) {
      $.each(coordinates, $.proxy(function (index, value) {
        if (direction === 'left' && coordinate > value - pull && coordinate < value + pull) { position = index; } else if (direction === 'right' && coordinate > value - width - pull && coordinate < value - width + pull) { position = index + 1; } else if (this.op(coordinate, '<', value) && this.op(coordinate, '>', coordinates[index + 1] || value - width)) { position = direction === 'left' ? index + 1 : index; }
        return position === -1;
      }, this));
    }
    if (!this.settings.loop) { if (this.op(coordinate, '>', coordinates[this.minimum()])) { position = coordinate = this.minimum(); } else if (this.op(coordinate, '<', coordinates[this.maximum()])) { position = coordinate = this.maximum(); } }
    return position;
  }; Owl.prototype.animate = function (coordinate) {
    var animate = this.speed() > 0; this.is('animating') && this.onTransitionEnd(); if (animate) { this.enter('animating'); this.trigger('translate'); }
    if ($.support.transform3d && $.support.transition) { this.$stage.css({ transform: 'translate3d(' + coordinate + 'px,0px,0px)', transition: (this.speed() / 1000) + 's' }); } else if (animate) { this.$stage.animate({ left: coordinate + 'px' }, this.speed(), this.settings.fallbackEasing, $.proxy(this.onTransitionEnd, this)); } else { this.$stage.css({ left: coordinate + 'px' }); }
  }; Owl.prototype.is = function (state) { return this._states.current[state] && this._states.current[state] > 0; }; Owl.prototype.current = function (position) {
    if (position === undefined) { return this._current; }
    if (this._items.length === 0) { return undefined; }
    position = this.normalize(position); if (this._current !== position) {
      var event = this.trigger('change', { property: { name: 'position', value: position } }); if (event.data !== undefined) { position = this.normalize(event.data); }
      this._current = position; this.invalidate('position'); this.trigger('changed', { property: { name: 'position', value: this._current } });
    }
    return this._current;
  }; Owl.prototype.invalidate = function (part) {
    if ($.type(part) === 'string') { this._invalidated[part] = true; this.is('valid') && this.leave('valid'); }
    return $.map(this._invalidated, function (v, i) { return i });
  }; Owl.prototype.reset = function (position) {
    position = this.normalize(position); if (position === undefined) { return; }
    this._speed = 0; this._current = position; this.suppress(['translate', 'translated']); this.animate(this.coordinates(position)); this.release(['translate', 'translated']);
  }; Owl.prototype.normalize = function (position, relative) {
    var n = this._items.length, m = relative ? 0 : this._clones.length; if (!this.isNumeric(position) || n < 1) { position = undefined; } else if (position < 0 || position >= n + m) { position = ((position - m / 2) % n + n) % n + m / 2; }
    return position;
  }; Owl.prototype.relative = function (position) { position -= this._clones.length / 2; return this.normalize(position, true); }; Owl.prototype.maximum = function (relative) {
    var settings = this.settings, maximum = this._coordinates.length, iterator, reciprocalItemsWidth, elementWidth; if (settings.loop) { maximum = this._clones.length / 2 + this._items.length - 1; } else if (settings.autoWidth || settings.merge) {
      iterator = this._items.length; reciprocalItemsWidth = this._items[--iterator].width(); elementWidth = this.$element.width(); while (iterator--) { reciprocalItemsWidth += this._items[iterator].width() + this.settings.margin; if (reciprocalItemsWidth > elementWidth) { break; } }
      maximum = iterator + 1;
    } else if (settings.center) { maximum = this._items.length - 1; } else { maximum = this._items.length - settings.items; }
    if (relative) { maximum -= this._clones.length / 2; }
    return Math.max(maximum, 0);
  }; Owl.prototype.minimum = function (relative) { return relative ? 0 : this._clones.length / 2; }; Owl.prototype.items = function (position) {
    if (position === undefined) { return this._items.slice(); }
    position = this.normalize(position, true); return this._items[position];
  }; Owl.prototype.mergers = function (position) {
    if (position === undefined) { return this._mergers.slice(); }
    position = this.normalize(position, true); return this._mergers[position];
  }; Owl.prototype.clones = function (position) {
    var odd = this._clones.length / 2, even = odd + this._items.length, map = function (index) { return index % 2 === 0 ? even + index / 2 : odd - (index + 1) / 2 }; if (position === undefined) { return $.map(this._clones, function (v, i) { return map(i) }); }
    return $.map(this._clones, function (v, i) { return v === position ? map(i) : null });
  }; Owl.prototype.speed = function (speed) {
    if (speed !== undefined) { this._speed = speed; }
    return this._speed;
  }; Owl.prototype.coordinates = function (position) {
    var multiplier = 1, newPosition = position - 1, coordinate; if (position === undefined) { return $.map(this._coordinates, $.proxy(function (coordinate, index) { return this.coordinates(index); }, this)); }
    if (this.settings.center) {
      if (this.settings.rtl) { multiplier = -1; newPosition = position + 1; }
      coordinate = this._coordinates[position]; coordinate += (this.width() - coordinate + (this._coordinates[newPosition] || 0)) / 2 * multiplier;
    } else { coordinate = this._coordinates[newPosition] || 0; }
    coordinate = Math.ceil(coordinate); return coordinate;
  }; Owl.prototype.duration = function (from, to, factor) {
    if (factor === 0) { return 0; }
    return Math.min(Math.max(Math.abs(to - from), 1), 6) * Math.abs((factor || this.settings.smartSpeed));
  }; Owl.prototype.to = function (position, speed) {
    var current = this.current(), revert = null, distance = position - this.relative(current), direction = (distance > 0) - (distance < 0), items = this._items.length, minimum = this.minimum(), maximum = this.maximum(); if (this.settings.loop) {
      if (!this.settings.rewind && Math.abs(distance) > items / 2) { distance += direction * -1 * items; }
      position = current + distance; revert = ((position - minimum) % items + items) % items + minimum; if (revert !== position && revert - distance <= maximum && revert - distance > 0) { current = revert - distance; position = revert; this.reset(current); }
    } else if (this.settings.rewind) { maximum += 1; position = (position % maximum + maximum) % maximum; } else { position = Math.max(minimum, Math.min(maximum, position)); }
    this.speed(this.duration(current, position, speed)); this.current(position); if (this.$element.is(':visible')) { this.update(); }
  }; Owl.prototype.next = function (speed) { speed = speed || false; this.to(this.relative(this.current()) + 1, speed); }; Owl.prototype.prev = function (speed) { speed = speed || false; this.to(this.relative(this.current()) - 1, speed); }; Owl.prototype.onTransitionEnd = function (event) {
    if (event !== undefined) { event.stopPropagation(); if ((event.target || event.srcElement || event.originalTarget) !== this.$stage.get(0)) { return false; } }
    this.leave('animating'); this.trigger('translated');
  }; Owl.prototype.viewport = function () {
    var width; if (this.options.responsiveBaseElement !== window) { width = $(this.options.responsiveBaseElement).width(); } else if (window.innerWidth) { width = window.innerWidth; } else if (document.documentElement && document.documentElement.clientWidth) { width = document.documentElement.clientWidth; } else { console.warn('Can not detect viewport width.'); }
    return width;
  }; Owl.prototype.replace = function (content) {
    this.$stage.empty(); this._items = []; if (content) { content = (content instanceof jQuery) ? content : $(content); }
    if (this.settings.nestedItemSelector) { content = content.find('.' + this.settings.nestedItemSelector); }
    content.filter(function () { return this.nodeType === 1; }).each($.proxy(function (index, item) { item = this.prepare(item); this.$stage.append(item); this._items.push(item); this._mergers.push(item.find('[data-merge]').addBack('[data-merge]').attr('data-merge') * 1 || 1); }, this)); this.reset(this.isNumeric(this.settings.startPosition) ? this.settings.startPosition : 0); this.invalidate('items');
  }; Owl.prototype.add = function (content, position) {
    var current = this.relative(this._current); position = position === undefined ? this._items.length : this.normalize(position, true); content = content instanceof jQuery ? content : $(content); this.trigger('add', { content: content, position: position }); content = this.prepare(content); if (this._items.length === 0 || position === this._items.length) { this._items.length === 0 && this.$stage.append(content); this._items.length !== 0 && this._items[position - 1].after(content); this._items.push(content); this._mergers.push(content.find('[data-merge]').addBack('[data-merge]').attr('data-merge') * 1 || 1); } else { this._items[position].before(content); this._items.splice(position, 0, content); this._mergers.splice(position, 0, content.find('[data-merge]').addBack('[data-merge]').attr('data-merge') * 1 || 1); }
    this._items[current] && this.reset(this._items[current].index()); this.invalidate('items'); this.trigger('added', { content: content, position: position });
  }; Owl.prototype.remove = function (position) {
    position = this.normalize(position, true); if (position === undefined) { return; }
    this.trigger('remove', { content: this._items[position], position: position }); this._items[position].remove(); this._items.splice(position, 1); this._mergers.splice(position, 1); this.invalidate('items'); this.trigger('removed', { content: null, position: position });
  }; Owl.prototype.preloadAutoWidthImages = function (images) { images.each($.proxy(function (i, element) { this.enter('pre-loading'); element = $(element); $(new Image()).one('load', $.proxy(function (e) { element.attr('src', e.target.src); element.css('opacity', 1); this.leave('pre-loading'); !this.is('pre-loading') && !this.is('initializing') && this.refresh(); }, this)).attr('src', element.attr('src') || element.attr('data-src') || element.attr('data-src-retina')); }, this)); }; Owl.prototype.destroy = function () {
    this.$element.off('.owl.core'); this.$stage.off('.owl.core'); $(document).off('.owl.core'); if (this.settings.responsive !== false) { window.clearTimeout(this.resizeTimer); this.off(window, 'resize', this._handlers.onThrottledResize); }
    for (var i in this._plugins) { this._plugins[i].destroy(); }
    this.$stage.children('.cloned').remove(); this.$stage.unwrap(); this.$stage.children().contents().unwrap(); this.$stage.children().unwrap(); this.$element.removeClass(this.options.refreshClass).removeClass(this.options.loadingClass).removeClass(this.options.loadedClass).removeClass(this.options.rtlClass).removeClass(this.options.dragClass).removeClass(this.options.grabClass).attr('class', this.$element.attr('class').replace(new RegExp(this.options.responsiveClass + '-\\S+\\s', 'g'), '')).removeData('owl.carousel');
  }; Owl.prototype.op = function (a, o, b) { var rtl = this.settings.rtl; switch (o) { case '<': return rtl ? a > b : a < b; case '>': return rtl ? a < b : a > b; case '>=': return rtl ? a <= b : a >= b; case '<=': return rtl ? a >= b : a <= b; default: break; } }; Owl.prototype.on = function (element, event, listener, capture) { if (element.addEventListener) { element.addEventListener(event, listener, capture); } else if (element.attachEvent) { element.attachEvent('on' + event, listener); } }; Owl.prototype.off = function (element, event, listener, capture) { if (element.removeEventListener) { element.removeEventListener(event, listener, capture); } else if (element.detachEvent) { element.detachEvent('on' + event, listener); } }; Owl.prototype.trigger = function (name, data, namespace, state, enter) {
    var status = { item: { count: this._items.length, index: this.current() } }, handler = $.camelCase($.grep(['on', name, namespace], function (v) { return v }).join('-').toLowerCase()), event = $.Event([name, 'owl', namespace || 'carousel'].join('.').toLowerCase(), $.extend({ relatedTarget: this }, status, data)); if (!this._supress[name]) { $.each(this._plugins, function (name, plugin) { if (plugin.onTrigger) { plugin.onTrigger(event); } }); this.register({ type: Owl.Type.Event, name: name }); this.$element.trigger(event); if (this.settings && typeof this.settings[handler] === 'function') { this.settings[handler].call(this, event); } }
    return event;
  }; Owl.prototype.enter = function (name) {
    $.each([name].concat(this._states.tags[name] || []), $.proxy(function (i, name) {
      if (this._states.current[name] === undefined) { this._states.current[name] = 0; }
      this._states.current[name]++;
    }, this));
  }; Owl.prototype.leave = function (name) { $.each([name].concat(this._states.tags[name] || []), $.proxy(function (i, name) { this._states.current[name]--; }, this)); }; Owl.prototype.register = function (object) {
    if (object.type === Owl.Type.Event) {
      if (!$.event.special[object.name]) { $.event.special[object.name] = {}; }
      if (!$.event.special[object.name].owl) {
        var _default = $.event.special[object.name]._default; $.event.special[object.name]._default = function (e) {
          if (_default && _default.apply && (!e.namespace || e.namespace.indexOf('owl') === -1)) { return _default.apply(this, arguments); }
          return e.namespace && e.namespace.indexOf('owl') > -1;
        }; $.event.special[object.name].owl = true;
      }
    } else if (object.type === Owl.Type.State) {
      if (!this._states.tags[object.name]) { this._states.tags[object.name] = object.tags; } else { this._states.tags[object.name] = this._states.tags[object.name].concat(object.tags); }
      this._states.tags[object.name] = $.grep(this._states.tags[object.name], $.proxy(function (tag, i) { return $.inArray(tag, this._states.tags[object.name]) === i; }, this));
    }
  }; Owl.prototype.suppress = function (events) { $.each(events, $.proxy(function (index, event) { this._supress[event] = true; }, this)); }; Owl.prototype.release = function (events) { $.each(events, $.proxy(function (index, event) { delete this._supress[event]; }, this)); }; Owl.prototype.pointer = function (event) {
    var result = { x: null, y: null }; event = event.originalEvent || event || window.event; event = event.touches && event.touches.length ? event.touches[0] : event.changedTouches && event.changedTouches.length ? event.changedTouches[0] : event; if (event.pageX) { result.x = event.pageX; result.y = event.pageY; } else { result.x = event.clientX; result.y = event.clientY; }
    return result;
  }; Owl.prototype.isNumeric = function (number) { return !isNaN(parseFloat(number)); }; Owl.prototype.difference = function (first, second) { return { x: first.x - second.x, y: first.y - second.y }; }; $.fn.owlCarousel = function (option) {
    var args = Array.prototype.slice.call(arguments, 1); return this.each(function () {
      var $this = $(this), data = $this.data('owl.carousel'); if (!data) { data = new Owl(this, typeof option == 'object' && option); $this.data('owl.carousel', data); $.each(['next', 'prev', 'to', 'destroy', 'refresh', 'replace', 'add', 'remove'], function (i, event) { data.register({ type: Owl.Type.Event, name: event }); data.$element.on(event + '.owl.carousel.core', $.proxy(function (e) { if (e.namespace && e.relatedTarget !== this) { this.suppress([event]); data[event].apply(this, [].slice.call(arguments, 1)); this.release([event]); } }, data)); }); }
      if (typeof option == 'string' && option.charAt(0) !== '_') { data[option].apply(data, args); }
    });
  }; $.fn.owlCarousel.Constructor = Owl;
})(window.Zepto || window.jQuery, window, document);; (function ($, window, document, undefined) {
  var AutoRefresh = function (carousel) { this._core = carousel; this._interval = null; this._visible = null; this._handlers = { 'initialized.owl.carousel': $.proxy(function (e) { if (e.namespace && this._core.settings.autoRefresh) { this.watch(); } }, this) }; this._core.options = $.extend({}, AutoRefresh.Defaults, this._core.options); this._core.$element.on(this._handlers); }; AutoRefresh.Defaults = { autoRefresh: true, autoRefreshInterval: 500 }; AutoRefresh.prototype.watch = function () {
    if (this._interval) { return; }
    this._visible = this._core.$element.is(':visible'); this._interval = window.setInterval($.proxy(this.refresh, this), this._core.settings.autoRefreshInterval);
  }; AutoRefresh.prototype.refresh = function () {
    if (this._core.$element.is(':visible') === this._visible) { return; }
    this._visible = !this._visible; this._core.$element.toggleClass('owl-hidden', !this._visible); this._visible && (this._core.invalidate('width') && this._core.refresh());
  }; AutoRefresh.prototype.destroy = function () {
    var handler, property; window.clearInterval(this._interval); for (handler in this._handlers) { this._core.$element.off(handler, this._handlers[handler]); }
    for (property in Object.getOwnPropertyNames(this)) { typeof this[property] != 'function' && (this[property] = null); }
  }; $.fn.owlCarousel.Constructor.Plugins.AutoRefresh = AutoRefresh;
})(window.Zepto || window.jQuery, window, document);; (function ($, window, document, undefined) {
  var Lazy = function (carousel) {
    this._core = carousel; this._loaded = []; this._handlers = {
      'initialized.owl.carousel change.owl.carousel resized.owl.carousel': $.proxy(function (e) {
        if (!e.namespace) { return; }
        if (!this._core.settings || !this._core.settings.lazyLoad) { return; }
        if ((e.property && e.property.name == 'position') || e.type == 'initialized') { var settings = this._core.settings, n = (settings.center && Math.ceil(settings.items / 2) || settings.items), i = ((settings.center && n * -1) || 0), position = (e.property && e.property.value !== undefined ? e.property.value : this._core.current()) + i, clones = this._core.clones().length, load = $.proxy(function (i, v) { this.load(v) }, this); while (i++ < n) { this.load(clones / 2 + this._core.relative(position)); clones && $.each(this._core.clones(this._core.relative(position)), load); position++; } }
      }, this)
    }; this._core.options = $.extend({}, Lazy.Defaults, this._core.options); this._core.$element.on(this._handlers);
  }; Lazy.Defaults = { lazyLoad: false }; Lazy.prototype.load = function (position) {
    var $item = this._core.$stage.children().eq(position), $elements = $item && $item.find('.owl-lazy'); if (!$elements || $.inArray($item.get(0), this._loaded) > -1) { return; }
    $elements.each($.proxy(function (index, element) { var $element = $(element), image, url = (window.devicePixelRatio > 1 && $element.attr('data-src-retina')) || $element.attr('data-src'); this._core.trigger('load', { element: $element, url: url }, 'lazy'); if ($element.is('img')) { $element.one('load.owl.lazy', $.proxy(function () { $element.css('opacity', 1); this._core.trigger('loaded', { element: $element, url: url }, 'lazy'); }, this)).attr('src', url); } else { image = new Image(); image.onload = $.proxy(function () { $element.css({ 'background-image': 'url("' + url + '")', 'opacity': '1' }); this._core.trigger('loaded', { element: $element, url: url }, 'lazy'); }, this); image.src = url; } }, this)); this._loaded.push($item.get(0));
  }; Lazy.prototype.destroy = function () {
    var handler, property; for (handler in this.handlers) { this._core.$element.off(handler, this.handlers[handler]); }
    for (property in Object.getOwnPropertyNames(this)) { typeof this[property] != 'function' && (this[property] = null); }
  }; $.fn.owlCarousel.Constructor.Plugins.Lazy = Lazy;
})(window.Zepto || window.jQuery, window, document);; (function ($, window, document, undefined) {
  var AutoHeight = function (carousel) { this._core = carousel; this._handlers = { 'initialized.owl.carousel refreshed.owl.carousel': $.proxy(function (e) { if (e.namespace && this._core.settings.autoHeight) { this.update(); } }, this), 'changed.owl.carousel': $.proxy(function (e) { if (e.namespace && this._core.settings.autoHeight && e.property.name == 'position') { this.update(); } }, this), 'loaded.owl.lazy': $.proxy(function (e) { if (e.namespace && this._core.settings.autoHeight && e.element.closest('.' + this._core.settings.itemClass).index() === this._core.current()) { this.update(); } }, this) }; this._core.options = $.extend({}, AutoHeight.Defaults, this._core.options); this._core.$element.on(this._handlers); }; AutoHeight.Defaults = { autoHeight: false, autoHeightClass: 'owl-height' }; AutoHeight.prototype.update = function () { var start = this._core._current, end = start + this._core.settings.items, visible = this._core.$stage.children().toArray().slice(start, end), heights = [], maxheight = 0; $.each(visible, function (index, item) { heights.push($(item).height()); }); maxheight = Math.max.apply(null, heights); this._core.$stage.parent().height(maxheight).addClass(this._core.settings.autoHeightClass); }; AutoHeight.prototype.destroy = function () {
    var handler, property; for (handler in this._handlers) { this._core.$element.off(handler, this._handlers[handler]); }
    for (property in Object.getOwnPropertyNames(this)) { typeof this[property] != 'function' && (this[property] = null); }
  }; $.fn.owlCarousel.Constructor.Plugins.AutoHeight = AutoHeight;
})(window.Zepto || window.jQuery, window, document);; (function ($, window, document, undefined) {
  var Video = function (carousel) {
    this._core = carousel; this._videos = {}; this._playing = null; this._handlers = {
      'initialized.owl.carousel': $.proxy(function (e) { if (e.namespace) { this._core.register({ type: 'state', name: 'playing', tags: ['interacting'] }); } }, this), 'resize.owl.carousel': $.proxy(function (e) { if (e.namespace && this._core.settings.video && this.isInFullScreen()) { e.preventDefault(); } }, this), 'refreshed.owl.carousel': $.proxy(function (e) { if (e.namespace && this._core.is('resizing')) { this._core.$stage.find('.cloned .owl-video-frame').remove(); } }, this), 'changed.owl.carousel': $.proxy(function (e) { if (e.namespace && e.property.name === 'position' && this._playing) { this.stop(); } }, this), 'prepared.owl.carousel': $.proxy(function (e) {
        if (!e.namespace) { return; }
        var $element = $(e.content).find('.owl-video'); if ($element.length) { $element.css('display', 'none'); this.fetch($element, $(e.content)); }
      }, this)
    }; this._core.options = $.extend({}, Video.Defaults, this._core.options); this._core.$element.on(this._handlers); this._core.$element.on('click.owl.video', '.owl-video-play-icon', $.proxy(function (e) { this.play(e); }, this));
  }; Video.Defaults = { video: false, videoHeight: false, videoWidth: false }; Video.prototype.fetch = function (target, item) {
    var type = (function () { if (target.attr('data-vimeo-id')) { return 'vimeo'; } else if (target.attr('data-vzaar-id')) { return 'vzaar' } else { return 'youtube'; } })(), id = target.attr('data-vimeo-id') || target.attr('data-youtube-id') || target.attr('data-vzaar-id'), width = target.attr('data-width') || this._core.settings.videoWidth, height = target.attr('data-height') || this._core.settings.videoHeight, url = target.attr('href'); if (url) {
      id = url.match(/(http:|https:|)\/\/(player.|www.|app.)?(vimeo\.com|youtu(be\.com|\.be|be\.googleapis\.com)|vzaar\.com)\/(video\/|videos\/|embed\/|channels\/.+\/|groups\/.+\/|watch\?v=|v\/)?([A-Za-z0-9._%-]*)(\&\S+)?/); if (id[3].indexOf('youtu') > -1) { type = 'youtube'; } else if (id[3].indexOf('vimeo') > -1) { type = 'vimeo'; } else if (id[3].indexOf('vzaar') > -1) { type = 'vzaar'; } else { throw new Error('Video URL not supported.'); }
      id = id[6];
    } else { throw new Error('Missing video URL.'); }
    this._videos[url] = { type: type, id: id, width: width, height: height }; item.attr('data-video', url); this.thumbnail(target, this._videos[url]);
  }; Video.prototype.thumbnail = function (target, video) {
    var tnLink, icon, path, dimensions = video.width && video.height ? 'style="width:' + video.width + 'px;height:' + video.height + 'px;"' : '', customTn = target.find('img'), srcType = 'src', lazyClass = '', settings = this._core.settings, create = function (path) {
      icon = '<div class="owl-video-play-icon"></div>'; if (settings.lazyLoad) { tnLink = '<div class="owl-video-tn ' + lazyClass + '" ' + srcType + '="' + path + '"></div>'; } else { tnLink = '<div class="owl-video-tn" style="opacity:1;background-image:url(' + path + ')"></div>'; }
      target.after(tnLink); target.after(icon);
    }; target.wrap('<div class="owl-video-wrapper"' + dimensions + '></div>'); if (this._core.settings.lazyLoad) { srcType = 'data-src'; lazyClass = 'owl-lazy'; }
    if (customTn.length) { create(customTn.attr(srcType)); customTn.remove(); return false; }
    if (video.type === 'youtube') { path = "//img.youtube.com/vi/" + video.id + "/hqdefault.jpg"; create(path); } else if (video.type === 'vimeo') { $.ajax({ type: 'GET', url: '//vimeo.com/api/v2/video/' + video.id + '.json', jsonp: 'callback', dataType: 'jsonp', success: function (data) { path = data[0].thumbnail_large; create(path); } }); } else if (video.type === 'vzaar') { $.ajax({ type: 'GET', url: '//vzaar.com/api/videos/' + video.id + '.json', jsonp: 'callback', dataType: 'jsonp', success: function (data) { path = data.framegrab_url; create(path); } }); }
  }; Video.prototype.stop = function () { this._core.trigger('stop', null, 'video'); this._playing.find('.owl-video-frame').remove(); this._playing.removeClass('owl-video-playing'); this._playing = null; this._core.leave('playing'); this._core.trigger('stopped', null, 'video'); }; Video.prototype.play = function (event) {
    var target = $(event.target), item = target.closest('.' + this._core.settings.itemClass), video = this._videos[item.attr('data-video')], width = video.width || '100%', height = video.height || this._core.$stage.height(), html; if (this._playing) { return; }
    this._core.enter('playing'); this._core.trigger('play', null, 'video'); item = this._core.items(this._core.relative(item.index())); this._core.reset(item.index()); if (video.type === 'youtube') {
      html = '<iframe width="' + width + '" height="' + height + '" src="//www.youtube.com/embed/' +
        video.id + '?autoplay=1&rel=0&v=' + video.id + '" frameborder="0" allowfullscreen></iframe>';
    } else if (video.type === 'vimeo') { html = '<iframe src="//player.vimeo.com/video/' + video.id + '?autoplay=1" width="' + width + '" height="' + height + '" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>'; } else if (video.type === 'vzaar') { html = '<iframe frameborder="0"' + 'height="' + height + '"' + 'width="' + width + '" allowfullscreen mozallowfullscreen webkitAllowFullScreen ' + 'src="//view.vzaar.com/' + video.id + '/player?autoplay=true"></iframe>'; }
    $('<div class="owl-video-frame">' + html + '</div>').insertAfter(item.find('.owl-video')); this._playing = item.addClass('owl-video-playing');
  }; Video.prototype.isInFullScreen = function () { var element = document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement; return element && $(element).parent().hasClass('owl-video-frame'); }; Video.prototype.destroy = function () {
    var handler, property; this._core.$element.off('click.owl.video'); for (handler in this._handlers) { this._core.$element.off(handler, this._handlers[handler]); }
    for (property in Object.getOwnPropertyNames(this)) { typeof this[property] != 'function' && (this[property] = null); }
  }; $.fn.owlCarousel.Constructor.Plugins.Video = Video;
})(window.Zepto || window.jQuery, window, document);; (function ($, window, document, undefined) {
  var Animate = function (scope) { this.core = scope; this.core.options = $.extend({}, Animate.Defaults, this.core.options); this.swapping = true; this.previous = undefined; this.next = undefined; this.handlers = { 'change.owl.carousel': $.proxy(function (e) { if (e.namespace && e.property.name == 'position') { this.previous = this.core.current(); this.next = e.property.value; } }, this), 'drag.owl.carousel dragged.owl.carousel translated.owl.carousel': $.proxy(function (e) { if (e.namespace) { this.swapping = e.type == 'translated'; } }, this), 'translate.owl.carousel': $.proxy(function (e) { if (e.namespace && this.swapping && (this.core.options.animateOut || this.core.options.animateIn)) { this.swap(); } }, this) }; this.core.$element.on(this.handlers); }; Animate.Defaults = { animateOut: false, animateIn: false }; Animate.prototype.swap = function () {
    if (this.core.settings.items !== 1) { return; }
    if (!$.support.animation || !$.support.transition) { return; }
    this.core.speed(0); var left, clear = $.proxy(this.clear, this), previous = this.core.$stage.children().eq(this.previous), next = this.core.$stage.children().eq(this.next), incoming = this.core.settings.animateIn, outgoing = this.core.settings.animateOut; if (this.core.current() === this.previous) { return; }
    if (outgoing) { left = this.core.coordinates(this.previous) - this.core.coordinates(this.next); previous.one($.support.animation.end, clear).css({ 'left': left + 'px' }).addClass('animated owl-animated-out').addClass(outgoing); }
    if (incoming) { next.one($.support.animation.end, clear).addClass('animated owl-animated-in').addClass(incoming); }
  }; Animate.prototype.clear = function (e) { $(e.target).css({ 'left': '' }).removeClass('animated owl-animated-out owl-animated-in').removeClass(this.core.settings.animateIn).removeClass(this.core.settings.animateOut); this.core.onTransitionEnd(); }; Animate.prototype.destroy = function () {
    var handler, property; for (handler in this.handlers) { this.core.$element.off(handler, this.handlers[handler]); }
    for (property in Object.getOwnPropertyNames(this)) { typeof this[property] != 'function' && (this[property] = null); }
  }; $.fn.owlCarousel.Constructor.Plugins.Animate = Animate;
})(window.Zepto || window.jQuery, window, document);; (function ($, window, document, undefined) {
  var Autoplay = function (carousel) { this._core = carousel; this._timeout = null; this._paused = false; this._handlers = { 'changed.owl.carousel': $.proxy(function (e) { if (e.namespace && e.property.name === 'settings') { if (this._core.settings.autoplay) { this.play(); } else { this.stop(); } } else if (e.namespace && e.property.name === 'position') { if (this._core.settings.autoplay) { this._setAutoPlayInterval(); } } }, this), 'initialized.owl.carousel': $.proxy(function (e) { if (e.namespace && this._core.settings.autoplay) { this.play(); } }, this), 'play.owl.autoplay': $.proxy(function (e, t, s) { if (e.namespace) { this.play(t, s); } }, this), 'stop.owl.autoplay': $.proxy(function (e) { if (e.namespace) { this.stop(); } }, this), 'mouseover.owl.autoplay': $.proxy(function () { if (this._core.settings.autoplayHoverPause && this._core.is('rotating')) { this.pause(); } }, this), 'mouseleave.owl.autoplay': $.proxy(function () { if (this._core.settings.autoplayHoverPause && this._core.is('rotating')) { this.play(); } }, this), 'touchstart.owl.core': $.proxy(function () { if (this._core.settings.autoplayHoverPause && this._core.is('rotating')) { this.pause(); } }, this), 'touchend.owl.core': $.proxy(function () { if (this._core.settings.autoplayHoverPause) { this.play(); } }, this) }; this._core.$element.on(this._handlers); this._core.options = $.extend({}, Autoplay.Defaults, this._core.options); }; Autoplay.Defaults = { autoplay: false, autoplayTimeout: 5000, autoplayHoverPause: false, autoplaySpeed: false }; Autoplay.prototype.play = function (timeout, speed) {
    this._paused = false; if (this._core.is('rotating')) { return; }
    this._core.enter('rotating'); this._setAutoPlayInterval();
  }; Autoplay.prototype._getNextTimeout = function (timeout, speed) {
    if (this._timeout) { window.clearTimeout(this._timeout); }
    return window.setTimeout($.proxy(function () {
      if (this._paused || this._core.is('busy') || this._core.is('interacting') || document.hidden) { return; }
      this._core.next(speed || this._core.settings.autoplaySpeed);
    }, this), timeout || this._core.settings.autoplayTimeout);
  }; Autoplay.prototype._setAutoPlayInterval = function () { this._timeout = this._getNextTimeout(); }; Autoplay.prototype.stop = function () {
    if (!this._core.is('rotating')) { return; }
    window.clearTimeout(this._timeout); this._core.leave('rotating');
  }; Autoplay.prototype.pause = function () {
    if (!this._core.is('rotating')) { return; }
    this._paused = true;
  }; Autoplay.prototype.destroy = function () {
    var handler, property; this.stop(); for (handler in this._handlers) { this._core.$element.off(handler, this._handlers[handler]); }
    for (property in Object.getOwnPropertyNames(this)) { typeof this[property] != 'function' && (this[property] = null); }
  }; $.fn.owlCarousel.Constructor.Plugins.autoplay = Autoplay;
})(window.Zepto || window.jQuery, window, document);; (function ($, window, document, undefined) {
  'use strict'; var Navigation = function (carousel) {
    this._core = carousel; this._initialized = false; this._pages = []; this._controls = {}; this._templates = []; this.$element = this._core.$element; this._overrides = { next: this._core.next, prev: this._core.prev, to: this._core.to }; this._handlers = {
      'prepared.owl.carousel': $.proxy(function (e) {
        if (e.namespace && this._core.settings.dotsData) {
          this._templates.push('<div class="' + this._core.settings.dotClass + '">' +
            $(e.content).find('[data-dot]').addBack('[data-dot]').attr('data-dot') + '</div>');
        }
      }, this), 'added.owl.carousel': $.proxy(function (e) { if (e.namespace && this._core.settings.dotsData) { this._templates.splice(e.position, 0, this._templates.pop()); } }, this), 'remove.owl.carousel': $.proxy(function (e) { if (e.namespace && this._core.settings.dotsData) { this._templates.splice(e.position, 1); } }, this), 'changed.owl.carousel': $.proxy(function (e) { if (e.namespace && e.property.name == 'position') { this.draw(); } }, this), 'initialized.owl.carousel': $.proxy(function (e) { if (e.namespace && !this._initialized) { this._core.trigger('initialize', null, 'navigation'); this.initialize(); this.update(); this.draw(); this._initialized = true; this._core.trigger('initialized', null, 'navigation'); } }, this), 'refreshed.owl.carousel': $.proxy(function (e) { if (e.namespace && this._initialized) { this._core.trigger('refresh', null, 'navigation'); this.update(); this.draw(); this._core.trigger('refreshed', null, 'navigation'); } }, this)
    }; this._core.options = $.extend({}, Navigation.Defaults, this._core.options); this.$element.on(this._handlers);
  }; Navigation.Defaults = { nav: false, navText: ['prev', 'next'], navSpeed: false, navElement: 'div', navContainer: false, navContainerClass: 'owl-nav', navClass: ['owl-prev', 'owl-next'], slideBy: 1, dotClass: 'owl-dot', dotsClass: 'owl-dots', dots: true, dotsEach: false, dotsData: false, dotsSpeed: false, dotsContainer: false }; Navigation.prototype.initialize = function () {
    var override, settings = this._core.settings; this._controls.$relative = (settings.navContainer ? $(settings.navContainer) : $('<div>').addClass(settings.navContainerClass).appendTo(this.$element)).addClass('disabled'); this._controls.$previous = $('<' + settings.navElement + '>').addClass(settings.navClass[0]).html(settings.navText[0]).prependTo(this._controls.$relative).on('click', $.proxy(function (e) { this.prev(settings.navSpeed); }, this)); this._controls.$next = $('<' + settings.navElement + '>').addClass(settings.navClass[1]).html(settings.navText[1]).appendTo(this._controls.$relative).on('click', $.proxy(function (e) { this.next(settings.navSpeed); }, this)); if (!settings.dotsData) { this._templates = [$('<div>').addClass(settings.dotClass).append($('<span>')).prop('outerHTML')]; }
    this._controls.$absolute = (settings.dotsContainer ? $(settings.dotsContainer) : $('<div>').addClass(settings.dotsClass).appendTo(this.$element)).addClass('disabled'); this._controls.$absolute.on('click', 'div', $.proxy(function (e) { var index = $(e.target).parent().is(this._controls.$absolute) ? $(e.target).index() : $(e.target).parent().index(); e.preventDefault(); this.to(index, settings.dotsSpeed); }, this)); for (override in this._overrides) { this._core[override] = $.proxy(this[override], this); }
  }; Navigation.prototype.destroy = function () {
    var handler, control, property, override; for (handler in this._handlers) { this.$element.off(handler, this._handlers[handler]); }
    for (control in this._controls) { this._controls[control].remove(); }
    for (override in this.overides) { this._core[override] = this._overrides[override]; }
    for (property in Object.getOwnPropertyNames(this)) { typeof this[property] != 'function' && (this[property] = null); }
  }; Navigation.prototype.update = function () {
    var i, j, k, lower = this._core.clones().length / 2, upper = lower + this._core.items().length, maximum = this._core.maximum(true), settings = this._core.settings, size = settings.center || settings.autoWidth || settings.dotsData ? 1 : settings.dotsEach || settings.items; if (settings.slideBy !== 'page') { settings.slideBy = Math.min(settings.slideBy, settings.items); }
    if (settings.dots || settings.slideBy == 'page') {
      this._pages = []; for (i = lower, j = 0, k = 0; i < upper; i++) {
        if (j >= size || j === 0) {
          this._pages.push({ start: Math.min(maximum, i - lower), end: i - lower + size - 1 }); if (Math.min(maximum, i - lower) === maximum) { break; }
          j = 0, ++k;
        }
        j += this._core.mergers(this._core.relative(i));
      }
    }
  }; Navigation.prototype.draw = function () {
    var difference, settings = this._core.settings, disabled = this._core.items().length <= settings.items, index = this._core.relative(this._core.current()), loop = settings.loop || settings.rewind; this._controls.$relative.toggleClass('disabled', !settings.nav || disabled); if (settings.nav) { this._controls.$previous.toggleClass('disabled', !loop && index <= this._core.minimum(true)); this._controls.$next.toggleClass('disabled', !loop && index >= this._core.maximum(true)); }
    this._controls.$absolute.toggleClass('disabled', !settings.dots || disabled); if (settings.dots) {
      difference = this._pages.length - this._controls.$absolute.children().length; if (settings.dotsData && difference !== 0) { this._controls.$absolute.html(this._templates.join('')); } else if (difference > 0) { this._controls.$absolute.append(new Array(difference + 1).join(this._templates[0])); } else if (difference < 0) { this._controls.$absolute.children().slice(difference).remove(); }
      this._controls.$absolute.find('.active').removeClass('active'); this._controls.$absolute.children().eq($.inArray(this.current(), this._pages)).addClass('active');
    }
  }; Navigation.prototype.onTrigger = function (event) { var settings = this._core.settings; event.page = { index: $.inArray(this.current(), this._pages), count: this._pages.length, size: settings && (settings.center || settings.autoWidth || settings.dotsData ? 1 : settings.dotsEach || settings.items) }; }; Navigation.prototype.current = function () { var current = this._core.relative(this._core.current()); return $.grep(this._pages, $.proxy(function (page, index) { return page.start <= current && page.end >= current; }, this)).pop(); }; Navigation.prototype.getPosition = function (successor) {
    var position, length, settings = this._core.settings; if (settings.slideBy == 'page') { position = $.inArray(this.current(), this._pages); length = this._pages.length; successor ? ++position : --position; position = this._pages[((position % length) + length) % length].start; } else { position = this._core.relative(this._core.current()); length = this._core.items().length; successor ? position += settings.slideBy : position -= settings.slideBy; }
    return position;
  }; Navigation.prototype.next = function (speed) { $.proxy(this._overrides.to, this._core)(this.getPosition(true), speed); }; Navigation.prototype.prev = function (speed) { $.proxy(this._overrides.to, this._core)(this.getPosition(false), speed); }; Navigation.prototype.to = function (position, speed, standard) { var length; if (!standard && this._pages.length) { length = this._pages.length; $.proxy(this._overrides.to, this._core)(this._pages[((position % length) + length) % length].start, speed); } else { $.proxy(this._overrides.to, this._core)(position, speed); } }; $.fn.owlCarousel.Constructor.Plugins.Navigation = Navigation;
})(window.Zepto || window.jQuery, window, document);; (function ($, window, document, undefined) {
  'use strict'; var Hash = function (carousel) {
    this._core = carousel; this._hashes = {}; this.$element = this._core.$element; this._handlers = {
      'initialized.owl.carousel': $.proxy(function (e) { if (e.namespace && this._core.settings.startPosition === 'URLHash') { $(window).trigger('hashchange.owl.navigation'); } }, this), 'prepared.owl.carousel': $.proxy(function (e) {
        if (e.namespace) {
          var hash = $(e.content).find('[data-hash]').addBack('[data-hash]').attr('data-hash'); if (!hash) { return; }
          this._hashes[hash] = e.content;
        }
      }, this), 'changed.owl.carousel': $.proxy(function (e) {
        if (e.namespace && e.property.name === 'position') {
          var current = this._core.items(this._core.relative(this._core.current())), hash = $.map(this._hashes, function (item, hash) { return item === current ? hash : null; }).join(); if (!hash || window.location.hash.slice(1) === hash) { return; }
          window.location.hash = hash;
        }
      }, this)
    }; this._core.options = $.extend({}, Hash.Defaults, this._core.options); this.$element.on(this._handlers); $(window).on('hashchange.owl.navigation', $.proxy(function (e) {
      var hash = window.location.hash.substring(1), items = this._core.$stage.children(), position = this._hashes[hash] && items.index(this._hashes[hash]); if (position === undefined || position === this._core.current()) { return; }
      this._core.to(this._core.relative(position), false, true);
    }, this));
  }; Hash.Defaults = { URLhashListener: false }; Hash.prototype.destroy = function () {
    var handler, property; $(window).off('hashchange.owl.navigation'); for (handler in this._handlers) { this._core.$element.off(handler, this._handlers[handler]); }
    for (property in Object.getOwnPropertyNames(this)) { typeof this[property] != 'function' && (this[property] = null); }
  }; $.fn.owlCarousel.Constructor.Plugins.Hash = Hash;
})(window.Zepto || window.jQuery, window, document);; (function ($, window, document, undefined) {
  var style = $('<support>').get(0).style, prefixes = 'Webkit Moz O ms'.split(' '), events = { transition: { end: { WebkitTransition: 'webkitTransitionEnd', MozTransition: 'transitionend', OTransition: 'oTransitionEnd', transition: 'transitionend' } }, animation: { end: { WebkitAnimation: 'webkitAnimationEnd', MozAnimation: 'animationend', OAnimation: 'oAnimationEnd', animation: 'animationend' } } }, tests = { csstransforms: function () { return !!test('transform'); }, csstransforms3d: function () { return !!test('perspective'); }, csstransitions: function () { return !!test('transition'); }, cssanimations: function () { return !!test('animation'); } }; function test(property, prefixed) { var result = false, upper = property.charAt(0).toUpperCase() + property.slice(1); $.each((property + ' ' + prefixes.join(upper + ' ') + upper).split(' '), function (i, property) { if (style[property] !== undefined) { result = prefixed ? property : true; return false; } }); return result; }
  function prefixed(property) { return test(property, true); }
  if (tests.csstransitions()) {
    $.support.transition = new String(prefixed('transition'))
    $.support.transition.end = events.transition.end[$.support.transition];
  }
  if (tests.cssanimations()) {
    $.support.animation = new String(prefixed('animation'))
    $.support.animation.end = events.animation.end[$.support.animation];
  }
  if (tests.csstransforms()) { $.support.transform = new String(prefixed('transform')); $.support.transform3d = tests.csstransforms3d(); }
})(window.Zepto || window.jQuery, window, document);
jQuery(function ($) {
  $('.header__menu > li > a').on('mouseover', function () { var elem = $(this).closest('li'); $('.sub-menu').removeClass('active'); $('.sub-menu', elem).addClass('active'); }); $('.header__menu').on('mouseleave', function () { var elem = $(this); var timeout = setTimeout(function () { $('.sub-menu', elem).removeClass('active'); }, 300); }); $('body').on('touchstart', function (e) { if (!($(e.target).closest('.header__menu').length > 0) && !($('.header__menu-toggle').is(':visible'))) { $('.sub-menu').removeClass('active'); } }); $('.global__popup').magnificPopup({ type: 'inline' }); $('.home__eula-checkbox').on('change', function () { var form = $(this).closest('form'); $('.home__cta', form).toggleClass('disabled', !$(this).is(':checked')); }); $('.global__phone').mask('+7 (000) 000-00-00'); $('.global__time').mask('00:00'); $('.global__input-increment').on('click', function (e) {
    e.preventDefault(); var input = $(this).siblings('.global__input, .home__input'); var value = input.val(); var hours = value.match(/.+?(?=:)/); if (!hours) { input.val('12:00'); return; }
    if ((hours == 11 && $(this).hasClass('dec')) || (hours == 22 && !$(this).hasClass('dec'))) { return; }
    update = ($(this).hasClass('dec')) ? parseInt(hours) - 1 : parseInt(hours) + 1; input.val(value.replace(hours + ':', update + ':'));
  }); $('.header__menu-toggle').on('click', function (e) { e.preventDefault(); $(this).toggleClass('active'); $('.header__menu').fadeToggle('fast').toggleClass('active') }); $(window).on('scroll', function () {
    if ($(this).width() > 767) { return; }
    $('.header__menu-toggle').removeClass('active'); $('.header__menu').fadeOut('fast').removeClass('active');
  }); $('.global__form-eula').on('click', function (e) { e.preventDefault(); $(this).toggleClass('active'); $(this).closest('form').find('[type="submit"]').prop('disabled', !$(this).hasClass('active')); }); $('.global__form-legal').on('click', function (e) {
    if ($(e.target).is('a, a *')) { return; }
    $('.global__form-eula').trigger('click');
  }); $('.index__portfolio-slider').owlCarousel({ items: 1, slideBy: 1, loop: true, margin: 0, nav: true, navText: false }); $('.case__slider').owlCarousel({ items: 1, slideBy: 1, loop: true, margin: 0, nav: true, navText: false, dots: false, }); $('.index__testimonials-slider').owlCarousel({ responsive: { 0: { items: 1, slideBy: 1, }, 700: { items: 2, slideBy: 2, }, 900: { items: 3, slideBy: 3, } }, loop: true, margin: 10, nav: true, navText: false });
  $('.presentations__slider').owlCarousel({ 
    responsive: { 
      0: { items: 1, slideBy: 1, center: false }, 
      766: { items: 4, slideBy: 4, startPosition: 0 }, }, 
      loop: true, 
      smartSpeed: 250,
      nav: true, 
      navText: false, 
      dots: true, 
      margin: 15, }); 
      $('.presentations__portfolio-item').on('click', function (e) { e.preventDefault(); var container = $(this).attr('data-target'); var gallery = []; $('img', container).each(function (key, value) { gallery.push({ href: $(value).attr('data-src') }); }); $.swipebox(gallery); }); $('.portfolio__filter-item').on('click', function (e) { e.preventDefault(); var elem = $(this); $('.portfolio__filter-item').removeClass('active'); elem.addClass('active'); var type = elem.attr('data-type'); $('.portfolio__case').each(function () { $(this).addClass('hidden'); if ($(this).attr('data-types').indexOf(type) !== -1) { $(this).removeClass('hidden'); } }); }); function setPortfoliCategory() {
    var category = getQueryVar('category'); if ($('.portfolio__filter').length === 0 || !category) { return; }
    $('[data-type="' + category + '"]').trigger('click');
  }
  setPortfoliCategory(); function getQueryVar(name) {
    var query = window.location.search.substring(1); var vars = query.split("&"); for (var i = 0; i < vars.length; i++) { var pair = vars[i].split("="); if (pair[0] == name) { return pair[1]; } }
    return false;
  }
  $('.global__ajax-form').on('submit', function (e) {
    e.preventDefault(); var form = $(this); var valid = true; $('.global__ajax-required', form).each(function () { if (!$(this).val()) { $(this).addClass('invalid').on('input', function () { $(this).removeClass('invalid'); }); valid = false; } }); if (!valid) { return; }
    var formData = $(this).serialize(); $.post('/form-handler.php', formData, function (data) { $('input:not([type="checkbox"]):not([type="submit"]), textarea', form).val('').focus().blur(); alert('Ð—Ð°ÑÐ²ÐºÐ° Ð¾Ñ‚Ð¿Ñ€Ð°Ð²Ð»ÐµÐ½Ð°.'); });
  }); $('.global__submit').on('click', function (e) { e.preventDefault(); $(this).closest('form').submit(); });
});
/*! This file is auto-generated */
!function (d, l) { "use strict"; var e = !1, o = !1; if (l.querySelector) if (d.addEventListener) e = !0; if (d.wp = d.wp || {}, !d.wp.receiveEmbedMessage) if (d.wp.receiveEmbedMessage = function (e) { var t = e.data; if (t) if (t.secret || t.message || t.value) if (!/[^a-zA-Z0-9]/.test(t.secret)) { var r, a, i, s, n, o = l.querySelectorAll('iframe[data-secret="' + t.secret + '"]'), c = l.querySelectorAll('blockquote[data-secret="' + t.secret + '"]'); for (r = 0; r < c.length; r++)c[r].style.display = "none"; for (r = 0; r < o.length; r++)if (a = o[r], e.source === a.contentWindow) { if (a.removeAttribute("style"), "height" === t.message) { if (1e3 < (i = parseInt(t.value, 10))) i = 1e3; else if (~~i < 200) i = 200; a.height = i } if ("link" === t.message) if (s = l.createElement("a"), n = l.createElement("a"), s.href = a.getAttribute("src"), n.href = t.value, n.host === s.host) if (l.activeElement === a) d.top.location.href = t.value } } }, e) d.addEventListener("message", d.wp.receiveEmbedMessage, !1), l.addEventListener("DOMContentLoaded", t, !1), d.addEventListener("load", t, !1); function t() { if (!o) { o = !0; var e, t, r, a, i = -1 !== navigator.appVersion.indexOf("MSIE 10"), s = !!navigator.userAgent.match(/Trident.*rv:11\./), n = l.querySelectorAll("iframe.wp-embedded-content"); for (t = 0; t < n.length; t++) { if (!(r = n[t]).getAttribute("data-secret")) a = Math.random().toString(36).substr(2, 10), r.src += "#?secret=" + a, r.setAttribute("data-secret", a); if (i || s) (e = r.cloneNode(!0)).removeAttribute("security"), r.parentNode.replaceChild(e, r) } } } }(window, document);