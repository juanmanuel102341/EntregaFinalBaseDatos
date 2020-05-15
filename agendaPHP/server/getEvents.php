<?php

require("base.php");
session_start();
$con=new MiSQL('localhost','user_agenda','12345');
if($con->initConexion('AgendaPhp')=='OK'){
$response['conexion']=true;
  $resultado_consulta = $con->consultar(['eventos'],
    ['*'], 'WHERE fk_usuario="'.$_SESSION['id'].'"');
  if($resultado_consulta->num_rows !=0){
    $i=0;
    while($fila=$resultado_consulta->fetch_assoc()){
      $response['inicio'][$i]['id']=$fila['id'];
      $response['inicio'][$i]['titulo']=$fila['titulo'];
      $response['inicio'][$i]['fecha_inicio']=$fila['fecha_inicio'];
      $response['inicio'][$i]['dia_completo']=$fila['dia_completo'];
      $response['inicio'][$i]['fecha_fin']=$fila['fecha_fin'];
      $response['inicio'][$i]['hora_inicio']=$fila['hora_inicio'];
      $response['inicio'][$i]['hora_fin']=$fila['hora_fin'];
      $i++;
    }
    $response['exito']=true;
  }else{
  $response['exito']=false;//no hay datos

  }

}else{
  $response['conexion']=false;
  $response['motivo']="problemas de conexion con base de datos, volviendo al log in";
}
echo json_encode($response);

 ?>
