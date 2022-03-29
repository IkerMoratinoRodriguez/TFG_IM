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

//BASE DE DATOS
const {actualizarPuntuacion, aniadirUsuario, aniadirSala, comprobarContraSala, comprobarContraUsr,comprobarEstadoDotVotingRoom, setEstadoDotVotingRoom, getEstadoDotVotingRoom} = require('./utils/database');
const {insertarUsuarioPoker, getRoomUsers, eliminarUsuarioSala, estimationJoin, resetEstimation, showEstimation,printEsts} = require('./utils/pokerTable');
const {insertarUsuarioDotVoting,eliminarUsuarioSalaDotVoting,insertarVotingMode, getAvailableVotes, eliminarPuntosUsuario} = require('./utils/dotVotingTable');
const {insertarUS, userStoriesRoom, deleteUSRoom, addPoints,clearVotesRoom} = require('./utils/userStorie');
const {addUserRoomRetro, eliminarUsuarioSalaRetro} = require('./utils/retrospectiveTable');
const {addPostitRetro, loadRoomPostits, deletePostit} = require('./utils/postitRetro');

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
        console.log(`USUARIO:${username} uniendose a la sala de retrospectiva ${room}`);
        addUserRoomRetro(connection,room,username,socket.id,(result)=>{
            let codigo = result.res;
            let e = result.error;
            if(e){
                msg=`USUARIO REPETIDO EN LA SALA:${room}`;
                console.log(e);
                socket.emit('unexpectedError1',msg);
            }else if(codigo[0].result!=0){
                msg=`USUARIO REPETIDO EN LA SALA:${room}`;
                console.log(err);
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
                    socket.emit('loadPositsJoin',res);
                    socket.broadcast.to(room).emit('loadPositsJoin',res);
                }else{
                    msg=`ERROR MOSTRANDO LOS POSITS INICIALES DE LA SALA:${room}`;
                    console.log(msg);
                    socket.emit('unexpectedError',msg);
                }
            });
            loadRoomPostits(connection,room,(res)=>{
                if(res!=-1){
                    socket.emit('showListPositsReturn',res);
                }else{
                    msg=`ERROR MOSTRANDO LOS POSITS DE LA SALA:${room}`;
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

    //DE LA PANTALLA DE ENTRADA A SALA

    socket.on('verifyRoomPassword', infoSala=>{
        const roomV = infoSala.sala;
        const passwd = infoSala.pssw;
        console.log(`Accediento a:\nSala:${roomV}\nContraseña:${passwd}`);
        comprobarContraSala(connection,infoSala,(obj)=>{
            const err = obj.error;
            const result = obj.res;
            if(result[0].result==1){
                console.log("CONTRASEÑA DE SALA INCORRECTA");
                socket.emit('wrongRoomPassword');
            }else if(result[0].result==2){
                console.log("SALA INEXISTENTE");
                socket.emit('missingRoom');
            }else{
                if(err){
                    console.log(err);
                    msg="ERROR INESPERADO AL VERIFICAR LA CONTRASEÑA DE LA SALA";
                    console.log(msg);
                    socket.emit('unexpectedError',msg);//CAMBIAR POR ERROR INESPERADO
                }
            }
        });
    });

    socket.on('verifyUser', infoUsr =>{
        comprobarContraUsr(connection, infoUsr, (obj) =>{
            const err = obj.error;
            const result = obj.res;
            if(result[0].result==1 || result[0].result==2){
                console.log(`Código de error ${result[0].result} -> 1-Contraseña inválida 2-No existe usr`);
                socket.emit('invalidUsrCredentials');
            }else{
                if(err){
                    msg="ERROR INESPERADO AL VERIFICAR LA CONTRASEÑA DEL USUARIO";
                    console.log(msg);
                    console.log(err);
                    socket.emit('unexpectedError',msg);
                }
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

