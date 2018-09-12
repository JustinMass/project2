const socket = io();

socket.on('connected', () => {
   console.log(`connected successfully`);
});