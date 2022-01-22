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
    return checkType(val, 'string');
  };

  fn.isNumber = function(val) {
    return checkType(val, 'number');
  };

  fn.isObject = function(val) {
    return !this.isNull(val) && checkType(val, 'object');
  };

  fn.isArray = Array.isArray;

  fn.isUndefined = function(val) {
    return checkType(val, 'undefined');
  };

  /**
   * $target 밑에 있는 모든 DOM을 확인하려 name으로 부터 객체를 얻어온다. (초기값 가져올 때 사용)
   * @param {*} $target HTMLElement
   * @param {*} obj return object
   * @returns obj
   */
  fn.getFormObjData = function($target, validation, obj) {
    // TODO: 리팩토링 해야함... validation check 해야함
    if (!obj) obj = {};
    if (!validation) validation = false;

    let breakPointYn = false;     // validation 브레이킹 포인트 체크
    let l = $target.length;

    if (l) {
      for (let i=0; i<l; i++) {
        let target = $target[i];
        if (target.nodeType === 1) {

          let $type = target.type;
          let $value = target.value;
          let $dataset = target.dataset;
          let $name = target.getAttribute('name');
        
          if ($name && $type && 'text password checkbox radio select-one'.indexOf($type) >= 0) {
            if ($type === 'text' || $type === 'password') { // text

              if (validation) {                             // 빈 값 체크
                if ($dataset['required']) {
                  if ($value === '') {
                    alert($dataset['message']);
                    target.focus();
                    breakPointYn = true;
                    break;
                  }
                }
              }

              if (!obj[$name]) {
                obj[$name] = $value;
              }
            } else if ($type === 'checkbox') {  // checkbox
              if ($value === 'true' || $value === 'false') {  // checkbox 에서 단순히 체크 여부를 확인할 때

                if (validation) {               // checkbox true false 체크여부 체크
                  if ($dataset['required']) {
                    if (!target.checked) {
                      alert($dataset['message']);
                      target.focus();
                      breakPointYn = true;
                      break;
                    }
                  }
                }

                if (!obj[$name]) {
                  obj[$name] = target.checked;
                }
              } else {                                        // value를 확인할 때
                if (!obj[$name]) {
                  obj[$name] = [];
                  if (target.checked) {
                    obj[$name].push($value);
                  }
                } else {
                  if (target.checked) {
                    obj[$name].push($value);
                  }
                }

                if (validation) {               // checkbox 선택 validation 체크
                  if ($dataset['required']) {
                    if (!obj[$name].length) {
                      alert($dataset['message']);
                      target.focus();
                      breakPointYn = true;
                      break;
                    }
                  }
                }
              }
            } else if ($type === 'select-one') {  // select

              if (validation) {                   // select option 선택 validation 체크
                if ($dataset['required']) {
                  if ($value === '') {
                    alert($dataset['message']);
                      target.focus();
                      breakPointYn = true;
                      break;
                  }
                }
              }

              if (!obj[$name]) {
                obj[$name] = $value;
              }
            } else if ($type === 'radio') {
              if (!obj[$name]) {
                obj[$name] = target.checked ? $value : '';
              }
            }
          } else {
            // 다시 찾는다..
            if (target.hasChildNodes()) {
              let validationResult = this.getFormObjData(target.childNodes, validation, obj);
              if (validation && !validationResult) {
                return false;
              }
            }
          }
        }
      }

      if (validation && breakPointYn) {
        return false;
      }
    } else {
      // TODO: 01.22 까지 테스트해본 결과 필요 없을것 같기도 함.
      if ($target.hasChildNodes()) {
        for (let i=0, l=$target.childNodes.length; i<l; i++) {
          let target = $target.childNodes[i];
          if (target.nodeType === 1) {  // nodeType: 1 (element 요소)

            let $type = target.type;
            let $value = target.value;
            let $name = target.getAttribute('name');
          
            if ($name && $type && 'text password checkbox radio select-one'.indexOf($type) >= 0) {
              if ($type === 'text' || $type === 'password') { // text
                if (!obj[$name]) {
                  obj[$name] = $value;
                }
              } else if ($type === 'checkbox') {  // checkbox
                if ($value === 'true' || $value === 'false') {  // checkbox 에서 단순히 체크 여부를 확인할 때
                  if (!obj[$name]) {
                    obj[$name] = target.checked;
                  }
                } else {                                        // value를 확인할 때
                  if (!obj[$name]) {
                    obj[$name] = target.checked ? $value : '';
                  }
                }
              } else if ($type === 'select-one') {  // select
                if (!obj[$name]) {
                  obj[$name] = $value;
                }
              } else if ($type === 'radio') {
                if (!obj[$name]) {
                  obj[$name] = target.checked ? $value : '';
                }
              }
            } else {
              // 다시 찾는다..
              if (target.hasChildNodes()) {
                // this.getFormObjData(target.childNodes, obj);
                let validationResult = this.getFormObjData(target.childNodes, validation, obj);
                if (validation && !validationResult) {
                  return false;
                }
              }
            }
          }
        }

        if (validation && breakPointYn) {
          return false;
        }
      } 
    }
    return obj;
  };

  /**
   * $target 의 자식 노드중에서 name 속성이 object key값과 동일한 경우를 찾아서 데이터를 바인딩
   * @param {*} $target 
   * @param {*} obj 
   */
  fn.bindFormData = function($target, obj) {
    for (let key in obj) {
      if (typeof obj[key] !== 'function') {   // custom-prototype.js에서 정의한 object 커스텀 프로토타입까지 나옴..
        let $elements = $target.querySelectorAll('[name=' + key +']');

        for (let i=0, l=$elements.length; i<l; i++) {
          let $el = $elements[i];

          if ($el.nodeType === 1) {   // element 요소만 체크
            let $type = $el.type;
            let $value = obj[key];
            if ($type && 'text password checkbox radio select-one'.indexOf($type) >= 0) {
              if ($type === 'text' || $type === 'password') {
                $el.value = $value;
              } else if($type === 'checkbox') { // 선택한 값 다 체크
                if (this.isArray($value)) {
                  
                  $value = $value.toString().split(',');    // 문자열로 바꿔줌.

                  if ($value.indexOf($el.value) >= 0) {
                    $el.checked = true;
                  }
                } else {                        // true, false만 분별
                  $el.checked = $value;
                }
              } else if ($type === 'select-one') {
                $el.value = $value;
              } else if ($type === 'radio') {
                $el.checked = $el.value === $value;
              }
            }
          }
        }
      }
    }
  };

  var checkType = function(val, type) {
    return typeof val === type;
  };

  window.JCU = window.$JCU = new JK_COMMON_UTILS();

  return JCU;
});