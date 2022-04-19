const mysql = require('mysql');
const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "test"
});

const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');

//IMPORTS PARA BASE DE DATOS
const {actualizarPuntuacion, aniadirUsuario, aniadirSala, comprobarContraSala, comprobarContraUsr,comprobarEstadoDotVotingRoom, setEstadoDotVotingRoom, getEstadoDotVotingRoom, changeRoomPswd, changeUsrPswd} = require('./utils/database');
const {insertarUsuarioPoker, getRoomUsers, eliminarUsuarioSala, estimationJoin, resetEstimation, showEstimation,printEsts} = require('./utils/pokerTable');
const {insertarUsuarioDotVoting,eliminarUsuarioSalaDotVoting,insertarVotingMode, getAvailableVotes, eliminarPuntosUsuario} = require('./utils/dotVotingTable');
const {insertarUS, userStoriesRoom, deleteUSRoom, addPoints,clearVotesRoom} = require('./utils/userStorie');
const {addUserRoomRetro, eliminarUsuarioSalaRetro} = require('./utils/retrospectiveTable');
const {addPostitRetro, loadRoomPostits, deletePostit, vinculatePostitRetro,getPostitsRoomRetro} = require('./utils/postitRetro');
const {addRetro,listRetro,idRetroRoom} = require('./utils/historialRetro');
const {addUserRoomDaily, eliminarUsuarioSalaDaily} = require('./utils/dailyTable');
const {addPostitDaily,loadRoomPostitsDaily, deletePostitDaily, addPostitToDaily, loadDailyPostits} = require('./utils/postitDaily');
const {addDaily, loadDailyHistory} = require('./utils/historialDaily');

