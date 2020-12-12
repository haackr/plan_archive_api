import { PrismaClient } from "@prisma/client";
import { db } from "./db";
import { Session, SessionData } from "express-session";

export interface Context {
  db: PrismaClient;
  session: any;
}

export const context = ({ req }: any): Context => {
  const session = req.session;
  return { db, session };
};
