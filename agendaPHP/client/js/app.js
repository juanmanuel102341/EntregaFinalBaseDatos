


class EventsManager {
    constructor() {
        this.obtenerDataInicial()

    }


    obtenerDataInicial() {
        let url = '../server/getEvents.php'
        $.ajax({
          url: url,
          dataType: "json",
          cache: false,
          processData: false,
          contentType: false,
          type: 'GET',
          success: (data) =>{
            var obj={
            id:'',
            title:'',
            start:'',
            end:'',
            allDay:''
            };
            var arrObj=[];
            if (data.conexion) {
              if(data.exito){
                console.log("entrando en la base de datos inicio");
                      for(var valores in data.inicio ){
                      console.log("obj "+valores);
                        var arr=data.inicio[valores];
                        obj=new Object()
                        obj.id=arr['id'];
                        obj.title=arr['titulo'];
                        if(arr['dia_completo']==0){
                        obj.start=arr['fecha_inicio']+" "+arr['hora_inicio'];
                        if(arr['fecha_fin']!=null&&arr['hora_fin']==null){
                          console.log("fecha fin distinto a nulo pero si hora igual nulo")
                            obj.end=arr['fecha_fin'];
                        }else if (arr['fecha_fin']!=null&&arr['hora_fin']!=null){
                          console.log("fecha fin  y hora distinto a nulo")
                            obj.end=arr['fecha_fin']+ " "+arr['hora_fin'];
                        }

                        obj.allDay=false;
                      }else{
                        obj.start=arr['fecha_inicio'];
                        obj.allDay=true;
                      }

                        console.log("hora_inicio: "+arr['hora_inicio']);
                        console.log("id "+obj.id);
                        console.log("title "+obj.title);
                          console.log("start "+obj.start);
                            console.log("end "+obj.end);
                              console.log("allDay "+obj.allDay);
                              arrObj[arrObj.length]=obj;
                      }
                      this.poblarCalendario(arrObj);
                }else{
                  console.log("primera vez q se conecta n hay datos en la base de datos");
                  this.poblarCalendario(arrObj);
                }
            }else {
              alert(data.motivo);
              window.location.href = 'index.html';

            }
          },
          error: function(XHR, text_status, errorThrow){
            alert("error en la comunicación con el servidor xhr "+XHR+ " text_status "+text_status+" errorThrow "+errorThrow);
          }
        })

    }
    poblarCalendario(eventos) {
        $('.calendario').fullCalendar({
            header: {
        		left: 'prev,next today',
        		center: 'title',
        		right: 'month,agendaWeek,basicDay'
        	},
        //	defaultDate:
        	navLinks: true,
        	editable: true,
        	eventLimit: true,
          droppable: true,
          dragRevertDuration: 0,
          timeFormat: 'H:mm',
          eventDrop: (event) => {
              this.actualizarEvento(event)
          },
          events:eventos,
          eventDragStart: (event,jsEvent) => {
            $('.delete-btn').find('img').attr('src', "img/trash-open.png");
            $('.delete-btn').css('background-color', '#a70f19')
          },
           eventDragStop:(event,jsEvent) =>{
            var trashEl = $('.delete-btn');
            var ofs = trashEl.offset();
            var x1 = ofs.left;
            var x2 = ofs.left + trashEl.outerWidth(true);
            var y1 = ofs.top;
            var y2 = ofs.top + trashEl.outerHeight(true);
            if (jsEvent.pageX >= x1 && jsEvent.pageX<= x2 &&
                jsEvent.pageY >= y1 && jsEvent.pageY <= y2) {
                  this.eliminarEvento(event, jsEvent)
                  $('.calendario').fullCalendar('removeEvents', event.id);
            }

          }
        })
    }

