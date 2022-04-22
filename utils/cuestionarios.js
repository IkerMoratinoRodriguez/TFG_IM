function getCuestionario(connection, cuestionario, callback){
    let query = `SELECT pregunta.enunciado as enunciado, opcion.enunciado as opcion
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

module.exports = {
    getCuestionario
}