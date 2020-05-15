

    $('.loginButton').on('click', function(event) {
      console.log("click submit");
      var nombreUsuario = $('#user')
      var pass = $('#pass')
      console.log("desde app");
        if (nombreUsuario.val() != "" && pass.val() != "") {
          console.log("clock submit ");
            $.post('/login',{usuario: nombreUsuario.val(), password: pass.val()}, function(data){
              console.log("volviendo");

          if(data==='yes')
              {
                alert("concedido");
                 window.location.href = "http://localhost:3000/main.html";
              }else{
                alert("usuario o contraseña invalidos");
                 window.location.href = "./index.html";
              }
          })
        } else {
            alert("Complete todos los campos")
        }
    })
