import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import session from "express-session";
import { server } from "./server";

dotenv.config();

const app = express();

const corsOptions = {
  credentials: true,
  origin: "http://localhost:4000",
};

app.use(cors(corsOptions));

app.use(
  session({
    name: "ISTHISMYSESSION",
    secret: process.env.APP_SECRET || "",
    resave: false,
    saveUninitialized: false,
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

app.listen({ port: 4000 }, () => {
  console.log(`🚀 Server ready`);
});
