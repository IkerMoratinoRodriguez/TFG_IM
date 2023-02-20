function addUserRoomRetroCalif(connection,room,username,socketID,callback){
    let insertQuery = `SELECT insertRetroCalifConnection('${username}','${room}','${socketID}') as result;`;
 
    connection.query(insertQuery, function(err, result){
         let info = {
             error:err,
             res:result
         }
         console.log(result);
         callback(info);
     });
 }

function eliminarUsuarioSalaRetroCalif(connection, socketID, callback){
    let deleteQuery = `DELETE FROM retrospectiva_calif  WHERE SocketID='${socketID}';`;
    connection.query(deleteQuery, function(err, result){
        callback(err);
    });
}

 module.exports={
    addUserRoomRetroCalif,
    eliminarUsuarioSalaRetroCalif
}