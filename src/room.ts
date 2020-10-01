import { Client } from "./client";
import { Util } from "./util";

export class Room {

    private token: string;
    private clients = new Array<Client>();

    private velocity: number;
    private players: number;

    private usedColors = new Array<String>();

    constructor(token: string, velocity: number, players: number) {
        this.token = token;
        this.velocity = velocity;
        this.players = players;
    }

    addClient(client: Client) {
        this.clients.push(client);
        this.broadcast("game", {"message": "User joined", payload: this.clients.length});
        //if(this.isFull()) {
        //    setTimeout(() => {
        //        this.broadcast("game", {message: "Game Full", "payload": {}});
        //        this.broadcast("game", Util.createNewCoin());
        //        this.broadcast("game", {message: "start Countdown", "payload": {}});
        //    }, 2000);
        //}
    }

    getClients() : Array<Client> {
        return this.clients;
    }
    
    getVelocity(): number {
        return this.velocity;
    }

    getMaxPlayers(): number {
        return this.players;
    }

    setColor(client: Client, color: string): boolean {
        if(this.usedColors.includes(color))
            return false;
        client.setColor(color);
        this.usedColors.push(color);

        if(this.usedColors.length == this.players) {
            this.broadcast("game", {message: "Game Full", "payload": {}});
            this.broadcast("game", Util.createNewCoin());
            this.broadcast("game", {message: "start Countdown", "payload": {}});
        }
        return true;
    }

    checkStart(): void {

    }

    isFull(): boolean {
        return this.clients.length >= this.players;
    }

    getSettings(): {velocity: number, players: number} {
        return {velocity: this.velocity, players: this.players};
    }

    broadcast(channel: string, message: {}) {
        this.clients.forEach(( client ) => {
            client.send(channel, message);
        })
    }

    whoIsIn(): Array<Client> {
        return this.clients.filter((element: Client) => {
            return !element.isDead();
        });
    }

}