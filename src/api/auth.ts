import { Resolver } from "../types/graphql-utils";
import { db } from "./db";

const secret = process.env.APP_SECRET || "";

export interface User {
  id: string;
  username?: string;
  isAdmin?: boolean;
}

export async function isLoggedIn(
  root: any,
  args: any,
  ctx: any,
  info: any,
  originalResolver: Resolver
) {
  if (ctx.session.userId) {
    const user = await db.user.findUnique({
      where: { id: ctx.session.userId },
    });
    if (!user?.confirmed)
      throw new Error("Your account must be confirmed before you can do that");
    const res = await originalResolver(root, args, ctx, info);
    return res;
  } else {
    throw new Error("You must be logged in to do that!");
  }
}

export async function isAdmin(
  root: any,
  args: any,
  ctx: any,
  info: any,
  originalResolver: Resolver
) {
  if (ctx.session.userId) {
    const user = await db.user.findUnique({
      where: { id: ctx.session.userId },
    });
    if (user && user.isAdmin) {
      const res = await originalResolver(root, args, ctx, info);
      return res;
    }
  }
  throw new Error("You must be an admin to do that!");
}
