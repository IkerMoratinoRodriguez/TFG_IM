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

//POPUP MOVER DE SECCIÓN
const closePopupMove = document.getElementById("popupclose-move");
const overlayMove = document.getElementById("overlay-move");
const popupMove = document.getElementById("popup-move");
const btnMove = document.getElementById("ok-move");
const knTitlesPoolMove = document.getElementById("move-us-kn");
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


/*
  SOCKET ON 
*/
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
socket.on('addToDoKanbanReturn',()=>{
    socket.emit('actualizarKanban',room);
});
socket.on('actualizarKanbanReturn',res=>{
    mostrarKanban(res);
});
socket.on('showElemsKanbanMoveReturn',res=>{
    aniadirTitulosKnTitlesPoolMove(res);
});
socket.on('moveToDoDoingKanbanReturn',()=>{
    socket.emit('actualizarKanban',room);
});
socket.on('showElemsKanbanMoveDoingDoneReturn',res=>{
    aniadirTitulosKnTitlesPoolMoveDoingDone(res);
});
socket.on('showElemsDeleteKnReturn',res=>{
    listarUSToDelete(res); 
});
/*
    ON CLICK DOM
*/
btnAddElem.onclick = function(){
    socket.emit('showElemsKanban',room); 
    overlayAddKn.style.display = 'block';
    popupAddKn.style.display = 'block';
}
btnMoveDoDoing.onclick = function(){
    socket.emit('showElemsKanbanMove',room); 
    titlePopupMove.innerHTML='TO DO -> DOING';
    moveOp=1;
    overlayMove.style.display = 'block';
    popupMove.style.display = 'block';
}
btnMoveDoingDone.onclick = function(){
    socket.emit('showElemsKanbanMoveDoingDone',room); 
    titlePopupMove.innerHTML='DOING -> DONE';
    moveOp=2;
    overlayMove.style.display = 'block';
    popupMove.style.display = 'block';
}
wipTitle.onclick = function(){
    overlayWip.style.display = 'block';
    popupWip.style.display = 'block';
}
btnRemoveDone.onclick = function(){
    overlayDeleteKn.style.display = 'block';
    popupDeleteKn.style.display = 'block';
    socket.emit('showElemsDeleteKn',room);
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
    for(i=0;i<usPB;i++){
        var elem = document.getElementById(`us${i}`);
        if(elem.checked){
            usKanban.push(elem.value);
        }
    }
    socket.emit('addToDoKanban',{usKanban,room}); 
    overlayAddKn.style.display = 'none';
    popupAddKn.style.display = 'none';
}


