const socket = io();
const socket1= io();

const btnAlt = document.getElementById('alternative-button');
const ppalButton = document.getElementById('principal-button');
const btnSingUp = document.getElementById('sing-up-button');

var pulsado = false;


socket.on('verificationResult', msg=>{
    alert(msg);
    location.reload();
});

socket1.on('verificationResult', msg=>{
    alert(msg);
    location.reload();
});

socket1.on('roomAlreadyExists',()=>{
    alert('ERROR AL CREAR Y ACCEDER A UNA NUEVA SALA. DICHA SALA YA EXISTE, POR FAVOR, ESCOJA OTRO NOMBRE');
    location.reload();
});



ppalButton.onclick = function(){
    const room = document.getElementById('room').value;
    const contra = document.getElementById('password').value;

    const usr = document.getElementById('username').value;
    const usrContra = document.getElementById('usr-password').value;

    if(room.length == 0 || contra.length == 0 || usr.length == 0 || usrContra.length == 0){
        alert("UNO DE LOS CAMPOS ESTÁ VACÍO. ASEGÚRESE DE QUE TODOS ESTÁN RELLENOS DEBIDAMENTE");
    }else{

        let infoUsr = {
            nombre:usr,
            pssw:usrContra
        };

        let infoSala= {
            sala:room,
            pssw:contra
        };
    
        socket.emit('verifyUser',infoUsr);

        if(!pulsado){//Se une a sala existente
            socket1.emit('verifyRoom',infoSala);
        }else{ //Create new room
            socket1.emit('newRoom',infoSala);
        }
        
        alert(`USUARIO ${infoUsr.nombre} ACCEDIENDO A LA SALA "${infoSala.sala}"...`);
    }
 
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


