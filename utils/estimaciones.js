var estimaciones = [];

/*
    AÑADIR UNA ESTIMACIÓN
*/

function estimationJoin(user, room, est){
    newEstimation = {user, room, est};

    let estimacion = estimaciones.filter(est => (est.room === newEstimation.room && est.user === newEstimation.user));

    if(estimacion.length == 0){
        estimaciones.push(newEstimation);
        console.log(`Nueva estimación para el usuario ${newEstimation.user} en la room ${newEstimation.room} con el valor ${newEstimation.est}`);
    }
    else{
        const indice = estimaciones.indexOf(estimacion[0]);
        estimaciones[indice] = newEstimation;
        console.log(`Estimación de ${newEstimation.user} actualizada para la room ${newEstimation.room} con el valor ${newEstimation.est}`);
    }

    console.log(estimaciones);

    return newEstimation;
}


/*
    ELIMINAR ESTIMACIONES DE UNA SALA
*/

function resetEstimation(hab){
    var posi = 0;
    while(posi < estimaciones.length){
        est = estimaciones[posi];
        if(est.room == hab){
            console.log(est);
            estimaciones.splice(posi,1);
        }else
            posi++;       
    }
    console.log(`Estimaciones de la sala ${hab} reseteadas`);
    console.log(estimaciones);

}

function showEstimation(hab){
    let es = estimaciones.filter(est => est.room === hab);
    return es;
}

function deleteUserEstimation(user, room){
    var posi = 0;
    while(posi < estimaciones.length){
        est = estimaciones[posi];
        if(est.room == room && est.user == user){
            console.log(est);
            estimaciones.splice(posi,1);
        }else
            posi++;       
    }
}


module.exports = {
    estimationJoin,
    resetEstimation,
    showEstimation,
    deleteUserEstimation
}