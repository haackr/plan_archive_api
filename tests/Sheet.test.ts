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
            SchoolID
            SchoolName
          }
        }
      }
    `);
    expect(sheets.sheetsData.length).toBeGreaterThan(0);
  });
});
