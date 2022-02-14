const socket = io();

const btnAlt = document.getElementById('alternative-button');
const ppalButton = document.getElementById('principal-button');

var pulsado = false;


ppalButton.onclick = function(){
    const contra = document.getElementById('password').value;
    const room = document.getElementById('room').value;
    var info = {
        sala:room,
        pssw:contra
    };
    if(!pulsado){
        //Se une a sala existente
        socket.emit('verifyPassword',info);
        alert(`ACCEDIENDO A LA SALA "${info.sala}"...`);
    }else{
        //Create new room
        socket.emit('newRoom',info);
        alert(`CREANDO LA SALA "${info.sala}"...`);
    }
    
    socket.on('wrongPassword', ()=>{
        alert('CONTRASEÑA INCORRECTA');
        window.location.href = "http://localhost:3000/pokerRoom.html";
    });
    
    socket.on('roomAlreadyExists', ()=>{
        alert('LA SALA YA EXISTE, POR FAVOR, ELIJA OTRO NOMBRE');
        window.location.href = "http://localhost:3000/pokerRoom.html";
    })
}

btnAlt.onclick = function(){

    pulsado = !pulsado;

    if(!pulsado){
        const altText = document.getElementById('alternative-text');
        var frase = "Si no conoces una sala existente, puedes crear una..."
        altText.innerHTML = frase;
    
        const ppalButton = document.getElementById('principal-button');
        frase = "UNIRSE A LA SALA"
        ppalButton.innerHTML = frase;
    
        frase="CREAR UNA NUEVA SALA";
        btnAlt.innerHTML=frase;
    }else{
        const altText = document.getElementById('alternative-text');
        var frase = "Haz click aquí para unirte a una sala existente..."
        altText.innerHTML = frase;
    
        const ppalButton = document.getElementById('principal-button');
        frase = "CREAR SALA Y UNIRSE"
        ppalButton.innerHTML = frase;
    
        frase="UNIRSE A SALA EXISTENTE";
        btnAlt.innerHTML=frase;
    }
    
}


