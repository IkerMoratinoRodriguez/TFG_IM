//POPUP AÑADIR ÉPICA
const closePopupAddEpic = document.getElementById("popupclose-add-e");
const overlayAddEpic = document.getElementById("overlay-add-e");
const popupAddEpic = document.getElementById("popup-add-e");
const btnModificarAddEpic = document.getElementById('btn-modificar-add-e');
const inputTitleAddEpic = document.getElementById('title-input-add-e');
const inputDescriptionAddEpic = document.getElementById('description-input-add-e');
const inputPriorizationAddEpic = document.getElementById('priorization-input-add-e');
const inputEstimationAddEpic = document.getElementById('estimation-input-add-e');
const añadirAddEpic = document.getElementById('btn-modificar-add-e');

//POPUP ELIMINAR ELEMENTO
const closePopupDelete = document.getElementById("popupclose-delete");
const overlayDelete = document.getElementById("overlay-delete");
const popupDelete = document.getElementById("popup-delete");
const epicDeletePool = document.getElementById('epic-delete-pool');
const featureDeletePool = document.getElementById('feature-delete-pool');
const usDeletePool = document.getElementById('us-delete-pool');

//POPUP DETALLES DE ELEMENTO
const closePopupDetails = document.getElementById("popupclose-details");
const overlayDetails = document.getElementById("overlay-details");
const popupDetails = document.getElementById("popup-details");
const epicDetailsPool = document.getElementById('epic-details-pool');
const featureDetailsPool = document.getElementById('feature-details-pool');
const usDetailsPool = document.getElementById('us-details-pool');



//ELEMENTOS DEL DOM
const btnAddEpic = document.getElementById('add-epic');
const btnAddFeature = document.getElementById('add-feature');
const btnAddUserStorie = document.getElementById('add-us');
const epicPool = document.getElementById('epic-pool');
const featuresPool = document.getElementById('features-pool');
const userStoriesPool = document.getElementById('us-pool');
const btnDeleteElement = document.getElementById('delete-element');
const btnElementDetails = document.getElementById('element-details');

//VARIABLES GLOBALES
var tipoElem=0; // 1->EPICA 2->FEATURE 3->US



/*
  ON CLIC DOM
*/
btnAddEpic.onclick = function(){
  overlayAddEpic.style.display = 'block';
  popupAddEpic.style.display = 'block';
  tipoElem=1;
}
btnAddFeature.onclick = function(){
  overlayAddEpic.style.display = 'block';
  popupAddEpic.style.display = 'block';
  tipoElem=2;
}
btnAddUserStorie.onclick = function(){
  overlayAddEpic.style.display = 'block';
  popupAddEpic.style.display = 'block';
  tipoElem=3;
}
btnDeleteElement.onclick = function(){
  overlayDelete.style.display = 'block';
  popupDelete.style.display = 'block';
}
btnElementDetails.onclick = function(){
  overlayDetails.style.display = 'block';
  popupDetails.style.display = 'block';
}



/*
  ON CLICK POPUP AÑADIR EPICA
*/
overlayAddEpic.onclick = function(){
  overlayAddEpic.style.display = 'none';
  popupAddEpic.style.display = 'none';
}
closePopupAddEpic.onclick = function() {
  overlayAddEpic.style.display = 'none';
  popupAddEpic.style.display = 'none';
};
añadirAddEpic.onclick = function(){
  titulo = inputTitleAddEpic.value;
  descripcion = inputDescriptionAddEpic.value; // añadir solo a la base de datos
  priorizacion = inputPriorizationAddEpic.value;
  estimacion = inputEstimationAddEpic.value;

  html = `<div>
  <div class="titulo-elem-pb">
      <p class="title-titulo">${titulo}</p>
  </div>
  <p class="estimation-pb">${estimacion}</p>
  <p class="priorization-pb">${priorizacion}</p>
  </div>`;
  if(tipoElem ==1)
    epicPool.innerHTML+=html;
  else if (tipoElem ==2)
    featuresPool.innerHTML+=html;
  else if (tipoElem ==3)
    userStoriesPool.innerHTML+=html;

  overlayAddEpic.style.display = 'none';
  popupAddEpic.style.display = 'none';
}


/*
  POPUP ELIMINAR ELEMENTOS BACKLOG
*/
overlayDelete.onclick = function(){
    overlayDelete.style.display = 'none';
    popupDelete.style.display = 'none';
}
closePopupDelete.onclick = function() {
    overlayDelete.style.display = 'none';
    popupDelete.style.display = 'none';
};


/*
  POPUP DETALLES ELEMENTOS BACKLOG
*/
overlayDetails.onclick = function(){
  overlayDetails.style.display = 'none';
  popupDetails.style.display = 'none';
}
closePopupDetails.onclick = function() {
  overlayDetails.style.display = 'none';
  popupDetails.style.display = 'none';
};