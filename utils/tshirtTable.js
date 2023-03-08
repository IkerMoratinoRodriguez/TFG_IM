function addUserRoomTshirt(connection,room,username,socketID,callback){
    let insertQuery = `SELECT insertTshirtConnection('${username}','${room}','${socketID}') as result;`;
 
    connection.query(insertQuery, function(err, result){
         let info = {
             error:err,
             res:result
         }
         callback(info);
     });
}

function eliminarUsuarioSalaTshirt(connection, socketID, callback){
    let deleteQuery = `DELETE FROM tshirt  WHERE SocketID='${socketID}';`;
    connection.query(deleteQuery, function(err, result){
        callback(err);
    });
}

module.exports={
    addUserRoomTshirt,
    eliminarUsuarioSalaTshirt
}