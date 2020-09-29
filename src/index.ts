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
            var token: string;
            socket.on("register", (message) => {
                token = message;

                //Code 10: joined room //Code 11: created Room
                var resp = {"event": "register", "roomCode": token, "state": "joined room", "code": 10};

                if(token === "newRoom") {
                    token = self.createRoomCode();
                    resp.roomCode = token;
                    resp.state = "created Room";
                    resp.code = 11;
                }

                let room = self.rooms.get(token);
                if(room === undefined) {
                    room = new Room(token);
                    self.rooms.set(token, room);
                }
                    
                
                const client = new Client(socket, room, self);
                self.clients.push(client);

                room.addClient(client);

                socket.emit("register", resp);
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

    createRoomCode(): string {
        const rand = Math.random().toString(36).slice(2);
        if(this.rooms.has(rand)) {
            return this.createRoomCode();
        }
        return rand;
    }

}

new Main();