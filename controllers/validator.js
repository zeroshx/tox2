exports.run = function (list) {
    if(!Array.isArray(list)) {
        return '비정상적인 접근입니다.';
    }
    for(var i = 0; i < list.length; i++) {
        if(this[list[i].validator]) {
            var rst = this[list[i].validator](list[i].value, list[i].required);
            if(rst) return rst;
        } else {
            return '정의되지 않는 요청입니다.';
        }
    }
};

exports.uid = function(value, required) {
    if(!value && required) {
        return '아이디는 필수 입력 항목입니다.';
    } else if (!value && !required) {
        return null;
    }
    if(!(/^[a-zA-Z0-9]{2,16}$/.test(value))) {
        return '아이디는 영문, 숫자를 이용하여 2자 이상 16자 이내만 가능합니다.';
    }
    return null;
};

exports.password = function(value, required) {
    if(!value && required) {
        return '비밀번호는 필수 입력 항목입니다.';
    } else if (!value && !required) {
        return null;
    }
    if(!(/^.{8,30}$/i.test(value))) {
        return '비밀번호는 8자 이상 30자 이내만 가능합니다.';
    }
    return null;
};

exports.cash = function(value, required) {
    value = String(value);
    if(!value && required) {
        return '캐쉬는 필수 입력 항목입니다.';
    } else if (!value && !required) {
        return null;
    }
    if(Number(value) < 0) {
        return '캐쉬는 0원 미만이 될 수 없습니다.';
    }
    return null;
};

exports.money = function(value, required) {
    value = String(value);
    if(!value && required) {
        return '게임 머니는 필수 입력 항목입니다.';
    } else if (!value && !required) {
        return null;
    }
    if(Number(value) < 0) {
        return '게임 머니는 0원 미만이 될 수 없습니다.';
    }
    return null;
};

exports.point = function(value, required) {
    value = String(value);
    if(!value && required) {
        return '포인트는 필수 입력 항목입니다.';
    } else if (!value && !required) {
        return null;
    }
    if(Number(value) < 0) {
        return '포인트는 0점 미만이 될 수 없습니다.';
    }
    return null;
};

exports.debt = function(value, required) {
    value = String(value);
    if(!value && required) {
        return '빚은 필수 입력 항목입니다.';
    } else if (!value && !required) {
        return null;
    }
    if(Number(value) < 0) {
        return '빚은 0원 미만이 될 수 없습니다.';
    }
    return null;
};

exports.phone = function(value, required) {
    if(!value && required) {
        return '연락처는 필수 입력 항목입니다.';
    } else if (!value && !required) {
        return null;
    }
    if(!(/^[\-+0-9]{1,20}$/i.test(value))) {
        return '연락처는 숫자, 붙임표(-)를 사용하여 최대 20자까지 가능합니다.';
    }
    return null;
};


exports.nick = function(value, required) {
    if(!value && required) {
        return '닉네임은 필수 입력 항목입니다.';
    } else if (!value && !required) {
        return null;
    }
    if(!(/^[가-힣a-zA-Z0-9]{2,16}$/.test(value))) {
        return '닉네임은 한글, 영문, 숫자를 이용하여 2자 이상 16자 이내만 가능합니다.';
    }
    return null;
};

exports.holder = function(value, required) {
    if(!value && required) {
        return '이름은 필수 입력 항목입니다.';
    } else if (!value && !required) {
        return null;
    }
    if(!(/^[가-힣a-zA-Z]{2,20}$/.test(value))) {
        return '이름은 한글 또는 영문을 이용하여 2자 이상, 50자 이내입니다.';
    }
    return null;
};

exports.recommander = function(value, required) {
    if(!value && required) {
        return '추천인은 필수 입력 항목입니다.';
    } else if (!value && !required) {
        return null;
    }
    if(!(/^[가-힣a-zA-Z0-9]{2,16}$/.test(value))) {
        return '추천인은 한글, 영문, 숫자를 이용하여 2자 이상 16자 이내만 가능합니다.';
    }
    return null;
};

