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

exports.nick = function(value, required) {
    if(!value && required) {
        return '닉네임은 필수 입력 항목입니다.';
    } else if (!value && !required) {
        return null;
    }
    if(!(/^[가-힣a-zA-Z0-9]{2,16}$/g.test(value))) {
        return '닉네임은 한글, 영문, 숫자를 이용하여 2자 이상 16자 이내만 가능합니다.';
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
    if(!(/^[0-9]+$/.test(value))) {
        return '보너스 입력값은 숫자만 가능합니다.';
    }
    if(value < 0 || value > 100) {
        return '보너스는 최소 0%, 최대 100%까지 가능합니다.';
    }
    return null;
};

exports.score = function(value, required) {
    if(!value && required) {
        return '점수는 필수 입력 항목입니다.';
    } else if (!value && !required) {
        return null;
    }
    if(!(/^[0-9]+$/.test(value))) {
        return '점수 입력값은 숫자만 가능합니다.';
    }
    if(value < 0) {
        return '보너스는 0보다 작을 수 없습니다.';
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

exports.matchstate = function(value, required) {
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
    if(!(/^[가-힣a-zA-Z0-9 !@#$%^&*-_=+'"(){}\[\]]{2,30}$/.test(value))) {
        return '종목명은 한글, 숫자, 영문, 괄호, 따옴표, 띄어쓰기, 특수문자(!@#$%^&*-_=+)를 이용하여 최소 2자, 최대 30자까지 가능합니다.';
    }
    return null;
};

exports.league = function(value, required) {
    if(!value && required) {
        return '리그명은 필수 입력 항목입니다.';
    } else if (!value && !required) {
        return null;
    }
    if(!(/^[가-힣a-zA-Z0-9 !@#$%^&*-_=+'"(){}\[\]]{2,30}$/.test(value))) {
        return '리그명은 한글, 숫자, 영문, 괄호, 따옴표, 띄어쓰기, 특수문자(!@#$%^&*-_=+)를 이용하여 최소 2자, 최대 30자까지 가능합니다.';
    }
    return null;
};

exports.offset = function(value, required) {
    if(!value && required) {
        return '리그명은 필수 입력 항목입니다.';
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
    if(!(/^[가-힣a-zA-Z0-9 !@#$%^&*-_=+'"(){}\[\]]{2,50}$/.test(value))) {
        return '버라이어티 주제는 한글, 숫자, 영문, 괄호, 따옴표, 띄어쓰기, 특수문자(!@#$%^&*-_=+)를 이용하여 최소 2자, 최대 50자까지 가능합니다.';
    }
    return null;
};

exports.option = function(value, required) {
    if(!value && required) {
        return '선택지는 필수 입력 항목입니다.';
    } else if (!value && !required) {
        return null;
    }
    if(!Array.isArray(value) || value.length < 4) {
        return '선택지는 최소 4개여야 합니다.';
    }
    for(var i = 0; i<value.length; i++) {
        if(!(/^[가-힣a-zA-Z0-9 !@#$%^&*-_=+'"(){}\[\]]{2,30}$/.test(value[i].name))) {
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
