
var $ = require("jquery");


var MongoClient= require('mongodb').MongoClient
var url="mongodb://localhost:27017/AgendaData"
var currentIdUser;
const http=require('http'),
      express=require('express'),
      bodyParser=require('body-parser')

const PORT=3000
const app=express()


const Server=http.createServer(app)

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static("client"))
var Operaciones= require('./CRUD.js')
var objs=[];
if($=='undefined'){
  console.log("$ undefinied")
}else {
  console.log("$ activo");
}
app.get('/events/all', function(req, res){
  console.log("iniciando servidor data");
  MongoClient.connect(url, function(err, client){
     if(err){
       console.log("error "+err)
       res.end("no");
     }else{
       console.log("iniciando servidor");
      console.log("usuario "+this.currentIdUser);
      var db = client.db('AgendaData');
       var coleccion=db.collection("events");
       objs=[];
       coleccion.find({id_usuario:this.currentIdUser}).toArray(function(error, result){
         if(error){
           console.log("error en la carga de datos "+error)
         }else{
           console.log("result "+result);
           if(result.length>0){
           console.log("carga exitosa tam "+result.length);
            for(var index in result){
                var titulo=result[index].titulo;
                var inicio_fecha=result[index].inicio_fecha;
                var fin_fecha=result[index].fin_fecha;
                var inicio_horario=result[index].inicio_horario;
                var fin_horario=result[index].fin_horario;
                var id_evento=result[index].id_events;
                var allDay=result[index].allDay;
                console.log("titulo "+titulo)
                console.log("inicio_fecha "+inicio_fecha)
                console.log("fin_fecha "+fin_fecha)
                console.log("inicio_horario "+inicio_horario)
                console.log("fin_horario "+fin_horario)
                console.log("id_evento "+id_evento)
                var inst=new Object();
                inst.title=titulo
                inst.start=inicio_fecha
                inst.end=fin_fecha
                inst.start_hour=inicio_horario
                inst.end_hour=fin_horario
                inst.id=id_evento;
                inst.allDay=allDay
                objs[objs.length]=inst;
                }
                res.send(JSON.stringify(objs));
              }else{
                console.log("no hay eventos para ese usuario");
                res.send("null");
              }

         }
       })
       client.close();
     }

   })

})
app.post('/login', function(req, res){
  var usuario=req.body.usuario;
  var password=req.body.password;
  console.log("usuario desde router "+usuario);
  console.log("password desde router "+password);
  console.log("entrando login");
  MongoClient.connect(url, function(err, client){
    if(err){
      console.log("error de conexion base de datos "+error);
        res.end("no");
    }else{
        console.log("conexion con base de datos");
         var db = client.db('AgendaData');
         var coleccion=db.collection("users");
         coleccion.findOne({usuario:usuario, password:password}, function(error, usuario_pot){
           if(error){
             console.log("error "+error);
             res.end("no");
           }
           if(usuario_pot==null){
            console.log("usuario o contraseña mal ingresados");
            res.end("no");
          }else{
            console.log("id del usuario "+usuario_pot.id);
            console.log("usuario en base de datos INDEX");
            this.currentIdUser=usuario_pot.id;
           res.end("yes");
          }

         })

          client.close();

        }
    })
})
app.post('/events/new',function(req,res){
var id_usuario=this.currentIdUser;
  var titulo=req.body.titulo;
  var inicio_fecha=req.body.inicio_fecha;
  var fin_fecha=req.body.fin_fecha;
  var inicio_horario=req.body.inicio_horario;
  var fin_horario=req.body.fin_horario;
  var allDay=req.body.allDay;
  console.log("******evento registrar **********");
  console.log("id_usuario "+id_usuario);
  console.log("titulo "+titulo);
  console.log("inicio_fecha "+inicio_fecha);
  console.log("fin_fecha "+fin_fecha);
  console.log("inicio_horario "+inicio_horario);
  console.log("fin_horario "+fin_horario);
  console.log("allDay "+allDay);
  console.log("allday tipo "+typeof(allDay));
  MongoClient.connect(url, function(err, client){
    if(err){
      console.log("error conexion base de datos "+err);
      res.end("no");
    }else{
      var db = client.db('AgendaData');
      var coleccion=db.collection("events");
      var id_events=0;
      id_events=Math.floor(Math.random(0)*10000)+1;
      coleccion.insertMany([{
      id_events:id_events,id_usuario:id_usuario, titulo:titulo, inicio_fecha:inicio_fecha, fin_fecha:fin_fecha,
      inicio_horario:inicio_horario, fin_horario:fin_horario, allDay:allDay
    }], function(error, result){
      if(error){
        console.log("error "+error);
      }else{
        console.log("resultado de la insercion nueva ");
        res.end(id_events.toString());
      }
    })
    client.close();
    }
  })

})
app.post('/events/update', function(req, resp){
  console.log("actualizar desde index servidor ");
  console.log("fecha inicio "+req.body.inicio_fecha);
  console.log("fecha fin "+req.body.fin_fecha);

var i_fecha=req.body.inicio_fecha;
var f_fecha=req.body.fin_fecha;
var inicio_horario=req.body.inicio_horario;
var fin_horario=req.body.fin_horario;
var id=parseInt(req.body.id);
var allDay=req.body.allDay;
  console.log("id "+id);

  console.log("inicio_fecha "+i_fecha);
  console.log("fin_fecha "+f_fecha);
  console.log("inicio_horario "+inicio_horario);
  console.log("fin_horario "+fin_horario);
  console.log("allDay "+allDay);
    console.log("typeof allDay "+typeof(allDay));
  MongoClient.connect(url, function(err, client){
    if(err){
      console.log("error "+error)
      res.send("no");
    }else{
      console.log("entrando a updatiar");
      var db = client.db('AgendaData');
      var coleccion=db.collection("events");

        coleccion.updateOne({id_events:id}, {$set: {inicio_fecha: i_fecha, fin_fecha:f_fecha, inicio_horario:inicio_horario, fin_horario:fin_horario, allDay:allDay}}, function(error,result){
        if(error){
          console.log("error "+error);
          res.send("no");
        }else{
           console.log("base d datos acutalizada "+result);
             resp.send("yes");
        }
        })



        client.close();
    }
})


})
app.post('/events/delete', function(req, resp){
  //corregi tema delete, tema id y su asignacion ( tomar wl q viene "de fabrica")
  console.log("index server delete activo "+req.body.id);
  var id=parseInt(req.body.id);
  MongoClient.connect(url, function(err, client){

  if(err){
    console.log("error conexion base de datos"+error)
    res.send("no");
  }else{
    var db = client.db('AgendaData');
    var coleccion=db.collection("events")
      try {
        coleccion.deleteOne({id_events:id},function(){

        })
        console.log("se elimino registro")
      } catch (e) {
        console.log("error "+e);
        resp.send("no delete")
      }finally{
        console.log("elemento borrado");
        resp.send("yes delete");
      }
      client.close();
    }

})

})

Server.listen(PORT, function(){
  console.log('server is listening on port: '+PORT)
})
