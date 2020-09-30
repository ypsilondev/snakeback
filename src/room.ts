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

    getSettings(): {velocity: number, players: number} {
        return {velocity: this.velocity, players: this.players};
    }

    broadcast(channel: string, message: JSON) {
        this.clients.forEach(( client ) => {
            client.send(channel, message);
        })
    }

}