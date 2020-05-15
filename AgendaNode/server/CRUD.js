module.exports.insertarRegistro=function(db, _usuario, password, callback){
  let coleccion=db.collection("users")
  let id=Math.floor(Math.random(0)*10000)+1;
  coleccion.insertMany([
    {id:id, usuario:_usuario, password:password},

  ], (error, result) =>{
      if(error){
      console.log(error)
    }else{
        console.log("resultado de insert: "+result.toString())
      }
      callback(error,result);
  })

}
module.exports.eliminarRegistro=function(db, callback){
  let coleccion=db.collection("users")
  try {
    coleccion.deleteOne({edad:23})
    console.log("se elimino registro")
  } catch (e) {
    console.log("error "+e);
  }
}
module.exports.consultarYactualizar=function(db, callback){
  let coleccion=db.collection("users")
  coleccion.find().toArray((error, documento)=>{
    if(error)console.log(error)
    console.log(documento)
    callback()
  })
  try{
    coleccion.updateOne({nombre: "david2"}, {$set: {peso: 600}}, function(){
      coleccion.find().toArray((error, documento)=>{
        if(error)console.log(error)
        console.log(documento)
        callback()
      })
    })
    console.log("se ha actualizado el registro")
  }catch(e){
    console.log("error actualizado el registro: "+e)
  }

}
