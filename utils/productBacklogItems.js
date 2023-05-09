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

function loadEpicsOrderedProductBacklog(connection,sala,callback){
    let room = `SELECT roomID('${sala}') as result;`;
    connection.query(room,function(err,result){
        const id=result[0].result;
        if(err){
            callback(err);
        }else if(id != -1){
            let consulta = `SELECT ID, Titulo, Priorizacion, Estimacion
            FROM pb_epica
            WHERE IDSala = ${id}
            ORDER BY Priorizacion ASC`;
            connection.query(consulta,function(e,result){
                if(e)
                    callback(e);
                else
                    callback(result);
            });
        }
    });
}

function loadEpicsOrderedEProductBacklog(connection,sala,callback){
    let room = `SELECT roomID('${sala}') as result;`;
    connection.query(room,function(err,result){
        const id=result[0].result;
        if(err){
            callback(err);
        }else if(id != -1){
            let consulta = `SELECT ID, Titulo, Priorizacion, Estimacion
            FROM pb_epica
            WHERE IDSala = ${id}
            ORDER BY Estimacion ASC`;
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

function loadFeaturesOrderedProductBacklog(connection,sala,callback){
    let room = `SELECT roomID('${sala}') as result;`;
    connection.query(room,function(err,result){
        const id=result[0].result;
        if(err){
            callback(err);
        }else if(id != -1){
            let consulta = `SELECT ID, Titulo, Priorizacion, Estimacion
            FROM pb_feature
            WHERE IDSala = ${id}
            ORDER BY Priorizacion DESC`;
            connection.query(consulta,function(e,result){
                if(e)
                    callback(e);
                else
                    callback(result);
            });
        }
    });
}
function loadFeaturesEOrderedProductBacklog(connection,sala,callback){
    let room = `SELECT roomID('${sala}') as result;`;
    connection.query(room,function(err,result){
        const id=result[0].result;
        if(err){
            callback(err);
        }else if(id != -1){
            let consulta = `SELECT ID, Titulo, Priorizacion, Estimacion
            FROM pb_feature
            WHERE IDSala = ${id}
            ORDER BY Estimacion ASC`;
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

function loadUSOrderedProductBacklog(connection,sala,callback){
    let room = `SELECT roomID('${sala}') as result;`;
    connection.query(room,function(err,result){
        const id=result[0].result;
        if(err){
            callback(err);
        }else if(id != -1){
            let consulta = `SELECT ID, Titulo, Priorizacion, Estimacion
            FROM pb_user_story
            WHERE IDSala = ${id}
            ORDER BY Priorizacion DESC`;
            connection.query(consulta,function(e,result){
                if(e)
                    callback(e);
                else
                    callback(result);
            });
        }
    });
}

function loadUSOrderedEProductBacklog(connection,sala,callback){
    let room = `SELECT roomID('${sala}') as result;`;
    connection.query(room,function(err,result){
        const id=result[0].result;
        if(err){
            callback(err);
        }else if(id != -1){
            let consulta = `SELECT ID, Titulo, Priorizacion, Estimacion
            FROM pb_user_story
            WHERE IDSala = ${id}
            ORDER BY Estimacion ASC`;
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

function featuresOfEpic(connection, room, epic, callback){
    let sala = `SELECT roomID('${room}') as result;`;
    connection.query(sala,function(err,result){
        const id=result[0].result;
        if(err){
            callback(err);
        }else if(id != -1){
            let query = `SELECT ID, Titulo
                FROM pb_feature
                WHERE IDEpica= ${epic}
                AND IDSala = ${id};`;
            connection.query(query,function(e,r){
                if(e)
                    callback(e);
                else
                    callback(r);
            });
        }    
    });
    
}

function propertiesOfEpic(connection, room, epic, callback){
    let sala = `SELECT roomID('${room}') as result;`;
    connection.query(sala,function(err,result){
        const id=result[0].result;
        if(err){
            callback(err);
        }else if(id != -1){
            let query=`SELECT *
                        FROM pb_epica
                        WHERE IDSala=${id}
                        AND ID=${epic}`;
            connection.query(query,function(e,r){
                if(e){
                    callback (e);
                }else{
                    callback(r);
                }
            });
        }    
    });
}
function propertiesOfFeature(connection, room, feature, callback){
    let sala = `SELECT roomID('${room}') as result;`;
    connection.query(sala,function(err,result){
        const id=result[0].result;
        if(err){
            callback(err);
        }else if(id != -1){
            let query=`SELECT *
                        FROM pb_feature
                        WHERE IDSala=${id}
                        AND ID=${feature}`;
            connection.query(query,function(e,r){
                if(e){
                    callback (e);
                }else{
                    callback(r);
                }
            });
        }    
    });
}
function propertiesOfUS(connection, room, us, callback){
    let sala = `SELECT roomID('${room}') as result;`;
    connection.query(sala,function(err,result){
        const id=result[0].result;
        if(err){
            callback(err);
        }else if(id != -1){
            let query=`SELECT *
                        FROM pb_user_story
                        WHERE IDSala=${id}
                        AND ID=${us}`;
            connection.query(query,function(e,r){
                if(e){
                    callback (e);
                }else{
                    callback(r);
                }
            });
        }    
    });
}

function updateEpic(connection, id, titulo, descripcion, prio, esti, callback){
    let query = `UPDATE pb_epica
    SET Titulo='${titulo}', Descripcion='${descripcion}', Priorizacion=${prio}, Estimacion=${esti}
    WHERE ID=${id};`;
    connection.query(query, function(e,r){
        if(e)
            callback(e);
        else
            callback(0);
    });
}
function updateFeature(connection, id, titulo, descripcion, prio, esti, callback){
    let query = `UPDATE pb_feature
    SET Titulo='${titulo}', Descripcion='${descripcion}', Priorizacion=${prio}, Estimacion=${esti}
    WHERE ID=${id};`;
    connection.query(query, function(e,r){
        if(e)
            callback(e);
        else
            callback(0);
    });
}
function updateUS(connection, id, titulo, descripcion, prio, esti, callback){
    let query = `UPDATE pb_user_story
    SET Titulo='${titulo}', Descripcion='${descripcion}', Priorizacion=${prio}, Estimacion=${esti}
    WHERE ID=${id};`;
    connection.query(query, function(e,r){
        if(e)
            callback(e);
        else
            callback(0);
    });
}

function getEpicByID(connection,id,callback){
    let query = `SELECT Titulo
    FROM pb_epica
    WHERE ID=${id}`;
    connection.query(query, function(e,r){
        if(e)
            callback(1);
        else
            callback(r);
    });
}

function getFeatureByID(connection,id,callback){
    let query = `SELECT Titulo
    FROM pb_feature
    WHERE ID=${id}`;
    connection.query(query, function(e,r){
        if(e)
            callback(1);
        else
            callback(r);
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
    deleteUS,
    featuresOfEpic,
    propertiesOfEpic,
    propertiesOfFeature,
    propertiesOfUS,
    updateEpic,
    updateFeature,
    updateUS,
    loadEpicsOrderedProductBacklog,
    loadFeaturesOrderedProductBacklog,
    loadUSOrderedProductBacklog,
    loadEpicsOrderedEProductBacklog,
    loadFeaturesEOrderedProductBacklog,
    loadUSOrderedEProductBacklog,
    getEpicByID,
    getFeatureByID
}
 