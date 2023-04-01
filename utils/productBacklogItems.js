function addEpicToProductBacklog(connection,titulo, descripcion, priorizacion, estimacion, sala,callback){
    let room = `SELECT roomID('${sala}') as result;`;

    connection.query(room,function(err,result){
        const id=result[0].result;
        if(err){
            callback(err);
        }else if(id != -1){
            let consulta = `SELECT insertEpicPBandReturnID('${titulo}','${descripcion}',${priorizacion},${estimacion},${id}) as ID;`;
            connection.query(consulta,function(e,result){
                if(e)
                    callback(e);
                else
                    callback(result[0].ID);
            });
        }
    });
}

function loadEpicsProductBacklog(connection,sala,callback){
    let room = `SELECT roomID('${sala}') as result;`;
    connection.query(room,function(err,result){
        const id=result[0].result;
        if(err){
            callback(err);
        }else if(id != -1){
            let consulta = `SELECT ID, Titulo, Priorizacion, Estimacion
            FROM pb_epica
            WHERE IDSala = ${id}`;
            connection.query(consulta,function(e,result){
                if(e)
                    callback(e);
                else
                    callback(result);
            });
        }
    });
}

function addFeatureToProductBacklog(connection,titulo, descripcion, priorizacion, estimacion, sala, epica, callback){
    let room = `SELECT roomID('${sala}') as result;`;

    connection.query(room,function(err,result){
        const id=result[0].result;
        if(err){
            callback(err);
        }else if(id != -1){
            let consulta = `SELECT insertFeaturePBandReturnID('${titulo}','${descripcion}',${priorizacion},${estimacion},${id},${epica}) as ID;`;
            connection.query(consulta,function(e,result){
                if(e)
                    callback(e);
                else
                    callback(result[0].ID);
            });
        }
    });
}

function loadFeaturesProductBacklog(connection,sala,callback){
    let room = `SELECT roomID('${sala}') as result;`;
    connection.query(room,function(err,result){
        const id=result[0].result;
        if(err){
            callback(err);
        }else if(id != -1){
            let consulta = `SELECT ID, Titulo, Priorizacion, Estimacion
            FROM pb_feature
            WHERE IDSala = ${id}`;
            connection.query(consulta,function(e,result){
                if(e)
                    callback(e);
                else
                    callback(result);
            });
        }
    });
}


function addUSToProductBacklog(connection,titulo, descripcion, priorizacion, estimacion, sala, feature, epica, callback){
    let room = `SELECT roomID('${sala}') as result;`;

    connection.query(room,function(err,result){
        const id=result[0].result;
        if(err){
            callback(err);
        }else if(id != -1){
            let consulta = `SELECT insertUserStoryPBandReturnID('${titulo}','${descripcion}',${priorizacion},${estimacion},${id},${epica},${feature}) as ID;`;
            connection.query(consulta,function(e,result){
                if(e)
                    callback(e);
                else
                    callback(result[0].ID);
            });
        }
    });
}

function loadUSProductBacklog(connection,sala,callback){
    let room = `SELECT roomID('${sala}') as result;`;
    connection.query(room,function(err,result){
        const id=result[0].result;
        if(err){
            callback(err);
        }else if(id != -1){
            let consulta = `SELECT ID, Titulo, Priorizacion, Estimacion
            FROM pb_user_story
            WHERE IDSala = ${id}`;
            connection.query(consulta,function(e,result){
                if(e)
                    callback(e);
                else
                    callback(result);
            });
        }
    });
}


function deleteEpic(connection, id,callback){
    let query = `DELETE FROM pb_epica
                 WHERE ID=${id};`;
    connection.query(query,function(e,r){
        callback(e);
    });
}
function deleteFeature(connection, id,callback){
    let query = `DELETE FROM pb_feature
                 WHERE ID=${id};`;
    connection.query(query,function(e,r){
        callback(e);
    });
}
function deleteUS(connection, id,callback){
    let query = `DELETE FROM pb_user_story
                 WHERE ID=${id};`;
    connection.query(query,function(e,r){
        callback(e);
    });
}


module.exports={
    addEpicToProductBacklog,
    loadEpicsProductBacklog,
    addFeatureToProductBacklog,
    loadFeaturesProductBacklog,
    addUSToProductBacklog,
    loadUSProductBacklog,
    deleteEpic,
    deleteFeature,
    deleteUS
}
 

/*
    TAREAS PENDIENTES

    1- Para añadir features y user stories tengo que saber a qué padres (épicas y features) pertenecen. Para ello cuando
    las inserto, tengo que poner su ID en el value de las options. Luego tengo que pasar este ID como parámetro a la función
    js de creación.
    
    2- Cargar inicialmente las épicas, features e historias de usuario que existen en la base de datos
    
    3- Cuando se añade una épica, feature o user storie, hacer que se muestre también en los otros clientes.


*/