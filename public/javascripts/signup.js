function SubmitSignup() {

  $.post('/signup', {
    uid: $('#uid').val(),
    password: $('#password').val(),
    confirm: $('#confirm').val(),
    _csrf: $('#_csrf').val()
  }, function(res, status) {

  }).fail(function(jqXHR, status, errorThrown) {

  });
}
