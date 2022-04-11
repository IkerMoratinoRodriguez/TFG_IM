function addPostitDaily(connection,info,callback){
    let sala = info.sala;
    let usr = info.usr;
    let tipo = info.tipo;
    let titulo = info.titulo;
    let query = `SELECT insertPostitDaily('${usr}','${sala}',${tipo},'${titulo}') as result;`;
    connection.query(query,function(err,res){
        if(err){
            callback(err);
        }else if(res[0].result!=0){
            callback(1);
        }else{
            callback(0);
        }
    });
}

function loadRoomPostitsDaily(connection,sala,callback){

    let room = `SELECT roomID('${sala}') as result;`;

    connection.query(room,function(err,result){
        const id=result[0].result;
        if(err){
            console.log(`ERROR OBTENIENDO EL ID DE LA SALA ${sala}`);
            callback(-1);
        }else if(id != -1){
                let query = `SELECT postit_daily.ID as ID, Titulo, Tipo, Usuario.Nombre as Name
                            FROM postit_daily INNER JOIN coloca_postit_daily ON postit_daily.ID=coloca_postit_daily.IDPostitDaily
                                            INNER JOIN usuario ON usuario.ID = coloca_postit_daily.IDUsuario
                            WHERE IDSala = ${id}
                            AND IDDaily IS NULL;`;
                connection.query(query,function(e,r){
                    callback(r);
                });
        }else{
            callback(-1);
        }
    });
}

function deletePostitDaily(connection,id,callback){
    let deleteQuery = `DELETE FROM postit_daily
                      WHERE ID=${id}`;
    connection.query(deleteQuery,function(err,result){
        if(err){
            callback(err);
        }else{
            callback(0);
        }
    });
}

function addPostitToDaily(connection,idDaily,sala,callback){
    let room = `SELECT roomID('${sala}') as result;`;

    connection.query(room,function(err,result){
        const id=result[0].result;
        if(err){
            callback(-1);
        }else if(id != -1){
            let query = `UPDATE postit_daily
                         SET IDDaily = ${idDaily}
                         WHERE ID IN (SELECT IDPostitDaily
                                      FROM coloca_postit_daily
                                      WHERE IDSala=${id})
                         AND IDDaily IS NULL;`;
            connection.query(query,function(e,r){
                if(e){
                    console.log(e);
                    callback(-1);
                }
                else    
                    callback(0);
             });
        }else{
            callback(-1);
        }
    });  
}

function loadDailyPostits(connection,sala,daily,callback){
    let room = `SELECT roomID('${sala}') as result;`;

    connection.query(room,function(err,result){
        const id=result[0].result;
        if(err){
            console.log(`ERROR OBTENIENDO EL ID DE LA SALA ${sala}`);
            callback(-1);
        }else if(id != -1){
                let query = `SELECT Titulo, Tipo, Usuario.Nombre as Name
                            FROM postit_daily INNER JOIN coloca_postit_daily ON postit_daily.ID=coloca_postit_daily.IDPostitDaily
                                            INNER JOIN usuario ON usuario.ID = coloca_postit_daily.IDUsuario
                            WHERE IDSala = ${id}
                            AND IDDaily = ${daily};`;
                connection.query(query,function(e,r){
                    if(e){
                        console.log(e);
                        callback(-1);
                    }else
                        callback(r);
                });
        }else{
            callback(-1);
        }
    });
}



module.exports = {
    loadRoomPostitsDaily,
    addPostitDaily,
    deletePostitDaily,
    addPostitToDaily,
    loadDailyPostits
}