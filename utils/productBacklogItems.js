function addEpicToProductBacklog(connection,titulo, descripcion, priorizacion, estimacion, sala,callback){
    let room = `SELECT roomID('${sala}') as result;`;

    connection.query(room,function(err,result){
        const id=result[0].result;
        if(err){
            callback(err);
        }else if(id != -1){
            let consulta = `INSERT INTO pb_epica(Titulo, Descripcion, Priorizacion, Estimacion, IDSala) VALUES('${titulo}','${descripcion}',${priorizacion},${estimacion},${id});`;
            connection.query(consulta,function(err,result){
                callback(err);
            });
        }
    });
}

module.exports={
    addEpicToProductBacklog,
}
 

/*
    TAREAS PENDIENTES

    1- Para añadir features y user stories tengo que saber a qué padres (épicas y features) pertenecen. Para ello cuando
    las inserto, tengo que poner su ID en el value de las options. Luego tengo que pasar este ID como parámetro a la función
    js de creación.
    
    2- Cargar inicialmente las épicas, features e historias de usuario que existen en la base de datos
    
    3- Cuando se añade una épica, feature o user storie, hacer que se muestre también en los otros clientes.


*/