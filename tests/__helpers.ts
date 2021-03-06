import { PrismaClient } from "@prisma/client";
import { execSync } from "child_process";
import { GraphQLClient } from "graphql-request";
import { join } from "path";
import argon2 from "argon2";
import { db } from "../src/api/db";
import { startServer } from "../src/api/app";

const fetch = require("fetch-cookie/node-fetch")(require("node-fetch"));

let server: any;

type TestContext = {
  client: GraphQLClient;
  db: PrismaClient;
};
export function createTestContext(): TestContext {
  let ctx = {} as TestContext;
  const graphqlCtx = graphqlTestContext();
  const prismaCtx = prismaTestContext();
  beforeAll(async () => {
    const client = await graphqlCtx.before();
    const db = await prismaCtx.before();
    Object.assign(ctx, {
      client,
      db,
    });
  });
  afterAll(async () => {
    await graphqlCtx.after();
    await prismaCtx.after();
    await server.close();
  });
  return ctx;
}
function graphqlTestContext() {
  return {
    async before() {
      server = startServer();
      const { port } = (await server.address()) as any;
      console.log(port);
      // Close the Prisma Client connection when the Apollo Server is closed
      server.on("close", async () => {
        db.$disconnect();
      });
      return new GraphQLClient(`http://localhost:${port}/graphql`, { fetch });
    },
    async after() {
      server?.close();
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

      execSync(`prisma migrate deploy --preview-feature`, {
        env: {
          ...process.env,
          DATABASE_URL: databaseUrl,
        },
      });
      // Construct a new Prisma Client connected to the generated Postgres schema
      await seedData(prismaClient);
      return prismaClient;
    },
    async after() {
      // Release the Prisma Client connection
      await prismaClient?.$disconnect();
    },
  };
}

async function seedData(prisma: PrismaClient) {
  let users: Promise<any>[] = [];
  let clusters: Promise<any>[] = [];
  let schools: Promise<any>[] = [];
  let sets: Promise<any>[] = [];
  let sheets: Promise<any>[] = [];

  users.push(
    prisma.user.create({
      data: {
        username: "user",
        password: await argon2.hash("user"),
        confirmed: true,
      },
    })
  );

  users.push(
    prisma.user.create({
      data: {
        username: "admin",
        password: await argon2.hash("admin"),
        isAdmin: true,
        confirmed: true,
      },
    })
  );

  users.push(
    prisma.user.create({
      data: {
        username: "new",
        password: await argon2.hash("new"),
        confirmed: false,
        isAdmin: false,
      },
    })
  );

  clusters.push(
    prisma.school.create({
      data: {
        SchoolID: "123",
        SchoolName: "School One",
      },
    })
  );

  schools.push(
    prisma.school.create({
      data: {
        SchoolID: "456",
        SchoolName: "School Two",
        Cluster: { connect: { SchoolID: "123" } },
      },
    })
  );

  schools.push(
    prisma.school.create({
      data: {
        SchoolID: "789",
        SchoolName: "School Three",
        Cluster: { connect: { SchoolID: "123" } },
      },
    })
  );

  schools.push(
    prisma.school.update({
      where: { SchoolID: "123" },
      data: { Cluster: { connect: { SchoolID: "123" } } },
    })
  );

  sets.push(
    prisma.set.create({
      data: {
        ID: "18841014-590-NEW-R",
        Schools: { connect: { SchoolID: "123" } },
        Title: "Test Set 1",
      },
    })
  );

  sets.push(
    prisma.set.create({
      data: {
        ID: "20010101-459-NEW-R",
        Schools: { connect: { SchoolID: "123" } },
        Title: "Title 2",
      },
    })
  );

  sheets.push(
    prisma.sheet.create({
      data: {
        Sheet_Number: "A-101",
        Title: "Floor Plan",
        Sets: { connect: { Key: 1 } },
      },
    })
  );

  sheets.push(
    prisma.miscSheet.create({
      data: {
        Title: "Misc Sheet 1",
        Sheet_Number: "A-101",
        Schools: { connect: { SchoolID: "123" } },
      },
    })
  );

  await Promise.all([...users, ...clusters]);
  await Promise.all([...schools, ...sets]);
  await Promise.all([...sheets]);
}
