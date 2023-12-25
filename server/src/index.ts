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
} from "./constants";
import { Server } from "socket.io";
import { randomUUID } from "crypto";
import { ShoppingListItem } from "./types";

declare module "fastify" {
  interface FastifyInstance {
    io: Server<{
      [NEW_ITEM_CHANNEL]: (shoppingListItem: ShoppingListItem) => Promise<void>;
      [DELETE_ITEM_CHANEL]: (itemId: number) => Promise<void>;
      [COMPLETE_ITEM_CHANNEL]: (
        ShoppingListItem: ShoppingListItem
      ) => Promise<void>;
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
    io.on(NEW_ITEM_CHANNEL, async (shoppingListItem: ShoppingListItem) => {
      if (!shoppingListItem) {
        return;
      }

      console.log("add item", shoppingListItem);

      await publisher.publish(
        NEW_ITEM_CHANNEL,
        JSON.stringify(shoppingListItem)
      );
    });

    io.on(COMPLETE_ITEM_CHANNEL, async (shoppingListItem: ShoppingListItem) => {
      if (!shoppingListItem) {
        return;
      }

      console.log("complete item", shoppingListItem);

      await publisher.publish(
        COMPLETE_ITEM_CHANNEL,
        JSON.stringify(shoppingListItem)
      );
    });

    io.on(DELETE_ITEM_CHANEL, async (itemId: number) => {
      if (!itemId) {
        return;
      }

      console.log("delete item", itemId);

      await publisher.publish(DELETE_ITEM_CHANEL, JSON.stringify(itemId));
    });
  });

  subscriber.subscribe(...CHANNELS, (err, count) => {
    if (err) {
      console.error("Error subscribing to channels", err);
      return;
    }
  });

  subscriber.on("message", (channel, text) => {
    if (CHANNELS.includes(channel as Channel)) {
      app.io.emit(channel as Channel, {
        ...JSON.parse(text),
        id: randomUUID(),
      });

      return;
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
