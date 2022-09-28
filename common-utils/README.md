# README

## 1. 공통 유틸

#### 1.1 deepCopy

`input` 값을 깊은 복사 한다.

```js
const test = {
  a: 1,
  b: {
    c: 2,
    d: 3
  },
  e: 5
};

// 얕은 복사 (object value 값 까지 복사되지 않는다.)
const test2 = Object.assign({}, test);

// 값 변경.
test2.b.d = 10;

console.log(test.b.d);  // 10 (원본도 변경됨.)
console.log(test2.b.d); // 10

// 깊은 복사
const test3 = $COMMON.deepCopy(test);

// 복사한 객체의 값 변경
test3.b.d = 20;

console.log(test.b.d);  // 10 (원본은 변경되지 않는다.)
console.log(test3.b.d); // 20
```

#### 1.2 isNullOrEmpty

`input` 값의 타입을 체크하여 비어있거나 null이거나 undefined인지 확인한다.

```js
let test1 = '',   // 비어있는 문자열 값
    test2 = 0,    // number 0
    test3 = [],   // 비어있는 배열 값
    test4 = {},   // 비어있는 객체 값
    test5 = null, // null 값
    test6;        // undefined 값

console.log($COMMON.isNullOrEmpty(test1));  // true
console.log($COMMON.isNullOrEmpty(test2));  // false
console.log($COMMON.isNullOrEmpty(test3));  // true
console.log($COMMON.isNullOrEmpty(test4));  // true
console.log($COMMON.isNullOrEmpty(test5));  // true
console.log($COMMON.isNullOrEmpty(test6));  // true
```

#### 1.3 isString

`input` 값이 string 타입 인지 확인.

```js
let test = '',
    test2 = new String(''),
    test3 = 3;

console.log($COMMON.isString(test));    // true
console.log($COMMON.isString(test2));   // true
console.log($COMMON.isString(test3));   // false
```

#### 1.4 isNumber

`input` 값이 number 타입 인지 확인.

```js
let test = '',
    test2 = new Number(0),
    test3 = 3;

console.log($COMMON.isNumber(test));    // false
console.log($COMMON.isNumber(test2));   // true
console.log($COMMON.isNumber(test3));   // true
```

#### 1.5 isObject

`input` 값이 객체 인지 확인.

```js
let test = {},
    test2 = null,
    test3 = document.createElement('div');

console.log(typeof test);               // object
console.log(typeof test2);              // object
console.log(typeof test3);              // object

console.log(test instanceof Object);    // true
console.log(test2 instanceof Object);   // false
console.log(test3 instanceof Object);   // true

console.log($COMMON.isObject(test));    // true
console.log($COMMON.isObject(test2));   // false
console.log($COMMON.isObject(test3));   // false
```
#### 1.6 isBoolean

`input` 값이 boolean 타입 인지 확인.

```js
let test = true,
    test2 = false,
    test3 = new Boolean(true),
    test4 = null;       // null 은 falsy한 값으로 false로 형변환 가능.

console.log($COMMON.isBoolean(test));     // true
console.log($COMMON.isBoolean(test2));    // true
console.log($COMMON.isBoolean(test3));    // true
console.log($COMMON.isBoolean(test4));    // false
```

#### 1.7 isUndefined

`input` 이 undefined 인지 확인.

```js
let test = undefined,
    test2 = null,
    test3;      // 초기값이 없을 시 undefined.

console.log($COMMON.isUndefined(test));     // true
console.log($COMMON.isUndefined(test2));    // false
console.log($COMMON.isUndefined(test3));    // true
```

#### 1.8 isNull

`input` 이 null 인지 확인.

```js
let test = undefined,
    test2 = null,
    test3;      // 초기값이 없을 시 undefined.

console.log($COMMON.isNull(test));     // false
console.log($COMMON.isNull(test2));    // true
console.log($COMMON.isNull(test3));    // false
```

#### 1.9 isFunction

`input` 이 function 인지 확인.

```js
let test = function () {
  console.log(' i`m function ');
};

console.log($COMMON.isFunction(test));  // true
```

#### 1.10 isElement

`input` 이 HTMLElement 인지 확인.

```js
let $div = document.createElement('div');
let $span = document.createElement('span');
$span.innerText = ' 내 부모 element는 div 이며, 저는 span 입니다. ';
$div.append($span);

console.log($div.outerHTML);            // <div><span> 내 부모 element는 div 이며, 저는 span 입니다. </span></div>

console.log($COMMON.isElement($div));   // true
console.log($COMMON.isElement($span));  // true

let $divChildrens = $div.children;

console.log($divChildrens);             // HTMLCollection

for (let $el of $divChildrens) {
  console.log($el.outerHTML);           // <span> 내 부모 element는 div 이며, 저는 span 입니다. </span>
  console.log($COMMON.isElement($el));  // true
}
```

#### 1.11 isNodeList

`input` 이 NodeList 인지 확인.

```js
let $div = document.createElement('div');

for (let i=0; i<3;i ++) {
  let $span = document.createElement('span'),
      count = (i + 1);
  $span.setAttribute('name', 'span');
  $span.innerText = ' 내 부모 element는 div 이며, 저는 '.concat(count.toString()).concat('번째 span 입니다. ');
  $div.append($span);
}

console.log($div.outerHTML); // <div><span name="span"> 내 부모 element는 div 이며, 저는 1번째 span 입니다. </span><span name="span"> 내 부모 element는 div 이며, 저는 2번째 span 입니다. </span><span name="span"> 내 부모 element는 div 이며, 저는 3번째 span 입니다. </span></div>

const $spanOfQuerySelector = $div.querySelectorAll('span');
const $spanOfTagName = $div.getElementsByTagName('span');

console.log($COMMON.isNodeList($spanOfQuerySelector));    // true
console.log($COMMON.isNodeList($spanOfTagName));          // false
```

#### 1.12 isEvent

`input` 이 Event 인지 확인.

```js
let $body = document.getElementsByTagName('body');
let $div = document.createElement('div');
$div.innerText = 'div 입니다.';

$body[0].appendChild($div);

$div.addEventListener('click', function (e) {
  console.log($COMMON.isEvent(e));  // true
});
```

#### 1.13 isDate

`input` 이 Date 타입인지 확인.

```js
let today = new Date();
console.log($COMMON.isDate(today));   // true
```

#### 1.14 hasText

첫번째 인자(문자열)가 두번째 인자(문자열)를 가지고 있는지 확인.

* 첫번째 인자 {string} : 값이 있는지 없는지 확인할 대상.
* 두번째 인자 {string} : 체크할 값

```js
let test = 'abcdefg';

console.log($COMMON.hasText(test, 'abc'));  // true
console.log($COMMON.hasText(test, 'abg'));  // false
```

#### 1.15 onlyNumberComma

null이거나 undefined가 아닌 값을 string 형태로 변환하여 숫자만 남기고 3자리 마다 콤마(,)를 찍는다.

```js
let test = '100000000000',
    test2 = '10000가나다라0000',
    test3 = 123456789,
    test4 = null;

