const socket = io();


//POPUP
var closePopup = document.getElementById("popupclose");
var overlay = document.getElementById("overlay");
var popup = document.getElementById("popup");
var popupContent = document.getElementById("popup-content");

//POPUP FIX
var closePopupFix = document.getElementById("popupclose-fix");
var overlayFix = document.getElementById("overlay-fix");
var popupFix = document.getElementById("popup-fix");
var popupContentFix = document.getElementById("popup-content-fix");
const thirdMode = document.getElementById('third-mode');
const halfMode = document.getElementById('half-mode');
const btnFijar = document.getElementById('btn-fix');


const btnAdd = document.getElementById('add-us-button');
const pool = document.getElementById('us-card-pool');
const titleUs = document.getElementById('new-user-story');
const btnBorrar = document.getElementById('delete-us');
const btnBorrarUs = document.getElementById('btn-borrar-us');
const popupContentPool = document.getElementById('popup-content-pool');
const btnFix = document.getElementById('fix-us');
const modifyPool = document.getElementById('modify-us-pool');
const btnEditUs = document.getElementById('btn-edit-us');


//USUARIO Y SALA DEL DOT VOTING
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix:true
});

var userStories=1;
var votingM=-1;
let checked = [];
let titles= []; //DE BASE DE DATOS


//socket.emit('dotJoinRoom',{username, room});

socket.on('unexpectedError',()=>{
    alert('HA OCURRIDO UN ERROR INESPERADO');
    redirecc("http://localhost:3000/dotRoom.html");
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

btnAdd.onclick = function(){
    if(titleUs.value.length>0){
        socket.emit('newUserStorie'); //NUEVA US AL SERVIDOR -> PASAR TITULO Y NOMBRE DE SALA
        let tarjeta = `<div class="us-card" id="us-${userStories}">
                            <h3 class="us-title">US${userStories}: ${titleUs.value}</h3>
                            <div class="cnt-btn">
                                <p class="contador-votos">0</p>
                                <button id="modifier-more" class="modifier">+</p><br>
                                <button id="modifier-less" class="modifier">-</p>
                            </div>
                        </div> `;
        pool.innerHTML+=tarjeta;
        checked[userStories]=true;
        console.log("título de la user storie"+titleUs.value);
        titles[userStories]=titleUs.value;
        userStories++;
    }else{
        alert("EL TITULO DE LA USER STORY NO PUEDE SER VACÍO");
    }
    
}

btnBorrar.onclick = function(){
    console.log("PULSADO BOTON DE BORRAR");

    if(userStories==1){
        alert("NO SE HA INTRODUCIDO NINGUNA USER STORIE, POR TANTO, NO SE PUEDEN BORRAR");
    }else{
        overlay.style.display = 'block';
        popup.style.display = 'block';
        escribirLista();
    }
}

btnBorrarUs.onclick = function(){
    console.log("PULSADO BORRAR US");
    var i=1;
    for(;i<userStories; i++){
        var elem = document.getElementById(`us-${i}-delete`);
        if(checked[i]){ //SI ESTÁ
            if(elem.checked){ // SI MARCADO PARA BORRAR
                checked[i]=false; //LO DESMARCO
                //LO ELIMINO DEL PANEL
                let list = document.getElementById(`us-${i}`);
                padreList = list.parentNode;
                padreList.removeChild(list);
            }
        }
    }
    escribirLista();
}

function escribirLista(){
    var i=1;
    popupContentPool.innerHTML="";
    for(;i<userStories; i++){
        if(checked[i]){
            let elemLista = `<input id="us-${i}-delete" class="us-to-delete" type="checkbox" value="US${i}"/>US${i}: ${titles[i]}<br>`;
            popupContentPool.innerHTML+=elemLista;
        }
            
    }
}


//POPUP FIX BUTTONS

overlayFix.onclick = function(){
    overlayFix.style.display = 'none';
    popupFix.style.display = 'none';
}

closePopupFix.onclick = function() {
    overlayFix.style.display = 'none';
    popupFix.style.display = 'none';
};

btnFix.onclick = function(){
    console.log("PULSADO FIJAR US");
    if(userStories==1) //SI NO HAY, ADVERTIRLO
        alert("NO SE HA INTRODUCIDO NINGUNA USER STORIE");
    else{
        console.log("INICIALIZANDO EL POPUP FIX");
        overlayFix.style.display = 'block';
        popupFix.style.display = 'block';
    }
}

thirdMode.onclick = function(){
    votingM=1;
}   

halfMode.onclick = function(){
    votingM=2;
}

btnFijar.onclick = function(){
    //mandar a servidor modo de voto y bloquear todo
    //Comprobar que se ha fijado algún valor para el voting mode
    if(votingM==1 || votingM==2){
        //Cerrar la pestaña de fijar
        overlayFix.style.display = 'none';
        popupFix.style.display = 'none';
        //Deshabilitar el añadir y el borrar user stories
        modifyPool.style.display='none';
        //Habilitar el volver a modificar las us
        btnEditUs.disabled = false;
    }else{
        alert("ELIJA PRIMERO LA REPARTICIÓN DE LOS VOTOS");
    }
    
}


btnEditUs.onclick = function(){
    //VOLVER A MOSTRAR LOS BOTONES PARA MODIFICAR USER STORIES
    modifyPool.style.display='block';    
    //VOLVER A DESHABILITAR EL BOTON DE VOLVER A EDITAR LAS USER STORIES
    btnEditUs.disabled = true;
}

