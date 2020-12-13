import { createTestContext } from "./__helpers";

const ctx = createTestContext();

describe("User Tests", () => {
  it("lets the user register with matching passwords", async () => {
    const userRegister = await ctx.client.request(`
      mutation {
        register(username:"ryan", password: "ryan", passwordVerify: "ryan"){
          username
        }
      }
    `);

    expect(userRegister).toMatchInlineSnapshot(`
      Object {
        "register": Object {
          "username": "ryan",
        },
      }
    `);
  });

  it("does not let a user register if their passwords don't match", async () => {
    const user = await ctx.client.request(`
      mutation {
        register(username: "ryan", password: "ryan", passwordVerify: "notRyan"){
          username
        }
      }
    `);

    expect(user).toMatchInlineSnapshot();
  });
});
