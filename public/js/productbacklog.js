const socket = io();
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix:true
});
socket.emit('productBacklogJoinRoom',{username, room});


//POPUP AÑADIR ELEMENTO
const closePopupAddEpic = document.getElementById("popupclose-add-e");
const overlayAddEpic = document.getElementById("overlay-add-e");
const popupAddEpic = document.getElementById("popup-add-e");
const btnModificarAddEpic = document.getElementById('btn-modificar-add-e');
const inputTitleAddEpic = document.getElementById('title-input-add-e');
const inputDescriptionAddEpic = document.getElementById('description-input-add-e');
const inputPriorizationAddEpic = document.getElementById('priorization-input-add-e');
const inputEstimationAddEpic = document.getElementById('estimation-input-add-e');
const añadirAddEpic = document.getElementById('btn-modificar-add-e');
const titlePopupAdd = document.getElementById('title-popup-add-e');

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

//POPUP SELECCIONAR ÉPICA
const closePopupSelectEpic = document.getElementById("popupclose-select-epic");
const overlaySelectEpic = document.getElementById("overlay-select-epic");
const popupSelectEpic = document.getElementById("popup-select-epic");
const btnOkSelectEpic = document.getElementById("ok-select-ep");
const desplegableEpic = document.getElementById("epics-choose");
const desplegableFeature = document.getElementById("features-choose");


//POPUP SELECCIONAR FEATURE
const closePopupSelectFeature = document.getElementById("popupclose-select-feature");
const overlaySelectFeature = document.getElementById("overlay-select-feature");
const popupSelectFeature = document.getElementById("popup-select-feature");
const btnOkSelectFeature = document.getElementById("ok-select-fe");



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
  SOCKET ON
*/
socket.on('unexpectedError1',msg=>{
  alert(msg);
  location.href="http://localhost:3000/productbacklogroom.html";
});
socket.on('unexpectedError',msg=>{
  alert(msg);
});
socket.on('createEpicPBReturn',info=>{
  crearItemPB(info,1);
});


/*
  ON CLIC DOM
*/
btnAddEpic.onclick = function(){
  overlayAddEpic.style.display = 'block';
  popupAddEpic.style.display = 'block';
  titlePopupAdd.textContent = "Añadir épica al product backlog";
  tipoElem=1;
}
btnAddFeature.onclick = function(){
  overlaySelectEpic.style.display = 'block';
  popupSelectEpic.style.display = 'block';
  titlePopupAdd.textContent = "Añadir feature al product backlog";
  tipoElem=2;
}
btnAddUserStorie.onclick = function(){
  overlaySelectEpic.style.display = 'block';
  popupSelectEpic.style.display = 'block';
  titlePopupAdd.textContent = "Añadir historia de usuario al product backlog";
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
  ON CLICK POPUP AÑADIR ELEMENTO
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

  if (titulo =="" ||  descripcion =="" || priorizacion < 1 || estimacion < 1 || priorizacion == "" || estimacion == "" ){
    alert("Error: Algún campo está vacío o es incorrecto. Por favor, compruebe que ha completado bien el formulario.");
  }else{
    let info = {
      sala:room,
      title:titulo,
      desc:descripcion,
      prio:priorizacion,
      est:estimacion
    }
    socket.emit('createEpicPB',info);
    html = `<div>
    <div class="titulo-elem-pb">
        <p class="title-titulo">${titulo}</p>
    </div>
    <p class="estimation-pb">${estimacion}</p>
    <p class="priorization-pb">${priorizacion}</p>
    </div>`;
    if(tipoElem ==1){
      htmlOpcion = `<option value="${titulo}">${titulo}</option>`;
      desplegableEpic.innerHTML += htmlOpcion;
      epicPool.innerHTML+=html;
    }
    else if (tipoElem ==2){
      htmlOpcion = `<option value="${titulo}">${titulo}</option>`;
      desplegableFeature.innerHTML += htmlOpcion;
      featuresPool.innerHTML+=html;
    }
    else if (tipoElem ==3)
      userStoriesPool.innerHTML+=html;
  
    overlayAddEpic.style.display = 'none';
    popupAddEpic.style.display = 'none';
  }

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


/*
  POPUP SELECCIONAR ÉPICA
*/
overlaySelectEpic.onclick = function(){
  overlaySelectEpic.style.display = 'none';
  popupSelectEpic.style.display = 'none';
}
closePopupSelectEpic.onclick = function() {
  overlaySelectEpic.style.display = 'none';
  popupSelectEpic.style.display = 'none';
};
btnOkSelectEpic.onclick = function(){

  var despOpc = desplegableEpic.options[desplegableEpic.selectedIndex];
  console.log(despOpc.value);

  if(despOpc.value != "null"){
    overlaySelectEpic.style.display = 'none';
    popupSelectEpic.style.display = 'none';
    if(tipoElem == 2){  
      //mostrar añadir elemento
      overlayAddEpic.style.display = 'block';
      popupAddEpic.style.display = 'block';
    }else if (tipoElem == 3){
      //abrir select feature
      overlaySelectFeature.style.display = 'block';
      popupSelectFeature.style.display = 'block';
    }
  }else{
    alert("Debe seleccionar una épica para continuar");
  }
  
}

/*
  POPUP SELECCIONAR FEATURE
*/
overlaySelectFeature.onclick = function(){
  overlaySelectFeature.style.display = 'none';
  popupSelectFeature.style.display = 'none';
}
closePopupSelectFeature.onclick = function() {
  overlaySelectFeature.style.display = 'none';
  popupSelectFeature.style.display = 'none';
};
btnOkSelectFeature.onclick = function(){

  var despOpc = desplegableFeature.options[desplegableEpic.selectedIndex];
  console.log(despOpc.value);

  if(despOpc.value != "null"){
    overlaySelectFeature.style.display = 'none';
    popupSelectFeature.style.display = 'none';
    overlayAddEpic.style.display = 'block';
    popupAddEpic.style.display = 'block';
  }else{
    alert("Debe seleccionar una feature para continuar");
  }

}


/*
  FUNCIONES 
*/
function crearItemPB(info, tipo){
  html = `<div>
    <div class="titulo-elem-pb">
        <p class="title-titulo">${info.title}</p>
    </div>
    <p class="estimation-pb">${info.est}</p>
    <p class="priorization-pb">${info.prio}</p>
    </div>`;
    if(tipo ==1){
      htmlOpcion = `<option value="">${info.title}</option>`;
      desplegableEpic.innerHTML += htmlOpcion;
      epicPool.innerHTML+=html;
    }
    else if (tipo ==2){
      htmlOpcion = `<option value="">${info.title}</option>`;
      desplegableFeature.innerHTML += htmlOpcion;
      featuresPool.innerHTML+=html;
    }
    else if (tipo ==3)
      userStoriesPool.innerHTML+=html;
}