console.log($COMMON.onlyNumberComma(test));   // 100,000,000,000
console.log($COMMON.onlyNumberComma(test2));  // 100,000,000
console.log($COMMON.onlyNumberComma(test3));  // 123,456,789
console.log($COMMON.onlyNumberComma(test4));  // ''
```

#### 1.16 onlyNumber

null이거나 undefined가 아닌 값을 string 형태로 변환하여 숫자만 남긴다.

```js
let test = '100000000000',
    test2 = '10000가나다라0000',
    test3 = 123456789,
    test4 = null;

console.log($COMMON.onlyNumber(test));   // 100000000000
console.log($COMMON.onlyNumber(test2));  // 100000000
console.log($COMMON.onlyNumber(test3));  // 123456789
console.log($COMMON.onlyNumber(test4));  // ''
```

#### 1.17 zPad

null과 undefined이 아닌 첫번째 인자에 대해서 두번째 인자 만큼 앞에 0을 채운다.

* 첫번째 인자 {*}       : null과 undefined가 아닌 모든값 (모든 타입을 toString 메소드로 string으로 변경 후 로직 수행)
* 두번째 인자 {number}  : 0으로 채울 카운트

```js
let test1 = 5,
    test2 = '10';

console.log($COMMON.zPad(test1, 2));  // 05
console.log($COMMON.zPad(test2, 5));  // 00010
```


## 2. Array 유틸

#### 2.1 hasItem

Array인 첫번째 인자가 두번째 인자인 value를 가지고 있는지 확인.

* 첫번째 인자 {array} : 확인할 array 
* 두번째 인자 {*}     : 비교할 값

```js
let test1 = [1,2,3,4,5];
let test2 = [
  {
    a: 1,
    b: 2,
  },
  {
    a: 10,
    b: 20,
  },
  {
    a: 100,
    b: 200,
  },
];

let firstObject = test2[0];

console.log($COMMON.$array.hasItem(test1, 5));            // true
console.log($COMMON.$array.hasItem(test2, firstObject));  // true
console.log($COMMON.$array.hasItem(test2, {a:1,b:2}));    // false
```

#### 2.2 getLast

Array인 첫번째 인자의 마지막 요소를 가져온다.

```js
let test1 = [1,2,3,4,5];
console.log($COMMON.$array.getLast(test1));  // 5
```

#### 2.3 findItemById

Object Array인 첫번째 인자의 요소의 id property value 값이 두번째 인자값에 해당하는 요소를 가져온다.

* 첫번째 인자 {array}         : 확인할 array 
* 두번째 인자 {string|number} : array가 가지고 있는 object 요소들 중 찾을 id property 값

```js
let test1 = [
  {
    id: 1,
    name: '첫번째 요소',
  },
  {
    id: 2,
    name: '두번째 요소',
  },
  {
    id: 3,
    name: '세번째 요소',
  },
  {
    id: 4,
    name: '네번째 요소',
  },
];

console.log($COMMON.$array.findItemById(test1, 4)); // {id: 3, name: '세번째 요소'}
console.log($COMMON.$array.findItemById(test1, 4)); // {id: 4, name: '네번째 요소'}
```

#### 2.4 findItem

Object Array인 첫번째 인자의 요소의 property 가 두번째 인자값과 일치하고 일치한 property value 값이 세번째 인자값에 해당하는 요소를 가져온다.

* 첫번째 인자 {array}         : 확인할 array 
* 두번째 인자 {string}        : array가 가지고 있는 object 요소들 중 찾을 key
* 세번째 인자 {string|number} : array가 가지고 있는 object 요소들 중 찾을 key와 일치하는 property value 

```js
let test1 = [
  {
    id: 1,
    name: '첫번째 요소',
  },
  {
    id: 2,
    name: '두번째 요소',
  },
  {
    id: 3,
    name: '세번째 요소',
  },
  {
    id: 4,
    name: '네번째 요소',
  },
];

console.log($COMMON.$array.findItem(test1, 'name', '네번째 요소'));    // {id: 4, name: '네번째 요소'}
console.log($COMMON.$array.findItem(test1, 'id', 3));               // {id: 3, name: '세번째 요소'}
console.log($COMMON.$array.findItem(test1, 'name', null));          // null
```

#### 2.5 findIndexById

Object Array인 첫번째 인자의 요소의 id property value 값이 두번째 인자값에 해당하는 요소의 index 값을 가져온다.

* 첫번째 인자 {array}         : 확인할 array 
* 두번째 인자 {string|number} : array가 가지고 있는 object 요소들 중 찾을 id property 값

```js
let test1 = [
  {
    id: 1,
    name: '첫번째 요소',
  },
  {
    id: 2,
    name: '두번째 요소',
  },
  {
    id: 3,
    name: '세번째 요소',
  },
  {
    id: 4,
    name: '네번째 요소',
  },
];

console.log($COMMON.$array.findIndexById(test1, 3));    // 2
console.log($COMMON.$array.findIndexById(test1, 1));    // 0
```

#### 2.6 findIndex

Object Array인 첫번째 인자의 요소의 property 가 두번째 인자값과 일치하고 일치한 property value 값이 세번째 인자값에 해당하는 요소의 index를 가져온다.

* 첫번째 인자 {array}         : 확인할 array 
* 두번째 인자 {string}        : array가 가지고 있는 object 요소들 중 찾을 key
* 세번째 인자 {string|number} : array가 가지고 있는 object 요소들 중 찾을 key와 일치하는 property value 

```js
let test1 = [
  {
    id: 1,
    name: '첫번째 요소',
  },
  {
    id: 2,
    name: '두번째 요소',
  },
  {
    id: 3,
    name: '세번째 요소',
  },
  {
    id: 4,
    name: '네번째 요소',
  },
];

console.log($COMMON.$array.findIndex(test1, 'name', '첫번째 요소'));     // 0
console.log($COMMON.$array.findIndex(test1, 'id', 4));                // 3
```

#### 2.7 makeIdList

Object Array인 이루어진 첫번째 인자에 대해서 id property 값을 array로 추출한다.

```js
let test1 = [
  {
    id: 1,
    name: '첫번째 요소',
  },
  {
    id: 2,
    name: '두번째 요소',
  },
  {
    id: 3,
    name: '세번째 요소',
  },
  {
    id: 4,
    name: '네번째 요소',
  },
];

console.log($COMMON.$array.makeIdList(test1));     // [1, 2, 3, 4]
```

#### 2.8 makeSeqList

number인 첫번째 인자 부터 number 인 두번째 인자까지 숫자를 나열한다.

```js
console.log($COMMON.$array.makeSeqList(1, 24)); // [1, 2, 3, ..., 22, 23, 24];
```

## 3. Object 유틸

#### 3.1 objectToQueryString

object를 query parameter에 맞게 string 변환한다.

```js
let param = {
  pageIndex: 3,
  searchValue: '테스트',
  searchTest: '테스트테스트'
};

