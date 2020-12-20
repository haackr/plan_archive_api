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
  });
});
