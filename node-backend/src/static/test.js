const socket = io();

socket.on('connected', (payload) => {
   console.log(`You are user #${payload.count}`);

   let users = payload.users;

   console.log(`All users:`);

   for(let id in users){
       console.log(id);
   }

   socket.on('quit', (id) => {
       console.log(`${id} disconnected`)
   })
});