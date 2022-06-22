const socket = io();

//POPUP AGILES
const closePopup = document.getElementById("popupclose");
const overlay = document.getElementById("overlay");
const popup = document.getElementById("popup");
const popupContent = document.getElementById("popup-content");
const btnAcceder = document.getElementById("acceder-q");
const btnCreate = document.getElementById('create-usr');
const username = document.getElementById('username');
const password = document.getElementById('usr-password');

//POPUP SCRUM I
const closePopupSi = document.getElementById("popupclose-si");
const overlaySi = document.getElementById("overlay-si");
const popupSi = document.getElementById("popup-si");
const popupContentSi = document.getElementById("popup-content-si");
const btnAccederSi = document.getElementById("acceder-si");
const btnCreateSi = document.getElementById('create-usr-si');
const usernameSi = document.getElementById('username-si');
const passwordSi = document.getElementById('usr-password-si');

//POPUP SCRUM II
const closePopupSii = document.getElementById("popupclose-sii");
const overlaySii = document.getElementById("overlay-sii");
const popupSii = document.getElementById("popup-sii");
const popupContentSii = document.getElementById("popup-content-sii");
const btnAccederSii = document.getElementById("acceder-sii");
const btnCreateSii = document.getElementById('create-usr-sii');
const usernameSii = document.getElementById('username-sii');
const passwordSii = document.getElementById('usr-password-sii');

//POPUP TOOLS
const closePopupTT = document.getElementById("popupclose-tt");
const overlayTT = document.getElementById("overlay-tt");
const popupTT = document.getElementById("popup-tt");
const popupContentTT = document.getElementById("popup-content-tt");
const btnAccederTT = document.getElementById("acceder-tt");
const btnCreateTT = document.getElementById('create-usr-tt');
const usernameTT = document.getElementById('username-tt');
const passwordTT = document.getElementById('usr-password-tt');

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
overlaySi.onclick = function(){
    overlaySi.style.display = 'none';
    popupSi.style.display = 'none';
}
closePopupSi.onclick = function() {
    overlaySi.style.display = 'none';
    popupSi.style.display = 'none';
};
overlaySii.onclick = function(){
    overlaySii.style.display = 'none';
    popupSii.style.display = 'none';
}
closePopupSii.onclick = function() {
    overlaySii.style.display = 'none';
    popupSii.style.display = 'none';
};
overlayTT.onclick = function(){
    overlayTT.style.display = 'none';
    popupTT.style.display = 'none';
}
closePopupTT.onclick = function() {
    overlayTT.style.display = 'none';
    popupTT.style.display = 'none';
};

btnAgile.onclick = function(){
    overlay.style.display = 'block';
    popup.style.display = 'block';
}

btnScrum1.onclick = function(){
    overlaySi.style.display = 'block';
    popupSi.style.display = 'block';
}

btnScrum2.onclick = function(){
    overlaySii.style.display = 'block';
    popupSii.style.display = 'block';
}

btnTools.onclick = function(){
    overlayTT.style.display = 'block';
    popupTT.style.display = 'block';
}

btnCreate.onclick = function(){
    location.href = "http://localhost:3000/signup.html";
}
btnCreateSi.onclick = function(){
    location.href = "http://localhost:3000/signup.html";
}
btnCreateSii.onclick = function(){
    location.href = "http://localhost:3000/signup.html";
}
btnCreateTT.onclick = function(){
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

btnAccederSi.onclick = function(){

    let info = {
        nombre:usernameSi.value,
        pssw:passwordSi.value,
    };
    socket.emit('verifyUserTest',info);
    alert(`Usuario ${username.value} accediendo al cuestionario...`);
}

btnAccederSii.onclick = function(){

    let info = {
        nombre:usernameSii.value,
        pssw:passwordSii.value,
    };
    socket.emit('verifyUserTest',info);
    alert(`Usuario ${username.value} accediendo al cuestionario...`);
}

btnAccederTT.onclick = function(){

    let info = {
        nombre:usernameTT.value,
        pssw:passwordTT.value,
    };
    socket.emit('verifyUserTest',info);
    alert(`Usuario ${username.value} accediendo al cuestionario...`);
}