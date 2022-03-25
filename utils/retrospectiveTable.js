function addUserRoomRetro(connection,room,username,socketID,callback){
   let insertQuery = `SELECT insertRetroConnection('${username}','${room}','${socketID}') as result;`;

   connection.query(insertQuery, function(err, result){
        let info = {
            error:err,
            res:result
        }
        callback(info);
    });
}

function eliminarUsuarioSalaRetro(connection, socketID, callback){
    let deleteQuery = `DELETE FROM retrospectiva  WHERE SocketID='${socketID}';`;
    connection.query(deleteQuery, function(err, result){
        callback(err);
    });
}

module.exports={
    addUserRoomRetro,
    eliminarUsuarioSalaRetro
}