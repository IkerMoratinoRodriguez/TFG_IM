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
    publicarPostit(inputPostit.value,pool,"NOMBRE DE USUARIO");
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
}
closePopupOptions.onclick = function() {
    overlayOptions.style.display = 'none';
    popupOptions.style.display = 'none';
};
btnMoreOptions.onclick = function(){
    overlayOptions.style.display = 'block';
    popupOptions.style.display = 'block';
}