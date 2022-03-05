function insertarUsuarioPoker(connection, usr, room, socketID, callback){
    let insertQuery = `SELECT insertPokerConnection('${usr}','${room}','${socketID}') as result;`;

    connection.query(insertQuery, function(err, result){
        let info = {
            eror:err,
            res:result
        }
        callback(info);
    });
}

function getRoomUsers(connection, sala, callback){
    let select = `SELECT COUNT(*) as usuarios
    FROM poker INNER JOIN sala ON poker.IDSala=sala.ID
    WHERE sala.Nombre='${sala}';`;
    connection.query(select, function(err, result){
        callback(result);
    });
}

function eliminarUsuarioSala(connection, socketID, callback){
    let deleteQuery = `SELECT deleteUserPokerRoom('${socketID}') as result;`;
    connection.query(deleteQuery, function(err, result){
        callback(result);
    });
}

function estimationJoin(connection, usuario, sala, estimacion, callback){
    let updateQuery = `SELECT insertEstimation('${usuario}','${sala}','${estimacion}')as result;`;
    connection.query(updateQuery,function(err,result){
        callback(result);
    })
}

function resetEstimation(connection, sala, callback){
    let updateQuery = `SELECT resetRoomEstimations('${sala}')as result;`;
    connection.query(updateQuery,function(err,result){
        callback(result);
    })
}

function showEstimation(connection, sala, callback){
    let queryShow = `SELECT showRoomEstimations('${sala}') AS result;`;
    connection.query(queryShow, function(err,result){
        callback(result);
    })
}

function printEsts(connection,sala,callback){
    let query = `SELECT Usuario.nombre, poker.Estimacion
                 FROM usuario INNER JOIN poker ON usuario.ID=poker.IDusuario
                              INNER JOIN sala ON sala.ID=poker.IDSala
                 WHERE sala.Nombre='${sala}';`;
    connection.query(query, function(err,result){
        callback(result);
    })
}

module.exports = {
    insertarUsuarioPoker,
    getRoomUsers,
    eliminarUsuarioSala,
    estimationJoin,
    resetEstimation,
    showEstimation,
    printEsts
}