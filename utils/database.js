function aniadirSala(connection, info, callback){
    const sala = info.sala;
    const psw = info.pssw;

    let insertQuery =`INSERT INTO Sala(Nombre,Password) VALUES ('${sala}',SHA('${psw}'));`;
    connection.query(insertQuery, function(err, result){
        callback(err);
    });
}

function aniadirUsuario(connection, info, callback){
    const usr = info.usuario;
    const psw = info.passwd;

    let insertQuery =`INSERT INTO Usuario(Nombre,Password) VALUES ('${usr}',SHA('${psw}'));`;
    connection.query(insertQuery, function(err, result){
        callback(err);
    });
}

function comprobarContraSala(connection, info, callback){
    const sala = info.sala;
    const psw = info.pssw;

    let tryPasswd =`SELECT try_passwd('${psw}','${sala}',1) as result;`;

    connection.query(tryPasswd, function(err,result){
        if(err){
            console.log(err);
            callback(-1);
        }else{
            callback(result[0].result);
        }
    });

}

function comprobarContraUsr(connection, info, callback){
    const usuario = info.nombre;
    const psw = info.pssw;

    let tryPasswd =`SELECT try_passwd('${psw}','${usuario}',0) as result;`;

    connection.query(tryPasswd, function(err,result){
        if(err){
            console.log(err);
            callback(-1);
        }else{
            callback(result[0].result);
        }
    });

}

function comprobarEstadoDotVotingRoom(connection,room,callback){
    let query = `SELECT EstadoDotVoting as estado FROM sala WHERE Nombre='${room}'; `;

    connection.query(query,function(err,result){
        callback(result);
    })
}

function setEstadoDotVotingRoom(connection,room,est,callback){
    let query = `UPDATE sala SET EstadoDotVoting=${est} WHERE Nombre='${room}'; `;

    connection.query(query,function(err,result){
        callback(err);
    });
}

function getEstadoDotVotingRoom(connection,room,callback){
    let query = `SELECT EstadoDotVoting as state FROM sala WHERE nombre='${room}'; `;

    connection.query(query,function(err,result){
        if(err)
            callback(-1);
        else
            callback(result[0].state);
    });
}

function changeUsrPswd(connection,usr,oldPswd,newPswd,callback){
    let query = `SELECT usrPasswdChange('${usr}','${oldPswd}','${newPswd}') as result;`;
    connection.query(query,function(err,result){
        if(err){
            console.log(err);
            callback(-1);
        }else
            callback(result[0].result);
    });
}

function changeRoomPswd(connection,room,oldPswd,newPswd,callback){
    let query = `SELECT roomPasswdChange('${room}','${oldPswd}','${newPswd}') as result;`;
    connection.query(query,function(err,result){
        if(err){
            console.log(err);
            callback(-1);
        }else
            callback(result[0].result);
    });
}

module.exports={
    aniadirUsuario,
    aniadirSala,
    comprobarContraSala,
    comprobarContraUsr,
    comprobarEstadoDotVotingRoom,
    setEstadoDotVotingRoom,
    getEstadoDotVotingRoom,
    changeRoomPswd,
    changeUsrPswd
}
