function addUserRoomDaily(connection,room,username,socketID,callback){
    let insertQuery = `SELECT insertDailyConnection('${username}','${room}','${socketID}') as result;`;
 
    connection.query(insertQuery, function(err, result){
         let info = {
             error:err,
             res:result
         }
         callback(info);
     });
}

function eliminarUsuarioSalaDaily(connection, socketID, callback){
    let deleteQuery = `DELETE FROM daily  WHERE SocketID='${socketID}';`;
    connection.query(deleteQuery, function(err, result){
        callback(err);
    });
}


 module.exports = {
     addUserRoomDaily,
     eliminarUsuarioSalaDaily
 }