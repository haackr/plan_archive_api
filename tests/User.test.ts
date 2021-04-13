import { gql } from "graphql-request";
import { createTestContext } from "./__helpers";

const ctx = createTestContext();

describe("User Tests", () => {
  it("does not let the user query allUsers if they are not logged in", async () => {
    let res;
    try {
      const user = await ctx.client.request(gql`
        query {
          users {
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
    const userRegister = await ctx.client.request(gql`
      mutation {
        register(username: "ryan", password: "ryan", passwordVerify: "ryan") {
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
      const user = await ctx.client.request(gql`
        mutation {
          register(
            username: "test"
            password: "test"
            passwordVerify: "not test"
          ) {
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
      const user = await ctx.client.request(gql`
        mutation {
          register(username: "ryan", password: "ryan", passwordVerify: "ryan") {
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
    const user = await ctx.client.request(gql`
      mutation {
        login(username: "user", password: "user") {
          username
        }
      }
    `);
    expect(user).toMatchInlineSnapshot(`
      Object {
        "login": Object {
          "username": "user",
        },
      }
    `);
  });

  it("lets the user query allUsers if they are logged in", async () => {
    let res;
    try {
      const user = await ctx.client.request(gql`
        query {
          users {
            username
          }
        }
      `);
      res = user;
    } catch (error) {
      res = error;
    }

    expect(res.users.length).toBeGreaterThan(0);
    expect(res.users).toContainEqual({
      username: "ryan",
    });
  });

  it("does not let the user query isAdmin if they are logged in but not an admin", async () => {
    let res;
    try {
      const user = await ctx.client.request(gql`
        query {
          users {
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
      const user = await ctx.client.request(gql`
        mutation {
          login(username: "nope", password: "notexist") {
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
      const user = await ctx.client.request(gql`
        mutation {
          login(username: "ryan", password: "badpass") {
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
    const user = await ctx.client.request(gql`
      mutation {
        login(username: "admin", password: "admin") {
          username
        }
      }
    `);
    const users = await ctx.client.request(gql`
      query {
        users {
          username
          isAdmin
        }
      }
    `);
    expect(users.users.length).toBeGreaterThan(0);
    expect(users.users).toContainEqual({
      username: "ryan",
      isAdmin: false,
    });
  });

  it("lets the user logout", async () => {
    await ctx.client.request(gql`
      mutation {
        logout {
          username
        }
      }
    `);
    let res;
    try {
      const user = await ctx.client.request(gql`
        query {
          users {
            username
          }
        }
      `);
      res = user;
    } catch (error) {
      res = error;
    }
    // console.log(res);
    expect(res.response.errors[0].message).toContain("must be logged in");
  });
});
