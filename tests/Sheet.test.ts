import { gql } from "graphql-request";
import { createTestContext } from "./__helpers";

const ctx = createTestContext();

describe("Sheet Tests", () => {
  it("lets the user query sheets", async () => {
    const sheets = await ctx.client.request(gql`
      query {
        sheetsData {
          id
          Title
          Sheet_Number
          set_id
          SetsData {
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
    expect(sheets.sheetsData.length).toBeGreaterThan(0);
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
        createOneSheetsData(
          data: {
            Title: "Test Title"
            Sheet_Number: "A-101"
            Schools: { connect: { SchoolID: "123" } }
            SetsData: { create: { Title: "Test Set", ID: "19900513-TEST-NEW" } }
          }
        ) {
          id
          Title
          Sheet_Number
          Schools {
            SchoolID
          }
          SetsData {
            Title
          }
        }
      }
    `);

    expect(newSheet.createOneSheetsData.Title).toBe("Test Title");
    sheetId = newSheet.createOneSheetsData.id;
  });

  it("lets the user modify a sheet if they are logged in", async () => {
    const sheet = await ctx.client.request(gql`
      mutation {
        updateOneSheetsData(
          where: { id: ${sheetId} }
          data: { Title: {set: "Changed Title"} }
        ) {
          Title
        }
      }
    `);

    expect(sheet.updateOneSheetsData.Title).toBe("Changed Title");
  });

  it("lets the user delete sheets if they are logged in", async () => {
    const deletedSheet = await ctx.client.request(gql`
      mutation {
        deleteOneSheetsData(where: {
          id: ${sheetId}
        }) {
          id
          Title
        }
        } 
    `);

    expect(deletedSheet.deleteOneSheetsData.id).toBe(sheetId);
    const sheetInDb = await ctx.db.sheetsData.findUnique({
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
          createOneSheetsData(
            data: {
              Title: "Test Title"
              Sheet_Number: "A-101"
              Schools: { connect: { SchoolID: "123" } }
              SetsData: {
                create: { Title: "Test Set", ID: "19900513-TEST-NEW" }
              }
            }
          ) {
            id
            Title
            Sheet_Number
            Schools {
              SchoolID
            }
            SetsData {
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
          updateOneSheetsData(
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
          deleteOneSheetsData(where: { id: 1 }) {
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
          createOneSheetsData(
            data: {
              Title: "Test Title"
              Sheet_Number: "A-101"
              Schools: { connect: { SchoolID: "123" } }
              SetsData: {
                create: { Title: "Test Set", ID: "19900513-TEST-NEW" }
              }
            }
          ) {
            id
            Title
            Sheet_Number
            Schools {
              SchoolID
            }
            SetsData {
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
          updateOneSheetsData(
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
          deleteOneSheetsData(where: { id: 1 }) {
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
