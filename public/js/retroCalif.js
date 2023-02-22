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
const btnSaveRetro = document.getElementById('save-retro');


//POPUP SAVE RETRO
const closePopupHistory = document.getElementById("popupclose-history");
const overlayHistory = document.getElementById("overlay-history");
const popupHistory = document.getElementById("popup-history");
const popupContentHistory = document.getElementById("popup-content-history");
const saveInput = document.getElementById('save-input');
const btnSaveSave = document.getElementById('btn-save-save');


//ELEMENTOS DOM
const btnMorePositive = document.getElementById('more-positive');
const btnMoreNegative = document.getElementById('more-negative');
const btnMoreImprove = document.getElementById('more-improve');
const positivePool = document.getElementById('positive-pool');
const negativePool = document.getElementById('negative-pool');
const improvePool = document.getElementById('improve-pool');
const btnOptions = document.getElementById('option-button');


//POPUP HISTORIAL RETROS
const closePopupRetros = document.getElementById("popupclose-retros");
const overlayRetros = document.getElementById("overlay-retros");
const popupRetros = document.getElementById("popup-retros");
const popupContentRetros = document.getElementById("popup-content-retros");
const poolRetro = document.getElementById('retro-pool');
const btnLoadRetro = document.getElementById('load-retro');


//POPUP CARGAR RETRO DEL HISTORIAL
const closePopupShowRetro = document.getElementById("popupclose-show-retro");
const overlayShowRetro = document.getElementById("overlay-show-retro");
const popupShowRetro = document.getElementById("popup-show-retro");
const popupContentShowRetro = document.getElementById("popup-show-retro");
const poolPositiveLoad= document.getElementById('positive-load-pool');
const poolNegativeLoad= document.getElementById('negative-load-pool');
const poolImproveLoad= document.getElementById('improve-load-pool');

//GLOBAL VARIABLES
var sec=0; //INDICA LA SECCIÓN EN LA QUE AÑADIR EL NUEVO POSTIT. 1->POSITIVE   2->NEGATIVE   3->IMPROVE
var puntuacion=0;
var psts=0;
var retros=0;

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
socket.on('saveRetroCalifPostits',({room,r})=>{
    socket.emit('saveRetroCalifPostitsServer',{room,r});
});
socket.on('retroCalifSavedReturn',()=>{
    alert("SE HA ALMACENADO CORRECTAMENTE LA RETROSPECTIVA EN EL HISTORIAL DE LA SALA");
    overlayHistory.style.display = 'none';
    popupHistory.style.display = 'none';
    positivePool.innerHTML="";
    negativePool.innerHTML="";
    improvePool.innerHTML="";
    btnOptions.disabled= false;
});
socket.on('loadRetroCalifHistoryListReturn',titles=>{
    poolRetro.innerHTML="";
    retros=titles.length;
    for(i=0;i<titles.length;i++){
        let html = `<input class="retro-list-history" type="radio" name="history" value="${titles[i].Nombre}" id="retro${i}"/> ${titles[i].Nombre}<br>`;
        poolRetro.innerHTML+=html;
    }
});
socket.on('loadRetroCalifInPopupReturn',result=>{
    //RESULT ES UN ARRAY CON Titulo Y Tipo
    for(i=0;i<result.length;i++){
        loadRoomPostitsHistory(result);
    }
});
socket.on('calculateCalifReturn',puntuaciones=>{
    calcularPuntuacion(puntuaciones);
});
socket.on('showCalifOtherClientsReturn',total=>{
    alert("LA PUNTUACIÓN DEL SPRINT HA SIDO DE:"+total+" PUNTOS. COMENZANDO NUEVA RETROSPECTIVA...");

});

/*
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
socket.on('blockOptionsRetroCalifReturn',()=>{
    btnOptions.disabled= true;
    alert('OTRO USUARIO DE LA SALA ESTÁ MODIFICANDO ELEMENTOS DE LA MISMA, MIENTRAS TANTO, USTED NO PODRÁ HACERLO');
});
socket.on('allowOptionsRetroCalifReturn',()=>{
    btnOptions.disabled= false;
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
    ON CLICK PUBLIC POSTIT
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
    socket.emit('blockOptionsRetroCalif',room);
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
    GUARDAR RETRO
*/
//POP UP CLOSED INITIALY
overlayHistory.onclick = function(){
    overlayHistory.style.display = 'none';
    popupHistory.style.display = 'none';
    overlayOptions.style.display = 'block';
    popupOptions.style.display = 'block';
}
  
