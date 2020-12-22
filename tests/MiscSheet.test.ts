import { gql } from "graphql-request";
import { createTestContext } from "./__helpers";

const ctx = createTestContext();

describe("MiscSheet Tests", () => {
  it("lets the user query sheets", async () => {
    const sheets = await ctx.client.request(gql`
      query {
        miscSheetsData {
          id
          Sheet_Number
          Title
          LocationNumber
          Day
          Month
          Year
          FilePathTIFF
          FilePathPNG
          FilePathPDF
          FilePathDWG
          school_id
          Schools {
            id
            SchoolID
            SchoolName
          }
        }
      }
    `);
    expect(sheets.miscSheetsData.length).toBeGreaterThan(0);
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
        createOneMiscSheetsData(
          data: {
            Title: "Test Title"
            Sheet_Number: "A-101"
            Schools: { connect: { SchoolID: "123" } }
          }
        ) {
          id
          Title
          Sheet_Number
          Schools {
            SchoolID
          }
        }
      }
    `);

    expect(newSheet.createOneMiscSheetsData.Title).toBe("Test Title");
    sheetId = newSheet.createOneMiscSheetsData.id;
  });

  it("lets the user modify a sheet if they are logged in", async () => {
    const sheet = await ctx.client.request(gql`
      mutation {
        updateOneMiscSheetsData(
          where: { id: ${sheetId} }
          data: { Title: {set: "Changed Title"} }
        ) {
          Title
        }
      }
    `);

    expect(sheet.updateOneMiscSheetsData.Title).toBe("Changed Title");
  });

  it("lets the user delete sheets if they are logged in", async () => {
    const deletedSheet = await ctx.client.request(gql`
      mutation {
        deleteOneMiscSheetsData(where: {
          id: ${sheetId}
        }) {
          id
          Title
        }
        } 
    `);

    expect(deletedSheet.deleteOneMiscSheetsData.id).toBe(sheetId);
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

    let res;
    try {
      res = await ctx.client.request(gql`
        mutation {
          createOneMiscSheetsData(
            data: {
              Title: "Test Title"
              Sheet_Number: "A-101"
              Schools: { connect: { SchoolID: "123" } }
            }
          ) {
            id
            Title
            Sheet_Number
            Schools {
              SchoolID
            }
          }
        }
      `);
    } catch (error) {
      res = error;
    }
    expect(res.response.errors[0].message).toContain("must be logged in");
    res = null;

    try {
      res = await ctx.client.request(gql`
        mutation {
          updateOneMiscSheetsData(
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
    expect(res.response.errors[0].message).toContain("must be logged in");
    res = null;

    try {
      res = await ctx.client.request(gql`
        mutation {
          deleteOneMiscSheetsData(where: { id: 1 }) {
            id
            Title
          }
        }
      `);
    } catch (error) {
      res = error;
    }
    expect(res.response.errors[0].message).toContain("must be logged in");
  });
});
