const socket = io();

const closePopup = document.getElementById("popupclose");
const overlay = document.getElementById("overlay");
const popup = document.getElementById("popup");
const popupContent = document.getElementById("popup-content");
const btnAcceder = document.getElementById("acceder-q");
var popupTile = document.getElementById('popup-title');
const btnCreate = document.getElementById('create-usr');
const username = document.getElementById('username');
const password = document.getElementById('usr-password');

const btnAgile = document.getElementById('ag-q');
const btnScrum1 = document.getElementById('sc1-q');
const btnScrum2 = document.getElementById('sc2-q');
const btnTools = document.getElementById('to-q');

socket.on('unexpectedError',msg=>{
    alert(msg);
    location.reload();
});

socket.on('verifyUserTestTrue',()=>{
    alert("CREDENCIALES CORRECTAS. PULSE ACEPTAR PARA ACCEDER.");
});

overlay.onclick = function(){
    overlay.style.display = 'none';
    popup.style.display = 'none';
}
closePopup.onclick = function() {
    overlay.style.display = 'none';
    popup.style.display = 'none';
};

btnAgile.onclick = function(){
    overlay.style.display = 'block';
    popup.style.display = 'block';
    popupTile.innerHTML='TEST SOBRE METODOLOGÍAS ÁGILES';
}

btnScrum1.onclick = function(){
    overlay.style.display = 'block';
    popup.style.display = 'block';
    popupTile.innerHTML='TEST SOBRE SCRUM I';
}

btnScrum2.onclick = function(){
    overlay.style.display = 'block';
    popup.style.display = 'block';
    popupTile.innerHTML='TEST SOBRE SCRUM II';
}

btnTools.onclick = function(){
    overlay.style.display = 'block';
    popup.style.display = 'block';
    popupTile.innerHTML='TEST SOBRE HERRAMIENTAS Y PROCEDIMIENTOS';
}

btnCreate.onclick = function(){
    location.href = "http://localhost:3000/signup.html";
}

btnAcceder.onclick = function(){

    let info = {
        nombre:username.value,
        pssw:password.value,
    };
    socket.emit('verifyUserTest',info);
    alert(`Usuario ${username.value} accediendo al cuestionario...`);
}