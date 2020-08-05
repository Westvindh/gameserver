import { Room, Client, generateId } from "colyseus";
import { Schema, type, MapSchema, ArraySchema } from "@colyseus/schema";
import { verifyToken, User, IUser } from "@colyseus/social";

class Entity extends Schema {
  @type("number")
  x: number = 0;

  @type("number")
  y: number = 0;
}

// An abstract player object, demonstrating a potential 2D world position
export class Player extends Entity {
  @type("boolean")
  connected: boolean = true;
}

// Our custom game state, an ArraySchema of type Player only at the moment
export class State extends Schema {
  @type({ map: Entity })
  entities = new MapSchema<Entity>();
}

class Message extends Schema {
  @type("number") num;
  @type("string") str;
}

export class MyRoom extends Room<State> {

  onCreate (options: any) {
    console.log("MyRoom created!", options);

    this.setState(new State());
    
    this.AddPlayer();

    this.setMetadata({
      str: "hello",
      number: 10
    });

    this.setPatchRate(1000 / 20);
    this.setSimulationInterval((dt) => this.update(dt));

    this.onMessage(0, (client, message) => {
      client.send(0, message);
    });
    
    this.onMessage("move", (client, data) => {
      const entities: Entity = this.state.entities[client.sessionId];
      entities.x += data.integer;
      console.log(client.sessionId + " at, x: " + entities.x, "message " + data.str);
    });

    this.onMessage("*", (client, type, message) => {
      console.log(`received message "${type}" from ${client.sessionId}:`, message);
    });
  }

  AddPlayer () {
      const player = new Player();
      player.x = Math.random() * 2;
      player.y = Math.random() * 2;
      this.state.entities[generateId()] = player;
    }

  async onAuth (client, options) {
    console.log("onAuth(), options!", options);
    return await User.findById(verifyToken(options.token)._id);
  }

  onJoin (client: Client, options: any, user: IUser) {
    console.log("client joined!", client.sessionId);
    this.state.entities[client.sessionId] = new Player();

    client.send("type", { hello: true });
  }

  async onLeave (client: Client, consented: boolean) {
    this.state.entities[client.sessionId].connected = false;

    try {
      if (consented) {
        throw new Error("consented leave!");
      }

      console.log("let's wait for reconnection!")
      const newClient = await this.allowReconnection(client, 10);
      console.log("reconnected!", newClient.sessionId);

    } catch (e) {
      console.log("disconnected!", client.sessionId);
      delete this.state.entities[client.sessionId];
    }
  }


  update (dt?: number) {
    // console.log("num clients:", Object.keys(this.clients).length);
  }

  onDispose () {
    console.log("disposing DemoRoom...");
  }

}