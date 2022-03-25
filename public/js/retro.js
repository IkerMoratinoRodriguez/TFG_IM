const socket = io();
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix:true
});

//POPUP MORE
const closePopup = document.getElementById("popupclose");
const overlay = document.getElementById("overlay");
const popup = document.getElementById("popup");
const popupContent = document.getElementById("popup-content");
const btnPublic = document.getElementById('btn-public');
const inputPostit = document.getElementById('wind-postit');
const title = document.getElementById('title-popup');

//POPUP INFO
const closePopupInfo = document.getElementById("popupclose-info");
const overlayInfo = document.getElementById("overlay-info");
const popupInfo = document.getElementById("popup-info");
const popupContentInfo = document.getElementById("popup-content-info");

//ELEMENTOS DOM
const btnMoreWind = document.getElementById('more-wind');
const btnMoreAnchor = document.getElementById('more-anchor');
const btnMoreIceberg = document.getElementById('more-iceberg');
const btnAskWind = document.getElementById('ask-wind');
const btnAskAnchor = document.getElementById('ask-anchor');
const btnAskIceberg = document.getElementById('ask-iceberg');
const windPool = document.getElementById('wind-pool');
const anchorPool = document.getElementById('anchor-pool');
const icebergPool = document.getElementById('iceberg-pool');


//GLOBAL VARS
var sec=0; //INDICA LA SECCIÓN EN LA QUE AÑADIR EL NUEVO POSTIT. 1->WIND   2->ANCHOR   3->ICEBERG

socket.emit('joinRetroRoom',{username,room});

socket.on('unexpectedError1',msg=>{
    alert(msg);
    location.href="http://localhost:3000/retroRoom.html";
});

socket.on('unexpectedError',msg=>{
    alert(msg);
});

socket.on('createPostitReturn',({tit,tipo})=>{
    createPostit(tit,tipo);
});


//POP UP CLOSED INITIALY
overlay.onclick = function(){
    overlay.style.display = 'none';
    popup.style.display = 'none';
}
  
// Close Popup Event
closePopup.onclick = function() {
    overlay.style.display = 'none';
    popup.style.display = 'none';
};

btnMoreWind.onclick = function(){
    overlay.style.display = 'block';
    popup.style.display = 'block';
    title.innerHTML="TÍTULO DE POSTIT EN VIENTO";
    sec=1;
}

btnPublic.onclick = function(){
    const titulo=inputPostit.value;
    if(titulo.length>0){
        createPostit(titulo,0); //CREAR EN MI CLIENTE
        let info = {
            sala:room,
            title:titulo,
            type:sec
        };
        socket.emit('createPostit',info); //ALMACENAR EN LA BASE DE DATOS Y CREAR EN LOS DEMÁS
    }else{
        alert("TÍTULO VACÍO");
    }
    
}

function createPostit(title,t){
    let html = `<div class="postit">
                <p class="postit-title">${title}</p>
                </div>`;
    if(t==0){//VIENE DE LOCAL
        if(sec==1)
            windPool.innerHTML+=html;
        else if(sec==2)
            anchorPool.innerHTML+=html;
        else if(sec==3)
            icebergPool.innerHTML+=html;
    }else if(t==1)
        windPool.innerHTML+=html;
    else if(t==2)
        anchorPool.innerHTML+=html;
    else if(t==3)
        icebergPool.innerHTML+=html;
}


btnMoreAnchor.onclick = function(){
    overlay.style.display = 'block';
    popup.style.display = 'block';
    title.innerHTML="TÍTULO DE POSTIT EN ANCLA";
    sec=2;
}

btnMoreIceberg.onclick = function(){
    overlay.style.display = 'block';
    popup.style.display = 'block';
    title.innerHTML="TÍTULO DE POSTIT EN ICEBERG";
    sec=3;

}

//POP UP CLOSED INITIALY
overlayInfo.onclick = function(){
    overlayInfo.style.display = 'none';
    popupInfo.style.display = 'none';
}
  
// Close Popup Event
closePopupInfo.onclick = function() {
    overlayInfo.style.display = 'none';
    popupInfo.style.display = 'none';
};


btnAskWind.onclick = function(){
    overlayInfo.style.display = 'block';
    popupInfo.style.display = 'block';
    let html = `<h3 class="pupup-title" id="title-popup-info">¿QUÉ ES EL VIENTO EN LA RETROSPECTIVA?</h3>
    <p class="help-text"> El viento es una metáfora referida a todo aquello que ha ido bien en durante el sprint, y que ha ayudado a que el equipo ágil consiga de forma satisfactoria los objetivos marcados en el mismo.<br>El viento, es aquello que nos impulsa.<br><br>La buena comunicación entre los miembros del equipo o la soltura en el uso de la herramienta podrían ser ejemplos de esta categoría.</p>`;
    popupContentInfo.innerHTML=html;
}

btnAskAnchor.onclick = function(){
    overlayInfo.style.display = 'block';
    popupInfo.style.display = 'block';
    let html = `<h3 class="pupup-title" id="title-popup-info">¿QUÉ ES EL ANCLA EN LA RETROSPECTIVA?</h3>
    <p class="help-text"> El ancla es una metáfora referida a todo aquello que ha frenado el progreso del equipo durante el sprint, y que por ello, ha hecho que no se consiguieran todos los objetivos que se habían fijado para el mismo, o no todo lo rápido como se hubiera podido, si estos problemas no existieran.<br>El ancla, es aquello que nos frena.<br><br>La mala comunicación entre los miembros del equipo o la poca experiencia en el uso de la herramienta podrían ser ejemplos de esta categoría.</p>`;
    popupContentInfo.innerHTML=html;
}

btnAskIceberg.onclick = function(){
    overlayInfo.style.display = 'block';
    popupInfo.style.display = 'block';
    let html = `<h3 class="pupup-title" id="title-popup-info">¿QUÉ ES EL ICEBERG EN LA RETROSPECTIVA?</h3>
    <p class="help-text"> El iceberg es una metáfora referida a todo aquello que, si bien todavía no ha causado ningún problema, en el futuro podría agravarse y convertirse en algo que nos frene. En otras palabras, el ancla en la retrospectiva del barco de vela, es un problema existente que en un futuro podría agravarse y lastrar el progreso hacía los objetivos que el equipo queire conseguir.<br>El iceberg, son los problemas potenciales futuros.<br><br>La falta de rigurosidad en los tests, podría ser un ejemplo de esta categoría, ya que puede que en el momento no suponga un problema, pero que en el futuro, sí los cause.</p>`;
    popupContentInfo.innerHTML=html;
}

