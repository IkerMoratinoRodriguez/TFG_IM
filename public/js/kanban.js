const socket = io();
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix:true
});
socket.emit('kanbanJoinRoom',{username, room});

//POPUP AÑADIR ELEMENTO AL KANBAN
const closePopupAddKn = document.getElementById("popupclose-addkn");
const overlayAddKn = document.getElementById("overlay-addkn");
const popupAddKn = document.getElementById("popup-addkn");
const btnAddKn = document.getElementById("ok-addkn");
const knTitlesPool = document.getElementById("add-us-kn");
const knTitlesPoolEp = document.getElementById("add-ep-kn");
const knTitlesPoolFe = document.getElementById("add-fe-kn");

//POPUP MOVER DE SECCIÓN
const closePopupMove = document.getElementById("popupclose-move");
const overlayMove = document.getElementById("overlay-move");
const popupMove = document.getElementById("popup-move");
const btnMove = document.getElementById("ok-move");
const knTitlesPoolMove = document.getElementById("move-us-kn");
const knTitlesPoolMoveFe = document.getElementById("move-fe-kn");
const knTitlesPoolMoveEp = document.getElementById("move-ep-kn");
const titlePopupMove = document.getElementById("title-popup-move");

//POPUP MODIFICAR WIP
const closePopupWip = document.getElementById("popupclose-wip");
const overlayWip = document.getElementById("overlay-wip");
const popupWip = document.getElementById("popup-wip");
const btnOkWip = document.getElementById("ok-wip");
const inputWip = document.getElementById("new-wip");

//POPUP ELIMINAR ELEMENTO AL KANBAN
const closePopupDeleteKn = document.getElementById("popupclose-deletekn");
const overlayDeleteKn = document.getElementById("overlay-deletekn");
const popupDeleteKn = document.getElementById("popup-deletekn");
const btnDeleteKn = document.getElementById("ok-deletekn");
const deleteKnTitlesPool = document.getElementById("deletekn-titles");
const deleteKnTitlesPoolFe = document.getElementById("deletekn-fe-titles");
const deleteKnTitlesPoolEp = document.getElementById("deletekn-ep-titles");



//ELEMENTOS DEL DOM
const btnAddElem = document.getElementById('add-elem-kn');
const todoPool = document.getElementById('todo-pool');
const doingPool = document.getElementById('doing-pool');
const donePool = document.getElementById('done-pool');
const btnMoveDoDoing = document.getElementById('move-do-doing');
const btnMoveDoingDone = document.getElementById('move-doing-done');
const wipTitle = document.getElementById('wip-title');
const btnRemoveDone = document.getElementById('btn-remove-done');


//VARIABLES
var usPB=0, usPBMove=0, moveOp=0, usDelete=0/* 1:TO DO->DOING 2:DOING->DONE */;
var fePB=0, fePBMove=0, feDelete=0;
var epPB=0, epPBMove=0, epDelete=0;
var wipUsado, wipTotal, disabledWip;

