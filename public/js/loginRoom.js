const socket = io();
const socket1=io();

const btnAlt = document.getElementById('alternative-button');
const ppalButton = document.getElementById('principal-button');
const btnSingUp = document.getElementById('sing-up-button');

var pulsado = false;


ppalButton.onclick = function(){
    const contra = document.getElementById('password').value;
    const room = document.getElementById('room').value;

    const usrContra = document.getElementById('usr-password').value;
    const usr = document.getElementById('username').value;

    console.log(usrContra,usr);

    var infoUsr = {
        nombre:usr,
        pssw:usrContra
    };

    var info= {
        sala:room,
        pssw:contra
    };

    socket.emit('verifyUser',infoUsr);
    if(!pulsado){
        //Se une a sala existente
        socket1.emit('verifyRoomPassword',info);
        
    }else{
        //Create new room
        socket1.emit('newRoom',info);
    }
    console.log(`Usuario:${usr} Contraseña:${usrContra} Sala:${room} Contraseña:${contra}`);
    alert(`USUARIO ${infoUsr.nombre} ACCEDIENDO A LA SALA "${info.sala}"...`);

        socket.on('invalidUsrCredentials', ()=>{
            alert('CREDENCIALES DEL USUARIO INVÁLIDAS');
            location.reload();
        });
        socket.on('unexpectedError', msg=>{
            alert(msg);
            location.reload();
        });
        socket1.on('missingRoom', ()=>{
            alert('SALA INEXISTENTE');
            location.reload();
        });
        socket1.on('wrongRoomPassword', ()=>{
            alert('CONTRASEÑA DE SALA INCORRECTA');
            location.reload();
        });
        socket1.on('roomAlreadyExists', ()=>{
            alert('LA SALA YA EXISTE, POR FAVOR, ELIJA OTRO NOMBRE');
            location.reload();
        });
        socket1.on('unexpectedError', ()=>{
            alert('ESTE USUARIO YA ESTÁ EN ESTA SALA, POR FAVOR, INTENTELO CON OTRO USUARIO O EN OTRA SALA');
            location.reload();
        });
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

btnSingUp.onclick=function(){
    window.location.href = "http://localhost:3000/signup.html";
}


