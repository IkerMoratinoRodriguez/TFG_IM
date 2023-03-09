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


/*
    POPUP AÑADIR POSTIT
*/
//POPUP MORE
const closePopup = document.getElementById("popupclose");
const overlay = document.getElementById("overlay");
const popup = document.getElementById("popup");
const popupContent = document.getElementById("popup-content");
const btnPublic = document.getElementById('btn-public');
const inputPostit = document.getElementById('input-postit');
const title = document.getElementById('title-popup');



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