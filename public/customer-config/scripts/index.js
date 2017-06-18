document.onkeypress = function(e) {
  if (e.which == 13) {
    SubmitCustomerConfig();
  }
};

function DisplayMessage(toggle, msg) {
  if (toggle) {
    $('#message-controller').removeClass('hide');
    $('#message').html(msg);
    return;
  }
  $('#message-controller').addClass('hide');
}

function CheckNick() {

  var nick = $('#nick').val();
  var _csrf = $('#_csrf').val();

  $.ajax('/customer-config/check-nick', {
    method: 'POST',
    data: {
      nick: nick,
      _csrf: _csrf
    },
    success: function(res, textStatus, jqXHR) {
      if (res.failure) {
        $('#user_nick_info').html(res.failure);
        $('#user_nick_info').attr('class', 'alert alert-danger input-width-50');
        return;
      }
      $('#user_nick_info').html('사용해도 좋습니다.');
      $('#user_nick_info').attr('class', 'alert alert-success input-width-50');
    },
    error: function(jqXHR, textStatus, errorThrown) {
      alert('새로고침(F5) 후에 다시 시도해주세요.');
    }
  });
}

function SelectSite(siteId) {

  $('.list-group-item').removeClass('active');
  $('.list-group-item').attr('data-selected', 'false');

  $('#' + siteId).addClass('active');
  $('#' + siteId).attr('data-selected', 'true');
}

function SubmitCustomerConfig() {

  var _csrf = $('#_csrf').val();
  var uid = $('#uid').val();
  var nick = $('#nick').val();
  var email = $('#email').val();
  var phone = $('#phone').val();
  var recommander = $('#recommander').val();
  var site = '';

  $('.list-group-item').each(function() {
    if ($(this).attr('data-selected') == 'true') {
      site = $(this).children("span.siteName").html();
    }
  });

  if (!_csrf) {
    alert('새로고침(F5) 후에 다시 시도해주세요.');
    return;
  } else if (!nick) {
    alert('닉네임을 입력하세요.');
    $('#nick').focus();
    return;
  } else if (!site) {
    alert('서버를 선택하세요.');
    $('#site').attr("tabindex", -1).focus();
    return;
  }

  $.ajax('/customer-config', {
    method: 'POST',
    data: {
      uid: uid,
      nick: nick,
      email: email,
      phone: phone,
      site: site,
      recommander: recommander,
      _csrf: _csrf
    },
    success: function(res, textStatus, jqXHR) {
      if (res.failure) return alert(res.failure);
      if (res.redirectTo) return window.location = res.redirectTo;
    },
    error: function(jqXHR, textStatus, errorThrown) {
      alert('새로고침(F5) 후에 다시 시도해주세요.');
    }
  });
}
