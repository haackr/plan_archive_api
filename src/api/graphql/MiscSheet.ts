import { extendType, objectType } from "nexus";
import { isLoggedIn } from "../auth";

export const MiscSheet = objectType({
  name: "MiscSheet",
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
    t.model.school_id();
    t.model.Schools();
  },
});

export const MiscSheetQuery = extendType({
  type: "Query",
  definition(t) {
    t.crud.miscSheet();
    t.crud.miscSheets();
  },
});

export const MiscSheetsMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.crud.createOneMiscSheet({ resolve: isLoggedIn });
    t.crud.deleteOneMiscSheet({ resolve: isLoggedIn });
    t.crud.updateOneMiscSheet({ resolve: isLoggedIn });
  },
});
