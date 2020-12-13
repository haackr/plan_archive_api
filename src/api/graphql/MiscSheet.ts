import { extendType, objectType } from "@nexus/schema";
import { isLoggedIn } from "../auth";

export const MiscSheet = objectType({
  name: "MiscSheetsData",
  definition(t) {
    t.model.Key();
    t.model.Sheet_Number();
    t.model.Title();
    t.model.LocationNumber();
    t.model.Day();
    t.model.Month();
    t.model.Year();
    t.model.FilePathTIFF();
    t.model.FilePathPNG();
    t.model.FilePathPDF();
    t.model.FilePathDWG();
  },
});

export const MiscSheetQuery = extendType({
  type: "Query",
  definition(t) {
    t.crud.miscSheetsData();
  },
});

export const MiscSheetsMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.crud.createOneMiscSheetsData({ resolve: isLoggedIn });
    t.crud.deleteOneMiscSheetsData({ resolve: isLoggedIn });
    t.crud.updateOneMiscSheetsData({ resolve: isLoggedIn });
  },
});
