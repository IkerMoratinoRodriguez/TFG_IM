function addUserRoomMoscow(connection,room,username,socketID,callback){
    let insertQuery = `SELECT insertMoscowConnection('${username}','${room}','${socketID}') as result;`;
 
    connection.query(insertQuery, function(err, result){
         let info = {
             error:err,
             res:result
         }
         callback(info);
     });
}

function eliminarUsuarioSalaMoscow(connection, socketID, callback){
    let deleteQuery = `DELETE FROM moscow  WHERE SocketID='${socketID}';`;
    connection.query(deleteQuery, function(err, result){
        callback(err);
    });
}

module.exports={
    addUserRoomMoscow,
    eliminarUsuarioSalaMoscow
}