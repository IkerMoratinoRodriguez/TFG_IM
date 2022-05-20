function insertarUsuarioDotVoting(connection, usr, room, socketID, callback){

    let insertQuery = `SELECT insertDotVotingConnection('${usr}','${room}','${socketID}') as result;`;

    connection.query(insertQuery, function(err, result){
        let info = {
            error:err,
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

function insertarVotingMode(connection, sala, votingMode, callback){

    let roomID =`SELECT roomID('${sala}') as result;`;
   
    connection.query(roomID,function(error,result){
        if(!error){
            let countUsers=`SELECT COUNT(*) as numero
            FROM userstorie
            WHERE IDSala='${result[0].result}';`;
            connection.query(countUsers,function(err,number){
                if(!err){
                    let votos;
                    if(votingMode==1){
                        if(number[0].numero>=5)
                            votos=Math.trunc((number[0].numero)/5);
                        else
                            votos=1;
                    }
                    else if(votingMode==2){
                        if(number[0].numero>=2)
                            votos=Math.trunc((number[0].numero)/2);
                        else
                            votos=1;
                    }
                    else if(votingMode==3){
                        if(number[0].numero>=3)
                            votos=Math.trunc((number[0].numero)/3);
                        else
                            votos=1;
                    }  
                    let modifyQuery = `UPDATE dotvoting
                                       SET votos=${votos}
                                       WHERE IDSala=${result[0].result};`;
                    connection.query(modifyQuery,function(e,res){
                        if(e)
                            callback(e);
                    });
                }
                else
                    callback(err);
            });
        }else
            callback(error);
    });
}

function getAvailableVotes(connection, room, user, callback){
    let usuarioID =`SELECT userID('${user}') as result;`;
    connection.query(usuarioID,function(error,usrID){
        if(error)
            callback(-1);
        else{
            let usuario=usrID[0].result;
            let roomID =`SELECT roomID('${room}') as result;`;
            connection.query(roomID,function(err,salaID){
                if(err){
                    console.log(err);
                    callback(-1);
                }
                else{
                    let sala = salaID[0].result;
                    let query = `SELECT Votos as votes
                                 FROM dotvoting
                                 WHERE IDUsuario='${usuario}'
                                 AND IDSala='${sala}';`;
                    connection.query(query,function(e,result){
                        if(e)   
                            callback(-1);
                        else{
                            callback(result[0].votes);
                        }
                    })
                }
                
            });
        }
    });
}

function eliminarPuntosUsuario(connection,usuario,sala,puntos,callback){
    let query = `SELECT eliminarPuntosUsrSala ('${usuario}','${sala}',${puntos})as result;`;
    connection.query(query,function(err,res){
        if(err)
            callback(err);
        else if(res[0].result == '1'){
            callback(res);
        }
    });
}

module.exports={
    insertarUsuarioDotVoting,
    eliminarUsuarioSalaDotVoting,
    insertarVotingMode,
    getAvailableVotes,
    eliminarPuntosUsuario
}