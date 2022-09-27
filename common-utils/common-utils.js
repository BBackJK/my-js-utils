(function(global, factory) {
  if (typeof module === "object" && typeof module.exports === "object") {
    // node 환경 모듈 정의 (Browser 환경 X)
  } else {
    factory(global);
  }

})(typeof window !== "undefined" ? window : this, function (window) {

  var JK_COMMON_UTILS = function() {
  };

  const checkType = function(val, type) {
    return getValueType(val) === type;
  };

  const getValueType = function (value) {
    return Object.prototype.toString.call(value).slice(8, -1);
  };

  var fn = JK_COMMON_UTILS.fn = JK_COMMON_UTILS.prototype;

  /** ========================================================
                          공통 util
    ======================================================== */

  /**
   * 깊은 복사
   * @param {*} data 
   * @returns 
   */
  fn.deepCopy = function(data) {
    let _ = {};
    let $this = this;

      if (Array.isArray(data)) {            // 배열 체크
        _ = data.slice().map(function(v) {
          return $this.deepCopy(v);
        })
      } else if (data !== null && typeof data === 'object') {   // 객체 체크
        for (let attr in data) {
          if (data.hasOwnProperty(attr)) {
            _[attr] = $this.deepCopy(data[attr]);
          }
        }
      } else {      // 원시값 체크
        _ = data;
      }

      return _;
  };

  fn.isNullOrEmpty = function(v) {
    
    if (this.isNull(v)) {
      return true;
    }

    if (this.isString(v)) {
      return v === '';
    }

    if (this.isElement(v)) {
      return this.isNull(v);
    } 

    if (this.isObject(v)) {
      return !Object.keys(v).length;
    }

    if (this.isArray(v)) {
      return !v.length;
    }

    return false;
  };

  fn.isString = function(v) {
    return checkType(v, 'String');
  };

  fn.isNumber = function(v) {
    return checkType(v, 'Number');
  };

  fn.isObject = function(v) {
    return checkType(v, 'Object');
    // return !this.isNull(v) && checkType(v, 'object') && Object.prototype.toString.call(v) === '[object Object]';
  };

  fn.isBoolean = function (v) {
    return checkType(v, 'Boolean');
  }

  fn.isArray = Array.isArray;

  fn.isUndefined = function(v) {
    return checkType(v, 'Undefined');
  };

  fn.isNull = function(v) {
    return checkType(v, 'Null');
  };

  fn.isFunction = function (v) {
    return checkType(v, 'Function');
  };

  fn.isElement = function (v) {
    try {
      return v instanceof HTMLElement;
    } catch (err) {
      return this.isObject(v) &&
              v.nodeType === 1 &&
              this.isObject(v.style) &&
              this.isObject(v.ownerDocument);
    }
  };

  fn.isNodeList = function (v) {
    return v instanceof NodeList;
  };

  fn.isEvent = function (v) {
    return v instanceof Event;
  };

  fn.isDate = function (v) {
    return checkType(v, 'Date') && !isNaN(v);
  };

  /**
   * String s 가 String v를 가지고 있는지 확인.
   * @param {string} s 
   * @param {string} v
   */
  fn.hasText = function (s, v) {
    return this.isString(s) && this.isString(v) && s.indexOf(v) > -1;
  };


  /**
   * null이 아닌 값을 string 형태로 변경하여 숫자만 남기고, 3자리 마다 콤마(,)를 찍는다
   * @param {any} v value
   */
  fn.onlyNumberComma = function (v) {
    if (!v) {
      return '';
    }
    return v.toString().replace(/^0+|\D+/g, '')
                      .replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,');
  };
  
  /**
   * null 이 아닌 값을 string 형태로 변경하여 숫자만 남긴다.
   * @param {any} v value
   */
  fn.onlyNumber = function (v) {
    if (!v) {
      return '';
    }
    return v.toString().replace(/[^0-9.]/g, '')
                      .replace(/(\..*)\./g, '$1');
  };
  
  /**
   * null 과 undefined가 아닌 값을 c 만큼 앞에 0으로 채워넣는다.
   * @param {any} s     입력값1
   * @param {number} c  0으로 채울 수
   */
  fn.zPad = function (s, c) {
    if (this.isNull(s) || this.isUndefined(s)) {
      return s;
    }

    v = s.toString();
    c = this.isNumber(c) ? c : 0;
    
    const zeroLength = c - v.length;

    let r = '',
        i = 0;

    if (zeroLength > 0) {
      while (i++ < zeroLength) {
        r+='0';
      }
    }

    return r.concat(v);
  };

  /** ========================================================
                        array 관련 util
    ======================================================== */

  fn.$array = {
    /**
     * Array arr 가 value 를 가지고 있는지 확인.
     * @param {array} arr
     * @param {any} value
     */
    hasItem: function (arr, value) {
      const $root = fn;
      return $root.isArray(arr) && arr.indexOf(value) > -1;
    },
    /**
     * Array arr 의 마지막 요소 가져오기.
     * @param {array} arr
     */
    getLastItem: function (arr) {
      const $root = fn;
      if ($root.isArray(arr) || arr.length < 1) {
        return null;
      }

      return arr[arr.length - 1];
    },
    /**
     * object로 이루어진 array에서 object의 id 가 idValue 에 해당하는 item을 가져온다.
     * @param {array} arr array
     * @param {string|number} idValue key
     */
    findItemById: function (arr, idValue) {
      const $root = fn;
      if (!$root.isArray(arr)) {
        throw new Error('first argument type is not array');
      }

      if (!$root.isString(idValue) && !$root.isNumber(idValue)) {
        throw new Error('second argument type is only string or number');
      }

      return this.findItem(arr, 'id', idValue);
    },
    /**
     * object로 이루어진 array arr에서 object의 key property 의 value 값이 argument value와 일치하는 첫번째 데이터를 get 
     * @param {array} arr   배열
     * @param {string} key  object key property
     * @param {any} value  key property의 value와 비교할 value
     */
    findItem: function (arr, key, value) {
      const $root = fn;
      if (!$root.isArray(arr)) {
        throw new Error('first argument type is not array');
      }

      let r = null,
          i = 0,
          l = arr.length;
      
      for (i; i < l; i++) {
        const item = arr[i];

        if ($root.isObject(item) && item.hasOwnProperty(key) && item[key] === value) {
          r = item;
          break;
        }
      }

      return r;
    },
    /**
     * object로 이루어진 array arr에서 object의 id가 idValue 에 해당하는 item의 index를 가져온다.
     * @param {array} arr
     * @param {string|number} idValue 
     */
    findIndexById: function (arr, idValue) {
      const $root = fn;

      if (!$root.isArray(arr)) {
        throw new Error('[a] is not array');
      }
  
      if (!$root.isString(idValue) && !$root.isNumber(idValue)) {
        throw new Error('[id] type is only string or number');
      }
  
      return this.findIndex(arr, 'id', idValue);
    },
    /**
     * object로 이루어진 array arr에서 object의 key property 의 value 값이 argument value와 일치하는 첫번째 데이터의 index를 get 
     * @param {array} arr   배열
     * @param {string} key  object key property
     * @param {any} vvalue  key property의 value와 비교할 value
     */
    findIndex: function (arr, key, value) {
      const $root = fn;
      if (!$root.isArray(arr)) {
        throw new Error(' 첫번째 인자의 타입이 array 가 아닙니다. ');
      }
  
      let r = -1,         // 반환될 index
          i = 0,          // for 문의 i
          l = arr.length;   // for 문의 max length
  
      for (i; i < l; i++) {
        const item = arr[i];
  
        if ($root.isObject(item) && item.hasOwnProperty(key) && item[key] === value) {
          r = i;
          break;
        }
      }
  
      return r;
    },
    /**
     * object로 이루어진 array arr에서 id 값으로 새로운 array 반환.
     * @param {array} arr
     */
    makeIdList: function (arr) {
      const $root = fn;
      if (!$root.isArray(arr)) {
        return [];
      }

      return arr.map(function (item) {
        if (!$root.isObject(item) || item.hasOwnProperty('id')) {
          throw new Error(' array 가 object로 이루어져 있지 않거나 id property가 존재하지 않습니다. ');
        }

        return item.id;
      });
    },
    /**
     * startNumber 부터 endNumber 까지 숫자를 나열한다.
     * @param {number} startSequence 
     * @param {number} endSequence 
     */
    makeSeqList: function (startNumber, endNumber) {
      const $root = fn;
      if (!$root.isNumber(startNumber) || !$root.isNumber(endNumber)) {
        throw new Error(' two and third argument type is not number.');
      }

      let result = [];

      for (startNumber; startNumber <= endNumber; startNumber++) {
        result.push(startNumber);
      }

      return result;
    },
  };

  /**
   * Array a 가 v 를 가지고 있는지 확인.
   * @param {array} a 
   * @param {any} v 
   */
  fn.hasArrayItem = function (a, v) {
    return this.isArray(a) && a.indexOf(v) > -1;
  };

  /**
   * Array a 의 마지막 요소 가져오기.
   * @param {array} a 
   */
  fn.getArrayLastItem = function (a) {
    if (!this.isArray(a) || a.length < 1) {
      return null;
    }

    return a[a.length - 1];
  };

  /**
   * object로 이루어진 array에서 object의 id 가 argument id 에 해당하는 item을 가져온다.
   * @param {array} a array
   * @param {string|number} id key
   */
  fn.getArrayItemById = function (a, id) {

    if (!this.isArray(a)) {
      throw new Error('[a] is not array');
    }

    if (!this.isString(id) && !this.isNumber(id)) {
      throw new Error('[id] type is only string or number');
    }

    return this.getArrayItem(a, 'id', id);
  };

  /**
   * object로 이루어진 a에서 object의 k property 의 value 값이 v와 일치하는 첫번째 데이터를 get 
   * @param {array} a   배열
   * @param {string} k  object key property
   * @param {any} v     key property의 value와 비교할 value
   */
  fn.getArrayItem = function (a, k, v) {
    if (!this.isArray(a)) {
      throw new Error('[a] is not array');
    }

    let r = null,
        i = 0,
        l = a.length;

    for (i; i < l; i++) {
      const item = a[i];

      if (this.isObject(item) && item.hasOwnProperty(k) && item[k] === v) {
        r = item;
        break;
      }
    }

    return r;
  };

  /**
   * object로 이루어진 array에서 object의 id가 argument id 에 해당하는 item의 index를 가져온다.
   * @param {array} a
   * @param {string|number} id 
   */
  fn.getArrayIndexById = function (a, id) {
    if (!this.isArray(a)) {
      throw new Error('[a] is not array');
    }

    if (!this.isString(id) && !this.isNumber(id)) {
      throw new Error('[id] type is only string or number');
    }

    return this.getArrayIndex(a, 'id', id);
  };

  /**
   * object로 이루어진 a에서 object의 k property 의 value 값이 v와 일치하는 첫번째 데이터의 index를 get 
   * @param {array} a   배열
   * @param {string} k  object key property
   * @param {any} v     key property의 value와 비교할 value
   */
  fn.getArrayIndex = function (a, k, v) {
    if (!this.isArray(a)) {
      throw new Error(' 첫번째 인자의 타입이 array 가 아닙니다. ');
    }

    let r = -1,         // 반환될 index
        i = 0,          // for 문의 i
        l = a.length;   // for 문의 max length

    for (i; i < l; i++) {
      const item = a[i];

      if (this.isObject(item) && item.hasOwnProperty(k) && item[k] === v) {
        r = i;
        break;
      }
    }

    return r;
  };

  /**
   * object로 이루어진 array에서 id 값으로 새로운 array 반환.
   * @param {array} a 
   */
  fn.makeArrayIdList = function (a) {
    if (!this.isArray(a)) {
      return [];
    }

    return a.map(function (i) {
      if (!this.isObject(i) || i.hasOwnProperty('id')) {
        throw new Error(' array 가 object로 이루어져있지 않거나 id property 가 존재하지않습니다. ');
      }

      return i.id;
    });
  };

  /**
   * startSequence 부터 endSequence 까지 숫자를 나열한다.
   * @param {number} startSequence 
   * @param {number} endSequence 
   */
  fn.makeArraySeqList = function (startSequence, endSequence) {
    if (!this.isNumber(startSequence) || !this.isNumber(endSequence)) {
      console.error(' 2, 3 번째 인자 타입이 number 가 아닙니다. ');
      return [];
    }

    let arr = [];

    for (startSequence; startSequence <= endSequence; startSequence++) {
      arr.push(startSequence);
    }

    return arr;
  };


  /** ========================================================
                      object 관련 util
  ======================================================== */

  /**
   * object를 query parameter 화 시킨다.
   * @param {object} o query parameter 로 만들 객체 
   */
  fn.objectToQueryString = function (o) {

    if (!this.isObject(o)) {
      return '';
    }

    const _co = this.deepCopy(o);

    return Object.entries(_co).map(function (kv) {
      const k = kv[0],
            v = kv[1].toString();
      return k.concat('=').concat(encodeURIComponent(v));
    }).join('&');
  };

  /**
   * url query string 으로 부터 object를 mapping 한다.
   * @param {array|null} na number array: query string 중 number 형태로 변경해야하는 key list
   */
  fn.queryStringToObject = function (na) {
    let q = {};

    if (window) {
      // search array
      const sa = window.location.search.substring(1).split('&');
      const sal = sa.length;

      for (let i=0; i<sal; i++) {
        const s = sa[i];

        const kv = s.split('=');
        const k = kv[0],
              v = kv.length === 1 ? '' : decodeURIComponent(kv[1].replace(/\+/g, " "));
        
        q[k] = this.isArray(na) && this.hasArrayItem(na, k)
              ? (isNaN(parseInt(v, 10)) ? 10 : parseInt(v, 10))
              : v;
      }
    }

    return q;
  };

  /**
   * url pathname 의 depth 번째 name value를 가져온다.
   * @param {number} d depth
   */
  fn.getUrlPathValueByDepth = function (d) {
    if (!this.isNumber(d)) {
      console.error(' argument type is only number ');
      return '';
    }

    const pathnameArr = window.location.pathname.split('/');

    if (pathnameArr.length < d) {
      console.error(' depth is bigger than current url pathname length ');
      return '';
    }

    return pathnameArr[d];
  };

  /**
   * source의 property를 target이 가지고 있으면 target의 property 의 source property value 값 복사.
   * @param {object} s source
   * @param {object} t target
   */
  fn.objectCopyProperties = function (s, t) {
    if (!this.isObject(s) || !this.isObject(t)) {
      console.error(' arguments 가 객체가 아닙니다. ');
      return;
    }

    for (let k in s) {
      // 타겟에 해당 key가 존재할 때 값을 복사
      if (t.hasOwnProperty(k)) {
        t[k] = this.deepCopy(s[k]);
      }
    }
  };

  /**
   * 인자 값 object 의 property 값 초기화
   * @param {object} o object
   */
  fn.objectClear = function (o) {
    if (!this.isObject(o)) {
      console.error(' arguments 가 객체가 아닙니다. ');
      return;
    }

    for (let k in o) {
      if (this.isNumber(o[k])) {
        o[k] = 0;
      } else if (this.isObject(o[k])) {
        this.objectClear(o[k]);
      } else if (this.isArray(o[k])) {
        o[k] = [];
      } else if (this.isBoolean(o[k])) {
        o[k] = false;
      } else {
        // null or undefined or string 들은 모두 '' 로 초기화
        o[k] = '';
      }
    }
  };
  
  /** ========================================================
                        dom 관련 util
  ======================================================== */

  fn.$DOM = function (args) {
    if (!(this.isElement(args) || this.isNodeList(args) || this.isString(args) || this.isArray(args))) {
      console.error('element type is not Element or NodeList or String or Array');
      return null;
    }
    return new _DOM(args);
  };

  const _DOM = function (element) {
    this.$el = parseDomList(element);
    return Object.freeze(this);
  };

  _DOM.fn = _DOM.prototype;

  /**
   * dom 가져오기.
   */
  _DOM.fn.get = function () {
    return this.$el;
  };
 
  /**
   * 첫번째 dom 가져오기.
   */
  _DOM.fn.first = function () {
    return this.$el ? fn.$DOM(this.$el[0]) : null;
  };

  /**
   * 마지막 dom 가져오기.
   */
  _DOM.fn.last = function () {
    return this.$el ? fn.$DOM(this.$el[this.$el.length - 1]) : null;
  };

  /**
   * dom 에 event 걸기.
   * @param {String} eventName 
   * @param {Function} callbackFunc 
   */
  _DOM.fn.addEvent = function (eventName, callbackFunc) {
    const $root = fn;
    if (!$root.isString(eventName) || !$root.isFunction(callbackFunc)) {
      throw new Error(' first argument type is available only string, second argument type is available function');
    }
    for (let el of this.$el) {
      el.addEventListener(eventName, callbackFunc);
    }
  };

  /**
   * dom 요소에 className 추가
   * @param {string} className 
   */
  _DOM.fn.addClass = function (className) {
    className = className || '';
    for (let el of this.$el) {
      el.classList.add(className.toString());
    }
  };

  /**
   * dom 요소에 className 삭제
   * @param {string} className 
   */
  _DOM.fn.removeClass = function (className) {
    className = className || '';
    for (let el of this.$el) {
      el.classList.remove(className.toString());
    }
  };

  /**
   * dom 요소에 className 토글
   * @param {string} className 
   */
  _DOM.fn.toggleClass = function (className) {
    className = className || '';
    for (let el of this.$el) {
      el.classList.toggle(className.toString());
    }
  };

  /**
   * dom 요소 display block
   */
  _DOM.fn.show = function () {
    this.setCss({
      display: 'show'
    });
  };

  /**
   * dom 요소 display none
   */
  _DOM.fn.hide = function () {
    this.setCss({
      display: 'none'
    });
  };

  /**
   * dom 요소 css style 직접 설정.
   * @param {object} css css 옵션들을 객체로 표현.
   */
  _DOM.fn.setCss = function (css) {
    const $root = fn;
    if (!$root.isObject(css)) {
      css = {};
    }
    const cssString = JSON.stringify(css);

    // 속성들의 root node 찾기. (하나의 진입점.)
    let rootElement = findRootParent(this.$el);
    // root node를 child까지 clone
    const cpRoot = rootElement.cloneNode(true);
    for (let el of this.$el) {
      // el 의 innerHTML 과 같은 놈을 찾아서 
      // TODO: 리팩토링 해야할거같다.
      const $target = findDomByInnerHtml(Array.prototype.slice.call(cpRoot.children), el);
      // 스타일 변경
      $target.style.cssText = cssString.substring(1, cssString.length - 1).replace(/\"/g, '').replace(/\,/g, ';');
    }
    // child 대체.
    // 이렇게 해주는 이유: 직접적으로 각각 변경하면 요소의 개수마다 repainting 이 발생하여
    // 속도에 영향을 줌. (virtual dom 식으로 한꺼번에 처리하기.)
    rootElement.replaceWith(cpRoot);
  };

  /**
   * innerHTMl로 dom를 찾는다.
   */
  const findDomByInnerHtml = function (source, target) {
    for (let i=0; i< source.length; i++) {
      if (source[i].innerHTML === target.innerHTML) {
        return source[i];
      } else {
        let value = findDomByInnerHtml(source[i].children, target);
        if (value) {
          return value;
        }
      }
    }
  };

  /**
   * dom 요소의 부모 요소 가져오기
   */
  _DOM.fn.parent = function () {
    const $root = fn;
    let r = [];
    for (let el of this.$el) {
      if (!$root.$array.hasItem(r, el.parentElement)) { // 중복 제거
        r.push(el.parentElement);
      }
    }
    return fn.$DOM(r);
  };

  /**
   * dom 요소로부터 id 값으로 부모 요소 찾기.
   * @param {string} id 
   */
  _DOM.fn.findParentById = function (id) {
    const $root = fn;

    let r = [];
    for (let el of this.$el) {
      const parent = findParentsByValue(el, id, 'id');
      if (!$root.$array.hasItem(r, parent)) {
        r.push(parent);
      }
    }

    return fn.$DOM(r);
  };

  /**
   * dom 요소로부터 class 명으로 부모 요소 찾기.
   * @param {string} className 
   */
  _DOM.fn.findParentByClass = function (className) {
    const $root = fn;

    let r = [];
    for (let el of this.$el) {
      const parent = findParentsByValue(el, className, 'class');
      if (!$root.$array.hasItem(r, parent)) {
        r.push(parent);
      }
    }

    return fn.$DOM(r);
  };

  /**
   * dom 요소로부터 name attribute로 부모 요소 찾기.
   * @param {string} name
   * @param {HTMLElement|NodeList} element 
   */
  _DOM.fn.findParentByName = function (name) {
    const $root = fn;

    let r = [];
    for (let el of this.$el) {
      const parent = findParentsByValue(el, name, 'name');
      if (!$root.$array.hasItem(r, parent)) {
        r.push(parent);
      }
    }

    return fn.$DOM(r);
  };

  /**
   * dom 요소의 다음 요소 가져오기
   */
  _DOM.fn.next = function () {
    const $root = fn;
    let r = [];
    for (let el of this.$el) {
      if (!$root.$array.hasItem(r, el.parentElement)) { // 중복 제거
        r.push(el.nextElementSibling);
      }
    }
    return fn.$DOM(r);
  };

  /**
   * dom 요소의 이전 요소 가져오기
   */
  _DOM.fn.prev = function () {
    const $root = fn;
    let r = [];
    for (let el of this.$el) {
      if (!$root.$array.hasItem(r, el.parentElement)) { // 중복 제거
        r.push(el.previousElementSibling);
      }
    }
    return fn.$DOM(r);
  };

  _DOM.fn.find = function (selector) {

    let arr = [];

    for (let el of this.$el) {
      for (let el2 of Array.prototype.slice.call(el.querySelectorAll(selector))) {
        arr.push(el2);
      }
    }

    return fn.$DOM(arr);
  };

  /**
   * value로 부터 element list로 뽑아낸다.
   * @param {*} value 
   */
  const parseDomList = function (value) {
    const $root = fn;
    // 인자는 다음과 같이 올 수 있다.
    // 1. Element 타입인 경우
    if ($root.isElement(value)) {
      return [value];
    }

    // 2. NodeList 인 경우
    if ($root.isNodeList(value)) {
      return Array.prototype.slice.call(value);
    }

    // 3. String (selector) 인 경우
    if ($root.isString(value)) {
      return Array.prototype.slice.call(document.querySelectorAll(value));
    }

    // 4. ElementArray 인 경우
    if ($root.isArray(value)) {
      return value.filter(function (el) {
        return $root.isElement(el);
      });
    }

    return null;
  };

  /**
   * findParent 추상화
   * @param {*} element 
   * @param {*} value 
   * @param {*} valueType 
   */
  const findParentsByValue = function (element, value, valueType) {
    const $root = fn;
    if ($root.isNullOrEmpty(value) || $root.isNullOrEmpty(element)) {
      console.error('argument is empty');
      return null;
    }

    if (element.nodeName === 'BODY') {

      switch(valueType) {
        case 'name':
          console.error(' all elements has not name [' + value + ']');
          break;
        case 'class':
          console.error(' all elements has not class [' + value + ']');
          break;
        case 'id':
          console.error(' all elements has not id [' + value + ']');
          break;
      }
      return null;
    }

    switch(valueType) {
      case 'name':
        return element.getAttribute('name') === value ? element : findParentsByValue(element.parentElement, value, valueType);
      case 'class':
        return element.classList.contains(value) ? element : findParentsByValue(element.parentElement, value, valueType);
      case 'id':
        return element.id === value ? element : findParentsByValue(element.parentElement, value, valueType);
    }

    return null;
  };

  /**
   * parents 중 node가 하나인 (루트인) 노드를 가져온다.
   * @param {*} elementList 
   */
  const findRootParent = function (elementList) {
    const $root = fn;
    let r = [];
    for (let el of elementList) {
      if (!$root.$array.hasItem(r, el.parentElement)) {
        r.push(el.parentElement);
      }
    }
    return r.length === 1 ? r[0] : findRootParent(r);
  };

  /** ========================================================
                        date 관련 util
  ======================================================== */

  fn.$date = {
    test: function () {
      console.log(1);
    },
    // // if (this instanceof fn.$date) {

    // console.log(this);
    //   let _input = undefined;

    //   if (arguments.length < 1) {
    //     _input = new Date();
    //   } else if (arguments.length === 1 && (fn.isString(arguments[0]) || $DATE.isDate(arguments[0]))) {
    //     _input = arguments[0];
    //   } else {
    //     const args = Array.prototype.slice.call(arguments);

    //     for (let i=args.length; i < 6; i++) {
    //       args.push( i < 3 ? 1 : 0 );
    //     }

    //     const _args = args.map(function (arg) {
    //       return fn.zPad(arg.toString(), 2);
    //     });

    //     const _year = _args[0],
    //           _month = _args[1],
    //           _day = _args[2],
    //           _hour = _args[3],
    //           _minutes = _args[4],
    //           _seconds = _args[5];

    //     _input = _year + '-' + _month + '-' + _day + ' ' + _hour + ':' + _minutes + ':' + _seconds;
    //   }
    //   console.log($DATE.prototype.constructor.takeGap(new Date(), new Date()));

    //   return new $DATE(_input);
    // // }
    // // return this;
  };

  const $DATE = function(_input) {

    const _this = this;

    _this.input = _input;
    _this.date = toDate(_input);

    return Object.freeze(_this);
  };

  $DATE.fn = $DATE.prototype;

  // 2022-09-01 18:00:00
  const STR_DATE_FORMAT_DATETIME_HYPHEN_REG = /^[0-9]{4}\-[0-9]{1,2}\-[0-9]{1,2}\s[0-9]{1,2}\:[0-9]{1,2}\:[0-9]{1,2}$/;
  // 2022-09-01
  const STR_DATE_FORMAT_DATE_HYPHEN_REG     = /^[0-9]{4}\-[0-9]{1,2}\-[0-9]{1,2}$/;

  // 2022.09.01 18:00:00
  const STR_DATE_FORMAT_DATETIME_DOT_REG    = /^[0-9]{4}\.[0-9]{1,2}\.[0-9]{1,2}\s[0-9]{1,2}\:[0-9]{1,2}\:[0-9]{1,2}$/;
  // 2022.09.01
  const STR_DATE_FORMAT_DATE_DOT_REG        = /^[0-9]{4}\.[0-9]{1,2}\.[0-9]{1,2}$/;

  const PER_MILLI_SECONDS = 1000,
        PER_SECONDS       = PER_MILLI_SECONDS * 60,
        PER_MINUTES       = PER_SECONDS * 60,
        PER_HOUR          = PER_MINUTES * 24;

  /**
   * 인자 값이 Date 타입인지 확인.
   * @param {*} v 
   */
  $DATE.isDate = function (v) {
    const $root = fn;
    return $root.isDate(v);
  };

  /**
   * argument 가 this 타입인지 확인.
   * @param {*} v 
   */
  $DATE.isDATE = function (v) {
    return v instanceof $DATE;
  };

  /**
   * 두 개의 augument 의 차이를 배열값으로 반환
   * limitType으로 제한을 둘 수 있음.
   * // [6, 23, 0, 0] [일, 시간, 분, 초]
   * @param {*} val1 date로 변환될 값1
   * @param {*} val2 date로 변환될 값2
   * @param {string} limitType 어떤 종류까지 값을 나오게 할 것인지 (s: 초, m: 분초, h: 시분초, *d:일시분초)
   */
  $DATE.takeGap = function (v1, v2, limitType) {

    const d1 = parseDate(v1);
    const d2 = parseDate(v2);

    if (!$DATE.isDate(d1) || !$DATE.isDate(d2)) {
      console.error(' argument value can not conver to date ');
      return [];
    }

    const diff = Math.abs(d1.getTime() - d2.getTime());

    let gapDate     = 0,
        gapHours    = 0,
        gapMinutes  = 0,
        gapSeconds  = 0;

    switch (limitType) {
      case 's':
        gapSeconds = Math.floor(diff/PER_MILLI_SECONDS);
        break;
      case 'm':
        gapMinutes = Math.floor(diff/PER_SECONDS);
        gapSeconds = Math.floor((diff % PER_SECONDS)/PER_MILLI_SECONDS);
        break;
      case 'h':
        gapHours = Math.floor(diff/PER_MINUTES);
        gapMinutes = Math.floor((diff % PER_MINUTES)/PER_SECONDS);
        gapSeconds = Math.floor((diff % PER_SECONDS)/PER_MILLI_SECONDS);
        break;
      default:
        gapDate = Math.floor(diff/PER_HOUR);
        gapHours = Math.floor((diff % PER_HOUR)/PER_MINUTES);
        gapMinutes = Math.floor((diff % PER_MINUTES)/PER_SECONDS);
        gapSeconds = Math.floor((diff % PER_SECONDS)/PER_MILLI_SECONDS);
        break;
    }

    return [gapDate, gapHours, gapMinutes, gapSeconds];
  };

  /**
   * date를 string 으로 변환
   * @param {string} format ex) 'yyyyMMddhhmmss', 'yyyy-MM-dd hh:mm:ss'
   */
  $DATE.fn.format = function (format) {
    const $root = fn;
    let f = fn.isString(format) ? format : 'yyyy-MM-dd',
        d = this.date;

    if (!$DATE.isDate(d)) {
      console.error(' argument [d] can not convert date ');
      return '';
    }

    const weekName = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];

    return f.replace(/(yyyy|yy|MM|dd|E|hh|mm|ss|a\/p)/gi, function ($1) {
      switch ($1) {
        case "yyyy":
              return d.getFullYear();
        case "yy":
            return $root.zPad(d.getFullYear() % 1000, 2);
        case "MM":
            return $root.zPad(d.getMonth() + 1, 2);
        case "dd":
            return $root.zPad(d.getDate(), 2);
        case "E":
            return weekName[d.getDay()];
        case "hh":
            return $root.zPad(d.getHours(), 2);
        // case "hh":
        //     return fn.zPad((h = d.getHours() % 12) ? h : 12, 2);
        case "mm":
            return $root.zPad(d.getMinutes(), 2);
        case "ss":
            return $root.zPad(d.getSeconds(), 2);
        case "a/p":
            return d.getHours() < 12 ? "오전" : "오후";
        default:
            return $1;
      }
    });
  };

  /**
   * value로부터 나온 date 에 year 년 후 의 date값을 구함.
   * @param {number} year 모든 정수
   */
  $DATE.fn.addYear = function (year) {
    const $root = fn,
          d = parseDate(this);
    if (!$root.isDate(d)) {
      return null;
    }
    year = Math.floor(year); // 실수 정수화
    return new $DATE(new Date(d.setFullYear(d.getFullYear() + year)));
  };

  /**
   * value로부터 나온 date 에 month 월 후 의 date값을 구함.
   * @param {number} month 모든 정수
   */
  $DATE.fn.addMonth = function (month) {
    const d = parseDate(this);
    if (!$DATE.isDate(d)) {
      return null;
    }
    month = Math.floor(month); // 실수 정수화
    return new $DATE(new Date(d.setMonth(d.getMonth() + month)));
  };
  
  /**
   * value로부터 나온 date 에 date 일 후 의 date값을 구함.
   * @param {number} date 모든 정수
   */
  $DATE.fn.addDate = function (date) {
    const d = parseDate(this);
  
    if (!$DATE.isDate(d)) {
      return null;
    }
    date = Math.floor(date); // 실수 정수화
    return new $DATE(new Date(d.setDate(d.getDate() + date)));
  };

  /**
   * value로부터 나온 date 에 hour 시간 후 의 date값을 구함.
   * @param {number} hour 모든 정수
   */
  $DATE.fn.addHour = function (hour) {
    const d = parseDate(this);
    if (!$DATE.isDate(d)) {
      return null;
    }
    hour = Math.floor(hour); // 실수 정수화
    return new $DATE(new Date(d.setHour(d.getHour() + hour)));
  };

  /**
   * value로부터 나온 date 에 minutes 분 후 의 date값을 구함.
   * @param {number} minutes 모든 정수
   */
  $DATE.fn.addMinutes = function (minutes) {
    const d = parseDate(this);
    if (!$DATE.isDate(d)) {
      return null;
    }
    minutes = Math.floor(minutes); // 실수 정수화
    return new $DATE(new Date(d.setMinutes(d.getMinutes() + minutes)));
  };

  /**
   * 각 time 값들을 배열로 반환
   */
  $DATE.fn.parseList = function () {
    const d = parseDate(this);
    if (!$DATE.isDate(d)) {
      return [];
    }

    return [
      d.getFullYear(),
      d.getMonth() + 1,
      d.getDate(),
      d.getHours(),
      d.getMinutes(),
      d.getSeconds(),
      d.getMilliseconds()
    ];
  };

  /**
   * 현재 객체를 복사
   */
  $DATE.fn.takeInstance = function () {
    return new $DATE(this.input);
  };

  $DATE.fn.isAfter = function (v) {
    let d = parseDate(v);
    if (!$DATE.isDate(d)) {
      return false;
    }

    return d.getTime() < this.date.getTime();
  };

  $DATE.fn.isAfterOrSame = function (v) {
    let d = parseDate(v);
    if (!$DATE.isDate(d)) {
      return false;
    }

    return d.getTime() <= this.date.getTime();
  };

  $DATE.fn.isBefore = function (v) {
    let d = parseDate(v);
    if (!$DATE.isDate(d)) {
      return false;
    }

    return d.getTime() > this.date.getTime();
  };

  $DATE.fn.isBeforeOrSame = function (v) {

    let d = parseDate(v);
    if (!$DATE.isDate(d)) {
      return false;
    }

    return d.getTime() >= this.date.getTime();
  };

  $DATE.fn.isSame = function (v) {
    let d = parseDate(v);
    if (!$DATE.isDate(d)) {
      return false;
    }

    return d.getTime() === this.date.getTime();
  };

  $DATE.fn.takeStart = function () {
    const d = parseDate(this);
    if (!$DATE.isDate(d)) {
      return null;
    }

    return new $DATE(new Date(d.getFullYear(), d.getMonth(), 1));
  };

  $DATE.fn.takeEnd = function () {
    const d = parseDate(this);
    if (!$DATE.isDate(d)) {
      return null;
    }

    return new $DATE(new Date(d.getFullYear(), d.getMonth() + 1, 0));
  };

  const parseDate = function (v) {
    const $root = fn;
    let r = null;

    if ($root.isString(v)) {
      r = toDate(v);
    } else if ($root.isDate(v)) {
      r = new Date(v.getTime());
    } else if ($DATE.isDATE(v)) {
      r = new Date(v.date.getTime());
    } else {
      r = new Date(v);
    }

    return r;
  };

  /**
   * 새로운 date 객체 반환
   */
  const toDate = function (v) {
    const $root = fn;
    let r = '';

    // safari에서 하이픈은 format으로 안먹힘.
    if (STR_DATE_FORMAT_DATETIME_HYPHEN_REG.test(v) || STR_DATE_FORMAT_DATE_HYPHEN_REG.test(v)) {
      r = v.replace(/\-/gi, '/');
    } else if (STR_DATE_FORMAT_DATETIME_DOT_REG.test(v) || STR_DATE_FORMAT_DATE_DOT_REG.test(v)) {
      r = v.replace(/\./, '/');
    } else {
      r = v;
    }

    const d = $root.isDate(r) ? r : new Date(r);

    return $root.isDate(d) ? new Date(d.getTime()) : new Date();
  };


  const $COMMON = new JK_COMMON_UTILS();

  if (window) {
    window.$COMMON = $COMMON;
  }

  return $COMMON;
});