const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io").listen(server);

conversations = {};


const port = 3000;
let count = 0;

io.on("connection", socket => {
  console.log("a user connected");

  count++;
  console.log(count);

  socket.emit('bagli', count);

  socket.on('subscribe', function(room) {
      console.log('joining room', room);
      socket.join(room);

  });



  socket.on('send message', function(data){
    console.log('sending room post', data.room);
    socket.broadcast.to(data.room).emit('mesagedurum',{
      message: data.message
    })
    /*socket.emit('mesagedurum', {
      message: data.message
    });*/
    console.log("retry");
  });




  //socket.emit("playerNumber", count);

  socket.on("diss", () => {
    count--;
    socket.emit("playerNumber", count);
  });

  socket.on('chat message', msg => {
    console.log(msg);
  })

  socket.on("count", ()=>{
    socket.emit("playerNumber", count);
  })



  socket.on("disconnect", ()=>{
    count--;
    console.log(count);
  })






})

server.listen(port, () => console.log("server running on port: " + port));
