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

function getusedWipByStates(connection,sala,callback){
    let room = `SELECT roomID('${sala}') as result;`;
    connection.query(room,function(err,result){
        const id=result[0].result;
        if(err){
            callback(err);
        }else if(id != -1){
            let consulta = `SELECT COUNT(*) as Total
            FROM pb_user_story
            WHERE EstadoKanban=2
            AND IDSala=${id};`;
            connection.query(consulta,function(e,r){
                if(e)
                    callback(e);
                else
                    callback(r[0].Total);
            });
        }
    });
}


function getWip(connection,sala,callback){
    let room = `SELECT roomID('${sala}') as result;`;
    connection.query(room,function(err,result){
        const id=result[0].result;
        if(err){
            callback(err);
        }else if(id != -1){
            let consulta = `SELECT WIP, usedWIP FROM bdastools.sala WHERE ID=${id}`;
            connection.query(consulta,function(e,result){
                if(e)
                    callback(e);
                else
                    callback(result);
            });
        }
    });
}

function updateWip(connection,newWip,sala,callback){
    let room = `SELECT roomID('${sala}') as result;`;
    connection.query(room,function(err,result){
        const id=result[0].result;
        if(err){
            callback(err);
        }else if(id != -1){
            let consulta = `UPDATE sala
            SET WIP=${newWip}
            WHERE ID=${id};`;
            connection.query(consulta,function(e,result){
                if(e)
                    callback(e);
                else
                    callback(0);
            });
        }
    });
}

function updateWipUsado(connection,sala,wipUsado,callback){
    let room = `SELECT roomID('${sala}') as result;`;
    connection.query(room,function(err,result){
        const id=result[0].result;
        if(err){
            callback(err);
        }else if(id != -1){
            let consulta = `UPDATE sala
            SET UsedWIP=${wipUsado}
            WHERE ID=${id};`;
            connection.query(consulta,function(e,result){
                if(e)
                    callback(e);
                else
                    callback(0);
            });
        }
    });
}

function deleteFromkanban(connection,id,callback){
    let consulta = `UPDATE pb_user_story
    SET EstadoKanban = 4
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




module.exports={
    loadUserStories,
    changeUSKanbanState,
    actualizarKanban,
    loadUserStoriesMove,
    loadUserStoriesMoveDoingDone,
    getWip,
    updateWip,
    updateWipUsado,
    getusedWipByStates,
    deleteFromkanban,
    listUSToDeleteKN
}