const res = require('express/lib/response');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', socket =>{

    //POKER JOIN ROOM
    socket.on('joinRoom', ({username, room}) => {

        insertarUsuarioPoker(connection,username,room,socket.id,(obj) =>{
             const err = obj.error;
             const result = obj.res;
             if(result[0].result!=0 || err){
                 msg= "CÓDIGO DE ERROR AL INSERTAR UN USUARIO EN LA SALA:"+result[0].result;
                 socket.emit('unexpectedError',msg);
             }else{
                socket.join(room);  
             }
             
        });
        actualizarContadorPoker(room);
     });

    //DOT VOTING JOIN ROOM
    socket.on('dotJoinRoom', ({username, room}) =>{
        console.log(`SERVER: Introduciendo nuevo usuario ${username} en la sala ${room}`);
        insertarUsuarioDotVoting(connection,username,room,socket.id,(obj)=>{
            const err = obj.error;
            const result = obj.res;
            if(err){
                msg=`USUARIO REPETIDO EN LA SALA:${room}`;
                console.log(err);
                socket.emit('unexpectedError1',msg);
            }else if(result[0].result!=0 ){
                msg="NO SE HA ENCONTRADO EL USUARIO EN LA SALA:"+result[0].result;
                socket.emit('unexpectedError',msg);
            }else{
               socket.join(room); 
               userStoriesRoom(connection,room,(res)=>{
                    console.log(res);
                    socket.emit('userStoriesRoomInit',res);
                });
                comprobarEstadoDotVotingRoom(connection,room,(res)=>{
                    let est = res[0].estado;
                    if(est==0){
                        console.log("ESTADO DE LA SALA: MODO EDICIÓN");
                        socket.emit('editMode');
                    }else if(est==1 || est==2 || est==3){
                        console.log("ESTADO DE LA SALA: MODO VOTACIÓN");
                        //ESCRIBO SUS VOTOS DISPONIBLES EN LA BASE DE DATOS OBTENIDOS DEL MODO DE VOTACIÓN DE LA TABLA SALA
                        getEstadoDotVotingRoom(connection,room,(res)=>{
                            if(res==-1){
                                msg="NO SE HA ENCONTRADO EL MODO DE VOTO EN LA SALA:"+room;
                                socket.emit('unexpectedError',msg);
                            }else{
                                insertarVotingMode(connection,room,res,(resp)=>{
                                    if(resp){
                                        msg="ERROR INESPERADO AL INSERTAR VOTING MODE EN LA BASE DE DATOS";
                                        socket.emit('unexpectedError',msg);
                                    }
                                });
                            }
                        });
                        socket.emit('voteMode');
                    }else{
                        msg="ESTADO DE LA SALA INDEFINIDO"
                        console.log(msg);
                        socket.emit('unexpectedError',msg);
                    }
                });
            }
        });
    });

    socket.on('joinRetroRoom',({username,room})=>{
        addUserRoomRetro(connection,room,username,socket.id,(result)=>{
            let codigo = result.res;
            let e = result.error;
            if(e){
                msg=`USUARIO REPETIDO EN LA SALA:${room}`;
                console.log(e);
                socket.emit('unexpectedError1',msg);
            }else if(codigo[0].result!=0){
                msg=`USUARIO REPETIDO EN LA SALA:${room}`;
                console.log(msg);
                socket.emit('unexpectedError1',msg);
            }else{
                socket.join(room);
                //CARGAR POSTITS DE ESA SALA
                loadRoomPostits(connection,room,(res)=>{
                    if(res!=-1){
                        socket.emit('loadPositsJoin',res);
                    }else{
                        msg=`ERROR MOSTRANDO LOS POSITS INICIALES DE LA SALA:${room}`;
                        console.log(msg);
                        socket.emit('unexpectedError',msg);
                    }
                });
            }
        });
    });

    socket.on('dailyJoinRoom',({username, room})=>{
        addUserRoomDaily(connection,room,username,socket.id,(result)=>{
            let codigo = result.res;
            let e = result.error;
            if(e){
                msg=`USUARIO REPETIDO EN LA SALA:${room}`;
                console.log(e);
                socket.emit('unexpectedError1',msg);
            }else if(codigo[0].result!=0){
                msg=`USUARIO REPETIDO EN LA SALA:${room}`;
                console.log(msg);
                socket.emit('unexpectedError1',msg);
            }else{
                socket.join(room);
                //CARGAR LOS POSTITS DE LA SALA QUE NO PERTENECEN A NINGUNA DAILY ALMACENADA
                loadRoomPostitsDaily(connection,room,(res)=>{
                    if(res!=-1){
                        socket.emit('loadPositsJoin',res);
                    }else{
                        msg=`ERROR MOSTRANDO LOS POSITS INICIALES DE LA SALA:${room}`;
                        console.log(msg);
                        socket.emit('unexpectedError',msg);
                    }
                });
            }
        });
    });

    console.log("New WS connection");


    //POKER FUNCTIONALITIES
    socket.on('envioEstimacion',estimacion=>{
        estimationJoin(connection,estimacion.usrName,estimacion.room,estimacion.est,(res)=>{
            if(res[0].result!=0){
                console.log("ERROR INESPERADO AL INSERTAR ESTIMACION. CÓDIGO DE ERROR"+res[0].result);
                msg="ERROR INESPERADO AL INSERTAR ESTIMACION. CÓDIGO DE ERROR"+res[0].result;
                socket.emit('unexpectedError',msg);
            }
        });
        actualizarContadorPoker(estimacion.room);
    });

    socket.on('resetEstimation', sala=>{
        resetEstimation(connection, sala, (res)=>{
            if(res[0].result!=0){
                console.log("ERROR INESPERADO AL RESETEAR ESTIMACIONES DE UNA SALA. CODIGO:"+res[0].result);
                msg="ERROR INESPERADO AL RESETEAR ESTIMACIONES DE UNA SALA";
                socket.emit('unexpectedError',msg);
            }
        });
        socket.broadcast.to(sala).emit('returnReset');
        socket.emit('returnReset');
        actualizarContadorPoker(sala);
    });
    
    socket.on('showEstimation', sala =>{ //DEVOLVER AL CLIENTE UNA LISTA DE USUARIOS Y SUS VOTACIONES (nombre, votacion)
        printEsts(connection, sala ,(res)=>{
            console.log("IMPRIMIENDO ESTIMACIONES...");
            console.log(res);
            socket.broadcast.to(sala).emit('returnShowEstimation',res);
            socket.emit('returnShowEstimation',res);
        });
    });

    //DOT VOTING FUNCTIONALITIES
    socket.on('newUserStorie', ({room,title}) =>{
        console.log("SERVIDOR: HE RECIBIDO LA NUEVA US A INSERTAR");
        insertarUS(connection,title,room,res =>{
            if(res){
                msg="ERROR AL INSERTAR USER STORIE EN UNA SALA DOT VOTING";
                console.log(msg);
                console.log(res);
                socket.emit('unexpectedError',msg);
            }else{ //SI  NO HAY ERRORES
                userStoriesRoom(connection,room,(result)=>{
                    socket.emit('userStoriesRoomInit',result);
                    socket.broadcast.to(room).emit('userStoriesRoomInit',result);
                });
            }
        });
    });
    socket.on('drawPannel',room=>{
        userStoriesRoom(connection,room,(res)=>{
            socket.emit('userStoriesRoomInit',res);
            socket.broadcast.to(room).emit('userStoriesRoomInit',res);
        })
    });
    socket.on('userStoriesFixed',info =>{
        //Escribir en la BD el número de votos
        insertarVotingMode(connection,info.sala,info.votingMode,(res)=>{
            if(res){
                msg="ERROR INESPERADO AL INSERTAR VOTING MODE EN LA BASE DE DATOS";
                socket.emit('unexpectedError',msg);
            }
        });
        setEstadoDotVotingRoom(connection,info.sala,info.votingMode,(res)=>{
            if(res){
                msg = "ERROR AL CAMBIAR EL ESTADO DE LA SALA A MODO VOTACIÓN";
                console.log(msg);
                socket.emit('unexpectedError',msg);
            }
        });
        socket.emit('userStoriesFixedReturn');
        socket.broadcast.to(info.sala).emit('userStoriesFixedReturn');
    });

    socket.on('userStoriesUnlocked',room=>{
        setEstadoDotVotingRoom(connection,room,0,(res)=>{
            if(res){
                msg = "ERROR AL CAMBIAR EL ESTADO DE LA SALA A MODO EDICIÓN";
                console.log(msg);
                socket.emit('unexpectedError',msg);
            }
        });
        socket.emit('userStoriesUnlockedReturn');
        socket.broadcast.to(room).emit('userStoriesUnlockedReturn');
    });

    socket.on('writeList',room=>{
        userStoriesRoom(connection,room,(res)=>{
            socket.emit('writeListReturn',res);
        });
    });

   socket.on('deleteUS',({room, title})=>{
        deleteUSRoom(connection,room,title,(res)=>{
            if(res){
                console.log(res);
                msg =`HA OCURRIDO UN ERROR ELIMINANDO LA USER STORY:${title}.`;
                socket.emit('unexpectedError',msg);
            }else{
                socket.broadcast.to(room).emit('deleteUSReturn');
            }
        });
   });

   socket.on('blockDelete',room=>{
        socket.broadcast.to(room).emit('blockDeleteReturn');
   });

   socket.on('freeDelete',room=>{
        socket.broadcast.to(room).emit('freeDeleteReturn');
   });
    

   socket.on('writeAvailableVotes',({room, username})=>{
        getAvailableVotes(connection,room,username,(votos)=>{
            if(votos==0){
                let msg= `ERROR AL OBTENER LOS VOTOS DISPONIBLES DEL USUARIO ${user}`;
                console.log(msg);
                socket.emit('unexpectedError',msg);
            }else{
                userStoriesRoom(connection,room,(titles)=>{
                    let info={
                        votes:votos,
                        titulos:titles
                    }
                    socket.emit('writeAvailableVotesReturn',info);
                });
            }
        });
   });

   socket.on('addPoints',info=>{
       addPoints(connection,info.titles);
       eliminarPuntosUsuario(connection,info.usr,info.sala,info.votos,(res)=>{
           console.log(`SERVER: ELIMINANDO ${votosUsados} DEL USUARIO${info.usr} EN LA SALA ${info.sala}`);
           if(res){
                console.log("ERROR ELIMINANDO VOTOS DE UN USUARIO:"+res);
                msg =`HA OCURRIDO UN ERROR ELIMINANDO VOTOS DE UN USUARIO EN UNA SALA`;
                socket.emit('unexpectedError',msg);
            }
       });
       userStoriesRoom(connection,info.sala,(result)=>{
        socket.emit('userStoriesRoomInit',result);
        socket.broadcast.to(info.sala).emit('userStoriesRoomInit',result);
    });
   });

   socket.on('clearVotes',room =>{
        clearVotesRoom(connection,room,(e)=>{
            if(e){
                console.log("ERROR EN CLEAR VOTES:"+res);
                msg =`HA OCURRIDO UN ERROR LIMPIANDO LAS VOTACIONES DE LAS USER STORIES`;
                socket.emit('unexpectedError',msg);
            }
        });
        socket.broadcast.to(room).emit('clearVotesReturn');
   });

   //DE LA RETROSPECTIVA
   socket.on('createPostit',info=>{
       let tit=info.title;
       let tipo=info.type;
       let room=info.sala;
       console.log(`INSERTANDO POSTIT EN LA BD DE RETRO: TITULO:${tit}, TIPO:${tipo}, SALA:${room}`);
       //ALMACENAR EN LA BD
       addPostitRetro(connection,room,tit,tipo,(res)=>{
           if(res){
                console.log("ERROR ALMACENANDO POSTIT EN BD:"+res);
                msg =`HA OCURRIDO UN ERROR ALMACENANDO EL POSTIT EN LA BASE DE DATOS`;
                socket.emit('unexpectedError',msg);
           }
       });
       socket.broadcast.to(room).emit('createPostitReturn',{tit,tipo});
   });
    socket.on('showListPosits',room=>{
        loadRoomPostits(connection,room,(res)=>{
            if(res!=-1){
                socket.emit('showListPositsReturn',res);
            }else{
                msg=`ERROR MOSTRANDO LOS POSITS DE LA SALA:${room}`;
                console.log(msg);
                socket.emit('unexpectedError',msg);
            }
        });
    });

    socket.on('titlesToDelete',({titlesDelete, room})=>{
        console.log(titlesDelete);
        for(i=0;i<titlesDelete.length;i++){
            //BORRO
            deletePostit(connection,room,titlesDelete[i],(e)=>{
                if(e){
                    msg=`ERROR ELIMINANDO EL POSIT ${titlesDelete[i]} DE LA SALA:${room}`;
                    console.log(msg);
                    console.log(e);
                    socket.emit('unexpectedError',msg);
                }
            });
            //MANDAR RESULTANTES A REPERESENTAR A TODOS
            loadRoomPostits(connection,room,(res)=>{
                if(res!=-1){
                    socket.emit('showListPositsReturn',res);
                    socket.emit('loadPositsJoin',res);
                    socket.broadcast.to(room).emit('loadPositsJoin',res);
                }else{
                    msg=`ERROR MOSTRANDO LOS POSITS INICIALES DE LA SALA:${room}`;
                    console.log(msg);
                    socket.emit('unexpectedError',msg);
                }
            });
        }
        //ACTUALIZAR LISTA DEL QUE BORRA
    });

    socket.on('blockOptions',room=>{
        socket.broadcast.to(room).emit('blockOptionsReturn');
    });

    socket.on('allowOptions',room=>{
        socket.broadcast.to(room).emit('allowOptionsReturn');
    });

    socket.on('saveRetro',({titulo,room})=>{
        addRetro(connection,titulo,room,(r)=>{
            if(r>0){
                console.log("TODO HA IDO CORRECTO AL AÑADIR UNA NUEVA RETRO Y DEVOLVER SU ID");
                socket.emit('saveRetro2',{room,r});
            }   
            else{
                msg=`ERROR INESPERADO AL INSERTAR RETRO ${titulo} EN LA SALA ${room} Y OBTENER SU ID, `;
                if(r==-1)
                    msg +="DEBIDO A QUE YA EXISTÍA EL TÍTULO PARA ESA SALA";
                else
                    msg+="DEBIDO A QUE NO SE HA ENCONTRADO LA SALA";
                console.log(msg);
                socket.emit('unexpectedError',msg);
            }
        });
    });

    socket.on('saveRetro2Server',({room,r})=>{
        console.log("SAVE RETRO 2 SERVER RECEIVED");
        vinculatePostitRetro(connection,room,r,(error)=>{
            if(error.length>0){
                console.log(error);
                msg=`ERROR INESPERADO AL INSERTAR EL ID DE LA RETROSPECTIVA EN LOS POSITS DE LA MISMA`;
                console.log(msg);
                socket.emit('unexpectedError',msg);
            }else{
                console.log("TODO HA IDO CORRECTAMENTE, RETROSPECTIVA GUARDADA CON ÉXITO");
                socket.emit('retroSavedReturn');
                socket.broadcast.to(room).emit('retroSavedReturn');
            }
        });
    })

    socket.on('loadRetroHistoryList',room=>{
        listRetro(connection,room,(res)=>{
            socket.emit('loadRetroHistoryListReturn',res);
        })
    });

    socket.on('loadRetroInPopup',({room,tituloRetroLoad})=>{
        idRetroRoom(connection,room,tituloRetroLoad,(res)=>{
            if(res!=-1){
                console.log("ID DE LA RETROSPECTIVA A RECUPERAR"+res);
                //TODOS LOS POSTITS DE LA SALA Y DE LA RETRO CON ID RES
                getPostitsRoomRetro(connection,room,res,(titulos)=>{
                    if(titulos!=-1){
                        socket.emit('loadRetroInPopupReturn',titulos);
                    }else{
                        msg=`ERROR OBTENIENDO LOS TITULOS DE LA RETROSPECTIVA ${tituloRetroLoad} EN LA SALA ${room}`;
                        console.log(msg);
                        socket.emit('unexpectedError',msg);
                    }
                });
            }else{
                msg=`ERROR OBTENIENDO EL ID DE LA RETROSPECTIVA CON TÍTULO ${tituloRetroLoad} EN LA SALA ${room}`;
                console.log(msg);
                socket.emit('unexpectedError',msg);
            }

        })
    });

    //DE LA DAILY MEETING
    socket.on('newDailyPostit',info=>{
        addPostitDaily(connection,info,(res)=>{
            if(res!=0){
                console.log(res);
                msg="ERROR INESPERADO AL INSERTAR POSTIT CON USUARIO EN LA SALA";
                console.log(msg);
                socket.emit('unexpectedError',msg);
            }else{
                socket.broadcast.to(info.sala).emit('newDailyPostitReturn',info);
            }
        });
        
    });
    socket.on('fillDeletePool',sala =>{
        loadRoomPostitsDaily(connection,sala,(res)=>{
            if(res!=-1){
                socket.emit('fillDeletePoolReturn',res);
            }else{
                msg=`ERROR MOSTRANDO LOS POSITS INICIALES DE LA SALA:${room}`;
                console.log(msg);
                socket.emit('unexpectedError',msg);
            }
        });
    });

    socket.on('deletePostitDaily',({id,room})=>{
        deletePostitDaily(connection,id,(err)=>{
            if(err!=0){
                msg=`ERROR ELIMINANDO POSTIT DE LA SALA`;
                console.log(msg);
                socket.emit('unexpectedError',msg);
            }else{
                console.log("CARGANDO POSTITS...");
                loadRoomPostitsDaily(connection,room,(res)=>{
                    if(res!=-1){
                        socket.emit('fillDeletePoolReturn',res);
                        socket.emit('loadPositsJoin',res);
                        socket.broadcast.to(room).emit('loadPositsJoin',res);
                    }else{
                        msg=`ERROR MOSTRANDO LOS POSITS INICIALES DE LA SALA:${room}`;
                        console.log(msg);
                        socket.emit('unexpectedError',msg);
                    }
                });
            }
        })
    });

    socket.on('lockOptionsDaily',room=>{
        socket.broadcast.to(room).emit('lockOptionsDailyReturn');
    });

    socket.on('unlockOptionsDaily',room=>{
        socket.broadcast.to(room).emit('unlockOptionsDailyReturn');
    });

    socket.on('saveDaily',({room,nombre})=>{
        addDaily(connection,nombre,room,(res)=>{
            if(res==-1 || res==-2){
                msg=`ERROR AL REGISTRAR LA NUEVA RETROSPECTIVA EN LA BASE DE DATOS`;
                console.log(msg);
                socket.emit('unexpectedError',msg);
            }else{
                addPostitToDaily(connection,res,room,(resul)=>{
                    if(resul==-1){
                        msg=`ERROR AL ASOCIAR POSTITS A LA RETROSPECTIVA AÑADIDA ANTERIORMENTE`;
                        console.log(msg);
                        socket.emit('unexpectedError',msg);
                    }else{
                        socket.emit('dailySavedSuccesfuly');
                        socket.broadcast.to(room).emit('dailySavedSuccesfuly');
                    }
                });
            }
        });
    });

    socket.on('loadDailyHistory',room=>{
        loadDailyHistory(connection,room,(res)=>{
            if(res!=-1){
                socket.emit('loadDailyHistoryReturn',res)
            }else{
                msg=`ERROR AL RECUPERAR LAS DAILY MEETINGS DE LA SALA`;
                console.log(msg);
                socket.emit('unexpectedError',msg);
            }
        })
    });

    socket.on('loadDailyPostits',({room,idDailyLoad})=>{
        loadDailyPostits(connection,room,idDailyLoad,(res)=>{
            if(res!=-1){
                socket.emit('loadDailyPostitsReturn',res);
            }else{
                msg=`ERROR AL RECUPERAR LOS POSTITS DE LA DAILY MEETING SELECCIONADA`;
                console.log(msg);
                socket.emit('unexpectedError',msg); 
            }
        });
    })

    //DE LA PANTALLA DE ENTRADA A SALA

    socket.on('verifyRoom', infoSala=>{
        comprobarContraSala(connection,infoSala,(res)=>{
            let msg="";
            if(res != 0){
                if(res==-1){
                    msg="ERROR INESPERADO AL VERIFICAR LAS CREDENCIALES DE LA SALA";
                }else if(res == 1){
                    msg="CONTRASEÑA DE SALA INVÁLIDA";
                }else if(res == 2){
                    msg="NO SE HA ENCONTRADO LA SALA";
                }
                console.log(msg);
                socket.emit('verificationResult',msg);
            }
        });
    });

    socket.on('verifyUser', infoUsr =>{
        comprobarContraUsr(connection, infoUsr, (res) =>{
            let msg="";
            if(res!=0){
                if(res==-1){
                    msg="ERROR INESPERADO AL VERIFICAR LAS CREDENCIALES DEL USUARIO";
                }else if(res == 1){
                    msg="CONTRASEÑA DE USUARIO INVÁLIDA";
                }else if(res == 2){
                    msg="NO SE HA ENCONTRADO AL USUARIO";
                }
                console.log(msg);
                socket.emit('verificationResult',msg);
            }
        });
    });


    //DEL SIGNUP

    socket.on('newRoom', infoSala=>{
        aniadirSala(connection,infoSala,(result)=>{
            if(result){
                console.log(result);
                socket.emit('roomAlreadyExists');
            }
        });
    });

    socket.on('newUsr',info =>{
        console.log(info);
        aniadirUsuario(connection,info, (result) =>{
            if(result){
                console.log(result);
                socket.emit('usrAlreadyExists');
            }
            else
                socket.emit('userCreatedSuccesfully');
        });
    })

    //USR PASSWORD CHANGE
    socket.on('usrPswdChange',data=>{
        changeUsrPswd(connection,data.usr,data.psw,data.newpsw,(res)=>{
            let msg="";
            switch(res){
                case -1:{
                    msg="ERROR INESPERADO AL CAMBIAR LA CONTRASEÑA DEL USUARIO";
                    break;
                }case 0:{
                    msg="CONTRASEÑA CAMBIADA CORRECTAMENTE";
                    break;
                }case 1:{
                    msg="USUARIO NO ENCONTRADO EN LA BASE DE DATOS";
                    break;
                }case 2:{
                    msg="LA CONTRASEÑA ANTIGUA NO COINCIDE";
                    break;
                }
            }
            console.log(msg);
            socket.emit('changePswdResult',msg);
        });
    });

    //ROOM PASSWORD CHANGE
    socket.on('roomPswdChange',data=>{
        changeRoomPswd(connection,data.room,data.psw,data.newpsw,(res)=>{
            let msg="";
            switch(res){
                case -1:{
                    msg="ERROR INESPERADO AL CAMBIAR LA CONTRASEÑA DE LA SALA";
                    break;
                }case 0:{
                    msg="CONTRASEÑA CAMBIADA CORRECTAMENTE";
                    break;
                }case 1:{
                    msg="SALA NO ENCONTRADO EN LA BASE DE DATOS";
                    break;
                }case 2:{
                    msg="LA CONTRASEÑA ANTIGUA NO COINCIDE";
                    break;
                }
            }
            console.log(msg);
            socket.emit('changeRoomPswdResult',msg);
        });
    });


    socket.on('disconnect', () => {
            
        //SI EL SOCKET COINCIDE CON LA SALA DE POKER, EL USUARIO SE SALDRÁ DEL POKER
        eliminarUsuarioSala(connection,socket.id,(result) =>{
            if(result[0].result.length != 0){
                console.log(`UN USUARIO HA SALIDO DE LA SALA DE POKER`);
                sala = result[0].result;
                actualizarContadorPoker(sala);
            }
        });
        //SI EL SOCKET COINCIDE CON LA SALA DE DOT VOTING, EL USUARIO SE SALDRÁ DEL DOT VOTING
        eliminarUsuarioSalaDotVoting(connection,socket.id,(err)=>{
            if(err){
                msg="ERROR INESPERADO AL ELIMINAR USUARIO DE LA SALA DE DOT VOTING";
                console.log(msg);
                console.log(err);
                socket.emit('unexpectedError',msg);
            }
        });

        eliminarUsuarioSalaRetro(connection,socket.id,(err)=>{
            if(err){
                msg="ERROR INESPERADO AL ELIMINAR USUARIO DE LA SALA DE RETROSPECTIVA";
                console.log(msg);
                console.log(err);
                socket.emit('unexpectedError',msg);
            }
        });

        eliminarUsuarioSalaDaily(connection,socket.id,(err)=>{
            if(err){
                msg="ERROR INESPERADO AL ELIMINAR USUARIO DE LA SALA DE DAILY MEETING";
                console.log(msg);
                console.log(err);
                socket.emit('unexpectedError',msg);
            }
        })

    });

    //DEL CUESTIONARIO
    socket.on('ins', (puntuacion) =>{
        actualizarPuntuacion(connection,puntuacion);
    });

    //PARA ACTUALIZAR CONTADOR POKER
    function actualizarContadorPoker(sala){
        showEstimation(connection,sala,(res)=>{
            if(res[0].result==-1){
                console.log(res[0].result);
                msg="ERROR INESPERADO AL MOSTRAR EL NÚMERO DE ESTIMACIONES DE UNA SALA";
                socket.emit('unexpectedError',msg);
            }else{
                let ests = res[0].result;
                getRoomUsers(connection,sala,(result) =>{
                    let usuarios = result[0].usuarios;
                    console.log("Número de usuarios de la sala:"+usuarios);
                    socket.broadcast.to(sala).emit('actualizarContador',{ests, usuarios});
                    socket.emit('actualizarContador',{ests, usuarios});
                });
            }
        });
        
    }
});

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

