import { createTestContext } from "./__helpers";

const ctx = createTestContext();

describe("Sets Tests", () => {
  it("lets the user query sets", async () => {
    const sets = await ctx.client.request(`
      query {
        setsData {
          ID
          Title
        }
      }
    `);
    expect(sets.setsData.length).toBeGreaterThan(0);
  });

  let addedKey: number;

  it("lets the user add sets if they are logged in", async () => {
    await ctx.client.request(`
      mutation{
        login(username: "user", password: "user") {
          username
        }
      }
    `);
    const newSet = await ctx.client.request(`
      mutation {
        createOneSetsData(data: {
          ID: "19900513-550-NEW-R",
          Title: "Test Title",
          Schools: {connect: {SchoolID: "123"}}
        }){
          ID
          Key
          Title
        }
      }
    `);
    expect(newSet.createOneSetsData.ID).toEqual("19900513-550-NEW-R");
    addedKey = newSet.createOneSetsData.Key;
  });

  it("lets the user modify sets if they are logged in", async () => {
    const modifiedSet = await ctx.client.request(`
      mutation {
        updateOneSetsData(
          where: {Key: ${addedKey}},
          data: {
            Title: {set: "Modified Title"}
        }){
          Title
        }
      }
    `);
    expect(modifiedSet.updateOneSetsData.Title).toBe("Modified Title");
  });

  it("lets the user delete sets if they are logged in", async () => {
    const deletedSet = await ctx.client.request(`
      mutation {
        deleteOneSetsData(where: {
          Key: ${addedKey}
        }){
          Title
          Key
          ID
        }
      }
    `);
    expect(deletedSet.deleteOneSetsData.Key).toBe(addedKey);

    const setInDb = await ctx.db.setsData.findUnique({
      where: { Key: addedKey },
    });
    expect(setInDb).toBeNull();
  });

  it("does not let the user do CUD operations when not logged in", async () => {
    await ctx.client.request(`
      mutation {
        logout {
          username
        }
      }
    `);

    let res;
    try {
      res = await ctx.client.request(`
      mutation {
        createOneSetsData(data: {
          ID: "19900513-550-NEW-R",
          Title: "Test Title",
          Schools: {connect: {SchoolID: "123"}}
        }){
          ID
          Key
          Title
        }
      }
    `);
    } catch (error) {
      res = error;
    }
    expect(res.response.errors[0].message).toContain("must be logged in");
    res = null;

    try {
      res = await ctx.client.request(`
      mutation {
        updateOneSetsData(
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
    expect(res.response.errors[0].message).toContain("must be logged in");
    res = null;

    try {
      res = await ctx.client.request(`
      mutation {
        deleteOneSetsData(where: {
          Key: 1
        }){
          Title
          Key
          ID
        }
      }
    `);
    } catch (error) {
      res = error;
    }
    expect(res.response.errors[0].message).toContain("must be logged in");
  });
});
