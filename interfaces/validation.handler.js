exports.run = function(list) {
  if (!Array.isArray(list)) {
    return {
      validator: 'none',
      msg: '비정상적인 접근입니다.'
    };
  }
  for (var i = 0; i < list.length; i++) {
    if (this[list[i].validator]) {
      var msg = this[list[i].validator](list[i].value, list[i].required);
      if (msg) return {
        validator: list[i].validator,
        msg: msg
      };
    } else {
      return {
        validator: list[i].validator,
        msg: '정의되지 않는 검증 모델입니다.'
      };
    }
  }
};

exports.AdjustPageQuery = function (query, defaultPage, defaultPageSize) {

  var rep = this.run([{
    required: true,
    value: query.page,
    validator: 'page'
  }, {
    required: true,
    value: query.pageSize,
    validator: 'pageSize'
  }]);

  if (rep) {
    query.page = defaultPage ? defaultPage : 1;
    query.pageSize = defaultPageSize ? defaultPageSize : 20;
  } else {
    query.page = Number(query.page);
    query.pageSize = Number(query.pageSize);
  }
}

exports.CheckValidString = function(value) {
  if(value === null || value === undefined || value === '') {
    return null;
  } else if(typeof value !== 'string') {
    return undefined;
  }
  return value;
};

exports.CheckValidNumber = function(value) {
  if(value === null || value === undefined || value === '') {
    return null;
  } else if(typeof value !== 'string' && typeof value !== 'number') {
    return undefined;
  } else if(isNaN(value)) {
    return undefined;
  }
  return Number(value);
};

exports.CheckValidBoolean = function(value) {
  if(value === null || value === undefined || value === '') {
    return null;
  } else if(typeof value === 'string' && value === 'true') {
    return true;
  } else if(typeof value === 'string' && value === 'false') {
    return false;
  } else if(typeof value !== 'boolean') {
    return undefined;
  }
  return value;
};

exports.CheckValidArray = function(value) {
  if(value === null || value === undefined || value === '') {
    return null;
  } else if(!Array.isArray(value)) {
    return undefined;
  }
  return value;
};

exports.page = function(value, required) {
  value = this.CheckValidNumber(value);
  if (value === null && required === false) {
    return null;
  } else if (value === null && required === true) {
    return '페이지는 필수 입력 항목입니다.';
  } else if (value === undefined) {
    return '페이지에 적합한 입력이 아닙니다.';
  } else if (value < 1) {
    return '페이지는 1보다 작을 수 없습니다.';
  }
  return null;
};

exports.pageSize = function(value, required) {
  value = this.CheckValidNumber(value);
  if (value === null && required === false) {
    return null;
  } else if (value === null && required === true) {
    return '페이지 사이즈는 필수 입력 항목입니다.';
  } else if (value === undefined) {
    return '페이지 사이즈에 적합한 입력이 아닙니다.';
  } else if (value < 1) {
    return '페이지 사이즈는 1보다 작을 수 없습니다.';
  }
  return null;
};

exports.cash = function(value, required) {
  value = this.CheckValidNumber(value);
  if (value === null && required === false) {
    return null;
  } else if (value === null && required === true) {
    return '캐쉬는 필수 입력 항목입니다.';
  } else if (value === undefined) {
    return '캐쉬에 적합한 입력이 아닙니다.';
  } else if (value < 0) {
    return '캐쉬는 0원 미만이 될 수 없습니다.';
  }
  return null;
};

exports.chip = function(value, required) {
  value = this.CheckValidNumber(value);
  if (value === null && required === false) {
    return null;
  } else if (value === null && required === true) {
    return '게임머니는 필수 입력 항목입니다.';
  } else if (value === undefined) {
    return '게임머니에 적합한 입력이 아닙니다.';
  } else if (value < 0) {
    return '게임머니는 0원 미만이 될 수 없습니다.';
  }
  return null;
};

exports.point = function(value, required) {
  value = this.CheckValidNumber(value);
  if (value === null && required === false) {
    return null;
  } else if (value === null && required === true) {
    return '포인트는 필수 입력 항목입니다.';
  } else if (value === undefined) {
    return '포인트에 적합한 입력이 아닙니다.';
  } else if (value < 0) {
    return '포인트는 0원 미만이 될 수 없습니다.';
  }
  return null;
};

exports.debt = function(value, required) {
  value = this.CheckValidNumber(value);
  if (value === null && required === false) {
    return null;
  } else if (value === null && required === true) {
    return '빚은 필수 입력 항목입니다.';
  } else if (value === undefined) {
    return '빚에 적합한 입력이 아닙니다.';
  } else if (value < 0) {
    return '빚은 0원 미만이 될 수 없습니다.';
  }
  return null;
};

exports.bonus = function(value, required) {
  value = this.CheckValidNumber(value);
  if (value === null && required === false) {
    return null;
  } else if (value === null && required === true) {
    return '보너스는 필수 입력 항목입니다.';
  } else if (value === undefined) {
    return '보너스에 적합한 입력이 아닙니다.';
  } else if (value < 0 || value > 100) {
    return '보너스는 최소 0%, 최대 100%까지 가능합니다.';
  }
  return null;
};

