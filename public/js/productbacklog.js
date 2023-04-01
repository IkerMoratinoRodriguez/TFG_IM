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
const okDelete = document.getElementById('ok-delete');

//POPUP DETALLES DE ELEMENTO
const closePopupDetails = document.getElementById("popupclose-details");
const overlayDetails = document.getElementById("overlay-details");
const popupDetails = document.getElementById("popup-details");
const epicDetailsPool = document.getElementById('epic-details-pool');
const featureDetailsPool = document.getElementById('feature-details-pool');
const usDetailsPool = document.getElementById('us-details-pool');
const okDetails = document.getElementById('ok-details');


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
var idEpic;
var idFeature;
var maxEpic=0, maxFeature=0, maxUS=0;

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
socket.on('createEpicPBReturn',infoSend=>{
  crearItemPB(infoSend,1);
  aniadirEpicLista(i,infoSend.title,infoSend.id);
  maxEpic++;
});
socket.on('loadEpicsPB',epicas=>{
    maxEpic=epicas.length;
    for(i=0;i<epicas.length;i++){
      let info = {
        id: epicas[i].ID,
        title:epicas[i].Titulo,
        prio:epicas[i].Priorizacion,
        est:epicas[i].Estimacion,
      }
      crearItemPB(info,1);
      aniadirEpicLista(i,info.title,info.id);
    }
});
socket.on('createFeaturePBReturn',infoSend=>{
  crearItemPB(infoSend,2);
  aniadirFeatiureLista(maxFeature,infoSend.title,infoSend.id);
  maxFeature++;
});
socket.on('loadFeaturesPB',features=>{
  maxFeature=features.length;
  for(i=0;i<features.length;i++){
    let info = {
      id: features[i].ID,
      title:features[i].Titulo,
      prio:features[i].Priorizacion,
      est:features[i].Estimacion,
    }
    crearItemPB(info,2);
    aniadirFeatiureLista(i,info.title,info.id); //i actúa como índice en vez de el identificador para buscar cual es el seleccionado y que no de error si algun ID no existe
  }
});
socket.on('createUSPBReturn',infoSend=>{
  crearItemPB(infoSend,3);
  aniadirUSLista(maxUS,infoSend.title,infoSend.id);
  maxUS++;
});
socket.on('loadUSsPB',us=>{
  maxUS=us.length;
  for(i=0;i<us.length;i++){
    let info = {
      id: us[i].ID,
      title:us[i].Titulo,
      prio:us[i].Priorizacion,
      est:us[i].Estimacion,
    }
    crearItemPB(info,3);
    aniadirUSLista(i,info.title,info.id);
  }
});
socket.on('loadEpicsPBDelete',()=>{
    socket.emit('loadPB',room);
    location.reload();
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
      est:estimacion,
      idE: idEpic,
      idF: idFeature
    }
    if(tipoElem == 1)
      socket.emit('createEpicPB',info);  
    else if (tipoElem == 2)
      socket.emit('createFeaturePB',info);  
    else if (tipoElem == 3)
      socket.emit('createUserStoriePB',info);  

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
okDelete.onclick = function(){
  mostrarIDDeleteSelected();
}

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
okDetails.onclick = function(){
  mostrarIDDetailsSelected();
}

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

  idEpic=despOpc.value;

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

  var despOpc = desplegableFeature.options[desplegableFeature.selectedIndex];

  idFeature=despOpc.value;

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
      htmlOpcion = `<option value="${info.id}">${info.title}</option>`;
      desplegableEpic.innerHTML += htmlOpcion;
      epicPool.innerHTML+=html;
    }
    else if (tipo ==2){
      htmlOpcion = `<option value="${info.id}">${info.title}</option>`;
      desplegableFeature.innerHTML += htmlOpcion;
      featuresPool.innerHTML+=html;
      //guardar en algún sitio a qué epic pertenece para mostrarlo
    }
    else if (tipo ==3)
      userStoriesPool.innerHTML+=html;
      //guardar en algún sitio a qué feature y epic pertenece para mostrarlo

}
function aniadirEpicLista(indice,titulo, id){
  html = `<input id="epic${indice}" class="selected-delete-pb" type="checkbox" value="${id}"/>${titulo}<br> `;
  console.log(html);
  epicDeletePool.innerHTML += html; 
  htmlDetails = `<input id="epicDetails${indice}" class="selected-delete-pb" type="radio" value="${id}" name="detais"/>${titulo}<br> `;
  epicDetailsPool.innerHTML += htmlDetails;
}
function aniadirFeatiureLista(indice,titulo, id){
  html = `<input id="feature${indice}" class="selected-delete-pb" type="checkbox" value="${id}"/>${titulo}<br> `;
  featureDeletePool.innerHTML += html; 
  htmlDetails = `<input id="featureDetails${indice}" class="selected-delete-pb" type="radio" value="${id}" name="detais"/>${titulo}<br> `;
  featureDetailsPool.innerHTML += htmlDetails;
}
function aniadirUSLista(indice,titulo, id){
  html = `<input id="us${indice}" class="selected-delete-pb" type="checkbox" value="${id}"/>${titulo}<br> `;
  usDeletePool.innerHTML += html; 
  htmlDetails = `<input id="usDetails${indice}" class="selected-delete-pb" type="radio" value="${id}" name="detais"/>${titulo}<br> `;
  usDetailsPool.innerHTML += htmlDetails;
}
function mostrarIDDeleteSelected(){
  var epicasID = new Array();
  var featuresID = new Array();
  var usID = new Array();
  for(i=0;i<maxEpic;i++){
    var elem = document.getElementById(`epic${i}`);
    if(elem.checked){ // SI MARCADO PARA BORRAR
        console.log("Seleccionada la épica con ID:"+elem.value);
        epicasID.push(elem.value);
    }
  }
  for(i=0;i<maxFeature;i++){
    var elem = document.getElementById(`feature${i}`);
    if(elem.checked){ // SI MARCADO PARA BORRAR
        console.log("Seleccionada la feature con ID:"+elem.value);
        featuresID.push(elem.value);
    }
  }
  for(i=0;i<maxUS;i++){
    var elem = document.getElementById(`us${i}`);
    if(elem.checked){ // SI MARCADO PARA BORRAR
        console.log("Seleccionada la us con ID:"+elem.value);
        usID.push(elem.value)
    }
  }
  console.log("ÉPICAS ID:"+epicasID);
  socket.emit('deleteEpics',{epicasID,room});
  //ELIMINAR FEATURES Y USER STORIES Y ADEMÁS LOS DETALLES
  console.log(featuresID);
  console.log(usID);
}
function mostrarIDDetailsSelected(){

}
