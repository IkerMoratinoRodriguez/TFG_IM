const socket = io();

//Get username and room from url
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix:true
});

socket.emit('joinRoom',{ username, room});

socket.on('message', message =>{
    console.log(message);
});

socket.on('nameRepeated', ()=>{
    alert('NOMBRE DE USUARIO REPETIDO.\nAL ACEPTAR SERÁS REDIRECCIONADO AL FORMULARIO INICIAL');
    redirecc("http://localhost:3000/pokerRoom.html");
})

function redirecc(url) { 
    window.location.href = url;
};