/*
  SOCKET ON 
*/
socket.on('reload',()=>{
    location.reload();
});
socket.on('unexpectedError1',msg=>{
    alert(msg);
    location.href="http://localhost:3000/kanbanroom.html";
});
socket.on('unexpectedError',msg=>{
    alert(msg);
});
socket.on('showElemsKanbanReturn',res=>{
    aniadirTitulosKnTitlesPool(res);
});
socket.on('showFeaturesKanbanReturn',res=>{
    aniadirFeatureTitulosKnTitlesPool(res);
});
socket.on('showEpicsKanbanReturn',res=>{
    aniadirEpicTitulosKnTitlesPool(res);
});
socket.on('addToDoKanbanReturn',()=>{
    todoPool.innerHTML = '';
    doingPool.innerHTML = '';
    donePool.innerHTML = '';
    socket.emit('actualizarKanban',room);
    socket.emit('actualizarKanbanFeatures',room);
    socket.emit('actualizarKanbanEpics',room);
});
socket.on('deleteKNSelectedReturn',()=>{
    location.reload();
    socket.emit('actualizarKanban',room);
});
socket.on('actualizarKanbanReturn',res=>{
    mostrarKanban(res,1);
});
socket.on('actualizarKanbanFeaturesReturn',res=>{
    mostrarKanban(res,2);
});
socket.on('actualizarKanbaEpicsReturn',res=>{
    mostrarKanban(res,3);
});
socket.on('showElemsKanbanMoveReturn',res=>{
    aniadirTitulosKnTitlesPoolMove(res);
});
socket.on('showFeaturesKanbanMoveReturn',res=>{
    aniadirFeatureTitulosKnTitlesPoolMove(res);
});
socket.on('showEpicsKanbanMoveReturn',res=>{
    aniadirEpicTitulosKnTitlesPoolMove(res);
});
socket.on('moveToDoDoingKanbanReturn',()=>{
    socket.emit('actualizarKanban',room);
});
socket.on('showElemsKanbanMoveDoingDoneReturn',res=>{
    aniadirTitulosKnTitlesPoolMoveDoingDone(res);
});
socket.on('showEpicsKanbanMoveDoingDoneReturn',res=>{
    aniadirEpicTitulosKnTitlesPoolMoveDoingDone(res);
});
socket.on('showFeaturesKanbanMoveDoingDoneReturn',res=>{
    aniadirFeatureTitulosKnTitlesPoolMoveDoingDone(res);
});
socket.on('showElemsDeleteKnReturn',res=>{
    listarUSToDelete(res); 
});
socket.on('showEpicsDeleteKnReturn',res=>{
    listarEpicToDelete(res); 
});
socket.on('showFeaturesDeleteKnReturn',res=>{
    listarFeatureToDelete(res); 
});
//WIP
socket.on('loadWipReturn',wip=>{
    wipTotal=wip;
});
socket.on('loadWipUsadoReturn',wip=>{
    wipUsado=wip;
    cargarWip(wipUsado,wipTotal);
});
socket.on('updateWipReturn',newWip=>{
    wipTotal=newWip;
    cargarWip(wipUsado,wipTotal);
});
socket.on('blockButton',btnBlock=>{
    if(btnBlock==1){
        btnMoveDoDoing.disabled=true;
    }else if(btnBlock==2){
        btnMoveDoingDone.disabled=true;
    }else if(btnBlock==3){
        btnRemoveDone.disabled=true;
    }else if(btnBlock==4){
        disabledWip=true;
        wipTitle.style.color='red';
        wipTitle.style.cursor='default';
    }
});
socket.on('releaseButtonReturn',btnBlock=>{
    if(btnBlock==1){
        btnMoveDoDoing.disabled=false;
    }else if(btnBlock==2){
        btnMoveDoingDone.disabled=false;
    }else if(btnBlock==3){
        btnRemoveDone.disabled=false;
    }else if(btnBlock==4){
        disabledWip=false;
        wipTitle.style.color='black';
        wipTitle.style.cursor='pointer';
    }
});
/*
    ON CLICK DOM
*/
btnAddElem.onclick = function(){
    knTitlesPool.innerHTML='';
    socket.emit('showElemsKanban',room); 
    socket.emit('showFeaturesKanban',room); 
    socket.emit('showEpicsKanban',room); 
    overlayAddKn.style.display = 'block';
    popupAddKn.style.display = 'block';
}
btnMoveDoDoing.onclick = function(){
    knTitlesPoolMove.innerHTML='';
    socket.emit('showElemsKanbanMove',room); 
    socket.emit('showFeaturesKanbanMove',room); 
    socket.emit('showEpicsKanbanMove',room); 
    titlePopupMove.innerHTML='TO DO -> DOING';
    moveOp=1;
    overlayMove.style.display = 'block';
    popupMove.style.display = 'block';
}
btnMoveDoingDone.onclick = function(){
    knTitlesPoolMove.innerHTML='';
    socket.emit('showElemsKanbanMoveDoingDone',room); 
    socket.emit('showEpicsKanbanMoveDoingDone',room); 
    socket.emit('showFeaturesKanbanMoveDoingDone',room); 
    titlePopupMove.innerHTML='DOING -> DONE';
    moveOp=2;
    overlayMove.style.display = 'block';
    popupMove.style.display = 'block';
}
wipTitle.onclick = function(){
    if(!disabledWip){
        socket.emit('blockWipButton',room); 
        overlayWip.style.display = 'block';
        popupWip.style.display = 'block';
    }else{
        alert("WIP bloqueado por otro usuario");
    }
}
btnRemoveDone.onclick = function(){
    overlayDeleteKn.style.display = 'block';
    popupDeleteKn.style.display = 'block';
    deleteKnTitlesPool.innerHTML='';
    socket.emit('showElemsDeleteKn',room);
    socket.emit('showEpicsDeleteKn',room);
    socket.emit('showFeaturesDeleteKn',room);
}


