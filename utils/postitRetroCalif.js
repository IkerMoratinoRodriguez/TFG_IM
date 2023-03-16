function addPostitRetroCalif(connection,sala,titulo,tipo,callback){
    let room = `SELECT roomID('${sala}') as result;`;

    connection.query(room,function(err,result){
        const id=result[0].result;
        if(err){
            callback(err);
        }else if(id != -1){
            let consulta = `INSERT INTO postit_retro_calif(Titulo, IDSala, Tipo) VALUES('${titulo}',${id},${tipo});`;
            connection.query(consulta,function(err,result){
                callback(err);
            });
        }
    });
}

function loadRoomPostitsRetroCalif(connection,sala,callback){

    let room = `SELECT roomID('${sala}') as result;`;

    connection.query(room,function(err,result){
        const id=result[0].result;
        if(err){
            console.log(`ERROR OBTENIENDO EL ID DE LA SALA ${sala}`);
            callback(-1);
        }else if(id != -1){
                let query = `SELECT ID, Titulo, Tipo FROM postit_retro_calif WHERE IDSala=${id} AND IDRetro IS NULL`;
                connection.query(query,function(e,r){
                    callback(r);
                });
        }
    });
}

function deletePostitRetroCalif(connection,sala,title,callback){
    let room = `SELECT roomID('${sala}') as result;`;

    connection.query(room,function(err,result){
        const id=result[0].result;
        if(err){
            callback(e);
        }else if(id != -1){
                let query = `DELETE FROM postit_retro_calif
                             WHERE IDSala=${id} AND ID='${title}' AND IDRetro IS NULL; `;
                connection.query(query,function(e,r){
                    callback(e);
                });
        }
    });
}

function vinculatePostitRetroCalif(connection,sala,retro,callback){
    let room = `SELECT ID FROM sala WHERE Nombre='${sala}'`;
    connection.query(room,function(e,res){
        let idSala=res[0].ID;
        if(!e){
            if(idSala>0){
                let update = `UPDATE postit_retro_calif SET IDRetro=${retro} WHERE IDRetro IS NULL AND IDSala=${idSala}; `;
                connection.query(update,function(error,resultado){
                    if(error){
                        callback(error);
                    }else{
                        console.log("AÑADIDO CORRECTAMENTE");
                        callback("");
                    }
                });
            }else{
                callback("SALA NO ENCONTRADAD");
            }
        }else{
            callback(e);
        }
        
    }); 
}

function getPostitsRoomRetroCalif(connection,room,retro,callback){
    let queryRoom = `SELECT ID FROM sala WHERE Nombre='${room}'`;
    connection.query(queryRoom,function(e,result){
        if(!e){
            let query = `SELECT Titulo, Tipo FROM postit_retro_calif WHERE IDSala=${result[0].ID} AND IDRetro=${retro}`;
            connection.query(query,function(error,resultado){
                if(!error){
                    callback(resultado);
                }else{
                    console.log(error);
                    callback(-1);
                }
            })
        }else{
            console.log(e);
            callback(-1);
        }
    });
}


module.exports = {
    addPostitRetroCalif,
    loadRoomPostitsRetroCalif,
    deletePostitRetroCalif,
    vinculatePostitRetroCalif,
    getPostitsRoomRetroCalif
}