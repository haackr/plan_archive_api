import { gql } from "graphql-request";
import { createTestContext } from "./__helpers";

const ctx = createTestContext();

describe("Sheet Tests", () => {
  it("lets the user query sheets", async () => {
    const sheets = await ctx.client.request(gql`
      query {
        sheets {
          id
          Title
          Sheet_Number
          set_id
          Sets {
            ID
            Key
            Title
          }
          school_id
          Schools {
            id
            SchoolID
            SchoolName
          }
        }
      }
    `);
    expect(sheets.sheets.length).toBeGreaterThan(0);
  });

  let sheetId: number;

  it("lets the user add a sheet if they are logged in", async () => {
    await ctx.client.request(gql`
      mutation {
        login(username: "user", password: "user") {
          username
        }
      }
    `);

    const newSheet = await ctx.client.request(gql`
      mutation {
        createOneSheet(
          data: {
            Title: "Test Title"
            Sheet_Number: "A-101"
            Schools: { connect: { SchoolID: "123" } }
            Sets: { create: { Title: "Test Set", ID: "19900513-TEST-NEW" } }
          }
        ) {
          id
          Title
          Sheet_Number
          Schools {
            SchoolID
          }
          Sets {
            Title
          }
        }
      }
    `);

    expect(newSheet.createOneSheet.Title).toBe("Test Title");
    sheetId = newSheet.createOneSheet.id;
  });

  it("lets the user modify a sheet if they are logged in", async () => {
    const sheet = await ctx.client.request(gql`
      mutation {
        updateOneSheet(
          where: { id: ${sheetId} }
          data: { Title: {set: "Changed Title"} }
        ) {
          Title
        }
      }
    `);

    expect(sheet.updateOneSheet.Title).toBe("Changed Title");
  });

  it("lets the user delete sheets if they are logged in", async () => {
    const deletedSheet = await ctx.client.request(gql`
      mutation {
        deleteOneSheet(where: {
          id: ${sheetId}
        }) {
          id
          Title
        }
        } 
    `);

    expect(deletedSheet.deleteOneSheet.id).toBe(sheetId);
    const sheetInDb = await ctx.db.sheet.findUnique({
      where: { id: sheetId },
    });
    expect(sheetInDb).toBeNull();
  });

  it("does not let the user do cud operations if they are not logged in", async () => {
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
          createOneSheet(
            data: {
              Title: "Test Title"
              Sheet_Number: "A-101"
              Schools: { connect: { SchoolID: "123" } }
              Sets: { create: { Title: "Test Set", ID: "19900513-TEST-NEW" } }
            }
          ) {
            id
            Title
            Sheet_Number
            Schools {
              SchoolID
            }
            Sets {
              Title
            }
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
          updateOneSheet(
            where: { id: 1 }
            data: { Title: { set: "Changed Title" } }
          ) {
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
          deleteOneSheet(where: { id: 1 }) {
            id
            Title
          }
        }
      `);
    } catch (error) {
      res = error;
    }
    expect(res.response.errors[0].message).toContain(errMessage);
  });

  it("does not let the user do cud operations if they are not confirmed", async () => {
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
          createOneSheet(
            data: {
              Title: "Test Title"
              Sheet_Number: "A-101"
              Schools: { connect: { SchoolID: "123" } }
              Sets: { create: { Title: "Test Set", ID: "19900513-TEST-NEW" } }
            }
          ) {
            id
            Title
            Sheet_Number
            Schools {
              SchoolID
            }
            Sets {
              Title
            }
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
          updateOneSheet(
            where: { id: 1 }
            data: { Title: { set: "Changed Title" } }
          ) {
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
          deleteOneSheet(where: { id: 1 }) {
            id
            Title
          }
        }
      `);
    } catch (error) {
      res = error;
    }
    expect(res.response.errors[0].message).toContain(errMessage);
  });
});