/*
    POPUP AÑADIR US
*/
overlayAddKn.onclick = function(){
    overlayAddKn.style.display = 'none';
    popupAddKn.style.display = 'none';
}
closePopupAddKn.onclick = function() {
    overlayAddKn.style.display = 'none';
    popupAddKn.style.display = 'none';
};
btnAddKn.onclick = function(){
    let usKanban= [];
    let feKanban= [];
    let epKanban= [];
    for(i=0;i<usPB;i++){
        var elem = document.getElementById(`us${i}`);
        if(elem.checked){
            usKanban.push(elem.value);
        }
    }
    for(i=0;i<fePB;i++){
        var elem = document.getElementById(`fe${i}`);
        if(elem.checked){
            feKanban.push(elem.value);
        }
    }
    for(i=0;i<epPB;i++){
        var elem = document.getElementById(`ep${i}`);
        if(elem.checked){
            epKanban.push(elem.value);
        }
    }
    socket.emit('addToDoKanban',{usKanban,room}); 
    socket.emit('addFeToDoKanban',{feKanban,room}); 
    socket.emit('addEpToDoKanban',{epKanban,room}); 
    overlayAddKn.style.display = 'none';
    popupAddKn.style.display = 'none';
}


/*
    POPUP MOVER
*/
overlayMove.onclick = function(){
    overlayMove.style.display = 'none';
    popupMove.style.display = 'none';
    if(moveOp == 1){
        let btnBlock = 1;
        socket.emit('releaseButton',({room,btnBlock}));
    }else if(moveOp == 2){
        let btnBlock = 2;
        socket.emit('releaseButton',({room,btnBlock}));
    }
}
closePopupMove.onclick = function() {
    overlayMove.style.display = 'none';
    popupMove.style.display = 'none';
    if(moveOp == 1){
        let btnBlock = 1;
        socket.emit('releaseButton',({room,btnBlock}));
    }else if(moveOp == 2){
        let btnBlock = 2;
        socket.emit('releaseButton',({room,btnBlock}));
    }
};
btnMove.onclick = function(){
    //MANDAR LOS ID DE LAS QUE SE QUIEREN MOVER
    let usKanbanMove= [];
    let feKanbanMove= [];
    let epKanbanMove= [];
    for(i=0;i<usPBMove;i++){
        var elem = document.getElementById(`usMoveDoDoing${i}`);
        if(elem.checked){
            usKanbanMove.push(elem.value);
        }
    }
    for(i=0;i<fePBMove;i++){
        var elem = document.getElementById(`feMoveDoDoing${i}`);
        if(elem.checked){
            feKanbanMove.push(elem.value);
        }
    }
    for(i=0;i<epPBMove;i++){
        var elem = document.getElementById(`epMoveDoDoing${i}`);
        if(elem.checked){
            epKanbanMove.push(elem.value);
        }
    }
    elemsCambio = usKanbanMove.length;
    if(moveOp == 1){
        if(elemsCambio+wipUsado<=wipTotal){
            socket.emit('moveToDoDoingKanban',{usKanbanMove,room}); 
            overlayMove.style.display = 'none';
            popupMove.style.display = 'none';
            let btnBlock = 1;
            socket.emit('releaseButton',({room,btnBlock}));
        }else{
            alert("NO HAY SUFICIENTE CAPACIDAD PARA TENER TANTAS TAREAS EN DOING. POR FAVOR, SELECCIONE MENOS.");
        }
        socket.emit('moveFeToDoDoingKanban',{feKanbanMove,room}); 
        socket.emit('moveEpToDoDoingKanban',{epKanbanMove,room}); 
    }
    else if(moveOp == 2){
        let btnBlock = 2;
        socket.emit('releaseButton',({room,btnBlock}));
        socket.emit('moveDoingDoneKanban',{usKanbanMove,room});
        socket.emit('moveFeDoingDoneKanban',{feKanbanMove,room});
        socket.emit('moveEpDoingDoneKanban',{epKanbanMove,room});
        overlayMove.style.display = 'none';
        popupMove.style.display = 'none';
    }
        
}

