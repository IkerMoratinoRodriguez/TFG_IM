const res = require("express/lib/response");

function insertarUS(connection, titulo, sala,callback){
    let insertQuery = `SELECT insertUserStory('${titulo}','${sala}') as result;`;

    connection.query(insertQuery, function(err, result){
        callback(err);
    });
}


function userStoriesRoom(connection,room,callback){
    let query = `SELECT roomID('${room}') as result;`;

    connection.query(query,function(err,result){
        const id=result[0].result;
        if(err){
            callback(err);
        }else if(id != -1){
            let consulta = `SELECT Titulo, Votos FROM userstory WHERE IDSala='${id}'`;
            connection.query(consulta,function(err,result){
                if(err){
                    console.log(err);
                    callback(-1);
                }else
                    callback(result);
            });
        }
    });
}

function deleteUSRoom(connection, room, title, callback){

    let query = `SELECT roomID('${room}') as result;`;

    connection.query(query,function(err,result){
        const id=result[0].result;
        if(err){
            callback(err);
        }else if(id != -1){
            let deleteQuery = `DELETE FROM userstory
                               WHERE IDSala=${id} AND Titulo='${title}';`;
            connection.query(deleteQuery,function(err,result){
                callback(err);
            });
        }
    });
}

function addPoints(connection,titles,callback){
    for(i=0;i<titles.length;i++){
        if(titles[i]!='-'){
            let query = `UPDATE userstory
                     SET Votos=Votos+1
                     WHERE Titulo='${titles[i]}';`;
            connection.query(query, function(err,res){
                if(err){
                    console.log(err);
                    callback(-1);
                }    
            });
        }
    }
}

function clearVotesRoom(connection,room,callback){

    let salaQuery = `SELECT roomID('${room}') as result;`;
    connection.query(salaQuery, function(err,res){
        if(err)
            callback(err);
        else{
            const id_room=res[0].result;
            let query = `UPDATE userstory
                         SET Votos = 0
                         WHERE IDSala=${id_room};`;
            connection.query(query,function(e,r){
                if(e)
                    callback(e);
            });
        }
    });

    
}

module.exports ={
    insertarUS,
    userStoriesRoom,
    deleteUSRoom,
    addPoints,
    clearVotesRoom
}