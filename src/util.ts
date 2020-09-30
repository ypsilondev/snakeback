export class Util{
    static createNewCoin(): {message: string, payload: {x: number, y: number}} {
        return {message: "Coin generated", "payload": {x: Math.random()*1390, y: Math.random()*790}};
    }
}