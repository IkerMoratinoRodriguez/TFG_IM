
function insertarUS(connection, callback){
    let insertQuery = `INSERT INTO userstorie(titulo, IDSala)
                       VALUES ('USER STORIE X v2',1); `;

    connection.query(insertQuery, function(err, result){
        let info = {
            eror:err,
            res:result
        }
        console.log("USER STORIE INSERTADA");
        callback(err);
    });
}

module.exports ={
    insertarUS
}