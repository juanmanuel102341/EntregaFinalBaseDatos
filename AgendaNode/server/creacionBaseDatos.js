
var Operaciones=require('./CRUD.js');
var MongoClient= require('mongodb').MongoClient
var url="mongodb://localhost:27017/AgendaData"

creacionDeUsuario(url,"test1","123");
//creacionDeUsuario(url,"test2","456");
//creacionDeUsuario(url,"test3","789");
  function creacionDeUsuario(my_url,usuario,password){
    MongoClient.connect(my_url, function(err, client){

       if(err){
         console.log("error de  conexion a base de datos"+err);
       }else{
         var db = client.db('AgendaData');
          console.log("conexion establecida con la base de datos "+client);
           //parametros (db, _usuario, password, callback)
          Operaciones.insertarRegistro(db,usuario,password, function(err, result){
            if(err){
               console.log("callback error insercion de datos "+err);
            }else{
              console.log("callback conexion con base de datos exitosa"+result);

            }
          })
         }
    })
  }
