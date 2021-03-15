import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import session from "express-session";
import redisStore from "connect-redis";
import redis from "redis";
import { server } from "./server";

export function startServer() {
  dotenv.config();

  const app = express();

  const corsOptions = {
    credentials: true,
  };

  app.use(cors(corsOptions));

  const store = redisStore(session);
  const redisClient = redis.createClient();

  app.use(
    session({
      name: "ISTHISMYSESSION",
      secret: process.env.APP_SECRET || "",
      resave: false,
      saveUninitialized: false,
      store: new store({ client: redisClient }),
      cookie: {
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      },
    })
  );

  server.applyMiddleware({ app });

  app.get("/", (req, res) => {
    res.redirect("/graphql");
  });

  const expressServer = app.listen(
    { port: process.env.NODE_ENV === "test" ? 0 : 4000 },
    () => {
      const { port } = expressServer.address() as any;
      console.log(`🚀 Server ready at http://localhost:${port}`);
    }
  );
  return expressServer;
}