/*
    POPUP CAMBIAR WIP
*/
overlayWip.onclick = function(){
    overlayWip.style.display = 'none';
    popupWip.style.display = 'none';
    let btnBlock=4;
    socket.emit('releaseButton',({room,btnBlock}));
}
closePopupWip.onclick = function(){
    overlayWip.style.display = 'none';
    popupWip.style.display = 'none';
    let btnBlock=4;
    socket.emit('releaseButton',({room,btnBlock}));
};
btnOkWip.onclick = function (){
    let newWip = inputWip.value;
    if(newWip<1){
        alert("SE DEBE FIJAR UN NÚMERO MAYOR QUE 0 PARA EL WIP");
    }else if(newWip<wipUsado){
        alert("SE DEBE FIJAR UN WIP MAYOR O IGUAL AL UTILIZADO POR EL EQUIPO");
    }else{
        let btnBlock = 4;
        socket.emit('releaseButton',({room,btnBlock}));
        overlayWip.style.display = 'none';
        popupWip.style.display = 'none';
        socket.emit('updateWip',{newWip,room});
    }
}


/*
    POPUP ELIMINAR US
*/
overlayDeleteKn.onclick = function(){
    overlayDeleteKn.style.display = 'none';
    popupDeleteKn.style.display = 'none';
    let btnBlock=3;
    socket.emit('releaseButton',({room,btnBlock}));
}
closePopupDeleteKn.onclick = function() {
    overlayDeleteKn.style.display = 'none';
    popupDeleteKn.style.display = 'none';
    let btnBlock = 3;
    socket.emit('releaseButton',({room,btnBlock}));
};
btnDeleteKn.onclick = function() {
    let btnBlock = 3;
    socket.emit('releaseButton',({room,btnBlock}));
    let deleteKnbn= [];
    let deleteEpKnbn= [];
    let deleteFeKnbn= [];
    for(i=0;i<usDelete;i++){
        var elem = document.getElementById(`usDelete${i}`);
        if(elem.checked){
            deleteKnbn.push(elem.value);
        }
    }
    for(i=0;i<epDelete;i++){
        var elem = document.getElementById(`epDelete${i}`);
        if(elem.checked){
            deleteEpKnbn.push(elem.value);
        }
    }
    for(i=0;i<feDelete;i++){
        var elem = document.getElementById(`feDelete${i}`);
        if(elem.checked){
            deleteFeKnbn.push(elem.value);
        }
    }
    socket.emit('deleteKNSelected',{deleteKnbn,room}); 
    socket.emit('deleteEpicKNSelected',{deleteEpKnbn,room}); 
    socket.emit('deleteFeatureKNSelected',{deleteFeKnbn,room}); 
    overlayDeleteKn.style.display = 'none';
    popupDeleteKn.style.display = 'none';
}



