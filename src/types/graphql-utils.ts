import { Context } from "nexus-plugin-prisma/dist/utils";

export type Resolver = (root: any, args: any, ctx: Context, info: any) => any;

export type Middleware = (
  root: any,
  args: any,
  ctx: Context,
  info: any,
  resolver: Resolver
) => any;
