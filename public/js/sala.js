// Initialize Variables
var closePopup = document.getElementById("popupclose");
var overlay = document.getElementById("overlay");
var popup = document.getElementById("popup");
var buttonR = document.getElementById("button-r");
var buttonB = document.getElementById("button-b");
var buttonRe = document.getElementById("button-re");
var buttonP = document.getElementById("button-p");
var buttonO = document.getElementById("button-o");
var popupContent = document.getElementById("popup-content");

overlay.onclick = function(){
  overlay.style.display = 'none';
  popup.style.display = 'none';
}

// Close Popup Event
closePopup.onclick = function() {
  overlay.style.display = 'none';
  popup.style.display = 'none';
};
// Show Overlay and Popup
buttonR.onclick = function() {

  popupContent.innerHTML = ``;

  overlay.style.display = 'block';
  popup.style.display = 'block';

  
}

buttonB.onclick = function() {

  popupContent.innerHTML = `
  <h1 class="popup-title" id="popup-title">BACKLOG</h1>
            <p class="popup-text" id="popup-text">En esta pizarra, normalmente se repersenta uno de los elementos principales en las metodologías ágiles: el backlog. Dicho elemento, es usado para conocer, en cada momento, las tareas que tenemos pendientes de empezar, los que están en curso y los que ya se han completado. La siguiente imagen representa dicho Backlog:</p>
            <div class="backlog-img">
                <img src="/resources/backlog.png">
            </div> 
  `;

  overlay.style.display = 'block';
  popup.style.display = 'block';

}


buttonRe.onclick = function() {

  popupContent.innerHTML = ``;

  overlay.style.display = 'block';
  popup.style.display = 'block';
}

buttonP.onclick = function() {

  popupContent.innerHTML = ``;

  overlay.style.display = 'block';
  popup.style.display = 'block';
}

buttonO.onclick = function() {

  popupContent.innerHTML = ``;

  overlay.style.display = 'block';
  popup.style.display = 'block';
}