const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const {userJoin, getCurrentUser, userLeave, getRoomUsers } = require('./utils/users');
const {estimationJoin, resetEstimation, showEstimation, deleteUserEstimation } = require('./utils/estimaciones');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', socket =>{

    socket.on('joinRoom', ({username, room}) => {
        const user = userJoin(socket.id, username, room);

        if(user != -1){
            //UNIRSE A LA SALA
            socket.join(user.room);

            socket.emit('message', 'Welcome to Poker');
    
            //EMITIR A UNA SALA ESPECÍFICA
            socket.broadcast.to(user.room).emit('message', `${user.username} se ha unido al Poker Game`);

            actualizarContadorPoker(user.room);

        }else{
            socket.emit('nameRepeated');
        }
            


    });

    console.log("New WS connection");

    socket.on('envioEstimacion',estimacion=>{
        estimationJoin(estimacion.usrName,estimacion.room,estimacion.est);
        actualizarContadorPoker(estimacion.room);
    });

    socket.on('resetEstimation', sala=>{
        resetEstimation(sala);
        socket.broadcast.to(sala).emit('returnReset');
        socket.emit('returnReset');
        actualizarContadorPoker(sala);
    });
    
    socket.on('showEstimation', sala =>{
        ests = showEstimation(sala);
        if(ests.length > 0){
            socket.broadcast.to(sala).emit('returnShowEstimations',ests);
            socket.emit('returnShowEstimations',ests);
            
        }
    })
    
    socket.on('disconnect', () => {
        const user = userLeave(socket.id);
        

        if(user){
            io.to(user.room).emit('message', `${user.username} salió de la sala`);
            actualizarContadorPoker(user.room);
            deleteUserEstimation(user.username, user.room);
            console.log(`Usuario ${user.username} desconectado de la sala ${user.room}`);
        }
        
    });

    //PARA ACTUALIZAR CONTADOR
    function actualizarContadorPoker(sala){
        const usersSala = getRoomUsers(sala);
        const estsSala = showEstimation(sala);
        const tamanio = usersSala.length;
        const ests = estsSala.length;
        socket.broadcast.to(sala).emit('actualizarContador',{ests, tamanio});
        socket.emit('actualizarContador',{ests, tamanio});
    }
});

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

