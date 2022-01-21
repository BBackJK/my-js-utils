String.prototype.isEquals = function(str) {
  return typeof str === 'string' && this.toString() === str;
}

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

String.prototype.isEmpty = function() {
  return this.toString().isEquals('');
}

Object.prototype.isEmpty = function() {
  return !Object.keys(this).length;
}

Array.prototype.isEmpty = function() {
  return !this.length;
}

Array.prototype.ieIncludes = function(data) {
  if (!data) {
    return false;
  }

  return this.indexOf(data) >= 0;
}

Array.prototype.getLastItem = function() {

  if (!this.length) {
    console.warn(' array is empty !!! ');
    return null;
  }

  return this[this.length - 1];
}

Array.prototype.getFirstItem = function() {

  if (!this.length) {
    console.warn(' array is empty !!! ');
    return null;
  }

  return this[0];
}

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
 * 객체 안에있는 value 타입이 string인 경우 trim 시킨다.
 */
Object.prototype.clear = function() {
  for (let key in this) {
    if (typeof this[key] === 'string') {
      this[key] = this[key].trim();
    }
  }
}