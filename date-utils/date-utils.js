(function(global, factory) {
  if (typeof module === "object" && typeof module.exports === "object") {
    // node 환경 모듈 정의 (Browser 환경 X)
  } else {
    factory(global);
  }

})(typeof window !== "undefined" ? window : this, function (window) {
  
  const DATE_TYPE_STRING = '[object Date]';

  const DATE_FORMAT_TRIM_YYYYMMDD = 'yyyyMMdd';
  const DATE_FORMAT_TRIM_YYYYMMDDHHMM = 'yyyyMMddhhmm';
  const DATE_FORMAT_TRIM_YYYYMMDDHHMMSS = 'yyyyMMddhhmmss';
  const DATE_FORMAT_TRIM_YYYYMMDDHHMMSS_SSS = 'yyyyMMddhhmmssSSS';

  const DATE_FORMAT_HYPHEN_YYYYMMDD = 'yyyy-MM-dd';
  const DATE_FORMAT_HYPHEN_YYYYMMDDHHMM = 'yyyy-MM-dd hh:mm';
  const DATE_FORMAT_HYPHEN_YYYYMMDDHHMMSS = 'yyyy-MM-dd hh:mm:ss';
  const DATE_FORMAT_HYPHEN_YYYYMMDDHHMMSS_SSS = 'yyyy-MM-dd hh:mm:ss.SSS';

  const DATE_FORMAT_DOT_YYYYMMDD = 'yyyy.MM.dd';
  const DATE_FORMAT_DOT_YYYYMMDDHHMM = 'yyyy.MM.dd hh:mm';
  const DATE_FORMAT_DOT_YYYYMMDDHHMMSS = 'yyyy.MM.dd hh:mm:ss';
  const DATE_FORMAT_DOT_YYYYMMDDHHMMSS_SSS = 'yyyy.MM.dd hh:mm:ss.SSS';

  const DATE_FORMAT_RDOT_YYYYMMDD = 'dd.MM.yyyy';
  const DATE_FORMAT_RDOT_YYYYMMDDHHMM = 'dd.MM.yyyy hh:mm';
  const DATE_FORMAT_RDOT_YYYYMMDDHHMMSS = 'dd.MM.yyyy hh:mm:ss';
  const DATE_FORMAT_RDOT_YYYYMMDDHHMMSS_SSS = 'dd.MM.yyyy hh:mm:ss.SSS';

  const DATE_FORMAT_SLASH_YYYYMMDD = 'yyyy/MM/dd';
  const DATE_FORMAT_SLASH_YYYYMMDDHHMM = 'yyyy/MM/dd hh:mm';
  const DATE_FORMAT_SLASH_YYYYMMDDHHMMSS = 'yyyy/MM/dd hh:mm:ss';
  const DATE_FORMAT_SLASH_YYYYMMDDHHMMSS_SSS = 'yyyy/MM/dd hh:mm:ss.SSS';

  const DATE_FORMAT_RSLASH_YYYYMMDD = 'dd/MM/yyyy';
  const DATE_FORMAT_RSLASH_YYYYMMDDHHMM = 'dd/MM/yyyy hh:mm';
  const DATE_FORMAT_RSLASH_YYYYMMDDHHMMSS = 'dd/MM/yyyy hh:mm:ss';
  const DATE_FORMAT_RSLASH_YYYYMMDDHHMMSS_SSS = 'dd/MM/yyyy hh:mm:ss.SSS';

  // 01/09/2022, 19:00:00 or 01/09/2022 19:00:00
  const STR_DATE_FORMAT_DATETIME_REVERSE_SLASH_REG = /^[0-9]{1,2}\/[0-9]{1,2}\/[0-9]{4}[,]?\s[0-9]{1,2}\:[0-9]{1,2}\:[0-9]{1,2}$/;
  // 01/09/2022
  const STR_DATE_FORMAT_DATE_REVERSE_SLASH_REG = /^[0-9]{1,2}\/[0-9]{1,2}\/[0-9]{4}$/;
  // 2022/09/01 18:00:00
  const STR_DATE_FORMAT_DATETIME_SLASH_REG = /^[0-9]{4}\/[0-9]{1,2}\/[0-9]{1,2}\s[0-9]{1,2}\:[0-9]{1,2}\:[0-9]{1,2}$/;
  // 2022/09/01
  const STR_DATE_FORMAT_DATE_SLASH_REG = /^[0-9]{4}\/[0-9]{1,2}\/[0-9]{1,2}$/;

  // 2022-09-01 18:00:00
  const STR_DATE_FORMAT_DATETIME_HYPHEN_REG = /^[0-9]{4}\-[0-9]{1,2}\-[0-9]{1,2}\s[0-9]{1,2}\:[0-9]{1,2}\:[0-9]{1,2}$/;
  // 2022-09-01
  const STR_DATE_FORMAT_DATE_HYPHEN_REG = /^[0-9]{4}\-[0-9]{1,2}\-[0-9]{1,2}$/;

  // 2022-09-01 18:00:00
  const STR_DATE_FORMAT_DATETIME_DOT_REG = /^[0-9]{4}\.[0-9]{1,2}\.[0-9]{1,2}\s[0-9]{1,2}\:[0-9]{1,2}\:[0-9]{1,2}$/;
  // 2022-09-01
  const STR_DATE_FORMAT_DATE_DOT_REG = /^[0-9]{4}\.[0-9]{1,2}\.[0-9]{1,2}$/;

  // 20220901180000
  const STR_DATE_FORMAT_DATETIME_TRIM_REG = /^[0-9]{4}[0-9]{1,2}[0-9]{1,2}[0-9]{1,2}[0-9]{1,2}[0-9]{1,2}$/;
  // 20220901
  const STR_DATE_FORMAT_DATE_TRIM_REG = /^[0-9]{4}[0-9]{1,2}[0-9]{1,2}$/;

  // iso string
  const STR_DATE_FORMAT_ISO_REG = /^(?:\d{4})-(?:\d{2})-(?:\d{2})T(?:\d{2}):(?:\d{2}):(?:\d{2}(?:\.\d*)?)(?:(?:-(?:\d{2}):(?:\d{2})|Z)?)$/;
  
  const PER_MILLI_SECONDS = 1000;
  const PER_SECONDS = PER_MILLI_SECONDS * 60;
  const PER_MINUTES = PER_SECONDS * 60;
  const PER_HOUR = PER_MINUTES * 24;
  const PER_DATE = PER_HOUR * 30;
  const PER_MONTH = PER_DATE * 12;

  // 객체
  const $DATE = function() {

    const _this = this;

    let _input = undefined;
    
    if (arguments.length < 1) {
      _input = new Date();
    } else if (arguments.length === 1 && isString(arguments[0])) {
      _input = arguments[0];
    } else {

      const args = Array.prototype.slice.call(arguments);

      for (let i=args.length; i < 6; i++) {
        args.push( i < 3 ? 1 : 0);
      }

      const _args = args.map(function (arg) {
        return zp(arg.toString(), 2);
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

  /**
   * argument가 date 타입인지 확인
   * 예시; console.log($DATE.isDate(new Date())); // true
   * @param {*} value 
   */
  $DATE.isDate = function (value) {
    return isDate(value);
  };

  /**
   * arugment가 this 타입인지 확인
   * 예시;
   * const test = new $DATE('2022-08-25);
   * console.log($DATE.isDATE(test)); // true
   * @param {*} value 
   */
  $DATE.isDATE = function (value) {
    return value instanceof $DATE;
  };
  //endregion

  /**
   * 두 개의 augument 의 차이를 배열값으로 반환
   * limitType으로 제한을 둘 수 있음.
   * 예시;
   * console.log($DATE.takeGap('2022-08-25 13:00:00', '2022-09-01 12:00', 'date'));
   * // [0, 0, 6, 23, 0, 0] [년, 월, 일, 시간, 분, 초]
   * @param {*} val1 date로 변환될 값1
   * @param {*} val2 date로 변환될 값2
   * @param {*} limitType 어떤 종류까지 값을 나오게 할 것인지 (['year' (default), 'month', 'date', 'hours', 'minutes', 'seconds'])
   */
  $DATE.takeGap = function (val1, val2, limitType) {
    const date1 = getCompareValueToDate(val1);
    const date2 = getCompareValueToDate(val2);

    if (!isDate(date1) || !isDate(date2)) {
      console.error(' argument value can not convert to Date. ');
      return [];
    }

    let distance = date1.getTime() - date2.getTime();

    // 작을 시 강제로 양수화
    if (distance < 0) {
      distance *= -1;
    }

    let gapYear = 0;
    let gapMonth = 0;
    let gapDate = 0;
    let gapHours = 0;
    let gapMinutes = 0;
    let gapSeconds = 0;

    switch (limitType) {
      case 'month':
        gapMonth = Math.floor(distance/PER_DATE);
        gapDate = Math.floor((distance % PER_DATE)/PER_HOUR);
        gapHours = Math.floor((distance % PER_HOUR)/PER_MINUTES);
        gapMinutes = Math.floor((distance % PER_MINUTES)/PER_SECONDS);
        gapSeconds = Math.floor((distance % PER_SECONDS)/PER_MILLI_SECONDS);
        break;
      case 'date':
        gapDate = Math.floor(distance/PER_HOUR);
        gapHours = Math.floor((distance % PER_HOUR)/PER_MINUTES);
        gapMinutes = Math.floor((distance % PER_MINUTES)/PER_SECONDS);
        gapSeconds = Math.floor((distance % PER_SECONDS)/PER_MILLI_SECONDS);
        break;
      case 'hours':
        gapHours = Math.floor(distance/PER_MINUTES);
        gapMinutes = Math.floor((distance % PER_MINUTES)/PER_SECONDS);
        gapSeconds = Math.floor((distance % PER_SECONDS)/PER_MILLI_SECONDS);
        break;
      case 'minutes':
        gapMinutes = Math.floor(distance/PER_SECONDS);
        gapSeconds = Math.floor((distance % PER_SECONDS)/PER_MILLI_SECONDS);
        break;
      case 'seconds':
        gapSeconds = Math.floor(distance/PER_MILLI_SECONDS);
        break;
      default:
        gapYear = Math.floor(distance/PER_MONTH);
        gapMonth = Math.floor((distance % PER_MONTH)/PER_DATE);
        gapDate = Math.floor((distance % PER_DATE)/PER_HOUR);
        gapHours = Math.floor((distance % PER_HOUR)/PER_MINUTES);
        gapMinutes = Math.floor((distance % PER_MINUTES)/PER_SECONDS);
        gapSeconds = Math.floor((distance % PER_SECONDS)/PER_MILLI_SECONDS);
        break;
    }  

    return [gapYear, gapMonth, gapDate, gapHours, gapMinutes, gapSeconds];
  };

  /**
   * argument 사이 모든 DATE를 구한다.
   * @param {*} val1 string or number or date
   * @param {*} val2 string or number or date
   * @param {*} step number
   * 예시;
   * const arr = $DATE.takeBetweenList('2022-10-01', '2022-09-01', 2);
   * if (Array.isArray(arr)) {
      const arr2 = arr.map(function ($) {
        return $.toString('yyyy-mm-dd');
      });

      console.log(arr2); // ['2022-09-01', '2022-09-03', '2022-09-05', ... , '2022-09-29', '2022-10-01'];
    }
   */
  $DATE.takeBetweenList = function (val1, val2, step) {

    if (typeof step !== 'number') {
      step = 1;
    }

    const date1 = getCompareValueToDate(val1);
    const date2 = getCompareValueToDate(val2);

    if (!isDate(date1) || !isDate(date2)) {
      console.error(' argument value can not convert to Date. ');
      return [];
    }

    let startDate = date1;
    let endDate = date2;

    if (date1.getTime() >= date2.getTime()) {
      startDate = date2;
      endDate = date1;
    }

    let result = [];

    while (startDate <= endDate) {
      result.push(new $DATE(startDate));
      startDate.setDate(startDate.getDate() + step);
    }

    return result;
  };

  // 외부에서 접근할 수 있는 api 추가
  const fn = $DATE.fn = $DATE.prototype;

  /**
   * @Deprecated
   * format을 받아서 format형태로 알맞게 변환
   * 지원 포맷
   * yyyyMMdd | yyyyMMddhhmm | yyyyMMddhhmmss | yyyyMMddhhmmssSSS
   * yyyy-MM-dd | yyyy-MM-dd hh:mm | yyyy-MM-dd hh:mm:ss | yyyy-MM-dd hh:mm:ss.SSS
   * yyyy.MM.dd | yyyy.MM.dd hh:mm | yyyy.MM.dd hh:mm:ss | yyyy.MM.dd hh:mm:ss.SSS
   * dd.MM.yyyy | dd.MM.yyyy hh:mm | dd.MM.yyyy hh:mm:ss | dd.MM.yyyy hh:mm:ss.SSS
   * yyyy/MM/dd | yyyy/MM/dd hh:mm | yyyy/MM/dd hh:mm:ss | yyyy/MM/dd hh:mm:ss.SSS
   * dd/MM/yyyy | dd/MM/yyyy hh:mm | dd/MM/yyyy hh:mm:ss | dd/MM/yyyy hh:mm:ss.SSS
   * 예시;
   * const test = new $DATE('2022-08-25');
   * console.log(test.toString('yyyyMMddhhmm')); // 202208250000
   * console.log(test.toString('yyyy-MM-dd hh:mm')); // 2022-08-25 00:00
   * @param {*} format 
   */
  fn.toString = function (format) {

    throw new Error(' [toString] 메소드는 deprecated 되었습니다. ');

    let result = '';

    const dt = this.date;

    if (!isDate(dt)) {
      return result;
    }
  
    format = format || '';


    switch (format.toLocaleLowerCase()) {
      case DATE_FORMAT_TRIM_YYYYMMDD.toLocaleLowerCase():
        result = getDateArr(dt).join('');
        break;
      case DATE_FORMAT_TRIM_YYYYMMDDHHMM.toLocaleLowerCase():
        result = getDateArr(dt).join('').concat(getHourMinutesString(dt).replace(/\:/gi, ''));
        break;
      case DATE_FORMAT_TRIM_YYYYMMDDHHMMSS.toLocaleLowerCase():
        result = getDateArr(dt).join('').concat(getTimeString(dt).replace(/\:/gi, ''));
        break;
      case DATE_FORMAT_TRIM_YYYYMMDDHHMMSS_SSS.toLocaleLowerCase():
        result = getDateArr(dt).join('').concat(getFullTimeString(dt).replace(/\:|\./gi, ''));
        break;


      case DATE_FORMAT_HYPHEN_YYYYMMDD.toLocaleLowerCase():
        result = getDateArr(dt).join('-');
        break;
      case DATE_FORMAT_HYPHEN_YYYYMMDDHHMM.toLocaleLowerCase():
        result = getDateArr(dt).join('-').concat(' ').concat(getHourMinutesString(dt));
        break;
      case DATE_FORMAT_HYPHEN_YYYYMMDDHHMMSS.toLocaleLowerCase():
        result = getDateArr(dt).join('-').concat(' ').concat(getTimeString(dt));
        break;
      case DATE_FORMAT_HYPHEN_YYYYMMDDHHMMSS_SSS.toLocaleLowerCase():
        result = getDateArr(dt).join('-').concat(' ').concat(getFullTimeString(dt));
        break;

      case DATE_FORMAT_DOT_YYYYMMDD.toLocaleLowerCase():
        result = getDateArr(dt).join('.');
        break;
      case DATE_FORMAT_DOT_YYYYMMDDHHMM.toLocaleLowerCase():
        result = getDateArr(dt).join('.').concat(' ').concat(getHourMinutesString(dt));
        break;
      case DATE_FORMAT_DOT_YYYYMMDDHHMMSS.toLocaleLowerCase():
        result = getDateArr(dt).join('.').concat(' ').concat(getTimeString(dt));
        break;
      case DATE_FORMAT_DOT_YYYYMMDDHHMMSS_SSS.toLocaleLowerCase():
        result = getDateArr(dt).join('.').concat(' ').concat(getFullTimeString(dt));
        break;

      case DATE_FORMAT_RDOT_YYYYMMDD.toLocaleLowerCase():
        result = getDateArr(dt).reverse().join('.');
        break;
      case DATE_FORMAT_RDOT_YYYYMMDDHHMM.toLocaleLowerCase():
        result = getDateArr(dt).reverse().join('.').concat(' ').concat(getHourMinutesString(dt));
        break;
      case DATE_FORMAT_RDOT_YYYYMMDDHHMMSS.toLocaleLowerCase():
        result = getDateArr(dt).reverse().join('.').concat(' ').concat(getTimeString(dt));
        break;
      case DATE_FORMAT_RDOT_YYYYMMDDHHMMSS_SSS.toLocaleLowerCase():
        result = getDateArr(dt).reverse().join('.').concat(' ').concat(getFullTimeString(dt));
        break;

      case DATE_FORMAT_SLASH_YYYYMMDD.toLocaleLowerCase():
        result = getDateArr(dt).join('/');
        break;
      case DATE_FORMAT_SLASH_YYYYMMDDHHMM.toLocaleLowerCase():
        result = getDateArr(dt).join('/').concat(' ').concat(getHourMinutesString(dt));
        break;
      case DATE_FORMAT_SLASH_YYYYMMDDHHMMSS.toLocaleLowerCase():
        result = getDateArr(dt).join('/').concat(' ').concat(getTimeString(dt));
        break;
      case DATE_FORMAT_SLASH_YYYYMMDDHHMMSS_SSS.toLocaleLowerCase():
        result = getDateArr(dt).join('/').concat(' ').concat(getFullTimeString(dt));
        break;

      case DATE_FORMAT_RSLASH_YYYYMMDD.toLocaleLowerCase():
        result = getDateArr(dt).reverse().join('/');
        break;
      case DATE_FORMAT_RSLASH_YYYYMMDDHHMM.toLocaleLowerCase():
        result = getDateArr(dt).reverse().join('/').concat(' ').concat(getHourMinutesString(dt));
        break;
      case DATE_FORMAT_RSLASH_YYYYMMDDHHMMSS.toLocaleLowerCase():
        result = getDateArr(dt).reverse().join('/').concat(' ').concat(getTimeString(dt));
        break;
      case DATE_FORMAT_RSLASH_YYYYMMDDHHMMSS_SSS.toLocaleLowerCase():
        result = getDateArr(dt).reverse().join('/').concat(' ').concat(getFullTimeString(dt));
        break;

      default:
        result = getDateArr(dt).join('-').concat(' ').concat(getTimeString(dt));
        break;
    }

    return result;
  };

  /**
   * format을 받아서 format형태로 알맞게 변환
   * @param {string} format 
   */
  fn.format = function (format) {

    format = isString(format) ? format : '';

    const dt = this.date;

    if (!isDate(dt)) {
      return '';
    }
  
    let weekName = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];

    return format.replace(/(yyyy|yy|MM|dd|E|hh|mm|ss|a\/p)/gi, function ($1) {
      switch ($1) {
          case "yyyy":
              return dt.getFullYear();
          case "yy":
              return zp(dt.getFullYear() % 1000, 2);
          case "MM":
              return zp(dt.getMonth() + 1, 2);
          case "dd":
              return zp(dt.getDate(), 2);
          case "E":
              return weekName[dt.getDay()];
          case "HH":
              return zp(dt.getHours(), 2);
          case "hh":
              return zp((h = dt.getHours() % 12) ? h : 12, 2);
          case "mm":
              return zp(dt.getMinutes(), 2);
          case "ss":
              return zp(dt.getSeconds(), 2);
          case "a/p":
              return dt.getHours() < 12 ? "오전" : "오후";
          default:
              return $1;
      }
    });
  };

  /**
   * argument 값 만큼 year을 계산
   * 예시;
   * const test = new $DATE('2022-08-25');
   * const afterTwoYearDATE = test.addYear(2);
   * console.log(afterTwoYearDATE.date); // Sun Aug 25 2024 00:00:00 GMT+0900 (한국 표준시)
   * console.log(afterTwoYearDATE.toString('yyyy.MM.dd')); // 2024.08.25
   * @param {*} year 
   */
  fn.addYear = function (year) {
    let arr = getDateTimeArr(this.date);
    if (arr.length !== 7) {
      return null;
    }

    const newDate = new Date(
      Number(arr[0]) + year
      , Number(arr[1]) - 1
      , Number(arr[2])
      , Number(arr[3])
      , Number(arr[4])
      , Number(arr[5])
      , Number(arr[6])
    );

    return new $DATE(newDate);
  };

  /**
   * argument 값 만큼 month 을 계산
   * 예시;
   * const test = new $DATE('2022-08-25');
   * const afterTwoMonthDATE = test.addMonth(2);
   * console.log(afterTwoMonthDATE.date); // Tue Oct 25 2022 00:00:00 GMT+0900 (한국 표준시)
   * console.log(afterTwoMonthDATE.toString('yyyy.MM.dd')); 2022.10.25
   * @param {*} month 
   */
  fn.addMonth = function (month) {
    let arr = getDateTimeArr(this.date);
    if (arr.length !== 7) {
      return null;
    }

    const newDate = new Date(
      Number(arr[0])
      , Number(arr[1]) - 1 + month
      , Number(arr[2])
      , Number(arr[3])
      , Number(arr[4])
      , Number(arr[5])
      , Number(arr[6])
    );

    return new $DATE(newDate);
  };

  /**
   * argument 값 만큼 date 을 계산
   * 예시;
   * const test = new $DATE('2022-08-25');
   * const test2 = test.addDate(100);
   * console.log(test2.date); // Sat Dec 03 2022 00:00:00 GMT+0900 (한국 표준시)
   * console.log(test2.toString('yyyy.MM.dd')); // 2022.12.03
   * @param {*} date 
   */
  fn.addDate = function (date) {
    let arr = getDateTimeArr(this.date);
    if (arr.length !== 7) {
      return null;
    }

    const newDate = new Date(
      Number(arr[0])
      , Number(arr[1]) - 1
      , Number(arr[2]) + date
      , Number(arr[3])
      , Number(arr[4])
      , Number(arr[5])
      , Number(arr[6])
    );

    return new $DATE(newDate);
  };

  /**
   * 깊은 복사
   */
  fn.takeInstance = function () {
    return new $DATE(this.input);
  };

  /**
   * this 보다 argument (value)가 미래 인지 판단
   * 예시;
   * const test = new $DATE('2022-08-25');
   * const test2 = test.addDate(100);
   * console.log(test2.isAfter(test)); // true
   * console.log(test.isAfter(test2)); // false
   * @param {*} value 
   */
  fn.isAfter = function (value) {
    if (!value) {
      return false;
    }

    let compareDate = getCompareValueToDate(value);
    if (!isDate(compareDate)) {
      return false;
    }

    return compareDate.getTime() < this.date.getTime();
  };

   /**
   * this 보다 argument (value)가 과거 인지 판단
   * 예시;
   * const test = new $DATE('2022-08-25');
   * const test2 = test.addDate(100);
   * console.log(test2.isBefore(test)); // false
   * console.log(test.isBefore(test2)); // true
   * @param {*} value 
   */
  fn.isBefore = function (value) {
    if (!value) {
      return false;
    }

    let compareDate = getCompareValueToDate(value);
    if (!isDate(compareDate)) {
      return false;
    }

    return compareDate.getTime() > this.date.getTime();
  };

  /**
   * this 보다 argument (value)가 같은지 판단
   * 예시;
   * const test = new $DATE('2022-08-25');
   * const test2 = test.takeInstance();
   * console.log(test.isSame(test2));
   * @param {*} value 
   */
  fn.isSame = function (value) {
    if (!value) {
      return false;
    }

    let compareDate = getCompareValueToDate(value);
    if (!isDate(compareDate)) {
      return false;
    }

    return compareDate.getTime() === this.date.getTime();
  };

  /**
   * 객체의 시작일 구하기
   * 예시;
   * const test = new $DATE('2022-08-25');
   * const sTest = test.takeStart();
   * console.log(sTest.date); // Mon Aug 01 2022 00:00:00 GMT+0900 (한국 표준시)
   * console.log(sTest.toString('yyyy-mm-dd hh:mm')); // 2022-08-01 00:00
   */
  fn.takeStart = function () {
    let arr = getDateArr(this.date);

    if (arr.length !== 3) {
      return null;
    }

    return new $DATE(new Date(arr[0], arr[1] - 1, 1));
  };

  /**
   * 객체의 마지막일 구하기
   * 예시;
   * const test = new $DATE('2022-08-25');
   * const eTest = test.takeEnd();
   * console.log(eTest.date); // Wed Aug 31 2022 00:00:00 GMT+0900 (한국 표준시)
   * console.log(eTest.toString('yyyy-mm-dd hh:mm')); // 2022-08-31 00:00
   */
  fn.takeEnd = function () {
    let arr = getDateArr(this.date);

    if (arr.length !== 3) {
      return null;
    }

    return new $DATE(new Date(arr[0], arr[1], 0));
  };

  const getHourMinutesString = function (date) {
    return getHMSSArr(date).slice(0, 2).join(':');
  };

  const getTimeString = function (date) {
    return getHMSSArr(date).slice(0, 3).join(':');
  };

  const getFullTimeString = function (date) {
    const fullTimeArr = getHMSSArr(date);

    if (fullTimeArr.length !== 4) {
      return '';
    }

    const msArr = fullTimeArr.splice(fullTimeArr.length - 1, 1);

    if (!msArr.length) {
      return '';
    }

    return fullTimeArr.join(':').concat('.').concat(msArr[0]);
  };

  const getDateArr = function (date) {
    const fullDateArr = getDateTimeArr(date);

    if (fullDateArr.length === 7) {
      return fullDateArr.slice(0, 3);
    }
    return fullDateArr;
  };

  const getHMSSArr = function (date) {
    const fullDateArr = getDateTimeArr(date);

    if (fullDateArr.length === 7) {
      return fullDateArr.slice(3);
    }
    return fullDateArr;
  };

  const getDateTimeArr = function (date) {
    
    if (!isDate(date)) {
      return [];
    }

    const _year = zp(date.getFullYear());
    const _month = zp(date.getMonth() + 1, 2);
    const _date = zp(date.getDate(), 2);
    const _hour = zp(date.getHours(), 2);
    const _minutes = zp(date.getMinutes(), 2);
    const _seconds = zp(date.getSeconds(), 2);
    const _mSeconds = zp(date.getMilliseconds(), 3);

    return [
      _year, _month, _date,
      _hour, _minutes, _seconds,
      _mSeconds
    ];
  };

  const toDate = function (input) {

    let val = '';

    // safari에서 하이픈은 format으로 안먹힘.
    if (STR_DATE_FORMAT_DATETIME_HYPHEN_REG.test(input) || STR_DATE_FORMAT_DATE_HYPHEN_REG.test(input)) {
      val = input.replace(/\-/gi, '/');
    } else if (STR_DATE_FORMAT_DATETIME_DOT_REG.test(input) || STR_DATE_FORMAT_DATE_DOT_REG.test(input)) {
      val = input.replace(/\./, '/');
    } else {
      val = input;
    }

    const date = isDate(val) ? val : new Date(val);

    return isDate(date) ? new Date(date.getTime()) : new Date();
  };

  const isDate = function (value) {
    return value && Object.prototype.toString.call(value) === DATE_TYPE_STRING && !isNaN(value);
  };

  const isString = function (value) {
    return typeof value === 'string';
  };

  const zp = function (value, count) {
    if (value === null || value === undefined) {
      return '';
    }

    if (typeof count !== 'number') {
      count = 0;
    }
    
    const val = value.toString();

    const zeroLength = count - val.length;

    let zero = '';

    if (zeroLength > 0) {
      for (let i = 0; i < zeroLength ;i++) {
        zero+='0';
      }
    }

    return zero.concat(val);
  };

  const getCompareValueToDate = function (value) {
    let compareDate = null;

    if (isString(value)) {
      compareDate = toDate(value);
    } else if (isDate(value)) {
      compareDate = value;
    } else if ($DATE.isDATE(value)) {
      compareDate = new Date(value.date.getTime());
    } else {
      compareDate = new Date(value);
    }

    return compareDate;
  };

  window.$DATE = $DATE;

  return $DATE;
});