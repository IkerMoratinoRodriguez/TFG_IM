var salas = [];

function roomJoin(name, passwd){
    newRoom = {name, passwd};

    let salaRep = salas.filter(ro => ro.name === name);

    if(salaRep.length == 0){
        salas.push(newRoom);
        return true;
    }
    else{
        console.log("Sala ya creada");
        return false;
    } 
}

function verify(sala, contra){
    let salaRep = salas.find(ro => ro.name === sala);
    if(!salaRep)
        return false;
    else
        return (salaRep.passwd == contra);
}

function roomLeave(room){
    let salaRemove = salas.find(ro => ro.name === room);
    console.log(salaRemove);

    if(salaRemove){
        const indice = salas.indexOf(salaRemove);
        salas.splice(indice,1);
    }       

}


module.exports = {
    roomJoin,
    roomLeave,
    verify
};