exports.level = function(value, required) {
    if(!value && required) {
        return '레벨명은 필수 입력 항목입니다.';
    } else if (!value && !required) {
        return null;
    }
    if(!(/^[가-힣a-zA-Z0-9]{1,16}$/.test(value))) {
        return '레벨명은 한글, 영문, 숫자를 이용하여 1자 이상 16자 이내만 가능합니다.';
    }
    return null;
};

exports.site = function(value, required) {
    if(!value && required) {
        return '사이트명은 필수 입력 항목입니다.';
    } else if (!value && !required) {
        return null;
    }
    if(!(/^[가-힣a-zA-Z0-9]{2,16}$/.test(value))) {
        return '사이트명은 한글, 영문, 숫자를 이용하여 2자 이상 16자 이내만 가능합니다.';
    }
    return null;
};

exports.distributor = function(value, required) {
    if(!value && required) {
        return '총판명은 필수 입력 항목입니다.';
    } else if (!value && !required) {
        return null;
    }
    if(!(/^[가-힣a-zA-Z0-9]{2,16}$/.test(value))) {
        return '총판명은 한글, 영문, 숫자를 이용하여 2자 이상 16자 이내만 가능합니다.';
    }
    return null;
};

exports.memo = function(value, required) {
    if(!value && required) {
        return '메모는 필수 입력 항목입니다.';
    } else if (!value && !required) {
        return null;
    }
    if(!(/^.{1,200}$/.test(value))) {
        return '메모는 최대 200자 이내입니다.';
    }
    return null;
};

exports.bonus = function(value, required) {
    if(!value && required) {
        return '보너스는 필수 입력 항목입니다.';
    } else if (!value && !required) {
        return null;
    }
    if(Number(value) < 0 || Number(value) > 100) {
        return '보너스는 최소 0%, 최대 100%까지 가능합니다.';
    }
    return null;
};

exports.maxBet = function(value, required) {
    if(!value && required) {
        return '최대 배팅 금액은 필수 입력 항목입니다.';
    } else if (!value && !required) {
        return null;
    }
    if(Number(value) < 1) {
        return '최대 배팅 금액은 1원보다 적을 수 없습니다.';
    }
    return null;
};

exports.minBet = function(value, required) {
    if(!value && required) {
        return '최소 배팅 금액은 필수 입력 항목입니다.';
    } else if (!value && !required) {
        return null;
    }
    if(Number(value) < 1) {
        return '최소 배팅 금액은 1원보다 적을 수 없습니다.';
    }
    return null;
};

exports.score = function(value, required) {
    if(!value && required) {
        return '점수는 필수 입력 항목입니다.';
    } else if (!value && !required) {
        return null;
    }
    if(Number(value) < 0) {
        return '점수는 0보다 작을 수 없습니다.';
    }
    return null;
};

exports.cancelLimit = function(value, required) {
    if(!value && required) {
        return '배팅 취소 시간은 필수 입력 항목입니다.';
    } else if (!value && !required) {
        return null;
    }
    if(Number(value) < 1) {
        return '배팅 취소 시간은 1분보다 작을 수 없습니다.';
    }
    return null;
};

exports.cancelCount = function(value, required) {
    if(!value && required) {
        return '배팅 취소 횟수는 필수 입력 항목입니다.';
    } else if (!value && !required) {
        return null;
    }
    if(Number(value) < 1) {
        return '배팅 취소 횟수는 1보다 작을 수 없습니다.';
    }
    return null;
};

exports.ip = function(value, required) {
    if(!value && required) {
        return '아이피는 필수 입력 항목입니다.';
    } else if (!value && !required) {
        return null;
    }
    if(!(/^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}$/.test(value))) {
        return '적절하지 않는 아이피 형식입니다.';
    }
    return null;
};

