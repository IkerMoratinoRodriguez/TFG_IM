const socket = io();
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix:true
});
socket.emit('joinTshirtRoom',{username,room});

/*
    ELEMENTOS DEL DOM
*/
const btnMoreS = document.getElementById('btn-more-s');
const btnMoreM = document.getElementById('btn-more-m');
const btnMoreL = document.getElementById('btn-more-l');
const btnMoreXL = document.getElementById('btn-more-xl');
const poolS = document.getElementById('pool-s');
const poolM = document.getElementById('pool-m');
const poolL = document.getElementById('pool-l');
const poolXL = document.getElementById('pool-xl');
const btnOptions = document.getElementById('options-button');



/*
    POPUP ADD POSTIT
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
    VARIABLES LOCALES
*/
var sec=0;
var psts=0;

/*
    SOCKET ON
*/
socket.on('unexpectedError1',msg=>{
    alert(msg);
    location.href="http://localhost:3000/tshirtRoom.html";
});

socket.on('unexpectedError',msg=>{
    alert(msg);
});
socket.on('createPostitTshirtReturn',({tit,tipo})=>{
    createPostit(tit,tipo);
});
socket.on('loadPositsTshirtJoin',posits=>{
    loadRoomPostits(posits);
});
socket.on('blockOptionsTshirtReturn',()=>{
    btnOptions.disabled= true;
    alert('OTRO USUARIO DE LA SALA ESTÁ MODIFICANDO ELEMENTOS DE LA MISMA, MIENTRAS TANTO, USTED NO PODRÁ HACERLO');
});
socket.on('allowOptionsTshirtReturn',()=>{
    btnOptions.disabled= false;
});
socket.on('showListTshirtPositsReturn',postits=>{
    showListToDelete(postits);
});

/*
    ONCLICK DE BOTONES DEL DOM
 */
btnMoreS.onclick = function(){
    console.log('Botón S presionado');
    overlay.style.display = 'block';
    popup.style.display = 'block';
    sec=1;
    title.innerHTML="TÍTULO DE POSTIT TALLA S";
}
btnMoreM.onclick = function(){
    console.log('Botón M presionado');
    overlay.style.display = 'block';
    popup.style.display = 'block';
    sec=2;
    title.innerHTML="TÍTULO DE POSTIT TALLA M";
}
btnMoreL.onclick = function(){
    console.log('Botón L presionado');
    overlay.style.display = 'block';
    popup.style.display = 'block';
    sec=3;
    title.innerHTML="TÍTULO DE POSTIT TALLA L";
}
btnMoreXL.onclick = function(){
    console.log('Botón XL presionado');
    overlay.style.display = 'block';
    popup.style.display = 'block';
    sec=4;
    title.innerHTML="TÍTULO DE POSTIT TALLA XL";
}
btnOptions.onclick = function(){
    overlayOptions.style.display = 'block';
    popupOptions.style.display = 'block';
    socket.emit('blockOptionsTshirt',room);
    socket.emit('showListPositsTshirt',room);
}

/*
    ONCLICK DE POPUP ADD POSTIT
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
    console.log("Publicar pulsado y valor del campo es"+titulo);
    if(titulo.length>0){
        createPostit(titulo,0); //CREAR EN CLIENTE
        let info = {
            sala:room,
            title:titulo,
            type:sec
        };
        socket.emit('createPostitTshirt',info); //ALMACENAR EN LA BASE DE DATOS Y CREAR EN LOS DEMÁS
    }else{
        alert("TÍTULO VACÍO");
    }
    
}


/*
    ONCLICK DE POPUP OPCIONES
*/
//POP UP CLOSED INITIALY
overlayOptions.onclick = function(){
    overlayOptions.style.display = 'none';
    popupOptions.style.display = 'none';
    socket.emit('allowOptionsTshirtCalif',room);
}
closePopupOptions.onclick = function() {
    overlayOptions.style.display = 'none';
    popupOptions.style.display = 'none';
    socket.emit('allowOptionsTshirtCalif',room);
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
    socket.emit('titlesToDeleteTshirt',{titlesDelete,room});
}


/*
    FUNCIONES
*/
function createPostit(titulo,seccion){
    let html = `<div class="postit">
                <p class="postit-title">${titulo}</p>
                </div>`;
    if(seccion==0){//VIENE DE LOCAL -> Dibujar directamente
        if(sec==1)
            poolS.innerHTML+=html;
        else if(sec==2)
            poolM.innerHTML+=html;
        else if(sec==3)
            poolL.innerHTML+=html;
        else if(sec==4)
            poolXL.innerHTML+=html;
    }else if(seccion==1)
        poolS.innerHTML+=html;
    else if(seccion==2)
        poolM.innerHTML+=html;
    else if(seccion==3)
        poolL.innerHTML+=html;
    else if(seccion==4)
        poolXL.innerHTML+=html;
}
function loadRoomPostits(postits){
    poolS.innerHTML="";
    poolM.innerHTML="";
    poolL.innerHTML="";
    poolXL.innerHTML="";
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
            type="S";
        else if(t==2)
            type="M";
        else if(t==3)
            type="L";
        else if(t==4)
            type="XL";
        let html = `<input id="p${i}" class="selected-postit" type="checkbox" value="${postits[i].ID}"/>${postits[i].Titulo} (${type})<br>`;
        deletePool.innerHTML+=html;
    }
}