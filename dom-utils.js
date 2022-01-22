(function(global, factory) {
  if (typeof module === "object" && typeof module.exports === "object") {
    // node 환경 모듈 정의 (Browser 환경 X)
    // 추후에.. module 작업 정의..
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

  var origin = JK_DOM_UTILS.fn = JK_DOM_UTILS.prototype;

  var init = JK_DOM_UTILS.fn.init = function(selector) {
    return find(this, selector);
  };

  init.fn = init.prototype;

  init.fn.find = function(selector) {
    return find(this, selector);
  };

  /**
   * 마지막으로 조회한 현재 HTMLelement 을 가져온다.
   * @returns 
   */
  init.fn.getEl = function() {
    if (this.$el.length > 1) {
      return this.$el;
    } else {
      return this.$el[0];
    }
  };

  /**
   * 이전 까지 조회한 NodeList를 가져온다.
   * @returns 
   */
  init.fn.getPrevEl = function() {
    return this.$prevEl;
  }

  /**
   * class 추가
   * @param {*} className 
   */
  init.fn.addClass = function(className) {
    for (let i=0,l=this.$el.length;i<l;i++) {
      let $el = this.$el[i];
      $el.classList.add(className);
    }
  };

  /**
   * class 삭제
   * @param {*} className 
   */
  init.fn.removeClass = function(className) {
    for (let i=0,l=this.$el.length;i<l;i++) {
      let $el = this.$el[i];
      $el.classList.remove(className);
    }
  };

  /**
   * class 토글
   * @param {*} className 
   */
  init.fn.toggleClass = function(className) {
    for (let i=0,l=this.$el.length;i<l;i++) {
      let $el = this.$el[i];
      
      if ($el.classList.contains(className)) {
        $el.classList.remove(className);
      } else {
        $el.classList.add(className);
      }
    }
  };

  /**
   * addEventListener
   * @param {*} action 
   * @param {*} callback 
   * @returns 
   */
  init.fn.addEvent = function(action, callback) {
    return this.$el.forEach(function(el) {
      return el.addEventListener(action, callback);
    });
  };

  /**
   * 현재 element 위치에서 해당 classname을 가진 첫 번째 부모를 찾기, 없을 경우 null 반환
   * @param {*} className 
   * @param {*} $element 
   * @returns 
   */
  init.fn.findParentByClass = function(className, $element) {
    if (!$element) $element = this.$el[0];

    if ($element.nodeName === 'HTML') {
      console.warn(' all elements has class name [ ', className , ' ]');
      return null;
    }

    if ($element.classList.contains(className)) {
      return $element;
    }

    return this.findParentByClass(className, $element.parentElement);
  };

  /**
   * 현재 element 위치에서 해당 id를 가진 부모 찾기, 없을 경우 null 반환
   * @param {*} id 
   * @param {*} $element 
   * @returns 
   */
  init.fn.findParentById = function(id, $element) {
    if (!$element) $element = this.$el[0];

    if ($element.nodeName === 'HTML') {
      console.warn(' all elements has id [ ', id , ' ]');
      return null;
    }

    if ($element.id === id) {
      return $element;
    }

    return this.findParentById(id, $element.parentElement);
  };

  /**
   * 현재 element 위치에서 해당 name을 가진 첫 번째 부모 찾기, 없을 경우 null 반환
   * @param {*} name 
   * @param {*} $element 
   * @returns 
   */
  init.fn.findParentByName = function(name, $element) {
    if (!$element) $element = this.$el[0];

    if ($element.nodeName === 'HTML') {
      console.warn(' all elements has name attribute [ "', name , '" ]');
      return null;
    }

    if ($element.getAttribute('name') === name) {
      return $element;
    }

    return this.findParentByName(name, $element.parentElement);
  };

  var find = function(_context_, selector) {
    if (!selector) {
      return _context_;
    }

    // $el이 없으면 document로 초기화
    if (!_context_.$el) _context_.$el = document;

    // 이전 단계의 Element 배열 초기화
    _context_.$prevEl = [];
    // 현재 검색 임시 저장 배열 초기화
    var tempArr = [];

    if (_context_.$el !== document) {
      // $el이 document가 아니라면 (== 검색하고 난 후 검색 이라면..)
      // 이전 단계의 Element 배열에 넣는다.
      if (_context_.$el.length > 1) {
        _context_.$prevEl = _context_.$el;  
      } else {
        _context_.$prevEl.push(_context_.$el[0]);
      }
    }

    if (_context_.$el.length) {
      for (let i=0, l=_context_.$el.length;i<l;i++) {
        let $element = _context_.$el[i];

        let selectNodeList = $element.querySelectorAll(selector);

        if (!selectNodeList.length) {
          console.warn(' current document has no selector ');
          return undefined;
        }

        if (selectNodeList.length > 1) {
          tempArr = Array.prototype.slice.call(selectNodeList);
        } else {
          tempArr.push(selectNodeList[0]);
        }
      }
    } else {
      _context_.$el = Array.prototype.slice.call(_context_.$el.querySelectorAll(selector)); 
    }

    if (tempArr.length) {
      _context_.$el = tempArr;
    }

    if (!_context_.$el) {
      console.warn(' current document has no selector ');
      return undefined;
    } else {
      return _context_;
    }
  };


  /**
   * @Description 페이지가 로드될 때까지 기다렸다가 해당 attritube 찾기
   * @Attributes onlyNumber(숫자만) / formatCost(숫자 && comma)
   */
  document.addEventListener("DOMContentLoaded", function() {
    let onlyNumInputList = Array.prototype.slice.call(document.querySelectorAll('[onlyNumber]'));
    
    for (let i=0, l=onlyNumInputList.length; i<l; i++) {
      let onlyNumEl = onlyNumInputList[i];
      if (onlyNumEl.nodeName === 'INPUT') {    // input 일 때에만 체크
        onlyNumEl.addEventListener('input', function() {
          this.value = uncomma(this.value);
        })
      }
    }

    let formatCostList = Array.prototype.slice.call(document.querySelectorAll('[formatCost]'));
  
    for (let i=0, l=formatCostList.length; i<l; i++) {
      let formatCostEl = formatCostList[i];
      if (formatCostEl.nodeName === 'INPUT') {    // input 일 때에만 체크
        formatCostEl.addEventListener('input', function() {
          this.value = comma(uncomma(this.value));
        })
      }
    }

  });

  var comma = function(str) {
    str = String(str);
    return str.replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,');
  }

  var uncomma = function(str) {
    str = String(str);
    return str.replace(/[^\d]+/g, '');
  }

  window.JDU = window.$JDU = JK_DOM_UTILS;

  return JDU;
});