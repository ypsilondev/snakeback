import { Client } from "./client";

export class Room {

    private token: string;
    private clients = new Array<Client>();

    constructor(token: string) {
        this.token = token;
    }

    addClient(client: Client) {
        this.clients.push(client);
    }

    getClients() : Array<Client> {
        return this.clients;
    }

    broadcast(channel: string, message: JSON) {
        this.clients.forEach(( client ) => {
            client.send(channel, message);
        })
    }

}