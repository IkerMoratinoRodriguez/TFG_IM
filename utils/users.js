var users = []

/*
    AÑADIR UN USUARIO
*/

function userJoin(id, username, room) {
    const user = {id, username, room };

    let usuariosSala = users.filter(user => user.room === room);

    let usuariosMismoNombre = usuariosSala.filter(user => user.username === username)

    if(usuariosMismoNombre.length == 0){
        users.push(user);
        return user;
    }  
    else{
        var nombre = usuariosMismoNombre[0].username;
        var sala = usuariosMismoNombre[0].room;
        console.log(`Usuario ${nombre} es inválido, ya se ha introducido para la sala ${sala}`);
        return -1;
    }
        
    
}

/*
   OBTENER UN USUARIO
*/

function getCurrentUser(username, room) {
    let resul=users.filter(user => (user.username === username && user.room === room));
    if(resul.length!=0)
        return resul[0];
    else
        return -1;
}

/*
   ELIMINAR A UN USUARIO
*/

function userLeave(id) {
    const index = users.findIndex(user => user.id === id);
  
    if (index !== -1) {
      return users.splice(index, 1)[0];
    }
  }
/*
    USUARIOS DE UNA SALA
*/
function getRoomUsers(room) {
    return users.filter(user => user.room === room);
  }


module.exports = {
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers
};
  

