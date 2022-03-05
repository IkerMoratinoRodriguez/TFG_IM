const socket = io();

btnPpal = document.getElementById('principal-signup-button');

btnPpal.onclick = function(){
    console.log('Botón click');
    const contra = document.getElementById('new-password').value;
    const usr = document.getElementById('new-username').value;
    if(usr.length==0 || contra.length==0){
        alert('Nombre de usuario o contraseña vacío. Por favor, complete todos los campos');
        window.location.href = "http://localhost:3000/signup.html";
    }else{
        const info = {
            passwd:contra,
            usuario:usr
        }
        console.log(info);
        socket.emit('newUsr',info);
        alert('CREANDO NUEVO USUARIO...');
        socket.on('usrAlreadyExists', ()=>{
            alert('EL NOMBRE DE USUARIO YA EXISTE, POR FAVOR, ESCOJA OTRO DIFERENTE.');
            window.location.href = "http://localhost:3000/signup.html";
        });
    }
    
}