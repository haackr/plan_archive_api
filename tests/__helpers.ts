import { PrismaClient } from "@prisma/client";
import { execSync } from "child_process";
import { GraphQLClient } from "graphql-request";
import { nanoid } from "nanoid";
import { join } from "path";
import { db } from "../src/api/db";
import { startServer } from "../src/api/app";

type TestContext = {
  client: GraphQLClient;
  db: PrismaClient;
};
export function createTestContext(): TestContext {
  let ctx = {} as TestContext;
  const graphqlCtx = graphqlTestContext();
  const prismaCtx = prismaTestContext();
  beforeEach(async () => {
    const client = await graphqlCtx.before();
    const db = await prismaCtx.before();
    Object.assign(ctx, {
      client,
      db,
    });
  });
  afterEach(async () => {
    await graphqlCtx.after();
    await prismaCtx.after();
  });
  return ctx;
}
function graphqlTestContext() {
  return {
    async before() {
      const server = startServer();
      const { port } = (await server.address()) as any;
      console.log(port);
      // Close the Prisma Client connection when the Apollo Server is closed
      server.on("close", async () => {
        db.$disconnect();
      });
      return new GraphQLClient(`http://localhost:${port}/graphql`);
    },
    async after() {
      // server?.close();
    },
  };
}
function prismaTestContext() {
  const prismaBinary = join(__dirname, "..", "node_modules", ".bin", "prisma");
  let schema = "";
  let databaseUrl = "";
  let prismaClient: null | PrismaClient = null;
  return {
    async before() {
      // Generate a unique schema identifier for this test context
      schema = `test_${nanoid()}`;
      // Generate the pg connection string for the test schema
      databaseUrl = `${process.env.TEST_DATABASE_URL}`;
      // Set the required environment variable to contain the connection string
      // to our database test schema
      process.env.DATABASE_URL = databaseUrl;
      prismaClient = new PrismaClient();
      // Run the migrations to ensure our schema has the required structure

      await prismaClient?.$queryRaw(
        `DROP TABLE IF EXISTS plan_archive_test.Archive._prisma_migrations`
      );
      await prismaClient?.$queryRaw(
        `DROP TABLE IF EXISTS plan_archive_test.Archive.[User]`
      );
      await prismaClient?.$queryRaw(
        `DROP TABLE IF EXISTS plan_archive_test.Archive.MiscSheetsData`
      );
      await prismaClient?.$queryRaw(
        `DROP TABLE IF EXISTS plan_archive_test.Archive.SheetsData`
      );
      await prismaClient?.$queryRaw(
        `DROP TABLE IF EXISTS plan_archive_test.Archive.SetsData`
      );
      await prismaClient?.$queryRaw(
        `DROP TABLE IF EXISTS plan_archive_test.Archive.Schools`
      );
      await prismaClient?.$queryRaw(
        `DROP TABLE IF EXISTS plan_archive_test.Archive.ArchAdmin`
      );

      execSync(`${prismaBinary} migrate deploy --preview-feature`, {
        env: {
          ...process.env,
          DATABASE_URL: databaseUrl,
        },
      });
      // Construct a new Prisma Client connected to the generated Postgres schema
      return prismaClient;
    },
    async after() {
      // Drop the schema after the tests have completed

      // Release the Prisma Client connection
      await prismaClient?.$disconnect();
    },
  };
}
