const socket = io();
//POPUP SEND ANSWERS
const closePopup = document.getElementById("popupclose");
const overlay = document.getElementById("overlay");
const popup = document.getElementById("popup");
const popupContent = document.getElementById("popup-content");
const notaView = document.getElementById('nota-view');
const phraseCalif = document.getElementById('phrase-calif');

let maxPuntuacion=0;
let idsCorrectos = []; //ID's DE LAS RESPUESTAS CORRECTAS CARGADAS AL PRINCIPIO
let longitud; //NÚMERO DE OPCIONES 

const sendQ = document.getElementById('button-send-test');
var poolPreguntas = document.getElementById('pool-preguntas');
var marcadorPuntuacion = document.getElementById('marcador-puntuacion');
var tituloCuestionario = document.getElementById('titulo-cuestionario');

const { username } = Qs.parse(location.search, {
    ignoreQueryPrefix:true
});

socket.emit('getPreguntasCuestionario',2);
let infoNota = {
    idC:2,
    usr:username
};
socket.emit('getNota',infoNota);
socket.emit('getTituloCuestionario',2);
socket.emit('getRespuestasCorrectas',2);


socket.on('unexpectedError',msg=>{
    alert(msg);
});

socket.on('getPreguntasCuestionarioReturn',res=>{
    formarCuestionario(res);
});

function formarCuestionario(info){
    poolPreguntas.innerHTML=``;
    longitud = info.length;
    let preg, enu, opt;
    let toSuffle=[];
    for(i=0;i<longitud;i++){
        p = (i/4)+1;
        e = (i%4);
        if(e==0){
            preg = `<h2 class="numero-pregunta">Pregunta ${p}</h2>`;
            enu = `<h3 class="enunciado-pregunta">${info[i].enunciado}</h3>`;
            s=`<p class="enunciado-pregunta">Seleccione una respuesta:</p>`;
            opt = `<div>`;
        }
        toSuffle[e]=`<input class="respuesta-pregunta" type="radio" value="${info[i].id}" name="pregunta${Math.trunc(p)}" id="p${i}"/>${info[i].opcion}<br><br>`;;
        if(e==3){
            c=0;
            while(c<4){
                r=Math.floor((Math.random() * ((3-c) - 0 + 1)) + 0);
                opt+=toSuffle[r];
                toSuffle.splice(r,1);
                c++;
            }
            opt += `</div>`;
            let html = `<div class="pregunta"> ${preg} ${enu} ${s} ${opt} </div>`;
            poolPreguntas.innerHTML+=html;
        }
    }
}

socket.on('cuestionarioSinNota',()=>{
    marcadorPuntuacion.innerHTML='AÚN NO HA REALIZADO EL CUESTIONARIO';
});

socket.on('getNotaReturn',nota=>{
    maxPuntuacion=nota;
    marcadorPuntuacion.innerHTML=`SU MÁXIMA PUNTUACIÓN ES: ${nota}`;
});

socket.on('getTituloCuestionarioReturn',titulo=>{
    tituloCuestionario.innerHTML=`Cuestionario: ${titulo}`;
});

socket.on('getRespuestasCorrectasReturn',ids=>{
    for(i=0;i<ids.length;i++)
        idsCorrectos[i]=(ids[i].ID).toString();
});

socket.on('nuevaNotaReturn',nota=>{
    overlay.style.display = 'block';
    popup.style.display = 'block';
    notaView.innerHTML=nota;
    //BLOQUEAR SCROLL
    window.scrollTo(top);
    var x = window.scrollX;
    var y = window.scrollY;
    window.onscroll = function(){ window.scrollTo(x, y) };
    if(nota > maxPuntuacion && nota>5){
        phraseCalif.innerHTML='¡ENHORABUENA, HA SUPERADO SU MEJOR CALIFICACIÓN!';
    }else if(nota > maxPuntuacion && nota<5){
        phraseCalif.innerHTML='SIGA INTENTÁNDOLO, HA MEJORADO SU MEJOR CALIFICACIÓN, VA POR EL BUEN CAMINO';
    }else{
        phraseCalif.innerHTML='NO HA MEJORADO SU MEJOR CALIFICACIÓN. SU NOTA HA SIDO:';
    }
    
})


overlay.onclick = function(){
    overlay.style.display = 'none';
    popup.style.display = 'none';
    window.onscroll = null;
    location.reload();
}
closePopup.onclick = function() {
    overlay.style.display = 'none';
    popup.style.display = 'none';
    window.onscroll = null;
    location.reload();
};

sendQ.onclick = function(){
    let marcadas = [];
    //COMPROBAR LO MARCADO
    for(i=0;i<longitud;i++){
        opc = document.getElementById(`p${i}`);
        if(opc.checked){
            marcadas.push(opc.value);
        }
    }
    let send = confirm("¿DESEA FINALIZAR EL CUESTIONARIO CON LAS RESPUESTAS ELEGIDAS?. REVISE BIEN SUS RESPUESTAS ANTES DE CONFIRMAR");
    if(send){
        //OBTENER LAS CORRECTAS
        let correctas=0;
        for(i=0;i<marcadas.length;i++){
            if(idsCorrectos.includes(marcadas[i]))
                correctas++;
        }
        numPreguntas=longitud/4;
        let nota = (correctas/numPreguntas)*10;
        let info={
            n:nota,
            usr:username,
            q:2
        }
        socket.emit('nuevaNota',info);
    }else{
        alert("REVISE SUS RESPUESTAS Y VUELVA A FINALIZAR CUANDO ESTÉ SEGURO");
    }
    
}


