import { Client } from "./client";

export class Room {

    private token: string;
    private clients = new Array<Client>();

    private velocity: number;
    private players: number;

    constructor(token: string, velocity: number, players: number) {
        this.token = token;
        this.velocity = velocity;
        this.players = players;
    }

    addClient(client: Client) {
        this.clients.push(client);
        this.broadcast("game", {"message": "User joined", payload: this.clients.length});
        console.log(this.players, this.clients.length, this.isFull());
        if(this.isFull()) {
            setTimeout(() => {
                this.broadcast("game", {message: "Game Full", "payload": {}});
                this.broadcast("game", {message: "Coin generated", "payload": {x: Math.random()*1390, y: Math.random()*790}});
                this.broadcast("game", {message: "start Countdown", "payload": {}});
            }, 400);
        }
    }

    async startBroadcast() {
        
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

}