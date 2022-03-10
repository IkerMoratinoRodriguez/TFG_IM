function insertarUsuarioDotVoting(connection, usr, room, socketID, callback){

    let insertQuery = `SELECT insertDotVotingConnection('${usr}','${room}','${socketID}') as result;`;

    connection.query(insertQuery, function(err, result){
        let info = {
            eror:err,
            res:result
        }
        callback(info);
    });
}

function eliminarUsuarioSalaDotVoting(connection, socketID, callback){
    let deleteQuery = `DELETE FROM dotvoting  WHERE SocketID='${socketID}';`;
    connection.query(deleteQuery, function(err, result){
        callback(err);
    });
}

module.exports={
    insertarUsuarioDotVoting,
    eliminarUsuarioSalaDotVoting
}