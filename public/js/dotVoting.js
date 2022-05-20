//POPUP
const closePopup = document.getElementById("popupclose");
const overlay = document.getElementById("overlay");
const popup = document.getElementById("popup");
const popupContent = document.getElementById("popup-content");

//POPUP FIX
const closePopupFix = document.getElementById("popupclose-fix");
const overlayFix = document.getElementById("overlay-fix");
const popupFix = document.getElementById("popup-fix");
const popupContentFix = document.getElementById("popup-content-fix");
const thirdMode = document.getElementById('third-mode');
const paretoMode = document.getElementById('pareto-mode');
const halfMode = document.getElementById('half-mode');
const btnFijar = document.getElementById('btn-fix');

//POPUP VOTE
const closePopupVote = document.getElementById('popupclose-vote');
const overlayVote = document.getElementById("overlay-vote");
const popupVote = document.getElementById("popup-vote");
const popupContentVote = document.getElementById("popup-content-vote");
const btnSendVote = document.getElementById('btn-send-vote');
const poolVotes = document.getElementById('votes-pool');
const availableVotes = document.getElementById('available-votes');


const btnAdd = document.getElementById('add-us-button');
const pool = document.getElementById('us-card-pool');
const titleUs = document.getElementById('new-user-story');
const btnBorrar = document.getElementById('delete-us');
const btnBorrarUs = document.getElementById('btn-borrar-us');
const popupContentPool = document.getElementById('popup-content-pool');
const btnFix = document.getElementById('fix-us');
const modifyPool = document.getElementById('modify-us-pool');
const btnEditUs = document.getElementById('btn-edit-us');
const votePool = document.getElementById('vote-us-pool');
const btnVote = document.getElementById('btn-vote');
const clrVotes = document.getElementById('clear-votes');

const socket = io();
//USUARIO Y SALA DEL DOT VOTING
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix:true
});

var userStories;
var votingM=-1;
var avVotes;

socket.emit('dotJoinRoom',{username, room});

socket.on('editMode',()=>{
    votePool.style.display='none';
    modifyPool.style.display='block';
});

socket.on('voteMode',()=>{
    modifyPool.style.display='none';
    votePool.style.display='block';
});

socket.on('unexpectedError1', msg=>{
    alert(msg);
    redirecc("http://localhost:3000/dotRoom.html");
});

socket.on('unexpectedError', msg=>{
    alert(msg);
});

socket.on('userStoriesFixedReturn',()=>{
    //Deshabilitar las opciones de crear una nueva US O borrarlas
    modifyPool.style.display='none';
    //Habilitar el volver a modificar las us
    votePool.style.display='block';
});

socket.on('userStoriesUnlockedReturn',()=>{
    //VOLVER A MOSTRAR LOS BOTONES PARA MODIFICAR USER STORIES
    modifyPool.style.display='block';    
    //VOLVER A DESHABILITAR EL BOTON DE VOLVER A EDITAR LAS USER STORIES
    votePool.style.display='none';

});


socket.on('userStoriesRoomInit', res =>{
    if(res){
        mostrarUserStories(res);
        userStories=res.length+1;
    }
    else 
        userStories=1;
});

socket.on('writeListReturn', res =>{
    popupContentPool.innerHTML="";
    for(i=1;i<=res.length; i++){
        let elemLista = `<input id="us-${i}-delete" class="us-to-delete" type="checkbox" value="${res[i-1].Titulo}"/>${res[i-1].Titulo}<br>`;
        popupContentPool.innerHTML+=elemLista;        
    }
});

socket.on('blockDeleteReturn',()=>{
    btnBorrar.disabled = true;
    btnFix.disabled = true;
    btnAdd.disabled=true;
    alert("OTRO USUARIO ESTÁ BORRANDO O FIJANDO USER STORIES, MIENTRAS TANTO, NO SE PUEDEN BORRAR,FIJAR NI AÑADIR OTRAS.");
});

socket.on('freeDeleteReturn',()=>{
    btnBorrar.disabled = false;
    btnAdd.disabled=false;
    btnFix.disabled = false;
});


socket.on('deleteUSReturn',()=>{
    escribirLista();
});


socket.on('writeAvailableVotesReturn',info =>{
    avVotes=info.votes;
    availableVotes.innerHTML=`TIENES ${info.votes} VOTOS EN TOTAL`;
    if(info.votes>0)
        escribirListaDeVotacion(info.votes,info.titulos);
    else{
        alert("NO TIENES VOTOS DISPONIBLES, YA LOS HAS GASTADO TODOS");
        overlayVote.style.display = 'none';
        popupVote.style.display = 'none';
    }
});

socket.on('clearVotesReturn',()=>{
    location.reload();
});

//POP UP CLOSED INITIALY
overlay.onclick = function(){
    overlay.style.display = 'none';
    popup.style.display = 'none';
    socket.emit('freeDelete',room);
}
  
closePopup.onclick = function() {
    overlay.style.display = 'none';
    popup.style.display = 'none';
    socket.emit('freeDelete',room);
};

btnAdd.onclick = function(){
    const title=titleUs.value;
    if(title.length>0){
        socket.emit('newUserStorie',{room,title}); //NUEVA US AL SERVIDOR -> PASAR TITULO Y NOMBRE DE SALA
    }else{
        alert("EL TITULO DE LA USER STORY NO PUEDE SER VACÍO");
    }
    
}

