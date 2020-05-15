$(function(){
  var l = new Login();
})


class Login {
  constructor() {
    this.submitEvent()
  }

  submitEvent(){
    $('form').submit((event)=>{
      event.preventDefault()
      this.sendForm()
    })
  }

  sendForm(){
  var obj={user:$('#user').val(),
          password:$('#password').val()
          }
    console.log("user "+obj.user);
    console.log("pass "+obj.password);
    $.ajax({
      url: '../server/check_login.php',
      dataType: "json",
      cache: false,
      data: obj,
      type: 'POST',
      success: function(php_response){
        if (php_response.conexion == "OK") {

      if(php_response.acceso=='concedido'){
          alert(php_response.acceso);
            window.location.href = 'main.html';
      }else{
          alert(php_response.acceso+" motivo "+php_response.motivo);
      }

      }else{
        alert("error de conexion con base de datos");
      }
    },
      error: function(XHR, text_status, errorThrow){
        alert("error en la comunicación con el servidor xhr "+XHR+ " text_status "+text_status+" errorThrow "+errorThrow);
      }
    })
    }
  }