console.log($COMMON.objectToQueryString(param)); // pageIndex=3&searchValue=%ED%85%8C%EC%8A%A4%ED%8A%B8&searchTest=%ED%85%8C%EC%8A%A4%ED%8A%B8%ED%85%8C%EC%8A%A4%ED%8A%B8
```


#### 3.2 queryStringToObject

url query string 으로 부터 object로 mapping 한다.

* 첫번째 인자 {array} : query string 중 number로 변환되어야하는 key list

```js
console.log(location.href); // http://127.0.0.1:5500/common-utils/sample.html?pageIndex=1&seasrchValue=TEST&searchType=CT001
console.log($COMMON.queryStringToObject()); // {pageIndex: '1', searchValue: 'TEST', searchType: 'CT001'}
console.log($COMMON.queryStringToObject(['pageIndex'])); // {pageIndex: 1, searchValue: 'TEST', searchType: 'CT001'}
```


#### 3.3 getUrlPathValueByDepth

url pathname 의 두번째 인자 만큼의 name value를 가져온다.

```js
console.log(location.href); // http://127.0.0.1:5500/common-utils/sample.html?pageIndex=1&seasrchValue=TEST&searchType=CT001
console.log($COMMON.getUrlPathValueByDepth(1)); // common-utils
console.log($COMMON.getUrlPathValueByDepth(2)); // sample.html
```

#### 3.4 objectCopyProperties

첫번째 인자의 property 를 두번째 인자가 가지고 있으면 두번째 인자의 property value를 첫번째 인자 property value로 복사.

* 첫번째 인자 {object}  : source
* 두번째 인자 {object}  : target

```js
let source = {
  a: 1,
  b: 2,
  c: {
    d: 3,
    e: 4
  },
  f: 5
};

let target = {
  a: '',
  c: {
    d: '',
    e: 10
  },
};

$COMMON.objectCopyProperties(source, target);
console.log(target); // {a: 1, c: { d: 3, e: 4} };
```

#### 3.5 objectClear

인자 값 object 의 property 값 초기화

number 타입은 0
array 타입은 []
boolean 타입은 false

그 외 나머지는 '' 로 초기화

```js
let source = {
  a: 1,
  b: 2,
  c: {
    d: 3,
    e: {}
  },
  f: 5
};

$COMMON.objectClear(source);
console.log(source); // {a: 0, b: 0, c: { d: 0, e: {} }, f: 0 }
```

## 4. DOM 유틸

경량 jquery 느낌.

jquery 처럼 사용 가능.

selector, element, NodeList, HTMLCollection 등을 인자로 받아

객체처럼 관리할 수 있다.

```js
const $body = document.getElementsByTagName('body')[0];
const $firstDiv = document.createElement('div');
$firstDiv.setAttribute('id', 'first');
$firstDiv.setAttribute('name', 'first-div');
$firstDiv.setAttribute('class', 'first_class');

const $secondDiv = document.createElement('div');

$secondDiv.setAttribute('id', 'second');
$secondDiv.setAttribute('name', 'second-div');
$secondDiv.setAttribute('class', 'second_class');
$secondDiv.innerText = ' 2번째 div 입니다. ';

for (let i=0; i<3; i++) {
  const $span = document.createElement('span');
  $span.setAttribute('name', 'span');
  $span.innerText = (i+1).toString() + ' 번째 span 입니다. ';
  $firstDiv.append($span);
}

$firstDiv.append($secondDiv);
$body.appendChild($firstDiv);

const $dom1 = $COMMON.$dom($firstDiv);
/**
 * {
 *  $el: [div#first.first_class]
 * }
 */
console.log($dom1);

const $dom2 = $COMMON.$dom('#first');
/**
 * {
 *  $el: [div#first.first_class]
 * }
 */
console.log($dom2);

const $dom3 = $COMMON.$dom('[name=first-div]');
/**
 * {
 *  $el: [div#first.first_class]
 * }
 */
console.log($dom3);

const $dom4 = $COMMON.$dom('.first_class');
/**
 * {
 *  $el: [div#first.first_class]
 * }
 */
console.log($dom4);

const $dom5 = $COMMON.$dom(document.getElementsByTagName('span'));
/**
 * {
 *  $el: [span, span, span]
 * }
 */
console.log($dom5);

const $dom6 = $COMMON.$dom($firstDiv.childNodes);
/**
 * {
 *  $el: [span, span, span, div#second.second_class]
 * }
 */
console.log($dom6);
```


#### 4.1 get 

dom을 가져온다.

```js
const $div = document.createElement('div');

for (let i=0; i<3; i++) {
  const $span = document.createElement('span');
  $span.setAttribute('name', 'span');
  $span.innerText = (i+1).toString() + ' 번째 span 입니다. ';
  $div.append($span);
}

/**
 * <div>
 *  <span name="span">1 번째 span 입니다.</span>
 *  <span name="span">2 번째 span 입니다.</span>
 *  <span name="span">3 번째 span 입니다.</span>
 * </div>
 */
console.log($div.outerHTML);

const $domDiv = $COMMON.$dom($div);
console.log($domDiv); // $DOM 타입의 object { $el: [div] }
console.log($domDiv.get()); // [div]
```

#### 4.2 first

찾은 dom 중 첫번째 dom을 가져온다.

```js
const $firstDiv = document.createElement('div');
$firstDiv.setAttribute('id', 'first');
$firstDiv.setAttribute('name', 'first-div');
$firstDiv.setAttribute('class', 'first_class');

const $secondDiv = document.createElement('div');

$secondDiv.setAttribute('id', 'second');
$secondDiv.setAttribute('name', 'second-div');
$secondDiv.setAttribute('class', 'second_class');

for (let i=0; i<3; i++) {
  const $span = document.createElement('span');
  $span.setAttribute('name', 'span');
  $span.innerText = (i+1).toString() + ' 번째 span 입니다. ';
  $firstDiv.append($span);
}

$firstDiv.append($secondDiv);

/**
 * <div id="first" name="first-div" class="first_class">
 *  <span name="span">1 번째 span 입니다.</span>
 *  <span name="span">2 번째 span 입니다.</span>
 *  <span name="span">3 번째 span 입니다.</span>
 *  <div id="second" name="second-div" class="second_class"></div>
 * </div>
 */
console.log($firstDiv.outerHTML);

const $domDivChilds = $COMMON.$dom($firstDiv.children);

console.log($domDivChilds); // { $el: [span, span, span, div#second.second_class] }
console.log($domDivChilds.first());  // { $el: [span] }
```

#### 4.3 last

찾은 dom 중 마지막 dom을 가져온다.

```js
const $firstDiv = document.createElement('div');
$firstDiv.setAttribute('id', 'first');
$firstDiv.setAttribute('name', 'first-div');
$firstDiv.setAttribute('class', 'first_class');