btnBorrar.onclick = function(){
    if(userStories==1){
        alert("NO SE HA INTRODUCIDO NINGUNA USER STORIE, POR TANTO, NO SE PUEDEN BORRAR");
    }else{
        overlay.style.display = 'block';
        popup.style.display = 'block';
        escribirLista();
        socket.emit('blockDelete',room);
    }
}

btnBorrarUs.onclick = function(){
    var i=1;
    for(;i<userStories; i++){
        var elem = document.getElementById(`us-${i}-delete`);
        if(elem.checked){ // SI MARCADO PARA BORRAR
            title = elem.value;
            //LO ELIMINO DE LA BASE DE DATOS MANDANDO EL TITULO
            socket.emit('deleteUS',{room, title});
        }

    }
    escribirLista();
    pintarUserStories();
}


function mostrarUserStories(titulos){
    pool.innerHTML="";
    if(titulos){
        for(i=1;i<=titulos.length;i++){
            let tarjeta = `<div class="us-card" id="us-${i}">
                                <h3 class="us-title">${titulos[i-1].Titulo}</h3>
                                <div class="cnt-btn">
                                    <p class="contador-votos">${titulos[i-1].Votos}</p>
                                </div>
                            </div> `;
            pool.innerHTML+=tarjeta;
        }
    }
}

function pintarUserStories(){
    socket.emit('drawPannel',room);
}

function escribirLista(){
    socket.emit('writeList',room);
}

function escribirListaDeVotacion(votos,titulos){
    poolVotes.innerHTML="";
    if(titulos){
        for(j=0;j<votos;j++){
            let html = `<p class="us-title-votes">VOTO ${j+1}</p>   
                        <select class="us-list" id="voto${j}">
                            <option value="-1" selected>-</option>`;
            for(i=0;i<titulos.length;i++){
                html += `<option class="us-number-votes" value="${i}">${titulos[i].Titulo}</option>  `;
            }
            html+= `</select>`;
            poolVotes.innerHTML+=html;
        }
    }
}

//POPUP FIX BUTTONS

overlayFix.onclick = function(){
    overlayFix.style.display = 'none';
    popupFix.style.display = 'none';
    socket.emit('freeDelete',room);
}

closePopupFix.onclick = function() {
    overlayFix.style.display = 'none';
    popupFix.style.display = 'none';
    socket.emit('freeDelete',room);
};

btnFix.onclick = function(){
    if(userStories==1) //SI NO HAY, ADVERTIRLO
        alert("NO SE HA INTRODUCIDO NINGUNA USER STORIE");
    else{
        overlayFix.style.display = 'block';
        popupFix.style.display = 'block';
        votingM=-1;
    }
    socket.emit('blockDelete',room);
}

thirdMode.onclick = function(){
    votingM=3;
}   

paretoMode.onclick = function(){
    votingM=1;
}

halfMode.onclick = function(){
    votingM=2;
}

btnFijar.onclick = function(){

    //Comprobar que se ha fijado algún valor para el voting mode
    if(votingM!=-1){
        //mandar a servidor modo de voto y bloquear todo
        let info ={
            sala:room,
            votingMode:votingM
        };
        socket.emit('userStoriesFixed',info);
        //Cerrar la pestaña de fijar
        overlayFix.style.display = 'none';
        popupFix.style.display = 'none';
        //Deshabilitar el añadir y el borrar user stories
        modifyPool.style.display='none';
        //Habilitar el volver a modificar las us
        votePool.style.display='block';
        //Volver a habilitar para todos los botones de editar cuando se vuelva a poder
        socket.emit('freeDelete',room);
    }else{
        alert("ELIJA PRIMERO LA REPARTICIÓN DE LOS VOTOS");
    }
    
}


btnEditUs.onclick = function(){
    socket.emit('userStoriesUnlocked',room);
}

function redirecc(url) { 
    window.location.href = url;
};

//POP UP VOTE
overlayVote.onclick = function(){
    overlayVote.style.display = 'none';
    popupVote.style.display = 'none';
}

closePopupVote.onclick = function() {
    overlayVote.style.display = 'none';
    popupVote.style.display = 'none';
};

btnVote.onclick = function(){
    overlayVote.style.display = 'block';
    popupVote.style.display = 'block';
    socket.emit('writeAvailableVotes',{room,username}); //ESCRIBIR TITULO DE VOTOS Y MOSTRAR LISTA PARA VOTACIÓN
}

btnSendVote.onclick= function(){
    overlayVote.style.display = 'none';
    popupVote.style.display = 'none';
    //OBTENER PARA CADA VOTO (0->VOTOS-1) QUÉ TITULO HAN VOTADO (-1->NINGUNO 0...LENGTH-1)
    let votosUsados=0;
    let tit = [];
    for(i=0;i<avVotes;i++){
        elem = document.getElementById(`voto${i}`);
        ind = elem.selectedIndex;
        tit[i]=elem[ind].text;
        if(elem[ind].text!='-')
            votosUsados++;
        console.log(votosUsados);
    }
    let info={
        titles:tit,
        sala:room,
        usr:username,
        votos:votosUsados
    };
    socket.emit('addPoints',info);

}

clrVotes.onclick = function(){
    socket.emit('clearVotes',room);
    location.reload();
}