/*
    FUNCIONES
*/
function aniadirTitulosKnTitlesPool(titulos){
    usPB=titulos.length;
    for(i=0;i<titulos.length;i++){
        html=`<input id="us${i}" class="selected-postit" type="checkbox" value="${titulos[i].ID}"/>${titulos[i].Titulo} | Priorización:${titulos[i].Priorizacion} | Estimación:${titulos[i].Estimacion}<br>`;
        knTitlesPool.innerHTML+=html;
    }
}
function aniadirEpicTitulosKnTitlesPool(titulos){
    epPB=titulos.length;
    for(i=0;i<titulos.length;i++){
        html=`<input id="ep${i}" class="selected-postit" type="checkbox" value="${titulos[i].ID}"/>${titulos[i].Titulo} | Priorización:${titulos[i].Priorizacion}<br>`;
        knTitlesPoolEp.innerHTML+=html;
    }
}
function aniadirFeatureTitulosKnTitlesPool(titulos){
    fePB=titulos.length;
    for(i=0;i<titulos.length;i++){
        html=`<input id="fe${i}" class="selected-postit" type="checkbox" value="${titulos[i].ID}"/>${titulos[i].Titulo} | Priorización:${titulos[i].Priorizacion}<br>`;
        knTitlesPoolFe.innerHTML+=html;
    }
}

function aniadirTitulosKnTitlesPoolMove(titulos){
    usPBMove=titulos.length;
    for(i=0;i<titulos.length;i++){
        html=`<input id="usMoveDoDoing${i}" class="selected-postit" type="checkbox" value="${titulos[i].ID}"/>${titulos[i].Titulo} | Priorización:${titulos[i].Priorizacion} | Estimación:${titulos[i].Estimacion}<br>`;
        knTitlesPoolMove.innerHTML+=html;
    }
}
function aniadirEpicTitulosKnTitlesPoolMove(titulos){
    epPBMove=titulos.length;
    for(i=0;i<titulos.length;i++){
        html=`<input id="epMoveDoDoing${i}" class="selected-postit" type="checkbox" value="${titulos[i].ID}"/>${titulos[i].Titulo} | Priorización:${titulos[i].Priorizacion}<br>`;
        knTitlesPoolMoveEp.innerHTML+=html;
    }
}
function aniadirFeatureTitulosKnTitlesPoolMove(titulos){
    fePBMove=titulos.length;
    for(i=0;i<titulos.length;i++){
        html=`<input id="feMoveDoDoing${i}" class="selected-postit" type="checkbox" value="${titulos[i].ID}"/>${titulos[i].Titulo} | Priorización:${titulos[i].Priorizacion}<br>`;
        knTitlesPoolMoveFe.innerHTML+=html;
    }
}

function aniadirTitulosKnTitlesPoolMoveDoingDone(titulos){
    usPBMove=titulos.length;
    for(i=0;i<titulos.length;i++){
        html=`<input id="usMoveDoDoing${i}" class="selected-postit" type="checkbox" value="${titulos[i].ID}"/>${titulos[i].Titulo} | Priorización:${titulos[i].Priorizacion} | Estimación:${titulos[i].Estimacion}<br>`;
        knTitlesPoolMove.innerHTML+=html;
    }
}
function aniadirEpicTitulosKnTitlesPoolMoveDoingDone(titulos){
    epPBMove=titulos.length;
    for(i=0;i<titulos.length;i++){
        html=`<input id="epMoveDoDoing${i}" class="selected-postit" type="checkbox" value="${titulos[i].ID}"/>${titulos[i].Titulo} | Priorización:${titulos[i].Priorizacion}<br>`;
        knTitlesPoolMoveEp.innerHTML+=html;
    }
}
function aniadirFeatureTitulosKnTitlesPoolMoveDoingDone(titulos){
    fePBMove=titulos.length;
    for(i=0;i<titulos.length;i++){
        html=`<input id="feMoveDoDoing${i}" class="selected-postit" type="checkbox" value="${titulos[i].ID}"/>${titulos[i].Titulo} | Priorización:${titulos[i].Priorizacion}<br>`;
        knTitlesPoolMoveFe.innerHTML+=html;
    }
}

