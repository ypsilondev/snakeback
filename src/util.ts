export class Util{
    static createNewCoin(): {message: string, payload: {x: number, y: number}} {
        return {message: "Coin generated", "payload": {x: Math.random()*1380+10, y: Math.random()*780+10}};
    }
}