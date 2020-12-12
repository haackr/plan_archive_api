import { makeSchema } from "@nexus/schema";
import { nexusPrisma } from "nexus-plugin-prisma";
import { Context } from "./context";
import { join } from "path";
import * as types from "./graphql";

export const schema = makeSchema({
  types,
  plugins: [
    nexusPrisma({
      prismaClient: (ctx: Context) => ctx.db,
      experimentalCRUD: true,
    }),
  ],
  outputs: {
    typegen: join(__dirname, "..", "nexus-typegen.ts"),
    schema: join(__dirname, "..", "schema.graphql"),
  },
  typegenAutoConfig: {
    sources: [
      {
        source: join(__dirname, "./context.ts"),
        alias: "ContextModule",
      },
    ],
    contextType: "ContextModule.Context",
  },
});
