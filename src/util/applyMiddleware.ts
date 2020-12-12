import { Middleware, Resolver } from "../types/graphql-utils";

export const applyMiddleware = (middleware: Middleware, resolver: Resolver) => (
  root: any,
  args: any,
  ctx: any,
  info: any
) => middleware(root, args, ctx, info, resolver);
