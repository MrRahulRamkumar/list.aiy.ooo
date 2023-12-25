import { fastifyCors } from "@fastify/cors";
import fastify from "fastify";
import fastifyIO from "fastify-socket.io";
import Redis from "ioredis";
import {
  COMPLETE_ITEM_CHANNEL,
  DELETE_ITEM_CHANEL,
  NEW_ITEM_CHANNEL,
  CHANNELS,
  Channel,
  JOIN_ROOM_CHANNEL,
} from "./constants";
import { Server } from "socket.io";
import { randomUUID } from "crypto";
import { ShoppingListItem } from "./types";

declare module "fastify" {
  interface FastifyInstance {
    io: Server<{
      [JOIN_ROOM_CHANNEL]: (shoppingListSlug: string) => void;
      [NEW_ITEM_CHANNEL]: (payload: {
        shoppingListSlug: string;
        shoppingListItem: ShoppingListItem;
      }) => Promise<void>;
      [DELETE_ITEM_CHANEL]: (payload: {
        shoppingListSlug: string;
        shoppingListItemId: number;
      }) => Promise<void>;
      [COMPLETE_ITEM_CHANNEL]: (payload: {
        shoppingListSlug: string;
        shoppingListItem: ShoppingListItem;
      }) => Promise<void>;
    }>;
  }
}

const UPSTASH_REDIS_REST_URL = process.env.UPSTASH_REDIS_REST_URL;
if (!UPSTASH_REDIS_REST_URL) {
  throw new Error("UPSTASH_REDIS_REST_URL is required");
}

const publisher = new Redis(UPSTASH_REDIS_REST_URL);
const subscriber = new Redis(UPSTASH_REDIS_REST_URL);

async function buildServer() {
  const app = fastify();
  await app.register(fastifyCors, {
    origin: process.env.CORS_ORIGIN,
  });
  await app.register(fastifyIO);

  app.get("/health-check", () => {
    return {
      status: "ok",
      port: process.env.PORT,
    };
  });

  app.io.on("connection", async (io) => {
    io.on(JOIN_ROOM_CHANNEL, async (shoppingListSlug: string) => {
      console.log("join", shoppingListSlug);

      // Get the room the client is currently in
      const currentRoom = await publisher.get(io.id);

      // If the client is in a room, remove it from that room
      if (currentRoom) {
        io.leave(currentRoom);
      }

      // Add the client to the new room
      io.join(shoppingListSlug);

      // Store the room the client is in in Redis
      await publisher.set(io.id, shoppingListSlug);
    });

    io.on(NEW_ITEM_CHANNEL, async (payload) => {
      console.log("add item", payload);

      await publisher.publish(NEW_ITEM_CHANNEL, JSON.stringify(payload));
    });

    io.on(COMPLETE_ITEM_CHANNEL, async (payload) => {
      console.log("complete item", payload);

      await publisher.publish(COMPLETE_ITEM_CHANNEL, JSON.stringify(payload));
    });

    io.on(DELETE_ITEM_CHANEL, async (payload) => {
      console.log("delete item", payload);

      await publisher.publish(DELETE_ITEM_CHANEL, JSON.stringify(payload));
    });
  });

  subscriber.subscribe(...CHANNELS, (err, count) => {
    if (err) {
      console.error("Error subscribing to channels", err);
      return;
    }
  });

  subscriber.on("message", (channel, text) => {
    if (channel === NEW_ITEM_CHANNEL) {
      const payload = JSON.parse(text) as {
        shoppingListSlug: string;
        shoppingListItem: ShoppingListItem;
      };
      app.io.to(payload.shoppingListSlug).emit(NEW_ITEM_CHANNEL, payload);
    } else if (channel === COMPLETE_ITEM_CHANNEL) {
      const payload = JSON.parse(text) as {
        shoppingListSlug: string;
        shoppingListItem: ShoppingListItem;
      };
      app.io.to(payload.shoppingListSlug).emit(COMPLETE_ITEM_CHANNEL, payload);
    } else if (channel === DELETE_ITEM_CHANEL) {
      const payload = JSON.parse(text) as {
        shoppingListSlug: string;
        shoppingListItemId: number;
      };
      app.io.to(payload.shoppingListSlug).emit(DELETE_ITEM_CHANEL, payload);
    }
  });

  return app;
}

async function main() {
  const app = await buildServer();

  try {
    await app.listen({
      port: parseInt(process.env.PORT || "4000"),
      host: process.env.HOST || "0.0.0.0",
    });

    console.log(
      `Server started at http://${process.env.HOST}:${process.env.PORT}`
    );
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

main();
