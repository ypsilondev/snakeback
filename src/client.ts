import { Socket } from "socket.io";
import { Main } from "./index";
import { Room } from "./room";

export class Client {

    private socket: Socket;
    private room: Room;
    private main: Main;

    constructor(socket: Socket, room: Room, main: Main) {
        this.socket = socket;
        this.room = room;
        this.main = main;

        this.registerChannels();
    }

    send(channel: string, message: JSON) {
        this.socket.emit(channel, message);
    }

    private registerChannels() {
        this.socket.on("global", ( message ) => this.main.broadcast(message));
        this.socket.on("broadcast", ( message) => this.room.broadcast("broadcast", message));
    }

}