/*
    POPUP MOVER
*/
overlayMove.onclick = function(){
    overlayMove.style.display = 'none';
    popupMove.style.display = 'none';
}
closePopupMove.onclick = function() {
    overlayMove.style.display = 'none';
    popupMove.style.display = 'none';
};
btnMove.onclick = function(){
    //MANDAR LOS ID DE LAS QUE SE QUIEREN MOVER
    let usKanbanMove= [];
    for(i=0;i<usPBMove;i++){
        var elem = document.getElementById(`usMoveDoDoing${i}`);
        if(elem.checked){
            usKanbanMove.push(elem.value);
        }
    }
    elemsCambio = usKanbanMove.length;
    if(moveOp == 1){
        socket.emit('moveToDoDoingKanban',{usKanbanMove,room}); 
        overlayMove.style.display = 'none';
        popupMove.style.display = 'none';
    }
    else if(moveOp == 2){
        socket.emit('moveDoingDoneKanban',{usKanbanMove,room});
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
}
closePopupWip.onclick = function(){
    overlayWip.style.display = 'none';
    popupWip.style.display = 'none';
};



/*
    POPUP ELIMINAR US
*/
overlayDeleteKn.onclick = function(){
    overlayDeleteKn.style.display = 'none';
    popupDeleteKn.style.display = 'none';
}
closePopupDeleteKn.onclick = function() {
    overlayDeleteKn.style.display = 'none';
    popupDeleteKn.style.display = 'none';
};
btnDeleteKn.onclick = function() {
    let deleteKnbn= [];
    for(i=0;i<usDelete;i++){
        var elem = document.getElementById(`usDelete${i}`);
        if(elem.checked){
            deleteKnbn.push(elem.value);
        }
    }
    socket.emit('deleteKNSelected',{deleteKnbn,room}); 
    overlayDeleteKn.style.display = 'none';
    popupDeleteKn.style.display = 'none';
}



/*
    FUNCIONES
*/
function aniadirTitulosKnTitlesPool(titulos){
    knTitlesPool.innerHTML='';
    usPB=titulos.length;
    for(i=0;i<titulos.length;i++){
        html=`<input id="us${i}" class="selected-postit" type="checkbox" value="${titulos[i].ID}"/>${titulos[i].Titulo} | Priorización:${titulos[i].Priorizacion} | Estimación:${titulos[i].Estimacion}<br>`;
        knTitlesPool.innerHTML+=html;
    }
}

function aniadirTitulosKnTitlesPoolMove(titulos){
    knTitlesPoolMove.innerHTML='';
    usPBMove=titulos.length;
    for(i=0;i<titulos.length;i++){
        html=`<input id="usMoveDoDoing${i}" class="selected-postit" type="checkbox" value="${titulos[i].ID}"/>${titulos[i].Titulo} | Priorización:${titulos[i].Priorizacion} | Estimación:${titulos[i].Estimacion}<br>`;
        knTitlesPoolMove.innerHTML+=html;
    }
}

function aniadirTitulosKnTitlesPoolMoveDoingDone(titulos){
    knTitlesPoolMove.innerHTML='';
    usPBMove=titulos.length;
    for(i=0;i<titulos.length;i++){
        html=`<input id="usMoveDoDoing${i}" class="selected-postit" type="checkbox" value="${titulos[i].ID}"/>${titulos[i].Titulo} | Priorización:${titulos[i].Priorizacion} | Estimación:${titulos[i].Estimacion}<br>`;
        knTitlesPoolMove.innerHTML+=html;
    }
}

function listarUSToDelete(titulos){
    deleteKnTitlesPool.innerHTML='';
    usDelete=titulos.length;
    for(i=0;i<titulos.length;i++){
        html=`<input id="usDelete${i}" class="selected-postit" type="checkbox" value="${titulos[i].ID}"/>${titulos[i].Titulo} | Priorización:${titulos[i].Priorizacion} | Estimación:${titulos[i].Estimacion}<br>`;
        deleteKnTitlesPool.innerHTML+=html;
    }
}

function mostrarKanban(userStories){
    let todo = [];
    let doing = [];
    let done = [];
    todoPool.innerHTML = '';
    doingPool.innerHTML = '';
    donePool.innerHTML = '';
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
    console.log(todo);
    for(i=0;i<todo.length;i++){
        html=`<div class="postit-kn">
                    <p class="postit-title-kn">${todo[i].title}</p>
                    <p class="postit-esti">E:${todo[i].est}</p>
                    <p class="postit-prio">P:${todo[i].prio}</p>
                </div>`;
        todoPool.innerHTML+=html;
    }
    for(i=0;i<doing.length;i++){
        html=`<div class="postit-kn">
                    <p class="postit-title-kn">${doing[i].title}</p>
                    <p class="postit-esti">E:${doing[i].est}</p>
                    <p class="postit-prio">P:${doing[i].prio}</p>
                </div>`;
        doingPool.innerHTML+=html;
    }
    for(i=0;i<done.length;i++){
        html=`<div class="postit-kn">
                    <p class="postit-title-kn">${done[i].title}</p>
                    <p class="postit-esti">E:${done[i].est}</p>
                    <p class="postit-prio">P:${done[i].prio}</p>
                </div>`;
        donePool.innerHTML+=html;
    }
    
}
