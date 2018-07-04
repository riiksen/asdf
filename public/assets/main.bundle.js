/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/assets";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _amber = __webpack_require__(1);

var _amber2 = _interopRequireDefault(_amber);

__webpack_require__(2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

if (!Date.prototype.toGranite) {
  (function () {

    function pad(number) {
      if (number < 10) {
        return '0' + number;
      }
      return number;
    }

    Date.prototype.toGranite = function () {
      return this.getUTCFullYear() + '-' + pad(this.getUTCMonth() + 1) + '-' + pad(this.getUTCDate()) + ' ' + pad(this.getUTCHours()) + ':' + pad(this.getUTCMinutes()) + ':' + pad(this.getUTCSeconds());
    };
  })();
}

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var EVENTS = {
  join: 'join',
  leave: 'leave',
  message: 'message'
};
var STALE_CONNECTION_THRESHOLD_SECONDS = 100;
var SOCKET_POLLING_RATE = 10000;

/**
 * Returns a numeric value for the current time
 */
var now = function now() {
  return new Date().getTime();
};

/**
 * Returns the difference between the current time and passed `time` in seconds
 * @param {Number|Date} time - A numeric time or date object
 */
var secondsSince = function secondsSince(time) {
  return (now() - time) / 1000;
};

/**
 * Class for channel related functions (joining, leaving, subscribing and sending messages)
 */

var Channel = exports.Channel = function () {
  /**
   * @param {String} topic - topic to subscribe to
   * @param {Socket} socket - A Socket instance
   */
  function Channel(topic, socket) {
    _classCallCheck(this, Channel);

    this.topic = topic;
    this.socket = socket;
    this.onMessageHandlers = [];
  }

  /**
   * Join a channel, subscribe to all channels messages
   */


  _createClass(Channel, [{
    key: 'join',
    value: function join() {
      this.socket.ws.send(JSON.stringify({ event: EVENTS.join, topic: this.topic }));
    }

    /**
     * Leave a channel, stop subscribing to channel messages
     */

  }, {
    key: 'leave',
    value: function leave() {
      this.socket.ws.send(JSON.stringify({ event: EVENTS.leave, topic: this.topic }));
    }

    /**
     * Calls all message handlers with a matching subject
     */

  }, {
    key: 'handleMessage',
    value: function handleMessage(msg) {
      this.onMessageHandlers.forEach(function (handler) {
        if (handler.subject === msg.subject) handler.callback(msg.payload);
      });
    }

    /**
     * Subscribe to a channel subject
     * @param {String} subject - subject to listen for: `msg:new`
     * @param {function} callback - callback function when a new message arrives
     */

  }, {
    key: 'on',
    value: function on(subject, callback) {
      this.onMessageHandlers.push({ subject: subject, callback: callback });
    }

    /**
     * Send a new message to the channel
     * @param {String} subject - subject to send message to: `msg:new`
     * @param {Object} payload - payload object: `{message: 'hello'}`
     */

  }, {
    key: 'push',
    value: function push(subject, payload) {
      this.socket.ws.send(JSON.stringify({ event: EVENTS.message, topic: this.topic, subject: subject, payload: payload }));
    }
  }]);

  return Channel;
}();

/**
 * Class for maintaining connection with server and maintaining channels list
 */


var Socket = exports.Socket = function () {
  /**
   * @param {String} endpoint - Websocket endpont used in routes.cr file
   */
  function Socket(endpoint) {
    _classCallCheck(this, Socket);

    this.endpoint = endpoint;
    this.ws = null;
    this.channels = [];
    this.lastPing = now();
    this.reconnectTries = 0;
    this.attemptReconnect = true;
  }

  /**
   * Returns whether or not the last received ping has been past the threshold
   */


  _createClass(Socket, [{
    key: '_connectionIsStale',
    value: function _connectionIsStale() {
      return secondsSince(this.lastPing) > STALE_CONNECTION_THRESHOLD_SECONDS;
    }

    /**
     * Tries to reconnect to the websocket server using a recursive timeout
     */

  }, {
    key: '_reconnect',
    value: function _reconnect() {
      var _this = this;

      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = setTimeout(function () {
        _this.reconnectTries++;
        _this.connect(_this.params);
        _this._reconnect();
      }, this._reconnectInterval());
    }

    /**
     * Returns an incrementing timeout interval based around the number of reconnection retries
     */

  }, {
    key: '_reconnectInterval',
    value: function _reconnectInterval() {
      return [1000, 2000, 5000, 10000][this.reconnectTries] || 10000;
    }

    /**
     * Sets a recursive timeout to check if the connection is stale
     */

  }, {
    key: '_poll',
    value: function _poll() {
      var _this2 = this;

      this.pollingTimeout = setTimeout(function () {
        if (_this2._connectionIsStale()) {
          _this2._reconnect();
        } else {
          _this2._poll();
        }
      }, SOCKET_POLLING_RATE);
    }

    /**
     * Clear polling timeout and start polling
     */

  }, {
    key: '_startPolling',
    value: function _startPolling() {
      clearTimeout(this.pollingTimeout);
      this._poll();
    }

    /**
     * Sets `lastPing` to the curent time
     */

  }, {
    key: '_handlePing',
    value: function _handlePing() {
      this.lastPing = now();
    }

    /**
     * Clears reconnect timeout, resets variables an starts polling
     */

  }, {
    key: '_reset',
    value: function _reset() {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTries = 0;
      this.attemptReconnect = true;
      this._startPolling();
    }

    /**
     * Connect the socket to the server, and binds to native ws functions
     * @param {Object} params - Optional parameters
     * @param {String} params.location - Hostname to connect to, defaults to `window.location.hostname`
     * @param {String} parmas.port - Port to connect to, defaults to `window.location.port`
     * @param {String} params.protocol - Protocol to use, either 'wss' or 'ws'
     */

  }, {
    key: 'connect',
    value: function connect(params) {
      var _this3 = this;

      this.params = params;

      var opts = {
        location: window.location.hostname,
        port: window.location.port,
        protocol: window.location.protocol === 'https:' ? 'wss:' : 'ws:'
      };

      if (params) Object.assign(opts, params);
      if (opts.port) opts.location += ':' + opts.port;

      return new Promise(function (resolve, reject) {
        _this3.ws = new WebSocket(opts.protocol + '//' + opts.location + _this3.endpoint);
        _this3.ws.onmessage = function (msg) {
          _this3.handleMessage(msg);
        };
        _this3.ws.onclose = function () {
          if (_this3.attemptReconnect) _this3._reconnect();
        };
        _this3.ws.onopen = function () {
          _this3._reset();
          resolve();
        };
      });
    }

    /**
     * Closes the socket connection permanently
     */

  }, {
    key: 'disconnect',
    value: function disconnect() {
      this.attemptReconnect = false;
      clearTimeout(this.pollingTimeout);
      clearTimeout(this.reconnectTimeout);
      this.ws.close();
    }

    /**
     * Adds a new channel to the socket channels list
     * @param {String} topic - Topic for the channel: `chat_room:123`
     */

  }, {
    key: 'channel',
    value: function channel(topic) {
      var channel = new Channel(topic, this);
      this.channels.push(channel);
      return channel;
    }

    /**
     * Message handler for messages received
     * @param {MessageEvent} msg - Message received from ws
     */

  }, {
    key: 'handleMessage',
    value: function handleMessage(msg) {
      if (msg.data === "ping") return this._handlePing();

      var parsed_msg = JSON.parse(msg.data);
      this.channels.forEach(function (channel) {
        if (channel.topic === parsed_msg.topic) channel.handleMessage(parsed_msg);
      });
    }
  }]);

  return Socket;
}();

module.exports = {
  Socket: Socket

  /**
   * Allows delete links to post for security and ease of use similar to Rails jquery_ujs
   */
};document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll("a[data-method='delete']").forEach(function (element) {
    element.addEventListener("click", function (e) {
      e.preventDefault();
      var message = element.getAttribute("data-confirm") || "Are you sure?";
      if (confirm(message)) {
        var form = document.createElement("form");
        var input = document.createElement("input");
        form.setAttribute("action", element.getAttribute("href"));
        form.setAttribute("method", "POST");
        input.setAttribute("type", "hidden");
        input.setAttribute("name", "_method");
        input.setAttribute("value", "DELETE");
        form.appendChild(input);
        document.body.appendChild(form);
        form.submit();
      }
      return false;
    });
  });
});

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/* ===================================================
 * bootstrap-transition.js v2.3.1
 * http://twitter.github.com/bootstrap/javascript.html#transitions
 * ===================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */

!function ($) {

  "use strict"; // jshint ;_;


  /* CSS TRANSITION SUPPORT (http://www.modernizr.com/)
   * ======================================================= */

  $(function () {

    $.support.transition = function () {

      var transitionEnd = function () {

        var el = document.createElement('bootstrap'),
            transEndEventNames = {
          'WebkitTransition': 'webkitTransitionEnd',
          'MozTransition': 'transitionend',
          'OTransition': 'oTransitionEnd otransitionend',
          'transition': 'transitionend'
        },
            name;

        for (name in transEndEventNames) {
          if (el.style[name] !== undefined) {
            return transEndEventNames[name];
          }
        }
      }();

      return transitionEnd && {
        end: transitionEnd
      };
    }();
  });
}(window.jQuery); /* ==========================================================
                  * bootstrap-alert.js v2.3.1
                  * http://twitter.github.com/bootstrap/javascript.html#alerts
                  * ==========================================================
                  * Copyright 2012 Twitter, Inc.
                  *
                  * Licensed under the Apache License, Version 2.0 (the "License");
                  * you may not use this file except in compliance with the License.
                  * You may obtain a copy of the License at
                  *
                  * http://www.apache.org/licenses/LICENSE-2.0
                  *
                  * Unless required by applicable law or agreed to in writing, software
                  * distributed under the License is distributed on an "AS IS" BASIS,
                  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
                  * See the License for the specific language governing permissions and
                  * limitations under the License.
                  * ========================================================== */

!function ($) {

  "use strict"; // jshint ;_;


  /* ALERT CLASS DEFINITION
   * ====================== */

  var dismiss = '[data-dismiss="alert"]',
      Alert = function Alert(el) {
    $(el).on('click', dismiss, this.close);
  };

  Alert.prototype.close = function (e) {
    var $this = $(this),
        selector = $this.attr('data-target'),
        $parent;

    if (!selector) {
      selector = $this.attr('href');
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, ''); //strip for ie7
    }

    $parent = $(selector);

    e && e.preventDefault();

    $parent.length || ($parent = $this.hasClass('alert') ? $this : $this.parent());

    $parent.trigger(e = $.Event('close'));

    if (e.isDefaultPrevented()) return;

    $parent.removeClass('in');

    function removeElement() {
      $parent.trigger('closed').remove();
    }

    $.support.transition && $parent.hasClass('fade') ? $parent.on($.support.transition.end, removeElement) : removeElement();
  };

  /* ALERT PLUGIN DEFINITION
   * ======================= */

  var old = $.fn.alert;

  $.fn.alert = function (option) {
    return this.each(function () {
      var $this = $(this),
          data = $this.data('alert');
      if (!data) $this.data('alert', data = new Alert(this));
      if (typeof option == 'string') data[option].call($this);
    });
  };

  $.fn.alert.Constructor = Alert;

  /* ALERT NO CONFLICT
   * ================= */

  $.fn.alert.noConflict = function () {
    $.fn.alert = old;
    return this;
  };

  /* ALERT DATA-API
   * ============== */

  $(document).on('click.alert.data-api', dismiss, Alert.prototype.close);
}(window.jQuery); /* ============================================================
                  * bootstrap-button.js v2.3.1
                  * http://twitter.github.com/bootstrap/javascript.html#buttons
                  * ============================================================
                  * Copyright 2012 Twitter, Inc.
                  *
                  * Licensed under the Apache License, Version 2.0 (the "License");
                  * you may not use this file except in compliance with the License.
                  * You may obtain a copy of the License at
                  *
                  * http://www.apache.org/licenses/LICENSE-2.0
                  *
                  * Unless required by applicable law or agreed to in writing, software
                  * distributed under the License is distributed on an "AS IS" BASIS,
                  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
                  * See the License for the specific language governing permissions and
                  * limitations under the License.
                  * ============================================================ */

!function ($) {

  "use strict"; // jshint ;_;


  /* BUTTON PUBLIC CLASS DEFINITION
   * ============================== */

  var Button = function Button(element, options) {
    this.$element = $(element);
    this.options = $.extend({}, $.fn.button.defaults, options);
  };

  Button.prototype.setState = function (state) {
    var d = 'disabled',
        $el = this.$element,
        data = $el.data(),
        val = $el.is('input') ? 'val' : 'html';

    state = state + 'Text';
    data.resetText || $el.data('resetText', $el[val]());

    $el[val](data[state] || this.options[state]);

    // push to event loop to allow forms to submit
    setTimeout(function () {
      state == 'loadingText' ? $el.addClass(d).attr(d, d) : $el.removeClass(d).removeAttr(d);
    }, 0);
  };

  Button.prototype.toggle = function () {
    var $parent = this.$element.closest('[data-toggle="buttons-radio"]');

    $parent && $parent.find('.active').removeClass('active');

    this.$element.toggleClass('active');
  };

  /* BUTTON PLUGIN DEFINITION
   * ======================== */

  var old = $.fn.button;

  $.fn.button = function (option) {
    return this.each(function () {
      var $this = $(this),
          data = $this.data('button'),
          options = (typeof option === 'undefined' ? 'undefined' : _typeof(option)) == 'object' && option;
      if (!data) $this.data('button', data = new Button(this, options));
      if (option == 'toggle') data.toggle();else if (option) data.setState(option);
    });
  };

  $.fn.button.defaults = {
    loadingText: 'loading...'
  };

  $.fn.button.Constructor = Button;

  /* BUTTON NO CONFLICT
   * ================== */

  $.fn.button.noConflict = function () {
    $.fn.button = old;
    return this;
  };

  /* BUTTON DATA-API
   * =============== */

  $(document).on('click.button.data-api', '[data-toggle^=button]', function (e) {
    var $btn = $(e.target);
    if (!$btn.hasClass('btn')) $btn = $btn.closest('.btn');
    $btn.button('toggle');
  });
}(window.jQuery); /* ==========================================================
                  * bootstrap-carousel.js v2.3.1
                  * http://twitter.github.com/bootstrap/javascript.html#carousel
                  * ==========================================================
                  * Copyright 2012 Twitter, Inc.
                  *
                  * Licensed under the Apache License, Version 2.0 (the "License");
                  * you may not use this file except in compliance with the License.
                  * You may obtain a copy of the License at
                  *
                  * http://www.apache.org/licenses/LICENSE-2.0
                  *
                  * Unless required by applicable law or agreed to in writing, software
                  * distributed under the License is distributed on an "AS IS" BASIS,
                  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
                  * See the License for the specific language governing permissions and
                  * limitations under the License.
                  * ========================================================== */

!function ($) {

  "use strict"; // jshint ;_;


  /* CAROUSEL CLASS DEFINITION
   * ========================= */

  var Carousel = function Carousel(element, options) {
    this.$element = $(element);
    this.$indicators = this.$element.find('.carousel-indicators');
    this.options = options;
    this.options.pause == 'hover' && this.$element.on('mouseenter', $.proxy(this.pause, this)).on('mouseleave', $.proxy(this.cycle, this));
  };

  Carousel.prototype = {

    cycle: function cycle(e) {
      if (!e) this.paused = false;
      if (this.interval) clearInterval(this.interval);
      this.options.interval && !this.paused && (this.interval = setInterval($.proxy(this.next, this), this.options.interval));
      return this;
    },

    getActiveIndex: function getActiveIndex() {
      this.$active = this.$element.find('.item.active');
      this.$items = this.$active.parent().children();
      return this.$items.index(this.$active);
    },

    to: function to(pos) {
      var activeIndex = this.getActiveIndex(),
          that = this;

      if (pos > this.$items.length - 1 || pos < 0) return;

      if (this.sliding) {
        return this.$element.one('slid', function () {
          that.to(pos);
        });
      }

      if (activeIndex == pos) {
        return this.pause().cycle();
      }

      return this.slide(pos > activeIndex ? 'next' : 'prev', $(this.$items[pos]));
    },

    pause: function pause(e) {
      if (!e) this.paused = true;
      if (this.$element.find('.next, .prev').length && $.support.transition.end) {
        this.$element.trigger($.support.transition.end);
        this.cycle(true);
      }
      clearInterval(this.interval);
      this.interval = null;
      return this;
    },

    next: function next() {
      if (this.sliding) return;
      return this.slide('next');
    },

    prev: function prev() {
      if (this.sliding) return;
      return this.slide('prev');
    },

    slide: function slide(type, next) {
      var $active = this.$element.find('.item.active'),
          $next = next || $active[type](),
          isCycling = this.interval,
          direction = type == 'next' ? 'left' : 'right',
          fallback = type == 'next' ? 'first' : 'last',
          that = this,
          e;

      this.sliding = true;

      isCycling && this.pause();

      $next = $next.length ? $next : this.$element.find('.item')[fallback]();

      e = $.Event('slide', {
        relatedTarget: $next[0],
        direction: direction
      });

      if ($next.hasClass('active')) return;

      if (this.$indicators.length) {
        this.$indicators.find('.active').removeClass('active');
        this.$element.one('slid', function () {
          var $nextIndicator = $(that.$indicators.children()[that.getActiveIndex()]);
          $nextIndicator && $nextIndicator.addClass('active');
        });
      }

      if ($.support.transition && this.$element.hasClass('slide')) {
        this.$element.trigger(e);
        if (e.isDefaultPrevented()) return;
        $next.addClass(type);
        $next[0].offsetWidth; // force reflow
        $active.addClass(direction);
        $next.addClass(direction);
        this.$element.one($.support.transition.end, function () {
          $next.removeClass([type, direction].join(' ')).addClass('active');
          $active.removeClass(['active', direction].join(' '));
          that.sliding = false;
          setTimeout(function () {
            that.$element.trigger('slid');
          }, 0);
        });
      } else {
        this.$element.trigger(e);
        if (e.isDefaultPrevented()) return;
        $active.removeClass('active');
        $next.addClass('active');
        this.sliding = false;
        this.$element.trigger('slid');
      }

      isCycling && this.cycle();

      return this;
    }

    /* CAROUSEL PLUGIN DEFINITION
     * ========================== */

  };var old = $.fn.carousel;

  $.fn.carousel = function (option) {
    return this.each(function () {
      var $this = $(this),
          data = $this.data('carousel'),
          options = $.extend({}, $.fn.carousel.defaults, (typeof option === 'undefined' ? 'undefined' : _typeof(option)) == 'object' && option),
          action = typeof option == 'string' ? option : options.slide;
      if (!data) $this.data('carousel', data = new Carousel(this, options));
      if (typeof option == 'number') data.to(option);else if (action) data[action]();else if (options.interval) data.pause().cycle();
    });
  };

  $.fn.carousel.defaults = {
    interval: 5000,
    pause: 'hover'
  };

  $.fn.carousel.Constructor = Carousel;

  /* CAROUSEL NO CONFLICT
   * ==================== */

  $.fn.carousel.noConflict = function () {
    $.fn.carousel = old;
    return this;
  };

  /* CAROUSEL DATA-API
   * ================= */

  $(document).on('click.carousel.data-api', '[data-slide], [data-slide-to]', function (e) {
    var $this = $(this),
        href,
        $target = $($this.attr('data-target') || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) //strip for ie7
    ,
        options = $.extend({}, $target.data(), $this.data()),
        slideIndex;

    $target.carousel(options);

    if (slideIndex = $this.attr('data-slide-to')) {
      $target.data('carousel').pause().to(slideIndex).cycle();
    }

    e.preventDefault();
  });
}(window.jQuery); /* =============================================================
                  * bootstrap-collapse.js v2.3.1
                  * http://twitter.github.com/bootstrap/javascript.html#collapse
                  * =============================================================
                  * Copyright 2012 Twitter, Inc.
                  *
                  * Licensed under the Apache License, Version 2.0 (the "License");
                  * you may not use this file except in compliance with the License.
                  * You may obtain a copy of the License at
                  *
                  * http://www.apache.org/licenses/LICENSE-2.0
                  *
                  * Unless required by applicable law or agreed to in writing, software
                  * distributed under the License is distributed on an "AS IS" BASIS,
                  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
                  * See the License for the specific language governing permissions and
                  * limitations under the License.
                  * ============================================================ */

!function ($) {

  "use strict"; // jshint ;_;


  /* COLLAPSE PUBLIC CLASS DEFINITION
   * ================================ */

  var Collapse = function Collapse(element, options) {
    this.$element = $(element);
    this.options = $.extend({}, $.fn.collapse.defaults, options);

    if (this.options.parent) {
      this.$parent = $(this.options.parent);
    }

    this.options.toggle && this.toggle();
  };

  Collapse.prototype = {

    constructor: Collapse,

    dimension: function dimension() {
      var hasWidth = this.$element.hasClass('width');
      return hasWidth ? 'width' : 'height';
    },

    show: function show() {
      var dimension, scroll, actives, hasData;

      if (this.transitioning || this.$element.hasClass('in')) return;

      dimension = this.dimension();
      scroll = $.camelCase(['scroll', dimension].join('-'));
      actives = this.$parent && this.$parent.find('> .accordion-group > .in');

      if (actives && actives.length) {
        hasData = actives.data('collapse');
        if (hasData && hasData.transitioning) return;
        actives.collapse('hide');
        hasData || actives.data('collapse', null);
      }

      this.$element[dimension](0);
      this.transition('addClass', $.Event('show'), 'shown');
      $.support.transition && this.$element[dimension](this.$element[0][scroll]);
    },

    hide: function hide() {
      var dimension;
      if (this.transitioning || !this.$element.hasClass('in')) return;
      dimension = this.dimension();
      this.reset(this.$element[dimension]());
      this.transition('removeClass', $.Event('hide'), 'hidden');
      this.$element[dimension](0);
    },

    reset: function reset(size) {
      var dimension = this.dimension();

      this.$element.removeClass('collapse')[dimension](size || 'auto')[0].offsetWidth;

      this.$element[size !== null ? 'addClass' : 'removeClass']('collapse');

      return this;
    },

    transition: function transition(method, startEvent, completeEvent) {
      var that = this,
          complete = function complete() {
        if (startEvent.type == 'show') that.reset();
        that.transitioning = 0;
        that.$element.trigger(completeEvent);
      };

      this.$element.trigger(startEvent);

      if (startEvent.isDefaultPrevented()) return;

      this.transitioning = 1;

      this.$element[method]('in');

      $.support.transition && this.$element.hasClass('collapse') ? this.$element.one($.support.transition.end, complete) : complete();
    },

    toggle: function toggle() {
      this[this.$element.hasClass('in') ? 'hide' : 'show']();
    }

    /* COLLAPSE PLUGIN DEFINITION
     * ========================== */

  };var old = $.fn.collapse;

  $.fn.collapse = function (option) {
    return this.each(function () {
      var $this = $(this),
          data = $this.data('collapse'),
          options = $.extend({}, $.fn.collapse.defaults, $this.data(), (typeof option === 'undefined' ? 'undefined' : _typeof(option)) == 'object' && option);
      if (!data) $this.data('collapse', data = new Collapse(this, options));
      if (typeof option == 'string') data[option]();
    });
  };

  $.fn.collapse.defaults = {
    toggle: true
  };

  $.fn.collapse.Constructor = Collapse;

  /* COLLAPSE NO CONFLICT
   * ==================== */

  $.fn.collapse.noConflict = function () {
    $.fn.collapse = old;
    return this;
  };

  /* COLLAPSE DATA-API
   * ================= */

  $(document).on('click.collapse.data-api', '[data-toggle=collapse]', function (e) {
    var $this = $(this),
        href,
        target = $this.attr('data-target') || e.preventDefault() || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '') //strip for ie7
    ,
        option = $(target).data('collapse') ? 'toggle' : $this.data();
    $this[$(target).hasClass('in') ? 'addClass' : 'removeClass']('collapsed');
    $(target).collapse(option);
  });
}(window.jQuery); /* ============================================================
                  * bootstrap-dropdown.js v2.3.1
                  * http://twitter.github.com/bootstrap/javascript.html#dropdowns
                  * ============================================================
                  * Copyright 2012 Twitter, Inc.
                  *
                  * Licensed under the Apache License, Version 2.0 (the "License");
                  * you may not use this file except in compliance with the License.
                  * You may obtain a copy of the License at
                  *
                  * http://www.apache.org/licenses/LICENSE-2.0
                  *
                  * Unless required by applicable law or agreed to in writing, software
                  * distributed under the License is distributed on an "AS IS" BASIS,
                  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
                  * See the License for the specific language governing permissions and
                  * limitations under the License.
                  * ============================================================ */

!function ($) {

  "use strict"; // jshint ;_;


  /* DROPDOWN CLASS DEFINITION
   * ========================= */

  var toggle = '[data-toggle=dropdown]',
      Dropdown = function Dropdown(element) {
    var $el = $(element).on('click.dropdown.data-api', this.toggle);
    $('html').on('click.dropdown.data-api', function () {
      $el.parent().removeClass('open');
    });
  };

  Dropdown.prototype = {

    constructor: Dropdown,

    toggle: function toggle(e) {
      var $this = $(this),
          $parent,
          isActive;

      if ($this.is('.disabled, :disabled')) return;

      $parent = getParent($this);

      isActive = $parent.hasClass('open');

      clearMenus();

      if (!isActive) {
        $parent.toggleClass('open');
      }

      $this.focus();

      return false;
    },

    keydown: function keydown(e) {
      var $this, $items, $active, $parent, isActive, index;

      if (!/(38|40|27)/.test(e.keyCode)) return;

      $this = $(this);

      e.preventDefault();
      e.stopPropagation();

      if ($this.is('.disabled, :disabled')) return;

      $parent = getParent($this);

      isActive = $parent.hasClass('open');

      if (!isActive || isActive && e.keyCode == 27) {
        if (e.which == 27) $parent.find(toggle).focus();
        return $this.click();
      }

      $items = $('[role=menu] li:not(.divider):visible a', $parent);

      if (!$items.length) return;

      index = $items.index($items.filter(':focus'));

      if (e.keyCode == 38 && index > 0) index--; // up
      if (e.keyCode == 40 && index < $items.length - 1) index++; // down
      if (!~index) index = 0;

      $items.eq(index).focus();
    }

  };

  function clearMenus() {
    $(toggle).each(function () {
      getParent($(this)).removeClass('open');
    });
  }

  function getParent($this) {
    var selector = $this.attr('data-target'),
        $parent;

    if (!selector) {
      selector = $this.attr('href');
      selector = selector && /#/.test(selector) && selector.replace(/.*(?=#[^\s]*$)/, ''); //strip for ie7
    }

    $parent = selector && $(selector);

    if (!$parent || !$parent.length) $parent = $this.parent();

    return $parent;
  }

  /* DROPDOWN PLUGIN DEFINITION
   * ========================== */

  var old = $.fn.dropdown;

  $.fn.dropdown = function (option) {
    return this.each(function () {
      var $this = $(this),
          data = $this.data('dropdown');
      if (!data) $this.data('dropdown', data = new Dropdown(this));
      if (typeof option == 'string') data[option].call($this);
    });
  };

  $.fn.dropdown.Constructor = Dropdown;

  /* DROPDOWN NO CONFLICT
   * ==================== */

  $.fn.dropdown.noConflict = function () {
    $.fn.dropdown = old;
    return this;
  };

  /* APPLY TO STANDARD DROPDOWN ELEMENTS
   * =================================== */

  $(document).on('click.dropdown.data-api', clearMenus).on('click.dropdown.data-api', '.dropdown form', function (e) {
    e.stopPropagation();
  }).on('click.dropdown-menu', function (e) {
    e.stopPropagation();
  }).on('click.dropdown.data-api', toggle, Dropdown.prototype.toggle).on('keydown.dropdown.data-api', toggle + ', [role=menu]', Dropdown.prototype.keydown);
}(window.jQuery);
/* =========================================================
 * bootstrap-modal.js v2.3.1
 * http://twitter.github.com/bootstrap/javascript.html#modals
 * =========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================= */

