const socket = io();

const username = document.getElementById('username');
const oldPswd = document.getElementById('old-password');
const newPswd = document.getElementById('new-password');
const newPswdRep = document.getElementById('rep-new-password');
const btnChange = document.getElementById('change-psswd-button');

socket.on('changePswdResult',msg=>{
    alert(msg);
});


btnChange.onclick = function(){
    if(username.value.length == 0 || oldPswd.value.length == 0 || newPswd.value.length == 0 || newPswdRep.value.length == 0){
        alert("NINGÚN CAMPO PUEDE ESTAR VACÍO. ASEGÚRESE DE QUE ESTÁN TODOS RELLENOS");
    }else if(newPswd.value != newPswdRep.value){
        alert("LAS NUEVAS CONTRASEÑAS NO COINCIDEN. ASEGURESE DE QUE SEAN IGUALES");
    }else if(newPswd.value == oldPswd.value){
        alert("LA ANTIGUA CONTRASEÑA Y LA NUEVA NO PUEDEN SER IGUALES");
    }else{
        let data={
            usr:username.value,
            psw:oldPswd.value,
            newpsw:newPswdRep.value
        };
        socket.emit('usrPswdChange',data);
    }
}


