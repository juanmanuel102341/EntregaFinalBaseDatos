
function getObjEventos(id,titulo,inicio_fecha,fin_fecha, inicio_horario, fin_horario, allDay){
  console.log("entrando en eventos obj");
  var auxObj=new Object();
  auxObj.id=id;
  auxObj.title=titulo;
  auxObj.start=inicio_fecha;
  auxObj.end="";
  auxObj.allDay="";
  if(typeof(allDay)=="string"){
    console.log("setriando boolean string ");
    if(allDay=="false"){
      allDay=false;
    }else{
      allDay=true;
    }
  }
  if(allDay==false){
    if(fin_fecha!=""&&fin_horario!=""){
      // usuario puso fecha end y horario
      console.log(" usuario puso fecha end y horario");
      auxObj.end=fin_fecha+" "+fin_horario;
    }else if(fin_fecha==""&&fin_horario!=""){
      //usuario n puso fecha end pero si horario
      console.log("usuario n puso fecha end pero si horario");
      auxObj.end=inicio_fecha+" "+fin_horario;//tomo inicio fecha asi hace el calculo en week
    }else if(fin_fecha!=""&&fin_horario==""){
      console.log("usuario puso fecha end pero no fin de horario");
      auxObj.end=fin_fecha;//usuario puso fecha end pero no fin de horario
    }
    if(inicio_horario!=""){
      console.log("usuario  puso horario de inicio");
      auxObj.start=inicio_fecha+" "+inicio_horario;
    }
  }
  auxObj.allDay=allDay;
  console.log("titulo "+auxObj.title);
  console.log("inicio_fecha "+auxObj.start);
  console.log("fin_fecha "+auxObj.end);
  console.log("allDay "+auxObj.allDay);
return auxObj;
}
 class EventManager {


    constructor() {
      console.log("initi calendario app js");
        this.urlBase = "/events"
        this.obtenerDataInicial();
    }
     obtenerDataInicial() {
        let url = this.urlBase + "/all"
        $.get(url, function(result) {
           console.log("volviendo del sever end "+result);
           var arrObj=[]
           var obj1;
           if(result!="null"){
          console.log("initialize calendarioooo ")
          var obj=JSON.parse(result)
          console.log("TAM DE ATT OBJ "+obj.length)
          for(var index in obj){

              var titulo=obj[index].title;
              var inicio_fecha=obj[index].start;
              var fin_fecha=obj[index].end;
              var inicio_horario=obj[index].start_hour;
              var fin_horario=obj[index].end_hour;
              var id_evento=obj[index].id;
              var allDay=obj[index].allDay;

              console.log("titulo "+titulo)
              console.log("inicio_fecha "+inicio_fecha)
              console.log("fin_fecha "+fin_fecha)
              console.log("inicio_horario "+inicio_horario)
              console.log("fin_horario "+fin_horario)
              console.log("id_evento "+id_evento)
//param id,titulo,inicio_fecha,fin_fecha, inicio_horario, fin_horario, allDay
             arrObj[arrObj.length]=getObjEventos(id_evento,titulo,inicio_fecha,fin_fecha,inicio_horario,fin_horario,allDay);


            }
            var d=JSON.stringify(arrObj);
           console.log("********data********");
           console.log(d);
          }else{
            console.log("no hay datos desde cliente")
          }
            callCalendario(arrObj);

        })

    }
    guardarEvento() {
        $('.addButton').on('click', (evento) => {
          evento.preventDefault()
          let ev = {
              titulo: $('#titulo').val(),
              inicio_fecha: $('#start_date').val(),
              fin_fecha: $('#end_date').val(),
              inicio_horario:$('#start_hour').val(),
              fin_horario:$('#end_hour').val(),
              allDay:$('#allDay').is(':checked')
          }
            let url = this.urlBase + "/new"
            console.log("mi url "+url);
            if (ev.titulo != "" && ev.inicio_fecha != "") {

             $.post(url, ev, function(response) {
                 console.log("vuelta del servidor");
                 console.log("volviendo de INDEX "+response)
                 //calculo fechas con horarios
                 var obj=getObjEventos(response,ev.titulo,ev.inicio_fecha,ev.fin_fecha,ev.inicio_horario,ev.fin_horario,ev.allDay)
                 $('.calendario').fullCalendar('renderEvent',obj)
                  });

            } else {
                alert("Complete los campos obligatorios para el evento")
            }
        })
    }

    logOutCalendario(){
      $(".logout-image, .logoutText").click(function(){
        console.log("click logo out");
        window.location.href = "http://localhost:3000/index.html";

      }).css("cursor","pointer");


    }
    inicializarFormulario() {
        $('#start_date, #titulo, #end_date').val('');
        $('#start_date, #end_date').datepicker({
            dateFormat: "yy-mm-dd"
        });
        $('.timepicker').timepicker({
            timeFormat: 'HH:mm:ss',
            interval: 30,
            minTime: '5',
            maxTime: '23:59:59',
            defaultTime: '',
            startTime: '5:00',
            dynamic: false,
            dropdown: true,
            scrollbar: true
        });
        $('#allDay').on('change', function(){
            if (this.checked) {
                $('.timepicker, #end_date').attr("disabled", "disabled")
            }else {
                $('.timepicker, #end_date').removeAttr("disabled")
            }
        })
    }

   inicializarCalendario(eventos) {

        $('.calendario').fullCalendar({
            header: {
                left: 'prev,next today',
                center: 'title',
                right: 'month,agendaWeek,basicDay'
            },
            defaultDate: Date.getdate,
            navLinks: true,
            editable: true,
            eventLimit: true,
            droppable: true,
            dragRevertDuration: 0,
            timeFormat: 'H:mm',

            eventDrop:function(evento){
              console.log("evnto drop title "+evento.title);

              var inicio_fecha="";
              var fin_fecha="";
              if(evento.start!=null){
                inicio_fecha=moment(evento.start).format('YYYY-MM-DD HH:mm:ss')
              }
              if(evento.end!=null){
                fin_fecha=moment(evento.end).format('YYYY-MM-DD HH:mm:ss')
              }
              console.log("evnto drop start "+inicio_fecha);
              console.log("evnto drop end "+fin_fecha);
              var inicioFecha_sin=inicio_fecha.substr(0,10);
              var horario_inicioFecha=inicio_fecha.substr(11,8);
              var finfecha_sin=fin_fecha.substr(0,10);
              var horario_finFecha=fin_fecha.substr(11,8);
              var allDay=evento.allDay;
              console.log("dat sin horario "+inicioFecha_sin);
              console.log("horario_star "+horario_inicioFecha);
              console.log("finfecha_sin "+finfecha_sin);
              console.log("horario_finFecha "+horario_finFecha);
              console.log("allDay "+allDay);
              console.log("tipo de allday "+typeof(allDay));
              var objUpdate={
                id:evento.id,
                inicio_fecha:inicioFecha_sin,
                fin_fecha:finfecha_sin,
                inicio_horario:horario_inicioFecha,
                fin_horario:horario_finFecha,
                allDay:allDay
              }

              $.post('/events/update',
              objUpdate, function (response){
                console.log("volviendo de actualizar app.js")
                  alert(response)
              })
          },
            events:eventos,
            eventDragStart: function (event,jsEvent){
                $('.delete').find('img').attr('src', "../img/trash-open.png");
                $('.delete').css('background-color', '#a70f19')
            },
            eventDragStop:function (evento,jsEvent) {
               var trashEl = $('.delete');
                var ofs = trashEl.offset();
                var x1 = ofs.left;
                var x2 = ofs.left + trashEl.outerWidth(true);
                var y1 = ofs.top;
                var y2 = ofs.top + trashEl.outerHeight(true);
                if (jsEvent.pageX >= x1 && jsEvent.pageX<= x2 &&
                    jsEvent.pageY >= y1 && jsEvent.pageY <= y2) {
                        //this.eliminarEvento(event)
                  console.log("basura drop activo");
                  $.post('/events/delete/', {id: evento.id},function(response) {
                              alert(response)
                    })
                      $('.calendario').fullCalendar('removeEvents', evento.id);


                    }
                }

            })

        }
    }

    const Manager = new EventManager()
    var callCalendario=function(obj){
      console.log("empieza cal");
        Manager.inicializarFormulario();
      Manager.inicializarCalendario(obj)

      Manager.guardarEvento();
      Manager.logOutCalendario();
    }
