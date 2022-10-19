import io from "socket.io-client"

export const connection = async () =>{
    const socket = io('ws://localhost:8290', {
        timeout: 15000,
        withCredentials: true,
        reconnectionDelayMax: 10000,
        transports: ['websocket', 'polling'],
    });
    socket.on('productSales', (transactions) => console.log(transactions))
}