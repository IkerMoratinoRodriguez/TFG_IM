const socket = io();
//POPUP SEND ANSWERS
const closePopup = document.getElementById("popupclose");
const overlay = document.getElementById("overlay");
const popup = document.getElementById("popup");
const popupContent = document.getElementById("popup-content");


const sendQ = document.getElementById('button-send-test');
var poolPreguntas = document.getElementById('pool-preguntas');

socket.emit('getPreguntasCuestionario',1);

socket.on('unexpectedError',msg=>{
    alert(msg);
});

socket.on('getPreguntasCuestionarioReturn',res=>{
    console.log(res);
    formarCuestionario(res);
});

function formarCuestionario(info){
    poolPreguntas.innerHTML=``;
    longitud = info.length;
    let preg, enu, opt;
    for(i=0;i<longitud;i++){
        p = (i/4)+1;
        e = (i%4);
        if(e==0){
            preg = `<h2 class="numero-pregunta">Pregunta ${p}</h2>`;
            enu = `<h3 class="enunciado-pregunta">${info[i].enunciado}</h3>`;
            s=`<p class="enunciado-pregunta">Seleccione una respuesta:</p>`;
            opt = `<div>`;
        }
        opt += `<input class="respuesta-pregunta" type="radio" value="${info[i].opcion}" name="pregunta${Math.trunc(p)}" />${info[i].opcion}<br><br>`;
        if(e==3){
            opt += `</div>`;
            let html = `<div class="pregunta"> ${preg} ${enu} ${s} ${opt} </div>`;
            poolPreguntas.innerHTML+=html;
        }
    }
}


overlay.onclick = function(){
    overlay.style.display = 'none';
    popup.style.display = 'none';
}
closePopup.onclick = function() {
    overlay.style.display = 'none';
    popup.style.display = 'none';
};

sendQ.onclick = function(){
    overlay.style.display = 'block';
    popup.style.display = 'block';
}