const $secondDiv = document.createElement('div');

$secondDiv.setAttribute('id', 'second');
$secondDiv.setAttribute('name', 'second-div');
$secondDiv.setAttribute('class', 'second_class');

for (let i=0; i<3; i++) {
  const $span = document.createElement('span');
  $span.setAttribute('name', 'span');
  $span.innerText = (i+1).toString() + ' 번째 span 입니다. ';
  $firstDiv.append($span);
}

$firstDiv.append($secondDiv);

/**
 * <div id="first" name="first-div" class="first_class">
 *  <span name="span">1 번째 span 입니다.</span>
 *  <span name="span">2 번째 span 입니다.</span>
 *  <span name="span">3 번째 span 입니다.</span>
 *  <div id="second" name="second-div" class="second_class"></div>
 * </div>
 */
console.log($firstDiv.outerHTML);

const $domDivChilds = $COMMON.$dom($firstDiv.children);

console.log($domDivChilds); // { $el: [span, span, span, div#second.second_class] }
console.log($domDivChilds.last());  // { $el: [div#second.second_class] }
```

#### 4.4 addEvent

찾은 dom들에게 event 부여

```js
const $firstDiv = document.createElement('div');
$firstDiv.setAttribute('id', 'first');
$firstDiv.setAttribute('name', 'first-div');
$firstDiv.setAttribute('class', 'first_class');

const $secondDiv = document.createElement('div');

$secondDiv.setAttribute('id', 'second');
$secondDiv.setAttribute('name', 'second-div');
$secondDiv.setAttribute('class', 'second_class');

for (let i=0; i<3; i++) {
  const $span = document.createElement('span');
  $span.setAttribute('name', 'span');
  $span.innerText = (i+1).toString() + ' 번째 span 입니다. ';
  $firstDiv.append($span);
}

$firstDiv.append($secondDiv);

/**
 * <div id="first" name="first-div" class="first_class">
 *  <span name="span">1 번째 span 입니다.</span>
 *  <span name="span">2 번째 span 입니다.</span>
 *  <span name="span">3 번째 span 입니다.</span>
 *  <div id="second" name="second-div" class="second_class"></div>
 * </div>
 */
console.log($firstDiv.outerHTML);

const $domDivChild = $COMMON.$dom($firstDiv.children);

$domDivChild.addEvent('click', function (e) {
  console.log(' 첫번째 span 혹은 두번째 span 혹은 세번째 span 혹은 id가 second인 div 클릭!! ');
});
```

#### 4.5 addClass

dom 에게 클래스 부여

```js
const $firstDiv = document.createElement('div');
$firstDiv.setAttribute('id', 'first');
$firstDiv.setAttribute('name', 'first-div');
$firstDiv.setAttribute('class', 'first_class');

const $secondDiv = document.createElement('div');

$secondDiv.setAttribute('id', 'second');
$secondDiv.setAttribute('name', 'second-div');
$secondDiv.setAttribute('class', 'second_class');

for (let i=0; i<3; i++) {
  const $span = document.createElement('span');
  $span.setAttribute('name', 'span');
  $span.innerText = (i+1).toString() + ' 번째 span 입니다. ';
  $firstDiv.append($span);
}

$firstDiv.append($secondDiv);

/**
 * <div id="first" name="first-div" class="first_class">
 *  <span name="span">1 번째 span 입니다.</span>
 *  <span name="span">2 번째 span 입니다.</span>
 *  <span name="span">3 번째 span 입니다.</span>
 *  <div id="second" name="second-div" class="second_class"></div>
 * </div>
 */
console.log($firstDiv.outerHTML);

const $domDiv = $COMMON.$dom($firstDiv);
$domDiv.addClass('add-class');
/**
 * <div id="first" name="first-div" class="first_class add-class"> <-- add-class 추가됨.
 *  <span name="span">1 번째 span 입니다.</span>
 *  <span name="span">2 번째 span 입니다.</span>
 *  <span name="span">3 번째 span 입니다.</span>
 *  <div id="second" name="second-div" class="second_class"></div>
 * </div>
 */
console.log($firstDiv.outerHTML);
```

#### 4.6 removeClass

dom 에게 클래스 삭제

```js
const $firstDiv = document.createElement('div');
$firstDiv.setAttribute('id', 'first');
$firstDiv.setAttribute('name', 'first-div');
$firstDiv.setAttribute('class', 'first_class');

const $secondDiv = document.createElement('div');

$secondDiv.setAttribute('id', 'second');
$secondDiv.setAttribute('name', 'second-div');
$secondDiv.setAttribute('class', 'second_class');

for (let i=0; i<3; i++) {
  const $span = document.createElement('span');
  $span.setAttribute('name', 'span');
  $span.innerText = (i+1).toString() + ' 번째 span 입니다. ';
  $firstDiv.append($span);
}

$firstDiv.append($secondDiv);

/**
 * <div id="first" name="first-div" class="first_class">
 *  <span name="span">1 번째 span 입니다.</span>
 *  <span name="span">2 번째 span 입니다.</span>
 *  <span name="span">3 번째 span 입니다.</span>
 *  <div id="second" name="second-div" class="second_class"></div>
 * </div>
 */
console.log($firstDiv.outerHTML);

const $domDiv = $COMMON.$dom($firstDiv);
$domDiv.removeClass('first_class');
/**
 * <div id="first" name="first-div" class=""> <-- first_class 라는 클래스명 삭제
 *  <span name="span">1 번째 span 입니다.</span>
 *  <span name="span">2 번째 span 입니다.</span>
 *  <span name="span">3 번째 span 입니다.</span>
 *  <div id="second" name="second-div" class="second_class"></div>
 * </div>
 */
console.log($firstDiv.outerHTML);
```

#### 4.7 toggleClass

dom 이 해당 클래스를 가지고있으면 삭제, 없으면 부여

#### 4.8 show

인자값으로 display 속성을 설정할 수 있다.

예:) $dom으로_관리하는_객체.show('flex'); // display: flex;

비어있으면 자동으로 display: '' 시켜 삭제시킨다.

* 첫번째 인자 {string}: display 속성 값

```js
const $body = document.getElementsByTagName('body')[0];

const $firstDiv = document.createElement('div');
$firstDiv.setAttribute('id', 'first');
$firstDiv.setAttribute('name', 'first-div');
$firstDiv.setAttribute('class', 'first_class');

const $secondDiv = document.createElement('div');

$secondDiv.setAttribute('id', 'second');
$secondDiv.setAttribute('name', 'second-div');
$secondDiv.setAttribute('class', 'second_class');
$secondDiv.style.display = 'none';
$secondDiv.innerText = ' 2번째 div 입니다. ';

for (let i=0; i<3; i++) {
  const $span = document.createElement('span');
  $span.setAttribute('name', 'span');
  $span.innerText = (i+1).toString() + ' 번째 span 입니다. ';
  $firstDiv.append($span);
}

$firstDiv.append($secondDiv);

