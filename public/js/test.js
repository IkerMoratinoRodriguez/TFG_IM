const socket = io();
const sendQ = document.getElementById('button-send-test');
var p1 = document.getElementsByName("pregunta1");
var p2 = document.getElementsByName("pregunta2");
var p3 = document.getElementsByName("pregunta3");
var puntuacion;

sendQ.onclick = function(){
    console.log("CONNECTED");
    puntuacion=0;
    for(var i=0; i<p1.length; i++) {
        if(p1[i].value=='si' && p1[i].checked)
            puntuacion++;
    }
    for(var i=0; i<p2.length; i++) {
        if(p2[i].value=='si' && p2[i].checked)
            puntuacion++;
    }
    for(var i=0; i<p3.length; i++) {
        if(p3[i].value=='si' && p3[i].checked)
            puntuacion++;
    }
    alert("TU PUNTUACIÓN ES DE:"+puntuacion);
    socket.emit('ins',puntuacion);
}
