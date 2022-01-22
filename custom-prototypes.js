String.prototype.isEquals = function(str) {
  return typeof str === 'string' && this.toString() === str;
}

String.prototype.isEmpty = function() {
  return this.toString().isEquals('');
}

Number.prototype.isEquals = function(num) {
  if (typeof num === 'string') {
    console.warn(' argument type is string !!! ');
    return this.valueOf() == num;
  }

  if (typeof num === 'number') {
    return this.valueOf() === num;
  }

  return false;
}

/** Object prototype S */
Object.prototype.isEquals = function(obj) {

  if (!obj) {
    return false;
  }

  const thisKeys = Object.keys(this);
  const objKeys = Object.keys(obj);

  if (thisKeys.length !== objKeys.length) {
    return false;
  }

  for (let k of thisKeys) {
    if (this[k] !== obj[k]) {
      return false;
    }
  }
  return true;
}

Object.prototype.isEmpty = function() {
  return !Object.keys(this).length;
}

/**
 * 객체 안에있는 value 타입이 string인 경우 trim 시킨다.
 */
Object.prototype.clear = function() {
  for (let key in this) {
    if (typeof this[key] === 'string') {
      this[key] = this[key].trim();
    }
  }
}
/** Object prototype E */

/** Array prototype S */
Array.prototype.isEquals = function(arr) {
  if (!arr) {
    return false;
  }

  if (this.length !== arr.length) {
    return false;
  }

  for (let i=0, l=this.length; i < l; i++) {
    if (this[i] instanceof Array && arr[i] instanceof Array) {
      if (!this[i].isEquals(arr[i])) {
        return false;
      }
    } else if (this[i] !== array[i]) {
      return false;
    }
  }
  return true;
}

Array.prototype.isEmpty = function() {
  return !this.length;
}

/**
 * ie는 array includes 지원 x 
 * @param {*} data 
 * @returns 
 */
Array.prototype.ieIncludes = function(data) {
  if (!data) {
    return false;
  }

  return this.indexOf(data) >= 0;
}

/**
 * 마지막 item 가져오기
 * @returns 
 */
Array.prototype.getLastItem = function() {

  if (!this.length) {
    console.warn(' array is empty !!! ');
    return null;
  }

  return this[this.length - 1];
}

/**
 * 첫 번째 item 가져오기
 * @returns 
 */
Array.prototype.getFirstItem = function() {

  if (!this.length) {
    console.warn(' array is empty !!! ');
    return null;
  }

  return this[0];
}

/**
 * 객체로 이루어진 Array에서 id로 해당 객체 찾기
 * @param {*} id 
 * @returns 
 */
Array.prototype.getItemById = function(id) {
  if (id === null || typeof id === 'undefined' || typeof id !== 'number') {
    console.error(' argument type is not number');
    return null;
  }

  let temp = this.filter(function(obj) {

    if (obj.id === null || typeof obj.id === 'undefined') {
      console.error(' obj is not include id property ');
      return false;
    }

    return obj.id === id;
  })[0];

  return temp;
}

/**
 * 객체로 이루어진 Array에서 Index로 해당 객체 찾기
 * @param {*} index 
 * @returns 
 */
Array.prototype.getItemByIndex = function(index) {
  if (index === null || typeof index === 'undefined' || typeof index !== 'number') {
    console.error(' argument type is not number');
    return null;
  }

  return this.filter(function(i, idx) {
    return idx.isEquals(index);
  })[0];
}

/**
 * 배열 안에 있는 값들이 오브젝트인지 확인
 */
Array.prototype.isObject = function() {
  for (let i=0,l=this.length; i<l;i++) {
    let data = this[i];

    if (Array.isArray(data)) {
      return false;
    }

    if (typeof data !== 'object') {
      return false
    }
  }
  return true;
}

/**
 * String 형태로 이루어져있는지 배열인지 체크
 */
Array.prototype.isString = function() {
  for (let i=0,l=this.length; i<l;i++) {
    let data = this[i];

    if (typeof data !== 'string') {
      return false
    }
  }
  return true;
}

/**
 * Number 형태로 이루어져있는 배열인지 체크
 */
Array.prototype.isNumber = function() {
  for (let i=0,l=this.length; i<l;i++) {
    let data = this[i];

    if (typeof data !== 'number') {
      return false
    }
  }
  return true;
}

/**
 * Number 타입으로만 이루어진 배열 Number를 string형으로 변환
 * @returns 
 */
Array.prototype.convertNumberToString = function() {
  if (!this.isNumber()) {
    console.warn(' array data type is not number ');
    return this;
  }

  return this.toString().split(',');
}
/** Array prototype E */
