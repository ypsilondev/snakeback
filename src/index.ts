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
            socket.on("join", ( message) => {
                token = message;
                var resp = {"event": "register", "roomCode": token, "state": "joined room", "code": 10, "id": 0, "roomSettings": {velocity: 0, players: 0}};
                let room = self.rooms.get(token);
                if(room === undefined) {
                    resp.state = "room not available";
                    resp.code = 19;
                    socket.emit("register", resp);
                    return;
                }
                if(room.isFull()) {
                    resp.state = "room is full";
                    resp.code = 18;
                    socket.emit("register", resp);
                    return;
                }
                
                resp.roomSettings = room.getSettings();
                resp.id = room.getClients().length;
                
                const client = new Client(socket, room, self);
                self.clients.push(client);

                room.addClient(client);

                socket.emit("register", resp);
            });
            socket.on("register", (req: {velocity: number, players: number}) => {
                token = self.createRoomCode();
                //Code 10: joined room //Code 11: created Room
                var resp = {"event": "register", "roomCode": token, "state": "joined room", "code": 11, "id": 0, "roomSettings": {velocity: 0, players: 0}};

                var room = new Room(token, req.velocity, req.players);
                self.rooms.set(token, room);
                
                resp.roomSettings = room.getSettings();
                resp.id = room.getClients().length;
                
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