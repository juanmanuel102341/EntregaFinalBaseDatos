<?php
require("base.php");

$con=new MiSQL('localhost','user_agenda','12345');
$response['conexion']=$con->initConexion('AgendaPhp');
if($response['conexion']=='OK'){

  if($_POST['allDay']=='false'){
    $mybool=0;
  }else{
    $mybool=1;
  }
$data['dia_completo']="'$mybool'";
$data['fecha_inicio']="'".$_POST['start_date']."'";
if($_POST['end_date']!=""){
$data['fecha_fin']="'".$_POST['end_date']."'";
}
$data['hora_inicio']="'".$_POST['start_hour']."'";
if($_POST['end_hour']!=""){
$data['hora_fin']="'".$_POST['end_hour']."'";
}
if($con->actualizarRegistro('eventos',$data,'id= "'.$_POST['id'].'"')) {
  $data['msg']="datos actualizados";
  $data['exito']=true;
}else{
  $data['msg']="datos no acutalizado error ".$con->error;
  $data['exito']=false;
}
}

echo json_encode($data);
 ?>