$body.append($firstDiv);

/**
 * <div id="first" name="first-div" class="first_class">
 *  <span name="span">1 번째 span 입니다.</span>
 *  <span name="span">2 번째 span 입니다.</span>
 *  <span name="span">3 번째 span 입니다.</span>
 *  <div id="second" name="second-div" class="second_class" style="display:none;">2번째 div 입니다.</div>
 * </div>
 */
console.log($firstDiv.outerHTML);

const $domDivChild = $COMMON.$dom($firstDiv.childNodes);

const $domDivLastChild = $domDivChild.last();

/**
 *  <div id="second" name="second-div" class="second_class" style="display:none;">2번째 div 입니다.</div>
 */
console.log($domDivLastChild.get()[0].outerHTML);

$domDivLastChild.show();

/**
 *  <div id="second" name="second-div" class="second_class" style="">2번째 div 입니다.</div>
 */
console.log($domDivLastChild.get()[0].outerHTML);
```

#### 4.9 hide

dom 을 display none 시킨다.

```js
const $body = document.getElementsByTagName('body')[0];

const $firstDiv = document.createElement('div');
$firstDiv.setAttribute('id', 'first');
$firstDiv.setAttribute('name', 'first-div');
$firstDiv.setAttribute('class', 'first_class');

const $secondDiv = document.createElement('div');

$secondDiv.setAttribute('id', 'second');
$secondDiv.setAttribute('name', 'second-div');
$secondDiv.setAttribute('class', 'second_class');
$secondDiv.innerText = ' 2번째 div 입니다. ';

for (let i=0; i<3; i++) {
  const $span = document.createElement('span');
  $span.setAttribute('name', 'span');
  $span.innerText = (i+1).toString() + ' 번째 span 입니다. ';
  $firstDiv.append($span);
}

$firstDiv.append($secondDiv);

$body.append($firstDiv);

/**
 * <div id="first" name="first-div" class="first_class">
 *  <span name="span">1 번째 span 입니다.</span>
 *  <span name="span">2 번째 span 입니다.</span>
 *  <span name="span">3 번째 span 입니다.</span>
 *  <div id="second" name="second-div" class="second_class">2번째 div 입니다.</div>
 * </div>
 */
console.log($firstDiv.outerHTML);

const $domDivChild = $COMMON.$dom($firstDiv.childNodes);

const $domDivLastChild = $domDivChild.last();

/**
 *  <div id="second" name="second-div" class="second_class">2번째 div 입니다.</div>
 */
console.log($domDivLastChild.get()[0].outerHTML);

$domDivLastChild.hide();

/**
 *  <div id="second" name="second-div" class="second_class" style="display:none;">2번째 div 입니다.</div>
 */
console.log($domDivLastChild.get()[0].outerHTML);
```

#### 4.10 setCss

css를 나열한 객체로 인자로 받아 css를 설정한다.

```js
const $body = document.getElementsByTagName('body')[0];

const $firstDiv = document.createElement('div');
$firstDiv.setAttribute('id', 'first');
$firstDiv.setAttribute('name', 'first-div');
$firstDiv.setAttribute('class', 'first_class');

const $secondDiv = document.createElement('div');

$secondDiv.setAttribute('id', 'second');
$secondDiv.setAttribute('name', 'second-div');
$secondDiv.setAttribute('class', 'second_class');
$secondDiv.innerText = ' 2번째 div 입니다. ';

for (let i=0; i<3; i++) {
  const $span = document.createElement('span');
  $span.setAttribute('name', 'span');
  $span.innerText = (i+1).toString() + ' 번째 span 입니다. ';
  $firstDiv.append($span);
}

$firstDiv.append($secondDiv);

$body.append($firstDiv);

/**
 * <div id="first" name="first-div" class="first_class">
 *  <span name="span">1 번째 span 입니다.</span>
 *  <span name="span">2 번째 span 입니다.</span>
 *  <span name="span">3 번째 span 입니다.</span>
 *  <div id="second" name="second-div" class="second_class">2번째 div 입니다.</div>
 * </div>
 */
console.log($firstDiv.outerHTML);

const $domDivChild = $COMMON.$dom($firstDiv.childNodes);

const $domDivLastChild = $domDivChild.last();

/**
 *  <div id="second" name="second-div" class="second_class">2번째 div 입니다.</div>
 */
console.log($domDivLastChild.get()[0].outerHTML);

$domDivLastChild.setCss({
  'color': 'white',
  'background-color': 'black'
});

/**
 *  <div id="second" name="second-div" class="second_class" style="color:white;background-color: black">2번째 div 입니다.</div>
 */
  console.log($domDivLastChild.get()[0].outerHTML);
```

#### 4.11 parent

dom의 부모를 찾는다.

관리하는 dom의 개수가 여러개일 경우 각 dom의 부모를 반환 (이 때 부모가 같을 경우 중복 제거)

```js
const $body = document.getElementsByTagName('body')[0];

const $firstDiv = document.createElement('div');
$firstDiv.setAttribute('id', 'first');
$firstDiv.setAttribute('name', 'first-div');
$firstDiv.setAttribute('class', 'first_class');

const $secondDiv = document.createElement('div');

$secondDiv.setAttribute('id', 'second');
$secondDiv.setAttribute('name', 'second-div');
$secondDiv.setAttribute('class', 'second_class');
$secondDiv.innerText = ' 2번째 div 입니다. ';

for (let i=0; i<3; i++) {
  const $span = document.createElement('span');
  $span.setAttribute('name', 'span');
  $span.innerText = (i+1).toString() + ' 번째 span 입니다. ';
  $firstDiv.append($span);
}

$firstDiv.append($secondDiv);

$body.append($firstDiv);

/**
 * <div id="first" name="first-div" class="first_class">
 *  <span name="span">1 번째 span 입니다.</span>
 *  <span name="span">2 번째 span 입니다.</span>
 *  <span name="span">3 번째 span 입니다.</span>
 *  <div id="second" name="second-div" class="second_class">2번째 div 입니다.</div>
 * </div>
 */
console.log($firstDiv.outerHTML);

const $domDivChild = $COMMON.$dom($firstDiv.childNodes);

/**
 * $DOM {
 *  $el: [span, span, span, div#second.second_class]
 * }
 */
console.log($domDivChild);

const $parentsOfChild = $domDivChild.parent();
/**
 * $DOM {
 *  $el: [div#first.first_class]
 * }
 */
console.log($parentsOfChild);
```

#### 4.12 findParentById

해당 dom으로 부터 부모 중 부모의 id값이 인자값과 일치하는 요소를 반환.

#### 4.13 findParentByClass

해당 dom으로 부터 부모 중 부모의 class값이 인자값을 포함하고 요소를 반환.

#### 4.14 findParentByName

해당 dom으로 부터 부모 중 부모의 name값이 인자값을 일치하는 요소를 반환.

```js
const $body = document.getElementsByTagName('body')[0];