// Close Popup Event
closePopupHistory.onclick = function() {
    overlayHistory.style.display = 'none';
    popupHistory.style.display = 'none';
    overlayOptions.style.display = 'block';
    popupOptions.style.display = 'block';
};
btnSaveRetro.onclick = function(){
    overlayOptions.style.display = 'none';
    popupOptions.style.display = 'none';
    overlayHistory.style.display = 'block';
    popupHistory.style.display = 'block';
}
btnSaveSave.onclick = function(){
    let titulo = saveInput.value;
    if(titulo.length>0){
        socket.emit('saveRetroCalif',{titulo,room});
        socket.emit('calculateCalif',room);
    }
    else
        alert("TÍTULO DE RETROSPECTIVA VACÍO.");
}

/*
    HISTOTIAL RETROS
*/
//POP UP CLOSED INITIALY
overlayRetros.onclick = function(){
    overlayRetros.style.display = 'none';
    popupRetros.style.display = 'none';

    overlayOptions.style.display = 'block';
    popupOptions.style.display = 'block';
}
// Close Popup Event
closePopupRetros.onclick = function() {
    overlayRetros.style.display = 'none';
    popupRetros.style.display = 'none';

    overlayOptions.style.display = 'block';
    popupOptions.style.display = 'block';

};
btnRetroHistory.onclick = function(){
    overlayRetros.style.display = 'block';
    popupRetros.style.display = 'block';

    overlayOptions.style.display = 'none';
    popupOptions.style.display = 'none';

    socket.emit('loadRetroCalifHistoryList',room);
}
btnLoadRetro.onclick = function(){
    var i=0, encontrado=false;
    let tituloRetroLoad;
    while(i<retros && !encontrado){
        let ret = document.getElementById(`retro${i}`);
        if(ret.checked){
            tituloRetroLoad=ret.value;
            encontrado=true;
        }
        i++;
    }
    console.log(tituloRetroLoad);
    if(encontrado){
        socket.emit('loadRetroCalifInPopup',{room,tituloRetroLoad});
        overlayShowRetro.style.display = 'block';
        popupShowRetro.style.display = 'block';
        overlayRetros.style.display = 'none';
        popupRetros.style.display = 'none';
    }else{
        alert("SELECCIONE ALGUNA DE LAS RETROSPECTIVAS");
    }
}
overlayShowRetro.onclick = function(){
    overlayShowRetro.style.display = 'none';
    popupShowRetro.style.display = 'none';
    socket.emit('allowOptionsRetroCalif',room);
}

closePopupShowRetro.onclick = function() {
    overlayShowRetro.style.display = 'none';
    popupShowRetro.style.display = 'none';
    socket.emit('allowOptionsRetroCalif',room);
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

function loadRoomPostitsHistory(postits){
    poolPositiveLoad.innerHTML="";
    poolNegativeLoad.innerHTML="";
    poolImproveLoad.innerHTML="";
    for(i=0;i<postits.length;i++){
        createPostitHistory(postits[i].Titulo, postits[i].Tipo);
    }
}

function createPostitHistory(title,t){
    let html = `<div class="postit">
                <p class="postit-title">${title}</p>
                </div>`;
    if(t==1)
        poolPositiveLoad.innerHTML+=html;
    else if(t==2)
        poolNegativeLoad.innerHTML+=html;
    else if(t==3)
        poolImproveLoad.innerHTML+=html;
}

function calcularPuntuacion(puntuaciones){
    let puntuacionPostit,total=0;
    alert("CALCULANDO PUNTUACIÓN...");
    for(k=0;k<puntuaciones.length;k++){
        puntuacionPostit=puntuaciones[k].Tipo
        console.log(puntuacionPostit);
        if(puntuacionPostit=='1'){
            total+=5;
        }else if(puntuacionPostit=='2'){
            total-=5;
        }else if (puntuacionPostit=='3'){
            total-=2;
        }
        console.log("TOTAL:"+total);
    }
    socket.emit('showCalifOtherClients',{room,total});
    alert("LA PUNTUACIÓN DEL SPRINT HA SIDO DE:"+total+" PUNTOS");
}
