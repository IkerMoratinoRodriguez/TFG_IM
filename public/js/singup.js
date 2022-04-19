const socket = io();

btnPpal = document.getElementById('principal-signup-button');

socket.on('usrAlreadyExists', ()=>{
    alert('EL NOMBRE DE USUARIO YA EXISTE, POR FAVOR, ESCOJA OTRO DIFERENTE.');
    location.reload;
});
socket.on('userCreatedSuccesfully',()=>{
    alert('USUARIO CREADO CORRECTAMENTE');
    location.reload;
});

btnPpal.onclick = function(){
    console.log('Botón click');
    const contra = document.getElementById('new-password').value;
    const contraRep = document.getElementById('rep-new-password').value;
    const usr = document.getElementById('new-username').value;
    if(usr.length==0 || contra.length==0 || contraRep.length == 0){
        alert('UNO DE LOS CAMPOS ESTÁ VACÍO. POR FAVOR, ASEGÚRESE DE QUE TODOS ESTÁN RELLENOS.');
    }else if(contra != contraRep){
        alert('LAS CONTRASEÑAS NO COINCIDEN.');
    }else{
        const info = {
            passwd:contra,
            usuario:usr
        }
        socket.emit('newUsr',info);
        alert('CREANDO NUEVO USUARIO...');
    }
    
}