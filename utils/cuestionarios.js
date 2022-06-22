function getCuestionario(connection, cuestionario, callback){
    let query = `SELECT pregunta.enunciado as enunciado, opcion.enunciado as opcion, opcion.ID as id
                 FROM pregunta INNER JOIN opcion on opcion.IDPregunta=pregunta.ID
                 WHERE pregunta.IDCuestionario=${cuestionario};`;
    connection.query(query,function(error,result){
        if(error){
            console.log(error);
            callback(-1);
        }else{
            callback(result);
        }
    });
}

function getNotaUsrCues(connection,idCuestionario, usuario, callback){
    let idUsr= `SELECT userID('${usuario}') as result;`;
    connection.query(idUsr,function(error,result){
        if(error){
            console.log(error);
            callback(-1);
        }else{
            id=result[0].result;
            let query = `SELECT Puntuacion
                         FROM autoevaluacion
                         WHERE IDUsuario=${id}
                         AND IDCuestionario=${idCuestionario};`;
            connection.query(query,function(e,r){
                if(e){
                    console.log(e);
                    callback(-1);
                }
                else if(r[0]){
                    callback(r[0].Puntuacion);
                }else{
                    callback(0);
                }
            });
        }
    })
}

function getTituloCuestionario(connection,idCuestionario,callback){
    let query=`SELECT Titulo
               FROM cuestionario
               WHERE ID=${idCuestionario}`;
    connection.query(query,function(e,r){
        if(e){
            console.log(e);
            callback(-1);
        }else{
            callback(r[0].Titulo);
        }
    })
}

function almacenarNota(connection,usuario,idCuestionario,nota,callback){
    console.log("Nota: "+nota);
    console.log("Cuestionario: "+idCuestionario);
    console.log("Usuario: "+usuario);
    let insertQuery = `SELECT insert_grade('${usuario}',${idCuestionario},${nota}) as result;`;
    connection.query(insertQuery,function(e,r){
        console.log(e);
        console.log(r);
        if(e){
            console.log(e);
            callback(-1);
        }else if(r[0].result==-1){
            callback(-2);
        }else{
            callback(0);
        }
    });
}

function getIdRespuestasCorrectas(connection,idCuestionario,callback){
    let query = `SELECT opcion.ID as ID
                 FROM opcion INNER JOIN pregunta on pregunta.ID = opcion.IDPregunta
                            INNER JOIN cuestionario on cuestionario.ID = pregunta.IDCuestionario
                 WHERE cuestionario.ID=${idCuestionario}
                 AND opcion.Validez=1;`;
    connection.query(query,function(e,r){
        if(e){
            console.log(e);
            callback(-1);
        }
        callback(r);
    });
}

module.exports = {
    getCuestionario,
    getNotaUsrCues,
    getTituloCuestionario,
    almacenarNota,
    getIdRespuestasCorrectas
}