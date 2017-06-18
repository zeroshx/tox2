var Login = function() {
  var handleLogin = function() {
    $('.login-form').validate({
      errorElement: 'span', //default input error message container
      errorClass: 'help-block', // default input error message class
      focusInvalid: false, // do not focus the last invalid input
      rules: {
        loginUid: {
          required: true
        },
        loginPassword: {
          required: true
        }
      },

      messages: {
        loginUid: {
          required: '아이디는 필수 항목입니다.'
        },
        loginPassword: {
          required: '비밀번호는 필수 항목입니다.'
        }
      },

      invalidHandler: function(event, validator) { //display error alert on form submit
        $('#login-form-message').html(validator.errorList[0].message);
        $('#login-form-alert').show();
      },

      highlight: function(element) { // hightlight error inputs
        $(element)
          .closest('.form-group').addClass('has-error'); // set error class to the control group
      },

      success: function(label) {
        label.closest('.form-group').removeClass('has-error');
        label.remove();
      },

      errorPlacement: function(error, element) {
        error.insertAfter(element.closest('.input-icon'));
      },

      submitHandler: function(form) {
        form.submit(); // form validation success, call ajax form submit
      }
    });

    $('.forget-form').validate({
      errorElement: 'span', //default input error message container
      errorClass: 'help-block', // default input error message class
      focusInvalid: false, // do not focus the last invalid input
      rules: {
        forgetEmail: {
          required: true
        }
      },

      messages: {
        forgetEmail: {
          required: '이메일은 필수 항목입니다.'
        }
      },

      invalidHandler: function(event, validator) { //display error alert on form submit
        $('#forget-form-message').html(validator.errorList[0].message);
        $('#forget-form-alert').show();
      },

      highlight: function(element) { // hightlight error inputs
        $(element)
          .closest('.form-group').addClass('has-error'); // set error class to the control group
      },

      success: function(label) {
        label.closest('.form-group').removeClass('has-error');
        label.remove();
      },

      errorPlacement: function(error, element) {
        error.insertAfter(element.closest('.input-icon'));
      },

      submitHandler: function(form) {
        form.submit(); // form validation success, call ajax form submit
      }
    });

    $('.signup-form').validate({
      errorElement: 'span', //default input error message container
      errorClass: 'help-block', // default input error message class
      focusInvalid: false, // do not focus the last invalid input
      rules: {
        signupUid: {
          required: true
        },
        signupPassword: {
          required: true
        },
        signupPasswordConfirm: {
          required: true
        }
      },

      messages: {
        signupUid: {
          required: '아이디는 필수 항목입니다.'
        },
        signupPassword: {
          required: '비밀번호는 필수 항목입니다.'
        },
        signupPasswordConfirm: {
          required: '비밀번호 확인은 필수 항목입니다.'
        }
      },

      invalidHandler: function(event, validator) { //display error alert on form submit
        $('#signup-form-message').html(validator.errorList[0].message);
        $('#signup-form-alert').show();
      },

      highlight: function(element) { // hightlight error inputs
        $(element)
          .closest('.form-group').addClass('has-error'); // set error class to the control group
      },

      success: function(label) {
        label.closest('.form-group').removeClass('has-error');
        label.remove();
      },

      errorPlacement: function(error, element) {
        error.insertAfter(element.closest('.input-icon'));
      },

      submitHandler: function(form) {
        form.submit(); // form validation success, call ajax form submit
      }
    });

    $('.question-form').validate({
      errorElement: 'span', //default input error message container
      errorClass: 'help-block', // default input error message class
      focusInvalid: false, // do not focus the last invalid input
      rules: {
        questionEmail: {
          required: true
        },
        questionContent: {
          required: true
        }
      },

      messages: {
        questionEmail: {
          required: '답변 받을 이메일 주소는 필수 항목입니다.'
        },
        questionContent: {
          required: '문의 내용은 필수 항목입니다.'
        }
      },

      invalidHandler: function(event, validator) { //display error alert on form submit
        $('#question-form-message').html(validator.errorList[0].message);
        $('#question-form-alert').show();
      },

      highlight: function(element) { // hightlight error inputs
        $(element)
          .closest('.form-group').addClass('has-error'); // set error class to the control group
      },

      success: function(label) {
        label.closest('.form-group').removeClass('has-error');
        label.remove();
      },

      errorPlacement: function(error, element) {
        error.insertAfter(element.closest('.input-icon'));
      },

      submitHandler: function(form) {
        form.submit(); // form validation success, call ajax form submit
      }
    });

    $('.login-form input').keypress(function(e) {
      if (e.which == 13) {
        if ($('.login-form').validate().form()) {
            $('#btn-login').click();
        }
        return false;
      }
    });

    $('.forget-form input').keypress(function(e) {
      if (e.which == 13) {
        if ($('.forget-form').validate().form()) {
          $('#btn-forget').click();
        }
        return false;
      }
    });

    $('.signup-form input').keypress(function(e) {
      if (e.which == 13) {
        if ($('.signup-form').validate().form()) {
          $('#btn-signup').click();
        }
        return false;
      }
    });

    $('#forget-password-form').click(function() {
      $('.login-form').hide();
      $('.forget-form').show();
      $('.signup-form').hide();
      $('.question-form').hide();
    });

    $('#btn-login-form1').click(function() {
      $('.login-form').show();
      $('.forget-form').hide();
      $('.signup-form').hide();
      $('.question-form').hide();
    });

    $('#btn-login-form2').click(function() {
      $('.login-form').show();
      $('.forget-form').hide();
      $('.signup-form').hide();
      $('.question-form').hide();
    });

    $('#btn-login-form3').click(function() {
      $('.login-form').show();
      $('.forget-form').hide();
      $('.signup-form').hide();
      $('.question-form').hide();
    });

    $('#btn-signup-form').click(function() {
      $('.login-form').hide();
      $('.forget-form').hide();
      $('.signup-form').show();
      $('.question-form').hide();
    });

    $('#btn-question-form').click(function() {
      $('.login-form').hide();
      $('.forget-form').hide();
      $('.signup-form').hide();
      $('.question-form').show();
    });

    $('#btn-login').click(function () {
      $.ajax({
        url: '/login',
        type: 'post',
        data: {
          uid: $('#loginUid').val(),
          password: $('#loginPassword').val(),
          _csrf: $('#_csrf').val()
        },
        success: function(res, textStatus, jqXHR) {
          if (res.failure) {
            $('#login-form-message').html(res.failure);
            $('#login-form-alert').show();
            return;
          }
          if (res.redirectTo) return window.location = res.redirectTo;
        },
        error: function(jqXHR, textStatus, errorThrown) {
          alert('새로고침(F5) 후에 다시 시도 바랍니다. 문제가 지속될 경우 고객센터로 문의 바랍니다.');
        }
      });
    });

    $('#btn-signup').click(function () {
      $.ajax({
        url: '/signup',
        type: 'post',
        data: {
          uid: $('#signupUid').val(),
          password: $('#signupPassword').val(),
          confirm: $('#signupPasswordConfirm').val(),
          _csrf: $('#_csrf').val()
        },
        success: function(res, textStatus, jqXHR) {
          if (res.failure) {
            $('#signup-form-message').html(res.failure);
            $('#signup-form-alert').show();
            return;
          }
          if (res.redirectTo) return window.location = res.redirectTo;
        },
        error: function(jqXHR, textStatus, errorThrown) {
          alert('새로고침(F5) 후에 다시 시도 바랍니다. 문제가 지속될 경우 고객센터로 문의 바랍니다.');
        }
      });
    });

    $('#btn-question').click(function () {
      $.ajax({
        url: '/request',
        type: 'post',
        data: {
          email: $('#questionEmail').val(),
          description: $('#questionContent').val(),
          _csrf: $('#_csrf').val()
        },
        success: function(res, textStatus, jqXHR) {
          if (res.failure) {
            $('#question-form-message').html(res.failure);
            $('#question-form-alert').show();
            return;
          }
          alert('문의가 성공적으로 등록되었습니다. 답변은 이메일로 전송됩니다.');
          $('#questionEmail').val('');
          $('#questionContent').val('');
        },
        error: function(jqXHR, textStatus, errorThrown) {
          alert('새로고침(F5) 후에 다시 시도 바랍니다. 문제가 지속될 경우 고객센터로 문의 바랍니다.');
        }
      });
    });
  }

  return {
    //main function to initiate the module
    init: function() {

      handleLogin();

      // init background slide images
      $('.login-bg').backstretch([
        "../assets/pages/img/login/bg1.jpg",
        "../assets/pages/img/login/bg2.jpg",
        "../assets/pages/img/login/bg3.jpg"
      ], {
        fade: 1000,
        duration: 3000
      });

      $('.forget-form').hide();
      $('.signup-form').hide();
      $('.question-form').hide();

    }

  };

}();

jQuery(document).ready(function() {
  Login.init();
});
