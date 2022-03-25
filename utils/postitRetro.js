function addPostitRetro(connection,sala,titulo,tipo,callback){
    let room = `SELECT roomID('${sala}') as result;`;

    connection.query(room,function(err,result){
        const id=result[0].result;
        if(err){
            callback(err);
        }else if(id != -1){
            let consulta = `INSERT INTO postit_retro(Titulo, IDSala, Tipo) VALUES('${titulo}',${id},${tipo});`;
            connection.query(consulta,function(err,result){
                callback(err);
            });
        }
    });
}

module.exports = {
    addPostitRetro
};