<?php

require("base.php");

$con=new MiSQL('localhost','user_agenda','12345');
$response['conexion']=$con->initConexion('AgendaPhp');
if($response['conexion']=='OK'){
if($con->eliminarRegistro('eventos','id="'.$_POST['id'].'"')){
  $response['exito']=true;
  $response['msn']="registro eliminado exitosamente";
}else{
  $response['exito']=false;
  $response['msn']="no se ha podido eliminar error ".$con->error;
}
}
echo json_encode($response);

 ?>
