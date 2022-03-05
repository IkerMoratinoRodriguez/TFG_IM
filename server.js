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
const {insertarUsuarioPoker, getRoomUsers, eliminarUsuarioSala, estimationJoin, resetEstimation, showEstimation,printEsts} = require('./utils/pokerTable');
const {actualizarPuntuacion, aniadirUsuario, aniadirSala, comprobarContraSala, comprobarContraUsr} = require('./utils/database');
const res = require('express/lib/response');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', socket =>{



    socket.on('joinRoom', ({username, room}) => {

        insertarUsuarioPoker(connection,username,room,socket.id,(obj) =>{
             const err = obj.error;
             const result = obj.res;
             if(result[0].result!=0 || err){
                 console.log("CÓDIGO DE ERROR AL INSERTAR UN USUARIO EN LA SALA:"+result[0].result);
                 socket.emit('unexpectedError');
             }else{
                socket.join(room);  
             }
             
        });
        actualizarContadorPoker(room);
     });

    console.log("New WS connection");

    socket.on('envioEstimacion',estimacion=>{
        estimationJoin(connection,estimacion.usrName,estimacion.room,estimacion.est,(res)=>{
            if(res[0].result!=0){
                console.log(res[0].result);
                console.log("ERROR INESPERADO AL INSERTAR ESTIMACION");
                socket.emit('unexpectedError');
            }
        });
        actualizarContadorPoker(estimacion.room);
    });

    socket.on('resetEstimation', sala=>{
        resetEstimation(connection, sala, (res)=>{
            if(res[0].result!=0){
                console.log(res[0].result);
                console.log("ERROR INESPERADO AL RESETEAR ESTIMACIONES DE UNA SALA");
                socket.emit('unexpectedError');
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
                    socket.emit('unexpectedError');//CAMBIAR POR ERROR INESPERADO
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
                    console.log(err);
                    socket.emit('unexpectedError');//CAMBIAR POR ERROR INESPERADO
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
        });
    })
    
    socket.on('disconnect', () => {
            
        //AUNQUE SALGAN TODOS LOS USUARIOS, LA SALA SIGUE EXISTIENDO
        //deleteUserEstimation(user.username, user.room); Se eliminará automáticamente cuando se elimine la fila de la tabla conexion
        eliminarUsuarioSala(connection,socket.id,(result) =>{
            if(result[0].result.length == 0)
                    console.log(`NO SE HABIA INSERTADO EL SOCKET.ID EN LA CONEXION`);
            else{
                sala = result[0].result;
                actualizarContadorPoker(sala);
                //Mandar la actualizacion del contador al cliente(poker.js)

            }
        });
        
    });

    //DEL CUESTIONARIO

    socket.on('ins', (puntuacion) =>{
        actualizarPuntuacion(connection,puntuacion);
     })


    //PARA ACTUALIZAR CONTADOR
    function actualizarContadorPoker(sala){
        showEstimation(connection,sala,(res)=>{
            if(res[0].result==-1){
                console.log(res[0].result);
                console.log("ERROR INESPERADO AL MOSTRAR EL NÚMERO DE ESTIMACIONES DE UNA SALA");
                socket.emit('unexpectedError');
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

