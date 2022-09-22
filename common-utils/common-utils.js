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
    return typeof val === type;
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

    if (this.isObject(v)) {
      return !Object.keys(v).length;
    }

    if (this.isArray(v)) {
      return !v.length;
    }

    return false;
  };

  fn.isString = function(v) {
    return checkType(v, 'string');
  };

  fn.isNumber = function(v) {
    return checkType(v, 'number');
  };

  fn.isObject = function(v) {
    return !this.isNull(v) && checkType(v, 'object');
  };

  fn.isBoolean = function (v) {
    return checkType(v, 'boolean');
  }

  fn.isArray = Array.isArray;

  fn.isUndefined = function(v) {
    return checkType(v, 'undefined');
  };

  fn.isNull = function(v) {
    return checkType(v, null);
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

    if (!this.isString(id) || !this.isNumber(id)) {
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

    if (!this.isString(id) || !this.isNumber(id)) {
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
      if (!this.isString(i) || i.hasOwnProperty('id')) {
        throw new Error(' array 가 object로 이루어져있지 않거나 id property 가 존재하지않습니다. ');
      }

      return i.id;
    });
  };

  /**
   * startSequence 부터 endSequence 까지 숫자를 나열한다.
   * @param {array} a 
   * @param {number} startSequence 
   * @param {number} endSequence 
   */
  fn.makeArraySeqList = function (a, startSequence, endSequence) {
    if (!this.isArray(a)) {
      console.error(' 첫번째 인자 타입이 array 가 아닙니다. ');
      return [];
    }

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

  /**
   * HTML Element 인지 확인.
   * @param {Element} e 
   */
  fn.isDom = function (e) {
    try {
      return e instanceof HTMLElement;
    } catch (err) {
      return this.isObject(e) && e.nodeType === 1 && this.isObject(e.style) && this.isObject(e.ownerDocument);
    }
  };

  /**
   * NodeList 인지 확인
   * @param {NodeList} e 
   */
  fn.isNodeList = function (e) {
    return e instanceof NodeList;
  };

  /**
   * dom 요소에 className 추가
   * @param {HTMLElement|NodeList} e 
   * @param {string} className 
   */
  fn.addClass = function (e, className) {
    
    let arr = takeDomList(e);
    className = className || '';

    for (let el of arr) {
      el.classList.add(className.toString());
    }
  };

  /**
   * dom 요소에 className 삭제
   * @param {HTMLElement|NodeList} e 
   * @param {string} className 
   */
  fn.removeClass = function (e, className) {

    let arr = takeDomList(e);
    className = className || '';

    for (let el of arr) {
      el.classList.add(className.toString());
    }
  };

  /**
   * dom 요소에 className 토글
   * @param {HTMLElement|NodeList} e 
   * @param {string} className 
   */
  fn.toggleClass = function (e, className) {
    let arr = takeDomList(e);
    className = className || '';

    for (let el of arr) {
      el.classList.toggle(className.toString());
    }
  };

  /**
   * dom 요소 display block
   * @param {HTMLElement|NodeList} e 
   */
  fn.show = function (e) {
    this.setDomCss(e, {
      display: 'show'
    });
  };

  /**
   * dom 요소 display none
   * @param {HTMLElement|NodeList} e 
   */
  fn.hide = function (e) {
    this.setDomCss(e, {
      display: 'none'
    });
  };

  /**
   * dom 요소 css style 직접 설정.
   * @param {HTMLElement|NodeList} e 
   * @param {object} css css 옵션들을 객체로 표현.
   */
  fn.setCss = function (e, css) {
    if (!this.isObject(css)) {
      css = {};
    }
    let arr = takeDomList(e);
    for (let el of arr) {
      const cssString = JSON.stringify(css);
      el.style.cssText = cssString.substring(1, cssString.length - 1).replace(/\"/g, '').replace(/\,/g, ';');
    }
  };

  /**
   * dom 요소의 부모 요소 가져오기
   * @param {HTMLElement|NodeList} e 
   */
  fn.getDomParent = function (e) {
    let dom = takeDom(e);
    return dom ? dom.parentElement : null;
  };

  /**
   * dom 요소로부터 id 값으로 부모 요소 찾기.
   * @param {HTMLElement|NodeList} e 
   * @param {string} id 
   */
  fn.findParentById = function (e, id) {
    let dom = takeDom(e);

    if (this.isNull(dom) || this.isNullOrEmpty(id)) {
      console.error('argument is empty');
      return dom;
    }

    if (dom.nodeName === 'HTML') {
      console.error(' all elements has not id [' + id + ']');
      return null;
    }

    return dom.id === id ? dom : this.findParentById(dom.parentElement, id);
  };

  /**
   * dom 요소로부터 class 명으로 부모 요소 찾기.
   * @param {HTMLElement|NodeList} e 
   * @param {string} id 
   */
  fn.findParentByClass = function (e, className) {
    let dom = takeDom(e);
    
    if (this.isNull(dom) || this.isNullOrEmpty(className)) {
      console.error('argument is empty');
      return dom;
    }

    if (dom.nodeName === 'HTML') {
      console.error(' all elements has not class [' + className + ']');
      return null;
    }

    return dom.classList.contains(className) ? dom : this.findParentByClass(dom.parentElement, className);
  };

  /**
   * dom 요소로부터 name attribute로 부모 요소 찾기.
   * @param {HTMLElement|NodeList} e 
   * @param {string} id 
   */
  fn.findParentByName = function (e, name) {
    let dom = takeDom(e);
    
    if (this.isNull(dom) || this.isNullOrEmpty(name)) {
      console.error('argument is empty');
      return dom;
    }

    if (dom.nodeName === 'HTML') {
      console.error(' all elements has not name [' + name + ']');
      return null;
    }

    return dom.getAttribute('name') === name ? dom : this.findParentByName(dom.parentElement, name);
  };

  /**
   * dom 요소의 다음 요소 가져오기
   * @param {HTMLElement|NodeList} e 
   */
  fn.getDomNext = function (e) {
    let dom = takeDom(e);
    return dom ? dom.nextElementSibling : null;
  };

  /**
   * dom 요소의 이전 요소 가져오기
   * @param {HTMLElement|NodeList} e 
   */
  fn.getDomPrev = function (e) {
    let dom = takeDom(e);
    return dom ? dom.previousElementSibling : null;
  };

  const takeDom = function (e) {
    if (fn.isDom(e)) {
      return e;
    }

    if (fn.isNodeList(e) && e.length) {
      return e[0];
    }

    return null;
  };

  const takeDomList = function (e) {
    let arr = [];
    if (fn.isDom(e)) {
      arr.push(e);
    }

    if (fn.isNodeList(e)) {
      arr = arr.concat(Array.prototype.slice.call(e));
    }
    return arr;
  };


  /** ========================================================
                        date 관련 util
  ======================================================== */

  const $DATE = function() {

    const _this = this;

    let _input = undefined;
    
    if (arguments.length < 1) {
      _input = new Date();
    } else if (arguments.length === 1 && (fn.isString(arguments[0]) || $DATE.isDate(arguments[0]))) {
      _input = arguments[0];
    } else {
      const args = Array.prototype.slice.call(arguments);

      for (let i=args.length; i < 6; i++) {
        args.push( i < 3 ? 1 : 0 );
      }

      const _args = args.map(function (arg) {
        return fn.zPad(arg.toString(), 2);
      });

      const _year = _args[0],
            _month = _args[1],
            _day = _args[2],
            _hour = _args[3],
            _minutes = _args[4],
            _seconds = _args[5];

      _input = _year + '-' + _month + '-' + _day + ' ' + _hour + ':' + _minutes + ':' + _seconds;
    }

    _this.input = _input;
    _this.date = toDate(_input);

    return Object.freeze(_this);
  };

  var dfn = $DATE.fn = $DATE.prototype;

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
    return v && Object.prototype.toString.call(v) === '[object Date]' && !isNaN(v);
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
  dfn.format = function (format) {
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
            return fn.zPad(d.getFullYear() % 1000, 2);
        case "MM":
            return fn.zPad(d.getMonth() + 1, 2);
        case "dd":
            return fn.zPad(d.getDate(), 2);
        case "E":
            return weekName[d.getDay()];
        case "hh":
            return fn.zPad(d.getHours(), 2);
        // case "hh":
        //     return fn.zPad((h = d.getHours() % 12) ? h : 12, 2);
        case "mm":
            return fn.zPad(d.getMinutes(), 2);
        case "ss":
            return fn.zPad(d.getSeconds(), 2);
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
  dfn.addYear = function (year) {
    const d = parseDate(this);
    if (!$DATE.isDate(d)) {
      return null;
    }
    year = Math.floor(year); // 실수 정수화
    return new $DATE(new Date(d.setFullYear(d.getFullYear() + year)));
  };

  /**
   * value로부터 나온 date 에 month 월 후 의 date값을 구함.
   * @param {number} month 모든 정수
   */
  dfn.addMonth = function (month) {
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
  dfn.addDate = function (date) {
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
  dfn.addHour = function (hour) {
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
  dfn.addMinutes = function (minutes) {
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
  dfn.parseList = function () {
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
  dfn.takeInstance = function () {
    return new $DATE(this.input);
  };

  dfn.isAfter = function (v) {
    let d = parseDate(v);
    if (!$DATE.isDate(d)) {
      return false;
    }

    return d.getTime() < this.date.getTime();
  };

  dfn.isAfterOrSame = function (v) {
    let d = parseDate(v);
    if (!$DATE.isDate(d)) {
      return false;
    }

    return d.getTime() <= this.date.getTime();
  };

  dfn.isBefore = function (v) {
    let d = parseDate(v);
    if (!$DATE.isDate(d)) {
      return false;
    }

    return d.getTime() > this.date.getTime();
  };

  dfn.isBeforeOrSame = function (v) {

    let d = parseDate(v);
    if (!$DATE.isDate(d)) {
      return false;
    }

    return d.getTime() >= this.date.getTime();
  };

  dfn.isSame = function (v) {
    let d = parseDate(v);
    if (!$DATE.isDate(d)) {
      return false;
    }

    return d.getTime() === this.date.getTime();
  };

  dfn.takeStart = function () {
    const d = parseDate(this);
    if (!$DATE.isDate(d)) {
      return null;
    }

    return new $DATE(new Date(d.getFullYear(), d.getMonth(), 1));
  };

  dfn.takeEnd = function () {
    const d = parseDate(this);
    if (!$DATE.isDate(d)) {
      return null;
    }

    return new $DATE(new Date(d.getFullYear(), d.getMonth() + 1, 0));
  };

  const parseDate = function (v) {
    let r = null;

    if (fn.isString(v)) {
      r = toDate(v);
    } else if ($DATE.isDate(v)) {
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
    let r = '';

    // safari에서 하이픈은 format으로 안먹힘.
    if (STR_DATE_FORMAT_DATETIME_HYPHEN_REG.test(v) || STR_DATE_FORMAT_DATE_HYPHEN_REG.test(v)) {
      r = v.replace(/\-/gi, '/');
    } else if (STR_DATE_FORMAT_DATETIME_DOT_REG.test(v) || STR_DATE_FORMAT_DATE_DOT_REG.test(v)) {
      r = v.replace(/\./, '/');
    } else {
      r = v;
    }

    const d = $DATE.isDate(r) ? r : new Date(r);

    return $DATE.isDate(d) ? new Date(d.getTime()) : new Date();
  };


  const $COMMON = new JK_COMMON_UTILS();

  if (window) {
    window.$COMMON = $COMMON;
    window.$DATE = $DATE;
  }

  return {
    $COMMON: $COMMON,
    $DATE: $DATE
  };
});