exports.team = function(value, required) {
    if(!value && required) {
        return '팀명은 필수 입력 항목입니다.';
    } else if (!value && !required) {
        return null;
    }
    if(!(/^[가-힣a-zA-Z0-9 '"(){}\[\]]{2,30}$/.test(value))) {
        return '팀명은 한글, 숫자, 영문, 괄호, 따옴표, 띄어쓰기를 이용하여 최소 2자, 최대 30자까지 가능합니다.';
    }
    return null;
};

exports.rate = function(value, required) {
    if(!value && required) {
        return '배당은 필수 입력 항목입니다.';
    } else if (!value && !required) {
        return null;
    }
    if(!(/^\d{1,2}(|(\.(?=\d))\d{0,2})$/.test(value))) {
        return '배당은 최소 00.00, 최대 99.99입니다.';
    }
    return null;
};

exports.schedule = function(value, required) {
    if(!value && required) {
        return '경기 일시 필수 입력 항목입니다.';
    } else if (!value && !required) {
        return null;
    }
    if(!(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/.test(value))) {
        return '경기 일시는 YYYY-MM-DD HH:II 형식으로 입력해주세요.';
    }
    return null;
};

exports.btype = function(value, required) {
    if(!value && required) {
        return '배팅타입은 필수 입력 항목입니다.';
    } else if (!value && !required) {
        return null;
    }
    var _enum = ['2-WAY', '3-WAY', 'VARIETY'];
    for(var i = 0; i < _enum.length; i++) {
        if(_enum[i] === value) {
            return null;
        }
    }
    return '적절하지 않는 배팅타입입니다.';
};

exports.mtype = function(value, required) {
    if(!value && required) {
        return '매치타입은 필수 입력 항목입니다.';
    } else if (!value && !required) {
        return null;
    }
    var _enum = ['일반', '핸디캡', '언더오버'];
    for(var i = 0; i < _enum.length; i++) {
        if(_enum[i] === value) {
            return null;
        }
    }
    return '적절하지 않는 매치타입입니다.';
};

exports.matchState = function(value, required) {
    if(!value && required) {
        return '매치 상태는 필수 입력 항목입니다.';
    } else if (!value && !required) {
        return null;
    }
    var _enum = ['등록', '배팅', '마감', '종료'];
    for(var i = 0; i < _enum.length; i++) {
        if(_enum[i] === value) {
            return null;
        }
    }
    return '적절하지 않는 매치 상태입니다.';
};

exports.financeState = function(value, required) {
    if(!value && required) {
        return '신청 상태는 필수 입력 항목입니다.';
    } else if (!value && !required) {
        return null;
    }
    var _enum = ['신청', '승인'];
    for(var i = 0; i < _enum.length; i++) {
        if(_enum[i] === value) {
            return null;
        }
    }
    return '적절하지 않는 신청 상태입니다.';
};

exports.siteState = function(value, required) {
    if(!value && required) {
        return '사이트 상태는 필수 입력 항목입니다.';
    } else if (!value && !required) {
        return null;
    }
    var _enum = ['정상', '점검', '정지'];
    for(var i = 0; i < _enum.length; i++) {
        if(_enum[i] === value) {
            return null;
        }
    }
    return '적절하지 않은 사이트 상태입니다.';
};

exports.userState = function(value, required) {
    if(!value && required) {
        return '회원 상태는 필수 입력 항목입니다.';
    } else if (!value && !required) {
        return null;
    }
    var _enum = ['정지', '일반', '테스터', '운영자', '관리자'];
    for(var i = 0; i < _enum.length; i++) {
        if(_enum[i] === value) {
            return null;
        }
    }
    return '적절하지 않은 회원 상태입니다.';
};

exports.questionState = function(value, required) {
    if(!value && required) {
        return '질문 상태는 필수 입력 항목입니다.';
    } else if (!value && !required) {
        return null;
    }
    var _enum = ['등록', '처리중', '완료'];
    for(var i = 0; i < _enum.length; i++) {
        if(_enum[i] === value) {
            return null;
        }
    }
    return '적절하지 않은 질문 상태입니다.';
};

exports.result = function(value, required) {
    if(!value && required) {
        return '매치 결과는 필수 입력 항목입니다.';
    } else if (!value && !required) {
        return null;
    }
    var _enum = [
        // used in 3-way
        '친정승', '무승부', '원정승',
        // used in n-way
        '선택1', '선택2', '선택3', '선택4', '선택5', '선택6', '선택7', '선택8', '선택9', '선택10',
        '선택11', '선택12', '선택13', '선택14', '선택15', '선택16', '선택17', '선택18', '선택19', '선택20'
    ];
    for(var i = 0; i < _enum.length; i++) {
        if(_enum[i] === value) {
            return null;
        }
    }
    return '매치 결과가 입력되지 않았거나 적절하지 않는 결과입니다.';
};

exports.kind = function(value, required) {
    if(!value && required) {
        return '종목명은 필수 입력 항목입니다.';
    } else if (!value && !required) {
        return null;
    }
    if(!(/^.{2,30}$/.test(value))) {
        return '종목명은 최소 2자, 최대 30자까지 가능합니다.';
    }
    return null;
};

exports.league = function(value, required) {
    if(!value && required) {
        return '리그명은 필수 입력 항목입니다.';
    } else if (!value && !required) {
        return null;
    }
    if(!(/^.{2,30}$/.test(value))) {
        return '리그명은 최소 2자, 최대 30자까지 가능합니다.';
    }
    return null;
};

exports.offset = function(value, required) {
    if(!value && required) {
        return '기준점은 필수 입력 항목입니다.';
    } else if (!value && !required) {
        return null;
    }
    if(!(/^([-]?\d{1,2})(|(\.(?=\d))\d{0,2})$/.test(value))) {
        return '기준점은 -99.99에서 99.99까지입니다.';
    }
    return null;
};

exports.subject = function(value, required) {
    if(!value && required) {
        return '버라이어티 주제는 필수 입력 항목입니다.';
    } else if (!value && !required) {
        return null;
    }
    if(!(/^.{2,50}$/.test(value))) {
        return '버라이어티 주제는 한글, 숫자, 영문, 괄호, 따옴표, 띄어쓰기, 특수문자(!?@#$%^&*-_=+)를 이용하여 최소 2자, 최대 50자까지 가능합니다.';
    }
    return null;
};

exports.kindConfig = function(value, required) {
    if(!value && required) {
        return '선택지는 필수 입력 항목입니다.';
    } else if (!value && !required) {
        return null;
    }
    for(var i = 0; i<value.length; i++) {
        if(!(/^.{2,30}$/.test(value[i].name))) {
            return '종목명은 한글, 숫자, 영문, 괄호, 따옴표, 띄어쓰기, 특수문자(!?@#$%^&*-_=+)를 이용하여 최소 2자, 최대 30자까지 가능합니다.';
        }
        if(value[i].som !== '단일' && value[i].som !== '조합') {
            return '종목 배팅 타입은 단일 또는 조합만 가능합니다.';
        }
        if(Number(value[i].maxMulti) < 1) {
            return '최대 조합 매치 수는 1보다 작을 수 없습니다.';
        }
        if(value[i].nah !== true && value[i].nah !== false) {
            return '일반+핸디캡 조합 가능 유무가 잘못되었습니다.';
        }
        if(value[i].nau !== true && value[i].nau !== false) {
            return '일반+언더오버 조합 가능 유무가 잘못되었습니다.';
        }
        if(value[i].hau !== true && value[i].hau !== false) {
            return '핸디캡+언더오버 조합 가능 유무가 잘못되었습니다.';
        }
    }
    return null;
};

exports.siteAnswer = function(value, required) {
    if(!value && required) {
        return '액션명은 필수 입력 항목입니다.';
    } else if (!value && !required) {
        return null;
    }
    for(var i = 0; i<value.length; i++) {
        if(!(/^.{2,10}$/.test(value[i].action))) {
            return '액션명은 한글, 영문, 숫자를 포함하여 2자 이상 10자 이내로 가능합니다.';
        }
        if(!(/^.{2,50}$/.test(value[i].subject))) {
            return '제목은 최소 2자, 최대 50자까지 가능합니다.';
        }
        if(!(/^.{1,500}$/.test(value[i].content))) {
            return '답변 내용은 최대 500자까지 가능합니다.';
        }
    }
    return null;
};

exports.title = function(value, required) {
    if(!value && required) {
        return '질문 제목은 필수 입력 항목입니다.';
    } else if (!value && !required) {
        return null;
    }
    if(!(/^.{2,50}$/.test(value))) {
        return '질문 제목은 최소 2자, 최대 50자까지 가능합니다.';
    }
    return null;
};

exports.content = function(value, required) {
    if(!value && required) {
        return '질문 내용은 필수 입력 항목입니다.';
    } else if (!value && !required) {
        return null;
    }
    if(!(/^.{1,500}$/.test(value))) {
        return '질문 내용은 최대 500자까지 가능합니다.';
    }
    return null;
};

exports.answer = function(value, required) {
    if(!value && required) {
        return '답변은 필수 입력 항목입니다.';
    } else if (!value && !required) {
        return null;
    }
    if(!(/^.{1,500}$/.test(value))) {
        return '답변은 최대 500자까지 가능합니다.';
    }
    return null;
};

exports.userMemo = function(value, required) {
    if(!value && required) {
        return '메모는 필수 입력 항목입니다.';
    } else if (!value && !required) {
        return null;
    }
    for(var i = 0; i<value.length; i++) {
        if(!(/^.{1,200}$/.test(value[i].content))) {
            return '메모는 최대 200자 이내입니다.';
        }
        if(!(/^.{1,30}$/.test(value[i].content))) {
            return '메모 일시는 최대 30자 이내입니다.';
        }
    }
    return null;
};

exports.accountBank = function(value, required) {
    if(!value && required) {
        return '은행명은 필수 입력 항목입니다.';
    } else if (!value && !required) {
        return null;
    }
    if(!(/^[ㄱ-힣a-zA-Z0-9]{1,50}$/.test(value))) {
        return '은행명은 50자 이내입니다.';
    }
    return null;
};

exports.accountNumber = function(value, required) {
    if(!value && required) {
        return '계좌번호는 필수 입력 항목입니다.';
    } else if (!value && !required) {
        return null;
    }
    if(!(/^[\-0-9]{1,50}$/.test(value))) {
        return '계좌번호는 30자 이내입니다.';
    }
    return null;
};

exports.accountPin = function(value, required) {
    if(!value && required) {
        return '계좌 인증코드는 필수 입력 항목입니다.';
    } else if (!value && !required) {
        return null;
    }
    if(!(/^[0-9]{4,8}$/.test(value))) {
        return '계좌 인증코드는 숫자로 이루어진 4~8자입니다.';
    }
    return null;
};

exports.option = function(value, required) {
    if(!value && required) {
        return '종목 설정은 필수 입력 항목입니다.';
    } else if (!value && !required) {
        return null;
    }
    if(!Array.isArray(value) || value.length < 4) {
        return '선택지는 최소 4개여야 합니다.';
    }
    for(var i = 0; i<value.length; i++) {
        if(!(/^.{2,30}$/.test(value[i].name))) {
            return '선택지명은 한글, 숫자, 영문, 괄호, 따옴표, 띄어쓰기, 특수문자(!@#$%^&*-_=+)를 이용하여 최소 2자, 최대 30자까지 가능합니다.';
        }
        if(!(/^\d{1,2}(|(\.(?=\d))\d{0,2})$/.test(value[i].rate))) {
            return '배당은 최소 00.00, 최대 99.99입니다.';
        }
    }
    return null;
};

exports.imagePath = function(value, required) {
    if(!value && required) {
        return '이미지 경로는 필수 입력 항목입니다.';
    } else if (!value && !required) {
        return null;
    }
    if(!(/^.{1,500}$/.test(value))) {
        return '이미지 경로는 500자 이내입니다.';
    }
    return null;
};

exports.country = function(value, required) {
    if(!value && required) {
        return '국가명은 필수 입력 항목입니다.';
    } else if (!value && !required) {
        return null;
    }
    if(!(/^[가-힣a-zA-Z0-9]{2,30}$/.test(value))) {
        return '국가명은 한글, 영문, 숫자를 이용하여 최소 2자, 30자 이내입니다.';
    }
    return null;
};
