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

//CARGAS LAS ÉPICAS CUANDO SE ACCEDE A LA SALA

module.exports={
    addEpicToProductBacklog,
    loadEpicsProductBacklog,
    addFeatureToProductBacklog
}
 

/*
    TAREAS PENDIENTES

    1- Para añadir features y user stories tengo que saber a qué padres (épicas y features) pertenecen. Para ello cuando
    las inserto, tengo que poner su ID en el value de las options. Luego tengo que pasar este ID como parámetro a la función
    js de creación.
    
    2- Cargar inicialmente las épicas, features e historias de usuario que existen en la base de datos
    
    3- Cuando se añade una épica, feature o user storie, hacer que se muestre también en los otros clientes.


*/