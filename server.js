const PORT = 3000 || process.env.PORT;
const path = require('path');
const http = require('http');
const express = require('express');
const app = express();
const server = http.createServer(app);

const socketio = require('socket.io');
const io = socketio(server);

app.use(express.static(path.join(__dirname, 'public')));

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

//MYSQL
const mysql = require('mysql');
require("dotenv").config();
const connection = mysql.createConnection({
    host: process.env.dbhost,
    port: process.env.port,
    user: process.env.dbuser,
    password: process.env.dbpassword,
    database: process.env.dbdatabase
});

//IMPORTS PARA BASE DE DATOS
const {aniadirUsuario, aniadirSala, comprobarContraSala, comprobarContraUsr,comprobarEstadoDotVotingRoom, setEstadoDotVotingRoom, getEstadoDotVotingRoom, changeRoomPswd, changeUsrPswd} = require('./utils/database');
const {insertarUsuarioPoker, getRoomUsers, eliminarUsuarioSala, estimationJoin, resetEstimation, showEstimation,printEsts} = require('./utils/pokerTable');
const {insertarUsuarioDotVoting,eliminarUsuarioSalaDotVoting,insertarVotingMode, getAvailableVotes, eliminarPuntosUsuario} = require('./utils/dotVotingTable');
const {insertarUS, userStoriesRoom, deleteUSRoom, addPoints,clearVotesRoom} = require('./utils/userStorie');
const {addUserRoomRetro, eliminarUsuarioSalaRetro} = require('./utils/retrospectiveTable');
const {addPostitRetro, loadRoomPostits, deletePostit, vinculatePostitRetro,getPostitsRoomRetro} = require('./utils/postitRetro');
const {addRetro,listRetro,idRetroRoom} = require('./utils/historialRetro');
const {addUserRoomDaily, eliminarUsuarioSalaDaily} = require('./utils/dailyTable');
const {addPostitDaily,loadRoomPostitsDaily, deletePostitDaily, addPostitToDaily, loadDailyPostits} = require('./utils/postitDaily');
const {addDaily, loadDailyHistory} = require('./utils/historialDaily');
const {getCuestionario, getNotaUsrCues, getTituloCuestionario, almacenarNota, getIdRespuestasCorrectas} = require('./utils/cuestionarios');
// NUEVA FUNCIONALIDAD TFG 22-23
    //RETROSPECTIVA CON CALIFICACIÓN
const {addUserRoomRetroCalif,eliminarUsuarioSalaRetroCalif} = require('./utils/retrospectiveCalifTable');
const {addPostitRetroCalif, loadRoomPostitsRetroCalif,deletePostitRetroCalif,vinculatePostitRetroCalif, getPostitsRoomRetroCalif} = require('./utils/postitRetroCalif.js');
const {addRetroCalif, listRetroCalif, idRetroRoomCalif} = require('./utils/historialRetroCalif');
    //T-SHIRT
const{addUserRoomTshirt,eliminarUsuarioSalaTshirt} = require('./utils/tshirtTable');
const{addPostitTshirt, loadRoomPostitsTshirt, deletePostitTshirt} = require('./utils/postitTshirt');
    //MOSCOW
const{addUserRoomMoscow,eliminarUsuarioSalaMoscow} = require('./utils/moscowTable');
const{addPostitMoscow, loadRoomPostitsMoscow, deletePostitMoscow} = require('./utils/postitMoscow');
    //PRODUCT BACKLOG
const {addUserRoomProductBacklog, eliminarUsuarioSalaProductBacklog} = require('./utils/productBacklogTable');
const {addEpicToProductBacklog, loadEpicsProductBacklog, addFeatureToProductBacklog,loadFeaturesProductBacklog, addUSToProductBacklog, loadUSProductBacklog, deleteEpic, deleteFeature, deleteUS,featuresOfEpic, propertiesOfEpic, propertiesOfFeature, propertiesOfUS, updateEpic, updateFeature, updateUS, loadEpicsOrderedProductBacklog, loadFeaturesOrderedProductBacklog,loadUSOrderedProductBacklog, loadEpicsOrderedEProductBacklog, loadFeaturesEOrderedProductBacklog, loadUSOrderedEProductBacklog, getEpicByID, getFeatureByID} = require('./utils/productBacklogItems');
    //KANBAN
const {addUserRoomKanban, eliminarUsuarioSalaKanban} = require('./utils/kanbanTable');
const {loadUserStories,loadEpics,loadFeatures,loadFeaturesTitle,loadEpicsTitle,changeUSKanbanState, changeEpicKanbanState, changeFeatureKanbanState, actualizarKanban, loadUserStoriesMove, loadUserStoriesMoveDoingDone, deleteFromkanban, listUSToDeleteKN, loadWip,loadUsedWip, updateWip} = require('./utils/kanbanUtilities');

