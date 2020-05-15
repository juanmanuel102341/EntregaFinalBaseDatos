<?php
require("base.php");
session_start();
$con=new MiSQL('localhost','user_agenda','12345');
$response['conexion']=$con->initConexion('AgendaPhp');
if($response['conexion']=='OK'){
$data['titulo']="'".$_POST['titulo']."'";
$data['fecha_inicio']="'".$_POST['start_date']."'";

if($_POST['end_date']!=""){
  $data['fecha_fin']="'".$_POST['end_date']."'";
}
if($_POST['start_hour']!=""){
  $data['hora_inicio']="'".$_POST['start_hour']."'";
}
if($_POST['end_hour']!=""){
  $data['hora_fin']="'".$_POST['end_hour']."'";
}

$data['fk_usuario']="'".$_SESSION['id']."'";
if($_POST['allDay']=='false'){
  $mybool=0;
}else{
    $mybool=1;
}
$data['dia_completo']="'$mybool'";
if($con->insertData('eventos',$data)){
  $response['exito']=true;
  $response['msn']="insercion de datos exitosa";
$resultado=$con->consultar(['eventos'],['*'],'ORDER BY id DESC LIMIT 1');
$fila=$resultado->fetch_assoc();
$response['id']=$fila['id'];
}else{
  $response['exito']=false;
  $response['msn']="problema con la insercion de datos ".$con->error;
}


}
echo json_encode($response);

 ?>
