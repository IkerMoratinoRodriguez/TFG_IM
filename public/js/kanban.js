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


//ELEMENTOS DEL DOM
const btnAddElem = document.getElementById('add-elem-kn');
const todoPool = document.getElementById('todo-pool');
const doingPool = document.getElementById('doing-pool');
const donePool = document.getElementById('done-pool');

//VARIABLES
var usPB=0;



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

/*
    ON CLICK DOM
*/
btnAddElem.onclick = function(){
    socket.emit('showElemsKanban',room); 
    overlayAddKn.style.display = 'block';
    popupAddKn.style.display = 'block';
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
        html=`<div class="postit">
                    <p class="postit-title">${todo[i].title}${todo[i].est}${todo[i].prio}</p>
                </div>`;
        todoPool.innerHTML+=html;
    }
    for(i=0;i<doing.length;i++){
        html=`<div class="postit">
                    <p class="postit-title">${doing[i].title}${doing[i].est}${doing[i].prio}</p>
                </div>`;
        doingPool.innerHTML+=html;
    }
    for(i=0;i<done.length;i++){
        html=`<div class="postit">
                    <p class="postit-title">${done[i].title}${done[i].est}${done[i].prio}</p>
                </div>`;
        donePool.innerHTML+=html;
    }
    
}