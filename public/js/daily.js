const socket = io();

//POPUP NEW POSTIT
const closePopup = document.getElementById("popupclose");
const overlay = document.getElementById("overlay");
const popup = document.getElementById("popup");
const popupContent = document.getElementById("popup-content");
const btnPublic = document.getElementById('btn-public');
const inputPostit = document.getElementById('general-postit');
const title = document.getElementById('title-popup');

//POPUP OPCIONES
const closePopupOptions = document.getElementById("popupclose-options");
const overlayOptions = document.getElementById("overlay-options");
const popupOptions = document.getElementById("popup-options");
const popupContentOptions = document.getElementById("popup-content-options");
const deletePool = document.getElementById('delete-pool');
const btnDeleteSeleced = document.getElementById('btn-delete-selected');
const btnSaveDaily = document.getElementById('btn-save-daily');
const btnDailyHistory = document.getElementById('btn-daily-history');

//POPUP SAVE DAILY MEETING
const closePopupHistory = document.getElementById("popupclose-history");
const overlayHistory = document.getElementById("overlay-history");
const popupHistory = document.getElementById("popup-history");
const popupContentHistory = document.getElementById("popup-content-history");
const saveInput = document.getElementById('save-input');
const btnSaveSave = document.getElementById('btn-save-save');

//POPUP HISTORIAL DAILY
const closePopupDaily = document.getElementById("popupclose-daily");
const overlayDaily = document.getElementById("overlay-daily");
const popupDaily = document.getElementById("popup-daily");
const popupContentDaily = document.getElementById("popup-content-daily");
const poolDaily = document.getElementById('daily-pool');
const btnLoadDaily = document.getElementById('load-daily');

//POPUP CARGAR DAILY DEL HISTORIAL

//ELEMENTOS DEL DOM
const btnMoreYesterday = document.getElementById('btn-more-ytd');
const btnMoreProblems = document.getElementById('btn-more-prb');
const btnMoreToday = document.getElementById('btn-more-today');
let poolYesterday = document.getElementById('pool-yesterday');
let poolProblems = document.getElementById('pool-problems');
let poolToday = document.getElementById('pool-today');
const btnMoreOptions = document.getElementById('more-options');

//VARIABLES GLOBALES
var pool; //PARA SABER A QUE POOL AÑADIR EL NUEVO POSTIT 1->Ayer 2->Problemas 3->Hoy
var npostits;

const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix:true
});

socket.emit('dailyJoinRoom',{username, room});

socket.on('unexpectedError1', msg=>{
    alert(msg);
    redirecc("http://localhost:3000/dotRoom.html");
});

socket.on('unexpectedError', msg=>{
    alert(msg);
});

socket.on('loadPositsJoin',titles=>{
    poolYesterday.innerHTML="";
    poolProblems.innerHTML="";
    poolToday.innerHTML="";
    for(i=0;i<titles.length;i++){
        let p = titles[i];
        publicarPostit(p.Titulo,p.Tipo,p.Name);
    }
});

socket.on('newDailyPostitReturn',info=>{
    let usr = info.usr;
    let tipo = info.tipo;
    let titulo = info.titulo;
    publicarPostit(titulo,tipo,usr);
});

socket.on('fillDeletePoolReturn',titles=>{
    fillDeletePool(titles);
});

socket.on('lockOptionsDailyReturn',()=>{
    btnMoreOptions.disabled = true;
    alert('OTRO USUARIO DE LA SALA ESTÁ MODIFICANDO ELEMENTOS DE LA MISMA, MIENTRAS TANTO, USTED NO PODRÁ HACERLO');
});

socket.on('unlockOptionsDailyReturn',()=>{
    btnMoreOptions.disabled = false;
});



