function addDaily(connection,titulo,sala,callback){
    let query =`SELECT saveDaily('${titulo}','${sala}') as result;`;
   
    connection.query(query,function(error,result){
        let res = result[0].result;
        callback(res);
    });
}

function loadDailyHistory(connection,sala,callback){
    let room = `SELECT roomID('${sala}') as result;`;

    connection.query(room,function(err,result){
        const id=result[0].result;
        if(err){
            callback(-1);
        }else if(id != -1){
            let select = `SELECT ID,Nombre FROM historial_daily WHERE IDSala=${id};`;
            connection.query(select,function(err,res){
                if(err){
                    console.log(err);
                    callback(-1);
                }else{
                    callback(res);
                }
            });         
        }else{
            callback(-1);
        }
    });  

}

module.exports = {
    addDaily,
    loadDailyHistory
}