const $firstDiv = document.createElement('div');
$firstDiv.setAttribute('id', 'first');
$firstDiv.setAttribute('name', 'first-div');
$firstDiv.setAttribute('class', 'first_class');

const $secondDiv = document.createElement('div');

$secondDiv.setAttribute('id', 'second');
$secondDiv.setAttribute('name', 'second-div');
$secondDiv.setAttribute('class', 'second_class');
$secondDiv.innerText = ' 2번째 div 입니다. ';

for (let i=0; i<3; i++) {
  const $span = document.createElement('span');
  $span.setAttribute('name', 'span');
  $span.innerText = (i+1).toString() + ' 번째 span 입니다. ';
  $firstDiv.append($span);
}

$firstDiv.append($secondDiv);

$body.append($firstDiv);

/**
 * <div id="first" name="first-div" class="first_class">
 *  <span name="span">1 번째 span 입니다.</span>
 *  <span name="span">2 번째 span 입니다.</span>
 *  <span name="span">3 번째 span 입니다.</span>
 *  <div id="second" name="second-div" class="second_class">2번째 div 입니다.</div>
 * </div>
 */
console.log($firstDiv.outerHTML);

const $domDivChild = $COMMON.$dom($firstDiv.childNodes);

const $lastDomDivChild = $domDivChild.last();

/**
 * $DOM {
 *   $el: [div#second.second_class]
 * }
 */
console.log($lastDomDivChild);

/**
 * $DOM {
 *   $el: [div#first.first_class]
 * }
 */
console.log($lastDomDivChild.findParentById('first'));


/**
 * $DOM {
 *   $el: [div#first.first_class]
 * }
 */
console.log($lastDomDivChild.findParentByClass('first_class'));

/**
 * $DOM {
 *   $el: [div#first.first_class]
 * }
 */
console.log($lastDomDivChild.findParentByName('first-div'));
```

#### 4.15 next

선택한 요소의 다음 요소를 반환한다.

```js
const $body = document.getElementsByTagName('body')[0];

const $firstDiv = document.createElement('div');
$firstDiv.setAttribute('id', 'first');
$firstDiv.setAttribute('name', 'first-div');
$firstDiv.setAttribute('class', 'first_class');

const $secondDiv = document.createElement('div');

$secondDiv.setAttribute('id', 'second');
$secondDiv.setAttribute('name', 'second-div');
$secondDiv.setAttribute('class', 'second_class');
$secondDiv.innerText = ' 2번째 div 입니다. ';

for (let i=0; i<3; i++) {
  const $span = document.createElement('span');
  $span.setAttribute('name', 'span');
  $span.setAttribute('id', 'span'.concat((i+1).toString()))
  $span.innerText = (i+1).toString() + ' 번째 span 입니다. ';
  $firstDiv.append($span);
}

$firstDiv.append($secondDiv);

$body.append($firstDiv);

/**
 * <div id="first" name="first-div" class="first_class">
 *  <span name="span" id="span1">1 번째 span 입니다.</span>
 *  <span name="span" id="span2">2 번째 span 입니다.</span>
 *  <span name="span" id="span3">3 번째 span 입니다.</span>
 *  <div id="second" name="second-div" class="second_class">2번째 div 입니다.</div>
 * </div>
 */
console.log($firstDiv.outerHTML);

const $domDivChild = $COMMON.$dom($firstDiv.childNodes);

const $firstDomDivChild = $domDivChild.first();

/**
 * $DOM {
 *   $el: [span#span1]
 * }
 */
console.log($firstDomDivChild);

/**
 * $DOM {
 *   $el: [span#span2]
 * }
 */
console.log($firstDomDivChild.next());
```

#### 4.16 prev

선택한 요소의 이전 요소를 반환한다.

```js
const $body = document.getElementsByTagName('body')[0];

const $firstDiv = document.createElement('div');
$firstDiv.setAttribute('id', 'first');
$firstDiv.setAttribute('name', 'first-div');
$firstDiv.setAttribute('class', 'first_class');

const $secondDiv = document.createElement('div');

$secondDiv.setAttribute('id', 'second');
$secondDiv.setAttribute('name', 'second-div');
$secondDiv.setAttribute('class', 'second_class');
$secondDiv.innerText = ' 2번째 div 입니다. ';

for (let i=0; i<3; i++) {
  const $span = document.createElement('span');
  $span.setAttribute('name', 'span');
  $span.innerText = (i+1).toString() + ' 번째 span 입니다. ';
  $firstDiv.append($span);
}

$firstDiv.append($secondDiv);

$body.append($firstDiv);

/**
 * <div id="first" name="first-div" class="first_class">
 *  <span name="span">1 번째 span 입니다.</span>
 *  <span name="span">2 번째 span 입니다.</span>
 *  <span name="span">3 번째 span 입니다.</span>
 *  <div id="second" name="second-div" class="second_class">2번째 div 입니다.</div>
 * </div>
 */
console.log($firstDiv.outerHTML);

const $domDivChild = $COMMON.$dom($firstDiv.childNodes);

const $lastDomDivChild = $domDivChild.last();

/**
 * $DOM {
 *   $el: [div#second.second_class]
 * }
 */
console.log($lastDomDivChild);

/**
 * $DOM {
 *   $el: [span]
 * }
 */
console.log($lastDomDivChild.prev());
```

#### 4.17 find

선택한 dom에서 selector로 다음 요소를 찾는다.

```js
const $body = document.getElementsByTagName('body')[0];

const $firstDiv = document.createElement('div');
$firstDiv.setAttribute('id', 'first');
$firstDiv.setAttribute('name', 'first-div');
$firstDiv.setAttribute('class', 'first_class');

const $secondDiv = document.createElement('div');

$secondDiv.setAttribute('id', 'second');
$secondDiv.setAttribute('name', 'second-div');
$secondDiv.setAttribute('class', 'second_class');
$secondDiv.innerText = ' 2번째 div 입니다. ';

for (let i=0; i<3; i++) {
  const $span = document.createElement('span');
  $span.setAttribute('name', 'span');
  $span.setAttribute('id', 'span'.concat((i+1).toString()))
  $span.innerText = (i+1).toString() + ' 번째 span 입니다. ';
  $firstDiv.append($span);
}

$firstDiv.append($secondDiv);

$body.append($firstDiv);

/**
 * <div id="first" name="first-div" class="first_class">
 *  <span name="span" id="span1">1 번째 span 입니다.</span>
 *  <span name="span" id="span2">2 번째 span 입니다.</span>
 *  <span name="span" id="span3">3 번째 span 입니다.</span>
 *  <div id="second" name="second-div" class="second_class">2번째 div 입니다.</div>
 * </div>
 */
console.log($firstDiv.outerHTML);

const $domFirstDiv = $COMMON.$dom($firstDiv);

/**
 * $DOM {
 *   $el: [span#span1, span#span2, span#span3]
 * }
 */
console.log($domFirstDiv.find('span[name=span]'));

