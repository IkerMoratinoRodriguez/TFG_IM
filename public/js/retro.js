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

//POPUP OPCIONES
const closePopupOptions = document.getElementById("popupclose-options");
const overlayOptions = document.getElementById("overlay-options");
const popupOptions = document.getElementById("popup-options");
const popupContentOptions = document.getElementById("popup-content-options");
const deletePool = document.getElementById('delete-pool');
const btnDeleteSeleced = document.getElementById('btn-delete-selected');
const btnRetroHistory = document.getElementById('retro-history-btn');


//POPUP SAVE RETRO
const closePopupHistory = document.getElementById("popupclose-history");
const overlayHistory = document.getElementById("overlay-history");
const popupHistory = document.getElementById("popup-history");
const popupContentHistory = document.getElementById("popup-content-history");
const saveInput = document.getElementById('save-input');
const btnSaveSave = document.getElementById('btn-save-save');

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
const poolWindLoad= document.getElementById('wind-load-pool');
const poolAnchorLoad= document.getElementById('anchor-load-pool');
const poolIcebergLoad= document.getElementById('iceberg-load-pool');


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
const btnOptions = document.getElementById('option-button');
const btnSaveRetro = document.getElementById('save-retro');


//GLOBAL VARS
var sec=0; //INDICA LA SECCIÓN EN LA QUE AÑADIR EL NUEVO POSTIT. 1->WIND   2->ANCHOR   3->ICEBERG
var psts=0;
var retros=0;

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

socket.on('loadPositsJoin',posits=>{
    loadRoomPostits(posits);
});

socket.on('showListPositsReturn',postits=>{
    showListToDelete(postits);
});

socket.on('allowOptionsReturn',()=>{
    btnOptions.disabled= false;
});

socket.on('blockOptionsReturn',()=>{
    btnOptions.disabled= true;
    alert('OTRO USUARIO DE LA SALA ESTÁ MODIFICANDO ELEMENTOS DE LA MISMA, MIENTRAS TANTO, USTED NO PODRÁ HACERLO');
});

socket.on('saveRetro2',({room,r})=>{
    console.log("SAVE RETRO 2 RECEIVED");
    socket.emit('saveRetro2Server',{room,r});
})

socket.on('retroSavedReturn',()=>{
    console.log("RECIBIDO RETURN DEL SAVE");
    alert("SE HA ALMACENADO CORRECTAMENTE LA RETROSPECTIVA EN EL HISTORIAL DE LA SALA");
    overlayHistory.style.display = 'none';
    popupHistory.style.display = 'none';
    windPool.innerHTML="";
    anchorPool.innerHTML="";
    icebergPool.innerHTML="";
    btnOptions.disabled= false;
});

socket.on('loadRetroHistoryListReturn',titles=>{
    poolRetro.innerHTML="";
    retros=titles.length;
    for(i=0;i<titles.length;i++){
        let html = `<input class="retro-list-history" type="radio" name="history" value="${titles[i].Nombre}" id="retro${i}"/> ${titles[i].Nombre}<br>`;
        poolRetro.innerHTML+=html;
    }
});

socket.on('loadRetroInPopupReturn',result=>{
    //RESULT ES UN ARRAY CON Titulo Y Tipo
    for(i=0;i<result.length;i++){
        loadRoomPostitsHistory(result);
    }
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

function showListToDelete(postits){
    psts=postits.length;
    deletePool.innerHTML="";
    for(i=0;i<postits.length;i++){
        t = postits[i].Tipo;
        let type;
        if(t == 1)
            type="viento";
        else if(t==2)
            type="ancla";
        else if(t==3)
            type="iceberg";
        let html = `<input id="p${i}" class="selected-postit" type="checkbox" value="${postits[i].ID}"/>${postits[i].Titulo} (${type})<br>`;
        deletePool.innerHTML+=html;
    }
}

function loadRoomPostits(postits){
    windPool.innerHTML="";
    anchorPool.innerHTML="";
    icebergPool.innerHTML="";
    for(i=0;i<postits.length;i++){
        createPostit(postits[i].Titulo, postits[i].Tipo);
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

function loadRoomPostitsHistory(postits){
    poolWindLoad.innerHTML="";
    poolAnchorLoad.innerHTML="";
    poolIcebergLoad.innerHTML="";
    for(i=0;i<postits.length;i++){
        createPostitHistory(postits[i].Titulo, postits[i].Tipo);
    }
}

function createPostitHistory(title,t){
    let html = `<div class="postit">
                <p class="postit-title">${title}</p>
                </div>`;
    if(t==1)
        poolWindLoad.innerHTML+=html;
    else if(t==2)
        poolAnchorLoad.innerHTML+=html;
    else if(t==3)
        poolIcebergLoad.innerHTML+=html;
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
    <p class="help-text"> El iceberg es una metáfora referida a todo aquello que, si bien todavía no ha causado ningún problema, en el futuro podría agravarse y convertirse en algo que nos frene. En otras palabras, el ancla en la retrospectiva del barco de vela, es un problema existente que en un futuro podría agravarse y lastrar el progreso hacía los objetivos que el equipo quiere conseguir.<br>El iceberg, son los problemas potenciales futuros.<br><br>La falta de rigurosidad en los tests, podría ser un ejemplo de esta categoría, ya que puede que en el momento no suponga un problema, pero que en el futuro, sí los cause.</p>`;
    popupContentInfo.innerHTML=html;
}

//POP UP CLOSED INITIALY
overlayOptions.onclick = function(){
    overlayOptions.style.display = 'none';
    popupOptions.style.display = 'none';
    socket.emit('allowOptions',room);
}
  
// Close Popup Event
closePopupOptions.onclick = function() {
    overlayOptions.style.display = 'none';
    popupOptions.style.display = 'none';
    socket.emit('allowOptions',room);
};

btnOptions.onclick = function(){
    overlayOptions.style.display = 'block';
    popupOptions.style.display = 'block';
    socket.emit('blockOptions',room);
    socket.emit('showListPosits',room);
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
    socket.emit('titlesToDelete',{titlesDelete,room});
}

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
    if(titulo.length>0)
        socket.emit('saveRetro',{titulo,room});
    else
        alert("TÍTULO DE RETROSPECTIVA VACÍO.");
}

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

    socket.emit('loadRetroHistoryList',room);
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
        socket.emit('loadRetroInPopup',{room,tituloRetroLoad});
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
}

closePopupShowRetro.onclick = function() {
    overlayShowRetro.style.display = 'none';
    popupShowRetro.style.display = 'none';
}




