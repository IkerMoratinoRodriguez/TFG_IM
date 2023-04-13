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


module.exports={
    loadUserStories,
    changeUSKanbanState,
    actualizarKanban
}