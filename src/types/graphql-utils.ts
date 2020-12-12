export type Resolver = (root: any, args: any, ctx: any, info: any) => any;

export type Middleware = (
  root: any,
  args: any,
  ctx: any,
  info: any,
  resolver: Resolver
) => any;
