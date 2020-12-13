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
    let res;
    try {
      const user = await ctx.client.request(`
        mutation {
          register(username:"test", password: "test", passwordVerify: "not test"){
            username
          }
        }
      `);
      res = user;
    } catch (error) {
      res = error;
    }

    expect(res).toMatchInlineSnapshot(
      `[Error: Passwords do not match!: {"response":{"errors":[{"message":"Passwords do not match!","locations":[{"line":3,"column":11}],"path":["register"],"extensions":{"code":"INTERNAL_SERVER_ERROR"}}],"data":{"register":null},"status":200},"request":{"query":"\\n        mutation {\\n          register(username:\\"test\\", password: \\"test\\", passwordVerify: \\"not test\\"){\\n            username\\n          }\\n        }\\n      "}}]`
    );
  });

  it("does not let a user register if the user already exists", async () => {
    let res;
    try {
      const user = await ctx.client.request(`
        mutation {
          register(username:"ryan", password: "ryan", passwordVerify: "ryan"){
            username
          }
        }
      `);
      res = user;
    } catch (error) {
      res = error;
    }
    expect(res).toMatchInlineSnapshot(
      `[Error: User with that username already exists!: {"response":{"errors":[{"message":"User with that username already exists!","locations":[{"line":3,"column":11}],"path":["register"],"extensions":{"code":"INTERNAL_SERVER_ERROR"}}],"data":{"register":null},"status":200},"request":{"query":"\\n        mutation {\\n          register(username:\\"ryan\\", password: \\"ryan\\", passwordVerify: \\"ryan\\"){\\n            username\\n          }\\n        }\\n      "}}]`
    );
  });

  it("lets the user login", async () => {
    const user = await ctx.client.request(`
        mutation {
          login(username: "ryan", password: "ryan"){
            username
          }
        }
    `);
    expect(user).toMatchInlineSnapshot(`
      Object {
        "login": Object {
          "username": "ryan",
        },
      }
    `);
  });

  it("does not let the uer login if the uesr does not exist", async () => {
    let res;
    try {
      const user = await ctx.client.request(`
        mutation{
          login(username: "nope", password: "notexist"){
            username
          }
        }
      `);
      res = user;
    } catch (error) {
      res = error;
    }
    expect(res).toMatchInlineSnapshot(
      `[Error: Username or password incorrect.: {"response":{"errors":[{"message":"Username or password incorrect.","locations":[{"line":3,"column":11}],"path":["login"],"extensions":{"code":"INTERNAL_SERVER_ERROR"}}],"data":{"login":null},"status":200},"request":{"query":"\\n        mutation{\\n          login(username: \\"nope\\", password: \\"notexist\\"){\\n            username\\n          }\\n        }\\n      "}}]`
    );
  });

  it("does not let the user login if their password is wrong", async () => {
    let res;
    try {
      const user = await ctx.client.request(`
        mutation{
          login(username: "ryan", password: "badpass"){
            username
          }
        }
      `);
      res = user;
    } catch (error) {
      res = error;
    }
    expect(res).toMatchInlineSnapshot(
      `[Error: Username or password incorrect: {"response":{"errors":[{"message":"Username or password incorrect","locations":[{"line":3,"column":11}],"path":["login"],"extensions":{"code":"INTERNAL_SERVER_ERROR"}}],"data":{"login":null},"status":200},"request":{"query":"\\n        mutation{\\n          login(username: \\"ryan\\", password: \\"badpass\\"){\\n            username\\n          }\\n        }\\n      "}}]`
    );
  });
});
