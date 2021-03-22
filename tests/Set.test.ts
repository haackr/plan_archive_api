import { gql } from "graphql-request";
import { createTestContext } from "./__helpers";

const ctx = createTestContext();

describe("Sets Tests", () => {
  it("lets the user query sets", async () => {
    const sets = await ctx.client.request(gql`
      query {
        sets {
          ID
          Title
        }
      }
    `);
    expect(sets.sets.length).toBeGreaterThan(0);
  });

  let addedKey: number;

  it("lets the user add sets if they are logged in", async () => {
    await ctx.client.request(gql`
      mutation {
        login(username: "user", password: "user") {
          username
        }
      }
    `);
    const newSet = await ctx.client.request(gql`
      mutation {
        createOneSet(
          data: {
            ID: "19900513-550-NEW-R"
            Title: "Test Title"
            Schools: { connect: { SchoolID: "123" } }
          }
        ) {
          ID
          Key
          Title
        }
      }
    `);
    expect(newSet.createOneSet.ID).toEqual("19900513-550-NEW-R");
    addedKey = newSet.createOneSet.Key;
  });

  it("lets the user modify sets if they are logged in", async () => {
    const modifiedSet = await ctx.client.request(gql`
      mutation {
        updateOneSet(
          where: {Key: ${addedKey}},
          data: {
            Title: {set: "Modified Title"}
        }){
          Title
        }
      }
    `);
    expect(modifiedSet.updateOneSet.Title).toBe("Modified Title");
  });

  it("lets the user delete sets if they are logged in", async () => {
    const deletedSet = await ctx.client.request(gql`
      mutation {
        deleteOneSet(where: {
          Key: ${addedKey}
        }){
          Title
          Key
          ID
        }
      }
    `);
    expect(deletedSet.deleteOneSet.Key).toBe(addedKey);

    const setInDb = await ctx.db.set.findUnique({
      where: { Key: addedKey },
    });
    expect(setInDb).toBeNull();
  });

  it("does not let the user do CUD operations when not logged in", async () => {
    await ctx.client.request(gql`
      mutation {
        logout {
          username
        }
      }
    `);

    const errMessage = "must be logged in";

    let res;
    try {
      res = await ctx.client.request(gql`
        mutation {
          createOneSet(
            data: {
              ID: "19900513-550-NEW-R"
              Title: "Test Title"
              Schools: { connect: { SchoolID: "123" } }
            }
          ) {
            ID
            Key
            Title
          }
        }
      `);
    } catch (error) {
      res = error;
    }
    expect(res.response.errors[0].message).toContain(errMessage);
    res = null;

    try {
      res = await ctx.client.request(gql`
      mutation {
        updateOneSet(
          where: {Key: ${addedKey}},
          data: {
            Title: {set: "Modified Title"}
        }){
          Title
        }
      }
    `);
    } catch (error) {
      res = error;
    }
    expect(res.response.errors[0].message).toContain(errMessage);
    res = null;

    try {
      res = await ctx.client.request(gql`
        mutation {
          deleteOneSet(where: { Key: 1 }) {
            Title
            Key
            ID
          }
        }
      `);
    } catch (error) {
      res = error;
    }
    expect(res.response.errors[0].message).toContain(errMessage);
  });

  it("does not let the user do CUD operations when not confirmed", async () => {
    await ctx.client.request(gql`
      mutation {
        login(username: "new", password: "new") {
          username
        }
      }
    `);

    const errMessage = "account must be confirmed";

    let res;
    try {
      res = await ctx.client.request(gql`
        mutation {
          createOneSet(
            data: {
              ID: "19900513-550-NEW-R"
              Title: "Test Title"
              Schools: { connect: { SchoolID: "123" } }
            }
          ) {
            ID
            Key
            Title
          }
        }
      `);
    } catch (error) {
      res = error;
    }
    expect(res.response.errors[0].message).toContain(errMessage);
    res = null;

    try {
      res = await ctx.client.request(gql`
      mutation {
        updateOneSet(
          where: {Key: ${addedKey}},
          data: {
            Title: {set: "Modified Title"}
        }){
          Title
        }
      }
    `);
    } catch (error) {
      res = error;
    }
    expect(res.response.errors[0].message).toContain(errMessage);
    res = null;

    try {
      res = await ctx.client.request(gql`
        mutation {
          deleteOneSet(where: { Key: 1 }) {
            Title
            Key
            ID
          }
        }
      `);
    } catch (error) {
      res = error;
    }
    expect(res.response.errors[0].message).toContain(errMessage);
  });
});
