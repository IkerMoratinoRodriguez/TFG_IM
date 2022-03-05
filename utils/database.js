const mysql = require('mysql');

function actualizarPuntuacion(connection, puntuacion){
    let insertQuery=`UPDATE Usuario SET Cuestionario=${puntuacion} WHERE Nombre='Iker'`;
    let query = mysql.format(insertQuery,[puntuacion]);

    connection.query(insertQuery, function(err, result){
        if(err)
            throw err;
    });
}

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
        const obj ={
            error:err,
            res:result
        } 
        callback(obj);
    })

}

function comprobarContraUsr(connection, info, callback){
    const usuario = info.nombre;
    const psw = info.pssw;

    let tryPasswd =`SELECT try_passwd('${psw}','${usuario}',0) as result;`;

    connection.query(tryPasswd, function(err,result){
        const obj ={
            error:err,
            res:result
        } 
        callback(obj);
    })

}

module.exports={
    actualizarPuntuacion,
    aniadirUsuario,
    aniadirSala,
    comprobarContraSala,
    comprobarContraUsr
}
