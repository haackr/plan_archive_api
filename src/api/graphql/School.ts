import { extendType, nonNull, objectType, stringArg } from "nexus";
import { Prisma } from "@prisma/client";
import { applyMiddleware } from "../../util/applyMiddleware";
import { isLoggedIn } from "../auth";

export const Schools = objectType({
  name: "Schools",
  definition(t) {
    t.model.id();
    t.model.SchoolID();
    t.model.SchoolName();
    t.model.ClusterID();
    t.model.Cluster();
    t.model.ClusterSchools();
    t.model.SetsData();
    t.model.SheetsData();
    t.model.MiscSheetsData();
    // t.list.field("sets", {
    //   type: "SetsData",
    //   resolve(root, _args, ctx) {
    //     return ctx.db.setsData.findMany({
    //       where: { LocationNumber: { contains: root.SchoolID } },
    //     });
    //   },
    // });
    // t.list.field("misc_sheets", {
    //   type: "MiscSheetsData",
    //   resolve(root, _args, ctx) {
    //     return ctx.db.miscSheetsData.findMany({
    //       where: { LocationNumber: { contains: root.SchoolID } },
    //     });
    //   },
    // });
  },
});

export const SchoolQuery = extendType({
  type: "Query",
  definition(t) {
    t.crud.schools();
    t.nonNull.list.field("allSchools", {
      type: "Schools",
      resolve(_root, _args, ctx) {
        return ctx.db.schools.findMany();
      },
    });
    t.nonNull.list.field("allClusters", {
      type: "Schools",
      resolve(_root, _args, ctx) {
        return ctx.db.$queryRaw(
          "SELECT * from Archive.Schools WHERE SchoolId = ClusterId"
        );
      },
    });
  },
});

export const SchoolMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.crud.createOneSchools({ resolve: isLoggedIn });
    t.crud.deleteOneSchools({ resolve: isLoggedIn });
    t.crud.updateOneSchools({ resolve: isLoggedIn });

    t.nonNull.field("createSchool", {
      type: "Schools",
      args: {
        SchoolId: nonNull(stringArg()),
        SchoolName: nonNull(stringArg()),
        ClusterID: stringArg(),
      },
      resolve: applyMiddleware(isLoggedIn, async (_root, args, ctx) => {
        const existingSchool = await ctx.db.schools.findFirst({
          where: { SchoolID: args.SchoolId },
        });
        if (existingSchool !== null) {
          throw new Error(
            `School with id ${existingSchool.toString()} already exists!`
          );
        }
        let data: Prisma.SchoolsCreateInput = {
          SchoolID: args.SchoolId,
          SchoolName: args.SchoolName,
        };
        if (args.ClusterID)
          data.Cluster = { connect: { SchoolID: args.ClusterID } };
        const newSchool = await ctx.db.schools.create({ data });
        return newSchool;
      }),
    });

    t.nonNull.field("deleteSchool", {
      type: "Schools",
      args: {
        SchoolId: nonNull(stringArg()),
      },
      async resolve(_root, args, ctx) {
        return await ctx.db.schools.delete({
          where: { SchoolID: args.SchoolId },
        });
      },
    });

    t.nonNull.field("updateSchool", {
      type: "Schools",
      args: {
        SchoolId: nonNull(stringArg()),
        NewSchoolId: stringArg(),
        SchoolName: stringArg(),
        ClusterId: stringArg(),
      },
      async resolve(_root, args, ctx) {
        let data: Prisma.SchoolsUpdateInput = {};
        if (args.NewSchoolId) data.SchoolID = args.NewSchoolId;
        if (args.SchoolName) data.SchoolName = args.SchoolName;
        if (args.ClusterId)
          data.Cluster = { connect: { SchoolID: args.ClusterId } };
        return await ctx.db.schools.update({
          where: { SchoolID: args.SchoolId },
          data,
        });
      },
    });
  },
});
