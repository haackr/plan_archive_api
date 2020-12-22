import { gql } from "graphql-request";
import { createTestContext } from "./__helpers";

const ctx = createTestContext();

describe("School Resolver Tests", () => {
  it("can query a list of schools", async () => {
    const schools = await ctx.client.request(gql`
      query {
        allSchools {
          SchoolName
        }
      }
    `);
    expect(schools.allSchools.length).toBeGreaterThan(0);
    expect(schools.allSchools).toContainEqual({
      SchoolName: "School One",
    });
  });

  it("can query a list of clusters", async () => {
    const clusters = await ctx.client.request(gql`
      query {
        allClusters {
          SchoolName
          ClusterSchools {
            SchoolName
          }
        }
      }
    `);

    expect(clusters.allClusters.length).toBeGreaterThan(0);
    expect(clusters.allClusters[0].SchoolName).toEqual("School One");
    expect(clusters.allClusters[0].ClusterSchools).toContainEqual({
      SchoolName: "School One",
    });
  });

  it("lets the user create a new school if they are logged in", async () => {
    // First log in the user
    await ctx.client.request(gql`
      mutation {
        login(username: "user", password: "user") {
          username
        }
      }
    `);

    // Next create a school
    const newSchool = await ctx.client.request(gql`
      mutation {
        createOneSchools(data: { SchoolID: "TST", SchoolName: "Test School" }) {
          SchoolName
          SchoolID
        }
      }
    `);

    expect(newSchool).toBeTruthy();
    expect(newSchool.createOneSchools.SchoolName).toEqual("Test School");
    expect(newSchool.createOneSchools.SchoolID).toEqual("TST");
  });

  it("lets the user update a school if they are logged in", async () => {
    const updatedSchool = await ctx.client.request(gql`
      mutation {
        updateOneSchools(
          where: { SchoolID: "TST" }
          data: { SchoolName: { set: "UPDATED SCHOOL NAME" } }
        ) {
          SchoolName
          SchoolID
        }
      }
    `);

    expect(updatedSchool.updateOneSchools).toEqual({
      SchoolName: "UPDATED SCHOOL NAME",
      SchoolID: "TST",
    });
  });

  it("lets the user delete a school if they are logged in", async () => {
    const deletedSchool = await ctx.client.request(gql`
      mutation {
        deleteOneSchools(where: { SchoolID: "TST" }) {
          SchoolID
          SchoolName
        }
      }
    `);

    expect(deletedSchool.deleteOneSchools).toHaveProperty("SchoolID");
    expect(deletedSchool.deleteOneSchools.SchoolID).toEqual("TST");

    const schoolInDb = await ctx.db.schools.findUnique({
      where: { SchoolID: deletedSchool.deleteOneSchools.SchoolID },
    });
    expect(schoolInDb).toBeFalsy();
  });

  it("does not let the user do CUD operations when logged out", async () => {
    // first logout
    await ctx.client.request(gql`
      mutation {
        logout {
          username
        }
      }
    `);

    let res;
    try {
      res = await ctx.client.request(gql`
        mutation {
          createOneSchools(
            data: { SchoolID: "TST", SchoolName: "Test School" }
          ) {
            SchoolName
            SchoolID
          }
        }
      `);
    } catch (error) {
      res = error;
    }

    expect(res.response.errors[0].message).toContain("You must be logged in");
    res = null;

    try {
      res = await ctx.client.request(gql`
        mutation {
          updateOneSchools(
            where: { SchoolID: "TST" }
            data: { SchoolName: { set: "UPDATED SCHOOL NAME" } }
          ) {
            SchoolName
            SchoolID
          }
        }
      `);
    } catch (error) {
      res = error;
    }
    expect(res.response.errors[0].message).toContain("You must be logged in");
    res = null;

    try {
      res = await ctx.client.request(`
      mutation {
        deleteOneSchools(where: {SchoolID: "TST"}) {
          SchoolID
          SchoolName
        }
      }
    `);
    } catch (error) {
      res = error;
    }
    expect(res.response.errors[0].message).toContain("You must be logged in");
  });

  it("does not let the user do CUD operations when unconfirmed", async () => {
    // first logout
    await ctx.client.request(gql`
      mutation {
        login(username: "new", password: "new") {
          username
        }
      }
    `);

    let res;
    try {
      res = await ctx.client.request(gql`
        mutation {
          createOneSchools(
            data: { SchoolID: "TST", SchoolName: "Test School" }
          ) {
            SchoolName
            SchoolID
          }
        }
      `);
    } catch (error) {
      res = error;
    }

    expect(res.response.errors[0].message).toContain(
      "account must be confirmed"
    );
    res = null;

    try {
      res = await ctx.client.request(gql`
        mutation {
          updateOneSchools(
            where: { SchoolID: "TST" }
            data: { SchoolName: { set: "UPDATED SCHOOL NAME" } }
          ) {
            SchoolName
            SchoolID
          }
        }
      `);
    } catch (error) {
      res = error;
    }
    expect(res.response.errors[0].message).toContain(
      "account must be confirmed"
    );
    res = null;

    try {
      res = await ctx.client.request(`
      mutation {
        deleteOneSchools(where: {SchoolID: "TST"}) {
          SchoolID
          SchoolName
        }
      }
    `);
    } catch (error) {
      res = error;
    }
    expect(res.response.errors[0].message).toContain(
      "account must be confirmed"
    );
  });
});
