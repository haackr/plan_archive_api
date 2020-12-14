import { createTestContext } from "./__helpers";

const ctx = createTestContext();

beforeAll(async () => {
  await ctx.client.request(`
    mutation{
      register(username: "ryan", password: "ryan", passwordVerify: "ryan"){
        username
      }
    }
  `);
});

describe("School Resolver Tests", () => {
  it("can query a list of schools", async () => {
    const schools = await ctx.client.request(`
      query {
        allSchools {
          SchoolName
        }
      }
    `);
    expect(schools).toMatchInlineSnapshot(`
      Object {
        "allSchools": Array [],
      }
    `);
  });
});
