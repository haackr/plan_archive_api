import { extendType, objectType } from "nexus";
import { isLoggedIn } from "../auth";

export const MiscSheet = objectType({
  name: "MiscSheetsData",
  definition(t) {
    t.model.id();
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
