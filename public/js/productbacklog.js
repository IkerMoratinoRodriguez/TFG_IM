//POPUP MORE
const closePopup = document.getElementById("popupclose");
const overlay = document.getElementById("overlay");
const popup = document.getElementById("popup");
const btnModificar = document.getElementById('btn-modificar');
const inputTitle = document.getElementById('title-input');
const inputDescription = document.getElementById('description-input');
const inputPriorization = document.getElementById('priorization-input');
const inputEstimation = document.getElementById('estimation-input');

//ESTÁN PUESTOS COMO CONST PERO LUEGO SE LO TIENE QUE TRAER EL SRVR Y CONSTRUIR EL ID
const title1 = document.getElementById('title-1');




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




document.querySelectorAll(".btn-modify-pb-elem").forEach(el => {
    el.addEventListener("click", e => {
      console.log("Pulsado botón "+e.target.getAttribute("ident")+" de modificar.");
      overlay.style.display = 'block';
      popup.style.display = 'block';
      inputTitle.value=title1.textContent;
    });
  });

document.querySelectorAll(".btn-details-pb-elem").forEach(el => {
  el.addEventListener("click", e => {
    console.log("Pulsado botón "+e.target.getAttribute("ident")+" de detalles.");
   });
});

document.querySelectorAll(".btn-delete-pb-elem").forEach(el => {
  el.addEventListener("click", e => {
    console.log("Pulsado botón "+e.target.getAttribute("ident")+" de borrar.");
   });
});