/**
 * $DOM {
 *   $el: [span#span2]
 * }
 */
console.log($domFirstDiv.find('#span2'));
```

## 5. Date 유틸

인자값을 통해서 date 객체를 관리한다.

다음과 같이 생성할 수 있다.

```js
const $test1 = new $COMMON.$date(new Date());
/**
 * $DATE {
 *  input: Wed Sep 28 2022 16:59:21 GMT+0900 (한국 표준시) {},
 *  date: Wed Sep 28 2022 16:59:21 GMT+0900 (한국 표준시) {}
 * }
 */
console.log($test1);

const $test2 = new $COMMON.$date('2022-09-28');
/**
 * $DATE {
 *  input: '2022-09-28',
 *  date: Wed Sep 28 2022 00:00:00 GMT+0900 (한국 표준시) {}
 * }
 */
console.log($test2);

const $test3 = new $COMMON.$date(2022, 9, 26, 10, 53, 20);
/**
 * $DATE {
 *  input: '2022-09-26 10:53:20',
 *  date: Mon Sep 26 2022 10:53:20 GMT+0900 (한국 표준시)
 * }
 */
console.log($test3);
```

#### 5.1 format

string 인자 format 형태로 string을 반환한다.

```js
const $test1 = new $COMMON.$date(new Date());
/**
 * $DATE {
 *  input: Wed Sep 28 2022 16:59:21 GMT+0900 (한국 표준시) {},
 *  date: Wed Sep 28 2022 16:59:21 GMT+0900 (한국 표준시) {}
 * }
 */
console.log($test1);

console.log($test1.format('yyyy-MM-dd')) // 2022-09-28
console.log($test1.format('yyyy-MM-dd hh:mm:ss')) // 2022-09-28 17:02:21
console.log($test1.format('yyyy-MM-dd hh:mm:ss.SS')) // 2022-09-28 17:02:21.157
console.log($test1.format('yyyyMMddhhmmssSS')) // 20220928170221157
```

#### 5.2 addYear

number인 인자만큼 year를 계산한다.

```js
const $test1 = new $COMMON.$date('2022-09-28');
/**
 * $DATE {
 *  input: '2022-09-28',
 *  date: Wed Sep 28 2022 00:00:00 GMT+0900 (한국 표준시) {}
 * }
 */
console.log($test1);

/**
 * $DATE {
 *  input: Thu Sep 28 2023 00:00:00 GMT+0900 (한국 표준시) {},
 *  date: Thu Sep 28 2023 00:00:00 GMT+0900 (한국 표준시) {}
 * }
 */
console.log($test1.addYear(1));
/**
 * $DATE {
 *  input: '2022-09-28',
 *  date: Wed Sep 28 2022 00:00:00 GMT+0900 (한국 표준시) {}
 * }
 * 원본은 변하지 않는다.
 */
console.log($test1);


/**
 * $DATE {
 *  input: Mon Sep 28 2020 00:00:00 GMT+0900 (한국 표준시) {},
 *  date: Mon Sep 28 2020 00:00:00 GMT+0900 (한국 표준시) {}
 * }
 */
console.log($test1.addYear(-2));
```

#### 5.3 addMonth

number인 인자만큼 월을 계산한다.

```js
const $test1 = new $COMMON.$date('2022-09-28');
/**
 * $DATE {
 *  input: '2022-09-28',
 *  date: Wed Sep 28 2022 00:00:00 GMT+0900 (한국 표준시) {}
 * }
 */
console.log($test1);

/**
 * $DATE {
 *  input: Fri Oct 28 2022 00:00:00 GMT+0900 (한국 표준시) {},
 *  date: Fri Oct 28 2022 00:00:00 GMT+0900 (한국 표준시) {}
 * }
 */
console.log($test1.addMonth(1));

/**
 * $DATE {
 *  input: Thu Jul 28 2022 00:00:00 GMT+0900 (한국 표준시) {},
 *  date: Thu Jul 28 2022 00:00:00 GMT+0900 (한국 표준시) {}
 * }
 */
console.log($test1.addMonth(-2));
```

#### 5.4 addDate

number인 인자만큼 월을 계산한다.

```js
const $test1 = new $COMMON.$date('2022-09-28');
/**
 * $DATE {
 *  input: '2022-09-28',
 *  date: Wed Sep 28 2022 00:00:00 GMT+0900 (한국 표준시) {}
 * }
 */
console.log($test1);

/**
 * $DATE {
 *  input: Thu Sep 29 2022 00:00:00 GMT+0900 (한국 표준시) {},
 *  date: Thu Sep 29 2022 00:00:00 GMT+0900 (한국 표준시) {}
 * }
 */
console.log($test1.addDate(1));

/**
 * $DATE {
 *  input: Mon Sep 26 2022 00:00:00 GMT+0900 (한국 표준시) {},
 *  date: Mon Sep 26 2022 00:00:00 GMT+0900 (한국 표준시) {}
 * }
 */
console.log($test1.addDate(-2));
```

#### 5.5 addHour

number인 인자만큼 월을 계산한다.

```js
const $test1 = new $COMMON.$date('2022-09-28');
/**
 * $DATE {
 *  input: '2022-09-28',
 *  date: Wed Sep 28 2022 00:00:00 GMT+0900 (한국 표준시) {}
 * }
 */
console.log($test1);

/**
 * $DATE {
 *  input: Wed Sep 28 2022 01:00:00 GMT+0900 (한국 표준시) {},
 *  date: Wed Sep 28 2022 01:00:00 GMT+0900 (한국 표준시) {}
 * }
 */
console.log($test1.addHour(1));

/**
 * $DATE {
 *  input: Tue Sep 27 2022 22:00:00 GMT+0900 (한국 표준시) {},
 *  date: Tue Sep 27 2022 22:00:00 GMT+0900 (한국 표준시) {}
 * }
 */
  console.log($test1.addHour(-2));
```

#### 5.6 addMinutes

number인 인자만큼 월을 계산한다.

```js
const $test1 = new $COMMON.$date('2022-09-28');
/**
 * $DATE {
 *  input: '2022-09-28',
 *  date: Wed Sep 28 2022 00:00:00 GMT+0900 (한국 표준시) {}
 * }
 */
console.log($test1);

/**
 * $DATE {
 *  input: Wed Sep 28 2022 00:10:00 GMT+0900 (한국 표준시) {},
 *  date: Wed Sep 28 2022 00:10:00 GMT+0900 (한국 표준시) {}
 * }
 */
console.log($test1.addMinutes(10));

/**
 * $DATE {
 *  input: Tue Sep 27 2022 23:30:00 GMT+0900 (한국 표준시) {},
 *  date: Tue Sep 27 2022 23:30:00 GMT+0900 (한국 표준시) {}
 * }
 */