io.on('connection', socket =>{

    //POKER JOIN ROOM
    socket.on('joinRoom', ({username, room}) => {

        insertarUsuarioPoker(connection,username,room,socket.id,(obj) =>{
             const err = obj.error;
             const result = obj.res;
             if(err){
                msg=`USUARIO REPETIDO EN LA SALA DE POKER:${room}`;
                console.log(err);
                socket.emit('unexpectedError1',msg);
            }else if(result[0].result!=0 ){
                msg="NO SE HA ENCONTRADO EL USUARIO EN LA SALA:"+result[0].result;
                socket.emit('unexpectedError1',msg);
             }else{
                socket.join(room); 
                actualizarContadorPoker(room); 
             }
             
        });
     });

    //DOT VOTING JOIN ROOM
    socket.on('dotJoinRoom', ({username, room}) =>{
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
                        socket.emit('editMode');
                    }else if(est==1 || est==2 || est==3){
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
                msg=`ERROR SQL AÑADIENDO USUARIO A LA SALA:${room}`;
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
    socket.on('joinRetroCalifRoom',({username, room})=>{
        addUserRoomRetroCalif(connection,room,username,socket.id,(result)=>{
            let codigo = result.res;
            let e = result.error;
            if(e){
                msg=`USUARIO REPETIDO EN LA SALA:${room} DE RETROSPECTIVA CON CALIFICACIÓN`;
                console.log(e);
                socket.emit('unexpectedError1',msg);
            }else if(codigo[0].result!=0){
                msg=`USUARIO REPETIDO EN LA SALA:${room} DE RETROSPECTIVA CON CALIFICACIÓN`;
                console.log(msg);
                socket.emit('unexpectedError1',msg);
            }else{
                socket.join(room);
                //CARGAR POSTITS DE ESA SALA
                loadRoomPostitsRetroCalif(connection,room,(res)=>{
                    if(res!=-1){
                        socket.emit('loadPositsRetroCalifJoin',res);
                    }else{
                        msg=`ERROR MOSTRANDO LOS POSITS INICIALES DE LA SALA:${room}`;
                        console.log(msg);
                        socket.emit('unexpectedError',msg);
                    }
                });
            }
        });
    });

    socket.on('joinTshirtRoom',({username, room})=>{
        addUserRoomTshirt(connection,room,username,socket.id,(result)=>{
            let codigo = result.res;
            let e = result.error;
            if(e){
                msg=`USUARIO REPETIDO EN LA SALA:${room} DE T-SHIRT`;
                console.log(e);
                socket.emit('unexpectedError1',msg);
            }else if(codigo[0].result!=0){
                msg=`USUARIO REPETIDO EN LA SALA:${room} DE T-SHIRT`;
                console.log(msg);
                socket.emit('unexpectedError1',msg);
            }else{
                socket.join(room);
                // CARGAR POSTITS DE ESA SALA
                loadRoomPostitsTshirt(connection,room,(res)=>{
                    if(res!=-1){
                        socket.emit('loadPositsTshirtJoin',res);
                    }else{
                        msg=`ERROR MOSTRANDO LOS POSITS INICIALES DE LA SALA:${room}`;
                        console.log(msg);
                        socket.emit('unexpectedError',msg);
                    }
                });
            }
        });
    });

    socket.on('joinMoSCoWRoom',({username, room})=>{
        addUserRoomMoscow(connection,room,username,socket.id,(result)=>{
            let codigo = result.res;
            let e = result.error;
            if(e){
                msg=`USUARIO REPETIDO EN LA SALA:${room} DE MOSCOW`;
                console.log(e);
                socket.emit('unexpectedError1',msg);
            }else if(codigo[0].result!=0){
                msg=`USUARIO REPETIDO EN LA SALA:${room} DE MOSCOW`;
                console.log(msg);
                socket.emit('unexpectedError1',msg);
            }else{
                socket.join(room);
                // CARGAR POSTITS DE ESA SALA
                loadRoomPostitsMoscow(connection,room,(res)=>{
                    if(res!=-1){
                        socket.emit('loadPositsMoscowJoin',res);
                    }else{
                        msg=`ERROR MOSTRANDO LOS POSITS INICIALES DE LA SALA:${room}`;
                        console.log(msg);
                        socket.emit('unexpectedError',msg);
                    }
                });
            }
        });
    });

    socket.on('productBacklogJoinRoom',({username, room})=>{
        addUserRoomProductBacklog(connection,room,username,socket.id,(result)=>{
            let codigo = result.res;
            let e = result.error;
            if(e){
                msg=`ERROR SQL AÑADIENDO USUARIO A LA SALA:${room}`;
                console.log(e);
                socket.emit('unexpectedError1',msg);
            }else if(codigo[0].result!=0){
                msg=`USUARIO REPETIDO EN LA SALA:${room}`;
                console.log(msg);
                socket.emit('unexpectedError1',msg);
            }else{
                socket.join(room);
                //CARGAR LOS ÍTEMS DEL PRODUCT BACKLOG DE LA SALA
                loadEpicsProductBacklog(connection,room,(res)=>{
                    if(res.length != 0){
                        if(res[0].ID) //Compruebo por ejemplo el primer ID (si no hay es que ha saltado un error)
                            socket.emit('loadEpicsPB',res);
                        else{
                            msg=`ERROR CARGANDO LAS ÉPICAS DEL PRODUCT BACKLOG:${room}`;
                            console.log(msg);
                            socket.emit('unexpectedError',msg);
                        }
                    }
                    
                });
                loadFeaturesProductBacklog(connection,room,(res)=>{
                    if(res.length != 0){
                        if(res[0].ID) //Compruebo por ejemplo el primer ID (si no hay es que ha saltado un error)
                            socket.emit('loadFeaturesPB',res);
                        else{
                            msg=`ERROR CARGANDO LAS ÉPICAS DEL PRODUCT BACKLOG:${room}`;
                            console.log(msg);
                            socket.emit('unexpectedError',msg);
                        }
                    }
                    
                });
                loadUSProductBacklog(connection,room,(res)=>{
                    console.log(res);
                    if(res.length != 0){ //hay algo
                        if(res[0].ID) //Compruebo por ejemplo el primer ID (si no hay es que ha saltado un error)
                            socket.emit('loadUSsPB',res);
                        else{
                            msg=`ERROR CARGANDO LAS ÉPICAS DEL PRODUCT BACKLOG:${room}`;
                            console.log(msg);
                            socket.emit('unexpectedError',msg);
                        }
                    }
                    
                });
            }
        });
    });

    socket.on('kanbanJoinRoom',({username, room})=>{
        addUserRoomKanban(connection,room,username,socket.id,(result)=>{
            let codigo = result.res;
            let e = result.error;
            if(e){
                msg=`USUARIO REPETIDO EN LA SALA:${room} DE KANBAN`;
                console.log(e);
                socket.emit('unexpectedError1',msg);
            }else if(codigo[0].result!=0){
                msg=`USUARIO REPETIDO EN LA SALA:${room} DE KANBAN`;
                console.log(msg);
                socket.emit('unexpectedError1',msg);
            }else{
                socket.join(room);
                socket.emit('addToDoKanbanReturn');
            }
        });
        loadWip(connection,room,(res)=>{
            if(res.length>0){
                if(res[0].WIP != null){
                    socket.emit('loadWipReturn',res[0].WIP);
                }else{
                    msg=`NO SE HA DEFINIDO WIP PARA LA SALA`;
                    console.log(msg);
                    socket.emit('unexpectedError',msg);
                }
            }else{
                msg=`NO EXISTE LA SALA`;
                console.log(msg);
                socket.emit('unexpectedError',msg);
            }
        });
        loadUsedWip(connection,room,(res)=>{
            console.log(res[0].Total);
            if(res[0].Total>=0){
                socket.emit('loadWipUsadoReturn',res[0].Total);
            }else{
                console.log(res);
                msg=`HA OCURRIDO UN ERROR OBTENIENDO EL WIP USADO DE LA SALA`;
                console.log(msg);
                socket.emit('unexpectedError',msg);
            }
        });
    });

    //POKER FUNCTIONALITIES
    socket.on('envioEstimacion',estimacion=>{
        estimationJoin(connection,estimacion.usrName,estimacion.room,estimacion.est,(res)=>{
            if(res==-1){
                msg="ERROR INESPERADO AL MOSTRAR LAS ESTIMACIONES DE LA SALA";
                socket.emit('unexpectedError',msg);
            }else if(res[0].result!=0){
                msg="ERROR INESPERADO AL INSERTAR ESTIMACION. CÓDIGO DE ERROR"+res[0].result;
                socket.emit('unexpectedError',msg);
            }else{
                actualizarContadorPoker(estimacion.room);
            }
        });
    });

    socket.on('resetEstimation', sala=>{
        resetEstimation(connection, sala, (res)=>{
            if(res == -1){
                msg="ERROR INESPERADO AL RESETEAR ESTIMACIONES DE UNA SALA DEBIDO A UN ERROR SQL";
                socket.emit('unexpectedError',msg);
            }else if(res[0].result!=0){
                msg="ERROR INESPERADO AL RESETEAR ESTIMACIONES DE UNA SALA";
                socket.emit('unexpectedError',msg);
            }else{
                socket.broadcast.to(sala).emit('returnReset');
                socket.emit('returnReset');
                actualizarContadorPoker(sala);
            }
        });
    });
    
    socket.on('showEstimation', sala =>{ //DEVOLVER AL CLIENTE UNA LISTA DE USUARIOS Y SUS VOTACIONES (nombre, votacion)
        printEsts(connection, sala ,(res)=>{
            if(res == -1){
                msg = "HA OCURRIDO UN ERROR OBTENIENDO LAS ESTIMACIONES DE LOS USUARIOS LA SALA POKER";
                socket.emit('unexpectedError',msg);
            }else{
                socket.broadcast.to(sala).emit('returnShowEstimation',res);
                socket.emit('returnShowEstimation',res);
            }
        });
    });

    function actualizarContadorPoker(sala){
        showEstimation(connection,sala,(res)=>{
            if(res==-1){
                msg="ERROR INESPERADO MOSTRANDO NÚMERO DE ESTIMACIONES DE UNA SALA";
                socket.emit('unexpectedError',msg);
            }else if(res[0].result==-1){
                msg="ERROR INESPERADO AL MOSTRAR EL NÚMERO DE ESTIMACIONES DE UNA SALA, YA QUE NO SE ENCUENTRA LA SALA";
                socket.emit('unexpectedError',msg);
            }else{
                let ests = res[0].result;
                getRoomUsers(connection,sala,(result) =>{
                    if(result==-1){
                        msg="ERROR AL OBTENER EL NÚMERO DE USUARIOS DE LA SALA PARA EL CONTADOR";
                        socket.emit('unexpectedError',msg);
                    }else{
                        let usuarios = result[0].usuarios;
                        socket.broadcast.to(sala).emit('actualizarContador',{ests, usuarios});
                        socket.emit('actualizarContador',{ests, usuarios});
                    }    
                });

            }
        });
        
    }

    //DOT VOTING FUNCTIONALITIES
    socket.on('newUserStorie', ({room,title}) =>{
        insertarUS(connection,title,room,res =>{
            if(res){
                msg="ERROR AL INSERTAR USER STORY EN UNA SALA DOT VOTING";
                console.log(msg);
                console.log(res);
                socket.emit('unexpectedError',msg);
            }else{ //SI  NO HAY ERRORES
                userStoriesRoom(connection,room,(result)=>{
                    if(result==-1){
                        msg="ERROR AL OBTENER LAS USER STORIES Y LOS VOTOS DE USA SALA. ERROR SQL.";
                        console.log(msg);
                        socket.emit('unexpectedError',msg);
                    }else{
                        socket.emit('userStoriesRoomInit',result);
                        socket.broadcast.to(room).emit('userStoriesRoomInit',result);
                    }
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
            if(res==-1){
                msg = "ERROR AL OBTENER LAS USER STORIES DE LA SALA.ERROR SQL.";
                console.log(msg);
                socket.emit('unexpectedError',msg);
            }else{
                socket.emit('writeListReturn',res);
            }
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
            if(votos==-1){
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
       addPoints(connection,info.titles,(res)=>{
           if(res==-1){
               msg="ERROR ALMACENANDO LOS PUNTOS DE LAS USER STORIES EN LA BASE DE DATOS. ERROR SQL.";
               console.log(msg);
               socket.emit('unexpectedError',msg);
           }
       });
       eliminarPuntosUsuario(connection,info.usr,info.sala,info.votos,(res)=>{
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
        aniadirUsuario(connection,info, (result) =>{
            if(result){
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
            if(result == -1){
                msg="ERROR ELIMINANDO USUARIO DE SALA DE POKER GAME. ERROR SQL.";
                socket.emit('unexpectedError',msg);
            }
            if(result[0].result.length != 0){
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
                msg="ERROR INESPERADO AL ELIMINAR USUARIO DE LA SALA DE RETROSPECTIVA DE BARCO DE VELA";
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

        eliminarUsuarioSalaRetroCalif(connection,socket.id,(err)=>{
            if(err){
                msg="ERROR INESPERADO AL ELIMINAR USUARIO DE LA SALA DE RETROSPECTIVA CON CALIFICACIÓN";
                console.log(msg);
                console.log(err);
                socket.emit('unexpectedError',msg);
            }
        });

        eliminarUsuarioSalaTshirt(connection,socket.id,(err)=>{
            if(err){
                msg="ERROR INESPERADO AL ELIMINAR USUARIO DE LA SALA DE T-SHIRT";
                console.log(msg);
                console.log(err);
                socket.emit('unexpectedError',msg);
            }
        });

        eliminarUsuarioSalaMoscow(connection,socket.id,(err)=>{
            if(err){
                msg="ERROR INESPERADO AL ELIMINAR USUARIO DE LA SALA DE MOSCOW";
                console.log(msg);
                console.log(err);
                socket.emit('unexpectedError',msg);
            }
        });
        
        eliminarUsuarioSalaProductBacklog(connection,socket.id,(err)=>{
            if(err){
                msg="ERROR INESPERADO AL ELIMINAR USUARIO DE LA SALA DE PRODUCT BACKLOG";
                console.log(msg);
                console.log(err);
                socket.emit('unexpectedError',msg);
            }
        });

        eliminarUsuarioSalaKanban(connection,socket.id,(err)=>{
            if(err){
                msg="ERROR INESPERADO AL ELIMINAR USUARIO DE LA SALA DE KANBAN";
                console.log(msg);
                console.log(err);
                socket.emit('unexpectedError',msg);
            }
        });
    });
    
    //DEL CUESTIONARIO
    socket.on('verifyUserTest',info=>{
        comprobarContraUsr(connection,info,(res)=>{
            if(res==-1){
                msg="ERROR INESPERADO COMPROBANDO LAS CREDENCIALES DEL USUARIO. ERROR EN LA BASE DE DATOS";
                console.log(msg);
                socket.emit('unexpectedError',msg);
            }else if(res != 0){
                msg="CREDENCIALES INVÁLIDAS";
                console.log(msg);
                socket.emit('unexpectedError',msg);
            }else{
                socket.emit('verifyUserTestTrue');
            }
        })
    });

    socket.on('getPreguntasCuestionario',idCuestionario=>{
        getCuestionario(connection,idCuestionario,(res)=>{
            if(res==-1){
                msg = "ERROR AL OBTENER CUESTIONARIO. ERROR SQL."
                console.log(msg);
                socket.emit('unexpectedError',msg);
            }else{
                socket.emit('getPreguntasCuestionarioReturn',res);
            }
        });
    });

    socket.on('getNota',infoNota=>{
        getNotaUsrCues(connection,infoNota.idC,infoNota.usr,(res)=>{
            if(res==-1){
                msg = "HA OCURRIDO UN ERROR AL OBTENER LA NOTA DEL USUARIO EN ESTE CUESTIONARIO. ERROR SQL.";
                console.log(msg);
                socket.emit('unexpectedError',msg);
            }else if(res==0){
                socket.emit('cuestionarioSinNota');
            }else{
                socket.emit('getNotaReturn',res);
            }
        });
    });

    socket.on('getTituloCuestionario',idCuestionario=>{
        getTituloCuestionario(connection,idCuestionario,(res)=>{
            if(res==-1){
                msg = "HA OCURRIDO UN ERROR AL OBTENER EL TÍTULO DE ESTE CUESTIONARIO. ERROR SQL.";
                console.log(msg);
                socket.emit('unexpectedError',msg);
            }else{
                socket.emit('getTituloCuestionarioReturn',res);
            }
        });
    });

    socket.on('getRespuestasCorrectas',idCuestionario=>{
        getIdRespuestasCorrectas(connection,idCuestionario,(res)=>{
            if(res==-1){
                msg = "HA OCURRIDO UN ERROR AL OBTENER LAS RESPUESTAS CORRECTAS DEL CUESTIONARIO DEL SERVIDOR. ERROR SQL.";
                console.log(msg);
                socket.emit('unexpectedError',msg);
            }else{
                socket.emit('getRespuestasCorrectasReturn',res);
            }
        });
    });

    socket.on('nuevaNota',info=>{
        almacenarNota(connection,info.usr,info.q,info.n,(res)=>{
            if(res==-1){
                msg = "HA OCURRIDO UN ERROR AL ALMACENAR LA NUEVA CALIFICACIÓN EN ESTE CUESTIONARIO. ERROR SQL.";
                console.log(msg);
                socket.emit('unexpectedError',msg);
            }else{
                socket.emit('nuevaNotaReturn',info.n);
            }
        })
    });

    /*
    *
    *
    * 
        NUEVAS FUNCIONALIDADES
    *
    *
    * 
    */

    /*
     RETROSPECTIVA CON CALIFICACIÓN
     */
    socket.on('createPostitCalifRetro', info =>{
        sala = info.sala;
        addPostitRetroCalif(connection,info.sala, info.title, info.type, (err)=>{
            if(err){
                console.log("ERROR ALMACENANDO POSTIT EN BD:"+res);
                msg =`HA OCURRIDO UN ERROR ALMACENANDO EL POSTIT EN LA BASE DE DATOS`;
                socket.emit('unexpectedError',msg);
            }
        });
        let tit = info.title;
        let tip = info.type;
        socket.broadcast.to(sala).emit('createPostitRetroCalifReturn',{tit,tip});
    });

    socket.on('showListPostitsRetroCalif',room=>{
        loadRoomPostitsRetroCalif(connection,room,(res)=>{
            if(res!=-1){
                socket.emit('showListPositsRetroCalifReturn',res);
            }else{
                msg=`ERROR MOSTRANDO LOS POSITS DE LA SALA:${room}`;
                console.log(msg);
                socket.emit('unexpectedError',msg);
            }
        });
    });

    socket.on('titlesToDeleteRetroCalif',({titlesDelete,room})=>{
        for(i=0;i<titlesDelete.length;i++){
            //BORRO
            deletePostitRetroCalif(connection,room,titlesDelete[i],(e)=>{
                if(e){
                    msg=`ERROR ELIMINANDO EL POSIT ${titlesDelete[i]} DE LA SALA:${room}`;
                    console.log(msg);
                    console.log(e);
                    socket.emit('unexpectedError',msg);
                }
            });
            //MANDAR RESULTANTES A REPERESENTAR A TODOS
            loadRoomPostitsRetroCalif(connection,room,(res)=>{
                if(res!=-1){
                    socket.emit('showListPositsRetroCalifReturn',res);
                    socket.emit('loadPositsRetroCalifJoin',res);
                    socket.broadcast.to(room).emit('loadPositsRetroCalifJoin',res);
                }else{
                    msg=`ERROR MOSTRANDO LOS POSITS DE LA SALA:${room}`;
                    console.log(msg);
                    socket.emit('unexpectedError',msg);
                }
            });
        }
    });

    socket.on('blockOptionsRetroCalif',room=>{
        socket.broadcast.to(room).emit('blockOptionsRetroCalifReturn');
    });

    socket.on('allowOptionsRetroCalif',room=>{
        socket.broadcast.to(room).emit('allowOptionsRetroCalifReturn');
    });

    socket.on('saveRetroCalif',({titulo,room,puntuacionGlobal})=>{ //CREAR LA RETROSPECTIVA
        var today = new Date();
        var day = today.getDate();
        var month = today.getMonth() + 1;
        var year = today.getFullYear();
        fecha=`${day}/${month}/${year}`
        addRetroCalif(connection,titulo,room,puntuacionGlobal,fecha,(r)=>{
            if(r>0){
                console.log("TODO HA IDO CORRECTO AL AÑADIR UNA NUEVA RETRO Y DEVOLVER SU ID");
                socket.emit('saveRetroCalifPostits',{room,r});
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
    
    socket.on('saveRetroCalifPostitsServer',({room,r})=>{ //VINCULAR LOS POSTITS A LA RETROSPECTIVA CREADA
        vinculatePostitRetroCalif(connection,room,r,(error)=>{
            if(error.length>0){
                console.log(error);
                msg=`ERROR INESPERADO AL INSERTAR EL ID DE LA RETROSPECTIVA EN LOS POSITS DE LA MISMA`;
                console.log(msg);
                socket.emit('unexpectedError',msg);
            }else{
                console.log("TODO HA IDO CORRECTAMENTE, RETROSPECTIVA GUARDADA CON ÉXITO");
                socket.emit('retroCalifSavedReturn');
                socket.broadcast.to(room).emit('retroCalifSavedReturn');
            }
        });
    });

    socket.on('loadRetroCalifHistoryList',room=>{
        listRetroCalif(connection,room,(res)=>{
            socket.emit('loadRetroCalifHistoryListReturn',res);
        })
    });

    socket.on('loadRetroCalifInPopup',({room,tituloRetroLoad})=>{
        idRetroRoomCalif(connection,room,tituloRetroLoad,(res)=>{
            if(res.ID>0){
                console.log("ID DE LA RETROSPECTIVA A RECUPERAR"+res.ID);
                socket.emit('loadCalif',res.Puntuacion);
                //TODOS LOS POSTITS DE LA SALA Y DE LA RETRO CON ID RES
                getPostitsRoomRetroCalif(connection,room,res.ID,(titulos)=>{
                    if(titulos!=-1){
                        socket.emit('loadRetroCalifInPopupReturn',titulos);
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

    socket.on('actualizarCalificacionRetro',({room,pg})=>{
        socket.broadcast.to(room).emit('actualizarCalificacionRetroReturn',pg);
    });


    /*
     T-SHISRT
     */
    socket.on('createPostitTshirt',info=>{
        let tit=info.title;
        let tipo=info.type;
        let room=info.sala;
        console.log(`INSERTANDO POSTIT EN LA BD DE TSHIRT: TITULO:${tit}, TIPO:${tipo}, SALA:${room}`);
        //ALMACENAR EN LA BD
        addPostitTshirt(connection,room,tit,tipo,(res)=>{
            if(res){
                 console.log("ERROR ALMACENANDO POSTIT EN BD:"+res);
                 msg =`HA OCURRIDO UN ERROR ALMACENANDO EL POSTIT EN LA BASE DE DATOS`;
                 socket.emit('unexpectedError',msg);
            }
        });
        socket.broadcast.to(room).emit('createPostitTshirtReturn',{tit,tipo});
    });
    socket.on('blockOptionsTshirt',room=>{
        socket.broadcast.to(room).emit('blockOptionsTshirtReturn');
    });
    socket.on('allowOptionsTshirtCalif',room=>{
        socket.broadcast.to(room).emit('allowOptionsTshirtReturn');
    });
    socket.on('showListPositsTshirt',room=>{
        loadRoomPostitsTshirt(connection,room,(res)=>{
            if(res!=-1){
                socket.emit('showListTshirtPositsReturn',res);
            }else{
                msg=`ERROR MOSTRANDO LOS POSITS DE LA SALA:${room}`;
                console.log(msg);
                socket.emit('unexpectedError',msg);
            }
        });
    });
    socket.on('titlesToDeleteTshirt',({titlesDelete, room})=>{
        console.log(titlesDelete);
        for(i=0;i<titlesDelete.length;i++){
            //BORRO
            deletePostitTshirt(connection,room,titlesDelete[i],(e)=>{
                if(e){
                    msg=`ERROR ELIMINANDO EL POSIT ${titlesDelete[i]} DE LA SALA:${room}`;
                    console.log(msg);
                    console.log(e);
                    socket.emit('unexpectedError',msg);
                }
            });
            //MANDAR RESULTANTES A REPERESENTAR A TODOS
            loadRoomPostitsTshirt(connection,room,(res)=>{
                if(res!=-1){
                    socket.emit('showListTshirtPositsReturn',res);
                    socket.emit('loadPositsTshirtJoin',res);
                    socket.broadcast.to(room).emit('loadPositsTshirtJoin',res);
                }else{
                    msg=`ERROR MOSTRANDO LOS POSITS INICIALES DE LA SALA:${room}`;
                    console.log(msg);
                    socket.emit('unexpectedError',msg);
                }
            });
        }
        //ACTUALIZAR LISTA DEL QUE BORRA
    });
    /*
     MoSCoW
     */
     socket.on('createPostitMoscow',info=>{
        let tit=info.title;
        let tipo=info.type;
        let room=info.sala;
        console.log(`INSERTANDO POSTIT EN LA BD DE MOSCOW: TITULO:${tit}, TIPO:${tipo}, SALA:${room}`);
        //ALMACENAR EN LA BD
        addPostitMoscow(connection,room,tit,tipo,(res)=>{
            if(res){
                 console.log("ERROR ALMACENANDO POSTIT EN BD:"+res);
                 msg =`HA OCURRIDO UN ERROR ALMACENANDO EL POSTIT EN LA BASE DE DATOS`;
                 socket.emit('unexpectedError',msg);
            }
        });
        socket.broadcast.to(room).emit('createPostitMoscowReturn',{tit,tipo});
    });
    socket.on('blockOptionsMoscow',room=>{
        socket.broadcast.to(room).emit('blockOptionsMoscowReturn');
        console.log("Llegado al servidor");
    });
    socket.on('allowOptionsMoscow',room=>{
        socket.broadcast.to(room).emit('allowOptionsMoscowReturn');
    });
    socket.on('showListPositsMoscow',room=>{
        loadRoomPostitsMoscow(connection,room,(res)=>{
            if(res!=-1){
                socket.emit('showListMoscowPositsReturn',res);
            }else{
                msg=`ERROR MOSTRANDO LOS POSITS DE LA SALA:${room}`;
                console.log(msg);
                socket.emit('unexpectedError',msg);
            }
        });
    });
    socket.on('titlesToDeleteMoscow',({titlesDelete, room})=>{
        console.log(titlesDelete);
        for(i=0;i<titlesDelete.length;i++){
            //BORRO
            deletePostitMoscow(connection,room,titlesDelete[i],(e)=>{
                if(e){
                    msg=`ERROR ELIMINANDO EL POSIT ${titlesDelete[i]} DE LA SALA:${room}`;
                    console.log(msg);
                    console.log(e);
                    socket.emit('unexpectedError',msg);
                }
            });
            //MANDAR RESULTANTES A REPERESENTAR A TODOS
            loadRoomPostitsMoscow(connection,room,(res)=>{
                if(res!=-1){
                    socket.emit('showListMoscowPositsReturn',res);
                    socket.emit('loadPositsMoscowJoin',res);
                    socket.broadcast.to(room).emit('loadPositsMoscowJoin',res);
                }else{
                    msg=`ERROR MOSTRANDO LOS POSITS INICIALES DE LA SALA:${room}`;
                    console.log(msg);
                    socket.emit('unexpectedError',msg);
                }
            });
        }
        //ACTUALIZAR LISTA DEL QUE BORRA
    });
    /*
     PRODUCT BACKLOG
    */
   socket.on('createEpicPB',info=>{
        addEpicToProductBacklog(connection,info.title, info.desc, info.prio, info.sala,(err)=>{
            console.log(err); //ERR O DEVUELVE EL ERROR O EL ID (PODRÍA SER COMO MUCHO 999 Y NO CREO EN ESTE CASO)
            if(err.length > 3){
                msg=`ERROR AÑADIENDO ÉPICA AL PRODUCT BACKLOG EN LA SALA:${info.sala}`;
                console.log(err);
                console.log(msg);
                socket.emit('unexpectedError',msg);
            }else{
                let infoSend = {
                    sala:info.sala,
                    title:info.title,
                    desc:info.des,
                    prio:info.prio,
                    id: err
                  }
                socket.broadcast.to(info.sala).emit('createEpicPBReturn',infoSend);
                socket.emit('createEpicPBReturn',infoSend);
            }
        });
   });

   socket.on('createFeaturePB',info=>{
        console.log(info);
        addFeatureToProductBacklog(connection,info.title, info.desc, info.prio, info.sala, info.idE,(err)=>{
            console.log(err); //ERR O DEVUELVE EL ERROR O EL ID (PODRÍA SER COMO MUCHO 999 Y NO CREO EN ESTE CASO)
            if(err.length > 3){
                msg=`ERROR AÑADIENDO ÉPICA AL PRODUCT BACKLOG EN LA SALA:${info.sala}`;
                console.log(err);
                console.log(msg);
                socket.emit('unexpectedError',msg);
            }else{
                let infoSend = {
                    sala:info.sala,
                    title:info.title,
                    desc:info.des,
                    prio:info.prio,
                    est:info.est,
                    id: err
                  }
                socket.broadcast.to(info.sala).emit('createFeaturePBReturn',infoSend);
                socket.emit('createFeaturePBReturn',infoSend);
            }
        });
   });

   socket.on('createUserStoriePB',info=>{
        console.log(info);
        addUSToProductBacklog(connection,info.title, info.desc, info.prio, info.est, info.sala, info.idF, info.idE,(err)=>{
            console.log(err); //ERR O DEVUELVE EL ERROR O EL ID (PODRÍA SER COMO MUCHO 999 Y NO CREO EN ESTE CASO)
            if(err.length > 3){
                msg=`ERROR AÑADIENDO ÉPICA AL PRODUCT BACKLOG EN LA SALA:${info.sala}`;
                console.log(err);
                console.log(msg);
                socket.emit('unexpectedError',msg);
            }else{
                let infoSend = {
                    sala:info.sala,
                    title:info.title,
                    desc:info.des,
                    prio:info.prio,
                    est:info.est,
                    id: err,
                    idE: info.idE,
                    idF: info.idF
                  }
                socket.broadcast.to(info.sala).emit('createUSPBReturn',infoSend);
                socket.emit('createUSPBReturn',infoSend);
            }
        });
   });

   socket.on('updateEpicPB',({info,idSelected})=>{
        console.log("ACTUALIZANDO ÉPICA");
        updateEpic(connection,idSelected,info.title,info.desc,info.prio,info.est,(err)=>{
            if(err!=0){
                msg=`ERROR ACUALIZANDO LA ÉPICA`;
                console.log(err);
                console.log(msg);
                socket.emit('unexpectedError',msg);
            }else{
                console.log("Actualizacion OK");
                socket.emit('reloadPB');
                socket.broadcast.to(info.sala).emit('reloadPB');
            }
        });
   });
   socket.on('updateFeaturePB',({info,idSelected})=>{
        updateFeature(connection,idSelected,info.title,info.desc,info.prio,info.est,(err)=>{
            if(err!=0){
                msg=`ERROR ACUALIZANDO LA FEATURE`;
                console.log(err);
                console.log(msg);
                socket.emit('unexpectedError',msg);
            }else{
                socket.emit('reloadPB');
                socket.broadcast.to(info.sala).emit('reloadPB');
            }
        });
   });
   socket.on('updateUSPB',({info,idSelected})=>{
        updateUS(connection,idSelected,info.title,info.desc,info.prio,info.est,(err)=>{
            if(err!=0){
                msg=`ERROR ACUALIZANDO LA USER STORY`;
                console.log(err);
                console.log(msg);
                socket.emit('unexpectedError',msg);
            }else{
                socket.emit('reloadPB');
                socket.broadcast.to(info.sala).emit('reloadPB');
            }
        });
   });

   socket.on('loadFeaturesOfEpic',({idEpic,room})=>{
        featuresOfEpic(connection,room,idEpic,res=>{
            if(res.length > 40){
                msg=`ERROR CARGANDO LAS FEATURES DE LA ÉPIC SELECCIONADA`;
                console.log(res);
                console.log(msg);
                socket.emit('unexpectedError',msg);
            }else{
                console.log(res);
                socket.emit('loadFeaturesOfEpicReturn',res);
            }
        });
   });

   socket.on('deleteEpics',({epicasID,room})=>{
        console.log("EPICASSSS"+epicasID);
        for(i=0;i<epicasID.length;i++){
            console.log("ÉPICA ID:"+epicasID[i]);
            deleteEpic(connection,epicasID[i],e=>{
                if(e){
                    msg=`ERROR AL ELIMINAR LAS ÉPICAS`;
                    console.log(e);
                    console.log(msg);
                    socket.emit('unexpectedError',msg); 
                }else{
                    socket.broadcast.to(room).emit('loadEpicsPBDelete');
                    socket.emit('loadEpicsPBDelete');
                }
            });
        }
   });
   
   socket.on('deleteFeatures',({featuresID,room})=>{
        console.log("FEATURESSS"+featuresID);
        for(i=0;i<featuresID.length;i++){
            console.log("FEATURE ID:"+featuresID[i]);
            deleteFeature(connection,featuresID[i],e=>{
                if(e){
                    msg=`ERROR AL ELIMINAR LAS FEATURES`;
                    console.log(e);
                    console.log(msg);
                    socket.emit('unexpectedError',msg); 
                }else{
                    socket.broadcast.to(room).emit('loadEpicsPBDelete');
                    socket.emit('loadEpicsPBDelete');
                }
            });
        }
   });
   socket.on('deleteUSs',({usID,room})=>{
        console.log("USSSS"+usID);
        for(i=0;i<usID.length;i++){
            console.log("USER STORY ID:"+usID[i]);
            deleteUS(connection,usID[i],e=>{
                if(e){
                    msg=`ERROR AL ELIMINAR LAS USER STORIES`;
                    console.log(e);
                    console.log(msg);
                    socket.emit('unexpectedError',msg); 
                }else{
                    socket.broadcast.to(room).emit('loadEpicsPBDelete');
                    socket.emit('loadEpicsPBDelete');
                }
            });
        }
   });
   socket.on('loadPB',room=>{
        loadEpicsProductBacklog(connection,room,(res)=>{
            if(res.length != 0){
                if(res[0].ID) //Compruebo por ejemplo el primer ID (si no hay es que ha saltado un error)
                    socket.emit('loadEpicsPB',res);
                else{
                    msg=`ERROR CARGANDO LAS ÉPICAS DEL PRODUCT BACKLOG:${room}`;
                    console.log(msg);
                    socket.emit('unexpectedError',msg);
                }
            }
            
        });
        loadFeaturesProductBacklog(connection,room,(res)=>{
            if(res.length != 0){
                if(res[0].ID) //Compruebo por ejemplo el primer ID (si no hay es que ha saltado un error)
                    socket.emit('loadFeaturesPB',res);
                else{
                    msg=`ERROR CARGANDO LAS ÉPICAS DEL PRODUCT BACKLOG:${room}`;
                    console.log(msg);
                    socket.emit('unexpectedError',msg);
                }
            }
            
        });
        loadUSProductBacklog(connection,room,(res)=>{
            console.log(res);
            if(res.length != 0){ //hay algo
                if(res[0].ID) //Compruebo por ejemplo el primer ID (si no hay es que ha saltado un error)
                    socket.emit('loadUSsPB',res);
                else{
                    msg=`ERROR CARGANDO LAS ÉPICAS DEL PRODUCT BACKLOG:${room}`;
                    console.log(msg);
                    socket.emit('unexpectedError',msg);
                }
            }
            
        });
   });
   socket.on('loadDetailsOfElement',({room,tipoElem,idSelected})=>{
        if(tipoElem==1){
            propertiesOfEpic(connection,room,idSelected,(res)=>{
                if(res.length>1){
                    msg=`ERROR CARGANDO LA ÉPICA SELECCIONADA`;
                    console.log(msg);
                    console.log(res);
                    socket.emit('unexpectedError',msg);
                }else{
                    socket.emit('loadDetailsOfElementReturn',res);
                }
            });
        }else if(tipoElem==2){
            propertiesOfFeature(connection,room,idSelected,(res)=>{
                if(res.length>1){
                    msg=`ERROR CARGANDO LA FEATURE SELECCIONADA`;
                    console.log(msg);
                    console.log(res);
                    socket.emit('unexpectedError',msg);
                }else{
                    socket.emit('loadDetailsOfElementReturn',res);
                }
            });
        }else if(tipoElem==3){
            propertiesOfUS(connection,room,idSelected,(res)=>{
                if(res.length>1){
                    msg=`ERROR CARGANDO LA USER STORY SELECCIONADA`;
                    console.log(msg);
                    console.log(res);
                    socket.emit('unexpectedError',msg);
                }else{
                    socket.emit('loadDetailsOfElementReturn',res);
                }
            });
        }else{
            msg=`ERROR CARGANDO LOS DETALLES DEL ELEMENTO SELECCIONADO DEL PRODUCT BACKLOG`;
            console.log(msg);
            socket.emit('unexpectedError',msg);
        }
   });


   socket.on('orderPrioriry',room=>{
    loadEpicsOrderedProductBacklog(connection,room,(res)=>{

        if(res.length != 0){
            if(res[0].ID) //Compruebo por ejemplo el primer ID (si no hay es que ha saltado un error)
                socket.emit('loadEpicsPB',res);
            else{
                msg=`ERROR CARGANDO LAS ÉPICAS DEL PRODUCT BACKLOG:${room}`;
                console.log(msg);
                socket.emit('unexpectedError',msg);
            }
        }
        
    });
    loadFeaturesOrderedProductBacklog(connection,room,(res)=>{
        if(res.length != 0){
            if(res[0].ID) //Compruebo por ejemplo el primer ID (si no hay es que ha saltado un error)
                socket.emit('loadFeaturesPB',res);
            else{
                msg=`ERROR CARGANDO LAS ÉPICAS DEL PRODUCT BACKLOG:${room}`;
                console.log(msg);
                socket.emit('unexpectedError',msg);
            }
        }
        
    });
    loadUSOrderedProductBacklog(connection,room,(res)=>{
        console.log(res);
        if(res.length != 0){ //hay algo
            if(res[0].ID) //Compruebo por ejemplo el primer ID (si no hay es que ha saltado un error)
                socket.emit('loadUSsPB',res);
            else{
                msg=`ERROR CARGANDO LAS ÉPICAS DEL PRODUCT BACKLOG:${room}`;
                console.log(msg);
                socket.emit('unexpectedError',msg);
            }
        }
        
    });
   });

   socket.on('orderEstimation',room=>{
    loadEpicsOrderedEProductBacklog(connection,room,(res)=>{
        if(res.length != 0){
            if(res[0].ID) //Compruebo por ejemplo el primer ID (si no hay es que ha saltado un error)
                socket.emit('loadEpicsPB',res);
            else{
                msg=`ERROR CARGANDO LAS ÉPICAS DEL PRODUCT BACKLOG:${room}`;
                console.log(msg);
                socket.emit('unexpectedError',msg);
            }
        }
        
    });
    loadFeaturesEOrderedProductBacklog(connection,room,(res)=>{
        if(res.length != 0){
            if(res[0].ID) //Compruebo por ejemplo el primer ID (si no hay es que ha saltado un error)
                socket.emit('loadFeaturesPB',res);
            else{
                msg=`ERROR CARGANDO LAS ÉPICAS DEL PRODUCT BACKLOG:${room}`;
                console.log(msg);
                socket.emit('unexpectedError',msg);
            }
        }
        
    });
    loadUSOrderedEProductBacklog(connection,room,(res)=>{
        console.log(res);
        if(res.length != 0){ //hay algo
            if(res[0].ID) //Compruebo por ejemplo el primer ID (si no hay es que ha saltado un error)
                socket.emit('loadUSsPB',res);
            else{
                msg=`ERROR CARGANDO LAS ÉPICAS DEL PRODUCT BACKLOG:${room}`;
                console.log(msg);
                socket.emit('unexpectedError',msg);
            }
        }
        
    });
   });

    socket.on('blockButton',({room,block})=>{
        console.log("llega"+block);
        socket.broadcast.to(room).emit('blockButtonReturn',block);
    });
    socket.on('allowBtn',({room,disblock})=>{
        socket.broadcast.to(room).emit('allowBtnReturn',disblock);
    });
   
    socket.on('loadFatherEpic',epica=>{
        console.log(epica);
        getEpicByID(connection,epica,(res)=>{
            if(res==1){
                msg=`ERROR CARGNDO EL TÍTULO DE LA ÉPICA PADRE`;
                console.log(msg);
                socket.emit('unexpectedError',msg);
            }else{
                socket.emit('loadFatherEpicReturn',res[0]);
            }
        })
    });

    socket.on('loadFatherFeature',epica=>{
        getFeatureByID(connection,epica,(res)=>{
            if(res==1){
                msg=`ERROR CARGNDO EL TÍTULO DE LA FEATURE PADRE`;
                console.log(msg);
                socket.emit('unexpectedError',msg);
            }else{
                socket.emit('loadFatherFeatureReturn',res[0]);
            }
        })
    });




/*
    KANBAN
*/
   socket.on('showElemsKanban',room=>{
        loadUserStories(connection,room,(res)=>{
            console.log(res);
            if(res.length != 0){ //hay algo
                if(res[0].ID) //Compruebo por ejemplo el primer ID (si no hay es que ha saltado un error)
                    socket.emit('showElemsKanbanReturn',res);
                else{
                    msg=`ERROR CARGANDO LAS ÉPICAS DEL PRODUCT BACKLOG:${room}`;
                    console.log(msg);
                    socket.emit('unexpectedError',msg);
                }
            }
            
        });
   });
   socket.on('showFeaturesKanban',room=>{
        loadFeaturesTitle(connection,room,0,(res)=>{
            console.log(res);
            if(res.length != 0){ //hay algo
                if(res[0].ID) //Compruebo por ejemplo el primer ID (si no hay es que ha saltado un error)
                    socket.emit('showFeaturesKanbanReturn',res);
                else{
                    msg=`ERROR CARGANDO LAS ÉPICAS DEL PRODUCT BACKLOG:${room}`;
                    console.log(msg);
                    socket.emit('unexpectedError',msg);
                }
            }
            
        });
   });
   socket.on('showEpicsKanban',room=>{
        loadEpicsTitle(connection,room,0,(res)=>{
            console.log(res);
            if(res.length != 0){ //hay algo
                if(res[0].ID) //Compruebo por ejemplo el primer ID (si no hay es que ha saltado un error)
                    socket.emit('showEpicsKanbanReturn',res);
                else{
                    msg=`ERROR CARGANDO LAS ÉPICAS DEL PRODUCT BACKLOG:${room}`;
                    console.log(msg);
                    socket.emit('unexpectedError',msg);
                }
            }
            
        });
   });

   socket.on('addToDoKanban',({usKanban,room})=>{
        for(j=0;j<usKanban.length;j++){
            changeUSKanbanState(connection,usKanban[j],1,(e)=>{
                if(e!=0){
                    msg=`ERROR AÑADIENDO EL ELEMENTO A LA COLUMNA TO DO DEL KANBAN`;
                    console.log(e);
                    socket.emit('unexpectedError',msg);
                }
            })
        }
        socket.emit('reload');
        socket.broadcast.to(room).emit('reload');
   });

   socket.on('addFeToDoKanban',({feKanban,room})=>{
        for(j=0;j<feKanban.length;j++){
            changeFeatureKanbanState(connection,feKanban[j],1,(e)=>{
                if(e!=0){
                    msg=`ERROR AÑADIENDO EL ELEMENTO A LA COLUMNA TO DO DEL KANBAN`;
                    console.log(e);
                    socket.emit('unexpectedError',msg);
                }
            })
        }
        socket.emit('reload');
        socket.broadcast.to(room).emit('reload');
   });

   socket.on('addEpToDoKanban',({epKanban,room})=>{
        console.log("EPICA");
        console.log(epKanban);
        for(j=0;j<epKanban.length;j++){
            changeEpicKanbanState(connection,epKanban[j],1,(e)=>{
                if(e!=0){
                    msg=`ERROR AÑADIENDO EL ELEMENTO A LA COLUMNA TO DO DEL KANBAN`;
                    console.log(e);
                    socket.emit('unexpectedError',msg);
                }
            })
        }
        socket.emit('reload');
        socket.broadcast.to(room).emit('reload');
   });

   socket.on('actualizarKanban',room=>{
        actualizarKanban(connection,room, (res)=>{
            if(res.length != 0){ //hay algo
                if(res[0].Titulo) //Compruebo por ejemplo el primer ID (si no hay es que ha saltado un error)
                    socket.emit('actualizarKanbanReturn',res);
                else{
                    msg=`ERROR ACTUALIZANDO EL KANBAN`;
                    console.log(res);
                    console.log(msg);
                    socket.emit('unexpectedError',msg);
                }
            }
        })
   });
   socket.on('actualizarKanbanFeatures',room=>{
        loadFeatures(connection,room, (res)=>{
            console.log(res);
            if(res.length != 0){ //hay algo
                if(res[0].Titulo) //Compruebo por ejemplo el primer ID (si no hay es que ha saltado un error)
                    socket.emit('actualizarKanbanFeaturesReturn',res);
                else{
                    msg=`ERROR ACTUALIZANDO EL KANBAN`;
                    console.log(res);
                    console.log(msg);
                    socket.emit('unexpectedError',msg);
                }
            }
        })
   });
   socket.on('actualizarKanbanEpics',room=>{
        loadEpics(connection,room, (res)=>{
            if(res.length != 0){ //hay algo
                if(res[0].Titulo) //Compruebo por ejemplo el primer ID (si no hay es que ha saltado un error)
                    socket.emit('actualizarKanbaEpicsReturn',res);
                else{
                    msg=`ERROR ACTUALIZANDO EL KANBAN`;
                    console.log(res);
                    console.log(msg);
                    socket.emit('unexpectedError',msg);
                }
            }
        })
   });


   socket.on('showElemsKanbanMove',room=>{
        socket.broadcast.to(room).emit('blockButton',1);
        loadUserStoriesMove(connection,room,(res)=>{
            console.log(res);
            if(res.length != 0){ 
                if(res[0].ID) 
                    socket.emit('showElemsKanbanMoveReturn',res);
                else{
                    msg=`ERROR CARGANDO LAS US PARA MOVER DE TO DO A DOING:${room}`;
                    console.log(msg);
                    socket.emit('unexpectedError',msg);
                }
            }
            
        })
    });
   socket.on('showFeaturesKanbanMove',room=>{
        loadFeaturesTitle(connection,room,1,(res)=>{
            console.log(res);
            if(res.length != 0){ 
                if(res[0].ID) 
                    socket.emit('showFeaturesKanbanMoveReturn',res);
                else{
                    msg=`ERROR CARGANDO LAS US PARA MOVER DE TO DO A DOING:${room}`;
                    console.log(msg);
                    socket.emit('unexpectedError',msg);
                }
            }
            
        })
    });
   socket.on('showEpicsKanbanMove',room=>{
        loadEpicsTitle(connection,room,1,(res)=>{
            console.log(res);
            if(res.length != 0){ 
                if(res[0].ID) 
                    socket.emit('showEpicsKanbanMoveReturn',res);
                else{
                    msg=`ERROR CARGANDO LAS US PARA MOVER DE TO DO A DOING:${room}`;
                    console.log(msg);
                    socket.emit('unexpectedError',msg);
                }
            }
            
        })
    });

    socket.on('moveToDoDoingKanban',({usKanbanMove,room})=>{
            for(j=0;j<usKanbanMove.length;j++){
                changeUSKanbanState(connection,usKanbanMove[j],2,(e)=>{
                    if(e!=0){
                        msg=`ERROR MOVIENDO EL ELEMENTO A LA COLUMNA DOING DEL KANBAN`;
                        console.log(e);
                        socket.emit('unexpectedError',msg);
                    }
                })
            }
            loadUsedWip(connection,room,(res)=>{
                console.log(res[0].Total);
                if(res[0].Total>=0){
                    //Actualizar WIPS
                    socket.emit('loadWipUsadoReturn',res[0].Total);
                    socket.broadcast.to(room).emit('loadWipUsadoReturn',res[0].Total);
                    //Actualizar tableros
                    socket.emit('reload');
                    socket.broadcast.to(room).emit('relaod');
                }else{
                    console.log(res);
                    msg=`HA OCURRIDO UN ERROR OBTENIENDO EL WIP USADO DE LA SALA`;
                    console.log(msg);
                    socket.emit('unexpectedError',msg);
                }
            });
    });

    socket.on('moveFeToDoDoingKanban',({feKanbanMove,room})=>{
        for(j=0;j<feKanbanMove.length;j++){
            changeFeatureKanbanState(connection,feKanbanMove[j],2,(e)=>{
                if(e!=0){
                    msg=`ERROR AÑADIENDO EL ELEMENTO A LA COLUMNA TO DO DEL KANBAN`;
                    console.log(e);
                    socket.emit('unexpectedError',msg);
                }
            })
        }
        socket.emit('reload');
        socket.broadcast.to(room).emit('reload');
   });

    socket.on('moveEpToDoDoingKanban',({epKanbanMove,room})=>{
        for(j=0;j<epKanbanMove.length;j++){
            changeEpicKanbanState(connection,epKanbanMove[j],2,(e)=>{
                if(e!=0){
                    msg=`ERROR AÑADIENDO EL ELEMENTO A LA COLUMNA TO DO DEL KANBAN`;
                    console.log(e);
                    socket.emit('unexpectedError',msg);
                }
            })
        }
        socket.emit('reload');
        socket.broadcast.to(room).emit('reload');
   });
    
    socket.on('showElemsKanbanMoveDoingDone',room=>{
        socket.broadcast.to(room).emit('blockButton',2);
        loadUserStoriesMoveDoingDone(connection,room,(res)=>{
            console.log(res);
            if(res.length != 0){ 
                if(res[0].ID) 
                socket.emit('showElemsKanbanMoveDoingDoneReturn',res);
                else{
                    msg=`ERROR CARGANDO LAS US PARA MOVER DE DOING A DONE:${room}`;
                    console.log(msg);
                    socket.emit('unexpectedError',msg);
                }
            }
            
        })
    });
    socket.on('showEpicsKanbanMoveDoingDone',room=>{
        loadEpicsTitle(connection,room,2,(res)=>{
            console.log(res);
            if(res.length != 0){ 
                if(res[0].ID) 
                socket.emit('showEpicsKanbanMoveDoingDoneReturn',res);
                else{
                    msg=`ERROR CARGANDO LAS US PARA MOVER DE DOING A DONE:${room}`;
                    console.log(msg);
                    socket.emit('unexpectedError',msg);
                }
            }
            
        })
    });
    socket.on('showFeaturesKanbanMoveDoingDone',room=>{
        loadFeaturesTitle(connection,room,2,(res)=>{
            console.log(res);
            if(res.length != 0){ 
                if(res[0].ID) 
                socket.emit('showFeaturesKanbanMoveDoingDoneReturn',res);
                else{
                    msg=`ERROR CARGANDO LAS US PARA MOVER DE DOING A DONE:${room}`;
                    console.log(msg);
                    socket.emit('unexpectedError',msg);
                }
            }
            
        })
    });
    
    socket.on('moveDoingDoneKanban',({usKanbanMove,room})=>{
        for(j=0;j<usKanbanMove.length;j++){
            changeUSKanbanState(connection,usKanbanMove[j],3,(e)=>{
                if(e!=0){
                    msg=`ERROR MOVIENDO EL ELEMENTO A LA COLUMNA DONE DEL KANBAN`;
                    console.log(e);
                    socket.emit('unexpectedError',msg);
                }
            })
        }
        loadUsedWip(connection,room,(res)=>{
            console.log(res[0].Total);
            if(res[0].Total>=0){
                //Actualizar WIPS
                socket.emit('loadWipUsadoReturn',res[0].Total);
                socket.broadcast.to(room).emit('loadWipUsadoReturn',res[0].Total);
                //Actualizar tableros
                socket.emit('moveToDoDoingKanbanReturn');
                socket.broadcast.to(room).emit('moveToDoDoingKanbanReturn');
            }else{
                console.log(res);
                msg=`HA OCURRIDO UN ERROR OBTENIENDO EL WIP USADO DE LA SALA`;
                console.log(msg);
                socket.emit('unexpectedError',msg);
            }
        });
    });

    socket.on('moveFeDoingDoneKanban',({feKanbanMove,room})=>{
        for(j=0;j<feKanbanMove.length;j++){
            changeFeatureKanbanState(connection,feKanbanMove[j],3,(e)=>{
                if(e!=0){
                    msg=`ERROR AÑADIENDO EL ELEMENTO A LA COLUMNA TO DO DEL KANBAN`;
                    console.log(e);
                    socket.emit('unexpectedError',msg);
                }
            })
        }
        socket.emit('reload');
        socket.broadcast.to(room).emit('reload');
   });

    socket.on('moveEpDoingDoneKanban',({epKanbanMove,room})=>{
        for(j=0;j<epKanbanMove.length;j++){
            changeEpicKanbanState(connection,epKanbanMove[j],3,(e)=>{
                if(e!=0){
                    msg=`ERROR AÑADIENDO EL ELEMENTO A LA COLUMNA TO DO DEL KANBAN`;
                    console.log(e);
                    socket.emit('unexpectedError',msg);
                }
            })
        }
        socket.emit('reload');
        socket.broadcast.to(room).emit('reload');
   });
    
    socket.on('showElemsDeleteKn',room=>{
        socket.broadcast.to(room).emit('blockButton',3);
        listUSToDeleteKN(connection,room,(res)=>{
            if(res.length != 0){ 
                if(res[0].ID) 
                    socket.emit('showElemsDeleteKnReturn',res);
                else{
                    msg=`ERROR CARGANDO LAS US PARA ELIMINAR`;
                    console.log(msg);
                    console.log(res);
                    socket.emit('unexpectedError',msg);
                }
            }
        });
    });
    socket.on('showEpicsDeleteKn',room=>{
        loadEpicsTitle(connection,room,3,(res)=>{
            if(res.length != 0){ 
                if(res[0].ID) 
                    socket.emit('showEpicsDeleteKnReturn',res);
                else{
                    msg=`ERROR CARGANDO LAS US PARA ELIMINAR`;
                    console.log(msg);
                    console.log(res);
                    socket.emit('unexpectedError',msg);
                }
            }
        });
    });
    socket.on('showFeaturesDeleteKn',room=>{
        loadFeaturesTitle(connection,room,3,(res)=>{
            if(res.length != 0){ 
                if(res[0].ID) 
                    socket.emit('showFeaturesDeleteKnReturn',res);
                else{
                    msg=`ERROR CARGANDO LAS US PARA ELIMINAR`;
                    console.log(msg);
                    console.log(res);
                    socket.emit('unexpectedError',msg);
                }
            }
        });
    });

    socket.on('deleteKNSelected',({deleteKnbn,room})=>{
        for(j=0;j<deleteKnbn.length;j++){
            deleteFromkanban(connection,deleteKnbn[j],(e)=>{
                if(e!=0){
                    msg=`ERROR AÑADIENDO EL ELEMENTO A LA COLUMNA TO DO DEL KANBAN`;
                    console.log(e);
                    socket.emit('unexpectedError',msg);
                }
            })
        }
        socket.emit('reload');
        socket.broadcast.to(room).emit('reload');
    });
    socket.on('deleteEpicKNSelected',({deleteEpKnbn,room})=>{
        for(j=0;j<deleteEpKnbn.length;j++){
            changeEpicKanbanState(connection,deleteEpKnbn[j],4,(e)=>{
                if(e!=0){
                    msg=`ERROR AÑADIENDO EL ELEMENTO A LA COLUMNA TO DO DEL KANBAN`;
                    console.log(e);
                    socket.emit('unexpectedError',msg);
                }
            })
        }
        socket.emit('reload');
        socket.broadcast.to(room).emit('reload');
    });
    socket.on('deleteFeatureKNSelected',({deleteFeKnbn,room})=>{
        for(j=0;j<deleteFeKnbn.length;j++){
            changeFeatureKanbanState(connection,deleteFeKnbn[j],4,(e)=>{
                if(e!=0){
                    msg=`ERROR AÑADIENDO EL ELEMENTO A LA COLUMNA TO DO DEL KANBAN`;
                    console.log(e);
                    socket.emit('unexpectedError',msg);
                }
            })
        }
        socket.emit('reload');
        socket.broadcast.to(room).emit('reload');
    });

    socket.on('updateWip',({newWip,room})=>{
        updateWip(connection,room,newWip,(res)=>{
            if(res != 0){
                msg=`ERROR ACTUALIZANDO EL WIP DE LA SALA`;
                console.log(res);
                console.log(e);
                socket.emit('unexpectedError',msg);
            }else{
                socket.emit('updateWipReturn',newWip);
                socket.broadcast.to(room).emit('updateWipReturn',newWip);
            }
        });
    });

    socket.on('releaseButton',({room,btnBlock})=>{
        socket.broadcast.to(room).emit('releaseButtonReturn',btnBlock);
    });

    socket.on('blockWipButton',room=>{
        socket.broadcast.to(room).emit('blockButton',4);
    });


});