function listarUSToDelete(titulos){
    usDelete=titulos.length;
    for(i=0;i<titulos.length;i++){
        html=`<input id="usDelete${i}" class="selected-postit" type="checkbox" value="${titulos[i].ID}"/>${titulos[i].Titulo} | Priorización:${titulos[i].Priorizacion} | Estimación:${titulos[i].Estimacion}<br>`;
        deleteKnTitlesPool.innerHTML+=html;
    }
}
function listarEpicToDelete(titulos){
    epDelete=titulos.length;
    for(i=0;i<titulos.length;i++){
        html=`<input id="epDelete${i}" class="selected-postit" type="checkbox" value="${titulos[i].ID}"/>${titulos[i].Titulo} | Priorización:${titulos[i].Priorizacion}<br>`;
        deleteKnTitlesPoolEp.innerHTML+=html;
    }
}
function listarFeatureToDelete(titulos){
    feDelete=titulos.length;
    for(i=0;i<titulos.length;i++){
        html=`<input id="feDelete${i}" class="selected-postit" type="checkbox" value="${titulos[i].ID}"/>${titulos[i].Titulo} | Priorización:${titulos[i].Priorizacion}<br>`;
        deleteKnTitlesPoolFe.innerHTML+=html;
    }
}

function mostrarKanban(userStories,tipoElem){
    let todo = [];
    let doing = [];
    let done = [];
    console.log(userStories);
    for(i=0;i<userStories.length;i++){
        let info = {
            title:userStories[i].Titulo,
            prio:userStories[i].Priorizacion,
            est:userStories[i].Estimacion
        }
        if(userStories[i].EstadoKanban == 1)
            todo.push(info);
        else if(userStories[i].EstadoKanban == 2)
            doing.push(info);
        else if(userStories[i].EstadoKanban == 3)
            done.push(info);
    }
    for(i=0;i<todo.length;i++){
        if (tipoElem == 1){
            html=`<div class="postit-kn">
            <p class="postit-title-kn">${todo[i].title}</p>
            <p class="postit-esti">E:${todo[i].est}</p>
            <p class="postit-prio">P:${todo[i].prio}</p>
        </div>`;
        }else if (tipoElem == 2){
            html=`<div class="postit-kn-f">
            <p class="postit-title-kn">${todo[i].title}</p>
            <p class="postit-prio">P:${todo[i].prio}</p>
        </div>`;
        }else if (tipoElem == 3){
            html=`<div class="postit-kn-e">
            <p class="postit-title-kn">${todo[i].title}</p>
            <p class="postit-prio">P:${todo[i].prio}</p>
        </div>`;
        }
        todoPool.innerHTML+=html;
    }
    for(i=0;i<doing.length;i++){
        if (tipoElem == 1){
            html=`<div class="postit-kn">
                    <p class="postit-title-kn">${doing[i].title}</p>
                    <p class="postit-esti">E:${doing[i].est}</p>
                    <p class="postit-prio">P:${doing[i].prio}</p>
                </div>`;
        }else if (tipoElem == 2){
            html=`<div class="postit-kn-f">
                    <p class="postit-title-kn">${doing[i].title}</p>
                    <p class="postit-prio">P:${doing[i].prio}</p>
                </div>`;
        }else if (tipoElem == 3){
            html=`<div class="postit-kn-e">
                    <p class="postit-title-kn">${doing[i].title}</p>
                    <p class="postit-prio">P:${doing[i].prio}</p>
                </div>`;
        }
        doingPool.innerHTML+=html;
    }
    for(i=0;i<done.length;i++){
        if (tipoElem == 1){
            html=`<div class="postit-kn">
                    <p class="postit-title-kn">${done[i].title}</p>
                    <p class="postit-esti">E:${done[i].est}</p>
                    <p class="postit-prio">P:${done[i].prio}</p>
                </div>`;
        }else if (tipoElem == 2){
            html=`<div class="postit-kn-f">
                    <p class="postit-title-kn">${done[i].title}</p>
                    <p class="postit-prio">P:${done[i].prio}</p>
                </div>`;
        }else if (tipoElem == 3){
            html=`<div class="postit-kn-e">
                    <p class="postit-title-kn">${done[i].title}</p>
                    <p class="postit-prio">P:${done[i].prio}</p>
                </div>`;
        }
        donePool.innerHTML+=html;
    }
    
}
function cargarWip(wipUsado,wip){
    wipTitle.innerHTML=`(${wipUsado}/${wip})`;
}