exports.statusPoint = function(value, required) {
  value = this.CheckValidNumber(value);
  if (value === null && required === false) {
    return null;
  } else if (value === null && required === true) {
    return '총판 스탯 포인트는 필수 입력 항목입니다.';
  } else if (value === undefined) {
    return '총판 스탯 포인트에 적합한 입력이 아닙니다.';
  } else if (value < 1 || value > 100) {
    return '총판 스탯 포인트는 최소 1, 최대 100까지 설정 가능합니다.';
  }
  return null;
};

exports.maxBet = function(value, required) {
  value = this.CheckValidNumber(value);
  if (value === null && required === false) {
    return null;
  } else if (value === null && required === true) {
    return '최대 배팅 금액은 필수 입력 항목입니다.';
  } else if (value === undefined) {
    return '최대 배팅 금액에 적합한 입력이 아닙니다.';
  } else if (value < 1) {
    return '최대 배팅 금액은 1원보다 적을 수 없습니다.';
  }
  return null;
};

exports.minBet = function(value, required) {
  value = this.CheckValidNumber(value);
  if (value === null && required === false) {
    return null;
  } else if (value === null && required === true) {
    return '최소 배팅 금액은 필수 입력 항목입니다.';
  } else if (value === undefined) {
    return '최소 배팅 금액에 적합한 입력이 아닙니다.';
  } else if (value < 1) {
    return '최소 배팅 금액은 1원보다 적을 수 없습니다.';
  }
  return null;
};

exports.score = function(value, required) {
  value = this.CheckValidNumber(value);
  if (value === null && required === false) {
    return null;
  } else if (value === null && required === true) {
    return '점수는 필수 입력 항목입니다.';
  } else if (value === undefined) {
    return '점수에 적합한 입력이 아닙니다.';
  } else if (value < 0) {
    return '점수는 0보다 작을 수 없습니다.';
  }
  return null;
};

exports.cancelLimit = function(value, required) {
  value = this.CheckValidNumber(value);
  if (value === null && required === false) {
    return null;
  } else if (value === null && required === true) {
    return '배팅 취소 시간은 필수 입력 항목입니다.';
  } else if (value === undefined) {
    return '배팅 취소 시간에 적합한 입력이 아닙니다.';
  } else if (value < 1) {
    return '배팅 취소 시간은 1분보다 작을 수 없습니다.';
  }
  return null;
};

exports.cancelCount = function(value, required) {
  value = this.CheckValidNumber(value);
  if (value === null && required === false) {
    return null;
  } else if (value === null && required === true) {
    return '배팅 취소 횟수은(는) 필수 입력 항목입니다.';
  } else if (value === undefined) {
    return '배팅 취소 횟수에 적합한 입력이 아닙니다.';
  } else if (value < 1) {
    return '배팅 취소 횟수는 1보다 작을 수 없습니다.';
  }
  return null;
};


exports.kindMaxMulti = function(value, required) {
  value = this.CheckValidNumber(value);
  if (value === null && required === false) {
    return null;
  } else if (value === null && required === true) {
    return '최대 조합 매치은(는) 필수 입력 항목입니다.';
  } else if (value === undefined) {
    return '최대 조합 매치에 적합한 입력이 아닙니다.';
  } else if (value <= 1) {
    return '최대 조합 매치는 최소 2경기 이상입니다.';
  }
  return null;
};

exports.kindNah = function(value, required) {
  value = this.CheckValidBoolean(value);
  if (value === null && required === false) {
    return null;
  } else if (value === null && required === true) {
    return '일반+핸디캡 조합 설정은(는) 필수 입력 항목입니다.';
  } else if (value === undefined) {
    return '일반+핸디캡 조합 설정에 적합한 입력이 아닙니다.';
  }
  return null;
};

exports.kindNau = function(value, required) {
  value = this.CheckValidBoolean(value);
  if (value === null && required === false) {
    return null;
  } else if (value === null && required === true) {
    return '일반+언더오버 조합 설정은(는) 필수 입력 항목입니다.';
  } else if (value === undefined) {
    return '일반+언더오버 조합 설정에 적합한 입력이 아닙니다.';
  }
  return null;
};

exports.kindHau = function(value, required) {
  value = this.CheckValidBoolean(value);
  if (value === null && required === false) {
    return null;
  } else if (value === null && required === true) {
    return '핸디캡+언더오버 조합 설정은(는) 필수 입력 항목입니다.';
  } else if (value === undefined) {
    return '핸디캡+언더오버 조합 설정에 적합한 입력이 아닙니다.';
  }
  return null;
};

exports.uid = function(value, required) {
  value = this.CheckValidString(value);
  if (value === null && required === false) {
    return null;
  } else if (value === null && required === true) {
    return '아이디는 필수 입력 항목입니다.';
  } else if (value === undefined) {
    return '아이디에 적합한 입력이 아닙니다.';
  } else if (!(/^(?!\d+[a-z0-9])[a-z0-9]{5,16}$/.test(value))) {
    return '아이디는 영문 소자, 숫자를 이용하여 5자 이상 16자 이내이며 숫자로 시작할 수 없습니다.';
  }
  return null;
};

