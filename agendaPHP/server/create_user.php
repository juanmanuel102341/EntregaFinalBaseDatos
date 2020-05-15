<?php
require("base.php");
$con=new MiSQL('localhost','user_agenda','12345');
$response['conexion']=$con->initConexion('AgendaPhp');
if($response['conexion']=='OK'){
  echo "conexion ok";

  generarUsuario('juan123@nextu','1983-11-25','juan gomez','1234');
  generarUsuario('pedro@nextu','1993-01-10','rigoberto gomez','4567');
  generarUsuario('raul@nextu','1973-5-05','luciano ortiz','9393');
}
echo $response['conexion'];
echo $response['msn'];
function generarUsuario($email, $fecha_nac, $nombre, $password){
  global $con;
  global $response;
  $pss=password_hash($password,PASSWORD_DEFAULT);
  $data['email']="'$email'";
  $data['fecha_nacimiento']="'$fecha_nac'";
  $data['nombre']="'$nombre'";
  $data['password']="'$pss'";
if($response['msn']=$con->insertData('usuarios',$data)){
  $response['msn'] ="usuarios se crearon exitosamente";
}else{
  $response['msn']="problemas en la creacion de usuarios";
}
}
 ?>
