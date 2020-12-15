import { createTestContext } from "./__helpers";

const ctx = createTestContext();

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
        "allSchools": Array [
          Object {
            "SchoolName": "School One",
          },
          Object {
            "SchoolName": "School Two",
          },
          Object {
            "SchoolName": "School Three",
          },
        ],
      }
    `);
  });
});
