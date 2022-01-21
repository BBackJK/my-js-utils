(function(global, factory) {
  if (typeof module === "object" && typeof module.exports === "object") {
    // node 환경 모듈 정의 (Browser 환경 X)
  } else {
    factory(global);
  }

})(typeof window !== "undefined" ? window : this, function (window) {
  var JK_DOM_UTILS = function(selector) {
    let instance = new JK_DOM_UTILS.prototype.init(selector);
    if (!instance.$el) {
      return undefined;
    } 
    return instance;
  };

  JK_DOM_UTILS.prototype = {
    constructor: JK_DOM_UTILS,
    length: 0,
  };

  JK_DOM_UTILS.fn = JK_DOM_UTILS.prototype;

  var init = JK_DOM_UTILS.fn.init = function(selector) {
    return find(this, selector);
  };

  init.fn = init.prototype;

  init.fn.find = function(selector) {
    return find(this, selector);
  };

  init.fn.gets = function() {
    return this.$el;
  };

  init.fn.addClass = function(className) {
    if (this.$el.length) {
      for (let i=0,l=this.$el.length;i<l;i++) {
        let $el = this.$el[i];
        $el.classList.add(className);
      }
    } else {
      this.$el.classList.add(className);
    }
  };

  init.fn.removeClass = function(className) {
    if (this.$el.length) {
      for (let i=0,l=this.$el.length;i<l;i++) {
        let $el = this.$el[i];
        $el.classList.remove(className);
      }
    } else {
      this.$el.classList.remove(className);
    }
  };

  init.fn.toggleClass = function(className) {
    if (this.$el.length) {
      for (let i=0,l=this.$el.length;i<l;i++) {
        let $el = this.$el[i];
        
        if ($el.classList.contains(className)) {
          $el.classList.remove(className);
        } else {
          $el.classList.add(className);
        }
      }
    } else {
      if (this.$el.classList.contains(className)) {
        this.$el.classList.remove(className);
      } else {
        this.$el.classList.add(className);
      }
    }
  };

  init.fn.addEvent = function(action, callback) {
    return this.$el.addEventListener(action, callback);
  };

  init.fn.findParentByClass = function(className, $element) {

    if (!$element) $element = this.$el;

    if ($element.nodeName === 'HTML') {
      console.warn(' all elements has class name [ ', className , ' ]');
      return null;
    }

    if ($element.classList.contains(className)) {
      return $element;
    }

    return this.findParentByClass(className, $element.parentElement);
  };

  init.fn.findParentById = function(id, $element) {
    if (!$element) $element = this.$el;

    if ($element.nodeName === 'HTML') {
      console.warn(' all elements has id [ ', id , ' ]');
      return null;
    }

    if ($element.id === id) {
      return $element;
    }

    return this.findParentById(id, $element.parentElement);
  };

  init.fn.findParentByName = function(name, $element) {
    if (!$element) $element = this.$el;

    if ($element.nodeName === 'HTML') {
      console.warn(' all elements has name attribute [ "', name , '" ]');
      return null;
    }

    if ($element.getAttribute('name') === name) {
      return $element;
    }

    return this.findParentByName(name, $element.parentElement);
  };

  var find = function(_context, selector) {
    if (!selector) {
      return _context;
    }

    if (!_context.$el) _context.$el = document;

    _context.$prevEl = [];
    if (_context.$el !== document) {
      _context.$prevEl.push(_context.$el);
    }

    if (selector.startsWith('#')) {
      _context.$el = _context.$el.querySelector(selector);
    } else {
      _context.$el = _context.$el.querySelectorAll(selector);
    }

    if (!_context.$el) {
      console.warn(' current document has no selector ');
      return undefined;
    } else {
      return _context;
    }
  };

  window.JDU = window.$JDU = JK_DOM_UTILS;

  return JDU;
});