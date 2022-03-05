const socket = io();

var elementos1 = document.getElementsByName("pregunta1");
var elementos2 = document.getElementsByName("pregunta2");
var elementos3 = document.getElementsByName("pregunta3");

var puntuacion=0;

sendQ.onclick = function(){
    puntuacion=0;
    for(var i=0; i<elementos1.length; i++) {
        if(elementos1[i].value=='si' && elementos1[i].checked)
            puntuacion++;
    }
    for(var i=0; i<elementos2.length; i++) {
        if(elementos2[i].value=='si' && elementos2[i].checked)
            puntuacion++;
    }
    for(var i=0; i<elementos3.length; i++) {
        if(elementos3[i].value=='si' && elementos3[i].checked)
            puntuacion++;
    }

    socket.emit('cuestionario',puntuacion);

    alert("TU PUNTUACIÓN ES DE:"+puntuacion);

}


