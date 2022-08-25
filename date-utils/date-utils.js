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

  const DATE_FORMAT_RDOT_YYYYMMDD = 'yyyy.MM.dd';
  const DATE_FORMAT_RDOT_YYYYMMDDHHMM = 'yyyy.MM.dd hh:mm';
  const DATE_FORMAT_RDOT_YYYYMMDDHHMMSS = 'yyyy.MM.dd hh:mm:ss';
  const DATE_FORMAT_RDOT_YYYYMMDDHHMMSS_SSS = 'yyyy.MM.dd hh:mm:ss.SSS';

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

  const $DATE = function(value) {

    const _this = this;
    
    _this.input = value;
    _this.date = toDate(value);

    return Object.freeze(_this);
  };

  // $DATE static function
  // $DATE.

  // 외부에서 접근할 수 있는 api 추가
  const fn = $DATE.fn = $DATE.prototype;

  fn.toString = function (format) {

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

  fn.isDate = function (value) {
    return isDate(value);
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

    return isDate(date) ? date : new Date();
  };

  const isDate = function (value) {
    return value && Object.prototype.toString.call(value) === DATE_TYPE_STRING && !isNaN(value);
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

    return zero + val;
  };

  window.$DATE = $DATE;

  return $DATE;
});