//POP UP ADD POSTIT
overlay.onclick = function(){
    overlay.style.display = 'none';
    popup.style.display = 'none';
}
closePopup.onclick = function() {
    overlay.style.display = 'none';
    popup.style.display = 'none';
};
btnMoreYesterday.onclick = function(){
    overlay.style.display = 'block';
    popup.style.display = 'block';
    title.innerHTML="ESCRIBE QUÉ TAREAS HICISTE AYER";
    pool=1;
}
btnMoreProblems.onclick = function(){
    overlay.style.display = 'block';
    popup.style.display = 'block';
    title.innerHTML="ESCRIBE QUÉ PROBLEMAS ENCONTRASTE AYER";
    pool=2;
}
btnMoreToday.onclick = function(){
    overlay.style.display = 'block';
    popup.style.display = 'block';
    title.innerHTML="ESCRIBE QUÉ TAREAS VAS A HACER HOY";
    pool=3;
}
btnPublic.onclick = function(){
    let info = {
        sala:room,
        usr:username,
        tipo:pool,
        titulo:inputPostit.value
    }
    publicarPostit(inputPostit.value,pool,username);
    socket.emit('newDailyPostit',info);
}

function publicarPostit(titulo, tipo, name){
    let html = `<div class="postit">
                    <p class="postit-title">${titulo}</p>
                    <p class="postit-name">${name}</p>
                </div>`;
    if(tipo==1){
        poolYesterday.innerHTML+=html;
    }else if(tipo==2){
        poolProblems.innerHTML+=html;
    }else if(tipo==3){
        poolToday.innerHTML+=html;
    }
}


//POPUP OPTIONS...
overlayOptions.onclick = function(){
    overlayOptions.style.display = 'none';
    popupOptions.style.display = 'none';
    socket.emit('unlockOptionsDaily',room);
}
closePopupOptions.onclick = function() {
    overlayOptions.style.display = 'none';
    popupOptions.style.display = 'none';
    socket.emit('unlockOptionsDaily',room);
};
btnMoreOptions.onclick = function(){
    overlayOptions.style.display = 'block';
    popupOptions.style.display = 'block';
    socket.emit('fillDeletePool',room);
    socket.emit('lockOptionsDaily',room);
}
function fillDeletePool(titles){
    deletePool.innerHTML="";
    npostits=titles.length;
    for(i=0;i<titles.length;i++){
        let t = titles[i];
        let type;
        switch(t.Tipo){
            case 1:
                type="ayer";
                break;
            case 2:
                type="problemas";
                break;
            case 3:
                type="hoy";
                break;          
                
        }
        let html=`<input id="tit${i}" class="selected-postit" type="checkbox" value="${t.ID}"/>${t.Titulo} (${type}) por ${t.Name}<br>`;
        deletePool.innerHTML+=html;
    }
}
btnDeleteSeleced.onclick = function(){
    for(i=0;i<npostits;i++){
        var elem = document.getElementById(`tit${i}`);
        if(elem.checked){ // SI MARCADO PARA BORRAR
            id = elem.value;
            socket.emit('deletePostitDaily',{id,room});
        }
    }
}

//POPUP SAVE DAILY MEETING
overlayHistory.onclick = function(){
    overlayHistory.style.display = 'none';
    popupHistory.style.display = 'none';
    overlayOptions.style.display = 'block';
    popupOptions.style.display = 'block';
}
closePopupHistory.onclick = function() {
    overlayHistory.style.display = 'none';
    popupHistory.style.display = 'none';
    overlayOptions.style.display = 'block';
    popupOptions.style.display = 'block';
};
btnSaveDaily.onclick = function(){
    overlayHistory.style.display = 'block';
    popupHistory.style.display = 'block';
    overlayOptions.style.display = 'none';
    popupOptions.style.display = 'none';
};

//POPUP HISTORIAL DAILY
overlayDaily.onclick = function(){
    overlayDaily.style.display = 'none';
    popupDaily.style.display = 'none';
    overlayOptions.style.display = 'block';
    popupOptions.style.display = 'block';
}
closePopupDaily.onclick = function() {
    overlayDaily.style.display = 'none';
    popupDaily.style.display = 'none';
    overlayOptions.style.display = 'block';
    popupOptions.style.display = 'block';
};
btnDailyHistory.onclick = function(){
    overlayDaily.style.display = 'block';
    popupDaily.style.display = 'block';
    overlayOptions.style.display = 'none';
    popupOptions.style.display = 'none';
};