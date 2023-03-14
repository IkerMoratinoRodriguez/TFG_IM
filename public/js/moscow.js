const socket = io();
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix:true
});
socket.emit('joinMoSCoWRoom',{username,room});

/*
    ELEMENTOS DEL DOM
*/
const poolM = document.getElementById('pool-m');
const poolS = document.getElementById('pool-s');
const poolC = document.getElementById('pool-c');
const poolW = document.getElementById('pool-w');
const btnMoreM = document.getElementById('btn-more-m');
const btnMoreS = document.getElementById('btn-more-s');
const btnMoreC = document.getElementById('btn-more-c');
const btnMoreW = document.getElementById('btn-more-w');
const btnOptions = document.getElementById('more-options');


/*
    POPUP AÑADIR POSTIT
*/
const closePopup = document.getElementById("popupclose");
const overlay = document.getElementById("overlay");
const popup = document.getElementById("popup");
const popupContent = document.getElementById("popup-content");
const btnPublic = document.getElementById('btn-public');
const inputPostit = document.getElementById('input-postit');
const title = document.getElementById('title-popup');

/*
    POPUP OPCIONES
*/
const closePopupOptions = document.getElementById("popupclose-options");
const overlayOptions = document.getElementById("overlay-options");
const popupOptions = document.getElementById("popup-options");
const popupContentOptions = document.getElementById("popup-content-options");
const deletePool = document.getElementById('delete-pool');
const btnDeleteSeleced = document.getElementById('btn-delete-selected');


/*
    VARIABLES
*/
var sec=0;
var psts=0;

/*
    SOCKET ON
*/
socket.on('unexpectedError1',msg=>{
    alert(msg);
    location.href="http://localhost:3000/moscowRoom.html";
});
socket.on('unexpectedError',msg=>{
    alert(msg);
});
socket.on('createPostitMoscowReturn',({tit,tipo})=>{
    createPostit(tit,tipo);
});
socket.on('loadPositsMoscowJoin',posits=>{
    loadRoomPostits(posits);
});
socket.on('allowOptionsMoscowReturn',()=>{
    btnOptions.disabled= false;
});
socket.on('blockOptionsMoscowReturn',()=>{
    btnOptions.disabled= true;
    alert('OTRO USUARIO DE LA SALA ESTÁ MODIFICANDO ELEMENTOS DE LA MISMA, MIENTRAS TANTO, USTED NO PODRÁ HACERLO');
    console.log("Llegado al cliente");
});
socket.on('showListMoscowPositsReturn',postits=>{
    showListToDelete(postits);
});

/*
    ON CLICK ELEMENTOS DEL DOM
*/
btnMoreM.onclick = function(){
    console.log("Pulsado botón must");
    sec=1;
    overlay.style.display = 'block';
    popup.style.display = 'block';
    title.innerHTML="TÍTULO DE POSTIT EN MUST";
}
btnMoreS.onclick = function(){
    console.log("Pulsado botón should");
    sec=2;
    overlay.style.display = 'block';
    popup.style.display = 'block';
    title.innerHTML="TÍTULO DE POSTIT EN SHOULD";
}
btnMoreC.onclick = function(){
    console.log("Pulsado botón could");
    sec=3;
    overlay.style.display = 'block';
    popup.style.display = 'block';
    title.innerHTML="TÍTULO DE POSTIT EN COULD";
}
btnMoreW.onclick = function(){
    console.log("Pulsado botón won't");
    sec=4;
    overlay.style.display = 'block';
    popup.style.display = 'block';
    title.innerHTML="TÍTULO DE POSTIT EN WON'T";
}
btnOptions.onclick = function(){
    overlayOptions.style.display = 'block';
    popupOptions.style.display = 'block';
    socket.emit('blockOptionsMoscow',room);
    socket.emit('showListPositsMoscow',room);
}


/*
    ON CLIC AÑADIR POSTIT
*/
overlay.onclick = function(){
    overlay.style.display = 'none';
    popup.style.display = 'none';
}
closePopup.onclick = function() {
    overlay.style.display = 'none';
    popup.style.display = 'none';
};
btnPublic.onclick = function(){
    const titulo=inputPostit.value;
    if(titulo.length>0){
        createPostit(titulo,0); //CREAR EN MI CLIENTE
        let info = {
            sala:room,
            title:titulo,
            type:sec
        };
        socket.emit('createPostitMoscow',info); //ALMACENAR EN LA BASE DE DATOS Y CREAR EN LOS DEMÁS
    }else{
        alert("TÍTULO VACÍO");
    }
    
}


/*
    ON CLIC OPCIONES
*/
overlayOptions.onclick = function(){
    overlayOptions.style.display = 'none';
    popupOptions.style.display = 'none';
    socket.emit('allowOptionsMoscow',room);
}
closePopupOptions.onclick = function() {
    overlayOptions.style.display = 'none';
    popupOptions.style.display = 'none';
    socket.emit('allowOptionsMoscow',room);
};
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
    socket.emit('titlesToDeleteMoscow',{titlesDelete,room});
}

/*
    FUNCIONES
*/
function createPostit(title,t){
    let html = `<div class="postit">
                <p class="postit-title">${title}</p>
                </div>`;
    if(t==0){//VIENE DE LOCAL
        if(sec==1)
            poolM.innerHTML+=html;
        else if(sec==2)
            poolS.innerHTML+=html;
        else if(sec==3)
            poolC.innerHTML+=html;
        else if(sec==4)
            poolW.innerHTML+=html;
    }else if(t==1)
        poolM.innerHTML+=html;
    else if(t==2)
        poolS.innerHTML+=html;
    else if(t==3)
        poolC.innerHTML+=html;
    else if(t==4)
        poolW.innerHTML+=html;
}
function loadRoomPostits(postits){
    poolM.innerHTML="";
    poolS.innerHTML="";
    poolC.innerHTML="";
    poolW.innerHTML="";
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
            type="must";
        else if(t==2)
            type="should";
        else if(t==3)
            type="could";
        else if(t==4)
            type="won't";
        let html = `<input id="p${i}" class="selected-postit" type="checkbox" value="${postits[i].ID}"/>${postits[i].Titulo} (${type})<br>`;
        deletePool.innerHTML+=html;
    }
}