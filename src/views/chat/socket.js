import IO from 'socket.io-client';


const options = {
    // reconnectionDelay: 1000,
};
const socket = new IO('127.0.0.1:7893', options);

export default socket;