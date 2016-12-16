function SubmitRequest() {

  $.ajax({
    url: '/request',
    type: 'post',
    dataType: 'json',
    data: {
      email: $('#email').val(),
      description: $('#description').val(),
      _csrf: $('#_csrf').val()
    },
    success: function(data, textStatus, jqXHR) {
      if(data.hasOwnProperty('failure')) {
        alert('문의 등록에 실패하였습니다. (사유: ' + data.failure + ')');
      } else {
        alert('문의 등록에 성공하였습니다. 답변은 입력한 이메일로 전송됩니다.');
        $('#cs').modal('hide');
      }
    },
    error: function(jqXHR, textStatus, errorThrown) {
      alert('비정상적인 접근입니다. 새로고침 후에 다시 시도해주십시오.');
    }
  });
}
