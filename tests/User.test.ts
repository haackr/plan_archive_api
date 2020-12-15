import { createTestContext } from "./__helpers";

const ctx = createTestContext();

describe("User Tests", () => {
  it("does not let the user query allUsers if they are not logged in", async () => {
    let res;
    try {
      const user = await ctx.client.request(`
        query {
          allUsers {
            username
          }
        }
      `);
      res = user;
    } catch (error) {
      res = error;
    }

    expect(res.response.errors[0].message).toContain(
      "You must be logged in to do that"
    );
  });

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

    const userInDb = await ctx.db.user.findMany({
      where: { username: "ryan" },
    });

    expect(userInDb[0].username).toEqual("ryan");
    expect(userInDb.length).toEqual(1);
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

    expect(res.response.errors[0].message).toContain("Passwords do not match");

    const userInDb = await ctx.db.user.findMany({
      where: { username: "test" },
    });
    expect(userInDb.length).toEqual(0);
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
    expect(res.response.errors[0].message).toContain(
      `User with that username already exists!`
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

  it("lets the user query allUsers if they are logged in", async () => {
    let res;
    try {
      const user = await ctx.client.request(`
        query {
          allUsers {
            username
          }
        }
      `);
      res = user;
    } catch (error) {
      res = error;
    }

    expect(res).toMatchInlineSnapshot(`
      Object {
        "allUsers": Array [
          Object {
            "username": "admin",
          },
          Object {
            "username": "ryan",
          },
          Object {
            "username": "user",
          },
        ],
      }
    `);
  });

  it("does not let the user query isAdmin if they are logged in but not an admin", async () => {
    let res;
    try {
      const user = await ctx.client.request(`
        query {
          allUsers {
            username
            isAdmin
          }
        }
      `);
      res = user;
    } catch (error) {
      res = error;
    }
    expect(res.response.errors[0].message).toContain(
      "You must be an admin to do that!"
    );
  });

  it("does not let the uer login if the user does not exist", async () => {
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
    expect(res.response.errors[0].message).toContain(
      "Username or password incorrect"
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
    expect(res.response.errors[0].message).toContain(
      "Username or password incorrect"
    );
  });

  it("lets the user query isAdmin if logged in as admin", async () => {
    const user = await ctx.client.request(`
        mutation{
          login(username: "admin", password: "admin"){
            username
          }
        }
      `);
    const users = await ctx.client.request(`
      query {
        allUsers {
          username
          isAdmin
        }
      }
    `);

    expect(users).toMatchInlineSnapshot(`
      Object {
        "allUsers": Array [
          Object {
            "isAdmin": true,
            "username": "admin",
          },
          Object {
            "isAdmin": false,
            "username": "ryan",
          },
          Object {
            "isAdmin": false,
            "username": "user",
          },
        ],
      }
    `);
  });

  it("lets the user logout", async () => {
    await ctx.client.request(`
      mutation {
        logout {
          username
        }
      }
    `);
    let res;
    try {
      const user = await ctx.client.request(`
        query {
          allUsers {
            username
          }
        }
      `);
      res = user;
    } catch (error) {
      res = error;
    }

    expect(res.response.errors[0].message).toContain("must be logged in");
  });
});
