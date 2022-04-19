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

socket.on('unexpectedError', msg=>{
    alert(msg);
});

socket.on('unexpectedError1', msg=>{
    alert(msg);
    redirecc("http://localhost:3000/pokerRoom.html");
});

socket.on('returnReset', () =>{
    mostrarEstimaciones.innerHTML = "";
});

socket.on('returnShowEstimation', ests =>{
    showEst(ests);
});

socket.on('actualizarContador', actualizacion=>{
    estimaciones = actualizacion.ests;
    personas = actualizacion.usuarios;
    const nuevoConta = `<p class="votes">${estimaciones}/${personas}</p>`;
    showVotes.innerHTML = nuevoConta;
});

function redirecc(url) { 
    window.location.href = url;
};

function showEst(estis){
    mostrarEstimaciones.innerHTML = "";
    estis.forEach(function(elemento) {
        const nuevaEstimacion = `<p class="participant">${elemento.nombre}</p> <p class="vote">${elemento.Estimacion}</p>`;
        mostrarEstimaciones.innerHTML += nuevaEstimacion;
    })
}

btn0.onclick = function(){
    estimacionPoker="0";
}

btn1.onclick = function(){
    estimacionPoker="1";
}

btn12.onclick = function(){
    estimacionPoker="1/2";
}

btn2.onclick = function(){
    estimacionPoker="2";
}

btn3.onclick = function(){
    estimacionPoker="3";
}

btn5.onclick = function(){
    estimacionPoker="5";
}

btn8.onclick = function(){
    estimacionPoker="8";
}

btn13.onclick = function(){
    estimacionPoker="13";
}

btn20.onclick = function(){
    estimacionPoker="20";
}

btn40.onclick = function(){
    estimacionPoker="40";
}

btn100.onclick = function(){
    estimacionPoker="100";
}

btnInte.onclick = function(){
    estimacionPoker="?";
}

btnInf.onclick = function(){
    estimacionPoker="∞";
}

btnCafe.onclick = function(){
    estimacionPoker="☕";
}

btnSend.onclick = function(){
    var estimacion={
        usrName: username,
        room: room,
        est: estimacionPoker
    }
    if(!estimacionPoker || estimacionPoker==-1)
        alert("ELIJA PRIMERO UN VALOR PARA LA ESTIMACIÓN");
    else{
        socket.emit('envioEstimacion',estimacion);
    }

}

btnReset.onclick = function(){
    estimacionPoker=-1;
    socket.emit('resetEstimation', room);
}

btnShow.onclick = function(){
    if(estimaciones == personas){
        socket.emit('showEstimation', room);
    }else{
        alert(`ES NECESARIO QUE TODOS LOS ASISTENTES VOTEN PARA MOSTRAR LAS ESTIMACIONES. ${estimaciones}/${personas}`);
    }
    
}


