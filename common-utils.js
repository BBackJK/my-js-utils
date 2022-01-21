(function(global, factory) {
  if (typeof module === "object" && typeof module.exports === "object") {
    // node 환경 모듈 정의 (Browser 환경 X)
  } else {
    factory(global);
  }

})(typeof window !== "undefined" ? window : this, function (window) {
  var JK_COMMON_UTILS = function() {
  };

  var fn = JK_COMMON_UTILS.fn = JK_COMMON_UTILS.prototype;

  fn.isNull = function(val) {
    return val === null;
  };

  fn.deepCopy = function(data) {
    let _ = {};

      if (Array.isArray(data)) {            // 배열 체크
        _ = data.slice().map(function(v) {
          return this.deepCopy(v);
        })
      } else if (data !== null && typeof data === 'object') {   // 객체 체크
        for (let attr in data) {
          if (data.hasOwnProperty(attr)) {
            _[attr] = this.deepCopy(data[attr]);
          }
        }
      } else {      // 원시값 체크
        _ = data;
      }

      return _;
  };

  fn.isNullOrEmpty = function(val) {
    
    if (this.isNull(val)) {
      return true;
    }

    if (this.isString(val)) {
      return val === '';
    }

    if (this.isObject(val)) {
      return !Object.keys(val).length;
    }

    if (this.isArray(val)) {
      return !val.length;
    }

    return false;
  };

  fn.isString = function(val) {
    return this.checkType(val, 'string');
  };

  fn.isNumber = function(val) {
    return this.checkType(val, 'number');
  };

  fn.isObject = function(val) {
    return !this.isNull(val) && this.checkType(val, 'object');
  };

  fn.isArray = Array.isArray;

  fn.isUndefined = function(val) {
    return this.checkType(val, 'undefined');
  }

  fn.checkType = function(val, type) {
    return typeof val === type;
  };

  window.JCU = window.$JCU = new JK_COMMON_UTILS();

  return JCU;
});