exports.email = function(value, required) {
  value = this.CheckValidString(value);
  if (value === null && required === false) {
    return null;
  } else if (value === null && required === true) {
    return '이메일은 필수 입력 항목입니다.';
  } else if (value === undefined) {
    return '이메일에 적합한 입력이 아닙니다.';
  } else if(!(/^[a-zA-Z0-9\-\_]{2,20}\@[a-zA-Z0-9\-\_]{2,20}\.[a-zA-Z]{2,10}(\.[a-zA-Z]{2,10}|)$/.test(value))) {
    return '이메일 형식이 아니거나 또는 이메일은 영문, 숫자, \'-\', \'_\'만 이용가능합니다.';
  }
  return null;
};

exports.password = function(value, required) {
  value = this.CheckValidString(value);
  if (value === null && required === false) {
    return null;
  } else if (value === null && required === true) {
    return '비밀번호는 필수 입력 항목입니다.';
  } else if (value === undefined) {
    return '비밀번호에 적합한 입력이 아닙니다.';
  } else if (!(/^.{8,30}$/.test(value))) {
    return '비밀번호는 8자 이상 30자 이내만 가능합니다.';
  }
  return null;
};

exports.phone = function(value, required) {
  value = this.CheckValidString(value);
  if (value === null && required === false) {
    return null;
  } else if (value === null && required === true) {
    return '연락처는 필수 입력 항목입니다.';
  } else if (value === undefined) {
    return '연락처에 적합한 입력이 아닙니다.';
  } else if (!(/^01(0|1|[6-9])(\d{3,4}|-\d{3,4})(\d{4}|-\d{4})$/.test(value))) {
    return '연락처는 숫자, 붙임표(-)를 사용하여 연락처 형식으로 입력 가능합니다.';
  }
  return null;
};


exports.nick = function(value, required) {
  value = this.CheckValidString(value);
  if (value === null && required === false) {
    return null;
  } else if (value === null && required === true) {
    return '닉네임은 필수 입력 항목입니다.';
  } else if (value === undefined) {
    return '닉네임에 적합한 입력이 아닙니다.';
  } else if (!(/^[가-힣a-zA-Z0-9]{2,16}$/.test(value))) {
    return '닉네임은 한글, 영문, 숫자를 이용하여 2자 이상 16자 이내만 가능합니다.';
  }
  return null;
};

exports.holder = function(value, required) {
  value = this.CheckValidString(value);
  if (value === null && required === false) {
    return null;
  } else if (value === null && required === true) {
    return '예금주는 필수 입력 항목입니다.';
  } else if (value === undefined) {
    return '예금주에 적합한 입력이 아닙니다.';
  } else if (!(/^[가-힣]{2,10}$/.test(value))) {
    return '예금주는 한글을 이용하여 2자 이상, 10자 이내입니다.';
  }
  return null;
};

exports.recommander = function(value, required) {
  value = this.CheckValidString(value);
  if (value === null && required === false) {
    return null;
  } else if (value === null && required === true) {
    return '추천인은 필수 입력 항목입니다.';
  } else if (value === undefined) {
    return '추천인에 적합한 입력이 아닙니다.';
  } else if (!(/^(?!.*\d[a-z])(?=.*[a-z])[a-z0-9]{5,16}$/.test(value))) {
    return '추천인은 영문 소자, 숫자를 이용하여 5자 이상 16자 이내이며 숫자로 시작할 수 없습니다.';
  }
  return null;
};

exports.level = function(value, required) {
  value = this.CheckValidString(value);
  if (value === null && required === false) {
    return null;
  } else if (value === null && required === true) {
    return '레벨은 필수 입력 항목입니다.';
  } else if (value === undefined) {
    return '레벨에 적합한 입력이 아닙니다.';
  } else if (!(/^[가-힣a-zA-Z0-9]{1,16}$/.test(value))) {
    return '레벨명은 한글, 영문, 숫자를 이용하여 1자 이상 16자 이내만 가능합니다.';
  }
  return null;
};

exports.site = function(value, required) {
  value = this.CheckValidString(value);
  if (value === null && required === false) {
    return null;
  } else if (value === null && required === true) {
    return '사이트명은 필수 입력 항목입니다.';
  } else if (value === undefined) {
    return '사이트명에 적합한 입력이 아닙니다.';
  } else if (!(/^[가-힣a-zA-Z0-9]{2,16}$/.test(value))) {
    return '사이트명은 한글, 영문, 숫자를 이용하여 2자 이상 16자 이내만 가능합니다.';
  }
  return null;
};

exports.distributor = function(value, required) {
  value = this.CheckValidString(value);
  if (value === null && required === false) {
    return null;
  } else if (value === null && required === true) {
    return '총판명은 필수 입력 항목입니다.';
  } else if (value === undefined) {
    return '총판명에 적합한 입력이 아닙니다.';
  } else if (!(/^[가-힣a-zA-Z0-9]{2,16}$/.test(value))) {
    return '총판명은 한글, 영문, 숫자를 이용하여 2자 이상 16자 이내만 가능합니다.';
  }
  return null;
};

