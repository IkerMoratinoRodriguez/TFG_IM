function addRetro(connection,titulo,sala,callback){
    let query =`SELECT saveRetro('${titulo}','${sala}') as result;`;
   
    connection.query(query,function(error,result){
        let res = result[0].result;
        if(res!=-1 && res!=-2)
            callback(res);
        else
            callback(res);
    });
}

function listRetro(connection,sala,callback){
    let room = `SELECT roomID('${sala}') as result;`;
    connection.query(room,function(e,res){
        let idRoom=res[0].result;
        if(e){
            callback(e);
        }else if(idRoom != -1){
            let updateQuery = `SELECT Nombre FROM historial_retro WHERE IDSala=${idRoom}`;
            connection.query(updateQuery,function(error, result){
                if(error)
                    console.log(error);
                else{
                    callback(result);
                }
            })
        }
    });
}

function idRetroRoom(connection, sala, title, callback){
    let queryRoom = `SELECT ID FROM sala WHERE Nombre='${sala}'`;
    connection.query(queryRoom,function(e,result){
        if(!e){
            let query = `SELECT ID FROM historial_retro WHERE IDSala=${result[0].ID} AND Nombre='${title}'`;
            connection.query(query,function(error,resultado){
                if(!error)
                    if(resultado)
                        callback(resultado[0].ID);
                    else
                        callback(-1);
                else {
                    console.log(error);
                    callback(-1);
                }
            });
        }else{
            console.log(e);
            callback(-1);
        }
    });
}

module.exports={
    addRetro,
    listRetro,
    idRetroRoom
}