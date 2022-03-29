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

function loadRoomPostits(connection,sala,callback){

    let room = `SELECT roomID('${sala}') as result;`;

    connection.query(room,function(err,result){
        const id=result[0].result;
        if(err){
            console.log(`ERROR OBTENIENDO EL ID DE LA SALA ${sala}`);
            callback(-1);
        }else if(id != -1){
                let query = `SELECT Titulo, Tipo FROM postit_retro WHERE IDSala=${id}`;
                connection.query(query,function(e,r){
                    callback(r);
                });
        }
    });
}

function deletePostit(connection,sala,title,callback){
    let room = `SELECT roomID('${sala}') as result;`;

    connection.query(room,function(err,result){
        const id=result[0].result;
        if(err){
            callback(e);
        }else if(id != -1){
                let query = `DELETE FROM postit_retro
                             WHERE IDSala=${id} AND Titulo='${title}'; `;
                connection.query(query,function(e,r){
                    callback(e);
                });
        }
    });
}

module.exports = {
    addPostitRetro,
    loadRoomPostits,
    deletePostit
};