exports.memo = function(value, required) {
  value = this.CheckValidString(value);
  if (value === null && required === false) {
    return null;
  } else if (value === null && required === true) {
    return '메모는 필수 입력 항목입니다.';
  } else if (value === undefined) {
    return '메모에 적합한 입력이 아닙니다.';
  } else if (value.length > 200) {
    return '메모는 최대 200자 이내입니다.';
  }
  return null;
};

exports.ip = function(value, required) {
  value = this.CheckValidString(value);
  if (value === null && required === false) {
    return null;
  } else if (value === null && required === true) {
    return '아이피은(는) 필수 입력 항목입니다.';
  } else if (value === undefined) {
    return '아이피에 적합한 입력이 아닙니다.';
  } else if (/^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}$/.test(value)) {
    return null;
  } else if (/^([0-9A-Fa-f]{0,4}:){2,7}([0-9A-Fa-f]{1,4}$|((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(\.|$)){4})$/.test(value)) {
    return null;
  }
  return '적절하지 않는 아이피 형식입니다.';
};

exports.team = function(value, required) {
  value = this.CheckValidString(value);
  if (value === null && required === false) {
    return null;
  } else if (value === null && required === true) {
    return '팀명은(는) 필수 입력 항목입니다.';
  } else if (value === undefined) {
    return '팀명에 적합한 입력이 아닙니다.';
  } else if (!(/^[가-힣a-zA-Z0-9\s\'\"\(\)\{\}\[\]]{2,30}$/.test(value))) {
    return '팀명은 한글, 숫자, 영문, 괄호, 따옴표, 띄어쓰기를 이용하여 최소 2자, 최대 30자까지 가능합니다.';
  }
  return null;
};

exports.rate = function(value, required) {
  value = this.CheckValidString(value);
  if (value === null && required === false) {
    return null;
  } else if (value === null && required === true) {
    return '배당은(는) 필수 입력 항목입니다.';
  } else if (value === undefined) {
    return '배당에 적합한 입력이 아닙니다.';
  } else if (!(/^\d{1,2}(|(\.(?=\d))\d{0,2})$/.test(value))) {
    return '배당은 최소 00.00, 최대 99.99입니다.';
  }
  return null;
};

exports.schedule = function(value, required) {
  value = this.CheckValidString(value);
  if (value === null && required === false) {
    return null;
  } else if (value === null && required === true) {
    return '경기 일시은(는) 필수 입력 항목입니다.';
  } else if (value === undefined) {
    return '경기 일시에 적합한 입력이 아닙니다.';
  } else if (!(/^\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}$/.test(value))) {
    return '경기 일시는 YYYY-MM-DD HH:II 형식으로 입력해주세요.';
  }
  return null;
};

exports.kind = function(value, required) {
  value = this.CheckValidString(value);
  if (value === null && required === false) {
    return null;
  } else if (value === null && required === true) {
    return '종목명은(는) 필수 입력 항목입니다.';
  } else if (value === undefined) {
    return '종목명에 적합한 입력이 아닙니다.';
  } else if (!(/^[가-힣a-zA-Z0-9\s]{2,30}$/.test(value))) {
    return '종목명은 한글, 영문, 숫자, 띄어쓰기를 포함하여 최소 2자, 최대 30자까지 가능합니다.';
  }
  return null;
};

exports.kindGroup = function(value, required) {
  value = this.CheckValidString(value);
  if (value === null && required === false) {
    return null;
  } else if (value === null && required === true) {
    return '종목 그룹명은(는) 필수 입력 항목입니다.';
  } else if (value === undefined) {
    return '종목 그룹명에 적합한 입력이 아닙니다.';
  } else if (!(/^[가-힣a-zA-Z0-9\s]{2,30}$/.test(value))) {
    return '종목 그룹명은 한글, 영문, 숫자, 띄어쓰기를 포함하여 포함하여 최소 2자, 최대 30자까지 가능합니다.';
  }
  return null;
};

exports.league = function(value, required) {
  value = this.CheckValidString(value);
  if (value === null && required === false) {
    return null;
  } else if (value === null && required === true) {
    return '리그명은(는) 필수 입력 항목입니다.';
  } else if (value === undefined) {
    return '리그명에 적합한 입력이 아닙니다.';
  } else if (!(/^[가-힣a-zA-Z0-9\s]{2,30}$/.test(value))) {
    return '리그명은 한글, 영문, 숫자, 띄어쓰기를 포함하여 최소 2자, 최대 30자까지 가능합니다.';
  }
  return null;
};

exports.offset = function(value, required) {
  value = this.CheckValidString(value);
  if (value === null && required === false) {
    return null;
  } else if (value === null && required === true) {
    return '기준점은(는) 필수 입력 항목입니다.';
  } else if (value === undefined) {
    return '기준점에 적합한 입력이 아닙니다.';
  } else if (!(/^\-?\d{1,2}(|(\.(?=\d))\d{1,2})$/.test(value))) {
    return '기준점은 -99.99에서 99.99까지입니다.';
  }
  return null;
};

exports.subject = function(value, required) {
  value = this.CheckValidString(value);
  if (value === null && required === false) {
    return null;
  } else if (value === null && required === true) {
    return '버라이어티 주제은(는) 필수 입력 항목입니다.';
  } else if (value === undefined) {
    return '버라이어티 주제에 적합한 입력이 아닙니다.';
  } else if (!(/^[가-힣a-zA-Z0-9\s\~\!\@\#\$\%\^\&\*\(\)\-\_\=\+\[\]\(\)\:\;\'\"\<\>\?\,\.\/]{2,50}$/.test(value))) {
    return '버라이어티 주제는 한글, 숫자, 영문, 괄호, 따옴표, 띄어쓰기, 특수문자를 이용하여 최소 2자, 최대 50자까지 가능합니다.';
  }
  return null;
};

exports.title = function(value, required) {
  value = this.CheckValidString(value);
  if (value === null && required === false) {
    return null;
  } else if (value === null && required === true) {
    return '제목은(는) 필수 입력 항목입니다.';
  } else if (value === undefined) {
    return '제목에 적합한 입력이 아닙니다.';
  } else if (!(/^[ㄱ-ㅎㅏ-ㅣ가-힣a-zA-Z0-9\s\~\!\@\#\$\%\^\&\*\(\)\-\_\=\+\[\]\(\)\:\;\'\"\<\>\?\,\.\/]{2,50}$/.test(value))) {
    return '제목은 한글, 숫자, 영문, 괄호, 따옴표, 띄어쓰기, 특수문자를 이용하여 최소 2자, 최대 50자까지 가능합니다.';
  }
  return null;
};

exports.content = function(value, required) {
  value = this.CheckValidString(value);
  if (value === null && required === false) {
    return null;
  } else if (value === null && required === true) {
    return '내용은(는) 필수 입력 항목입니다.';
  } else if (value === undefined) {
    return '내용에 적합한 입력이 아닙니다.';
  } else if (!(/^[ㄱ-ㅎㅏ-ㅣ가-힣a-zA-Z0-9\s\~\!\@\#\$\%\^\&\*\(\)\-\_\=\+\[\]\(\)\:\;\'\"\<\>\?\,\.\/]{1,500}$/.test(value))) {
    return '내용은 한글, 숫자, 영문, 괄호, 따옴표, 띄어쓰기, 특수문자를 이용하여 최대 500자까지 가능합니다.';
  }
  return null;
};

exports.boardContent = function(value, required) {
  value = this.CheckValidString(value);
  if (value === null && required === false) {
    return null;
  } else if (value === null && required === true) {
    return '글 내용은(는) 필수 입력 항목입니다.';
  } else if (value === undefined) {
    return '글 내용에 적합한 입력이 아닙니다.';
  } else if (!(/^[ㄱ-ㅎㅏ-ㅣ가-힣a-zA-Z0-9\s\~\!\@\#\$\%\^\&\*\(\)\-\_\=\+\[\]\(\)\:\;\'\"\<\>\?\,\.\/]{1,2000}$/.test(value))) {
    return '글 내용은 한글, 숫자, 영문, 괄호, 따옴표, 띄어쓰기, 특수문자를 이용하여 최대 2000자까지 가능합니다.';
  }
  return null;
};

exports.replyContent = function(value, required) {
  value = this.CheckValidString(value);
  if (value === null && required === false) {
    return null;
  } else if (value === null && required === true) {
    return '댓글 내용은(는) 필수 입력 항목입니다.';
  } else if (value === undefined) {
    return '댓글 내용에 적합한 입력이 아닙니다.';
  } else if (!(/^[ㄱ-ㅎㅏ-ㅣ가-힣a-zA-Z0-9\s\~\!\@\#\$\%\^\&\*\(\)\-\_\=\+\[\]\(\)\:\;\'\"\<\>\?\,\.\/]{1,100}$/.test(value))) {
    return '댓글 내용은 한글, 숫자, 영문, 괄호, 따옴표, 띄어쓰기, 특수문자를 이용하여 최대 100자까지 가능합니다.';
  }
  return null;
};

exports.answer = function(value, required) {
  value = this.CheckValidString(value);
  if (value === null && required === false) {
    return null;
  } else if (value === null && required === true) {
    return '답변은(는) 필수 입력 항목입니다.';
  } else if (value === undefined) {
    return '답변에 적합한 입력이 아닙니다.';
  } else if (!(/^[ㄱ-ㅎㅏ-ㅣ가-힣a-zA-Z0-9\s\~\!\@\#\$\%\^\&\*\(\)\-\_\=\+\[\]\(\)\:\;\'\"\<\>\?\,\.\/]{1,2000}$/.test(value))) {
    return '답변은 한글, 숫자, 영문, 괄호, 따옴표, 띄어쓰기, 특수문자를 이용하여 최대 2000자까지 가능합니다.';
  }
  return null;
};


exports.accountBank = function(value, required) {
  value = this.CheckValidString(value);
  if (value === null && required === false) {
    return null;
  } else if (value === null && required === true) {
    return '은행명은(는) 필수 입력 항목입니다.';
  } else if (value === undefined) {
    return '은행명에 적합한 입력이 아닙니다.';
  } else if (!(/^[가-힣a-zA-Z0-9\s]{1,50}$/.test(value))) {
    return '은행명은 한글, 숫자, 영문, 띄어쓰기를 포함하여 최대 50자까지 가능합니다.';
  }
  return null;
};

exports.accountNumber = function(value, required) {
  value = this.CheckValidString(value);
  if (value === null && required === false) {
    return null;
  } else if (value === null && required === true) {
    return '계좌번호은(는) 필수 입력 항목입니다.';
  } else if (value === undefined) {
    return '계좌번호에 적합한 입력이 아닙니다.';
  } else if (!(/^(?!\-\d)(?!.*\-{2,})[\-0-9]{1,30}\d$/.test(value))) {
    return '계좌번호는 숫자, 하이픈(-)을 포함하여 30자 이내입니다.';
  }
  return null;
};

exports.accountPin = function(value, required) {
  value = this.CheckValidString(value);
  if (value === null && required === false) {
    return null;
  } else if (value === null && required === true) {
    return '계좌 인증코드은(는) 필수 입력 항목입니다.';
  } else if (value === undefined) {
    return '계좌 인증코드에 적합한 입력이 아닙니다.';
  } else if (!(/^[0-9]{4,8}$/.test(value))) {
    return '계좌 인증코드는 숫자를 사용하여 4~8자입니다.';
  }
  return null;
};

exports.imagePath = function(value, required) {
  value = this.CheckValidString(value);
  if (value === null && required === false) {
    return null;
  } else if (value === null && required === true) {
    return '이미지 경로은(는) 필수 입력 항목입니다.';
  } else if (value === undefined) {
    return '이미지 경로에 적합한 입력이 아닙니다.';
  } else if (value.length > 500) {
    return '이미지 경로는 500자 이내입니다.';
  }
  return null;
};

exports.country = function(value, required) {
  value = this.CheckValidString(value);
  if (value === null && required === false) {
    return null;
  } else if (value === null && required === true) {
    return '국가명은(는) 필수 입력 항목입니다.';
  } else if (value === undefined) {
    return '국가명에 적합한 입력이 아닙니다.';
  } else if (!(/^[가-힣a-zA-Z0-9\s]{2,30}$/.test(value))) {
    return '국가명은 한글, 영문, 숫자를 이용하여 최소 2자, 30자 이내입니다.';
  }
  return null;
};

exports.siteAnswerAction = function(value, required) {
  value = this.CheckValidString(value);
  if (value === null && required === false) {
    return null;
  } else if (value === null && required === true) {
    return '액션명은(는) 필수 입력 항목입니다.';
  } else if (value === undefined) {
    return '액션명에 적합한 입력이 아닙니다.';
  } else if (!(/^[ㄱ-ㅎㅏ-ㅣ가-힣a-zA-Z0-9]{2,10}$/.test(value))) {
    return '액션명은 한글, 영문, 숫자를 포함하여 2자 이상 10자 이내로 가능합니다.';
  }
  return null;
};

exports.userMemoDate = function(value, required) {
  value = this.CheckValidString(value);
  if (value === null && required === false) {
    return null;
  } else if (value === null && required === true) {
    return '메모 일시은(는) 필수 입력 항목입니다.';
  } else if (value === undefined) {
    return '메모 일시에 적합한 입력이 아닙니다.';
  } else if (value.length > 30) {
    return '메모 일시는 최대 30자 이내입니다.';
  }
  return null;
};

exports.optionName = function(value, required) {
  value = this.CheckValidString(value);
  if (value === null && required === false) {
    return null;
  } else if (value === null && required === true) {
    return '선택지은(는) 필수 입력 항목입니다.';
  } else if (value === undefined) {
    return '선택지에 적합한 입력이 아닙니다.';
  } else if (!(/^[ㄱ-ㅎㅏ-ㅣ가-힣a-zA-Z0-9\s]{2,20}$/.test(value))) {
    return '선택지는 한글, 영문, 띄어쓰기를 포함하여 2자 이상 20자 이내로 가능합니다.';
  }
};

exports.btype = function(value, required) {
  value = this.CheckValidString(value);
  if (value === null && required === false) {
    return null;
  } else if (value === null && required === true) {
    return '배팅 타입은(는) 필수 입력 항목입니다.';
  } else if (value === undefined) {
    return '배팅 타입에 적합한 입력이 아닙니다.';
  }
  var _enum = ['2-WAY', '3-WAY', 'VARIETY']
  if(_enum.indexOf(value) === -1) {
      return '허용되지 않은 배팅타입입니다.';
  };
  return null;
};

exports.kindBtype = function(value, required) {
  value = this.CheckValidString(value);
  if (value === null && required === false) {
    return null;
  } else if (value === null && required === true) {
    return '종목 배팅 타입은(는) 필수 입력 항목입니다.';
  } else if (value === undefined) {
    return '종목 배팅 타입에 적합한 입력이 아닙니다.';
  }
  var _enum = ['단일', '조합'];
  if(_enum.indexOf(value) === -1) {
      return '허용되지 않은 종목 배팅 타입입니다.';
  };
  return null;
};

exports.mtype = function(value, required) {
  value = this.CheckValidString(value);
  if (value === null && required === false) {
    return null;
  } else if (value === null && required === true) {
    return '매치 타입은(는) 필수 입력 항목입니다.';
  } else if (value === undefined) {
    return '매치 타입에 적합한 입력이 아닙니다.';
  }
  var _enum = ['일반', '핸디캡', '언더오버'];
  if(_enum.indexOf(value) === -1) {
      return '허용되지 않은 매치 타입입니다.';
  };
  return null;
};

exports.matchState = function(value, required) {
  value = this.CheckValidString(value);
  if (value === null && required === false) {
    return null;
  } else if (value === null && required === true) {
    return '매치 상태은(는) 필수 입력 항목입니다.';
  } else if (value === undefined) {
    return '매치 상태에 적합한 입력이 아닙니다.';
  }
  var _enum = ['등록', '배팅', '마감', '종료'];
  if(_enum.indexOf(value) === -1) {
      return '허용되지 않은 매치 상태입니다.';
  };
  return null;
};

exports.questionStyle = function(value, required) {
  value = this.CheckValidString(value);
  if (value === null && required === false) {
    return null;
  } else if (value === null && required === true) {
    return '질문 종류은(는) 필수 입력 항목입니다.';
  } else if (value === undefined) {
    return '질문 종류에 적합한 입력이 아닙니다.';
  }
  var _enum = ['회원', '비회원'];
  if(_enum.indexOf(value) === -1) {
      return '허용되지 않은 질문 종류입니다.';
  };
  return null;
};

exports.joinStyle = function(value, required) {
  value = this.CheckValidString(value);
  if (value === null && required === false) {
    return null;
  } else if (value === null && required === true) {
    return '총판 가입 방식은(는) 필수 입력 항목입니다.';
  } else if (value === undefined) {
    return '총판 가입 방식에 적합한 입력이 아닙니다.';
  }
  var _enum = ['자유', '승인', '비공개'];
  if(_enum.indexOf(value) === -1) {
      return '허용되지 않은 총판 가입 방식입니다.';
  };
  return null;
};

exports.financeState = function(value, required) {
  value = this.CheckValidString(value);
  if (value === null && required === false) {
    return null;
  } else if (value === null && required === true) {
    return '입/출금 상태은(는) 필수 입력 항목입니다.';
  } else if (value === undefined) {
    return '입/출금 상태에 적합한 입력이 아닙니다.';
  }
  var _enum = ['신청', '승인', '취소'];
  if(_enum.indexOf(value) === -1) {
      return '허용되지 않은 입/출금 상태입니다.';
  };
  return null;
};

exports.siteState = function(value, required) {
  value = this.CheckValidString(value);
  if (value === null && required === false) {
    return null;
  } else if (value === null && required === true) {
    return '사이트 상태은(는) 필수 입력 항목입니다.';
  } else if (value === undefined) {
    return '사이트 상태에 적합한 입력이 아닙니다.';
  }
  var _enum = ['정상', '점검', '정지'];
  if(_enum.indexOf(value) === -1) {
      return '허용되지 않은 사이트 상태입니다.';
  };
  return null;
};

exports.userState = function(value, required) {
  value = this.CheckValidString(value);
  if (value === null && required === false) {
    return null;
  } else if (value === null && required === true) {
    return '회원 상태은(는) 필수 입력 항목입니다.';
  } else if (value === undefined) {
    return '회원 상태에 적합한 입력이 아닙니다.';
  }
  var _enum = ['정지', '일반', '테스터', '운영자', '관리자'];
  if(_enum.indexOf(value) === -1) {
      return '허용되지 않은 회원 상태입니다.';
  };
  return null;
};

exports.questionState = function(value, required) {
  value = this.CheckValidString(value);
  if (value === null && required === false) {
    return null;
  } else if (value === null && required === true) {
    return '질문 상태은(는) 필수 입력 항목입니다.';
  } else if (value === undefined) {
    return '질문 상태에 적합한 입력이 아닙니다.';
  }
  var _enum = ['등록', '처리중', '완료'];
  if(_enum.indexOf(value) === -1) {
      return '허용되지 않은 질문 상태입니다.';
  };
  return null;
};

exports.historyState = function(value, required) {
  value = this.CheckValidString(value);
  if (value === null && required === false) {
    return null;
  } else if (value === null && required === true) {
    return '접속 기록 상태은(는) 필수 입력 항목입니다.';
  } else if (value === undefined) {
    return '접속 기록 상태에 적합한 입력이 아닙니다.';
  }
  var _enum = ['로그인 완료', '로그인 실패', '비밀번호 틀림', '아이디 틀림'];
  if(_enum.indexOf(value) === -1) {
      return '허용되지 않은 접속 기록 상태입니다.';
  };
  return null;
};

exports.form = function(value, required) {
  value = this.CheckValidString(value);
  if (value === null && required === false) {
    return null;
  } else if (value === null && required === true) {
    return '게시글 종류은(는) 필수 입력 항목입니다.';
  } else if (value === undefined) {
    return '게시글 종류에 적합한 입력이 아닙니다.';
  }
  var _enum = ['글', '댓글'];
  if(_enum.indexOf(value) === -1) {
      return '허용되지 않은 게시글 종류입니다.';
  };
  return null;
};

exports.sort = function(value, required) {
  value = this.CheckValidString(value);
  if (value === null && required === false) {
    return null;
  } else if (value === null && required === true) {
    return '게시판 종류은(는) 필수 입력 항목입니다.';
  } else if (value === undefined) {
    return '게시판 종류에 적합한 입력이 아닙니다.';
  }
  var _enum = ['자유게시판', '노하우/공략', '건의/오류제보', '총판게시판'];
  if(_enum.indexOf(value) === -1) {
      return '허용되지 않은 게시판 종류입니다.';
  };
  return null;
};

exports.category = function(value, required) {
  value = this.CheckValidString(value);
  if (value === null && required === false) {
    return null;
  } else if (value === null && required === true) {
    return '쪽지 분류는 필수 입력 항목입니다.';
  } else if (value === undefined) {
    return '쪽지 분류에 적합한 입력이 아닙니다.';
  }
  var _enum = ['회원', '사이트', '총판', '전체'];
  if(_enum.indexOf(value) === -1) {
      return '허용되지 않은 쪽지 분류입니다.';
  };
  return null;
};

exports.result = function(value, required) {
  value = this.CheckValidString(value);
  if (value === null && required === false) {
    return null;
  } else if (value === null && required === true) {
    return '매치 결과은(는) 필수 입력 항목입니다.';
  } else if (value === undefined) {
    return '매치 결과에 적합한 입력이 아닙니다.';
  }
  var _enum = [
    // used in 3-way
    '친정승', '무승부', '원정승',
    // used in n-way
    '선택1', '선택2', '선택3', '선택4', '선택5', '선택6', '선택7', '선택8', '선택9', '선택10',
    '선택11', '선택12', '선택13', '선택14', '선택15', '선택16', '선택17', '선택18', '선택19', '선택20'
  ];
  if(_enum.indexOf(value) === -1) {
      return '허용되지 않은 매치 결과입니다.';
  };
  return null;
};

exports.boardOpinion = function(value, required) {
  value = this.CheckValidString(value);
  if (value === null && required === false) {
    return null;
  } else if (value === null && required === true) {
    return '게시글 평가 결과은(는) 필수 입력 항목입니다.';
  } else if (value === undefined) {
    return '게시글 평가 결과에 적합한 입력이 아닙니다.';
  }
  var _enum = ['GOOD', 'BAD'];
  if(_enum.indexOf(value) === -1) {
      return '허용되지 않은 게시글 평가 결과입니다.';
  };
  return null;
};

exports.kindConfig = function(value, required) {
  value = this.CheckValidArray(value);
  if (value === null && required === false) {
    return null;
  } else if (value === null && required === true) {
    return '종목별 설정은(는) 필수 입력 항목입니다.';
  } else if (value === undefined) {
    return '종목별 설정에 적합한 입력이 아닙니다.';
  }
  for (var i = 0; i < value.length; i++) {
    var msg = null;
    msg = this.kind(value[i].name, true);
    if(msg) return msg;
    // msg = this.kindBtype(value[i].som, true);
    // if(msg) return msg;
    msg = this.kindMaxMulti(value[i].maxMulti, true);
    if(msg) return msg;
    msg = this.kindNah(value[i].nah, true);
    if(msg) return msg;
    msg = this.kindNau(value[i].nau, true);
    if(msg) return msg;
    msg = this.kindHau(value[i].hau, true);
    if(msg) return msg;
  }
  return null;
};
exports.siteAnswer = function(value, required) {
  value = this.CheckValidArray(value);
  if (value === null && required === false) {
    return null;
  } else if (value === null && required === true) {
    return '답변 설정은(는) 필수 입력 항목입니다.';
  } else if (value === undefined) {
    return '답변 설정에 적합한 입력이 아닙니다.';
  }
  for (var i = 0; i < value.length; i++) {
    var msg = null;
    msg = this.siteAnswerAction(value[i].action, true);
    if(msg) return msg;
    msg = this.title(value[i].title, true);
    if(msg) return msg;
    msg = this.content(value[i].content, true);
    if(msg) return msg;
  }
  return null;
};

exports.userMemo = function(value, required) {
  value = this.CheckValidArray(value);
  if (value === null && required === false) {
    return null;
  } else if (value === null && required === true) {
    return '회원 메모은(는) 필수 입력 항목입니다.';
  } else if (value === undefined) {
    return '회원 메모에 적합한 입력이 아닙니다.';
  }
  for (var i = 0; i < value.length; i++) {
    var msg = null;
    msg = this.memo(value[i].content, true);
    if(msg) return msg;
    msg = this.userMemoDate(value[i].date, true);
    if(msg) return msg;
  }
  return null;
};

exports.option = function(value, required) {
  value = this.CheckValidArray(value);
  if (value === null && required === false) {
    return null;
  } else if (value === null && required === true) {
    return '선택지은(는) 필수 입력 항목입니다.';
  } else if (value === undefined) {
    return '선택지에 적합한 입력이 아닙니다.';
  } else if (value.length < 4) {
    return '선택지는 최소 4개여야 합니다.';
  }
  for (var i = 0; i < value.length; i++) {
    var msg = null;
    msg = this.optionName(value[i].name, true);
    if(msg) return msg;
    msg = this.rate(value[i].rate, true);
    if(msg) return msg;
  }
  return null;
};
