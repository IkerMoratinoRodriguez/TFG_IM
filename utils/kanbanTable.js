function addUserRoomKanban(connection,room,username,socketID,callback){
    let insertQuery = `SELECT insertKanbanConnection('${username}','${room}','${socketID}') as result;`;
 
    connection.query(insertQuery, function(err, result){
         let info = {
             error:err,
             res:result
         }
         callback(info);
     });
}

function eliminarUsuarioSalaKanban(connection, socketID, callback){
    let deleteQuery = `DELETE FROM kanban  WHERE SocketID='${socketID}';`;
    connection.query(deleteQuery, function(err, result){
        callback(err);
    });
}

module.exports={
    addUserRoomKanban,
    eliminarUsuarioSalaKanban
}