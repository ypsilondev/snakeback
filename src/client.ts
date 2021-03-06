import { Socket } from "socket.io";
import { Main } from "./index";
import { Room } from "./room";
import { Util } from "./util"

export class Client {

    private socket: Socket;
    private room: Room;
    private main: Main;
    private id: number;
    private color: string = "#FFFFFF";
    private dead = false;

    constructor(socket: Socket, room: Room, main: Main, id: number) {
        this.socket = socket;
        this.room = room;
        this.main = main;
        this.id = id;

        this.registerChannels();
    }

    send(channel: string, message: {}) {
        this.socket.emit(channel, message);
    }

    getID(): number {
        return this.id;
    }

    isDead(): boolean {
        return this.dead;
    }

    getColor(): string {
        return this.color;
    }

    setColor(color: string) {
        this.color = color;
    }

    private registerChannels() {
        this.socket.on("global", ( message ) => this.main.broadcast(message));
        this.socket.on("broadcast", ( message) => this.room.broadcast("broadcast", message));
        this.socket.on("movement", ( message) => this.room.broadcast("movement", message));
        this.socket.on("room", ( message: {message: string, payload: {}} ) => {
            switch(message.message) {
                case "setColor": {
                    // @ts-ignore
                    let color = message.payload.color;
                    let success = this.room.setColor(this, color);
                    if(success) {
                        this.room.broadcast("room", {"message": "setColor", payload: {id: this.id, color}});
                    }
                    this.send("room", {message: "selfColor", payload: {success}});
                    break
                }
                default: this.room.broadcast("room", message);
            }
        });
        this.socket.on("disconnect", ( message ) => {
            this.dead = true;
        });
        this.socket.on("game", ( req: {message: string, payload: {}} ) => {
            switch (req.message) {
                case "coin collected": this.room.broadcast("game", Util.createNewCoin()); break;
                case "Im dead": {
                    this.dead = true;
                    let whoIsIn = this.room.whoIsIn();
                    if(whoIsIn.length <= 1) {
                        this.room.broadcast("game", {message: "winner", payload: {id: whoIsIn[0].id}});
                    }
                    this.room.broadcast("game", {message: "dead", payload: {id: this.id}});
                    break;
                }
                default: this.room.broadcast("game", req);
            }
        })
    }

}