console.log($test1.addMinutes(-30));
```

#### 5.7 parseList

관리하는 date 객체의 값들을 array로 반환한다.

[년, 월, 일, 시, 분, 초, 밀리초]

```js
const $test1 = new $COMMON.$date('2022-09-28');
/**
 * $DATE {
 *  input: '2022-09-28',
 *  date: Wed Sep 28 2022 00:00:00 GMT+0900 (한국 표준시) {}
 * }
 */
console.log($test1);

console.log($test1.parseList());  // [2022, 9, 28, 0, 0, 0, 0]
```

#### 5.8 takeInstance

관리하는 객체를 값으로 새 객체를 만들어낸다.

```js
const $test1 = new $COMMON.$date('2022-09-28');
/**
 * $DATE {
 *  input: '2022-09-28',
 *  date: Wed Sep 28 2022 00:00:00 GMT+0900 (한국 표준시) {}
 * }
 */
console.log($test1);

const $cpTest1 = $test1.takeInstance();

/**
 * $DATE {
 *  input: '2022-09-28',
 *  date: Wed Sep 28 2022 00:00:00 GMT+0900 (한국 표준시) {}
 * }
 */
console.log($cpTest1);
```

#### 5.9 isAfter

관리하는 date 객체가 인자값보다 지난 시간인지 확인.

```js
const $test1 = new $COMMON.$date('2022-09-28');
const $today = new $COMMON.$date();
/**
 * $DATE {
 *  input: '2022-09-28',
 *  date: Wed Sep 28 2022 00:00:00 GMT+0900 (한국 표준시) {}
 * }
 */
console.log($test1);

/**
 * $DATE {
 *  input: Wed Sep 28 2022 17:22:59 GMT+0900 (한국 표준시) {},
 *  date: Wed Sep 28 2022 17:22:59 GMT+0900 (한국 표준시) {}
 * }
 */
console.log($today); // 인자값이 없을 경우 거나 date 객체로 변경하지 못하는 경우 오늘날을 기준으로 객체를 만든다.


console.log($test1.isAfter($today));        // false;
console.log($test1.isAfter('2022-09-27'));  // true;
```

#### 5.10 isAfterOrSame

관리하는 date 객체가 인자값보다 지난 시간이거나 같은 시간인지 확인.

#### 5.11 isBefore

관리하는 date 객체가 인자값보다 이전 시간인지 확인.

#### 5.12 isBeforeOrSame

관리하는 date 객체가 인자값보다 이전 시간이거나 같은 시간인지 확인.

#### 5.13 isSame

관리하는 date 객체가 인자값보다 같은 시간인지 확인.


```js
const $test1 = new $COMMON.$date('2022-09-28');
const $today = new $COMMON.$date();
/**
 * $DATE {
 *  input: '2022-09-28',
 *  date: Wed Sep 28 2022 00:00:00 GMT+0900 (한국 표준시) {}
 * }
 */
console.log($test1);

/**
 * $DATE {
 *  input: Wed Sep 28 2022 17:22:59 GMT+0900 (한국 표준시) {},
 *  date: Wed Sep 28 2022 17:22:59 GMT+0900 (한국 표준시) {}
 * }
 */
console.log($today); // 인자값이 없을 경우 거나 date 객체로 변경하지 못하는 경우 오늘날을 기준으로 객체를 만든다.


console.log($test1.isAfter($today));        // false;
console.log($test1.isAfterOrSame($today));  // false;
console.log($test1.isBefore($today));       // false;
console.log($test1.isBeforeOrSame($today)); // false;
console.log($test1.isSame($today));         // false;
```

#### 5.14 takeStart

관리하는 date 객체의 해당 월의 1일의 date 객체를 반환.

```js
const $test1 = new $COMMON.$date('2022-09-28');
const $today = new $COMMON.$date();
/**
 * $DATE {
 *  input: '2022-09-28',
 *  date: Wed Sep 28 2022 00:00:00 GMT+0900 (한국 표준시) {}
 * }
 */
console.log($test1);

/**
 * $DATE {
 *  input: Thu Sep 01 2022 00:00:00 GMT+0900 (한국 표준시) {},
 *  date: Thu Sep 01 2022 00:00:00 GMT+0900 (한국 표준시) {}
 * }
 */
console.log($test1.takeStart());
```

#### 5.15 takeEnd

관리하는 date 객체의 해당 월의 1일의 date 객체를 반환.

```js
const $test1 = new $COMMON.$date('2022-09-28');
const $today = new $COMMON.$date();
/**
 * $DATE {
 *  input: '2022-09-28',
 *  date: Wed Sep 28 2022 00:00:00 GMT+0900 (한국 표준시) {}
 * }
 */
console.log($test1);

/**
 * $DATE {
 *  input: Fri Sep 30 2022 00:00:00 GMT+0900 (한국 표준시) {},
 *  date: Fri Sep 30 2022 00:00:00 GMT+0900 (한국 표준시) {}
 * }
 */
console.log($test1.takeEnd());
```

#### 5.16 takeGap

첫번째 인자값과 두번째 인자값의 차이를 배열 ([일, 시, 분 초])로 반환

* 첫번째 인자 {string|Date|DATE}  : 비교값1
* 두번째 인자 {string|Date|DATE}  : 비교값2
* 세번째 인자 {string|null}       : 차이 기준 (h: 시간까지 차이를 구함, m: 분까지 차이를 구함. s: 초까지 차이를 구함. [default]: 일까지 차이를 구함)

```js
const $test1 = new $COMMON.$date('2022-09-28');
const $today = new $COMMON.$date();
/**
 * $DATE {
 *  input: '2022-09-28',
 *  date: Wed Sep 28 2022 00:00:00 GMT+0900 (한국 표준시) {}
 * }
 */
console.log($test1);

/**
 * $DATE {
 *  input: Wed Sep 28 2022 17:30:56 GMT+0900 (한국 표준시) {},
 *  date: Wed Sep 28 2022 17:30:56 GMT+0900 (한국 표준시) {}
 * }
 */
console.log($today);


console.log($COMMON.$date.takeGap($test1, $today));       // [0, 17, 30, 56]
console.log($COMMON.$date.takeGap($test1, $today, 'h'));  // [0, 17, 30, 56]
console.log($COMMON.$date.takeGap($test1, $today, 'm'));  // [0, 0, 1050, 56]
console.log($COMMON.$date.takeGap($test1, $today, 's'));  // [0, 0, 0, 63056]


console.log($COMMON.$date.takeGap($test1, '2022-09-26 12:53'));       // [1, 11, 7, 0] (1일 11시간 7분 차이난다.)
console.log($COMMON.$date.takeGap($test1, '2022-09-26 12:53', 'h'));  // [0, 35, 7, 0] (35시간 7분 차이난다.)
console.log($COMMON.$date.takeGap($test1, '2022-09-26 12:53', 'm'));  // [0, 0, 2107, 0] (2107분 차이난다.)
console.log($COMMON.$date.takeGap($test1, '2022-09-26 12:53', 's'));  // [0, 0, 0, 126420] (126420초 차이난다.)
```
