function loadUserStories(connection, sala, callback){
    let room = `SELECT roomID('${sala}') as result;`;
    connection.query(room,function(err,result){
        const id=result[0].result;
        if(err){
            callback(err);
        }else if(id != -1){
            let consulta = `SELECT ID, Titulo, Priorizacion, Estimacion
            FROM pb_user_story
            WHERE IDSala = ${id}
            AND EstadoKanban=0`;
            connection.query(consulta,function(e,result){
                if(e)
                    callback(e);
                else
                    callback(result);
            });
        }
    });
}

function changeUSKanbanState(connection,id,estado,callback){
    
    let consulta = `UPDATE pb_user_story
    SET EstadoKanban = ${estado}
    WHERE ID=${id};`;

    connection.query(consulta,function(e,result){
        if(e)
            callback(e);
        else
            callback(0);
        
    });
}

function actualizarKanban(connection,sala,callback){
    
    let room = `SELECT roomID('${sala}') as result;`;
    connection.query(room,function(err,result){
        const id=result[0].result;
        if(err){
            callback(err);
        }else if(id != -1){
            let consulta = `SELECT Titulo, Priorizacion, Estimacion, EstadoKanban 
            FROM bdastools.pb_user_story 
            WHERE EstadoKanban!=0
            AND IDSala = ${id};`;
            connection.query(consulta,function(e,result){
                if(e)
                    callback(e);
                else
                    callback(result);
            });
        }
    });
    
}

function loadUserStoriesMove(connection, sala, callback){
    let room = `SELECT roomID('${sala}') as result;`;
    connection.query(room,function(err,result){
        const id=result[0].result;
        if(err){
            callback(err);
        }else if(id != -1){
            let consulta = `SELECT ID, Titulo, Priorizacion, Estimacion
            FROM pb_user_story
            WHERE IDSala = ${id}
            AND EstadoKanban=1`;
            connection.query(consulta,function(e,result){
                if(e)
                    callback(e);
                else
                    callback(result);
            });
        }
    });
}


function loadUserStoriesMoveDoingDone(connection, sala, callback){
    let room = `SELECT roomID('${sala}') as result;`;
    connection.query(room,function(err,result){
        const id=result[0].result;
        if(err){
            callback(err);
        }else if(id != -1){
            let consulta = `SELECT ID, Titulo, Priorizacion, Estimacion
            FROM pb_user_story
            WHERE IDSala = ${id}
            AND EstadoKanban=2`;
            connection.query(consulta,function(e,result){
                if(e)
                    callback(e);
                else
                    callback(result);
            });
        }
    });
}



function deleteFromkanban(connection,id,callback){
    let consulta = `UPDATE pb_user_story
    SET EstadoKanban = 0
    WHERE ID=${id};`;

    connection.query(consulta,function(e,result){
        if(e)
            callback(e);
        else
            callback(0);
        
    });
}

function listUSToDeleteKN(connection,sala,callback){
    let room = `SELECT roomID('${sala}') as result;`;
    connection.query(room,function(err,result){
        const id=result[0].result;
        if(err){
            callback(err);
        }else if(id != -1){
            let consulta = `SELECT ID, Titulo, Priorizacion, Estimacion 
            FROM bdastools.pb_user_story 
            WHERE EstadoKanban=3
            AND IDSala = ${id};`;
            connection.query(consulta,function(e,result){
                if(e)
                    callback(e);
                else
                    callback(result);
            });
        }
    });
}

function loadWip(connection,sala,callback){
    let room = `SELECT roomID('${sala}') as result;`;
    connection.query(room,function(err,result){
        const id=result[0].result;
        if(err){
            callback(err);
        }else if(id != -1){
            let consulta = `SELECT WIP 
            FROM sala
            WHERE ID = ${id};`;
            connection.query(consulta,function(e,result){
                if(e)
                    callback(e);
                else
                    callback(result);
            });
        }
    });
}

function loadUsedWip(connection,sala,callback){
    let room = `SELECT roomID('${sala}') as result;`;
    connection.query(room,function(err,result){
        const id=result[0].result;
        if(err){
            callback(err);
        }else if(id != -1){
            let consulta = `SELECT COUNT(*) as Total
            FROM pb_user_story
            WHERE EstadoKanban=2
            AND IDSala = ${id};`;
            connection.query(consulta,function(e,re){
                if(e)
                    callback(e);
                else
                    callback(re);
            });
        }
    });
}

function updateWip(connection,sala,newWip,callback){
    let room = `SELECT roomID('${sala}') as result;`;
    connection.query(room,function(err,result){
        const id=result[0].result;
        if(err){
            callback(err);
        }else if(id != -1){
            let consulta = `UPDATE sala
            SET WIP=${newWip}
            WHERE ID=${id}`;
            connection.query(consulta,function(e,re){
                if(e)
                    callback(e);
                else
                    callback(0);
            });
        }
    });
}




module.exports={
    loadUserStories,
    changeUSKanbanState,
    actualizarKanban,
    loadUserStoriesMove,
    loadUserStoriesMoveDoingDone,
    deleteFromkanban,
    listUSToDeleteKN,
    loadWip,
    loadUsedWip,
    updateWip
}