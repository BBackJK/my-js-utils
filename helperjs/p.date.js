(function (global, factory) {
  var result;
  if (typeof module === "object" && typeof module.exports === "object") {
    // node 환경 모듈 정의 (Browser 환경 X)
  } else {
    result = factory(global);
  }

  if (
    typeof global.P !== 'undefined'
    && Object.prototype.toString.call( global.P.extend ) === '[object Function]' // extend 함수가 존재하면..
  ) {
    console.log('isExist!');
    global.P.extend('date', result);
  } else {
    if ( typeof global.P === 'undefined' ) {
      global.P = {};
    }
    global.P.date = result;
  }

})( ( typeof window !== 'undefined' ? window : this ), function ( global ) {

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
    }
  };

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

  return DateUtils;
});