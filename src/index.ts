import { Socket } from "socket.io";
import { Client } from "./client";
import { Room } from "./room";
import io from "socket.io";

const server = io.listen(3000);

export class Main {

    clients = new Array<Client>();
    rooms = new Map<String, Room>();

    constructor() {
        const self = this;
        server.on("connection", function(socket: Socket) {
            console.log("user connected");
            var token: string;
            socket.on("register", (message) => {
                token = message;

                let room = self.rooms.get(token);
                if(room === undefined) {
                    room = new Room(token);
                    self.rooms.set(token, room);
                }
                    
                
                const client = new Client(socket, room, self);
                self.clients.push(client);

                room.addClient(client);

                socket.emit("info", "Register successfull");
            })
            socket.emit("info", "welcome");
        });
    }

    getRoom(token: string): Room | undefined {
        return this.rooms.get(token);
    }

    broadcast(message: JSON) {
        this.clients.forEach(( client ) => client.send("global", message));
    }

    sendInfoToRoom(token: string, channel: string, message: JSON) {
        const room = this.rooms.get(token);
        if(room != undefined) {
            room.broadcast(channel, message);
        }
    }

}

new Main();