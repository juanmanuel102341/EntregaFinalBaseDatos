<?php

require("base.php");
$con=new MiSQL('localhost','user_agenda','12345');
$response['conexion']=$con->initConexion('AgendaPhp');
if($response['conexion']=='OK'){
//'.$_POST['user'].'
//$_POST['pass']
$response['data1']=$_POST['user'];
$response['data2']=$_POST['password'];
  $resultado_consulta = $con->consultar(['usuarios'],
    ['email', 'password','id'], 'WHERE email="'.$_POST['user'].'"');

  if($resultado_consulta->num_rows !=0){
    $fila=$resultado_consulta->fetch_assoc();
    $acceso=password_verify($_POST['password'], $fila['password']);
    if($acceso){
      session_start();
       $_SESSION['id']=$fila['id'];
       $response['id']=$fila['id'];
      $response['acceso']='concedido';
    }else{
      $response['acceso']='rechazado';
      $response['motivo']='contraseña erronea';
    }
  }else{
  $response['acceso']='rechazado';
  $response['motivo']='usuario erroneo';
  }

}else{
//  $response['motivo']='problemas de conexion con la base de datos';
  $response['msn']='conexion n realizada';
}
echo json_encode($response);
$con->cerrarConexion();


//$response['msn']='probando';

 ?>
