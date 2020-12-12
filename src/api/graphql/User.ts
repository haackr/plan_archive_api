import { extendType, nonNull, objectType, stringArg } from "@nexus/schema";
import { Prisma } from "@prisma/client";
import argon2 from "argon2";
import { applyMiddleware } from "../../util/applyMiddleware";
import { isAdmin, isLoggedIn } from "../auth";

export const User = objectType({
  name: "User",
  definition(t) {
    t.model.id();
    t.model.username();
    t.model.isAdmin({
      resolve: isAdmin,
    });
  },
});

export const Query = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.list.field("allUsers", {
      type: "User",
      resolve: applyMiddleware(isLoggedIn, (_root, _args, ctx) => {
        return ctx.db.user.findMany();
      }),
    });
  },
});

export const Mutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("register", {
      type: "User",
      args: {
        username: nonNull(stringArg()),
        password: nonNull(stringArg()),
        passwordVerify: nonNull(stringArg()),
      },
      async resolve(_root, args, ctx) {
        if (args.password != args.passwordVerify) {
          throw new Error("Passwords do not match!");
        }
        const existingUser = await ctx.db.user.findUnique({
          where: { username: args.username },
        });
        if (existingUser) {
          throw new Error("User with that username already exists!");
        }
        const hashedPass = await argon2.hash(args.password);
        const data: Prisma.UserCreateInput = {
          username: args.username.toLowerCase(),
          password: hashedPass,
        };
        const user = await ctx.db.user.create({ data });
        ctx.session.userId = user.id;
        return user;
      },
    });

    t.field("login", {
      type: "User",
      args: {
        username: nonNull(stringArg()),
        password: nonNull(stringArg()),
      },
      async resolve(_root, args, ctx) {
        const user = await ctx.db.user.findUnique({
          where: { username: args.username.toLowerCase() },
        });
        if (!user) throw new Error("Username or password incorrect.");
        const passwordMatch = await argon2.verify(user.password, args.password);
        if (!passwordMatch) throw new Error("Username or password incorrect");
        ctx.session.userId = user.id;
        return user;
      },
    });
  },
});
