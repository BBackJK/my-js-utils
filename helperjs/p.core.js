(function(global, factory) {
  var result;
  if (typeof module === "object" && typeof module.exports === "object") {
    // node 환경 모듈 정의 (Browser 환경 X)
  } else {
    result = factory(global);
  }

  global.P = result;

})((typeof window !== "undefined" ? window : this), function (global) {

  //#region 글로벌 변수
  const NATIVE_TO_STRING = Object.prototype.toString;
  const NATIVE_SPLIT = String.prototype.split;
  const NATIVE_ARRAY_SLICE = Array.prototype.slice;
  //#endregion

  //#region private 함수
  const _private = {
    DATE: {
      PER_MILLI_SECONDS: 1000,
      PER_SECONDS: 1000 * 60,
      PER_MINUTES: 1000 * 60 * 60,
      PER_HOUR: 1000 * 60 * 60 * 24,
      PER_DATE: 1000 * 60 * 60 * 24 * 30,
      PER_MONTH: 1000 * 60 * 60 * 24 * 30 * 12,
      weekNameList: ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'],
      getDate: function ( date ) {
        if ( StringUtils.isNumberString( date ) ) {
          const dateString = StringUtils.rpad( date, '0', 12 );
          return new Date( 
            StringUtils.format(
              '{0}-{1}-{2} {3}:{4}:{5}'
              , dateString.slice(0, 4)    // yyyy
              , dateString.slice(4, 6)    // mm
              , dateString.slice(6, 8)    // dd
              , dateString.slice(8, 10)   // hh
              , dateString.slice(10, 12)  // mm
              , dateString.slice(12, 14)  // ss
            )
          );
        }
        return new Date( date );
      },
    },
    PROMISE:{
      STATE: {
        PENDING: 'pending',
        FULFILLED: 'fulfilled',
        REJECTED: 'rejected',
      }
    }
  };
  //#endregion

  //#region String 유틸
  const StringUtils = {};
  StringUtils.isString = function (string) {
    return Utils.getRawType(string, 1) === String.name;
  };

  /**
   * string 인자가 value 값을 포함하고 있는지 확인.
   * @param {String} string 
   * @param {String} value 
   */
  StringUtils.hasText = function (string, value) {
    return this.isString(string) 
      && this.isString(value) 
      && string.indexOf(value) > -1;
  };

  /**
   * javascript 문자열 포맷 처리
   * @param {String} targetSyntax 반환할 포맷팅 문자열
   * @param {...Array} spreadArgumenList 포맷팅에 매핑할 인자 목록들.
   * @example
   * 
   * P.string.format('{0} 와 {1} 을 입력해주세요.', 1, 2);
   * // => 1 와 2 을 입력해주세요.
   * 
   */
  StringUtils.format = function () {
    const argumentArray = ArrayUtils.toSliceArray(arguments);
    if (!argumentArray.length) {
      throw Error('인자값이 존재하지 않습니다.');
    }

    const targetSyntax = argumentArray.shift();
    const spreadArgumentList = argumentArray;

    return targetSyntax.replace(/\{[0-9]{1}\}/gi, function ($1) {
      return spreadArgumentList[$1.slice(1, -1)];
    });
  };

  /**
   * uuid4 를 반환하는 함수.
   */
  StringUtils.getUuid4 = function () {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      let r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  };

  /**
   * 문자열 왼쪽으로 padChar의 글자를 총 문자열길이가 padLength 까지 채운다.
   * @param {String} origin 
   * @param {String} padChar 
   * @param {Number} padLength 
   */
  StringUtils.lpad = function (origin, padChar, padLength) {
    origin = this.nvl(origin);
    padChar = this.nvl(padChar);
    padLength = NumberUtils.nvl(padLength);

    const diffLength = Math.abs(padLength - origin.length);
    const padCharLength = padChar.length;
    const loopCount = Math.floor(diffLength / padCharLength) || 0;
    let index = -1;
    let result = '';
    while(++index < loopCount) {
      result += padChar;
    }
    result += origin;
    if ((diffLength % padCharLength) > 0) {
      index = -1;
      let remainResult = '';
      const remainer = diffLength % padCharLength;
      while(++index < remainer) {
        remainResult += padChar[index];
      }
      result = remainResult + result;
    }
    return result;
  };

  /**
   * 문자열 오른쪽으로 padChar의 글자를 총 문자열길이가 padLength 까지 채운다.
   * @param {String} origin 
   * @param {String} padChar 
   * @param {Number} padLength 
   */
  StringUtils.rpad = function (origin, padChar, padLength) {
    origin = this.nvl(origin);
    padChar = this.nvl(padChar);
    padLength = NumberUtils.nvl(padLength);

    const diffLength = Math.abs(padLength - origin.length);
    const padCharLength = padChar.length;
    const loopCount = Math.floor(diffLength / padCharLength) || 0;
    let index = -1;
    let result = origin;
    while(++index < loopCount) {
      result += padChar;
    }
    if ((diffLength % padCharLength) > 0) {
      index = -1;
      let remainResult = '';
      const remainer = diffLength % padCharLength;
      while(++index < remainer) {
        remainResult += padChar[index];
      }
      result += remainResult;
    }
    return result;
  };

  /**
   * 대상이 Null 이거나 Undefined 일 때 replace 를 반환한다. 아닐 시, 원본 반환
   * @param {*} target 
   * @param {*} replace 
   */
  StringUtils.nvl = function (string, replace) {
    return Utils.isNullOrUndefined(string)
      ? String((!!replace ? replace : ''))
      : String(string);
  };

  /**
   * 대상 타겟에 대하여 문자열 타입의 숫자를 반환한다.
   * @param {*} string 
   */
  StringUtils.toNumber = function (string) {
    if (Utils.isObject(string)) {
      return ObjectUtils.toString(string).replace(/[^0-9]*/g, '');
    }
    return String(string).replace(/[^0-9]*/g, '');
  };
  
  /**
   * 대상 타겟에 대하여 3자리마다 콤마를 찍는 문자열을 반환한다.
   * @param {*} string 
   */
  StringUtils.toComma = function (string) {
    return String(NumberUtils.toNumber(string)).replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,');
  };

  /**
   * 문자열인 대상이 같은지 확인
   * @param {String} string1 
   * @param {String} string2 
   */
  StringUtils.eq = function ( string1, string2 ) {
    return this.nvl(string1, 'other1') === this.nvl(string2, 'other2');
  };

  /**
   * 대상이 숫자로 이루어진 문자열인지 확인
   */
  StringUtils.isNumberString = function ( string ) {
    return !this.isEmpty( string )
      && this.isEmpty( this.nvl( string ).replace(/[0-9]/g, '') );
  };

  /**
   * 대상 문자열이 비어있는지 확인
   */
  StringUtils.isEmpty = function ( string ) {
    return Utils.isString( string ) && string.length < 1;
  };
  //#endregion

  //#region Number 유틸
  const NumberUtils = {};

  /**
   * Number 타입인지 확인.
   * @param {*} number 
   */
  NumberUtils.isNumber = function (number) {
    return Utils.getRawType(number, 1) === Number.name; 
  };

  /**
   * 인자 대상이 양수인지 확인하는 함수.
   * @param {*} number 
   */
  NumberUtils.isPositive = function (number) {
    return this.isNumber(number) && 
      number > -1 && 
      number % 1 === 0 &&
      number <= Number.MAX_VALUE;
  };

  /**
   * number 가 NaN 일 때, replace 로 값을 반환한다.
   * @param {*} number 
   * @param {*} replace 
   */
  NumberUtils.nvl = function (number, replace) {
    const n = parseInt(number, 10);
    return isNaN(n) 
      ? (isNaN(parseInt(replace, 10)) ? 0 : parseInt(replace, 10))
      : n;
  };

  /**
   * 대상 타겟에 대하여 Number 타입의 숫자를 반환한다.
   * @param {*} number 
   */
  NumberUtils.toNumber = function (number) {
    return parseInt(StringUtils.toNumber(number), 10);
  };

  /**
   * 대상 타겟에 대하여 3자리마다 콤마를 찍는 문자열을 반환한다.
   * @param {*} number 
   */
  NumberUtils.toComma = StringUtils.toComma;

  /**
   * 두 숫자가 같은지 판단.
   * @param {Number} number1 
   * @param {Number} number2 
   */
  NumberUtils.eq = function (number1, number2) {
    return this.nvl(number1, 0) === this.nvl(number2, 1);
  };
  //#endregion

  //#region Array 유틸
  const ArrayUtils = {};
  ArrayUtils.isArray = function (array) {
    return Utils.getRawType(array, 1) === Array.name;
  };

  /**
   * `target.length`가 있는 값은 유사 배열로 간주됩니다.
   * @param {*} array 
   */
  ArrayUtils.isArrayLike = function (array) {
    return !Utils.isNullOrUndefined(array) 
      && typeof array !== 'function' 
      && NumberUtils.isPositive(array.length);
  };

  /**
   * 해당 타겟이 객체들로 이루어진 배열인지 확인.
   * @param {*} array
   */
  ArrayUtils.isObjectArray = function (array) {
    if ( !Utils.isArray(array) || Utils.isEmpty(array) ) {
      return false;
    }

    const length = array.length;
    let index = -1;
    while ( ++index < length ) {
      const value = array[ index ];
      if ( !Utils.isObject( value ) ) {
        return false;
      }
    }

    return true;
  };

  /**
   * 대상 타겟값에 해당하는 새로운 Array를 만든다.
   * @param {*} target 
   */
  ArrayUtils.toSliceArray = function (target) {
    return NATIVE_ARRAY_SLICE.call(target);
  };

  /**
   * array 가 array 타입이 아닐 때, replace를 반환한다.
   * @param {*} array 
   * @param {*} replace 
   */
  ArrayUtils.nvl = function (array, replace) {
    return this.isArray(array)
      ? array
      : (!!replace ? replace : []);
  };

  /**
   * 첫 번째 요소를 반환한다.
   * @param {Array} array 
   */
  ArrayUtils.first = function (array) {
    array = this.nvl(array);
    return array[0];
  };

  /**
   * 마지막 요소를 반환한다.
   * @param {Array} array 
   */
  ArrayUtils.last = function (array) {
    array = this.nvl(array);
    return array[array.length - 1];
  };

  /**
   * array 가 item을 포함하고 있는지 확인한다.
   * value 가 object 일 경우, key 값을 이용하여 해당 프로퍼티가 있는지 확인한다.
   * @param {Array} array 
   * @param {*} value 
   * @param {Null|String} key 
   * @example
   * 
   * let arr = [1,2,3,4];
   * P.array.has(arr, 1);
   * // => true
   * 
   * let arr2 = [
   *  {
   *    key1: '1value1',
   *    key2: '1value2'
   *  },
   *  {
   *    key1: '2value1',
   *    key2: '2value2'
   *  },
   * ];
   *
   * let obj = {
   *  key1: '1value1',
   *  key2: '1value2'
   * };
   *
   * P.array.has(arr2, obj, 'key1');
   * // => true
   * 
   */
  ArrayUtils.has = function (array, value, key) {
    array = this.nvl(array);

    if (!ObjectUtils.isObjectLike(value)) {
      return array.indexOf(value) > -1;
    }

    key = StringUtils.nvl(key);
    const objectKeyValue = value[key];

    let length = array.length;
    let index = -1;

    while ( ++index < length ) {
      const objectLike = array[ index ];
      if (ObjectUtils.isObjectLike(objectLike) && objectLike[key] === objectKeyValue) {
        return true;
      }
    }

    return false;
  };

  /**
   * object array 에 대해서 key 에 해당하는 값이 value와 일치하면 해당 object를 반환.
   * 없을 시, replace 를 통한 nvl 반환
   * @param {Array} objectArray 
   * @param {String} key 
   * @param {*} value 
   * @param {Object} replace
   * @example
   * 
   * 
   */
  ArrayUtils.find = function (objectArray, key, value, replace) {
    objectArray = this.nvl(objectArray);
    key = StringUtils.nvl(key, 'key');
    value = Utils.nvl(value);

    const length = objectArray.length;
    let index = -1;

    while (++index < length) {
      const item = objectArray[index];
      if (Utils.isObject(item) && ObjectUtils.eq(item[key], value)) {
        return item;
      }
    }
    
    return ObjectUtils.nvl(replace);
  };


  /**
   * object array 에 대해서 key 에 해당하는 값이 value와 일치하면 해당 index를 반환.
   * 없을 시 -1 반환
   * @param {Array} objectArray 
   * @param {String} key 
   * @param {*} value 
   */
  ArrayUtils.findIndex = function (objectArray, key, value) {
    objectArray = this.nvl(objectArray);
    key = StringUtils.nvl(key, 'key');
    value = Utils.nvl(value);

    const length = objectArray.length;
    let index = -1;

    while (++index < length) {
      const item = objectArray[index];
      if (Utils.isObject(item) && ObjectUtils.eq(item[key], value)) {
        return index;
      }
    }
    
    return -1;
  };

  /**
   * object array 에 대해서 id key 에 해당하는 값이 value와 일치하면 해당 object를 반환.
   * 없을 시, replace 반환
   * @param {Array} objectArray 
   * @param {*} value 
   * @param {Object} replace
   */
  ArrayUtils.findById = function (objectArray, value, replace) {
    return this.find(objectArray, 'id', value, replace);
  };

  /**
   * object array 에 대해서 id key 에 해당하는 값이 value와 일치하면 해당 index를 반환.
   * 없을 시, -1 반환
   * @param {Array} objectArray 
   * @param {*} value 
   */
  ArrayUtils.findIndexById = function (objectArray, value) {
    return this.findIndex(objectArray, 'id', value);
  };

  /**
   * object array 형태로 이루어진 array 의 key (default: `id`) 프로퍼티의 값으로 새로운 배열을 만든다.
   * @param {Array} objectArray 
   * @param {String|Null} key 
   */
  ArrayUtils.generateIdList = function (objectArray, key) {
    objectArray = this.nvl(objectArray);
    key = StringUtils.nvl(key, 'id');

    const result = [];
    const length = objectArray.length;
    let index = -1;

    while (++index < length) {
      const object = objectArray[index];
      const id = object[key];
      if (Utils.isNullOrUndefined(id)) {
        throw Error(StringUtils.format('해당 객체가 `{0}` 프로퍼티를 가지고 있지 않습니다. object :: {1}', key, object));
      }
      result.push(object[key]);  
    }

    return result;
  };

  /**
   * Number 로 이루어진 index 배열을 생성한다.
   * @param {Number} start 
   * @param {Number} end 
   */
  ArrayUtils.generateIndexList = function (start, end) {
    const result = [];
    start = NumberUtils.nvl(start);
    end = NumberUtils.nvl(end);
    while (start <= end) {
      result.push(start);
      start++;
    }
    return result;
  };

  /**
   * 두 배열이 같은지 확인.
   * @param {Array} array1 
   * @param {Array} array2 
   */
  ArrayUtils.eq = function (array1, array2) {
    array1 = this.nvl(array1);
    array2 = this.nvl(array2);

    if (array1.length !== array2.length) {
      return false;
    }

    const array1Length = array1.length;
    let index = -1;
    const eqList = [];

    while (++index < array1Length) {
      const item = array1[index];
      if (Utils.eq(item, array2[index])) {
        eqList.push(item);
      }
    }

    return eqList.length === array2.length;
  };
  //#endregion

  //#region Object 유틸
  const ObjectUtils = {};
  ObjectUtils.isObject = function (object) {
    return Utils.getRawType(object, 1) === Object.name;
  };

  /**
   * 대상 인자가 객체같은 지 여부를 체크한다. (null 제외)
   * @param {*} object
   * @example
   * 
   * P.object.isObjectLike({});
   * // => true
   * 
   * P.object.isObjectLike([1, 2, 3]); 
   * // => true
   * 
   * P.object.isObjectLike(Function);
   * // => false
   * 
   * P.object.isObjectLike(null);
   * // => false
   * 
   */
  ObjectUtils.isObjectLike = function (object) {
    return typeof object === Object.name.toLowerCase() && object !== null;
  };

  /**
   * Source 의 키를 Target 이 가지고 있으면, 해당하는 Source value 를 매핑한다.
   * @param {Object} source 
   * @param {Object} target 
   * @param {Boolean} isDeep 깊은 복사 여부
   * @example
   * 
   * var source = {
   *  key1: [1, 2, 3, 4],
   *  key2: 'value2',
   * };
   * 
   * var target = {
   *  key1: null,
   *  key2: null,
   * };
   * 
   * P.object.copyProperty(source, target);
   * target; // => { key1: [1, 2, 3, 4], key2: 'value2' };
   * 
   * target['key1'][0] = 'mayTargetChange';
   * source['key1']; // => { key1: ['mayTargetChange', 2, 3, 4], key2: 'value2' };
   * 
   * // deep
   * P.object.copyProperty(source, target, 1);
   * target; // => { key1: 'value1', key2: 'value2' };
   * 
   * target['key1'] = 'mayTargetChange';
   * source['key1']; // => { key1: 'value1', key2: 'value2' };
   * 
   */
  ObjectUtils.copyProperty = function (source, target, isDeep) {
    source = Utils.isObject(source) ? source : {};
    target = Utils.isObject(target) ? target : {};
    const iteratee = !!isDeep ? Utils.cp(source) : source;
    for (const sourceKey in iteratee) {
      const value = iteratee[sourceKey];
      const targetHasKey = sourceKey in target;
      if ( targetHasKey ) {
        target[sourceKey] = value;
      }
    }

    return target;
  };

  /**
   * 유사배열인 대상에 대하여 object로 변환한다.
   * @param {String|Array} target 객체로 만들 대상
   * @param {String} keyValueSeparator key value 구분자
   * @param {String} pairConnector key-value pair들 끼리의 구분자
   * @example
   * 
   * var temp = 'key1=value1&key2=value2';
   * P.object.toObject(temp, '=', '&');
   * // => { key1: 'value1', key2: 'value2' }
   * 
   * var temp2 = 'hello';
   * P.object.toObject(temp2);
   * // => { h: undefined, e: undefined, l: undefined, o: undefined }
   * 
   * var temp3 = [1,2,3,4];
   * P.object.toObject(temp3);
   * // => { 1: undefined, 2: undefined, 3: undefined, 4: undefined }
   */
  ObjectUtils.toObject = function (target, keyValueSeparator, pairConnector) {
    if ( !ArrayUtils.isArrayLike(target) ) { // garbage in, garbage out
      console.warn('[Type Error] first argument must be array liked.');
      return target;
    }

    pairConnector = StringUtils.nvl(pairConnector);
    keyValueSeparator = StringUtils.nvl(keyValueSeparator);

    const result = {};
    const realTarget = ArrayUtils.isArray(target) ? target : target.split(pairConnector);

    let index = -1;
    const length = realTarget.length;
    
    while(++index < length) {
      const entries = NATIVE_SPLIT.call(realTarget[index], keyValueSeparator);
      const key = entries[0];
      const value = entries[1];
      result[key] = value;
    }
    return result;
  };

  /**
   * object 타입의 객체를 string 화 시킨다.
   * @param {Object} object 대상객체
   * @param {String} keyValueSeparator key 와 value 구분자
   * @param {String} pairConnector key-value pair들 끼리의 구분자
   */
  ObjectUtils.toString = function (object, keyValueSeparator, pairConnector) {
    object = Object(object);

    pairConnector = StringUtils.nvl(pairConnector);
    keyValueSeparator = StringUtils.nvl(keyValueSeparator);
    
    let resultList = [];
    for (const key in object) {
      const value = object[key];
      let valueString = '';

      if (Utils.isObject(value)) {
        valueString += '{';
        valueString += this.toString(value);
        valueString += '}';
      } else if (ArrayUtils.isArray(value)) {
        valueString += value.toString();
      } else {
        valueString = String(value);
      }

      resultList.push(key + keyValueSeparator + valueString);
    }
    return resultList.join(pairConnector);
  };

  /**
   * object 가 null 이거나 undefined 일 때, replace 를 반환한다.
   * @param {*} object 
   * @param {*} replace 
   */
  ObjectUtils.nvl = function (object, replace) {
    return Utils.isNullOrUndefined(object)
      ? (!!replace ? replace : {})
      : (Utils.isObject(object) ? object : Object(object));
  };

  /**
   * object1 과 object2 의 string 형태가 같은지를 판단하여, 같은 key와 value 를 가지고 있는지 판단한다.
   * @param {Object} object1 
   * @param {Object} object2 
   */
  ObjectUtils.eq = function (object1, object2) {
    object1 = this.nvl(object1, {});
    object2 = this.nvl(object2, {key1:'value1'});

    const object1Keys = this.keys(object1);
    const object2Keys = this.keys(object2);

    if (object1Keys.length !== object2Keys.length) {
      return false;
    }

    const object1KeyLength = object1Keys.length;
    let index = -1;
    const eqList = [];

    while (++index < object1KeyLength) {
      const key = object1Keys[index];
      const object1Value = object1[key];
      const object2Value = object2[key];
      if (Utils.common.eq(object1Value, object2Value)) {
        eqList.push(key);
      }
    }

    return eqList.length === object2Keys.length;
  };

  /**
   * 유사객체를 확장한다.
   * @param {Object|Array} root   확장 대상 유사객체
   * @param {Object|Array} other  확장 원본 유사객체
   * @param {Boolean} isExtend    확장할 지 여부
   * @example
   * 
   *  const obj1 = {
   *    key1: 'value1',
   *    key3: [1,2,3,4],
   *    key4: {
   *      a: 'a'
   *      b: 'b'
   *      d: 'd'
   *    }
   *  };
   *  
   *  const obj2 = {
   *    key1: 'obj2-value1',
   *    key2: 2,
   *    key3: [5, 6],
   *    key4: {
   *      a: 'aa',
   *      c: 'c'
   *    }
   *  };
   * 
   *  P.object.merge(obj1, obj2);
   * 
   *  obj1;
   *  // => {
   *          key1: 'obj2-value1',
   *          key2: 2,
   *          key3: [5, 6],
   *          key4: {
   *            a: 'aa',
   *            c: 'c'
   *          }
   *        };
   * 
   *  P.object.merge(obj1, obj2, true);
   * 
   *  obj1;
   *  // => {
   *          key1: 'obj2-value1',
   *          key2: 2,
   *          key3: [1,2,3,4,5,6],
   *          key4: {
   *            a: 'aa',
   *            b: 'b',
   *            c: 'c',
   *            d: 'd'
   *          }
   *        }
   *  
   * 
   */
  ObjectUtils.merge = function (root, other, isExtend) {

    if (Utils.isNotObject(other) && Utils.isNotArray(other)) {
      return root;
    }
    if (Utils.isNotObject(root) && Utils.isNotArray(root)) {
      return other;
    }

    const rootType = Utils.getRawType(root, 1);
    const otherType = Utils.getRawType(other, 1);
    
    for (const otherKey in other) {
      // 확장이 아닐 경우 => 덮어씌우기
      if (!isExtend) {
        root[otherKey] = other[otherKey];
        continue;
      }

      // 둘 다 타입이 Array일 경우 root 에 other를 push
      if (rootType === otherType && rootType === Array.name) {
        root.push(other[otherKey]);
        continue;
      }

      // root 에 other 의 key를 가지고 있는지 여부
      const rootHasOtherKey = otherKey in root;

      // root 에 other 의 key가 없을 시 추가
      if (!rootHasOtherKey) {
        root[otherKey] = other[otherKey];
        continue;
      }

      const otherValue = other[otherKey];

      const rootValueType = Utils.getRawType(root[otherKey]);
      const otherValueType = Utils.getRawType(otherValue);

      // 두개의 타입이 다를 시 그냥 덮어 씌우기
      if ( rootValueType !== otherValueType ) {
        root[otherKey] = other[otherKey];
        continue;
      }

      // other value 가 object 혹은 array 일 시, 
      if (this.isObjectLike(otherValue)) {
        // 키 값들에 대해서 재귀 merge
        this.merge(root[otherKey], otherValue, isExtend);
        continue;
      }

      root[otherKey] = other[otherKey];
    }

    return root;
  };

  /**
   * 객체의 Key를 가져온다.
   * - Object.keys 를 사용하지 못할 수 있는 환경에서 안전하게 사용.
   * @param {Object} object
   */
  ObjectUtils.keys = function (object) {
    object = this.nvl(object);
    const result = [];
    for (const key in object) {
      result.push(key);
    }
    return result;
  };
  //#endregion

  //#region Date 유틸
  const DateUtils = function (value) {
    if (!DateUtils.isDateUtils(this)) {
      throw Error('`new` 키워드를 사용해 주세요.');
    }

    this.value = value;
    this.date = _private.DATE.getDate(this.value);
    this.hasParsingError = isNaN(this.date);
    this.date = this.hasParsingError ? new Date() : this.date;

    return Object.freeze(this);
  };

  DateUtils.isDateUtils = function (value) {
    return value instanceof DateUtils;
  };

  DateUtils.today = function () {
    return new DateUtils( new Date() );
  };

  DateUtils.of = function ( value ) {
    return new DateUtils( value );
  };

  const $date = DateUtils.prototype;

  /**
   * date 정보를 기반으로 format 형태의 문자열을 추출한다.
   * @param {String} format 추출한 format 형태
   * @example
   *  var $d = new P.date('20201201');
   *  $d.format('yyyy-MM-dd')
   *  // => '2020-12-01'
   * 
   *  P.date.format('20201201122432', 'yyyy-MM-dd (e) a/p hh:mm:ss.SS')
   *  // => '2020-12-01 (화) 오후 12:24:32.000'
   * 
   *  P.date.format('20201201122432', 'yyyy-MM-dd (e) A/P hh:mm:ss.SS')
   *  // => '2020-12-01 (화) PM 12:24:32.000'
   */
  $date.format = function (format) {
    const $self = this;

    return StringUtils.nvl( format ).replace(/(yyyy|yy|MM|dd|E|hh|mm|ss|a\/p)/gi, function ($1) {
      switch ($1) {
        case 'yyyy': return $self.getFullYear();
        case 'yy': return StringUtils.lpad( ( $self.getFullYear() % 1000 ), '0', 2 );
        case 'MM': return StringUtils.lpad( ( $self.getMonth() ), '0', 2 );
        case 'dd': return StringUtils.lpad( $self.getDate(), '0', 2 );
        case 'E': return _private.DATE.weekNameList[ $self.getDay() ];
        case 'e': return _private.DATE.weekNameList[ $self.getDay() ].slice(0, 1);
        case 'HH': return StringUtils.lpad( $self.getHours(), '0', 2 );
        case 'hh': return StringUtils.lpad( ( ( $self.getHours() % 12 ) > 0 ? ( $self.getHours() % 12 ) : $self.getHours() ), '0', 2 );
        case 'mm': return StringUtils.lpad( $self.getMinutes(), '0', 2 );
        case 'ss': return StringUtils.lpad( $self.getSeconds(), '0', 2 );
        case 'SS': return StringUtils.lpad( $self.date.getMilliseconds(), '0', 3 );
        case 'a/p': return $self.getHours() < 12 ? '오전' : '오후';
        case 'A/P': return $self.getHours() < 12 ? 'AM' : 'PM';
        default: return $1;
      }
    });
  };

  /**
   * date 정보를 기반으로 format 형태의 문자열을 추출한다. new 키워드를 통해서 생성하지 않고 바로 사용할 때 사용.
   * @param {*} target Date를 추출할 타겟
   * @param {String} format 추출한 format 형태
   */
  DateUtils.format = function ( target, format ) {
    return new DateUtils( target ).format( format );
  };

  /**
   * 생성한 인스턴스를 기준으로 d 만큼 일을 더한다.
   * 새로운 $date 인스턴스를 생성. (원본 불변 보장)
   * @param {Number} d 더할 일 수 (음수 가능)
   */
  $date.addDate = function ( d ) {
    const resultDate = new Date(
      this.date.getFullYear(),
      this.date.getMonth(),
      this.date.getDate() + d,
      this.date.getHours(),
      this.date.getMinutes(),
      this.date.getSeconds(),
      this.date.getMilliseconds()
    );

    return new DateUtils( resultDate );
  };

  DateUtils.addDate = function ( target, d ) {
    return new DateUtils( target ).addDate( d );
  };

  /**
   * 생성한 인스턴스를 기준으로 m 만큼 월을 더한다.
   * 새로운 $date 인스턴스를 생성. (원본 불변 보장)
   * @param {Number} m 더할 월 수 (음수 가능)
   */
  $date.addMonth = function ( m ) {
    const resultDate = new Date(
      this.date.getFullYear(),
      this.date.getMonth() + m,
      this.date.getDate(),
      this.date.getHours(),
      this.date.getMinutes(),
      this.date.getSeconds(),
      this.date.getMilliseconds()
    );

    return new DateUtils( resultDate );
  };

  DateUtils.addMonth = function ( target, m ) {
    return new DateUtils( target ).addMonth( m );
  };

  /**
   * 생성한 인스턴스를 기준으로 y 만큼 연을 더한다.
   * 새로운 $date 인스턴스를 생성. (원본 불변 보장)
   * @param {Number} y 더할 연 수 (음수 가능)
   */
  $date.addYear = function ( y ) {
    const resultDate = new Date(
      this.date.getFullYear() + y,
      this.date.getMonth(),
      this.date.getDate(),
      this.date.getHours(),
      this.date.getMinutes(),
      this.date.getSeconds(),
      this.date.getMilliseconds()
    );

    return new DateUtils( resultDate );
  };

  DateUtils.addYear = function ( target, y ) {
    return new DateUtils( target ).addYear( y );
  };

  /**
   * 생성한 인스턴스를 기준으로 h 만큼 시간을 더한다.
   * 새로운 $date 인스턴스를 생성. (원본 불변 보장)
   * @param {Number} h 더할 시간 수 (음수 가능)
   */
  $date.addHours = function ( h ) {
    const resultDate = new Date(
      this.date.getFullYear(),
      this.date.getMonth(),
      this.date.getDate(),
      this.date.getHours() + h,
      this.date.getMinutes(),
      this.date.getSeconds(),
      this.date.getMilliseconds()
    );

    return new DateUtils( resultDate );
  };

  DateUtils.addHours = function ( target, h ) {
    return new DateUtils( target ).addHours( h );
  };

  /**
   * 생성한 인스턴스를 기준으로 m 만큼 분을 더한다.
   * 새로운 $date 인스턴스를 생성. (원본 불변 보장)
   * @param {Number} m 더할 분 수 (음수 가능)
   */
  $date.addMinutes = function ( m ) {
    const resultDate = new Date(
      this.date.getFullYear(),
      this.date.getMonth(),
      this.date.getDate(),
      this.date.getHours(),
      this.date.getMinutes() + m,
      this.date.getSeconds(),
      this.date.getMilliseconds()
    );

    return new DateUtils( resultDate );
  };

  DateUtils.addMinutes = function ( target, m ) {
    return new DateUtils( target ).addMinutes( m );
  };

  /**
   * 생성한 인스턴스를 기준으로 s 만큼 초를 더한다.
   * 새로운 $date 인스턴스를 생성. (원본 불변 보장)
   * @param {Number} s 더할 초 수 (음수 가능)
   */
  $date.addSeconds = function ( s ) {
    const resultDate = new Date(
      this.date.getFullYear(),
      this.date.getMonth(),
      this.date.getDate(),
      this.date.getHours(),
      this.date.getMinutes(),
      this.date.getSeconds() + s,
      this.date.getMilliseconds()
    );

    return new DateUtils( resultDate );
  };

  DateUtils.addSeconds = function ( target, s ) {
    return new DateUtils( target ).addSeconds( s );
  };

  /**
   * 해당 인스턴스의 월 시작일 (1일) 을 가져온다.
   */
  $date.getMonthFirstDate = function () {
    return new DateUtils( StringUtils.format( '{0}01', this.format('yyyyMM') ));
  };

  /**
   * 해당 인스턴스의 월 마지막일을 가져온다.
   */
  $date.getMonthLastDate = function () {
    return new DateUtils( 
      new Date( this.date.getFullYear(), this.date.getMonth() + 1, 0 )
    );
  };

  /**
   * 해당 인스턴스의 월의 시작하는 평일을 가져온다.
   */
  $date.getMonthStartWeekDate = function () {
    const firstDate = this.getMonthFirstDate();
    
    switch ( firstDate.getDay() ) {
      case 0: // 0 일요일
        return firstDate.addDate(1);
      case 1:
      case 2:
      case 3:
      case 4:
      case 5:
        return firstDate;
      default: // 6 토요일
        return firstDate.addDate(2);

    }
  };

  /**
   * 해당 인스턴스의 월의 마지막 평일을 가져온다.
   */
  $date.getMonthEndWeekDate = function () {
    const lastDate = this.getMonthLastDate();
    switch ( lastDate.getDay() ) {
      case 0: // 0 일요일
        return lastDate.addDate(-2);
      case 1:
      case 2:
      case 3:
      case 4:
      case 5:
        return lastDate;
      default: // 6 토요일 
        return lastDate.addDate(-1);
    }
  };

  /**
   * 해당 인스턴스의 주 시작일을 가져온다.
   * @param {boolean} isWeekStartMonday 한 주의 시작이 월요일인지 여부. true 일 시, 월요일을 반환, false 일 시, 일요일을 반환
   */
  $date.getWeekFirstDate = function ( isWeekStartMonday ) {
    const startWeekDay = +!!isWeekStartMonday; // true -> 1(월요일), false -> 0 (일요일)
    return this.addDate( startWeekDay - this.getDay() );
  };

  /**
   * 해당 인스턴스의 주 마지막일을 가져온다.
   * @param {boolean} isWeekEndSunday 한 주의 종료가 일요일인지 여부. true 일 시, 일요일을 반환, false 일 시, 토요일을 반환
   */
  $date.getWeekLastDate = function ( isWeekEndSunday ) {
    const endWeekDay = !!isWeekEndSunday ? 7 : 6;
    return this.addDate( endWeekDay - this.getDay() );
  };

  /**
   * 해당 인스턴스의 주 시작 평일(월요일)을 가져온다.
   */
  $date.getWeekStartWeekDate = function () {
    const targetDay = 1; // 월요일
    return this.addDate( targetDay - this.getDay() );
  };

  /**
   * 해당 인스턴스의 주 종료 평일(금요일)을 가져온다.
   * @param {boolean} isWeekEndSunday 한 주의 종료가 토요일인지 여부.
   */
  $date.getWeekEndWeekDate = function ( isWeekEndSaturDay ) {
    const targetDay = 5; // 금요일
    return this.addDate(
      !!this.getDay() // 일요일이 아닌 경우
        ? ( targetDay - this.getDay() ) 
        : ( !!isWeekEndSaturDay ? 5 : -2 ) // 한 주의 종료가 토요일이면, 시작일(다음주)의 금요일을 반환, 아닐 시 -2로 해당 주의 금요일을 반환
    );
  };

  /**
   * 해당 인스턴스의 월 모든 일을 배열로 가져온다.
   */
  $date.getMonthDates = function () {
    const first = this.getMonthFirstDate();
    let firstDate = 1;
    let lastDate = this.getMonthLastDate().getDate();
    const result = [ first ];

    while ( firstDate < lastDate ) {
      result.push( first.addDate( firstDate ) );
      firstDate++;
    }

    return result;
  };

  /**
   * 해당 인스턴스의 주 모든 일을 배열로 가져온다.
   * @param {boolean} isWeekStartMonday 한 주의 시작이 월요일인지 여부. true 일시, 월요일 시작, 일요일 종료, false 일 시, 일요일 시작, 토요일 종료
   */
  $date.getWeekDates = function ( isWeekStartMonday ) {
    const first = this.getWeekFirstDate( isWeekStartMonday );
    const last = this.getWeekLastDate( isWeekStartMonday );
    const diff = last.getDate() - first.getDate();
    let index = 1;

    const result = [ first ];
    
    while ( index < diff ) {
      result.push( first.addDate( index ) );
      index++;
    }

    result.push( last );
    return result;
  };

  /**
   * 차이 일 수를 리턴한다.
   */
  $date.diff = function ( target ) {
    let x = target;
    if ( !this.constructor.isDateUtils( target ) ) {
      x = new DateUtils( target );
      if ( x.hasParsingError ) {
        console.warn(' error occurred while parsing.');
      }
    }
    
    let diff = this.getTime() - x.getTime();
    let isPositive = NumberUtils.isPositive( diff );
    let distance = Math.abs( diff );

    return isPositive 
      ? Math.floor( distance / _private.DATE.PER_HOUR )
      : Math.floor( distance / _private.DATE.PER_HOUR ) * -1;
  };

  /**
   * 차이 월 수를 리턴한다.
   */
  $date.diffMonth = function ( target ) {
    let x = target;
    if ( !this.constructor.isDateUtils( target ) ) {
      x = new DateUtils( target );
      if ( x.hasParsingError ) {
        console.warn(' error occurred while parsing.');
      }
    }

    let diff = this.getTime() - x.getTime();
    let isPositive = NumberUtils.isPositive( diff );
    let distance = Math.abs( diff );

    return isPositive 
      ? Math.floor( distance / _private.DATE.PER_DATE )
      : Math.floor( distance / _private.DATE.PER_DATE ) * -1;
  };


  /**
   * 차이 년 수를 리턴한다.
   */
  $date.diffYear = function ( target ) {
    let x = target;
    if ( !this.constructor.isDateUtils( target ) ) {
      x = new DateUtils( target );
      if ( x.hasParsingError ) {
        console.warn(' error occurred while parsing.');
      }
    }

    let diff = this.getTime() - x.getTime();
    let isPositive = NumberUtils.isPositive( diff );
    let distance = Math.abs( diff );

    return isPositive 
      ? Math.floor( distance / _private.DATE.PER_MONTH )
      : Math.floor( distance / _private.DATE.PER_MONTH ) * -1;
  };

  /**
   * 차이 시각을 리턴한다.
   */
  $date.diffHour = function ( target ) {
    let x = target;
    if ( !this.constructor.isDateUtils( target ) ) {
      x = new DateUtils( target );
      if ( x.hasParsingError ) {
        console.warn(' error occurred while parsing.');
      }
    }

    let diff = this.getTime() - x.getTime();
    let isPositive = NumberUtils.isPositive( diff );
    let distance = Math.abs( diff );

    return isPositive 
      ? Math.floor( distance / _private.DATE.PER_MINUTES )
      : Math.floor( distance / _private.DATE.PER_MINUTES ) * -1;
  };

  /**
   * 차이 분을 리턴한다.
   */
  $date.diffMinutes = function ( target ) {
    let x = target;
    if ( !this.constructor.isDateUtils( target ) ) {
      x = new DateUtils( target );
      if ( x.hasParsingError ) {
        console.warn(' error occurred while parsing.');
      }
    }

    let diff = this.getTime() - x.getTime();
    let isPositive = NumberUtils.isPositive( diff );
    let distance = Math.abs( diff );

    return isPositive 
      ? Math.floor( distance / _private.DATE.PER_SECONDS )
      : Math.floor( distance / _private.DATE.PER_SECONDS ) * -1;
  };

  /**
   * 차이 초를 리턴한다.
   */
  $date.diffSeconds = function ( target ) {
    let x = target;
    if ( !this.constructor.isDateUtils( target ) ) {
      x = new DateUtils( target );
      if ( x.hasParsingError ) {
        console.warn(' error occurred while parsing.');
      }
    }

    let diff = this.getTime() - x.getTime();
    let isPositive = NumberUtils.isPositive( diff );
    let distance = Math.abs( diff );

    return isPositive 
      ? Math.floor( distance / _private.DATE.PER_MILLI_SECONDS )
      : Math.floor( distance / _private.DATE.PER_MILLI_SECONDS ) * -1;
  };

  /**
   * 대상보다 같거나 이전인지 확인한다.
   */
  $date.isBefore = function ( target ) {
    let x = target;
    if ( !this.constructor.isDateUtils( target ) ) {
      x = new DateUtils( target );
      if ( x.hasParsingError ) {
        console.warn(' error occurred while parsing.');
      }
    }
    
    return this.getTime() <= x.getTime();
  };

  /**
   * 대상보다 같거나 이후인지 확인한다.
   */
  $date.isAfter = function ( target ) {
    let x = target;
    if ( !this.constructor.isDateUtils( target ) ) {
      x = new DateUtils( target );
      if ( x.hasParsingError ) {
        console.warn(' error occurred while parsing.');
      }
    }
    
    return this.getTime() >= x.getTime();
  };

  /**
   * 대상보다 이후인지 확인한다. (같으면 false)
   */
  $date.isFuture = function ( target ) {
    let x = target;
    if ( !this.constructor.isDateUtils( target ) ) {
      x = new DateUtils( target );
      if ( x.hasParsingError ) {
        console.warn(' error occurred while parsing.');
      }
    }
    
    return this.getTime() > x.getTime();
  };

  /**
   * 대상보다 이전인지 확인한다. (같으면 false)
   */
  $date.isPast = function ( target ) {
    let x = target;
    if ( !this.constructor.isDateUtils( target ) ) {
      x = new DateUtils( target );
      if ( x.hasParsingError ) {
        console.warn(' error occurred while parsing.');
      }
    }
    
    return this.getTime() < x.getTime();
  };

  $date.getFullYear = function () {
    return this.date.getFullYear();
  };

  $date.getMonth = function () {
    return this.date.getMonth() + 1;
  };

  $date.getDate = function () {
    return this.date.getDate();
  };

  $date.getDay = function () {
    return this.date.getDay();
  };

  $date.getHours = function () {
    return this.date.getHours();
  };

  $date.getMinutes = function () {
    return this.date.getMinutes();
  };

  $date.getSeconds = function () {
    return this.date.getSeconds();
  };

  $date.getTime = function () {
    return this.date.getTime();
  };

  //#endregion

  //#region Dom 유틸
  //#endregion

  //#region Promise
  const _Promise = function ( executor ) {
    this.state = _private.PROMISE.PENDING;
    this.value = undefined;
    this.callbacks = [];

    const resolve = function ( resolveValue ) {
      if ( !this.isPending() ) {
        return;
      }
      this.state = _private.PROMISE.FULFILLED;
      this.value = resolveValue;
      this.callbacks.forEach( function ( callback ) {
        callback.onFulfilled( resolveValue );
      } );
    }.bind( this );

    const reject = function ( rejectValue ) {
      if ( !this.isPending() ) {
        return;
      }
      this.state = _private.PROMISE.REJECTED;
      this.value = rejectValue;
      this.callbacks.forEach( function ( callback ) {
        callback.onRejected( rejectValue );
      } );
    }.bind( this );

    try {
      executor( resolve, reject );
    } catch ( err ) {
      reject( err );
    }

  };

  _Promise.prototype.isPending = function () {
    return this.state === _private.PROMISE.PENDING;
  };

  _Promise.prototype.isFulfilled = function () {
    return this.state === _private.PROMISE.FULFILLED;
  };

  _Promise.prototype.isRejected = function () {
    return this.state === _private.PROMISE.REJECTED;
  };

  _Promise.prototype.then = function ( onFulfilled ) {
    const $self = this;
    return new _Promise(function ( resolve, reject ) {
      const handleCallback = function ( callback, callbackValue ) {
        try {
          const result = callback( callbackValue );
          resolve( result );
        } catch ( err ) {
          reject( err );
        }
      };

      if ( $self.isPending() ) {
        $self.callbacks.push({
          onFulfilled: function ( value ) {
            handleCallback( onFulfilled, value );
          },
          onRejected: function ( error ) {
            reject( error );
          }
        });
      } else if ( $self.isFulfilled() ) {
        handleCallback( onFulfilled, $self.value );
      } 
    });
  };

  _Promise.prototype.catch = function ( onRejected ) {
    const $self = this;
    return new _Promise(function ( resolve, reject ) {
      const handleCallback = function ( callback, callbackValue ) {
        try {
          const result = callback( callbackValue );
          resolve( result );
        } catch ( err ) {
          reject( err );
        }
      };

      if ( $self.isPending() ) {
        $self.callbacks.push({
          onFulfilled: function( value ) {
            resolve( value );
          },
          onRejected: function ( value ) {
            handleCallback( onRejected, value );
          },
        });
      } else if ( $self.isRejected() ) {
        handleCallback( onRejected, $self.value );
      }
    });
  };
  
  _Promise.resolve = function ( value ) {
    return new _Promise(function ( resolve, reject ) {
      resolve( value );
    });
  };

  _Promise.reject = function ( error ) {
    return new _Promise(function ( resolve, reject ) {
      reject( error );
    });
  };
  
  _Promise.all = function ( promises ) {
    return new _Promise(function ( resolve, reject ) {
      const results = [];
      let completedPromises = 0;

      promises.forEach( function ( promise, index ) {
        promise.then(
          function ( value ) {
            results[index] = value;
            completedPromises++;
            if ( completedPromises === promises.length ) {
              resolve( results );
            }
          }
        ).catch( function ( err ) {
          reject( error );
        });
      });
    });
  };
  //#endregion

  //#region 공통 유틸
  const Utils = {
    string: StringUtils,
    number: NumberUtils,
    array: ArrayUtils,
    object: ObjectUtils,
    date: DateUtils,
    dom: {},
    promise: _Promise,
    http:{}
    // this.string = StringUtils;
    // this.number = NumberUtils;
    // this.array = ArrayUtils;
    // this.object = Object.freeze(new ObjectUtils());
    // this.date = DateUtils;
    // this.dom = {};
    // this.promise = _Promise;
    // this.http = {};
  };

  /**
   * Null 혹은 Undefined 인지 여부 확인
   * @param {*} target 확인할 대상
   */
  Utils.isNullOrUndefined = function (target) {
    return target == null;
  };

  /**
   * 해당 대상이 Object 타입인지 여부
   * @param {*} target 대상
   */
  Utils.isObject = ObjectUtils.isObject;

  /**
   * 해당 대상이 Object 타입이 아닌지 여부
   * @param {*} target 대상
   */
  Utils.isNotObject = function (target) { 
    return !this.isObject(target); 
  };

  /**
   * 해당 대상이 String 타입인지 여부
   * @param {*} target 
   */
  Utils.isString = StringUtils.isString;
  
  /**
   * 해당 대상이 String 타입이 아닌지 여부
   * @param {*} target 
   */
  Utils.isNotString = function (target) {
    return !this.isString(target);
  };

  /**
   * 해당 대상이 Number 타입인지 여부
   * @param {*} target 
   */
  Utils.isNumber = NumberUtils.isNumber;

  /**
   * 해당 대상이 Number 타입이 아닌지 여부
   * @param {*} target 
   */
  Utils.isNotNumber = function (target) {
    return !this.isNumber(target);
  };

  /**
   * 해당 대상이 Array 타입인지 여부
   * @param {*} target 
   */
  Utils.isArray = ArrayUtils.isArray;

  /**
   * 해당 대상이 Array 타입이 아닌지 여부
   * @param {*} target 
   */
  Utils.isNotArray = function (target) {
    return !this.isArray(target);
  };

  /**
   * 해당 대상이 Function 타입인지 여부
   * @param {*} target 
   * @param {Boolean} isStrict 
   */
  Utils.isFunction = function (target, isStrict) {
    return !!isStrict 
      ? this.getRawType(target, 1) === Function.name
      : typeof target === 'function';
  };

  /**
   * 해당 대상이 Function 타입이 아닌지 여부
   * @param {*} target 
   * @param {Boolean} isStrict 
   */
  Utils.isNotFunction = function (target, isStrict) {
    return !this.isFunction(target, isStrict);
  };

  /**
   * 해당 대상이 JQuery 타입인지 여부
   * @param {*} target 
   */
  Utils.isJQuery = function (target) {
    if ( !!global.$ ) {
      return target instanceof global.$;
    }
    return false;
  };

  Utils.isWindow = function (target) {
    return this.getRawType(target, 1, 1) === 'window';
  };

  /**
   * target 의 원시 타입을 가져온다.
   * @param {*} target 가져올 타겟
   * @param {Boolean} isOnlyTarget 본문만 가져올 것인지 여부
   * @param {Boolean} isLower 소문자로 가져올 것인지 여부
   */
  Utils.getRawType = function (target, isOnlyTarget, isLower) {
    let result = NATIVE_TO_STRING.call( target );
    if (!!isOnlyTarget) {
      result = result.slice(8, -1);
    }
    if (!!isLower) {
      result = result.toLowerCase();
    }
    return result;
  };

  /**
   * 각 요소가 같은지 확인하는 함수.
   * @param {*} target 
   * @param {*} other 
   * @param {Boolean} isStrict 강타입 체크
   * 
   * @example 
   * 
   * let obj1 = {
   *  key1: 'value1'
   * };
   * 
   * ley obj2 = {
   *  key2: 'value2'
   * };
   * 
   * H.equals(obj1, obj2);
   * // => true
   * 
   * H.equals(obj1, obj2, true);
   * // => false
   * 
   */
  Utils.eq = function (target, other, isStrict) {
    return !(this.isNullOrUndefined(target) && this.isNullOrUndefined(other)) // null or undefined check
      && this.getRawType(target) === this.getRawType(target) // same type check
      && (
        !!isStrict
          ? (target === other)  // strict type check.
          : (
            (this.isString(target) && StringUtils.eq(target, other))
            || (this.isNumber(target) && NumberUtils.eq(target, other))
            || (this.isArray(target) && ArrayUtils.eq(target, other))
            || (this.isObject(target) && ObjectUtils.eq(target, other))
          )
      );
  };

  /**
   * 깊은 복사
   * @param {*} target 복사할 대상
   */
  Utils.cp = function (target) {
    let result = {};
      
    if (this.isArray(target)) { // array
      let index = -1;
      const length = target.length;
      result = [];
      while (++index < length) {
        result[index] = this.cp(target[index]);
      }
    } else if (this.isObject(target)) { // object
      for (const key in target) {
        result[key] = this.cp(target[key]);
      }
    } else {
      result = target;
    }

    return result;
  };

  /**
   * 비어있는지 확인하는 함수
   * @param {*} target 
   */
  Utils.isEmpty = function (target) {
    if (this.isNullOrUndefined(target)) {
      return true;
    }

    if (this.isString(target) || this.isArray(target) || this.isJQuery(target)) {
      return target.length < 1;
    }

    if (this.isNumber(target)) { // 주의.
      return target === 0;
    }
    
    if (this.isObject(target)) {
      let isEmpty = true;
      for (const key in target) {
        isEmpty = false;
      }
      return isEmpty;
    }

    return false;
  };

  /**
   * 비어있지 않은지 확인하는 함수
   * @param {*} target
   */
  Utils.isNotEmpty = function (target) {
    return !this.isEmpty(target);
  };

  /**
   * 인자값들 중 하나라도 비어있으면 `true`를 반환한다.
   */
  Utils.orEmpty = function () {
    const args = ArrayUtils.toSliceArray(arguments);
    const length = args.length;
    let index = -1;

    while ( ++index < length ) {
      if ( this.isEmpty(args[index]) ) {
        return true;
      }
    }
    return false;
  };

  /**
   * 인자값들 모두가 비어있으면 `true`를 반환한다.
   */
  Utils.andEmpty = function () {
    const args = ArrayUtils.toSliceArray(arguments);
    const length = args.length;
    let index = -1;

    while ( ++index < length ) {
      if ( this.isNotEmpty(args[index]) ) {
        return false;
      }
    }
    return true;
  };

  /**
   * 브라우저 환경일 시, 파라미터가 없으면, URL의 search 프로터피를,
   * 파라미터가 있으면 해당 파라미터에 대하여 파싱하여 객체를 생성.
   * 브라우저 환경이 아닐 시, 파라미터는 필수.
   * @param {Null|String} url 
   */
  Utils.query2Object = function (url) {
    if (this.isEmpty(url)) {
      if (this.isWindow(global)) {
        url = global.location.href;
      } else {
        throw Error('Node Environment required `url` parameter');
      }
    }    

    let query = url;
    if (this.string.hasText(url, '?')) {
      const pathAndQuery = url.split('?');
      if (pathAndQuery.length !== 2) {
        throw Error('url contain two or more question marks.');
      }
      query = pathAndQuery[1];
    }

    return this.object.toObject(query, '=', '&');
  };

  /**
   * 대상 객체로 문자열을 만든다.
   * @param {*} object 
   */
  Utils.object2Query = function (object) {
    object = this.object.nvl(object);
    return this.object.toString(object, '=', '&');
  };

  /**
   * target의 타입에 따라 반환하는 replace를 함수
   * @param {*} target 
   * @param {*} replace 
   */
  Utils.nvl = function (target, replace) {
    return (
      (this.isString(target) && StringUtils.nvl(target, replace))
      || (this.isNumber(target) && NumberUtils.nvl(target, replace))
      || (this.isArray(target) && ArrayUtils.nvl(target, replace))
      || (this.isObject(target) && ObjectUtils.nvl(target, replace))
    );
  };

  /**
   * P의 기능을 확장한다.
   * @param {String} namespaces 확장할 프로퍼티 ex) 'test', 'test.test2'
   * @param {Function|Object} modules 확장할 기능
   * @param {*} _global 확장할 root
   * @example
   * 
   * P.extend('test', {
   *  hello: function () {
   *    return 'hello!';
   *  }
   * });
   * 
   * P.test.hello();
   * // => hello!
   * 
   * P.extend('test2', function () {
   *  this.a = 'hello!';
   * 
   *  this.hello = function () {
   *    return this.a;
   *  };
   * 
   *  return this;
   * });
   * 
   * P.test2.hello();
   * // => 'hello!';
   * 
   * P.extend('test.m', {
   *  hello: function () {
   *    return 'hello!';
   *  }
   * });
   * 
   * P.test.m.hello();
   * // => hello!
   * 
   */
  Utils.extend = function (namespace, modules, _global) {

    _global = !!_global ? _global : this;

    namespace = StringUtils.nvl(namespace, '');
    let parent = {};
    let target = {};
    let index = -1;

    const isModuleFunction = this.isFunction(modules);
    const namespaces = namespace.split('.');
    const length = namespaces.length;
    
    if ( length === 1 ) {
      parent[namespaces[0]] = (isModuleFunction ? new modules() : modules) || {};
    } else {
      while (++index < length) {
        if ((length - index) === 1) { // last
          target[namespaces[index]] = (isModuleFunction ? new modules() : modules) || {};
        } else {
          target = parent[namespaces[index]] = {};
        }
      }
    }

    return ObjectUtils.merge(_global, parent, true);
  };
  //#endregion

  return Utils;
});
