const socket = io();
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix:true
});

//POPUP ADD POSTIT
const closePopup = document.getElementById("popupclose");
const overlay = document.getElementById("overlay");
const popup = document.getElementById("popup");
const popupContent = document.getElementById("popup-content");
const btnPublic = document.getElementById('btn-public');
const inputPostit = document.getElementById('title-postit');
const title = document.getElementById('title-popup');


//POPUP OPCIONES
const closePopupOptions = document.getElementById("popupclose-options");
const overlayOptions = document.getElementById("overlay-options");
const popupOptions = document.getElementById("popup-options");
const popupContentOptions = document.getElementById("popup-content-options");
const deletePool = document.getElementById('delete-pool');
const btnDeleteSeleced = document.getElementById('btn-delete-selected');
const btnRetroHistory = document.getElementById('retro-history-btn');


//ELEMENTOS DOM
const btnMorePositive = document.getElementById('more-positive');
const btnMoreNegative = document.getElementById('more-negative');
const btnMoreImprove = document.getElementById('more-improve');
const positivePool = document.getElementById('positive-pool');
const negativePool = document.getElementById('negative-pool');
const improvePool = document.getElementById('improve-pool');
const btnOptions = document.getElementById('option-button');
// const btnSaveRetro = document.getElementById('save-retro');



//GLOBAL VARIABLES
var sec=0; //INDICA LA SECCIÓN EN LA QUE AÑADIR EL NUEVO POSTIT. 1->POSITIVE   2->NEGATIVE   3->IMPROVE
var puntuacion=0;
var psts=0;

//JOIN ROOM
socket.emit('joinRetroCalifRoom',{username,room});

//ERRORES
socket.on('unexpectedError1',msg=>{
    alert(msg);
    location.href="http://localhost:3000/retroCalifRoom.html";
});
socket.on('unexpectedError',msg=>{
    alert(msg);
});


/**
    MENSAJES RECIVIDOS DEL SERVIDOR
 */
socket.on('createPostitRetroCalifReturn',({tit,tip})=>{
    createPostit(tit,tip);
});

socket.on('loadPositsRetroCalifJoin', res=>{
    loadRoomPostits(res);
});
socket.on('showListPositsRetroCalifReturn', res=>{
    showListToDelete(res);
});

/*
    ON CLICK BOTONES AÑADIR POSTITS
*/
//POP UP CLOSED INITIALY
overlay.onclick = function(){
    overlay.style.display = 'none';
    popup.style.display = 'none';
}
//CLOSE POPUP
closePopup.onclick = function() {
    overlay.style.display = 'none';
    popup.style.display = 'none';
};
btnMorePositive.onclick = function(){
    overlay.style.display = 'block';
    popup.style.display = 'block';
    title.innerHTML="TÍTULO DE POSTIT EN ASPECTOS POSITIVOS";
    sec=1;
    puntuacion=5;
}

btnMoreNegative.onclick = function(){
    overlay.style.display = 'block';
    popup.style.display = 'block';
    title.innerHTML="TÍTULO DE POSTIT EN ASPECTOS NEGATIVOS";
    sec=2;
    puntuacion=-5;
}

btnMoreImprove.onclick = function(){
    overlay.style.display = 'block';
    popup.style.display = 'block';
    title.innerHTML="TÍTULO DE POSTIT EN ASPECTOS A MEJORAR";
    sec=3;
    puntuacion=-2;
}




/*
    ON CLIC BOTÓN OPCIONES
 */
//POP UP CLOSED INITIALY
overlayOptions.onclick = function(){
    overlayOptions.style.display = 'none';
    popupOptions.style.display = 'none';
    socket.emit('allowOptionsRetroCalif',room);
} 
// Close Popup Event
closePopupOptions.onclick = function() {
    overlayOptions.style.display = 'none';
    popupOptions.style.display = 'none';
    socket.emit('allowOptionsRetroCalif',room);
};
btnOptions.onclick = function(){
    overlayOptions.style.display = 'block';
    popupOptions.style.display = 'block';
    socket.emit('showListPostitsRetroCalif',room)
}
btnDeleteSeleced.onclick = function(){
    let titlesDelete= [];
    var j=0;
    for(i=0;i<psts;i++){
        const check = document.getElementById(`p${i}`);
        if(check.checked){
            titlesDelete[j]=check.value;
            j++;
        }
    }
    socket.emit('titlesToDeleteRetroCalif',{titlesDelete,room});
}


/*
    ON CLICK PUBLIC
*/
btnPublic.onclick = function(){
    titulo = inputPostit.value;
    if(titulo.length>0){
        createPostit(titulo,0); //CREAR EN MI CLIENTE
        let info = {
            sala:room,
            title:titulo,
            type:sec
        };
        socket.emit('createPostitCalifRetro',info); //ALMACENAR EN LA BASE DE DATOS Y CREAR EN LOS DEMÁS
    }else{
        alert("TÍTULO VACÍO");
    }
}


/*
    FUNCIONES
*/
function createPostit(title,type){
    let html = `<div class="postit">
                <p class="postit-title">${title}</p>
                </div>`;
    if(type==0){
        if(sec==1)
            positivePool.innerHTML+=html;
        else if(sec==2)
            negativePool.innerHTML+=html;
        else if(sec==3)
            improvePool.innerHTML+=html;
    }else if (type==1)
        positivePool.innerHTML+=html;
    else if (type==2)
        negativePool.innerHTML+=html;
    else if (type==3)
        improvePool.innerHTML+=html;
}

function loadRoomPostits(postits){
    positivePool.innerHTML="";
    negativePool.innerHTML="";
    improvePool.innerHTML="";
    for(i=0;i<postits.length;i++){
        createPostit(postits[i].Titulo, postits[i].Tipo);
    }
}

function showListToDelete(postits){
    psts=postits.length;
    deletePool.innerHTML="";
    for(i=0;i<postits.length;i++){
        t = postits[i].Tipo;
        let type;
        if(t == 1)
            type="Aspectos positivos";
        else if(t==2)
            type="Aspectos negativos";
        else if(t==3)
            type="Aspectos a mejorar";
        let html = `<input id="p${i}" class="selected-postit" type="checkbox" value="${postits[i].ID}"/>${postits[i].Titulo} (${type})<br>`;
        deletePool.innerHTML+=html;
    }
}