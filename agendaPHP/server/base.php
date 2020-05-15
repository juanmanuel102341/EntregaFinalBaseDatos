<?php
/**
 *
 */
class MiSQL
{
  private $host = '';
  private $user = '';
  private $password ='';
  private $conexion;
  public $error;
  function __construct($host, $user, $password) {
  $this->host=$host;
  $this->user=$user;
  $this->password=$password;
  //echo $this->host." ".$this->user." ".$this->password;
 }
 function initConexion($nombre_db){
   $this->conexion = new mysqli($this->host, $this->user, $this->password, $nombre_db);
   if ($this->conexion->connect_error) {
     return "Error:" . $this->conexion->connect_error;
   }else {
     return "OK";
   }
 }
 function ejecutarQuery($query){

   $dataQuery=$this->conexion->query($query);
   if( !$dataQuery){
       $this->conexion->error;
       $this->error= $this->conexion->error;
   }
   return $dataQuery;
 }
 function cerrarConexion(){
   $this->conexion->close();
 }
 function newTable($nombre_tbl, $campos){
   $sql = 'CREATE TABLE '.$nombre_tbl.' (';
   $length_array = count($campos);
   $i = 1;
   foreach ($campos as $key => $value) {
     $sql .= $key.' '.$value;
     if ($i!= $length_array) {
       $sql .= ', ';
     }else {
       $sql .= ');';
     }
     $i++;
   }
   //echo $sql;
   return $this->ejecutarQuery($sql);
 }
 function nuevaRestriccion($tabla, $restriccion){
   $sql = 'ALTER TABLE '.$tabla.' '.$restriccion;
   return $this->ejecutarQuery($sql);
 }
 function nuevaRelacion($from_tbl, $to_tbl, $from_field, $to_field){
   $sql = 'ALTER TABLE '.$from_tbl.' ADD FOREIGN KEY ('.$from_field.') REFERENCES '.$to_tbl.'('.$to_field.');';
   return $this->ejecutarQuery($sql);
 }
 function insertData($tabla, $data){
   $sql = 'INSERT INTO '.$tabla.' (';
   $i = 1;
   foreach ($data as $key => $value) {
     $sql .= $key;
     if ($i<count($data)) {
       $sql .= ', ';
     }else $sql .= ')';
     $i++;
   }
   $sql .= ' VALUES (';
   $i = 1;
   foreach ($data as $key => $value) {
     $sql .= $value;
     if ($i<count($data)) {
       $sql .= ', ';
     }else $sql .= ');';
     $i++;
   }
//echo $sql;
   return $this->ejecutarQuery($sql);
 }
 function getConexion(){
   return $this->conexion;
 }
 function actualizarRegistro($tabla, $data, $condicion){
   $sql = 'UPDATE '.$tabla.' SET ';
   $i=1;
   foreach ($data as $key => $value) {
     $sql .= $key.'='.$value;
     if ($i<sizeof($data)) {
       $sql .= ', ';
     }else $sql .= ' WHERE '.$condicion.';';
     $i++;
   }
 return $this->ejecutarQuery($sql);
//  echo $sql;
 }
 function eliminarRegistro($tabla, $condicion){
   $sql='DELETE FROM '.$tabla. ' WHERE '.$condicion.';';
 //  echo $sql;
 return $this->ejecutarQuery($sql);
 }
 function consultar($tablas, $campos, $condicion = ""){
   $sql = "SELECT ";
   $ref=array_keys($campos);
   $ultima_key = end($ref);
   foreach ($campos as $key => $value) {
     $sql .= $value;
     if ($key!=$ultima_key) {
       $sql.=", ";
     }else $sql .=" FROM ";
   }
   $ref2=array_keys($tablas);
   $ultima_key = end($ref2);
   foreach ($tablas as $key => $value) {
     $sql .= $value;
     if ($key!=$ultima_key) {
       $sql.=", ";
     }else $sql .= " ";
   }

   if ($condicion == "") {
     $sql .= ";";
   }else {
     $sql .= $condicion.";";
   }

   return $this->ejecutarQuery($sql);
  //    echo $sql;
 }

}


 ?>