    anadirEvento(){
      var contenidoTitulo=true;
      var contenidoInicioFecha=true;
      var form_data = new FormData();
      var msnAlerta="";
      form_data.append('titulo', $('#titulo').val())
      form_data.append('start_date', $('#start_date').val())
      form_data.append('allDay', document.getElementById('allDay').checked)
if(form_data.get('titulo')==""){
  contenidoTitulo=false;
  msnAlerta="agregue un titulo por favor";
}
if(form_data.get('start_date')==""){
  contenidoInicioFecha=false;
  if(contenidoTitulo){
    msnAlerta="agregue una fecha de inicio por favor";
  }else{
      msnAlerta+=" y agregue una fecha de inicio por favor";
  }
}
      if(contenidoTitulo&&contenidoInicioFecha){
      if (!document.getElementById('allDay').checked) {
        if($('#end_date').val()==""){
          console.log("fecha end vacia");
          form_data.append('end_date', $('#start_date').val())//tomo la fecha de start asi me aparece el rango de fechas y se setea  correctamente
        }else{
          form_data.append('end_date', $('#end_date').val())
        }

        form_data.append('end_hour', $('#end_hour').val())
        form_data.append('start_hour', $('#start_hour').val())
      }else {
        form_data.append('end_date', "")
        form_data.append('end_hour', "")
        form_data.append('start_hour', "")
      }
      console.log("titulo "+form_data.get('titulo'));
      //console.log("start_date "+form_data.get('start_date') + " typeof "+typeof(form_data.get('start_date')));
      console.log("allDay "+form_data.get('allDay'));
      console.log("end_date "+form_data.get('end_date'));
      //console.log("start_hour "+form_data.get('start_hour')+" typeof "+typeof(form_data.get('start_hour')));
      console.log("end_hour "+form_data.get('end_hour'));

      $.ajax({
        url: '../server/new_event.php',
        dataType: "json",
        cache: false,
        processData: false,
        contentType: false,
        data: form_data,
        type: 'POST',
        success: (data) =>{
            if(data.conexion=='OK'){
            alert("msn "+data.conexion);
            if(data.exito){
          //  alert(data.msn+"id del evento "+data.id);
                if (document.getElementById('allDay').checked) {
                  $('.calendario').fullCalendar('renderEvent', {
                    title: form_data.get('titulo'),
                    start: form_data.get('start_date'),
                    allDay: true,
                    id:data.id
                  })
                }else {
                  $('.calendario').fullCalendar('renderEvent', {
                    title: form_data.get('titulo'),
                    start: $('#start_date').val()+" "+$('#start_hour').val(),
                    allDay: false,
                    end: form_data.get('end_date')+" "+$('#end_hour').val(),
                    id:data.id
                  })
                }
              }else{
                alert(data.msn);
              }
            }
        },
        error: function(XHR, text_status, errorThrow){
          alert("error en la comunicación con el servidor xhr "+XHR+ " text_status "+text_status+" errorThrow "+errorThrow);
        }
      })
    }else{
      alert(msnAlerta);
    }
    }

    eliminarEvento(event, jsEvent){

      var form_data = new FormData()
      form_data.append('id', event.id)
      $.ajax({
        url: '../server/delete_event.php',
        dataType: "json",
        cache: false,
        processData: false,
        contentType: false,
        data: form_data,
        type: 'POST',
        success: (data) =>{
          if (data.exito) {
            alert(data.msn);
          }else {
            alert(data.msn);
          }
        },
        error: function(XHR, text_status, errorThrow){
          alert("error en la comunicación con el servidor xhr "+XHR+ " text_status "+text_status+" errorThrow "+errorThrow);
        }
      })
      $('.delete-btn').find('img').attr('src', "img/trash.png");
      $('.delete-btn').css('background-color', '#8B0913')
    }

    actualizarEvento(evento) {

        let id = evento.id,
            start = moment(evento.start).format('YYYY-MM-DD HH:mm:ss'),
            end="",
            form_data = new FormData(),
            start_date="",
            end_date="",
            start_hour="",
            end_hour="",
            all_day=""//para q considere el cambio de estado en week

            console.log("*******actualizar evento");
            console.log("all day "+evento.allDay);
        console.log("start "+start);
        console.log("ev end "+evento.end);
        start_date = start.substr(0,10)
        start_hour = start.substr(11,8)
        all_day=evento.allDay;
        if(evento.end!=null){
          end=moment(evento.end).format('YYYY-MM-DD HH:mm:ss');
          end_date = end.substr(0,10)
          end_hour = end.substr(11,8)
        }
        console.log("allDay "+all_day);
        console.log("start_date "+start_date);
        console.log("end date "+end_date);
        console.log("start_hour "+start_hour);
        console.log("end_hour "+end_hour);

        form_data.append('id', id)
        form_data.append('allDay',all_day)
        form_data.append('start_date', start_date)
        form_data.append('end_date', end_date)
        form_data.append('start_hour', start_hour)
        form_data.append('end_hour', end_hour)

        $.ajax({
          url: '../server/update_event.php',
          dataType: "json",
          cache: false,
          processData: false,
          contentType: false,
          data: form_data,
          type: 'POST',
          success: (data) =>{
            if (data.exito) {
              alert(data.msg);
            }else{
              alert(data.msg);
            }


          },
          error: function(){
            alert("error en la comunicación con el servidor");
          }
        })
    }

}


$(function(){
  initForm();
  var e = new EventsManager();
/*  $('#logout').click(function(){
    console.log("click logout ");
  })*/
  $('form').submit(function(event){
    event.preventDefault()
  e.anadirEvento()
  })
});



function initForm(){
  $('#start_date, #titulo, #end_date').val('');
  $('#start_date, #end_date').datepicker({
    dateFormat: "yy-mm-dd"
  });
  $('.timepicker').timepicker({
    timeFormat: 'HH:mm',
    interval: 30,
    minTime: '5',
    maxTime: '23:30',
    defaultTime: '7',
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
