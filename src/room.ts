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
        // @ts-ignore
        this.broadcast("game", {"message": "User joined", payload: this.clients.length});
        if(this.isFull()) {
            // @ts-ignore
            this.broadcast("game", {message: "Game Full", "payload": {}});
            // @ts-ignore
            this.broadcast("game", {message: "Coin generated", "payload": {x: Math.random()*3990, y: Math.random()*790}})
            async () => {
                for(let i = 10; i > 0; i--) {
                    // @ts-ignore
                    this.broadcast("game", {message: "countdown", payload: i});
                }
            }
        }
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

    broadcast(channel: string, message: JSON) {
        this.clients.forEach(( client ) => {
            client.send(channel, message);
        })
    }

}