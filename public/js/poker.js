const socket = io();

//BOTONES DEL HTML
const btn1 = document.getElementById('btn1');
const btn0 = document.getElementById('btn0');
const btn12 = document.getElementById('btn12');
const btn2 = document.getElementById('btn2');
const btn3 = document.getElementById('btn3');
const btn5 = document.getElementById('btn5');
const btn8 = document.getElementById('btn8');
const btn13 = document.getElementById('btn13');
const btn20 = document.getElementById('btn20');
const btn40 = document.getElementById('btn40');
const btn100 = document.getElementById('btn100');
const btnInte = document.getElementById('btnInte');
const btnInf = document.getElementById('btnInf');
const btnCafe = document.getElementById('btnCafe');
const btnSend = document.getElementById('btnSend');
const btnShow = document.getElementById('btnShow');
const btnReset = document.getElementById('btnReset');
const mostrarEstimaciones = document.getElementById('estimacionesParticipantes');
const showVotes = document.getElementById('votesMarker');
//Get username and room from url
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix:true
});

var estimaciones;
var personas;
var estimacionPoker;


socket.emit('joinRoom',{ username, room});

socket.on('message', message =>{
    console.log(message);
});

socket.on('nameRepeated', ()=>{
    alert('NOMBRE DE USUARIO REPETIDO.\nAL ACEPTAR SERÁS REDIRECCIONADO AL FORMULARIO INICIAL');
    redirecc("http://localhost:3000/pokerRoom.html");
});

socket.on('returnReset', () =>{
    mostrarEstimaciones.innerHTML = "";
});

socket.on('returnShowEstimations', ests =>{
    showEst(ests);
    console.log("ESTIMACIONES RECIBIDAS DE LA BD");
    console.log(ests);
});

socket.on('actualizarContador', actualizacion=>{
    estimaciones = actualizacion.ests;
    personas = actualizacion.tamanio;
    const nuevoConta = `<p class="votes">${estimaciones}/${personas}</p>`;
    showVotes.innerHTML = nuevoConta;
});


function redirecc(url) { 
    window.location.href = url;
};

function showEst(estis){
    mostrarEstimaciones.innerHTML = "";
    estis.forEach(function(elemento) {
        const nuevaEstimacion = `<p class="participant">${elemento.user}</p> <p class="vote">${elemento.est}</p>`;
        mostrarEstimaciones.innerHTML += nuevaEstimacion;
    })
}


/*
    CAPTAR LAS PULSACIONES DE LOS BOTONES
*/

btn0.onclick = function(){
    console.log("Pulsado botón 0");
    estimacionPoker="0";
    console.log(estimacionPoker);
}

btn1.onclick = function(){
    console.log("Pulsado botón 1");
    estimacionPoker="1";
    console.log(estimacionPoker);
}

btn12.onclick = function(){
    console.log("Pulsado botón 1/2");
    estimacionPoker="1/2";
    console.log(estimacionPoker);
}

btn2.onclick = function(){
    console.log("Pulsado botón 2");
    estimacionPoker="2";
    console.log(estimacionPoker);
}

btn3.onclick = function(){
    console.log("Pulsado botón 3");
    estimacionPoker="3";
    console.log(estimacionPoker);
}

btn5.onclick = function(){
    console.log("Pulsado botón 5");
    estimacionPoker="5";
    console.log(estimacionPoker);
}

btn8.onclick = function(){
    console.log("Pulsado botón 8");
    estimacionPoker="8";
    console.log(estimacionPoker);
}

btn13.onclick = function(){
    console.log("Pulsado botón 13");
    estimacionPoker="13";
    console.log(estimacionPoker);
}

btn20.onclick = function(){
    console.log("Pulsado botón 20");
    estimacionPoker="20";
    console.log(estimacionPoker);
}

btn40.onclick = function(){
    console.log("Pulsado botón 40");
    estimacionPoker="40";
    console.log(estimacionPoker);
}

btn100.onclick = function(){
    console.log("Pulsado botón 100");
    estimacionPoker="100";
    console.log(estimacionPoker);
}

btnInte.onclick = function(){
    console.log("Pulsado botón ?");
    estimacionPoker="?";
    console.log(estimacionPoker);
}

btnInf.onclick = function(){
    console.log("Pulsado botón infinito");
    estimacionPoker="∞";
    console.log(estimacionPoker);
}

btnCafe.onclick = function(){
    console.log("Pulsado botón cafe");
    estimacionPoker="☕";
    console.log(estimacionPoker);
}

btnSend.onclick = function(){
    console.log("Pulsado botón ENVIAR ESTIMACIÓN");
    var estimacion={
        usrName: username,
        room: room,
        est: estimacionPoker
    }
    socket.emit('envioEstimacion',estimacion);

}

btnReset.onclick = function(){
    console.log("Pulsado botón RESETEAR ESTIMACIÓN");
    socket.emit('resetEstimation', room);
}

btnShow.onclick = function(){
    console.log("Pulsado botón MOSTRAR ESTIMACIONES");
    if(estimaciones === personas){
        socket.emit('showEstimation', room);
    }else{
        alert("ES NECESARIO QUE TODOS LOS ASISTENTES VOTEN PARA MOSTRAR LAS ESTIMACIONES");
    }
    
}