!function ($) {

  "use strict"; // jshint ;_;


  /* MODAL CLASS DEFINITION
   * ====================== */

  var Modal = function Modal(element, options) {
    this.options = options;
    this.$element = $(element).delegate('[data-dismiss="modal"]', 'click.dismiss.modal', $.proxy(this.hide, this));
    this.options.remote && this.$element.find('.modal-body').load(this.options.remote);
  };

  Modal.prototype = {

    constructor: Modal,

    toggle: function toggle() {
      return this[!this.isShown ? 'show' : 'hide']();
    },

    show: function show() {
      var that = this,
          e = $.Event('show');

      this.$element.trigger(e);

      if (this.isShown || e.isDefaultPrevented()) return;

      this.isShown = true;

      this.escape();

      this.backdrop(function () {
        var transition = $.support.transition && that.$element.hasClass('fade');

        if (!that.$element.parent().length) {
          that.$element.appendTo(document.body); //don't move modals dom position
        }

        that.$element.show();

        if (transition) {
          that.$element[0].offsetWidth; // force reflow
        }

        that.$element.addClass('in').attr('aria-hidden', false);

        that.enforceFocus();

        transition ? that.$element.one($.support.transition.end, function () {
          that.$element.focus().trigger('shown');
        }) : that.$element.focus().trigger('shown');
      });
    },

    hide: function hide(e) {
      e && e.preventDefault();

      var that = this;

      e = $.Event('hide');

      this.$element.trigger(e);

      if (!this.isShown || e.isDefaultPrevented()) return;

      this.isShown = false;

      this.escape();

      $(document).off('focusin.modal');

      this.$element.removeClass('in').attr('aria-hidden', true);

      $.support.transition && this.$element.hasClass('fade') ? this.hideWithTransition() : this.hideModal();
    },

    enforceFocus: function enforceFocus() {
      var that = this;
      $(document).on('focusin.modal', function (e) {
        if (that.$element[0] !== e.target && !that.$element.has(e.target).length) {
          that.$element.focus();
        }
      });
    },

    escape: function escape() {
      var that = this;
      if (this.isShown && this.options.keyboard) {
        this.$element.on('keyup.dismiss.modal', function (e) {
          e.which == 27 && that.hide();
        });
      } else if (!this.isShown) {
        this.$element.off('keyup.dismiss.modal');
      }
    },

    hideWithTransition: function hideWithTransition() {
      var that = this,
          timeout = setTimeout(function () {
        that.$element.off($.support.transition.end);
        that.hideModal();
      }, 500);

      this.$element.one($.support.transition.end, function () {
        clearTimeout(timeout);
        that.hideModal();
      });
    },

    hideModal: function hideModal() {
      var that = this;
      this.$element.hide();
      this.backdrop(function () {
        that.removeBackdrop();
        that.$element.trigger('hidden');
      });
    },

    removeBackdrop: function removeBackdrop() {
      this.$backdrop && this.$backdrop.remove();
      this.$backdrop = null;
    },

    backdrop: function backdrop(callback) {
      var that = this,
          animate = this.$element.hasClass('fade') ? 'fade' : '';

      if (this.isShown && this.options.backdrop) {
        var doAnimate = $.support.transition && animate;

        this.$backdrop = $('<div class="modal-backdrop ' + animate + '" />').appendTo(document.body);

        this.$backdrop.click(this.options.backdrop == 'static' ? $.proxy(this.$element[0].focus, this.$element[0]) : $.proxy(this.hide, this));

        if (doAnimate) this.$backdrop[0].offsetWidth; // force reflow

        this.$backdrop.addClass('in');

        if (!callback) return;

        doAnimate ? this.$backdrop.one($.support.transition.end, callback) : callback();
      } else if (!this.isShown && this.$backdrop) {
        this.$backdrop.removeClass('in');

        $.support.transition && this.$element.hasClass('fade') ? this.$backdrop.one($.support.transition.end, callback) : callback();
      } else if (callback) {
        callback();
      }
    }

    /* MODAL PLUGIN DEFINITION
     * ======================= */

  };var old = $.fn.modal;

  $.fn.modal = function (option) {
    return this.each(function () {
      var $this = $(this),
          data = $this.data('modal'),
          options = $.extend({}, $.fn.modal.defaults, $this.data(), (typeof option === 'undefined' ? 'undefined' : _typeof(option)) == 'object' && option);
      if (!data) $this.data('modal', data = new Modal(this, options));
      if (typeof option == 'string') data[option]();else if (options.show) data.show();
    });
  };

  $.fn.modal.defaults = {
    backdrop: true,
    keyboard: true,
    show: true
  };

  $.fn.modal.Constructor = Modal;

  /* MODAL NO CONFLICT
   * ================= */

  $.fn.modal.noConflict = function () {
    $.fn.modal = old;
    return this;
  };

  /* MODAL DATA-API
   * ============== */

  $(document).on('click.modal.data-api', '[data-toggle="modal"]', function (e) {
    var $this = $(this),
        href = $this.attr('href'),
        $target = $($this.attr('data-target') || href && href.replace(/.*(?=#[^\s]+$)/, '')) //strip for ie7
    ,
        option = $target.data('modal') ? 'toggle' : $.extend({ remote: !/#/.test(href) && href }, $target.data(), $this.data());

    e.preventDefault();

    $target.modal(option).one('hide', function () {
      $this.focus();
    });
  });
}(window.jQuery);
/* ===========================================================
 * bootstrap-tooltip.js v2.3.1
 * http://twitter.github.com/bootstrap/javascript.html#tooltips
 * Inspired by the original jQuery.tipsy by Jason Frame
 * ===========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */

!function ($) {

  "use strict"; // jshint ;_;


  /* TOOLTIP PUBLIC CLASS DEFINITION
   * =============================== */

  var Tooltip = function Tooltip(element, options) {
    this.init('tooltip', element, options);
  };

  Tooltip.prototype = {

    constructor: Tooltip,

    init: function init(type, element, options) {
      var eventIn, eventOut, triggers, trigger, i;

      this.type = type;
      this.$element = $(element);
      this.options = this.getOptions(options);
      this.enabled = true;

      triggers = this.options.trigger.split(' ');

      for (i = triggers.length; i--;) {
        trigger = triggers[i];
        if (trigger == 'click') {
          this.$element.on('click.' + this.type, this.options.selector, $.proxy(this.toggle, this));
        } else if (trigger != 'manual') {
          eventIn = trigger == 'hover' ? 'mouseenter' : 'focus';
          eventOut = trigger == 'hover' ? 'mouseleave' : 'blur';
          this.$element.on(eventIn + '.' + this.type, this.options.selector, $.proxy(this.enter, this));
          this.$element.on(eventOut + '.' + this.type, this.options.selector, $.proxy(this.leave, this));
        }
      }

      this.options.selector ? this._options = $.extend({}, this.options, { trigger: 'manual', selector: '' }) : this.fixTitle();
    },

    getOptions: function getOptions(options) {
      options = $.extend({}, $.fn[this.type].defaults, this.$element.data(), options);

      if (options.delay && typeof options.delay == 'number') {
        options.delay = {
          show: options.delay,
          hide: options.delay
        };
      }

      return options;
    },

    enter: function enter(e) {
      var defaults = $.fn[this.type].defaults,
          options = {},
          self;

      this._options && $.each(this._options, function (key, value) {
        if (defaults[key] != value) options[key] = value;
      }, this);

      self = $(e.currentTarget)[this.type](options).data(this.type);

      if (!self.options.delay || !self.options.delay.show) return self.show();

      clearTimeout(this.timeout);
      self.hoverState = 'in';
      this.timeout = setTimeout(function () {
        if (self.hoverState == 'in') self.show();
      }, self.options.delay.show);
    },

    leave: function leave(e) {
      var self = $(e.currentTarget)[this.type](this._options).data(this.type);

      if (this.timeout) clearTimeout(this.timeout);
      if (!self.options.delay || !self.options.delay.hide) return self.hide();

      self.hoverState = 'out';
      this.timeout = setTimeout(function () {
        if (self.hoverState == 'out') self.hide();
      }, self.options.delay.hide);
    },

    show: function show() {
      var $tip,
          pos,
          actualWidth,
          actualHeight,
          placement,
          tp,
          e = $.Event('show');

      if (this.hasContent() && this.enabled) {
        this.$element.trigger(e);
        if (e.isDefaultPrevented()) return;
        $tip = this.tip();
        this.setContent();

        if (this.options.animation) {
          $tip.addClass('fade');
        }

        placement = typeof this.options.placement == 'function' ? this.options.placement.call(this, $tip[0], this.$element[0]) : this.options.placement;

        $tip.detach().css({ top: 0, left: 0, display: 'block' });

        this.options.container ? $tip.appendTo(this.options.container) : $tip.insertAfter(this.$element);

        pos = this.getPosition();

        actualWidth = $tip[0].offsetWidth;
        actualHeight = $tip[0].offsetHeight;

        switch (placement) {
          case 'bottom':
            tp = { top: pos.top + pos.height, left: pos.left + pos.width / 2 - actualWidth / 2 };
            break;
          case 'top':
            tp = { top: pos.top - actualHeight, left: pos.left + pos.width / 2 - actualWidth / 2 };
            break;
          case 'left':
            tp = { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth };
            break;
          case 'right':
            tp = { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width };
            break;
        }

        this.applyPlacement(tp, placement);
        this.$element.trigger('shown');
      }
    },

    applyPlacement: function applyPlacement(offset, placement) {
      var $tip = this.tip(),
          width = $tip[0].offsetWidth,
          height = $tip[0].offsetHeight,
          actualWidth,
          actualHeight,
          delta,
          replace;

      $tip.offset(offset).addClass(placement).addClass('in');

      actualWidth = $tip[0].offsetWidth;
      actualHeight = $tip[0].offsetHeight;

      if (placement == 'top' && actualHeight != height) {
        offset.top = offset.top + height - actualHeight;
        replace = true;
      }

      if (placement == 'bottom' || placement == 'top') {
        delta = 0;

        if (offset.left < 0) {
          delta = offset.left * -2;
          offset.left = 0;
          $tip.offset(offset);
          actualWidth = $tip[0].offsetWidth;
          actualHeight = $tip[0].offsetHeight;
        }

        this.replaceArrow(delta - width + actualWidth, actualWidth, 'left');
      } else {
        this.replaceArrow(actualHeight - height, actualHeight, 'top');
      }

      if (replace) $tip.offset(offset);
    },

    replaceArrow: function replaceArrow(delta, dimension, position) {
      this.arrow().css(position, delta ? 50 * (1 - delta / dimension) + "%" : '');
    },

    setContent: function setContent() {
      var $tip = this.tip(),
          title = this.getTitle();

      $tip.find('.tooltip-inner')[this.options.html ? 'html' : 'text'](title);
      $tip.removeClass('fade in top bottom left right');
    },

    hide: function hide() {
      var that = this,
          $tip = this.tip(),
          e = $.Event('hide');

      this.$element.trigger(e);
      if (e.isDefaultPrevented()) return;

      $tip.removeClass('in');

      function removeWithAnimation() {
        var timeout = setTimeout(function () {
          $tip.off($.support.transition.end).detach();
        }, 500);

        $tip.one($.support.transition.end, function () {
          clearTimeout(timeout);
          $tip.detach();
        });
      }

      $.support.transition && this.$tip.hasClass('fade') ? removeWithAnimation() : $tip.detach();

      this.$element.trigger('hidden');

      return this;
    },

    fixTitle: function fixTitle() {
      var $e = this.$element;
      if ($e.attr('title') || typeof $e.attr('data-original-title') != 'string') {
        $e.attr('data-original-title', $e.attr('title') || '').attr('title', '');
      }
    },

    hasContent: function hasContent() {
      return this.getTitle();
    },

    getPosition: function getPosition() {
      var el = this.$element[0];
      return $.extend({}, typeof el.getBoundingClientRect == 'function' ? el.getBoundingClientRect() : {
        width: el.offsetWidth,
        height: el.offsetHeight
      }, this.$element.offset());
    },

    getTitle: function getTitle() {
      var title,
          $e = this.$element,
          o = this.options;

      title = $e.attr('data-original-title') || (typeof o.title == 'function' ? o.title.call($e[0]) : o.title);

      return title;
    },

    tip: function tip() {
      return this.$tip = this.$tip || $(this.options.template);
    },

    arrow: function arrow() {
      return this.$arrow = this.$arrow || this.tip().find(".tooltip-arrow");
    },

    validate: function validate() {
      if (!this.$element[0].parentNode) {
        this.hide();
        this.$element = null;
        this.options = null;
      }
    },

    enable: function enable() {
      this.enabled = true;
    },

    disable: function disable() {
      this.enabled = false;
    },

    toggleEnabled: function toggleEnabled() {
      this.enabled = !this.enabled;
    },

    toggle: function toggle(e) {
      var self = e ? $(e.currentTarget)[this.type](this._options).data(this.type) : this;
      self.tip().hasClass('in') ? self.hide() : self.show();
    },

    destroy: function destroy() {
      this.hide().$element.off('.' + this.type).removeData(this.type);
    }

    /* TOOLTIP PLUGIN DEFINITION
     * ========================= */

  };var old = $.fn.tooltip;

  $.fn.tooltip = function (option) {
    return this.each(function () {
      var $this = $(this),
          data = $this.data('tooltip'),
          options = (typeof option === 'undefined' ? 'undefined' : _typeof(option)) == 'object' && option;
      if (!data) $this.data('tooltip', data = new Tooltip(this, options));
      if (typeof option == 'string') data[option]();
    });
  };

  $.fn.tooltip.Constructor = Tooltip;

  $.fn.tooltip.defaults = {
    animation: true,
    placement: 'top',
    selector: false,
    template: '<div class="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
    trigger: 'hover focus',
    title: '',
    delay: 0,
    html: false,
    container: false

    /* TOOLTIP NO CONFLICT
     * =================== */

  };$.fn.tooltip.noConflict = function () {
    $.fn.tooltip = old;
    return this;
  };
}(window.jQuery);
/* ===========================================================
 * bootstrap-popover.js v2.3.1
 * http://twitter.github.com/bootstrap/javascript.html#popovers
 * ===========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =========================================================== */

!function ($) {

  "use strict"; // jshint ;_;


  /* POPOVER PUBLIC CLASS DEFINITION
   * =============================== */

  var Popover = function Popover(element, options) {
    this.init('popover', element, options);
  };

  /* NOTE: POPOVER EXTENDS BOOTSTRAP-TOOLTIP.js
     ========================================== */

  Popover.prototype = $.extend({}, $.fn.tooltip.Constructor.prototype, {

    constructor: Popover,

    setContent: function setContent() {
      var $tip = this.tip(),
          title = this.getTitle(),
          content = this.getContent();

      $tip.find('.popover-title')[this.options.html ? 'html' : 'text'](title);
      $tip.find('.popover-content')[this.options.html ? 'html' : 'text'](content);

      $tip.removeClass('fade top bottom left right in');
    },

    hasContent: function hasContent() {
      return this.getTitle() || this.getContent();
    },

    getContent: function getContent() {
      var content,
          $e = this.$element,
          o = this.options;

      content = (typeof o.content == 'function' ? o.content.call($e[0]) : o.content) || $e.attr('data-content');

      return content;
    },

    tip: function tip() {
      if (!this.$tip) {
        this.$tip = $(this.options.template);
      }
      return this.$tip;
    },

    destroy: function destroy() {
      this.hide().$element.off('.' + this.type).removeData(this.type);
    }

  });

  /* POPOVER PLUGIN DEFINITION
   * ======================= */

  var old = $.fn.popover;

  $.fn.popover = function (option) {
    return this.each(function () {
      var $this = $(this),
          data = $this.data('popover'),
          options = (typeof option === 'undefined' ? 'undefined' : _typeof(option)) == 'object' && option;
      if (!data) $this.data('popover', data = new Popover(this, options));
      if (typeof option == 'string') data[option]();
    });
  };

  $.fn.popover.Constructor = Popover;

  $.fn.popover.defaults = $.extend({}, $.fn.tooltip.defaults, {
    placement: 'right',
    trigger: 'click',
    content: '',
    template: '<div class="popover"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
  });

  /* POPOVER NO CONFLICT
   * =================== */

  $.fn.popover.noConflict = function () {
    $.fn.popover = old;
    return this;
  };
}(window.jQuery);
/* =============================================================
 * bootstrap-scrollspy.js v2.3.1
 * http://twitter.github.com/bootstrap/javascript.html#scrollspy
 * =============================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ============================================================== */

!function ($) {

  "use strict"; // jshint ;_;


  /* SCROLLSPY CLASS DEFINITION
   * ========================== */

  function ScrollSpy(element, options) {
    var process = $.proxy(this.process, this),
        $element = $(element).is('body') ? $(window) : $(element),
        href;
    this.options = $.extend({}, $.fn.scrollspy.defaults, options);
    this.$scrollElement = $element.on('scroll.scroll-spy.data-api', process);
    this.selector = (this.options.target || (href = $(element).attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '') //strip for ie7
    || '') + ' .nav li > a';
    this.$body = $('body');
    this.refresh();
    this.process();
  }

  ScrollSpy.prototype = {

    constructor: ScrollSpy,

    refresh: function refresh() {
      var self = this,
          $targets;

      this.offsets = $([]);
      this.targets = $([]);

      $targets = this.$body.find(this.selector).map(function () {
        var $el = $(this),
            href = $el.data('target') || $el.attr('href'),
            $href = /^#\w/.test(href) && $(href);
        return $href && $href.length && [[$href.position().top + (!$.isWindow(self.$scrollElement.get(0)) && self.$scrollElement.scrollTop()), href]] || null;
      }).sort(function (a, b) {
        return a[0] - b[0];
      }).each(function () {
        self.offsets.push(this[0]);
        self.targets.push(this[1]);
      });
    },

    process: function process() {
      var scrollTop = this.$scrollElement.scrollTop() + this.options.offset,
          scrollHeight = this.$scrollElement[0].scrollHeight || this.$body[0].scrollHeight,
          maxScroll = scrollHeight - this.$scrollElement.height(),
          offsets = this.offsets,
          targets = this.targets,
          activeTarget = this.activeTarget,
          i;

      if (scrollTop >= maxScroll) {
        return activeTarget != (i = targets.last()[0]) && this.activate(i);
      }

      for (i = offsets.length; i--;) {
        activeTarget != targets[i] && scrollTop >= offsets[i] && (!offsets[i + 1] || scrollTop <= offsets[i + 1]) && this.activate(targets[i]);
      }
    },

    activate: function activate(target) {
      var active, selector;

      this.activeTarget = target;

      $(this.selector).parent('.active').removeClass('active');

      selector = this.selector + '[data-target="' + target + '"],' + this.selector + '[href="' + target + '"]';

      active = $(selector).parent('li').addClass('active');

      if (active.parent('.dropdown-menu').length) {
        active = active.closest('li.dropdown').addClass('active');
      }

      active.trigger('activate');
    }

    /* SCROLLSPY PLUGIN DEFINITION
     * =========================== */

  };var old = $.fn.scrollspy;

  $.fn.scrollspy = function (option) {
    return this.each(function () {
      var $this = $(this),
          data = $this.data('scrollspy'),
          options = (typeof option === 'undefined' ? 'undefined' : _typeof(option)) == 'object' && option;
      if (!data) $this.data('scrollspy', data = new ScrollSpy(this, options));
      if (typeof option == 'string') data[option]();
    });
  };

  $.fn.scrollspy.Constructor = ScrollSpy;

  $.fn.scrollspy.defaults = {
    offset: 10

    /* SCROLLSPY NO CONFLICT
     * ===================== */

  };$.fn.scrollspy.noConflict = function () {
    $.fn.scrollspy = old;
    return this;
  };

  /* SCROLLSPY DATA-API
   * ================== */

  $(window).on('load', function () {
    $('[data-spy="scroll"]').each(function () {
      var $spy = $(this);
      $spy.scrollspy($spy.data());
    });
  });
}(window.jQuery); /* ========================================================
                  * bootstrap-tab.js v2.3.1
                  * http://twitter.github.com/bootstrap/javascript.html#tabs
                  * ========================================================
                  * Copyright 2012 Twitter, Inc.
                  *
                  * Licensed under the Apache License, Version 2.0 (the "License");
                  * you may not use this file except in compliance with the License.
                  * You may obtain a copy of the License at
                  *
                  * http://www.apache.org/licenses/LICENSE-2.0
                  *
                  * Unless required by applicable law or agreed to in writing, software
                  * distributed under the License is distributed on an "AS IS" BASIS,
                  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
                  * See the License for the specific language governing permissions and
                  * limitations under the License.
                  * ======================================================== */

!function ($) {

  "use strict"; // jshint ;_;


  /* TAB CLASS DEFINITION
   * ==================== */

  var Tab = function Tab(element) {
    this.element = $(element);
  };

  Tab.prototype = {

    constructor: Tab,

    show: function show() {
      var $this = this.element,
          $ul = $this.closest('ul:not(.dropdown-menu)'),
          selector = $this.attr('data-target'),
          previous,
          $target,
          e;

      if (!selector) {
        selector = $this.attr('href');
        selector = selector && selector.replace(/.*(?=#[^\s]*$)/, ''); //strip for ie7
      }

      if ($this.parent('li').hasClass('active')) return;

      previous = $ul.find('.active:last a')[0];

      e = $.Event('show', {
        relatedTarget: previous
      });

      $this.trigger(e);

      if (e.isDefaultPrevented()) return;

      $target = $(selector);

      this.activate($this.parent('li'), $ul);
      this.activate($target, $target.parent(), function () {
        $this.trigger({
          type: 'shown',
          relatedTarget: previous
        });
      });
    },

    activate: function activate(element, container, callback) {
      var $active = container.find('> .active'),
          transition = callback && $.support.transition && $active.hasClass('fade');

      function next() {
        $active.removeClass('active').find('> .dropdown-menu > .active').removeClass('active');

        element.addClass('active');

        if (transition) {
          element[0].offsetWidth; // reflow for transition
          element.addClass('in');
        } else {
          element.removeClass('fade');
        }

        if (element.parent('.dropdown-menu')) {
          element.closest('li.dropdown').addClass('active');
        }

        callback && callback();
      }

      transition ? $active.one($.support.transition.end, next) : next();

      $active.removeClass('in');
    }

    /* TAB PLUGIN DEFINITION
     * ===================== */

  };var old = $.fn.tab;

  $.fn.tab = function (option) {
    return this.each(function () {
      var $this = $(this),
          data = $this.data('tab');
      if (!data) $this.data('tab', data = new Tab(this));
      if (typeof option == 'string') data[option]();
    });
  };

  $.fn.tab.Constructor = Tab;

  /* TAB NO CONFLICT
   * =============== */

  $.fn.tab.noConflict = function () {
    $.fn.tab = old;
    return this;
  };

  /* TAB DATA-API
   * ============ */

  $(document).on('click.tab.data-api', '[data-toggle="tab"], [data-toggle="pill"]', function (e) {
    e.preventDefault();
    $(this).tab('show');
  });
}(window.jQuery); /* =============================================================
                  * bootstrap-typeahead.js v2.3.1
                  * http://twitter.github.com/bootstrap/javascript.html#typeahead
                  * =============================================================
                  * Copyright 2012 Twitter, Inc.
                  *
                  * Licensed under the Apache License, Version 2.0 (the "License");
                  * you may not use this file except in compliance with the License.
                  * You may obtain a copy of the License at
                  *
                  * http://www.apache.org/licenses/LICENSE-2.0
                  *
                  * Unless required by applicable law or agreed to in writing, software
                  * distributed under the License is distributed on an "AS IS" BASIS,
                  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
                  * See the License for the specific language governing permissions and
                  * limitations under the License.
                  * ============================================================ */

!function ($) {

  "use strict"; // jshint ;_;


  /* TYPEAHEAD PUBLIC CLASS DEFINITION
   * ================================= */

  var Typeahead = function Typeahead(element, options) {
    this.$element = $(element);
    this.options = $.extend({}, $.fn.typeahead.defaults, options);
    this.matcher = this.options.matcher || this.matcher;
    this.sorter = this.options.sorter || this.sorter;
    this.highlighter = this.options.highlighter || this.highlighter;
    this.updater = this.options.updater || this.updater;
    this.source = this.options.source;
    this.$menu = $(this.options.menu);
    this.shown = false;
    this.listen();
  };

  Typeahead.prototype = {

    constructor: Typeahead,

    select: function select() {
      var val = this.$menu.find('.active').attr('data-value');
      this.$element.val(this.updater(val)).change();
      return this.hide();
    },

    updater: function updater(item) {
      return item;
    },

    show: function show() {
      var pos = $.extend({}, this.$element.position(), {
        height: this.$element[0].offsetHeight
      });

      this.$menu.insertAfter(this.$element).css({
        top: pos.top + pos.height,
        left: pos.left
      }).show();

      this.shown = true;
      return this;
    },

    hide: function hide() {
      this.$menu.hide();
      this.shown = false;
      return this;
    },

    lookup: function lookup(event) {
      var items;

      this.query = this.$element.val();

      if (!this.query || this.query.length < this.options.minLength) {
        return this.shown ? this.hide() : this;
      }

      items = $.isFunction(this.source) ? this.source(this.query, $.proxy(this.process, this)) : this.source;

      return items ? this.process(items) : this;
    },

    process: function process(items) {
      var that = this;

      items = $.grep(items, function (item) {
        return that.matcher(item);
      });

      items = this.sorter(items);

      if (!items.length) {
        return this.shown ? this.hide() : this;
      }

      return this.render(items.slice(0, this.options.items)).show();
    },

    matcher: function matcher(item) {
      return ~item.toLowerCase().indexOf(this.query.toLowerCase());
    },

    sorter: function sorter(items) {
      var beginswith = [],
          caseSensitive = [],
          caseInsensitive = [],
          item;

      while (item = items.shift()) {
        if (!item.toLowerCase().indexOf(this.query.toLowerCase())) beginswith.push(item);else if (~item.indexOf(this.query)) caseSensitive.push(item);else caseInsensitive.push(item);
      }

      return beginswith.concat(caseSensitive, caseInsensitive);
    },

    highlighter: function highlighter(item) {
      var query = this.query.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, '\\$&');
      return item.replace(new RegExp('(' + query + ')', 'ig'), function ($1, match) {
        return '<strong>' + match + '</strong>';
      });
    },

    render: function render(items) {
      var that = this;

      items = $(items).map(function (i, item) {
        i = $(that.options.item).attr('data-value', item);
        i.find('a').html(that.highlighter(item));
        return i[0];
      });

      items.first().addClass('active');
      this.$menu.html(items);
      return this;
    },

    next: function next(event) {
      var active = this.$menu.find('.active').removeClass('active'),
          next = active.next();

      if (!next.length) {
        next = $(this.$menu.find('li')[0]);
      }

      next.addClass('active');
    },

    prev: function prev(event) {
      var active = this.$menu.find('.active').removeClass('active'),
          prev = active.prev();

      if (!prev.length) {
        prev = this.$menu.find('li').last();
      }

      prev.addClass('active');
    },

    listen: function listen() {
      this.$element.on('focus', $.proxy(this.focus, this)).on('blur', $.proxy(this.blur, this)).on('keypress', $.proxy(this.keypress, this)).on('keyup', $.proxy(this.keyup, this));

      if (this.eventSupported('keydown')) {
        this.$element.on('keydown', $.proxy(this.keydown, this));
      }

      this.$menu.on('click', $.proxy(this.click, this)).on('mouseenter', 'li', $.proxy(this.mouseenter, this)).on('mouseleave', 'li', $.proxy(this.mouseleave, this));
    },

    eventSupported: function eventSupported(eventName) {
      var isSupported = eventName in this.$element;
      if (!isSupported) {
        this.$element.setAttribute(eventName, 'return;');
        isSupported = typeof this.$element[eventName] === 'function';
      }
      return isSupported;
    },

    move: function move(e) {
      if (!this.shown) return;

      switch (e.keyCode) {
        case 9: // tab
        case 13: // enter
        case 27:
          // escape
          e.preventDefault();
          break;

        case 38:
          // up arrow
          e.preventDefault();
          this.prev();
          break;

        case 40:
          // down arrow
          e.preventDefault();
          this.next();
          break;
      }

      e.stopPropagation();
    },

    keydown: function keydown(e) {
      this.suppressKeyPressRepeat = ~$.inArray(e.keyCode, [40, 38, 9, 13, 27]);
      this.move(e);
    },

    keypress: function keypress(e) {
      if (this.suppressKeyPressRepeat) return;
      this.move(e);
    },

    keyup: function keyup(e) {
      switch (e.keyCode) {
        case 40: // down arrow
        case 38: // up arrow
        case 16: // shift
        case 17: // ctrl
        case 18:
          // alt
          break;

        case 9: // tab
        case 13:
          // enter
          if (!this.shown) return;
          this.select();
          break;

        case 27:
          // escape
          if (!this.shown) return;
          this.hide();
          break;

        default:
          this.lookup();
      }

      e.stopPropagation();
      e.preventDefault();
    },

    focus: function focus(e) {
      this.focused = true;
    },

    blur: function blur(e) {
      this.focused = false;
      if (!this.mousedover && this.shown) this.hide();
    },

    click: function click(e) {
      e.stopPropagation();
      e.preventDefault();
      this.select();
      this.$element.focus();
    },

    mouseenter: function mouseenter(e) {
      this.mousedover = true;
      this.$menu.find('.active').removeClass('active');
      $(e.currentTarget).addClass('active');
    },

    mouseleave: function mouseleave(e) {
      this.mousedover = false;
      if (!this.focused && this.shown) this.hide();
    }

    /* TYPEAHEAD PLUGIN DEFINITION
     * =========================== */

  };var old = $.fn.typeahead;

  $.fn.typeahead = function (option) {
    return this.each(function () {
      var $this = $(this),
          data = $this.data('typeahead'),
          options = (typeof option === 'undefined' ? 'undefined' : _typeof(option)) == 'object' && option;
      if (!data) $this.data('typeahead', data = new Typeahead(this, options));
      if (typeof option == 'string') data[option]();
    });
  };

  $.fn.typeahead.defaults = {
    source: [],
    items: 8,
    menu: '<ul class="typeahead dropdown-menu"></ul>',
    item: '<li><a href="#"></a></li>',
    minLength: 1
  };

  $.fn.typeahead.Constructor = Typeahead;

  /* TYPEAHEAD NO CONFLICT
   * =================== */

  $.fn.typeahead.noConflict = function () {
    $.fn.typeahead = old;
    return this;
  };

  /* TYPEAHEAD DATA-API
   * ================== */

  $(document).on('focus.typeahead.data-api', '[data-provide="typeahead"]', function (e) {
    var $this = $(this);
    if ($this.data('typeahead')) return;
    $this.typeahead($this.data());
  });
}(window.jQuery);
/* ==========================================================
 * bootstrap-affix.js v2.3.1
 * http://twitter.github.com/bootstrap/javascript.html#affix
 * ==========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */

!function ($) {

  "use strict"; // jshint ;_;


  /* AFFIX CLASS DEFINITION
   * ====================== */

  var Affix = function Affix(element, options) {
    this.options = $.extend({}, $.fn.affix.defaults, options);
    this.$window = $(window).on('scroll.affix.data-api', $.proxy(this.checkPosition, this)).on('click.affix.data-api', $.proxy(function () {
      setTimeout($.proxy(this.checkPosition, this), 1);
    }, this));
    this.$element = $(element);
    this.checkPosition();
  };

  Affix.prototype.checkPosition = function () {
    if (!this.$element.is(':visible')) return;

    var scrollHeight = $(document).height(),
        scrollTop = this.$window.scrollTop(),
        position = this.$element.offset(),
        offset = this.options.offset,
        offsetBottom = offset.bottom,
        offsetTop = offset.top,
        reset = 'affix affix-top affix-bottom',
        affix;

    if ((typeof offset === 'undefined' ? 'undefined' : _typeof(offset)) != 'object') offsetBottom = offsetTop = offset;
    if (typeof offsetTop == 'function') offsetTop = offset.top();
    if (typeof offsetBottom == 'function') offsetBottom = offset.bottom();

    affix = this.unpin != null && scrollTop + this.unpin <= position.top ? false : offsetBottom != null && position.top + this.$element.height() >= scrollHeight - offsetBottom ? 'bottom' : offsetTop != null && scrollTop <= offsetTop ? 'top' : false;

    if (this.affixed === affix) return;

    this.affixed = affix;
    this.unpin = affix == 'bottom' ? position.top - scrollTop : null;

    this.$element.removeClass(reset).addClass('affix' + (affix ? '-' + affix : ''));
  };

  /* AFFIX PLUGIN DEFINITION
   * ======================= */

  var old = $.fn.affix;

  $.fn.affix = function (option) {
    return this.each(function () {
      var $this = $(this),
          data = $this.data('affix'),
          options = (typeof option === 'undefined' ? 'undefined' : _typeof(option)) == 'object' && option;
      if (!data) $this.data('affix', data = new Affix(this, options));
      if (typeof option == 'string') data[option]();
    });
  };

  $.fn.affix.Constructor = Affix;

  $.fn.affix.defaults = {
    offset: 0

    /* AFFIX NO CONFLICT
     * ================= */

  };$.fn.affix.noConflict = function () {
    $.fn.affix = old;
    return this;
  };

  /* AFFIX DATA-API
   * ============== */

  $(window).on('load', function () {
    $('[data-spy="affix"]').each(function () {
      var $spy = $(this),
          data = $spy.data();

      data.offset = data.offset || {};

      data.offsetBottom && (data.offset.bottom = data.offsetBottom);
      data.offsetTop && (data.offset.top = data.offsetTop);

      $spy.affix(data);
    });
  });
}(window.jQuery);self._386 = self._386 || {};

$(function () {
  var character = { height: 20, width: 12.4 };

  function scrollLock() {
    var last = 0;
    $(window).bind('scroll', function (e) {
      var func,
          off = $(window).scrollTop();

      console.log(off, last, off < last ? "up" : "down");

      // this determines whether the user is intending to go up or down.
      func = off < last ? "floor" : "ceil";

      // make sure we don't run this from ourselves
      if (off % character.height === 0) {
        return;
      }
      last = off;

      window.scrollTo(0, Math[func](off / character.height) * character.height);
    });
  }

  function loading() {

    if (_386.fastLoad) {
      document.body.style.visibility = 'visible';
      return;
    }

    var onePass = _386.onePass,
        speedFactor = 1 / (_386.speedFactor || 1) * 165000;
    wrap = document.createElement('div'), bar = wrap.appendChild(document.createElement('div')), cursor = document.createElement('div'),
    // If the user specified that the visibility is hidden, then we
    // start at the first pass ... otherwise we just do the 
    // cursor fly-by
    pass = $(document.body).css('visibility') == 'visible' ? 1 : 0, height = $(window).height(), width = $(window).width(),

    // this makes the loading of the screen proportional to the real-estate of the window.
    // it helps keep the cool sequence there while not making it waste too much time.
    rounds = height * width / speedFactor, column = width, row = height - character.height;

    wrap.id = "wrap386";
    bar.id = "bar386";
    cursor.id = "cursor386";

    cursor.innerHTML = bar.innerHTML = '&#9604;';

    // only inject the wrap if the pass is 0
    if (pass === 0) {
      document.body.appendChild(wrap);
      document.body.style.visibility = 'visible';
    } else {
      document.body.appendChild(cursor);
      rounds /= 2;
      character.height *= 4;
    }

    var ival = setInterval(function () {
      for (var m = 0; m < rounds; m++) {
        column -= character.width;

        if (column <= 0) {
          column = width;
          row -= character.height;
        }
        if (row <= 0) {
          pass++;
          row = height - character.height;

          if (pass == 2) {
            document.body.removeChild(cursor);
            clearInterval(ival);
          } else {
            wrap.parentNode.removeChild(wrap);
            if (onePass) {
              clearInterval(ival);
            } else {
              document.body.appendChild(cursor);
              rounds /= 2;
              character.height *= 4;
            }
          }
        }

        if (pass === 0) {
          bar.style.width = column + "px";
          wrap.style.height = row + "px";
        } else {
          cursor.style.right = column + "px";
          cursor.style.bottom = row + "px";
        }
      }
    }, 1);
  }
  loading();
});

/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgMjA3OGI3NmZiNzQ0ZWQ1YmY5YjMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2Fzc2V0cy9qYXZhc2NyaXB0cy9tYWluLmpzIiwid2VicGFjazovLy8uL2xpYi9hbWJlci9hc3NldHMvanMvYW1iZXIuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2Fzc2V0cy9qYXZhc2NyaXB0cy9ib290c3RyYXAuanMiXSwibmFtZXMiOlsiRGF0ZSIsInByb3RvdHlwZSIsInRvR3Jhbml0ZSIsInBhZCIsIm51bWJlciIsImdldFVUQ0Z1bGxZZWFyIiwiZ2V0VVRDTW9udGgiLCJnZXRVVENEYXRlIiwiZ2V0VVRDSG91cnMiLCJnZXRVVENNaW51dGVzIiwiZ2V0VVRDU2Vjb25kcyIsIkVWRU5UUyIsImpvaW4iLCJsZWF2ZSIsIm1lc3NhZ2UiLCJTVEFMRV9DT05ORUNUSU9OX1RIUkVTSE9MRF9TRUNPTkRTIiwiU09DS0VUX1BPTExJTkdfUkFURSIsIm5vdyIsImdldFRpbWUiLCJzZWNvbmRzU2luY2UiLCJ0aW1lIiwiQ2hhbm5lbCIsInRvcGljIiwic29ja2V0Iiwib25NZXNzYWdlSGFuZGxlcnMiLCJ3cyIsInNlbmQiLCJKU09OIiwic3RyaW5naWZ5IiwiZXZlbnQiLCJtc2ciLCJmb3JFYWNoIiwiaGFuZGxlciIsInN1YmplY3QiLCJjYWxsYmFjayIsInBheWxvYWQiLCJwdXNoIiwiU29ja2V0IiwiZW5kcG9pbnQiLCJjaGFubmVscyIsImxhc3RQaW5nIiwicmVjb25uZWN0VHJpZXMiLCJhdHRlbXB0UmVjb25uZWN0IiwiY2xlYXJUaW1lb3V0IiwicmVjb25uZWN0VGltZW91dCIsInNldFRpbWVvdXQiLCJjb25uZWN0IiwicGFyYW1zIiwiX3JlY29ubmVjdCIsIl9yZWNvbm5lY3RJbnRlcnZhbCIsInBvbGxpbmdUaW1lb3V0IiwiX2Nvbm5lY3Rpb25Jc1N0YWxlIiwiX3BvbGwiLCJfc3RhcnRQb2xsaW5nIiwib3B0cyIsImxvY2F0aW9uIiwid2luZG93IiwiaG9zdG5hbWUiLCJwb3J0IiwicHJvdG9jb2wiLCJPYmplY3QiLCJhc3NpZ24iLCJQcm9taXNlIiwicmVzb2x2ZSIsInJlamVjdCIsIldlYlNvY2tldCIsIm9ubWVzc2FnZSIsImhhbmRsZU1lc3NhZ2UiLCJvbmNsb3NlIiwib25vcGVuIiwiX3Jlc2V0IiwiY2xvc2UiLCJjaGFubmVsIiwiZGF0YSIsIl9oYW5kbGVQaW5nIiwicGFyc2VkX21zZyIsInBhcnNlIiwibW9kdWxlIiwiZXhwb3J0cyIsImRvY3VtZW50IiwiYWRkRXZlbnRMaXN0ZW5lciIsInF1ZXJ5U2VsZWN0b3JBbGwiLCJlbGVtZW50IiwiZSIsInByZXZlbnREZWZhdWx0IiwiZ2V0QXR0cmlidXRlIiwiY29uZmlybSIsImZvcm0iLCJjcmVhdGVFbGVtZW50IiwiaW5wdXQiLCJzZXRBdHRyaWJ1dGUiLCJhcHBlbmRDaGlsZCIsImJvZHkiLCJzdWJtaXQiLCIkIiwic3VwcG9ydCIsInRyYW5zaXRpb24iLCJ0cmFuc2l0aW9uRW5kIiwiZWwiLCJ0cmFuc0VuZEV2ZW50TmFtZXMiLCJuYW1lIiwic3R5bGUiLCJ1bmRlZmluZWQiLCJlbmQiLCJqUXVlcnkiLCJkaXNtaXNzIiwiQWxlcnQiLCJvbiIsIiR0aGlzIiwic2VsZWN0b3IiLCJhdHRyIiwiJHBhcmVudCIsInJlcGxhY2UiLCJsZW5ndGgiLCJoYXNDbGFzcyIsInBhcmVudCIsInRyaWdnZXIiLCJFdmVudCIsImlzRGVmYXVsdFByZXZlbnRlZCIsInJlbW92ZUNsYXNzIiwicmVtb3ZlRWxlbWVudCIsInJlbW92ZSIsIm9sZCIsImZuIiwiYWxlcnQiLCJvcHRpb24iLCJlYWNoIiwiY2FsbCIsIkNvbnN0cnVjdG9yIiwibm9Db25mbGljdCIsIkJ1dHRvbiIsIm9wdGlvbnMiLCIkZWxlbWVudCIsImV4dGVuZCIsImJ1dHRvbiIsImRlZmF1bHRzIiwic2V0U3RhdGUiLCJzdGF0ZSIsImQiLCIkZWwiLCJ2YWwiLCJpcyIsInJlc2V0VGV4dCIsImFkZENsYXNzIiwicmVtb3ZlQXR0ciIsInRvZ2dsZSIsImNsb3Nlc3QiLCJmaW5kIiwidG9nZ2xlQ2xhc3MiLCJsb2FkaW5nVGV4dCIsIiRidG4iLCJ0YXJnZXQiLCJDYXJvdXNlbCIsIiRpbmRpY2F0b3JzIiwicGF1c2UiLCJwcm94eSIsImN5Y2xlIiwicGF1c2VkIiwiaW50ZXJ2YWwiLCJjbGVhckludGVydmFsIiwic2V0SW50ZXJ2YWwiLCJuZXh0IiwiZ2V0QWN0aXZlSW5kZXgiLCIkYWN0aXZlIiwiJGl0ZW1zIiwiY2hpbGRyZW4iLCJpbmRleCIsInRvIiwicG9zIiwiYWN0aXZlSW5kZXgiLCJ0aGF0Iiwic2xpZGluZyIsIm9uZSIsInNsaWRlIiwicHJldiIsInR5cGUiLCIkbmV4dCIsImlzQ3ljbGluZyIsImRpcmVjdGlvbiIsImZhbGxiYWNrIiwicmVsYXRlZFRhcmdldCIsIiRuZXh0SW5kaWNhdG9yIiwib2Zmc2V0V2lkdGgiLCJjYXJvdXNlbCIsImFjdGlvbiIsImhyZWYiLCIkdGFyZ2V0Iiwic2xpZGVJbmRleCIsIkNvbGxhcHNlIiwiY29sbGFwc2UiLCJjb25zdHJ1Y3RvciIsImRpbWVuc2lvbiIsImhhc1dpZHRoIiwic2hvdyIsInNjcm9sbCIsImFjdGl2ZXMiLCJoYXNEYXRhIiwidHJhbnNpdGlvbmluZyIsImNhbWVsQ2FzZSIsImhpZGUiLCJyZXNldCIsInNpemUiLCJtZXRob2QiLCJzdGFydEV2ZW50IiwiY29tcGxldGVFdmVudCIsImNvbXBsZXRlIiwiRHJvcGRvd24iLCJpc0FjdGl2ZSIsImdldFBhcmVudCIsImNsZWFyTWVudXMiLCJmb2N1cyIsImtleWRvd24iLCJ0ZXN0Iiwia2V5Q29kZSIsInN0b3BQcm9wYWdhdGlvbiIsIndoaWNoIiwiY2xpY2siLCJmaWx0ZXIiLCJlcSIsImRyb3Bkb3duIiwiTW9kYWwiLCJkZWxlZ2F0ZSIsInJlbW90ZSIsImxvYWQiLCJpc1Nob3duIiwiZXNjYXBlIiwiYmFja2Ryb3AiLCJhcHBlbmRUbyIsImVuZm9yY2VGb2N1cyIsIm9mZiIsImhpZGVXaXRoVHJhbnNpdGlvbiIsImhpZGVNb2RhbCIsImhhcyIsImtleWJvYXJkIiwidGltZW91dCIsInJlbW92ZUJhY2tkcm9wIiwiJGJhY2tkcm9wIiwiYW5pbWF0ZSIsImRvQW5pbWF0ZSIsIm1vZGFsIiwiVG9vbHRpcCIsImluaXQiLCJldmVudEluIiwiZXZlbnRPdXQiLCJ0cmlnZ2VycyIsImkiLCJnZXRPcHRpb25zIiwiZW5hYmxlZCIsInNwbGl0IiwiZW50ZXIiLCJfb3B0aW9ucyIsImZpeFRpdGxlIiwiZGVsYXkiLCJzZWxmIiwia2V5IiwidmFsdWUiLCJjdXJyZW50VGFyZ2V0IiwiaG92ZXJTdGF0ZSIsIiR0aXAiLCJhY3R1YWxXaWR0aCIsImFjdHVhbEhlaWdodCIsInBsYWNlbWVudCIsInRwIiwiaGFzQ29udGVudCIsInRpcCIsInNldENvbnRlbnQiLCJhbmltYXRpb24iLCJkZXRhY2giLCJjc3MiLCJ0b3AiLCJsZWZ0IiwiZGlzcGxheSIsImNvbnRhaW5lciIsImluc2VydEFmdGVyIiwiZ2V0UG9zaXRpb24iLCJvZmZzZXRIZWlnaHQiLCJoZWlnaHQiLCJ3aWR0aCIsImFwcGx5UGxhY2VtZW50Iiwib2Zmc2V0IiwiZGVsdGEiLCJyZXBsYWNlQXJyb3ciLCJwb3NpdGlvbiIsImFycm93IiwidGl0bGUiLCJnZXRUaXRsZSIsImh0bWwiLCJyZW1vdmVXaXRoQW5pbWF0aW9uIiwiJGUiLCJnZXRCb3VuZGluZ0NsaWVudFJlY3QiLCJvIiwidGVtcGxhdGUiLCIkYXJyb3ciLCJ2YWxpZGF0ZSIsInBhcmVudE5vZGUiLCJlbmFibGUiLCJkaXNhYmxlIiwidG9nZ2xlRW5hYmxlZCIsImRlc3Ryb3kiLCJyZW1vdmVEYXRhIiwidG9vbHRpcCIsIlBvcG92ZXIiLCJjb250ZW50IiwiZ2V0Q29udGVudCIsInBvcG92ZXIiLCJTY3JvbGxTcHkiLCJwcm9jZXNzIiwic2Nyb2xsc3B5IiwiJHNjcm9sbEVsZW1lbnQiLCIkYm9keSIsInJlZnJlc2giLCIkdGFyZ2V0cyIsIm9mZnNldHMiLCJ0YXJnZXRzIiwibWFwIiwiJGhyZWYiLCJpc1dpbmRvdyIsImdldCIsInNjcm9sbFRvcCIsInNvcnQiLCJhIiwiYiIsInNjcm9sbEhlaWdodCIsIm1heFNjcm9sbCIsImFjdGl2ZVRhcmdldCIsImxhc3QiLCJhY3RpdmF0ZSIsImFjdGl2ZSIsIiRzcHkiLCJUYWIiLCIkdWwiLCJwcmV2aW91cyIsInRhYiIsIlR5cGVhaGVhZCIsInR5cGVhaGVhZCIsIm1hdGNoZXIiLCJzb3J0ZXIiLCJoaWdobGlnaHRlciIsInVwZGF0ZXIiLCJzb3VyY2UiLCIkbWVudSIsIm1lbnUiLCJzaG93biIsImxpc3RlbiIsInNlbGVjdCIsImNoYW5nZSIsIml0ZW0iLCJsb29rdXAiLCJpdGVtcyIsInF1ZXJ5IiwibWluTGVuZ3RoIiwiaXNGdW5jdGlvbiIsImdyZXAiLCJyZW5kZXIiLCJzbGljZSIsInRvTG93ZXJDYXNlIiwiaW5kZXhPZiIsImJlZ2luc3dpdGgiLCJjYXNlU2Vuc2l0aXZlIiwiY2FzZUluc2Vuc2l0aXZlIiwic2hpZnQiLCJjb25jYXQiLCJSZWdFeHAiLCIkMSIsIm1hdGNoIiwiZmlyc3QiLCJibHVyIiwia2V5cHJlc3MiLCJrZXl1cCIsImV2ZW50U3VwcG9ydGVkIiwibW91c2VlbnRlciIsIm1vdXNlbGVhdmUiLCJldmVudE5hbWUiLCJpc1N1cHBvcnRlZCIsIm1vdmUiLCJzdXBwcmVzc0tleVByZXNzUmVwZWF0IiwiaW5BcnJheSIsImZvY3VzZWQiLCJtb3VzZWRvdmVyIiwiQWZmaXgiLCJhZmZpeCIsIiR3aW5kb3ciLCJjaGVja1Bvc2l0aW9uIiwib2Zmc2V0Qm90dG9tIiwiYm90dG9tIiwib2Zmc2V0VG9wIiwidW5waW4iLCJhZmZpeGVkIiwiXzM4NiIsImNoYXJhY3RlciIsInNjcm9sbExvY2siLCJiaW5kIiwiZnVuYyIsImNvbnNvbGUiLCJsb2ciLCJzY3JvbGxUbyIsIk1hdGgiLCJsb2FkaW5nIiwiZmFzdExvYWQiLCJ2aXNpYmlsaXR5Iiwib25lUGFzcyIsInNwZWVkRmFjdG9yIiwid3JhcCIsImJhciIsImN1cnNvciIsInBhc3MiLCJyb3VuZHMi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SSxLQUFUO0FBQ0FtSSxpQkFBT25CLFVBQVVqSCxNQUFqQjtBQUNEO0FBQ0QsWUFBR29JLE9BQU8sQ0FBVixFQUFhO0FBQ1hIO0FBQ0FHLGdCQUFNcEksU0FBU2lILFVBQVVqSCxNQUF6Qjs7QUFFQSxjQUFHaUksUUFBUSxDQUFYLEVBQWM7QUFDWnRVLHFCQUFTYSxJQUFULENBQWNpVSxXQUFkLENBQTBCVCxNQUExQjtBQUNBclAsMEJBQWM0UCxJQUFkO0FBQ0QsV0FIRCxNQUdPO0FBQ0xULGlCQUFLNUcsVUFBTCxDQUFnQnVILFdBQWhCLENBQTRCWCxJQUE1QjtBQUNBLGdCQUFHRixPQUFILEVBQVk7QUFDVmpQLDRCQUFjNFAsSUFBZDtBQUNELGFBRkQsTUFFTztBQUNMNVUsdUJBQVNhLElBQVQsQ0FBY0QsV0FBZCxDQUEwQnlULE1BQTFCO0FBQ0FFLHdCQUFVLENBQVY7QUFDQWpCLHdCQUFVakgsTUFBVixJQUFvQixDQUFwQjtBQUNEO0FBQ0Y7QUFDRjs7QUFFRCxZQUFHaUksU0FBUyxDQUFaLEVBQWU7QUFDYkYsY0FBSTlTLEtBQUosQ0FBVWdMLEtBQVYsR0FBa0JrSSxTQUFTLElBQTNCO0FBQ0FMLGVBQUs3UyxLQUFMLENBQVcrSyxNQUFYLEdBQW9Cb0ksTUFBTSxJQUExQjtBQUNELFNBSEQsTUFHTztBQUNMSixpQkFBTy9TLEtBQVAsQ0FBYXlULEtBQWIsR0FBcUJQLFNBQVMsSUFBOUI7QUFDQUgsaUJBQU8vUyxLQUFQLENBQWEyUixNQUFiLEdBQXNCd0IsTUFBTSxJQUE1QjtBQUNEO0FBQ0Y7QUFDRixLQW5DVSxFQW1DUixDQW5DUSxDQUFYO0FBb0NEO0FBQ0RYO0FBQ0QsQ0EzR0QsRSIsImZpbGUiOiJtYWluLmJ1bmRsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwge1xuIFx0XHRcdFx0Y29uZmlndXJhYmxlOiBmYWxzZSxcbiBcdFx0XHRcdGVudW1lcmFibGU6IHRydWUsXG4gXHRcdFx0XHRnZXQ6IGdldHRlclxuIFx0XHRcdH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIi9hc3NldHNcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSAwKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCAyMDc4Yjc2ZmI3NDRlZDViZjliMyIsImltcG9ydCBBbWJlciBmcm9tICdhbWJlcidcblxuaWYgKCFEYXRlLnByb3RvdHlwZS50b0dyYW5pdGUpIHtcbiAgKGZ1bmN0aW9uKCkge1xuXG4gICAgZnVuY3Rpb24gcGFkKG51bWJlcikge1xuICAgICAgaWYgKG51bWJlciA8IDEwKSB7XG4gICAgICAgIHJldHVybiAnMCcgKyBudW1iZXI7XG4gICAgICB9XG4gICAgICByZXR1cm4gbnVtYmVyO1xuICAgIH1cblxuICAgIERhdGUucHJvdG90eXBlLnRvR3Jhbml0ZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMuZ2V0VVRDRnVsbFllYXIoKSArXG4gICAgICAgICctJyArIHBhZCh0aGlzLmdldFVUQ01vbnRoKCkgKyAxKSArXG4gICAgICAgICctJyArIHBhZCh0aGlzLmdldFVUQ0RhdGUoKSkgK1xuICAgICAgICAnICcgKyBwYWQodGhpcy5nZXRVVENIb3VycygpKSArXG4gICAgICAgICc6JyArIHBhZCh0aGlzLmdldFVUQ01pbnV0ZXMoKSkgK1xuICAgICAgICAnOicgKyBwYWQodGhpcy5nZXRVVENTZWNvbmRzKCkpICA7XG4gICAgfTtcblxuICB9KCkpO1xufVxuXG5pbXBvcnQgJy4vYm9vdHN0cmFwLmpzJ1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2Fzc2V0cy9qYXZhc2NyaXB0cy9tYWluLmpzIiwiY29uc3QgRVZFTlRTID0ge1xuICBqb2luOiAnam9pbicsXG4gIGxlYXZlOiAnbGVhdmUnLFxuICBtZXNzYWdlOiAnbWVzc2FnZSdcbn1cbmNvbnN0IFNUQUxFX0NPTk5FQ1RJT05fVEhSRVNIT0xEX1NFQ09ORFMgPSAxMDBcbmNvbnN0IFNPQ0tFVF9QT0xMSU5HX1JBVEUgPSAxMDAwMFxuXG4vKipcbiAqIFJldHVybnMgYSBudW1lcmljIHZhbHVlIGZvciB0aGUgY3VycmVudCB0aW1lXG4gKi9cbmxldCBub3cgPSAoKSA9PiB7XG4gIHJldHVybiBuZXcgRGF0ZSgpLmdldFRpbWUoKVxufVxuXG4vKipcbiAqIFJldHVybnMgdGhlIGRpZmZlcmVuY2UgYmV0d2VlbiB0aGUgY3VycmVudCB0aW1lIGFuZCBwYXNzZWQgYHRpbWVgIGluIHNlY29uZHNcbiAqIEBwYXJhbSB7TnVtYmVyfERhdGV9IHRpbWUgLSBBIG51bWVyaWMgdGltZSBvciBkYXRlIG9iamVjdFxuICovXG5sZXQgc2Vjb25kc1NpbmNlID0gKHRpbWUpID0+IHtcbiAgcmV0dXJuIChub3coKSAtIHRpbWUpIC8gMTAwMFxufVxuXG4vKipcbiAqIENsYXNzIGZvciBjaGFubmVsIHJlbGF0ZWQgZnVuY3Rpb25zIChqb2luaW5nLCBsZWF2aW5nLCBzdWJzY3JpYmluZyBhbmQgc2VuZGluZyBtZXNzYWdlcylcbiAqL1xuZXhwb3J0IGNsYXNzIENoYW5uZWwge1xuICAvKipcbiAgICogQHBhcmFtIHtTdHJpbmd9IHRvcGljIC0gdG9waWMgdG8gc3Vic2NyaWJlIHRvXG4gICAqIEBwYXJhbSB7U29ja2V0fSBzb2NrZXQgLSBBIFNvY2tldCBpbnN0YW5jZVxuICAgKi9cbiAgY29uc3RydWN0b3IodG9waWMsIHNvY2tldCkge1xuICAgIHRoaXMudG9waWMgPSB0b3BpY1xuICAgIHRoaXMuc29ja2V0ID0gc29ja2V0XG4gICAgdGhpcy5vbk1lc3NhZ2VIYW5kbGVycyA9IFtdXG4gIH1cblxuICAvKipcbiAgICogSm9pbiBhIGNoYW5uZWwsIHN1YnNjcmliZSB0byBhbGwgY2hhbm5lbHMgbWVzc2FnZXNcbiAgICovXG4gIGpvaW4oKSB7XG4gICAgdGhpcy5zb2NrZXQud3Muc2VuZChKU09OLnN0cmluZ2lmeSh7IGV2ZW50OiBFVkVOVFMuam9pbiwgdG9waWM6IHRoaXMudG9waWMgfSkpXG4gIH1cblxuICAvKipcbiAgICogTGVhdmUgYSBjaGFubmVsLCBzdG9wIHN1YnNjcmliaW5nIHRvIGNoYW5uZWwgbWVzc2FnZXNcbiAgICovXG4gIGxlYXZlKCkge1xuICAgIHRoaXMuc29ja2V0LndzLnNlbmQoSlNPTi5zdHJpbmdpZnkoeyBldmVudDogRVZFTlRTLmxlYXZlLCB0b3BpYzogdGhpcy50b3BpYyB9KSlcbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxscyBhbGwgbWVzc2FnZSBoYW5kbGVycyB3aXRoIGEgbWF0Y2hpbmcgc3ViamVjdFxuICAgKi9cbiAgaGFuZGxlTWVzc2FnZShtc2cpIHtcbiAgICB0aGlzLm9uTWVzc2FnZUhhbmRsZXJzLmZvckVhY2goKGhhbmRsZXIpID0+IHtcbiAgICAgIGlmIChoYW5kbGVyLnN1YmplY3QgPT09IG1zZy5zdWJqZWN0KSBoYW5kbGVyLmNhbGxiYWNrKG1zZy5wYXlsb2FkKVxuICAgIH0pXG4gIH1cblxuICAvKipcbiAgICogU3Vic2NyaWJlIHRvIGEgY2hhbm5lbCBzdWJqZWN0XG4gICAqIEBwYXJhbSB7U3RyaW5nfSBzdWJqZWN0IC0gc3ViamVjdCB0byBsaXN0ZW4gZm9yOiBgbXNnOm5ld2BcbiAgICogQHBhcmFtIHtmdW5jdGlvbn0gY2FsbGJhY2sgLSBjYWxsYmFjayBmdW5jdGlvbiB3aGVuIGEgbmV3IG1lc3NhZ2UgYXJyaXZlc1xuICAgKi9cbiAgb24oc3ViamVjdCwgY2FsbGJhY2spIHtcbiAgICB0aGlzLm9uTWVzc2FnZUhhbmRsZXJzLnB1c2goeyBzdWJqZWN0OiBzdWJqZWN0LCBjYWxsYmFjazogY2FsbGJhY2sgfSlcbiAgfVxuXG4gIC8qKlxuICAgKiBTZW5kIGEgbmV3IG1lc3NhZ2UgdG8gdGhlIGNoYW5uZWxcbiAgICogQHBhcmFtIHtTdHJpbmd9IHN1YmplY3QgLSBzdWJqZWN0IHRvIHNlbmQgbWVzc2FnZSB0bzogYG1zZzpuZXdgXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBwYXlsb2FkIC0gcGF5bG9hZCBvYmplY3Q6IGB7bWVzc2FnZTogJ2hlbGxvJ31gXG4gICAqL1xuICBwdXNoKHN1YmplY3QsIHBheWxvYWQpIHtcbiAgICB0aGlzLnNvY2tldC53cy5zZW5kKEpTT04uc3RyaW5naWZ5KHsgZXZlbnQ6IEVWRU5UUy5tZXNzYWdlLCB0b3BpYzogdGhpcy50b3BpYywgc3ViamVjdDogc3ViamVjdCwgcGF5bG9hZDogcGF5bG9hZCB9KSlcbiAgfVxufVxuXG4vKipcbiAqIENsYXNzIGZvciBtYWludGFpbmluZyBjb25uZWN0aW9uIHdpdGggc2VydmVyIGFuZCBtYWludGFpbmluZyBjaGFubmVscyBsaXN0XG4gKi9cbmV4cG9ydCBjbGFzcyBTb2NrZXQge1xuICAvKipcbiAgICogQHBhcmFtIHtTdHJpbmd9IGVuZHBvaW50IC0gV2Vic29ja2V0IGVuZHBvbnQgdXNlZCBpbiByb3V0ZXMuY3IgZmlsZVxuICAgKi9cbiAgY29uc3RydWN0b3IoZW5kcG9pbnQpIHtcbiAgICB0aGlzLmVuZHBvaW50ID0gZW5kcG9pbnRcbiAgICB0aGlzLndzID0gbnVsbFxuICAgIHRoaXMuY2hhbm5lbHMgPSBbXVxuICAgIHRoaXMubGFzdFBpbmcgPSBub3coKVxuICAgIHRoaXMucmVjb25uZWN0VHJpZXMgPSAwXG4gICAgdGhpcy5hdHRlbXB0UmVjb25uZWN0ID0gdHJ1ZVxuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgd2hldGhlciBvciBub3QgdGhlIGxhc3QgcmVjZWl2ZWQgcGluZyBoYXMgYmVlbiBwYXN0IHRoZSB0aHJlc2hvbGRcbiAgICovXG4gIF9jb25uZWN0aW9uSXNTdGFsZSgpIHtcbiAgICByZXR1cm4gc2Vjb25kc1NpbmNlKHRoaXMubGFzdFBpbmcpID4gU1RBTEVfQ09OTkVDVElPTl9USFJFU0hPTERfU0VDT05EU1xuICB9XG5cbiAgLyoqXG4gICAqIFRyaWVzIHRvIHJlY29ubmVjdCB0byB0aGUgd2Vic29ja2V0IHNlcnZlciB1c2luZyBhIHJlY3Vyc2l2ZSB0aW1lb3V0XG4gICAqL1xuICBfcmVjb25uZWN0KCkge1xuICAgIGNsZWFyVGltZW91dCh0aGlzLnJlY29ubmVjdFRpbWVvdXQpXG4gICAgdGhpcy5yZWNvbm5lY3RUaW1lb3V0ID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICB0aGlzLnJlY29ubmVjdFRyaWVzKytcbiAgICAgIHRoaXMuY29ubmVjdCh0aGlzLnBhcmFtcylcbiAgICAgIHRoaXMuX3JlY29ubmVjdCgpXG4gICAgfSwgdGhpcy5fcmVjb25uZWN0SW50ZXJ2YWwoKSlcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGFuIGluY3JlbWVudGluZyB0aW1lb3V0IGludGVydmFsIGJhc2VkIGFyb3VuZCB0aGUgbnVtYmVyIG9mIHJlY29ubmVjdGlvbiByZXRyaWVzXG4gICAqL1xuICBfcmVjb25uZWN0SW50ZXJ2YWwoKSB7XG4gICAgcmV0dXJuIFsxMDAwLCAyMDAwLCA1MDAwLCAxMDAwMF1bdGhpcy5yZWNvbm5lY3RUcmllc10gfHwgMTAwMDBcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIGEgcmVjdXJzaXZlIHRpbWVvdXQgdG8gY2hlY2sgaWYgdGhlIGNvbm5lY3Rpb24gaXMgc3RhbGVcbiAgICovXG4gIF9wb2xsKCkge1xuICAgIHRoaXMucG9sbGluZ1RpbWVvdXQgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIGlmICh0aGlzLl9jb25uZWN0aW9uSXNTdGFsZSgpKSB7XG4gICAgICAgIHRoaXMuX3JlY29ubmVjdCgpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl9wb2xsKClcbiAgICAgIH1cbiAgICB9LCBTT0NLRVRfUE9MTElOR19SQVRFKVxuICB9XG5cbiAgLyoqXG4gICAqIENsZWFyIHBvbGxpbmcgdGltZW91dCBhbmQgc3RhcnQgcG9sbGluZ1xuICAgKi9cbiAgX3N0YXJ0UG9sbGluZygpIHtcbiAgICBjbGVhclRpbWVvdXQodGhpcy5wb2xsaW5nVGltZW91dClcbiAgICB0aGlzLl9wb2xsKClcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIGBsYXN0UGluZ2AgdG8gdGhlIGN1cmVudCB0aW1lXG4gICAqL1xuICBfaGFuZGxlUGluZygpIHtcbiAgICB0aGlzLmxhc3RQaW5nID0gbm93KClcbiAgfVxuXG4gIC8qKlxuICAgKiBDbGVhcnMgcmVjb25uZWN0IHRpbWVvdXQsIHJlc2V0cyB2YXJpYWJsZXMgYW4gc3RhcnRzIHBvbGxpbmdcbiAgICovXG4gIF9yZXNldCgpIHtcbiAgICBjbGVhclRpbWVvdXQodGhpcy5yZWNvbm5lY3RUaW1lb3V0KVxuICAgIHRoaXMucmVjb25uZWN0VHJpZXMgPSAwXG4gICAgdGhpcy5hdHRlbXB0UmVjb25uZWN0ID0gdHJ1ZVxuICAgIHRoaXMuX3N0YXJ0UG9sbGluZygpXG4gIH1cblxuICAvKipcbiAgICogQ29ubmVjdCB0aGUgc29ja2V0IHRvIHRoZSBzZXJ2ZXIsIGFuZCBiaW5kcyB0byBuYXRpdmUgd3MgZnVuY3Rpb25zXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBwYXJhbXMgLSBPcHRpb25hbCBwYXJhbWV0ZXJzXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBwYXJhbXMubG9jYXRpb24gLSBIb3N0bmFtZSB0byBjb25uZWN0IHRvLCBkZWZhdWx0cyB0byBgd2luZG93LmxvY2F0aW9uLmhvc3RuYW1lYFxuICAgKiBAcGFyYW0ge1N0cmluZ30gcGFybWFzLnBvcnQgLSBQb3J0IHRvIGNvbm5lY3QgdG8sIGRlZmF1bHRzIHRvIGB3aW5kb3cubG9jYXRpb24ucG9ydGBcbiAgICogQHBhcmFtIHtTdHJpbmd9IHBhcmFtcy5wcm90b2NvbCAtIFByb3RvY29sIHRvIHVzZSwgZWl0aGVyICd3c3MnIG9yICd3cydcbiAgICovXG4gIGNvbm5lY3QocGFyYW1zKSB7XG4gICAgdGhpcy5wYXJhbXMgPSBwYXJhbXNcblxuICAgIGxldCBvcHRzID0ge1xuICAgICAgbG9jYXRpb246IHdpbmRvdy5sb2NhdGlvbi5ob3N0bmFtZSxcbiAgICAgIHBvcnQ6IHdpbmRvdy5sb2NhdGlvbi5wb3J0LFxuICAgICAgcHJvdG9jb2w6IHdpbmRvdy5sb2NhdGlvbi5wcm90b2NvbCA9PT0gJ2h0dHBzOicgPyAnd3NzOicgOiAnd3M6JyxcbiAgICB9XG5cbiAgICBpZiAocGFyYW1zKSBPYmplY3QuYXNzaWduKG9wdHMsIHBhcmFtcylcbiAgICBpZiAob3B0cy5wb3J0KSBvcHRzLmxvY2F0aW9uICs9IGA6JHtvcHRzLnBvcnR9YFxuXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIHRoaXMud3MgPSBuZXcgV2ViU29ja2V0KGAke29wdHMucHJvdG9jb2x9Ly8ke29wdHMubG9jYXRpb259JHt0aGlzLmVuZHBvaW50fWApXG4gICAgICB0aGlzLndzLm9ubWVzc2FnZSA9IChtc2cpID0+IHsgdGhpcy5oYW5kbGVNZXNzYWdlKG1zZykgfVxuICAgICAgdGhpcy53cy5vbmNsb3NlID0gKCkgPT4ge1xuICAgICAgICBpZiAodGhpcy5hdHRlbXB0UmVjb25uZWN0KSB0aGlzLl9yZWNvbm5lY3QoKVxuICAgICAgfVxuICAgICAgdGhpcy53cy5vbm9wZW4gPSAoKSA9PiB7XG4gICAgICAgIHRoaXMuX3Jlc2V0KClcbiAgICAgICAgcmVzb2x2ZSgpXG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIC8qKlxuICAgKiBDbG9zZXMgdGhlIHNvY2tldCBjb25uZWN0aW9uIHBlcm1hbmVudGx5XG4gICAqL1xuICBkaXNjb25uZWN0KCkge1xuICAgIHRoaXMuYXR0ZW1wdFJlY29ubmVjdCA9IGZhbHNlXG4gICAgY2xlYXJUaW1lb3V0KHRoaXMucG9sbGluZ1RpbWVvdXQpXG4gICAgY2xlYXJUaW1lb3V0KHRoaXMucmVjb25uZWN0VGltZW91dClcbiAgICB0aGlzLndzLmNsb3NlKClcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGRzIGEgbmV3IGNoYW5uZWwgdG8gdGhlIHNvY2tldCBjaGFubmVscyBsaXN0XG4gICAqIEBwYXJhbSB7U3RyaW5nfSB0b3BpYyAtIFRvcGljIGZvciB0aGUgY2hhbm5lbDogYGNoYXRfcm9vbToxMjNgXG4gICAqL1xuICBjaGFubmVsKHRvcGljKSB7XG4gICAgbGV0IGNoYW5uZWwgPSBuZXcgQ2hhbm5lbCh0b3BpYywgdGhpcylcbiAgICB0aGlzLmNoYW5uZWxzLnB1c2goY2hhbm5lbClcbiAgICByZXR1cm4gY2hhbm5lbFxuICB9XG5cbiAgLyoqXG4gICAqIE1lc3NhZ2UgaGFuZGxlciBmb3IgbWVzc2FnZXMgcmVjZWl2ZWRcbiAgICogQHBhcmFtIHtNZXNzYWdlRXZlbnR9IG1zZyAtIE1lc3NhZ2UgcmVjZWl2ZWQgZnJvbSB3c1xuICAgKi9cbiAgaGFuZGxlTWVzc2FnZShtc2cpIHtcbiAgICBpZiAobXNnLmRhdGEgPT09IFwicGluZ1wiKSByZXR1cm4gdGhpcy5faGFuZGxlUGluZygpXG5cbiAgICBsZXQgcGFyc2VkX21zZyA9IEpTT04ucGFyc2UobXNnLmRhdGEpXG4gICAgdGhpcy5jaGFubmVscy5mb3JFYWNoKChjaGFubmVsKSA9PiB7XG4gICAgICBpZiAoY2hhbm5lbC50b3BpYyA9PT0gcGFyc2VkX21zZy50b3BpYykgY2hhbm5lbC5oYW5kbGVNZXNzYWdlKHBhcnNlZF9tc2cpXG4gICAgfSlcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgU29ja2V0OiBTb2NrZXRcbn1cblxuXG4vKipcbiAqIEFsbG93cyBkZWxldGUgbGlua3MgdG8gcG9zdCBmb3Igc2VjdXJpdHkgYW5kIGVhc2Ugb2YgdXNlIHNpbWlsYXIgdG8gUmFpbHMganF1ZXJ5X3Vqc1xuICovXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiRE9NQ29udGVudExvYWRlZFwiLCBmdW5jdGlvbiAoKSB7XG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcImFbZGF0YS1tZXRob2Q9J2RlbGV0ZSddXCIpLmZvckVhY2goZnVuY3Rpb24gKGVsZW1lbnQpIHtcbiAgICAgICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIHZhciBtZXNzYWdlID0gZWxlbWVudC5nZXRBdHRyaWJ1dGUoXCJkYXRhLWNvbmZpcm1cIikgfHwgXCJBcmUgeW91IHN1cmU/XCI7XG4gICAgICAgICAgICBpZiAoY29uZmlybShtZXNzYWdlKSkge1xuICAgICAgICAgICAgICAgIHZhciBmb3JtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImZvcm1cIik7XG4gICAgICAgICAgICAgICAgdmFyIGlucHV0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImlucHV0XCIpO1xuICAgICAgICAgICAgICAgIGZvcm0uc2V0QXR0cmlidXRlKFwiYWN0aW9uXCIsIGVsZW1lbnQuZ2V0QXR0cmlidXRlKFwiaHJlZlwiKSk7XG4gICAgICAgICAgICAgICAgZm9ybS5zZXRBdHRyaWJ1dGUoXCJtZXRob2RcIiwgXCJQT1NUXCIpO1xuICAgICAgICAgICAgICAgIGlucHV0LnNldEF0dHJpYnV0ZShcInR5cGVcIiwgXCJoaWRkZW5cIik7XG4gICAgICAgICAgICAgICAgaW5wdXQuc2V0QXR0cmlidXRlKFwibmFtZVwiLCBcIl9tZXRob2RcIik7XG4gICAgICAgICAgICAgICAgaW5wdXQuc2V0QXR0cmlidXRlKFwidmFsdWVcIiwgXCJERUxFVEVcIik7XG4gICAgICAgICAgICAgICAgZm9ybS5hcHBlbmRDaGlsZChpbnB1dCk7XG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChmb3JtKTtcbiAgICAgICAgICAgICAgICBmb3JtLnN1Ym1pdCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9KVxuICAgIH0pXG59KTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL2xpYi9hbWJlci9hc3NldHMvanMvYW1iZXIuanMiLCIvKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqIGJvb3RzdHJhcC10cmFuc2l0aW9uLmpzIHYyLjMuMVxuICogaHR0cDovL3R3aXR0ZXIuZ2l0aHViLmNvbS9ib290c3RyYXAvamF2YXNjcmlwdC5odG1sI3RyYW5zaXRpb25zXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqIENvcHlyaWdodCAyMDEyIFR3aXR0ZXIsIEluYy5cbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cblxuXG4hZnVuY3Rpb24gKCQpIHtcblxuICBcInVzZSBzdHJpY3RcIjsgLy8ganNoaW50IDtfO1xuXG5cbiAgLyogQ1NTIFRSQU5TSVRJT04gU1VQUE9SVCAoaHR0cDovL3d3dy5tb2Rlcm5penIuY29tLylcbiAgICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuXG4gICQoZnVuY3Rpb24gKCkge1xuXG4gICAgJC5zdXBwb3J0LnRyYW5zaXRpb24gPSAoZnVuY3Rpb24gKCkge1xuXG4gICAgICB2YXIgdHJhbnNpdGlvbkVuZCA9IChmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgdmFyIGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYm9vdHN0cmFwJylcbiAgICAgICAgICAsIHRyYW5zRW5kRXZlbnROYW1lcyA9IHtcbiAgICAgICAgICAgICAgICdXZWJraXRUcmFuc2l0aW9uJyA6ICd3ZWJraXRUcmFuc2l0aW9uRW5kJ1xuICAgICAgICAgICAgLCAgJ01velRyYW5zaXRpb24nICAgIDogJ3RyYW5zaXRpb25lbmQnXG4gICAgICAgICAgICAsICAnT1RyYW5zaXRpb24nICAgICAgOiAnb1RyYW5zaXRpb25FbmQgb3RyYW5zaXRpb25lbmQnXG4gICAgICAgICAgICAsICAndHJhbnNpdGlvbicgICAgICAgOiAndHJhbnNpdGlvbmVuZCdcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAsIG5hbWVcblxuICAgICAgICBmb3IgKG5hbWUgaW4gdHJhbnNFbmRFdmVudE5hbWVzKXtcbiAgICAgICAgICBpZiAoZWwuc3R5bGVbbmFtZV0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuIHRyYW5zRW5kRXZlbnROYW1lc1tuYW1lXVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICB9KCkpXG5cbiAgICAgIHJldHVybiB0cmFuc2l0aW9uRW5kICYmIHtcbiAgICAgICAgZW5kOiB0cmFuc2l0aW9uRW5kXG4gICAgICB9XG5cbiAgICB9KSgpXG5cbiAgfSlcblxufSh3aW5kb3cualF1ZXJ5KTsvKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKiBib290c3RyYXAtYWxlcnQuanMgdjIuMy4xXG4gKiBodHRwOi8vdHdpdHRlci5naXRodWIuY29tL2Jvb3RzdHJhcC9qYXZhc2NyaXB0Lmh0bWwjYWxlcnRzXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKiBDb3B5cmlnaHQgMjAxMiBUd2l0dGVyLCBJbmMuXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG5cblxuIWZ1bmN0aW9uICgkKSB7XG5cbiAgXCJ1c2Ugc3RyaWN0XCI7IC8vIGpzaGludCA7XztcblxuXG4gLyogQUxFUlQgQ0xBU1MgREVGSU5JVElPTlxuICAqID09PT09PT09PT09PT09PT09PT09PT0gKi9cblxuICB2YXIgZGlzbWlzcyA9ICdbZGF0YS1kaXNtaXNzPVwiYWxlcnRcIl0nXG4gICAgLCBBbGVydCA9IGZ1bmN0aW9uIChlbCkge1xuICAgICAgICAkKGVsKS5vbignY2xpY2snLCBkaXNtaXNzLCB0aGlzLmNsb3NlKVxuICAgICAgfVxuXG4gIEFsZXJ0LnByb3RvdHlwZS5jbG9zZSA9IGZ1bmN0aW9uIChlKSB7XG4gICAgdmFyICR0aGlzID0gJCh0aGlzKVxuICAgICAgLCBzZWxlY3RvciA9ICR0aGlzLmF0dHIoJ2RhdGEtdGFyZ2V0JylcbiAgICAgICwgJHBhcmVudFxuXG4gICAgaWYgKCFzZWxlY3Rvcikge1xuICAgICAgc2VsZWN0b3IgPSAkdGhpcy5hdHRyKCdocmVmJylcbiAgICAgIHNlbGVjdG9yID0gc2VsZWN0b3IgJiYgc2VsZWN0b3IucmVwbGFjZSgvLiooPz0jW15cXHNdKiQpLywgJycpIC8vc3RyaXAgZm9yIGllN1xuICAgIH1cblxuICAgICRwYXJlbnQgPSAkKHNlbGVjdG9yKVxuXG4gICAgZSAmJiBlLnByZXZlbnREZWZhdWx0KClcblxuICAgICRwYXJlbnQubGVuZ3RoIHx8ICgkcGFyZW50ID0gJHRoaXMuaGFzQ2xhc3MoJ2FsZXJ0JykgPyAkdGhpcyA6ICR0aGlzLnBhcmVudCgpKVxuXG4gICAgJHBhcmVudC50cmlnZ2VyKGUgPSAkLkV2ZW50KCdjbG9zZScpKVxuXG4gICAgaWYgKGUuaXNEZWZhdWx0UHJldmVudGVkKCkpIHJldHVyblxuXG4gICAgJHBhcmVudC5yZW1vdmVDbGFzcygnaW4nKVxuXG4gICAgZnVuY3Rpb24gcmVtb3ZlRWxlbWVudCgpIHtcbiAgICAgICRwYXJlbnRcbiAgICAgICAgLnRyaWdnZXIoJ2Nsb3NlZCcpXG4gICAgICAgIC5yZW1vdmUoKVxuICAgIH1cblxuICAgICQuc3VwcG9ydC50cmFuc2l0aW9uICYmICRwYXJlbnQuaGFzQ2xhc3MoJ2ZhZGUnKSA/XG4gICAgICAkcGFyZW50Lm9uKCQuc3VwcG9ydC50cmFuc2l0aW9uLmVuZCwgcmVtb3ZlRWxlbWVudCkgOlxuICAgICAgcmVtb3ZlRWxlbWVudCgpXG4gIH1cblxuXG4gLyogQUxFUlQgUExVR0lOIERFRklOSVRJT05cbiAgKiA9PT09PT09PT09PT09PT09PT09PT09PSAqL1xuXG4gIHZhciBvbGQgPSAkLmZuLmFsZXJ0XG5cbiAgJC5mbi5hbGVydCA9IGZ1bmN0aW9uIChvcHRpb24pIHtcbiAgICByZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciAkdGhpcyA9ICQodGhpcylcbiAgICAgICAgLCBkYXRhID0gJHRoaXMuZGF0YSgnYWxlcnQnKVxuICAgICAgaWYgKCFkYXRhKSAkdGhpcy5kYXRhKCdhbGVydCcsIChkYXRhID0gbmV3IEFsZXJ0KHRoaXMpKSlcbiAgICAgIGlmICh0eXBlb2Ygb3B0aW9uID09ICdzdHJpbmcnKSBkYXRhW29wdGlvbl0uY2FsbCgkdGhpcylcbiAgICB9KVxuICB9XG5cbiAgJC5mbi5hbGVydC5Db25zdHJ1Y3RvciA9IEFsZXJ0XG5cblxuIC8qIEFMRVJUIE5PIENPTkZMSUNUXG4gICogPT09PT09PT09PT09PT09PT0gKi9cblxuICAkLmZuLmFsZXJ0Lm5vQ29uZmxpY3QgPSBmdW5jdGlvbiAoKSB7XG4gICAgJC5mbi5hbGVydCA9IG9sZFxuICAgIHJldHVybiB0aGlzXG4gIH1cblxuXG4gLyogQUxFUlQgREFUQS1BUElcbiAgKiA9PT09PT09PT09PT09PSAqL1xuXG4gICQoZG9jdW1lbnQpLm9uKCdjbGljay5hbGVydC5kYXRhLWFwaScsIGRpc21pc3MsIEFsZXJ0LnByb3RvdHlwZS5jbG9zZSlcblxufSh3aW5kb3cualF1ZXJ5KTsvKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqIGJvb3RzdHJhcC1idXR0b24uanMgdjIuMy4xXG4gKiBodHRwOi8vdHdpdHRlci5naXRodWIuY29tL2Jvb3RzdHJhcC9qYXZhc2NyaXB0Lmh0bWwjYnV0dG9uc1xuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKiBDb3B5cmlnaHQgMjAxMiBUd2l0dGVyLCBJbmMuXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cblxuXG4hZnVuY3Rpb24gKCQpIHtcblxuICBcInVzZSBzdHJpY3RcIjsgLy8ganNoaW50IDtfO1xuXG5cbiAvKiBCVVRUT04gUFVCTElDIENMQVNTIERFRklOSVRJT05cbiAgKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cblxuICB2YXIgQnV0dG9uID0gZnVuY3Rpb24gKGVsZW1lbnQsIG9wdGlvbnMpIHtcbiAgICB0aGlzLiRlbGVtZW50ID0gJChlbGVtZW50KVxuICAgIHRoaXMub3B0aW9ucyA9ICQuZXh0ZW5kKHt9LCAkLmZuLmJ1dHRvbi5kZWZhdWx0cywgb3B0aW9ucylcbiAgfVxuXG4gIEJ1dHRvbi5wcm90b3R5cGUuc2V0U3RhdGUgPSBmdW5jdGlvbiAoc3RhdGUpIHtcbiAgICB2YXIgZCA9ICdkaXNhYmxlZCdcbiAgICAgICwgJGVsID0gdGhpcy4kZWxlbWVudFxuICAgICAgLCBkYXRhID0gJGVsLmRhdGEoKVxuICAgICAgLCB2YWwgPSAkZWwuaXMoJ2lucHV0JykgPyAndmFsJyA6ICdodG1sJ1xuXG4gICAgc3RhdGUgPSBzdGF0ZSArICdUZXh0J1xuICAgIGRhdGEucmVzZXRUZXh0IHx8ICRlbC5kYXRhKCdyZXNldFRleHQnLCAkZWxbdmFsXSgpKVxuXG4gICAgJGVsW3ZhbF0oZGF0YVtzdGF0ZV0gfHwgdGhpcy5vcHRpb25zW3N0YXRlXSlcblxuICAgIC8vIHB1c2ggdG8gZXZlbnQgbG9vcCB0byBhbGxvdyBmb3JtcyB0byBzdWJtaXRcbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgIHN0YXRlID09ICdsb2FkaW5nVGV4dCcgP1xuICAgICAgICAkZWwuYWRkQ2xhc3MoZCkuYXR0cihkLCBkKSA6XG4gICAgICAgICRlbC5yZW1vdmVDbGFzcyhkKS5yZW1vdmVBdHRyKGQpXG4gICAgfSwgMClcbiAgfVxuXG4gIEJ1dHRvbi5wcm90b3R5cGUudG9nZ2xlID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciAkcGFyZW50ID0gdGhpcy4kZWxlbWVudC5jbG9zZXN0KCdbZGF0YS10b2dnbGU9XCJidXR0b25zLXJhZGlvXCJdJylcblxuICAgICRwYXJlbnQgJiYgJHBhcmVudFxuICAgICAgLmZpbmQoJy5hY3RpdmUnKVxuICAgICAgLnJlbW92ZUNsYXNzKCdhY3RpdmUnKVxuXG4gICAgdGhpcy4kZWxlbWVudC50b2dnbGVDbGFzcygnYWN0aXZlJylcbiAgfVxuXG5cbiAvKiBCVVRUT04gUExVR0lOIERFRklOSVRJT05cbiAgKiA9PT09PT09PT09PT09PT09PT09PT09PT0gKi9cblxuICB2YXIgb2xkID0gJC5mbi5idXR0b25cblxuICAkLmZuLmJ1dHRvbiA9IGZ1bmN0aW9uIChvcHRpb24pIHtcbiAgICByZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciAkdGhpcyA9ICQodGhpcylcbiAgICAgICAgLCBkYXRhID0gJHRoaXMuZGF0YSgnYnV0dG9uJylcbiAgICAgICAgLCBvcHRpb25zID0gdHlwZW9mIG9wdGlvbiA9PSAnb2JqZWN0JyAmJiBvcHRpb25cbiAgICAgIGlmICghZGF0YSkgJHRoaXMuZGF0YSgnYnV0dG9uJywgKGRhdGEgPSBuZXcgQnV0dG9uKHRoaXMsIG9wdGlvbnMpKSlcbiAgICAgIGlmIChvcHRpb24gPT0gJ3RvZ2dsZScpIGRhdGEudG9nZ2xlKClcbiAgICAgIGVsc2UgaWYgKG9wdGlvbikgZGF0YS5zZXRTdGF0ZShvcHRpb24pXG4gICAgfSlcbiAgfVxuXG4gICQuZm4uYnV0dG9uLmRlZmF1bHRzID0ge1xuICAgIGxvYWRpbmdUZXh0OiAnbG9hZGluZy4uLidcbiAgfVxuXG4gICQuZm4uYnV0dG9uLkNvbnN0cnVjdG9yID0gQnV0dG9uXG5cblxuIC8qIEJVVFRPTiBOTyBDT05GTElDVFxuICAqID09PT09PT09PT09PT09PT09PSAqL1xuXG4gICQuZm4uYnV0dG9uLm5vQ29uZmxpY3QgPSBmdW5jdGlvbiAoKSB7XG4gICAgJC5mbi5idXR0b24gPSBvbGRcbiAgICByZXR1cm4gdGhpc1xuICB9XG5cblxuIC8qIEJVVFRPTiBEQVRBLUFQSVxuICAqID09PT09PT09PT09PT09PSAqL1xuXG4gICQoZG9jdW1lbnQpLm9uKCdjbGljay5idXR0b24uZGF0YS1hcGknLCAnW2RhdGEtdG9nZ2xlXj1idXR0b25dJywgZnVuY3Rpb24gKGUpIHtcbiAgICB2YXIgJGJ0biA9ICQoZS50YXJnZXQpXG4gICAgaWYgKCEkYnRuLmhhc0NsYXNzKCdidG4nKSkgJGJ0biA9ICRidG4uY2xvc2VzdCgnLmJ0bicpXG4gICAgJGJ0bi5idXR0b24oJ3RvZ2dsZScpXG4gIH0pXG5cbn0od2luZG93LmpRdWVyeSk7LyogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICogYm9vdHN0cmFwLWNhcm91c2VsLmpzIHYyLjMuMVxuICogaHR0cDovL3R3aXR0ZXIuZ2l0aHViLmNvbS9ib290c3RyYXAvamF2YXNjcmlwdC5odG1sI2Nhcm91c2VsXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKiBDb3B5cmlnaHQgMjAxMiBUd2l0dGVyLCBJbmMuXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG5cblxuIWZ1bmN0aW9uICgkKSB7XG5cbiAgXCJ1c2Ugc3RyaWN0XCI7IC8vIGpzaGludCA7XztcblxuXG4gLyogQ0FST1VTRUwgQ0xBU1MgREVGSU5JVElPTlxuICAqID09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cblxuICB2YXIgQ2Fyb3VzZWwgPSBmdW5jdGlvbiAoZWxlbWVudCwgb3B0aW9ucykge1xuICAgIHRoaXMuJGVsZW1lbnQgPSAkKGVsZW1lbnQpXG4gICAgdGhpcy4kaW5kaWNhdG9ycyA9IHRoaXMuJGVsZW1lbnQuZmluZCgnLmNhcm91c2VsLWluZGljYXRvcnMnKVxuICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnNcbiAgICB0aGlzLm9wdGlvbnMucGF1c2UgPT0gJ2hvdmVyJyAmJiB0aGlzLiRlbGVtZW50XG4gICAgICAub24oJ21vdXNlZW50ZXInLCAkLnByb3h5KHRoaXMucGF1c2UsIHRoaXMpKVxuICAgICAgLm9uKCdtb3VzZWxlYXZlJywgJC5wcm94eSh0aGlzLmN5Y2xlLCB0aGlzKSlcbiAgfVxuXG4gIENhcm91c2VsLnByb3RvdHlwZSA9IHtcblxuICAgIGN5Y2xlOiBmdW5jdGlvbiAoZSkge1xuICAgICAgaWYgKCFlKSB0aGlzLnBhdXNlZCA9IGZhbHNlXG4gICAgICBpZiAodGhpcy5pbnRlcnZhbCkgY2xlYXJJbnRlcnZhbCh0aGlzLmludGVydmFsKTtcbiAgICAgIHRoaXMub3B0aW9ucy5pbnRlcnZhbFxuICAgICAgICAmJiAhdGhpcy5wYXVzZWRcbiAgICAgICAgJiYgKHRoaXMuaW50ZXJ2YWwgPSBzZXRJbnRlcnZhbCgkLnByb3h5KHRoaXMubmV4dCwgdGhpcyksIHRoaXMub3B0aW9ucy5pbnRlcnZhbCkpXG4gICAgICByZXR1cm4gdGhpc1xuICAgIH1cblxuICAsIGdldEFjdGl2ZUluZGV4OiBmdW5jdGlvbiAoKSB7XG4gICAgICB0aGlzLiRhY3RpdmUgPSB0aGlzLiRlbGVtZW50LmZpbmQoJy5pdGVtLmFjdGl2ZScpXG4gICAgICB0aGlzLiRpdGVtcyA9IHRoaXMuJGFjdGl2ZS5wYXJlbnQoKS5jaGlsZHJlbigpXG4gICAgICByZXR1cm4gdGhpcy4kaXRlbXMuaW5kZXgodGhpcy4kYWN0aXZlKVxuICAgIH1cblxuICAsIHRvOiBmdW5jdGlvbiAocG9zKSB7XG4gICAgICB2YXIgYWN0aXZlSW5kZXggPSB0aGlzLmdldEFjdGl2ZUluZGV4KClcbiAgICAgICAgLCB0aGF0ID0gdGhpc1xuXG4gICAgICBpZiAocG9zID4gKHRoaXMuJGl0ZW1zLmxlbmd0aCAtIDEpIHx8IHBvcyA8IDApIHJldHVyblxuXG4gICAgICBpZiAodGhpcy5zbGlkaW5nKSB7XG4gICAgICAgIHJldHVybiB0aGlzLiRlbGVtZW50Lm9uZSgnc2xpZCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICB0aGF0LnRvKHBvcylcbiAgICAgICAgfSlcbiAgICAgIH1cblxuICAgICAgaWYgKGFjdGl2ZUluZGV4ID09IHBvcykge1xuICAgICAgICByZXR1cm4gdGhpcy5wYXVzZSgpLmN5Y2xlKClcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMuc2xpZGUocG9zID4gYWN0aXZlSW5kZXggPyAnbmV4dCcgOiAncHJldicsICQodGhpcy4kaXRlbXNbcG9zXSkpXG4gICAgfVxuXG4gICwgcGF1c2U6IGZ1bmN0aW9uIChlKSB7XG4gICAgICBpZiAoIWUpIHRoaXMucGF1c2VkID0gdHJ1ZVxuICAgICAgaWYgKHRoaXMuJGVsZW1lbnQuZmluZCgnLm5leHQsIC5wcmV2JykubGVuZ3RoICYmICQuc3VwcG9ydC50cmFuc2l0aW9uLmVuZCkge1xuICAgICAgICB0aGlzLiRlbGVtZW50LnRyaWdnZXIoJC5zdXBwb3J0LnRyYW5zaXRpb24uZW5kKVxuICAgICAgICB0aGlzLmN5Y2xlKHRydWUpXG4gICAgICB9XG4gICAgICBjbGVhckludGVydmFsKHRoaXMuaW50ZXJ2YWwpXG4gICAgICB0aGlzLmludGVydmFsID0gbnVsbFxuICAgICAgcmV0dXJuIHRoaXNcbiAgICB9XG5cbiAgLCBuZXh0OiBmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAodGhpcy5zbGlkaW5nKSByZXR1cm5cbiAgICAgIHJldHVybiB0aGlzLnNsaWRlKCduZXh0JylcbiAgICB9XG5cbiAgLCBwcmV2OiBmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAodGhpcy5zbGlkaW5nKSByZXR1cm5cbiAgICAgIHJldHVybiB0aGlzLnNsaWRlKCdwcmV2JylcbiAgICB9XG5cbiAgLCBzbGlkZTogZnVuY3Rpb24gKHR5cGUsIG5leHQpIHtcbiAgICAgIHZhciAkYWN0aXZlID0gdGhpcy4kZWxlbWVudC5maW5kKCcuaXRlbS5hY3RpdmUnKVxuICAgICAgICAsICRuZXh0ID0gbmV4dCB8fCAkYWN0aXZlW3R5cGVdKClcbiAgICAgICAgLCBpc0N5Y2xpbmcgPSB0aGlzLmludGVydmFsXG4gICAgICAgICwgZGlyZWN0aW9uID0gdHlwZSA9PSAnbmV4dCcgPyAnbGVmdCcgOiAncmlnaHQnXG4gICAgICAgICwgZmFsbGJhY2sgID0gdHlwZSA9PSAnbmV4dCcgPyAnZmlyc3QnIDogJ2xhc3QnXG4gICAgICAgICwgdGhhdCA9IHRoaXNcbiAgICAgICAgLCBlXG5cbiAgICAgIHRoaXMuc2xpZGluZyA9IHRydWVcblxuICAgICAgaXNDeWNsaW5nICYmIHRoaXMucGF1c2UoKVxuXG4gICAgICAkbmV4dCA9ICRuZXh0Lmxlbmd0aCA/ICRuZXh0IDogdGhpcy4kZWxlbWVudC5maW5kKCcuaXRlbScpW2ZhbGxiYWNrXSgpXG5cbiAgICAgIGUgPSAkLkV2ZW50KCdzbGlkZScsIHtcbiAgICAgICAgcmVsYXRlZFRhcmdldDogJG5leHRbMF1cbiAgICAgICwgZGlyZWN0aW9uOiBkaXJlY3Rpb25cbiAgICAgIH0pXG5cbiAgICAgIGlmICgkbmV4dC5oYXNDbGFzcygnYWN0aXZlJykpIHJldHVyblxuXG4gICAgICBpZiAodGhpcy4kaW5kaWNhdG9ycy5sZW5ndGgpIHtcbiAgICAgICAgdGhpcy4kaW5kaWNhdG9ycy5maW5kKCcuYWN0aXZlJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpXG4gICAgICAgIHRoaXMuJGVsZW1lbnQub25lKCdzbGlkJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHZhciAkbmV4dEluZGljYXRvciA9ICQodGhhdC4kaW5kaWNhdG9ycy5jaGlsZHJlbigpW3RoYXQuZ2V0QWN0aXZlSW5kZXgoKV0pXG4gICAgICAgICAgJG5leHRJbmRpY2F0b3IgJiYgJG5leHRJbmRpY2F0b3IuYWRkQ2xhc3MoJ2FjdGl2ZScpXG4gICAgICAgIH0pXG4gICAgICB9XG5cbiAgICAgIGlmICgkLnN1cHBvcnQudHJhbnNpdGlvbiAmJiB0aGlzLiRlbGVtZW50Lmhhc0NsYXNzKCdzbGlkZScpKSB7XG4gICAgICAgIHRoaXMuJGVsZW1lbnQudHJpZ2dlcihlKVxuICAgICAgICBpZiAoZS5pc0RlZmF1bHRQcmV2ZW50ZWQoKSkgcmV0dXJuXG4gICAgICAgICRuZXh0LmFkZENsYXNzKHR5cGUpXG4gICAgICAgICRuZXh0WzBdLm9mZnNldFdpZHRoIC8vIGZvcmNlIHJlZmxvd1xuICAgICAgICAkYWN0aXZlLmFkZENsYXNzKGRpcmVjdGlvbilcbiAgICAgICAgJG5leHQuYWRkQ2xhc3MoZGlyZWN0aW9uKVxuICAgICAgICB0aGlzLiRlbGVtZW50Lm9uZSgkLnN1cHBvcnQudHJhbnNpdGlvbi5lbmQsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAkbmV4dC5yZW1vdmVDbGFzcyhbdHlwZSwgZGlyZWN0aW9uXS5qb2luKCcgJykpLmFkZENsYXNzKCdhY3RpdmUnKVxuICAgICAgICAgICRhY3RpdmUucmVtb3ZlQ2xhc3MoWydhY3RpdmUnLCBkaXJlY3Rpb25dLmpvaW4oJyAnKSlcbiAgICAgICAgICB0aGF0LnNsaWRpbmcgPSBmYWxzZVxuICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkgeyB0aGF0LiRlbGVtZW50LnRyaWdnZXIoJ3NsaWQnKSB9LCAwKVxuICAgICAgICB9KVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy4kZWxlbWVudC50cmlnZ2VyKGUpXG4gICAgICAgIGlmIChlLmlzRGVmYXVsdFByZXZlbnRlZCgpKSByZXR1cm5cbiAgICAgICAgJGFjdGl2ZS5yZW1vdmVDbGFzcygnYWN0aXZlJylcbiAgICAgICAgJG5leHQuYWRkQ2xhc3MoJ2FjdGl2ZScpXG4gICAgICAgIHRoaXMuc2xpZGluZyA9IGZhbHNlXG4gICAgICAgIHRoaXMuJGVsZW1lbnQudHJpZ2dlcignc2xpZCcpXG4gICAgICB9XG5cbiAgICAgIGlzQ3ljbGluZyAmJiB0aGlzLmN5Y2xlKClcblxuICAgICAgcmV0dXJuIHRoaXNcbiAgICB9XG5cbiAgfVxuXG5cbiAvKiBDQVJPVVNFTCBQTFVHSU4gREVGSU5JVElPTlxuICAqID09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG5cbiAgdmFyIG9sZCA9ICQuZm4uY2Fyb3VzZWxcblxuICAkLmZuLmNhcm91c2VsID0gZnVuY3Rpb24gKG9wdGlvbikge1xuICAgIHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgdmFyICR0aGlzID0gJCh0aGlzKVxuICAgICAgICAsIGRhdGEgPSAkdGhpcy5kYXRhKCdjYXJvdXNlbCcpXG4gICAgICAgICwgb3B0aW9ucyA9ICQuZXh0ZW5kKHt9LCAkLmZuLmNhcm91c2VsLmRlZmF1bHRzLCB0eXBlb2Ygb3B0aW9uID09ICdvYmplY3QnICYmIG9wdGlvbilcbiAgICAgICAgLCBhY3Rpb24gPSB0eXBlb2Ygb3B0aW9uID09ICdzdHJpbmcnID8gb3B0aW9uIDogb3B0aW9ucy5zbGlkZVxuICAgICAgaWYgKCFkYXRhKSAkdGhpcy5kYXRhKCdjYXJvdXNlbCcsIChkYXRhID0gbmV3IENhcm91c2VsKHRoaXMsIG9wdGlvbnMpKSlcbiAgICAgIGlmICh0eXBlb2Ygb3B0aW9uID09ICdudW1iZXInKSBkYXRhLnRvKG9wdGlvbilcbiAgICAgIGVsc2UgaWYgKGFjdGlvbikgZGF0YVthY3Rpb25dKClcbiAgICAgIGVsc2UgaWYgKG9wdGlvbnMuaW50ZXJ2YWwpIGRhdGEucGF1c2UoKS5jeWNsZSgpXG4gICAgfSlcbiAgfVxuXG4gICQuZm4uY2Fyb3VzZWwuZGVmYXVsdHMgPSB7XG4gICAgaW50ZXJ2YWw6IDUwMDBcbiAgLCBwYXVzZTogJ2hvdmVyJ1xuICB9XG5cbiAgJC5mbi5jYXJvdXNlbC5Db25zdHJ1Y3RvciA9IENhcm91c2VsXG5cblxuIC8qIENBUk9VU0VMIE5PIENPTkZMSUNUXG4gICogPT09PT09PT09PT09PT09PT09PT0gKi9cblxuICAkLmZuLmNhcm91c2VsLm5vQ29uZmxpY3QgPSBmdW5jdGlvbiAoKSB7XG4gICAgJC5mbi5jYXJvdXNlbCA9IG9sZFxuICAgIHJldHVybiB0aGlzXG4gIH1cblxuIC8qIENBUk9VU0VMIERBVEEtQVBJXG4gICogPT09PT09PT09PT09PT09PT0gKi9cblxuICAkKGRvY3VtZW50KS5vbignY2xpY2suY2Fyb3VzZWwuZGF0YS1hcGknLCAnW2RhdGEtc2xpZGVdLCBbZGF0YS1zbGlkZS10b10nLCBmdW5jdGlvbiAoZSkge1xuICAgIHZhciAkdGhpcyA9ICQodGhpcyksIGhyZWZcbiAgICAgICwgJHRhcmdldCA9ICQoJHRoaXMuYXR0cignZGF0YS10YXJnZXQnKSB8fCAoaHJlZiA9ICR0aGlzLmF0dHIoJ2hyZWYnKSkgJiYgaHJlZi5yZXBsYWNlKC8uKig/PSNbXlxcc10rJCkvLCAnJykpIC8vc3RyaXAgZm9yIGllN1xuICAgICAgLCBvcHRpb25zID0gJC5leHRlbmQoe30sICR0YXJnZXQuZGF0YSgpLCAkdGhpcy5kYXRhKCkpXG4gICAgICAsIHNsaWRlSW5kZXhcblxuICAgICR0YXJnZXQuY2Fyb3VzZWwob3B0aW9ucylcblxuICAgIGlmIChzbGlkZUluZGV4ID0gJHRoaXMuYXR0cignZGF0YS1zbGlkZS10bycpKSB7XG4gICAgICAkdGFyZ2V0LmRhdGEoJ2Nhcm91c2VsJykucGF1c2UoKS50byhzbGlkZUluZGV4KS5jeWNsZSgpXG4gICAgfVxuXG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gIH0pXG5cbn0od2luZG93LmpRdWVyeSk7LyogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICogYm9vdHN0cmFwLWNvbGxhcHNlLmpzIHYyLjMuMVxuICogaHR0cDovL3R3aXR0ZXIuZ2l0aHViLmNvbS9ib290c3RyYXAvamF2YXNjcmlwdC5odG1sI2NvbGxhcHNlXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKiBDb3B5cmlnaHQgMjAxMiBUd2l0dGVyLCBJbmMuXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cblxuXG4hZnVuY3Rpb24gKCQpIHtcblxuICBcInVzZSBzdHJpY3RcIjsgLy8ganNoaW50IDtfO1xuXG5cbiAvKiBDT0xMQVBTRSBQVUJMSUMgQ0xBU1MgREVGSU5JVElPTlxuICAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG5cbiAgdmFyIENvbGxhcHNlID0gZnVuY3Rpb24gKGVsZW1lbnQsIG9wdGlvbnMpIHtcbiAgICB0aGlzLiRlbGVtZW50ID0gJChlbGVtZW50KVxuICAgIHRoaXMub3B0aW9ucyA9ICQuZXh0ZW5kKHt9LCAkLmZuLmNvbGxhcHNlLmRlZmF1bHRzLCBvcHRpb25zKVxuXG4gICAgaWYgKHRoaXMub3B0aW9ucy5wYXJlbnQpIHtcbiAgICAgIHRoaXMuJHBhcmVudCA9ICQodGhpcy5vcHRpb25zLnBhcmVudClcbiAgICB9XG5cbiAgICB0aGlzLm9wdGlvbnMudG9nZ2xlICYmIHRoaXMudG9nZ2xlKClcbiAgfVxuXG4gIENvbGxhcHNlLnByb3RvdHlwZSA9IHtcblxuICAgIGNvbnN0cnVjdG9yOiBDb2xsYXBzZVxuXG4gICwgZGltZW5zaW9uOiBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgaGFzV2lkdGggPSB0aGlzLiRlbGVtZW50Lmhhc0NsYXNzKCd3aWR0aCcpXG4gICAgICByZXR1cm4gaGFzV2lkdGggPyAnd2lkdGgnIDogJ2hlaWdodCdcbiAgICB9XG5cbiAgLCBzaG93OiBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgZGltZW5zaW9uXG4gICAgICAgICwgc2Nyb2xsXG4gICAgICAgICwgYWN0aXZlc1xuICAgICAgICAsIGhhc0RhdGFcblxuICAgICAgaWYgKHRoaXMudHJhbnNpdGlvbmluZyB8fCB0aGlzLiRlbGVtZW50Lmhhc0NsYXNzKCdpbicpKSByZXR1cm5cblxuICAgICAgZGltZW5zaW9uID0gdGhpcy5kaW1lbnNpb24oKVxuICAgICAgc2Nyb2xsID0gJC5jYW1lbENhc2UoWydzY3JvbGwnLCBkaW1lbnNpb25dLmpvaW4oJy0nKSlcbiAgICAgIGFjdGl2ZXMgPSB0aGlzLiRwYXJlbnQgJiYgdGhpcy4kcGFyZW50LmZpbmQoJz4gLmFjY29yZGlvbi1ncm91cCA+IC5pbicpXG5cbiAgICAgIGlmIChhY3RpdmVzICYmIGFjdGl2ZXMubGVuZ3RoKSB7XG4gICAgICAgIGhhc0RhdGEgPSBhY3RpdmVzLmRhdGEoJ2NvbGxhcHNlJylcbiAgICAgICAgaWYgKGhhc0RhdGEgJiYgaGFzRGF0YS50cmFuc2l0aW9uaW5nKSByZXR1cm5cbiAgICAgICAgYWN0aXZlcy5jb2xsYXBzZSgnaGlkZScpXG4gICAgICAgIGhhc0RhdGEgfHwgYWN0aXZlcy5kYXRhKCdjb2xsYXBzZScsIG51bGwpXG4gICAgICB9XG5cbiAgICAgIHRoaXMuJGVsZW1lbnRbZGltZW5zaW9uXSgwKVxuICAgICAgdGhpcy50cmFuc2l0aW9uKCdhZGRDbGFzcycsICQuRXZlbnQoJ3Nob3cnKSwgJ3Nob3duJylcbiAgICAgICQuc3VwcG9ydC50cmFuc2l0aW9uICYmIHRoaXMuJGVsZW1lbnRbZGltZW5zaW9uXSh0aGlzLiRlbGVtZW50WzBdW3Njcm9sbF0pXG4gICAgfVxuXG4gICwgaGlkZTogZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIGRpbWVuc2lvblxuICAgICAgaWYgKHRoaXMudHJhbnNpdGlvbmluZyB8fCAhdGhpcy4kZWxlbWVudC5oYXNDbGFzcygnaW4nKSkgcmV0dXJuXG4gICAgICBkaW1lbnNpb24gPSB0aGlzLmRpbWVuc2lvbigpXG4gICAgICB0aGlzLnJlc2V0KHRoaXMuJGVsZW1lbnRbZGltZW5zaW9uXSgpKVxuICAgICAgdGhpcy50cmFuc2l0aW9uKCdyZW1vdmVDbGFzcycsICQuRXZlbnQoJ2hpZGUnKSwgJ2hpZGRlbicpXG4gICAgICB0aGlzLiRlbGVtZW50W2RpbWVuc2lvbl0oMClcbiAgICB9XG5cbiAgLCByZXNldDogZnVuY3Rpb24gKHNpemUpIHtcbiAgICAgIHZhciBkaW1lbnNpb24gPSB0aGlzLmRpbWVuc2lvbigpXG5cbiAgICAgIHRoaXMuJGVsZW1lbnRcbiAgICAgICAgLnJlbW92ZUNsYXNzKCdjb2xsYXBzZScpXG4gICAgICAgIFtkaW1lbnNpb25dKHNpemUgfHwgJ2F1dG8nKVxuICAgICAgICBbMF0ub2Zmc2V0V2lkdGhcblxuICAgICAgdGhpcy4kZWxlbWVudFtzaXplICE9PSBudWxsID8gJ2FkZENsYXNzJyA6ICdyZW1vdmVDbGFzcyddKCdjb2xsYXBzZScpXG5cbiAgICAgIHJldHVybiB0aGlzXG4gICAgfVxuXG4gICwgdHJhbnNpdGlvbjogZnVuY3Rpb24gKG1ldGhvZCwgc3RhcnRFdmVudCwgY29tcGxldGVFdmVudCkge1xuICAgICAgdmFyIHRoYXQgPSB0aGlzXG4gICAgICAgICwgY29tcGxldGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpZiAoc3RhcnRFdmVudC50eXBlID09ICdzaG93JykgdGhhdC5yZXNldCgpXG4gICAgICAgICAgICB0aGF0LnRyYW5zaXRpb25pbmcgPSAwXG4gICAgICAgICAgICB0aGF0LiRlbGVtZW50LnRyaWdnZXIoY29tcGxldGVFdmVudClcbiAgICAgICAgICB9XG5cbiAgICAgIHRoaXMuJGVsZW1lbnQudHJpZ2dlcihzdGFydEV2ZW50KVxuXG4gICAgICBpZiAoc3RhcnRFdmVudC5pc0RlZmF1bHRQcmV2ZW50ZWQoKSkgcmV0dXJuXG5cbiAgICAgIHRoaXMudHJhbnNpdGlvbmluZyA9IDFcblxuICAgICAgdGhpcy4kZWxlbWVudFttZXRob2RdKCdpbicpXG5cbiAgICAgICQuc3VwcG9ydC50cmFuc2l0aW9uICYmIHRoaXMuJGVsZW1lbnQuaGFzQ2xhc3MoJ2NvbGxhcHNlJykgP1xuICAgICAgICB0aGlzLiRlbGVtZW50Lm9uZSgkLnN1cHBvcnQudHJhbnNpdGlvbi5lbmQsIGNvbXBsZXRlKSA6XG4gICAgICAgIGNvbXBsZXRlKClcbiAgICB9XG5cbiAgLCB0b2dnbGU6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHRoaXNbdGhpcy4kZWxlbWVudC5oYXNDbGFzcygnaW4nKSA/ICdoaWRlJyA6ICdzaG93J10oKVxuICAgIH1cblxuICB9XG5cblxuIC8qIENPTExBUFNFIFBMVUdJTiBERUZJTklUSU9OXG4gICogPT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cblxuICB2YXIgb2xkID0gJC5mbi5jb2xsYXBzZVxuXG4gICQuZm4uY29sbGFwc2UgPSBmdW5jdGlvbiAob3B0aW9uKSB7XG4gICAgcmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgJHRoaXMgPSAkKHRoaXMpXG4gICAgICAgICwgZGF0YSA9ICR0aGlzLmRhdGEoJ2NvbGxhcHNlJylcbiAgICAgICAgLCBvcHRpb25zID0gJC5leHRlbmQoe30sICQuZm4uY29sbGFwc2UuZGVmYXVsdHMsICR0aGlzLmRhdGEoKSwgdHlwZW9mIG9wdGlvbiA9PSAnb2JqZWN0JyAmJiBvcHRpb24pXG4gICAgICBpZiAoIWRhdGEpICR0aGlzLmRhdGEoJ2NvbGxhcHNlJywgKGRhdGEgPSBuZXcgQ29sbGFwc2UodGhpcywgb3B0aW9ucykpKVxuICAgICAgaWYgKHR5cGVvZiBvcHRpb24gPT0gJ3N0cmluZycpIGRhdGFbb3B0aW9uXSgpXG4gICAgfSlcbiAgfVxuXG4gICQuZm4uY29sbGFwc2UuZGVmYXVsdHMgPSB7XG4gICAgdG9nZ2xlOiB0cnVlXG4gIH1cblxuICAkLmZuLmNvbGxhcHNlLkNvbnN0cnVjdG9yID0gQ29sbGFwc2VcblxuXG4gLyogQ09MTEFQU0UgTk8gQ09ORkxJQ1RcbiAgKiA9PT09PT09PT09PT09PT09PT09PSAqL1xuXG4gICQuZm4uY29sbGFwc2Uubm9Db25mbGljdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAkLmZuLmNvbGxhcHNlID0gb2xkXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuXG5cbiAvKiBDT0xMQVBTRSBEQVRBLUFQSVxuICAqID09PT09PT09PT09PT09PT09ICovXG5cbiAgJChkb2N1bWVudCkub24oJ2NsaWNrLmNvbGxhcHNlLmRhdGEtYXBpJywgJ1tkYXRhLXRvZ2dsZT1jb2xsYXBzZV0nLCBmdW5jdGlvbiAoZSkge1xuICAgIHZhciAkdGhpcyA9ICQodGhpcyksIGhyZWZcbiAgICAgICwgdGFyZ2V0ID0gJHRoaXMuYXR0cignZGF0YS10YXJnZXQnKVxuICAgICAgICB8fCBlLnByZXZlbnREZWZhdWx0KClcbiAgICAgICAgfHwgKGhyZWYgPSAkdGhpcy5hdHRyKCdocmVmJykpICYmIGhyZWYucmVwbGFjZSgvLiooPz0jW15cXHNdKyQpLywgJycpIC8vc3RyaXAgZm9yIGllN1xuICAgICAgLCBvcHRpb24gPSAkKHRhcmdldCkuZGF0YSgnY29sbGFwc2UnKSA/ICd0b2dnbGUnIDogJHRoaXMuZGF0YSgpXG4gICAgJHRoaXNbJCh0YXJnZXQpLmhhc0NsYXNzKCdpbicpID8gJ2FkZENsYXNzJyA6ICdyZW1vdmVDbGFzcyddKCdjb2xsYXBzZWQnKVxuICAgICQodGFyZ2V0KS5jb2xsYXBzZShvcHRpb24pXG4gIH0pXG5cbn0od2luZG93LmpRdWVyeSk7LyogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKiBib290c3RyYXAtZHJvcGRvd24uanMgdjIuMy4xXG4gKiBodHRwOi8vdHdpdHRlci5naXRodWIuY29tL2Jvb3RzdHJhcC9qYXZhc2NyaXB0Lmh0bWwjZHJvcGRvd25zXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqIENvcHlyaWdodCAyMDEyIFR3aXR0ZXIsIEluYy5cbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuXG5cbiFmdW5jdGlvbiAoJCkge1xuXG4gIFwidXNlIHN0cmljdFwiOyAvLyBqc2hpbnQgO187XG5cblxuIC8qIERST1BET1dOIENMQVNTIERFRklOSVRJT05cbiAgKiA9PT09PT09PT09PT09PT09PT09PT09PT09ICovXG5cbiAgdmFyIHRvZ2dsZSA9ICdbZGF0YS10b2dnbGU9ZHJvcGRvd25dJ1xuICAgICwgRHJvcGRvd24gPSBmdW5jdGlvbiAoZWxlbWVudCkge1xuICAgICAgICB2YXIgJGVsID0gJChlbGVtZW50KS5vbignY2xpY2suZHJvcGRvd24uZGF0YS1hcGknLCB0aGlzLnRvZ2dsZSlcbiAgICAgICAgJCgnaHRtbCcpLm9uKCdjbGljay5kcm9wZG93bi5kYXRhLWFwaScsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAkZWwucGFyZW50KCkucmVtb3ZlQ2xhc3MoJ29wZW4nKVxuICAgICAgICB9KVxuICAgICAgfVxuXG4gIERyb3Bkb3duLnByb3RvdHlwZSA9IHtcblxuICAgIGNvbnN0cnVjdG9yOiBEcm9wZG93blxuXG4gICwgdG9nZ2xlOiBmdW5jdGlvbiAoZSkge1xuICAgICAgdmFyICR0aGlzID0gJCh0aGlzKVxuICAgICAgICAsICRwYXJlbnRcbiAgICAgICAgLCBpc0FjdGl2ZVxuXG4gICAgICBpZiAoJHRoaXMuaXMoJy5kaXNhYmxlZCwgOmRpc2FibGVkJykpIHJldHVyblxuXG4gICAgICAkcGFyZW50ID0gZ2V0UGFyZW50KCR0aGlzKVxuXG4gICAgICBpc0FjdGl2ZSA9ICRwYXJlbnQuaGFzQ2xhc3MoJ29wZW4nKVxuXG4gICAgICBjbGVhck1lbnVzKClcblxuICAgICAgaWYgKCFpc0FjdGl2ZSkge1xuICAgICAgICAkcGFyZW50LnRvZ2dsZUNsYXNzKCdvcGVuJylcbiAgICAgIH1cblxuICAgICAgJHRoaXMuZm9jdXMoKVxuXG4gICAgICByZXR1cm4gZmFsc2VcbiAgICB9XG5cbiAgLCBrZXlkb3duOiBmdW5jdGlvbiAoZSkge1xuICAgICAgdmFyICR0aGlzXG4gICAgICAgICwgJGl0ZW1zXG4gICAgICAgICwgJGFjdGl2ZVxuICAgICAgICAsICRwYXJlbnRcbiAgICAgICAgLCBpc0FjdGl2ZVxuICAgICAgICAsIGluZGV4XG5cbiAgICAgIGlmICghLygzOHw0MHwyNykvLnRlc3QoZS5rZXlDb2RlKSkgcmV0dXJuXG5cbiAgICAgICR0aGlzID0gJCh0aGlzKVxuXG4gICAgICBlLnByZXZlbnREZWZhdWx0KClcbiAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKClcblxuICAgICAgaWYgKCR0aGlzLmlzKCcuZGlzYWJsZWQsIDpkaXNhYmxlZCcpKSByZXR1cm5cblxuICAgICAgJHBhcmVudCA9IGdldFBhcmVudCgkdGhpcylcblxuICAgICAgaXNBY3RpdmUgPSAkcGFyZW50Lmhhc0NsYXNzKCdvcGVuJylcblxuICAgICAgaWYgKCFpc0FjdGl2ZSB8fCAoaXNBY3RpdmUgJiYgZS5rZXlDb2RlID09IDI3KSkge1xuICAgICAgICBpZiAoZS53aGljaCA9PSAyNykgJHBhcmVudC5maW5kKHRvZ2dsZSkuZm9jdXMoKVxuICAgICAgICByZXR1cm4gJHRoaXMuY2xpY2soKVxuICAgICAgfVxuXG4gICAgICAkaXRlbXMgPSAkKCdbcm9sZT1tZW51XSBsaTpub3QoLmRpdmlkZXIpOnZpc2libGUgYScsICRwYXJlbnQpXG5cbiAgICAgIGlmICghJGl0ZW1zLmxlbmd0aCkgcmV0dXJuXG5cbiAgICAgIGluZGV4ID0gJGl0ZW1zLmluZGV4KCRpdGVtcy5maWx0ZXIoJzpmb2N1cycpKVxuXG4gICAgICBpZiAoZS5rZXlDb2RlID09IDM4ICYmIGluZGV4ID4gMCkgaW5kZXgtLSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB1cFxuICAgICAgaWYgKGUua2V5Q29kZSA9PSA0MCAmJiBpbmRleCA8ICRpdGVtcy5sZW5ndGggLSAxKSBpbmRleCsrICAgICAgICAgICAgICAgICAgICAgICAgLy8gZG93blxuICAgICAgaWYgKCF+aW5kZXgpIGluZGV4ID0gMFxuXG4gICAgICAkaXRlbXNcbiAgICAgICAgLmVxKGluZGV4KVxuICAgICAgICAuZm9jdXMoKVxuICAgIH1cblxuICB9XG5cbiAgZnVuY3Rpb24gY2xlYXJNZW51cygpIHtcbiAgICAkKHRvZ2dsZSkuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICBnZXRQYXJlbnQoJCh0aGlzKSkucmVtb3ZlQ2xhc3MoJ29wZW4nKVxuICAgIH0pXG4gIH1cblxuICBmdW5jdGlvbiBnZXRQYXJlbnQoJHRoaXMpIHtcbiAgICB2YXIgc2VsZWN0b3IgPSAkdGhpcy5hdHRyKCdkYXRhLXRhcmdldCcpXG4gICAgICAsICRwYXJlbnRcblxuICAgIGlmICghc2VsZWN0b3IpIHtcbiAgICAgIHNlbGVjdG9yID0gJHRoaXMuYXR0cignaHJlZicpXG4gICAgICBzZWxlY3RvciA9IHNlbGVjdG9yICYmIC8jLy50ZXN0KHNlbGVjdG9yKSAmJiBzZWxlY3Rvci5yZXBsYWNlKC8uKig/PSNbXlxcc10qJCkvLCAnJykgLy9zdHJpcCBmb3IgaWU3XG4gICAgfVxuXG4gICAgJHBhcmVudCA9IHNlbGVjdG9yICYmICQoc2VsZWN0b3IpXG5cbiAgICBpZiAoISRwYXJlbnQgfHwgISRwYXJlbnQubGVuZ3RoKSAkcGFyZW50ID0gJHRoaXMucGFyZW50KClcblxuICAgIHJldHVybiAkcGFyZW50XG4gIH1cblxuXG4gIC8qIERST1BET1dOIFBMVUdJTiBERUZJTklUSU9OXG4gICAqID09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG5cbiAgdmFyIG9sZCA9ICQuZm4uZHJvcGRvd25cblxuICAkLmZuLmRyb3Bkb3duID0gZnVuY3Rpb24gKG9wdGlvbikge1xuICAgIHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgdmFyICR0aGlzID0gJCh0aGlzKVxuICAgICAgICAsIGRhdGEgPSAkdGhpcy5kYXRhKCdkcm9wZG93bicpXG4gICAgICBpZiAoIWRhdGEpICR0aGlzLmRhdGEoJ2Ryb3Bkb3duJywgKGRhdGEgPSBuZXcgRHJvcGRvd24odGhpcykpKVxuICAgICAgaWYgKHR5cGVvZiBvcHRpb24gPT0gJ3N0cmluZycpIGRhdGFbb3B0aW9uXS5jYWxsKCR0aGlzKVxuICAgIH0pXG4gIH1cblxuICAkLmZuLmRyb3Bkb3duLkNvbnN0cnVjdG9yID0gRHJvcGRvd25cblxuXG4gLyogRFJPUERPV04gTk8gQ09ORkxJQ1RcbiAgKiA9PT09PT09PT09PT09PT09PT09PSAqL1xuXG4gICQuZm4uZHJvcGRvd24ubm9Db25mbGljdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAkLmZuLmRyb3Bkb3duID0gb2xkXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuXG5cbiAgLyogQVBQTFkgVE8gU1RBTkRBUkQgRFJPUERPV04gRUxFTUVOVFNcbiAgICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cblxuICAkKGRvY3VtZW50KVxuICAgIC5vbignY2xpY2suZHJvcGRvd24uZGF0YS1hcGknLCBjbGVhck1lbnVzKVxuICAgIC5vbignY2xpY2suZHJvcGRvd24uZGF0YS1hcGknLCAnLmRyb3Bkb3duIGZvcm0nLCBmdW5jdGlvbiAoZSkgeyBlLnN0b3BQcm9wYWdhdGlvbigpIH0pXG4gICAgLm9uKCdjbGljay5kcm9wZG93bi1tZW51JywgZnVuY3Rpb24gKGUpIHsgZS5zdG9wUHJvcGFnYXRpb24oKSB9KVxuICAgIC5vbignY2xpY2suZHJvcGRvd24uZGF0YS1hcGknICAsIHRvZ2dsZSwgRHJvcGRvd24ucHJvdG90eXBlLnRvZ2dsZSlcbiAgICAub24oJ2tleWRvd24uZHJvcGRvd24uZGF0YS1hcGknLCB0b2dnbGUgKyAnLCBbcm9sZT1tZW51XScgLCBEcm9wZG93bi5wcm90b3R5cGUua2V5ZG93bilcblxufSh3aW5kb3cualF1ZXJ5KTtcbi8qID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICogYm9vdHN0cmFwLW1vZGFsLmpzIHYyLjMuMVxuICogaHR0cDovL3R3aXR0ZXIuZ2l0aHViLmNvbS9ib290c3RyYXAvamF2YXNjcmlwdC5odG1sI21vZGFsc1xuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKiBDb3B5cmlnaHQgMjAxMiBUd2l0dGVyLCBJbmMuXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cblxuXG4hZnVuY3Rpb24gKCQpIHtcblxuICBcInVzZSBzdHJpY3RcIjsgLy8ganNoaW50IDtfO1xuXG5cbiAvKiBNT0RBTCBDTEFTUyBERUZJTklUSU9OXG4gICogPT09PT09PT09PT09PT09PT09PT09PSAqL1xuXG4gIHZhciBNb2RhbCA9IGZ1bmN0aW9uIChlbGVtZW50LCBvcHRpb25zKSB7XG4gICAgdGhpcy5vcHRpb25zID0gb3B0aW9uc1xuICAgIHRoaXMuJGVsZW1lbnQgPSAkKGVsZW1lbnQpXG4gICAgICAuZGVsZWdhdGUoJ1tkYXRhLWRpc21pc3M9XCJtb2RhbFwiXScsICdjbGljay5kaXNtaXNzLm1vZGFsJywgJC5wcm94eSh0aGlzLmhpZGUsIHRoaXMpKVxuICAgIHRoaXMub3B0aW9ucy5yZW1vdGUgJiYgdGhpcy4kZWxlbWVudC5maW5kKCcubW9kYWwtYm9keScpLmxvYWQodGhpcy5vcHRpb25zLnJlbW90ZSlcbiAgfVxuXG4gIE1vZGFsLnByb3RvdHlwZSA9IHtcblxuICAgICAgY29uc3RydWN0b3I6IE1vZGFsXG5cbiAgICAsIHRvZ2dsZTogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpc1shdGhpcy5pc1Nob3duID8gJ3Nob3cnIDogJ2hpZGUnXSgpXG4gICAgICB9XG5cbiAgICAsIHNob3c6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHRoYXQgPSB0aGlzXG4gICAgICAgICAgLCBlID0gJC5FdmVudCgnc2hvdycpXG5cbiAgICAgICAgdGhpcy4kZWxlbWVudC50cmlnZ2VyKGUpXG5cbiAgICAgICAgaWYgKHRoaXMuaXNTaG93biB8fCBlLmlzRGVmYXVsdFByZXZlbnRlZCgpKSByZXR1cm5cblxuICAgICAgICB0aGlzLmlzU2hvd24gPSB0cnVlXG5cbiAgICAgICAgdGhpcy5lc2NhcGUoKVxuXG4gICAgICAgIHRoaXMuYmFja2Ryb3AoZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHZhciB0cmFuc2l0aW9uID0gJC5zdXBwb3J0LnRyYW5zaXRpb24gJiYgdGhhdC4kZWxlbWVudC5oYXNDbGFzcygnZmFkZScpXG5cbiAgICAgICAgICBpZiAoIXRoYXQuJGVsZW1lbnQucGFyZW50KCkubGVuZ3RoKSB7XG4gICAgICAgICAgICB0aGF0LiRlbGVtZW50LmFwcGVuZFRvKGRvY3VtZW50LmJvZHkpIC8vZG9uJ3QgbW92ZSBtb2RhbHMgZG9tIHBvc2l0aW9uXG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdGhhdC4kZWxlbWVudC5zaG93KClcblxuICAgICAgICAgIGlmICh0cmFuc2l0aW9uKSB7XG4gICAgICAgICAgICB0aGF0LiRlbGVtZW50WzBdLm9mZnNldFdpZHRoIC8vIGZvcmNlIHJlZmxvd1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHRoYXQuJGVsZW1lbnRcbiAgICAgICAgICAgIC5hZGRDbGFzcygnaW4nKVxuICAgICAgICAgICAgLmF0dHIoJ2FyaWEtaGlkZGVuJywgZmFsc2UpXG5cbiAgICAgICAgICB0aGF0LmVuZm9yY2VGb2N1cygpXG5cbiAgICAgICAgICB0cmFuc2l0aW9uID9cbiAgICAgICAgICAgIHRoYXQuJGVsZW1lbnQub25lKCQuc3VwcG9ydC50cmFuc2l0aW9uLmVuZCwgZnVuY3Rpb24gKCkgeyB0aGF0LiRlbGVtZW50LmZvY3VzKCkudHJpZ2dlcignc2hvd24nKSB9KSA6XG4gICAgICAgICAgICB0aGF0LiRlbGVtZW50LmZvY3VzKCkudHJpZ2dlcignc2hvd24nKVxuXG4gICAgICAgIH0pXG4gICAgICB9XG5cbiAgICAsIGhpZGU6IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIGUgJiYgZS5wcmV2ZW50RGVmYXVsdCgpXG5cbiAgICAgICAgdmFyIHRoYXQgPSB0aGlzXG5cbiAgICAgICAgZSA9ICQuRXZlbnQoJ2hpZGUnKVxuXG4gICAgICAgIHRoaXMuJGVsZW1lbnQudHJpZ2dlcihlKVxuXG4gICAgICAgIGlmICghdGhpcy5pc1Nob3duIHx8IGUuaXNEZWZhdWx0UHJldmVudGVkKCkpIHJldHVyblxuXG4gICAgICAgIHRoaXMuaXNTaG93biA9IGZhbHNlXG5cbiAgICAgICAgdGhpcy5lc2NhcGUoKVxuXG4gICAgICAgICQoZG9jdW1lbnQpLm9mZignZm9jdXNpbi5tb2RhbCcpXG5cbiAgICAgICAgdGhpcy4kZWxlbWVudFxuICAgICAgICAgIC5yZW1vdmVDbGFzcygnaW4nKVxuICAgICAgICAgIC5hdHRyKCdhcmlhLWhpZGRlbicsIHRydWUpXG5cbiAgICAgICAgJC5zdXBwb3J0LnRyYW5zaXRpb24gJiYgdGhpcy4kZWxlbWVudC5oYXNDbGFzcygnZmFkZScpID9cbiAgICAgICAgICB0aGlzLmhpZGVXaXRoVHJhbnNpdGlvbigpIDpcbiAgICAgICAgICB0aGlzLmhpZGVNb2RhbCgpXG4gICAgICB9XG5cbiAgICAsIGVuZm9yY2VGb2N1czogZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgdGhhdCA9IHRoaXNcbiAgICAgICAgJChkb2N1bWVudCkub24oJ2ZvY3VzaW4ubW9kYWwnLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgIGlmICh0aGF0LiRlbGVtZW50WzBdICE9PSBlLnRhcmdldCAmJiAhdGhhdC4kZWxlbWVudC5oYXMoZS50YXJnZXQpLmxlbmd0aCkge1xuICAgICAgICAgICAgdGhhdC4kZWxlbWVudC5mb2N1cygpXG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgfVxuXG4gICAgLCBlc2NhcGU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHRoYXQgPSB0aGlzXG4gICAgICAgIGlmICh0aGlzLmlzU2hvd24gJiYgdGhpcy5vcHRpb25zLmtleWJvYXJkKSB7XG4gICAgICAgICAgdGhpcy4kZWxlbWVudC5vbigna2V5dXAuZGlzbWlzcy5tb2RhbCcsIGZ1bmN0aW9uICggZSApIHtcbiAgICAgICAgICAgIGUud2hpY2ggPT0gMjcgJiYgdGhhdC5oaWRlKClcbiAgICAgICAgICB9KVxuICAgICAgICB9IGVsc2UgaWYgKCF0aGlzLmlzU2hvd24pIHtcbiAgICAgICAgICB0aGlzLiRlbGVtZW50Lm9mZigna2V5dXAuZGlzbWlzcy5tb2RhbCcpXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICwgaGlkZVdpdGhUcmFuc2l0aW9uOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciB0aGF0ID0gdGhpc1xuICAgICAgICAgICwgdGltZW91dCA9IHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICB0aGF0LiRlbGVtZW50Lm9mZigkLnN1cHBvcnQudHJhbnNpdGlvbi5lbmQpXG4gICAgICAgICAgICAgIHRoYXQuaGlkZU1vZGFsKClcbiAgICAgICAgICAgIH0sIDUwMClcblxuICAgICAgICB0aGlzLiRlbGVtZW50Lm9uZSgkLnN1cHBvcnQudHJhbnNpdGlvbi5lbmQsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBjbGVhclRpbWVvdXQodGltZW91dClcbiAgICAgICAgICB0aGF0LmhpZGVNb2RhbCgpXG4gICAgICAgIH0pXG4gICAgICB9XG5cbiAgICAsIGhpZGVNb2RhbDogZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgdGhhdCA9IHRoaXNcbiAgICAgICAgdGhpcy4kZWxlbWVudC5oaWRlKClcbiAgICAgICAgdGhpcy5iYWNrZHJvcChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgdGhhdC5yZW1vdmVCYWNrZHJvcCgpXG4gICAgICAgICAgdGhhdC4kZWxlbWVudC50cmlnZ2VyKCdoaWRkZW4nKVxuICAgICAgICB9KVxuICAgICAgfVxuXG4gICAgLCByZW1vdmVCYWNrZHJvcDogZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLiRiYWNrZHJvcCAmJiB0aGlzLiRiYWNrZHJvcC5yZW1vdmUoKVxuICAgICAgICB0aGlzLiRiYWNrZHJvcCA9IG51bGxcbiAgICAgIH1cblxuICAgICwgYmFja2Ryb3A6IGZ1bmN0aW9uIChjYWxsYmFjaykge1xuICAgICAgICB2YXIgdGhhdCA9IHRoaXNcbiAgICAgICAgICAsIGFuaW1hdGUgPSB0aGlzLiRlbGVtZW50Lmhhc0NsYXNzKCdmYWRlJykgPyAnZmFkZScgOiAnJ1xuXG4gICAgICAgIGlmICh0aGlzLmlzU2hvd24gJiYgdGhpcy5vcHRpb25zLmJhY2tkcm9wKSB7XG4gICAgICAgICAgdmFyIGRvQW5pbWF0ZSA9ICQuc3VwcG9ydC50cmFuc2l0aW9uICYmIGFuaW1hdGVcblxuICAgICAgICAgIHRoaXMuJGJhY2tkcm9wID0gJCgnPGRpdiBjbGFzcz1cIm1vZGFsLWJhY2tkcm9wICcgKyBhbmltYXRlICsgJ1wiIC8+JylcbiAgICAgICAgICAgIC5hcHBlbmRUbyhkb2N1bWVudC5ib2R5KVxuXG4gICAgICAgICAgdGhpcy4kYmFja2Ryb3AuY2xpY2soXG4gICAgICAgICAgICB0aGlzLm9wdGlvbnMuYmFja2Ryb3AgPT0gJ3N0YXRpYycgP1xuICAgICAgICAgICAgICAkLnByb3h5KHRoaXMuJGVsZW1lbnRbMF0uZm9jdXMsIHRoaXMuJGVsZW1lbnRbMF0pXG4gICAgICAgICAgICA6ICQucHJveHkodGhpcy5oaWRlLCB0aGlzKVxuICAgICAgICAgIClcblxuICAgICAgICAgIGlmIChkb0FuaW1hdGUpIHRoaXMuJGJhY2tkcm9wWzBdLm9mZnNldFdpZHRoIC8vIGZvcmNlIHJlZmxvd1xuXG4gICAgICAgICAgdGhpcy4kYmFja2Ryb3AuYWRkQ2xhc3MoJ2luJylcblxuICAgICAgICAgIGlmICghY2FsbGJhY2spIHJldHVyblxuXG4gICAgICAgICAgZG9BbmltYXRlID9cbiAgICAgICAgICAgIHRoaXMuJGJhY2tkcm9wLm9uZSgkLnN1cHBvcnQudHJhbnNpdGlvbi5lbmQsIGNhbGxiYWNrKSA6XG4gICAgICAgICAgICBjYWxsYmFjaygpXG5cbiAgICAgICAgfSBlbHNlIGlmICghdGhpcy5pc1Nob3duICYmIHRoaXMuJGJhY2tkcm9wKSB7XG4gICAgICAgICAgdGhpcy4kYmFja2Ryb3AucmVtb3ZlQ2xhc3MoJ2luJylcblxuICAgICAgICAgICQuc3VwcG9ydC50cmFuc2l0aW9uICYmIHRoaXMuJGVsZW1lbnQuaGFzQ2xhc3MoJ2ZhZGUnKT9cbiAgICAgICAgICAgIHRoaXMuJGJhY2tkcm9wLm9uZSgkLnN1cHBvcnQudHJhbnNpdGlvbi5lbmQsIGNhbGxiYWNrKSA6XG4gICAgICAgICAgICBjYWxsYmFjaygpXG5cbiAgICAgICAgfSBlbHNlIGlmIChjYWxsYmFjaykge1xuICAgICAgICAgIGNhbGxiYWNrKClcbiAgICAgICAgfVxuICAgICAgfVxuICB9XG5cblxuIC8qIE1PREFMIFBMVUdJTiBERUZJTklUSU9OXG4gICogPT09PT09PT09PT09PT09PT09PT09PT0gKi9cblxuICB2YXIgb2xkID0gJC5mbi5tb2RhbFxuXG4gICQuZm4ubW9kYWwgPSBmdW5jdGlvbiAob3B0aW9uKSB7XG4gICAgcmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgJHRoaXMgPSAkKHRoaXMpXG4gICAgICAgICwgZGF0YSA9ICR0aGlzLmRhdGEoJ21vZGFsJylcbiAgICAgICAgLCBvcHRpb25zID0gJC5leHRlbmQoe30sICQuZm4ubW9kYWwuZGVmYXVsdHMsICR0aGlzLmRhdGEoKSwgdHlwZW9mIG9wdGlvbiA9PSAnb2JqZWN0JyAmJiBvcHRpb24pXG4gICAgICBpZiAoIWRhdGEpICR0aGlzLmRhdGEoJ21vZGFsJywgKGRhdGEgPSBuZXcgTW9kYWwodGhpcywgb3B0aW9ucykpKVxuICAgICAgaWYgKHR5cGVvZiBvcHRpb24gPT0gJ3N0cmluZycpIGRhdGFbb3B0aW9uXSgpXG4gICAgICBlbHNlIGlmIChvcHRpb25zLnNob3cpIGRhdGEuc2hvdygpXG4gICAgfSlcbiAgfVxuXG4gICQuZm4ubW9kYWwuZGVmYXVsdHMgPSB7XG4gICAgICBiYWNrZHJvcDogdHJ1ZVxuICAgICwga2V5Ym9hcmQ6IHRydWVcbiAgICAsIHNob3c6IHRydWVcbiAgfVxuXG4gICQuZm4ubW9kYWwuQ29uc3RydWN0b3IgPSBNb2RhbFxuXG5cbiAvKiBNT0RBTCBOTyBDT05GTElDVFxuICAqID09PT09PT09PT09PT09PT09ICovXG5cbiAgJC5mbi5tb2RhbC5ub0NvbmZsaWN0ID0gZnVuY3Rpb24gKCkge1xuICAgICQuZm4ubW9kYWwgPSBvbGRcbiAgICByZXR1cm4gdGhpc1xuICB9XG5cblxuIC8qIE1PREFMIERBVEEtQVBJXG4gICogPT09PT09PT09PT09PT0gKi9cblxuICAkKGRvY3VtZW50KS5vbignY2xpY2subW9kYWwuZGF0YS1hcGknLCAnW2RhdGEtdG9nZ2xlPVwibW9kYWxcIl0nLCBmdW5jdGlvbiAoZSkge1xuICAgIHZhciAkdGhpcyA9ICQodGhpcylcbiAgICAgICwgaHJlZiA9ICR0aGlzLmF0dHIoJ2hyZWYnKVxuICAgICAgLCAkdGFyZ2V0ID0gJCgkdGhpcy5hdHRyKCdkYXRhLXRhcmdldCcpIHx8IChocmVmICYmIGhyZWYucmVwbGFjZSgvLiooPz0jW15cXHNdKyQpLywgJycpKSkgLy9zdHJpcCBmb3IgaWU3XG4gICAgICAsIG9wdGlvbiA9ICR0YXJnZXQuZGF0YSgnbW9kYWwnKSA/ICd0b2dnbGUnIDogJC5leHRlbmQoeyByZW1vdGU6IS8jLy50ZXN0KGhyZWYpICYmIGhyZWYgfSwgJHRhcmdldC5kYXRhKCksICR0aGlzLmRhdGEoKSlcblxuICAgIGUucHJldmVudERlZmF1bHQoKVxuXG4gICAgJHRhcmdldFxuICAgICAgLm1vZGFsKG9wdGlvbilcbiAgICAgIC5vbmUoJ2hpZGUnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICR0aGlzLmZvY3VzKClcbiAgICAgIH0pXG4gIH0pXG5cbn0od2luZG93LmpRdWVyeSk7XG4vKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICogYm9vdHN0cmFwLXRvb2x0aXAuanMgdjIuMy4xXG4gKiBodHRwOi8vdHdpdHRlci5naXRodWIuY29tL2Jvb3RzdHJhcC9qYXZhc2NyaXB0Lmh0bWwjdG9vbHRpcHNcbiAqIEluc3BpcmVkIGJ5IHRoZSBvcmlnaW5hbCBqUXVlcnkudGlwc3kgYnkgSmFzb24gRnJhbWVcbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKiBDb3B5cmlnaHQgMjAxMiBUd2l0dGVyLCBJbmMuXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG5cblxuIWZ1bmN0aW9uICgkKSB7XG5cbiAgXCJ1c2Ugc3RyaWN0XCI7IC8vIGpzaGludCA7XztcblxuXG4gLyogVE9PTFRJUCBQVUJMSUMgQ0xBU1MgREVGSU5JVElPTlxuICAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cblxuICB2YXIgVG9vbHRpcCA9IGZ1bmN0aW9uIChlbGVtZW50LCBvcHRpb25zKSB7XG4gICAgdGhpcy5pbml0KCd0b29sdGlwJywgZWxlbWVudCwgb3B0aW9ucylcbiAgfVxuXG4gIFRvb2x0aXAucHJvdG90eXBlID0ge1xuXG4gICAgY29uc3RydWN0b3I6IFRvb2x0aXBcblxuICAsIGluaXQ6IGZ1bmN0aW9uICh0eXBlLCBlbGVtZW50LCBvcHRpb25zKSB7XG4gICAgICB2YXIgZXZlbnRJblxuICAgICAgICAsIGV2ZW50T3V0XG4gICAgICAgICwgdHJpZ2dlcnNcbiAgICAgICAgLCB0cmlnZ2VyXG4gICAgICAgICwgaVxuXG4gICAgICB0aGlzLnR5cGUgPSB0eXBlXG4gICAgICB0aGlzLiRlbGVtZW50ID0gJChlbGVtZW50KVxuICAgICAgdGhpcy5vcHRpb25zID0gdGhpcy5nZXRPcHRpb25zKG9wdGlvbnMpXG4gICAgICB0aGlzLmVuYWJsZWQgPSB0cnVlXG5cbiAgICAgIHRyaWdnZXJzID0gdGhpcy5vcHRpb25zLnRyaWdnZXIuc3BsaXQoJyAnKVxuXG4gICAgICBmb3IgKGkgPSB0cmlnZ2Vycy5sZW5ndGg7IGktLTspIHtcbiAgICAgICAgdHJpZ2dlciA9IHRyaWdnZXJzW2ldXG4gICAgICAgIGlmICh0cmlnZ2VyID09ICdjbGljaycpIHtcbiAgICAgICAgICB0aGlzLiRlbGVtZW50Lm9uKCdjbGljay4nICsgdGhpcy50eXBlLCB0aGlzLm9wdGlvbnMuc2VsZWN0b3IsICQucHJveHkodGhpcy50b2dnbGUsIHRoaXMpKVxuICAgICAgICB9IGVsc2UgaWYgKHRyaWdnZXIgIT0gJ21hbnVhbCcpIHtcbiAgICAgICAgICBldmVudEluID0gdHJpZ2dlciA9PSAnaG92ZXInID8gJ21vdXNlZW50ZXInIDogJ2ZvY3VzJ1xuICAgICAgICAgIGV2ZW50T3V0ID0gdHJpZ2dlciA9PSAnaG92ZXInID8gJ21vdXNlbGVhdmUnIDogJ2JsdXInXG4gICAgICAgICAgdGhpcy4kZWxlbWVudC5vbihldmVudEluICsgJy4nICsgdGhpcy50eXBlLCB0aGlzLm9wdGlvbnMuc2VsZWN0b3IsICQucHJveHkodGhpcy5lbnRlciwgdGhpcykpXG4gICAgICAgICAgdGhpcy4kZWxlbWVudC5vbihldmVudE91dCArICcuJyArIHRoaXMudHlwZSwgdGhpcy5vcHRpb25zLnNlbGVjdG9yLCAkLnByb3h5KHRoaXMubGVhdmUsIHRoaXMpKVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHRoaXMub3B0aW9ucy5zZWxlY3RvciA/XG4gICAgICAgICh0aGlzLl9vcHRpb25zID0gJC5leHRlbmQoe30sIHRoaXMub3B0aW9ucywgeyB0cmlnZ2VyOiAnbWFudWFsJywgc2VsZWN0b3I6ICcnIH0pKSA6XG4gICAgICAgIHRoaXMuZml4VGl0bGUoKVxuICAgIH1cblxuICAsIGdldE9wdGlvbnM6IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gICAgICBvcHRpb25zID0gJC5leHRlbmQoe30sICQuZm5bdGhpcy50eXBlXS5kZWZhdWx0cywgdGhpcy4kZWxlbWVudC5kYXRhKCksIG9wdGlvbnMpXG5cbiAgICAgIGlmIChvcHRpb25zLmRlbGF5ICYmIHR5cGVvZiBvcHRpb25zLmRlbGF5ID09ICdudW1iZXInKSB7XG4gICAgICAgIG9wdGlvbnMuZGVsYXkgPSB7XG4gICAgICAgICAgc2hvdzogb3B0aW9ucy5kZWxheVxuICAgICAgICAsIGhpZGU6IG9wdGlvbnMuZGVsYXlcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gb3B0aW9uc1xuICAgIH1cblxuICAsIGVudGVyOiBmdW5jdGlvbiAoZSkge1xuICAgICAgdmFyIGRlZmF1bHRzID0gJC5mblt0aGlzLnR5cGVdLmRlZmF1bHRzXG4gICAgICAgICwgb3B0aW9ucyA9IHt9XG4gICAgICAgICwgc2VsZlxuXG4gICAgICB0aGlzLl9vcHRpb25zICYmICQuZWFjaCh0aGlzLl9vcHRpb25zLCBmdW5jdGlvbiAoa2V5LCB2YWx1ZSkge1xuICAgICAgICBpZiAoZGVmYXVsdHNba2V5XSAhPSB2YWx1ZSkgb3B0aW9uc1trZXldID0gdmFsdWVcbiAgICAgIH0sIHRoaXMpXG5cbiAgICAgIHNlbGYgPSAkKGUuY3VycmVudFRhcmdldClbdGhpcy50eXBlXShvcHRpb25zKS5kYXRhKHRoaXMudHlwZSlcblxuICAgICAgaWYgKCFzZWxmLm9wdGlvbnMuZGVsYXkgfHwgIXNlbGYub3B0aW9ucy5kZWxheS5zaG93KSByZXR1cm4gc2VsZi5zaG93KClcblxuICAgICAgY2xlYXJUaW1lb3V0KHRoaXMudGltZW91dClcbiAgICAgIHNlbGYuaG92ZXJTdGF0ZSA9ICdpbidcbiAgICAgIHRoaXMudGltZW91dCA9IHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmIChzZWxmLmhvdmVyU3RhdGUgPT0gJ2luJykgc2VsZi5zaG93KClcbiAgICAgIH0sIHNlbGYub3B0aW9ucy5kZWxheS5zaG93KVxuICAgIH1cblxuICAsIGxlYXZlOiBmdW5jdGlvbiAoZSkge1xuICAgICAgdmFyIHNlbGYgPSAkKGUuY3VycmVudFRhcmdldClbdGhpcy50eXBlXSh0aGlzLl9vcHRpb25zKS5kYXRhKHRoaXMudHlwZSlcblxuICAgICAgaWYgKHRoaXMudGltZW91dCkgY2xlYXJUaW1lb3V0KHRoaXMudGltZW91dClcbiAgICAgIGlmICghc2VsZi5vcHRpb25zLmRlbGF5IHx8ICFzZWxmLm9wdGlvbnMuZGVsYXkuaGlkZSkgcmV0dXJuIHNlbGYuaGlkZSgpXG5cbiAgICAgIHNlbGYuaG92ZXJTdGF0ZSA9ICdvdXQnXG4gICAgICB0aGlzLnRpbWVvdXQgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAoc2VsZi5ob3ZlclN0YXRlID09ICdvdXQnKSBzZWxmLmhpZGUoKVxuICAgICAgfSwgc2VsZi5vcHRpb25zLmRlbGF5LmhpZGUpXG4gICAgfVxuXG4gICwgc2hvdzogZnVuY3Rpb24gKCkge1xuICAgICAgdmFyICR0aXBcbiAgICAgICAgLCBwb3NcbiAgICAgICAgLCBhY3R1YWxXaWR0aFxuICAgICAgICAsIGFjdHVhbEhlaWdodFxuICAgICAgICAsIHBsYWNlbWVudFxuICAgICAgICAsIHRwXG4gICAgICAgICwgZSA9ICQuRXZlbnQoJ3Nob3cnKVxuXG4gICAgICBpZiAodGhpcy5oYXNDb250ZW50KCkgJiYgdGhpcy5lbmFibGVkKSB7XG4gICAgICAgIHRoaXMuJGVsZW1lbnQudHJpZ2dlcihlKVxuICAgICAgICBpZiAoZS5pc0RlZmF1bHRQcmV2ZW50ZWQoKSkgcmV0dXJuXG4gICAgICAgICR0aXAgPSB0aGlzLnRpcCgpXG4gICAgICAgIHRoaXMuc2V0Q29udGVudCgpXG5cbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5hbmltYXRpb24pIHtcbiAgICAgICAgICAkdGlwLmFkZENsYXNzKCdmYWRlJylcbiAgICAgICAgfVxuXG4gICAgICAgIHBsYWNlbWVudCA9IHR5cGVvZiB0aGlzLm9wdGlvbnMucGxhY2VtZW50ID09ICdmdW5jdGlvbicgP1xuICAgICAgICAgIHRoaXMub3B0aW9ucy5wbGFjZW1lbnQuY2FsbCh0aGlzLCAkdGlwWzBdLCB0aGlzLiRlbGVtZW50WzBdKSA6XG4gICAgICAgICAgdGhpcy5vcHRpb25zLnBsYWNlbWVudFxuXG4gICAgICAgICR0aXBcbiAgICAgICAgICAuZGV0YWNoKClcbiAgICAgICAgICAuY3NzKHsgdG9wOiAwLCBsZWZ0OiAwLCBkaXNwbGF5OiAnYmxvY2snIH0pXG5cbiAgICAgICAgdGhpcy5vcHRpb25zLmNvbnRhaW5lciA/ICR0aXAuYXBwZW5kVG8odGhpcy5vcHRpb25zLmNvbnRhaW5lcikgOiAkdGlwLmluc2VydEFmdGVyKHRoaXMuJGVsZW1lbnQpXG5cbiAgICAgICAgcG9zID0gdGhpcy5nZXRQb3NpdGlvbigpXG5cbiAgICAgICAgYWN0dWFsV2lkdGggPSAkdGlwWzBdLm9mZnNldFdpZHRoXG4gICAgICAgIGFjdHVhbEhlaWdodCA9ICR0aXBbMF0ub2Zmc2V0SGVpZ2h0XG5cbiAgICAgICAgc3dpdGNoIChwbGFjZW1lbnQpIHtcbiAgICAgICAgICBjYXNlICdib3R0b20nOlxuICAgICAgICAgICAgdHAgPSB7dG9wOiBwb3MudG9wICsgcG9zLmhlaWdodCwgbGVmdDogcG9zLmxlZnQgKyBwb3Mud2lkdGggLyAyIC0gYWN0dWFsV2lkdGggLyAyfVxuICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICBjYXNlICd0b3AnOlxuICAgICAgICAgICAgdHAgPSB7dG9wOiBwb3MudG9wIC0gYWN0dWFsSGVpZ2h0LCBsZWZ0OiBwb3MubGVmdCArIHBvcy53aWR0aCAvIDIgLSBhY3R1YWxXaWR0aCAvIDJ9XG4gICAgICAgICAgICBicmVha1xuICAgICAgICAgIGNhc2UgJ2xlZnQnOlxuICAgICAgICAgICAgdHAgPSB7dG9wOiBwb3MudG9wICsgcG9zLmhlaWdodCAvIDIgLSBhY3R1YWxIZWlnaHQgLyAyLCBsZWZ0OiBwb3MubGVmdCAtIGFjdHVhbFdpZHRofVxuICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICBjYXNlICdyaWdodCc6XG4gICAgICAgICAgICB0cCA9IHt0b3A6IHBvcy50b3AgKyBwb3MuaGVpZ2h0IC8gMiAtIGFjdHVhbEhlaWdodCAvIDIsIGxlZnQ6IHBvcy5sZWZ0ICsgcG9zLndpZHRofVxuICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuYXBwbHlQbGFjZW1lbnQodHAsIHBsYWNlbWVudClcbiAgICAgICAgdGhpcy4kZWxlbWVudC50cmlnZ2VyKCdzaG93bicpXG4gICAgICB9XG4gICAgfVxuXG4gICwgYXBwbHlQbGFjZW1lbnQ6IGZ1bmN0aW9uKG9mZnNldCwgcGxhY2VtZW50KXtcbiAgICAgIHZhciAkdGlwID0gdGhpcy50aXAoKVxuICAgICAgICAsIHdpZHRoID0gJHRpcFswXS5vZmZzZXRXaWR0aFxuICAgICAgICAsIGhlaWdodCA9ICR0aXBbMF0ub2Zmc2V0SGVpZ2h0XG4gICAgICAgICwgYWN0dWFsV2lkdGhcbiAgICAgICAgLCBhY3R1YWxIZWlnaHRcbiAgICAgICAgLCBkZWx0YVxuICAgICAgICAsIHJlcGxhY2VcblxuICAgICAgJHRpcFxuICAgICAgICAub2Zmc2V0KG9mZnNldClcbiAgICAgICAgLmFkZENsYXNzKHBsYWNlbWVudClcbiAgICAgICAgLmFkZENsYXNzKCdpbicpXG5cbiAgICAgIGFjdHVhbFdpZHRoID0gJHRpcFswXS5vZmZzZXRXaWR0aFxuICAgICAgYWN0dWFsSGVpZ2h0ID0gJHRpcFswXS5vZmZzZXRIZWlnaHRcblxuICAgICAgaWYgKHBsYWNlbWVudCA9PSAndG9wJyAmJiBhY3R1YWxIZWlnaHQgIT0gaGVpZ2h0KSB7XG4gICAgICAgIG9mZnNldC50b3AgPSBvZmZzZXQudG9wICsgaGVpZ2h0IC0gYWN0dWFsSGVpZ2h0XG4gICAgICAgIHJlcGxhY2UgPSB0cnVlXG4gICAgICB9XG5cbiAgICAgIGlmIChwbGFjZW1lbnQgPT0gJ2JvdHRvbScgfHwgcGxhY2VtZW50ID09ICd0b3AnKSB7XG4gICAgICAgIGRlbHRhID0gMFxuXG4gICAgICAgIGlmIChvZmZzZXQubGVmdCA8IDApe1xuICAgICAgICAgIGRlbHRhID0gb2Zmc2V0LmxlZnQgKiAtMlxuICAgICAgICAgIG9mZnNldC5sZWZ0ID0gMFxuICAgICAgICAgICR0aXAub2Zmc2V0KG9mZnNldClcbiAgICAgICAgICBhY3R1YWxXaWR0aCA9ICR0aXBbMF0ub2Zmc2V0V2lkdGhcbiAgICAgICAgICBhY3R1YWxIZWlnaHQgPSAkdGlwWzBdLm9mZnNldEhlaWdodFxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5yZXBsYWNlQXJyb3coZGVsdGEgLSB3aWR0aCArIGFjdHVhbFdpZHRoLCBhY3R1YWxXaWR0aCwgJ2xlZnQnKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5yZXBsYWNlQXJyb3coYWN0dWFsSGVpZ2h0IC0gaGVpZ2h0LCBhY3R1YWxIZWlnaHQsICd0b3AnKVxuICAgICAgfVxuXG4gICAgICBpZiAocmVwbGFjZSkgJHRpcC5vZmZzZXQob2Zmc2V0KVxuICAgIH1cblxuICAsIHJlcGxhY2VBcnJvdzogZnVuY3Rpb24oZGVsdGEsIGRpbWVuc2lvbiwgcG9zaXRpb24pe1xuICAgICAgdGhpc1xuICAgICAgICAuYXJyb3coKVxuICAgICAgICAuY3NzKHBvc2l0aW9uLCBkZWx0YSA/ICg1MCAqICgxIC0gZGVsdGEgLyBkaW1lbnNpb24pICsgXCIlXCIpIDogJycpXG4gICAgfVxuXG4gICwgc2V0Q29udGVudDogZnVuY3Rpb24gKCkge1xuICAgICAgdmFyICR0aXAgPSB0aGlzLnRpcCgpXG4gICAgICAgICwgdGl0bGUgPSB0aGlzLmdldFRpdGxlKClcblxuICAgICAgJHRpcC5maW5kKCcudG9vbHRpcC1pbm5lcicpW3RoaXMub3B0aW9ucy5odG1sID8gJ2h0bWwnIDogJ3RleHQnXSh0aXRsZSlcbiAgICAgICR0aXAucmVtb3ZlQ2xhc3MoJ2ZhZGUgaW4gdG9wIGJvdHRvbSBsZWZ0IHJpZ2h0JylcbiAgICB9XG5cbiAgLCBoaWRlOiBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgdGhhdCA9IHRoaXNcbiAgICAgICAgLCAkdGlwID0gdGhpcy50aXAoKVxuICAgICAgICAsIGUgPSAkLkV2ZW50KCdoaWRlJylcblxuICAgICAgdGhpcy4kZWxlbWVudC50cmlnZ2VyKGUpXG4gICAgICBpZiAoZS5pc0RlZmF1bHRQcmV2ZW50ZWQoKSkgcmV0dXJuXG5cbiAgICAgICR0aXAucmVtb3ZlQ2xhc3MoJ2luJylcblxuICAgICAgZnVuY3Rpb24gcmVtb3ZlV2l0aEFuaW1hdGlvbigpIHtcbiAgICAgICAgdmFyIHRpbWVvdXQgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAkdGlwLm9mZigkLnN1cHBvcnQudHJhbnNpdGlvbi5lbmQpLmRldGFjaCgpXG4gICAgICAgIH0sIDUwMClcblxuICAgICAgICAkdGlwLm9uZSgkLnN1cHBvcnQudHJhbnNpdGlvbi5lbmQsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBjbGVhclRpbWVvdXQodGltZW91dClcbiAgICAgICAgICAkdGlwLmRldGFjaCgpXG4gICAgICAgIH0pXG4gICAgICB9XG5cbiAgICAgICQuc3VwcG9ydC50cmFuc2l0aW9uICYmIHRoaXMuJHRpcC5oYXNDbGFzcygnZmFkZScpID9cbiAgICAgICAgcmVtb3ZlV2l0aEFuaW1hdGlvbigpIDpcbiAgICAgICAgJHRpcC5kZXRhY2goKVxuXG4gICAgICB0aGlzLiRlbGVtZW50LnRyaWdnZXIoJ2hpZGRlbicpXG5cbiAgICAgIHJldHVybiB0aGlzXG4gICAgfVxuXG4gICwgZml4VGl0bGU6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciAkZSA9IHRoaXMuJGVsZW1lbnRcbiAgICAgIGlmICgkZS5hdHRyKCd0aXRsZScpIHx8IHR5cGVvZigkZS5hdHRyKCdkYXRhLW9yaWdpbmFsLXRpdGxlJykpICE9ICdzdHJpbmcnKSB7XG4gICAgICAgICRlLmF0dHIoJ2RhdGEtb3JpZ2luYWwtdGl0bGUnLCAkZS5hdHRyKCd0aXRsZScpIHx8ICcnKS5hdHRyKCd0aXRsZScsICcnKVxuICAgICAgfVxuICAgIH1cblxuICAsIGhhc0NvbnRlbnQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiB0aGlzLmdldFRpdGxlKClcbiAgICB9XG5cbiAgLCBnZXRQb3NpdGlvbjogZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIGVsID0gdGhpcy4kZWxlbWVudFswXVxuICAgICAgcmV0dXJuICQuZXh0ZW5kKHt9LCAodHlwZW9mIGVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCA9PSAnZnVuY3Rpb24nKSA/IGVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpIDoge1xuICAgICAgICB3aWR0aDogZWwub2Zmc2V0V2lkdGhcbiAgICAgICwgaGVpZ2h0OiBlbC5vZmZzZXRIZWlnaHRcbiAgICAgIH0sIHRoaXMuJGVsZW1lbnQub2Zmc2V0KCkpXG4gICAgfVxuXG4gICwgZ2V0VGl0bGU6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciB0aXRsZVxuICAgICAgICAsICRlID0gdGhpcy4kZWxlbWVudFxuICAgICAgICAsIG8gPSB0aGlzLm9wdGlvbnNcblxuICAgICAgdGl0bGUgPSAkZS5hdHRyKCdkYXRhLW9yaWdpbmFsLXRpdGxlJylcbiAgICAgICAgfHwgKHR5cGVvZiBvLnRpdGxlID09ICdmdW5jdGlvbicgPyBvLnRpdGxlLmNhbGwoJGVbMF0pIDogIG8udGl0bGUpXG5cbiAgICAgIHJldHVybiB0aXRsZVxuICAgIH1cblxuICAsIHRpcDogZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIHRoaXMuJHRpcCA9IHRoaXMuJHRpcCB8fCAkKHRoaXMub3B0aW9ucy50ZW1wbGF0ZSlcbiAgICB9XG5cbiAgLCBhcnJvdzogZnVuY3Rpb24oKXtcbiAgICAgIHJldHVybiB0aGlzLiRhcnJvdyA9IHRoaXMuJGFycm93IHx8IHRoaXMudGlwKCkuZmluZChcIi50b29sdGlwLWFycm93XCIpXG4gICAgfVxuXG4gICwgdmFsaWRhdGU6IGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmICghdGhpcy4kZWxlbWVudFswXS5wYXJlbnROb2RlKSB7XG4gICAgICAgIHRoaXMuaGlkZSgpXG4gICAgICAgIHRoaXMuJGVsZW1lbnQgPSBudWxsXG4gICAgICAgIHRoaXMub3B0aW9ucyA9IG51bGxcbiAgICAgIH1cbiAgICB9XG5cbiAgLCBlbmFibGU6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHRoaXMuZW5hYmxlZCA9IHRydWVcbiAgICB9XG5cbiAgLCBkaXNhYmxlOiBmdW5jdGlvbiAoKSB7XG4gICAgICB0aGlzLmVuYWJsZWQgPSBmYWxzZVxuICAgIH1cblxuICAsIHRvZ2dsZUVuYWJsZWQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHRoaXMuZW5hYmxlZCA9ICF0aGlzLmVuYWJsZWRcbiAgICB9XG5cbiAgLCB0b2dnbGU6IGZ1bmN0aW9uIChlKSB7XG4gICAgICB2YXIgc2VsZiA9IGUgPyAkKGUuY3VycmVudFRhcmdldClbdGhpcy50eXBlXSh0aGlzLl9vcHRpb25zKS5kYXRhKHRoaXMudHlwZSkgOiB0aGlzXG4gICAgICBzZWxmLnRpcCgpLmhhc0NsYXNzKCdpbicpID8gc2VsZi5oaWRlKCkgOiBzZWxmLnNob3coKVxuICAgIH1cblxuICAsIGRlc3Ryb3k6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHRoaXMuaGlkZSgpLiRlbGVtZW50Lm9mZignLicgKyB0aGlzLnR5cGUpLnJlbW92ZURhdGEodGhpcy50eXBlKVxuICAgIH1cblxuICB9XG5cblxuIC8qIFRPT0xUSVAgUExVR0lOIERFRklOSVRJT05cbiAgKiA9PT09PT09PT09PT09PT09PT09PT09PT09ICovXG5cbiAgdmFyIG9sZCA9ICQuZm4udG9vbHRpcFxuXG4gICQuZm4udG9vbHRpcCA9IGZ1bmN0aW9uICggb3B0aW9uICkge1xuICAgIHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgdmFyICR0aGlzID0gJCh0aGlzKVxuICAgICAgICAsIGRhdGEgPSAkdGhpcy5kYXRhKCd0b29sdGlwJylcbiAgICAgICAgLCBvcHRpb25zID0gdHlwZW9mIG9wdGlvbiA9PSAnb2JqZWN0JyAmJiBvcHRpb25cbiAgICAgIGlmICghZGF0YSkgJHRoaXMuZGF0YSgndG9vbHRpcCcsIChkYXRhID0gbmV3IFRvb2x0aXAodGhpcywgb3B0aW9ucykpKVxuICAgICAgaWYgKHR5cGVvZiBvcHRpb24gPT0gJ3N0cmluZycpIGRhdGFbb3B0aW9uXSgpXG4gICAgfSlcbiAgfVxuXG4gICQuZm4udG9vbHRpcC5Db25zdHJ1Y3RvciA9IFRvb2x0aXBcblxuICAkLmZuLnRvb2x0aXAuZGVmYXVsdHMgPSB7XG4gICAgYW5pbWF0aW9uOiB0cnVlXG4gICwgcGxhY2VtZW50OiAndG9wJ1xuICAsIHNlbGVjdG9yOiBmYWxzZVxuICAsIHRlbXBsYXRlOiAnPGRpdiBjbGFzcz1cInRvb2x0aXBcIj48ZGl2IGNsYXNzPVwidG9vbHRpcC1hcnJvd1wiPjwvZGl2PjxkaXYgY2xhc3M9XCJ0b29sdGlwLWlubmVyXCI+PC9kaXY+PC9kaXY+J1xuICAsIHRyaWdnZXI6ICdob3ZlciBmb2N1cydcbiAgLCB0aXRsZTogJydcbiAgLCBkZWxheTogMFxuICAsIGh0bWw6IGZhbHNlXG4gICwgY29udGFpbmVyOiBmYWxzZVxuICB9XG5cblxuIC8qIFRPT0xUSVAgTk8gQ09ORkxJQ1RcbiAgKiA9PT09PT09PT09PT09PT09PT09ICovXG5cbiAgJC5mbi50b29sdGlwLm5vQ29uZmxpY3QgPSBmdW5jdGlvbiAoKSB7XG4gICAgJC5mbi50b29sdGlwID0gb2xkXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuXG59KHdpbmRvdy5qUXVlcnkpO1xuLyogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqIGJvb3RzdHJhcC1wb3BvdmVyLmpzIHYyLjMuMVxuICogaHR0cDovL3R3aXR0ZXIuZ2l0aHViLmNvbS9ib290c3RyYXAvamF2YXNjcmlwdC5odG1sI3BvcG92ZXJzXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICogQ29weXJpZ2h0IDIwMTIgVHdpdHRlciwgSW5jLlxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cblxuXG4hZnVuY3Rpb24gKCQpIHtcblxuICBcInVzZSBzdHJpY3RcIjsgLy8ganNoaW50IDtfO1xuXG5cbiAvKiBQT1BPVkVSIFBVQkxJQyBDTEFTUyBERUZJTklUSU9OXG4gICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuXG4gIHZhciBQb3BvdmVyID0gZnVuY3Rpb24gKGVsZW1lbnQsIG9wdGlvbnMpIHtcbiAgICB0aGlzLmluaXQoJ3BvcG92ZXInLCBlbGVtZW50LCBvcHRpb25zKVxuICB9XG5cblxuICAvKiBOT1RFOiBQT1BPVkVSIEVYVEVORFMgQk9PVFNUUkFQLVRPT0xUSVAuanNcbiAgICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG5cbiAgUG9wb3Zlci5wcm90b3R5cGUgPSAkLmV4dGVuZCh7fSwgJC5mbi50b29sdGlwLkNvbnN0cnVjdG9yLnByb3RvdHlwZSwge1xuXG4gICAgY29uc3RydWN0b3I6IFBvcG92ZXJcblxuICAsIHNldENvbnRlbnQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciAkdGlwID0gdGhpcy50aXAoKVxuICAgICAgICAsIHRpdGxlID0gdGhpcy5nZXRUaXRsZSgpXG4gICAgICAgICwgY29udGVudCA9IHRoaXMuZ2V0Q29udGVudCgpXG5cbiAgICAgICR0aXAuZmluZCgnLnBvcG92ZXItdGl0bGUnKVt0aGlzLm9wdGlvbnMuaHRtbCA/ICdodG1sJyA6ICd0ZXh0J10odGl0bGUpXG4gICAgICAkdGlwLmZpbmQoJy5wb3BvdmVyLWNvbnRlbnQnKVt0aGlzLm9wdGlvbnMuaHRtbCA/ICdodG1sJyA6ICd0ZXh0J10oY29udGVudClcblxuICAgICAgJHRpcC5yZW1vdmVDbGFzcygnZmFkZSB0b3AgYm90dG9tIGxlZnQgcmlnaHQgaW4nKVxuICAgIH1cblxuICAsIGhhc0NvbnRlbnQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiB0aGlzLmdldFRpdGxlKCkgfHwgdGhpcy5nZXRDb250ZW50KClcbiAgICB9XG5cbiAgLCBnZXRDb250ZW50OiBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgY29udGVudFxuICAgICAgICAsICRlID0gdGhpcy4kZWxlbWVudFxuICAgICAgICAsIG8gPSB0aGlzLm9wdGlvbnNcblxuICAgICAgY29udGVudCA9ICh0eXBlb2Ygby5jb250ZW50ID09ICdmdW5jdGlvbicgPyBvLmNvbnRlbnQuY2FsbCgkZVswXSkgOiAgby5jb250ZW50KVxuICAgICAgICB8fCAkZS5hdHRyKCdkYXRhLWNvbnRlbnQnKVxuXG4gICAgICByZXR1cm4gY29udGVudFxuICAgIH1cblxuICAsIHRpcDogZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKCF0aGlzLiR0aXApIHtcbiAgICAgICAgdGhpcy4kdGlwID0gJCh0aGlzLm9wdGlvbnMudGVtcGxhdGUpXG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcy4kdGlwXG4gICAgfVxuXG4gICwgZGVzdHJveTogZnVuY3Rpb24gKCkge1xuICAgICAgdGhpcy5oaWRlKCkuJGVsZW1lbnQub2ZmKCcuJyArIHRoaXMudHlwZSkucmVtb3ZlRGF0YSh0aGlzLnR5cGUpXG4gICAgfVxuXG4gIH0pXG5cblxuIC8qIFBPUE9WRVIgUExVR0lOIERFRklOSVRJT05cbiAgKiA9PT09PT09PT09PT09PT09PT09PT09PSAqL1xuXG4gIHZhciBvbGQgPSAkLmZuLnBvcG92ZXJcblxuICAkLmZuLnBvcG92ZXIgPSBmdW5jdGlvbiAob3B0aW9uKSB7XG4gICAgcmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgJHRoaXMgPSAkKHRoaXMpXG4gICAgICAgICwgZGF0YSA9ICR0aGlzLmRhdGEoJ3BvcG92ZXInKVxuICAgICAgICAsIG9wdGlvbnMgPSB0eXBlb2Ygb3B0aW9uID09ICdvYmplY3QnICYmIG9wdGlvblxuICAgICAgaWYgKCFkYXRhKSAkdGhpcy5kYXRhKCdwb3BvdmVyJywgKGRhdGEgPSBuZXcgUG9wb3Zlcih0aGlzLCBvcHRpb25zKSkpXG4gICAgICBpZiAodHlwZW9mIG9wdGlvbiA9PSAnc3RyaW5nJykgZGF0YVtvcHRpb25dKClcbiAgICB9KVxuICB9XG5cbiAgJC5mbi5wb3BvdmVyLkNvbnN0cnVjdG9yID0gUG9wb3ZlclxuXG4gICQuZm4ucG9wb3Zlci5kZWZhdWx0cyA9ICQuZXh0ZW5kKHt9ICwgJC5mbi50b29sdGlwLmRlZmF1bHRzLCB7XG4gICAgcGxhY2VtZW50OiAncmlnaHQnXG4gICwgdHJpZ2dlcjogJ2NsaWNrJ1xuICAsIGNvbnRlbnQ6ICcnXG4gICwgdGVtcGxhdGU6ICc8ZGl2IGNsYXNzPVwicG9wb3ZlclwiPjxkaXYgY2xhc3M9XCJhcnJvd1wiPjwvZGl2PjxoMyBjbGFzcz1cInBvcG92ZXItdGl0bGVcIj48L2gzPjxkaXYgY2xhc3M9XCJwb3BvdmVyLWNvbnRlbnRcIj48L2Rpdj48L2Rpdj4nXG4gIH0pXG5cblxuIC8qIFBPUE9WRVIgTk8gQ09ORkxJQ1RcbiAgKiA9PT09PT09PT09PT09PT09PT09ICovXG5cbiAgJC5mbi5wb3BvdmVyLm5vQ29uZmxpY3QgPSBmdW5jdGlvbiAoKSB7XG4gICAgJC5mbi5wb3BvdmVyID0gb2xkXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuXG59KHdpbmRvdy5qUXVlcnkpO1xuLyogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICogYm9vdHN0cmFwLXNjcm9sbHNweS5qcyB2Mi4zLjFcbiAqIGh0dHA6Ly90d2l0dGVyLmdpdGh1Yi5jb20vYm9vdHN0cmFwL2phdmFzY3JpcHQuaHRtbCNzY3JvbGxzcHlcbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqIENvcHlyaWdodCAyMDEyIFR3aXR0ZXIsIEluYy5cbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG5cblxuIWZ1bmN0aW9uICgkKSB7XG5cbiAgXCJ1c2Ugc3RyaWN0XCI7IC8vIGpzaGludCA7XztcblxuXG4gLyogU0NST0xMU1BZIENMQVNTIERFRklOSVRJT05cbiAgKiA9PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuXG4gIGZ1bmN0aW9uIFNjcm9sbFNweShlbGVtZW50LCBvcHRpb25zKSB7XG4gICAgdmFyIHByb2Nlc3MgPSAkLnByb3h5KHRoaXMucHJvY2VzcywgdGhpcylcbiAgICAgICwgJGVsZW1lbnQgPSAkKGVsZW1lbnQpLmlzKCdib2R5JykgPyAkKHdpbmRvdykgOiAkKGVsZW1lbnQpXG4gICAgICAsIGhyZWZcbiAgICB0aGlzLm9wdGlvbnMgPSAkLmV4dGVuZCh7fSwgJC5mbi5zY3JvbGxzcHkuZGVmYXVsdHMsIG9wdGlvbnMpXG4gICAgdGhpcy4kc2Nyb2xsRWxlbWVudCA9ICRlbGVtZW50Lm9uKCdzY3JvbGwuc2Nyb2xsLXNweS5kYXRhLWFwaScsIHByb2Nlc3MpXG4gICAgdGhpcy5zZWxlY3RvciA9ICh0aGlzLm9wdGlvbnMudGFyZ2V0XG4gICAgICB8fCAoKGhyZWYgPSAkKGVsZW1lbnQpLmF0dHIoJ2hyZWYnKSkgJiYgaHJlZi5yZXBsYWNlKC8uKig/PSNbXlxcc10rJCkvLCAnJykpIC8vc3RyaXAgZm9yIGllN1xuICAgICAgfHwgJycpICsgJyAubmF2IGxpID4gYSdcbiAgICB0aGlzLiRib2R5ID0gJCgnYm9keScpXG4gICAgdGhpcy5yZWZyZXNoKClcbiAgICB0aGlzLnByb2Nlc3MoKVxuICB9XG5cbiAgU2Nyb2xsU3B5LnByb3RvdHlwZSA9IHtcblxuICAgICAgY29uc3RydWN0b3I6IFNjcm9sbFNweVxuXG4gICAgLCByZWZyZXNoOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBzZWxmID0gdGhpc1xuICAgICAgICAgICwgJHRhcmdldHNcblxuICAgICAgICB0aGlzLm9mZnNldHMgPSAkKFtdKVxuICAgICAgICB0aGlzLnRhcmdldHMgPSAkKFtdKVxuXG4gICAgICAgICR0YXJnZXRzID0gdGhpcy4kYm9keVxuICAgICAgICAgIC5maW5kKHRoaXMuc2VsZWN0b3IpXG4gICAgICAgICAgLm1hcChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgJGVsID0gJCh0aGlzKVxuICAgICAgICAgICAgICAsIGhyZWYgPSAkZWwuZGF0YSgndGFyZ2V0JykgfHwgJGVsLmF0dHIoJ2hyZWYnKVxuICAgICAgICAgICAgICAsICRocmVmID0gL14jXFx3Ly50ZXN0KGhyZWYpICYmICQoaHJlZilcbiAgICAgICAgICAgIHJldHVybiAoICRocmVmXG4gICAgICAgICAgICAgICYmICRocmVmLmxlbmd0aFxuICAgICAgICAgICAgICAmJiBbWyAkaHJlZi5wb3NpdGlvbigpLnRvcCArICghJC5pc1dpbmRvdyhzZWxmLiRzY3JvbGxFbGVtZW50LmdldCgwKSkgJiYgc2VsZi4kc2Nyb2xsRWxlbWVudC5zY3JvbGxUb3AoKSksIGhyZWYgXV0gKSB8fCBudWxsXG4gICAgICAgICAgfSlcbiAgICAgICAgICAuc29ydChmdW5jdGlvbiAoYSwgYikgeyByZXR1cm4gYVswXSAtIGJbMF0gfSlcbiAgICAgICAgICAuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBzZWxmLm9mZnNldHMucHVzaCh0aGlzWzBdKVxuICAgICAgICAgICAgc2VsZi50YXJnZXRzLnB1c2godGhpc1sxXSlcbiAgICAgICAgICB9KVxuICAgICAgfVxuXG4gICAgLCBwcm9jZXNzOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBzY3JvbGxUb3AgPSB0aGlzLiRzY3JvbGxFbGVtZW50LnNjcm9sbFRvcCgpICsgdGhpcy5vcHRpb25zLm9mZnNldFxuICAgICAgICAgICwgc2Nyb2xsSGVpZ2h0ID0gdGhpcy4kc2Nyb2xsRWxlbWVudFswXS5zY3JvbGxIZWlnaHQgfHwgdGhpcy4kYm9keVswXS5zY3JvbGxIZWlnaHRcbiAgICAgICAgICAsIG1heFNjcm9sbCA9IHNjcm9sbEhlaWdodCAtIHRoaXMuJHNjcm9sbEVsZW1lbnQuaGVpZ2h0KClcbiAgICAgICAgICAsIG9mZnNldHMgPSB0aGlzLm9mZnNldHNcbiAgICAgICAgICAsIHRhcmdldHMgPSB0aGlzLnRhcmdldHNcbiAgICAgICAgICAsIGFjdGl2ZVRhcmdldCA9IHRoaXMuYWN0aXZlVGFyZ2V0XG4gICAgICAgICAgLCBpXG5cbiAgICAgICAgaWYgKHNjcm9sbFRvcCA+PSBtYXhTY3JvbGwpIHtcbiAgICAgICAgICByZXR1cm4gYWN0aXZlVGFyZ2V0ICE9IChpID0gdGFyZ2V0cy5sYXN0KClbMF0pXG4gICAgICAgICAgICAmJiB0aGlzLmFjdGl2YXRlICggaSApXG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKGkgPSBvZmZzZXRzLmxlbmd0aDsgaS0tOykge1xuICAgICAgICAgIGFjdGl2ZVRhcmdldCAhPSB0YXJnZXRzW2ldXG4gICAgICAgICAgICAmJiBzY3JvbGxUb3AgPj0gb2Zmc2V0c1tpXVxuICAgICAgICAgICAgJiYgKCFvZmZzZXRzW2kgKyAxXSB8fCBzY3JvbGxUb3AgPD0gb2Zmc2V0c1tpICsgMV0pXG4gICAgICAgICAgICAmJiB0aGlzLmFjdGl2YXRlKCB0YXJnZXRzW2ldIClcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgLCBhY3RpdmF0ZTogZnVuY3Rpb24gKHRhcmdldCkge1xuICAgICAgICB2YXIgYWN0aXZlXG4gICAgICAgICAgLCBzZWxlY3RvclxuXG4gICAgICAgIHRoaXMuYWN0aXZlVGFyZ2V0ID0gdGFyZ2V0XG5cbiAgICAgICAgJCh0aGlzLnNlbGVjdG9yKVxuICAgICAgICAgIC5wYXJlbnQoJy5hY3RpdmUnKVxuICAgICAgICAgIC5yZW1vdmVDbGFzcygnYWN0aXZlJylcblxuICAgICAgICBzZWxlY3RvciA9IHRoaXMuc2VsZWN0b3JcbiAgICAgICAgICArICdbZGF0YS10YXJnZXQ9XCInICsgdGFyZ2V0ICsgJ1wiXSwnXG4gICAgICAgICAgKyB0aGlzLnNlbGVjdG9yICsgJ1tocmVmPVwiJyArIHRhcmdldCArICdcIl0nXG5cbiAgICAgICAgYWN0aXZlID0gJChzZWxlY3RvcilcbiAgICAgICAgICAucGFyZW50KCdsaScpXG4gICAgICAgICAgLmFkZENsYXNzKCdhY3RpdmUnKVxuXG4gICAgICAgIGlmIChhY3RpdmUucGFyZW50KCcuZHJvcGRvd24tbWVudScpLmxlbmd0aCkgIHtcbiAgICAgICAgICBhY3RpdmUgPSBhY3RpdmUuY2xvc2VzdCgnbGkuZHJvcGRvd24nKS5hZGRDbGFzcygnYWN0aXZlJylcbiAgICAgICAgfVxuXG4gICAgICAgIGFjdGl2ZS50cmlnZ2VyKCdhY3RpdmF0ZScpXG4gICAgICB9XG5cbiAgfVxuXG5cbiAvKiBTQ1JPTExTUFkgUExVR0lOIERFRklOSVRJT05cbiAgKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cblxuICB2YXIgb2xkID0gJC5mbi5zY3JvbGxzcHlcblxuICAkLmZuLnNjcm9sbHNweSA9IGZ1bmN0aW9uIChvcHRpb24pIHtcbiAgICByZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciAkdGhpcyA9ICQodGhpcylcbiAgICAgICAgLCBkYXRhID0gJHRoaXMuZGF0YSgnc2Nyb2xsc3B5JylcbiAgICAgICAgLCBvcHRpb25zID0gdHlwZW9mIG9wdGlvbiA9PSAnb2JqZWN0JyAmJiBvcHRpb25cbiAgICAgIGlmICghZGF0YSkgJHRoaXMuZGF0YSgnc2Nyb2xsc3B5JywgKGRhdGEgPSBuZXcgU2Nyb2xsU3B5KHRoaXMsIG9wdGlvbnMpKSlcbiAgICAgIGlmICh0eXBlb2Ygb3B0aW9uID09ICdzdHJpbmcnKSBkYXRhW29wdGlvbl0oKVxuICAgIH0pXG4gIH1cblxuICAkLmZuLnNjcm9sbHNweS5Db25zdHJ1Y3RvciA9IFNjcm9sbFNweVxuXG4gICQuZm4uc2Nyb2xsc3B5LmRlZmF1bHRzID0ge1xuICAgIG9mZnNldDogMTBcbiAgfVxuXG5cbiAvKiBTQ1JPTExTUFkgTk8gQ09ORkxJQ1RcbiAgKiA9PT09PT09PT09PT09PT09PT09PT0gKi9cblxuICAkLmZuLnNjcm9sbHNweS5ub0NvbmZsaWN0ID0gZnVuY3Rpb24gKCkge1xuICAgICQuZm4uc2Nyb2xsc3B5ID0gb2xkXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuXG5cbiAvKiBTQ1JPTExTUFkgREFUQS1BUElcbiAgKiA9PT09PT09PT09PT09PT09PT0gKi9cblxuICAkKHdpbmRvdykub24oJ2xvYWQnLCBmdW5jdGlvbiAoKSB7XG4gICAgJCgnW2RhdGEtc3B5PVwic2Nyb2xsXCJdJykuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgJHNweSA9ICQodGhpcylcbiAgICAgICRzcHkuc2Nyb2xsc3B5KCRzcHkuZGF0YSgpKVxuICAgIH0pXG4gIH0pXG5cbn0od2luZG93LmpRdWVyeSk7LyogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqIGJvb3RzdHJhcC10YWIuanMgdjIuMy4xXG4gKiBodHRwOi8vdHdpdHRlci5naXRodWIuY29tL2Jvb3RzdHJhcC9qYXZhc2NyaXB0Lmh0bWwjdGFic1xuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqIENvcHlyaWdodCAyMDEyIFR3aXR0ZXIsIEluYy5cbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG5cblxuIWZ1bmN0aW9uICgkKSB7XG5cbiAgXCJ1c2Ugc3RyaWN0XCI7IC8vIGpzaGludCA7XztcblxuXG4gLyogVEFCIENMQVNTIERFRklOSVRJT05cbiAgKiA9PT09PT09PT09PT09PT09PT09PSAqL1xuXG4gIHZhciBUYWIgPSBmdW5jdGlvbiAoZWxlbWVudCkge1xuICAgIHRoaXMuZWxlbWVudCA9ICQoZWxlbWVudClcbiAgfVxuXG4gIFRhYi5wcm90b3R5cGUgPSB7XG5cbiAgICBjb25zdHJ1Y3RvcjogVGFiXG5cbiAgLCBzaG93OiBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgJHRoaXMgPSB0aGlzLmVsZW1lbnRcbiAgICAgICAgLCAkdWwgPSAkdGhpcy5jbG9zZXN0KCd1bDpub3QoLmRyb3Bkb3duLW1lbnUpJylcbiAgICAgICAgLCBzZWxlY3RvciA9ICR0aGlzLmF0dHIoJ2RhdGEtdGFyZ2V0JylcbiAgICAgICAgLCBwcmV2aW91c1xuICAgICAgICAsICR0YXJnZXRcbiAgICAgICAgLCBlXG5cbiAgICAgIGlmICghc2VsZWN0b3IpIHtcbiAgICAgICAgc2VsZWN0b3IgPSAkdGhpcy5hdHRyKCdocmVmJylcbiAgICAgICAgc2VsZWN0b3IgPSBzZWxlY3RvciAmJiBzZWxlY3Rvci5yZXBsYWNlKC8uKig/PSNbXlxcc10qJCkvLCAnJykgLy9zdHJpcCBmb3IgaWU3XG4gICAgICB9XG5cbiAgICAgIGlmICggJHRoaXMucGFyZW50KCdsaScpLmhhc0NsYXNzKCdhY3RpdmUnKSApIHJldHVyblxuXG4gICAgICBwcmV2aW91cyA9ICR1bC5maW5kKCcuYWN0aXZlOmxhc3QgYScpWzBdXG5cbiAgICAgIGUgPSAkLkV2ZW50KCdzaG93Jywge1xuICAgICAgICByZWxhdGVkVGFyZ2V0OiBwcmV2aW91c1xuICAgICAgfSlcblxuICAgICAgJHRoaXMudHJpZ2dlcihlKVxuXG4gICAgICBpZiAoZS5pc0RlZmF1bHRQcmV2ZW50ZWQoKSkgcmV0dXJuXG5cbiAgICAgICR0YXJnZXQgPSAkKHNlbGVjdG9yKVxuXG4gICAgICB0aGlzLmFjdGl2YXRlKCR0aGlzLnBhcmVudCgnbGknKSwgJHVsKVxuICAgICAgdGhpcy5hY3RpdmF0ZSgkdGFyZ2V0LCAkdGFyZ2V0LnBhcmVudCgpLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICR0aGlzLnRyaWdnZXIoe1xuICAgICAgICAgIHR5cGU6ICdzaG93bidcbiAgICAgICAgLCByZWxhdGVkVGFyZ2V0OiBwcmV2aW91c1xuICAgICAgICB9KVxuICAgICAgfSlcbiAgICB9XG5cbiAgLCBhY3RpdmF0ZTogZnVuY3Rpb24gKCBlbGVtZW50LCBjb250YWluZXIsIGNhbGxiYWNrKSB7XG4gICAgICB2YXIgJGFjdGl2ZSA9IGNvbnRhaW5lci5maW5kKCc+IC5hY3RpdmUnKVxuICAgICAgICAsIHRyYW5zaXRpb24gPSBjYWxsYmFja1xuICAgICAgICAgICAgJiYgJC5zdXBwb3J0LnRyYW5zaXRpb25cbiAgICAgICAgICAgICYmICRhY3RpdmUuaGFzQ2xhc3MoJ2ZhZGUnKVxuXG4gICAgICBmdW5jdGlvbiBuZXh0KCkge1xuICAgICAgICAkYWN0aXZlXG4gICAgICAgICAgLnJlbW92ZUNsYXNzKCdhY3RpdmUnKVxuICAgICAgICAgIC5maW5kKCc+IC5kcm9wZG93bi1tZW51ID4gLmFjdGl2ZScpXG4gICAgICAgICAgLnJlbW92ZUNsYXNzKCdhY3RpdmUnKVxuXG4gICAgICAgIGVsZW1lbnQuYWRkQ2xhc3MoJ2FjdGl2ZScpXG5cbiAgICAgICAgaWYgKHRyYW5zaXRpb24pIHtcbiAgICAgICAgICBlbGVtZW50WzBdLm9mZnNldFdpZHRoIC8vIHJlZmxvdyBmb3IgdHJhbnNpdGlvblxuICAgICAgICAgIGVsZW1lbnQuYWRkQ2xhc3MoJ2luJylcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBlbGVtZW50LnJlbW92ZUNsYXNzKCdmYWRlJylcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICggZWxlbWVudC5wYXJlbnQoJy5kcm9wZG93bi1tZW51JykgKSB7XG4gICAgICAgICAgZWxlbWVudC5jbG9zZXN0KCdsaS5kcm9wZG93bicpLmFkZENsYXNzKCdhY3RpdmUnKVxuICAgICAgICB9XG5cbiAgICAgICAgY2FsbGJhY2sgJiYgY2FsbGJhY2soKVxuICAgICAgfVxuXG4gICAgICB0cmFuc2l0aW9uID9cbiAgICAgICAgJGFjdGl2ZS5vbmUoJC5zdXBwb3J0LnRyYW5zaXRpb24uZW5kLCBuZXh0KSA6XG4gICAgICAgIG5leHQoKVxuXG4gICAgICAkYWN0aXZlLnJlbW92ZUNsYXNzKCdpbicpXG4gICAgfVxuICB9XG5cblxuIC8qIFRBQiBQTFVHSU4gREVGSU5JVElPTlxuICAqID09PT09PT09PT09PT09PT09PT09PSAqL1xuXG4gIHZhciBvbGQgPSAkLmZuLnRhYlxuXG4gICQuZm4udGFiID0gZnVuY3Rpb24gKCBvcHRpb24gKSB7XG4gICAgcmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgJHRoaXMgPSAkKHRoaXMpXG4gICAgICAgICwgZGF0YSA9ICR0aGlzLmRhdGEoJ3RhYicpXG4gICAgICBpZiAoIWRhdGEpICR0aGlzLmRhdGEoJ3RhYicsIChkYXRhID0gbmV3IFRhYih0aGlzKSkpXG4gICAgICBpZiAodHlwZW9mIG9wdGlvbiA9PSAnc3RyaW5nJykgZGF0YVtvcHRpb25dKClcbiAgICB9KVxuICB9XG5cbiAgJC5mbi50YWIuQ29uc3RydWN0b3IgPSBUYWJcblxuXG4gLyogVEFCIE5PIENPTkZMSUNUXG4gICogPT09PT09PT09PT09PT09ICovXG5cbiAgJC5mbi50YWIubm9Db25mbGljdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAkLmZuLnRhYiA9IG9sZFxuICAgIHJldHVybiB0aGlzXG4gIH1cblxuXG4gLyogVEFCIERBVEEtQVBJXG4gICogPT09PT09PT09PT09ICovXG5cbiAgJChkb2N1bWVudCkub24oJ2NsaWNrLnRhYi5kYXRhLWFwaScsICdbZGF0YS10b2dnbGU9XCJ0YWJcIl0sIFtkYXRhLXRvZ2dsZT1cInBpbGxcIl0nLCBmdW5jdGlvbiAoZSkge1xuICAgIGUucHJldmVudERlZmF1bHQoKVxuICAgICQodGhpcykudGFiKCdzaG93JylcbiAgfSlcblxufSh3aW5kb3cualF1ZXJ5KTsvKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKiBib290c3RyYXAtdHlwZWFoZWFkLmpzIHYyLjMuMVxuICogaHR0cDovL3R3aXR0ZXIuZ2l0aHViLmNvbS9ib290c3RyYXAvamF2YXNjcmlwdC5odG1sI3R5cGVhaGVhZFxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICogQ29weXJpZ2h0IDIwMTIgVHdpdHRlciwgSW5jLlxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG5cblxuIWZ1bmN0aW9uKCQpe1xuXG4gIFwidXNlIHN0cmljdFwiOyAvLyBqc2hpbnQgO187XG5cblxuIC8qIFRZUEVBSEVBRCBQVUJMSUMgQ0xBU1MgREVGSU5JVElPTlxuICAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuXG4gIHZhciBUeXBlYWhlYWQgPSBmdW5jdGlvbiAoZWxlbWVudCwgb3B0aW9ucykge1xuICAgIHRoaXMuJGVsZW1lbnQgPSAkKGVsZW1lbnQpXG4gICAgdGhpcy5vcHRpb25zID0gJC5leHRlbmQoe30sICQuZm4udHlwZWFoZWFkLmRlZmF1bHRzLCBvcHRpb25zKVxuICAgIHRoaXMubWF0Y2hlciA9IHRoaXMub3B0aW9ucy5tYXRjaGVyIHx8IHRoaXMubWF0Y2hlclxuICAgIHRoaXMuc29ydGVyID0gdGhpcy5vcHRpb25zLnNvcnRlciB8fCB0aGlzLnNvcnRlclxuICAgIHRoaXMuaGlnaGxpZ2h0ZXIgPSB0aGlzLm9wdGlvbnMuaGlnaGxpZ2h0ZXIgfHwgdGhpcy5oaWdobGlnaHRlclxuICAgIHRoaXMudXBkYXRlciA9IHRoaXMub3B0aW9ucy51cGRhdGVyIHx8IHRoaXMudXBkYXRlclxuICAgIHRoaXMuc291cmNlID0gdGhpcy5vcHRpb25zLnNvdXJjZVxuICAgIHRoaXMuJG1lbnUgPSAkKHRoaXMub3B0aW9ucy5tZW51KVxuICAgIHRoaXMuc2hvd24gPSBmYWxzZVxuICAgIHRoaXMubGlzdGVuKClcbiAgfVxuXG4gIFR5cGVhaGVhZC5wcm90b3R5cGUgPSB7XG5cbiAgICBjb25zdHJ1Y3RvcjogVHlwZWFoZWFkXG5cbiAgLCBzZWxlY3Q6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciB2YWwgPSB0aGlzLiRtZW51LmZpbmQoJy5hY3RpdmUnKS5hdHRyKCdkYXRhLXZhbHVlJylcbiAgICAgIHRoaXMuJGVsZW1lbnRcbiAgICAgICAgLnZhbCh0aGlzLnVwZGF0ZXIodmFsKSlcbiAgICAgICAgLmNoYW5nZSgpXG4gICAgICByZXR1cm4gdGhpcy5oaWRlKClcbiAgICB9XG5cbiAgLCB1cGRhdGVyOiBmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgcmV0dXJuIGl0ZW1cbiAgICB9XG5cbiAgLCBzaG93OiBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgcG9zID0gJC5leHRlbmQoe30sIHRoaXMuJGVsZW1lbnQucG9zaXRpb24oKSwge1xuICAgICAgICBoZWlnaHQ6IHRoaXMuJGVsZW1lbnRbMF0ub2Zmc2V0SGVpZ2h0XG4gICAgICB9KVxuXG4gICAgICB0aGlzLiRtZW51XG4gICAgICAgIC5pbnNlcnRBZnRlcih0aGlzLiRlbGVtZW50KVxuICAgICAgICAuY3NzKHtcbiAgICAgICAgICB0b3A6IHBvcy50b3AgKyBwb3MuaGVpZ2h0XG4gICAgICAgICwgbGVmdDogcG9zLmxlZnRcbiAgICAgICAgfSlcbiAgICAgICAgLnNob3coKVxuXG4gICAgICB0aGlzLnNob3duID0gdHJ1ZVxuICAgICAgcmV0dXJuIHRoaXNcbiAgICB9XG5cbiAgLCBoaWRlOiBmdW5jdGlvbiAoKSB7XG4gICAgICB0aGlzLiRtZW51LmhpZGUoKVxuICAgICAgdGhpcy5zaG93biA9IGZhbHNlXG4gICAgICByZXR1cm4gdGhpc1xuICAgIH1cblxuICAsIGxvb2t1cDogZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICB2YXIgaXRlbXNcblxuICAgICAgdGhpcy5xdWVyeSA9IHRoaXMuJGVsZW1lbnQudmFsKClcblxuICAgICAgaWYgKCF0aGlzLnF1ZXJ5IHx8IHRoaXMucXVlcnkubGVuZ3RoIDwgdGhpcy5vcHRpb25zLm1pbkxlbmd0aCkge1xuICAgICAgICByZXR1cm4gdGhpcy5zaG93biA/IHRoaXMuaGlkZSgpIDogdGhpc1xuICAgICAgfVxuXG4gICAgICBpdGVtcyA9ICQuaXNGdW5jdGlvbih0aGlzLnNvdXJjZSkgPyB0aGlzLnNvdXJjZSh0aGlzLnF1ZXJ5LCAkLnByb3h5KHRoaXMucHJvY2VzcywgdGhpcykpIDogdGhpcy5zb3VyY2VcblxuICAgICAgcmV0dXJuIGl0ZW1zID8gdGhpcy5wcm9jZXNzKGl0ZW1zKSA6IHRoaXNcbiAgICB9XG5cbiAgLCBwcm9jZXNzOiBmdW5jdGlvbiAoaXRlbXMpIHtcbiAgICAgIHZhciB0aGF0ID0gdGhpc1xuXG4gICAgICBpdGVtcyA9ICQuZ3JlcChpdGVtcywgZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgICAgcmV0dXJuIHRoYXQubWF0Y2hlcihpdGVtKVxuICAgICAgfSlcblxuICAgICAgaXRlbXMgPSB0aGlzLnNvcnRlcihpdGVtcylcblxuICAgICAgaWYgKCFpdGVtcy5sZW5ndGgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc2hvd24gPyB0aGlzLmhpZGUoKSA6IHRoaXNcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMucmVuZGVyKGl0ZW1zLnNsaWNlKDAsIHRoaXMub3B0aW9ucy5pdGVtcykpLnNob3coKVxuICAgIH1cblxuICAsIG1hdGNoZXI6IGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICByZXR1cm4gfml0ZW0udG9Mb3dlckNhc2UoKS5pbmRleE9mKHRoaXMucXVlcnkudG9Mb3dlckNhc2UoKSlcbiAgICB9XG5cbiAgLCBzb3J0ZXI6IGZ1bmN0aW9uIChpdGVtcykge1xuICAgICAgdmFyIGJlZ2luc3dpdGggPSBbXVxuICAgICAgICAsIGNhc2VTZW5zaXRpdmUgPSBbXVxuICAgICAgICAsIGNhc2VJbnNlbnNpdGl2ZSA9IFtdXG4gICAgICAgICwgaXRlbVxuXG4gICAgICB3aGlsZSAoaXRlbSA9IGl0ZW1zLnNoaWZ0KCkpIHtcbiAgICAgICAgaWYgKCFpdGVtLnRvTG93ZXJDYXNlKCkuaW5kZXhPZih0aGlzLnF1ZXJ5LnRvTG93ZXJDYXNlKCkpKSBiZWdpbnN3aXRoLnB1c2goaXRlbSlcbiAgICAgICAgZWxzZSBpZiAofml0ZW0uaW5kZXhPZih0aGlzLnF1ZXJ5KSkgY2FzZVNlbnNpdGl2ZS5wdXNoKGl0ZW0pXG4gICAgICAgIGVsc2UgY2FzZUluc2Vuc2l0aXZlLnB1c2goaXRlbSlcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGJlZ2luc3dpdGguY29uY2F0KGNhc2VTZW5zaXRpdmUsIGNhc2VJbnNlbnNpdGl2ZSlcbiAgICB9XG5cbiAgLCBoaWdobGlnaHRlcjogZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgIHZhciBxdWVyeSA9IHRoaXMucXVlcnkucmVwbGFjZSgvW1xcLVxcW1xcXXt9KCkqKz8uLFxcXFxcXF4kfCNcXHNdL2csICdcXFxcJCYnKVxuICAgICAgcmV0dXJuIGl0ZW0ucmVwbGFjZShuZXcgUmVnRXhwKCcoJyArIHF1ZXJ5ICsgJyknLCAnaWcnKSwgZnVuY3Rpb24gKCQxLCBtYXRjaCkge1xuICAgICAgICByZXR1cm4gJzxzdHJvbmc+JyArIG1hdGNoICsgJzwvc3Ryb25nPidcbiAgICAgIH0pXG4gICAgfVxuXG4gICwgcmVuZGVyOiBmdW5jdGlvbiAoaXRlbXMpIHtcbiAgICAgIHZhciB0aGF0ID0gdGhpc1xuXG4gICAgICBpdGVtcyA9ICQoaXRlbXMpLm1hcChmdW5jdGlvbiAoaSwgaXRlbSkge1xuICAgICAgICBpID0gJCh0aGF0Lm9wdGlvbnMuaXRlbSkuYXR0cignZGF0YS12YWx1ZScsIGl0ZW0pXG4gICAgICAgIGkuZmluZCgnYScpLmh0bWwodGhhdC5oaWdobGlnaHRlcihpdGVtKSlcbiAgICAgICAgcmV0dXJuIGlbMF1cbiAgICAgIH0pXG5cbiAgICAgIGl0ZW1zLmZpcnN0KCkuYWRkQ2xhc3MoJ2FjdGl2ZScpXG4gICAgICB0aGlzLiRtZW51Lmh0bWwoaXRlbXMpXG4gICAgICByZXR1cm4gdGhpc1xuICAgIH1cblxuICAsIG5leHQ6IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgdmFyIGFjdGl2ZSA9IHRoaXMuJG1lbnUuZmluZCgnLmFjdGl2ZScpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKVxuICAgICAgICAsIG5leHQgPSBhY3RpdmUubmV4dCgpXG5cbiAgICAgIGlmICghbmV4dC5sZW5ndGgpIHtcbiAgICAgICAgbmV4dCA9ICQodGhpcy4kbWVudS5maW5kKCdsaScpWzBdKVxuICAgICAgfVxuXG4gICAgICBuZXh0LmFkZENsYXNzKCdhY3RpdmUnKVxuICAgIH1cblxuICAsIHByZXY6IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgdmFyIGFjdGl2ZSA9IHRoaXMuJG1lbnUuZmluZCgnLmFjdGl2ZScpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKVxuICAgICAgICAsIHByZXYgPSBhY3RpdmUucHJldigpXG5cbiAgICAgIGlmICghcHJldi5sZW5ndGgpIHtcbiAgICAgICAgcHJldiA9IHRoaXMuJG1lbnUuZmluZCgnbGknKS5sYXN0KClcbiAgICAgIH1cblxuICAgICAgcHJldi5hZGRDbGFzcygnYWN0aXZlJylcbiAgICB9XG5cbiAgLCBsaXN0ZW46IGZ1bmN0aW9uICgpIHtcbiAgICAgIHRoaXMuJGVsZW1lbnRcbiAgICAgICAgLm9uKCdmb2N1cycsICAgICQucHJveHkodGhpcy5mb2N1cywgdGhpcykpXG4gICAgICAgIC5vbignYmx1cicsICAgICAkLnByb3h5KHRoaXMuYmx1ciwgdGhpcykpXG4gICAgICAgIC5vbigna2V5cHJlc3MnLCAkLnByb3h5KHRoaXMua2V5cHJlc3MsIHRoaXMpKVxuICAgICAgICAub24oJ2tleXVwJywgICAgJC5wcm94eSh0aGlzLmtleXVwLCB0aGlzKSlcblxuICAgICAgaWYgKHRoaXMuZXZlbnRTdXBwb3J0ZWQoJ2tleWRvd24nKSkge1xuICAgICAgICB0aGlzLiRlbGVtZW50Lm9uKCdrZXlkb3duJywgJC5wcm94eSh0aGlzLmtleWRvd24sIHRoaXMpKVxuICAgICAgfVxuXG4gICAgICB0aGlzLiRtZW51XG4gICAgICAgIC5vbignY2xpY2snLCAkLnByb3h5KHRoaXMuY2xpY2ssIHRoaXMpKVxuICAgICAgICAub24oJ21vdXNlZW50ZXInLCAnbGknLCAkLnByb3h5KHRoaXMubW91c2VlbnRlciwgdGhpcykpXG4gICAgICAgIC5vbignbW91c2VsZWF2ZScsICdsaScsICQucHJveHkodGhpcy5tb3VzZWxlYXZlLCB0aGlzKSlcbiAgICB9XG5cbiAgLCBldmVudFN1cHBvcnRlZDogZnVuY3Rpb24oZXZlbnROYW1lKSB7XG4gICAgICB2YXIgaXNTdXBwb3J0ZWQgPSBldmVudE5hbWUgaW4gdGhpcy4kZWxlbWVudFxuICAgICAgaWYgKCFpc1N1cHBvcnRlZCkge1xuICAgICAgICB0aGlzLiRlbGVtZW50LnNldEF0dHJpYnV0ZShldmVudE5hbWUsICdyZXR1cm47JylcbiAgICAgICAgaXNTdXBwb3J0ZWQgPSB0eXBlb2YgdGhpcy4kZWxlbWVudFtldmVudE5hbWVdID09PSAnZnVuY3Rpb24nXG4gICAgICB9XG4gICAgICByZXR1cm4gaXNTdXBwb3J0ZWRcbiAgICB9XG5cbiAgLCBtb3ZlOiBmdW5jdGlvbiAoZSkge1xuICAgICAgaWYgKCF0aGlzLnNob3duKSByZXR1cm5cblxuICAgICAgc3dpdGNoKGUua2V5Q29kZSkge1xuICAgICAgICBjYXNlIDk6IC8vIHRhYlxuICAgICAgICBjYXNlIDEzOiAvLyBlbnRlclxuICAgICAgICBjYXNlIDI3OiAvLyBlc2NhcGVcbiAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KClcbiAgICAgICAgICBicmVha1xuXG4gICAgICAgIGNhc2UgMzg6IC8vIHVwIGFycm93XG4gICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICAgICAgdGhpcy5wcmV2KClcbiAgICAgICAgICBicmVha1xuXG4gICAgICAgIGNhc2UgNDA6IC8vIGRvd24gYXJyb3dcbiAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KClcbiAgICAgICAgICB0aGlzLm5leHQoKVxuICAgICAgICAgIGJyZWFrXG4gICAgICB9XG5cbiAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKClcbiAgICB9XG5cbiAgLCBrZXlkb3duOiBmdW5jdGlvbiAoZSkge1xuICAgICAgdGhpcy5zdXBwcmVzc0tleVByZXNzUmVwZWF0ID0gfiQuaW5BcnJheShlLmtleUNvZGUsIFs0MCwzOCw5LDEzLDI3XSlcbiAgICAgIHRoaXMubW92ZShlKVxuICAgIH1cblxuICAsIGtleXByZXNzOiBmdW5jdGlvbiAoZSkge1xuICAgICAgaWYgKHRoaXMuc3VwcHJlc3NLZXlQcmVzc1JlcGVhdCkgcmV0dXJuXG4gICAgICB0aGlzLm1vdmUoZSlcbiAgICB9XG5cbiAgLCBrZXl1cDogZnVuY3Rpb24gKGUpIHtcbiAgICAgIHN3aXRjaChlLmtleUNvZGUpIHtcbiAgICAgICAgY2FzZSA0MDogLy8gZG93biBhcnJvd1xuICAgICAgICBjYXNlIDM4OiAvLyB1cCBhcnJvd1xuICAgICAgICBjYXNlIDE2OiAvLyBzaGlmdFxuICAgICAgICBjYXNlIDE3OiAvLyBjdHJsXG4gICAgICAgIGNhc2UgMTg6IC8vIGFsdFxuICAgICAgICAgIGJyZWFrXG5cbiAgICAgICAgY2FzZSA5OiAvLyB0YWJcbiAgICAgICAgY2FzZSAxMzogLy8gZW50ZXJcbiAgICAgICAgICBpZiAoIXRoaXMuc2hvd24pIHJldHVyblxuICAgICAgICAgIHRoaXMuc2VsZWN0KClcbiAgICAgICAgICBicmVha1xuXG4gICAgICAgIGNhc2UgMjc6IC8vIGVzY2FwZVxuICAgICAgICAgIGlmICghdGhpcy5zaG93bikgcmV0dXJuXG4gICAgICAgICAgdGhpcy5oaWRlKClcbiAgICAgICAgICBicmVha1xuXG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgdGhpcy5sb29rdXAoKVxuICAgICAgfVxuXG4gICAgICBlLnN0b3BQcm9wYWdhdGlvbigpXG4gICAgICBlLnByZXZlbnREZWZhdWx0KClcbiAgfVxuXG4gICwgZm9jdXM6IGZ1bmN0aW9uIChlKSB7XG4gICAgICB0aGlzLmZvY3VzZWQgPSB0cnVlXG4gICAgfVxuXG4gICwgYmx1cjogZnVuY3Rpb24gKGUpIHtcbiAgICAgIHRoaXMuZm9jdXNlZCA9IGZhbHNlXG4gICAgICBpZiAoIXRoaXMubW91c2Vkb3ZlciAmJiB0aGlzLnNob3duKSB0aGlzLmhpZGUoKVxuICAgIH1cblxuICAsIGNsaWNrOiBmdW5jdGlvbiAoZSkge1xuICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKVxuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICB0aGlzLnNlbGVjdCgpXG4gICAgICB0aGlzLiRlbGVtZW50LmZvY3VzKClcbiAgICB9XG5cbiAgLCBtb3VzZWVudGVyOiBmdW5jdGlvbiAoZSkge1xuICAgICAgdGhpcy5tb3VzZWRvdmVyID0gdHJ1ZVxuICAgICAgdGhpcy4kbWVudS5maW5kKCcuYWN0aXZlJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpXG4gICAgICAkKGUuY3VycmVudFRhcmdldCkuYWRkQ2xhc3MoJ2FjdGl2ZScpXG4gICAgfVxuXG4gICwgbW91c2VsZWF2ZTogZnVuY3Rpb24gKGUpIHtcbiAgICAgIHRoaXMubW91c2Vkb3ZlciA9IGZhbHNlXG4gICAgICBpZiAoIXRoaXMuZm9jdXNlZCAmJiB0aGlzLnNob3duKSB0aGlzLmhpZGUoKVxuICAgIH1cblxuICB9XG5cblxuICAvKiBUWVBFQUhFQUQgUExVR0lOIERFRklOSVRJT05cbiAgICogPT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG5cbiAgdmFyIG9sZCA9ICQuZm4udHlwZWFoZWFkXG5cbiAgJC5mbi50eXBlYWhlYWQgPSBmdW5jdGlvbiAob3B0aW9uKSB7XG4gICAgcmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgJHRoaXMgPSAkKHRoaXMpXG4gICAgICAgICwgZGF0YSA9ICR0aGlzLmRhdGEoJ3R5cGVhaGVhZCcpXG4gICAgICAgICwgb3B0aW9ucyA9IHR5cGVvZiBvcHRpb24gPT0gJ29iamVjdCcgJiYgb3B0aW9uXG4gICAgICBpZiAoIWRhdGEpICR0aGlzLmRhdGEoJ3R5cGVhaGVhZCcsIChkYXRhID0gbmV3IFR5cGVhaGVhZCh0aGlzLCBvcHRpb25zKSkpXG4gICAgICBpZiAodHlwZW9mIG9wdGlvbiA9PSAnc3RyaW5nJykgZGF0YVtvcHRpb25dKClcbiAgICB9KVxuICB9XG5cbiAgJC5mbi50eXBlYWhlYWQuZGVmYXVsdHMgPSB7XG4gICAgc291cmNlOiBbXVxuICAsIGl0ZW1zOiA4XG4gICwgbWVudTogJzx1bCBjbGFzcz1cInR5cGVhaGVhZCBkcm9wZG93bi1tZW51XCI+PC91bD4nXG4gICwgaXRlbTogJzxsaT48YSBocmVmPVwiI1wiPjwvYT48L2xpPidcbiAgLCBtaW5MZW5ndGg6IDFcbiAgfVxuXG4gICQuZm4udHlwZWFoZWFkLkNvbnN0cnVjdG9yID0gVHlwZWFoZWFkXG5cblxuIC8qIFRZUEVBSEVBRCBOTyBDT05GTElDVFxuICAqID09PT09PT09PT09PT09PT09PT0gKi9cblxuICAkLmZuLnR5cGVhaGVhZC5ub0NvbmZsaWN0ID0gZnVuY3Rpb24gKCkge1xuICAgICQuZm4udHlwZWFoZWFkID0gb2xkXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuXG5cbiAvKiBUWVBFQUhFQUQgREFUQS1BUElcbiAgKiA9PT09PT09PT09PT09PT09PT0gKi9cblxuICAkKGRvY3VtZW50KS5vbignZm9jdXMudHlwZWFoZWFkLmRhdGEtYXBpJywgJ1tkYXRhLXByb3ZpZGU9XCJ0eXBlYWhlYWRcIl0nLCBmdW5jdGlvbiAoZSkge1xuICAgIHZhciAkdGhpcyA9ICQodGhpcylcbiAgICBpZiAoJHRoaXMuZGF0YSgndHlwZWFoZWFkJykpIHJldHVyblxuICAgICR0aGlzLnR5cGVhaGVhZCgkdGhpcy5kYXRhKCkpXG4gIH0pXG5cbn0od2luZG93LmpRdWVyeSk7XG4vKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKiBib290c3RyYXAtYWZmaXguanMgdjIuMy4xXG4gKiBodHRwOi8vdHdpdHRlci5naXRodWIuY29tL2Jvb3RzdHJhcC9qYXZhc2NyaXB0Lmh0bWwjYWZmaXhcbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqIENvcHlyaWdodCAyMDEyIFR3aXR0ZXIsIEluYy5cbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cblxuXG4hZnVuY3Rpb24gKCQpIHtcblxuICBcInVzZSBzdHJpY3RcIjsgLy8ganNoaW50IDtfO1xuXG5cbiAvKiBBRkZJWCBDTEFTUyBERUZJTklUSU9OXG4gICogPT09PT09PT09PT09PT09PT09PT09PSAqL1xuXG4gIHZhciBBZmZpeCA9IGZ1bmN0aW9uIChlbGVtZW50LCBvcHRpb25zKSB7XG4gICAgdGhpcy5vcHRpb25zID0gJC5leHRlbmQoe30sICQuZm4uYWZmaXguZGVmYXVsdHMsIG9wdGlvbnMpXG4gICAgdGhpcy4kd2luZG93ID0gJCh3aW5kb3cpXG4gICAgICAub24oJ3Njcm9sbC5hZmZpeC5kYXRhLWFwaScsICQucHJveHkodGhpcy5jaGVja1Bvc2l0aW9uLCB0aGlzKSlcbiAgICAgIC5vbignY2xpY2suYWZmaXguZGF0YS1hcGknLCAgJC5wcm94eShmdW5jdGlvbiAoKSB7IHNldFRpbWVvdXQoJC5wcm94eSh0aGlzLmNoZWNrUG9zaXRpb24sIHRoaXMpLCAxKSB9LCB0aGlzKSlcbiAgICB0aGlzLiRlbGVtZW50ID0gJChlbGVtZW50KVxuICAgIHRoaXMuY2hlY2tQb3NpdGlvbigpXG4gIH1cblxuICBBZmZpeC5wcm90b3R5cGUuY2hlY2tQb3NpdGlvbiA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoIXRoaXMuJGVsZW1lbnQuaXMoJzp2aXNpYmxlJykpIHJldHVyblxuXG4gICAgdmFyIHNjcm9sbEhlaWdodCA9ICQoZG9jdW1lbnQpLmhlaWdodCgpXG4gICAgICAsIHNjcm9sbFRvcCA9IHRoaXMuJHdpbmRvdy5zY3JvbGxUb3AoKVxuICAgICAgLCBwb3NpdGlvbiA9IHRoaXMuJGVsZW1lbnQub2Zmc2V0KClcbiAgICAgICwgb2Zmc2V0ID0gdGhpcy5vcHRpb25zLm9mZnNldFxuICAgICAgLCBvZmZzZXRCb3R0b20gPSBvZmZzZXQuYm90dG9tXG4gICAgICAsIG9mZnNldFRvcCA9IG9mZnNldC50b3BcbiAgICAgICwgcmVzZXQgPSAnYWZmaXggYWZmaXgtdG9wIGFmZml4LWJvdHRvbSdcbiAgICAgICwgYWZmaXhcblxuICAgIGlmICh0eXBlb2Ygb2Zmc2V0ICE9ICdvYmplY3QnKSBvZmZzZXRCb3R0b20gPSBvZmZzZXRUb3AgPSBvZmZzZXRcbiAgICBpZiAodHlwZW9mIG9mZnNldFRvcCA9PSAnZnVuY3Rpb24nKSBvZmZzZXRUb3AgPSBvZmZzZXQudG9wKClcbiAgICBpZiAodHlwZW9mIG9mZnNldEJvdHRvbSA9PSAnZnVuY3Rpb24nKSBvZmZzZXRCb3R0b20gPSBvZmZzZXQuYm90dG9tKClcblxuICAgIGFmZml4ID0gdGhpcy51bnBpbiAhPSBudWxsICYmIChzY3JvbGxUb3AgKyB0aGlzLnVucGluIDw9IHBvc2l0aW9uLnRvcCkgP1xuICAgICAgZmFsc2UgICAgOiBvZmZzZXRCb3R0b20gIT0gbnVsbCAmJiAocG9zaXRpb24udG9wICsgdGhpcy4kZWxlbWVudC5oZWlnaHQoKSA+PSBzY3JvbGxIZWlnaHQgLSBvZmZzZXRCb3R0b20pID9cbiAgICAgICdib3R0b20nIDogb2Zmc2V0VG9wICE9IG51bGwgJiYgc2Nyb2xsVG9wIDw9IG9mZnNldFRvcCA/XG4gICAgICAndG9wJyAgICA6IGZhbHNlXG5cbiAgICBpZiAodGhpcy5hZmZpeGVkID09PSBhZmZpeCkgcmV0dXJuXG5cbiAgICB0aGlzLmFmZml4ZWQgPSBhZmZpeFxuICAgIHRoaXMudW5waW4gPSBhZmZpeCA9PSAnYm90dG9tJyA/IHBvc2l0aW9uLnRvcCAtIHNjcm9sbFRvcCA6IG51bGxcblxuICAgIHRoaXMuJGVsZW1lbnQucmVtb3ZlQ2xhc3MocmVzZXQpLmFkZENsYXNzKCdhZmZpeCcgKyAoYWZmaXggPyAnLScgKyBhZmZpeCA6ICcnKSlcbiAgfVxuXG5cbiAvKiBBRkZJWCBQTFVHSU4gREVGSU5JVElPTlxuICAqID09PT09PT09PT09PT09PT09PT09PT09ICovXG5cbiAgdmFyIG9sZCA9ICQuZm4uYWZmaXhcblxuICAkLmZuLmFmZml4ID0gZnVuY3Rpb24gKG9wdGlvbikge1xuICAgIHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgdmFyICR0aGlzID0gJCh0aGlzKVxuICAgICAgICAsIGRhdGEgPSAkdGhpcy5kYXRhKCdhZmZpeCcpXG4gICAgICAgICwgb3B0aW9ucyA9IHR5cGVvZiBvcHRpb24gPT0gJ29iamVjdCcgJiYgb3B0aW9uXG4gICAgICBpZiAoIWRhdGEpICR0aGlzLmRhdGEoJ2FmZml4JywgKGRhdGEgPSBuZXcgQWZmaXgodGhpcywgb3B0aW9ucykpKVxuICAgICAgaWYgKHR5cGVvZiBvcHRpb24gPT0gJ3N0cmluZycpIGRhdGFbb3B0aW9uXSgpXG4gICAgfSlcbiAgfVxuXG4gICQuZm4uYWZmaXguQ29uc3RydWN0b3IgPSBBZmZpeFxuXG4gICQuZm4uYWZmaXguZGVmYXVsdHMgPSB7XG4gICAgb2Zmc2V0OiAwXG4gIH1cblxuXG4gLyogQUZGSVggTk8gQ09ORkxJQ1RcbiAgKiA9PT09PT09PT09PT09PT09PSAqL1xuXG4gICQuZm4uYWZmaXgubm9Db25mbGljdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAkLmZuLmFmZml4ID0gb2xkXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuXG5cbiAvKiBBRkZJWCBEQVRBLUFQSVxuICAqID09PT09PT09PT09PT09ICovXG5cbiAgJCh3aW5kb3cpLm9uKCdsb2FkJywgZnVuY3Rpb24gKCkge1xuICAgICQoJ1tkYXRhLXNweT1cImFmZml4XCJdJykuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgJHNweSA9ICQodGhpcylcbiAgICAgICAgLCBkYXRhID0gJHNweS5kYXRhKClcblxuICAgICAgZGF0YS5vZmZzZXQgPSBkYXRhLm9mZnNldCB8fCB7fVxuXG4gICAgICBkYXRhLm9mZnNldEJvdHRvbSAmJiAoZGF0YS5vZmZzZXQuYm90dG9tID0gZGF0YS5vZmZzZXRCb3R0b20pXG4gICAgICBkYXRhLm9mZnNldFRvcCAmJiAoZGF0YS5vZmZzZXQudG9wID0gZGF0YS5vZmZzZXRUb3ApXG5cbiAgICAgICRzcHkuYWZmaXgoZGF0YSlcbiAgICB9KVxuICB9KVxuXG5cbn0od2luZG93LmpRdWVyeSk7c2VsZi5fMzg2ID0gc2VsZi5fMzg2IHx8IHt9O1xuXG4kKGZ1bmN0aW9uKCl7XG4gIHZhciBjaGFyYWN0ZXIgPSB7IGhlaWdodDogMjAsIHdpZHRoOiAxMi40IH07XG5cbiAgZnVuY3Rpb24gc2Nyb2xsTG9jaygpIHtcbiAgICB2YXIgbGFzdCA9IDA7XG4gICAgJCh3aW5kb3cpLmJpbmQoJ3Njcm9sbCcsIGZ1bmN0aW9uKGUpIHtcbiAgICAgIHZhciBmdW5jLCBvZmYgPSAkKHdpbmRvdykuc2Nyb2xsVG9wKCk7XG5cbiAgICAgIGNvbnNvbGUubG9nKG9mZiwgbGFzdCwgb2ZmIDwgbGFzdCA/IFwidXBcIiA6IFwiZG93blwiKTtcblxuICAgICAgLy8gdGhpcyBkZXRlcm1pbmVzIHdoZXRoZXIgdGhlIHVzZXIgaXMgaW50ZW5kaW5nIHRvIGdvIHVwIG9yIGRvd24uXG4gICAgICBmdW5jID0gb2ZmIDwgbGFzdCA/IFwiZmxvb3JcIiA6IFwiY2VpbFwiO1xuXG4gICAgICAvLyBtYWtlIHN1cmUgd2UgZG9uJ3QgcnVuIHRoaXMgZnJvbSBvdXJzZWx2ZXNcbiAgICAgIGlmKG9mZiAlIGNoYXJhY3Rlci5oZWlnaHQgPT09IDApIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgbGFzdCA9IG9mZjtcblxuICAgICAgd2luZG93LnNjcm9sbFRvKFxuICAgICAgICAwLFxuICAgICAgICBNYXRoW2Z1bmNdKG9mZiAvIGNoYXJhY3Rlci5oZWlnaHQpICogY2hhcmFjdGVyLmhlaWdodFxuICAgICAgKTtcblxuICAgIH0pOyBcbiAgfSAgXG5cbiAgZnVuY3Rpb24gbG9hZGluZygpIHtcblxuICAgIGlmKF8zODYuZmFzdExvYWQpIHtcbiAgICAgIGRvY3VtZW50LmJvZHkuc3R5bGUudmlzaWJpbGl0eT0ndmlzaWJsZSc7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdmFyXG4gICAgICBvbmVQYXNzID0gXzM4Ni5vbmVQYXNzLFxuICAgICAgc3BlZWRGYWN0b3IgPSAxIC8gKF8zODYuc3BlZWRGYWN0b3IgfHwgMSkgKiAxNjUwMDA7XG4gICAgICB3cmFwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JyksXG4gICAgICBiYXIgPSB3cmFwLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpKSxcblxuICAgICAgY3Vyc29yID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JyksXG4gICAgICAvLyBJZiB0aGUgdXNlciBzcGVjaWZpZWQgdGhhdCB0aGUgdmlzaWJpbGl0eSBpcyBoaWRkZW4sIHRoZW4gd2VcbiAgICAgIC8vIHN0YXJ0IGF0IHRoZSBmaXJzdCBwYXNzIC4uLiBvdGhlcndpc2Ugd2UganVzdCBkbyB0aGUgXG4gICAgICAvLyBjdXJzb3IgZmx5LWJ5XG4gICAgICBwYXNzID0gKCQoZG9jdW1lbnQuYm9keSkuY3NzKCd2aXNpYmlsaXR5JykgPT0gJ3Zpc2libGUnKSA/IDEgOiAwLFxuICAgICAgaGVpZ2h0ID0gJCh3aW5kb3cpLmhlaWdodCgpLFxuICAgICAgd2lkdGggPSAkKHdpbmRvdykud2lkdGgoKSxcblxuICAgICAgLy8gdGhpcyBtYWtlcyB0aGUgbG9hZGluZyBvZiB0aGUgc2NyZWVuIHByb3BvcnRpb25hbCB0byB0aGUgcmVhbC1lc3RhdGUgb2YgdGhlIHdpbmRvdy5cbiAgICAgIC8vIGl0IGhlbHBzIGtlZXAgdGhlIGNvb2wgc2VxdWVuY2UgdGhlcmUgd2hpbGUgbm90IG1ha2luZyBpdCB3YXN0ZSB0b28gbXVjaCB0aW1lLlxuICAgICAgcm91bmRzID0gKGhlaWdodCAqIHdpZHRoIC8gc3BlZWRGYWN0b3IpLFxuICAgICAgY29sdW1uID0gd2lkdGgsIHJvdyA9IGhlaWdodCAtIGNoYXJhY3Rlci5oZWlnaHQ7XG4gICAgICBcbiAgICB3cmFwLmlkID0gXCJ3cmFwMzg2XCI7XG4gICAgYmFyLmlkID0gXCJiYXIzODZcIjtcbiAgICBjdXJzb3IuaWQgPSBcImN1cnNvcjM4NlwiO1xuXG4gICAgY3Vyc29yLmlubmVySFRNTCA9IGJhci5pbm5lckhUTUwgPSAnJiM5NjA0Oyc7XG5cbiAgICAvLyBvbmx5IGluamVjdCB0aGUgd3JhcCBpZiB0aGUgcGFzcyBpcyAwXG4gICAgaWYocGFzcyA9PT0gMCkge1xuICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh3cmFwKTtcbiAgICAgIGRvY3VtZW50LmJvZHkuc3R5bGUudmlzaWJpbGl0eT0ndmlzaWJsZSc7XG4gICAgfSBlbHNlIHtcbiAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoY3Vyc29yKTtcbiAgICAgIHJvdW5kcyAvPSAyO1xuICAgICAgY2hhcmFjdGVyLmhlaWdodCAqPSA0O1xuICAgIH1cblxuICAgIHZhciBpdmFsID0gc2V0SW50ZXJ2YWwoZnVuY3Rpb24oKXtcbiAgICAgIGZvcih2YXIgbSA9IDA7IG0gPCByb3VuZHM7IG0rKykge1xuICAgICAgICBjb2x1bW4gLT0gY2hhcmFjdGVyLndpZHRoO1xuXG4gICAgICAgIGlmKGNvbHVtbiA8PSAwKSB7XG4gICAgICAgICAgY29sdW1uID0gd2lkdGg7XG4gICAgICAgICAgcm93IC09IGNoYXJhY3Rlci5oZWlnaHQ7XG4gICAgICAgIH1cbiAgICAgICAgaWYocm93IDw9IDApIHtcbiAgICAgICAgICBwYXNzKys7XG4gICAgICAgICAgcm93ID0gaGVpZ2h0IC0gY2hhcmFjdGVyLmhlaWdodDtcblxuICAgICAgICAgIGlmKHBhc3MgPT0gMikge1xuICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZChjdXJzb3IpO1xuICAgICAgICAgICAgY2xlYXJJbnRlcnZhbChpdmFsKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgd3JhcC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHdyYXApO1xuICAgICAgICAgICAgaWYob25lUGFzcykge1xuICAgICAgICAgICAgICBjbGVhckludGVydmFsKGl2YWwpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChjdXJzb3IpO1xuICAgICAgICAgICAgICByb3VuZHMgLz0gMjtcbiAgICAgICAgICAgICAgY2hhcmFjdGVyLmhlaWdodCAqPSA0O1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmKHBhc3MgPT09IDApIHtcbiAgICAgICAgICBiYXIuc3R5bGUud2lkdGggPSBjb2x1bW4gKyBcInB4XCI7XG4gICAgICAgICAgd3JhcC5zdHlsZS5oZWlnaHQgPSByb3cgKyBcInB4XCI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY3Vyc29yLnN0eWxlLnJpZ2h0ID0gY29sdW1uICsgXCJweFwiO1xuICAgICAgICAgIGN1cnNvci5zdHlsZS5ib3R0b20gPSByb3cgKyBcInB4XCI7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LCAxKTtcbiAgfVxuICBsb2FkaW5nKCk7XG59KTtcblxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2Fzc2V0cy9qYXZhc2NyaXB0cy9ib290c3RyYXAuanMiXSwic291cmNlUm9vdCI6IiJ9